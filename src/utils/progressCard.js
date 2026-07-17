import { SUBJECT_TOPICS, computeTopicMastery } from '../hooks/useMastery';
import { formatTopicKey } from './topicLabels';

// ── Shareable Progress Card — derivation ──
// plans/shareable-progress-card.md (growth loop 2).
//
// Derives the card payload for the ACTIVE child from a rolling 30-day
// window of questionResults — the same per-question data the parent
// dashboard already loads via useD1Data (userData.questionResults). One
// source, three numbers: a row = a question attempted, its date buckets
// into a practice day, its topicKey buckets into a topic explored.
//
// HARD EXCLUSION (adversarial review outcome #2 / plan §1, "the card
// celebrates effort, never ability"): the returned object contains ONLY
// firstName, questionsAnswered, daysPractised, topicsExplored — no score,
// accuracy, percentage, readiness, rank, weak-topic, or surname data ever
// flows through this function. See the forbidden-fields test in
// progressCard.test.js, which asserts this at the object-shape level so a
// future edit can't quietly reintroduce one of those fields.
//
// Day bucketing is done in Europe/London (adversarial review outcome #8),
// not the reader's device timezone and not a naive UTC date-string split.
// questionResults[].date is a full ISO timestamp (see quizOrchestration.js /
// useD1Data.js transformServerData) — the same UTC instant reads as a
// different LOCAL calendar day either side of midnight once BST (UTC+1) is
// in effect, so a plain `.slice(0, 10)` on the UTC string misattributes any
// question answered between roughly 00:00-01:00 BST to the previous day.
// Intl.DateTimeFormat with an explicit timeZone is DST-safe by construction
// (the browser's ICU tables own the March/October transition dates; no
// manual offset maths here) — see the DST-boundary test.
//
// ── Growth band (Ben, 17 Jul afternoon revision) ──
// Two OPTIONAL additions to the payload, both POSITIVE-ONLY deltas (never
// absolute ability data — see the updated forbidden-fields tests):
//
//   clickedTopics — topic display names that crossed INTO 2-or-more mastery
//   stars within the 30-day window (Ben's tightened rule, 17 Jul evening: the
//   app awards 1 star for as little as one correct answer, so a 0->1
//   crossing is a topic touched for the first time this month, not a topic
//   that genuinely "clicked" — it must not count). 1->2, 2->3 and 0->2 all
//   count; 0->1 does not. Computed by calling useMastery's own pure scoring
//   core (computeTopicMastery, imported from ../hooks/useMastery — a
//   deliberate reuse, not a duplicate: this file does not know or encode the
//   90/76/56/31/1 score bands itself) twice per topic: once with only the
//   results dated on/before the window start (the "before" snapshot) and
//   once with results on/before "now" (the "after" snapshot). If the derived
//   star count increased AND landed at 2 or more stars, that topic "clicked"
//   this window. This is an honest simulation of "what the app would have
//   shown a parent 30 days ago", not a new metric — it reuses the exact
//   thresholds already visible elsewhere in the app (mastery stars). Capped
//   at 3, ranked by the size of the star jump.
//
//   subjectImprovement — at most one { subject, upPercent }: the RELATIVE
//   accuracy improvement of this 30-day window vs the previous 30-day
//   window, gated on minimum sample sizes and a minimum previous-window
//   accuracy (guards against tiny-base absurd relative jumps). Never shown
//   as an absolute score — only ever the delta.

export const PROGRESS_CARD_WINDOW_DAYS = 30;
export const MIN_PRACTICE_DAYS_TO_SHOW = 3;
export const MAX_CLICKED_TOPICS = 3;
export const MIN_SUBJECT_WINDOW_ATTEMPTS = 30;
export const MIN_PREVIOUS_WINDOW_ACCURACY = 0.30;
export const MIN_RELATIVE_IMPROVEMENT = 0.10;

const SUBJECT_DISPLAY_LABELS = {
  maths: 'Maths',
  english: 'English',
  verbalreasoning: 'Verbal Reasoning',
};

const LONDON_TZ = 'Europe/London';
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// en-CA locale formats as YYYY-MM-DD directly, so no manual
// day/month/year reassembly from formatToParts is needed.
const londonDayFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: LONDON_TZ,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const londonMonthFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: LONDON_TZ,
  month: '2-digit',
});

/**
 * The YYYY-MM-DD calendar day `isoDate` falls on as read on a clock in
 * London — correct across the BST/GMT boundary regardless of the reader's
 * own device timezone. Returns null for an unparseable date.
 */
export function londonDateString(isoDate) {
  const d = isoDate instanceof Date ? isoDate : new Date(isoDate);
  if (Number.isNaN(d.getTime())) return null;
  return londonDayFormatter.format(d);
}

function topicKeyToSubject(topicKey) {
  for (const [subject, topics] of Object.entries(SUBJECT_TOPICS)) {
    if (topics.includes(topicKey)) return subject;
  }
  return null;
}

/**
 * The mastery star count useMastery's own scoring core would have reported
 * for this topic's results, as of `asOfDate` — i.e. only counting rows dated
 * on/before that instant. Reused (not duplicated) thresholds: computeTopicMastery
 * already applies getMasteryLevel internally.
 */
function starsAsOf(resultsForTopic, asOfDate) {
  const filtered = resultsForTopic.filter(r => {
    const d = new Date(r.date);
    return !Number.isNaN(d.getTime()) && d <= asOfDate;
  });
  return computeTopicMastery(filtered, asOfDate.getTime()).stars;
}

/**
 * Topic display names that crossed INTO 2-or-more mastery stars within the
 * rolling window — Ben's "clicked this month" concept, tightened so a topic
 * touched for the first time this month (0->1 star, trivially reached with
 * a single correct answer) never qualifies. Compares the star count
 * useMastery would derive as of the window start vs as of now, per topic,
 * using ALL history available for that topic (not just in-window rows) so
 * the "before" snapshot reflects genuine prior mastery, not a reset. Capped
 * at MAX_CLICKED_TOPICS, ranked by the size of the jump.
 *
 * @param {Array} questionResults - full per-question history for the active
 *   child (same input as deriveProgressCardData).
 * @param {{ now?: Date }} [options]
 * @returns {string[]} display names, e.g. ['Fractions', 'Letter Codes']
 */
export function deriveClickedTopics(questionResults, options = {}) {
  const now = options.now instanceof Date ? options.now : new Date();
  const cutoff = new Date(now.getTime() - PROGRESS_CARD_WINDOW_DAYS * MS_PER_DAY);

  const byTopic = {};
  for (const r of (questionResults || [])) {
    if (!r || !r.date || !r.topicKey) continue;
    const d = new Date(r.date);
    if (Number.isNaN(d.getTime()) || d > now) continue;
    if (!byTopic[r.topicKey]) byTopic[r.topicKey] = [];
    byTopic[r.topicKey].push(r);
  }

  const crossings = [];
  for (const topicKey of Object.keys(byTopic)) {
    const results = byTopic[topicKey];
    const beforeStars = starsAsOf(results, cutoff);
    const afterStars = starsAsOf(results, now);
    // Crossed INTO 2-or-more stars: an increase that lands at >=2 stars.
    // A 0->1 crossing (afterStars === 1) is excluded even though it's an
    // increase — see the file header and Ben's approved rule.
    if (afterStars > beforeStars && afterStars >= 2) {
      crossings.push({ topicKey, delta: afterStars - beforeStars, afterStars });
    }
  }

  crossings.sort((a, b) => (b.delta - a.delta) || (b.afterStars - a.afterStars));
  return crossings.slice(0, MAX_CLICKED_TOPICS).map(c => formatTopicKey(c.topicKey));
}

/**
 * At most one { subject, upPercent } — the best-qualifying subject's RELATIVE
 * accuracy improvement, this 30-day window vs the previous 30-day window.
 * Guards (all required to qualify): >=30 attempted questions in BOTH windows
 * for that subject; previous-window accuracy >=30% (so a tiny-base subject
 * can't report an absurd relative jump); relative improvement >=10%. Never
 * an absolute accuracy figure — only ever the delta, and only when positive.
 *
 * @param {Array} questionResults - full per-question history for the active child.
 * @param {{ now?: Date }} [options]
 * @returns {{ subject: string, upPercent: number } | null}
 */
export function deriveSubjectImprovement(questionResults, options = {}) {
  const now = options.now instanceof Date ? options.now : new Date();
  const windowStart = new Date(now.getTime() - PROGRESS_CARD_WINDOW_DAYS * MS_PER_DAY);
  const prevWindowStart = new Date(now.getTime() - 2 * PROGRESS_CARD_WINDOW_DAYS * MS_PER_DAY);

  const bySubject = {};
  for (const subjectKey of Object.keys(SUBJECT_TOPICS)) {
    bySubject[subjectKey] = { thisTotal: 0, thisCorrect: 0, prevTotal: 0, prevCorrect: 0 };
  }

  for (const r of (questionResults || [])) {
    if (!r || !r.date || !r.topicKey) continue;
    const d = new Date(r.date);
    if (Number.isNaN(d.getTime()) || d > now) continue;
    const subjectKey = topicKeyToSubject(r.topicKey);
    if (!subjectKey) continue;

    if (d >= windowStart) {
      bySubject[subjectKey].thisTotal += 1;
      if (r.correct) bySubject[subjectKey].thisCorrect += 1;
    } else if (d >= prevWindowStart) {
      bySubject[subjectKey].prevTotal += 1;
      if (r.correct) bySubject[subjectKey].prevCorrect += 1;
    }
  }

  let best = null;
  for (const [subjectKey, stats] of Object.entries(bySubject)) {
    if (stats.thisTotal < MIN_SUBJECT_WINDOW_ATTEMPTS) continue;
    if (stats.prevTotal < MIN_SUBJECT_WINDOW_ATTEMPTS) continue;

    const thisAccuracy = stats.thisCorrect / stats.thisTotal;
    const prevAccuracy = stats.prevCorrect / stats.prevTotal;
    if (prevAccuracy < MIN_PREVIOUS_WINDOW_ACCURACY) continue;

    const relativeImprovement = (thisAccuracy - prevAccuracy) / prevAccuracy;
    if (relativeImprovement < MIN_RELATIVE_IMPROVEMENT) continue;

    const upPercent = Math.round(relativeImprovement * 100);
    if (upPercent <= 0) continue; // positive-only, belt and braces
    if (!best || upPercent > best.upPercent) {
      best = { subject: SUBJECT_DISPLAY_LABELS[subjectKey], upPercent };
    }
  }
  return best;
}

/**
 * Derive the progress-card payload for the active child from questionResults
 * (as loaded by useD1Data / userData.questionResults), over a rolling
 * PROGRESS_CARD_WINDOW_DAYS-day window ending "now".
 *
 * @param {Array} questionResults - userData.questionResults for the active
 *   child (useD1Data already scopes all state to whichever child is active —
 *   see the childId param on the hook — so no per-row child filter is done
 *   here; this function trusts its caller to have already-scoped data, the
 *   same trust every other ParentDashboard card places in userData).
 * @param {string} firstName - the active child's display name (the existing
 *   `currentUser` prop already threaded through ParentDashboard, which is
 *   the active child's name, not the parent's — see App.js/AuthGate.js).
 * @param {{ now?: Date }} [options] - `now` is injectable for deterministic
 *   testing; defaults to the real current time.
 * @returns {{ firstName: string, questionsAnswered: number, daysPractised: number,
 *   topicsExplored: number, clickedTopics?: string[], subjectImprovement?:
 *   { subject: string, upPercent: number } }} clickedTopics and
 *   subjectImprovement are OMITTED entirely (not present as empty/null keys)
 *   when nothing qualifies — the forbidden-fields test asserts the base
 *   shape and that no ability-shaped field can ever appear.
 */
export function deriveProgressCardData(questionResults, firstName, options = {}) {
  const now = options.now instanceof Date ? options.now : new Date();
  const cutoff = new Date(now.getTime() - PROGRESS_CARD_WINDOW_DAYS * MS_PER_DAY);

  const daySet = new Set();
  const topicSet = new Set();
  let questionsAnswered = 0;

  for (const r of (questionResults || [])) {
    if (!r || !r.date) continue;
    const d = new Date(r.date);
    if (Number.isNaN(d.getTime()) || d < cutoff || d > now) continue;

    questionsAnswered += 1;
    const day = londonDateString(d);
    if (day) daySet.add(day);
    if (r.topicKey) topicSet.add(r.topicKey);
  }

  const clickedTopics = deriveClickedTopics(questionResults, { now });
  const subjectImprovement = deriveSubjectImprovement(questionResults, { now });

  return {
    firstName,
    questionsAnswered,
    daysPractised: daySet.size,
    topicsExplored: topicSet.size,
    ...(clickedTopics.length > 0 ? { clickedTopics } : {}),
    ...(subjectImprovement ? { subjectImprovement } : {}),
  };
}

/**
 * Whether the card is worth showing at all — an empty (or near-empty) card
 * is a sad card (plan §5). Threshold is on days practised, not questions
 * answered, so a single long cram session doesn't qualify a card that
 * doesn't actually represent a habit.
 */
export function shouldShowProgressCard(cardData) {
  return !!cardData && cardData.daysPractised >= MIN_PRACTICE_DAYS_TO_SHOW;
}

/**
 * Seasonal title skin (plan §1): "Summer of Prep" June-September inclusive,
 * evaluated in Europe/London so the skin doesn't flip a day early/late for
 * a UK reader relative to a server or device clock in another timezone.
 *
 * The possessive uses a typographic (curly) apostrophe — this string is a
 * designed artefact rendered large on the card, where a straight ASCII
 * quote reads cheap (Fable review fix 5). The fallback is "My child",
 * capitalised, because this string always opens the title line (fix 4);
 * mid-sentence copy (the share text) has its own lowercase "my child"
 * fallback in progressCardExport.js.
 */
export function progressCardTitle(firstName, options = {}) {
  const now = options.now instanceof Date ? options.now : new Date();
  const month = parseInt(londonMonthFormatter.format(now), 10); // 1-12
  const isSummer = month >= 6 && month <= 9;
  const name = firstName || 'My child';
  return isSummer ? `${name}’s Summer of Prep` : `${name}’s month of prep`;
}
