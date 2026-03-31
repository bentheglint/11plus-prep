#!/usr/bin/env node
/**
 * Spelling Audit Fix Script
 * Step 9: Apply all fixes in a single pass
 *
 * 1. Fix Q23 (two errors → one error)
 * 2. Reclassify 32 spelling-demons to proper categories
 * 3. Create ~90 new questions (Q331-Q420)
 * 4. Update mapping file
 * 5. Validate
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ENGLISH_DATA = path.join(ROOT, 'src/questionData/englishData.js');
const MAPPING_FILE = path.join(ROOT, 'public/english-question-lesson-map.json');

// ============================================================
// NEW QUESTIONS (Q331-Q420)
// ============================================================

const newQuestions = [

  // ---- suffix-adding-rules: 3 new (Q331-Q333) ----
  {
    "id": 331, "difficulty": 1, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["The children were", "haveing a wonderful", "time at the", "school summer fair."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 1,
    "explanation": "'haveing' should be 'having'. When a word ends in 'e', drop the 'e' before adding '-ing': have → hav-ING. ✓"
  },
  {
    "id": 332, "difficulty": 2, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["She was runing", "as fast as she", "could to catch", "the bus before school."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 0,
    "explanation": "'runing' should be 'running'. When a short vowel comes before a single consonant, double the consonant before adding '-ing': run → run-N-ING. ✓"
  },
  {
    "id": 333, "difficulty": 3, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["He spoke very", "gentley to the", "frightened kitten hiding", "behind the garden shed."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 1,
    "explanation": "'gentley' should be 'gently'. When adding '-ly' to a word ending in '-le', replace the '-le' with '-ly': gentle → gent-LY. ✓"
  },

  // ---- i-before-e: 8 new (Q334-Q341) ----
  {
    "id": 334, "difficulty": 1, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["I beleive that", "our class is the", "best in the", "whole school this year."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 0,
    "explanation": "'beleive' should be 'believe'. Remember: 'i' before 'e' except after 'c' — so it's bel-IE-ve. ✓"
  },
  {
    "id": 335, "difficulty": 1, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["She worked hard", "to acheive her", "goal of making", "the netball team."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 1,
    "explanation": "'acheive' should be 'achieve'. Remember: 'i' before 'e' except after 'c' — so it's ach-IE-ve. ✓"
  },
  {
    "id": 336, "difficulty": 2, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["We did not", "recieve the parcel", "until the following", "Monday afternoon."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 1,
    "explanation": "'recieve' should be 'receive'. After 'c', it's 'ei' not 'ie': re-CEI-ve. The rule is 'i before e, EXCEPT after c'. ✓"
  },
  {
    "id": 337, "difficulty": 2, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["The magician tried", "to decieve the", "audience with a", "clever card trick."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 1,
    "explanation": "'decieve' should be 'deceive'. After 'c', use 'ei' not 'ie': de-CEI-ve. Think: receive, deceive, perceive — all have 'cei'. ✓"
  },
  {
    "id": 338, "difficulty": 2, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["There was a crack", "in the cieling of", "the old village", "hall near the stage."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 1,
    "explanation": "'cieling' should be 'ceiling'. After 'c', use 'ei' not 'ie': C-EI-ling. ✓"
  },
  {
    "id": 339, "difficulty": 3, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["That was a very", "wierd noise coming", "from the attic", "late last night."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 1,
    "explanation": "'wierd' should be 'weird'. This is a tricky exception — 'weird' breaks the 'i before e' rule! It's W-EI-RD even though there's no 'c'. Just remember: weird is weird! ✓"
  },
  {
    "id": 340, "difficulty": 3, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["The police managed", "to seize the stolen", "jewellery before the", "thieves could escape."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 4,
    "explanation": "There is no spelling mistake. 'Seize' is correctly spelled — it's another exception to the 'i before e' rule. 'Jewellery' uses the correct British spelling. ✓"
  },
  {
    "id": 341, "difficulty": 3, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["She could not find", "her foriegn language", "textbook anywhere", "in her bedroom."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 1,
    "explanation": "'foriegn' should be 'foreign'. Another tricky exception — 'foreign' has 'eig' not 'ieg'. Remember: for-EIGN (like 'reign'). ✓"
  },

  // ---- able-ible: 2 new (Q342-Q343) ----
  {
    "id": 342, "difficulty": 2, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["She wore a very", "fashionable coat", "to the party", "on Saturday evening."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 4,
    "explanation": "There is no spelling mistake. 'Fashionable' is correct — it ends in '-able' because you can hear the full root word 'fashion'. ✓"
  },
  {
    "id": 343, "difficulty": 3, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["The chocolate cake", "was absolutely", "irresistable and", "everyone wanted more."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 2,
    "explanation": "'irresistable' should be 'irresistible'. It ends in '-ible' not '-able': ir-resist-IBLE. ✓"
  },

  // ---- unexpected-sounds: 9 new (Q344-Q352) ----
  {
    "id": 344, "difficulty": 1, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["Can you think of", "a word that rymes", "with the word", "orange? It's impossible!"],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 1,
    "explanation": "'rymes' should be 'rhymes'. The 'rh' at the start is unusual — RHYME comes from Greek. Remember: RH-yme. ✓"
  },
  {
    "id": 345, "difficulty": 1, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["She had a bad", "stomack ake after", "eating too much", "birthday cake."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 1,
    "explanation": "'stomack ake' should be 'stomach ache'. 'Stomach' ends in '-ach' (not '-ack'), and 'ache' starts with 'ach-' — both have an unusual 'ch' that sounds like 'k'. ✓"
  },
  {
    "id": 346, "difficulty": 1, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["The school coir", "sang beautifully", "at the Christmas", "concert last term."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 0,
    "explanation": "'coir' should be 'choir'. 'Choir' has an unusual spelling — the 'ch' sounds like 'kw'. Remember: CH-oir. ✓"
  },
  {
    "id": 347, "difficulty": 2, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["The buisness on the", "high street closed", "down during the", "school holidays."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 0,
    "explanation": "'buisness' should be 'business'. Remember: BUSI-ness — it has 'busi' not 'buisi'. Think of 'busy' → busin-ess. ✓"
  },
  {
    "id": 348, "difficulty": 2, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["She ate her packed", "lunch quickly because", "her stomache was", "rumbling very loudly."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 2,
    "explanation": "'stomache' should be 'stomach'. There is no 'e' at the end — STOMACH. The 'ch' sounds like 'k'. ✓"
  },
  {
    "id": 349, "difficulty": 2, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["The ancient Egyption", "pyramids are one", "of the wonders", "of the world."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 0,
    "explanation": "'Egyption' should be 'Egyptian'. Remember: Egypt-IAN (not -ION). Countries ending in '-t' usually take '-ian': Egypt → Egyptian, Italy → Italian. ✓"
  },
  {
    "id": 350, "difficulty": 3, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["His concience would", "not allow him to", "keep the money", "he had found."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 0,
    "explanation": "'concience' should be 'conscience'. Remember: CON-SCIENCE — it has the word 'science' inside it! ✓"
  },
  {
    "id": 351, "difficulty": 3, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["We sailed past a", "beautiful white yot", "anchored in the", "harbour at sunset."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 1,
    "explanation": "'yot' should be 'yacht'. This is one of English's trickiest spellings — YACHT comes from Dutch. The 'ch' is silent. Just memorise this one! ✓"
  },
  {
    "id": 352, "difficulty": 3, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["The school orchestra", "played a lovely", "piece of classical", "music at the ceremony."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 4,
    "explanation": "There is no spelling mistake. 'Orchestra' (the 'ch' sounds like 'k') and 'classical' are both spelled correctly. ✓"
  },

  // ---- suffix-ful: 13 new (Q353-Q365) ----
  {
    "id": 353, "difficulty": 1, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["She was very", "carefull when she", "crossed the busy", "road near school."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 1,
    "explanation": "'carefull' should be 'careful'. The suffix '-ful' only has ONE 'l' — care-FUL. This is different from the word 'full'! ✓"
  },
  {
    "id": 354, "difficulty": 1, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["I am hopefull", "that the weather", "will be sunny", "for sports day."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 0,
    "explanation": "'hopefull' should be 'hopeful'. The suffix '-ful' has just ONE 'l': hope-FUL. Remember: 'full' loses an 'l' when it becomes a suffix. ✓"
  },
  {
    "id": 355, "difficulty": 1, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["What a colourful", "display of artwork", "the children have", "made for the hall."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 4,
    "explanation": "There is no spelling mistake. 'Colourful' is correct — 'colour' (British spelling) + '-ful' (one 'l'). ✓"
  },
  {
    "id": 356, "difficulty": 1, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["He filled a", "platefull of food", "from the buffet", "at the party."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 1,
    "explanation": "'platefull' should be 'plateful'. The suffix '-ful' always has ONE 'l': plate-FUL. ✓"
  },
  {
    "id": 357, "difficulty": 2, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["The garden looked", "beautifull in the", "spring sunshine", "with all the flowers."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 1,
    "explanation": "'beautifull' should be 'beautiful'. Remember: beauty changes to 'beauti' and then '-ful' has ONE 'l': beauti-FUL. ✓"
  },
  {
    "id": 358, "difficulty": 2, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["What a wonderfull", "surprise to see", "everyone at the", "welcome home party."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 0,
    "explanation": "'wonderfull' should be 'wonderful'. The suffix '-ful' always has just ONE 'l': wonder-FUL. ✓"
  },
  {
    "id": 359, "difficulty": 2, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["She was thankfull", "for all the help", "her friends gave her", "with the project."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 0,
    "explanation": "'thankfull' should be 'thankful'. The suffix '-ful' has ONE 'l': thank-FUL. ✓"
  },
  {
    "id": 360, "difficulty": 2, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["The teacher was", "very resourceful", "and found a way", "to solve the problem."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 4,
    "explanation": "There is no spelling mistake. 'Resourceful' is correct — resource + '-ful' (one 'l'). ✓"
  },
  {
    "id": 361, "difficulty": 2, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["It was a dreadfull", "storm that knocked", "down several trees", "in the park."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 0,
    "explanation": "'dreadfull' should be 'dreadful'. The suffix '-ful' has ONE 'l': dread-FUL. ✓"
  },
  {
    "id": 362, "difficulty": 3, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["He was so", "succesful in the", "competition that he", "won three gold medals."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 1,
    "explanation": "'succesful' should be 'successful'. Two tricky parts here: 'success' has double 'c' AND double 's', then add '-ful' with ONE 'l': success-FUL. ✓"
  },
  {
    "id": 363, "difficulty": 3, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["The children were", "very gratefull to", "the firefighters who", "rescued their kitten."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 1,
    "explanation": "'gratefull' should be 'grateful'. The suffix '-ful' ALWAYS has one 'l': grate-FUL. This rule never changes! ✓"
  },
  {
    "id": 364, "difficulty": 3, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["She gave a very", "insightful answer", "during the class", "debate on Friday."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 4,
    "explanation": "There is no spelling mistake. 'Insightful' is correctly spelled — insight + '-ful' (one 'l'). ✓"
  },
  {
    "id": 365, "difficulty": 3, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["The handful of", "volunteers did a", "powerfull job of", "cleaning up the beach."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 2,
    "explanation": "'powerfull' should be 'powerful'. The suffix '-ful' has ONE 'l': power-FUL. Even though it comes from 'full', as a suffix it drops an 'l'. ✓"
  },

  // ---- pluralisation: 8 new (Q366-Q373) ----
  {
    "id": 366, "difficulty": 1, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["The two babys", "were sleeping", "peacefully in", "their pushchairs."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 0,
    "explanation": "'babys' should be 'babies'. When a word ends in a consonant + 'y', change the 'y' to 'i' and add '-es': baby → bab-IES. ✓"
  },
  {
    "id": 367, "difficulty": 1, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["We grew our own", "tomatos and carrots", "in the vegetable", "patch this summer."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 1,
    "explanation": "'tomatos' should be 'tomatoes'. Some words ending in 'o' add '-es' for the plural: tomato → tomato-ES. Also: potato → potatoes, hero → heroes. ✓"
  },
  {
    "id": 368, "difficulty": 1, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["The foxs ran across", "the field behind", "our house early", "this morning."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 0,
    "explanation": "'foxs' should be 'foxes'. Words ending in 'x' add '-es' for the plural: fox → fox-ES. Same for words ending in 's', 'sh', 'ch'. ✓"
  },
  {
    "id": 369, "difficulty": 2, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["The childs in the", "playground were", "enjoying the new", "climbing frame."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 0,
    "explanation": "'childs' should be 'children'. 'Child' has an irregular plural — it doesn't follow the usual rules. You just have to remember: child → CHILDREN. ✓"
  },
  {
    "id": 370, "difficulty": 2, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["She cut the loaf", "into six halfs", "and put them", "in the freezer."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 1,
    "explanation": "'halfs' should be 'halves'. Words ending in 'f' or 'fe' change to '-ves' in the plural: half → hal-VES. Also: knife → knives, leaf → leaves. ✓"
  },
  {
    "id": 371, "difficulty": 2, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["We saw three", "deers grazing in", "the field beside", "the country lane."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 1,
    "explanation": "'deers' should be 'deer'. Some animals have the same word for singular and plural: one deer, three deer. Also: sheep, fish, moose. ✓"
  },
  {
    "id": 372, "difficulty": 3, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["These phenomenons", "have puzzled", "scientists for", "hundreds of years."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 0,
    "explanation": "'phenomenons' should be 'phenomena'. This word comes from Greek, so it uses a Greek plural: phenomenon → phenom-ENA. ✓"
  },
  {
    "id": 373, "difficulty": 3, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["The school uses", "several criterias to", "decide which pupils", "receive the award."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 1,
    "explanation": "'criterias' should be 'criteria'. 'Criteria' is already plural (from Greek). The singular is 'criterion': one criterion, many criteria. ✓"
  },

  // ---- noun-verb-confusables: 14 new (Q374-Q387) ----
  {
    "id": 374, "difficulty": 1, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["He needs to", "practise his spelling", "every evening after", "school this week."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 4,
    "explanation": "There is no spelling mistake. 'Practise' with an 's' is the VERB (to practise), which is correct here. The noun is 'practice' with a 'c'. ✓"
  },
  {
    "id": 375, "difficulty": 1, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["Mum gave me some", "good advise about", "how to deal", "with the problem."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 1,
    "explanation": "'advise' should be 'advice'. 'Advice' (with a 'c') is the noun — the thing you give. 'Advise' (with an 's') is the verb — the action of giving it. ✓"
  },
  {
    "id": 376, "difficulty": 1, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["The teacher chose", "to advice the", "pupils about their", "options for next year."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 1,
    "explanation": "'advice' should be 'advise'. 'Advise' (with an 's') is the VERB — the action. 'Advice' (with a 'c') is the noun. Remember: advISE = I Shall Explain. ✓"
  },
  {
    "id": 377, "difficulty": 2, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["The shop needs a", "licence to sell", "food to customers", "from the market stall."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 4,
    "explanation": "There is no spelling mistake. 'Licence' (with a 'c') is correct as a noun — the thing you hold. The verb form is 'license' (with an 's'). ✓"
  },
  {
    "id": 378, "difficulty": 2, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["The council refused", "to licence the", "new restaurant", "on the high street."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 1,
    "explanation": "'licence' should be 'license'. When it's the VERB (the action of granting), use 'license' with an 's'. The noun is 'licence' with a 'c'. Think: practice/practise follows the same pattern. ✓"
  },
  {
    "id": 379, "difficulty": 2, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["She could not decide", "what devise to use", "for recording the", "school assembly."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 1,
    "explanation": "'devise' should be 'device'. 'Device' (with a 'c') is the NOUN — the thing. 'Devise' (with an 's') is the verb — to plan or invent. ✓"
  },
  {
    "id": 380, "difficulty": 2, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["The teacher asked", "us to device a", "plan for our", "science investigation."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 1,
    "explanation": "'device' should be 'devise'. 'Devise' (with an 's') is the VERB — the action of planning. 'Device' (with a 'c') is the noun. ✓"
  },
  {
    "id": 381, "difficulty": 2, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["I need to practice", "the piano before", "my lesson on", "Thursday afternoon."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 0,
    "explanation": "'practice' should be 'practise'. When it's the VERB (the action of doing it), use 'practise' with an 's'. 'Practice' with a 'c' is the noun. ✓"
  },
  {
    "id": 382, "difficulty": 3, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["The new law will", "not effect the", "way we travel", "to school each day."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 1,
    "explanation": "'effect' should be 'affect'. 'Affect' is the VERB — to have an impact on something. 'Effect' is usually the NOUN — the result. Remember: Affect = Action, Effect = End result. ✓"
  },
  {
    "id": 383, "difficulty": 3, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["The cold weather", "had a terrible", "affect on the", "strawberry harvest."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 2,
    "explanation": "'affect' should be 'effect'. 'Effect' (with an 'e') is the NOUN — the result or impact. 'Affect' (with an 'a') is the verb. Here, 'a terrible [something]' needs the noun: effect. ✓"
  },
  {
    "id": 384, "difficulty": 3, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["The envelope was", "missing so the", "letter had no", "return adress on it."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 3,
    "explanation": "'adress' should be 'address'. Remember: address has double 'd': ad-DRESS. ✓"
  },
  {
    "id": 385, "difficulty": 3, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["She decided to", "prophecy that the", "team would win", "the final match."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 1,
    "explanation": "'prophecy' should be 'prophesy'. 'Prophesy' (with an 's') is the VERB — to predict. 'Prophecy' (with a 'c') is the NOUN — the prediction itself. Same pattern as advice/advise! ✓"
  },
  {
    "id": 386, "difficulty": 1, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["The football practise", "was cancelled", "because the pitch", "was waterlogged."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 0,
    "explanation": "'practise' should be 'practice'. Here we mean the practice SESSION (a noun), so use 'practice' with a 'c'. The verb is 'practise' with an 's'. ✓"
  },
  {
    "id": 387, "difficulty": 3, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["The magician's", "prophecy came true", "exactly as he", "had predicted."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 4,
    "explanation": "There is no spelling mistake. 'Prophecy' with a 'c' is correct here — it's the NOUN (his prediction). The verb would be 'prophesy' with an 's'. ✓"
  },

  // ---- prefix-spelling: 15 new (Q388-Q402) ----
  {
    "id": 388, "difficulty": 1, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["The rabbit seemed", "to dissapear behind", "the hedge in", "the back garden."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 1,
    "explanation": "'dissapear' should be 'disappear'. The prefix is 'dis-' (one 's') + 'appear': dis-APPEAR. Don't double the 's'. ✓"
  },
  {
    "id": 389, "difficulty": 1, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["It was totaly", "unecessary to bring", "an umbrella today", "as the sun shone."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 1,
    "explanation": "'unecessary' should be 'unnecessary'. The prefix 'un-' joins 'necessary' without changing either: un + necessary = un-NECESSARY. Keep the double 'n'. ✓"
  },
  {
    "id": 390, "difficulty": 1, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["She was very", "unhappy because her", "best friend had", "moved to another town."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 4,
    "explanation": "There is no spelling mistake. 'Unhappy' is correct — the prefix 'un-' simply joins 'happy'. ✓"
  },
  {
    "id": 391, "difficulty": 1, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["He was dissobedient", "in class and had", "to stay in", "at break time."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 0,
    "explanation": "'dissobedient' should be 'disobedient'. The prefix is 'dis-' (one 's') + 'obedient': dis-OBEDIENT. Don't double the 's'. ✓"
  },
  {
    "id": 392, "difficulty": 2, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["The children were", "missbehaving during", "the assembly and", "had to sit apart."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 1,
    "explanation": "'missbehaving' should be 'misbehaving'. The prefix 'mis-' has one 's': mis-BEHAVING. Don't double the 's'. ✓"
  },
  {
    "id": 393, "difficulty": 2, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["His handwriting was", "almost ilegible and", "the teacher could", "not read his work."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 1,
    "explanation": "'ilegible' should be 'illegible'. The prefix 'il-' means 'not' and it doubles the 'l' when added to words starting with 'l': il-LEGIBLE. ✓"
  },
  {
    "id": 394, "difficulty": 2, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["It would be", "iresponsible to let", "the children play", "near the building site."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 1,
    "explanation": "'iresponsible' should be 'irresponsible'. The prefix 'ir-' means 'not' and doubles the 'r': ir-RESPONSIBLE. Same pattern: irregular, irrelevant. ✓"
  },
  {
    "id": 395, "difficulty": 2, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["The instructions were", "quite misleading and", "we took a wrong", "turn at the crossroads."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 4,
    "explanation": "There is no spelling mistake. 'Misleading' is correct — the prefix 'mis-' (one 's') + 'leading'. ✓"
  },
  {
    "id": 396, "difficulty": 2, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["He thought it was", "imposible to finish", "the test in the", "time that was given."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 1,
    "explanation": "'imposible' should be 'impossible'. The prefix 'im-' is used before 'p' and 'b' words, and it keeps both letters: im-POSSIBLE. ✓"
  },
  {
    "id": 397, "difficulty": 3, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["The witness gave an", "inaacurate account", "of what happened", "at the scene."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 1,
    "explanation": "'inaacurate' should be 'inaccurate'. The prefix 'in-' + 'accurate': in-ACCURATE. The double 'c' comes from 'accurate', not from the prefix. ✓"
  },
  {
    "id": 398, "difficulty": 3, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["She felt it was", "immoral to copy", "someone else's work", "and pass it off as hers."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 4,
    "explanation": "There is no spelling mistake. 'Immoral' is correct — the prefix 'im-' doubles the 'm' before words starting with 'm': im-MORAL. ✓"
  },
  {
    "id": 399, "difficulty": 3, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["The disappointed fans", "felt that the referee", "was being completly", "unreasonable."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 2,
    "explanation": "'completly' should be 'completely'. Keep the 'e' from 'complete' when adding '-ly': complete-LY. ✓"
  },
  {
    "id": 400, "difficulty": 3, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["It is illogical to", "think that practice", "does not improve", "your performance."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 4,
    "explanation": "There is no spelling mistake. 'Illogical' is correct — the prefix 'il-' doubles the 'l' before words starting with 'l': il-LOGICAL. ✓"
  },
  {
    "id": 401, "difficulty": 3, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["The teacher asked", "us to rearrange the", "tables and chairs", "before the concert."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 4,
    "explanation": "There is no spelling mistake. 'Rearrange' is correct — the prefix 're-' simply joins 'arrange'. No letters are dropped or doubled. ✓"
  },
  {
    "id": 402, "difficulty": 2, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["It was very", "inapropriate to shout", "during the school", "remembrance assembly."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 1,
    "explanation": "'inapropriate' should be 'inappropriate'. The prefix 'in-' + 'appropriate': in-APPROPRIATE. The double 'p' comes from 'appropriate', not the prefix. ✓"
  },

  // ---- D3 homophones: 8 new (Q403-Q410) ----
  {
    "id": 403, "difficulty": 3, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["The red scarf was", "the perfect compliment", "to her winter", "coat and boots."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 1,
    "explanation": "'compliment' should be 'complement'. A 'complement' completes something (the scarf completed the outfit). A 'compliment' is something nice you say. Remember: complEment = complEte. ✓"
  },
  {
    "id": 404, "difficulty": 3, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["For desert we had", "chocolate cake with", "ice cream and", "fresh strawberries."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 0,
    "explanation": "'desert' should be 'dessert'. The sweet treat has double 's' — deSSert. A 'desert' is a sandy place. Remember: you always want more dessert, so it has more s's! ✓"
  },
  {
    "id": 405, "difficulty": 3, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["There was a cold", "draft coming through", "the old wooden", "door at the back."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 1,
    "explanation": "'draft' should be 'draught' in British English. A 'draught' is a current of air. 'Draft' is the American spelling (and also means a rough version of writing). ✓"
  },
  {
    "id": 406, "difficulty": 3, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["The currant was so", "strong that the boat", "drifted far down", "the river."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 0,
    "explanation": "'currant' should be 'current'. A 'current' is a flow of water or electricity. A 'currant' is a small dried fruit. ✓"
  },
  {
    "id": 407, "difficulty": 3, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["Our building has", "five storeys and we", "live on the very", "top floor."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 4,
    "explanation": "There is no spelling mistake. 'Storeys' (levels of a building) is correct British spelling. 'Stories' would mean tales or narratives. ✓"
  },
  {
    "id": 408, "difficulty": 3, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["She poured over", "the map trying to", "find the shortest", "route to the coast."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 0,
    "explanation": "'poured' should be 'pored'. To 'pore over' means to study carefully. 'Pour' means to tip liquid. Remember: you PORE over a book, you POUR the tea. ✓"
  },
  {
    "id": 409, "difficulty": 3, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["He had cereal and", "toast for breakfast", "before catching the", "school bus at eight."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 4,
    "explanation": "There is no spelling mistake. 'Cereal' (breakfast food) is correct. 'Serial' means in a series. ✓"
  },
  {
    "id": 410, "difficulty": 3, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["The cheque for the", "school trip bounced", "and we had to", "pay by card instead."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 4,
    "explanation": "There is no spelling mistake. 'Cheque' is the correct British spelling for a bank cheque. 'Check' is used in American English (and also means to verify). ✓"
  },

  // ---- no-mistake extras: 10 new (Q411-Q420) ----
  {
    "id": 411, "difficulty": 2, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["The temperature", "dropped dramatically", "overnight and the", "puddles were frozen."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 4,
    "explanation": "There is no spelling mistake. 'Temperature', 'dramatically', and 'frozen' are all correct. ✓"
  },
  {
    "id": 412, "difficulty": 2, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["The government has", "announced that the", "new gymnasium will", "open next September."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 4,
    "explanation": "There is no spelling mistake. 'Government', 'announced', and 'gymnasium' are all correct — even though they all look tricky! ✓"
  },
  {
    "id": 413, "difficulty": 3, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["The parliament", "debated whether the", "environment should", "receive more protection."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 4,
    "explanation": "There is no spelling mistake. 'Parliament', 'whether', 'environment', and 'receive' are all correctly spelled. ✓"
  },
  {
    "id": 414, "difficulty": 2, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["The queue for", "the restaurant", "stretched all the", "way around the corner."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 4,
    "explanation": "There is no spelling mistake. 'Queue' and 'restaurant' are both correct — they just look unusual because they come from French! ✓"
  },
  {
    "id": 415, "difficulty": 3, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["The mischievous puppy", "chewed through the", "neighbour's beautiful", "rhododendron bush."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 4,
    "explanation": "There is no spelling mistake. 'Mischievous' (not 'mischievious'), 'neighbour', 'beautiful', and 'rhododendron' are all correct. ✓"
  },
  {
    "id": 416, "difficulty": 2, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["Wednesday is my", "favourite day because", "we have swimming", "and art lessons."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 4,
    "explanation": "There is no spelling mistake. 'Wednesday' (remember the silent 'd') and 'favourite' (British spelling with 'ou') are both correct. ✓"
  },
  {
    "id": 417, "difficulty": 3, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["The archaeologist made", "a thorough examination", "of the ancient", "jewellery collection."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 4,
    "explanation": "There is no spelling mistake. 'Archaeologist' (British 'ae'), 'thorough', 'ancient', and 'jewellery' are all correct. ✓"
  },
  {
    "id": 418, "difficulty": 2, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["The rhythm of the", "music was absolutely", "irresistible and we", "all started dancing."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 4,
    "explanation": "There is no spelling mistake. 'Rhythm' (no vowel between r and th), 'absolutely', and 'irresistible' are all correct. ✓"
  },
  {
    "id": 419, "difficulty": 3, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["It was a privilege", "to meet such a", "conscientious and", "knowledgeable scientist."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 4,
    "explanation": "There is no spelling mistake. 'Privilege', 'conscientious', and 'knowledgeable' are all correct — despite being some of the trickiest words in English! ✓"
  },
  {
    "id": 420, "difficulty": 2, "questionType": "error-spotting",
    "question": "Which section contains a spelling error?",
    "segments": ["The committee agreed", "that the school", "library needed more", "shelves for reference books."],
    "options": ["Section A", "Section B", "Section C", "Section D", "No mistake"],
    "correct": 4,
    "explanation": "There is no spelling mistake. 'Committee' (double m, double t, double e) and 'library' (remember the first 'r') are both correct. ✓"
  }
];

// ============================================================
// Q23 FIX — change segment D to have only one error
// ============================================================
const Q23_FIX = {
  oldSegment: "definately recomend it.",
  newSegment: "definitely recomend it.",
  oldExplanation: "Two errors in Section D: 'definately' should be 'definitely' and 'recomend' should be 'recommend' (double 'm' not needed, but double 'm' IS needed: re-com-mend). ✓",
  newExplanation: "'recomend' should be 'recommend'. It needs double 'm': rec-om-MEND. Think of 'commend' hiding inside it! ✓"
};

// ============================================================
// RECLASSIFICATION MAP
// ============================================================
const reclassifications = {
  'double-letters': [7, 126, 271, 321],
  'suffix-pairs': [18, 65, 90, 91, 97, 111, 114, 203, 217, 290, 300, 308, 318, 322, 324],
  'unstressed-vowels': [95, 96, 107, 135, 138, 143, 149, 222, 279, 296, 312],
  'silent-letters': [130, 167]
};

// ============================================================
// NEW QUESTION MAPPINGS
// ============================================================
const newMappings = {};
// suffix-adding-rules: Q331-Q333
[331, 332, 333].forEach(id => newMappings[id] = { subConceptId: 'suffix-adding-rules', confidence: 'high' });
// i-before-e: Q334-Q341
[334, 335, 336, 337, 338, 339, 340, 341].forEach(id => newMappings[id] = { subConceptId: 'i-before-e', confidence: 'high' });
// able-ible: Q342-Q343
[342, 343].forEach(id => newMappings[id] = { subConceptId: 'able-ible', confidence: 'high' });
// unexpected-sounds: Q344-Q352
[344, 345, 346, 347, 348, 349, 350, 351, 352].forEach(id => newMappings[id] = { subConceptId: 'unexpected-sounds', confidence: 'high' });
// suffix-ful: Q353-Q365
for (let i = 353; i <= 365; i++) newMappings[i] = { subConceptId: 'suffix-ful', confidence: 'high' };
// pluralisation: Q366-Q373
for (let i = 366; i <= 373; i++) newMappings[i] = { subConceptId: 'pluralisation', confidence: 'high' };
// noun-verb-confusables: Q374-Q387
for (let i = 374; i <= 387; i++) newMappings[i] = { subConceptId: 'noun-verb-confusables', confidence: 'high' };
// prefix-spelling: Q388-Q402
for (let i = 388; i <= 402; i++) newMappings[i] = { subConceptId: 'prefix-spelling', confidence: 'high' };
// D3 homophones: Q403-Q410
for (let i = 403; i <= 410; i++) newMappings[i] = { subConceptId: 'homophones', confidence: 'high' };
// no-mistake: Q411-Q420
[411, 412, 416, 420].forEach(id => newMappings[id] = { subConceptId: 'spelling-demons', confidence: 'high' });
[413, 415, 417, 419].forEach(id => newMappings[id] = { subConceptId: 'spelling-demons', confidence: 'high' });
[414].forEach(id => newMappings[id] = { subConceptId: 'unexpected-sounds', confidence: 'high' });
[418].forEach(id => newMappings[id] = { subConceptId: 'spelling-demons', confidence: 'high' });

// ============================================================
// APPLY FIXES
// ============================================================

console.log('=== SPELLING AUDIT FIX SCRIPT ===\n');

// 1. Read current files
let englishData = fs.readFileSync(ENGLISH_DATA, 'utf8');
let mappingData = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf8'));

// 2. Fix Q23
console.log('1. Fixing Q23 (two errors → one error)...');
englishData = englishData.replace(Q23_FIX.oldSegment, Q23_FIX.newSegment);
englishData = englishData.replace(Q23_FIX.oldExplanation, Q23_FIX.newExplanation);

// Verify Q23 fix
if (englishData.includes(Q23_FIX.newSegment) && englishData.includes(Q23_FIX.newExplanation)) {
  console.log('   Q23 fixed ✓');
} else {
  console.log('   WARNING: Q23 fix may not have applied correctly');
}

// 3. Add new questions
console.log('2. Adding ' + newQuestions.length + ' new questions (Q331-Q420)...');

// Find the spelling Q330 specifically — it's followed by the closing ] of spelling questions
// Use the unique context: Q330 with "extra-curricular activities" (only in spelling section)
const spellingQ330Marker = 'and extra-curricular activities."';
const markerPos = englishData.indexOf(spellingQ330Marker);
if (markerPos === -1) {
  console.error('ERROR: Cannot find spelling Q330 marker');
  process.exit(1);
}

// From the marker, find the closing } of Q330
let braceDepth = 0;
let q330End = -1;
// Go backwards to find the opening { of Q330, then forward to find its closing }
let q330Start = markerPos;
while (q330Start > 0 && englishData[q330Start] !== '{') q330Start--;
braceDepth = 0;
for (let i = q330Start; i < englishData.length; i++) {
  if (englishData[i] === '{') braceDepth++;
  if (englishData[i] === '}') {
    braceDepth--;
    if (braceDepth === 0) {
      q330End = i + 1;
      break;
    }
  }
}

if (q330End === -1) {
  console.error('ERROR: Cannot find end of spelling Q330');
  process.exit(1);
}

console.log('   Found spelling Q330 ending at position ' + q330End);

// Build new questions string
const newQStr = newQuestions.map(q => {
  const segsStr = q.segments.map(s => `            "${s}"`).join(',\n');
  const optsStr = q.options.map(o => `"${o}"`).join(', ');
  return `        {
          "id": ${q.id},
          "difficulty": ${q.difficulty},
          "questionType": "${q.questionType}",
          "question": "${q.question}",
          "segments": [
${segsStr}
          ],
          "options": [${optsStr}],
          "correct": ${q.correct},
          "explanation": "${q.explanation}"
        }`;
}).join(',\n');

// Insert after Q330
englishData = englishData.slice(0, q330End) + ',\n' + newQStr + englishData.slice(q330End);
console.log('   New questions inserted ✓');

// 4. Reclassify mapping entries
console.log('3. Reclassifying 32 spelling-demons...');
let reclassCount = 0;
Object.entries(reclassifications).forEach(([newCat, qIds]) => {
  qIds.forEach(qId => {
    // Find the mapping entry for this question ID
    const entry = Object.entries(mappingData.spelling).find(([k, v]) => v.questionId === qId);
    if (entry) {
      mappingData.spelling[entry[0]].subConceptId = newCat;
      reclassCount++;
    }
  });
});
console.log('   Reclassified ' + reclassCount + ' entries ✓');

// 5. Add new question mappings
console.log('4. Adding mappings for new questions...');
const existingCount = Object.keys(mappingData.spelling).length;
let mapIdx = existingCount;
Object.entries(newMappings).forEach(([qId, mapping]) => {
  mappingData.spelling[String(mapIdx)] = {
    questionId: parseInt(qId),
    subConceptId: mapping.subConceptId,
    confidence: mapping.confidence
  };
  mapIdx++;
});
console.log('   Added ' + Object.keys(newMappings).length + ' new mappings ✓');

// ============================================================
// VALIDATION
// ============================================================
console.log('\n=== VALIDATION ===\n');

let errors = 0;

// Check new question count
const totalMappings = Object.keys(mappingData.spelling).length;
console.log('Total mapping entries: ' + totalMappings);
if (totalMappings !== 420) {
  console.log('  WARNING: Expected 420 mappings, got ' + totalMappings);
}

// Check group sizes
const groups = {};
Object.values(mappingData.spelling).forEach(e => {
  if (!groups[e.subConceptId]) groups[e.subConceptId] = 0;
  groups[e.subConceptId]++;
});

console.log('\nFinal group sizes:');
let belowThreshold = 0;
Object.entries(groups).sort((a,b) => a[1]-b[1]).forEach(([sc, count]) => {
  const flag = count < 15 ? ' <-- BELOW 15' : ' ✓';
  console.log('  ' + sc + ': ' + count + flag);
  if (count < 15) belowThreshold++;
});

if (belowThreshold > 0) {
  console.log('\n  WARNING: ' + belowThreshold + ' groups still below 15');
  errors++;
}

// Check difficulty distribution of new questions
const newDiffs = {1:0, 2:0, 3:0};
newQuestions.forEach(q => newDiffs[q.difficulty]++);
console.log('\nNew question difficulty: D1:' + newDiffs[1] + ' D2:' + newDiffs[2] + ' D3:' + newDiffs[3]);

// Check no-mistake count
const newNoMistake = newQuestions.filter(q => q.correct === 4).length;
console.log('New no-mistake questions: ' + newNoMistake);
console.log('Total no-mistake: ' + (43 + newNoMistake) + '/' + (330 + newQuestions.length) + ' (' + Math.round((43 + newNoMistake)/(330 + newQuestions.length)*100) + '%)');

// Check for duplicate question IDs in new questions
const newIds = newQuestions.map(q => q.id);
const dupNewIds = newIds.filter((id, i) => newIds.indexOf(id) !== i);
if (dupNewIds.length > 0) {
  console.log('ERROR: Duplicate IDs in new questions: ' + dupNewIds.join(', '));
  errors++;
} else {
  console.log('No duplicate IDs in new questions ✓');
}

// Check all new questions have 4 segments
const badSegs = newQuestions.filter(q => q.segments.length !== 4);
if (badSegs.length > 0) {
  console.log('ERROR: Questions with wrong segment count: ' + badSegs.map(q => 'Q' + q.id).join(', '));
  errors++;
} else {
  console.log('All new questions have 4 segments ✓');
}

// Check all correct indices are 0-4
const badCorrect = newQuestions.filter(q => q.correct < 0 || q.correct > 4);
if (badCorrect.length > 0) {
  console.log('ERROR: Invalid correct index: ' + badCorrect.map(q => 'Q' + q.id).join(', '));
  errors++;
} else {
  console.log('All correct indices valid (0-4) ✓');
}

// Check Q23 no longer has two errors
if (englishData.includes('definately recomend')) {
  console.log('ERROR: Q23 still has two errors');
  errors++;
} else {
  console.log('Q23 fixed — only one error per segment ✓');
}

// Position distribution of new questions
const newPos = {0:0,1:0,2:0,3:0,4:0};
newQuestions.forEach(q => newPos[q.correct]++);
console.log('\nNew question positions: A:'+newPos[0]+' B:'+newPos[1]+' C:'+newPos[2]+' D:'+newPos[3]+' E:'+newPos[4]);

if (errors > 0) {
  console.log('\n❌ VALIDATION FAILED with ' + errors + ' errors. NOT writing files.');
  process.exit(1);
}

// ============================================================
// WRITE FILES
// ============================================================
console.log('\n=== WRITING FILES ===\n');

fs.writeFileSync(ENGLISH_DATA, englishData, 'utf8');
console.log('Written: ' + ENGLISH_DATA);

fs.writeFileSync(MAPPING_FILE, JSON.stringify(mappingData, null, 2), 'utf8');
console.log('Written: ' + MAPPING_FILE);

console.log('\n✅ ALL FIXES APPLIED SUCCESSFULLY');
console.log('   - Q23 fixed (one error only)');
console.log('   - 32 questions reclassified');
console.log('   - ' + newQuestions.length + ' new questions added (Q331-Q420)');
console.log('   - Mapping file updated (' + totalMappings + ' entries)');
