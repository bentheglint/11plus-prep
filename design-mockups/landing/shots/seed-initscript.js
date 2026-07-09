// ── PrepStep marketing-screenshot seed data ──
//
// Self-contained page initScript (NOT a module — no import/export). Runs
// BEFORE any app code loads. It:
//   1. Builds a `serverData` object matching the exact shape
//      transformServerData() expects (src/hooks/useD1Data.js lines 233-395).
//   2. Overrides window.fetch so any request whose URL contains
//      "/api/data/all" resolves to a synthetic 200 JSON response carrying
//      serverData. Every other fetch (AI tutor, etc.) passes straight
//      through to the real fetch.
//
// Persona: "Dev", a diligent Year 5 child, ~5-6 weeks of practice
// (2026-06-01 -> 2026-07-09, "today"). Maths strong, English mid,
// VR developing — see the mastery-band notes above each topic block.
//
// Scoring model this file is calibrated against (src/hooks/useMastery.js):
//   score = round(accuracy_recent30 * recencyFactor * volumeFactor * 100)
//   recencyFactor: <=7d -> 1.0, <=14d -> 0.9, <=21d -> 0.75, <=28d -> 0.6, else 0.4
//   volumeFactor: min(1, totalResultsForTopic / 20)
//   bands: >=90 5*, >=76 4*, >=56 3*, >=31 2*, >=1 1*, else 0 (not started)
// Every topic below is generated with total <= 30, so useMastery's
// "recent30" window always equals the WHOLE topic set — accuracy is simply
// correctCount/total, no ordering tricks required. Every topic's single
// most-recent entry is dated <=4 days ago, so recencyFactor is always 1.0.

(function () {
  var ORIGINAL_FETCH = window.fetch.bind(window);

  // ── Date helpers — anchored to a fixed "today" (2026-07-09) rather than
  // the real system clock, so the mastery bands below stay exactly where
  // they were calibrated regardless of when this script actually runs. ──
  var TODAY_UTC_MS = Date.UTC(2026, 6, 9, 12, 0, 0); // 9 Jul 2026, noon UTC
  function pad2(n) { return String(n).padStart(2, '0'); }
  function ymdFromMs(ms) {
    var d = new Date(ms);
    return d.getUTCFullYear() + '-' + pad2(d.getUTCMonth() + 1) + '-' + pad2(d.getUTCDate());
  }
  function dateAgo(daysAgo) { return ymdFromMs(TODAY_UTC_MS - daysAgo * 86400000); }
  function dtAgo(daysAgo, hh, mm) {
    return dateAgo(daysAgo) + ' ' + pad2(hh) + ':' + pad2(mm) + ':00';
  }

  // 25 distinct practice days, today back to 2026-06-01 (offset 38) — used
  // for the streak calendar / history array.
  var PRACTICE_DAY_OFFSETS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 13, 15, 16, 18, 19, 21, 23, 24, 26, 28, 30, 32, 35, 38];

  // ── Per-topic practice configuration ──
  // total/correct are calibrated (see header) to land each topic in its
  // target star band. `recencyBase` (0-4 days ago) is when the topic's
  // MOST RECENT attempt happened — always <=7d so recencyFactor is 1.0.
  // `mistakes` are extra always-wrong entries (unique question_id per
  // topic, ids kept in 1-30 so they exist in the real question bank) that
  // surface on the My Mistakes screen as "latest attempt wrong".
  var TOPIC_CONFIGS = [
    // ── MATHS — strong: percentages/fractions mastered (5*), ratio/decimals
    // strong (4*), the rest solidly "Confident" (3*). Subject avg ~69 ->
    // comfortably "Exam Ready", possibly tipping into "Excelling" with the
    // consistency/mock bonus.
    { key: 'percentages', subject: 'maths', total: 26, correct: 24, recencyBase: 0,
      mistakes: [{ qid: 7, daysAgo: 1 }, { qid: 15, daysAgo: 4 }] },
    { key: 'fractions', subject: 'maths', total: 25, correct: 23, recencyBase: 1 },
    { key: 'ratio', subject: 'maths', total: 22, correct: 18, recencyBase: 2 },
    { key: 'decimals', subject: 'maths', total: 20, correct: 16, recencyBase: 3 },
    { key: 'longmultiplication', subject: 'maths', total: 20, correct: 13, recencyBase: 4 },
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
    // grammar/wordClassGrammar trail behind. Subject avg ~44 -> "Developing
    // Well".
    { key: 'spelling', subject: 'english', total: 22, correct: 17, recencyBase: 1 },
    { key: 'vocabulary', subject: 'english', total: 20, correct: 12, recencyBase: 2 },
    { key: 'comprehension', subject: 'english', total: 18, correct: 9, recencyBase: 0,
      mistakes: [{ qid: 3, daysAgo: 0 }, { qid: 11, daysAgo: 3 }] },
    { key: 'punctuation', subject: 'english', total: 16, correct: 8, recencyBase: 3,
      mistakes: [{ qid: 4, daysAgo: 2 }, { qid: 8, daysAgo: 5 }] },
    { key: 'grammar', subject: 'english', total: 10, correct: 5, recencyBase: 4 },
    { key: 'wordClassGrammar', subject: 'english', total: 8, correct: 4, recencyBase: 1 },

    // ── VERBAL REASONING — developing: only 9 of 17 topics touched at all.
    // synonyms/antonyms are the strongest (3*); verbalAnalogies/oddTwoOut/
    // compoundWords/hiddenWords sit at 2*; the rest barely started (1*).
    // Subject avg ~17 -> "Building Foundations" (8 topics untouched drag
    // the readiness average down, which is realistic — VR is the weak
    // subject here).
    { key: 'synonyms', subject: 'verbalreasoning', total: 20, correct: 12, recencyBase: 2 },
    { key: 'antonyms', subject: 'verbalreasoning', total: 18, correct: 12, recencyBase: 3 },
    { key: 'verbalAnalogies', subject: 'verbalreasoning', total: 14, correct: 7, recencyBase: 1,
      mistakes: [{ qid: 5, daysAgo: 1 }, { qid: 9, daysAgo: 6 }] },
    { key: 'oddTwoOut', subject: 'verbalreasoning', total: 14, correct: 7, recencyBase: 4 },
    { key: 'compoundWords', subject: 'verbalreasoning', total: 12, correct: 7, recencyBase: 0 },
    { key: 'hiddenWords', subject: 'verbalreasoning', total: 12, correct: 7, recencyBase: 2 },
    { key: 'letterMove', subject: 'verbalreasoning', total: 8, correct: 4, recencyBase: 3 },
    { key: 'missingLettersWords', subject: 'verbalreasoning', total: 8, correct: 4, recencyBase: 4 },
    { key: 'numberSeries', subject: 'verbalreasoning', total: 8, correct: 4, recencyBase: 1 },
    // Untouched on purpose (0 questions = "not started"): letterCodes,
    // letterPairSeries, letterSums, wordCodeAnalogies, numberWordCodes,
    // logicAndLanguage, sharedLetter, balanceEquations.
  ];

  var BATCH_SIZE = 10; // ~one Daily-Learning-sized quiz per batch

  var qrId = 1;
  var questionResults = [];
  var quizResults = [];

  // IMPORTANT — why wrong answers are mostly "resolved":
  // My Mistakes shows every question whose MOST RECENT attempt was wrong
  // (src/screens/MistakesScreen.js groupedMistakes — one row per unique
  // topic+questionId, keyed off the latest date). A topic with, say, 50%
  // accuracy genuinely has ~50% of its rows wrong — if every wrong row used
  // a never-repeated question_id, EVERY one of them would show up as a
  // permanent "mistake", flooding the screen with 100+ entries instead of
  // the realistic handful the task calls for.
  //
  // Real diligent practice doesn't work that way: a child gets a question
  // wrong, and on a later attempt of the SAME question gets it right — at
  // which point it drops off My Mistakes (only the latest attempt counts).
  // So for every topic, most of its "incorrect" row budget is spent as a
  // wrong-then-corrected PAIR (same question_id, 2 rows, correct dated
  // later) rather than a single standalone wrong row. Only the topics'
  // curated `mistakes` entries (own, never-reused question_id) stay
  // permanently wrong — that's the ~8 that actually surface.
  //
  // This does NOT change any topic's score: useMastery counts every ROW
  // (not unique questions) toward accuracy, and total row counts / correct
  // counts are exactly what TOPIC_CONFIGS specifies either way.
  TOPIC_CONFIGS.forEach(function (cfg) {
    var mistakes = cfg.mistakes || [];
    var mistakeIds = mistakes.map(function (m) { return m.qid; });
    var idPool = [];
    for (var n = 1; n <= 30; n++) { if (mistakeIds.indexOf(n) === -1) idPool.push(n); }

    var regularTotal = cfg.total - mistakes.length;
    var regularCorrect = cfg.correct;
    var regularIncorrect = regularTotal - regularCorrect;

    // Y = number of wrong-then-corrected pairs (resolves ALL regular
    // incorrect rows — every topic here is calibrated with accuracy >= 50%
    // so this is always achievable). X = standalone single-attempt
    // corrects. X + 2Y == regularTotal, X + Y == regularCorrect.
    var Y = regularIncorrect;
    var X = regularCorrect - Y;
    if (X < 0) throw new Error('Unresolvable accuracy (<50%) for topic ' + cfg.key + ' — recalibrate total/correct.');
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
        // Wrong first attempt...
        regularEntries.push({ qid: qid, correct: false, daysAgo: daysAgo, hh: hh, mm: mm, batchIndex: batchIndex, difficulty: difficulty });
        // ...corrected on a later retry of the SAME question (so it's the
        // "latest attempt" and doesn't show as a mistake).
        var retryDaysAgo = Math.max(0, daysAgo - 2);
        regularEntries.push({ qid: qid, correct: true, daysAgo: retryDaysAgo, hh: 20, mm: 0, batchIndex: batchIndex, difficulty: difficulty });
      } else {
        // Standalone — got it right first try.
        regularEntries.push({ qid: qid, correct: true, daysAgo: daysAgo, hh: hh, mm: mm, batchIndex: batchIndex, difficulty: difficulty });
      }
    }

    // Forced (curated) mistakes ride along in the most recent quiz
    // (batch 0), each on its own never-reused question_id, so they show up
    // near the top of My Mistakes and stay there.
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
        time_ms: 6000 + ((e.qid * 137) % 14000),
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

  // Newest-first, per the transformServerData ordering convention.
  questionResults.sort(function (a, b) { return a.attempted_at < b.attempted_at ? 1 : -1; });
  quizResults.sort(function (a, b) { return a.completed_at < b.completed_at ? 1 : -1; });

  // ── Mock tests (2 completed maths papers) ──
  // Shapes here match what useMockTest.js/MockTestResultsScreen.js actually
  // consume — sectionResults is an OBJECT keyed by section name
  // ({ correct, total }), questionTimes an object keyed by question index —
  // NOT JSON strings. transformServerData passes both fields straight
  // through without parsing, so the server is assumed to hand back already-
  // deserialised JSON here too.
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

  // ── Streaks — read verbatim by the app (not recomputed from history) ──
  var streakHistory = PRACTICE_DAY_OFFSETS.slice().reverse().map(dateAgo); // oldest first
  var streaks = {
    current_streak: 9,
    longest_streak: 14,
    last_quiz_date: dateAgo(0),
    streak_history: streakHistory,
  };

  // ── Prep Points — total 2800 -> level 7 (floor(sqrt(2800/50)) = 7) ──
  var prepPoints = {
    total: 2800,
    today_pp: 145,
    today_date: dateAgo(0),
  };

  // ── Achievements — a set consistent with the generated stats above ──
  // (537 total questions -> questions-500; 16/16 maths + 6/6 english topics
  // touched -> both explorer badges; 2 topics at 5* -> first-mastery;
  // longest_streak 14 -> streak-3/7/14; best mock 88% -> mock-80.)
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
    practiceSessions: [],
    seenTips: [],
  };

  // ── Fetch stub ──
  window.fetch = function (input, init) {
    var url = typeof input === 'string' ? input : (input && input.url) || '';
    var isDataAll = false;
    try {
      var parsed = new URL(url, window.location.origin);
      isDataAll = parsed.pathname.indexOf('/api/data/all') !== -1;
    } catch (e) {
      isDataAll = url.indexOf('/api/data/all') !== -1;
    }
    if (isDataAll) {
      var body = JSON.stringify(serverData);
      return Promise.resolve({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: function () { return Promise.resolve(serverData); },
        text: function () { return Promise.resolve(body); },
        clone: function () { return this; },
      });
    }
    return ORIGINAL_FETCH(input, init);
  };
})();
