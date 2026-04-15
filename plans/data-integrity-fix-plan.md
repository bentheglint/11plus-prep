# Implementation Plan: Fix data-integrity bugs on master

**Branch:** master
**Context:** Production 11+ exam prep app used by a 9-year-old (Evie). Five related data-integrity bugs discovered via direct D1 queries of Evie's child data (`child_id 0aa8fb45-b9a7-40d7-8df2-b739546aeffa`). Evie has 47 `quiz_results` rows across 15 days but only 258 `question_results` rows (expected ~470), three duplicate `quiz_results` rows, and her Progress Tracker UI shows 1-10 Qs/day instead of her actual 30+.

---

## The five bugs (evidence-confirmed)

### C — UUID-race in flushQueue
- `src/hooks/useD1Data.js` — concurrent `enqueue()` calls during quiz completion each trigger `flushQueue()` immediately without waiting for prior.
- N parallel `POST /api/data/batch` requests, each SELECT on `processed_operations` sees nothing, all INSERT the same UUIDs, losers hit `UNIQUE constraint failed: processed_operations.operation_uuid`.
- `db.batch()` is atomic → losing request rolls back entirely → per-question rows lost even when quiz summary lands.
- Fixed on `gamification` branch (commit `1daf33c` mutex-guard) but NOT on master.
- Evidence: ~45% of Evie's per-question rows missing (258 vs ~470 expected).

### E — Duplicate quiz_results rows
- `src/App.js` `handleNextQuestion` is async with no re-entry guard.
- Evidence: rows 69+70 both "Ratio & Proportion", identical session_id 1776180618484, identical completed_at 2026-04-14 15:46:51. Rows 72+73 similar for Spelling. Older null-session_id duplicate for Synonyms (2026-03-25).
- Introduced on or after commit `414d2ff` (Quiz Detail View — lifted startBatch/endBatch into handleNextQuestion).

### B — Topic-key casing mismatch
- `quiz_results.topic_key` stores DISPLAY names ("Ratio & Proportion", "Long Multiplication", "Daily Learning").
- `question_results.topic_key` stores SLUGS (`ratio`, `longmultiplication`, `wordClassGrammar`).
- Tables cannot cross-reference.
- Source: `src/App.js:580` — `topicLabel = quizMode === 'daily' ? 'Daily Learning' : quizQuestions[0].topicName` should use `.topicKey`.
- UI consequence: Recent Activity shows display names via `quizHistory.topic` which came from `quiz_results` as-is.

### D — practice_sessions overwrite
- Schema: `UNIQUE(child_id, session_date)`. Worker SQL: `ON CONFLICT DO UPDATE SET data = excluded.data`.
- Every same-day quiz overwrites prior row. Row only holds the LAST quiz's data.
- Evidence: Evie's practice_sessions show one row per day with `questionsAttempted: 10` even on days she completed 3+ quizzes.
- PracticeCalendar reads this → shows 1-10 Qs/day always.

### A3 — Historical practice_sessions backfill
- No per-question detail exists for quizzes before 8 Apr 2026 (lost to Bug C).
- Ben's choice: restore practice_sessions day totals only. Do NOT synthesise fake question_results.

---

## Plan

### Fix C — Port mutex guard manually

**Approach:** Do NOT cherry-pick the gamification commit. It is entangled with Phase 1 Economy changes (`rareCurrencyData`, `featureUnlocks`, `useEconomy` integration) that must not land on master. Re-apply the pattern directly.

**`src/hooks/useD1Data.js` changes:**
- Add module-level `flushState = new Map()` keyed by `userName`, plus `getFlushState(userName)` and `_resetFlushStateForTests(userName)` exports.
- Guard entry to `flushQueue`: if `state.flushing` is true, set `state.pending = true` and return.
- Wrap body: `state.flushing = true; try { ...existing body... } finally { state.flushing = false; }`.
- Exit drain: if `state.pending || !queue.isEmpty()` then `setTimeout(() => flushQueue(), 100)`. Clear `state.pending` before scheduling.
- Change `flushQueue` deps to `[getToken, userName]`. Bail early if `!userName`.
- Add `resetToFreshUser()` useCallback that synchronously resets master's state shape only. Call at the top of the load effect when `prevUser.current && prevUser.current !== userName`. Master state to reset: `quizHistory`, `topicPerformance`, `seenQuestions`, `mockTestHistory`, `lessonHistory`, `questionResults`, `practiceLog`, `streakData`, `prepPointsData`, `achievements`, `seenTips`, `lastSessionDate`, `leitnerQueue`, `loaded=false`, `versionsRef.current`. Do NOT reset `rareCurrencyData`/`featureUnlocks` (not present on master).

**`src/App.js` changes:**
- Handle `authUser === null` to clear `currentUser` and `localStorage.removeItem('current-user')` on explicit logout.

**Tests (port from gamification branch, adapt):**
- `src/__tests__/logic/flushMutex.test.js` — 6 cases of the state machine contract (identity semantics, independence across users, default state, remount persistence, 10-concurrent-callers maxInFlight=1, reset helper). Pure port.
- `src/__tests__/integration/flushQueueIntegration.test.js` — 2 cases (mutex behaviour under real hook via renderHook + mocked fetch; child-switch wipes prior state). Adapt fetch mocks to drop `rareCurrency`/`featureUnlocks` fields that master's Worker response does not include.

**Acceptance:**
- Fire 10 rapid `enqueue()` calls → at most 1 `POST /api/data/batch` in flight at any moment; all 10 ops reach the server across the in-flight flush + pending re-drain.
- Switching Clerk user between Ben and Evie does not leak previous child's quizHistory/streak/etc. into the new user's first render frame.

---

### Fix E — Re-entry guard on handleNextQuestion

**Approach:** useRef-based guard at the start of the quiz-complete branch.

**`src/App.js` changes:**
- Add `const isSubmittingRef = useRef(false)` at component level.
- In `handleNextQuestion`, at line 573 (top of the quiz-complete branch):
  ```js
  if (isSubmittingRef.current) return;
  isSubmittingRef.current = true;
  try {
    // existing code: markQuestionsAsSeen, updateTopicPerformance,
    // startBatch, recordQuizResults, saveQuizResult,
    // saveLastSessionDate, await endBatch, setCurrentView
  } finally {
    isSubmittingRef.current = false;
  }
  ```
- Consider adding a visible disabled state on the submit button for UX — the ref alone is sufficient for correctness but the child should see that their click was accepted.

**Tests:**
- `src/__tests__/integration/quizCompletion.test.js` — render quiz at the last question with a mocked `userData`, fire the finish handler twice rapidly, assert `saveQuizResult` / `enqueue('quiz-result', ...)` is called exactly once.

**Acceptance:**
- Two rapid invocations of `handleNextQuestion` on the last question produce exactly one row in `quiz_results`.

---

### Fix B — Topic-key casing

**Write path fix (`src/App.js:580`):**
- Change `const topicLabel = quizMode === 'daily' ? 'Daily Learning' : quizQuestions[0].topicName`
- To `const topicLabel = quizMode === 'daily' ? 'daily-learning' : quizQuestions[0].topicKey`

**UI display fix (`src/screens/ChildProgressView.js` Recent Activity):**
- Line 160: replace `{quiz.topic}` with `{topicNames[quiz.topic] || quiz.topic}`.
- `topicNames` is already exported from `src/components/RecommendationCard.js`. Add `'daily-learning': 'Daily Learning'` to that map.

**Data migration (one-time remote SQL):**
- First, enumerate all existing display-name values:
  ```sql
  SELECT DISTINCT topic_key FROM quiz_results ORDER BY topic_key;
  ```
- Build a complete CASE-WHEN mapping. Known values (from Evie's data):
  - `"Ratio & Proportion"` → `ratio`
  - `"Long Multiplication"` → `longmultiplication`
  - `"Long Division"` → `longdivision`
  - `"Prime Numbers & Factors"` → `primenumbersfactors`
  - `"Place Value and Rounding"` → `placevalue`
  - `"Area and Perimeter"` → `areaperimeter`
  - `"Angles and Shapes"` → `anglesshapes`
  - `"Negative Numbers"` → `negativenumbers`
  - `"Speed, Distance, Time"` → `speeddistancetime`
  - `"Data Handling"` → `datahandling`
  - `"Daily Learning"` → `daily-learning`
  - `"Odd Two Out"` → `oddTwoOut`
  - `"Hidden Words"` → `hiddenWords`
  - `"Missing Letters & Words"` → `missingLettersWords`
  - `"Letter Sums & Missing Numbers"` → `letterSums`
  - `"Logic & Language Puzzles"` → `logicAndLanguage`
  - `"Shared Letter"` → `sharedLetter`
  - `"Verbal Analogies"` → `verbalAnalogies`
  - `"Word Patterns & Codes"` → `wordCodeAnalogies`
  - `"Compound Words"` → `compoundWords`
  - `"Letter Move"` → `letterMove`
  - `"Letter Codes"` → `letterCodes`
  - `"Letter Pair Series"` / `"Letter Pairs"` → `letterPairSeries`
  - `"Number Series"` → `numberSeries`
  - `"Number Word Codes"` → `numberWordCodes`
  - `"Word Codes"` → `wordCodeAnalogies`
  - `"Word Class"` → `wordClassGrammar`
  - Single-word titles ("Synonyms", "Antonyms", "Grammar", "Vocabulary", "Percentages", etc.) → lowercase
- If `SELECT DISTINCT` returns any unmapped value → ABORT, update mapping, rerun.
- Run the `UPDATE quiz_results SET topic_key = CASE ... END` atomically.

**Acceptance:**
- After migration, every `quiz_results.topic_key` is either (a) a slug present in `SUBJECT_TOPICS` from `useMastery.js`, or (b) `'daily-learning'`.
- Recent Activity still shows display names ("Ratio & Proportion") to the child.
- New quizzes write slugs.

---

### Fix D — practice_sessions daily aggregation

**Worker change (`workers/ai-tutor/routes/batch.js` `buildAppendStatement` `'practice-session'` case):**

Change from:
```sql
INSERT INTO practice_sessions (child_id, session_date, data) VALUES (?, ?, ?)
ON CONFLICT(child_id, session_date) DO UPDATE SET data = excluded.data, created_at = datetime('now')
```

To a merge that accumulates daily totals:
```sql
INSERT INTO practice_sessions (child_id, session_date, data) VALUES (?, ?, ?)
ON CONFLICT(child_id, session_date) DO UPDATE SET
  data = json_set(
    data,
    '$.questionsAttempted', COALESCE(CAST(json_extract(data, '$.questionsAttempted') AS INTEGER), 0) + ?,
    '$.questionsCorrect',   COALESCE(CAST(json_extract(data, '$.questionsCorrect') AS INTEGER), 0) + ?,
    '$.lastUpdated',        datetime('now')
  ),
  created_at = created_at
```

Bind two extra delta params (`questionsAttempted` and `questionsCorrect` from the incoming payload). The INSERT branch writes the first row of the day as-is; the UPDATE branch adds to it.

**Code adjustment:** Update `buildAppendStatement` signature/bindings for practice-session, and confirm the helper receives `payload.data.questionsAttempted` and `payload.data.questionsCorrect` to bind as the deltas.

**Acceptance:**
- After this change, Evie's 14 Apr practice_sessions.data.questionsAttempted = 50 (5 quizzes × 10 Qs), not 10.
- Multiple same-day quizzes accumulate; no existing rows are overwritten or lost.
- PracticeCalendar shows intensity tier 3 (>25 Qs) on busy days.

---

### Fix A3 — Backfill historical practice_sessions

**One-time remote SQL (run AFTER the D Worker change is deployed, so new writes can't race the backfill):**

```sql
-- Rebuild practice_sessions day totals from quiz_results
INSERT INTO practice_sessions (child_id, session_date, data)
SELECT
  child_id,
  DATE(completed_at) AS day,
  json_object(
    'date',              DATE(completed_at),
    'questionsAttempted', SUM(total),
    'questionsCorrect',   SUM(score),
    'mode',              'aggregate',
    'backfilled',         1
  )
FROM quiz_results
GROUP BY child_id, DATE(completed_at)
ON CONFLICT(child_id, session_date) DO UPDATE SET
  data = json_set(
    data,
    '$.questionsAttempted', (
      SELECT SUM(total) FROM quiz_results
      WHERE child_id = practice_sessions.child_id
        AND DATE(completed_at) = practice_sessions.session_date
    ),
    '$.questionsCorrect', (
      SELECT SUM(score) FROM quiz_results
      WHERE child_id = practice_sessions.child_id
        AND DATE(completed_at) = practice_sessions.session_date
    ),
    '$.backfilled', 1
  );
```

**Acceptance:**
- Every (child_id, day) that has `quiz_results` rows has a matching `practice_sessions` row whose data.questionsAttempted equals SUM(quiz_results.total) for that day.
- PracticeCalendar for Evie shows accurate intensity across her full history (24 Mar – 14 Apr).

---

## Deploy ordering

1. **Local.** Implement all changes. Full test suite green. Type-check green.
2. **Validate B mapping.** Run `SELECT DISTINCT topic_key FROM quiz_results` against prod D1. Confirm every returned value has a case in the migration. If any unmapped → update mapping.
3. **Deploy Worker** (has Fix D SQL change). Frontend still running old mutex-less code at this point — safe because the D change is a strictly better ON CONFLICT.
4. **Deploy frontend** (Fixes C, E, B UI). Fresh page loads pick up the new code. In-flight sessions may finish on old code; acceptable because the Worker is already accumulating practice_sessions correctly.
5. **Run Fix B migration SQL** on prod D1. One atomic UPDATE.
6. **Run Fix A3 backfill SQL** on prod D1.
7. **Verify** Evie's data via the live app: Progress Tracker shows true daily totals, Recent Activity shows display names correctly, topic tiles show mastery for all attempted topics, no duplicate Recent Activity entries on fresh quiz completions.

---

## What this plan explicitly does NOT do

- Does not backfill `question_results` with synthesised rows (Ben's choice — A option 3). Drill-down / Mistakes Review stays honest about what real per-question data exists.
- Does not dedupe the 3 historical duplicate `quiz_results` rows. Tiny cosmetic impact; Fix E stops future duplicates. Could be a separate cleanup.
- Does not deploy the unrelated First Steps fix commit `a77d8bd` — handle separately.
- Does not touch `gamification` branch at all.
- Does not change schemas, only Worker SQL statements and data.

---

---

## Codex adversarial review findings (3 additions to plan)

After Codex review, three BLOCKER findings were accepted and added to the scope. The root issue: the original plan trusted the client for correctness guarantees that only the server can durably enforce.

### Fix C-Worker — Graceful UUID conflict handling (server-side)

**Problem:** Client mutex only serialises one tab. Stale bundles, second devices, retries, or future code paths can still send concurrent batches with overlapping UUIDs. The server's current atomic batch rolls back entirely on UNIQUE constraint failure → data still lost.

**Approach:** Change `workers/ai-tutor/routes/batch.js` so UUID conflicts are graceful, not fatal:
- Use `INSERT OR IGNORE` on `processed_operations` markers.
- After batch execution, check which markers actually inserted (D1 `meta.changes` or per-statement results).
- Operations whose marker already existed → report as `"status": "duplicate"` (not `"error"`).
- Operations whose marker inserted cleanly → reported as `"status": "ok"`.
- Losing request's data INSERTs in the same batch must not be written if the marker already existed. This means splitting each operation's (data-insert + marker-insert) pair into its own atomic unit rather than one giant batch. Options:
  - (a) Run each operation as its own `db.batch([dataStmt, markerStmt])` — N tiny atomic units instead of one big one.
  - (b) Check marker existence first (SELECT), then only include new operations in the batch. Requires a second round-trip but cleaner.

Leaning toward (a) — one D1 roundtrip per operation is fine at our scale and the atomicity is per-operation, not global.

**Tests:** Add `workers/ai-tutor/routes/batch.test.js` or extend existing. Cases: two concurrent POSTs with overlapping UUIDs → both responses indicate correct `ok`/`duplicate` status, data for the winning request lands, data for the loser does not.

**Acceptance:** A simulated concurrent race (same UUID, two requests) produces exactly one row in target tables, both clients receive a success-shaped response, nothing rolled back.

---

### State-reset — Full App-local state reset on user switch or logout

**Problem:** `useD1Data` hook state was in the original plan, but `App.js` component state (`currentView`, `selectedSubject`, `selectedTopic`, `drillDownTopic`, `selectedQuiz`, `quizQuestions`, `answers`, `currentQuestionIndex`, mid-quiz refs, chat/feedback state) is independent. A user switch while on Quiz Detail / Results / mid-quiz can flash the previous child's content. Also, `useD1Data`'s load effect has `if (!userName) return;` so logout never actually resets the hook.

**Approach:**

**`src/hooks/useD1Data.js`:**
- Change the load effect: when `prevUser.current && !userName`, call `resetToFreshUser()` synchronously before returning. Do not skip the reset on logout.
- Keep the existing path for `prevUser.current !== userName` (user switch).

**`src/App.js`:**
- Add a new `useEffect` keyed on `currentUser`:
  ```js
  const prevCurrentUser = useRef(currentUser);
  useEffect(() => {
    if (prevCurrentUser.current !== currentUser) {
      // Reset all UI/navigation state so no previous child's data leaks
      setCurrentView('home');
      setSelectedSubject(null);
      setSelectedTopic(null);
      setDrillDownTopic(null);
      setSelectedQuiz(null);
      setQuizQuestions([]);
      setAnswers([]);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setSelectedPair([]);
      setShowFeedback(false);
      setChatMessages([]);
      setShowTutorChat(false);
      setShowFeedbackForm(false);
      setFeedbackText('');
      setQuizMode(null);
      setSavedTimerSecs(0);
      setPreQuizTip(null);
      setShowPreQuizTip(false);
      setPostQuestionTip(null);
      // Refs
      quizSessionId.current = null;
      questionStartTime.current = null;
      pausedTimeMs.current = 0;
      pauseStartTime.current = null;
      wrongAnswerCount.current = 0;
      isSubmittingRef.current = false;
      prevCurrentUser.current = currentUser;
    }
  }, [currentUser]);
  ```
- The exact list of state to reset must be validated against the full state declarations in App.js; anything showing child-specific content must be reset.

**Tests:** Integration test via renderHook / RTL: render App with Ben as current user, navigate to Quiz Detail, switch `currentUser` to Evie, assert rendered screen returns to Home and no Ben-specific data remains in DOM.

**Acceptance:**
- Switching accounts from any screen — home, quiz, results, quiz detail, progress, parent dashboard — always lands the new user on Home with a clean slate.
- Logout clears both `useD1Data` state and `App.js` state; no previous child's data visible anywhere.

---

### Fix B-Worker — Server-side topic-key normalisation

**Problem:** Even after the migration, a stale client (open tab, cached bundle, PWA) can POST a display-name `topicKey` and the Worker will store it as-is, silently reintroducing the mismatch.

**Approach:** In `workers/ai-tutor/routes/batch.js`, add a normalisation step at the top of both `'quiz-result'` and `'question-result'` cases. Map known display names to slugs; unknown values pass through unchanged (so future topics don't break).

```js
const TOPIC_NAME_TO_SLUG = {
  'Ratio & Proportion': 'ratio',
  'Long Multiplication': 'longmultiplication',
  'Long Division': 'longdivision',
  'Prime Numbers & Factors': 'primenumbersfactors',
  'Place Value and Rounding': 'placevalue',
  'Area and Perimeter': 'areaperimeter',
  'Angles and Shapes': 'anglesshapes',
  'Negative Numbers': 'negativenumbers',
  'Speed, Distance, Time': 'speeddistancetime',
  'Data Handling': 'datahandling',
  'Daily Learning': 'daily-learning',
  'Odd Two Out': 'oddTwoOut',
  'Hidden Words': 'hiddenWords',
  'Missing Letters & Words': 'missingLettersWords',
  'Missing Letters': 'missingLettersWords',
  'Letter Sums & Missing Numbers': 'letterSums',
  'Letter Sums': 'letterSums',
  'Logic & Language Puzzles': 'logicAndLanguage',
  'Logic & Language': 'logicAndLanguage',
  'Shared Letter': 'sharedLetter',
  'Verbal Analogies': 'verbalAnalogies',
  'Word Patterns & Codes': 'wordCodeAnalogies',
  'Word Codes': 'wordCodeAnalogies',
  'Compound Words': 'compoundWords',
  'Letter Move': 'letterMove',
  'Letter Codes': 'letterCodes',
  'Letter Pair Series': 'letterPairSeries',
  'Letter Pairs': 'letterPairSeries',
  'Number Series': 'numberSeries',
  'Number Word Codes': 'numberWordCodes',
  'Word Class': 'wordClassGrammar',
};

function normaliseTopicKey(key) {
  if (!key) return key;
  return TOPIC_NAME_TO_SLUG[key] || key;
}
```

Apply before binding: use `normaliseTopicKey(topicKey)` in both handlers.

**Tests:** Extend Worker tests — post a `quiz-result` with `topicKey: "Ratio & Proportion"`, assert stored value is `ratio`.

**Acceptance:** Old client sending `"Ratio & Proportion"` after migration produces a `quiz_results.topic_key = "ratio"` row. Migration's durability guarantee is permanent.

---

## Open questions for Codex adversarial review

1. **Mutex port completeness.** Master carries `sessionId` and `selectedAnswer` fields in `saveQuizResult` / `saveQuestionResult` that the gamification version stripped. Am I missing anything master-specific that must be included in `resetToFreshUser`? Any subtle interaction with the Quiz Detail feature (commit `414d2ff`)?

2. **Re-entry guard sufficiency.** `handleNextQuestion` is async, not a useEffect — React StrictMode does not double-invoke async event handlers. Is the real cause of duplicate rows actually something else (an effect we have not identified)? Is `useRef` sufficient or do we also need setState-based button disabling for UX? Could there be a render path where `handleNextQuestion` is wired to multiple event sources?

3. **Topic-key migration blast radius.** Does any other code read `quiz_results.topic_key` expecting display names? Scripts, tests, analytics, email digest Worker, any admin tool?

4. **D1 SQLite compatibility.** Does Cloudflare D1 support `json_set`, `json_extract`, `json_object`, and the `->>'$...'` operator? Any edge cases where `CAST(... AS INTEGER)` silently returns 0 that would silently corrupt the aggregate? Is `COALESCE` the right guard?

5. **Deploy ordering gaps.** Is there any intermediate state (between step 3 and step 5) where Evie's live app could crash, show a wrong child's data, or display misleading progress?

6. **Simpler alternatives for D.** Option A (this plan): keep `UNIQUE(child_id, session_date)`, merge via `json_set`. Option B: drop the unique constraint, keep one row per quiz session, aggregate at query time in `transformServerData`. Which is the more robust design for a children's app where the data will only grow?

7. **Child-safety.** Anything in this plan that could display the wrong child's data during a migration or deploy window?

8. **A3 backfill correctness.** If the backfill runs AFTER Fix D deploys, is the Worker's merge path correctly handling the case where the backfill row already exists? Should we use a different `'mode'` marker to distinguish backfilled-then-added-to days?

---

**Classify findings:** BLOCKER (plan won't work or will cause data loss), SHOULD-FIX (real risk worth addressing), NICE-TO-HAVE (theoretical, diminishing returns), DISAGREE (plan is right, here's why you might push back).
