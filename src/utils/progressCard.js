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

export const PROGRESS_CARD_WINDOW_DAYS = 30;
export const MIN_PRACTICE_DAYS_TO_SHOW = 3;

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
 * @returns {{ firstName: string, questionsAnswered: number, daysPractised: number, topicsExplored: number }}
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

  return {
    firstName,
    questionsAnswered,
    daysPractised: daySet.size,
    topicsExplored: topicSet.size,
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
