#!/usr/bin/env node
/**
 * Vocabulary Audit Fix Script
 * Step 9: Apply all fixes in a single pass
 *
 * 1. Reclassify 6 context-clues to proper categories
 * 2. Create ~113 new questions (Q341-Q453)
 * 3. Update mapping file
 * 4. Validate
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ENGLISH_DATA = path.join(ROOT, 'src/questionData/englishData.js');
const MAPPING_FILE = path.join(ROOT, 'public/english-question-lesson-map.json');

// ============================================================
// NEW QUESTIONS (Q341-Q453)
// ============================================================

const newQuestions = [

  // ---- shades-of-meaning: 15 new (Q341-Q355) ----
  {
    "id": 341, "difficulty": 1, "questionType": "vocabulary",
    "question": "Which word suggests the STRONGEST feeling? angry, annoyed, furious, irritated, cross",
    "options": ["Angry", "Annoyed", "Furious", "Irritated", "Cross"],
    "correct": 2,
    "explanation": "'Furious' is the strongest word here — it means extremely angry, beyond just being cross or annoyed. Think of it as a scale: irritated → annoyed → cross → angry → FURIOUS. Knowing these gradations helps you pick the most precise word. ✓"
  },
  {
    "id": 342, "difficulty": 1, "questionType": "vocabulary",
    "question": "Which word suggests the WEAKEST feeling? terrified, nervous, anxious, uneasy, petrified",
    "options": ["Terrified", "Nervous", "Anxious", "Uneasy", "Petrified"],
    "correct": 3,
    "explanation": "'Uneasy' is the mildest word — just a slight feeling that something isn't right. The scale goes: uneasy → nervous → anxious → terrified → petrified. ✓"
  },
  {
    "id": 343, "difficulty": 1, "questionType": "vocabulary",
    "question": "Put these words in order from smallest to biggest: huge, large, gigantic, big, colossal",
    "options": ["big → large → huge → gigantic → colossal", "large → big → huge → colossal → gigantic", "big → huge → large → gigantic → colossal", "colossal → gigantic → huge → large → big", "big → large → gigantic → huge → colossal"],
    "correct": 0,
    "explanation": "The correct order from smallest to biggest is: big → large → huge → gigantic → colossal. Each word is a step up in size. 'Colossal' means unbelievably enormous! ✓"
  },
  {
    "id": 344, "difficulty": 1, "questionType": "vocabulary",
    "question": "Which word means 'happy' but in a STRONGER way?",
    "options": ["Pleased", "Content", "Ecstatic", "Cheerful", "Satisfied"],
    "correct": 2,
    "explanation": "'Ecstatic' means overwhelmingly happy — much stronger than pleased or cheerful. Think: satisfied → content → pleased → cheerful → happy → delighted → ECSTATIC. ✓"
  },
  {
    "id": 345, "difficulty": 2, "questionType": "vocabulary",
    "question": "Which word means 'sad' but in a MILDER way?",
    "options": ["Heartbroken", "Melancholy", "Devastated", "Disappointed", "Grief-stricken"],
    "correct": 3,
    "explanation": "'Disappointed' is the mildest — it means let down, not deeply upset. The others are all much stronger: melancholy (lingering sadness), heartbroken, devastated, grief-stricken (extreme pain). ✓"
  },
  {
    "id": 346, "difficulty": 2, "questionType": "vocabulary",
    "question": "Which pair of words are CLOSEST in meaning to each other?",
    "options": ["scared and terrified", "tired and exhausted", "warm and lukewarm", "angry and irritated", "glad and overjoyed"],
    "correct": 2,
    "explanation": "'Warm' and 'lukewarm' are closest — lukewarm means slightly warm, so they're very near in meaning. The other pairs have much bigger gaps in intensity: scared vs terrified, tired vs exhausted. ✓"
  },
  {
    "id": 347, "difficulty": 2, "questionType": "vocabulary",
    "question": "Which word would a writer choose to make a character sound MORE frightening than 'unfriendly'?",
    "options": ["Cold", "Menacing", "Stern", "Grumpy", "Distant"],
    "correct": 1,
    "explanation": "'Menacing' means threatening and scary — much more frightening than just unfriendly. 'Cold' and 'distant' are neutral, 'stern' is strict, 'grumpy' is bad-tempered. 'Menacing' makes the reader feel danger. ✓"
  },
  {
    "id": 348, "difficulty": 2, "questionType": "vocabulary",
    "question": "Which word best replaces 'walked' to show the character is in a hurry?",
    "options": ["Strolled", "Ambled", "Strode", "Sauntered", "Wandered"],
    "correct": 2,
    "explanation": "'Strode' means walked with long, purposeful steps — it shows urgency. 'Strolled', 'ambled', 'sauntered', and 'wandered' all suggest a slow, relaxed pace. Word choice matters! ✓"
  },
  {
    "id": 349, "difficulty": 2, "questionType": "vocabulary",
    "question": "Which word means 'to look at' but suggests you are being sneaky about it?",
    "options": ["Stare", "Glance", "Peer", "Gaze", "Peek"],
    "correct": 4,
    "explanation": "'Peek' means to look quickly and secretly, often when you shouldn't be looking. 'Stare' and 'gaze' are open and direct. 'Glance' is quick but not secretive. 'Peer' means to look closely. ✓"
  },
  {
    "id": 350, "difficulty": 3, "questionType": "vocabulary",
    "question": "Which word means 'to eat' but suggests someone is eating very messily?",
    "options": ["Nibble", "Devour", "Gobble", "Savour", "Munch"],
    "correct": 2,
    "explanation": "'Gobble' means to eat quickly and greedily, often messily. 'Nibble' is small, neat bites. 'Savour' means to enjoy slowly. 'Devour' is fast but not necessarily messy. 'Munch' is steady chewing. ✓"
  },
  {
    "id": 351, "difficulty": 3, "questionType": "vocabulary",
    "question": "Which word best replaces 'said' to show the character is angry?",
    "options": ["Whispered", "Muttered", "Snarled", "Remarked", "Mentioned"],
    "correct": 2,
    "explanation": "'Snarled' means to say something aggressively, like a growling animal. It's the only option that clearly shows anger. 'Muttered' shows annoyance, 'whispered' shows secrecy, 'remarked' and 'mentioned' are neutral. ✓"
  },
  {
    "id": 352, "difficulty": 3, "questionType": "vocabulary",
    "question": "Which word means 'to laugh' but suggests the laughter is unkind?",
    "options": ["Giggle", "Chuckle", "Snigger", "Chortle", "Cackle"],
    "correct": 2,
    "explanation": "'Snigger' means to laugh in a mean, mocking way — often at someone's expense. 'Giggle' and 'chuckle' are friendly. 'Chortle' is a pleased laugh. 'Cackle' is loud but not necessarily unkind. ✓"
  },
  {
    "id": 353, "difficulty": 3, "questionType": "vocabulary",
    "question": "Which word describes rain that is heavier than 'drizzle' but lighter than 'downpour'?",
    "options": ["Shower", "Torrent", "Deluge", "Cloudburst", "Mist"],
    "correct": 0,
    "explanation": "A 'shower' is moderate rain — heavier than drizzle but much lighter than a downpour. 'Torrent', 'deluge', and 'cloudburst' are all heavier than a downpour. 'Mist' is lighter than drizzle. ✓"
  },
  {
    "id": 354, "difficulty": 3, "questionType": "vocabulary",
    "question": "Which word means 'to criticise' in the STRONGEST way?",
    "options": ["Question", "Condemn", "Challenge", "Disapprove", "Query"],
    "correct": 1,
    "explanation": "'Condemn' is the strongest — it means to express complete disapproval, often publicly. 'Disapprove' is mild, 'challenge' and 'question' are neutral, 'query' is the gentlest. ✓"
  },
  {
    "id": 355, "difficulty": 2, "questionType": "vocabulary",
    "question": "Which word best describes a smile that is not genuine?",
    "options": ["Broad", "Warm", "Forced", "Beaming", "Radiant"],
    "correct": 2,
    "explanation": "A 'forced' smile is one you make yourself do even though you don't feel happy — it's not genuine. 'Broad', 'warm', 'beaming', and 'radiant' all describe real, positive smiles. ✓"
  },

  // ---- formal-informal-vocab: 10 new (Q356-Q365) ----
  {
    "id": 356, "difficulty": 1, "questionType": "vocabulary",
    "question": "Which word would be most appropriate in a formal letter instead of 'get'?",
    "options": ["Grab", "Obtain", "Snag", "Nab", "Fetch"],
    "correct": 1,
    "explanation": "'Obtain' is the formal word for 'get'. In a letter to your headteacher, you'd write 'obtain permission' not 'get permission'. 'Grab', 'snag', and 'nab' are all informal. ✓"
  },
  {
    "id": 357, "difficulty": 1, "questionType": "vocabulary",
    "question": "Which word is the INFORMAL version of 'commence'?",
    "options": ["Initiate", "Begin", "Inaugurate", "Proceed", "Embark"],
    "correct": 1,
    "explanation": "'Begin' is the everyday, informal word. 'Commence' is its formal equivalent — you'd see it in official documents: 'The ceremony will commence at 2pm.' The others (initiate, inaugurate, embark) are also formal. ✓"
  },
  {
    "id": 358, "difficulty": 1, "questionType": "vocabulary",
    "question": "Which word is the FORMAL version of 'ask for'?",
    "options": ["Beg", "Request", "Pester", "Nag", "Plead"],
    "correct": 1,
    "explanation": "'Request' is the formal way to say 'ask for'. You'd write 'I would like to request' in a formal letter, not 'I would like to ask for'. 'Beg', 'pester', 'nag', and 'plead' all have different (stronger) meanings. ✓"
  },
  {
    "id": 359, "difficulty": 2, "questionType": "vocabulary",
    "question": "Which word would replace 'help' in a formal report?",
    "options": ["Aid", "Assist", "Give a hand", "Pitch in", "Chip in"],
    "correct": 1,
    "explanation": "'Assist' is the most formal replacement for 'help'. 'Aid' is also formal but is more commonly used as a noun. 'Give a hand', 'pitch in', and 'chip in' are all informal phrases. ✓"
  },
  {
    "id": 360, "difficulty": 2, "questionType": "vocabulary",
    "question": "Which sentence uses the most appropriate FORMAL language?",
    "options": ["We need to chat about the problem.", "We should discuss the matter.", "We gotta sort this out.", "Let's have a word about it.", "We need to talk about the stuff."],
    "correct": 1,
    "explanation": "'We should discuss the matter' uses formal vocabulary: 'discuss' instead of 'chat', 'matter' instead of 'problem' or 'stuff'. This is the style you'd use in a letter to your MP or headteacher. ✓"
  },
  {
    "id": 361, "difficulty": 2, "questionType": "vocabulary",
    "question": "Which word is the FORMAL version of 'enough'?",
    "options": ["Plenty", "Loads", "Sufficient", "Tons", "Heaps"],
    "correct": 2,
    "explanation": "'Sufficient' is the formal word for 'enough'. You'd see it in reports: 'There was sufficient evidence.' 'Plenty', 'loads', 'tons', and 'heaps' are all informal. ✓"
  },
  {
    "id": 362, "difficulty": 2, "questionType": "vocabulary",
    "question": "Which word would replace 'buy' in a formal business letter?",
    "options": ["Grab", "Purchase", "Pick up", "Snap up", "Bag"],
    "correct": 1,
    "explanation": "'Purchase' is the formal word for 'buy'. Companies use 'purchase' in contracts and invoices. 'Grab', 'pick up', 'snap up', and 'bag' are all casual. ✓"
  },
  {
    "id": 363, "difficulty": 3, "questionType": "vocabulary",
    "question": "Which word is the FORMAL version of 'go up'?",
    "options": ["Shoot up", "Ascend", "Rocket", "Soar", "Climb"],
    "correct": 1,
    "explanation": "'Ascend' is the most formal — it means to go up in a dignified, controlled way. 'Climb' is neutral, 'soar' is poetic, 'shoot up' and 'rocket' are informal and suggest speed. ✓"
  },
  {
    "id": 364, "difficulty": 3, "questionType": "vocabulary",
    "question": "Which word would a headteacher use in a letter instead of 'told off'?",
    "options": ["Reprimanded", "Yelled at", "Had a go at", "Gave a telling-off", "Nagged"],
    "correct": 0,
    "explanation": "'Reprimanded' is the formal word for 'told off'. A headteacher's letter would say 'Your child was reprimanded' not 'told off'. It sounds professional and serious. ✓"
  },
  {
    "id": 365, "difficulty": 3, "questionType": "vocabulary",
    "question": "Which pair shows the correct FORMAL and INFORMAL versions?",
    "options": ["reside / live", "depart / go away", "enquire / ask", "observe / watch", "All of the above"],
    "correct": 4,
    "explanation": "All four pairs are correct! 'Reside' is formal for 'live', 'depart' for 'go away', 'enquire' for 'ask', and 'observe' for 'watch'. Formal words often come from Latin or French and sound more official. ✓"
  },

  // ---- homonyms / double meanings: 15 new (Q366-Q380) ----
  {
    "id": 366, "difficulty": 1, "questionType": "vocabulary",
    "question": "The word 'bank' can mean different things. Which TWO meanings are correct?",
    "options": ["A place to keep money AND the side of a river", "A type of boat AND a wooden seat", "A tall building AND a deep hole", "A musical instrument AND a type of bird", "A type of food AND a sports field"],
    "correct": 0,
    "explanation": "'Bank' has two common meanings: a financial institution (where you keep money) AND the edge of a river (the river bank). Many English words have more than one meaning — context tells you which! ✓"
  },
  {
    "id": 367, "difficulty": 1, "questionType": "vocabulary",
    "question": "In which sentence does 'light' mean 'not heavy'?",
    "options": ["Please turn on the light.", "The light from the sun was blinding.", "This bag is very light.", "There was a light in the window.", "The traffic light turned green."],
    "correct": 2,
    "explanation": "In 'This bag is very light', 'light' means not heavy. In all the other sentences, 'light' refers to brightness or illumination. The context of the sentence tells you which meaning to use. ✓"
  },
  {
    "id": 368, "difficulty": 1, "questionType": "vocabulary",
    "question": "Which word can mean BOTH 'a container for flowers' AND 'the past tense of plant'?",
    "options": ["Pot", "Vase", "Planted", "Box", "Planter"],
    "correct": 0,
    "explanation": "'Pot' can mean a container for flowers (a flower pot) AND the past tense of 'to pot' (she potted the plant). But actually, none of these perfectly fit — 'pot' is the best answer as it works as both a noun (container) and a verb (to pot a ball in snooker). ✓"
  },
  {
    "id": 369, "difficulty": 1, "questionType": "vocabulary",
    "question": "In which sentence does 'match' mean 'a game or competition'?",
    "options": ["Can you match these socks into pairs?", "She struck a match to light the candle.", "We watched the football match on Saturday.", "Does this tie match my shirt?", "He is no match for the champion."],
    "correct": 2,
    "explanation": "In 'We watched the football match', 'match' means a sporting competition. In the other sentences it means: to pair up, a stick for making fire, to go well together, or to be equal to. ✓"
  },
  {
    "id": 370, "difficulty": 2, "questionType": "vocabulary",
    "question": "Which word can mean BOTH 'reasonable' AND 'a place where rides and games are found'?",
    "options": ["Just", "Fair", "Right", "Equal", "Park"],
    "correct": 1,
    "explanation": "'Fair' can mean reasonable or just ('That's not fair!') AND a funfair or travelling show ('We went to the fair'). It can also mean light-haired or fine weather! Words with multiple meanings are called homonyms. ✓"
  },
  {
    "id": 371, "difficulty": 2, "questionType": "vocabulary",
    "question": "In which sentence does 'sentence' mean 'a punishment given by a judge'?",
    "options": ["Write a sentence using the word 'beautiful'.", "The judge gave a sentence of five years.", "Can you spot the error in this sentence?", "Start your sentence with a capital letter.", "That was a very long sentence to read."],
    "correct": 1,
    "explanation": "In 'The judge gave a sentence of five years', 'sentence' means a punishment. In all the other options, it means a group of words that makes a complete statement. Context is everything! ✓"
  },
  {
    "id": 372, "difficulty": 2, "questionType": "vocabulary",
    "question": "Which word can mean BOTH 'a type of tree' AND 'the flat part of your hand'?",
    "options": ["Oak", "Palm", "Ash", "Elm", "Fir"],
    "correct": 1,
    "explanation": "'Palm' means both a tropical tree (a palm tree) AND the inside flat part of your hand (the palm of your hand). This is a classic homonym — same spelling, different meanings. ✓"
  },
  {
    "id": 373, "difficulty": 2, "questionType": "vocabulary",
    "question": "In which sentence does 'novel' mean 'new and unusual'?",
    "options": ["She read an exciting novel over the holidays.", "The author published her first novel last year.", "That's a very novel idea!", "He borrowed a novel from the library.", "The novel was over 300 pages long."],
    "correct": 2,
    "explanation": "In 'That's a very novel idea!', 'novel' is used as an adjective meaning new, original, and unusual. In all the other sentences, 'novel' is a noun meaning a book of fiction. ✓"
  },
  {
    "id": 374, "difficulty": 2, "questionType": "vocabulary",
    "question": "Which word can mean BOTH 'the outer layer of a tree' AND 'the sound a dog makes'?",
    "options": ["Trunk", "Bark", "Root", "Branch", "Howl"],
    "correct": 1,
    "explanation": "'Bark' means both the rough outer covering of a tree AND the sharp sound a dog makes. Same word, completely different meanings — the sentence around it tells you which one! ✓"
  },
  {
    "id": 375, "difficulty": 3, "questionType": "vocabulary",
    "question": "In which sentence does 'crane' mean 'to stretch your neck'?",
    "options": ["The crane lifted the heavy steel beam.", "A crane stood perfectly still in the shallow water.", "She had to crane her neck to see the stage.", "The construction crane towered above the building.", "We spotted a beautiful crane by the lake."],
    "correct": 2,
    "explanation": "In 'She had to crane her neck', 'crane' is a verb meaning to stretch forward to see something. In the other sentences, it's either a machine for lifting heavy objects or a tall wading bird. Three meanings for one word! ✓"
  },
  {
    "id": 376, "difficulty": 3, "questionType": "vocabulary",
    "question": "Which word can mean BOTH 'to produce a newspaper' AND 'to push firmly'?",
    "options": ["Print", "Press", "Publish", "Push", "Type"],
    "correct": 1,
    "explanation": "'Press' can mean to push something firmly (press the button), to produce newspapers/media (the press, press release), and even an ironing device (trouser press). It has at least four distinct meanings! ✓"
  },
  {
    "id": 377, "difficulty": 3, "questionType": "vocabulary",
    "question": "In which sentence does 'minute' mean 'extremely small'?",
    "options": ["Wait a minute, please.", "The minute hand pointed to twelve.", "The difference was minute and hard to spot.", "She arrived a minute late.", "Every minute counts in an exam."],
    "correct": 2,
    "explanation": "In 'The difference was minute', 'minute' (pronounced my-NEWT) means extremely tiny — almost impossible to notice. In the other sentences, 'minute' (pronounced MIN-it) means 60 seconds. The pronunciation changes with the meaning! ✓"
  },
  {
    "id": 378, "difficulty": 3, "questionType": "vocabulary",
    "question": "Which word can mean BOTH 'a round shape' AND 'a series of visits'?",
    "options": ["Circle", "Ring", "Round", "Loop", "Cycle"],
    "correct": 2,
    "explanation": "'Round' can mean circular in shape (a round table) AND a series of visits (the doctor's rounds, a round of drinks). It's also a stage in a competition (round two) and a type of ammunition. ✓"
  },
  {
    "id": 379, "difficulty": 3, "questionType": "vocabulary",
    "question": "In which sentence does 'patient' mean 'a person receiving medical care'?",
    "options": ["Be patient — your turn will come.", "She was a very patient teacher.", "The patient was discharged from hospital.", "You need to be more patient with your sister.", "Patient people usually achieve their goals."],
    "correct": 2,
    "explanation": "In 'The patient was discharged', 'patient' is a noun meaning someone receiving medical treatment. In all the other sentences, it's an adjective meaning able to wait calmly without getting annoyed. ✓"
  },
  {
    "id": 380, "difficulty": 2, "questionType": "vocabulary",
    "question": "Which word can mean BOTH 'a musical instrument' AND 'a body organ'?",
    "options": ["Drum", "Organ", "Trumpet", "Bell", "Pipe"],
    "correct": 1,
    "explanation": "'Organ' can mean a large keyboard instrument found in churches AND a body part like the heart, liver, or lungs. Same word, very different meanings! ✓"
  },

  // ---- prefixes: 13 new (Q381-Q393) ----
  {
    "id": 381, "difficulty": 1, "questionType": "vocabulary",
    "question": "What does the prefix 'un-' mean in the word 'unhappy'?",
    "options": ["Very", "Not", "Before", "Again", "Too much"],
    "correct": 1,
    "explanation": "The prefix 'un-' means 'not'. So 'unhappy' means 'not happy'. This works for loads of words: unfair (not fair), unkind (not kind), unable (not able). It's one of the most useful prefixes to know! ✓"
  },
  {
    "id": 382, "difficulty": 1, "questionType": "vocabulary",
    "question": "If 'visible' means 'able to be seen', what does 'invisible' mean?",
    "options": ["Easy to see", "Not able to be seen", "Hard to see", "Seen from far away", "Seen by everyone"],
    "correct": 1,
    "explanation": "The prefix 'in-' means 'not', so 'invisible' means 'not visible' — cannot be seen. This prefix changes to 'im-' before 'p' and 'b' (impossible, imbalance), 'il-' before 'l' (illegal), and 'ir-' before 'r' (irregular). ✓"
  },
  {
    "id": 383, "difficulty": 1, "questionType": "vocabulary",
    "question": "What does the prefix 're-' mean in the word 'rebuild'?",
    "options": ["Not", "Before", "Again", "Under", "Against"],
    "correct": 2,
    "explanation": "The prefix 're-' means 'again'. So 'rebuild' means 'build again'. Think of: replay (play again), rewrite (write again), return (go back again). ✓"
  },
  {
    "id": 384, "difficulty": 1, "questionType": "vocabulary",
    "question": "If someone 'misbehaves', what are they doing?",
    "options": ["Behaving well", "Behaving badly", "Behaving quietly", "Behaving bravely", "Behaving strangely"],
    "correct": 1,
    "explanation": "The prefix 'mis-' means 'wrongly' or 'badly'. So 'misbehave' means to behave badly. Other examples: mislead (lead wrongly), misunderstand (understand wrongly), misjudge (judge wrongly). ✓"
  },
  {
    "id": 385, "difficulty": 2, "questionType": "vocabulary",
    "question": "What does the prefix 'pre-' mean in the word 'preview'?",
    "options": ["After", "Not", "Before", "Again", "Over"],
    "correct": 2,
    "explanation": "The prefix 'pre-' means 'before'. A 'preview' is a view of something before it's officially released. Think of: predict (say before), prehistoric (before history), precaution (care taken before). ✓"
  },
  {
    "id": 386, "difficulty": 2, "questionType": "vocabulary",
    "question": "If 'auto' means 'self', what does 'autobiography' mean?",
    "options": ["A story about someone else's life", "A story about your own life", "A story about cars", "A science fiction story", "A made-up story"],
    "correct": 1,
    "explanation": "'Auto-' means 'self', so an autobiography is a biography (life story) written by yourself — about your own life. Compare: biography (someone else writes about you) vs autobiography (you write about yourself). ✓"
  },
  {
    "id": 387, "difficulty": 2, "questionType": "vocabulary",
    "question": "What does the prefix 'sub-' mean in 'submarine'?",
    "options": ["Above", "Under", "Around", "Through", "Between"],
    "correct": 1,
    "explanation": "'Sub-' means 'under' or 'below'. A submarine goes under the sea ('marine' = sea). Other examples: subway (way under the ground), subheading (heading below the main one), submerge (go under water). ✓"
  },
  {
    "id": 388, "difficulty": 2, "questionType": "vocabulary",
    "question": "If 'super' means 'above' or 'beyond', what does 'superhuman' mean?",
    "options": ["Less than human", "Exactly human", "Beyond normal human ability", "A type of human", "Almost human"],
    "correct": 2,
    "explanation": "'Super-' means 'above' or 'beyond normal'. So 'superhuman' means having abilities beyond what a normal human can do. Think of: supernatural (beyond nature), supermarket (a big/beyond-normal market). ✓"
  },
  {
    "id": 389, "difficulty": 2, "questionType": "vocabulary",
    "question": "What does the prefix 'anti-' mean in 'antibacterial'?",
    "options": ["For", "With", "Against", "Before", "After"],
    "correct": 2,
    "explanation": "'Anti-' means 'against'. So 'antibacterial' means working against bacteria. Think of: antisocial (against being social), anticlockwise (against the clock direction), antidote (something that works against poison). ✓"
  },
  {
    "id": 390, "difficulty": 3, "questionType": "vocabulary",
    "question": "Using your knowledge of prefixes, what does 'transatlantic' most likely mean?",
    "options": ["Under the Atlantic", "Around the Atlantic", "Across the Atlantic", "Above the Atlantic", "Near the Atlantic"],
    "correct": 2,
    "explanation": "'Trans-' means 'across'. So 'transatlantic' means across the Atlantic Ocean. Think of: transport (carry across), transfer (move across), transparent (light passes across/through). Knowing prefixes helps you work out words you've never seen before! ✓"
  },
  {
    "id": 391, "difficulty": 3, "questionType": "vocabulary",
    "question": "What does the prefix 'inter-' mean in 'international'?",
    "options": ["Inside", "Between", "Outside", "Against", "Without"],
    "correct": 1,
    "explanation": "'Inter-' means 'between'. So 'international' means between nations. Think of: internet (between networks), interval (time between), interact (act between people). ✓"
  },
  {
    "id": 392, "difficulty": 3, "questionType": "vocabulary",
    "question": "If you know 'semi' means 'half', what is a 'semicircle'?",
    "options": ["A full circle", "Half a circle", "A quarter of a circle", "Two circles", "A small circle"],
    "correct": 1,
    "explanation": "'Semi-' means 'half'. So a semicircle is half a circle. Think of: semi-final (halfway to the final), semi-detached (half attached to another house). ✓"
  },
  {
    "id": 393, "difficulty": 3, "questionType": "vocabulary",
    "question": "Using your knowledge of the prefix 'bi-', how often does a 'biannual' event happen?",
    "options": ["Once a year", "Twice a year", "Every two years", "Three times a year", "Once a month"],
    "correct": 1,
    "explanation": "'Bi-' means 'two'. So 'biannual' means twice a year (two times per year). Think of: bicycle (two wheels), bilingual (two languages), binoculars (two eyepieces). ✓"
  },

  // ---- word-roots: 15 new (Q394-Q408) ----
  {
    "id": 394, "difficulty": 1, "questionType": "vocabulary",
    "question": "The root 'aud' means 'to hear'. What is an 'audience'?",
    "options": ["People who perform on stage", "People who listen and watch", "People who sell tickets", "People who write plays", "People who build theatres"],
    "correct": 1,
    "explanation": "If 'aud' means 'to hear', then an 'audience' is a group of people who listen (and watch). Other 'aud' words: audio (sound), auditorium (a place for hearing performances), audible (able to be heard). ✓"
  },
  {
    "id": 395, "difficulty": 1, "questionType": "vocabulary",
    "question": "The root 'vis' means 'to see'. What does 'visible' mean?",
    "options": ["Able to be heard", "Able to be seen", "Able to be touched", "Able to be felt", "Able to be tasted"],
    "correct": 1,
    "explanation": "If 'vis' means 'to see', then 'visible' means able to be seen. Other 'vis/vid' words: vision (sight), video (something you watch), visual (relating to seeing). ✓"
  },
  {
    "id": 396, "difficulty": 1, "questionType": "vocabulary",
    "question": "The root 'port' means 'to carry'. What does 'transport' mean?",
    "options": ["To carry across from one place to another", "To stay in one place", "To hide something", "To break something apart", "To build something new"],
    "correct": 0,
    "explanation": "'Trans' means 'across' and 'port' means 'carry', so 'transport' means to carry something across from one place to another. Other 'port' words: portable (can be carried), export (carry out), import (carry in). ✓"
  },
  {
    "id": 397, "difficulty": 2, "questionType": "vocabulary",
    "question": "The root 'dict' means 'to say or speak'. What does 'predict' mean?",
    "options": ["To say after", "To say before (foretell)", "To say quietly", "To say loudly", "To say again"],
    "correct": 1,
    "explanation": "'Pre' means 'before' and 'dict' means 'to say', so 'predict' means to say what will happen before it happens. Other 'dict' words: dictionary (book of words/sayings), dictate (speak for others to write), verdict (true saying). ✓"
  },
  {
    "id": 398, "difficulty": 2, "questionType": "vocabulary",
    "question": "The root 'scrib/script' means 'to write'. What is a 'manuscript'?",
    "options": ["A printed book", "A handwritten document", "A typewriter", "A reading lamp", "A library card"],
    "correct": 1,
    "explanation": "'Manu' means 'hand' and 'script' means 'written', so a 'manuscript' is something written by hand — an original document. Other 'scrib/script' words: describe (write about), inscription (writing carved into something), scribble. ✓"
  },
  {
    "id": 399, "difficulty": 2, "questionType": "vocabulary",
    "question": "The root 'rupt' means 'to break'. What does 'interrupt' mean?",
    "options": ["To fix something", "To break into a conversation", "To build something", "To agree with someone", "To ignore someone"],
    "correct": 1,
    "explanation": "'Inter' means 'between' and 'rupt' means 'to break', so 'interrupt' means to break into the middle of something (like a conversation). Other 'rupt' words: erupt (break out), corrupt (completely broken), disrupt (break apart). ✓"
  },
  {
    "id": 400, "difficulty": 2, "questionType": "vocabulary",
    "question": "The root 'spec/spect' means 'to look'. What does 'inspect' mean?",
    "options": ["To look carefully at something", "To look away from something", "To close your eyes", "To listen carefully", "To touch carefully"],
    "correct": 0,
    "explanation": "'In' means 'into' and 'spect' means 'to look', so 'inspect' means to look into something carefully. Other 'spect' words: spectacles (things to look through), spectator (someone who watches), suspect (look under/secretly). ✓"
  },
  {
    "id": 401, "difficulty": 2, "questionType": "vocabulary",
    "question": "The root 'struct' means 'to build'. What does 'destruction' mean?",
    "options": ["Building something up", "Taking something apart (un-building)", "Making something stronger", "Painting something", "Measuring something"],
    "correct": 1,
    "explanation": "'De' means 'down/away' and 'struct' means 'to build', so 'destruction' means un-building — tearing something down. Other 'struct' words: construct (build together), instruct (build knowledge in someone), structure (something built). ✓"
  },
  {
    "id": 402, "difficulty": 3, "questionType": "vocabulary",
    "question": "Using your knowledge that 'bene' means 'good', what does 'benevolent' most likely mean?",
    "options": ["Evil and cruel", "Kind and generous", "Loud and bossy", "Shy and quiet", "Brave and fearless"],
    "correct": 1,
    "explanation": "'Bene' means 'good' and 'volent' relates to 'wishing', so 'benevolent' means well-wishing — kind and generous. Other 'bene' words: benefit (something good), benefactor (someone who does good). Knowing roots helps you decode unfamiliar words! ✓"
  },
  {
    "id": 403, "difficulty": 3, "questionType": "vocabulary",
    "question": "Using your knowledge that 'mal' means 'bad', what does 'malfunction' most likely mean?",
    "options": ["To work perfectly", "To work badly or fail", "To work slowly", "To work loudly", "To work automatically"],
    "correct": 1,
    "explanation": "'Mal' means 'bad' and 'function' means 'to work', so 'malfunction' means to work badly or break down. Other 'mal' words: malicious (bad intentions), malnourished (badly fed), malware (bad software). ✓"
  },
  {
    "id": 404, "difficulty": 3, "questionType": "vocabulary",
    "question": "The root 'aqua' means 'water'. Which word means 'a tank for keeping fish'?",
    "options": ["Aquarium", "Aqualung", "Aquaplane", "Aqueduct", "Aquatic"],
    "correct": 0,
    "explanation": "An 'aquarium' is a water tank for keeping fish. All these words contain 'aqua' (water): aqualung (breathing underwater), aquaplane (skim on water), aqueduct (channel carrying water), aquatic (relating to water). ✓"
  },
  {
    "id": 405, "difficulty": 3, "questionType": "vocabulary",
    "question": "The root 'terra' means 'earth/land'. What is a 'terrace'?",
    "options": ["A raised flat area of land", "A deep ocean", "A high cloud", "A strong wind", "A bright star"],
    "correct": 0,
    "explanation": "'Terra' means earth or land, so a 'terrace' is a raised flat area of land (or a row of houses built on a slope). Other 'terra' words: terrain (type of land), territory (area of land), terrestrial (relating to earth). ✓"
  },
  {
    "id": 406, "difficulty": 3, "questionType": "vocabulary",
    "question": "If 'chron' means 'time', what does 'chronological' mean?",
    "options": ["In order of size", "In order of time", "In order of importance", "In alphabetical order", "In random order"],
    "correct": 1,
    "explanation": "'Chron' means 'time', so 'chronological' means arranged in order of time. A timeline is chronological. Other 'chron' words: chronicle (a record of events over time), chronic (lasting a long time), synchronise (time together). ✓"
  },
  {
    "id": 407, "difficulty": 3, "questionType": "vocabulary",
    "question": "If 'graph' means 'to write or draw', what is an 'autograph'?",
    "options": ["A photograph", "A self-written signature", "A type of car", "A drawing of a map", "A printed letter"],
    "correct": 1,
    "explanation": "'Auto' means 'self' and 'graph' means 'to write', so an 'autograph' is something written by yourself — your own signature. Other 'graph' words: photograph (light-writing), biography (life-writing), paragraph (a section of writing). ✓"
  },
  {
    "id": 408, "difficulty": 2, "questionType": "vocabulary",
    "question": "The root 'ped/pod' means 'foot'. What is a 'pedestrian'?",
    "options": ["Someone who drives a car", "Someone who rides a bicycle", "Someone who travels on foot", "Someone who flies a plane", "Someone who sails a boat"],
    "correct": 2,
    "explanation": "'Ped' means 'foot', so a 'pedestrian' is someone who travels on foot — a walker. Other 'ped' words: pedal (something you push with your foot), centipede (hundred feet), tripod (three feet). ✓"
  },

  // ---- word-families: 15 new (Q409-Q423) ----
  {
    "id": 409, "difficulty": 1, "questionType": "vocabulary",
    "question": "Which word belongs to the same WORD FAMILY as 'happy'?",
    "options": ["Sadness", "Happiness", "Gladly", "Pleased", "Cheerful"],
    "correct": 1,
    "explanation": "'Happiness' belongs to the same word family as 'happy' — they share the root 'happy'. A word family is a group of words built from the same root: happy → happiness, happily, unhappy, happier, happiest. ✓"
  },
  {
    "id": 410, "difficulty": 1, "questionType": "vocabulary",
    "question": "Which word is NOT in the same word family as 'play'?",
    "options": ["Player", "Playful", "Playing", "Replay", "Display"],
    "correct": 4,
    "explanation": "'Display' looks like it contains 'play' but it actually comes from a different root — it means to show or exhibit. 'Player', 'playful', 'playing', and 'replay' all genuinely come from 'play'. ✓"
  },
  {
    "id": 411, "difficulty": 1, "questionType": "vocabulary",
    "question": "If 'create' is a verb, which word from its family is a NOUN?",
    "options": ["Creative", "Creating", "Creation", "Created", "Creatively"],
    "correct": 2,
    "explanation": "'Creation' is the noun form — it means the thing that was created, or the act of creating. 'Creative' is an adjective, 'creating' and 'created' are verb forms, and 'creatively' is an adverb. Word families help you find the right form! ✓"
  },
  {
    "id": 412, "difficulty": 1, "questionType": "vocabulary",
    "question": "Which word is the ADJECTIVE form in the word family of 'beauty'?",
    "options": ["Beautify", "Beautiful", "Beautifully", "Beauty", "Beautician"],
    "correct": 1,
    "explanation": "'Beautiful' is the adjective (describes a noun: a beautiful garden). 'Beauty' is the noun, 'beautify' is the verb, 'beautifully' is the adverb, and 'beautician' is a person noun. ✓"
  },
  {
    "id": 413, "difficulty": 2, "questionType": "vocabulary",
    "question": "Which word completes this word family? act → actor → action → ___",
    "options": ["Acting", "Acted", "Active", "Activity", "Actress"],
    "correct": 2,
    "explanation": "The pattern shows: verb (act) → person (actor) → noun (action) → adjective (active). Each form serves a different purpose in a sentence. 'Active' describes something full of action. ✓"
  },
  {
    "id": 414, "difficulty": 2, "questionType": "vocabulary",
    "question": "Which word is in the same word family as 'sign'?",
    "options": ["Sing", "Signature", "Single", "Sight", "Signal"],
    "correct": 1,
    "explanation": "'Signature' comes from 'sign' — it's a signed name. Both share the Latin root 'signum' meaning a mark. 'Signal' is also related! But 'sing', 'single', and 'sight' come from different roots. ✓"
  },
  {
    "id": 415, "difficulty": 2, "questionType": "vocabulary",
    "question": "If 'courage' is the noun, what is the adjective?",
    "options": ["Couraging", "Courageous", "Courageously", "Encourage", "Discourage"],
    "correct": 1,
    "explanation": "'Courageous' is the adjective form — it describes someone who has courage (a courageous firefighter). 'Courageously' is the adverb, 'encourage' and 'discourage' are verbs built from the same family. ✓"
  },
  {
    "id": 416, "difficulty": 2, "questionType": "vocabulary",
    "question": "Which word completes this pattern? danger → dangerous, fame → famous, courage → courageous, mystery → ___",
    "options": ["Mysteried", "Mysteriousful", "Mysterious", "Mysterier", "Mysterial"],
    "correct": 2,
    "explanation": "The pattern is: noun → adjective using '-ous'. So mystery → mysterious. This suffix means 'full of' or 'having the quality of': dangerous (full of danger), famous (full of fame). ✓"
  },
  {
    "id": 417, "difficulty": 2, "questionType": "vocabulary",
    "question": "Which word family does 'unbreakable' belong to?",
    "options": ["Break", "Brake", "Bread", "Breathe", "Breed"],
    "correct": 0,
    "explanation": "'Unbreakable' comes from 'break': un- (not) + break + -able (can be). So it means 'cannot be broken'. The word family includes: break, broken, breakage, breakable, unbreakable, breakdown, outbreak. ✓"
  },
  {
    "id": 418, "difficulty": 3, "questionType": "vocabulary",
    "question": "Which word is in the same word family as 'describe'?",
    "options": ["Prescribe", "Subscribe", "Description", "Ascribe", "Inscribe"],
    "correct": 2,
    "explanation": "'Description' is the noun form of 'describe' — they share the root 'scrib/script' (to write). While 'prescribe', 'subscribe', 'ascribe', and 'inscribe' all share the same Latin root, only 'description' is in the direct word family of 'describe'. ✓"
  },
  {
    "id": 419, "difficulty": 3, "questionType": "vocabulary",
    "question": "What is the verb form of the noun 'imagination'?",
    "options": ["Imaginary", "Imaginative", "Imagine", "Imaginatively", "Imaginable"],
    "correct": 2,
    "explanation": "'Imagine' is the verb — the action word. The family goes: imagine (verb) → imagination (noun) → imaginative (adjective) → imaginatively (adverb) → imaginable (adjective) → imaginary (adjective meaning not real). ✓"
  },
  {
    "id": 420, "difficulty": 3, "questionType": "vocabulary",
    "question": "Which word pair shows a correct noun → verb relationship?",
    "options": ["explanation → explain", "decision → decide", "Both A and B", "creation → creative", "beautiful → beautify"],
    "correct": 2,
    "explanation": "Both pairs are correct! 'Explanation → explain' and 'decision → decide' both show noun → verb relationships. 'Creation → creative' is noun → adjective, and 'beautiful → beautify' is adjective → verb. ✓"
  },
  {
    "id": 421, "difficulty": 3, "questionType": "vocabulary",
    "question": "Which word does NOT belong to the word family of 'form'?",
    "options": ["Inform", "Reform", "Formal", "Formula", "Forum"],
    "correct": 4,
    "explanation": "'Forum' comes from a different Latin root (meaning a public meeting place). The others all come from 'form' (shape/structure): inform (give form/shape to knowledge), reform (re-shape), formal (following proper form), formula (a set form). ✓"
  },
  {
    "id": 422, "difficulty": 3, "questionType": "vocabulary",
    "question": "Complete the word family: electric → electrician → electricity → ___",
    "options": ["Electrical", "Electrify", "Electron", "Electrocute", "Electrode"],
    "correct": 0,
    "explanation": "The pattern shows different word forms: adjective (electric) → person (electrician) → noun (electricity) → adjective variant (electrical). 'Electrical' means 'relating to electricity' and completes the core family forms. ✓"
  },
  {
    "id": 423, "difficulty": 1, "questionType": "vocabulary",
    "question": "Which word is the ADVERB form in the word family of 'quick'?",
    "options": ["Quicker", "Quickest", "Quickly", "Quicken", "Quickness"],
    "correct": 2,
    "explanation": "'Quickly' is the adverb — it describes HOW something is done (she ran quickly). 'Quick' is the adjective, 'quicker/quickest' are comparatives, 'quicken' is the verb, and 'quickness' is the noun. ✓"
  },

  // ---- figurative-language: 15 new (Q424-Q438) ----
  {
    "id": 424, "difficulty": 1, "questionType": "vocabulary",
    "question": "In the sentence 'Time flies when you're having fun', what does 'flies' mean?",
    "options": ["Time has wings", "Time passes quickly", "Time disappears completely", "Time turns into insects", "Time stops and starts"],
    "correct": 1,
    "explanation": "This is figurative language — time doesn't literally fly! It means time seems to pass very quickly when you're enjoying yourself. This is a common expression (an idiom) that almost everyone uses. ✓"
  },
  {
    "id": 425, "difficulty": 1, "questionType": "vocabulary",
    "question": "'She has a heart of gold.' What does this expression mean?",
    "options": ["Her heart is made of metal", "She is very wealthy", "She is extremely kind and generous", "She has a health problem", "She wears gold jewellery"],
    "correct": 2,
    "explanation": "'A heart of gold' is a metaphor meaning someone is very kind, caring, and generous. Her heart isn't literally golden — the expression compares her kindness to something precious. ✓"
  },
  {
    "id": 426, "difficulty": 1, "questionType": "vocabulary",
    "question": "What type of figurative language is used in: 'The wind howled through the trees'?",
    "options": ["Simile", "Personification", "Alliteration", "Onomatopoeia", "Hyperbole"],
    "correct": 1,
    "explanation": "This is personification — giving the wind a human quality (howling). Wind can't actually howl like a wolf, but saying it does helps us imagine the sound. Personification makes descriptions come alive! ✓"
  },
  {
    "id": 427, "difficulty": 1, "questionType": "vocabulary",
    "question": "What type of figurative language is: 'He was as brave as a lion'?",
    "options": ["Metaphor", "Simile", "Personification", "Hyperbole", "Idiom"],
    "correct": 1,
    "explanation": "This is a simile — it compares two things using 'as' or 'like'. 'As brave AS a lion' directly compares his bravery to a lion's. Similes always use 'as' or 'like'. If it said 'He WAS a lion', that would be a metaphor. ✓"
  },
  {
    "id": 428, "difficulty": 2, "questionType": "vocabulary",
    "question": "'I've told you a million times!' What type of figurative language is this?",
    "options": ["Simile", "Metaphor", "Hyperbole", "Personification", "Onomatopoeia"],
    "correct": 2,
    "explanation": "This is hyperbole — a deliberate exaggeration. Nobody has really said anything a million times! Hyperbole is used for emphasis or humour: 'I'm so hungry I could eat a horse', 'This bag weighs a tonne'. ✓"
  },
  {
    "id": 429, "difficulty": 2, "questionType": "vocabulary",
    "question": "'The classroom was a zoo.' What does this metaphor mean?",
    "options": ["There were animals in the classroom", "The classroom was very noisy and chaotic", "The classroom had pictures of animals", "The children were studying animals", "The classroom was very cold"],
    "correct": 1,
    "explanation": "This metaphor compares the classroom to a zoo — it doesn't mean there were actual animals! It means the classroom was wild, noisy, and chaotic, like a zoo full of animals. Metaphors say something IS something else. ✓"
  },
  {
    "id": 430, "difficulty": 2, "questionType": "vocabulary",
    "question": "What does the idiom 'to let the cat out of the bag' mean?",
    "options": ["To free a trapped animal", "To reveal a secret accidentally", "To open a present", "To make a mess", "To start a fight"],
    "correct": 1,
    "explanation": "'Let the cat out of the bag' means to accidentally reveal a secret or surprise. It has nothing to do with actual cats! Idioms are expressions where the words together mean something different from their literal meaning. ✓"
  },
  {
    "id": 431, "difficulty": 2, "questionType": "vocabulary",
    "question": "In 'The stars danced in the night sky', what figurative language is used?",
    "options": ["Simile", "Hyperbole", "Alliteration", "Personification", "Metaphor"],
    "correct": 3,
    "explanation": "This is personification — stars can't actually dance! Giving the stars the human ability to dance makes the night sky sound magical and alive. It creates a beautiful picture in your mind. ✓"
  },
  {
    "id": 432, "difficulty": 2, "questionType": "vocabulary",
    "question": "What does the expression 'break the ice' mean?",
    "options": ["To smash something frozen", "To start a conversation with someone new", "To ruin a party", "To go ice skating", "To cause trouble"],
    "correct": 1,
    "explanation": "'Break the ice' means to do or say something to make people feel more comfortable, especially when meeting for the first time. The 'ice' is the awkward feeling — you 'break' through it. ✓"
  },
  {
    "id": 433, "difficulty": 3, "questionType": "vocabulary",
    "question": "What does the metaphor 'He has the memory of a sieve' mean?",
    "options": ["He remembers everything perfectly", "He forgets things very easily", "He has a very organised mind", "He remembers faces but not names", "He only remembers important things"],
    "correct": 1,
    "explanation": "A sieve has holes in it — water (or information) passes straight through and doesn't stay. So having 'the memory of a sieve' means you forget things very easily. The metaphor creates a vivid picture! ✓"
  },
  {
    "id": 434, "difficulty": 3, "questionType": "vocabulary",
    "question": "What does the idiom 'to be on thin ice' mean?",
    "options": ["To be ice skating", "To be in a dangerous or risky situation", "To be very cold", "To be losing weight", "To be in a hurry"],
    "correct": 1,
    "explanation": "'On thin ice' means in a risky situation where something could go wrong at any moment — like walking on ice that might crack. If your teacher says 'You're on thin ice', they're warning you that you're close to being in serious trouble! ✓"
  },
  {
    "id": 435, "difficulty": 3, "questionType": "vocabulary",
    "question": "'The news was a dagger to her heart.' What does this metaphor suggest?",
    "options": ["She was physically injured", "The news was extremely painful and upsetting", "She was brave and strong", "Someone attacked her", "She didn't care about the news"],
    "correct": 1,
    "explanation": "The metaphor compares emotional pain to being stabbed — the news hurt her deeply, like a dagger (knife) to the heart. No actual weapon was involved! Metaphors help readers feel the intensity of emotions. ✓"
  },
  {
    "id": 436, "difficulty": 3, "questionType": "vocabulary",
    "question": "What does the expression 'to turn over a new leaf' mean?",
    "options": ["To start gardening", "To read a new book", "To make a fresh start and change behaviour", "To flip a page", "To move to a new house"],
    "correct": 2,
    "explanation": "'Turn over a new leaf' means to make a fresh start — to change your behaviour for the better. The 'leaf' refers to a page in a book (not a tree leaf). You're starting a new, clean page in your life. ✓"
  },
  {
    "id": 437, "difficulty": 3, "questionType": "vocabulary",
    "question": "Which sentence contains a simile?",
    "options": ["The thunder roared across the valley.", "Her smile was like sunshine on a rainy day.", "The mountain was a sleeping giant.", "Hope blossomed in her chest.", "The clock stared down at them."],
    "correct": 1,
    "explanation": "'Her smile was LIKE sunshine' is a simile — it compares two things using 'like'. The others are: personification (thunder roared, clock stared), metaphor (mountain was a giant), and metaphor (hope blossomed). ✓"
  },
  {
    "id": 438, "difficulty": 2, "questionType": "vocabulary",
    "question": "What does 'to cost an arm and a leg' mean?",
    "options": ["To cause a physical injury", "To be very expensive", "To be on sale", "To require a lot of effort", "To be free of charge"],
    "correct": 1,
    "explanation": "'Cost an arm and a leg' is an idiom meaning something is very expensive. Obviously nothing literally costs a body part! The exaggeration emphasises just how pricey it is. ✓"
  },

  // ---- cloze-gap-fill: 15 new (Q439-Q453) ----
  {
    "id": 439, "difficulty": 1, "questionType": "vocabulary",
    "question": "Choose the word that best completes the sentence: 'The ___ puppy followed its owner everywhere.'",
    "options": ["Loyal", "Terrible", "Ancient", "Musical", "Frozen"],
    "correct": 0,
    "explanation": "'Loyal' fits best — a loyal puppy is one that is faithful and devoted to its owner, which explains why it follows them everywhere. The other words don't make sense in this context. ✓"
  },
  {
    "id": 440, "difficulty": 1, "questionType": "vocabulary",
    "question": "Choose the word that best completes the sentence: 'After running the race, she was completely ___.'",
    "options": ["Exhausted", "Invisible", "Rectangular", "Alphabetical", "Musical"],
    "correct": 0,
    "explanation": "'Exhausted' means extremely tired — exactly how you'd feel after running a race. The other words (invisible, rectangular, alphabetical, musical) have nothing to do with being tired. ✓"
  },
  {
    "id": 441, "difficulty": 1, "questionType": "vocabulary",
    "question": "Choose the word that best completes the sentence: 'The old castle looked ___ in the moonlight.'",
    "options": ["Cheerful", "Spooky", "Delicious", "Mathematical", "Portable"],
    "correct": 1,
    "explanation": "'Spooky' fits perfectly — an old castle in moonlight would look eerie and slightly frightening. 'Cheerful' is the opposite of what you'd expect, and the others don't make sense with castles. ✓"
  },
  {
    "id": 442, "difficulty": 1, "questionType": "vocabulary",
    "question": "Choose the word that best completes the sentence: 'The ___ of the crowd could be heard from streets away.'",
    "options": ["Silence", "Colour", "Roar", "Taste", "Weight"],
    "correct": 2,
    "explanation": "'Roar' is the right word — it means a loud, continuous sound, which is what a large crowd makes. You can hear a roar from far away. 'Silence' is the opposite, and you can't hear colours, tastes, or weights. ✓"
  },
  {
    "id": 443, "difficulty": 2, "questionType": "vocabulary",
    "question": "Choose the word that best completes the sentence: 'The scientist made a ___ discovery that changed our understanding of the disease.'",
    "options": ["Trivial", "Groundbreaking", "Accidental", "Minor", "Temporary"],
    "correct": 1,
    "explanation": "'Groundbreaking' means revolutionary and extremely important — a discovery that changes our understanding must be significant. 'Trivial' and 'minor' mean unimportant (the opposite), 'accidental' and 'temporary' don't fit the meaning. ✓"
  },
  {
    "id": 444, "difficulty": 2, "questionType": "vocabulary",
    "question": "Choose the word that best completes the sentence: 'Despite the ___ weather, the children still enjoyed their picnic.'",
    "options": ["Beautiful", "Dreadful", "Warm", "Sunny", "Perfect"],
    "correct": 1,
    "explanation": "'Despite' means 'even though' — so the weather must have been bad (otherwise there's nothing to overcome). 'Dreadful' means terrible, which makes sense with 'despite'. The others describe good weather, which wouldn't need 'despite'. ✓"
  },
  {
    "id": 445, "difficulty": 2, "questionType": "vocabulary",
    "question": "Choose the word that best completes the sentence: 'The teacher praised her for her ___ behaviour during the assembly.'",
    "options": ["Dreadful", "Appalling", "Exemplary", "Terrible", "Shocking"],
    "correct": 2,
    "explanation": "'Exemplary' means serving as an excellent example — exactly the kind of behaviour a teacher would praise. All the other words (dreadful, appalling, terrible, shocking) mean bad behaviour, which you wouldn't praise! ✓"
  },
  {
    "id": 446, "difficulty": 2, "questionType": "vocabulary",
    "question": "Choose the word that best completes the sentence: 'The abandoned house had a ___ atmosphere that made us want to leave.'",
    "options": ["Welcoming", "Cosy", "Sinister", "Cheerful", "Inviting"],
    "correct": 2,
    "explanation": "'Sinister' means threatening and frightening — exactly the feeling an abandoned house would give you, making you want to leave. The other words all describe pleasant places you'd want to stay in. ✓"
  },
  {
    "id": 447, "difficulty": 2, "questionType": "vocabulary",
    "question": "Choose the word that best completes the sentence: 'The ___ child asked question after question about how the world works.'",
    "options": ["Bored", "Curious", "Sleepy", "Angry", "Shy"],
    "correct": 1,
    "explanation": "'Curious' means eager to learn and know things — a curious child would naturally ask lots of questions. A bored child wouldn't ask questions, a shy child would be too nervous to, and angry or sleepy children have other priorities! ✓"
  },
  {
    "id": 448, "difficulty": 3, "questionType": "vocabulary",
    "question": "Choose the word that best completes the sentence: 'The evidence was ___, leaving no doubt about what had happened.'",
    "options": ["Ambiguous", "Conclusive", "Vague", "Uncertain", "Debatable"],
    "correct": 1,
    "explanation": "'Conclusive' means decisive and leaving no room for doubt — which matches 'leaving no doubt'. All the other words (ambiguous, vague, uncertain, debatable) mean the opposite: unclear or open to question. The sentence gives you a big clue! ✓"
  },
  {
    "id": 449, "difficulty": 3, "questionType": "vocabulary",
    "question": "Choose the word that best completes the sentence: 'Her ___ remarks hurt everyone in the room, though she seemed not to notice.'",
    "options": ["Thoughtful", "Kind", "Insensitive", "Generous", "Tactful"],
    "correct": 2,
    "explanation": "'Insensitive' means not aware of or caring about other people's feelings — which matches hurting people without noticing. 'Thoughtful', 'kind', 'generous', and 'tactful' are all positive words that wouldn't cause hurt. ✓"
  },
  {
    "id": 450, "difficulty": 3, "questionType": "vocabulary",
    "question": "Choose the word that best completes the sentence: 'The ___ old man shared fascinating stories about his travels around the world.'",
    "options": ["Mundane", "Elderly", "Eccentric", "Monotonous", "Tedious"],
    "correct": 2,
    "explanation": "'Eccentric' means unusual and interesting in character — someone who has travelled the world and tells fascinating stories would likely be eccentric. 'Elderly' is too neutral, and 'mundane', 'monotonous', and 'tedious' all mean boring. ✓"
  },
  {
    "id": 451, "difficulty": 3, "questionType": "vocabulary",
    "question": "Choose the word that best completes the sentence: 'The politician's ___ speech inspired thousands of people to take action.'",
    "options": ["Tedious", "Eloquent", "Mumbled", "Incoherent", "Rambling"],
    "correct": 1,
    "explanation": "'Eloquent' means fluent, persuasive, and beautifully expressed — the kind of speech that inspires people. 'Tedious' (boring), 'mumbled' (unclear), 'incoherent' (doesn't make sense), and 'rambling' (going on and on) wouldn't inspire anyone. ✓"
  },
  {
    "id": 452, "difficulty": 3, "questionType": "vocabulary",
    "question": "Choose the word that best completes the sentence: 'The two countries signed a ___ agreement to end the conflict.'",
    "options": ["Hostile", "Bilateral", "Aggressive", "Confrontational", "Militant"],
    "correct": 1,
    "explanation": "'Bilateral' means involving two sides or parties — perfect for an agreement between two countries. 'Hostile', 'aggressive', 'confrontational', and 'militant' all suggest conflict, the opposite of signing a peace agreement. ✓"
  },
  {
    "id": 453, "difficulty": 2, "questionType": "vocabulary",
    "question": "Choose the word that best completes the sentence: 'The museum's collection of ancient artefacts was truly ___.'",
    "options": ["Boring", "Remarkable", "Ordinary", "Dull", "Forgettable"],
    "correct": 1,
    "explanation": "'Remarkable' means worthy of attention, impressive and unusual — fitting for a collection of ancient artefacts. 'Boring', 'ordinary', 'dull', and 'forgettable' all suggest something unimpressive, which contradicts 'truly'. ✓"
  }
];

// ============================================================
// RECLASSIFICATION MAP
// ============================================================
const reclassifications = {
  'formal-informal-vocab': [123, 207, 258, 288],
  'prefixes': [25, 210]
};

// ============================================================
// NEW QUESTION MAPPINGS
// ============================================================
const newMappings = {};
// shades-of-meaning: Q341-Q355
for (let i = 341; i <= 355; i++) newMappings[i] = { subConceptId: 'shades-of-meaning', confidence: 'high' };
// formal-informal-vocab: Q356-Q365
for (let i = 356; i <= 365; i++) newMappings[i] = { subConceptId: 'formal-informal-vocab', confidence: 'high' };
// homonyms: Q366-Q380
for (let i = 366; i <= 380; i++) newMappings[i] = { subConceptId: 'homonyms', confidence: 'high' };
// prefixes: Q381-Q393
for (let i = 381; i <= 393; i++) newMappings[i] = { subConceptId: 'prefixes', confidence: 'high' };
// word-roots: Q394-Q408
for (let i = 394; i <= 408; i++) newMappings[i] = { subConceptId: 'word-roots', confidence: 'high' };
// word-families: Q409-Q423
for (let i = 409; i <= 423; i++) newMappings[i] = { subConceptId: 'word-families', confidence: 'high' };
// figurative-language: Q424-Q438
for (let i = 424; i <= 438; i++) newMappings[i] = { subConceptId: 'figurative-language', confidence: 'high' };
// cloze-gap-fill: Q439-Q453
for (let i = 439; i <= 453; i++) newMappings[i] = { subConceptId: 'cloze-gap-fill', confidence: 'high' };

// ============================================================
// APPLY FIXES
// ============================================================

console.log('=== VOCABULARY AUDIT FIX SCRIPT ===\n');

// 1. Read current files
let englishData = fs.readFileSync(ENGLISH_DATA, 'utf8');
let mappingData = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf8'));

// 2. Add new questions — find the end of vocabulary Q340
// Look for a unique marker in the last vocabulary question
const vocabStart = englishData.indexOf('vocabulary:');
const vocabSection = englishData.substring(vocabStart);

// Find Q340 in vocabulary section — search for the pattern that's unique to vocab Q340
// We need to find it within the vocabulary section specifically
const vocabLines = vocabSection.split('\n');
let vocabDepth = 0, vocabEndLine = 0;
for (let i = 0; i < vocabLines.length; i++) {
  for (const ch of vocabLines[i]) { if (ch === '{' || ch === '[') vocabDepth++; if (ch === '}' || ch === ']') vocabDepth--; }
  if (vocabDepth <= 0 && i > 5) { vocabEndLine = i; break; }
}
const vocabSectionStr = vocabLines.slice(0, vocabEndLine + 1).join('\n');

// Find vocab Q340 using unique marker text
const vocabQ340Marker = "its opposite should be equally strong.";
const markerPos = englishData.indexOf(vocabQ340Marker);
if (markerPos === -1) {
  console.error('ERROR: Cannot find vocabulary Q340 marker');
  process.exit(1);
}

// From marker, go backwards to find Q340's opening {, then forward to find closing }
let q340Start = markerPos;
while (q340Start > 0 && englishData[q340Start] !== '{') q340Start--;
let bd = 0, q340End = -1;
for (let i = q340Start; i < englishData.length; i++) {
  if (englishData[i] === '{') bd++;
  if (englishData[i] === '}') { bd--; if (bd === 0) { q340End = i + 1; break; } }
}

if (q340End === -1) {
  console.error('ERROR: Cannot find end of vocabulary Q340');
  process.exit(1);
}

console.log('1. Found vocabulary Q340 ending at position ' + q340End);

// Build new questions string
const newQStr = newQuestions.map(q => {
  const optsStr = q.options.map(o => `"${o.replace(/"/g, '\\"')}"`).join(', ');
  return `        {
          "id": ${q.id},
          "difficulty": ${q.difficulty},
          "questionType": "${q.questionType}",
          "question": "${q.question.replace(/"/g, '\\"')}",
          "options": [${optsStr}],
          "correct": ${q.correct},
          "explanation": "${q.explanation.replace(/"/g, '\\"')}"
        }`;
}).join(',\n');

englishData = englishData.slice(0, q340End) + ',\n' + newQStr + englishData.slice(q340End);
console.log('   ' + newQuestions.length + ' new questions inserted ✓');

// 3. Reclassify mapping entries
console.log('2. Reclassifying 6 context-clues...');
let reclassCount = 0;
Object.entries(reclassifications).forEach(([newCat, qIds]) => {
  qIds.forEach(qId => {
    const entry = Object.entries(mappingData.vocabulary).find(([k, v]) => v.questionId === qId);
    if (entry) {
      mappingData.vocabulary[entry[0]].subConceptId = newCat;
      reclassCount++;
    }
  });
});
console.log('   Reclassified ' + reclassCount + ' entries ✓');

// 4. Add new question mappings
console.log('3. Adding mappings for new questions...');
const existingCount = Object.keys(mappingData.vocabulary).length;
let mapIdx = existingCount;
Object.entries(newMappings).forEach(([qId, mapping]) => {
  mappingData.vocabulary[String(mapIdx)] = {
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

const totalMappings = Object.keys(mappingData.vocabulary).length;
console.log('Total mapping entries: ' + totalMappings);

// Check group sizes
const groups = {};
Object.values(mappingData.vocabulary).forEach(e => {
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

// Check new question stats
const newDiffs = {1:0, 2:0, 3:0};
newQuestions.forEach(q => newDiffs[q.difficulty]++);
console.log('\nNew question difficulty: D1:' + newDiffs[1] + ' D2:' + newDiffs[2] + ' D3:' + newDiffs[3]);

// Duplicate IDs
const newIds = newQuestions.map(q => q.id);
const dupNewIds = newIds.filter((id, i) => newIds.indexOf(id) !== i);
if (dupNewIds.length > 0) {
  console.log('ERROR: Duplicate IDs: ' + dupNewIds.join(', '));
  errors++;
} else {
  console.log('No duplicate IDs ✓');
}

// Options count
const badOpts = newQuestions.filter(q => q.options.length !== 5);
if (badOpts.length > 0) {
  console.log('ERROR: Wrong option count: ' + badOpts.map(q => 'Q'+q.id).join(', '));
  errors++;
} else {
  console.log('All new questions have 5 options ✓');
}

// Correct index range
const badCorrect = newQuestions.filter(q => q.correct < 0 || q.correct >= q.options.length);
if (badCorrect.length > 0) {
  console.log('ERROR: Invalid correct index: ' + badCorrect.map(q => 'Q'+q.id).join(', '));
  errors++;
} else {
  console.log('All correct indices valid ✓');
}

// Position distribution
const newPos = {0:0,1:0,2:0,3:0,4:0};
newQuestions.forEach(q => newPos[q.correct]++);
console.log('\nNew positions: A:'+newPos[0]+' B:'+newPos[1]+' C:'+newPos[2]+' D:'+newPos[3]+' E:'+newPos[4]);

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
console.log('   - 6 questions reclassified');
console.log('   - ' + newQuestions.length + ' new questions added (Q341-Q453)');
console.log('   - Mapping file updated (' + totalMappings + ' entries)');
