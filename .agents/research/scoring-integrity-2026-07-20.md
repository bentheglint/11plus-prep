# Scoring Integrity Audit — Do PrepStep's tests flatter? (20 Jul 2026)

**Trigger:** Ben's daughter scored notably higher on PrepStep mock tests than on other providers' real mock papers → concern our tests flatter (score above true ability). This threatens the core marketing wedge ("honest, non-inflated progress" — Bet 3 of the marketing plan). **Until fixed, that claim must NOT be used in consumer copy.**

## Method
Two deterministic scripts over the real data + an 11+ Oracle benchmark (Opus):
- Mock difficulty distribution (500 simulated papers/subject).
- Answer-length bias (correct = longest option) across all banks.
- Oracle benchmark against GL research library (note: library has GL criteria/shapes, NOT actual mock papers — see gap).

## Finding 0 — the difficulty RAMP matters more than the ratio (Oracle, refined)
Real GL papers front-load gettable marks and **back-load a cluster of brutal, multi-step, time-starved items (the last 10-15 Qs)**. Our **Maths** mock sorts easy→hard (has a ramp), but **English SPaG and ALL of VR are random draws with NO ramp and no end-of-paper wall** — the child never hits the point where the paper turns on them. That flat back-half is a real flattener independent of the ratio. Fix: enforce a ramp in every subject (concentrate D3 in the final third) and give SPaG a difficulty target instead of a pure random draw. Ratio could nudge slightly steeper (~25/40/35) but re-anchoring the top band (Finding 2) matters far more.

## Finding 1 — Difficulty mix is NOT the problem
- Mock assembly: **Maths** targets 30/40/30 (D1/D2/D3); **English** comprehension curated (hard final third) + spelling/punct/grammar random; **VR** fully random. Bank ≈ 29/41/30 across subjects. Assembled mocks come out representative-or-slightly-HARDER by our labels.
- **Oracle verdict: 30/40/30 is CORRECT — it matches GL's documented house distribution. Do NOT steepen it.** So sampling/mix is not why mocks feel easy.

## Finding 2 — Real causes of flattery (ranked by Oracle)
1. **Answer-length tell (PROVEN, mechanical, top priority).** In **english/vocabulary the correct answer is the uniquely-longest option 46.2%** of the time (2.3× the 20% chance baseline); correct answers average 15.5 chars vs 11.6 for distractors (~34% longer). A test-wise child scores ~46% on vocab by picking the longest, with zero word knowledge. 452 vocab Qs; 329 of the 416 total "correct=longest" questions are English. **wordClassGrammar (21.6%), VR compoundWords (20.8%), rest of VR (~14%), Maths (~8%) are clean — leave them. This is a single-topic fire: English vocabulary.**
2. **Soft "difficulty 3" calibration (likely).** Our labels are internally consistent but may not be anchored to real GL hard. A GL D3 needs low-frequency words, close/morphological distractors, multi-step reasoning. If our D3 distractors are from different semantic fields, they're mislabelled-soft.
3. **Item reuse (possible).** If the child practised the exact mock items before in Daily/Focused Learning, the mock is a memory test; other providers' mocks are cold. Reserve a mock-only pool or exclude recently-seen items.
4. **Distractor quality generally (D2 + D3).** Distant distractors make elimination trivial.
5. **Conditions.** English mock gives **50 min but real Dorset English is 45 min** — we hand out ~11% more time on the half of the exam (comprehension + SPaG) where time pressure bites hardest. **Fix to 45 min.** Confirm **non-calculator** Maths; score blanks GL-style (guess everything); raw % is not a GL score ("80% = on track").
7. **Familiarity effect (partly inherent).** She practises on PrepStep content, so our phrasing/distractor-style/format are familiar; other providers' papers are cold. Structurally inflates our mock vs a cold paper. Fix: frame parent expectations — treat the PrepStep mock as a familiar-conditions ceiling and expect real GL SAS to land several points below it; weight cold other-provider papers as the more conservative predictor.
6. **Comprehension reading level** — GL pitches passages at Year 7–8; audit ours aren't easier.

## Prioritised remediation
1. **Fix the vocabulary answer-length tell.** Re-select DISTRACTORS to match the key's length (NEVER touch the correct answer); target longest-option-is-correct ≈ 20% bank-wide. **Oracle writes the replacement distractors** (content pipeline rule). ~329 English items, mostly vocabulary.
2. **Empirical D3 audit from D1 attempt data** (we already have it): compute per-item p-value (% correct among prepared children). D3 should sit **p ≈ 0.35–0.55**; any D3 with p > 0.75 is mislabelled soft. Add distractor-uptake analysis (a distractor taking ~0% is dead weight). Re-tier soft items; Oracle writes true-D3 replacements.
3. **Audit answer-POSITION distribution** (quick script): correct index should be ~even across A–E per topic, no local runs within a passage/block.
4. **Conditions fixes** (code): English 45 min, enforce non-calculator Maths, GL-style blank scoring, assemble VR in type-blocks with worked examples (authenticity), exclude recently-seen items from mock assembly.
5. **Other tells to audit:** grammatical-agreement giveaways in cloze, word-repetition cues, absolute-language cues in distractors, remove any all/none-of-the-above.

## Real mock papers — RESOLVED: gitignored, on the other machine
The papers DO exist but are machine-local and gitignored (never committed), so absent on this machine:
- `research/past-papers/PRACTICE-PAPER-ANALYSIS.md` (4 English + 4 VR real GL papers, scanned Feb 2026)
- `Examples for English and VR/` (scanned page images)
- `.gitignore` excludes: `/Examples for English and VR`, `/research/past-papers`, `/research/kingsbury`, `/Lesson Plan Examples`
The GL difficulty criteria in the tracked `.md` research were *derived from* these scans, so the distilled findings survive. To do a true item-by-item head-to-head: run the audit on the machine holding the scans, OR re-commit the scans to a private non-ignored path. **BUT the facility (p-value) audit on our own D1 answer data is the better validation anyway — it breaks the circular-labelling problem without needing the scans. Do that first.**

## Guarded tests (so calibration can't silently drift back)
Build these as repeatable scripts + tests in the style of `src/__tests__/integration/topicKeyConsistency.test.js`:
- Answer-length parity (correct=longest ≤ ~20% per topic).
- Answer-position balance (correct index ~even across A-E, no runs).
- "all/none of the above" scan (GL never uses; should be zero).
- Facility-distribution check once p-values are computed (D3 facility in 0.30-0.55 band).

## Ownership
Product/Claude thread (Thread B), parallel to acquisition. Oracle writes all replacement content. Fix before claiming "honest progress" in copy.
**Priority order:** (1) facility/p-value audit on D1 data (breaks circularity, cheap) + kill the vocabulary answer-length tell (Oracle-written distractors); (2) enforce ramp + SPaG difficulty target + English 45 min; (3) answer-position audit + guarded tests.
