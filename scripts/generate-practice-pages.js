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
const englishData    = require(path.join(ROOT, 'src/questionData/englishData')).default;
const vrData         = require(path.join(ROOT, 'src/questionData/vrData')).default;
const visuals        = require(path.join(ROOT, 'src/microLessons/visuals'));

// Dataset registry: keyed by the subject string used in TOPICS_CONFIG entries.
const DATASETS = {
  maths:   mathsData,
  english: englishData,
  vr:      vrData,
};

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

  // ── ENGLISH: COMPREHENSION ────────────────────────────────────────────────
  comprehension: {
    subject:      'english',
    subjectLabel: 'English',
    topicKey:     'comprehension',
    slug:         'comprehension',
    topicLabel:   'Comprehension',
    canonical:    'https://prepstep.co.uk/practice/english/comprehension',
    questionIds:  [48],

    intro: `Reading comprehension is the single biggest part of the GL Assessment 11+ English paper, worth around half of all the marks. In a typical paper your child reads one continuous passage of roughly 500 words (about two pages) and then answers somewhere between 13 and 18 questions on it, so strong comprehension does more to lift an English score than any other skill.

GL tests comprehension entirely through multiple choice, with five options (A to E) marked on a separate answer sheet. The questions are mixed deliberately rather than grouped by type: a retrieval question about a single fact might sit right next to one asking your child to read between the lines, work out what a word means in context, or spot a simile. The passage is usually pitched a year or two above your child's age, often drawn from published fiction, non-fiction or poetry, which is why wide reading matters so much.

On this page your child practises the real thing: one passage with one carefully built question at a time, in the exact five-option format GL uses. That is a gentler, more focused way to grow the skill than a full timed paper, and every question comes with a worked explanation so your child learns why the right answer is right, not just what it is.`,

    topicBreakdown: {
      intro: `A GL comprehension section mixes several reading skills together; GL does not publish exact weightings, so the order below is our research estimate from analysing practice papers, in rough order of how often each appears:`,
      items: [
        `Information retrieval (finding facts directly stated in the passage): the most common skill, an estimated 35 to 45% of questions`,
        `Inference and deduction (reading between the lines, working out what is implied): an estimated 20 to 30%, and the skill that most separates the strongest candidates`,
        `Vocabulary in context (working out what a word means from the surrounding text): an estimated 15 to 20%`,
        `Literary devices and language (spotting similes, metaphors, personification and their effect): an estimated 5 to 10%`,
        `Word class identification (naming a word as a noun, verb, adjective, adverb and so on): an estimated 5 to 10%`,
        `Author's purpose and tone (why the author wrote it a certain way, the overall mood): an estimated 3 to 5%`,
        `Summary and main idea (capturing the key point of a section or the whole passage): an estimated 2 to 5%`,
      ],
      footnote: `Difficulty runs from straightforward retrieval, where the answer is almost quoted in the text, up to deep inference and author's-craft questions that need your child to weigh several "best answer" options, all pitched at a reading level above Year 6.`,
    },

    pitfalls: [
      {
        lead: `Picking an option just because it contains words from the passage.`,
        tip:  `GL deliberately uses familiar passage words in wrong answers that actually reply to a different question. Teach your child to check the option answers the exact question asked, not just that it "looks like" the text.`,
      },
      {
        lead: `Reading inference questions too literally.`,
        tip:  `When a question asks how a character feels or what something suggests, the surface fact is rarely the answer. Encourage your child to ask "what does this tell me that the text does not say outright?" before choosing.`,
      },
      {
        lead: `Answering from outside knowledge instead of the passage.`,
        tip:  `Every answer must be provable from the text in front of them. If a child knows something is true in real life but the passage does not support it, it is the wrong choice here.`,
      },
      {
        lead: `Grabbing the first answer that looks right.`,
        tip:  `GL often hides a more precise option further down the list and places a tempting "too obvious" answer first. Train your child to read all five options before committing and pick the best supported one.`,
      },
    ],

    faq: [
      {
        q: `What is reading comprehension in the GL 11+ English exam?`,
        a: `It is the part of the GL Assessment 11+ English paper where your child reads a passage of around 500 words and answers multiple-choice questions on it. The questions test whether they can find facts, infer meaning, understand vocabulary in context, and recognise the author's techniques. It is worth roughly half of all the marks in the English paper.`,
      },
      {
        q: `How is comprehension tested in the GL 11+ exam?`,
        a: `Entirely through multiple choice, with five options (A to E) marked on a separate answer sheet. Your child reads one passage and then answers between 13 and 18 questions on it. The question types are mixed together rather than grouped, so a child has to switch between finding facts, inferring meaning and spotting language techniques as they go.`,
      },
      {
        q: `How many comprehension questions are in the GL 11+ English paper?`,
        a: `A typical paper has between 13 and 18 comprehension questions on a single passage, out of about 49 questions in the whole 45-minute English paper. That makes comprehension the largest single block and the one most worth practising. The exact number varies from one sitting to the next.`,
      },
      {
        q: `What is the hardest part of GL comprehension?`,
        a: `Inference is the most challenging and the most discriminating skill. These questions are never answered word-for-word in the text, so your child has to combine clues from different sentences to reach a conclusion. Children who can find facts but cannot read between the lines tend to plateau, which is why inference deserves the most practice.`,
      },
      {
        q: `How can my child improve at comprehension for the 11+?`,
        a: `Wide, regular reading of fiction, non-fiction and poetry is the single most effective preparation, ideally a little above their comfortable level. Alongside that, practising GL-format multiple-choice questions builds familiarity with the distractor traps and the "best answer" style. Free PrepStep practice gives one passage and question at a time with a worked explanation, so understanding grows steadily.`,
      },
    ],

    meta: {
      title:         `11+ Reading Comprehension Practice (GL Assessment) | PrepStep`,
      description:   `Free 11+ reading comprehension practice for the GL Assessment. Passage-based five-option questions with worked explanations. Around half the English paper.`,
      ogTitle:       `11+ Reading Comprehension Practice (GL Assessment) | PrepStep`,
      ogDescription: `Free GL Assessment 11+ comprehension practice: real passages, five-option questions, worked explanations. The biggest part of the English paper, made approachable.`,
    },
  },

  // ── ENGLISH: SPELLING ─────────────────────────────────────────────────────
  spelling: {
    subject:      'english',
    subjectLabel: 'English',
    topicKey:     'spelling',
    slug:         'spelling',
    topicLabel:   'Spelling',
    canonical:    'https://prepstep.co.uk/practice/english/spelling',
    questionIds:  [11, 14, 3, 17, 7],

    intro: `Spelling makes up roughly 4 to 8 questions in a typical GL Assessment 11+ English paper, and sits inside the Technical English section (spelling, punctuation and grammar) that is worth around half of the whole paper. Those marks are some of the most winnable in the exam, because spelling rewards steady, systematic practice more than any other English skill.

GL almost never asks a child to spell a word from scratch. Instead it uses an error-spotting format: a sentence is split into four labelled sections (A, B, C and D), with a fifth option for "No mistake". Your child reads the whole sentence and decides which section contains the misspelled word, or chooses "No mistake" if every word is correct. The mistakes are always realistic ones children genuinely make, never random jumbles, so the skill is careful proof-reading rather than guesswork.

This is a very learnable format. Once a child knows the high-frequency tricky words and the common spelling patterns GL tests, they spot the errors quickly and confidently. Every question on this page follows that exact four-section structure with a worked explanation, so your child learns the rule behind each answer.`,

    topicBreakdown: {
      intro: `GL spelling questions cluster around a handful of patterns; GL does not publish exact weightings, so the order below is our research estimate from analysing practice papers and tutor materials, in rough order of frequency:`,
      items: [
        `Homophones and near-homophones (their/there/they're, practice/practise, complement/compliment): an estimated 20%`,
        `Suffixes and word endings (-tion/-sion/-cian, -ible/-able, -ous, -ence/-ance): an estimated 20%`,
        `Silent or unstressed letters (Wednesday, February, parliament, government): an estimated 12%`,
        `Double letters (accommodate, recommend, necessary, embarrass): an estimated 12%`,
        `The ie/ei patterns (receive, believe, achieve, plus the "weird" exceptions): an estimated 8%`,
        `Prefixes (dis-, mis-, un-, in-, il-, ir-, im-): an estimated 8%`,
        `Commonly misspelled words (separate, definitely, occurrence): an estimated 8%`,
        `Plurals and verb forms (-ies/-eys, irregular plurals, dropping or keeping the e): an estimated 7%`,
      ],
      footnote: `Difficulty runs from high-frequency Year 3 to 4 words with an obvious error, up to less common Year 5 to 6 words where the wrong spelling is a genuine real-world slip and several correct words look tricky on purpose.`,
    },

    pitfalls: [
      {
        lead: `Assuming there must always be an error.`,
        tip:  `Around 15 to 20% of GL spelling questions are correctly spelled, with "No mistake" as the right answer. Teach your child that "No mistake" is a real, common answer, so they check every section rather than forcing an error that is not there.`,
      },
      {
        lead: `Only checking the longest or hardest-looking word.`,
        tip:  `GL often hides the error in an ordinary word and surrounds it with tricky but correct ones to create doubt. Encourage your child to proof-read all four sections word by word, not just the one that looks difficult.`,
      },
      {
        lead: `Spelling by ear and dropping unstressed syllables.`,
        tip:  `Words like interesting, temperature and February are misspelled because the middle sound is swallowed in speech (intresting, Febuary). Get your child to sound out every syllable, especially the quiet middle ones.`,
      },
      {
        lead: `Confusing homophones because the spelling sounds correct.`,
        tip:  `their/there/they're, practice/practise and complement/compliment all sound right but mean different things. Teach your child to check the meaning in the sentence, not just whether the word sounds like the one intended.`,
      },
    ],

    faq: [
      {
        q: `How is spelling tested in the GL 11+ English exam?`,
        a: `GL uses an error-spotting format. A sentence is split into four sections (A to D), with a fifth option for "No mistake". Your child decides which section contains a misspelled word, or chooses "No mistake" if all the spellings are correct. It is multiple choice, marked on a separate answer sheet, and there is one misspelling per sentence at most.`,
      },
      {
        q: `What does "No mistake" mean in GL spelling questions?`,
        a: `It is the fifth option, used when every word in the sentence is spelled correctly. Roughly 15 to 20% of GL spelling questions have "No mistake" as the correct answer, and it appears more often in the harder questions. It exists to stop children assuming there is always an error to find, so it is worth practising deliberately.`,
      },
      {
        q: `Which words are most commonly tested in GL 11+ spelling?`,
        a: `GL leans on a well-known set of tricky Year 5 to 6 words, including accommodate, necessary, separate, definitely, embarrass, government, environment, immediately, occurrence, rhythm, mischievous, pronunciation and parliament. Homophones such as their/there/they're and practice/practise come up regularly too. Learning these high-frequency words gives the quickest gains.`,
      },
      {
        q: `How hard is spelling in the GL 11+ exam?`,
        a: `Difficulty ranges from common words with an obvious error, which a child who reads regularly spots instantly, up to less common words where just one letter is wrong and the misspelling is a genuine common slip. The hardest questions surround the error with correctly spelled but tricky-looking words to create doubt, and use "No mistake" more often.`,
      },
      {
        q: `How can my child practise spelling for the 11+?`,
        a: `Practise in the real GL error-spotting format rather than just writing out spelling lists, so your child gets used to proof-reading four sections and considering "No mistake". Focus first on the highest-frequency patterns: homophones, common word endings, and the well-known tricky words. Free PrepStep practice presents each question in the exact GL format with a worked explanation.`,
      },
    ],

    meta: {
      title:         `11+ Spelling Practice for the GL Assessment | PrepStep`,
      description:   `Free 11+ spelling practice for the GL Assessment in the real error-spotting format: four sections plus "No mistake", five options, worked explanations.`,
      ogTitle:       `11+ Spelling Practice for the GL Assessment | PrepStep`,
      ogDescription: `Free GL Assessment 11+ spelling practice in the real error-spotting format (four sections plus "No mistake"). Worked explanations on every question.`,
    },
  },

  // ── ENGLISH: PUNCTUATION ──────────────────────────────────────────────────
  punctuation: {
    subject:      'english',
    subjectLabel: 'English',
    topicKey:     'punctuation',
    slug:         'punctuation',
    topicLabel:   'Punctuation',
    canonical:    'https://prepstep.co.uk/practice/english/punctuation',
    questionIds:  [1, 2, 3, 10, 20],

    intro: `Punctuation accounts for roughly 4 to 8 questions in a typical GL Assessment 11+ English paper, about 16% of the total English marks, and sits within the Technical English section alongside spelling and grammar. Like spelling, these are highly winnable marks because punctuation rewards knowing a clear set of rules and applying them carefully.

GL tests punctuation with the same error-spotting format as spelling: a sentence is split into four labelled sections (A, B, C and D), with a fifth option for "No mistake". Your child reads the whole sentence and identifies which section contains a punctuation error, or chooses "No mistake" if it is all correct. There is at most one error per sentence, and the mistakes are always ones children genuinely make, such as a missing apostrophe, a misplaced comma or speech punctuation in the wrong place.

The skill here is careful proof-reading combined with knowing the rules, and that is very teachable. Once a child is secure on apostrophes, commas and speech punctuation, the great majority of GL questions become straightforward. Every question on this page uses the exact four-section format with a worked explanation, so your child learns the rule behind each answer.`,

    topicBreakdown: {
      intro: `GL punctuation questions concentrate on a few high-value areas; GL does not publish exact weightings, so the order below is our research estimate from analysing practice papers and tutor materials, in rough order of frequency:`,
      items: [
        `Apostrophes (possession, contractions, and the its/it's trap): the most common area, an estimated 25 to 30%`,
        `Commas (lists, fronted adverbials, subordinate clauses, comma splices): an estimated 20 to 25%`,
        `Speech punctuation (speech marks, the comma before speech, capitals and punctuation inside the marks): an estimated 15 to 20%`,
        `Sentence-ending punctuation (full stops, question marks, exclamation marks in the right place): an estimated 10 to 12%`,
        `Capital letters (sentence starts, proper nouns, the pronoun "I", days and months): an estimated 8 to 10%`,
        `Colons and semicolons (introducing a list, joining two complete sentences): an estimated 5 to 8%`,
        `Brackets, dashes and hyphens (parenthesis, and hyphens that remove ambiguity): an estimated 3 to 5%`,
      ],
      footnote: `Difficulty runs from Year 2 to 4 basics, such as a missing capital or full stop, up to Year 5 to 6 punctuation (colons, semicolons, hyphens and parenthetical dashes) that the National Curriculum only introduces, so even strong children can be unsure, and "No mistake" appears more often at this level.`,
    },

    pitfalls: [
      {
        lead: `Putting an apostrophe in "its" to show possession.`,
        tip:  `its (the dog wagged its tail) never takes an apostrophe; it's always and only means "it is" or "it has". Children over-apply the "apostrophe equals possession" rule. Teach the one fixed test: replace it's with "it is" and see if the sentence still works.`,
      },
      {
        lead: `Adding an apostrophe to an ordinary plural.`,
        tip:  `"The dogs ran" needs no apostrophe; "the dog's ran" is wrong. GL deliberately places plain plurals near possessive constructions to trigger this slip. Encourage your child to ask whether the word shows ownership before adding an apostrophe.`,
      },
      {
        lead: `Joining two sentences with just a comma.`,
        tip:  `"She was tired, she went to bed" is a comma splice and a common GL error. Two complete sentences need a conjunction (so, and, but), a semicolon, or a full stop. Warn your child off the "comma wherever you pause" habit, which causes this.`,
      },
      {
        lead: `Assuming every sentence contains an error.`,
        tip:  `Around 15 to 20% of GL punctuation questions are correct, with "No mistake" as the answer, often a sentence with a correctly used semicolon or possessive pronoun (theirs, whose) that looks suspicious. Teach your child that correctly placed tricky punctuation is not an error.`,
      },
    ],

    faq: [
      {
        q: `How is punctuation tested in the GL 11+ English exam?`,
        a: `GL uses an error-spotting format. A sentence is split into four sections (A to D), with a fifth option for "No mistake". Your child decides which section contains a punctuation error, or chooses "No mistake" if the sentence is correctly punctuated. It is multiple choice on a separate answer sheet, with at most one error per sentence.`,
      },
      {
        q: `What punctuation does my child need to know for the GL 11+?`,
        a: `The biggest areas are apostrophes (possession, contractions and the its/it's trap) and commas (lists, fronted adverbials, subordinate clauses and comma splices), followed by speech punctuation. Capital letters and sentence-ending marks come up too. The hardest questions test Year 6 marks such as colons, semicolons and hyphens, which schools only introduce.`,
      },
      {
        q: `What is the most common punctuation mistake GL tests?`,
        a: `Apostrophe errors are the most heavily tested, and the its/it's confusion is the classic trap. "Its" (possessive) never takes an apostrophe, while "it's" always means "it is" or "it has". GL also frequently tests apostrophes wrongly added to plain plurals and missing from possessives, so apostrophes are the highest-value area to master.`,
      },
      {
        q: `How hard is punctuation in the GL 11+ exam, and what year is it from?`,
        a: `It spans the curriculum. Easier questions test Year 2 to 4 basics that should be automatic, such as a missing capital or full stop. Harder questions test Year 5 to 6 marks (colons, semicolons, hyphens and parenthetical dashes) that the National Curriculum only introduces rather than expects mastery of, so GL uses them to stretch the strongest children.`,
      },
      {
        q: `How can my child practise punctuation for the 11+?`,
        a: `Practise in the real GL error-spotting format, including "No mistake" questions, rather than just learning rules in isolation. Prioritise apostrophes, commas and speech punctuation, since together they make up most of the marks. Free PrepStep practice presents each question in the exact GL four-section format with a worked explanation of the rule.`,
      },
    ],

    meta: {
      title:         `11+ Punctuation Practice for the GL Assessment | PrepStep`,
      description:   `Free 11+ punctuation practice for the GL Assessment in the real error-spotting format: four sections plus "No mistake", five options, worked explanations.`,
      ogTitle:       `11+ Punctuation Practice for the GL Assessment | PrepStep`,
      ogDescription: `Free GL Assessment 11+ punctuation practice in the real error-spotting format (four sections plus "No mistake"). Worked explanations on every question.`,
    },
  },

  // ── ENGLISH: GRAMMAR ──────────────────────────────────────────────────────
  grammar: {
    subject:      'english',
    subjectLabel: 'English',
    topicKey:     'grammar',
    slug:         'grammar',
    topicLabel:   'Grammar',
    canonical:    'https://prepstep.co.uk/practice/english/grammar',
    questionIds:  [1, 2, 3, 6, 8],

    intro: `In the GL Assessment 11+ English paper, applied grammar is tested most directly in the cloze, or sentence-completion, section, where your child picks the single grammatically correct word to fill each gap. We estimate around 8 of the paper's roughly 49 questions take this form. Counted right across the paper (those gap-fill questions, the grammar-terminology questions, and grammar tested through punctuation), grammar is arguably the single largest skill area in GL English, close to two questions in every five. These weightings are our research estimates from analysing GL practice papers, not figures GL publishes.

This page focuses on general grammar: choosing the correct verb tense, keeping the subject and verb in agreement, picking the right connecting word, and getting homophones right in context. That makes it different from our vocabulary page, which tests what words mean, and from our word class page, which tests naming the job a word does. Grammar is about how words fit together correctly. The English paper runs to about 45 to 50 minutes and is entirely multiple choice, with five options (A to E) for every gap-fill question, and answers marked on a separate bubble sheet.

The reassuring news for parents is that grammar rewards clear rules over guesswork. GL reuses the same handful of traps year after year (its versus it's, could have versus could of, irregular past tenses), so once a child learns to test rather than rely on what simply sounds right, these become some of the most dependable marks on the paper.`,

    topicBreakdown: {
      intro: `Grammar gap-fill questions are always multiple-choice, five options (A to E). GL does not publish category breakdowns, so the order below is our informed estimate from analysing practice papers. In rough order of frequency, expect:`,
      items: [
        `Homophones in context (around 25%): their/there/they're, to/too/two, its/it's, who's/whose, where/were/wear, chosen by meaning, not sound.`,
        `Verb tenses and forms (around 25%): keeping tense consistent, and irregular past tenses and past participles (chose/chosen, wrote/written, did/done).`,
        `Modal and auxiliary verbs (around 12 to 15%): should have not "should of", might have, could have.`,
        `Conjunctions and connectives (around 10 to 12%): but, because, although, so, however, choosing the one that fits the logical link.`,
        `Prepositions (around 8 to 10%): of, off, from, to, by, the subtle choices inside fixed phrases (for example "different from").`,
        `Comparatives and superlatives (around 5 to 8%): good/better/best, taller (two things) versus tallest (three or more).`,
        `Subject-verb agreement: a fundamental skill that surfaces across the whole paper (for example "the box of chocolates is", not "are").`,
        `Passive voice, formal register and the subjunctive: Year 6 content that appears only in the hardest questions.`,
      ],
      footnote: `Difficulty runs from easy single-gap homophones (D1) through irregular tenses and connective choices (D2) up to passive voice, the subjunctive and tense consistency across a whole passage (D3). Most of this is Year 5 and Year 6 curriculum, with passive voice and the subjunctive sitting at the top of the Year 6 expectations.`,
    },

    pitfalls: [
      {
        lead: `Confusing its and it's.`,
        tip:  `This is the single most common grammar trap across GL papers. "It's" only ever means "it is" or "it has"; "its" shows possession and never takes an apostrophe. Tell your child to read the sentence with "it is" swapped in: if it still makes sense, choose "it's".`,
      },
      {
        lead: `Writing "could of" instead of "could have".`,
        tip:  `"Could of" is never correct, it just sounds like the contraction "could've". The same goes for "should of" and "would of". The rule is always could have, should have, would have, followed by the past participle.`,
      },
      {
        lead: `Treating each gap on its own.`,
        tip:  `The cloze passage is one continuous story, usually in the past tense. A child who answers each blank in isolation slips into the present tense partway through. Encourage reading the whole passage first to lock in the tense before choosing any answers.`,
      },
      {
        lead: `Muddling past simple and past participle.`,
        tip:  `"I done it" and "I seen it" sound normal in speech but are wrong in writing (did, saw). GL loves irregular verbs where the two forms differ (do/did/done, see/saw/seen, write/wrote/written). Learn these as a trio so the right form comes automatically.`,
      },
    ],

    faq: [
      {
        q: `What grammar is tested in the GL 11+ English exam?`,
        a: `GL tests homophones in context, verb tenses and forms, subject-verb agreement, modal verbs, conjunctions, prepositions, comparatives and superlatives, and at the hardest level the passive voice and subjunctive. Most of it appears in the cloze (sentence-completion) section, where children choose the one correct word to fill a gap. Every question is multiple choice with five options (A to E).`,
      },
      {
        q: `What is a cloze or sentence-completion question?`,
        a: `It is a short passage with words missing, where each gap offers five options and the child picks the grammatically correct one. The options are usually all real words, so the child has to apply a rule rather than guess. Because the passage reads as one continuous story, the tense and meaning of earlier sentences often decide the right answer later on.`,
      },
      {
        q: `Why does my child keep getting its and it's wrong?`,
        a: `It is the most common grammar error in the whole paper, because children are taught that an apostrophe shows possession and then wrongly add one to "its". In fact "it's" only ever means "it is" or "it has". The quickest fix is the swap test: read the sentence with "it is" in place, and if it makes sense the answer is "it's".`,
      },
      {
        q: `What year is this grammar taught for the 11+?`,
        a: `Most of it is Year 5 and Year 6 curriculum content, covered in school as part of grammar, punctuation and spelling (GPS). Homophones, tenses and agreement are taught earlier and consolidated by Year 6, while the passive voice and subjunctive are new in Year 6. As GL exams are often sat at the start of Year 6, a little practice ahead of school teaching helps.`,
      },
      {
        q: `How can my child practise grammar for the GL 11+?`,
        a: `Use timed, five-option questions that mirror the real cloze format, and target the highest-frequency skills first: homophones in context and verb tenses. Drill the famous traps (its/it's, could have not could of, did/done) until the correct form is automatic, and teach the habit of testing a sentence rather than relying on what sounds right.`,
      },
    ],

    meta: {
      title:         `11+ Grammar Practice Questions (GL Assessment) | PrepStep`,
      description:   `Free GL Assessment 11+ grammar practice: tenses, agreement, homophones and connectives in five-option format, with worked answers and the traps GL repeats.`,
      ogTitle:       `11+ Grammar Practice (GL Assessment) | PrepStep`,
      ogDescription: `Free GL Assessment 11+ grammar practice: tenses, agreement, homophones and connectives in five-option format, with worked answers and the traps GL repeats.`,
    },
  },

  // ── ENGLISH: VOCABULARY ───────────────────────────────────────────────────
  vocabulary: {
    subject:      'english',
    subjectLabel: 'English',
    topicKey:     'vocabulary',
    slug:         'vocabulary',
    topicLabel:   'Vocabulary',
    canonical:    'https://prepstep.co.uk/practice/english/vocabulary',
    questionIds:  [1, 2, 4, 8, 10],

    intro: `Vocabulary is one of the few skills the GL Assessment 11+ tests across two of the three papers, both the English paper and the Verbal Reasoning paper, and synonym (closest-meaning) questions are the most common vocabulary type of all, an estimated 30 to 35% of vocabulary marks. That makes a strong, wide vocabulary one of the highest-yield things a child can build, because it lifts scores on two papers at once. These weightings are our research estimates from analysing GL papers and tutor resources, not figures GL publishes.

This page is about what words mean: finding the closest synonym, the opposite (antonym), the best word to fill a sentence, and the meaning of a word as it is used in a passage. That makes it different from our grammar page, which tests how words fit together correctly, and from our word class page, which tests naming the job a word does. In the English paper, vocabulary appears inside the comprehension section (for example "which word is closest in meaning to X as used in line Y?") and in gap-fill questions; in Verbal Reasoning it appears as closest-meaning, opposite-meaning and double-meaning questions. Every question on PrepStep uses the standard five options (A to E), matching the real exam format.

The reassuring part for parents is that vocabulary grows steadily with the right habits. Wide reading, learning words in families (prefixes, suffixes and roots), and practising the specific GL traps (like picking a word merely associated with the answer rather than its true synonym) turn vocabulary from a worry into a quiet, reliable strength.`,

    topicBreakdown: {
      intro: `Vocabulary questions are always multiple-choice, five options (A to E). GL does not publish exact weightings, so the order below is our informed estimate, and the categories overlap (one question can test more than one skill). In rough order of frequency:`,
      items: [
        `Synonyms and closest meaning (around 30 to 35%): the single most common type, choosing the word nearest in meaning. Tested in both English and Verbal Reasoning.`,
        `Words in context (around 20 to 25%): the meaning of a word as it is used in a specific line of a passage, where context decides between possible meanings.`,
        `Cloze and contextual gap-fill (around 15 to 20%): choosing the best word to complete a sentence so it reads naturally and precisely.`,
        `Antonyms and opposite meaning (around 10 to 15%): choosing the word that means the opposite, mostly in Verbal Reasoning.`,
        `Double meanings and polysemy (around 5 to 10%): a single word that fits two different contexts (for example "bank", "light", "trunk").`,
        `Figurative language (around 5%): recognising similes, metaphors and personification, and reading them as meaning rather than literally.`,
      ],
      footnote: `Difficulty runs from common, everyday words (D1) through Year 5 and Year 6 curriculum vocabulary that needs nuance (D2, for example reluctant versus unable) up to sophisticated words, polysemy traps and fine distinctions between near-synonyms (D3, for example benevolent, ominous, understate versus undermine). The hardest questions often reward knowledge of Latin and Greek roots.`,
    },

    pitfalls: [
      {
        lead: `Picking a word that is merely associated, not a synonym.`,
        tip:  `This is the classic GL vocabulary trap. For "monarch", a child grabs "crown" (associated) instead of "ruler" (the true synonym). Teach the test: a synonym should be able to replace the word in a sentence and keep the same meaning. "Crown" cannot.`,
      },
      {
        lead: `Ignoring the context with multiple-meaning words.`,
        tip:  `Words like "bark", "bank" and "light" have more than one meaning, and GL chooses the less obvious one. Always read the surrounding sentence before deciding which meaning is in play, rather than reaching for the most familiar one.`,
      },
      {
        lead: `Getting the strength of a word wrong.`,
        tip:  `"Annoyed", "cross" and "furious" all relate to anger, but they differ in degree. GL exploits this gradient. Encourage your child to match the intensity, not just the general feeling, so "furious" pairs with "enraged", not "irritated".`,
      },
      {
        lead: `Settling for "close enough" instead of the best fit.`,
        tip:  `GL often lists two options that both seem to work, and only one is the most precise. Tell your child to check every option before committing, because the answer is the closest match, not simply a reasonable one.`,
      },
    ],

    faq: [
      {
        q: `What vocabulary is tested in the GL 11+ exam?`,
        a: `GL tests synonyms (closest meaning), antonyms (opposite meaning), words in context, sentence gap-fill, double meanings, and recognising figurative language. Synonyms are the most common type. Vocabulary appears in both the English paper (inside comprehension and gap-fill) and the Verbal Reasoning paper, always in multiple-choice form with five options (A to E).`,
      },
      {
        q: `How can my child build vocabulary for the 11+?`,
        a: `Wide reading is the single most powerful tool, especially classic and contemporary fiction at or slightly above your child's reading age. Alongside that, learn words in families using common prefixes, suffixes and Latin and Greek roots, and keep a notebook of new words met in reading. Regular short practice on synonym and antonym questions then turns recognition into exam speed.`,
      },
      {
        q: `Is vocabulary different in the English and Verbal Reasoning papers?`,
        a: `The underlying knowledge is the same, but the presentation differs. In English, vocabulary is usually tied to a passage ("which word is closest in meaning to X as used here?"), so context does much of the work. In Verbal Reasoning it is more often standalone (closest-meaning and opposite-meaning groups), testing whether the child simply knows the word. Practising both formats covers all of it.`,
      },
      {
        q: `How important is vocabulary for the 11+?`,
        a: `Very. It is one of the few skills tested across two of the three papers, and synonym questions alone are an estimated 30 to 35% of vocabulary marks. A strong vocabulary also speeds up comprehension, because a child who recognises difficult words reads passages faster and with more understanding, so the benefit reaches well beyond the obvious vocabulary questions.`,
      },
      {
        q: `Why does my child choose the wrong word when they know what it means?`,
        a: `Usually they have fallen for an associated word rather than a true synonym (picking "crown" for "monarch" instead of "ruler"), or they have grabbed the most familiar meaning of a word that has two. The fix is the substitution test: a correct synonym can replace the word in the sentence without changing the meaning. Reading every option before answering also catches the "close enough" trap.`,
      },
    ],

    meta: {
      title:         `11+ Vocabulary Practice Questions (GL Assessment) | PrepStep`,
      description:   `Free GL Assessment 11+ vocabulary practice: synonyms, antonyms and words in context in five-option format, with worked answers and the traps GL uses.`,
      ogTitle:       `11+ Vocabulary Practice (GL Assessment) | PrepStep`,
      ogDescription: `Free GL Assessment 11+ vocabulary practice: synonyms, antonyms and words in context in five-option format, with worked answers and the traps GL uses.`,
    },
  },

  // ── ENGLISH: WORD CLASSES ─────────────────────────────────────────────────
  wordClassGrammar: {
    subject:      'english',
    subjectLabel: 'English',
    topicKey:     'wordClassGrammar',
    slug:         'word-classes',
    topicLabel:   'Word Classes',
    canonical:    'https://prepstep.co.uk/practice/english/word-classes',
    questionIds:  [2, 6, 9, 12, 14],

    intro: `In the GL Assessment 11+ English paper, word class questions ask your child to name the job a word is doing: is it a noun, a verb, an adjective, an adverb, a preposition, and so on? They sit inside the comprehension section, always testing words in context rather than in isolation, and we estimate two to three of these per paper. Nouns (including sub-types such as common, proper, collective and abstract) are the most frequently tested class, an estimated 25 to 30% of word class questions. These weightings are our research estimates from analysing GL papers, not figures GL publishes.

This page is about identifying and labelling parts of speech, which makes it different from our two neighbouring pages. Our grammar page tests whether words are used correctly (tenses, agreement, sentence structure), and our vocabulary page tests what words mean. Word class is the labelling skill: working out the function of a word in this particular sentence. GL asks it three ways: "what type of words are these?" (a shared class across several words), "which word is a [class]?" (pick the word from a quoted line), and occasionally identifying a sentence type. All are multiple choice with five options (A to E).

The reassuring news for parents is that word class rewards a single, teachable habit: ask "what job is this word doing here?" rather than "what does this word usually look like?" GL's traps almost all spring from surface appearances (an "-ly" word that turns out to be an adjective, a state verb that does not feel like a doing word), so a child who checks function over appearance handles them calmly.`,

    topicBreakdown: {
      intro: `Word class questions are always multiple-choice, five options (A to E), and always set in the context of the comprehension passage. GL does not publish exact weightings, so the order below is our informed estimate. In rough order of frequency:`,
      items: [
        `Nouns, including sub-types (around 25 to 30%): common, proper, collective, abstract and concrete. GL loves making children tell these sub-types apart.`,
        `Verbs (around 20 to 25%): including state and linking verbs (was, seemed, appeared) that do not feel like doing words.`,
        `Adjectives (around 15 to 20%): including "-ly" adjectives such as friendly, lovely and lonely that look like adverbs.`,
        `Adverbs (around 15 to 20%): including non-"-ly" adverbs such as soon, often, very and quite.`,
        `Prepositions (around 10 to 15%): one of the hardest areas, especially dual-function words (round, before, by).`,
        `Pronouns, conjunctions and determiners (around 5 to 10% combined): the less commonly tested classes.`,
      ],
      footnote: `Difficulty runs from obvious cases (a clear action verb, a "-ly" adverb) at D1, through abstract nouns, state verbs and prepositions at D2, up to dual-function words used in their less common class at D3 (for example "run" as a noun, "light" as an adjective, "the running water" as a participle acting like an adjective). The terminology is built up across Years 2 to 6 of the National Curriculum.`,
    },

    pitfalls: [
      {
        lead: `Thinking verbs are only "doing" words.`,
        tip:  `State and linking verbs (is, was, seemed, appeared, became) are still verbs, even though nothing is being "done". Teach your child that a verb can describe a state of being, not just an action, so "seemed" is a verb, not an adjective.`,
      },
      {
        lead: `Assuming any "-ly" word is an adverb.`,
        tip:  `Many "-ly" words are adjectives: friendly, lovely, lonely, lively, likely, costly. The ending is not the test. Ask what the word is describing: if it describes a noun (a friendly dog) it is an adjective, if it describes a verb (ran quickly) it is an adverb.`,
      },
      {
        lead: `Not recognising abstract nouns as nouns.`,
        tip:  `Words like joy, freedom, courage and sadness name ideas and feelings rather than objects, so children mistake them for adjectives. The test is whether you can put "the" in front and treat it as a thing ("the courage"), which marks it as a noun.`,
      },
      {
        lead: `Judging a word by its usual class, not its job here.`,
        tip:  `Many words change class with context: "run" is usually a verb but is a noun in "a quick run", and "light" can be a noun, a verb or an adjective. Always decide the class from the word's job in this exact sentence, not from how it normally behaves.`,
      },
    ],

    faq: [
      {
        q: `What are word class questions in the GL 11+?`,
        a: `They ask your child to identify the job a word is doing in a sentence, such as noun, verb, adjective, adverb, pronoun, preposition or conjunction. In GL papers they sit within the comprehension section and always use words taken from the passage, so the word must be judged in context. Each question is multiple choice with five options (A to E).`,
      },
      {
        q: `Which word classes does GL test most?`,
        a: `Nouns are the most frequently tested, including sub-types such as common, proper, collective and abstract, an estimated 25 to 30% of word class questions. Verbs come next, especially state verbs that do not feel like doing words, followed by adjectives and adverbs. Prepositions are less frequent but among the hardest, because so many are dual-function words.`,
      },
      {
        q: `Why is "friendly" an adjective and not an adverb?`,
        a: `Because it describes a noun, not a verb. We say "a friendly dog" (describing the dog), so "friendly" is an adjective, even though it ends in "-ly". The "-ly" ending is a common trap: many "-ly" words (lovely, lonely, lively, costly) are adjectives. The reliable test is what the word is describing, not how it ends.`,
      },
      {
        q: `What year are word classes taught for the 11+?`,
        a: `The terminology is built up across the National Curriculum from Year 2 onwards: nouns, verbs, adjectives and adverbs early on, prepositions and conjunctions in Year 3, determiners and pronouns in Year 4, and modal and relative terms in Years 5 and 6. By the 11+ year all of it is assumed knowledge, so word class questions are fair game in full.`,
      },
      {
        q: `How is this different from the grammar questions in the GL 11+?`,
        a: `Word class is about labelling: naming the job a word does (noun, verb, adjective, and so on). The grammar questions are about correctness: choosing the right tense, agreement or connecting word to make a sentence work. They are closely related, and word class knowledge does help with grammar, but the skills are tested separately, so it is worth practising both.`,
      },
    ],

    meta: {
      title:         `11+ Word Class Practice (GL Assessment) | PrepStep`,
      description:   `Free GL Assessment 11+ word class practice: identify nouns, verbs, adjectives and adverbs in five-option format, with worked answers and the traps GL uses.`,
      ogTitle:       `11+ Word Class Practice (GL Assessment) | PrepStep`,
      ogDescription: `Free GL Assessment 11+ word class practice: identify nouns, verbs, adjectives and adverbs in five-option format, with worked answers and the traps GL uses.`,
    },
  },

  // ── VERBAL REASONING ──────────────────────────────────────────────────────────

  // ── VR: SYNONYMS ─────────────────────────────────────────────────────────────
  synonyms: {
    subject:      'vr',
    subjectLabel: 'Verbal Reasoning',
    topicKey:     'synonyms',
    slug:         'synonyms',
    topicLabel:   'Synonyms',
    canonical:    'https://prepstep.co.uk/practice/vr/synonyms',
    questionIds:  [6, 20, 47, 80, 8],

    intro: `Synonyms, which GL phrases as "closest in meaning", are one of the most dependable scoring opportunities in the GL Assessment 11+ Verbal Reasoning paper. Your child is shown two small groups of words and has to pick one word from the first group and one from the second that mean almost the same thing. It is pure vocabulary, so a child who reads widely and knows the shades of meaning behind everyday words tends to find these very rewarding.

The GL Verbal Reasoning paper is fast, packing roughly 80 questions into about 50 to 60 minutes, with questions grouped into blocks by type and answers marked on a separate answer sheet. Closest-in-meaning questions usually form one of those blocks. GL does not publish how many appear, but our research estimate from analysing practice papers is somewhere around 5 to 10 in a typical paper, enough to make a real difference to a final standardised score.

On this page your child practises the genuine format: two word groups at a time, choosing the matching pair, with a worked explanation after every question. Because the explanations spell out why the other words do not fit, your child builds the precise vocabulary that the harder questions demand, rather than just guessing at a vague "near enough" answer.`,

    topicBreakdown: {
      intro: `Closest-in-meaning questions draw on several layers of vocabulary knowledge. GL does not publish a breakdown, so the order below is our research estimate, listed roughly from most to least common:`,
      items: [
        `Everyday synonyms (begin and start, rich and wealthy, happy and joyful): the bread and butter of easier questions`,
        `Shades of meaning (peculiar and strange, tranquil and peaceful), where two words must share the same precise sense`,
        `Abstract qualities and character words (obstinate and stubborn, diligent and hardworking) drawn from Year 5 and 6 vocabulary`,
        `Formal and informal pairs (economical and thrifty, commence and begin), where the matching word sits in a different register`,
        `Near-synonyms that demand precision, where two words are close but only one truly matches the target`,
        `Words with more than one meaning, where your child must hold the right sense in mind to find its match`,
      ],
      footnote: `Difficulty climbs from common Year 4 words at the easy end, through curriculum vocabulary in the middle, up to sophisticated words such as tranquil, obstinate and diligent at the hard end, where one group often plants a tempting opposite as a trap.`,
    },

    pitfalls: [
      {
        lead: `Choosing a word that is related but not actually the same meaning.`,
        tip:  `GL fills the groups with words from the same topic, so famous sits next to wealthy and rich. Teach your child to ask "could one word genuinely replace the other in a sentence?", not just "are these about similar things?".`,
      },
      {
        lead: `Falling for the opposite hiding in the group.`,
        tip:  `A favourite GL trap places an antonym in plain sight, such as reveal in a group where conceal is the answer. Remind your child that closest in meaning never means opposite, however neat the pairing looks.`,
      },
      {
        lead: `Matching on intensity rather than meaning.`,
        tip:  `Angry, furious and irritated share a feeling but differ in strength. Encourage your child to match words at the same level, not just within the same family of emotions.`,
      },
      {
        lead: `Picking the first plausible word and stopping.`,
        tip:  `Both groups must work together, so the best pair is the one where each word clearly matches the other. Train your child to test their chosen word against every option in the second group before committing.`,
      },
    ],

    faq: [
      {
        q: `What are synonym questions in the GL 11+ Verbal Reasoning exam?`,
        a: `They are "closest in meaning" questions. Your child sees two small groups of words and has to choose one word from each group that mean almost the same thing, for example begin from one group and start from the other. They test the depth and precision of your child's vocabulary.`,
      },
      {
        q: `How are synonyms tested in the GL 11+ exam?`,
        a: `Through multiple choice with answers marked on a separate answer sheet. Each question shows two groups of words, and your child selects the matching pair, one word from each group. The words are chosen so that several look related, which is what makes the task more than simply knowing the words.`,
      },
      {
        q: `How many synonym questions are in the GL 11+ paper?`,
        a: `GL does not publish exact numbers, but our research estimate from practice papers is around 5 to 10 closest-in-meaning questions in a typical Verbal Reasoning paper of roughly 80 questions. They usually appear together as one block within the paper.`,
      },
      {
        q: `What is the hardest part of synonym questions?`,
        a: `Telling apart words that are close but not quite the same, and ignoring the opposite that GL likes to slip into the group. The toughest questions use Year 5 and 6 vocabulary such as obstinate or tranquil, where your child needs a confident grasp of the exact meaning rather than a rough idea.`,
      },
      {
        q: `How can my child improve at synonyms for the 11+?`,
        a: `Wide reading is the foundation, because it exposes your child to words used in real context with their precise meaning. On top of that, free PrepStep practice gives one closest-in-meaning question at a time with a worked explanation, so your child learns why the matching pair works and why the tempting distractors do not.`,
      },
    ],

    meta: {
      title:         `11+ Synonyms Practice (GL Assessment) | PrepStep`,
      description:   `Free 11+ synonyms practice for the GL Assessment. Closest-in-meaning Verbal Reasoning questions with worked explanations. Build precise vocabulary for the exam.`,
      ogTitle:       `11+ Synonyms Practice (GL Assessment) | PrepStep`,
      ogDescription: `Free GL Assessment 11+ synonyms practice: choose the matching pair, worked explanations, real Verbal Reasoning format. Strengthen vocabulary the easy way.`,
    },
  },

  // ── VR: ANTONYMS ─────────────────────────────────────────────────────────────
  antonyms: {
    subject:      'vr',
    subjectLabel: 'Verbal Reasoning',
    topicKey:     'antonyms',
    slug:         'antonyms',
    topicLabel:   'Antonyms',
    canonical:    'https://prepstep.co.uk/practice/vr/antonyms',
    questionIds:  [1, 8, 3, 9, 4],

    intro: `Antonym questions, labelled "most opposite in meaning" by GL, ask your child to do the reverse of a synonym question: from two groups of words, pick the one word in each that points in opposite directions. They reward a child who not only knows what words mean but can feel the contrast between them, such as the gap between generous and mean, or expand and shrink.

These questions sit in the GL Assessment 11+ Verbal Reasoning paper, a brisk test of around 80 questions in roughly 50 to 60 minutes where each question type appears as its own block and answers go on a separate answer sheet. GL keeps the exact count private, so our research estimate, based on analysing practice papers, is that opposite-in-meaning questions make up a smaller block than synonyms, perhaps in the region of 4 to 8 per paper.

Here your child works through the real task one pair of groups at a time, choosing the opposite pair, with a full explanation afterwards. The explanations are deliberate about pointing out the synonyms and the merely related words GL packs in alongside the true opposite, so your child learns to spot the trap rather than be caught by it.`,

    topicBreakdown: {
      intro: `Opposite-in-meaning questions test several kinds of contrast. There is no published GL weighting, so the following is our research estimate, ordered roughly from most to least common:`,
      items: [
        `Clear everyday opposites (brave and cowardly, ancient and modern, noisy and silent), the staple of the easier questions`,
        `Quality and character opposites (arrogant and humble, generous and mean) drawn from Year 5 and 6 vocabulary`,
        `Action opposites (expand and shrink, create and destroy), where verbs pull in opposite directions`,
        `Prefix opposites, where un, dis, in or im flips a word's sense (visible and invisible, honest and dishonest)`,
        `Gradable opposites, where your child must find the true contrast rather than a slightly weaker version`,
        `Sophisticated near-opposites (abundant and scarce, moderate and excessive), where the groups are stacked with near-synonyms to confuse`,
      ],
      footnote: `Difficulty rises from concrete, obvious opposites at the easy end to abstract, advanced pairs at the hard end, where most of the other words in the groups are similar in meaning and only one true opposite exists.`,
    },

    pitfalls: [
      {
        lead: `Picking a synonym by mistake instead of an opposite.`,
        tip:  `Under time pressure children sometimes match words that go together rather than words that clash. Teach your child to pause and confirm "do these two words mean the reverse of each other?" before answering.`,
      },
      {
        lead: `Choosing a word that is merely different, not opposite.`,
        tip:  `GL loves to offer words from the same topic, such as fork and spoon, that are related but not opposite. Remind your child that an opposite must sit at the far end of the same idea, not just be another word from the set.`,
      },
      {
        lead: `Settling for a weak opposite when a stronger one exists.`,
        tip:  `Cool is a mild opposite of hot, but freezing or cold may be the truer contrast offered. Encourage your child to scan both whole groups for the strongest, cleanest opposite before deciding.`,
      },
      {
        lead: `Being thrown by near-synonyms crowded into the groups.`,
        tip:  `In harder questions, four of the six words may mean roughly the same thing. Teach your child to find the single pair that genuinely contrasts and treat the rest as deliberate noise.`,
      },
    ],

    faq: [
      {
        q: `What are antonym questions in the GL 11+ Verbal Reasoning exam?`,
        a: `They are "most opposite in meaning" questions. Your child is shown two groups of words and must pick one word from each group that mean the opposite of each other, such as generous from one group and mean from the other. They test whether your child understands words well enough to recognise their true contrast.`,
      },
      {
        q: `How are antonyms tested in the GL 11+ exam?`,
        a: `As multiple choice, with the answer marked on a separate answer sheet. Each question presents two groups of words, and your child selects the opposite pair, one word from each group. GL deliberately includes synonyms and related words as distractors, so simply knowing the words is not always enough.`,
      },
      {
        q: `How many antonym questions are in the GL 11+ paper?`,
        a: `GL does not release exact figures. Our research estimate from practice papers is roughly 4 to 8 opposite-in-meaning questions in a typical Verbal Reasoning paper of about 80 questions, usually grouped together as a single block.`,
      },
      {
        q: `What is the hardest part of antonym questions?`,
        a: `The advanced questions, where the two groups are filled with near-synonyms and only one true opposite pair exists, for instance abundant against scarce among words that all mean "enough" or "plenty". Spotting the genuine contrast in a sea of similar words is what separates the strongest candidates.`,
      },
      {
        q: `How can my child improve at antonyms for the 11+?`,
        a: `Talking about opposites in everyday reading helps, as does learning common prefixes such as un, dis and in that flip a word's meaning. Free PrepStep practice then gives one opposite-in-meaning question at a time with a worked explanation that names the synonyms and related-word traps, so your child learns to avoid them under exam conditions.`,
      },
    ],

    meta: {
      title:         `11+ Antonyms Practice (GL Assessment) | PrepStep`,
      description:   `Free 11+ antonyms practice for the GL Assessment. Opposite-in-meaning Verbal Reasoning questions with worked explanations. Spot the contrast and dodge the traps.`,
      ogTitle:       `11+ Antonyms Practice (GL Assessment) | PrepStep`,
      ogDescription: `Free GL Assessment 11+ antonyms practice: find the opposite pair, worked explanations, real Verbal Reasoning format. Learn to beat GL's synonym distractors.`,
    },
  },

  // ── VR: VERBAL ANALOGIES ─────────────────────────────────────────────────────
  verbalAnalogies: {
    subject:      'vr',
    subjectLabel: 'Verbal Reasoning',
    topicKey:     'verbalAnalogies',
    slug:         'verbal-analogies',
    topicLabel:   'Verbal Analogies',
    canonical:    'https://prepstep.co.uk/practice/vr/verbal-analogies',
    questionIds:  [4, 6, 7, 28, 5],

    intro: `Verbal analogies are the question type that asks your child to think like a detective. The pattern is always "A is to B as C is to ?", and the job is to work out the exact relationship in the first pair, then apply that same relationship to complete the second. On this page each question gives the sentence with two blanks and two short groups of words, and your child chooses one word from each group to fill the gaps.

Analogies are a favourite of GL Assessment because they test reasoning and vocabulary at the same time, which makes them a strong predictor of overall ability. They appear in the Verbal Reasoning paper, a quick-moving test of around 80 questions in roughly 50 to 60 minutes, with each type in its own block and answers recorded on a separate answer sheet. GL does not publish the count, but our research estimate from practice papers is somewhere around 5 to 10 analogy questions per paper.

Every question on this page comes with a worked explanation that names the relationship in plain words, such as "young animal to adult" or "tool to the person who uses it". That habit of naming the link before choosing is the single most powerful analogy strategy, and seeing it modelled question after question is how your child makes it automatic.`,

    topicBreakdown: {
      intro: `GL builds analogies on a wide range of relationship types. There is no official weighting, so this is our research estimate of the relationships your child meets most often, ordered roughly by frequency:`,
      items: [
        `Tool to user or object to function (brush to painter, scalpel to surgeon), a GL favourite`,
        `Part to whole (toe to foot, chapter to book), where one thing is a piece of a larger thing`,
        `Young animal to adult (cub to bear, cygnet to swan), which leans on specific vocabulary`,
        `Synonyms and antonyms expressed as a relationship (large is to big as tiny is to small)`,
        `Category to member (instrument to violin) and the everyday "belongs to" link (paw to cat, hoof to horse)`,
        `Collective nouns and group words (sheep to flock, wolves to pack)`,
        `Cause and effect, sequence, and object to characteristic for the harder questions`,
      ],
      footnote: `Difficulty grows with both the vocabulary and the relationship. Easy questions use common words and obvious links, while hard ones rely on words such as cygnet or leveret and on subtler relationships, with two or three distractors that are related to C but match the wrong link.`,
    },

    pitfalls: [
      {
        lead: `Choosing a word just because it is connected to C.`,
        tip:  `If the link is "tool to user", a word that is merely about C will tempt your child. Teach them to name the exact relationship first, then test each option against that precise link rather than against a loose connection.`,
      },
      {
        lead: `Getting the direction of the relationship the wrong way round.`,
        tip:  `Young to adult is not the same as adult to young. Encourage your child to check that the second pair runs in the same direction as the first, so cub to bear means cygnet to swan, never swan to cygnet.`,
      },
      {
        lead: `Matching the wrong level on a degree relationship.`,
        tip:  `When the link is about intensity, cool and freezing are not interchangeable. Remind your child to match the strength of the relationship, not just its general theme.`,
      },
      {
        lead: `Settling before checking both blanks work together.`,
        tip:  `Because two words must be chosen, the right answer is the pair where both gaps share one clear relationship. Train your child to read the finished sentence back to confirm the two pairs truly mirror each other.`,
      },
    ],

    faq: [
      {
        q: `What are verbal analogies in the GL 11+ exam?`,
        a: `They are reasoning questions in the shape "A is to B as C is to ?". Your child works out the relationship between the first two words, then applies the same relationship to finish the second pair. They test vocabulary and logical thinking together, which is why GL values them so highly.`,
      },
      {
        q: `How are verbal analogies tested in the GL 11+ exam?`,
        a: `As multiple choice on a separate answer sheet. On PrepStep your child sees the analogy sentence with two blanks alongside two short groups of words, and chooses one word from each group to complete it. The wrong options are usually related to the words involved but match a different relationship.`,
      },
      {
        q: `How many verbal analogy questions are in the GL 11+ paper?`,
        a: `GL does not publish exact numbers. Our research estimate from practice papers is around 5 to 10 analogy questions in a typical Verbal Reasoning paper of roughly 80 questions, normally appearing together as one block.`,
      },
      {
        q: `What is the hardest part of verbal analogies?`,
        a: `The combination of advanced vocabulary and a subtle relationship. Hard questions use words such as cygnet or leveret and offer two or three plausible distractors, so your child has to pin down the precise link and resist words that are simply associated with the topic.`,
      },
      {
        q: `How can my child improve at verbal analogies for the 11+?`,
        a: `The best habit is to name the relationship in words before looking at the options, and then predict the answer. Wide reading builds the vocabulary that hard analogies need. Free PrepStep practice gives one analogy at a time with a worked explanation that names the link, so your child rehearses exactly the right thinking process.`,
      },
    ],

    meta: {
      title:         `11+ Verbal Analogies Practice (GL Assessment) | PrepStep`,
      description:   `Free 11+ verbal analogies practice for the GL Assessment. "A is to B as C is to ?" reasoning questions with worked explanations. Master the relationship every time.`,
      ogTitle:       `11+ Verbal Analogies Practice (GL Assessment) | PrepStep`,
      ogDescription: `Free GL Assessment 11+ verbal analogies practice: spot the relationship, complete the pair, worked explanations. Build reasoning and vocabulary together.`,
    },
  },

  // ── VR: ODD TWO OUT ──────────────────────────────────────────────────────────
  oddTwoOut: {
    subject:      'vr',
    subjectLabel: 'Verbal Reasoning',
    topicKey:     'oddTwoOut',
    slug:         'odd-two-out',
    topicLabel:   'Odd Two Out',
    canonical:    'https://prepstep.co.uk/practice/vr/odd-two-out',
    questionIds:  [4, 10, 12, 18, 7],

    intro: `Odd Two Out flips the usual instinct on its head. Your child is given five words and has to find the two that do not belong, which means the real work is spotting the three that share a hidden link. The clever twist is that the two odd words do not need anything in common with each other; they are simply the leftovers once the group of three is found.

This question type lives in the GL Assessment 11+ Verbal Reasoning paper, a fast test of about 80 questions in roughly 50 to 60 minutes, organised into blocks by type with answers marked on a separate answer sheet. Finding two odd words rather than one makes this a step harder than a classic odd-one-out, and GL knows it. Our research estimate from analysing practice papers is that it appears as a block of perhaps 4 to 8 questions, though GL does not publish the figure.

On this page your child practises the genuine select-two format, with a worked explanation that names the connecting link as exactly as possible after every question. Learning to say "trees, not just plants" or "racquet sports, not just sports" is the heart of this skill, and the explanations train that precision one question at a time.`,

    topicBreakdown: {
      intro: `The hidden link in an Odd Two Out question can be drawn from many kinds of category. GL publishes no weighting, so the following is our research estimate, ordered roughly from most to least common:`,
      items: [
        `Concrete semantic groups (fruits against vegetables, colours against shapes, birds against other creatures), the staple of the easier questions`,
        `Functional groups, where things share a use (furniture for sitting, racquet sports, cutlery against cooking pans)`,
        `More specialist knowledge groups (oak, willow and beech are trees; daisy and tulip are flowers), which test general knowledge`,
        `Meaning relationships among words, such as synonyms or degrees of an action grouped together`,
        `Word class groups, where three words are one part of speech and two are another`,
        `Material or natural-versus-made groups, separating metals from fabrics or natural from synthetic`,
        `Abstract or homonym traps for the hardest questions, where a double meaning creates a false grouping`,
      ],
      footnote: `Difficulty climbs from clearly different everyday categories at the easy end to advanced vocabulary, narrow sub-categories and double-meaning traps at the hard end, where all five words appear to belong to one broad group and only a sharper, more specific link separates the three.`,
    },

    pitfalls: [
      {
        lead: `Hunting for the two odd words instead of the group of three.`,
        tip:  `It is far easier to find what links three words than to spot two unrelated leftovers. Teach your child to ask "which three clearly belong together?" and let the odd two fall out naturally.`,
      },
      {
        lead: `Settling for a link that is too broad.`,
        tip:  `If all five words fit a wide group such as "animals" or "furniture", the answer needs a tighter link. Encourage your child to name the connection as precisely as possible, for example "furniture for sitting" rather than just "furniture".`,
      },
      {
        lead: `Assuming the two odd words must relate to each other.`,
        tip:  `GL builds questions where the leftovers have nothing in common, which makes children doubt a correct answer. Remind your child that the odd two are simply whatever is left once the group of three is settled.`,
      },
      {
        lead: `Being caught by a word with two meanings.`,
        tip:  `In harder questions a homonym can seem to fit the wrong group, such as lamb as a young animal or as meat. Teach your child to test both meanings of a tricky word before deciding which group it belongs to.`,
      },
    ],

    faq: [
      {
        q: `What is Odd Two Out in the GL 11+ Verbal Reasoning exam?`,
        a: `It is a question that gives your child five words and asks them to find the two that do not belong. The other three share a specific link, and the two odd words are simply the leftovers. It tests vocabulary, category knowledge and careful reasoning all at once.`,
      },
      {
        q: `How is Odd Two Out tested in the GL 11+ exam?`,
        a: `Your child reads the five words and selects the two odd ones out, marking them on a separate answer sheet. The challenge comes from GL choosing words where the connecting link is specific rather than obvious, so a child has to look past the first broad category they notice.`,
      },
      {
        q: `How many Odd Two Out questions are in the GL 11+ paper?`,
        a: `GL does not publish the exact count. Our research estimate from practice papers is roughly 4 to 8 Odd Two Out questions in a typical Verbal Reasoning paper of about 80 questions, usually grouped together as one block.`,
      },
      {
        q: `What is the hardest part of Odd Two Out?`,
        a: `The questions where all five words seem to belong to one broad group, so your child must find a sharper, more specific link that only three of them share. Advanced vocabulary and words with double meanings make these the most demanding, because the obvious grouping is often a deliberate red herring.`,
      },
      {
        q: `How can my child improve at Odd Two Out for the 11+?`,
        a: `The key habit is to look for the three that link rather than the two that are odd, and to name that link as precisely as they can. Building general knowledge of categories such as trees, instruments and sports also helps. Free PrepStep practice gives one Odd Two Out question at a time with a worked explanation that names the exact link, so your child sharpens that precision steadily.`,
      },
    ],

    meta: {
      title:         `11+ Odd Two Out Practice (GL Assessment) | PrepStep`,
      description:   `Free 11+ Odd Two Out practice for the GL Assessment. Find the two words that do not belong, with worked explanations. Spot the hidden link in Verbal Reasoning.`,
      ogTitle:       `11+ Odd Two Out Practice (GL Assessment) | PrepStep`,
      ogDescription: `Free GL Assessment 11+ Odd Two Out practice: find the odd pair, worked explanations, real select-two format. Learn to spot the precise connecting link.`,
    },
  },

  // ── VR: COMPOUND WORDS ───────────────────────────────────────────────────────
  compoundWords: {
    subject:      'vr',
    subjectLabel: 'Verbal Reasoning',
    topicKey:     'compoundWords',
    slug:         'compound-words',
    topicLabel:   'Compound Words',
    canonical:    'https://prepstep.co.uk/practice/vr/compound-words',
    questionIds:  [1, 10, 109, 101, 127],

    intro: `Compound words are one of the word-building question types in the GL Assessment 11+ Verbal Reasoning paper, where two smaller words click together to make a single bigger one (sun + flower, foot + ball, water + fall). Your child is asked to find the word that bridges two others, or to spot the pair that joins, rather than simply to recognise a compound they already know.

GL does not publish how many of each VR type appear, but our research estimate is that when a word-building section like this shows up it runs to a short block of roughly five to ten questions. Like the rest of the paper it is multiple choice with five options (A to E) marked on a separate answer sheet, so a confident, quick approach here protects time for the heavier reasoning sections later on.

PrepStep practises compound words in the three shapes GL actually uses: choosing one word that fits in front of (or after) two given words, finding the two words in a list of five that join together, and picking one word from each of two groups to build a new word. Every question comes with a worked explanation, so your child learns to test a candidate against both halves rather than settling for the first word that sounds familiar.`,

    topicBreakdown: {
      intro: `Compound words are tested through several closely related shapes. GL does not break the type down publicly, so the spread below is our research estimate drawn from the question shapes that appear in practice material:`,
      items: [
        `Front-linking words (one word that goes before two others): for example a word that makes sense before both "light" and "rise" (sun gives sunlight and sunrise)`,
        `End-linking words (one word that goes after two others): for example a word that follows both "book" and "suit" (case gives bookcase and suitcase)`,
        `Find-the-pair (two words in a list of five that join): spotting that "fire" and "place" make fireplace while the other three are decoys`,
        `Pick-one-from-each-group (build a compound across two columns), where the first-group word always comes first`,
        `Meaning-linked sets (the compounds share a theme such as weather, the home, or sport), which helps confirm a sensible answer`,
        `Direction sensitivity (knowing that "bow" works after "rain" but the reverse does not make a word), which is the heart of the harder items`,
      ],
      footnote: `Difficulty climbs from everyday compounds a Year 4 child uses daily (bedroom, football) up to less obvious or slightly old-fashioned compounds such as landscape, uproar and household, where one half is far less common than the other.`,
    },

    pitfalls: [
      {
        lead: `Choosing a word that only fits one of the two targets.`,
        tip:  `GL stocks the options with a word that joins the first target beautifully but fails the second. "Day" makes daylight but there is no "dayrise". Teach your child to test the candidate against both targets before committing, not just the one they read first.`,
      },
      {
        lead: `Joining the words in the wrong order.`,
        tip:  `Compounds are directional: "rainbow" is a word but "bowrain" is not. In the pick-from-groups shape the first-group word always leads. Encourage your child to read the join out loud in the stated order to hear whether it is a real word.`,
      },
      {
        lead: `Accepting an American or near-compound that is not standard British English.`,
        tip:  `Options sometimes include forms like "anyplace" that sound plausible but are not the British compound GL rewards. If a more natural everyday compound also fits, that is almost always the intended answer.`,
      },
      {
        lead: `Stopping at the first valid pair in find-the-pair questions.`,
        tip:  `The five-word lists are built so that two unrelated words can look tempting together. Train your child to scan all five and confirm that the other three genuinely form no compound, rather than grabbing the first pairing that catches the eye.`,
      },
    ],

    faq: [
      {
        q: `What is a compound word question in the 11+ Verbal Reasoning exam?`,
        a: `It is a word-building question where two smaller words join to make one bigger word. In the GL Assessment 11+ your child might be asked for a word that fits in front of or after two given words, to find the two words in a list that join together, or to build a compound by picking one word from each of two groups. It tests vocabulary and the ability to test a word against more than one partner.`,
      },
      {
        q: `How are compound words tested in the GL 11+ paper?`,
        a: `Through multiple choice with five options (A to E) marked on a separate answer sheet. The questions appear in a few shapes (front-linking, end-linking, find-the-pair and pick-from-two-groups) but all reward the same instinct: checking that a candidate word genuinely makes a real compound with both targets, in the correct order.`,
      },
      {
        q: `How many compound word questions are in the 11+ Verbal Reasoning paper?`,
        a: `GL does not publish a fixed number, and the question types rotate from one paper to the next. Our research estimate is that when a word-building section appears it is a short block of roughly five to ten questions. Because each one is quick to solve, it is worth banking these marks confidently and early.`,
      },
      {
        q: `What makes a compound word question hard?`,
        a: `The hardest items use a compound where one half is rare or slightly old-fashioned, such as landscape, uproar or household, so the answer does not jump out. They also lean on direction (rainbow works, bowrain does not) and stock the options with a word that fits only one of the two targets. Careful testing beats first instinct here.`,
      },
      {
        q: `How can my child get better at compound words for the 11+?`,
        a: `Wide reading builds the bank of compounds a child recognises instantly, and a quick daily habit of spotting compounds in everyday text helps. Beyond that, practising in the exact GL shapes teaches the test-both-halves discipline that the trickier questions demand. Free PrepStep practice covers all three compound-word shapes with worked explanations, so your child learns why an answer works rather than just which one to pick.`,
      },
    ],

    meta: {
      title:         `11+ Compound Words Practice (GL Assessment) | PrepStep`,
      description:   `Free 11+ compound words practice for the GL Assessment Verbal Reasoning paper. Front-link, end-link and find-the-pair questions, five options, worked explanations.`,
      ogTitle:       `11+ Compound Words Practice (GL Assessment) | PrepStep`,
      ogDescription: `Free GL Assessment 11+ compound words practice: build words across three real question shapes, five-option format, worked explanations for every answer.`,
    },
  },

  // ── VR: HIDDEN WORDS ─────────────────────────────────────────────────────────
  hiddenWords: {
    subject:      'vr',
    subjectLabel: 'Verbal Reasoning',
    topicKey:     'hiddenWords',
    slug:         'hidden-words',
    topicLabel:   'Hidden Words',
    canonical:    'https://prepstep.co.uk/practice/vr/hidden-words',
    questionIds:  [1, 46, 47, 106, 2],

    intro: `Hidden words ask your child to find a small word camouflaged at the join between two side-by-side words in a sentence. The hidden word always straddles a word boundary, taking the last letters of one word and the first letters of the next, so in "the attic stairs" the word SEAT is waiting at the join of theSE and ATtic. Crucially the hidden word is never tucked inside a single word, only across the gap between two.

GL does not publish how many hidden-word items each Verbal Reasoning paper carries, but our research estimate is a block of roughly five to ten when this type appears. On PrepStep this is a select-two question: your child is shown five words and taps the two adjacent words that, joined at the boundary, conceal the target. The hidden word is almost always four letters long, which matches the authentic GL pattern far better than the longer hidden words some practice books invent.

Every question tells your child the length to look for and comes with a worked explanation that shows exactly where the split falls. That trains the systematic left-to-right boundary scan that turns a slow, lucky guess into a fast, reliable method.`,

    topicBreakdown: {
      intro: `Hidden-word questions vary mainly by where the split falls and how busy the sentence is. GL does not break the type down publicly, so the spread below is our research estimate:`,
      items: [
        `Even 2+2 splits (two letters from the first word, two from the second): the most common and easiest to spot, such as soME + ALways hiding MEAL`,
        `Uneven 1+3 splits (one letter ends the first word, three start the second), such as sloW + ORDers hiding WORD`,
        `Uneven 3+1 splits (three letters end the first word, one starts the second), such as ancHOR + Nestled hiding HORN`,
        `Hidden words placed mid-sentence (easier) versus buried near the start or end (harder)`,
        `Short sentences with few boundaries to check versus longer sentences with many tempting near-misses`,
        `Decoy boundaries that form a short incidental word of the wrong length, designed to slow a hurried reader down`,
      ],
      footnote: `Difficulty rises with sentence length and the use of uneven splits: easy items use a common four-letter word at an even 2+2 join in a short sentence, while the hardest bury a less obvious word at a 1+3 or 3+1 join with several distracting boundaries nearby.`,
    },

    pitfalls: [
      {
        lead: `Looking for the hidden word inside a single word.`,
        tip:  `The word always crosses the gap between two adjacent words, never sits within one. If your child finds "ever" inside "every", that does not count. Teach them to read each pair of neighbours as a join, ignoring what lives inside any one word.`,
      },
      {
        lead: `Only checking 2+2 splits.`,
        tip:  `Even splits are the most common, so children stop there and miss the answer. Roughly a third of items use a 1+3 or 3+1 split. Encourage your child, when a clean 2+2 does not appear, to try one-letter and three-letter starts before moving on.`,
      },
      {
        lead: `Being misled by the sentence's meaning.`,
        tip:  `GL writes sentences whose subject has nothing to do with the hidden word, so a sentence about cooking might hide RAIN. Remind your child that meaning is a decoy here; only the letters at the boundaries matter.`,
      },
      {
        lead: `Skipping boundaries in a long sentence.`,
        tip:  `A twelve-word sentence has eleven boundaries, and the answer is often near the end where attention fades. Train a left-to-right scan that checks every join in order rather than jumping to the words that look interesting.`,
      },
    ],

    faq: [
      {
        q: `What is a hidden word question in the 11+ Verbal Reasoning exam?`,
        a: `It is a question where a small word is hidden across the join between two side-by-side words in a sentence. Your child finds it by taking the last letters of one word and the first letters of the next, for example LOVE hidden in "solo venue" (soLO + VEnue). In the GL Assessment 11+ the hidden word is almost always four letters long.`,
      },
      {
        q: `How are hidden words tested in the GL 11+ paper?`,
        a: `Your child is given a sentence and told how many letters the hidden word has, then identifies where it sits. On PrepStep this is a tap-two-words (select-two) format, matching the way GL asks children to pinpoint the boundary. The hidden word always crosses a gap between two words and never sits inside a single word.`,
      },
      {
        q: `How long is the hidden word in 11+ questions?`,
        a: `Almost always four letters, occasionally three. This matches the authentic GL pattern, which practitioner sources consistently describe as a four-letter hidden word. Some practice books invent five-letter or longer hidden words, but those are not representative of the real GL paper, so PrepStep keeps to four-letter items with the occasional three.`,
      },
      {
        q: `What is the best strategy for hidden word questions?`,
        a: `A systematic left-to-right boundary scan. Your child checks each pair of neighbouring words in turn, trying the even 2+2 split first, then 1+3 and 3+1 if needed, and ignores what the sentence is actually about. Saying the candidate letters quietly often helps the word jump out, and skipping tiny words like "a" and "I" speeds things up.`,
      },
      {
        q: `How can my child improve at hidden words for the 11+?`,
        a: `The skill responds quickly to drilling, because it is a method more than a knowledge test. Regular short bursts build the habit of scanning every boundary and trying uneven splits. Free PrepStep practice gives sentences across easy and hard difficulties with worked explanations that show exactly where each split falls, so the technique becomes automatic.`,
      },
    ],

    meta: {
      title:         `11+ Hidden Words Practice (GL Assessment) | PrepStep`,
      description:   `Free 11+ hidden words practice for the GL Assessment Verbal Reasoning paper. Find the four-letter word across two words, with worked explanations of every split.`,
      ogTitle:       `11+ Hidden Words Practice (GL Assessment) | PrepStep`,
      ogDescription: `Free GL Assessment 11+ hidden words practice: spot the four-letter word hidden across two adjacent words. Tap-two format, worked explanations, easy to hard.`,
    },
  },

  // ── VR: MOVE A LETTER ────────────────────────────────────────────────────────
  letterMove: {
    subject:      'vr',
    subjectLabel: 'Verbal Reasoning',
    topicKey:     'letterMove',
    slug:         'move-a-letter',
    topicLabel:   'Move a Letter',
    canonical:    'https://prepstep.co.uk/practice/vr/move-a-letter',
    questionIds:  [5, 25, 26, 31, 37],

    intro: `Move a Letter hands your child two words and asks them to lend a single letter from one to the other so that both become new, real words. Take SPINE and OAR: move the S across and SPINE becomes PINE while OAR becomes SOAR. The letters that stay behind keep their original order in both words, and the borrowed letter can drop in anywhere in the receiving word, not just at the start.

This is one of the letter-manipulation types in the GL Assessment 11+ Verbal Reasoning paper. GL does not publish a per-type count, but our research estimate is a block of roughly five to ten questions when it appears. On PrepStep the answer options are the five candidate letters (A to E), and the catch is that only one of them leaves two genuine words behind, which is what makes the type a real test of checking rather than guessing.

Every question shows the two starting words and explains which letter moves, what each word becomes, and why the others fail. That builds the double-check habit GL rewards: a child has not finished until both new words are confirmed real.`,

    topicBreakdown: {
      intro: `Move a Letter items vary by which letter moves, where it lands, and how familiar the resulting words are. GL does not publish a breakdown, so the spread below is our research estimate, and the bank itself leans heavily toward the medium band:`,
      items: [
        `Start-or-end consonant moves (the most approachable), such as moving the B from BLAND to OAR to give LAND and BOAR`,
        `Middle-letter moves, where the travelling letter comes from inside the source word rather than its edge`,
        `Insertion anywhere in the receiver, so the borrowed letter may land at the front, middle or end of the second word`,
        `Either-direction problems, where the letter might travel left-to-right or right-to-left and the child must work out which`,
        `Less common resulting words (such as BOAR, COWL or TERN) that a child must recognise as genuine`,
        `Double-letter and near-word traps, where removing a letter seems to work but leaves something that is not actually a word`,
      ],
      footnote: `Difficulty is driven by how hidden the moving letter is and how familiar the results are: easy items move an edge consonant to make two everyday words, while the hardest hide the move in the middle, run right-to-left, or hinge on a less common word that a child must be sure is real.`,
    },

    pitfalls: [
      {
        lead: `Confirming one new word but not the other.`,
        tip:  `The single most common slip. A letter that makes the first word work may leave the second word as nonsense. Teach your child the rule that the question is only solved when BOTH results are real words, and to check the second every time.`,
      },
      {
        lead: `Assuming the letter always moves left to right.`,
        tip:  `GL tests both directions without telling the child which to use. The answer might mean taking a letter from the second word and giving it to the first. Encourage your child to try the move in both directions before deciding a letter does not work.`,
      },
      {
        lead: `Only trying the first and last letters.`,
        tip:  `Edge letters are the common case, so children stop there. The intended answer is sometimes a letter from the middle of the source word. If no edge letter produces two real words, prompt your child to test the inner letters too.`,
      },
      {
        lead: `Accepting a word that looks right but is not real.`,
        tip:  `Near-words such as BRANE or TRALE feel plausible under time pressure. Reading both results aloud quietly helps the ear reject a non-word. If a child is unsure a result is genuine, that option is probably the trap.`,
      },
    ],

    faq: [
      {
        q: `What is a Move a Letter question in the 11+ Verbal Reasoning exam?`,
        a: `It is a question where your child moves one letter from one word to another so that both become new, real words. For example, moving the P from PLATE to AN gives LATE and PAN. The remaining letters keep their order, and the moved letter can be inserted anywhere in the receiving word. It tests spelling, vocabulary and careful checking.`,
      },
      {
        q: `How is Move a Letter tested in the GL 11+ paper?`,
        a: `Through multiple choice with five options (A to E) on a separate answer sheet. On PrepStep the options are the five candidate letters that might move, and only one of them leaves two genuine words behind. The child has to work out both which letter travels and, often, in which direction.`,
      },
      {
        q: `Can the letter move in either direction in these questions?`,
        a: `Yes. GL does not tell the child which way the letter travels, so the answer might involve taking a letter from the first word or from the second. This is a deliberate trap: many children assume left-to-right only. The reliable approach is to test a candidate letter in both directions before ruling it out.`,
      },
      {
        q: `What makes Move a Letter questions tricky?`,
        a: `Three things: the moving letter is sometimes hidden in the middle of a word rather than at an edge, the direction is not stated, and the result can be a less common word such as TERN or COWL that a child must recognise as real. The biggest single error is confirming one new word and forgetting to check the other.`,
      },
      {
        q: `How can my child improve at Move a Letter for the 11+?`,
        a: `A clear method beats trial and error: remove each candidate letter, check the remainder is a word, then try inserting that letter at every position in the other word, in both directions. Building everyday vocabulary helps a child trust the less common results. Free PrepStep practice provides graded questions with worked explanations that model this remove-and-check routine.`,
      },
    ],

    meta: {
      title:         `11+ Move a Letter Practice (GL Assessment) | PrepStep`,
      description:   `Free 11+ Move a Letter practice for the GL Assessment Verbal Reasoning paper. Shift one letter between two words to make two new words, with worked explanations.`,
      ogTitle:       `11+ Move a Letter Practice (GL Assessment) | PrepStep`,
      ogDescription: `Free GL Assessment 11+ Move a Letter practice: lend one letter between two words so both become real. Five-option format, worked explanations, easy to hard.`,
    },
  },

  // ── VR: MISSING LETTERS ──────────────────────────────────────────────────────
  missingLettersWords: {
    subject:      'vr',
    subjectLabel: 'Verbal Reasoning',
    topicKey:     'missingLettersWords',
    slug:         'missing-letters',
    topicLabel:   'Missing Letters',
    canonical:    'https://prepstep.co.uk/practice/vr/missing-letters',
    questionIds:  [12, 46, 91, 47, 106],

    intro: `Missing Letters takes a small three-letter word and steals it out of the middle of a longer word, leaving a gap your child has to fill. In the sentence "The FER milked the cows at dawn", the answer is ARM: drop it back in and FER becomes FARMER. The twist GL builds in is that the three stolen letters must themselves spell a real word, so your child is solving two puzzles at once.

This is one of the word-completion types in the GL Assessment 11+ Verbal Reasoning paper. GL does not publish how many appear, but our research estimate is a block of roughly five to ten when the type is included. It is multiple choice with five options (A to E) on a separate answer sheet, and on PrepStep the question is wrapped in a short sentence so the surrounding meaning helps confirm the right longer word.

Each question explains how the chosen three letters rebuild the longer word and why that little word is genuine in its own right. That trains the two-part check at the heart of the type: the completed word must be real, and so must the three letters you put back.`,

    topicBreakdown: {
      intro: `Missing Letters questions vary by where the gap sits in the longer word and how common both words are. GL does not publish a breakdown, so the spread below is our research estimate:`,
      items: [
        `Letters stolen from the start of the word, such as ARM rebuilding FARMER from FER`,
        `Letters stolen from the middle, the most common and often trickiest position, such as ASK rebuilding BASKET from BET`,
        `Letters stolen from the end, such as AGE rebuilding COTTAGE from COTT`,
        `Sentence-context items, where the surrounding sentence tells your child which longer word is meant`,
        `Look-alike option sets (ARM, ART, ACT, ANT), where only one three-letter word both is real and rebuilds a real longer word`,
        `Tricky spellings in the completed word (silent letters or double letters), which can disguise where the gap belongs`,
      ],
      footnote: `Difficulty grows from short, common words with an obvious gap up to longer, less familiar words where the stolen letters land in the middle and the option set is full of near-identical three-letter words.`,
    },

    pitfalls: [
      {
        lead: `Picking three letters that rebuild the long word but are not a real word themselves.`,
        tip:  `Both halves of the puzzle must hold. The three letters you insert have to spell a genuine word on their own, not just patch the gap. Teach your child to confirm the little word is real before accepting it.`,
      },
      {
        lead: `Choosing a real three-letter word that does not complete a real longer word.`,
        tip:  `The reverse trap: an option like CAT is obviously a word, but it may not rebuild anything sensible. Remind your child to slot the letters in and read the full longer word back to check it actually exists.`,
      },
      {
        lead: `Being caught out by look-alike options.`,
        tip:  `GL clusters options such as APT, ART, ACT and ANT that differ by a single letter. Under time pressure these blur together. Encourage your child to test each candidate fully rather than settling on the one that looks roughly right.`,
      },
      {
        lead: `Ignoring the sentence's meaning.`,
        tip:  `In the sentence version, the surrounding words are a clue, not decoration. A child who guesses purely from the letters may build a real word that makes no sense in context. Reading the finished sentence back confirms the answer fits.`,
      },
    ],

    faq: [
      {
        q: `What is a Missing Letters question in the 11+ Verbal Reasoning exam?`,
        a: `It is a question where three letters in a row have been removed from a longer word, and your child finds the three-letter word that fits back in. For example, ARK rebuilds MARKET from MET. The clever part is that the three missing letters must spell a real word on their own, so two conditions have to be met at once.`,
      },
      {
        q: `How is Missing Letters tested in the GL 11+ paper?`,
        a: `Through multiple choice with five options (A to E) marked on a separate answer sheet. The options are three-letter words, and on PrepStep the gapped word sits inside a short sentence so the meaning helps your child confirm the intended longer word. Only one option both is a real word and rebuilds a real longer word.`,
      },
      {
        q: `Where do the missing letters appear in the word?`,
        a: `They can be taken from the beginning, the middle or the end of the longer word. The middle position is the most common and usually the hardest, because the gap is less obvious than at the edges. Recognising that the stolen letters can sit anywhere stops a child fixating only on the start of the word.`,
      },
      {
        q: `What is the difference between Missing Letters and similar VR question types?`,
        a: `Missing Letters removes three consecutive letters that themselves form a word. That is distinct from Shared Letter, which inserts a single letter to complete two pairs of words, and from Move a Letter, which transfers one letter between two existing words. Knowing which type is in front of them helps a child apply the right method quickly.`,
      },
      {
        q: `How can my child improve at Missing Letters for the 11+?`,
        a: `The most reliable habit is the two-part check: confirm the completed longer word is real and that the three inserted letters also spell a word, then read the sentence back to be sure it makes sense. Wider reading expands the longer words a child recognises instantly. Free PrepStep practice offers graded sentence-based questions with worked explanations that model both checks.`,
      },
    ],

    meta: {
      title:         `11+ Missing Letters Practice (GL Assessment) | PrepStep`,
      description:   `Free 11+ Missing Letters practice for the GL Assessment Verbal Reasoning paper. Find the three-letter word that rebuilds a longer word, with worked explanations.`,
      ogTitle:       `11+ Missing Letters Practice (GL Assessment) | PrepStep`,
      ogDescription: `Free GL Assessment 11+ Missing Letters practice: restore the three stolen letters so both words are real. Five-option format, worked explanations, easy to hard.`,
    },
  },

  // ── VR: LETTER CODES ─────────────────────────────────────────────────────────
  letterCodes: {
    subject:      'vr',
    subjectLabel: 'Verbal Reasoning',
    topicKey:     'letterCodes',
    slug:         'letter-codes',
    topicLabel:   'Letter Codes',
    canonical:    'https://prepstep.co.uk/practice/vr/letter-codes',
    questionIds:  [2, 98, 109, 4, 8],

    intro: `Letter codes hand your child a secret rule and ask them to crack it. A worked example is given (for instance, COLD is coded as DPME), and from that single clue your child has to work out exactly how each letter was shifted along the alphabet. Then they either encode a brand new word or decode a mystery one back into real English. It is one of the most satisfying question types in the GL Assessment 11+ Verbal Reasoning paper, because every answer can be checked and proved.

Letter codes do not appear in every GL paper. When they do, our research estimate is a block of around 6 questions, and the type tends to rotate with other code and letter puzzles from one sitting to the next. As with the rest of the VR paper, each question gives five options (A to E) and the answer is marked on a separate answer sheet. GL prints an alphabet line on the page, and your child is expected to use it, counting the gaps between letters rather than trying to hold the whole alphabet in their head.

On this page your child practises with a printed alphabet line just like the real exam, working through one code at a time. Every question carries a worked explanation that shows the shift letter by letter, so your child learns to verify each step instead of guessing the rule from the first letter alone.`,

    topicBreakdown: {
      intro: `Letter codes are built from a small set of shift rules. GL does not publish how often each appears, so the order below is our research estimate from analysing practice papers, roughly from most to least common:`,
      items: [
        `Constant forward shift (every letter moves the same number of places forward, such as +1 or +2): the most common rule and the foundation of the whole type`,
        `Constant backward shift (every letter moves the same number of places back, such as -1 or -2): just as common, and the source of most direction mix-ups`,
        `Decoding back to a real word (given the code, find the original word): a step harder than encoding because the answer must spell something sensible`,
        `Larger shifts of +3 or +4 (and their backward versions): more counting per letter, so more chance of slipping`,
        `Wrap-around at the ends of the alphabet (a forward shift past Z loops to A, a backward shift past A loops to Z): often combined with any of the rules above`,
        `Variable or progressive shifts (the shift changes for each position, such as -1 then -2 then -3): the trickiest pattern and a classic harder question`,
        `Mirror codes (A pairs with Z, B with Y, C with X, and so on): occasional, and a different kind of thinking from a simple shift`,
      ],
      footnote: `Difficulty runs from a stated +1 rule on a three-letter word, through four-letter words where your child must discover the rule themselves, up to decoding five-letter words with wrap-around or a shift that changes at every position.`,
    },

    pitfalls: [
      {
        lead: `Working out the rule from only the first letter.`,
        tip:  `A code can look like a simple +1 shift on its first letter, then change. Teach your child to check every single letter against the example before deciding on the rule, then apply that proven rule to the new word.`,
      },
      {
        lead: `Mixing up encoding and decoding.`,
        tip:  `If the example moves letters forward to make the code, then turning a code back into a word means moving the same number of places backward. Encourage your child to read carefully whether they are being asked for the code or for the word, and to flip the direction when decoding.`,
      },
      {
        lead: `Forgetting that the alphabet wraps round.`,
        tip:  `Shifting Y forward by 3 lands on B, not on a letter past Z. Shifting B back by 3 lands on Y. Remind your child to picture the alphabet as a circle, so after Z comes A again and before A comes Z.`,
      },
      {
        lead: `Getting caught by near-miss options.`,
        tip:  `GL designs wrong answers that differ from the correct code by just one letter, so a single miscount picks the wrong one. The fix is to count each shift on the alphabet line and verify the finished answer letter by letter before committing.`,
      },
    ],

    faq: [
      {
        q: `What are letter codes in the GL 11+ exam?`,
        a: `Letter codes are a Verbal Reasoning question type where your child is shown a word and its coded version, then has to work out the rule that turned one into the other. The rule is almost always a shift along the alphabet, such as moving every letter two places forward. Your child then uses that rule to encode a new word or decode a mystery one, choosing from five options (A to E).`,
      },
      {
        q: `What is the EJOTY trick for letter codes?`,
        a: `EJOTY is a memory aid for the position of certain letters: E is the 5th letter, J is the 10th, O is the 15th, T is the 20th and Y is the 25th. These act as signposts along the alphabet, so instead of counting from A every time, your child jumps to the nearest anchor and counts on from there. It makes shifting letters much faster and more accurate.`,
      },
      {
        q: `Are letter codes in every GL Assessment paper?`,
        a: `Not always. Letter codes appear in some GL Verbal Reasoning papers and not others, and our research estimate is a block of around 6 questions when they do feature. The type tends to rotate with other code-style puzzles, so it is worth preparing for even if it does not turn up every time. GL provides a printed alphabet line on the page to help.`,
      },
      {
        q: `What is the hardest kind of letter code?`,
        a: `The trickiest are variable shifts, where the amount each letter moves changes with its position, for example the first letter moves one place, the second moves two, the third moves three. Mirror codes and decoding longer words with wrap-around are also demanding. These reward children who check every letter rather than assuming the same shift applies throughout.`,
      },
      {
        q: `How can my child get better at letter codes?`,
        a: `The fastest gains come from learning the EJOTY anchors, practising small shifts until they are automatic, and always verifying every letter against the example before answering. Free PrepStep practice gives your child a printed alphabet line and one code at a time, with a worked explanation that shows the shift letter by letter, so the method becomes second nature.`,
      },
    ],

    meta: {
      title:         `11+ Letter Codes Practice (GL Assessment) | PrepStep`,
      description:   `Free 11+ letter codes practice for the GL Assessment. Five-option questions with a printed alphabet line and worked explanations. Crack the alphabet shift rule.`,
      ogTitle:       `11+ Letter Codes Practice (GL Assessment) | PrepStep`,
      ogDescription: `Free GL Assessment 11+ letter codes practice: alphabet-shift puzzles, five options, worked explanations. Learn to encode and decode with confidence.`,
    },
  },

  // ── VR: LETTER PAIR SERIES ───────────────────────────────────────────────────
  letterPairSeries: {
    subject:      'vr',
    subjectLabel: 'Verbal Reasoning',
    topicKey:     'letterPairSeries',
    slug:         'letter-pair-series',
    topicLabel:   'Letter Pair Series',
    canonical:    'https://prepstep.co.uk/practice/vr/letter-pair-series',
    questionIds:  [1, 36, 39, 5, 3],

    intro: `Letter pair series turn your child into a pattern detective. A line of letter pairs is shown, such as AC, BD, CE, DF, and your child has to spot the hidden rule and supply the pair that comes next. The clever part is that each pair holds two patterns running side by side: the first letters follow one rule and the second letters follow another, and the two rules can be completely different. Cracking both at once is what the question rewards.

Letter pair series sit within the GL Assessment 11+ Verbal Reasoning paper, where this kind of sequence reasoning is a regular feature. Our research estimate, since GL does not publish exact weightings, is a small block of questions in papers that include the type. As everywhere in the VR paper, your child picks from five options (A to E) and marks the answer on a separate sheet. GL prints an alphabet line on the page, and counting the gap between letters on that line is exactly the skill being tested.

On this page your child works through these sequences one at a time, with the same alphabet line they will meet in the exam. Every question comes with a worked explanation that splits the pair into its two patterns, so your child learns to track each letter separately rather than guessing from the look of the sequence.`,

    topicBreakdown: {
      intro: `Letter pair series are built from a handful of pattern shapes. GL does not publish their frequency, so this order is our research estimate, roughly from most common to least:`,
      items: [
        `Both letters following the same simple rule (each pair adds the same small step, such as +1 or +2 to both letters): the gentlest starting point`,
        `A different step for each letter (the first letter moves by one amount, the second by another): the heart of the type`,
        `Opposite directions (the first letter moves forward while the second moves backward, as in AZ, BY, CX): a favourite GL pattern`,
        `Repeated letters in a pair moving together (ZZ, YY, XX), where both letters share one rule`,
        `Asymmetric step sizes (one letter jumps by three, the other slips back by two): a harder mix`,
        `Wrap-around across the Z to A boundary (a sequence that runs off the end of the alphabet and loops round): a real test of care`,
        `Accelerating or converging gaps (the jump grows each step, or the two letters drift towards each other): the most demanding shapes`,
      ],
      footnote: `Difficulty climbs from both letters sharing one easy rule, through pairs where each letter follows its own rule or runs in the opposite direction, up to asymmetric steps, wrap-around and gaps that change size as the sequence goes on.`,
    },

    pitfalls: [
      {
        lead: `Assuming both letters obey the same rule.`,
        tip:  `In many pairs the first and second letters move differently, and one of the wrong options is usually built on the false idea that they match. Teach your child to read the first letters as one sequence and the second letters as a separate sequence, then solve each on its own.`,
      },
      {
        lead: `Checking only the last two pairs.`,
        tip:  `A rule that fits the final two pairs might not fit the whole line. Encourage your child to confirm the pattern works for every pair from the start before choosing, which rules out the tempting near-miss answers.`,
      },
      {
        lead: `Slipping by one place when counting.`,
        tip:  `Off-by-one errors are the most common mistake here, and GL builds options that are exactly one letter away from correct. Counting each gap on the alphabet line, rather than from memory, keeps your child on the right letter.`,
      },
      {
        lead: `Getting the direction wrong near Z and A.`,
        tip:  `When a sequence runs backward, or wraps past the ends of the alphabet, it is easy to reverse the move by mistake. Remind your child that after Z comes A again, before A comes Z, and to write the direction of each pattern down before extending it.`,
      },
    ],

    faq: [
      {
        q: `What is a letter pair series in the 11+?`,
        a: `It is a Verbal Reasoning question that shows a line of letter pairs, such as AC, BD, CE, DF, and asks for the pair that comes next. Each pair contains two patterns at once: the first letters follow one rule and the second letters follow another. Your child works out both rules and chooses the correct next pair from five options (A to E).`,
      },
      {
        q: `How do you solve letter pair series questions?`,
        a: `The reliable method is to split the pair in two. Read all the first letters as one sequence and work out their rule, then read all the second letters as a separate sequence and work out theirs. Converting letters to their alphabet positions (A is 1, B is 2, and so on) makes the gaps easy to see. Finally, check the rule fits every pair before answering.`,
      },
      {
        q: `Why do the two letters follow different rules?`,
        a: `That is exactly what the question type is designed to test. GL wants to see whether your child can hold two patterns in mind at the same time, so the first and second letters often move by different amounts or even in opposite directions. Treating them as one combined rule is the most common reason children pick a wrong answer.`,
      },
      {
        q: `What makes a letter pair series hard?`,
        a: `The hardest versions use asymmetric steps (each letter jumping by a different amount), wrap-around past Z or A, or gaps that grow or shrink as the sequence continues. Sequences where the two letters converge towards each other, or where two patterns are interleaved, are also demanding and reward careful, step-by-step checking.`,
      },
      {
        q: `How can my child improve at letter pair series?`,
        a: `Practice that trains the split-the-pair habit is the key, along with comfort converting letters to numbers and counting on the alphabet line. Free PrepStep practice gives your child these sequences one at a time with the alphabet line on screen, and each worked explanation separates the pair into its two patterns, so the method sticks.`,
      },
    ],

    meta: {
      title:         `11+ Letter Pair Series Practice (GL Assessment) | PrepStep`,
      description:   `Free 11+ letter pair series practice for the GL Assessment. Five-option questions with an alphabet line and worked explanations. Find the next pair every time.`,
      ogTitle:       `11+ Letter Pair Series Practice (GL Assessment) | PrepStep`,
      ogDescription: `Free GL Assessment 11+ letter pair series practice: two-pattern sequences, five options, worked explanations. Learn to split the pair and crack the rule.`,
    },
  },

  // ── VR: NUMBER SERIES ────────────────────────────────────────────────────────
  numberSeries: {
    subject:      'vr',
    subjectLabel: 'Verbal Reasoning',
    topicKey:     'numberSeries',
    slug:         'number-series',
    topicLabel:   'Number Series',
    canonical:    'https://prepstep.co.uk/practice/vr/number-series',
    questionIds:  [5, 32, 33, 71, 6],

    intro: `Number series sit right at the meeting point of maths and reasoning. Your child is shown a run of numbers, usually five to seven of them, such as 3, 7, 11, 15, 19, and has to work out the rule and give the number that comes next. The skill is not arithmetic for its own sake. It is spotting the hidden relationship between the numbers, whether that is a steady step, a times table, growing gaps or something more inventive.

Number series are a dependable feature of the GL Assessment 11+ Verbal Reasoning paper. Our research estimate is roughly 3 to 5 questions per paper, with the missing number almost always at the end of the run. The numbers are whole numbers; decimals and fractions are essentially absent and negatives are rare. Your child chooses from five options (A to E) and marks the answer on a separate sheet, so quick, accurate pattern-spotting matters as much as the maths itself.

On this page your child practises these sequences one at a time, building the instinct to write down the gaps between numbers and read the pattern from there. Every question has a worked explanation that names the rule and shows the final step, so your child learns to verify the answer against the whole series rather than trusting the first idea.`,

    topicBreakdown: {
      intro: `Number series are built from a wide range of patterns. GL does not publish how often each appears, so this order is our research estimate, grouped roughly from most approachable to most demanding:`,
      items: [
        `Constant addition or subtraction (the same amount is added or taken away each step, such as +4 or -7): the most common and most reliable pattern`,
        `Times tables and multiples (the numbers count up in a familiar table, such as 6, 12, 18, 24): quick to spot once the tables are secure`,
        `Doubling and halving (each number is twice or half the one before): a frequent middle-difficulty pattern`,
        `Increasing or decreasing differences (the gap itself grows or shrinks, such as +2, +3, +4, +5): the step up from constant patterns`,
        `Square, cube and other special numbers (1, 4, 9, 16, 25 or 1, 8, 27, 64), and prime numbers (2, 3, 5, 7, 11): rewards recognising known sequences`,
        `Fibonacci-style rules (each number is the sum of the two before it) and triangular numbers (1, 3, 6, 10, 15): patterns hidden in the relationships`,
        `Interleaved and compound rules (two patterns woven together, or a rule such as times two then add one): the hardest type to unpick`,
      ],
      footnote: `Difficulty rises from a single constant gap on small numbers, through growing differences, squares and doubling, up to interleaved sequences where odd and even positions follow different rules and answers can occasionally be negative.`,
    },

    pitfalls: [
      {
        lead: `Writing the gap instead of the next number.`,
        tip:  `After finding that the series goes up by 7, it is easy to write 7 rather than the actual next term. Remind your child that the gap is a clue, not the answer, and that the final step is to add (or subtract) that gap to the last number shown.`,
      },
      {
        lead: `Assuming a steady gap when the gaps are growing.`,
        tip:  `Some series add a little more each step, so a child who spots the first gap and stops there gets caught. Teach your child to write the gap under every pair of numbers, then check whether those gaps are constant or changing before deciding the rule.`,
      },
      {
        lead: `Missing an interleaved pattern.`,
        tip:  `When a series looks chaotic, it is often two patterns woven together, with the odd positions following one rule and the even positions another. Encourage your child to split the series into alternate numbers and look at each strand separately before giving up.`,
      },
      {
        lead: `Slipping on the arithmetic with larger numbers.`,
        tip:  `Off-by-one and simple addition errors are common, and GL builds wrong options that sit one or two away from the correct number. The fix is to work the final calculation carefully on paper and confirm the rule fits every number in the run.`,
      },
    ],

    faq: [
      {
        q: `What is a number series in the GL 11+ exam?`,
        a: `It is a Verbal Reasoning question that shows a run of numbers, usually five to seven of them, with the last one missing. Your child works out the rule linking the numbers, such as adding the same amount each time or following a times table, and chooses the number that comes next from five options (A to E). The missing number is almost always at the end of the series.`,
      },
      {
        q: `How many number series questions are in the GL paper?`,
        a: `Our research estimate is around 3 to 5 number series questions in a typical GL Assessment 11+ Verbal Reasoning paper, since GL does not publish exact counts. They use whole numbers, with decimals and fractions essentially absent and negative answers rare, so the focus is firmly on spotting the pattern quickly and adding up accurately.`,
      },
      {
        q: `How do you work out a number series pattern?`,
        a: `The most reliable method is to write the difference between each pair of numbers. If the differences are all the same, it is a constant add or subtract. If the differences themselves form a pattern, the gaps are growing or shrinking. If the series still looks random, try splitting it into alternate numbers, since two patterns may be woven together. Always check your rule works for every number shown.`,
      },
      {
        q: `What are the hardest number series questions?`,
        a: `The toughest are interleaved sequences, where odd and even positions follow different rules, and compound rules such as times two then add one. Cube numbers and doubling differences are also demanding. These reward children who can recognise known sequences like squares, cubes, primes and Fibonacci, and who check the rule against the whole series rather than just the last two numbers.`,
      },
      {
        q: `How can my child get better at number series?`,
        a: `Secure times tables, quick recall of square and cube numbers, and the habit of writing down the gaps all make a big difference. Free PrepStep practice gives your child these sequences one at a time with worked explanations that name the rule and show the final step, so the pattern-spotting becomes faster and more confident with each attempt.`,
      },
    ],

    meta: {
      title:         `11+ Number Series Practice (GL Assessment) | PrepStep`,
      description:   `Free 11+ number series practice for the GL Assessment. Five-option questions with worked explanations. Spot the pattern and find the next number every time.`,
      ogTitle:       `11+ Number Series Practice (GL Assessment) | PrepStep`,
      ogDescription: `Free GL Assessment 11+ number series practice: sequences, times tables, growing gaps and more, with five options and worked explanations.`,
    },
  },

  // ── VR: LETTER SUMS ──────────────────────────────────────────────────────────
  letterSums: {
    subject:      'vr',
    subjectLabel: 'Verbal Reasoning',
    topicKey:     'letterSums',
    slug:         'letter-sums',
    topicLabel:   'Letter Sums',
    canonical:    'https://prepstep.co.uk/practice/vr/letter-sums',
    questionIds:  [1, 7, 9, 31, 3],

    intro: `Letter sums turn the alphabet into a set of numbers. With A worth 1, B worth 2, C worth 3 and so on up to Z worth 26, your child adds up the value of the letters in a word, or works through a short calculation written in letters. A question might ask for the total value of FACE, or which of five words scores highest, or what a small letter equation comes to. The reasoning is simple to describe but easy to fumble, because it relies on knowing exactly where each letter sits in the alphabet.

Letter sums feature in the GL Assessment 11+ Verbal Reasoning paper as part of its number-and-letter reasoning. The A equals 1 mapping is always stated explicitly, and GL prints an alphabet reference line, often with the position numbers, on the page. Our research estimate, since GL does not publish weightings, is a modest block of questions when the type appears. As across the paper, your child chooses from five options (A to E) and marks the answer on a separate sheet, so careful counting and tidy adding up win marks.

On this page your child practises with that same numbered alphabet line, working through one letter sum at a time. Every question comes with a worked explanation that lists each letter's value before adding them, so your child builds both the alphabet knowledge and the careful arithmetic the type demands.`,

    topicBreakdown: {
      intro: `Letter sums come in several shapes. GL does not publish their frequency, so this order is our research estimate, roughly from the gentlest to the most involved:`,
      items: [
        `Word value (add the alphabet positions of the letters in a word, such as the total of CAT): the core skill everything else builds on`,
        `Letter arithmetic (a short sum written in letters, such as A plus B plus C): straightforward once the values are known`,
        `Comparison (work out several words and decide which scores highest or lowest): more adding up, and a test of accuracy under pressure`,
        `Same-value pairs (calculate a set of words and find the two that match): rewards organised, methodical working`,
        `Mixed operations with multiplication or subtraction (a line such as D times E minus C, where BODMAS applies): the order of operations becomes the trap`,
        `Letter equations (find the missing letter that completes a sum, such as B plus something equals J): reasoning backwards to a letter`,
        `Word difference (the gap between the values of two words): two totals, then a subtraction`,
      ],
      footnote: `Difficulty grows from short words using early-alphabet letters and a single addition, through subtraction and comparison across the full alphabet, up to mixed operations with BODMAS, multi-word comparisons and reverse mappings where A is worth 26 down to Z worth 1.`,
    },

    pitfalls: [
      {
        lead: `Miscounting letters in the middle of the alphabet.`,
        tip:  `Letters like M, N and O are easy to misplace by one, and GL builds wrong options exactly one or two away from correct. Teach your child to anchor on EJOTY (E is 5, J is 10, O is 15, T is 20, Y is 25) and count on from the nearest anchor using the alphabet line.`,
      },
      {
        lead: `Forgetting to count a repeated letter twice.`,
        tip:  `In a word like BELL the L appears twice and must be added twice. Remind your child to tick off each letter as they go, so a doubled letter is never quietly dropped from the total.`,
      },
      {
        lead: `Adding when the line mixes operations.`,
        tip:  `When a question uses multiplication alongside addition or subtraction, BODMAS applies, so the multiplication is done first. For example B plus C times D is 2 plus 12, which is 14, not 20. Encourage your child to do any times step before adding or subtracting.`,
      },
      {
        lead: `Underestimating the high-value letters.`,
        tip:  `Letters near the end of the alphabet are worth a lot (W is 23, X is 24, Y is 25, Z is 26), and children often guess them too low in comparison questions. The fix is to count those letters carefully and, for comparisons, estimate first by noticing which words carry late-alphabet letters.`,
      },
    ],

    faq: [
      {
        q: `What are letter sums in the 11+?`,
        a: `Letter sums are a Verbal Reasoning question type where each letter is given a number, almost always A equals 1 up to Z equals 26. Your child adds the values of the letters in a word, compares words, or solves a short calculation written in letters. The answer is chosen from five options (A to E), and GL prints a numbered alphabet line on the page to help.`,
      },
      {
        q: `What does each letter equal in a letter sum?`,
        a: `In the standard GL letter sum, A equals 1, B equals 2, C equals 3 and so on up to Z equals 26, and this mapping is always stated in the question. Occasionally a harder question uses a different rule, such as A equals 26 counting down to Z equals 1, or each letter worth its position doubled, but the question will always tell your child the values to use.`,
      },
      {
        q: `What is the EJOTY trick for letter sums?`,
        a: `EJOTY names five evenly spaced signposts in the alphabet: E is 5, J is 10, O is 15, T is 20 and Y is 25. Rather than counting from A every time, your child jumps to the nearest signpost and counts on. For example, to find P, start from O (15) and add one to get 16. It makes finding letter values much faster and cuts down counting errors.`,
      },
      {
        q: `Why do children lose marks on letter sums?`,
        a: `The maths is simple, so most marks are lost to small slips: miscounting a letter in the middle of the alphabet, forgetting to add a repeated letter twice, or breaking BODMAS in a mixed calculation. High-value letters near Z are often guessed too low. Careful counting on the alphabet line and tidy written totals prevent nearly all of these.`,
      },
      {
        q: `How can my child improve at letter sums?`,
        a: `Knowing the alphabet positions quickly is the foundation, helped by the EJOTY anchors and learning the alphabet in groups of five. Writing down each letter's value before adding keeps the working tidy. Free PrepStep practice gives your child a numbered alphabet line and one letter sum at a time, with worked explanations that show every value, so accuracy and speed grow together.`,
      },
    ],

    meta: {
      title:         `11+ Letter Sums Practice (GL Assessment) | PrepStep`,
      description:   `Free 11+ letter sums practice for the GL Assessment. Five-option questions with a numbered alphabet line and worked explanations. Turn letters into totals accurately.`,
      ogTitle:       `11+ Letter Sums Practice (GL Assessment) | PrepStep`,
      ogDescription: `Free GL Assessment 11+ letter sums practice: word values, comparisons and letter equations, with a numbered alphabet line and worked explanations.`,
    },
  },

  // ── VR: WORD CODE ANALOGIES ──────────────────────────────────────────────────
  wordCodeAnalogies: {
    subject:      'vr',
    subjectLabel: 'Verbal Reasoning',
    topicKey:     'wordCodeAnalogies',
    slug:         'word-code-analogies',
    topicLabel:   'Word Code Analogies',
    canonical:    'https://prepstep.co.uk/practice/vr/word-code-analogies',
    questionIds:  [6, 2, 10, 14, 18],

    intro: `Word code analogies are the detective work of the GL Assessment 11+ Verbal Reasoning paper. Your child is shown a worked example, such as "big becomes dig", and has to spot exactly what the letters did, then apply that same hidden rule to a brand new word. The trick is to ignore what the words mean completely and watch only the letters: which one changed, where it sat, and how far it moved.

In a typical GL Verbal Reasoning paper the questions are grouped into short blocks of one type, with every answer marked A to E on a separate answer sheet. Code and pattern questions are a regular feature, and our research estimate, based on analysing GL practice papers, is that letter pattern and word code questions together account for roughly 8 to 12 per cent of a paper. GL rotates its question types, so the exact mix changes from one sitting to the next, but code-breaking of some kind almost always appears.

On this page your child meets the real format one question at a time: a model transformation, a new word to convert, and five answer options where every choice is a genuine English word or a tidy letter sequence. Each question comes with a worked explanation that names the rule in plain steps, so your child builds the habit of defining what changed before they choose.`,

    topicBreakdown: {
      intro: `GL bundles several letter-manipulation rules under this heading. GL does not publish how often each appears, so the order below is our research estimate from practice papers, with the most common rules first:`,
      items: [
        `Single letter change (one letter swapped for another, often the first or last): the most common starting point, frequently the easier questions`,
        `Letter removal (stripping the first, last or middle letter, as in "ship" to "hip")`,
        `Reversal (spelling the word backwards, as in "BIG" to "GIB")`,
        `Letter addition or suffix patterns (adding "-er", "-y" or "-our" to build a new word)`,
        `Alphabet shift codes (moving every letter forward or back a fixed number of places, as in "FISH" to "GJTI")`,
        `Letter and number sequences (paired patterns such as A1, B2, C3 where letter and number advance together)`,
        `Compound rules (two operations combined, the hardest variety, such as change then reverse)`,
      ],
      footnote: `Difficulty runs from a single obvious change on a three-letter word up to compound rules on five-letter words and backwards alphabet shifts, where more than one rule can seem to fit and only careful letter-by-letter checking settles it.`,
    },

    pitfalls: [
      {
        lead: `Reading the words for meaning instead of looking at the letters.`,
        tip:  `Code questions reward letter spotting, not vocabulary. Teach your child to cover the meaning and ask only "which letter moved, and how far?" The words being unrelated in sense is the whole point.`,
      },
      {
        lead: `Confusing a reversal with a first-and-last swap on short words.`,
        tip:  `For a three-letter word, reversing it and swapping the outer letters give the same result, so the rule looks ambiguous. Tell your child to test the rule on the longer word in the question, where the two rules give different answers.`,
      },
      {
        lead: `Miscounting the alphabet jump in a shift code.`,
        tip:  `When letters move forward or back a fixed number of places, an off-by-one slip changes every letter. Encourage your child to say the alphabet aloud quietly and count on their fingers rather than guessing the gap.`,
      },
      {
        lead: `Choosing a real word that fits a different rule.`,
        tip:  `GL builds wrong answers that are correct for the wrong interpretation of the example. Once your child has an answer, they should work the rule backwards on it to check it returns the original word.`,
      },
    ],

    faq: [
      {
        q: `What are word code analogies in the GL 11+ Verbal Reasoning exam?`,
        a: `They are questions that show your child a worked example of a word being transformed by a letter rule, such as "big becomes dig", and ask them to apply the same rule to a new word. The skill is pure letter manipulation: spotting which letter changed, where, and by how much. Meaning is irrelevant, which is what makes these questions different from verbal analogies.`,
      },
      {
        q: `How are word code questions tested in the GL 11+ exam?`,
        a: `Through multiple choice with five options (A to E) marked on a separate answer sheet. The questions usually appear in a short block of the same type, and every answer choice is a real English word or a neat letter sequence, so a child who lands on something that is not a word knows they have the rule wrong.`,
      },
      {
        q: `What is the difference between word code analogies and verbal analogies?`,
        a: `Verbal analogies are about meaning, for example "kitten is to cat as puppy is to dog". Word code analogies are about letters, for example "cat is to bat as dog is to bog". They use a similar layout but test completely different skills, so children must not apply meaning-based reasoning to a code question.`,
      },
      {
        q: `Why does my child keep getting word codes wrong even when they understand the rule?`,
        a: `Usually it is one of three slips: counting the alphabet jump incorrectly, confusing a reversal with a letter swap on short words, or being lured by an answer that fits a different rule. The fix is a habit, not more knowledge: define the rule precisely in words, then check the chosen answer by reversing the rule.`,
      },
      {
        q: `How can my child improve at word code analogies for the 11+?`,
        a: `Short, regular practice that builds the routine of naming the rule before choosing an answer is far more effective than occasional long sessions. Free PrepStep practice gives one question at a time in the real five-option format, with a worked explanation that states exactly what changed and where, so the method becomes automatic.`,
      },
    ],

    meta: {
      title:         `11+ Word Code Analogies Practice (GL Assessment) | PrepStep`,
      description:   `Free 11+ word code analogy practice for the GL Assessment. Spot the letter rule and apply it, five-option questions with worked explanations.`,
      ogTitle:       `11+ Word Code Analogies Practice (GL Assessment) | PrepStep`,
      ogDescription: `Free GL Assessment 11+ word code practice: letter-manipulation rules, five-option questions, worked explanations. Crack the code, ignore the meaning.`,
    },
  },

  // ── VR: NUMBER WORD CODES ────────────────────────────────────────────────────
  numberWordCodes: {
    subject:      'vr',
    subjectLabel: 'Verbal Reasoning',
    topicKey:     'numberWordCodes',
    slug:         'number-word-codes',
    topicLabel:   'Number Word Codes',
    canonical:    'https://prepstep.co.uk/practice/vr/number-word-codes',
    questionIds:  [126, 135, 137, 148, 152],

    intro: `Number word codes turn the GL Assessment 11+ Verbal Reasoning paper into a secret cipher. Each letter is given a number, and your child has to work out the hidden mapping from the clues provided, then use it to code a new word or decode a number back into letters. The catch that trips children up is that the numbers are assigned arbitrarily, never by alphabet position, so every question set has its own private code that must be deduced from scratch.

These questions sit among the coding and logic types in a GL Verbal Reasoning paper, with answers marked A to E on a separate answer sheet. Our research estimate, drawn from analysing GL practice papers, is that number and letter coding questions together make up somewhere around 8 to 12 per cent of a paper, though GL rotates its types and the exact share varies between sittings. When the type appears it usually comes as a short block, so getting the method right pays off several times in a row.

On this page your child practises the genuine article: a worked code such as "SPOT is 1234", a target to convert, and five tightly built options where the wrong answers are deliberately near misses. Every question is explained step by step, including how to build a letter-equals-number table and check the answer by substituting it back.`,

    topicBreakdown: {
      intro: `GL presents number word codes in a few recognisable shapes. GL does not publish exact frequencies, so the order below is our research estimate from practice papers, easier formats first:`,
      items: [
        `Direct coding (an explicit pair is given, such as "CAR is 312", and your child codes a rearranged word like ARC)`,
        `Letter-to-number lookup ("which number represents the letter U?" from a coded word)`,
        `Reverse and rearrange (code a word that uses the same letters in a different order)`,
        `Cross-referencing two codes (two coded words share letters, such as LAMP and PALM, and the overlap confirms each mapping)`,
        `Double-letter entry points (a repeated letter shows up as a repeated digit, the fastest way in)`,
        `Building a new word from combined letters (gather mappings from several words to code a fresh one)`,
        `Find the word (given a number code, decide which word it spells)`,
      ],
      footnote: `Difficulty rises from a single explicit pair on a three-letter word, through scrambled codes that need cross-referencing, up to longer words with no repeated letters where the wrong answers are simply the right digits in the wrong order.`,
    },

    pitfalls: [
      {
        lead: `Assuming the code follows the order of the word.`,
        tip:  `GL often scrambles the code so it does not line up with the letters left to right. Teach your child to match each letter to its number deliberately rather than reading straight across, especially when two coded words are given to cross-check.`,
      },
      {
        lead: `Being fooled by near-identical number options.`,
        tip:  `Wrong answers are frequently the correct digits in a slightly different order, such as 346 against 364. Your child should write out their answer digit by digit and compare each position, not just glance at the shape of the number.`,
      },
      {
        lead: `Decoding more of the word than the question needs.`,
        tip:  `There is no prize for cracking every letter. Train your child to find only the mappings for the letters in the target word, which saves time and reduces the chance of a copying slip.`,
      },
      {
        lead: `Forgetting to verify with a second clue.`,
        tip:  `When two coded words are supplied, the second one is a built-in checker. Encourage your child to confirm every mapping against both words before committing, since a value that fits one word may be contradicted by the other.`,
      },
    ],

    faq: [
      {
        q: `What are number word codes in the GL 11+ Verbal Reasoning exam?`,
        a: `They are questions where each letter of a word is given a number, and your child works out the hidden code from the clues, then uses it to write the code for a new word or to decode a number back into a word. The numbers are arbitrary, not based on alphabet position, so the mapping has to be deduced fresh for every question set.`,
      },
      {
        q: `How are number word codes tested in the GL 11+ exam?`,
        a: `Through multiple choice with five options (A to E) on a separate answer sheet. The questions ask in two directions: "what is the code for this word?" and "what letter does this number stand for?" They usually appear as a short block of the same type within the Verbal Reasoning paper.`,
      },
      {
        q: `How is this different from letter shift codes?`,
        a: `Letter shift codes move each letter a fixed number of places along the alphabet, so they are calculated. Number word codes use an arbitrary substitution that has to be deduced by cross-referencing the given words. They look similar on the page but use entirely different thinking, so it helps to know which one you are facing before you start.`,
      },
      {
        q: `What is the quickest way to crack a number word code?`,
        a: `Look first for a repeated letter that shows up as a repeated digit, because that pins a mapping instantly. After that, find letters shared between the given words and match them to the shared digits in the codes, building a small letter-equals-number table as you go. Then decode only the letters your target word actually needs.`,
      },
      {
        q: `How can my child improve at number word codes for the 11+?`,
        a: `Regular short practice that drills the build-a-table-and-check-it routine is what turns these from slow puzzles into reliable marks. Free PrepStep practice offers one coded set at a time in the real five-option format, with explanations that show the cross-referencing step by step, so the deduction habit sticks.`,
      },
    ],

    meta: {
      title:         `11+ Number Word Codes Practice (GL Assessment) | PrepStep`,
      description:   `Free 11+ number word code practice for the GL Assessment. Deduce the hidden letter-to-number code, five-option questions with worked explanations.`,
      ogTitle:       `11+ Number Word Codes Practice (GL Assessment) | PrepStep`,
      ogDescription: `Free GL Assessment 11+ number word code practice: crack the substitution cipher, five-option questions, step-by-step explanations.`,
    },
  },

  // ── VR: LOGIC AND LANGUAGE ───────────────────────────────────────────────────
  logicAndLanguage: {
    subject:      'vr',
    subjectLabel: 'Verbal Reasoning',
    topicKey:     'logicAndLanguage',
    slug:         'logic-and-language',
    topicLabel:   'Logic and Language',
    canonical:    'https://prepstep.co.uk/practice/vr/logic-and-language',
    questionIds:  [8, 4, 32, 19, 6],

    intro: `Logic and language questions ask your child to reason carefully with words rather than recall facts. A few short statements are given, and from them your child must work out who is tallest, what must be true, or which word completes a jumbled sentence. The reward goes to clear, step-by-step thinking, and the punishment goes to jumping at the answer that simply feels right.

This is an umbrella group within the GL Assessment 11+ Verbal Reasoning paper, covering ordering puzzles, logical deductions, sentence rearrangements and a sprinkling of rhyming-word and simple number puzzles. Everything is multiple choice with five options (A to E) on a separate answer sheet. Our research estimate, based on GL practice papers, is that reasoning questions of this family account for roughly 10 to 15 per cent of a paper, though GL varies the mix and not every sub-type appears every time. Notably, one of the five options is sometimes "Cannot tell", and knowing when that is the right answer is a genuine skill in itself.

On this page your child works through these puzzles one at a time, with explanations that model the method: order the people on a line, test whether a conclusion truly follows, or find the subject and verb before rebuilding a sentence. The aim is a calm, checkable routine rather than a lucky guess.`,

    topicBreakdown: {
      intro: `This heading gathers several reasoning sub-types. GL does not publish their relative frequency, so the order below is our research estimate from practice papers:`,
      items: [
        `Ordering puzzles (placing three to five people or things in sequence from comparison clues, such as tallest to shortest)`,
        `Simple syllogisms ("all dogs have four legs, Rover is a dog, therefore Rover has four legs")`,
        `Reverse syllogism traps ("all roses have thorns, this plant has thorns, is it a rose?", where the answer is no)`,
        `Sentence rearrangement (jumbled words to reorder, then name the first or last word)`,
        `Negation and "cannot tell" judgements (deciding what can and cannot be proven from the clues)`,
        `Rhyming-word puzzles (two short rhyming words that match a clue, such as "fat cat" for an overweight feline)`,
        `Short number reasoning (simple word problems woven into the verbal section)`,
      ],
      footnote: `Difficulty climbs from a three-person ordering with extreme positions, through four and five-person chains and reverse syllogisms, up to multi-step deductions where the correct answer is sometimes that nothing can be determined.`,
    },

    pitfalls: [
      {
        lead: `Falling for the reverse syllogism.`,
        tip:  `"All A are B" does not mean "all B are A". Holly and cacti have thorns without being roses. Teach your child to ask whether the conclusion absolutely must follow, not whether it sounds plausible.`,
      },
      {
        lead: `Tripping over direction words.`,
        tip:  `"Fewer", "shorter", "slower" and "younger" reverse the ordering, and a child running on autopilot reads them as their opposites. Encourage drawing a vertical line and placing each name on it as the clue is read.`,
      },
      {
        lead: `Refusing to choose "Cannot tell".`,
        tip:  `Children feel they must commit to a definite answer, so they reject "Cannot tell" even when the clues genuinely do not prove anything. Remind your child that "Cannot tell" is a real, correct option when nothing in the statements settles the question.`,
      },
      {
        lead: `Answering ordering questions for the wrong position.`,
        tip:  `GL often asks for the second or third in line rather than the first or last, which is where a half-built ranking gives a wrong answer. Tell your child to write out every name in order before reading off the one the question asks for.`,
      },
    ],

    faq: [
      {
        q: `What are logic and language questions in the GL 11+ Verbal Reasoning exam?`,
        a: `They are reasoning questions that give a few short statements and ask your child to deduce a conclusion: who is tallest, what must be true, or which word completes a rearranged sentence. They test careful, step-by-step thinking with words rather than memorised knowledge, and they sit within the GL Verbal Reasoning paper.`,
      },
      {
        q: `How are logic and language questions tested in the GL 11+ exam?`,
        a: `Through multiple choice with five options (A to E) on a separate answer sheet. The sub-types are mixed, so a child may move from an ordering puzzle to a syllogism to a jumbled sentence, and one of the options is sometimes "Cannot tell", which is occasionally the correct answer.`,
      },
      {
        q: `What is the most common trap in GL logic questions?`,
        a: `The reverse syllogism. Children read "all roses have thorns, this plant has thorns" and conclude the plant is a rose, but the statement does not say only roses have thorns. The cure is to ask "does this have to be true?" rather than "could this be true?", because logic questions reward only what is proven.`,
      },
      {
        q: `When is "Cannot tell" the right answer?`,
        a: `Whenever the statements do not give enough to prove a single answer. If a conclusion is merely likely rather than certain, "Cannot tell" is correct. Many children avoid it because it feels like giving up, so it is worth practising the judgement of when a puzzle genuinely has no determined answer.`,
      },
      {
        q: `How can my child improve at logic and language for the 11+?`,
        a: `Building a habit of slowing down, drawing a quick ordering line and testing whether a conclusion must follow is the key, and it comes from regular short practice rather than cramming. Free PrepStep practice presents one reasoning puzzle at a time with an explanation that models the method, so careful thinking becomes second nature.`,
      },
    ],

    meta: {
      title:         `11+ Logic and Language Practice (GL Assessment) | PrepStep`,
      description:   `Free 11+ logic and language practice for the GL Assessment. Ordering puzzles, syllogisms and sentence reasoning, five-option questions with explanations.`,
      ogTitle:       `11+ Logic and Language Practice (GL Assessment) | PrepStep`,
      ogDescription: `Free GL Assessment 11+ logic practice: ordering puzzles, syllogisms and "cannot tell" judgements, five-option questions with worked explanations.`,
    },
  },

  // ── VR: SHARED LETTER ────────────────────────────────────────────────────────
  sharedLetter: {
    subject:      'vr',
    subjectLabel: 'Verbal Reasoning',
    topicKey:     'sharedLetter',
    slug:         'shared-letter',
    topicLabel:   'Shared Letter',
    canonical:    'https://prepstep.co.uk/practice/vr/shared-letter',
    questionIds:  [6, 46, 54, 94, 14],

    intro: `Shared letter questions hand your child a small bridge-building puzzle. Two pairs of word fragments are shown with a gap in the middle of each, and a single letter has to slot into all of them at once. That letter ends the left fragment and begins the right one, so in "CA ( ? ) EN" and "BU ( ? ) ANK" the letter T builds CAT and TEN, then BUT and TANK. Four real words from one letter.

This type belongs to the GL Assessment 11+ Verbal Reasoning paper and rotates with the related missing-letter questions, so it does not appear in every single paper. When it does, it comes as a block of the same format, answered A to E on a separate answer sheet, choosing from five candidate letters. Our research estimate, from analysing GL practice papers, is that letter-completion questions of this kind make up around 5 to 8 per cent of a paper when present. The single biggest source of marks lost here is settling for a letter that works on one pair but quietly fails on the other.

On this page your child practises the exact layout, with the fragments stacked over two lines just as GL prints them, and five single-letter options to choose between. Every explanation spells out all four finished words, reinforcing the rule that the chosen letter must complete every one of them.`,

    topicBreakdown: {
      intro: `The format is fixed, but the challenge varies with the words and the letter. GL does not publish a breakdown, so the points below are our research estimate of what makes a shared letter question harder or easier:`,
      items: [
        `Common consonant answers (T, S, N and R complete the most word pairs and turn up most often in the easier questions)`,
        `Short fragments (two or three letters either side, which keep the resulting words familiar)`,
        `Less common letter answers (K, W, B and G, which fit fewer pairs and need more testing)`,
        `Vowel answers (A, E, I, O or U, harder to eliminate because several can seem to fit)`,
        `Restrictive fragments (an unusual cluster such as SK or QU, where very few letters can possibly work, a useful starting point)`,
        `Longer or less familiar resulting words, where a vocabulary gap can hide the right answer`,
      ],
      footnote: `Difficulty rises from common short words completed by an obvious consonant, up to uncommon vocabulary and vowel answers where a strong wrong option completes one pair perfectly but breaks the other.`,
    },

    pitfalls: [
      {
        lead: `Checking only one pair before committing.`,
        tip:  `A letter that builds both words in the first pair can still fail the second. Insist your child confirms all four words every time, because the correct answer is the one letter that satisfies every fragment.`,
      },
      {
        lead: `Overlooking vowel answers.`,
        tip:  `Children try T, S, N and R first and stop, but the answer is sometimes A, E, I, O or U. If no consonant works on all four words, your child should run through the vowels rather than assume they have misread the question.`,
      },
      {
        lead: `Accepting a near-word under time pressure.`,
        tip:  `In a hurry a child may accept something that looks almost right but is not a real word. Encourage a quick mental check that each of the four results is a genuine English word before moving on.`,
      },
      {
        lead: `Starting with the easiest fragment instead of the hardest.`,
        tip:  `The fastest route is to begin with the most restrictive fragment, the one where the fewest letters could possibly fit, and test that letter across all four words. Starting with an easy fragment lets too many candidates survive.`,
      },
    ],

    faq: [
      {
        q: `What are shared letter questions in the GL 11+ Verbal Reasoning exam?`,
        a: `They show two pairs of word fragments with a gap in each, and your child finds the single letter that completes all four words at once. The letter ends the first fragment of a pair and begins the second, so "CA ( ? ) EN" with the letter T makes CAT and TEN. The same letter must work for both pairs.`,
      },
      {
        q: `How are shared letter questions tested in the GL 11+ exam?`,
        a: `Through multiple choice with five single-letter options (A to E) on a separate answer sheet. The fragments are usually printed on two stacked lines. This type rotates with missing-letter questions in GL papers, so it does not appear every time, but when it does it comes as a block of the same format.`,
      },
      {
        q: `What is the difference between shared letter and missing letter questions?`,
        a: `A shared letter question uses one letter to complete two word pairs, creating four words. A missing letter question removes three consecutive letters from a single word, and those three letters must form a word of their own. They are related but distinct, so it helps your child to recognise which one they are looking at.`,
      },
      {
        q: `Which letters are most often the answer?`,
        a: `T, S, N and R complete the most word pairs and are worth trying first when a child is stuck. However, GL deliberately sets some questions where the answer is a less common consonant or a vowel, so trying the popular letters is a starting tactic, not a guarantee. Every answer still has to be checked against all four words.`,
      },
      {
        q: `How can my child improve at shared letter questions for the 11+?`,
        a: `The winning habit is to start with the most restrictive fragment and then verify all four words before choosing, and that habit grows with regular short practice. Free PrepStep practice presents the questions in the real stacked format with explanations that name all four finished words, so the check-everything routine becomes automatic.`,
      },
    ],

    meta: {
      title:         `11+ Shared Letter Practice (GL Assessment) | PrepStep`,
      description:   `Free 11+ shared letter practice for the GL Assessment. Find the one letter that completes both word pairs, five-option questions with explanations.`,
      ogTitle:       `11+ Shared Letter Practice (GL Assessment) | PrepStep`,
      ogDescription: `Free GL Assessment 11+ shared letter practice: one letter, four words, five options. Worked explanations that check every word.`,
    },
  },

  // ── VR: BALANCE EQUATIONS ────────────────────────────────────────────────────
  balanceEquations: {
    subject:      'vr',
    subjectLabel: 'Verbal Reasoning',
    topicKey:     'balanceEquations',
    slug:         'balance-equations',
    topicLabel:   'Balance Equations',
    canonical:    'https://prepstep.co.uk/practice/vr/balance-equations',
    questionIds:  [1, 5, 11, 14, 21],

    intro: `Balance equation questions bring a flash of arithmetic into the GL Assessment 11+ Verbal Reasoning paper. Your child is given a sum with a missing number inside brackets, and they have to work out the value that makes both sides equal. A question such as "9 + 6 = 5 times the gap" is solved by finding the left side, which is 15, then asking what times 5 makes 15, which is 3.

This is part of the numerical reasoning strand that GL threads through Verbal Reasoning. GL does not label this exact type by name, so we group it, in our research, with the number-based VR questions, and our estimate from analysing practice papers is that numerical reasoning of this kind accounts for somewhere around 8 to 12 per cent of a paper. As with everything else in the paper, answers are multiple choice with five options (A to E) on a separate answer sheet. The mental skill being tested is solid: read both sides, calculate the fixed side, then reverse the remaining operation to find the gap.

On this page your child practises the genuine format, with the equation laid out clearly and five number options to choose from. Each explanation follows the same dependable three steps: work out the side you can, restate the equation, then solve the small piece that remains. Where the harder questions need the order of operations, the explanation makes the BODMAS step explicit.`,

    topicBreakdown: {
      intro: `These questions stay within familiar arithmetic, but the demands grow. GL does not publish a breakdown, so the points below are our research estimate of what raises the difficulty:`,
      items: [
        `Single-operation balances (one calculation on each side, such as "12 minus 4 equals 2 times the gap")`,
        `The four operations (addition, subtraction, multiplication and division all appear on either side)`,
        `Missing number on the right (the bracket sits after the operator, as in "equals 5 times the gap")`,
        `Missing number on the left (the bracket comes first, as in "the gap plus 2 equals 7")`,
        `Order of operations (BODMAS), where one side has two steps and the multiply or divide must be done first`,
        `Larger numbers and tighter answer options that punish a careless calculation`,
      ],
      footnote: `Difficulty rises from a single operation on each side with small numbers, up to two-step sides that require BODMAS, where doing the operations in the wrong order produces a tempting but wrong answer.`,
    },

    pitfalls: [
      {
        lead: `Ignoring the order of operations.`,
        tip:  `When one side has two steps, such as "30 divided by 5 plus 12", the multiply or divide must come before the add or subtract. Teach your child to underline the multiply or divide and do it first, because working left to right gives the wrong total.`,
      },
      {
        lead: `Solving the wrong side first.`,
        tip:  `The smart move is to fully calculate the side that has no missing number, then balance against it. A child who tries to work with the bracketed side first often gets tangled. Find the fixed value, then reverse the operation to fill the gap.`,
      },
      {
        lead: `Choosing the value of the fixed side instead of the gap.`,
        tip:  `If the left side comes to 15, a child may pick 15 from the options rather than the number that goes in the bracket. The fixed total is usually planted among the choices as a trap, so your child must answer the actual question, which is the missing number.`,
      },
      {
        lead: `Rushing the final reverse step.`,
        tip:  `Once the equation reads, for example, "15 equals 5 times the gap", the answer is found by dividing, not multiplying. Encourage your child to say the reverse step in words ("what times 5 makes 15?") so the right operation is obvious.`,
      },
    ],

    faq: [
      {
        q: `What are balance equation questions in the GL 11+ Verbal Reasoning exam?`,
        a: `They are arithmetic questions with a missing number inside brackets, where your child finds the value that makes both sides of the equation equal. For example, "9 + 6 = 5 times the gap" is solved by working out 15, then finding what times 5 makes 15, which is 3. They test mental calculation and the order of operations within the numerical part of Verbal Reasoning.`,
      },
      {
        q: `How are balance equations tested in the GL 11+ exam?`,
        a: `Through multiple choice with five number options (A to E) on a separate answer sheet. The equation is printed clearly with the gap shown in brackets, and the missing number can sit on either side. Harder questions place two operations on one side, so the order of operations matters.`,
      },
      {
        q: `Do these questions need BODMAS?`,
        a: `The harder ones do. When one side has two steps, such as "20 minus 2 times 7", the multiplication is done before the subtraction, giving 6 rather than 126. Getting the order right is the single most common dividing line between a correct and an incorrect answer on the tougher balance equations.`,
      },
      {
        q: `Why does my child pick the wrong option when their working is right?`,
        a: `Most often they answer with the value of the fixed side instead of the missing number in the bracket, because that total is usually planted among the choices. The remedy is to reread the question after calculating and confirm they are giving the number that fills the gap, not the side they worked out on the way.`,
      },
      {
        q: `How can my child improve at balance equations for the 11+?`,
        a: `A steady three-step routine, calculate the fixed side, restate the equation, then reverse the last operation, makes these reliable marks, and it is built through regular short practice rather than occasional bursts. Free PrepStep practice gives one equation at a time with five options and an explanation that walks through each step, including the BODMAS move where it is needed.`,
      },
    ],

    meta: {
      title:         `11+ Balance Equations Practice (GL Assessment) | PrepStep`,
      description:   `Free 11+ balance equation practice for the GL Assessment. Find the missing number that makes both sides equal, five-option questions with explanations.`,
      ogTitle:       `11+ Balance Equations Practice (GL Assessment) | PrepStep`,
      ogDescription: `Free GL Assessment 11+ balance equation practice: numerical reasoning with BODMAS, five-option questions and step-by-step explanations.`,
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

/** Return the English word for small counts (1–10), otherwise the digit string. */
function numberWord(n) {
  const words = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
  return (n >= 1 && n <= 10) ? words[n] : String(n);
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
 * Dispatches to a specialised renderer for non-standard question shapes.
 */
function renderQuestionCard(q, index) {
  // Dispatch by question shape
  if (q.questionType === 'passage')       return renderPassageCard(q, index);
  if (q.questionType === 'error-spotting') return renderErrorSpottingCard(q, index);
  if (q.questionType === 'pick-from-sets') return renderPickFromSetsCard(q, index);
  if (q.questionType === 'select-two')     return renderSelectTwoCard(q, index);

  // Standard 5-option MC (incl. 'letter-codes' which is standard+optional visual)
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
      <p class="q-card__stem">${escHtml(q.question).replace(/\n/g, '<br>')}</p>
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
 * Render a passage (comprehension) question card.
 * Shape: { id, difficulty, questionType:'passage', passageId, passageTitle,
 *          passage (string with \n\n paragraph breaks), question, options[5],
 *          correct (0-indexed), explanation }
 */
function renderPassageCard(q, index) {
  const passTitleHtml = q.passageTitle
    ? `<p class="q-passage__title">${escHtml(q.passageTitle)}</p>`
    : '';

  const passageParagraphsHtml = (q.passage || '')
    .split(/\n\n+/)
    .map(para => `<p>${escHtml(para.trim())}</p>`)
    .join('\n        ');

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
      <div class="q-passage">
        ${passTitleHtml}
        ${passageParagraphsHtml}
      </div>
      <p class="q-card__stem">${escHtml(q.question).replace(/\n/g, '<br>')}</p>
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
 * Render an error-spotting question card.
 * Shape: { id, difficulty, questionType:'error-spotting', question, segments[4],
 *          options[5] (Section A/B/C/D/No mistake), correct (0-3 = that section;
 *          4 = no mistake), explanation }
 */
function renderErrorSpottingCard(q, index) {
  const SEGMENT_LETTERS = ['A', 'B', 'C', 'D'];
  const segmentsHtml = (q.segments || []).map((seg, i) => {
    const isError = i === q.correct;
    return `<span class="q-segment${isError ? ' seg--error' : ''}"><sup class="q-segment__label">${SEGMENT_LETTERS[i]}</sup>${escHtml(seg)}</span>`;
  }).join(' ');

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
      <p class="q-card__stem">${escHtml(q.question).replace(/\n/g, '<br>')}</p>
      <div class="q-segments">
        ${segmentsHtml}
      </div>
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
 * Render a pick-from-sets question card.
 * Shape: { id, difficulty, questionType:'pick-from-sets', question,
 *          setA[3], setB[3], correctPair [indexA, indexB], explanation }
 * No `options` / `correct` fields — answer is the pair from each group.
 */
function renderPickFromSetsCard(q, index) {
  const correctA = Array.isArray(q.correctPair) ? q.correctPair[0] : -1;
  const correctB = Array.isArray(q.correctPair) ? q.correctPair[1] : -1;

  const setAHtml = (q.setA || []).map((word, i) =>
    `<span class="set-word${i === correctA ? ' set-word--correct' : ''}">${escHtml(word)}</span>`
  ).join('\n          ');

  const setBHtml = (q.setB || []).map((word, i) =>
    `<span class="set-word${i === correctB ? ' set-word--correct' : ''}">${escHtml(word)}</span>`
  ).join('\n          ');

  return `<article class="q-card" aria-label="Sample question ${index + 1}">
      <header class="q-card__header">
        <span class="q-card__num">Question ${index + 1}</span>
        <span class="diff-pill ${DIFFICULTY_CLASS[q.difficulty]}" aria-label="Difficulty: ${DIFFICULTY_LABEL[q.difficulty]}">${DIFFICULTY_LABEL[q.difficulty]}</span>
      </header>
      <p class="q-card__stem">${escHtml(q.question).replace(/\n/g, '<br>')}</p>
      <div class="q-sets">
        <div class="q-set">
          <p class="q-set__label">Group A</p>
          <div class="q-set__words">
          ${setAHtml}
          </div>
        </div>
        <div class="q-set">
          <p class="q-set__label q-set__label--b">Group B</p>
          <div class="q-set__words">
          ${setBHtml}
          </div>
        </div>
      </div>
      <details class="q-explanation">
        <summary class="q-explanation__toggle">Show worked explanation</summary>
        <div class="q-explanation__body">
          <p>${escHtml(q.explanation)}</p>
        </div>
      </details>
    </article>`;
}

/**
 * Render a select-two question card.
 * Shape: { id, difficulty, questionType:'select-two', question,
 *          options[5], correctPair [indexI, indexJ], explanation }
 * Two correct answers from the five options.
 */
function renderSelectTwoCard(q, index) {
  const correctPair = Array.isArray(q.correctPair) ? q.correctPair : [];

  const optionsHtml = (q.options || []).map((opt, i) => {
    const isCorrect = correctPair.includes(i);
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
      <p class="q-card__stem">${escHtml(q.question).replace(/\n/g, '<br>')}</p>
      <p class="q-select-two-hint">Select the two correct answers.</p>
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
function buildCss(subject) {
  const vrCss = subject === 'vr' ? `
/* ── Pick-from-sets questions ─────────────────────────────────────── */
.q-sets{
  margin:0 1.25rem 0.85rem;
  display:flex;
  flex-direction:column;
  gap:0.85rem;
}
.q-set{
  background:var(--surface-alt);
  border:1px solid var(--border-subtle);
  border-radius:0.75rem;
  padding:0.85rem 1.25rem;
}
.q-set__label{
  font-size:0.8rem;
  font-weight:700;
  color:var(--primary);
  text-transform:uppercase;
  letter-spacing:0.05em;
  margin-bottom:0.6rem;
}
.q-set__label--b{color:#4338CA}
.q-set__words{
  display:flex;
  flex-wrap:wrap;
  gap:0.5rem;
}
.set-word{
  display:inline-block;
  padding:0.3rem 0.75rem;
  background:#F3F4F6;
  border:1px solid var(--border-subtle);
  border-radius:0.5rem;
  font-size:0.95rem;
  color:var(--text);
}
.set-word--correct{
  background:#DCFCE7;
  border-color:#4ADE80;
  color:#14532D;
  font-weight:700;
}

/* ── Select-two questions ──────────────────────────────────────────── */
.q-select-two-hint{
  margin:0 1.25rem 0.5rem;
  font-size:0.8rem;
  color:var(--text-secondary);
  font-style:italic;
}
` : '';

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

/* ── Passage questions ─────────────────────────────────────────────── */
.q-passage{
  margin:0 1.25rem 0.85rem;
  background:var(--surface-alt);
  border:1px solid var(--border-subtle);
  border-left:3px solid var(--primary-light);
  border-radius:0.75rem;
  padding:1rem 1.25rem;
}
.q-passage__title{
  font-size:0.8rem;
  font-weight:700;
  color:var(--primary);
  text-transform:uppercase;
  letter-spacing:0.05em;
  margin-bottom:0.6rem;
}
.q-passage p{
  font-size:0.9rem;
  color:var(--text-secondary);
  line-height:1.7;
}
.q-passage p+p{margin-top:0.6rem}

/* ── Error-spotting segments ──────────────────────────────────────── */
.q-segments{
  margin:0 1.25rem 0.85rem;
  background:var(--surface-alt);
  border:1px solid var(--border-subtle);
  border-radius:0.75rem;
  padding:0.85rem 1.25rem;
  font-size:0.975rem;
  line-height:2;
  color:var(--text);
}
.q-segment{display:inline}
.q-segment__label{
  font-size:0.65rem;
  font-weight:700;
  color:var(--primary);
  vertical-align:super;
  margin-right:0.1rem;
}
.seg--error{
  background:rgba(239,68,68,0.1);
  border-bottom:2px solid #EF4444;
  border-radius:2px;
  padding:0 2px;
}
.seg--error .q-segment__label{color:#DC2626}

/* ── Responsive ────────────────────────────────────────────────────── */
@media(max-width:480px){
  .hero__cta{display:block;text-align:center}
  .site-header__cta{display:none}
}
`.trim() + vrCss;
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
  // English topics
  comprehension:       'Passage-based reading: retrieval, inference, vocabulary in context and author\'s language',
  vocabulary:          'Synonyms, antonyms, words in context and figurative language across English and VR',
  grammar:             'Verb tenses, homophones in context, agreement and connectives in cloze format',
  wordClassGrammar:    'Identifying nouns, verbs, adjectives, adverbs and prepositions from context',
  spelling:            'Error-spotting across four labelled sections plus "No mistake" option',
  punctuation:         'Apostrophes, commas, speech marks and sentence punctuation in error-spotting format',
  // VR topics
  synonyms:            'Choose the pair of words, one from each group, that are closest in meaning',
  antonyms:            'Choose the pair of words, one from each group, that are most opposite in meaning',
  verbalAnalogies:     '"A is to B as C is to ?" — complete the analogy by choosing one word from each group',
  oddTwoOut:           'Five words: find the two that do not belong once the group of three is spotted',
  compoundWords:       'Build a compound word by linking, bridging or joining two halves together',
  hiddenWords:         'Find the four-letter word hidden across the join between two adjacent words',
  letterMove:          'Move one letter from one word to another so that both become new real words',
  missingLettersWords: 'Restore the three missing letters that complete both the gap and a word of their own',
  letterCodes:         'Crack the alphabet-shift rule from the example, then encode or decode a new word',
  letterPairSeries:    'Two patterns run side by side — find the next pair in the sequence',
  numberSeries:        'Work out the number rule and give the next term in the sequence',
  letterSums:          'Each letter equals its alphabet position (A=1 … Z=26) — calculate the value or compare',
  wordCodeAnalogies:   'Spot the letter-manipulation rule from the example, then apply it to a new word',
  numberWordCodes:     'Deduce the private letter-to-number substitution, then code or decode a word',
  logicAndLanguage:    'Ordering, syllogisms, sentence rearrangement and "cannot tell" reasoning',
  sharedLetter:        'One letter ends the left fragment and starts the right — find it for both pairs at once',
  balanceEquations:    'Find the missing number that makes both sides of the equation equal',
};

// Display order for the maths hub topic grid
const MATHS_TOPIC_ORDER = [
  'percentages', 'decimals', 'placevalue', 'fractions',
  'longdivision', 'longmultiplication', 'algebra', 'ratio',
  'negativenumbers', 'primenumbersfactors', 'areaperimeter', 'volume',
  'anglesshapes', 'sequences', 'datahandling', 'speeddistancetime',
];

// Display order for the English hub topic grid
const ENGLISH_TOPIC_ORDER = [
  'comprehension', 'vocabulary', 'grammar', 'wordClassGrammar', 'spelling', 'punctuation',
];

// Display order for the VR hub topic grid
const VR_TOPIC_ORDER = [
  'synonyms', 'antonyms', 'verbalAnalogies', 'oddTwoOut',
  'compoundWords', 'hiddenWords', 'letterMove', 'missingLettersWords',
  'letterCodes', 'letterPairSeries', 'numberSeries', 'letterSums',
  'wordCodeAnalogies', 'numberWordCodes', 'logicAndLanguage', 'sharedLetter',
  'balanceEquations',
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

// ── 9. English hub page builder ───────────────────────────────────────────────

function buildEnglishHubPage() {
  const canonical    = 'https://prepstep.co.uk/practice/english';
  const year         = new Date().getFullYear();
  const dateModified = new Date().toISOString().slice(0, 10);
  const title        = '11+ English Practice Questions (GL Assessment) | PrepStep';
  const description  = 'Free GL Assessment 11+ English practice questions across all 6 topics: comprehension, vocabulary, grammar, spelling, punctuation and word classes. Five-option multiple-choice format with worked explanations, built for Year 5 and Year 6.';
  const ogTitle      = '11+ English Practice (GL Assessment) | PrepStep';
  const ogDescription = 'Free GL Assessment 11+ English practice across all 6 topics. Five-option multiple-choice format with worked explanations, built for Year 5 and Year 6 preparation.';

  const topicCardsHtml = ENGLISH_TOPIC_ORDER.map(key => {
    const cfg  = TOPICS_CONFIG[key];
    const slug = cfg.slug || key;
    const desc = TOPIC_DESCRIPTORS[key] || '';
    return `<a class="topic-card" href="/practice/english/${slug}" aria-label="${escHtml(cfg.topicLabel)} practice questions">
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
      { '@type': 'ListItem', position: 3, name: 'English',  item: canonical },
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
    hasPart: ENGLISH_TOPIC_ORDER.map(key => ({
      '@type': 'WebPage',
      name:    `${TOPICS_CONFIG[key].topicLabel} 11+ Practice (GL Assessment)`,
      url:     `https://prepstep.co.uk/practice/english/${TOPICS_CONFIG[key].slug || key}`,
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
        <span aria-current="page">English</span>
      </nav>

      <!-- Hero -->
      <section class="hero" aria-labelledby="hero-heading">
        <p class="hero__eyebrow" aria-hidden="true">GL Assessment &middot; 11+ Practice</p>
        <h1 id="hero-heading">11+ <em>English</em> Practice<br>(GL Assessment)</h1>
        <div class="hub-intro">
          <p>Free practice questions for all 6 English topics tested in the GL Assessment 11+, in the real five-option multiple-choice format with worked explanations. The GL English paper is 45 minutes with around 49 questions covering comprehension, vocabulary, grammar, spelling and punctuation.</p>
          <p>Choose any topic below to see sample questions, a GL topic guide, and the common mistakes children make under exam pressure. All content is built for Year 5 and Year 6 preparation, covering difficulty levels from Foundation to Challenging.</p>
        </div>
        <a href="/" class="hero__cta">
          Start practising free
          <span class="hero__cta-sub">All 6 English topics &middot; No sign-up needed</span>
        </a>
      </section>

      <!-- Topic grid -->
      <section class="content-section" aria-labelledby="topics-heading">
        <p class="section-label" aria-hidden="true">
          <span>All English topics</span>
          <span class="section-label__line"></span>
        </p>
        <h2 class="section-heading" id="topics-heading">All 6 GL Assessment English Topics</h2>
        <p class="skills-intro">Each topic has sample questions, a GL exam guide, and common mistakes to avoid. Click any topic to practise.</p>
        <nav aria-label="English practice topics" class="topic-grid">
          ${topicCardsHtml}
        </nav>
      </section>

    </div><!-- /page-wrap -->

    <!-- Closing CTA band -->
    <section class="cta-band" aria-labelledby="cta-hub-heading">
      <h2 id="cta-hub-heading">Ready to start practising?</h2>
      <p class="cta-band__sub">
        PrepStep has over 2,400 English questions in GL Assessment format:
        comprehension passages, error-spotting, gap-fill and more. Free to start.
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

// ── 10. VR hub page builder ───────────────────────────────────────────────────

function buildVrHubPage() {
  const canonical    = 'https://prepstep.co.uk/practice/vr';
  const year         = new Date().getFullYear();
  const dateModified = new Date().toISOString().slice(0, 10);
  const title        = '11+ Verbal Reasoning Practice Questions (GL Assessment) | PrepStep';
  const description  = 'Free GL Assessment 11+ Verbal Reasoning practice questions across all 17 topics: synonyms, antonyms, analogies, codes, sequences and more. Five-option multiple-choice format with worked explanations, built for Year 5 and Year 6.';
  const ogTitle      = '11+ Verbal Reasoning Practice (GL Assessment) | PrepStep';
  const ogDescription = 'Free GL Assessment 11+ Verbal Reasoning practice across all 17 topics. Five-option multiple-choice format with worked explanations, built for Year 5 and Year 6 preparation.';

  const topicCardsHtml = VR_TOPIC_ORDER.map(key => {
    const cfg  = TOPICS_CONFIG[key];
    const slug = cfg.slug || key;
    const desc = TOPIC_DESCRIPTORS[key] || '';
    return `<a class="topic-card" href="/practice/vr/${slug}" aria-label="${escHtml(cfg.topicLabel)} practice questions">
          <p class="topic-card__label">${escHtml(cfg.topicLabel)}</p>
          <p class="topic-card__desc">${escHtml(desc)}</p>
        </a>`;
  }).join('\n        ');

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',              item: 'https://prepstep.co.uk' },
      { '@type': 'ListItem', position: 2, name: 'Practice',          item: 'https://prepstep.co.uk/practice' },
      { '@type': 'ListItem', position: 3, name: 'Verbal Reasoning',  item: canonical },
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
    hasPart: VR_TOPIC_ORDER.map(key => ({
      '@type': 'WebPage',
      name:    `${TOPICS_CONFIG[key].topicLabel} 11+ Practice (GL Assessment)`,
      url:     `https://prepstep.co.uk/practice/vr/${TOPICS_CONFIG[key].slug || key}`,
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
        <span aria-current="page">Verbal Reasoning</span>
      </nav>

      <!-- Hero -->
      <section class="hero" aria-labelledby="hero-heading">
        <p class="hero__eyebrow" aria-hidden="true">GL Assessment &middot; 11+ Practice</p>
        <h1 id="hero-heading">11+ <em>Verbal Reasoning</em> Practice<br>(GL Assessment)</h1>
        <div class="hub-intro">
          <p>Free practice questions for all 17 Verbal Reasoning topics tested in the GL Assessment 11+, in the real five-option multiple-choice format with worked explanations. GL Verbal Reasoning papers run at roughly 80 questions in 50 to 60 minutes, covering codes, sequences, analogies, word patterns and logical reasoning.</p>
          <p>Choose any topic below to see sample questions, a GL topic guide, and the common mistakes children make under exam pressure. All content is built for Year 5 and Year 6 preparation, covering difficulty levels from Foundation to Challenging.</p>
        </div>
        <a href="/" class="hero__cta">
          Start practising free
          <span class="hero__cta-sub">All 17 Verbal Reasoning topics &middot; No sign-up needed</span>
        </a>
      </section>

      <!-- Topic grid -->
      <section class="content-section" aria-labelledby="topics-heading">
        <p class="section-label" aria-hidden="true">
          <span>All Verbal Reasoning topics</span>
          <span class="section-label__line"></span>
        </p>
        <h2 class="section-heading" id="topics-heading">All 17 GL Assessment Verbal Reasoning Topics</h2>
        <p class="skills-intro">Each topic has sample questions, a GL exam guide, and common mistakes to avoid. Click any topic to practise.</p>
        <nav aria-label="Verbal Reasoning practice topics" class="topic-grid">
          ${topicCardsHtml}
        </nav>
      </section>

    </div><!-- /page-wrap -->

    <!-- Closing CTA band -->
    <section class="cta-band" aria-labelledby="cta-hub-heading">
      <h2 id="cta-hub-heading">Ready to start practising?</h2>
      <p class="cta-band__sub">
        PrepStep has over 2,300 Verbal Reasoning questions in GL Assessment format:
        codes, analogies, sequences, hidden words and more. Free to start.
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

// ── 11. Practice hub page builder ─────────────────────────────────────────────

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
      {
        '@type': 'WebPage',
        name:    '11+ English Practice (GL Assessment)',
        url:     'https://prepstep.co.uk/practice/english',
      },
      {
        '@type': 'WebPage',
        name:    '11+ Verbal Reasoning Practice (GL Assessment)',
        url:     'https://prepstep.co.uk/practice/vr',
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
        <p class="skills-intro">GL Assessment 11+ papers cover three subjects. Maths, English and Verbal Reasoning practice are all available now.</p>
        <div class="subject-grid">

          <!-- Maths (live) -->
          <a class="subject-card" href="/practice/maths" aria-label="11+ Maths practice questions">
            <p class="subject-card__eyebrow subject-card__eyebrow--maths">Maths</p>
            <h3 class="subject-card__title">11+ Maths</h3>
            <p class="subject-card__desc">All 16 GL Assessment maths topics: Number, Algebra, Geometry, Measurement and Statistics. Five-option questions with worked explanations.</p>
            <span class="subject-card__badge subject-card__badge--live">Live &middot; 16 topics</span>
          </a>

          <!-- English (live) -->
          <a class="subject-card" href="/practice/english" aria-label="11+ English practice questions">
            <p class="subject-card__eyebrow subject-card__eyebrow--english">English</p>
            <h3 class="subject-card__title">11+ English</h3>
            <p class="subject-card__desc">Comprehension, vocabulary, grammar, spelling and punctuation in GL Assessment format. Worked explanations for every question.</p>
            <span class="subject-card__badge subject-card__badge--live">Live &middot; 6 topics</span>
          </a>

          <!-- Verbal Reasoning (live) -->
          <a class="subject-card" href="/practice/vr" aria-label="11+ Verbal Reasoning practice questions">
            <p class="subject-card__eyebrow subject-card__eyebrow--vr">Verbal Reasoning</p>
            <h3 class="subject-card__title">11+ Verbal Reasoning</h3>
            <p class="subject-card__desc">All GL Assessment VR question types: codes, analogies, word patterns, missing letters and more. Five-option format with full explanations.</p>
            <span class="subject-card__badge subject-card__badge--live">Live &middot; 17 topics</span>
          </a>

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

  // All public URLs in priority order (44 total: root + /practice + /practice/maths + 16 maths topics + /practice/english + 6 English topics + /practice/vr + 17 VR topics)
  const urls = [
    { loc: 'https://prepstep.co.uk/',                priority: '1.0', freq: 'daily'  },
    { loc: 'https://prepstep.co.uk/practice',         priority: '0.9', freq: 'weekly' },
    { loc: 'https://prepstep.co.uk/practice/maths',   priority: '0.9', freq: 'weekly' },
    ...MATHS_TOPIC_ORDER.map(key => ({
      loc:      `https://prepstep.co.uk/practice/maths/${key}`,
      priority: '0.8',
      freq:     'weekly',
    })),
    { loc: 'https://prepstep.co.uk/practice/english', priority: '0.9', freq: 'weekly' },
    ...ENGLISH_TOPIC_ORDER.map(key => ({
      loc:      `https://prepstep.co.uk/practice/english/${TOPICS_CONFIG[key].slug || key}`,
      priority: '0.8',
      freq:     'weekly',
    })),
    { loc: 'https://prepstep.co.uk/practice/vr',      priority: '0.9', freq: 'weekly' },
    ...VR_TOPIC_ORDER.map(key => ({
      loc:      `https://prepstep.co.uk/practice/vr/${TOPICS_CONFIG[key].slug || key}`,
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
  const dataset = DATASETS[config.subject];
  if (!dataset) {
    throw new Error(`Subject '${config.subject}' not found in DATASETS (valid subjects: ${Object.keys(DATASETS).join(', ')})`);
  }
  const topicData = dataset.topics[config.topicKey];
  if (!topicData) {
    throw new Error(`Topic '${config.topicKey}' not found in ${config.subject}Data`);
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

  // Build the sample-questions intro copy, count-aware
  const questionsIntroHtml = questions.length === 1
    ? `Read the passage below, then try the question. Tap &ldquo;Show worked explanation&rdquo; to see the full method, and the correct answer is highlighted so you can check as you go.`
    : `${numberWord(questions.length)} questions drawn from PrepStep&rsquo;s ${escHtml(config.topicLabel.toLowerCase())} bank, spanning Foundation to Challenging.
          Tap &ldquo;Show worked explanation&rdquo; to see the full method after you&rsquo;ve had a go.
          The correct answer is highlighted on each question so you can check immediately.`;

  const jsonLd = buildJsonLd(config, questions);
  const css    = buildCss(config.subject);
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
        <p class="hero__eyebrow" aria-hidden="true">GL Assessment &middot; 11+ ${escHtml(config.subjectLabel)}</p>
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
          ${questionsIntroHtml}
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
const positionalArgs = args.filter(a => !a.startsWith('--'));
const topicsToGenerate = generateAll
  ? Object.keys(TOPICS_CONFIG)
  : (positionalArgs.length ? positionalArgs : ['fractions']);

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
  const outPath = path.join(outDir, `${config.slug || config.topicKey}.html`);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outPath, result.html, 'utf8');
  console.log(`  Wrote: ${outPath}`);

  // ── Verification ────────────────────────────────────────────────────────────
  const written = fs.readFileSync(outPath, 'utf8');

  const checks = {
    'Q text in raw HTML':    (() => {
      // Use the longest line before any newline (newlines become <br> in HTML)
      const qText = result.questions[0].question;
      const firstLine = qText.split('\n').map(s => s.trim()).filter(Boolean)[0] || qText.substring(0, 30);
      return written.includes(firstLine.substring(0, 30));
    })(),
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

  // English hub
  console.log('\nBuilding: English hub (public/practice/english/index.html)');
  const englishHubHtml = buildEnglishHubPage();
  const englishHubDir  = path.join(ROOT, 'public/practice/english');
  const englishHubPath = path.join(englishHubDir, 'index.html');
  fs.mkdirSync(englishHubDir, { recursive: true });
  fs.writeFileSync(englishHubPath, englishHubHtml, 'utf8');
  const englishHubCheck = fs.readFileSync(englishHubPath, 'utf8');
  const englishTopicLinks = (englishHubCheck.match(/href="\/practice\/english\/[a-z-]+"/g) || []).length;
  const englishJsonLdValid = (() => {
    const m = englishHubCheck.match(/<script type="application\/ld\+json">([\s\S]+?)<\/script>/);
    if (!m) return false;
    try { JSON.parse(m[1]); return true; } catch { return false; }
  })();
  console.log(`  Wrote: ${englishHubPath} (${(englishHubCheck.length / 1024).toFixed(1)} KB)`);
  console.log(`  [${englishJsonLdValid ? 'PASS' : 'FAIL'}] JSON-LD valid`);
  console.log(`  [${englishHubCheck.includes('"BreadcrumbList"') ? 'PASS' : 'FAIL'}] BreadcrumbList in JSON-LD`);
  console.log(`  [${englishHubCheck.includes('"CollectionPage"') ? 'PASS' : 'FAIL'}] CollectionPage in JSON-LD`);
  console.log(`  [${englishTopicLinks === 6 ? 'PASS' : 'FAIL'}] Topic links: ${englishTopicLinks} (expected 6)`);
  console.log(`  [${englishHubCheck.includes('skip-link') ? 'PASS' : 'FAIL'}] Skip link present`);
  console.log(`  [${!englishHubCheck.match(/<link[^>]+stylesheet[^>]+https?:\/\//) ? 'PASS' : 'FAIL'}] No external CSS`);

  // VR hub
  console.log('\nBuilding: VR hub (public/practice/vr/index.html)');
  const vrHubHtml = buildVrHubPage();
  const vrHubDir  = path.join(ROOT, 'public/practice/vr');
  const vrHubPath = path.join(vrHubDir, 'index.html');
  fs.mkdirSync(vrHubDir, { recursive: true });
  fs.writeFileSync(vrHubPath, vrHubHtml, 'utf8');
  const vrHubCheck = fs.readFileSync(vrHubPath, 'utf8');
  const vrTopicLinks = (vrHubCheck.match(/href="\/practice\/vr\/[a-z-]+"/g) || []).length;
  const vrJsonLdValid = (() => {
    const m = vrHubCheck.match(/<script type="application\/ld\+json">([\s\S]+?)<\/script>/);
    if (!m) return false;
    try { JSON.parse(m[1]); return true; } catch { return false; }
  })();
  console.log(`  Wrote: ${vrHubPath} (${(vrHubCheck.length / 1024).toFixed(1)} KB)`);
  console.log(`  [${vrJsonLdValid ? 'PASS' : 'FAIL'}] JSON-LD valid`);
  console.log(`  [${vrHubCheck.includes('"BreadcrumbList"') ? 'PASS' : 'FAIL'}] BreadcrumbList in JSON-LD`);
  console.log(`  [${vrHubCheck.includes('"CollectionPage"') ? 'PASS' : 'FAIL'}] CollectionPage in JSON-LD`);
  console.log(`  [${vrTopicLinks === 17 ? 'PASS' : 'FAIL'}] Topic links: ${vrTopicLinks} (expected 17)`);
  console.log(`  [${vrHubCheck.includes('skip-link') ? 'PASS' : 'FAIL'}] Skip link present`);
  console.log(`  [${!vrHubCheck.match(/<link[^>]+stylesheet[^>]+https?:\/\//) ? 'PASS' : 'FAIL'}] No external CSS`);

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
  // Count only HTML card elements (not the CSS class definitions which also contain the string)
  const comingSoonCards = (practiceHubCheck.match(/class="subject-card subject-card--disabled"/g) || []).length;
  console.log(`  Wrote: ${practiceHubPath} (${(practiceHubCheck.length / 1024).toFixed(1)} KB)`);
  console.log(`  [${practiceJsonLdValid ? 'PASS' : 'FAIL'}] JSON-LD valid`);
  console.log(`  [${practiceHubCheck.includes('"BreadcrumbList"') ? 'PASS' : 'FAIL'}] BreadcrumbList in JSON-LD`);
  console.log(`  [${practiceHubCheck.includes('href="/practice/maths"') ? 'PASS' : 'FAIL'}] Maths card links to /practice/maths`);
  console.log(`  [${practiceHubCheck.includes('href="/practice/english"') ? 'PASS' : 'FAIL'}] English card links to /practice/english`);
  console.log(`  [${practiceHubCheck.includes('href="/practice/vr"') ? 'PASS' : 'FAIL'}] VR card links to /practice/vr`);
  console.log(`  [${comingSoonCards === 0 ? 'PASS' : 'FAIL'}] Coming-soon cards: ${comingSoonCards} (expected exactly 0)`);
  console.log(`  [${practiceHubCheck.includes('skip-link') ? 'PASS' : 'FAIL'}] Skip link present`);

  // Sitemap
  console.log('\nBuilding: public/sitemap.xml');
  const sitemapXml  = generateSitemap();
  const sitemapPath = path.join(ROOT, 'public/sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemapXml, 'utf8');
  const urlCount = (sitemapXml.match(/<url>/g) || []).length;
  console.log(`  Wrote: ${sitemapPath}`);
  console.log(`  [${urlCount === 44 ? 'PASS' : 'FAIL'}] URL count: ${urlCount} (expected 44: root + /practice + /practice/maths + 16 maths topics + /practice/english + 6 English topics + /practice/vr + 17 VR topics)`);
  console.log(`  [${sitemapXml.includes('prepstep.co.uk/') ? 'PASS' : 'FAIL'}] Root URL present`);
}

console.log('\nDone.');
