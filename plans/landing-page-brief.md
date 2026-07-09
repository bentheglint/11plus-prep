# PrepStep Landing Page — Advisory Synthesis & Build Brief

**Date:** 9 July 2026
**Status:** DRAFT for Ben's sign-off (no code written yet)
**Inputs:** Marketing & Growth Council, 11+ Oracle, Council of EdTech Elders
(Sal Khan, Luis von Ahn, Daphne Koller), and a live-codebase feature audit.

Copy rules for anything on this page: British English, no em dashes, only
claims the product genuinely does, real-company tone (never one-man-band).

---

## 1. The one thing all six advisors agreed on

Independently, from six different lenses, the same answer came back:

> **Lead with the pedagogy: PrepStep teaches before it tests, and closes the
> loop on what the child gets wrong. Do NOT lead with the question count.**

- **Sal Khan:** "PrepStep won't let a child move on from something they haven't
  actually understood." Mastery learning, 50 years of evidence. Volume is a
  vanity metric that signals a firehose.
- **Luis von Ahn:** The compulsory micro-lesson before each quiz "is your real
  moat." Content is table stakes; a parent can't evaluate a number that big.
- **Daphne Koller:** "A bank of 8,210 questions is a commodity. What is
  defensible and genuinely good for the child is the pedagogical architecture."
  Retrieval practice + spacing have the strongest independent evidence base in
  learning science, and you can claim the *method* honestly on day one.
- **The Oracle:** Ranked the real features by genuine exam-outcome value.
  Tier 1 = teach-then-test micro-lessons + mistake re-practice. The question
  bank is "credibility ballast, not the marquee."
- **The Marketing Council:** "Teaches, not just tests" is the eight-word
  contrast a book-buying or Atom-considering parent feels intuitively. It
  states the one true difference competitors can't easily claim.

**Implication:** the emotional promise and headline are about *teaching*, and
the 8,210 questions / 1,137 diagrams become proof of depth *behind* the method,
never the headline.

---

## 2. The surprise: what the codebase says is genuinely un-copyable

The live audit graded every feature as SHIPPED-AND-LIVE vs BUILT-BUT-DARK and
judged uniqueness against Atom, CGP, Bond, 11 Plus Lift, Exam Papers Plus.
The strongest, hardest-to-copy assets, ranked:

1. **Compulsory taught micro-lesson before every Focused Learning quiz**
   (RARE/UNIQUE). The routing is hard-coded: a child physically cannot skip
   the lesson to reach the quiz. This is the pedagogy the whole council
   endorsed, and it is real and verifiable.
2. **A free tutor CRM bundled inside the consumer app** (RARE/UNIQUE, "the
   single most distinctive thing in the codebase"). Independent 11+ tutors get
   a free portal: pupil roster with at-risk flags, topic homework assignment,
   parent messaging, progress reports. Parents pay; tutors are free. Maps
   directly to the UK reality that most 11+ prep runs through a local private
   tutor. NOTE: this is a tutor-facing weapon (Loop 3), see decision B below.
3. **AI tutor with a structural "no-spoiler" rule** (RARE/UNIQUE). While a
   question is unanswered, the tutor is instructed to refuse to give the answer
   even if the child begs, and gives only method hints. The instant the child
   commits, it explains fully and warmly. This is in the actual system prompt,
   not UI copy, so it's a specific, testable, honest claim.
4. **Leitner spaced repetition woven silently into Daily Learning** (UNCOMMON).
   Wrong answers resurface on a 1/3/7/14-day schedule inside normal practice,
   with no review list for the child to manage.
5. **My Mistakes as a living, self-correcting list** (UNCOMMON). Shows only
   what's *still* wrong right now; fixing a mistake removes it, so a child is
   never punished by seeing an error they've since corrected.
6. **Parent Dashboard + Child View off one shared engine** (UNCOMMON).
   Exam-readiness bands + plain-English "what to do next" reasoning
   ("Last practised 14 days ago, time for a refresher before it fades"),
   not a stats wall.
7. **8,210 GL-pattern questions with 1,137 hand-built SVG diagrams** (proof of
   depth, not a headline).
8. **Free access for Free School Meals / Pupil Premium families** (on request).

---

## 3. The one real tension, and how it resolves

- The **learning-science advisors** treat the AI tutor as handle-with-care.
  Daphne specifically: don't claim tutor *quality* or "personalised" until its
  explanations are validated against real child misconceptions.
- The **Marketing Council** says make the AI tutor the *hero visual*, because
  it's the one differentiator a parent can instantly feel in a screenshot and
  that books, tutors and Atom structurally can't match.

**Resolution:** lead the *message* with the pedagogy everyone agrees is honest
and durable (teach-then-test), and use the tutor as the most vivid *proof*,
described by what it verifiably DOES, not by a quality claim:

- SAY: "A patient tutor is built in. It won't hand over the answer, it helps
  your child work it out, then explains it in plain words once they've tried."
- DON'T SAY: "personal tutor that knows your child", "as good as a human
  tutor", or any efficacy/quality claim.

This satisfies the Marketing Council's "make it feelable" and Daphne's
"don't overclaim" at the same time.

---

## 4. The emotional spine (the Oracle's contribution)

The 11+ parent carries two fears, not one:
- **Outcome fear:** "what if my child doesn't get in and I didn't do enough."
- **Process fear:** "what if I'm the one making this miserable and damaging
  them." The slide into becoming "the Enforcer," where the 11+ becomes the
  biggest source of conflict in the house. Underneath: a quiet fear of
  *stealing their child's childhood*.

So the page's job is to **lower the parent's temperature while proving
substance.** Warm, plain, specific, honest. A knowledgeable ally, not a
salesperson and not a scaremonger. The single boldest, almost-unclaimed
position available (from desirable-difficulties research): good practice
sometimes feels hard, and that's how you know real learning is happening.
Optional confident-honesty line if we're brave: *"Good practice sometimes
feels hard. That's how you know it's working."*

### Hard avoids (all six advisors, unanimous)
- Guaranteed-pass or "get into grammar school" claims.
- Fabricated efficacy stats ("3x faster", "one grade in six weeks") until we
  have real cohort data. First exam is Sept 2026, so we have none yet.
- Fear / scarcity framing ("don't let your child fall behind", "limited places").
- Intelligence / "gifted" framing (backfires, Dweck).
- Volume as the headline ("8,210 questions!").
- Fake urgency, stock photos of grinning children, unearned "as seen in" logos,
  generic testimonials.

---

## 5. Accuracy watch-outs from the audit (fix BEFORE any copy ships)

- **Stale numbers in production.** `src/components/SubscribeScreen.js` hard-codes
  "6,682 questions" and "584 micro-lessons". Reality is 8,210 questions and
  600+ lessons. This live paywall copy undersells the product. Fix it and pull
  all numbers from `node scripts/count-content.js`, never from SubscribeScreen.
- **Lesson count is ambiguous** (614 in CLAUDE.md vs 956 "lesson entries" from
  the count script). Use **"600+ micro-lessons"** until the true unique count
  is confirmed.
- **Do not name the exam board.** Bournemouth moves GL to Quest Assessment from
  Sept 2026. Say "the 11+ for grammar schools in the Bournemouth and Poole
  area", name the schools and the exam, never "GL-ready".
- **FSM/Pupil Premium free access is manual** (email + admin flag), not
  automatic. Frame as "free for FSM/Pupil Premium families on request".
- **Voice input for the tutor is Chrome/Edge only.** Don't imply universal voice.
- **No usage/outcome data yet.** Claim mechanism, not results.

---

## 6. The core message (recommended)

> **PrepStep teaches your child the 11+ first and tests them second, with a
> patient tutor built in to explain anything they get stuck on, every day, for
> a fraction of the cost of tuition.**

The wedge, in the parent's own decision terms:
- **Books / free question banks** test knowledge the child was never taught,
  and the parent often can't help (especially verbal reasoning).
- **A private tutor** teaches brilliantly but costs ~£30-40/hour, comes once a
  week, and is gone by Tuesday.
- **Atom Learning** is an excellent adaptive drilling engine at ~£40-70/month,
  but doesn't sit beside the child and explain a wrong answer in plain words
  on demand.

PrepStep's wedge = **teach-then-test pedagogy + an on-demand tutor**, i.e. the
way good tutoring works, delivered daily, at book prices.

### Headline — LOCKED (9 Jul)
- **"11+ prep that teaches before it tests."**
  Sub: "Every session starts with a short lesson, and a patient tutor is on hand
  to explain anything your child finds tricky."
  Chosen for rhythm + honesty; the teaches/tests alliteration carries the
  contrast without the clunky "not just" construction. Copy standard for this
  page: our prose must SING, never read as clunky word-bot filler.

### Rejected / alternate headlines (kept for reference)
- "11+ prep that teaches your child, not just tests them." (clunky "not just")
- "Finally, 11+ prep that actually teaches." (warm, relief-led alt)
- "Like having a patient 11+ tutor at home, every day." (tutor-led alt)
- **B (tutor-at-home):** "A patient 11+ tutor for your child, every day of the
  week." Sub: "Teaching, practice and instant explanations in one place, for a
  fraction of the cost of private tuition."
- **C (it clicks):** "11+ practice that finally clicks for your child."
  Sub: "Over 8,000 questions, a short lesson before every quiz, and a tutor
  built in to explain every answer in words a ten-year-old understands."
- **D (calm confidence):** "Grammar school prep, taught properly. Practised
  daily." Sub: "We teach each idea first, then help your child practise it,
  with explanations on hand whenever they get stuck."

---

## 7. Trust architecture (ranked, from Marketing Council + Oracle)

1. **Specificity to the real exam and local schools** (named schools, the
   Bournemouth/Poole area, the actual 11+). No test-board name.
2. **Real, specific parent testimonials** with relief-language ("she stopped
   dreading verbal reasoning"), real attribution, never stock quotes.
   (Gap: we may not have these yet, see decision C.)
3. **Pedagogy + content credibility framed as a company of educators.** Method,
   content standard, teacher-quality explanations. Kills the hobby-project read.
4. **Risk reversal:** free to start, no card to begin, cancel in two taps, clear
   money-back window on paid. (Never a pass guarantee.)
5. **Visible child-safety and privacy:** UK GDPR line, no ads, a safe
   purpose-built AI tutor for children. Parents WILL look for this.
6. **Substance-as-proof numbers:** 8,210 questions, 600+ lessons, full timed
   mocks, as evidence of depth, not the headline.

---

## 8. Conversion mechanics (Marketing Council)

- **Reverse trial**: full access for the trial window, then revert to the capped
  free tier. Weaponises loss aversion honestly (by trial end the child has
  streaks, mastery and a My Mistakes list they don't want to lose).
- **No credit card to start.** For cold, cautious first-touch parents the
  bottleneck is trust and reach, not conversion efficiency. Convert later via
  activation + loss aversion, not a card wall on a stranger.
- **CTA:** "Start free, no card needed." Micro-trust line under it: "Free to
  start. Cancel any time. No card to begin."
- **Let them see it before committing.** A live, playable sample question on the
  page with the tutor explaining the answer, no signup. "Show, don't adjective"
  (Luis). Gate only progress/personalisation behind the free signup.
- **Price framed against tuition, not against free apps:** "A private tutor near
  you is around £30 to £40 an hour. PrepStep is £24.99 a month, or £199 for the
  year." (SubscribeScreen already runs an Atom comparison at £671.90/yr.)

---

## 9. Page structure (section by section)

1. **Hero** — promise headline + mechanism subhead + the tutor-explaining-a-
   question visual + one CTA + micro-trust line.
2. **Trust strip** — local-schools specificity + one real parent quote +
   substance numbers.
3. **The problem, told with empathy and zero guilt** — tools failing the child
   (books test what wasn't taught; tutors cost a fortune and vanish till next
   week). Never the parent failing the child (Mumsnet guardrail).
4. **How it works, three steps** — Teach (short lesson) -> Practise -> Tutor
   explains anything they're stuck on. Real screenshots. Most design love here.
5. **What's inside** — 8,210 questions across Maths/English/VR, 600+ teaching
   lessons, full timed mocks, mastery tracking, My Mistakes.
6. **For parents** — the Parent Dashboard: see strengths and gaps without
   hovering. Sells the parent calm oversight (the buyer's section).
7. **Social proof** — 2-3 real testimonials, relief-and-confidence language.
8. **Pricing** — transparent, value-anchored against tuition, cancel-any-time.
9. **FAQ** — which schools/exam, is the AI tutor safe for children, data &
   privacy, cancelling, devices.
10. **Final CTA** — repeat the promise + "Start free, no card needed."
11. **Footer** — real company signals: contact, privacy, safeguarding, company
    name.

---

## 10. Design direction (for requirements 1 & 4: beautiful + unique)

The category's visual defaults are either **exam-scary/clinical** or
**garish-cartoon-kids**. The distinctive, on-brand move is to go the opposite
way: **calm, warm, premium, editorial**, with real product moments instead of
stock imagery. Calm IS the differentiator (the Oracle: the parent's calm is the
child's calm), and calm-but-substantial is what a discerning UK parent reads as
"real, serious company."

**Proposed signature motif:** the *step* in PrepStep. A subtle visual
progression / rising-step through-line that ties the name to the pedagogy
(teach -> practise -> understand). Used lightly in the hero, the 3-step section,
and section transitions. This gives the "well thought through, not cookie-cutter"
uniqueness Ben wants without gimmickry.

**Hero device:** show the actual no-spoiler tutor moment (child tries, tutor
nudges, child commits, tutor explains) as the live/animated centrepiece, not a
photo. The product IS the proof.

Build the design with the frontend-design + ui-ux-guide skills, Visual QA every
breakpoint, and a cold-parent read-through at the end.

---

## 11. How this maps to Ben's six requirements

1. **Beautiful** -> calm premium editorial aesthetic + real product moments.
2. **Simple to read** -> one benefit headline, three-step mechanism, short
   sections, minimal copy (elders + Oracle all warn against clutter).
3. **Screams trust** -> the whole Section 7 trust architecture: local-school
   specificity, safeguarding line, risk reversal, real-company framing, honesty.
4. **Unique** -> the "step" motif + calm-against-the-category positioning + the
   no-spoiler tutor as a claim nobody else makes.
5. **Sings what nobody else has** -> teach-then-test (compulsory, hard-coded) as
   the message; no-spoiler tutor + living My Mistakes + silent spaced repetition
   as vivid proof; tutor CRM as a possible "works with your tutor" note.
6. **Clean path to signup** -> playable sample (no wall), single CTA, no card,
   reverse trial, transparent pricing anchored to tuition.

---

## 12. Decisions (locked 9 Jul)

- **A. Headline / voice.** Voice approved. "not just tests them" rejected as
  clunky (Ben: "we are wordsmiths not word bots"). Wordsmithing the hero line;
  final phrasing pending Ben's pick. See section 6 for the refined shortlist.
- **B. Tutor CRM placement — LOCKED.** Parent landing page is PARENT-ONLY.
  Build a SEPARATE tutor landing page (different incentives/benefits) that Ben
  sends as part of tutor outreach. No tutor CRM story on the parent page. The
  tutor page is a distinct build, tracked separately.
- **C. Testimonials — LOCKED.** Ben can get ~3 real parent quotes. Build a
  testimonials section with a PLACEHOLDER now, populate with 3 real,
  attributed, relief-language quotes before launch. Never fake ones.
- **D. Founder voice — LOCKED (lean first option).** Founder shows up as a
  credible expert on a mission, NOT a hobbyist. Reframe the existing paywall
  "a note from the parent who built this / an app I built" solo-signalling
  into founder-as-expert framing, and carry the SAME voice onto the new landing
  page so they're consistent. Warm founder story yes; one-man-band signal no.
  (Applies to `SubscribeScreen.js` sections ~142 and ~262-273; do in the
  founder-voice pass, alongside tidying the consumer-copy em dashes there.)
- **E. No exact numbers in marketing/conversion copy — LOCKED.** The question
  library keeps changing, so any precise count goes stale fast, and a wrong
  number in a conversion-critical place (the paywall/upgrade screen) is a
  trust-killer. Use durable phrasing instead: "thousands of questions",
  "hundreds of micro-lessons", "every VR question type", "all three subjects".
  Already applied to `SubscribeScreen.js`. The stale "6,682" (the ~6000s figure
  Ben saw after tapping Upgrade) is gone; Stripe's own payment page carries no
  count. If a live count is ever genuinely wanted, derive it from
  `scripts/count-content.js`, never hard-code it.

---

## 13. Recommended build sequence

1. Fix the stale numbers in `SubscribeScreen.js` (prep hygiene, low risk).
2. Lock the message (decision A) and the copy for each section (Oracle writes
   any question-facing copy; the councils' drafts seed the marketing prose).
3. Design the page with frontend-design + ui-ux-guide around the "step" motif.
4. Build as a standalone route decoupled from `AuthGate.js`.
5. Visual QA every breakpoint + a cold-parent read-through.
6. Wire the clean signup path (playable sample, single CTA, no card).
