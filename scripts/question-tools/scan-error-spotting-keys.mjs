#!/usr/bin/env node
/**
 * scan-error-spotting-keys — mechanical guard against mis-keyed error-spotting
 * questions (the Q292 bug class: the `correct` field points at a segment that
 * does NOT contain the error the explanation describes).
 *
 * Heuristic (dependency-free, spelling-only strict check):
 *   For every 'spelling'-topic question with questionType === 'error-spotting'
 *   whose keyed answer is a real section (not the "No mistake" option), pull
 *   every full single-quoted string out of the explanation (these are always
 *   either the misspelled word/phrase or its correction, e.g. 'gaurantee',
 *   'stomack ake', 'you're', 'whose diary') and check whether ANY of them
 *   appears as a case-insensitive SUBSTRING of the keyed segment. Substring
 *   matching (rather than word-splitting) is what makes this work for quoted
 *   strings containing apostrophes ("you're") or spaces ("stomack ake")
 *   without those characters getting mangled by tokenisation.
 *
 *   Checking every quoted string rather than just the first is deliberate:
 *   most explanations say "'error' should be 'correction'" (error quoted
 *   first), but a few reverse it — "should be 'correction' ... not 'error'"
 *   (id 37: "Section D should be 'whose diary' ... not 'who's diary'.") —
 *   quoting the correction first. Checking only the first quoted string
 *   would false-flag id 37 even though it is correctly keyed (the error
 *   "who's diary" genuinely is in the keyed segment). Checking all quoted
 *   strings is robust to either phrasing while still catching real mis-keys:
 *   in every confirmed bug (ids 292/137/255 pre-fix) NEITHER the error NOR
 *   the correction appears in the wrongly-keyed segment, so both quoted
 *   strings correctly miss and the question is still flagged.
 *
 *   Quoted strings shorter than MIN_QUOTE_LEN (2) are discarded before
 *   matching. Some explanations quote a single letter as a memory aid rather
 *   than the error itself (id 255: "There is no 'i' before the 'ent':
 *   magnif-I-CENT."). A 1-character quote like 'i' will trivially
 *   substring-match almost any segment by coincidence — caught in testing:
 *   reverting id 255's fix to its old wrong index and re-running the
 *   scanner failed to flag it, because 'i' happened to appear in the
 *   (wrong) keyed segment "aquarium and saw". Dropping single-character
 *   quotes removes that false-negative risk while still keeping short real
 *   misspellings usable (e.g. 'too'/'to', 'our'/'hour', 'wen'/'when').
 *
 * Why only 'spelling' gets a hard fail:
 *   Punctuation/grammar error-spotting explanations quote RULE words (e.g.
 *   'when', 'where', 'how', or the corrected form rather than the error) —
 *   they don't quote segment text at all, so there is nothing reliable to
 *   substring-match against. Flagging those would be pure noise. For any
 *   topic other than 'spelling' this script only prints an informational
 *   count — it never asserts and never affects the exit code.
 *
 * The "correct index has no matching segment" check is topic-independent
 * (a structural bounds bug, not a heuristic) and remains a hard flag for
 * every topic.
 *
 * This is a REVIEW/regression tool, not a proof for anything outside
 * 'spelling'. Exit non-zero only on a hard flag (spelling mis-key or a
 * structural out-of-range `correct` index), so it can gate CI.
 *
 * Usage:  node scripts/question-tools/scan-error-spotting-keys.mjs
 */
'use strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { pathToFileURL } from 'url';

const DATA_FILES = ['mathsData', 'englishData', 'vrData'];
const STRICT_TOPIC = 'spelling';
const MIN_QUOTE_LEN = 2; // discard single-character memory-aid fragments (e.g. 'i') — see header comment

const load = async (f) => {
  const tmp = path.join(os.tmpdir(), f + '.scan.mjs');
  fs.copyFileSync(path.join('src', 'questionData', f + '.js'), tmp);
  return (await import(pathToFileURL(tmp).href)).default;
};

// Every full single-quoted string in the explanation, in order, e.g.
// "'gaurantee' should be 'guarantee'." -> ["gaurantee", "guarantee"]
// "'you're' should be 'your'. ... 'You're' is short for 'you are'." ->
//   ["you're", "your", "You're", "you are"]
const allQuoted = (text) =>
  [...(text || '').matchAll(/'([^']+)'/g)].map((m) => m[1]);

const containsSubstring = (segment, quoted) =>
  !!segment && !!quoted &&
  segment.toLowerCase().includes(quoted.toLowerCase());

(async () => {
  const hardFlags = [];
  const infoSkipped = []; // non-spelling topics we can't verify — informational only
  let scanned = 0;

  for (const f of DATA_FILES) {
    const mod = await load(f);
    for (const key of Object.keys(mod.topics)) {
      for (const q of mod.topics[key].questions) {
        if (q.questionType !== 'error-spotting') continue;
        scanned++;

        const noMistakeIdx = (q.options || []).findIndex(
          (o) => /no mistake/i.test(o)
        );
        // Keyed answer is "No mistake" — no segment error expected, skip.
        if (q.correct === noMistakeIdx) continue;

        const segment = (q.segments || [])[q.correct];
        if (segment == null) {
          // Structural bug — always a hard flag, regardless of topic.
          hardFlags.push({ f, key, id: q.id, reason: 'correct index has no matching segment', segment, q });
          continue;
        }

        if (key !== STRICT_TOPIC) {
          // Can't verify non-spelling explanations against segment text
          // (they quote rule words, not the error) — informational only.
          infoSkipped.push({ f, key, id: q.id });
          continue;
        }

        const quoted = allQuoted(q.explanation).filter((w) => w.length >= MIN_QUOTE_LEN);
        if (!quoted.length) {
          // No usable quoted string to check against — nothing to verify, skip.
          infoSkipped.push({ f, key, id: q.id });
          continue;
        }

        const hit = quoted.some((qw) => containsSubstring(segment, qw));
        if (!hit) {
          hardFlags.push({
            f, key, id: q.id,
            reason: 'no quoted word/phrase from the explanation appears in the keyed segment',
            keyedSegment: segment,
            quoted,
            segments: q.segments,
            explanation: q.explanation,
          });
        }
      }
    }
  }

  console.log(`Scanned ${scanned} error-spotting questions.`);
  console.log(`  strict ('${STRICT_TOPIC}'): checked against segment text.`);
  console.log(`  informational (other topics / unquoted): ${infoSkipped.length} skipped — not hard-checkable, never flagged.`);

  if (!hardFlags.length) {
    console.log(`\n✔ No mis-keyed '${STRICT_TOPIC}' questions found (and no structural index errors anywhere).`);
    process.exit(0);
  }

  console.log(`\n✖ ${hardFlags.length} question(s) hard-flagged:\n`);
  for (const fl of hardFlags) {
    console.log(`  [${fl.f} / ${fl.key} / id ${fl.id}] ${fl.reason}`);
    if (fl.segments) fl.segments.forEach((s, i) => console.log(`      ${i}: ${JSON.stringify(s)}`));
    if (fl.keyedSegment !== undefined) console.log(`      keyed segment: ${JSON.stringify(fl.keyedSegment)}`);
    if (fl.quoted) console.log(`      quoted strings: ${JSON.stringify(fl.quoted)}`);
    if (fl.explanation) console.log(`      explanation: ${fl.explanation}`);
    console.log('');
  }
  process.exit(1);
})();
