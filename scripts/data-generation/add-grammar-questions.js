/**
 * Add new grammar questions to fill GL ratio gaps:
 * - ~40 Standard English (critical gap: 2 → 42)
 * - ~10 Subject-verb agreement (30 → 40)
 * - ~5 Tenses (45 → 50)
 *
 * GL distractor design: correct + common spoken error + hypercorrection + related wrong + clearly wrong
 * All questions are "complete the sentence" MC with 5 options
 */
const fs = require('fs');
const filePath = 'C:/Users/Ben Jackson/Projects/11plus-prep/src/questionData/englishData.js';

// New questions start at ID 331
// Format: {id, d, q, opts, correct, ex}
const newQuestions = [

  // ========== STANDARD ENGLISH (40 questions) ==========
  // GL's 2nd biggest grammar category — tests written vs spoken English

  // -- D1: Basic Standard English (12 questions) --
  {id:331, d:1,
    q: "Choose the correct word to complete the sentence: 'We ___ going to the park after school.'",
    opts: ["was","is","were","be","am"], correct: 2,
    ex: "'We were' is correct Standard English. 'We was' is a common spoken error but grammatically wrong — 'was' is for singular subjects (I was, he was), while 'were' is for plural (we were, they were). ✓"},
  {id:332, d:1,
    q: "Choose the correct word to complete the sentence: 'She ___ her homework before tea yesterday.'",
    opts: ["done","did","does","doing","has done"], correct: 1,
    ex: "'She did' is correct Standard English. 'She done' is a very common spoken error — 'done' needs a helper verb ('has done', 'had done'), but on its own the past tense is 'did'. ✓"},
  {id:333, d:1,
    q: "Choose the correct word to complete the sentence: 'They ___ playing in the garden when it started to rain.'",
    opts: ["was","is","were","be","are"], correct: 2,
    ex: "'They were' is correct. 'They was' is non-standard — 'was' is singular, 'were' is plural. With 'they', always use 'were'. ✓"},
  {id:334, d:1,
    q: "Choose the correct word to complete the sentence: 'I ___ seen that film before.'",
    opts: ["has","have","having","am","is"], correct: 1,
    ex: "'I have seen' is correct. With 'I', we always use 'have' not 'has'. 'Has' is for he/she/it: 'she has seen'. ✓"},
  {id:335, d:1,
    q: "Choose the correct word to complete the sentence: 'He ___ want to come to the party.'",
    opts: ["don't","doesn't","hasn't","weren't","isn't"], correct: 1,
    ex: "'He doesn't' is correct Standard English. 'He don't' is a common spoken error — with he/she/it, we use 'doesn't', not 'don't'. ✓"},
  {id:336, d:1,
    q: "Choose the correct word to complete the sentence: 'We ___ allowed to run in the corridors.'",
    opts: ["isn't","wasn't","aren't","don't","hasn't"], correct: 2,
    ex: "'We aren't' is correct. 'We' is plural so needs 'aren't', not 'isn't' (which is singular). ✓"},
  {id:337, d:1,
    q: "Choose the correct word to complete the sentence: 'My friends and I ___ to the cinema last Saturday.'",
    opts: ["gone","go","went","going","goes"], correct: 2,
    ex: "'Went' is the correct past tense. 'We gone' is a common spoken error — 'gone' needs a helper verb ('have gone'), but on its own the past tense of 'go' is 'went'. ✓"},
  {id:338, d:1,
    q: "Choose the correct word to complete the sentence: 'She ___ never been to Scotland before.'",
    opts: ["have","has","is","was","were"], correct: 1,
    ex: "'She has' is correct. With she/he/it, we use 'has' not 'have'. 'She have' is non-standard English. ✓"},
  {id:339, d:1,
    q: "Choose the correct word to complete the sentence: 'I ___ it on the table this morning.'",
    opts: ["seen","see","saw","seeing","sees"], correct: 2,
    ex: "'I saw' is the correct past tense. 'I seen' is a very common spoken error — 'seen' needs a helper verb ('I have seen'), but on its own the past tense of 'see' is 'saw'. ✓"},
  {id:340, d:1,
    q: "Choose the correct word to complete the sentence: 'Mum ___ us to tidy our rooms.'",
    opts: ["telled","told","tell","telling","telt"], correct: 1,
    ex: "'Told' is the correct past tense of 'tell'. 'Telled' and 'telt' are non-standard forms. ✓"},
  {id:341, d:1,
    q: "Choose the correct word to complete the sentence: 'The children ___ very excited about the school trip.'",
    opts: ["was","is","were","be","am"], correct: 2,
    ex: "'The children were' is correct. 'Children' is plural, so it takes 'were' not 'was'. 'The children was' is non-standard. ✓"},
  {id:342, d:1,
    q: "Choose the correct word to complete the sentence: 'He ___ his coat on the floor again.'",
    opts: ["leaved","left","leafed","lefted","leaving"], correct: 1,
    ex: "'Left' is the correct past tense of 'leave'. 'Leaved' is a common error — 'leave' is irregular: leave/left/left. ✓"},

  // -- D2: Intermediate Standard English (16 questions) --
  {id:343, d:2,
    q: "Choose the correct word to complete the sentence: 'She should ___ told me about the change of plan.'",
    opts: ["of","have","had","been","has"], correct: 1,
    ex: "'Should have' is correct. 'Should of' is a very common error because 'should've' sounds like 'should of' when spoken aloud. But 'of' is a preposition, not a verb — it must be 'have'. ✓"},
  {id:344, d:2,
    q: "Choose the correct word to complete the sentence: 'If I ___ known about the party, I would have come.'",
    opts: ["would","had","have","was","did"], correct: 1,
    ex: "'If I had known' is the third conditional, used for imaginary past situations. 'If I would known' and 'If I have known' are both grammatically wrong. ✓"},
  {id:345, d:2,
    q: "Choose the correct word to complete the sentence: 'We could ___ left earlier if you had been ready.'",
    opts: ["of","have","has","had","been"], correct: 1,
    ex: "'Could have' is correct. Like 'should have', 'could of' is a common error caused by the contraction 'could've' sounding like 'could of'. ✓"},
  {id:346, d:2,
    q: "Choose the correct word to complete the sentence: 'My sister and ___ went shopping on Saturday.'",
    opts: ["me","myself","mine","I","us"], correct: 3,
    ex: "'My sister and I' is correct because 'I' is the subject (doing the action). Test by removing 'my sister and' — you'd say 'I went shopping', not 'me went shopping'. ✓"},
  {id:347, d:2,
    q: "Choose the correct word to complete the sentence: 'The teacher told my brother and ___ to stay behind.'",
    opts: ["I","myself","we","me","mine"], correct: 3,
    ex: "'My brother and me' is correct because 'me' is the object (receiving the action). Test by removing 'my brother and' — you'd say 'told me', not 'told I'. Many people overcorrect to 'I' here. ✓"},
  {id:348, d:2,
    q: "Choose the correct word to complete the sentence: 'He might ___ forgotten about the meeting.'",
    opts: ["of","have","has","had","been"], correct: 1,
    ex: "'Might have' is correct. 'Might of' is wrong — same error as 'should of' and 'could of'. The contracted form 'might've' sounds like 'might of' but must be written as 'might have'. ✓"},
  {id:349, d:2,
    q: "Choose the correct word to complete the sentence: 'Those cakes ___ delicious.'",
    opts: ["is","was","looks","taste","tastes"], correct: 3,
    ex: "'Those cakes taste' is correct. 'Those' is plural, so needs a plural verb. 'Tastes' is singular ('the cake tastes'), 'taste' is plural ('the cakes taste'). ✓"},
  {id:350, d:2,
    q: "Choose the correct word to complete the sentence: 'She ___ to school every day last term.'",
    opts: ["walks","walk","walked","walking","has walked"], correct: 2,
    ex: "'Walked' is correct — the past tense is needed because of 'last term'. 'She walks' is present tense, 'has walked' is present perfect — neither fits the past time reference. ✓"},
  {id:351, d:2,
    q: "Choose the correct word to complete the sentence: 'I ___ rather go to the park than stay indoors.'",
    opts: ["will","shall","would","should","could"], correct: 2,
    ex: "'I would rather' is the correct phrase for expressing preference. 'I will rather' and 'I shall rather' are non-standard. ✓"},
  {id:352, d:2,
    q: "Choose the correct word to complete the sentence: 'You ___ to ask before borrowing someone's things.'",
    opts: ["should","ought","must","need","have"], correct: 1,
    ex: "'You ought to ask' is correct. 'Ought' must always be followed by 'to'. 'You should ask' would also be correct but 'should' isn't paired with 'to' the same way. ✓"},
  {id:353, d:2,
    q: "Choose the correct word to complete the sentence: 'There ___ fewer pupils in school today because of the flu.'",
    opts: ["is","was","are","has","does"], correct: 2,
    ex: "'There are fewer' is correct. 'Fewer' is used with countable nouns (pupils), and 'pupils' is plural, so we need 'are'. Also note: 'fewer' not 'less' with countable nouns. ✓"},
  {id:354, d:2,
    q: "Choose the correct word to complete the sentence: 'She ___ well in her exams this year.'",
    opts: ["done","did","does","has done","is doing"], correct: 3,
    ex: "'She has done well' is correct. 'She done well' is non-standard — 'done' always needs a helper verb. 'She did well' would also be correct in past simple, but the 'this year' suggests the present perfect. ✓"},
  {id:355, d:2,
    q: "Choose the correct word to complete the sentence: 'None of the children ___ finished their work on time.'",
    opts: ["has","have","is","was","does"], correct: 1,
    ex: "'None has finished' is traditionally correct — 'none' means 'not one' and takes a singular verb. However, 'none have' is widely accepted too. In formal/exam English, singular is preferred. ✓"},
  {id:356, d:2,
    q: "Choose the correct word to complete the sentence: 'He ran ___ than anyone else in the race.'",
    opts: ["fastest","more faster","quicker","quickest","more quickly"], correct: 4,
    ex: "'More quickly' is correct. We need an adverb (describing HOW he ran), not an adjective. 'Quicker' is informal but technically an adjective. In Standard English, 'more quickly' is the correct comparative adverb. ✓"},
  {id:357, d:2,
    q: "Choose the correct word to complete the sentence: 'Mum asked ___ had eaten the last biscuit.'",
    opts: ["whom","which","who","whose","what"], correct: 2,
    ex: "'Who' is correct because it's the subject of 'had eaten' (who did the eating?). 'Whom' would be wrong here — 'whom' is for the object position. ✓"},
  {id:358, d:2,
    q: "Choose the correct word to complete the sentence: 'We ___ to the new restaurant twice already.'",
    opts: ["been","went","go","have been","are going"], correct: 3,
    ex: "'We have been' is correct. 'We been' is non-standard — the helper verb 'have' is needed. 'Already' signals the present perfect tense. ✓"},

  // -- D3: Advanced Standard English (12 questions) --
  {id:359, d:3,
    q: "Choose the correct word to complete the sentence: 'Between you and ___, I think the test was quite easy.'",
    opts: ["I","me","myself","we","mine"], correct: 1,
    ex: "'Between you and me' is correct. 'Between' is a preposition, so it takes the object form 'me', not the subject form 'I'. 'Between you and I' is a very common hypercorrection — people think 'I' always sounds more formal, but after a preposition, 'me' is correct. ✓"},
  {id:360, d:3,
    q: "Choose the correct word to complete the sentence: 'If I ___ you, I would apologise immediately.'",
    opts: ["am","was","were","is","be"], correct: 2,
    ex: "This is the subjunctive mood, used for imaginary situations. Even with 'I', we use 'were' (not 'was') in 'if' clauses about things that aren't true: 'If I were you...' This is formal Standard English. ✓"},
  {id:361, d:3,
    q: "Choose the correct word to complete the sentence: 'The headteacher requested that every pupil ___ present at the assembly.'",
    opts: ["is","was","were","be","being"], correct: 3,
    ex: "This is the formal subjunctive after verbs of requesting/demanding. 'Be' is the subjunctive form — 'The headteacher requested that every pupil be present.' This is very formal English, typically D3 difficulty. ✓"},
  {id:362, d:3,
    q: "Choose the correct word to complete the sentence: 'To ___ should I address this complaint?'",
    opts: ["who","which","whose","whom","that"], correct: 3,
    ex: "'To whom' is correct. After a preposition ('to'), we use 'whom' not 'who'. Test: you'd say 'I should address it to him' (object), not 'I should address it to he' (subject), so it's 'whom'. ✓"},
  {id:363, d:3,
    q: "Choose the correct word to complete the sentence: 'It is essential that she ___ on time for the examination.'",
    opts: ["arrives","arrive","arrived","arriving","has arrived"], correct: 1,
    ex: "'Arrive' is the subjunctive form after 'it is essential that'. In the subjunctive, we use the base form of the verb regardless of the subject: 'that she arrive', 'that he attend', 'that it be'. ✓"},
  {id:364, d:3,
    q: "Choose the correct word to complete the sentence: 'She asked ___ had left the gate open.'",
    opts: ["whom","which","who","whose","that"], correct: 2,
    ex: "'Who' is correct because it's the subject of 'had left' — who did the leaving? 'Whom' would be wrong here. Many people overcorrect to 'whom' thinking it sounds more formal, but 'who' is the subject form. ✓"},
  {id:365, d:3,
    q: "Choose the correct word to complete the sentence: 'The prize was given to my friend and ___.'",
    opts: ["I","myself","mine","me","we"], correct: 3,
    ex: "'My friend and me' is correct. 'To' is a preposition, so takes the object form 'me'. Test by removing 'my friend and' — you'd say 'given to me', not 'given to I'. This is one of the most common hypercorrections. ✓"},
  {id:366, d:3,
    q: "Choose the correct word to complete the sentence: 'She speaks ___ she were an expert on the subject.'",
    opts: ["like","as if","as","that","because"], correct: 1,
    ex: "'As if' is correct for making a comparison with an imaginary situation. 'Like' is used informally but is not Standard English in this context — 'as if' or 'as though' is the correct formal form. ✓"},
  {id:367, d:3,
    q: "Choose the correct word to complete the sentence: 'The teacher, along with three teaching assistants, ___ supervising the trip.'",
    opts: ["are","were","is","have been","be"], correct: 2,
    ex: "'Is' is correct. The subject is 'the teacher' (singular). 'Along with three teaching assistants' is additional information but doesn't change the subject. This is a common GL trap — the nearby plural 'assistants' attracts children to pick 'are'. ✓"},
  {id:368, d:3,
    q: "Choose the correct word to complete the sentence: 'Had I ___ about the problem earlier, I could have helped.'",
    opts: ["know","knew","known","knowing","knows"], correct: 2,
    ex: "'Had I known' is an inverted conditional (formal version of 'If I had known'). The past participle 'known' is needed after 'had'. This formal inversion drops 'if' and puts 'had' first. ✓"},
  {id:369, d:3,
    q: "Choose the correct word to complete the sentence: 'Not only ___ she finish first, but she also broke the record.'",
    opts: ["has","was","did","is","had"], correct: 2,
    ex: "'Not only did she finish' uses inverted word order with 'did' for emphasis. After 'not only', the auxiliary verb comes before the subject: 'did she', not 'she did'. This is formal English. ✓"},
  {id:370, d:3,
    q: "Choose the correct word to complete the sentence: 'Scarcely had the lesson begun ___ the fire alarm sounded.'",
    opts: ["than","then","when","that","as"], correct: 2,
    ex: "'Scarcely...when' is the correct pairing. Compare: 'No sooner...than' and 'Hardly...when'. These formal structures use specific conjunctions — mixing them up ('scarcely...than') is a common error. ✓"},

  // ========== SUBJECT-VERB AGREEMENT (10 questions) ==========

  {id:371, d:2,
    q: "Choose the correct word to complete the sentence: 'The basket of oranges ___ sitting on the kitchen table.'",
    opts: ["are","were","is","have","do"], correct: 2,
    ex: "The subject is 'basket' (singular), not 'oranges'. The phrase 'of oranges' just describes what's in the basket. A singular subject takes 'is'. Don't be distracted by the nearby plural noun! ✓"},
  {id:372, d:2,
    q: "Choose the correct word to complete the sentence: 'One of my friends ___ moving to a new school next term.'",
    opts: ["are","were","is","have","do"], correct: 2,
    ex: "The subject is 'one' (singular), not 'friends'. 'Of my friends' tells us which one. Since 'one' is singular, we need 'is'. ✓"},
  {id:373, d:2,
    q: "Choose the correct word to complete the sentence: 'The packet of crisps ___ already been opened.'",
    opts: ["have","are","has","were","is"], correct: 2,
    ex: "The subject is 'packet' (singular). 'Of crisps' just describes the packet. 'Has' is the singular form needed here. ✓"},
  {id:374, d:3,
    q: "Choose the correct word to complete the sentence: 'The number of pupils arriving by bus ___ increased this year.'",
    opts: ["have","are","has","were","do"], correct: 2,
    ex: "'The number of' is singular — it refers to the number itself. So 'has increased' is correct. Compare with 'A number of pupils have...' where 'a number of' means 'many' and takes a plural verb. This is a classic GL distinction! ✓"},
  {id:375, d:3,
    q: "Choose the correct word to complete the sentence: 'A number of children ___ absent today because of illness.'",
    opts: ["is","was","has","are","does"], correct: 3,
    ex: "'A number of' means 'several/many' and takes a plural verb: 'are absent'. Compare with 'The number of children is...' where 'the number' is singular. ✓"},
  {id:376, d:2,
    q: "Choose the correct word to complete the sentence: 'Every pupil in the school ___ expected to wear uniform.'",
    opts: ["are","were","is","have","do"], correct: 2,
    ex: "'Every' means each individual one, so it takes a singular verb: 'is expected'. Even though there are many pupils, 'every' treats them individually. ✓"},
  {id:377, d:3,
    q: "Choose the correct word to complete the sentence: 'Neither the captain nor the players ___ satisfied with the result.'",
    opts: ["is","was","were","has","does"], correct: 2,
    ex: "With 'neither...nor', the verb agrees with the nearest noun. 'Players' is nearest and is plural, so we need 'were'. If it were 'Neither the players nor the captain', we'd use 'was'. ✓"},
  {id:378, d:3,
    q: "Choose the correct word to complete the sentence: 'Either the twins or their older sister ___ responsible for feeding the cat.'",
    opts: ["are","were","is","have","do"], correct: 2,
    ex: "With 'either...or', the verb agrees with the nearest noun. 'Sister' is nearest and is singular, so we need 'is'. ✓"},
  {id:379, d:2,
    q: "Choose the correct word to complete the sentence: 'Bread and butter ___ my favourite snack.'",
    opts: ["are","were","is","have","make"], correct: 2,
    ex: "'Bread and butter' is treated as a single item (one snack), so takes the singular 'is'. When two nouns form a single concept ('fish and chips is...', 'salt and pepper is...'), use a singular verb. ✓"},
  {id:380, d:3,
    q: "Choose the correct word to complete the sentence: 'The jury ___ unable to reach a unanimous verdict.'",
    opts: ["is","was","were","has","does"], correct: 2,
    ex: "'Were' is correct here because the jury members couldn't agree — they're acting as individuals, not as one unit. When a collective noun's members act separately, use a plural verb. ✓"},

  // ========== TENSES (5 questions) ==========

  {id:381, d:2,
    q: "Choose the correct word to complete the sentence: 'By the time we reached the cinema, the film had already ___.'",
    opts: ["start","starts","started","starting","to start"], correct: 2,
    ex: "'Had started' is the past perfect tense, showing one past event happened before another. The film started (first event) before we reached the cinema (second event). ✓"},
  {id:382, d:3,
    q: "Choose the correct word to complete the sentence: 'She ___ the violin for three hours when her teacher finally arrived.'",
    opts: ["practised","was practising","has practised","had been practising","is practising"], correct: 3,
    ex: "'Had been practising' is the past perfect progressive, used for an ongoing action that was happening up to a point in the past. She was continuously practising (duration: three hours) before the teacher arrived. ✓"},
  {id:383, d:2,
    q: "Choose the correct word to complete the sentence: 'I ___ never tasted mango before I went to India.'",
    opts: ["have","has","had","was","am"], correct: 2,
    ex: "'Had' is correct — the past perfect ('had tasted') is needed because there are two past events: tasting mango and going to India. The tasting (or lack of it) happened before going to India. ✓"},
  {id:384, d:3,
    q: "Choose the correct word to complete the sentence: 'By next September, she ___ completed all her 11+ preparation.'",
    opts: ["has","had","will","will have","is"], correct: 3,
    ex: "'Will have completed' is the future perfect tense, used for something that will be finished before a specific future time. 'By next September' signals that future deadline. ✓"},
  {id:385, d:2,
    q: "Choose the correct word to complete the sentence: 'While Dad ___ the car, it suddenly started to rain.'",
    opts: ["washes","washed","was washing","is washing","has washed"], correct: 2,
    ex: "'Was washing' is the past progressive (continuous), used for an ongoing action that was interrupted. Dad's washing was in progress when the rain interrupted it. 'Washed' would suggest he finished. ✓"},
];

// Read file
let content = fs.readFileSync(filePath, 'utf8');

// Find grammar section and questions array end
const gramStart = content.indexOf("grammar: {");
const vocabStart = content.indexOf("vocabulary: {", gramStart);
const gramSection = content.substring(gramStart, vocabStart);

// Find the ] that closes the questions array
const questionsStart = gramSection.indexOf("questions: [");
let depth = 0, arrayEnd = -1;
for (let i = gramSection.indexOf("[", questionsStart); i < gramSection.length; i++) {
  if (gramSection[i] === '[') depth++;
  if (gramSection[i] === ']') depth--;
  if (depth === 0) { arrayEnd = i; break; }
}

const insertPoint = gramStart + arrayEnd;

// Format new questions
const formatted = newQuestions.map(q => {
  const ex = q.ex.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return `        {
          "id": ${q.id},
          "difficulty": ${q.d},
          "question": "${q.q.replace(/"/g, '\\"')}",
          "options": [${q.opts.map(o => '"' + o.replace(/"/g, '\\"') + '"').join(',')}],
          "correct": ${q.correct},
          "explanation": "${ex}"
        }`;
}).join(',\n');

const newContent = content.substring(0, insertPoint) + ',\n' + formatted + '\n      ' + content.substring(insertPoint);
fs.writeFileSync(filePath, newContent, 'utf8');

console.log(`Added ${newQuestions.length} new grammar questions (Q331-Q385)`);
const dd = {1:0, 2:0, 3:0};
for (const q of newQuestions) dd[q.d]++;
console.log(`  Standard English: D1=${dd[1] - 0} D2=${dd[2] - 0} D3=${dd[3] - 0}`);
// Actually count by category
const se = newQuestions.filter(q => q.id <= 370).length;
const sva = newQuestions.filter(q => q.id >= 371 && q.id <= 380).length;
const tense = newQuestions.filter(q => q.id >= 381).length;
console.log(`  Standard English: ${se}, SVA: ${sva}, Tenses: ${tense}`);

// Verify
delete require.cache[require.resolve('../src/questionData/englishData.js')];
const m2 = require('../src/questionData/englishData.js');
const qs2 = (m2.default || m2).topics.grammar.questions;
console.log(`Total grammar questions: ${qs2.length}`);
const dd2 = {1:0, 2:0, 3:0};
for (const q of qs2) dd2[q.difficulty]++;
console.log(`Distribution: D1=${dd2[1]}(${Math.round(dd2[1]/qs2.length*100)}%) D2=${dd2[2]}(${Math.round(dd2[2]/qs2.length*100)}%) D3=${dd2[3]}(${Math.round(dd2[3]/qs2.length*100)}%)`);
