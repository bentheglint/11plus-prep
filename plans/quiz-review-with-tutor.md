---
title: Quiz Review with AI Tutor — feature plan
date: 2026-05-10
status: REVISED post senior-dev + codex — ready to build
problem: Users (Ben + Evie observed) underuse the AI tutor. There is no current path to revisit questions after completing a quiz.
goal: After every quiz, give children a frictionless path to talk through their mistakes with the tutor.
---

# Quiz Review with AI Tutor

## What's already in place

| Item | Status | Detail |
|------|--------|--------|
| QuizDetailScreen | ✅ Exists | Shows per-question review (your answer / correct answer / explanation). Used today from the Activity log. Renders all questions stacked vertically. |
| Question-result records | ✅ Exists | `questionResults` rows are stored per quiz in D1 with `sessionId` foreign-key back to the quiz. Pre-feature quizzes (no sessionId) already render an empty state. |
| QuizScreen tutor + lesson buttons | ✅ Exists | "Find Me a Lesson" + "AI Tutor" buttons live on QuizScreen during a quiz. Tutor opens a `TutorChat` overlay backed by Claude Haiku via the Worker. |
| ResultsScreen (Quiz Complete) | ✅ Exists | Shows score, time, has buttons for "New Daily Quiz" and "Back to Learning Modes". No review button today. |
| Question-type rendering | ✅ Exists | QuizDetailScreen handles MCQ, select-two, pick-from-sets. |

## Acceptance criteria

The feature is done when:

- [ ] After completing a quiz, the ResultsScreen shows a **"Review questions"** button alongside the existing actions.
- [ ] Clicking the button opens a per-question review of that quiz, landing on the **first wrong question** (or the last question if all were correct).
- [ ] A **progress strip** at the top of the review shows all 10 questions; wrong ones flagged red, correct green, current outlined. Each is clickable to jump.
- [ ] **Prev / Next buttons** move sequentially through the 10 questions.
- [ ] Each review screen shows: question text + image, the child's answer (highlighted), the correct answer (highlighted differently), and the explanation.
- [ ] Review is **read-only** — no answer can be re-selected.
- [ ] **Find Me a Lesson** button appears on every review screen (same component used during live quizzes).
- [ ] **AI Tutor** button appears on every review screen.
- [ ] On wrong-answer screens (only when entering from ResultsScreen, not Activity log), the AI Tutor chat **auto-opens** with the tutor's first reply already present (auto-sent contextual message). Correct-answer screens do NOT auto-open the tutor — the button is still available.
- [ ] The tutor reply is contextual and child-friendly (something like *"You picked X but the answer is Y. Here's why…"*) and **fully explains the correct answer** (review mode, not live-quiz "no spoilers" mode).
- [ ] Closing/dismissing the auto-opened chat works the same as the live-quiz chat.
- [ ] An **"Exit review"** button returns to the ResultsScreen (or wherever the user came from).
- [ ] Pre-feature quizzes (no sessionId) preserve the existing empty-state behaviour; the Review button on ResultsScreen is hidden if `sessionId` is missing.
- [ ] Activity-log entries continue to open at Q1 with **no auto-tutor** (parents reviewing their child's old quizzes shouldn't trigger a chat pop-up).
- [ ] Chat history is **scoped per question** — navigating Prev/Next preserves each question's separate conversation. Auto-send fires **once per question per review-screen mount** (does not re-fire on revisit within the same review session).
- [ ] Chat history **resets on Exit Review** — re-entering the same quiz starts fresh.
- [ ] Automated smoke test: completes a quiz with deliberate wrong answers via test harness, clicks Review, asserts landing-index = first wrong, asserts tutor chat opens with non-empty message visible.

## Design decisions (already aligned with Ben)

- **Read-only review.** Talking to the tutor is the interactive part; re-answering would muddy stats and gamify the wrong loop.
- **Quiz-only scope.** Lesson Complete screens are out of scope.
- **Auto-open on first wrong question only.** Correct answers don't need explanation; pestering correct answers would feel patronising.
- **Auto-send the tutor message** (not pre-fill) so the tutor's first reply is already there when the chat opens. Friction kills usage.
- **Land on first wrong question.** That's where the value is. If all correct, land on the last question with a "well done" framing — no auto-tutor.
- **Same tutor model + endpoint as live quizzes.** No new backend work needed for the tutor itself.

## Implementation outline

### Phase 0 — Extract `useTutorChat()` custom hook

Senior-dev push-back #2: App.js is ~2,100 lines and already owns `showTutorChat`, `chatMessages`, `isAiThinking`, `userMessage` plus ~14 `setShowTutorChat` call sites. Adding QuizDetailScreen as another consumer via prop drilling worsens the bloat the refactor plan (step 5) is trying to fix.

Cleanest path: extract a custom hook now. **Not** a Context (over-engineered for two consumers), just a hook that owns the chat state and exposes the API the live QuizScreen already uses, with per-question scoping built in.

```js
function useTutorChat({ mode, buildSystemPrompt }) {
  // Internal state:
  //   chatByKey: Map<string, Message[]>           — per-question conversations
  //   autoSentKeys: Set<string>                   — tracks which keys have already auto-sent
  //   pendingByKey: Map<string, requestId>        — newest in-flight request per key
  //   thinkingByKey: Map<string, boolean>         — per-key isAiThinking state
  //   currentKey: string
  //   userMessage, showTutorChat, isListening
  //
  // Exposes:
  //   open(key), close(), setKey(key), sendMessage(text)
  //   chatMessages: Message[]                     — derived from chatByKey[currentKey]
  //   isAiThinking: boolean                       — derived from thinkingByKey[currentKey]
  //   autoSendIfNew(key, prompt)                  — idempotent; sends prompt iff key not in autoSentKeys
  //
  // Race-safe reply handling (codex push-back #2): every send captures
  //   const key = currentKey, requestId = uuid()
  //   pendingByKey[key] = requestId
  // When the response arrives, the hook appends it to chatByKey[key] (NOT
  // chatByKey[currentKey]) and clears thinkingByKey[key]. If a newer request
  // for the same key has superseded this one (pendingByKey[key] !== requestId),
  // the response is discarded entirely — late replies cannot land in the wrong
  // chat or clear a stale loading flag.
  //
  // Reset on unmount → fresh state on Exit/Re-enter Review.
}
```

The live QuizScreen flow uses `useTutorChat({ mode: 'live', buildSystemPrompt: buildLivePrompt })` and never calls `autoSendIfNew`. The review flow uses `useTutorChat({ mode: 'review', buildSystemPrompt: buildReviewPrompt })` and calls `autoSendIfNew(questionIndex, contextualPrompt)` whenever the active question changes (in a useEffect on `currentIndex`). Same hook, different consumer behaviour.

Acceptance for Phase 0: live quiz tutor still works identically, no behavioural regression in the live flow.

### Phase 1 — Refactor QuizDetailScreen for one-question-at-a-time

Today QuizDetailScreen renders all questions stacked. We need:

- New internal state: `currentIndex`
- Computed `currentQuestion` from `quizQuestions[currentIndex]`
- New components: `ProgressStrip`, `PrevNextNav`, `QuestionReview` (extracted from the existing inline render)
- Initial `currentIndex` = index of first wrong answer if the parent passed `landOn: 'first-wrong'`; otherwise 0 (Activity log default)
- **React `key` strategy** (senior-dev push-back #1): the `QuestionReview` component MUST be keyed by `${quiz.sessionId}-${currentIndex}` so React unmounts the old question's render and mounts a fresh one when navigating. Without this, React reuses the instance and any internal state (selected-answer styling, animation state) can leak between adjacent questions. Example:
  ```jsx
  <QuestionReview key={`${quiz.sessionId}-${currentIndex}`} question={currentQuestion} ... />
  ```
  Critically: the `useTutorChat` hook lives at the QuizDetailScreen level (NOT inside QuestionReview), so the chat state is preserved across question navigation. Only the UI-render component remounts; the chat-by-question Map persists.

Activity log decision: opens at Q1 (no `landOn` prop, no auto-tutor). ResultsScreen entry passes `landOn="first-wrong"` and `autoOpenTutor={true}`.

Risk: Activity log uses QuizDetailScreen too. Test both entry points before deploying.

### Phase 2 — Wire AI Tutor + Find Me a Lesson into QuizDetailScreen

QuizDetailScreen instantiates one `useTutorChat({ mode: 'review', buildSystemPrompt: buildReviewPrompt })` instance for the whole screen. A `useEffect` watches `currentIndex` — when it changes, calls `tutor.setKey(currentIndex)` (so chatMessages re-derive for the new question), then if `autoOpenTutor && currentQuestionIsWrong`, calls `tutor.autoSendIfNew(currentIndex, contextualPromptForThisQuestion)`. The Set inside the hook ensures auto-send fires at most once per question per mount.

Find Me a Lesson uses the existing logic from QuizScreen — same prop signature, same handler.

The hook's `mode: 'review'` config selects a different system prompt (see Phase 3).

### Phase 3 — Review-mode tutor system prompt

The tutor system prompt is built **client-side** in App.js (lines 965-993) and sent in each request — verified. The current prompt has a "CRITICAL RULE — DO NOT SPOIL ANSWERS" section that's correct for live quizzes and broken for review (the answer is on screen).

The fix is purely client-side, no Worker change:

- Move prompt construction into a shared module (e.g. `src/utils/tutorPrompts.js`) with two builders: `buildLivePrompt({ question, ... })` and `buildReviewPrompt({ question, userAnswer, correctAnswer, ... })`
- The review builder explicitly **drops** the no-spoilers rule and **adds** language like "The child has already submitted this answer. Walk them through the correct method warmly. Be clear about why their choice was wrong without making them feel bad."
- The contextual user message remains: `"I picked '<userAnswer>' but the correct answer was '<correctAnswer>'. Can you explain why?"`

`useTutorChat({ mode })` selects the appropriate builder.

### Phase 4 — Add the entry point on ResultsScreen

- Add a third button: **"Review questions"** above the existing "New Daily Quiz" / "Back to Learning Modes" buttons
- Style it as the primary action (purple) — reviewing mistakes is the highest-value next step after a quiz
- Hidden if `quiz.sessionId` is missing (pre-feature quizzes can't be reviewed)
- Wire it to navigate to QuizDetailScreen with `landOn="first-wrong"` + `autoOpenTutor={true}`

**Persistence race fix (codex push-back #3):** the just-completed quiz's `questionResults` are already in React state when ResultsScreen renders, but they're still being batch-written to D1 in the background. Re-fetching from D1 immediately could return an empty/partial result set.

Fix: ResultsScreen passes the in-memory `questionResults` array (filtered to this quiz's `sessionId`) directly to QuizDetailScreen via a new optional prop `inMemoryResults`. QuizDetailScreen prefers `inMemoryResults` over the global `questionResults` prop when present.

Activity-log entries do NOT pass `inMemoryResults` — they continue to use the global `questionResults` prop, which by the time the user opens an old quiz is reliably durable in D1 + local state.

This means immediate post-quiz review never depends on D1 read freshness.

### Phase 5 — Tests + verification

- **Automated smoke test** (per Feature Verification Protocol — senior-dev push-back #6): take a 10-question quiz via the test harness with deliberate wrong answers, click Review, assert `currentIndex` = index of first wrong, assert tutor chat is visible with at least one message rendered.
- **Activity log regression test**: open a quiz from Activity log, assert lands on Q1, assert tutor chat is NOT auto-opened.
- **Race-condition test** (codex push-back #2): mock the tutor endpoint to delay responses by 1s. Programmatically: trigger auto-send on Q1, navigate to Q2 within 200ms, let both responses arrive. Assert Q1 response lands in `chatByKey[0]`, Q2 response lands in `chatByKey[1]`, no cross-contamination.
- **Persistence test** (codex push-back #3): mock the D1 batch endpoint to delay 2s. Complete a quiz, click Review immediately, assert all 10 questions render with the correct user answers (sourced from `inMemoryResults`, not from D1).
- **Manual smoke flow**: real quiz → Review → first wrong → tutor opens with reply → prev/next → progress strip jump → exit → re-enter (chat resets).
- **Visual QA** via the visual-qa skill on the new ProgressStrip component.

## Out of scope (explicitly)

- Re-attempting questions in review mode
- Reviewing lessons (lesson complete screens)
- Tutor auto-open on correct answers
- Showing speed-tracking / accuracy stats inline in the review (those live on the existing ResultsScreen and Activity log)
- Pre-feature quiz support (existing empty state preserved)
- Cross-device sync of review state (each device shows its own review of the same quiz; tutor history is per-quiz/per-question, no persistence required across devices for this feature)

## Accepted risks (won't fix in this feature)

**Codex push-back #1 — Server-side answer-disclosure enforcement.** Codex correctly notes that mode-switching between `buildLivePrompt` and `buildReviewPrompt` happens entirely client-side, so a modified client could request review-mode (full-explanation) prompts during a live quiz, defeating the no-spoilers invariant.

We accept this risk for now. Reasoning:

- **Threat model**: PrepStep accounts are one-parent-one-child. The "attacker" who would modify the client to bypass the no-spoilers rule is a 9-year-old trying to spoil their own learning. Realistic likelihood: very low.
- **Cost of mitigation**: server-side enforcement requires authoritative quiz-state tracking on the Worker (which questions in this session have been completed?), per-request authorization (does this user/session have the right to ask for the answer to question X?), and a new request schema to convey quiz context. Several days of work for a near-zero realistic threat.
- **Reconsider when**: PrepStep adds shared accounts (multi-child families), school accounts (where children might compete), or any scenario where a child has incentive to defeat the no-spoilers rule against another user's interest. At that point this becomes worth solving properly.
- **Logged for future**: see this section in subsequent plan iterations; revisit before any multi-tenant feature.

## Risk register

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Refactoring QuizDetailScreen breaks Activity log review | Medium | Test both entry points before deploying; Activity log gets explicit `landOn=null` + `autoOpenTutor=false` defaults |
| State leak between adjacent questions (React reuses component instance on currentIndex change) | Medium | `key={\`${quiz.sessionId}-${currentIndex}\`}` on the QuestionReview component forces clean remount of the question render. Hook lives one level up so chat state survives. |
| Tutor state collisions or pollution across consumers | Medium | Phase 0 extracts `useTutorChat()`; live and review consumers each get their own hook instance |
| Auto-send tutor message during a "preview only" review feels too pushy | Low | Obvious dismiss / close on the auto-opened chat; only on first wrong question, not all questions |
| Children re-read a question they got right and the lack of tutor auto-open feels inconsistent | Low | The button is still visible; behaviour is intentional |
| Tutor cost / token usage spike if every quiz triggers a tutor conversation | Medium | Per-question scoping caps each conversation in tokens. After launch: instrument calls/child/day; alert if >100/day. The deeper IP-rate-limiting issue (TUTOR_LIMITER is per-IP, siblings share a household IP) is logged as a follow-up — not fixed in this feature, but acknowledged |
| Auto-message fires more than once per question within a review session | Low | `autoSentKeys: Set<string>` inside the hook makes `autoSendIfNew()` idempotent per key |
| First-time tutor encounter feels intrusive (children unfamiliar with the tutor see chat appear unprompted) | Low | Worth tracking after launch — if dismiss-rate is high, add a one-time onboarding tooltip on first review. Not in initial scope. |

## Phased delivery

The feature is small enough to ship as one PR. Phases above are an implementation order, not delivery checkpoints.

## What we need before building

- [x] Senior-dev review of this plan — done; 4 push-backs + 3 additions incorporated above
- [x] Codex adversarial review of this plan — done; race fix + persistence fix incorporated; server-side enforcement accepted as risk
- [x] Activity-log default-question behaviour decided: opens at Q1, no auto-tutor

Plan is ready to build.
