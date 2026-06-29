/**
 * SEO/AEO practice-page generator for PrepStep.
 *
 * Generates public/practice/<subject>/<topic>.html as fully self-contained
 * HTML files (no external deps, works in file:// mode).
 *
 * Toolchain:
 *   - sucrase (registerJS + registerJSX) — lets us require() CRA-style ES modules + JSX
 *   - jsdom — satisfies the document.createElement side-effect in visuals.js at module load
 *   - ReactDOMServer.renderToStaticMarkup — SSR for diagram components
 *
 * Usage:
 *   node scripts/generate-practice-pages.js          # generates fractions only (default)
 *   node scripts/generate-practice-pages.js --all    # generates all configured topics
 *
 * To extend to all 16 maths topics: add an entry to TOPICS_CONFIG below.
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ── Repo root (two levels up from scripts/) ──────────────────────────────────
const ROOT = path.resolve(__dirname, '..');

// ── 1. Bootstrap jsdom BEFORE requiring visuals.js ───────────────────────────
//    visuals.js calls document.createElement at module load time; jsdom
//    satisfies this. global.navigator is read-only in Node 24 — leave it alone.
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>');
global.document = dom.window.document;
global.window   = dom.window;

// ── 2. Register sucrase so require() handles JSX + CRA-style ES modules ──────
const { registerJS, registerJSX } = require('sucrase/dist/register');
registerJS();
registerJSX();

// ── 3. Load shared modules ────────────────────────────────────────────────────
const React          = require('react');
const ReactDOMServer = require('react-dom/server');
const mathsData      = require(path.join(ROOT, 'src/questionData/mathsData')).default;
const visuals        = require(path.join(ROOT, 'src/microLessons/visuals'));

// ── 4. Topic configuration ────────────────────────────────────────────────────
//    Each entry defines which questions to show and the Oracle-written content.
//    To add more topics: copy the fractions entry and fill in the fields.

const TOPICS_CONFIG = {
  fractions: {
    subject:      'maths',
    topicKey:     'fractions',
    topicLabel:   'Fractions',
    subjectLabel: 'Maths',
    canonical:    'https://prepstep.co.uk/practice/maths/fractions',

    // IDs of the 5 questions to feature, in display order.
    // Must span D1→D3 and include at least one visual question.
    questionIds: [2, 1, 3, 23, 136],

    // Oracle-written intro (hero body text)
    intro: `In the GL Assessment 11+ maths paper, fractions are tested right the way through, both as quick standalone calculations and woven into longer, multi-step word problems, and they sit inside the most heavily weighted part of the whole paper. Number questions, the family that includes fractions, are the single most common type in a GL maths paper: roughly five times more frequent than any other category. Put simply, a child who is shaky on fractions will feel it across the exam, not just in one or two questions.

The GL maths paper is 50 multiple-choice questions in 50 minutes (about a minute each), with five answer options (A to E) for every question. Fractions rarely appear in isolation; GL loves to combine them with decimals, percentages, money, measurement and pie charts in a single question.

The good news: fractions are learnable and predictable. The skills GL tests are well-defined, and steady, focused practice on the right question types builds real confidence before exam day.`,

    // Oracle-written GL topic breakdown
    topicBreakdown: {
      intro: 'Fractions in the GL 11+ maths paper are always multiple-choice (five options, A–E). Across a paper you can expect these sub-skills, in roughly this order of frequency:',
      items: [
        'Finding a fraction of an amount (the most common, e.g. 3/8 of 416): around a fifth of fraction questions',
        'Equivalent fractions and simplifying to lowest terms',
        'Adding and subtracting fractions, including different denominators and mixed numbers',
        'Converting between fractions, decimals and percentages (FDP), which appears in almost every paper',
        'Comparing and ordering fractions, including fractions greater than 1',
        'Multiplying and dividing fractions',
        'Mixed numbers and improper fractions: converting between the two',
        'Multi-step word problems in real-world contexts (money, recipes, sharing)',
      ],
      footnote: 'Difficulty spans easy single-step calculations through to multi-step, working-backwards problems. GL papers are not adaptive: every child sits the same paper, and questions broadly progress from easier to harder as you move through it.',
    },

    // Oracle-written common pitfalls (4 items)
    pitfalls: [
      {
        lead: 'Taking the second fraction ‘of the remainder’ wrong.',
        tip: 'When a question removes one fraction and then asks for a fraction of what’s left, children apply the second fraction to the original total. After each step, pause and ask “what is the whole now?” The whole often changes mid-problem.',
      },
      {
        lead: 'Forgetting to simplify the answer.',
        tip: 'GL nearly always lists the un-simplified version as a tempting wrong option (e.g. 4/6 when the answer is 2/3). Train the habit of checking every answer can’t be reduced: try dividing top and bottom by 2, 3, then 5.',
      },
      {
        lead: 'Adding the bottoms as well as the tops.',
        tip: '1/3 + 1/4 becomes 2/7 instead of 7/12. You can’t add thirds and quarters until they’re renamed as the same kind of part (twelfths), so always find a common denominator first.',
      },
      {
        lead: '‘Bigger denominator means bigger fraction.’',
        tip: 'Children think 1/8 is larger than 1/4 because 8 is bigger than 4. Picture sharing one pizza between 8 people versus 4: more people means a smaller slice each.',
      },
    ],

    // Oracle-written FAQ (5 Q&A — also emitted as FAQPage JSON-LD)
    faq: [
      {
        q: 'What fraction topics are tested in the GL 11+ maths exam?',
        a: 'GL tests finding a fraction of an amount, equivalent fractions and simplifying, adding and subtracting fractions, comparing and ordering, multiplying and dividing, converting between fractions, decimals and percentages, and mixed numbers versus improper fractions. These appear both as standalone questions and inside multi-step word problems, always in multiple-choice format with five options.',
      },
      {
        q: 'How hard are fractions in the GL 11+ exam?',
        a: 'Difficulty ranges from easy one-step calculations (a fifth of 125) to hard multi-step problems that work backwards or take “a fraction of a fraction”. GL papers are designed to stretch the top 25% of the year group, so the trickiest fraction questions combine several steps and a conceptual twist where the obvious answer is wrong.',
      },
      {
        q: 'What year should my child master fractions for the 11+?',
        a: 'Aim for solid fraction fluency by the end of Year 5. Most fraction skills GL tests are Year 5 curriculum content, with adding and subtracting unlike denominators, multiplying pairs of fractions and dividing fractions by whole numbers coming in Year 6. Since GL exams are usually sat in September of Year 6, some Year 6 content may not yet have been taught in school.',
      },
      {
        q: 'How can my child practise fractions for the GL 11+?',
        a: 'Use timed, multiple-choice questions that mirror the real five-option format, and prioritise the highest-frequency skills first: finding a fraction of an amount, and converting between fractions, decimals and percentages. Mix in multi-step word problems, and always check answers are fully simplified, as GL routinely lists the un-simplified version as a trap.',
      },
      {
        q: 'Why are fractions so important in the GL 11+ maths paper?',
        a: 'Number questions (the family that includes fractions) are the most common type in a GL maths paper, around five times more frequent than any other category. Fractions also appear woven into decimals, percentages, money, measurement and pie-chart questions, so strong fraction skills lift a child’s performance right across the paper, not just on obvious fraction questions.',
      },
    ],

    // SEO metadata
    meta: {
      title:       '11+ Fractions Practice Questions for the GL Assessment | PrepStep',
      description: 'Free fractions practice questions for the GL Assessment 11+. Number questions are the most common type in GL maths: five times more frequent than any other category. Worked explanations, five-option format.',
      ogTitle:     '11+ Fractions Practice (GL Assessment) | PrepStep',
      ogDescription: 'Fractions questions built for GL Assessment format: five options, worked explanations, difficulty 1–3. Free to practise on PrepStep.',
    },
  },

  // ── PERCENTAGES ───────────────────────────────────────────────────────────────
  percentages: {
    subject:      'maths',
    topicKey:     'percentages',
    topicLabel:   'Percentages',
    subjectLabel: 'Maths',
    canonical:    'https://prepstep.co.uk/practice/maths/percentages',

    // Q1 D1 basic % of amount | Q3 D2 expressing as % | Q15 D2 comparison
    // Q2 D2 sale price | Q11 D3 reverse % — text-only topic
    questionIds: [1, 3, 15, 2, 11],

    intro: `In the GL Assessment 11+ maths paper, percentages sit inside the Number section, which is the most heavily weighted part of the whole paper at roughly five times more questions than any other topic area. They rarely stand alone. GL deliberately links percentages with fractions and decimals (the "FDP" cluster), so a child who can calculate 25% of a number but cannot convert fluently between a fraction, a decimal and a percentage will quickly come unstuck.

The paper is 50 multiple-choice questions in 50 minutes (about a minute each), with five answer options (A to E) for every question, and no calculator. GL strongly favours application over procedure, so most percentage marks are won inside word problems about sale prices, savings, votes and measurements, not bare sums.

The reassuring news is that percentages are predictable. The skills are well defined, the traps are well known, and steady practice on the right question types builds genuine confidence before exam day.`,

    topicBreakdown: {
      intro: 'Percentage questions are always multiple-choice, five options (A to E), and must be done without a calculator. GL does not publish exact category breakdowns, so the order below is an informed estimate drawn from analysis of practice papers. In rough order of frequency, expect:',
      items: [
        'Finding a percentage of an amount (for example 35% of 500): the single most common type',
        'Converting between fractions, decimals and percentages',
        'Expressing one quantity as a percentage of another (for example "7 out of 28")',
        'Percentage increase and decrease in real contexts (sales, discounts, pay rises)',
        'Comparing and reasoning (which is larger, or ordering mixed forms)',
        'Reverse percentage, working back to the original amount (harder, fewer in number)',
      ],
      footnote: 'Difficulty spans simple benchmark percentages (50%, 25%, 10%) through to multi-step, work-backwards problems built to separate the top 25% of candidates.',
    },

    pitfalls: [
      {
        lead: 'Giving the discount, not the sale price.',
        tip: 'Children calculate "20% off £45 = £9" and stop. After working out the change, re-read the question and ask "does it want the reduction, or the new price?" Then subtract.',
      },
      {
        lead: 'Doing reverse percentages forwards.',
        tip: 'After a 25% reduction a TV costs £270, and children find 25% of £270 instead of seeing £270 as 75% of the original. Label what the final figure represents (here, 75%), find 1%, then scale to 100%.',
      },
      {
        lead: 'Falling for the complement trap.',
        tip: '"60% passed, what percentage failed?" tempts the answer 60%. When a question asks for the rest or remainder, subtract from 100% before choosing.',
      },
      {
        lead: 'Assuming an increase then equal decrease cancels out.',
        tip: 'Up 10% then down 10% does not return to the start (100 to 110 to 99). Work each step on the new total, never the original.',
      },
    ],

    faq: [
      {
        q: 'What percentage questions come up in the GL 11+ maths exam?',
        a: 'GL tests finding a percentage of an amount, converting between fractions, decimals and percentages, expressing one quantity as a percentage of another, percentage increase and decrease, comparison, and reverse percentages. They appear as quick calculations and inside word problems, always multiple-choice with five options (A to E) and no calculator.',
      },
      {
        q: 'How do I teach my child percentages for the 11+?',
        a: 'Start with the building-block method: find 10% by dividing by 10, find 1% by dividing by 100, then combine these to make any percentage. Drill the common fraction, decimal and percentage equivalences until recall is instant, then practise word problems where the child must decide which step the question actually asks for.',
      },
      {
        q: 'Are reverse percentage questions in the GL 11+?',
        a: 'Yes, but they are among the least common and most demanding percentage questions, used to stretch the strongest candidates. A typical example gives the price after a discount and asks for the original. They sit beyond the core Year 6 curriculum, so they are worth practising only once the everyday percentage skills are secure.',
      },
      {
        q: 'What year do children learn percentages for the 11+?',
        a: 'The percentage symbol and simple equivalences are introduced in Year 5, with calculating percentages of amounts and using them for comparison in Year 6. As GL exams are usually sat at the start of Year 6, some material may not yet have been taught in school, so a little practice ahead of the curriculum helps.',
      },
      {
        q: 'Why does my child keep getting percentage word problems wrong?',
        a: 'Usually the maths is fine but the reading is not. Children stop one step early (giving the discount instead of the sale price) or pick the wrong number as the "whole". Encourage them to read the question twice, underline exactly what it asks for, and check the answer makes sense before choosing.',
      },
    ],

    meta: {
      title:         '11+ Percentages Practice (GL Assessment) | PrepStep',
      description:   'Free percentages 11+ practice for the GL Assessment: five-option questions, worked explanations and the traps GL uses, from benchmark sums to reverse percentages.',
      ogTitle:       '11+ Percentages Practice (GL Assessment) | PrepStep',
      ogDescription: 'Free percentages 11+ practice for the GL Assessment: five-option questions, worked explanations and the traps GL uses, from benchmark sums to reverse percentages.',
    },
  },

  // ── DECIMALS ─────────────────────────────────────────────────────────────────
  decimals: {
    subject:      'maths',
    topicKey:     'decimals',
    topicLabel:   'Decimals',
    subjectLabel: 'Maths',
    canonical:    'https://prepstep.co.uk/practice/maths/decimals',

    // Q3 D1 subtraction | Q159 D1 VIS:PlaceValueChart digit value
    // Q1 D2 ordering | Q2 D2 addition | Q124 D3 fraction->decimal
    questionIds: [3, 159, 1, 2, 124],

    intro: `Decimals feature in roughly 10 to 20% of questions on a typical GL Assessment 11+ maths paper, making them one of the highest-yield topics to practise. They belong to the Number section, the dominant part of the paper, and overlap heavily with fractions, percentages, place value and money. A child who is confident with decimals picks up marks well beyond the questions that look obviously "about decimals".

The paper is 50 multiple-choice questions in 50 minutes (about a minute each), with five options (A to E) per question and no calculator. Everyone sits the same paper; it is not adaptive. GL designs decimal questions specifically to catch well-known misconceptions, above all the belief that a longer decimal must be a bigger number.

The good news is that decimal errors are predictable and fixable. Once a child can order, convert, calculate and round decimals fluently, these questions become some of the most reliable marks on the paper.`,

    topicBreakdown: {
      intro: 'Decimal questions are always multiple-choice, five options (A to E), no calculator. GL does not publish exact weightings, so the estimate below comes from analysis of practice papers, and the categories deliberately overlap (one question can test two skills at once). In rough order of frequency:',
      items: [
        'Place value and ordering (identifying a digit\'s value, comparing and ordering decimals)',
        'The four operations with decimals (add, subtract, multiply, divide)',
        'Converting between fractions, decimals and percentages',
        'Multiplying and dividing by 10, 100 and 1,000',
        'Rounding (to the nearest whole number, 1dp and 2dp)',
        'Applied and word problems (money is the most common context)',
      ],
      footnote: 'Difficulty runs from single-step questions using tenths through to multi-step problems mixing thousandths, conversion and interpretation, designed to differentiate the top scorers.',
    },

    pitfalls: [
      {
        lead: 'Thinking the longer decimal is the bigger one.',
        tip: 'Children read 0.45 as larger than 0.5 because "45 beats 5". Pad every number to the same length (0.45 versus 0.50), then compare digit by digit from the left.',
      },
      {
        lead: '"Add a zero to multiply by 10".',
        tip: 'That rule works for whole numbers but fails for decimals: 2.5 times 10 is 25, not 2.50. The digits move one place left, while the decimal point stays put.',
      },
      {
        lead: 'Converting fractions by inspection.',
        tip: 'A child turns 3/8 into 0.38 or 3.8 by reusing the digits. A fraction means divide, so 3/8 is 3 divided by 8, which is 0.375. Memorise the common equivalences.',
      },
      {
        lead: 'Misaligning the decimal points when adding.',
        tip: 'Lining digits up from the right (a whole-number habit) gives nonsense. Line up the decimal points first, then fill gaps with zeros so every column matches.',
      },
    ],

    faq: [
      {
        q: 'What decimals topics are in the GL 11+ maths exam?',
        a: 'GL tests decimal place value and ordering, the four operations with decimals, converting between fractions, decimals and percentages, multiplying and dividing by 10, 100 and 1,000, and rounding. Many appear inside money and measurement word problems. All questions are multiple-choice with five options (A to E) and no calculator.',
      },
      {
        q: 'How many decimal questions are in the 11+ exam?',
        a: 'Based on analysis of GL practice papers, expect roughly 3 to 6 questions that test decimals directly, plus a further 2 to 4 where decimals are involved indirectly through money, measurement or data. That works out at around 10 to 20% of the paper, so decimals are one of the most rewarding topics to drill.',
      },
      {
        q: 'Why does my child think 0.45 is bigger than 0.5?',
        a: 'This is the single most common decimal misconception: applying whole-number logic and seeing "45" as bigger than "5". GL deliberately tests it. The fix is to pad both numbers to the same number of decimal places (0.45 and 0.50) so the comparison becomes obvious, and to use money, since most children grasp that 50p beats 45p.',
      },
      {
        q: 'What year should my child learn decimals for the 11+?',
        a: 'Reading, ordering and rounding decimals to three places is Year 5 content, with identifying digit values and multiplying and dividing by powers of 10 in Year 6. As GL exams are often sat at the start of Year 6, some skills may sit slightly ahead of school teaching, so early practice is worthwhile.',
      },
      {
        q: 'How can my child practise decimals for the GL 11+?',
        a: 'Use timed, five-option questions that mirror the real format, and prioritise ordering and conversion, the highest-frequency skills. Memorise the common fraction, decimal and percentage equivalences, practise multiplying and dividing by 10, 100 and 1,000, and use estimation to sense-check answers and eliminate wrong options quickly.',
      },
    ],

    meta: {
      title:         '11+ Decimals Practice (GL Assessment) | PrepStep',
      description:   'Free decimals 11+ practice for the GL Assessment: ordering, converting and rounding in five-option format, with worked answers and the misconceptions GL targets.',
      ogTitle:       '11+ Decimals Practice (GL Assessment) | PrepStep',
      ogDescription: 'Free decimals 11+ practice for the GL Assessment: ordering, converting and rounding in five-option format, with worked answers and the misconceptions GL targets.',
    },
  },

  // ── PLACE VALUE ───────────────────────────────────────────────────────────────
  placevalue: {
    subject:      'maths',
    topicKey:     'placevalue',
    topicLabel:   'Place Value',
    subjectLabel: 'Maths',
    canonical:    'https://prepstep.co.uk/practice/maths/placevalue',

    // Q1 D1 digit value | Q2 D1 round to nearest 100 | Q4 D2 round to nearest 1000
    // Q5 D2 digit position | Q8 D3 closest to 50,000 — text-only topic
    questionIds: [1, 2, 4, 5, 8],

    intro: `Place value and rounding account for an estimated 2 to 4 questions in every GL Assessment 11+ maths paper, and they quietly underpin many more. Sitting at the heart of the dominant Number section, place value is the skill behind ordering decimals, reading large numbers in word problems, estimating answers and working with money. Get it secure and a child gains accuracy right across the paper.

The paper is 50 multiple-choice questions in 50 minutes (about a minute each), with five options (A to E) and no calculator. Questions cover whole numbers up to 10,000,000, decimals to three places, rounding, ordering, Roman numerals and negative numbers in context.

Place value can feel deceptively simple, which is exactly why GL builds in traps: digits offered instead of values, the "5 rounds up" rule, and longer decimals that look larger than they are. The reassurance for parents is that these traps are few, named and very teachable.`,

    topicBreakdown: {
      intro: 'Place value questions are always multiple-choice, five options (A to E), no calculator. GL does not publish exact category weightings, so the order below is estimated from practice papers and tutor resources, and the skills often combine within a single question. In rough order of frequency:',
      items: [
        'Identifying the value of a digit, in whole numbers and decimals',
        'Rounding whole numbers (to the nearest 10 up to 1,000,000)',
        'Ordering and comparing (whole numbers, decimals, negatives)',
        'Rounding decimals (to 1, 2 or 3 decimal places)',
        'Multiplying and dividing by 10, 100 and 1,000',
        'Estimation, partitioning and expanded form',
        'Roman numerals (up to 1,000) and negative numbers in context',
      ],
      footnote: 'Difficulty ranges from reading a digit\'s value in a four-digit number through to multi-step questions, contextual rounding and ordering mixed fractions, decimals and percentages.',
    },

    pitfalls: [
      {
        lead: 'Giving the digit instead of its value.',
        tip: 'Asked for the value of the 6 in 364,285, a child answers "6" rather than 60,000. Always say the place out loud ("6 in the ten-thousands column is worth 60,000") before choosing.',
      },
      {
        lead: 'Rounding a 5 down.',
        tip: 'Children treat 5 as "round down" and turn 2,385 into 2,380. The rule is 5 or more rounds up, so the deciding digit (the one immediately to the right) of 5, 6, 7, 8 or 9 always lifts the number.',
      },
      {
        lead: 'Ignoring real-world "round up" situations.',
        tip: 'With 347 children and buses holding 50, the answer is 7 buses, not 6.94 rounded down. For packs, buses, tables and containers, ask "would the leftover people still need a place?" If yes, round up.',
      },
      {
        lead: 'Reading negative numbers like positive ones.',
        tip: 'Children rank -7 as larger than -3 because "7 beats 3". Picture a number line or thermometer: further left, or colder, means smaller, so -7 is less than -3.',
      },
    ],

    faq: [
      {
        q: 'What does place value mean in the 11+ maths exam?',
        a: 'Place value is the value a digit holds because of its position, so the 6 in 364,285 is worth 60,000. GL tests it through digit-value questions, rounding, ordering, multiplying and dividing by powers of 10, and partitioning. All questions are multiple-choice with five options (A to E) and no calculator.',
      },
      {
        q: 'Are Roman numerals in the GL 11+ exam?',
        a: 'Yes. Roman numerals up to 1,000 are part of the Year 5 curriculum and appear in GL papers, though they are a smaller slice of the place-value questions. Children need the seven symbols (I, V, X, L, C, D, M) and the six subtractive pairs: IV, IX, XL, XC, CD and CM. A common trap is reading IX as 11 instead of 9.',
      },
      {
        q: 'How do you round numbers for the 11+?',
        a: 'Find the place you are rounding to, look only at the single digit immediately to its right, and round up if that digit is 5 or more, or keep it the same if it is 4 or less. The most common GL trap places a 5 in the deciding position, because 5 always rounds up.',
      },
      {
        q: 'What year is place value taught for the 11+?',
        a: 'Year 5 covers numbers to 1,000,000, rounding and Roman numerals to 1,000, with Year 6 extending to 10,000,000 and rounding to any degree of accuracy. As GL exams are often sat early in Year 6, some content may run slightly ahead of school teaching, so a little preparation helps.',
      },
      {
        q: 'Why does my child round 5 down instead of up?',
        a: 'It is one of the most common rounding errors, because "halfway" feels like it could go either way. The convention is that a deciding digit of 5 always rounds up. Drill it with clear examples (45 to the nearest 10 is 50, 350 to the nearest 100 is 400) until it becomes automatic.',
      },
    ],

    meta: {
      title:         '11+ Place Value Practice (GL Assessment) | PrepStep',
      description:   'Free place value 11+ practice for the GL Assessment: digit values, rounding, ordering and Roman numerals in five-option format, with worked answers and GL traps.',
      ogTitle:       '11+ Place Value Practice (GL Assessment) | PrepStep',
      ogDescription: 'Free place value 11+ practice for the GL Assessment: digit values, rounding, ordering and Roman numerals in five-option format, with worked answers and GL traps.',
    },
  },

  // ── NEGATIVE NUMBERS ─────────────────────────────────────────────────────────
  negativenumbers: {
    subject:      'maths',
    topicKey:     'negativenumbers',
    topicLabel:   'Negative Numbers',
    subjectLabel: 'Maths',
    canonical:    'https://prepstep.co.uk/practice/maths/negativenumbers',

    // Q1 D1 VIS:ThermometerDiagram temperature | Q6 D2 VIS:NumberLine submarine
    // Q8 D2 VIS:ThermometerDiagram difference | Q15 D3 debt multi-step | Q17 D3 Antarctic temp
    questionIds: [1, 6, 8, 15, 17],

    intro: `In the GL Assessment 11+ maths paper, negative numbers appear in roughly one to three of the 50 questions, almost always wrapped inside a real-world context such as temperature, money or depth rather than presented as a bare sum. GL favours scenarios a child can picture (a thermometer falling below zero, a diver descending, a bank balance going overdrawn) because these test whether your child genuinely understands what a negative number means.

Negative numbers also matter far beyond their own handful of questions. They turn up quietly inside sequences that cross zero, coordinate work and temperature data, so confidence here pays off right across the paper.

If your child can already count backwards through zero and read a thermometer, they have the foundation. The 11+ simply asks them to do it quickly, accurately and under a little time pressure. With steady practice on ordering, crossing zero and finding differences, this becomes one of the more predictable topics to score on.`,

    topicBreakdown: {
      intro: 'GL tests negative numbers through five-option multiple choice (A to E), the same format as the rest of the maths paper. Based on our analysis of GL practice papers and tutor materials, the sub-skills appear in roughly this order of frequency (these weightings are our research estimates, not figures GL publishes):',
      items: [
        'Ordering and comparing (around 25%): putting numbers including negatives in ascending or descending order, and using the < > = symbols.',
        'Adding and subtracting across zero (around 25%): calculations that cross the zero boundary, sometimes chained over several steps.',
        'Temperature and real-world context (around 20%): rises and falls, sea level, debt.',
        'Finding a difference or interval (around 15%): the distance between two values, at least one negative.',
        'Multiplication and division sign rules (around 10%): mostly at the harder end.',
        'Reading a number line (around 5%).',
      ],
      footnote: 'Difficulty ranges from simple ordering (D1) up to multi-step chains and sign rules (D3). Worth flagging: the National Curriculum does not require Year 6 children to multiply or divide negatives, but GL does test this at D3, so it sits slightly beyond school expectations.',
    },

    pitfalls: [
      {
        lead: 'The "bigger digit" trap.',
        tip: 'Children read -12 as larger than -1 because 12 is bigger than 1. On a number line, the number further to the left is always the smaller one, so -12 is smaller.',
      },
      {
        lead: 'Miscounting through zero.',
        tip: 'Going from -3 up to 2, children often skip zero and land one short. Count zero as a real step out loud: -3, -2, -1, 0, 1, 2.',
      },
      {
        lead: '"Two negatives make a positive" everywhere.',
        tip: 'The rule is for multiplication and division (or two adjacent signs), not for -5 - 6, which is -11. Only apply it when two sign symbols sit right next to each other, like 7 - (-3).',
      },
      {
        lead: 'Difference given as a negative.',
        tip: 'Asked for the difference between -4 and 6, children answer -10 instead of 10. A difference is a distance, so it is always positive.',
      },
    ],

    faq: [
      {
        q: 'Do children need negative numbers for the GL 11+ maths exam?',
        a: 'Yes. Negative numbers appear in roughly one to three questions per 50-question GL maths paper, and they also surface inside sequences, temperature data and other topics. Most are set in real contexts like temperature or depth rather than bare calculations.',
      },
      {
        q: 'What negative number skills does the 11+ test?',
        a: 'Mainly ordering and comparing numbers, adding and subtracting across zero, temperature problems, and finding the difference between two values. Harder papers also test multiplying and dividing negatives, which goes slightly beyond the primary curriculum.',
      },
      {
        q: 'Why does my child keep saying -8 is bigger than -3?',
        a: 'This is the most common negative-number error. The digit 8 is bigger than 3, but -8 sits further left on the number line, so it is actually smaller. A quick number-line sketch fixes this faster than any rule.',
      },
      {
        q: 'Are negative numbers on the Year 6 maths curriculum?',
        a: 'Adding, subtracting, ordering and using negatives in context are all Year 5 and Year 6 curriculum content. Multiplying and dividing negatives is technically Year 7, but GL does test it in its hardest questions, so it is worth practising.',
      },
      {
        q: 'How can I help my child with negative numbers at home?',
        a: 'Start with a number line and a thermometer. Practise counting through zero out loud, then move to two-step temperature problems ("it was -3 degrees, it rose 7, then fell 5"). The debt model also helps: owing money is negative, paying it off is adding.',
      },
    ],

    meta: {
      title:         'Negative Numbers 11+ Practice (GL Assessment) | PrepStep',
      description:   'Free GL Assessment 11+ negative numbers practice. Master ordering, crossing zero, temperature problems and sign rules with worked examples on PrepStep.',
      ogTitle:       'Negative Numbers 11+ Practice (GL Assessment) | PrepStep',
      ogDescription: 'Free GL Assessment 11+ negative numbers practice. Master ordering, crossing zero, temperature problems and sign rules with worked examples on PrepStep.',
    },
  },

  // ── PRIME NUMBERS AND FACTORS ─────────────────────────────────────────────────
  primenumbersfactors: {
    subject:      'maths',
    topicKey:     'primenumbersfactors',
    topicLabel:   'Prime Numbers & Factors',
    subjectLabel: 'Maths',
    canonical:    'https://prepstep.co.uk/practice/maths/primenumbersfactors',

    // Q1 D1 identify prime | Q2 D1 count factors of 24 | Q3 D2 factor pairs of 18
    // Q5 D2 common factor | Q15 D3 exactly 3 factors — text-only topic
    questionIds: [1, 2, 3, 5, 15],

    intro: `Prime numbers, factors and multiples make up two to four questions in every GL Assessment 11+ maths paper, scattered across the difficulty range and drawn from the Year 5 and Year 6 curriculum. It is one of the more predictable topics on the paper: the question formats repeat year after year, so a well-prepared child can reliably bank these marks.

The topic covers a connected family of ideas: spotting prime numbers up to 100, listing factors and factor pairs, recognising multiples, and finding the highest common factor (HCF) and lowest common multiple (LCM) of two numbers. GL also likes square and cube numbers, and the occasional factor tree.

Some of this stretches just beyond what schools teach. HCF, LCM and prime factorisation are not always covered in depth at primary level, yet they appear in GL papers, so a little targeted practice goes a long way. The good news for an anxious parent: once your child knows their times tables and the primes to 100, most of these questions become quick, confident wins.`,

    topicBreakdown: {
      intro: 'All questions are five-option multiple choice (A to E). Based on our analysis of GL papers and leading tutor resources, the sub-skills appear in roughly this order of frequency (weightings are our research estimates, not published by GL):',
      items: [
        'Finding factors (around 20%): listing factor pairs, counting how many factors a number has.',
        'Identifying primes (around 15%): recognising primes to 100, knowing 1 is not prime and 2 is the only even prime.',
        'Common factors and HCF (around 15%).',
        'Multiples (around 15%): including telling multiples and factors apart.',
        'Square and cube numbers (around 10%).',
        'Common multiples and LCM (around 10%).',
        'Prime factorisation / factor trees (around 10%).',
        'Divisibility rules (around 5%).',
      ],
      footnote: 'Difficulty runs from simple "which of these is prime?" recall (D1) through HCF and LCM in word problems (D2) up to multi-step reasoning such as "a number has exactly 3 factors" (D3). HCF, LCM and formal prime factorisation are the areas most likely to sit beyond your child\'s school coverage.',
    },

    pitfalls: [
      {
        lead: 'Thinking 1 is prime, or that 2 is not.',
        tip: '1 is not prime (it has only one factor); 2 is prime and is the only even prime. A prime has exactly two factors, no more and no fewer.',
      },
      {
        lead: 'Believing all odd numbers are prime.',
        tip: '9, 15, 21, 25, 51 and 91 are all odd but not prime. Memorise the "looks prime but isn\'t" list, especially 51 (3 x 17) and 91 (7 x 13), which GL uses on purpose.',
      },
      {
        lead: 'Mixing up factors and multiples.',
        tip: 'Factors fit inside a number; multiples grow out of it. Factors of 12 are small (1, 2, 3, 4, 6, 12); multiples of 12 are large (24, 36, 48).',
      },
      {
        lead: 'Swapping HCF and LCM.',
        tip: 'Highest Common Factor is the biggest shared factor; Lowest Common Multiple is the smallest shared multiple. Do not just multiply the two numbers for the LCM, as that only works when they share no common factor.',
      },
    ],

    faq: [
      {
        q: 'What prime and factor topics are on the GL 11+ maths exam?',
        a: 'GL tests identifying primes up to 100, listing factors and factor pairs, finding multiples, highest common factor (HCF), lowest common multiple (LCM), prime factorisation, and square and cube numbers. These make up two to four questions per paper.',
      },
      {
        q: 'Is 1 a prime number for the 11+?',
        a: 'No. 1 is not prime because a prime number must have exactly two factors, and 1 has only one. The smallest prime number is 2, which is also the only even prime. GL tests this point deliberately.',
      },
      {
        q: 'Which numbers look prime but aren\'t?',
        a: 'The classic traps are 51 (3 x 17), 57 (3 x 19), 87 (3 x 29) and 91 (7 x 13). All are odd and not in the common times tables, so children assume they are prime. GL uses them as distractors regularly.',
      },
      {
        q: 'What\'s the difference between HCF and LCM?',
        a: 'HCF, the highest common factor, is the largest number that divides into two numbers (HCF of 12 and 18 is 6). LCM, the lowest common multiple, is the smallest number both divide into (LCM of 12 and 18 is 36). Children often confuse the two.',
      },
      {
        q: 'Does the 11+ test things schools don\'t teach?',
        a: 'Somewhat. The curriculum covers primes, factors and multiples, but HCF, LCM and formal prime factorisation with factor trees are pushed harder in GL papers than in many primary classrooms. A few weeks of focused practice on these closes the gap.',
      },
    ],

    meta: {
      title:         'Prime Numbers & Factors 11+ Practice (GL Assessment) | PrepStep',
      description:   'Free GL Assessment 11+ prime numbers and factors practice. Master primes, factors, multiples, HCF, LCM and square numbers with worked examples on PrepStep.',
      ogTitle:       'Prime Numbers & Factors 11+ Practice (GL Assessment) | PrepStep',
      ogDescription: 'Free GL Assessment 11+ prime numbers and factors practice. Master primes, factors, multiples, HCF, LCM and square numbers with worked examples on PrepStep.',
    },
  },

  // ── SEQUENCES ─────────────────────────────────────────────────────────────────
  sequences: {
    subject:      'maths',
    topicKey:     'sequences',
    topicLabel:   'Sequences',
    subjectLabel: 'Maths',
    canonical:    'https://prepstep.co.uk/practice/maths/sequences',

    // Q1 D1 arithmetic (cakes) | Q4 D2 VIS:DotPattern square numbers
    // Q5 D2 halving | Q10 D3 complex pattern | Q15 D3 complex pattern
    questionIds: [1, 4, 5, 10, 15],

    intro: `Sequences appear in two to four questions of every GL Assessment 11+ maths paper, sitting within the Algebra strand of the Year 5 and Year 6 curriculum. Unlike the "what comes next?" number series in the Verbal Reasoning paper, maths sequences go further: they ask children to find a missing term, describe the rule, work out the nth term, or solve a pattern hidden inside a word problem.

This means a child needs two things: the eye to spot a pattern quickly, and the arithmetic to apply it accurately. GL mixes friendly counting patterns (add 7 each time) with trickier ones such as square numbers, doubling, and sequences that weave two patterns together.

For a parent, the reassuring part is that sequences reward method over memory. A child who learns to write down the differences, check three gaps before deciding the rule, and recognise square, cube and triangular numbers on sight will handle most questions calmly. The skills are learnable and the formats repeat, so steady practice builds real confidence here.`,

    topicBreakdown: {
      intro: 'All questions are five-option multiple choice (A to E). Based on our analysis of GL papers and tutor resources, the maths paper tests these sequence skills in roughly this order of frequency (weightings are research estimates, not published by GL):',
      items: [
        'Recognising and continuing a linear sequence (around 25%): a constant step up or down.',
        'Finding the term-to-term rule (around 20%): add 6, multiply by 3, and so on.',
        'Generating terms from an nth term rule (around 15%): for example, "the rule is 3n + 2, what is the 8th term?".',
        'Recognising special sequences (around 15%): squares, cubes, primes, triangular numbers.',
        'Finding a missing term mid-sequence (around 10%).',
        'Context and word problems (around 10%): patterns in tiles, savings or matchsticks.',
        'Non-linear sequences (around 5%): geometric or Fibonacci-type, at the hardest level.',
      ],
      footnote: 'Difficulty ranges from simple constant-step sequences (D1) through nth term work and square numbers (D2) up to interleaved patterns, compound rules and sequences crossing into negatives (D3). The nth term and "generate the sequence" formats are directly supported by the Year 6 algebra curriculum, so they are fair game.',
    },

    pitfalls: [
      {
        lead: 'Writing the step instead of the next number.',
        tip: 'A child finds the rule is "add 7" and answers 7 rather than the next term. Always apply the rule to the last number, then double-check the answer is a term in the sequence, not the gap.',
      },
      {
        lead: 'Checking only the first gap.',
        tip: 'In 7, 9, 12, 16, 21 the first jump is +2 but the rule is +2, +3, +4, +5. Always check at least three differences before deciding the rule.',
      },
      {
        lead: 'nth term order-of-operations errors.',
        tip: 'For 3n + 1 at the 6th term, children write 3 + 6 + 1 or 3(6 + 1) instead of 3 x 6 + 1 = 19. Multiply first, then add or subtract (BODMAS).',
      },
      {
        lead: 'Panicking at "chaotic" sequences.',
        tip: 'When differences jump around wildly, two patterns are usually woven together. Separate the odd and even positions and check each one on its own.',
      },
    ],

    faq: [
      {
        q: 'What kind of sequence questions are in the GL 11+ maths exam?',
        a: 'GL maths sequences ask children to continue a sequence, find a missing term, describe the rule, work out the nth term, or solve a pattern in a word problem. There are usually two to four sequence questions per 50-question paper, ranging from easy to hard.',
      },
      {
        q: 'What is an nth term question in the 11+?',
        a: 'An nth term question gives a formula such as 3n + 2 and asks for a specific term, for example the 8th. You substitute the position number for n (3 x 8 + 2 = 26). The most common error is adding before multiplying, so BODMAS matters.',
      },
      {
        q: 'How are maths sequences different from Verbal Reasoning number series?',
        a: 'VR number series simply ask "what comes next?" in a bare list of numbers. The maths paper goes further, testing missing terms, rules in words, nth term formulas and patterns inside word problems, and it expects more algebraic thinking.',
      },
      {
        q: 'What sequences should my child memorise for the 11+?',
        a: 'Square numbers to 144 (1, 4, 9, 16, 25 and so on), cube numbers to 216, the primes to 50, triangular numbers (1, 3, 6, 10, 15) and the powers of 2. Instant recognition of these saves valuable time in the exam.',
      },
      {
        q: 'Why does my child get sequences that go below zero wrong?',
        a: 'Sequences like 20, 14, 8, 2 carry on into negatives (the next term is -4, not 4). Children who have not practised crossing zero either drop the minus sign or change direction. Practising negative numbers alongside sequences fixes this.',
      },
    ],

    meta: {
      title:         'Sequences 11+ Practice (GL Assessment) | PrepStep',
      description:   'Free GL Assessment 11+ sequences practice. Master number patterns, nth term, square numbers and tricky interleaved sequences with worked examples on PrepStep.',
      ogTitle:       'Sequences 11+ Practice (GL Assessment) | PrepStep',
      ogDescription: 'Free GL Assessment 11+ sequences practice. Master number patterns, nth term, square numbers and tricky interleaved sequences with worked examples on PrepStep.',
    },
  },

  // ── LONG DIVISION ─────────────────────────────────────────────────────────────
  longdivision: {
    subject:      'maths',
    topicKey:     'longdivision',
    topicLabel:   'Long Division',
    subjectLabel: 'Maths',
    canonical:    'https://prepstep.co.uk/practice/maths/longdivision',

    // Q1 D1 sharing 144/12 | Q2 D1 packing 375/15 | Q3 D2 classes 456/24
    // Q4 D2 coaches 336/48 (remainder) | Q57 D3 bags 3384/94 — text-only topic
    questionIds: [1, 2, 3, 4, 57],

    intro: `Long division almost never appears as a bare sum in the GL 11+ maths paper. GL wraps it inside a real-world word problem, and our research shows division fluency affects roughly 20 to 25 percent of a child's maths score, because it underpins averages, unit costs, sharing in ratio, and finding fractions of an amount.

The GL maths paper gives 50 questions in 50 minutes, so a child has about a minute per question. That matters here: a pupil who laboriously works through every step of formal long division will run out of time. The skill GL really rewards is choosing the fastest route, whether that is short division, estimation, or simply multiplying the answer options to see which one fits.

If your child finds long division daunting, that is completely normal. It is a Year 6 skill, and many children sit the 11+ before their school has taught it. Steady practice on a 2-digit divisor closes that gap quickly.`,

    topicBreakdown: {
      intro: 'Our research estimates 2 to 4 pure division questions per paper, plus 7 to 10 more where division is a hidden step inside a larger problem. Every question is multiple choice with five options (A to E), and difficulty spans the full D1 to D3 range. In rough order of frequency, GL tests:',
      items: [
        'Equal sharing and grouping (the most common format)',
        'Interpreting remainders in context (round up, round down, or state what is left over)',
        'Division as the inverse of multiplication ("what number times 23 gives 621?")',
        'Division as one step inside a multi-step problem',
        'Dividing by 10, 100, 1000, and dividing money or decimals',
        'Estimation to choose between close answer options',
      ],
      footnote: 'Pure division by a 2-digit number is the headline Year 6 skill, but GL leans just as hard on whether a child can spot that a worded problem needs dividing at all.',
    },

    pitfalls: [
      {
        lead: '"How many needed?" versus "how many complete?"',
        tip: 'These two phrasings round in opposite directions. Underline the question\'s wording before choosing between rounding up and rounding down.',
      },
      {
        lead: 'Mishandling the remainder.',
        tip: 'Children often include it, drop it, or turn "remainder 6" into ".6". Always ask: does this question want the whole groups, the leftovers, or a decimal answer?',
      },
      {
        lead: 'Missing a zero in the answer.',
        tip: 'When the divisor will not go into a partial dividend, a zero belongs in the quotient. Skipping it makes the answer about ten times too small, so encourage a quick estimate as a sanity check.',
      },
      {
        lead: 'Not using the answer options.',
        tip: 'It is multiple choice. Multiplying an option by the divisor is often faster than dividing, and it catches careless slips.',
      },
    ],

    faq: [
      {
        q: 'Does the GL 11+ test long division?',
        a: 'Yes. Division by a 2-digit number is a Year 6 skill GL tests directly, usually inside a word problem rather than as a bare sum. Expect 2 to 4 pure division questions per paper, plus several more where division is a hidden step in a larger problem.',
      },
      {
        q: 'How hard is long division in the 11+?',
        a: 'It ranges from easy to hard. Easier questions use friendly divisors and known times tables. Harder ones use awkward 2-digit divisors, remainders that must be interpreted, decimals, or working backwards. The challenge is usually doing it accurately in under a minute, not the method itself.',
      },
      {
        q: 'What is the hardest part of long division for 11+ children?',
        a: 'Two things: interpreting the remainder correctly (round up, round down, or state the leftover) and handling a zero in the answer. Both produce wrong answers that GL deliberately includes as tempting options.',
      },
      {
        q: 'Do children need to know formal long division for the GL exam?',
        a: 'They should, as it is the Year 6 expectation, but it is not always the fastest route. Because questions are multiple choice, estimation and multiplying the answer options often solve a question more quickly than the full written method.',
      },
      {
        q: 'How can my child get faster at long division?',
        a: 'Secure times tables to 12 times 12 first, as every hesitation slows the whole calculation. Then practise writing out the first nine multiples of a 2-digit divisor before starting, and always estimate first to rule out two or three answer options.',
      },
    ],

    meta: {
      title:         'Long Division 11+ Practice | GL Assessment Questions | PrepStep',
      description:   'Free GL Assessment 11+ long division practice questions, with the skills tested, common remainder traps, and parent tips to build speed and accuracy.',
      ogTitle:       'Long Division 11+ Practice | GL Assessment | PrepStep',
      ogDescription: 'Free GL Assessment 11+ long division practice questions, with the skills tested, common remainder traps, and parent tips to build speed and accuracy.',
    },
  },

  // ── LONG MULTIPLICATION ───────────────────────────────────────────────────────
  longmultiplication: {
    subject:      'maths',
    topicKey:     'longmultiplication',
    topicLabel:   'Long Multiplication',
    subjectLabel: 'Maths',
    canonical:    'https://prepstep.co.uk/practice/maths/longmultiplication',

    // Q126 D1 simple multiply | Q1 D2 school hall | Q2 D2 farmer trees
    // Q19 D3 printing press | Q20 D3 eggs per day — text-only topic
    questionIds: [126, 1, 2, 19, 20],

    intro: `GL Assessment rarely tests long multiplication as a naked sum like "what is 347 times 26?". Instead it embeds multiplication in a context: a shopping bill, an area, a recipe scaled up, or a multi-step problem combined with another operation. Number questions dominate the GL maths paper, typically five times more than any other strand, and multiplication sits right at the heart of that strand.

The paper gives 50 questions in 50 minutes, so accuracy under time pressure is the real test. A child who can do the column method but cannot decide when to multiply, or who makes one carrying slip, will lose marks to answers GL has designed to look almost right.

If your child knows their times tables and can choose between a quick mental method and the written column method, long multiplication becomes one of the more dependable sources of marks on the paper. Confidence here comes from fluency, not cleverness.`,

    topicBreakdown: {
      intro: 'Every question is multiple choice with five options (A to E), and no calculator is allowed. Difficulty runs across D1 to D3. Our research estimates the mix as follows, in rough order of how the marks fall:',
      items: [
        'Multi-step problems combining multiplication with another operation (the largest share)',
        'Single-step word problems where the child must spot that multiplication is needed',
        'The formal written column method, 3 to 4 digits by 1 to 2 digits',
        'Multiplication as a tool inside other topics (area, scaling, money, speed)',
        'Mental strategies (times 10, 100, 1000, doubling and halving, partitioning)',
        'Estimation and checking with the inverse',
      ],
      footnote: 'The headline Year 6 skill is multiplying a 4-digit number by a 2-digit number, but GL leans just as heavily on reading a worded problem correctly and finishing every step.',
    },

    pitfalls: [
      {
        lead: 'Forgetting the placeholder zero.',
        tip: 'When multiplying by the tens digit, a zero must hold the units place. Skipping it makes the answer far too small, so a quick estimate first will flag it.',
      },
      {
        lead: 'Carrying slips in the "difficult middle".',
        tip: 'The 6, 7, and 8 times tables cause most errors, and GL targets them. Drill these facts to instant recall so they never wobble mid-calculation.',
      },
      {
        lead: 'Stopping one step early.',
        tip: 'In a problem like "buy 7 items at £12, how much change from £100?", children answer 84 instead of 16. Re-read the actual question once they have a number.',
      },
      {
        lead: 'Leaving the answer in the wrong units.',
        tip: 'Working in pence and forgetting to convert to pounds turns a correct calculation into a wrong answer. Always check what unit the question wants.',
      },
    ],

    faq: [
      {
        q: 'Does the GL 11+ include long multiplication?',
        a: 'Yes. Multiplying up to 4 digits by a 2-digit number is a Year 6 skill GL tests, almost always inside a word problem rather than as a bare sum. Multiplication also appears as a step within area, money, scaling, and multi-step questions across the paper.',
      },
      {
        q: 'Are calculators allowed in the GL maths exam?',
        a: 'No. Children must multiply using mental methods and the formal written column method. This is why times tables fluency and a reliable column method matter so much for the 11+.',
      },
      {
        q: 'What is the most common multiplication mistake in the 11+?',
        a: 'Forgetting the placeholder zero when multiplying by the tens digit, and small carrying errors in the 6, 7, and 8 times tables. GL builds wrong answers around exactly these slips, so they look convincingly close to the correct one.',
      },
      {
        q: 'How do I help my child with long multiplication for the 11+?',
        a: 'Secure instant recall of all times tables to 12 times 12 first. Then practise the column method with an estimate beforehand as a check, and teach mental shortcuts like doubling and halving so they can pick the fastest route under time pressure.',
      },
      {
        q: 'Do children need mental maths as well as the written method?',
        a: 'Yes. With about a minute per question, a child who spots that 25 times 36 can be done as 50 times 18 saves valuable time. GL designs some questions so a strong mental strategy beats the full written method.',
      },
    ],

    meta: {
      title:         'Long Multiplication 11+ Practice | GL Assessment | PrepStep',
      description:   'Free GL Assessment 11+ long multiplication practice questions, plus the skills tested, common carrying traps, and parent tips to build speed and accuracy.',
      ogTitle:       'Long Multiplication 11+ Practice | GL Assessment | PrepStep',
      ogDescription: 'Free GL Assessment 11+ long multiplication practice questions, plus the skills tested, common carrying traps, and parent tips to build speed and accuracy.',
    },
  },

  // ── ALGEBRA ───────────────────────────────────────────────────────────────────
  algebra: {
    subject:      'maths',
    topicKey:     'algebra',
    topicLabel:   'Algebra',
    subjectLabel: 'Maths',
    canonical:    'https://prepstep.co.uk/practice/maths/algebra',

    // Q1 D1 missing number | Q3 D1 expression for age | Q8 D2 VIS:FunctionMachine
    // Q5 D2 work backwards (two-step equation) | Q17 D3 multi-step word problem
    questionIds: [1, 3, 8, 5, 17],

    intro: `Algebra accounts for roughly 3 to 6 questions on a typical GL 11+ maths paper, around 6 to 12 percent, but its true reach is wider because sequences, missing-number problems, and function machines all rely on algebraic thinking without being labelled "algebra". (GL does not publish official topic weightings, so these figures are careful estimates from practice-paper analysis, flagged here for honesty.)

For many parents, "algebra" sounds advanced for a ten-year-old. In the 11+ it is gentler than it sounds: substituting a value into an expression, solving a simple equation, following a number machine, or continuing a sequence. Every question is multiple choice with five options, and a child who understands the idea can usually reach the answer in under a minute.

The biggest barrier is rarely the maths itself. It is the idea that a letter stands for a number, and that the equals sign means "both sides balance", not "the answer is". Get those two ideas secure and 11+ algebra becomes very approachable.`,

    topicBreakdown: {
      intro: 'Every question is multiple choice with five options (A to E), spanning D1 to D3. Based on practice-paper analysis (GL publishes no official weightings, so treat the order as indicative), GL tests:',
      items: [
        'Substituting values into expressions (the most frequent type)',
        'Solving one-step equations (4x = 28, x + 15 = 42)',
        'Solving two-step equations (3x + 5 = 20)',
        'Function or number machines, forwards and backwards',
        'Continuing linear sequences and finding a distant term',
        '"Think of a number" word problems',
        'Finding the rule (nth term) of a sequence',
        'Shape or picture equations, and pairs of unknowns',
      ],
      footnote: 'These map directly onto the Year 6 curriculum: using simple formulae, generating linear sequences, expressing missing-number problems with letters, and finding pairs of numbers that satisfy an equation with two unknowns. D3 questions occasionally stretch into early Year 7 territory.',
    },

    pitfalls: [
      {
        lead: 'Misreading the equals sign.',
        tip: 'Many children think "=" means "write the answer". In 8 + 4 = __ + 5 the answer is 7, not 12. Both sides must weigh the same.',
      },
      {
        lead: 'Reading "3a" as "3 and a".',
        tip: 'The hidden multiplication sign trips children up; 3a means 3 times a. When substituting a = 5, that is 15, not 8 and not 35.',
      },
      {
        lead: 'Reversing a number machine in the wrong order.',
        tip: 'To undo "times 3 then add 5", subtract 5 first, then divide by 3. List the steps and reverse them bottom to top.',
      },
      {
        lead: 'Translating words backwards.',
        tip: '"5 less than a number" is n minus 5, not 5 minus n. GL deliberately offers both, so slow, careful translation matters more than speed here.',
      },
    ],

    faq: [
      {
        q: 'Does the GL 11+ test algebra?',
        a: 'Yes, though lightly. Practice-paper analysis suggests roughly 3 to 6 algebra questions per paper, covering substitution, simple equations, function machines, and sequences. Many other "number" questions also use algebraic thinking, so the reasoning shows up more often than the raw count implies.',
      },
      {
        q: 'What kind of algebra is on the 11+ exam?',
        a: 'Year 6 level algebra: substituting a value into an expression, solving one-step and two-step equations, following number machines forwards and backwards, continuing sequences, and simple "think of a number" problems. It does not require advanced techniques, just secure understanding of letters as numbers.',
      },
      {
        q: 'Is 11+ algebra hard for a 10-year-old?',
        a: 'Usually less hard than parents expect. The maths is gentle; the real hurdles are conceptual, mainly understanding that a letter represents a number and that the equals sign means "balance". Once those click, most children handle 11+ algebra confidently.',
      },
      {
        q: 'What is the most common algebra mistake in the 11+?',
        a: 'Treating the equals sign as "the answer goes here" rather than as a balance, and misreading "3a" as "3 and a" instead of "3 times a". GL builds wrong answers directly around these two misconceptions.',
      },
      {
        q: 'How do I teach my child algebra for the 11+?',
        a: 'Start with missing-number problems (7 + ? = 12) before introducing letters, use a balance-scale picture for equations, and practise function machines both forwards and backwards. Building from arithmetic they already understand removes most of the anxiety around the word "algebra".',
      },
    ],

    meta: {
      title:         'Algebra 11+ Practice | GL Assessment Questions | PrepStep',
      description:   'Free GL Assessment 11+ algebra practice questions, with the skills tested, common equals-sign traps, and parent tips for confident, anxiety-free learning.',
      ogTitle:       'Algebra 11+ Practice | GL Assessment | PrepStep',
      ogDescription: 'Free GL Assessment 11+ algebra practice questions, with the skills tested, common equals-sign traps, and parent tips for confident, anxiety-free learning.',
    },
  },

  // ── AREA AND PERIMETER ────────────────────────────────────────────────────────
  areaperimeter: {
    subject:      'maths',
    topicKey:     'areaperimeter',
    topicLabel:   'Area & Perimeter',
    subjectLabel: 'Maths',
    canonical:    'https://prepstep.co.uk/practice/maths/areaperimeter',

    // Q1 D1 VIS:RectangleDiagram perimeter | Q2 D1 VIS area of rectangle
    // Q8 D2 VIS missing width from perimeter | Q10 D2 VIS missing length from area
    // Q70 D3 VIS square garden: area given, find perimeter
    questionIds: [1, 2, 8, 10, 70],

    intro: `In the GL Assessment 11+ maths paper, area and perimeter sit within the Shape and Space strand, and a typical 50-question paper contains roughly two to four questions that test them directly. Every question is multiple choice with five options (A to E), and no marks are deducted for a wrong answer, so a sensible guess is always worth making.

These questions ask your child to find the distance around a shape (the perimeter) or the space inside it (the area). Early questions deal with a single rectangle or square. Later ones build up to compound L-shapes, triangles, and "path around a garden" problems that need two or three steps. The paper is broadly arranged in increasing difficulty, so the harder area questions tend to appear deeper in.

If your child mixes up area and perimeter, you are in very good company. It is the single most common confusion in this topic, and it is completely fixable with focused practice. The formulae are short, the methods are repeatable, and confidence comes quickly once the two ideas are clearly separated.`,

    topicBreakdown: {
      intro: 'GL tests a fairly predictable set of sub-skills. In rough order of how often they appear:',
      items: [
        'Perimeter of rectangles and squares, including working out a missing side (~15%).',
        'Area of rectangles and squares, direct calculation (~15%).',
        'Compound shapes (L, T and H shapes), found either by splitting into rectangles and adding, or by subtracting a cut-out (~30% across perimeter and area combined).',
        'Area of triangles using base x height / 2, and parallelograms using base x perpendicular height (~20% combined).',
        'Reverse problems (given the area, find a missing length) and real-world contexts such as gardens, fencing, frames and carpet (~15% combined).',
        'Same-area / different-perimeter reasoning, a Year 6 curriculum point (~5%).',
      ],
      footnote: 'Difficulty spans the full D1 to D3 range: one-step rectangle sums at the easy end, multi-step compound shapes and path-border problems at the hard end. Format is always five-option multiple choice. Note: the weightings above are drawn from analysis of GL practice papers and tutor resources, so treat them as well-grounded estimates rather than figures GL publishes.',
    },

    pitfalls: [
      {
        lead: 'Calculating area when the question asks for perimeter (or the reverse).',
        tip: 'Train your child to ask "inside or around?" before they pick up the pencil. GL deliberately offers both answers as options.',
      },
      {
        lead: 'Forgetting that a path or border eats into both sides.',
        tip: 'A 2 m path running inside a garden reduces each dimension by 4 m, not 2 m. This is the most common slip on border problems.',
      },
      {
        lead: 'Forgetting to halve when finding a triangle\'s area.',
        tip: 'Base x height gives the surrounding rectangle; the triangle is half of that. The un-halved answer is always sitting there as a tempting wrong option.',
      },
      {
        lead: 'Using the slant side instead of the perpendicular height.',
        tip: 'For triangles and parallelograms, the area needs the straight-up height, not the sloping edge. GL labels both to tempt the wrong choice.',
      },
    ],

    faq: [
      {
        q: 'What area and perimeter topics come up in the GL 11+ maths exam?',
        a: 'GL tests perimeter and area of rectangles, squares, triangles and parallelograms, plus compound L-shapes, reverse problems (find a missing side from the area), and real-world contexts like gardens and fencing. Questions range from single-step calculations to multi-step "path around a shape" problems. All are five-option multiple choice.',
      },
      {
        q: 'How many area and perimeter questions are in the GL 11+ maths paper?',
        a: 'Expect roughly two to four questions in a 50-question paper. Area and perimeter sit inside the wider Shape and Space strand, which makes up around 8 to 12 questions in total. Number topics dominate the paper, so geometry is a smaller but reliable component.',
      },
      {
        q: 'What is the difference between area and perimeter for the 11+?',
        a: 'Perimeter is the total distance around the outside of a shape, measured in linear units like cm or m. Area is the space inside, measured in square units like cm2 or m2. Confusing the two is the most common mistake, so children should decide "inside or around?" before calculating.',
      },
      {
        q: 'Are circle questions (area and circumference) in the GL 11+?',
        a: 'Circles using pi are not part of the Key Stage 2 curriculum and are very unlikely in a standard GL 11+ paper. They are secondary-school content. Children should focus on rectangles, squares, triangles, parallelograms and compound shapes. A rare super-selective paper might include a basic circle question, but it is not expected.',
      },
      {
        q: 'What formulae does my child need to remember for area and perimeter?',
        a: 'Rectangle area is length x width; rectangle perimeter is 2 x (length + width). Square area is side x side. Triangle area is half x base x perpendicular height. Parallelogram area is base x perpendicular height. These are not provided in the exam, so they must be memorised and fluent.',
      },
    ],

    meta: {
      title:         'Area & Perimeter 11+ Practice | GL Assessment | PrepStep',
      description:   'Free GL Assessment 11+ area and perimeter practice questions, with the formulae, common traps and the sub-skills GL actually tests.',
      ogTitle:       'Area & Perimeter 11+ Practice | GL Assessment | PrepStep',
      ogDescription: 'Free GL Assessment 11+ area and perimeter practice questions, with the formulae, common traps and the sub-skills GL actually tests.',
    },
  },

  // ── VOLUME ────────────────────────────────────────────────────────────────────
  volume: {
    subject:      'maths',
    topicKey:     'volume',
    topicLabel:   'Volume',
    subjectLabel: 'Maths',
    canonical:    'https://prepstep.co.uk/practice/maths/volume',

    // Q1 D1 VIS:CuboidDiagram basic cuboid | Q2 D1 VIS cube volume
    // Q3 D2 VIS volume in litres (cm3 conversion) | Q4 D2 VIS missing height
    // Q18 D3 VIS doubled-edge cube
    questionIds: [1, 2, 3, 4, 18],

    intro: `GL Assessment lists "volume of cubes and cuboids" as a named topic in the Measurement strand of its 11+ maths paper, and you can expect roughly two to four volume or capacity questions in a typical 50-question paper. Each is multiple choice with five options (A to E).

Volume questions ask how much space is inside a 3D shape. Most are built on one short formula: for a cuboid (a box shape), volume is length x width x height; for a cube, it is the edge length multiplied by itself three times. From that foundation, GL builds up to missing-dimension problems (you are given the volume and asked to find a side), capacity questions linking cubic centimetres to litres, and counting cubes in a 3D picture.

Because volume appears less often than number work, every question genuinely counts, and the harder ones reward a child who has practised the trickier styles. The good news for an anxious parent: the core method is one of the most learnable in the whole paper. Get the formula automatic, watch the units, and most marks follow.`,

    topicBreakdown: {
      intro: 'In rough order of frequency, GL tests:',
      items: [
        'Volume of a cuboid (length x width x height), the single most common style (~25 to 30%).',
        'Missing dimension problems, where the volume and two sides are given and the child divides to find the third (~15 to 20%).',
        'Counting unit cubes in a 3D diagram, including cubes hidden behind others (~10 to 15%).',
        'Capacity and unit conversion, linking cm3 to ml and litres, where 1000 cm3 = 1 litre (~10 to 15%).',
        'Volume of a cube using edge cubed (~10 to 15%).',
        'Real-world word problems (tanks, boxes, "how much more to fill") and comparing volumes (~15 to 20% combined).',
        'Compound 3D shapes and packing problems, the hardest styles, appear occasionally at D3.',
      ],
      footnote: 'Difficulty runs the full D1 to D3 range. Format is always five-option multiple choice. These weightings are estimates drawn from GL practice papers, SATs analysis and tutor resources, not figures GL publishes, so treat them as well-supported rather than exact. Surface area is rarely tested at 11+ level.',
    },

    pitfalls: [
      {
        lead: 'Multiplying only two dimensions instead of three.',
        tip: 'That gives the area of one face, not the volume. GL always offers the face-area answer as a tempting option. Volume means three numbers multiplied.',
      },
      {
        lead: 'Confusing cubic centimetres and litres.',
        tip: 'The key bridge is 1 cm3 = 1 ml and 1000 cm3 = 1 litre. Children often guess a wrong power of ten here, so this conversion is worth drilling.',
      },
      {
        lead: 'Forgetting the hidden cubes.',
        tip: 'When counting cubes in a 3D drawing, those behind or beneath the visible ones are easy to miss. Counting layer by layer (cubes per layer x number of layers) prevents it.',
      },
      {
        lead: 'Dividing total volumes on packing problems.',
        tip: 'To find how many small cubes fit, divide each dimension separately and round each down, then multiply. Dividing one big volume by another gives the wrong answer when the cubes do not fit exactly.',
      },
    ],

    faq: [
      {
        q: 'What volume topics are tested in the GL 11+ maths exam?',
        a: 'GL tests volume of cuboids (length x width x height) and cubes (edge cubed), missing-dimension problems, counting unit cubes including hidden ones, and capacity conversions between cm3, millilitres and litres. Harder papers add real-world tank problems, packing problems and compound 3D shapes. All questions are five-option multiple choice.',
      },
      {
        q: 'What is the formula for volume in the 11+ exam?',
        a: 'Volume of a cuboid is length x width x height. Volume of a cube is the edge length cubed (edge x edge x edge). To find a missing dimension, divide the volume by the two known sides. These formulae are not given in the exam, so children must know them by heart.',
      },
      {
        q: 'How do you convert cm3 to litres for the 11+?',
        a: '1 cubic centimetre equals 1 millilitre, and 1000 cubic centimetres equal 1 litre. So a tank holding 40,000 cm3 holds 40 litres. For larger problems, 1 cubic metre equals 1,000,000 cm3, or 1000 litres. This conversion is one of the most useful volume facts to memorise.',
      },
      {
        q: 'How many volume questions are in the GL 11+ maths paper?',
        a: 'Expect roughly two to four volume or capacity questions in a 50-question paper, sometimes fewer. Volume sits in the Measurement strand, which is far less frequent than number work. Because they appear less often, it is worth making sure your child is confident across all the common volume styles.',
      },
      {
        q: 'What cube numbers should my child learn for 11+ volume questions?',
        a: 'Knowing the cubes up to 10 helps enormously with reverse problems like "a cube has volume 125 cm3, find the edge." The key ones are: 2 cubed is 8, 3 cubed is 27, 4 cubed is 64, 5 cubed is 125, 6 cubed is 216, 7 cubed is 343, 8 cubed is 512, 9 cubed is 729 and 10 cubed is 1000. Recognising these instantly turns a hard question into a quick one.',
      },
    ],

    meta: {
      title:         'Volume 11+ Practice | GL Assessment Maths | PrepStep',
      description:   'Free GL Assessment 11+ volume practice questions covering cuboids, cubes, capacity and unit conversion, with formulae and the traps GL sets.',
      ogTitle:       'Volume 11+ Practice | GL Assessment Maths | PrepStep',
      ogDescription: 'Free GL Assessment 11+ volume practice questions covering cuboids, cubes, capacity and unit conversion, with formulae and the traps GL sets.',
    },
  },

  // ── ANGLES AND SHAPES ─────────────────────────────────────────────────────────
  anglesshapes: {
    subject:      'maths',
    topicKey:     'anglesshapes',
    topicLabel:   'Angles & Shapes',
    subjectLabel: 'Maths',
    canonical:    'https://prepstep.co.uk/practice/maths/anglesshapes',

    // Q1 D1 VIS:AngleDisplay angles on straight line | Q2 D1 VIS angles around point
    // Q8 D2 VIS:AngleDiagram isosceles triangle | Q9 D2 VIS four angles at point
    // Q16 D3 VIS:RegularPolygon interior angle pentagon
    questionIds: [1, 2, 8, 9, 16],

    intro: `In the GL Assessment 11+ maths paper, geometry (angles, shape properties, symmetry, nets, coordinates and transformations) typically accounts for six to ten of the 50 questions, with angle calculation and shape properties the two biggest parts. Every question is multiple choice with five options (A to E), and every diagram is labelled "Not drawn to scale," which means your child must calculate angles, never measure them with their eye.

These questions test whether a child knows their shape facts and can apply the angle rules: angles in a triangle add to 180 degrees, angles in a quadrilateral add to 360, angles on a straight line add to 180, and angles around a point add to 360. From there, GL builds up to isosceles triangle puzzles, symmetry, folding nets in the mind, and reading coordinates.

For a worried parent, the reassuring part is how rule-based this topic is. There is no measuring, no guessing from the picture, and the facts are finite. Once the angle sums are automatic and your child has seen shapes drawn at odd angles, the marks become reliable.`,

    topicBreakdown: {
      intro: 'In rough order of frequency, GL tests:',
      items: [
        'Angle calculation using angle-sum rules, the largest category (~25 to 30%). This includes triangles, quadrilaterals, straight lines, points and vertically opposite angles.',
        'Properties of 2D shapes: identifying shapes from clues, knowing sides, angles and symmetry of triangles and quadrilaterals (~20 to 25%).',
        'Symmetry, both lines of symmetry and order of rotational symmetry (~10 to 15%).',
        '3D shapes and nets: counting faces, edges and vertices, and matching nets to solids (~10 to 15%).',
        'Coordinates, mostly first quadrant, occasionally all four (~10 to 15%).',
        'Reflection, translation and rotation on grids (~10 to 15% combined).',
      ],
      footnote: 'Difficulty spans D1 to D3, with one-step "find the third angle" questions at the easy end and multi-step angle chains or interior angles of regular polygons at the hard end. Format is always five-option multiple choice. These weightings are estimates from GL practice papers and tutor resources, so treat them as well-grounded rather than published exact figures.',
    },

    pitfalls: [
      {
        lead: 'Estimating an angle from the picture.',
        tip: 'Diagrams say "Not drawn to scale" for a reason. An angle that looks like 90 degrees might be 85. Train your child to calculate every angle, never to judge by eye.',
      },
      {
        lead: 'Getting caught by the isosceles ambiguity.',
        tip: 'When given one angle of an isosceles triangle, the child must work out whether it is the unique angle or one of the equal base angles. GL usually adds a clue (such as "angle B is greater than 60"), and missing that clue leads straight to a wrong answer.',
      },
      {
        lead: 'Thinking a square is not a rectangle.',
        tip: 'A square IS a special rectangle, and a rectangle IS a special parallelogram. GL exploits this so-called class-inclusion confusion, often by listing a square among the options to a rectangle question.',
      },
      {
        lead: 'Miscounting lines of symmetry.',
        tip: 'A non-square rectangle has two lines of symmetry, not four; its diagonals are not lines of symmetry. Drawing the fold lines, rather than guessing, fixes this quickly.',
      },
    ],

    faq: [
      {
        q: 'What angle and shape topics are in the GL 11+ maths exam?',
        a: 'GL tests missing-angle calculations (triangles, quadrilaterals, straight lines, points and vertically opposite angles), properties of 2D shapes, lines and order of symmetry, 3D shapes and nets, coordinates, and transformations like reflection and translation. Angle calculation and shape properties are the most common. All questions are five-option multiple choice.',
      },
      {
        q: 'What are the key angle rules for the 11+ exam?',
        a: 'Angles in a triangle add to 180 degrees; angles in a quadrilateral add to 360; angles on a straight line add to 180; angles around a point add to 360; and vertically opposite angles are equal. The exterior angle of a triangle equals the sum of the two opposite interior angles. These must be recalled instantly under time pressure.',
      },
      {
        q: 'Why do GL 11+ diagrams say "not drawn to scale"?',
        a: 'It is a deliberate warning that the picture cannot be trusted for measuring. An angle drawn to look like a right angle may actually be 85 or 95 degrees. Children must calculate using angle rules, never estimate from the diagram. Estimating from the picture is one of the most common ways to lose marks.',
      },
      {
        q: 'Is a square a rectangle in the 11+ exam?',
        a: 'Yes. A square is a special rectangle with four equal sides, and it is also a special rhombus. A rectangle is a special parallelogram. GL deliberately tests this "class inclusion" idea, often by including a square among the answer options to a question about rectangles, catching children who treat the shapes as entirely separate.',
      },
      {
        q: 'How many geometry questions are in the GL 11+ maths paper?',
        a: 'Geometry usually makes up six to ten questions in a 50-question paper, around 12 to 20 percent. Angle calculation and shape properties dominate, with smaller numbers of symmetry, nets, coordinates and transformation questions. Number topics appear far more often, so geometry is a steady but smaller part of the paper.',
      },
    ],

    meta: {
      title:         'Angles & Shapes 11+ Practice | GL Assessment | PrepStep',
      description:   'Free GL Assessment 11+ angles and shapes practice questions covering angle rules, symmetry, nets and coordinates, with the common GL traps explained.',
      ogTitle:       'Angles & Shapes 11+ Practice | GL Assessment | PrepStep',
      ogDescription: 'Free GL Assessment 11+ angles and shapes practice questions covering angle rules, symmetry, nets and coordinates, with the common GL traps explained.',
    },
  },

  // ── DATA HANDLING ─────────────────────────────────────────────────────────────
  datahandling: {
    subject:      'maths',
    topicKey:     'datahandling',
    topicLabel:   'Data Handling',
    subjectLabel: 'Maths',
    canonical:    'https://prepstep.co.uk/practice/maths/datahandling',

    // Q5 D1 VIS:BarChart reading bar chart | Q1 D1 mode | Q2 D2 mean temperature
    // Q14 D3 backwards mean | Q19 D3 VIS:PieChart pie chart fraction
    questionIds: [5, 1, 2, 14, 19],

    intro: `Data handling makes up roughly three to six questions on a typical GL Assessment 11+ maths paper, around 6 to 12 per cent of the 50 questions. It covers reading and interpreting charts, graphs and tables, working with averages (mean, median, mode and range), and pulling answers out of pictograms, pie charts and Venn diagrams. Almost every question shows a real chart or dataset, then asks your child to read a value off it or calculate something from it.

The GL maths paper is 50 multiple-choice questions in 50 minutes, about a minute each, with five answer options (A to E) every time. Data questions nearly always begin with a picture or table, so your child has to take in the information quickly before the clock counts against them.

The reassuring part is that these are some of the most predictable questions on the whole paper. The chart types repeat, the question styles repeat, and focused practice turns them into reliable marks.`,

    topicBreakdown: {
      intro: 'Data handling questions are always multiple-choice with five options (A to E). Across a paper, expect these sub-skills in roughly this order of frequency:',
      items: [
        'Reading values from charts and graphs (the most common): bar charts, line graphs, pictograms and tables, including reading between the scale markings.',
        'Calculating from data: finding totals, differences ("how many more"), and fractions or percentages of a total.',
        'Averages: mean, median, mode and range, usually from a small dataset.',
        'Interpreting trends and comparisons: comparing categories or time periods, spotting rises and falls.',
        'Pie chart interpretation: converting between fractions, percentages and amounts.',
        'Critical data evaluation (less common, usually the hardest): deciding what the data does or does not actually show.',
      ],
      footnote: 'Difficulty spans easy single-value reading through to multi-step problems such as the "backwards mean" (finding a missing value from the average). Note: median, mode and range are not strictly in the Year 5 to 6 National Curriculum but GL tests them regularly.',
    },

    pitfalls: [
      {
        lead: 'Not checking the scale interval first.',
        tip: 'A y-axis often goes up in 2s, 5s, 10s or more, so the third line up can mean 15, not 3. Read the numbers on both axes before reading any bar or point.',
      },
      {
        lead: 'Misreading half-symbols on a pictogram.',
        tip: 'If each symbol stands for 10, two and a half symbols mean 25, not 2.5 or 20. Read the key first, then count whole and half symbols and multiply.',
      },
      {
        lead: 'Giving the total instead of the mean (and the highest value instead of the range).',
        tip: 'For the mean, always ask "did I divide?"; for the range, remember it is highest minus lowest, always a subtraction.',
      },
      {
        lead: 'Finding the median without ordering the data first.',
        tip: 'GL deliberately lists numbers out of order. Make "median means order it first" an automatic habit before picking the middle value.',
      },
    ],

    faq: [
      {
        q: 'What is data handling in the 11+ maths exam?',
        a: 'Data handling is the part of the GL 11+ maths paper that uses charts, graphs and tables. Children read values from bar charts, pie charts, line graphs, pictograms and tables, calculate totals and differences, work out averages (mean, median, mode and range), and interpret what the data shows. It is always multiple-choice with five options.',
      },
      {
        q: 'How many data handling questions are in the GL 11+ maths paper?',
        a: 'Roughly three to six questions per paper, about 6 to 12 per cent of the 50 questions. Number questions dominate a GL maths paper (around five times more common than any other category), so data handling is a smaller but still regular and very winnable part of the exam.',
      },
      {
        q: 'Does the GL 11+ test mean, median, mode and range?',
        a: 'Yes. Although the Year 5 to 6 National Curriculum focuses mainly on the mean, GL papers expect children to handle all four. Mean is add and divide, median is the middle value once ordered, mode is the most common value, and range is highest minus lowest.',
      },
      {
        q: 'What is the hardest type of data handling question in the 11+?',
        a: 'The "backwards mean" is one of the trickiest: children are given the average and all but one value, then have to find the missing one. Pie chart calculations and Venn diagram "only" questions (counting one group while excluding the overlap) are also common stumbling blocks.',
      },
      {
        q: 'How can my child practise data handling for the GL 11+?',
        a: 'Use timed, five-option questions that show real charts, graphs and tables, just like the exam. Drill the highest-frequency skills first: reading non-unit scales, finding totals and differences, and calculating the mean. Then add pie charts, pictogram keys and the backwards mean. Always check the scale before reading any value.',
      },
    ],

    meta: {
      title:         'Data Handling 11+ Practice | GL Assessment | PrepStep',
      description:   'Free data handling practice for the GL Assessment 11+: charts, averages, pie charts and pictograms. Five-option questions with worked answers.',
      ogTitle:       'Data Handling 11+ Practice | GL Assessment | PrepStep',
      ogDescription: 'Free data handling practice for the GL Assessment 11+: charts, averages, pie charts and pictograms. Five-option questions with worked answers.',
    },
  },

  // ── SPEED, DISTANCE AND TIME ──────────────────────────────────────────────────
  speeddistancetime: {
    subject:      'maths',
    topicKey:     'speeddistancetime',
    topicLabel:   'Speed, Distance & Time',
    subjectLabel: 'Maths',
    canonical:    'https://prepstep.co.uk/practice/maths/speeddistancetime',

    // Q1 D1 speed from dist/time | Q3 D1 time from dist/speed | Q2 D2 distance
    // Q4 D2 speed in km/h (unit conversion) | Q13 D3 m/s unit conversion chain (clean)
    questionIds: [1, 3, 2, 4, 13],

    intro: `Speed, distance and time usually appears as just one to three questions on a GL Assessment 11+ maths paper, and occasionally none at all, yet it is one of the most worthwhile topics to prepare. It tests three linked formulas (speed = distance / time, plus the rearrangements for distance and time), almost always wrapped in a real-life word problem about a car, train, cyclist or school trip. GL never asks a bare formula on its own.

The GL maths paper is 50 multiple-choice questions in 50 minutes, with five options (A to E) per question. Speed questions tend to sit in the middle or later part of the paper because they often need two or three steps, especially a unit conversion.

The encouraging news is that the formulas never change. Once a child can confidently turn minutes into hours and choose the right formula, these become some of the most dependable marks on the whole paper.`,

    topicBreakdown: {
      intro: 'Every question is multiple-choice with five options (A to E), set as a real-world word problem. In rough order of frequency, GL tests:',
      items: [
        'Calculating speed (speed = distance / time), given a distance and a time.',
        'Calculating distance (distance = speed x time).',
        'Calculating time (time = distance / speed).',
        'Unit conversion: minutes to hours, metres to kilometres, and km/h to m/s, usually needed before or after the formula.',
        'Multi-part journeys and average speed: total distance divided by total time across two legs.',
        'Timetable and schedule reading (less common): working out journey durations or arrival times.',
      ],
      footnote: 'Difficulty ranges from one clean division with whole numbers (easy) up to two-leg average-speed problems with awkward fractions of an hour (hard). Worth flagging: pure distance-time graph interpretation is rare at 11+ because it is formally a KS3 (Year 7 to 8) topic, so do not over-prepare it.',
    },

    pitfalls: [
      {
        lead: 'Treating minutes as decimals of an hour.',
        tip: 'Children write 30 minutes as 0.3 hours instead of 0.5, or 15 minutes as 0.15 instead of 0.25. Learn the key fractions cold (15 min = 1/4, 20 min = 1/3, 30 min = 1/2, 45 min = 3/4).',
      },
      {
        lead: 'Averaging the two speeds on a multi-part journey.',
        tip: 'Driving at 60 then 40 km/h is not 50 km/h. Average speed is always total distance divided by total time, never the mean of the speeds.',
      },
      {
        lead: 'Forgetting to convert the answer to the unit asked for.',
        tip: 'The question wants minutes but the child gives hours, or wants km/h but calculates m/s. Underline the required unit before starting.',
      },
      {
        lead: 'Mixing units within the problem.',
        tip: 'Distance in metres but speed needed in km/h. Convert everything to matching units before touching the formula.',
      },
    ],

    faq: [
      {
        q: 'What is speed, distance and time in the 11+ maths exam?',
        a: 'It is a measurement topic in the GL 11+ maths paper that links how fast, how far and how long. Children use speed = distance / time and its two rearrangements to solve real-life word problems about journeys. Questions are multiple-choice with five options and often need a unit conversion.',
      },
      {
        q: 'How do you work out speed, distance and time for the 11+?',
        a: 'Use the formula triangle. Speed = distance / time, distance = speed x time, and time = distance / speed. Cover the value you want to find and read off the other two. The key extra skill is converting time correctly, for example treating 20 minutes as one third of an hour.',
      },
      {
        q: 'How many speed, distance and time questions are in the GL 11+ maths paper?',
        a: 'Usually one to three per paper, and sometimes none. It is a minor topic within the wider measurement strand, but it is high value: children who can handle it tend to be strong mathematicians and score well across the whole paper.',
      },
      {
        q: 'Why does my child keep getting speed, distance and time questions wrong?',
        a: 'The most common cause is time conversion: writing 30 minutes as 0.3 hours instead of 0.5. The second is averaging two speeds instead of using total distance over total time. Both are predictable traps that GL builds into the wrong answers, so targeted practice fixes them quickly.',
      },
      {
        q: 'How can my child practise speed, distance and time for the GL 11+?',
        a: 'Practise with five-option word problems that mirror the exam. Master the formula triangle first, then drill minutes-to-hours conversions until they are automatic, then move on to two-leg average-speed questions. Always check the answer is in the unit the question asks for, and sense-check it (500 km/h is not a sensible cycling speed).',
      },
    ],

    meta: {
      title:         'Speed, Distance & Time 11+ Practice | GL Assessment | PrepStep',
      description:   'Free speed, distance and time practice for the GL Assessment 11+. Master the formula, unit conversions and average-speed traps with worked answers.',
      ogTitle:       'Speed, Distance & Time 11+ Practice | GL Assessment | PrepStep',
      ogDescription: 'Free speed, distance and time practice for the GL Assessment 11+. Master the formula, unit conversions and average-speed traps with worked answers.',
    },
  },

  // ── RATIO ─────────────────────────────────────────────────────────────────────
  ratio: {
    subject:      'maths',
    topicKey:     'ratio',
    topicLabel:   'Ratio & Proportion',
    subjectLabel: 'Maths',
    canonical:    'https://prepstep.co.uk/practice/maths/ratio',

    // Q1 D1 VIS:BarModel 3:2 sharing | Q2 D1 VIS:BarModel 3:5 sharing
    // Q7 D2 VIS:BarModel 5:3 sharing difference | Q10 D2 recipe scaling
    // Q26 D3 map scale 1:50
    questionIds: [1, 2, 7, 10, 26],

    intro: `Ratio and proportion typically appears as two to four questions on a GL Assessment 11+ maths paper, where GL lists it as "simple ratio" within the statistics section. It covers sharing an amount in a given ratio, simplifying ratios, scaling recipes and reading map scales, plus the all-important link between ratios and fractions.

The GL maths paper is 50 multiple-choice questions in 50 minutes, with five options (A to E) per question. Ratio questions are almost always word problems, and the harder ones can need three or four calculation steps inside a single minute, so a quick, confident method matters as much as the arithmetic.

The reassuring part is that ratio rests on one core routine: add the parts, divide the total, then multiply back up. Once that becomes automatic, most GL ratio questions follow the same shape, and steady practice builds real speed and accuracy.`,

    topicBreakdown: {
      intro: 'Every ratio question is multiple-choice with five options (A to E), almost always a word problem. In rough order of frequency, GL tests:',
      items: [
        'Sharing in a two-part ratio (the most common): dividing a total between two people or groups.',
        'Simplifying ratios to their lowest terms using the highest common factor.',
        'Equivalent ratios and scaling: finding a missing value by scaling up or down.',
        'Recipe and mixture scaling: direct proportion using ingredients or paint mixes.',
        'Ratio-to-fraction conversion: the often-misunderstood idea that 3:4 means 3 out of 7.',
        'Sharing in a three-part ratio, and map scales and scale drawings.',
        'Proportion word problems using the unitary method (find the cost of one, then scale).',
      ],
      footnote: 'Difficulty ranges from simple sharing with friendly numbers (easy) to multi-step problems that work backwards from one person\'s share to find the total (hard). Inverse proportion is rare at 11+ and only appears in simple forms.',
    },

    pitfalls: [
      {
        lead: 'Confusing part-to-part with part-to-whole.',
        tip: 'The ratio 3:4 means 3 out of every 7, not 3 out of 4. Add the parts to get the whole first, then any fraction question becomes "this part out of the total".',
      },
      {
        lead: 'Adding instead of multiplying (the additive error).',
        tip: 'Seeing 2 become 6 and adding 4 to 3 to get 7, instead of multiplying by 3 to get 9. Always ask "how many times bigger?", never "how much was added?".',
      },
      {
        lead: 'Giving the wrong share, or the wrong thing entirely.',
        tip: 'Children mix up who gets which share, or give one person\'s share when the question asked for the total. Underline exactly what is being asked before calculating.',
      },
      {
        lead: 'Not simplifying a ratio fully.',
        tip: 'Reducing 12:18 to 6:9 and stopping, instead of going on to 2:3. After simplifying, check the parts share no further common factor.',
      },
    ],

    faq: [
      {
        q: 'What is ratio and proportion in the 11+ maths exam?',
        a: 'Ratio compares quantities, written as a:b, and proportion describes a part of a whole. In the GL 11+, children share amounts in a ratio, simplify ratios, scale recipes and maps, and convert between ratios and fractions. Questions are word problems, always multiple-choice with five options.',
      },
      {
        q: 'Is 3:4 the same as 3/4 in a ratio?',
        a: 'No, and this is the single most common ratio mistake. The ratio 3:4 has 3 parts and 4 parts, making 7 parts in total, so the first quantity is 3/7 of the whole, not 3/4. Always add the parts to find the whole before writing a fraction.',
      },
      {
        q: 'How do you answer ratio sharing questions in the 11+?',
        a: 'Follow three steps: add the ratio parts to get the total number of parts, divide the amount by that total to find the value of one part, then multiply each ratio number by the value of one part. Finally, check the shares add back up to the original total.',
      },
      {
        q: 'How many ratio questions are in the GL 11+ maths paper?',
        a: 'Typically two to four per paper. Ratio sits within the statistics section, which is smaller than the number-heavy core of the paper, but ratio ideas also turn up inside number and money problems, so the skill is worth more than the question count suggests.',
      },
      {
        q: 'How can my child practise ratio for the GL 11+?',
        a: 'Use timed, five-option word problems that match the exam. Make the "add the parts, divide, multiply back" routine automatic first, then drill the ratio-to-fraction link (3:4 means 3/7) because GL exploits it constantly. Add three-part ratios, recipe scaling and working-backwards questions once the basics are secure.',
      },
    ],

    meta: {
      title:         'Ratio 11+ Practice Questions | GL Assessment | PrepStep',
      description:   'Free ratio and proportion practice for the GL Assessment 11+: sharing, simplifying, scaling and recipes. Five-option questions with worked answers.',
      ogTitle:       'Ratio 11+ Practice | GL Assessment | PrepStep',
      ogDescription: 'Free ratio and proportion practice for the GL Assessment 11+: sharing, simplifying, scaling and recipes. Five-option questions with worked answers.',
    },
  },
};

// ── 5. Helpers ────────────────────────────────────────────────────────────────

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

const DIFFICULTY_LABEL = { 1: 'Foundation', 2: 'Intermediate', 3: 'Challenging' };
const DIFFICULTY_CLASS = { 1: 'diff--foundation', 2: 'diff--intermediate', 3: 'diff--challenging' };

/**
 * Post-process ReactDOMServer output to replace Tailwind arbitrary-value class
 * names (which contain chars like [ ] # /) with stable CSS class names that we
 * define in our inline <style> block.  Only replaces the subset emitted by the
 * BarModel component; extend if other components are added.
 */
function normaliseTailwindClasses(html) {
  return html
    .replace(/border-\[#A29BFE\]\/40/g, '_ps-bar-border')
    .replace(/border-white\/30/g, '_ps-bar-border-seg')
    .replace(/last:border-r-0/g, '_ps-bar-last-no-border-r')
    .replace(/text-\[#7C3AED\]/g, '_ps-bar-text-primary');
}

/**
 * Render a visual component to static HTML, then normalise class names.
 * Returns null if rendering fails (non-fatal).
 */
function renderVisual(visual) {
  if (!visual) return null;
  const Component = visuals[visual.component];
  if (!Component) {
    console.warn(`  [warn] Component '${visual.component}' not in visuals registry`);
    return null;
  }
  try {
    const raw = ReactDOMServer.renderToStaticMarkup(
      React.createElement(Component, visual.props)
    );
    return normaliseTailwindClasses(raw);
  } catch (err) {
    console.warn(`  [warn] renderToStaticMarkup failed for ${visual.component}: ${err.message}`);
    return null;
  }
}

/**
 * Render a single question card as HTML.
 */
function renderQuestionCard(q, index) {
  const visualHtml = renderVisual(q.visual);
  const visualBlock = visualHtml
    ? `<div class="q-diagram" aria-label="Diagram for question ${index + 1}">${visualHtml}</div>`
    : '';

  const optionsHtml = q.options.map((opt, i) => {
    const isCorrect = i === q.correct;
    return `<li class="q-option${isCorrect ? ' q-option--correct' : ''}" ${isCorrect ? 'aria-current="true"' : ''}>
          <span class="q-option__letter" aria-hidden="true">${LETTERS[i]}</span>
          <span class="q-option__text">${escHtml(opt)}</span>${isCorrect ? '<span class="q-option__tick" aria-label="Correct answer">&#10003;</span>' : ''}
        </li>`;
  }).join('\n        ');

  return `<article class="q-card" aria-label="Sample question ${index + 1}">
      <header class="q-card__header">
        <span class="q-card__num">Question ${index + 1}</span>
        <span class="diff-pill ${DIFFICULTY_CLASS[q.difficulty]}" aria-label="Difficulty: ${DIFFICULTY_LABEL[q.difficulty]}">${DIFFICULTY_LABEL[q.difficulty]}</span>
      </header>
      <p class="q-card__stem">${escHtml(q.question)}</p>
      ${visualBlock}
      <ol class="q-options" role="list">
        ${optionsHtml}
      </ol>
      <details class="q-explanation">
        <summary class="q-explanation__toggle">Show worked explanation</summary>
        <div class="q-explanation__body">
          <p>${escHtml(q.explanation)}</p>
        </div>
      </details>
    </article>`;
}

/**
 * Build the full JSON-LD block for the page.
 */
function buildJsonLd(config, questions) {
  const faqPage = {
    '@context': 'https://schema.org',
    '@type':    'FAQPage',
    mainEntity: config.faq.map(item => ({
      '@type': 'Question',
      name:    item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text:    item.a,
      },
    })),
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',     item: 'https://prepstep.co.uk' },
      { '@type': 'ListItem', position: 2, name: 'Practice', item: 'https://prepstep.co.uk/practice' },
      { '@type': 'ListItem', position: 3, name: config.subjectLabel, item: `https://prepstep.co.uk/practice/${config.subject}` },
      { '@type': 'ListItem', position: 4, name: config.topicLabel,   item: config.canonical },
    ],
  };

  const article = {
    '@context':        'https://schema.org',
    '@type':           'Article',
    headline:          config.meta.title,
    description:       config.meta.description,
    url:               config.canonical,
    author:            { '@type': 'Organization', name: 'PrepStep' },
    publisher:         { '@type': 'Organization', name: 'PrepStep', url: 'https://prepstep.co.uk' },
    dateModified:      new Date().toISOString().slice(0, 10),
    inLanguage:        'en-GB',
  };

  const app = {
    '@context':          'https://schema.org',
    '@type':             'SoftwareApplication',
    name:                'PrepStep',
    applicationCategory: 'EducationalApplication',
    operatingSystem:     'Web, iOS, Android',
    inLanguage:          'en-GB',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
    description:         `PrepStep is a free 11+ exam preparation app with ${config.topicLabel} practice questions for the GL Assessment.`,
    url:                 'https://prepstep.co.uk',
  };

  return JSON.stringify([faqPage, breadcrumb, article, app], null, 2);
}

/**
 * Build the complete inline CSS string.
 */
function buildCss() {
  return `
/* ── Reset & box model ───────────────────────────────────────────────── */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}

/* ── Brand tokens (mirrors PrepStep src/index.css) ──────────────────── */
:root{
  --primary:#7C3AED;
  --primary-light:#A29BFE;
  --primary-surface:#EDE8FF;
  --primary-dark:#5A4BD1;
  --accent:#FDCB6E;
  --accent-dark:#F59E0B;
  --success:#22C55E;
  --maths:#3B82F6;
  --maths-surface:#EFF6FF;
  --surface:#FEFDFB;
  --surface-alt:#FBF9F6;
  --text:#1E293B;
  --text-secondary:#64748B;
  --border-subtle:rgba(0,0,0,0.06);
  --card-shadow:0 1px 3px rgba(108,92,231,0.05),0 4px 16px rgba(108,92,231,0.08);
}

/* ── Typography ─────────────────────────────────────────────────────── */
body{
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
  color:var(--text);
  line-height:1.65;
  background:linear-gradient(145deg,#EDE8FF 0%,#FFF8E8 100%) fixed;
  min-height:100vh;
  -webkit-font-smoothing:antialiased;
}

/* Heading font (Outfit fallback) */
h1,h2,h3,.font-heading{
  font-family:"Helvetica Neue",Arial,sans-serif;
  line-height:1.25;
  letter-spacing:-0.01em;
}

/* ── Skip link ─────────────────────────────────────────────────────── */
.skip-link{
  position:absolute;top:0;left:0;z-index:9999;
  background:var(--primary);color:#fff;
  padding:0.6rem 1rem;border-radius:0 0 6px 0;
  font-weight:700;text-decoration:none;
  transform:translateY(-100%);
  transition:transform 0.15s;
}
.skip-link:focus{transform:translateY(0)}

/* ── Layout ────────────────────────────────────────────────────────── */
.page-wrap{
  max-width:780px;
  margin:0 auto;
  padding:0 1.25rem;
}

/* ── Site header ───────────────────────────────────────────────────── */
.site-header{
  background:rgba(255,255,255,0.85);
  backdrop-filter:blur(8px);
  -webkit-backdrop-filter:blur(8px);
  border-bottom:1px solid var(--border-subtle);
  position:sticky;top:0;z-index:100;
}
.site-header__inner{
  max-width:780px;
  margin:0 auto;
  padding:0.85rem 1.25rem;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:1rem;
}
.site-header__brand{
  font-size:1.2rem;
  font-weight:800;
  color:var(--primary);
  text-decoration:none;
  letter-spacing:-0.02em;
}
.site-header__cta{
  background:var(--primary);
  color:#fff;
  padding:0.45rem 1.1rem;
  border-radius:8px;
  text-decoration:none;
  font-weight:700;
  font-size:0.875rem;
  white-space:nowrap;
  transition:background 0.2s;
}
.site-header__cta:hover{background:var(--primary-dark)}

/* ── Breadcrumb ────────────────────────────────────────────────────── */
.breadcrumb{
  margin:1.5rem 0 0;
  font-size:0.82rem;
  color:var(--text-secondary);
}
.breadcrumb a{
  color:var(--text-secondary);
  text-decoration:none;
  transition:color 0.15s;
}
.breadcrumb a:hover{color:var(--primary)}
.breadcrumb__sep{margin:0 0.35rem;opacity:0.5}

/* ── Hero ──────────────────────────────────────────────────────────── */
.hero{
  padding:2.5rem 0 2rem;
  border-bottom:1px solid var(--border-subtle);
}
.hero__eyebrow{
  display:inline-flex;
  align-items:center;
  gap:0.5rem;
  background:var(--maths-surface);
  color:var(--maths);
  border:1px solid rgba(59,130,246,0.2);
  padding:0.3rem 0.75rem;
  border-radius:100px;
  font-size:0.8rem;
  font-weight:700;
  letter-spacing:0.04em;
  text-transform:uppercase;
  margin-bottom:1rem;
}
.hero h1{
  font-size:clamp(1.75rem,3vw + 1rem,2.6rem);
  font-weight:800;
  color:var(--text);
  margin-bottom:1.25rem;
}
.hero h1 em{
  font-style:normal;
  color:var(--primary);
}
.hero__intro{
  font-size:1.025rem;
  color:var(--text-secondary);
  max-width:640px;
  margin-bottom:1.75rem;
}
.hero__intro p+p{margin-top:0.85rem}
.hero__stat{
  display:inline-block;
  background:var(--primary-surface);
  color:var(--primary-dark);
  font-weight:700;
  border-radius:6px;
  padding:0.1rem 0.45rem;
  font-size:0.95em;
}
.hero__cta{
  display:inline-block;
  background:var(--primary);
  color:#fff;
  padding:0.85rem 2rem;
  border-radius:12px;
  text-decoration:none;
  font-weight:700;
  font-size:1rem;
  transition:background 0.2s,transform 0.15s;
  box-shadow:0 4px 14px rgba(124,58,237,0.3);
}
.hero__cta:hover{background:var(--primary-dark);transform:translateY(-1px)}
.hero__cta:active{transform:translateY(0) scale(0.98)}
.hero__cta-sub{
  display:block;
  font-size:0.8rem;
  font-weight:400;
  margin-top:0.25rem;
  opacity:0.85;
}

/* ── Content sections ──────────────────────────────────────────────── */
.content-section{
  padding:2.75rem 0;
  border-bottom:1px solid var(--border-subtle);
}
.section-label{
  display:flex;
  align-items:center;
  gap:0.5rem;
  font-size:0.75rem;
  font-weight:700;
  letter-spacing:0.08em;
  text-transform:uppercase;
  color:var(--primary);
  margin-bottom:0.6rem;
}
.section-label__line{
  flex:1;height:1px;background:currentColor;opacity:0.2;
}
h2.section-heading{
  font-size:clamp(1.2rem,1rem + 1vw,1.55rem);
  font-weight:800;
  color:var(--text);
  margin-bottom:1.25rem;
  scroll-margin-top:4rem;
}

/* ── "What GL tests" list ──────────────────────────────────────────── */
.skills-intro{
  font-size:1rem;
  color:var(--text-secondary);
  margin-bottom:1rem;
}
.skills-list{
  list-style:none;
  display:flex;
  flex-direction:column;
  gap:0.55rem;
  margin-bottom:1rem;
}
.skills-list li{
  display:flex;
  align-items:flex-start;
  gap:0.6rem;
  font-size:0.975rem;
  line-height:1.5;
}
.skills-list li::before{
  content:'';
  display:block;
  width:6px;height:6px;
  border-radius:50%;
  background:var(--maths);
  flex-shrink:0;
  margin-top:0.55em;
}
.skills-footnote{
  font-size:0.825rem;
  color:var(--text-secondary);
  border-left:3px solid var(--border-subtle);
  padding-left:0.75rem;
  margin-top:1rem;
  font-style:italic;
}

/* ── Question cards ────────────────────────────────────────────────── */
.questions-intro{
  font-size:0.975rem;
  color:var(--text-secondary);
  margin-bottom:1.5rem;
}
.questions-grid{
  display:flex;
  flex-direction:column;
  gap:1.25rem;
}
.q-card{
  background:var(--surface);
  border-radius:1rem;
  border:1px solid var(--border-subtle);
  box-shadow:var(--card-shadow);
  overflow:hidden;
  transition:box-shadow 0.2s;
}
.q-card:hover{box-shadow:0 2px 8px rgba(108,92,231,0.1),0 8px 24px rgba(108,92,231,0.12)}
.q-card__header{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:1rem 1.25rem 0;
  gap:0.75rem;
}
.q-card__num{
  font-size:0.82rem;
  font-weight:700;
  color:var(--maths);
  letter-spacing:0.04em;
  text-transform:uppercase;
}
.diff-pill{
  font-size:0.72rem;
  font-weight:700;
  padding:0.2rem 0.6rem;
  border-radius:100px;
  letter-spacing:0.04em;
  text-transform:uppercase;
}
.diff--foundation{background:#DCFCE7;color:#166534}
.diff--intermediate{background:#FEF9C3;color:#854D0E}
.diff--challenging{background:var(--primary-surface);color:var(--primary-dark)}
.q-card__stem{
  font-size:1.025rem;
  font-weight:600;
  color:var(--text);
  padding:0.75rem 1.25rem 0.85rem;
  line-height:1.5;
}
.q-diagram{
  margin:0 1.25rem 0.85rem;
  background:#F8F7FF;
  border:1px solid rgba(162,155,254,0.25);
  border-radius:0.75rem;
  padding:1rem;
  overflow:hidden;
}
.q-options{
  list-style:none;
  display:flex;
  flex-direction:column;
  gap:0.4rem;
  padding:0 1.25rem 0.85rem;
}
.q-option{
  display:flex;
  align-items:center;
  gap:0.6rem;
  padding:0.5rem 0.75rem;
  border-radius:8px;
  background:#F8F7FF;
  font-size:0.96rem;
  line-height:1.4;
  border:1px solid transparent;
}
.q-option--correct{
  background:#F0FDF4;
  border-color:#86EFAC;
  font-weight:600;
}
.q-option__letter{
  font-weight:700;
  color:var(--primary-light);
  min-width:1.2rem;
  flex-shrink:0;
  font-size:0.9rem;
}
.q-option--correct .q-option__letter{color:#16A34A}
.q-option__text{flex:1}
.q-option__tick{
  margin-left:auto;
  color:#16A34A;
  font-size:1rem;
  flex-shrink:0;
}

/* Explanation accordion */
.q-explanation{
  border-top:1px solid var(--border-subtle);
}
.q-explanation__toggle{
  display:flex;
  align-items:center;
  gap:0.5rem;
  cursor:pointer;
  padding:0.75rem 1.25rem;
  font-size:0.875rem;
  font-weight:700;
  color:var(--primary);
  list-style:none;
  user-select:none;
  transition:background 0.15s;
}
.q-explanation__toggle::-webkit-details-marker{display:none}
.q-explanation__toggle:hover{background:var(--primary-surface)}
.q-explanation__toggle::before{
  content:'';
  display:inline-block;
  width:0;height:0;
  border-top:5px solid transparent;
  border-bottom:5px solid transparent;
  border-left:7px solid currentColor;
  transition:transform 0.2s;
}
details[open] .q-explanation__toggle::before{transform:rotate(90deg)}
.q-explanation__body{
  padding:0.75rem 1.25rem 1rem;
}
.q-explanation__body p{
  font-size:0.92rem;
  background:#F0FDF4;
  border-left:3px solid #4ADE80;
  padding:0.85rem 1rem;
  border-radius:6px;
  color:#14532D;
  line-height:1.6;
}

/* ── Common pitfalls ───────────────────────────────────────────────── */
.pitfalls-grid{
  display:flex;
  flex-direction:column;
  gap:1rem;
}
.pitfall-card{
  background:var(--surface);
  border:1px solid var(--border-subtle);
  border-radius:0.875rem;
  padding:1.1rem 1.25rem;
  box-shadow:var(--card-shadow);
  display:flex;
  flex-direction:column;
  gap:0.4rem;
}
.pitfall-card__num{
  font-size:0.75rem;
  font-weight:700;
  letter-spacing:0.06em;
  text-transform:uppercase;
  color:var(--accent-dark);
}
.pitfall-card__lead{
  font-size:1rem;
  font-weight:700;
  color:var(--text);
}
.pitfall-card__tip{
  font-size:0.93rem;
  color:var(--text-secondary);
  line-height:1.55;
}
.pitfall-tip-label{
  font-weight:700;
  color:var(--text);
}

/* ── FAQ accordion ─────────────────────────────────────────────────── */
.faq-list{
  display:flex;
  flex-direction:column;
  gap:0.6rem;
}
.faq-item{
  background:var(--surface);
  border:1px solid var(--border-subtle);
  border-radius:0.875rem;
  overflow:hidden;
  box-shadow:var(--card-shadow);
}
.faq-item__question{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:0.75rem;
  cursor:pointer;
  padding:1rem 1.25rem;
  font-size:0.975rem;
  font-weight:700;
  color:var(--text);
  list-style:none;
  user-select:none;
  transition:background 0.15s;
}
.faq-item__question::-webkit-details-marker{display:none}
.faq-item__question:hover{background:var(--primary-surface)}
.faq-item__icon{
  width:20px;height:20px;flex-shrink:0;
  border:2px solid var(--primary-light);
  border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  color:var(--primary);
  font-size:0.9rem;
  font-weight:700;
  transition:transform 0.2s,background 0.15s;
  line-height:1;
}
details[open] .faq-item__icon{
  transform:rotate(45deg);
  background:var(--primary);
  border-color:var(--primary);
  color:#fff;
}
.faq-item__answer{
  padding:0 1.25rem 1rem;
  font-size:0.95rem;
  color:var(--text-secondary);
  line-height:1.65;
  border-top:1px solid var(--border-subtle);
}

/* ── Closing CTA band ──────────────────────────────────────────────── */
.cta-band{
  padding:3rem 0;
  text-align:center;
}
.cta-band h2{
  font-size:clamp(1.4rem,2vw + 0.5rem,2rem);
  font-weight:800;
  color:var(--text);
  margin-bottom:0.6rem;
}
.cta-band__sub{
  font-size:1rem;
  color:var(--text-secondary);
  margin-bottom:1.75rem;
  max-width:480px;
  margin-left:auto;
  margin-right:auto;
}
.btn-primary{
  display:inline-block;
  background:var(--primary);
  color:#fff;
  padding:0.9rem 2.25rem;
  border-radius:12px;
  text-decoration:none;
  font-weight:700;
  font-size:1.05rem;
  transition:background 0.2s,transform 0.15s;
  box-shadow:0 4px 14px rgba(124,58,237,0.3);
}
.btn-primary:hover{background:var(--primary-dark);transform:translateY(-1px)}
.btn-primary:active{transform:translateY(0) scale(0.98)}
.btn-primary__sub{
  display:block;
  font-size:0.8rem;
  font-weight:400;
  margin-top:0.25rem;
  opacity:0.85;
}

/* ── Footer ────────────────────────────────────────────────────────── */
.site-footer{
  background:rgba(255,255,255,0.7);
  border-top:1px solid var(--border-subtle);
  padding:1.5rem 1.25rem;
  text-align:center;
  font-size:0.82rem;
  color:var(--text-secondary);
}
.site-footer a{color:var(--text-secondary);text-decoration:none}
.site-footer a:hover{color:var(--primary)}

/* ── Focus states ──────────────────────────────────────────────────── */
*:focus-visible{
  outline:2px solid var(--primary);
  outline-offset:2px;
  border-radius:4px;
}

/* ────────────────────────────────────────────────────────────────────
   Tailwind utility stubs for BarModel (div-based diagram component).
   These replace the normalised class names produced by normaliseTailwindClasses().
   ──────────────────────────────────────────────────────────────────── */
.space-y-3>:not([hidden])~:not([hidden]){margin-top:0.75rem}
.relative{position:relative}
.rounded-xl{border-radius:0.75rem}
.overflow-hidden{overflow:hidden}
.border-2{border-width:2px;border-style:solid}
.flex{display:flex}
.items-center{align-items:center}
.justify-center{justify-content:center}
.font-bold{font-weight:700}
.text-base{font-size:1rem;line-height:1.5rem}
.border-r{border-right-width:1px;border-right-style:solid}
.transition-all{transition:all 150ms cubic-bezier(0.4,0,0.2,1)}
.text-center{text-align:center}
.text-sm{font-size:0.875rem;line-height:1.25rem}

/* Normalised arbitrary-value class replacements */
._ps-bar-border{border-color:rgba(162,155,254,0.4)}
._ps-bar-border-seg{border-color:rgba(255,255,255,0.3)}
._ps-bar-last-no-border-r:last-child{border-right-width:0}
._ps-bar-text-primary{color:#7C3AED}

/* ── Responsive ────────────────────────────────────────────────────── */
@media(max-width:480px){
  .hero__cta{display:block;text-align:center}
  .site-header__cta{display:none}
}
`.trim();
}

// ── 6. Hub page constants ─────────────────────────────────────────────────────

// One-line descriptors shown in the maths hub topic grid
const TOPIC_DESCRIPTORS = {
  fractions:           'Finding fractions of amounts, equivalent fractions, FDP conversion and multi-step problems',
  percentages:         'Finding percentages, FDP conversion, percentage increase and decrease, and reverse percentages',
  decimals:            'Place value, ordering, the four operations, converting and rounding decimals',
  placevalue:          'Digit values, rounding, ordering and Roman numerals in context',
  negativenumbers:     'Ordering, crossing zero, temperature problems and sign rules',
  primenumbersfactors: 'Primes, factors, multiples, HCF, LCM and square numbers',
  sequences:           'Number patterns, nth term, square numbers and interleaved sequences',
  longdivision:        'Dividing by 2-digit numbers, interpreting remainders and word problems',
  longmultiplication:  'Multiplying up to 4 digits by 2 digits, column method and word problems',
  algebra:             'Substitution, simple equations, function machines and linear sequences',
  ratio:               'Sharing in a ratio, simplifying, scaling recipes and proportion problems',
  areaperimeter:       'Perimeter and area of rectangles, triangles and compound shapes',
  volume:              'Volume of cuboids and cubes, missing dimensions and capacity conversion',
  anglesshapes:        'Angle rules, shape properties, symmetry, nets and coordinates',
  datahandling:        'Charts, graphs, averages, pie charts and pictograms',
  speeddistancetime:   'Speed, distance and time formula, unit conversions and multi-leg journeys',
};

// Display order for the maths hub topic grid
const MATHS_TOPIC_ORDER = [
  'percentages', 'decimals', 'placevalue', 'fractions',
  'longdivision', 'longmultiplication', 'algebra', 'ratio',
  'negativenumbers', 'primenumbersfactors', 'areaperimeter', 'volume',
  'anglesshapes', 'sequences', 'datahandling', 'speeddistancetime',
];

// ── 7. Hub page CSS ───────────────────────────────────────────────────────────

function buildHubCss() {
  return buildCss() + `

/* ── Hub-specific styles ─────────────────────────────────────────── */
.hub-intro{
  font-size:1.025rem;
  color:var(--text-secondary);
  max-width:640px;
  margin-bottom:1.75rem;
}
.hub-intro p+p{margin-top:0.85rem}

/* Topic grid (maths hub) */
.topic-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(220px,1fr));
  gap:1rem;
  margin-top:1rem;
}
.topic-card{
  background:var(--surface);
  border:1px solid var(--border-subtle);
  border-radius:0.875rem;
  padding:1.1rem 1.25rem;
  box-shadow:var(--card-shadow);
  text-decoration:none;
  display:block;
  transition:box-shadow 0.2s,transform 0.15s;
  color:inherit;
}
.topic-card:hover{
  box-shadow:0 2px 8px rgba(108,92,231,0.1),0 8px 24px rgba(108,92,231,0.12);
  transform:translateY(-2px);
}
.topic-card__label{
  font-size:1rem;
  font-weight:700;
  color:var(--text);
  margin-bottom:0.35rem;
  line-height:1.3;
}
.topic-card__desc{
  font-size:0.85rem;
  color:var(--text-secondary);
  line-height:1.45;
}

/* Subject grid (practice hub) */
.subject-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(240px,1fr));
  gap:1.25rem;
  margin-top:1rem;
}
.subject-card{
  background:var(--surface);
  border:1px solid var(--border-subtle);
  border-radius:1rem;
  padding:1.5rem 1.5rem 1.25rem;
  box-shadow:var(--card-shadow);
  text-decoration:none;
  display:block;
  transition:box-shadow 0.2s,transform 0.15s;
  color:inherit;
}
.subject-card:not(.subject-card--disabled):hover{
  box-shadow:0 2px 8px rgba(108,92,231,0.1),0 8px 24px rgba(108,92,231,0.12);
  transform:translateY(-2px);
}
.subject-card--disabled{
  opacity:0.65;
  cursor:default;
}
.subject-card__eyebrow{
  font-size:0.75rem;
  font-weight:700;
  letter-spacing:0.07em;
  text-transform:uppercase;
  margin-bottom:0.5rem;
}
.subject-card__eyebrow--maths{color:var(--maths)}
.subject-card__eyebrow--english{color:#10B981}
.subject-card__eyebrow--vr{color:#F59E0B}
.subject-card__title{
  font-size:1.2rem;
  font-weight:800;
  color:var(--text);
  margin-bottom:0.5rem;
  line-height:1.2;
}
.subject-card__desc{
  font-size:0.9rem;
  color:var(--text-secondary);
  line-height:1.5;
  margin-bottom:0.85rem;
}
.subject-card__badge{
  display:inline-flex;
  align-items:center;
  gap:0.35rem;
  font-size:0.78rem;
  font-weight:700;
  padding:0.25rem 0.65rem;
  border-radius:100px;
  letter-spacing:0.03em;
}
.subject-card__badge--live{background:#DCFCE7;color:#166534}
.subject-card__badge--soon{
  background:var(--surface-alt);
  color:var(--text-secondary);
  border:1px solid var(--border-subtle);
}

@media(max-width:600px){
  .topic-grid{grid-template-columns:1fr 1fr}
  .subject-grid{grid-template-columns:1fr}
}
@media(max-width:380px){
  .topic-grid{grid-template-columns:1fr}
}`;
}

// ── 8. Maths hub page builder ─────────────────────────────────────────────────

function buildMathsHubPage() {
  const canonical    = 'https://prepstep.co.uk/practice/maths';
  const year         = new Date().getFullYear();
  const dateModified = new Date().toISOString().slice(0, 10);
  const title        = '11+ Maths Practice Questions (GL Assessment) | PrepStep';
  const description  = 'Free GL Assessment 11+ maths practice questions across all 16 topics: fractions, percentages, algebra, geometry and more. Five-option multiple-choice format with worked explanations, built for Year 5 and Year 6.';
  const ogTitle      = '11+ Maths Practice (GL Assessment) | PrepStep';
  const ogDescription = 'Free GL Assessment 11+ maths practice across all 16 topics. Five-option multiple-choice format with worked explanations, built for Year 5 and Year 6 preparation.';

  const topicCardsHtml = MATHS_TOPIC_ORDER.map(key => {
    const cfg  = TOPICS_CONFIG[key];
    const desc = TOPIC_DESCRIPTORS[key] || '';
    return `<a class="topic-card" href="/practice/maths/${key}" aria-label="${escHtml(cfg.topicLabel)} practice questions">
          <p class="topic-card__label">${escHtml(cfg.topicLabel)}</p>
          <p class="topic-card__desc">${escHtml(desc)}</p>
        </a>`;
  }).join('\n        ');

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',     item: 'https://prepstep.co.uk' },
      { '@type': 'ListItem', position: 2, name: 'Practice', item: 'https://prepstep.co.uk/practice' },
      { '@type': 'ListItem', position: 3, name: 'Maths',    item: canonical },
    ],
  };

  const collectionLd = {
    '@context':    'https://schema.org',
    '@type':       'CollectionPage',
    name:          ogTitle,
    description,
    url:           canonical,
    inLanguage:    'en-GB',
    dateModified,
    hasPart: MATHS_TOPIC_ORDER.map(key => ({
      '@type': 'WebPage',
      name:    `${TOPICS_CONFIG[key].topicLabel} 11+ Practice (GL Assessment)`,
      url:     `https://prepstep.co.uk/practice/maths/${key}`,
    })),
  };

  const orgLd = {
    '@context':  'https://schema.org',
    '@type':     'Organization',
    name:        'PrepStep',
    url:         'https://prepstep.co.uk',
    description: 'PrepStep is a free 11+ exam preparation app for GL Assessment, covering Maths, English and Verbal Reasoning.',
  };

  const jsonLd = JSON.stringify([breadcrumbLd, collectionLd, orgLd], null, 2);
  const css    = buildHubCss();

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- Primary SEO -->
  <title>${escHtml(title)}</title>
  <meta name="description" content="${escHtml(description)}">
  <link rel="canonical" href="${canonical}">

  <!-- Open Graph -->
  <meta property="og:title"       content="${escHtml(ogTitle)}">
  <meta property="og:description" content="${escHtml(ogDescription)}">
  <meta property="og:url"         content="${canonical}">
  <meta property="og:type"        content="website">
  <meta property="og:site_name"   content="PrepStep">
  <meta property="og:locale"      content="en_GB">

  <!-- Twitter / X -->
  <meta name="twitter:card"        content="summary_large_image">
  <meta name="twitter:title"       content="${escHtml(ogTitle)}">
  <meta name="twitter:description" content="${escHtml(ogDescription)}">
  <meta name="twitter:site"        content="@prepstepapp">

  <!-- Inline styles - no external dependencies, works in file:// -->
  <style>${css}</style>

  <!-- JSON-LD structured data -->
  <script type="application/ld+json">
${jsonLd}
  </script>
</head>
<body>

  <a href="#main-content" class="skip-link">Skip to main content</a>

  <!-- Site header -->
  <header class="site-header" role="banner">
    <div class="site-header__inner">
      <a href="/" class="site-header__brand" aria-label="PrepStep home">PrepStep</a>
      <a href="/" class="site-header__cta">Start practising free</a>
    </div>
  </header>

  <main id="main-content">
    <div class="page-wrap">

      <!-- Breadcrumb -->
      <nav aria-label="Breadcrumb" class="breadcrumb">
        <a href="/">Home</a>
        <span class="breadcrumb__sep" aria-hidden="true">/</span>
        <a href="/practice">Practice</a>
        <span class="breadcrumb__sep" aria-hidden="true">/</span>
        <span aria-current="page">Maths</span>
      </nav>

      <!-- Hero -->
      <section class="hero" aria-labelledby="hero-heading">
        <p class="hero__eyebrow" aria-hidden="true">GL Assessment &middot; 11+ Practice</p>
        <h1 id="hero-heading">11+ <em>Maths</em> Practice<br>(GL Assessment)</h1>
        <div class="hub-intro">
          <p>Free practice questions for all 16 maths topics tested in the GL Assessment 11+, in the real five-option multiple-choice format with worked explanations. The GL maths paper is 50 questions in 50 minutes, with no calculator. Questions cover Number, Algebra, Geometry, Measurement and Statistics.</p>
          <p>Choose any topic below to see sample questions, a GL topic guide, and the common mistakes children make under exam pressure. All content is built for Year 5 and Year 6 preparation, covering difficulty levels from Foundation to Challenging.</p>
        </div>
        <a href="/" class="hero__cta">
          Start practising free
          <span class="hero__cta-sub">All 16 maths topics &middot; No sign-up needed</span>
        </a>
      </section>

      <!-- Topic grid -->
      <section class="content-section" aria-labelledby="topics-heading">
        <p class="section-label" aria-hidden="true">
          <span>All maths topics</span>
          <span class="section-label__line"></span>
        </p>
        <h2 class="section-heading" id="topics-heading">All 16 GL Assessment Maths Topics</h2>
        <p class="skills-intro">Each topic has sample questions, a GL exam guide, and common mistakes to avoid. Click any topic to practise.</p>
        <nav aria-label="Maths practice topics" class="topic-grid">
          ${topicCardsHtml}
        </nav>
      </section>

    </div><!-- /page-wrap -->

    <!-- Closing CTA band -->
    <section class="cta-band" aria-labelledby="cta-hub-heading">
      <h2 id="cta-hub-heading">Ready to start practising?</h2>
      <p class="cta-band__sub">
        PrepStep has over 3,000 maths questions in GL Assessment format:
        five options, instant feedback, and step-by-step explanations. Free to start.
      </p>
      <a href="/" class="btn-primary">
        Start practising free
        <span class="btn-primary__sub">No sign-up needed &middot; Works on phone, tablet, and desktop</span>
      </a>
    </section>

  </main>

  <!-- Footer -->
  <footer class="site-footer" role="contentinfo">
    <div>
      <strong><a href="/">PrepStep</a></strong> &middot;
      11+ exam preparation for GL Assessment &middot;
      <a href="/practice">All practice topics</a>
    </div>
    <div style="margin-top:0.5rem">
      &copy; ${year} PrepStep &middot;
      <a href="/privacy">Privacy</a> &middot;
      <a href="/terms">Terms</a>
    </div>
  </footer>

</body>
</html>`;
}

// ── 9. Practice hub page builder ──────────────────────────────────────────────

function buildPracticeHubPage() {
  const canonical    = 'https://prepstep.co.uk/practice';
  const year         = new Date().getFullYear();
  const dateModified = new Date().toISOString().slice(0, 10);
  const title        = '11+ Practice Questions (GL Assessment) | PrepStep';
  const description  = 'Free GL Assessment 11+ practice questions for Maths, English and Verbal Reasoning. Five-option multiple-choice format with worked explanations. Built for Year 5 and Year 6.';
  const ogTitle      = '11+ Practice Questions (GL Assessment) | PrepStep';
  const ogDescription = 'Free GL Assessment 11+ practice for Maths, English and Verbal Reasoning. Five-option multiple-choice with worked explanations, built for Year 5 and Year 6.';

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',     item: 'https://prepstep.co.uk' },
      { '@type': 'ListItem', position: 2, name: 'Practice', item: canonical },
    ],
  };

  const collectionLd = {
    '@context':  'https://schema.org',
    '@type':     'CollectionPage',
    name:        ogTitle,
    description,
    url:         canonical,
    inLanguage:  'en-GB',
    dateModified,
    hasPart: [
      {
        '@type': 'WebPage',
        name:    '11+ Maths Practice (GL Assessment)',
        url:     'https://prepstep.co.uk/practice/maths',
      },
    ],
  };

  const orgLd = {
    '@context':  'https://schema.org',
    '@type':     'Organization',
    name:        'PrepStep',
    url:         'https://prepstep.co.uk',
    description: 'PrepStep is a free 11+ exam preparation app for GL Assessment, covering Maths, English and Verbal Reasoning.',
  };

  const jsonLd = JSON.stringify([breadcrumbLd, collectionLd, orgLd], null, 2);
  const css    = buildHubCss();

  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- Primary SEO -->
  <title>${escHtml(title)}</title>
  <meta name="description" content="${escHtml(description)}">
  <link rel="canonical" href="${canonical}">

  <!-- Open Graph -->
  <meta property="og:title"       content="${escHtml(ogTitle)}">
  <meta property="og:description" content="${escHtml(ogDescription)}">
  <meta property="og:url"         content="${canonical}">
  <meta property="og:type"        content="website">
  <meta property="og:site_name"   content="PrepStep">
  <meta property="og:locale"      content="en_GB">

  <!-- Twitter / X -->
  <meta name="twitter:card"        content="summary_large_image">
  <meta name="twitter:title"       content="${escHtml(ogTitle)}">
  <meta name="twitter:description" content="${escHtml(ogDescription)}">
  <meta name="twitter:site"        content="@prepstepapp">

  <!-- Inline styles - no external dependencies, works in file:// -->
  <style>${css}</style>

  <!-- JSON-LD structured data -->
  <script type="application/ld+json">
${jsonLd}
  </script>
</head>
<body>

  <a href="#main-content" class="skip-link">Skip to main content</a>

  <!-- Site header -->
  <header class="site-header" role="banner">
    <div class="site-header__inner">
      <a href="/" class="site-header__brand" aria-label="PrepStep home">PrepStep</a>
      <a href="/" class="site-header__cta">Start practising free</a>
    </div>
  </header>

  <main id="main-content">
    <div class="page-wrap">

      <!-- Breadcrumb -->
      <nav aria-label="Breadcrumb" class="breadcrumb">
        <a href="/">Home</a>
        <span class="breadcrumb__sep" aria-hidden="true">/</span>
        <span aria-current="page">Practice</span>
      </nav>

      <!-- Hero -->
      <section class="hero" aria-labelledby="hero-heading">
        <p class="hero__eyebrow" aria-hidden="true">GL Assessment &middot; 11+ Preparation</p>
        <h1 id="hero-heading">11+ <em>Practice Questions</em><br>(GL Assessment)</h1>
        <div class="hub-intro">
          <p>Free practice questions for the GL Assessment 11+, covering Maths, English and Verbal Reasoning. All questions match the real exam format: five-option multiple choice, worked explanations, and difficulty levels from Foundation to Challenging.</p>
          <p>Built for children in Year 5 and Year 6 preparing for the GL Assessment, which is used by grammar schools and selective independent schools across England.</p>
        </div>
        <a href="/" class="hero__cta">
          Start practising free
          <span class="hero__cta-sub">No sign-up needed &middot; Works on phone, tablet, and desktop</span>
        </a>
      </section>

      <!-- Subject cards -->
      <section class="content-section" aria-labelledby="subjects-heading">
        <p class="section-label" aria-hidden="true">
          <span>Subjects</span>
          <span class="section-label__line"></span>
        </p>
        <h2 class="section-heading" id="subjects-heading">Choose a Subject</h2>
        <p class="skills-intro">GL Assessment 11+ papers cover three subjects. Maths practice is available now, with English and Verbal Reasoning coming soon.</p>
        <div class="subject-grid">

          <!-- Maths (live) -->
          <a class="subject-card" href="/practice/maths" aria-label="11+ Maths practice questions">
            <p class="subject-card__eyebrow subject-card__eyebrow--maths">Maths</p>
            <h3 class="subject-card__title">11+ Maths</h3>
            <p class="subject-card__desc">All 16 GL Assessment maths topics: Number, Algebra, Geometry, Measurement and Statistics. Five-option questions with worked explanations.</p>
            <span class="subject-card__badge subject-card__badge--live">Live &middot; 16 topics</span>
          </a>

          <!-- English (coming soon) -->
          <div class="subject-card subject-card--disabled" aria-label="11+ English practice questions, coming soon" role="article">
            <p class="subject-card__eyebrow subject-card__eyebrow--english">English</p>
            <h3 class="subject-card__title">11+ English</h3>
            <p class="subject-card__desc">Comprehension, vocabulary, grammar, spelling and punctuation in GL Assessment format. Worked explanations for every question.</p>
            <span class="subject-card__badge subject-card__badge--soon">Coming soon</span>
          </div>

          <!-- Verbal Reasoning (coming soon) -->
          <div class="subject-card subject-card--disabled" aria-label="11+ Verbal Reasoning practice questions, coming soon" role="article">
            <p class="subject-card__eyebrow subject-card__eyebrow--vr">Verbal Reasoning</p>
            <h3 class="subject-card__title">11+ Verbal Reasoning</h3>
            <p class="subject-card__desc">All GL Assessment VR question types: codes, analogies, word patterns, missing letters and more. Five-option format with full explanations.</p>
            <span class="subject-card__badge subject-card__badge--soon">Coming soon</span>
          </div>

        </div>
      </section>

    </div><!-- /page-wrap -->

    <!-- Closing CTA band -->
    <section class="cta-band" aria-labelledby="cta-hub-heading">
      <h2 id="cta-hub-heading">Start with Maths today</h2>
      <p class="cta-band__sub">
        PrepStep has over 8,000 questions across Maths, English and Verbal Reasoning in GL Assessment format.
        Free to start, no sign-up needed.
      </p>
      <a href="/" class="btn-primary">
        Start practising free
        <span class="btn-primary__sub">No sign-up needed &middot; Works on phone, tablet, and desktop</span>
      </a>
    </section>

  </main>

  <!-- Footer -->
  <footer class="site-footer" role="contentinfo">
    <div>
      <strong><a href="/">PrepStep</a></strong> &middot;
      11+ exam preparation for GL Assessment &middot;
      <a href="/practice/maths">Maths practice</a>
    </div>
    <div style="margin-top:0.5rem">
      &copy; ${year} PrepStep &middot;
      <a href="/privacy">Privacy</a> &middot;
      <a href="/terms">Terms</a>
    </div>
  </footer>

</body>
</html>`;
}

// ── 10. Sitemap generator ─────────────────────────────────────────────────────

function generateSitemap() {
  const today = new Date().toISOString().slice(0, 10);

  // All public URLs in priority order (19 total)
  const urls = [
    { loc: 'https://prepstep.co.uk/',               priority: '1.0', freq: 'daily'  },
    { loc: 'https://prepstep.co.uk/practice',        priority: '0.9', freq: 'weekly' },
    { loc: 'https://prepstep.co.uk/practice/maths',  priority: '0.9', freq: 'weekly' },
    ...MATHS_TOPIC_ORDER.map(key => ({
      loc:      `https://prepstep.co.uk/practice/maths/${key}`,
      priority: '0.8',
      freq:     'weekly',
    })),
  ];

  const urlEntries = urls.map(({ loc, priority, freq }) =>
    `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
  ).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>`;
}

// ── 11. Main page builder ─────────────────────────────────────────────────────

function buildPage(config) {
  const topicData = mathsData.topics[config.topicKey];
  if (!topicData) {
    throw new Error(`Topic '${config.topicKey}' not found in mathsData`);
  }

  console.log(`\nBuilding: ${config.topicLabel} (${config.subject})`);
  console.log(`  Questions in bank: ${topicData.questions.length}`);

  // Select the configured questions
  const questions = config.questionIds.map(id => {
    const q = topicData.questions.find(q => q.id === id);
    if (!q) throw new Error(`Question ID ${id} not found in ${config.topicKey}`);
    return q;
  });

  const visualQuestion = questions.find(q => q.visual);
  console.log(`  Selected ${questions.length} questions`);
  console.log(`  Visual question: ${visualQuestion ? `ID ${visualQuestion.id} (${visualQuestion.visual.component})` : 'none'}`);

  // Render all question cards
  const questionCardsHtml = questions.map((q, i) => renderQuestionCard(q, i)).join('\n\n    ');

  // Render FAQ
  const faqHtml = config.faq.map((item, i) => `<details class="faq-item">
        <summary class="faq-item__question">
          <span>${escHtml(item.q)}</span>
          <span class="faq-item__icon" aria-hidden="true">+</span>
        </summary>
        <div class="faq-item__answer">
          <p>${escHtml(item.a)}</p>
        </div>
      </details>`).join('\n      ');

  // Render pitfalls
  const pitfallsHtml = config.pitfalls.map((p, i) => `<div class="pitfall-card">
        <p class="pitfall-card__num">Common mistake ${i + 1} of ${config.pitfalls.length}</p>
        <p class="pitfall-card__lead">${escHtml(p.lead)}</p>
        <p class="pitfall-card__tip"><span class="pitfall-tip-label">Tip:</span> ${escHtml(p.tip)}</p>
      </div>`).join('\n      ');

  // Render topic skills list
  const skillsListHtml = config.topicBreakdown.items
    .map(item => `<li>${escHtml(item)}</li>`)
    .join('\n        ');

  const jsonLd = buildJsonLd(config, questions);
  const css    = buildCss();
  const year   = new Date().getFullYear();

  const html = `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- Primary SEO -->
  <title>${escHtml(config.meta.title)}</title>
  <meta name="description" content="${escHtml(config.meta.description)}">
  <link rel="canonical" href="${config.canonical}">

  <!-- Open Graph -->
  <meta property="og:title"       content="${escHtml(config.meta.ogTitle)}">
  <meta property="og:description" content="${escHtml(config.meta.ogDescription)}">
  <meta property="og:url"         content="${config.canonical}">
  <meta property="og:type"        content="article">
  <meta property="og:site_name"   content="PrepStep">
  <meta property="og:locale"      content="en_GB">

  <!-- Twitter / X -->
  <meta name="twitter:card"        content="summary_large_image">
  <meta name="twitter:title"       content="${escHtml(config.meta.ogTitle)}">
  <meta name="twitter:description" content="${escHtml(config.meta.ogDescription)}">
  <meta name="twitter:site"        content="@prepstepapp">

  <!-- Inline styles - no external dependencies, works in file:// -->
  <style>${css}</style>

  <!-- JSON-LD structured data -->
  <script type="application/ld+json">
${jsonLd}
  </script>
</head>
<body>

  <a href="#main-content" class="skip-link">Skip to main content</a>

  <!-- Site header -->
  <header class="site-header" role="banner">
    <div class="site-header__inner">
      <a href="/" class="site-header__brand" aria-label="PrepStep home">PrepStep</a>
      <a href="/" class="site-header__cta">Start practising free</a>
    </div>
  </header>

  <main id="main-content">
    <div class="page-wrap">

      <!-- Breadcrumb -->
      <nav aria-label="Breadcrumb" class="breadcrumb">
        <a href="/">Home</a>
        <span class="breadcrumb__sep" aria-hidden="true">/</span>
        <a href="/practice">Practice</a>
        <span class="breadcrumb__sep" aria-hidden="true">/</span>
        <a href="/practice/${config.subject}">${escHtml(config.subjectLabel)}</a>
        <span class="breadcrumb__sep" aria-hidden="true">/</span>
        <span aria-current="page">${escHtml(config.topicLabel)}</span>
      </nav>

      <!-- Hero -->
      <section class="hero" aria-labelledby="hero-heading">
        <p class="hero__eyebrow" aria-hidden="true">GL Assessment &middot; 11+ Maths</p>
        <h1 id="hero-heading">11+ <em>${escHtml(config.topicLabel)}</em> Practice<br>(GL Assessment)</h1>
        <div class="hero__intro">
          ${config.intro.split('\n\n').map(p => `<p>${escHtml(p)}</p>`).join('\n          ')}
        </div>
        <a href="/" class="hero__cta">
          Start practising free
          <span class="hero__cta-sub">${topicData.questions.length} ${config.topicLabel.toLowerCase()} questions &middot; No sign-up needed</span>
        </a>
      </section>

      <!-- What GL tests on fractions -->
      <section class="content-section" aria-labelledby="what-tested-heading">
        <p class="section-label" aria-hidden="true">
          <span>Exam guide</span>
          <span class="section-label__line"></span>
        </p>
        <h2 class="section-heading" id="what-tested-heading">What the GL 11+ Tests on ${escHtml(config.topicLabel)}</h2>
        <p class="skills-intro">${escHtml(config.topicBreakdown.intro)}</p>
        <ul class="skills-list" aria-label="${escHtml(config.topicLabel)} sub-skills tested by GL">
          ${skillsListHtml}
        </ul>
        <p class="skills-footnote">${escHtml(config.topicBreakdown.footnote)}</p>
      </section>

      <!-- Sample questions -->
      <section class="content-section" aria-labelledby="sample-questions-heading">
        <p class="section-label" aria-hidden="true">
          <span>Practice</span>
          <span class="section-label__line"></span>
        </p>
        <h2 class="section-heading" id="sample-questions-heading">Sample ${escHtml(config.topicLabel)} Questions</h2>
        <p class="questions-intro">
          Five questions drawn from PrepStep&rsquo;s ${config.topicLabel.toLowerCase()} bank, spanning Foundation to Challenging.
          Tap &ldquo;Show worked explanation&rdquo; to see the full method after you&rsquo;ve had a go.
          The correct answer is highlighted on each question so you can check immediately.
        </p>
        <div class="questions-grid">
          ${questionCardsHtml}
        </div>
      </section>

      <!-- Common pitfalls -->
      <section class="content-section" aria-labelledby="pitfalls-heading">
        <p class="section-label" aria-hidden="true">
          <span>Watch out for</span>
          <span class="section-label__line"></span>
        </p>
        <h2 class="section-heading" id="pitfalls-heading">Common Mistakes to Avoid</h2>
        <div class="pitfalls-grid">
          ${pitfallsHtml}
        </div>
      </section>

      <!-- FAQ -->
      <section class="content-section" aria-labelledby="faq-heading">
        <p class="section-label" aria-hidden="true">
          <span>FAQ</span>
          <span class="section-label__line"></span>
        </p>
        <h2 class="section-heading" id="faq-heading">Frequently Asked Questions</h2>
        <div class="faq-list" role="list">
          ${faqHtml}
        </div>
      </section>

    </div><!-- /page-wrap -->

    <!-- Closing CTA band -->
    <section class="cta-band" aria-labelledby="cta-heading">
      <h2 id="cta-heading">Ready to build real ${config.topicLabel.toLowerCase()} confidence?</h2>
      <p class="cta-band__sub">
        PrepStep has ${topicData.questions.length} ${config.topicLabel.toLowerCase()} questions in GL Assessment format:
        five options, instant feedback, and step-by-step explanations. Free to start.
      </p>
      <a href="/" class="btn-primary">
        Start practising free
        <span class="btn-primary__sub">No sign-up needed &middot; Works on phone, tablet, and desktop</span>
      </a>
    </section>

  </main>

  <!-- Footer -->
  <footer class="site-footer" role="contentinfo">
    <div>
      <strong><a href="/">PrepStep</a></strong> &middot;
      11+ exam preparation for GL Assessment &middot;
      <a href="/practice">All practice topics</a> &middot;
      <a href="/practice/${config.subject}">${escHtml(config.subjectLabel)} topics</a>
    </div>
    <div style="margin-top:0.5rem">
      &copy; ${year} PrepStep &middot;
      <a href="/privacy">Privacy</a> &middot;
      <a href="/terms">Terms</a>
    </div>
    <div style="margin-top:0.5rem;font-size:0.75rem;opacity:0.6">
      Note: /practice, /practice/${config.subject}, /privacy and /terms links will resolve once
      those pages are published. This page&rsquo;s canonical URL is
      <a href="${config.canonical}">${config.canonical}</a>.
    </div>
  </footer>

</body>
</html>`;

  return { html, questions };
}

// ── 7. Run ────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const generateAll = args.includes('--all');
const topicsToGenerate = generateAll ? Object.keys(TOPICS_CONFIG) : ['fractions'];

for (const topicKey of topicsToGenerate) {
  const config = TOPICS_CONFIG[topicKey];
  if (!config) {
    console.error(`No config found for topic '${topicKey}'`);
    process.exit(1);
  }

  let result;
  try {
    result = buildPage(config);
  } catch (err) {
    console.error(`Error building ${topicKey}: ${err.message}`);
    process.exit(1);
  }

  const outDir  = path.join(ROOT, 'public/practice', config.subject);
  const outPath = path.join(outDir, `${config.topicKey}.html`);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outPath, result.html, 'utf8');
  console.log(`  Wrote: ${outPath}`);

  // ── Verification ────────────────────────────────────────────────────────────
  const written = fs.readFileSync(outPath, 'utf8');

  const checks = {
    'Q text in raw HTML':    written.includes(result.questions[0].question.substring(0, 30)),
    'Explanation in HTML':   written.includes(result.questions[0].explanation.substring(0, 30)),
    'Five-option format':    written.includes('five options') || written.includes('(A to E)'),
    'JSON-LD valid':         (() => {
      const m = written.match(/<script type="application\/ld\+json">([\s\S]+?)<\/script>/);
      if (!m) return false;
      try { JSON.parse(m[1]); return true; } catch { return false; }
    })(),
    'FAQPage in JSON-LD':    written.includes('"FAQPage"'),
    'BreadcrumbList in LD':  written.includes('"BreadcrumbList"'),
    'Article in JSON-LD':    written.includes('"Article"'),
    'Canonical present':     written.includes(`href="${config.canonical}"`),
    'OG tags present':       written.includes('property="og:title"'),
    'Twitter tags present':  written.includes('name="twitter:card"'),
    'Diagram renders if due': !result.questions.some(q => q.visual) || written.includes('q-diagram'),
    'Skip link present':     written.includes('skip-link'),
    'No external CSS links': !written.match(/<link[^>]+stylesheet[^>]+https?:\/\//),
  };

  console.log('\n  VERIFICATION:');
  let allPassed = true;
  for (const [label, passed] of Object.entries(checks)) {
    const icon = passed ? 'PASS' : 'FAIL';
    if (!passed) allPassed = false;
    console.log(`    [${icon}] ${label}`);
  }
  console.log(`  File size: ${(written.length / 1024).toFixed(1)} KB`);
  if (allPassed) {
    console.log(`  All checks passed.`);
  } else {
    console.log(`  Some checks FAILED — see above.`);
    process.exit(1);
  }
}

// ── Hub pages and sitemap (only when --all is used) ───────────────────────────
if (generateAll) {
  // Maths hub
  console.log('\nBuilding: Maths hub (public/practice/maths/index.html)');
  const mathsHubHtml = buildMathsHubPage();
  const mathsHubPath = path.join(ROOT, 'public/practice/maths/index.html');
  fs.writeFileSync(mathsHubPath, mathsHubHtml, 'utf8');
  const mathsHubCheck = fs.readFileSync(mathsHubPath, 'utf8');
  const mathsTopicLinks = (mathsHubCheck.match(/href="\/practice\/maths\/[a-z]+"/g) || []).length;
  const mathsJsonLdValid = (() => {
    const m = mathsHubCheck.match(/<script type="application\/ld\+json">([\s\S]+?)<\/script>/);
    if (!m) return false;
    try { JSON.parse(m[1]); return true; } catch { return false; }
  })();
  console.log(`  Wrote: ${mathsHubPath} (${(mathsHubCheck.length / 1024).toFixed(1)} KB)`);
  console.log(`  [${mathsJsonLdValid ? 'PASS' : 'FAIL'}] JSON-LD valid`);
  console.log(`  [${mathsHubCheck.includes('"BreadcrumbList"') ? 'PASS' : 'FAIL'}] BreadcrumbList in JSON-LD`);
  console.log(`  [${mathsHubCheck.includes('"CollectionPage"') ? 'PASS' : 'FAIL'}] CollectionPage in JSON-LD`);
  console.log(`  [${mathsTopicLinks === 16 ? 'PASS' : 'FAIL'}] Topic links: ${mathsTopicLinks} (expected 16)`);
  console.log(`  [${mathsHubCheck.includes('skip-link') ? 'PASS' : 'FAIL'}] Skip link present`);
  console.log(`  [${!mathsHubCheck.match(/<link[^>]+stylesheet[^>]+https?:\/\//) ? 'PASS' : 'FAIL'}] No external CSS`);

  // Practice hub
  console.log('\nBuilding: Practice hub (public/practice/index.html)');
  const practiceHubHtml = buildPracticeHubPage();
  const practiceHubPath = path.join(ROOT, 'public/practice/index.html');
  fs.writeFileSync(practiceHubPath, practiceHubHtml, 'utf8');
  const practiceHubCheck = fs.readFileSync(practiceHubPath, 'utf8');
  const practiceJsonLdValid = (() => {
    const m = practiceHubCheck.match(/<script type="application\/ld\+json">([\s\S]+?)<\/script>/);
    if (!m) return false;
    try { JSON.parse(m[1]); return true; } catch { return false; }
  })();
  const comingSoonCards = (practiceHubCheck.match(/subject-card--disabled/g) || []).length;
  console.log(`  Wrote: ${practiceHubPath} (${(practiceHubCheck.length / 1024).toFixed(1)} KB)`);
  console.log(`  [${practiceJsonLdValid ? 'PASS' : 'FAIL'}] JSON-LD valid`);
  console.log(`  [${practiceHubCheck.includes('"BreadcrumbList"') ? 'PASS' : 'FAIL'}] BreadcrumbList in JSON-LD`);
  console.log(`  [${practiceHubCheck.includes('href="/practice/maths"') ? 'PASS' : 'FAIL'}] Maths card links to /practice/maths`);
  console.log(`  [${comingSoonCards >= 2 ? 'PASS' : 'FAIL'}] Coming-soon cards: ${comingSoonCards} (expected at least 2)`);
  console.log(`  [${practiceHubCheck.includes('skip-link') ? 'PASS' : 'FAIL'}] Skip link present`);

  // Sitemap
  console.log('\nBuilding: public/sitemap.xml');
  const sitemapXml  = generateSitemap();
  const sitemapPath = path.join(ROOT, 'public/sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemapXml, 'utf8');
  const urlCount = (sitemapXml.match(/<url>/g) || []).length;
  console.log(`  Wrote: ${sitemapPath}`);
  console.log(`  [${urlCount === 19 ? 'PASS' : 'FAIL'}] URL count: ${urlCount} (expected 19: root + /practice + /practice/maths + 16 topics)`);
  console.log(`  [${sitemapXml.includes('prepstep.co.uk/') ? 'PASS' : 'FAIL'}] Root URL present`);
}

console.log('\nDone.');
