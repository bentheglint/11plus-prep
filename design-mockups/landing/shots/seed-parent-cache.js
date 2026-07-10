// ── PrepStep marketing-screenshot seed data (Parent Dashboard: Topic Mastery
// + Focus Areas) ──
//
// Adapted from seed-initscript.js. Self-contained page initScript (NOT a
// module — no import/export). Runs BEFORE any app code loads.
//
// KEY DIFFERENCE from seed-initscript.js: in ?dev-auth=true mode, getToken()
// returns null, so apiFetchClassified() never calls fetch() at all — it
// short-circuits straight to the localStorage CACHE fallback
// (src/hooks/useD1Data.js:514-515, 908-909). Stubbing window.fetch (as the
// original script did) is therefore inert here. This version instead WRITES
// serverData directly into the cache the app actually reads:
//   localStorage['d1-cache:' + userName] = JSON.stringify(serverData)
// where userName = localStorage['current-user'] || 'Dev' (AuthGate's
// DEV_BYPASS default — src/components/AuthGate.js:883). We set
// current-user = 'Maya' explicitly and seed under both 'Maya' and 'Dev' for
// safety.
//
// Persona: "Maya", a diligent Year 5 child, ~5-6 weeks of practice up to
// "today" (whenever this script actually runs — see anchor note below).
// Maths strong overall but with one clear weak spot (Long Multiplication);
// English mid; VR broad and mostly solid but with one clear weak spot
// (Letter Codes) — see notes below.
//
// Scoring model this file is calibrated against (src/hooks/useMastery.js):
//   score = round(accuracy_recent30 * recencyFactor * volumeFactor * 100)
//   recencyFactor: <=7d -> 1.0, <=14d -> 0.9, <=21d -> 0.75, <=28d -> 0.6, else 0.4
//   volumeFactor: min(1, totalResultsForTopic / 20)
//   bands: >=90 5*, >=76 4*, >=56 3*, >=31 2*, >=1 1*, else 0 (not started)
//
// FocusAreas selection (src/hooks/useMastery.js getRecommendedNext/getFocusAreas):
//   picks ONE topic per subject by priority = (100-score)*2 + min(daysSince,30)*3
//     + (trend down ? +20 : 0) + (totalQuestions<10 ? +15 : 0) + (totalQuestions===0 ? +30 : 0)
//   then takes the top-3 across subjects (+ any declining-trend extras).
//   CRITICAL: untouched topics get both the +30 "never tried" AND +15
//   "coverage gap" bonuses, which OUTWEIGHS almost any touched-but-weak
//   topic. VR originally had 8 untouched topics, so without intervention
//   the VR slot would always be won by whichever untouched topic sorts
//   first — not the touched-weak "Letter Codes" the marketing shot needs.
//   Fix: touch the other 7 previously-untouched VR topics with strong,
//   recent, high-volume results (90% @ 20 total -> score ~90, priority ~10-20)
//   so they drop out of contention, leaving Letter Codes (touched, ~42%
//   accuracy, priority ~150-160) as the clear VR pick. Long Multiplication
//   was similarly dropped from 65% to 45% accuracy so it beats the other
//   maths topics (previous top was primenumbersfactors at priority 92;
//   Long Multiplication at 45% accuracy scores priority ~122).

(function () {
  // ── Date helpers — anchored to the REAL current date, computed fresh each
  // time this script runs (NOT a frozen historical date). All the mastery
  // calibration below only depends on RELATIVE day offsets (recencyBase,
  // daysAgo), so anchoring "today" to whenever the script actually runs
  // keeps that calibration intact while avoiding a stale-anchor mismatch
  // against the app's own real-clock date math (useStreaksAndPP.getToday(),
  // PracticeCalendar's `new Date()`). A previous fixed anchor (9 Jul 2026)
  // drifted one day behind the real browser date on 10 Jul: streakHistory's
  // most recent entry landed on "yesterday" relative to the app's real
  // "today", so (a) today's calendar cell showed 0 questions for a
  // supposedly diligent persona, and (b) OnTrackCard's rolling-7-day count
  // (all 7 of the last 7 days marked practiced) and the Practice Consistency
  // panel's Mon-Sun ISO-week count (which only sees whichever of those 7
  // days fall on/after the real Monday) silently diverged — "7/5 days this
  // week" next to "4/7 this week". Confirmed empirically via a live
  // snapshot before this fix.
  var TODAY_UTC_MS = (function () {
    var n = new Date();
    return Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate(), 12, 0, 0);
  })();
  function pad2(n) { return String(n).padStart(2, '0'); }
  function ymdFromMs(ms) {
    var d = new Date(ms);
    return d.getUTCFullYear() + '-' + pad2(d.getUTCMonth() + 1) + '-' + pad2(d.getUTCDate());
  }
  function dateAgo(daysAgo) { return ymdFromMs(TODAY_UTC_MS - daysAgo * 86400000); }
  function dtAgo(daysAgo, hh, mm) {
    return dateAgo(daysAgo) + ' ' + pad2(hh) + ':' + pad2(mm) + ':00';
  }

  // 22 distinct practice days, today back ~38 days — used for the streak
  // calendar / history array.
  //
  // Current-week days (offsets 0-6) are DELIBERATELY not all practiced —
  // only 4 of the 7 (today, yesterday, 3 days ago, 4 days ago; skipping 2,
  // 5, 6) so the "this week" figures read sensibly on both panels that
  // consume streakHistory but count "this week" differently:
  //   - OnTrackCard: rolling trailing-7-day count, shown as "X/5"
  //     (src/components/progress/OnTrackCard.js daysThisWeek)
  //   - Practice Consistency panel: ISO Mon-Sun calendar-week count, shown
  //     as "X/7" (src/components/progress/PracticeCalendar.js thisWeekDays)
  // Because Monday of the current ISO week always falls within the last 6
  // days, restricting practice to offsets 0-4 (today back to Monday, minus
  // one skipped midweek day) makes BOTH windows land on the same count (4),
  // so the two cards agree instead of showing "7/5" against "4/7".
  var PRACTICE_DAY_OFFSETS = [0, 1, 3, 4, 7, 8, 10, 12, 13, 15, 16, 18, 19, 21, 23, 24, 26, 28, 30, 32, 35, 38];

  // ── Per-topic practice configuration ──
  var TOPIC_CONFIGS = [
    // ── MATHS — strong overall, with ONE deliberate weak spot: Long
    // Multiplication dropped to 45% (9/20) so it clearly wins the maths
    // Focus Area slot (priority ~122 vs the next-highest untouched-adjacent
    // topic, primenumbersfactors, at ~92).
    { key: 'percentages', subject: 'maths', total: 26, correct: 24, recencyBase: 0,
      mistakes: [{ qid: 7, daysAgo: 1 }, { qid: 15, daysAgo: 4 }] },
    { key: 'fractions', subject: 'maths', total: 25, correct: 23, recencyBase: 1 },
    { key: 'ratio', subject: 'maths', total: 22, correct: 18, recencyBase: 2 },
    { key: 'decimals', subject: 'maths', total: 20, correct: 16, recencyBase: 3 },
    { key: 'longmultiplication', subject: 'maths', total: 20, correct: 9, recencyBase: 0,
      mistakes: [{ qid: 25, daysAgo: 0 }, { qid: 26, daysAgo: 2 }] },
    { key: 'longdivision', subject: 'maths', total: 20, correct: 12, recencyBase: 0 },
    { key: 'algebra', subject: 'maths', total: 20, correct: 12, recencyBase: 1 },
    { key: 'placevalue', subject: 'maths', total: 20, correct: 14, recencyBase: 2 },
    { key: 'negativenumbers', subject: 'maths', total: 18, correct: 12, recencyBase: 3 },
    { key: 'primenumbersfactors', subject: 'maths', total: 18, correct: 12, recencyBase: 4 },
    { key: 'areaperimeter', subject: 'maths', total: 20, correct: 14, recencyBase: 0 },
    { key: 'volume', subject: 'maths', total: 18, correct: 12, recencyBase: 1 },
    { key: 'anglesshapes', subject: 'maths', total: 18, correct: 12, recencyBase: 2 },
    { key: 'sequences', subject: 'maths', total: 18, correct: 12, recencyBase: 3 },
    { key: 'datahandling', subject: 'maths', total: 20, correct: 14, recencyBase: 4 },
    { key: 'speeddistancetime', subject: 'maths', total: 18, correct: 12, recencyBase: 0 },

    // ── ENGLISH — mid: spelling (4*) and vocabulary (3*) are the strong
    // pair; comprehension explicitly "developing" (2*, ~45); punctuation/
    // grammar/wordClassGrammar trail behind.
    { key: 'spelling', subject: 'english', total: 22, correct: 17, recencyBase: 1 },
    { key: 'vocabulary', subject: 'english', total: 20, correct: 12, recencyBase: 2 },
    { key: 'comprehension', subject: 'english', total: 18, correct: 9, recencyBase: 0,
      mistakes: [{ qid: 3, daysAgo: 0 }, { qid: 11, daysAgo: 3 }] },
    { key: 'punctuation', subject: 'english', total: 16, correct: 8, recencyBase: 3,
      mistakes: [{ qid: 4, daysAgo: 2 }, { qid: 8, daysAgo: 5 }] },
    { key: 'grammar', subject: 'english', total: 10, correct: 5, recencyBase: 4 },
    { key: 'wordClassGrammar', subject: 'english', total: 8, correct: 4, recencyBase: 1 },

    // ── VERBAL REASONING — broad coverage (16 of 17 topics touched), mostly
    // strong, with ONE deliberate weak spot: Letter Codes at 42% (5/12) so
    // it clearly wins the VR Focus Area slot. The 7 topics that were
    // previously left untouched (letterPairSeries, letterSums,
    // wordCodeAnalogies, numberWordCodes, logicAndLanguage, sharedLetter,
    // balanceEquations) are now touched at ~90% so their FocusAreas
    // priority (~10-20) drops well below Letter Codes' (~150-160) — an
    // untouched topic's "+30 never tried" bonus would otherwise always beat
    // a touched-but-weak one.
    { key: 'synonyms', subject: 'verbalreasoning', total: 20, correct: 12, recencyBase: 2 },
    { key: 'antonyms', subject: 'verbalreasoning', total: 18, correct: 12, recencyBase: 3 },
    { key: 'verbalAnalogies', subject: 'verbalreasoning', total: 14, correct: 7, recencyBase: 1,
      mistakes: [{ qid: 5, daysAgo: 1 }, { qid: 9, daysAgo: 6 }] },
    { key: 'oddTwoOut', subject: 'verbalreasoning', total: 14, correct: 7, recencyBase: 4 },
    { key: 'compoundWords', subject: 'verbalreasoning', total: 12, correct: 7, recencyBase: 0 },
    { key: 'hiddenWords', subject: 'verbalreasoning', total: 12, correct: 7, recencyBase: 2 },
    { key: 'letterMove', subject: 'verbalreasoning', total: 16, correct: 13, recencyBase: 3 },
    { key: 'missingLettersWords', subject: 'verbalreasoning', total: 16, correct: 13, recencyBase: 4 },
    { key: 'numberSeries', subject: 'verbalreasoning', total: 16, correct: 13, recencyBase: 1 },
    // Deliberate weak spot — touched, low accuracy, recent (so it reads as
    // "actively struggling right now", not "abandoned"). letterMove/
    // missingLettersWords/numberSeries above were bumped from their
    // original 8-total/50%-accuracy config to 16-total/81%: at <10 total
    // attempts they picked up FocusAreas' "totalQuestions<10" +15 coverage
    // bonus on TOP of a low score from tiny volumeFactor, which pushed
    // their priority (~180-190) above Letter Codes' (~150) — empirically
    // confirmed via a live snapshot showing "Missing Letters" instead of
    // "Letter Codes" before this fix.
    { key: 'letterCodes', subject: 'verbalreasoning', total: 12, correct: 5, recencyBase: 0,
      mistakes: [{ qid: 21, daysAgo: 1 }, { qid: 22, daysAgo: 3 }] },
    // Filler — strong/recent so they don't outrank Letter Codes for the VR
    // Focus Area slot (see note above).
    { key: 'letterPairSeries', subject: 'verbalreasoning', total: 20, correct: 18, recencyBase: 1 },
    { key: 'letterSums', subject: 'verbalreasoning', total: 20, correct: 18, recencyBase: 2 },
    { key: 'wordCodeAnalogies', subject: 'verbalreasoning', total: 20, correct: 18, recencyBase: 3 },
    { key: 'numberWordCodes', subject: 'verbalreasoning', total: 20, correct: 18, recencyBase: 4 },
    { key: 'logicAndLanguage', subject: 'verbalreasoning', total: 20, correct: 18, recencyBase: 0 },
    { key: 'sharedLetter', subject: 'verbalreasoning', total: 20, correct: 18, recencyBase: 1 },
    { key: 'balanceEquations', subject: 'verbalreasoning', total: 20, correct: 18, recencyBase: 2 },
    // Left genuinely untouched (none — every VR topic is now touched by design).
  ];

  // Per-subject realistic time-per-question ranges, deliberately kept under
  // each subject's SpeedTracking/SpeedAccuracyQuadrant GL target (maths 60s,
  // english 60s, VR 37.5s) so the marketing shots read as "confidently
  // fast", not fabricated. The original flat 6-20s-for-everyone formula
  // (independent of subject/accuracy) made every subject look near-instant
  // and tripped SpeedTracking's possibleGuessing flag (avgSecs<15 &&
  // accuracy<50) on English purely as a seed artifact — confirmed via a live
  // snapshot showing an unwarranted "may indicate guessing" callout.
  var TIME_MS_RANGE = {
    maths: [28000, 48000],
    english: [28000, 48000],
    verbalreasoning: [16000, 28000],
  };
  function timeMsFor(subject, qid) {
    var range = TIME_MS_RANGE[subject] || [20000, 40000];
    var span = range[1] - range[0];
    return range[0] + ((qid * 137) % span);
  }

  var BATCH_SIZE = 10; // ~one Daily-Learning-sized quiz per batch

  var qrId = 1;
  var questionResults = [];
  var quizResults = [];

  // Why wrong answers are mostly "resolved" (see seed-initscript.js header
  // for full rationale): most of a topic's incorrect-row budget is spent as
  // a wrong-then-corrected PAIR (same question_id) rather than a permanent
  // standalone wrong row, so My Mistakes doesn't flood with 100+ entries.
  // Only each topic's curated `mistakes` entries stay permanently wrong.
  TOPIC_CONFIGS.forEach(function (cfg) {
    var mistakes = cfg.mistakes || [];
    var mistakeIds = mistakes.map(function (m) { return m.qid; });
    var idPool = [];
    for (var n = 1; n <= 30; n++) { if (mistakeIds.indexOf(n) === -1) idPool.push(n); }

    var regularTotal = cfg.total - mistakes.length;
    var regularCorrect = cfg.correct;
    var regularIncorrect = regularTotal - regularCorrect;

    var Y = regularIncorrect;
    var X = regularCorrect - Y;
    if (X < 0) throw new Error('Unresolvable accuracy (<50%% regular-row accuracy) for topic ' + cfg.key + ' — recalibrate total/correct/mistakes.');
    var nUnits = X + Y;

    var nBatches = Math.max(1, Math.ceil(nUnits / BATCH_SIZE));
    var maxSpan = 36 - cfg.recencyBase; // keep the oldest batch within the 2026-06-01 window
    var strideStep = nBatches > 1 ? Math.floor(maxSpan / (nBatches - 1)) : 0;

    var regularEntries = [];
    for (var u = 0; u < nUnits; u++) {
      var batchIndex = Math.floor(u / BATCH_SIZE);
      var withinBatch = u % BATCH_SIZE;
      var daysAgo = cfg.recencyBase + batchIndex * strideStep;
      var hh = 15 + (withinBatch % 3);
      var mm = (withinBatch * 13) % 60;
      var qid = idPool[u % idPool.length];
      var difficulty = [1, 2, 3][u % 3];

      if (u < Y) {
        regularEntries.push({ qid: qid, correct: false, daysAgo: daysAgo, hh: hh, mm: mm, batchIndex: batchIndex, difficulty: difficulty });
        var retryDaysAgo = Math.max(0, daysAgo - 2);
        regularEntries.push({ qid: qid, correct: true, daysAgo: retryDaysAgo, hh: 20, mm: 0, batchIndex: batchIndex, difficulty: difficulty });
      } else {
        regularEntries.push({ qid: qid, correct: true, daysAgo: daysAgo, hh: hh, mm: mm, batchIndex: batchIndex, difficulty: difficulty });
      }
    }

    mistakes.forEach(function (m, mi) {
      regularEntries.push({
        qid: m.qid,
        correct: false,
        daysAgo: m.daysAgo,
        hh: 18 + mi,
        mm: (mi * 17) % 60,
        batchIndex: 0,
        difficulty: 2,
      });
    });

    var byBatch = {};
    regularEntries.forEach(function (e) {
      var attemptedAt = dtAgo(e.daysAgo, e.hh, e.mm);
      questionResults.push({
        id: qrId++,
        attempted_at: attemptedAt,
        question_id: e.qid,
        topic_key: cfg.key,
        subject: cfg.subject,
        difficulty: e.difficulty,
        is_correct: e.correct ? 1 : 0,
        time_ms: timeMsFor(cfg.subject, e.qid),
        mode: 'focused',
        session_id: cfg.key + '-s' + e.batchIndex,
      });
      var b = byBatch[e.batchIndex] || (byBatch[e.batchIndex] = { total: 0, correct: 0, latest: attemptedAt });
      b.total += 1;
      if (e.correct) b.correct += 1;
      if (attemptedAt > b.latest) b.latest = attemptedAt;
    });

    Object.keys(byBatch).forEach(function (bkey) {
      var b = byBatch[bkey];
      quizResults.push({
        completed_at: b.latest,
        topic_key: cfg.key,
        subject: cfg.subject,
        score: b.correct,
        total: b.total,
        session_id: cfg.key + '-s' + bkey,
      });
    });
  });

  questionResults.sort(function (a, b) { return a.attempted_at < b.attempted_at ? 1 : -1; });
  quizResults.sort(function (a, b) { return a.completed_at < b.completed_at ? 1 : -1; });

  // ── practiceSessions — PracticeCalendar (the "Practice Consistency" panel
  // in ParentDashboard) reads questionsPerDay from userData.practiceLog, NOT
  // from questionResults directly (src/components/progress/PracticeCalendar.js
  // 15-16). useD1Data.transformServerData maps
  // serverData.practiceSessions -> practiceLog as
  // { ...r.data, date: r.session_date } (useD1Data.js:331-335). Without this,
  // the calendar's "practiced" ring still shows (that comes from
  // streaks.streak_history via getPracticeDays) but every cell's colour
  // intensity is stuck at 0 (grey, "No practice") because practiceLog was
  // empty — confirmed empirically via a live snapshot before this fix.
  // Derive one session per practice day by grouping questionResults by their
  // local (UTC) date and counting rows, so the calendar's colour intensity
  // matches the actual per-day question volume already encoded above.
  var questionsByDate = {};
  questionResults.forEach(function (qr) {
    var d = qr.attempted_at.slice(0, 10);
    questionsByDate[d] = (questionsByDate[d] || 0) + 1;
  });
  // PRACTICE_DAY_OFFSETS (used below for streaks.streak_history, which drives
  // the calendar's "practiced" ring + per-week Total count) is an
  // INDEPENDENT date set from the per-topic recencyBase/stride offsets that
  // produced questionResults above — the two were never guaranteed to land
  // on the same calendar dates. Confirmed empirically via a live snapshot:
  // several weeks showed a non-zero "Total" (practiced-day count, sourced
  // from streak_history) with every cell coloured grey/"No practice"
  // (colour intensity sourced from practiceLog/questionsByDate), which reads
  // as a broken chart. Backfill any streak-history date with no
  // questionResults that day with a small filler count so every "practiced"
  // day also gets a non-grey cell.
  PRACTICE_DAY_OFFSETS.forEach(function (daysAgo) {
    var d = dateAgo(daysAgo);
    if (!questionsByDate[d]) questionsByDate[d] = 6;
  });
  var practiceSessions = Object.keys(questionsByDate).map(function (d) {
    return { session_date: d, data: { questionsAttempted: questionsByDate[d] } };
  });

  function makeQuestionTimes(n, base) {
    var obj = {};
    for (var i = 0; i < n; i++) obj[i + 1] = base + (i % 10) * 900;
    return obj;
  }
  var mockTestResults = [
    {
      subject: 'maths',
      total_questions: 50,
      total_correct: 39,
      percentage: 78,
      time_taken: 2700,
      time_limit: 3000,
      section_results: {
        Number: { correct: 20, total: 25 },
        'Problem Solving': { correct: 19, total: 25 },
      },
      question_times: makeQuestionTimes(50, 18000),
      completed_at: dtAgo(18, 10, 0),
    },
    {
      subject: 'maths',
      total_questions: 50,
      total_correct: 44,
      percentage: 88,
      time_taken: 2600,
      time_limit: 3000,
      section_results: {
        Number: { correct: 23, total: 25 },
        'Problem Solving': { correct: 21, total: 25 },
      },
      question_times: makeQuestionTimes(50, 17000),
      completed_at: dtAgo(3, 9, 30),
    },
  ];

  var streakHistory = PRACTICE_DAY_OFFSETS.slice().reverse().map(dateAgo);
  var streaks = {
    current_streak: 9,
    longest_streak: 14,
    last_quiz_date: dateAgo(0),
    streak_history: streakHistory,
  };

  var prepPoints = {
    total: 2800,
    today_pp: 145,
    today_date: dateAgo(0),
  };

  var achievements = [
    { achievement_id: 'first-quiz', unlocked_at: dtAgo(38, 16, 0) },
    { achievement_id: 'streak-3', unlocked_at: dtAgo(36, 17, 0) },
    { achievement_id: 'questions-50', unlocked_at: dtAgo(35, 16, 30) },
    { achievement_id: 'streak-7', unlocked_at: dtAgo(30, 17, 0) },
    { achievement_id: 'questions-100', unlocked_at: dtAgo(28, 16, 0) },
    { achievement_id: 'first-mock', unlocked_at: dtAgo(18, 10, 30) },
    { achievement_id: 'streak-14', unlocked_at: dtAgo(20, 17, 0) },
    { achievement_id: 'explore-maths', unlocked_at: dtAgo(15, 16, 0) },
    { achievement_id: 'explore-english', unlocked_at: dtAgo(12, 16, 0) },
    { achievement_id: 'first-mastery', unlocked_at: dtAgo(6, 16, 0) },
    { achievement_id: 'questions-500', unlocked_at: dtAgo(5, 16, 0) },
    { achievement_id: 'mock-80', unlocked_at: dtAgo(3, 9, 45) },
  ];

  var serverData = {
    quizResults: quizResults,
    questionResults: questionResults,
    mockTestResults: mockTestResults,
    topicPerformance: [],
    streaks: streaks,
    prepPoints: prepPoints,
    achievements: achievements,
    lessonHistory: [],
    seenQuestions: [],
    practiceSessions: practiceSessions,
    seenTips: [],
  };

  // ── Write straight into the D1-cache localStorage key the app reads in
  // dev-auth mode (getToken() is null there, so apiFetchClassified never
  // fetches and useD1Data falls straight to readCache(userName)). ──
  try {
    localStorage.setItem('current-user', 'Maya');
    var body = JSON.stringify(serverData);
    localStorage.setItem('d1-cache:Maya', body);
    localStorage.setItem('d1-cache:Dev', body); // safety net for prior-session naming
  } catch (e) { /* ignore */ }
})();
