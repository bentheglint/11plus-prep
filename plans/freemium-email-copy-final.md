# Final approved trial-email copy (Ben-approved 8 Jul 2026)

Source: Marketing & Growth Council draft, reviewed by Opus, edited per Ben's 3 decisions:
(1) preheader "After Friday" → "After your trial ends" (trial-end day is dynamic, not always Fri);
(2) "one overall accuracy figure" line kept as drafted (Ben's call);
(3) removed "It is genuinely just me" and any one-man-band signal (project PrepStep as a real,
trustworthy company; founder story is welcome, solo/hobby vibe is not — see
`feedback_prepstep_project_as_real_company` memory).

This is the ready-to-implement source for Change 5 in `freemium-phase0-prelaunch-changes.md`.
Implement into `workers/ai-tutor/routes/email.js` (`buildDay25Email` ~L387, `buildDay30Email`
~L430). No em dashes anywhere. Merge fields: {parentFirst}, {child}, {quizCount}, {streak},
{weakestTopic}, {weakestAccuracy}.

---

## EMAIL A — Day 25 (5 days before downgrade; parent still has full access)

**Subject (primary):** {child}'s full-access trial ends in 5 days
**A/B alt 1:** 5 days left to see exactly where {child} needs help
**A/B alt 2:** {child}'s weakest topic right now is {weakestTopic}
**Preheader:** After your trial ends, you will see the overall score, but not the topic holding {child} back.

**Body:**

Hi {parentFirst},

In five days, {child}'s 30-day full-access trial ends. I wanted to give you plenty of notice, and show you what {child} has built up so far.

{child} has completed {quizCount} quizzes and is on a {streak}-day streak. That is real momentum, and none of it goes anywhere.

Here is the part most parents want to hold on to. Right now you can see that {child}'s weakest topic is {weakestTopic}, where they are answering around {weakestAccuracy}% correctly. That one insight, knowing the exact topic that is holding them back, is the whole point of proper 11+ prep. It is the difference between practising harder and practising the right thing.

When the trial ends, {child} moves to the free plan and keeps learning every day. But the deep view (the per-topic strong-and-weak breakdown, the "what to work on next" recommendations, and how each topic is trending over time) is part of PrepStep Plus. On free, you will see one overall accuracy figure. You will not see that {weakestTopic} is where the help is needed.

PrepStep Plus keeps the full picture, and unlocks:
- The full Parent Dashboard: exactly which topics are strong, which are weak, and what to do next
- Unlimited practice, not one set a day
- Focused Learning on every topic (a short lesson, then a 10-question quiz)
- Timed Mock Tests and Challenge Mode
- The AI Tutor, on hand the moment {child} gets stuck
- Per-question drill-down and printable progress reports

**[PRICE BLOCK]** £24.99 a month, or £199 a year (you save £101). That is less than the cost of a single hour with a private tutor. Cancel any time, and the free plan always stays free.

**[PRIMARY CTA BUTTON: "Keep {child}'s full access"]**

**[FSM / PUPIL PREMIUM NOTE]** On Free School Meals or Pupil Premium? PrepStep Plus is free for your family, permanently. Just email hello@prepstep.co.uk and we will sort it. No card needed.

Thanks for giving PrepStep a proper try.
Ben

**Fallbacks (Email A):**
- streak = 0 or 1: drop the streak clause. Use "{child} has completed {quizCount} quizzes so far. That is real momentum, and none of it goes anywhere."
- quizCount = 0 OR no weakest-topic data: swap the two personalised paragraphs for "There are still five days of full access left, and it is the best time for {child} to try a Focused Learning lesson or a timed Mock Test. Those are the tools that show you exactly which topics need work, and they are part of PrepStep Plus once the trial ends." Keep everything from the feature list down.
- weakestAccuracy above ~80%: soften "holding them back" to "their next area to sharpen up".

---

## EMAIL B — Day 30 (trial ended; child now on free plan)

**Subject (primary):** {child} has moved to the free PrepStep plan
**A/B alt 1:** Nothing is lost: {child} keeps learning, free every day
**A/B alt 2:** {child}'s progress is safe, and free carries on
**Preheader:** Every quiz and every streak is kept. Here is what free includes, and what comes next.

**Body:**

Hi {parentFirst},

Reassurance first, because it matters: {child}'s trial has ended, and nothing has been lost. Every quiz, every badge, the streak, and all {quizCount} quizzes of history are exactly where you left them.

{child} is now on the free PrepStep plan, and will keep learning every single day: a fresh set of 10 mixed questions daily, with streaks, prep points and badges all still going. Their current {streak}-day streak carries straight on.

Free is genuinely free, and it stays that way. We built it so no child is ever locked out of practising, whatever a family can spend. That is a promise, not an offer that expires.

When you are ready for more, PrepStep Plus is there. The biggest thing it gives you back is the full Parent Dashboard: the per-topic breakdown that shows exactly where {child} is strong, where they are weak, and what to work on next. It is the difference between knowing {child}'s overall score and knowing the one topic that is quietly costing them marks.

Plus also reopens unlimited practice, Focused Learning on every topic, timed Mock Tests, Challenge Mode, the AI Tutor, and printable progress reports you can bring to a parents' evening.

**[PRICE BLOCK]** £24.99 a month, or £199 a year (you save £101). Less than the cost of a single hour with a private tutor. Cancel any time.

**[PRIMARY CTA BUTTON: "See {child}'s full progress"]**

**[FSM / PUPIL PREMIUM NOTE]** On Free School Meals or Pupil Premium? PrepStep Plus is free for your family, permanently. Just email hello@prepstep.co.uk. No card needed, and no awkward questions.

**[PERSONAL NOTE FROM BEN]** One more thing, {parentFirst}. I am Ben, PrepStep's founder. I would love to know how {child} has got on: what worked, what did not, and anything you would change. Hit reply and it comes straight to me, and I read every message.

Ben

**Fallbacks (Email B):**
- streak = 0 or 1: drop the streak sentence. Use "{child} is now on the free PrepStep plan, and will keep learning every single day: a fresh set of 10 mixed questions daily, with streaks, prep points and badges all still going."
- quizCount = 0: replace the opening reassurance with "Reassurance first: {child}'s trial has ended, but nothing is lost and nothing is deleted. The moment {child} is ready, a fresh set of 10 questions is waiting, free every day." Keep the rest.

---

## Edits applied to the council draft (record)
- Email A preheader: "After Friday" → "After your trial ends".
- Email B: "We built it so no child is ever locked out" (was "I built it") — company voice.
- Email B personal note: removed "I built PrepStep here in Bournemouth. It is genuinely just me." Now "I am Ben, PrepStep's founder." Kept the founder reply-to-me trust signal; dropped the solo/hobby signal.
- Everything else as the council delivered it.
