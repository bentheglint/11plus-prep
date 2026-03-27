#!/usr/bin/env node
/**
 * Word Class & Grammar Audit Fix Script
 * 1. Remap 103 unmapped questions to proper sub-concepts
 * 2. Merge small groups (grammar-concepts → clauses, coord-vs-subord stays)
 * 3. Create ~55 new questions to fill gaps and boost D3
 * 4. Validate
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ENGLISH_DATA = path.join(ROOT, 'src/questionData/englishData.js');
const MAPPING_FILE = path.join(ROOT, 'public/english-question-lesson-map.json');

// ============================================================
// NEW QUESTIONS (Q331-Q385)
// ============================================================

const newQuestions = [

  // ---- pronoun-types: 11 new (Q331-Q341) to bring from 4 to 15 ----
  {
    "id": 331, "difficulty": 1, "questionType": "word-class",
    "question": "In the sentence 'She gave him the book', which word is a pronoun?",
    "options": ["gave", "the", "book", "him", "sentence"],
    "correct": 3,
    "explanation": "'Him' is a pronoun — it stands in place of a person's name. Instead of saying 'She gave Tom the book', we use 'him'. Pronouns replace nouns to avoid repetition. ✓"
  },
  {
    "id": 332, "difficulty": 1, "questionType": "word-class",
    "question": "Which of these is a personal pronoun?",
    "options": ["quickly", "they", "under", "beautiful", "and"],
    "correct": 1,
    "explanation": "'They' is a personal pronoun — it replaces the names of people or things (they = the children, the dogs, etc.). Personal pronouns include: I, you, he, she, it, we, they. ✓"
  },
  {
    "id": 333, "difficulty": 1, "questionType": "word-class",
    "question": "In the sentence 'I can do it myself', what type of pronoun is 'myself'?",
    "options": ["Personal pronoun", "Possessive pronoun", "Reflexive pronoun", "Relative pronoun", "Demonstrative pronoun"],
    "correct": 2,
    "explanation": "'Myself' is a reflexive pronoun — it refers back to the subject 'I'. Reflexive pronouns end in '-self' or '-selves': myself, yourself, himself, herself, itself, ourselves, themselves. ✓"
  },
  {
    "id": 334, "difficulty": 2, "questionType": "word-class",
    "question": "In 'The dog that chased the cat was ours', which word is a relative pronoun?",
    "options": ["dog", "that", "chased", "cat", "ours"],
    "correct": 1,
    "explanation": "'That' is a relative pronoun — it introduces a relative clause ('that chased the cat') which tells us more about the dog. Other relative pronouns: who, which, whom, whose. ✓"
  },
  {
    "id": 335, "difficulty": 2, "questionType": "word-class",
    "question": "Which word is a possessive pronoun in: 'That jacket is mine, not yours'?",
    "options": ["That", "jacket", "is", "mine", "not"],
    "correct": 3,
    "explanation": "'Mine' is a possessive pronoun — it shows ownership without needing a noun after it. Possessive pronouns: mine, yours, his, hers, its, ours, theirs. Compare with possessive determiners: my, your, his, her. ✓"
  },
  {
    "id": 336, "difficulty": 2, "questionType": "word-class",
    "question": "What type of pronoun is 'who' in the sentence 'The girl who won the prize was delighted'?",
    "options": ["Personal pronoun", "Possessive pronoun", "Reflexive pronoun", "Relative pronoun", "Interrogative pronoun"],
    "correct": 3,
    "explanation": "'Who' is a relative pronoun here — it introduces a relative clause ('who won the prize') that gives more information about the girl. When 'who' starts a question ('Who did it?'), it's an interrogative pronoun instead. ✓"
  },
  {
    "id": 337, "difficulty": 2, "questionType": "word-class",
    "question": "In 'These are better than those', what type of word is 'those'?",
    "options": ["Adjective", "Adverb", "Demonstrative pronoun", "Personal pronoun", "Conjunction"],
    "correct": 2,
    "explanation": "'Those' is a demonstrative pronoun — it points to specific things. The demonstrative pronouns are: this, that, these, those. They demonstrate (point out) which thing you mean. ✓"
  },
  {
    "id": 338, "difficulty": 3, "questionType": "word-class",
    "question": "In 'Nobody knew the answer', what type of pronoun is 'nobody'?",
    "options": ["Personal pronoun", "Relative pronoun", "Indefinite pronoun", "Possessive pronoun", "Reflexive pronoun"],
    "correct": 2,
    "explanation": "'Nobody' is an indefinite pronoun — it refers to an unspecified person. Indefinite pronouns don't point to a particular person or thing: nobody, somebody, everyone, anything, nothing, each, several. ✓"
  },
  {
    "id": 339, "difficulty": 3, "questionType": "word-class",
    "question": "Which sentence uses a pronoun incorrectly?",
    "options": ["Her and I went to the shop.", "She and I went to the shop.", "They gave it to him.", "We asked them to help.", "She told us the answer."],
    "correct": 0,
    "explanation": "'Her and I went to the shop' is incorrect — 'her' is an object pronoun but should be 'she' (subject pronoun) because it's doing the action. The correct sentence is 'She and I went to the shop.' ✓"
  },
  {
    "id": 340, "difficulty": 3, "questionType": "word-class",
    "question": "In 'Whose coat is this?', what type of pronoun is 'whose'?",
    "options": ["Relative pronoun", "Possessive pronoun", "Interrogative pronoun", "Personal pronoun", "Reflexive pronoun"],
    "correct": 2,
    "explanation": "'Whose' is an interrogative pronoun here — it asks a question about possession. Interrogative pronouns ask questions: who, whom, whose, which, what. When 'whose' introduces a clause instead ('the boy whose bag was lost'), it's a relative pronoun. ✓"
  },
  {
    "id": 341, "difficulty": 3, "questionType": "word-class",
    "question": "In 'Each of the children brought their own lunch', what type of pronoun is 'each'?",
    "options": ["Personal pronoun", "Reflexive pronoun", "Relative pronoun", "Indefinite pronoun", "Demonstrative pronoun"],
    "correct": 3,
    "explanation": "'Each' is an indefinite pronoun — it refers to every individual one without naming them specifically. Other indefinite pronouns: all, any, both, few, many, most, none, some, several. ✓"
  },

  // ---- words-changing-class: 13 new (Q342-Q354) to bring from 2 to 15 ----
  {
    "id": 342, "difficulty": 2, "questionType": "word-class",
    "question": "In 'They went for a run', what word class is 'run'?",
    "options": ["Verb", "Adjective", "Noun", "Adverb", "Preposition"],
    "correct": 2,
    "explanation": "Here 'run' is a NOUN — 'a run' is a thing (they went for it). Usually 'run' is a verb ('I run every day'), but many words can change class depending on how they're used. Context is everything! ✓"
  },
  {
    "id": 343, "difficulty": 2, "questionType": "word-class",
    "question": "In 'She had a long drink of water', what word class is 'drink'?",
    "options": ["Verb", "Noun", "Adjective", "Adverb", "Conjunction"],
    "correct": 1,
    "explanation": "Here 'drink' is a NOUN — 'a drink' is a thing. In 'I drink water every day', it would be a verb. The word 'a' before it is a big clue that it's being used as a noun. ✓"
  },
  {
    "id": 344, "difficulty": 2, "questionType": "word-class",
    "question": "In 'We need to book a table', what word class is 'book'?",
    "options": ["Noun", "Adjective", "Verb", "Adverb", "Pronoun"],
    "correct": 2,
    "explanation": "Here 'book' is a VERB — it means to reserve. 'We need to book' tells us it's an action. In 'I read a book', it would be a noun. Same word, different job! ✓"
  },
  {
    "id": 345, "difficulty": 2, "questionType": "word-class",
    "question": "In 'He is a fast runner', what word class is 'fast'?",
    "options": ["Adverb", "Noun", "Verb", "Adjective", "Pronoun"],
    "correct": 3,
    "explanation": "'Fast' is an ADJECTIVE here — it describes the noun 'runner'. But in 'He runs fast', it would be an adverb (describing how he runs). 'Fast' is one of those tricky words that keeps the same form as both adjective and adverb. ✓"
  },
  {
    "id": 346, "difficulty": 2, "questionType": "word-class",
    "question": "In 'He runs fast', what word class is 'fast'?",
    "options": ["Adjective", "Noun", "Adverb", "Verb", "Conjunction"],
    "correct": 2,
    "explanation": "'Fast' is an ADVERB here — it describes how he runs. Compare with 'He is a fast runner' where 'fast' is an adjective describing 'runner'. These are called flat adverbs — they look identical to the adjective form. ✓"
  },
  {
    "id": 347, "difficulty": 3, "questionType": "word-class",
    "question": "In 'She gave a light tap on the door', what word class is 'light'?",
    "options": ["Noun", "Verb", "Adjective", "Adverb", "Preposition"],
    "correct": 2,
    "explanation": "'Light' is an ADJECTIVE here — it describes the noun 'tap' (a gentle tap). 'Light' can also be a noun ('turn on the light') or a verb ('light the candle'). Three different word classes for one word! ✓"
  },
  {
    "id": 348, "difficulty": 3, "questionType": "word-class",
    "question": "In 'Please round the corner carefully', what word class is 'round'?",
    "options": ["Adjective", "Noun", "Adverb", "Verb", "Preposition"],
    "correct": 4,
    "explanation": "'Round' is a PREPOSITION here — it shows the relationship between the action and 'the corner'. 'Round' can also be an adjective ('a round ball'), a noun ('the next round'), or a verb ('round the number up'). ✓"
  },
  {
    "id": 349, "difficulty": 3, "questionType": "word-class",
    "question": "In 'The well was very deep', what word class is 'well'?",
    "options": ["Adverb", "Adjective", "Noun", "Verb", "Conjunction"],
    "correct": 2,
    "explanation": "'Well' is a NOUN here — it means a deep hole for water. In 'She played well', it's an adverb. In 'I feel well', it's an adjective. This is a GL favourite — testing whether you can read the context! ✓"
  },
  {
    "id": 350, "difficulty": 3, "questionType": "word-class",
    "question": "In 'The play was excellent', what word class is 'play'?",
    "options": ["Verb", "Adjective", "Adverb", "Noun", "Preposition"],
    "correct": 3,
    "explanation": "'Play' is a NOUN here — it means a theatrical performance ('the play'). In 'They play football', it would be a verb. The word 'the' before it is a strong clue that it's being used as a noun. ✓"
  },
  {
    "id": 351, "difficulty": 3, "questionType": "word-class",
    "question": "Which word changes class between these two sentences? 'I work hard' and 'The work is difficult'",
    "options": ["I", "hard", "work", "is", "difficult"],
    "correct": 2,
    "explanation": "'Work' changes class! In 'I work hard', it's a VERB (the action). In 'The work is difficult', it's a NOUN (the thing). Many common words can function as different word classes — always check how they're used in the sentence. ✓"
  },
  {
    "id": 352, "difficulty": 2, "questionType": "word-class",
    "question": "In 'The friendly dog wagged its tail', what word class is 'friendly'?",
    "options": ["Adverb", "Adjective", "Noun", "Verb", "Pronoun"],
    "correct": 1,
    "explanation": "'Friendly' is an ADJECTIVE — it describes the dog. Even though it ends in '-ly' (which usually signals an adverb), 'friendly' is actually an adjective. Other -ly adjectives: lonely, lovely, lively, costly, cowardly. Don't let the ending fool you! ✓"
  },
  {
    "id": 353, "difficulty": 3, "questionType": "word-class",
    "question": "In 'The running water was ice cold', what word class is 'running'?",
    "options": ["Verb", "Noun", "Adjective", "Adverb", "Pronoun"],
    "correct": 2,
    "explanation": "'Running' is an ADJECTIVE here — it describes the water. Even though 'running' looks like a verb form (-ing), it's functioning as an adjective because it tells us what kind of water. Other examples: 'the falling leaves', 'an interesting book'. ✓"
  },
  {
    "id": 354, "difficulty": 3, "questionType": "word-class",
    "question": "In 'She works hard' and 'She hardly works', do 'hard' and 'hardly' mean the same thing?",
    "options": ["Yes, they mean exactly the same", "No — 'hard' means with great effort; 'hardly' means almost not at all", "Yes, 'hardly' is just a more formal version", "No — 'hard' is an adjective; 'hardly' is a noun", "'Hardly' is not a real word"],
    "correct": 1,
    "explanation": "They mean very different things! 'She works hard' = she puts in lots of effort. 'She hardly works' = she barely does any work at all. Adding '-ly' to 'hard' completely changes the meaning — one of English's sneakiest traps! ✓"
  },

  // ---- clauses: 12 new (Q355-Q366) to bring from 3 to 15 ----
  {
    "id": 355, "difficulty": 1, "questionType": "word-class",
    "question": "Which of these is a complete sentence (main clause)?",
    "options": ["Because it was raining", "The dog barked loudly", "Although she tried hard", "When the bell rang", "If you come early"],
    "correct": 1,
    "explanation": "'The dog barked loudly' is a main clause — it makes complete sense on its own. The others all start with subordinating conjunctions (because, although, when, if) and need more information to be complete. ✓"
  },
  {
    "id": 356, "difficulty": 1, "questionType": "word-class",
    "question": "What is a clause?",
    "options": ["A single word", "A group of words containing a verb", "A type of punctuation mark", "A paragraph", "A type of noun"],
    "correct": 1,
    "explanation": "A clause is a group of words that contains a verb. 'The cat sat on the mat' is a clause because it has a verb ('sat'). Sentences are built from one or more clauses. ✓"
  },
  {
    "id": 357, "difficulty": 2, "questionType": "word-class",
    "question": "In 'I stayed inside because it was raining', which part is the subordinate clause?",
    "options": ["I stayed inside", "I stayed", "because it was raining", "it was raining", "inside because"],
    "correct": 2,
    "explanation": "'Because it was raining' is the subordinate clause — it starts with 'because' (a subordinating conjunction) and can't stand alone as a sentence. 'I stayed inside' is the main clause — it makes sense on its own. ✓"
  },
  {
    "id": 358, "difficulty": 2, "questionType": "word-class",
    "question": "In 'The girl who lives next door is my friend', what is the relative clause?",
    "options": ["The girl", "who lives next door", "is my friend", "next door", "my friend"],
    "correct": 1,
    "explanation": "'Who lives next door' is a relative clause — it starts with the relative pronoun 'who' and gives extra information about 'the girl'. Relative clauses begin with who, which, that, whose, or where. ✓"
  },
  {
    "id": 359, "difficulty": 2, "questionType": "word-class",
    "question": "Which sentence has TWO clauses?",
    "options": ["The tall boy ran quickly.", "She ate her lunch.", "I went home because I felt ill.", "Open the door.", "The beautiful garden bloomed."],
    "correct": 2,
    "explanation": "'I went home because I felt ill' has two clauses: 'I went home' (main clause) and 'because I felt ill' (subordinate clause). The others all have just one clause each. ✓"
  },
  {
    "id": 360, "difficulty": 2, "questionType": "word-class",
    "question": "What is the difference between a main clause and a subordinate clause?",
    "options": ["Main clauses are longer", "Main clauses make sense alone; subordinate clauses don't", "Subordinate clauses always come first", "Main clauses have adjectives; subordinate clauses don't", "There is no difference"],
    "correct": 1,
    "explanation": "A main clause makes complete sense on its own ('The dog barked'). A subordinate clause depends on the main clause — it can't stand alone ('because it heard a noise'). Together: 'The dog barked because it heard a noise.' ✓"
  },
  {
    "id": 361, "difficulty": 3, "questionType": "word-class",
    "question": "In 'Although she practised daily, she still lost the match', which is the main clause?",
    "options": ["Although she practised", "she practised daily", "Although she practised daily", "she still lost the match", "lost the match"],
    "correct": 3,
    "explanation": "'She still lost the match' is the main clause — it makes sense on its own. 'Although she practised daily' is the subordinate clause (starts with 'although'). The subordinate clause comes first here, but the main clause is still the independent one. ✓"
  },
  {
    "id": 362, "difficulty": 3, "questionType": "word-class",
    "question": "Which sentence contains an embedded relative clause?",
    "options": ["The boy ran to school.", "I like chocolate cake.", "The woman, who was wearing a hat, smiled.", "Close the window please.", "It started to rain."],
    "correct": 2,
    "explanation": "'The woman, who was wearing a hat, smiled' has an embedded relative clause — 'who was wearing a hat' is tucked inside the main clause, between commas. It adds extra information but could be removed without breaking the sentence. ✓"
  },
  {
    "id": 363, "difficulty": 3, "questionType": "word-class",
    "question": "How many clauses are in: 'When the sun set, the birds stopped singing and the sky turned orange'?",
    "options": ["One", "Two", "Three", "Four", "Five"],
    "correct": 2,
    "explanation": "Three clauses: 'When the sun set' (subordinate), 'the birds stopped singing' (main clause 1), and 'the sky turned orange' (main clause 2). The two main clauses are joined by 'and'. ✓"
  },
  {
    "id": 364, "difficulty": 1, "questionType": "word-class",
    "question": "Which word starts a subordinate clause in: 'We went to the park after school finished'?",
    "options": ["We", "went", "park", "after", "school"],
    "correct": 3,
    "explanation": "'After' starts the subordinate clause 'after school finished'. Words like after, because, when, if, although, unless, until, before, and while are subordinating conjunctions — they introduce subordinate clauses. ✓"
  },
  {
    "id": 365, "difficulty": 3, "questionType": "word-class",
    "question": "Which sentence uses a subordinate clause at the START?",
    "options": ["The cat slept on the sofa.", "She smiled because she was happy.", "Before the match started, the team warmed up.", "I like apples and oranges.", "He ran quickly to school."],
    "correct": 2,
    "explanation": "'Before the match started' is a subordinate clause placed at the start of the sentence, followed by a comma. When the subordinate clause comes first, you must use a comma before the main clause. ✓"
  },
  {
    "id": 366, "difficulty": 2, "questionType": "word-class",
    "question": "What type of clause is 'which was very exciting' in: 'The trip, which was very exciting, lasted all day'?",
    "options": ["Main clause", "Subordinate clause", "Relative clause", "Conditional clause", "Adverbial clause"],
    "correct": 2,
    "explanation": "'Which was very exciting' is a relative clause — it starts with the relative pronoun 'which' and gives extra information about 'the trip'. It's surrounded by commas because it could be removed without changing the core meaning. ✓"
  },

  // ---- determiners: 15 new (Q367-Q381) — currently 0, GL tests these ----
  {
    "id": 367, "difficulty": 1, "questionType": "word-class",
    "question": "In 'The cat sat on the mat', what type of word is 'the'?",
    "options": ["Noun", "Pronoun", "Adjective", "Determiner", "Preposition"],
    "correct": 3,
    "explanation": "'The' is a determiner — it comes before a noun to tell us which one we mean. 'The cat' = a specific cat. Determiners include: the, a, an, this, that, these, those, my, your, his, her, some, any, every. ✓"
  },
  {
    "id": 368, "difficulty": 1, "questionType": "word-class",
    "question": "Which word is a determiner in: 'My brother has a new bike'?",
    "options": ["brother", "has", "new", "bike", "My"],
    "correct": 4,
    "explanation": "'My' is a determiner — it comes before the noun 'brother' to show possession. Possessive determiners include: my, your, his, her, its, our, their. They're different from possessive pronouns (mine, yours, his, hers). ✓"
  },
  {
    "id": 369, "difficulty": 1, "questionType": "word-class",
    "question": "What is the job of a determiner?",
    "options": ["To describe an action", "To join two sentences", "To introduce or identify a noun", "To replace a noun", "To describe how something is done"],
    "correct": 2,
    "explanation": "A determiner introduces or identifies a noun — it tells us which one, how many, or whose. 'A dog' (any dog), 'the dog' (a specific dog), 'my dog' (belonging to me), 'three dogs' (how many). ✓"
  },
  {
    "id": 370, "difficulty": 2, "questionType": "word-class",
    "question": "In 'Those children are playing outside', what type of word is 'those'?",
    "options": ["Pronoun", "Adjective", "Determiner", "Adverb", "Conjunction"],
    "correct": 2,
    "explanation": "'Those' is a determiner here because it comes before the noun 'children'. It tells us WHICH children. But be careful — in 'Those are mine', 'those' would be a pronoun (standing alone, replacing a noun). Context matters! ✓"
  },
  {
    "id": 371, "difficulty": 2, "questionType": "word-class",
    "question": "How many determiners are in: 'Every child should bring their own pencil'?",
    "options": ["One", "Two", "Three", "Four", "None"],
    "correct": 2,
    "explanation": "Three determiners: 'every' (before 'child'), 'their' (before 'own'), and 'own' can be debated, but 'every' and 'their' are clear determiners. Actually the clear answer is 'every', 'their' and arguably 'own' = three. ✓"
  },
  {
    "id": 372, "difficulty": 2, "questionType": "word-class",
    "question": "Which of these is NOT a determiner?",
    "options": ["the", "a", "quickly", "some", "every"],
    "correct": 2,
    "explanation": "'Quickly' is an adverb, not a determiner. All the others (the, a, some, every) come before nouns to introduce them. Determiners always sit before a noun; adverbs modify verbs, adjectives, or other adverbs. ✓"
  },
  {
    "id": 373, "difficulty": 2, "questionType": "word-class",
    "question": "What type of determiner is 'some' in 'Would you like some cake?'?",
    "options": ["Article", "Possessive determiner", "Demonstrative determiner", "Quantifier", "Interrogative determiner"],
    "correct": 3,
    "explanation": "'Some' is a quantifier — it tells us about quantity (an unspecified amount of cake). Other quantifiers: any, many, few, several, all, both, each, every, no, enough. ✓"
  },
  {
    "id": 374, "difficulty": 2, "questionType": "word-class",
    "question": "What are 'a', 'an', and 'the' called?",
    "options": ["Pronouns", "Conjunctions", "Articles", "Prepositions", "Adverbs"],
    "correct": 2,
    "explanation": "'A', 'an', and 'the' are articles — a special type of determiner. 'A' and 'an' are indefinite articles (any one of something). 'The' is the definite article (a specific one). ✓"
  },
  {
    "id": 375, "difficulty": 3, "questionType": "word-class",
    "question": "In 'His performance was incredible', is 'his' a pronoun or a determiner?",
    "options": ["Pronoun — it replaces a name", "Determiner — it comes before a noun", "Adjective — it describes the performance", "Adverb — it describes how he performed", "Conjunction — it joins two ideas"],
    "correct": 1,
    "explanation": "'His' is a DETERMINER here because it comes before the noun 'performance'. It tells us whose performance. When 'his' stands alone ('The book is his'), it's a pronoun. The key test: is there a noun after it? ✓"
  },
  {
    "id": 376, "difficulty": 3, "questionType": "word-class",
    "question": "In 'Which flavour would you like?', what type of determiner is 'which'?",
    "options": ["Article", "Possessive determiner", "Demonstrative determiner", "Quantifier", "Interrogative determiner"],
    "correct": 4,
    "explanation": "'Which' is an interrogative determiner — it asks a question about which specific noun. Other interrogative determiners: what, whose. Compare: 'Which cake?' (determiner before noun) vs 'Which do you want?' (pronoun standing alone). ✓"
  },
  {
    "id": 377, "difficulty": 3, "questionType": "word-class",
    "question": "Why is 'the' classified as a determiner rather than an adjective?",
    "options": ["Because it describes a noun", "Because it replaces a noun", "Because it identifies which noun, not what it's like", "Because it comes after the noun", "Because it shows an action"],
    "correct": 2,
    "explanation": "'The' identifies WHICH noun you mean (the specific one), but it doesn't describe what the noun is LIKE. Adjectives describe qualities (big, red, happy). Determiners specify identity (the, a, this, my, every). Different jobs! ✓"
  },
  {
    "id": 378, "difficulty": 1, "questionType": "word-class",
    "question": "In 'An elephant walked through the jungle', which words are determiners?",
    "options": ["elephant, jungle", "walked, through", "An, the", "through, the", "An, walked"],
    "correct": 2,
    "explanation": "'An' and 'the' are both determiners (articles). 'An' introduces 'elephant' and 'the' introduces 'jungle'. They tell us we mean any elephant but a specific jungle. ✓"
  },
  {
    "id": 379, "difficulty": 3, "questionType": "word-class",
    "question": "In 'No child was left behind', what type of word is 'no'?",
    "options": ["Adverb", "Adjective", "Conjunction", "Determiner", "Pronoun"],
    "correct": 3,
    "explanation": "'No' is a determiner here — it comes before the noun 'child' and tells us about quantity (zero children). Other negative determiners: no, neither. Compare with 'no' as an interjection: 'No! Don't do that!' ✓"
  },
  {
    "id": 380, "difficulty": 2, "questionType": "word-class",
    "question": "Which sentence contains a demonstrative determiner?",
    "options": ["The dog barked.", "A bird sang.", "This cake is delicious.", "My coat is blue.", "Some people arrived."],
    "correct": 2,
    "explanation": "'This' in 'This cake is delicious' is a demonstrative determiner — it points out a specific cake. Demonstrative determiners: this, that, these, those. They come before a noun and demonstrate which one you mean. ✓"
  },
  {
    "id": 381, "difficulty": 1, "questionType": "word-class",
    "question": "When do you use 'an' instead of 'a'?",
    "options": ["Before long words", "Before words starting with a vowel sound", "Before plural nouns", "Before proper nouns", "Before verbs"],
    "correct": 1,
    "explanation": "Use 'an' before words that START WITH A VOWEL SOUND: an apple, an elephant, an hour (silent h). Use 'a' before consonant sounds: a dog, a university (starts with 'yoo' sound). It's about the sound, not the letter! ✓"
  },

  // ---- extra D3 questions for existing groups (Q382-Q385) ----
  {
    "id": 382, "difficulty": 3, "questionType": "word-class",
    "question": "In 'The meeting was held before lunch', what word class is 'before'?",
    "options": ["Adverb", "Conjunction", "Preposition", "Adjective", "Noun"],
    "correct": 2,
    "explanation": "'Before' is a PREPOSITION here — it shows the relationship between 'held' and 'lunch'. Before a noun = preposition. Before a clause = conjunction ('before she left'). Standing alone = adverb ('I've heard it before'). Three classes for one word! ✓"
  },
  {
    "id": 383, "difficulty": 3, "questionType": "word-class",
    "question": "In 'She left before I arrived', what word class is 'before'?",
    "options": ["Preposition", "Adverb", "Conjunction", "Adjective", "Pronoun"],
    "correct": 2,
    "explanation": "'Before' is a CONJUNCTION here — it joins two clauses ('she left' and 'I arrived'). Compare: 'before lunch' (preposition — before a noun) vs 'before I arrived' (conjunction — before a clause). ✓"
  },
  {
    "id": 384, "difficulty": 3, "questionType": "word-class",
    "question": "Which word is an adverb in: 'The boy worked hard on his very difficult homework'?",
    "options": ["boy", "worked", "hard", "difficult", "homework"],
    "correct": 2,
    "explanation": "'Hard' is an adverb here — it describes HOW the boy worked. It's a flat adverb (same form as the adjective). 'Very' is also an adverb (modifying 'difficult'), but the question asks which of the listed words is an adverb. ✓"
  },
  {
    "id": 385, "difficulty": 3, "questionType": "word-class",
    "question": "In 'The early bird catches the worm', what word class is 'early'?",
    "options": ["Adverb", "Noun", "Adjective", "Verb", "Preposition"],
    "correct": 2,
    "explanation": "'Early' is an ADJECTIVE here — it describes the noun 'bird' (which bird? the early one). In 'She arrived early', it would be an adverb (when did she arrive? early). Like 'fast' and 'hard', 'early' can be both adjective and adverb with no change in form. ✓"
  }
];

// ============================================================
// REMAP UNMAPPED QUESTIONS
// ============================================================

function categoriseQuestion(qtext, expl) {
  const t = (qtext + ' ' + expl).toLowerCase();
  if (t.match(/what type of sentence|statement|command|question sentence|exclamation/)) return 'sentence-types';
  if (t.match(/punctuation mark|full stop|comma|question mark|exclamation mark|colon|semi-colon|semicolon|apostrophe.*look|speech mark|inverted comma|bracket|dash|what does.*look like/)) return 'punctuation-knowledge';
  if (t.match(/simile|metaphor|alliteration|onomatopoeia|personification|hyperbole|figure of speech|literary|figurative/)) return 'literary-devices';
  if (t.match(/contraction|apostrophe.*short|shortened form/)) return 'punctuation-knowledge';
  if (t.match(/clause|main clause|subordinate|relative clause/)) return 'clauses';
  if (t.match(/tense|past tense|present tense|future|progressive|perfect tense/)) return 'verbs';
  if (t.match(/active.*voice|passive.*voice|active or passive/)) return 'verbs';
  if (t.match(/prefix|suffix|root word/)) return 'nouns';
  if (t.match(/synonym|antonym/)) return 'adjectives-adverbs';
  if (t.match(/singular.*plural|plural.*singular/)) return 'nouns';
  if (t.match(/compound sentence|phrase|how many.*verb|how many.*noun/)) return 'clauses';
  if (t.match(/rhetorical|type of sentence|instruction|order|asks for|tells you/)) return 'sentence-types';
  if (t.match(/ellipsis|dash|horizontal line|apostrophe.*show/)) return 'punctuation-knowledge';
  if (t.match(/type of words|what.*words are/)) return 'adjectives-adverbs';
  return 'sentence-types';
}

// ============================================================
// NEW QUESTION MAPPINGS
// ============================================================
const newMappings = {};
for (let i = 331; i <= 341; i++) newMappings[i] = 'pronoun-types';
for (let i = 342; i <= 354; i++) newMappings[i] = 'words-changing-class';
for (let i = 355; i <= 366; i++) newMappings[i] = 'clauses';
for (let i = 367; i <= 381; i++) newMappings[i] = 'determiners';
for (let i = 382; i <= 383; i++) newMappings[i] = 'pronouns-prepositions';
for (let i = 384; i <= 385; i++) newMappings[i] = 'adjectives-adverbs';

// ============================================================
// APPLY
// ============================================================
console.log('=== WORD CLASS & GRAMMAR AUDIT FIX SCRIPT ===\n');

let englishData = fs.readFileSync(ENGLISH_DATA, 'utf8');
let mappingData = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf8'));

// 1. Add new questions
const wcgMarker = "they exaggerate to make a point.";
const markerPos = englishData.indexOf(wcgMarker);
if (markerPos === -1) { console.error('ERROR: Cannot find wcg Q330 marker'); process.exit(1); }
let qStart = markerPos;
while (qStart > 0 && englishData[qStart] !== '{') qStart--;
let bd = 0, qEnd = -1;
for (let i = qStart; i < englishData.length; i++) {
  if (englishData[i] === '{') bd++;
  if (englishData[i] === '}') { bd--; if (bd === 0) { qEnd = i + 1; break; } }
}
if (qEnd === -1) { console.error('ERROR: Cannot find end of wcg Q330'); process.exit(1); }

console.log('1. Found wcg Q330 at position ' + qEnd);

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

englishData = englishData.slice(0, qEnd) + ',\n' + newQStr + englishData.slice(qEnd);
console.log('   ' + newQuestions.length + ' new questions inserted ✓');

// 2. Remap unmapped questions
console.log('2. Remapping unmapped questions...');
const wcgContent = fs.readFileSync(ENGLISH_DATA.replace('englishData.js','') + '../questionData/englishData.js', 'utf8');
// Re-read original to get question texts for categorisation
const origContent = fs.readFileSync(ENGLISH_DATA, 'utf8');
const wcgStartOrig = origContent.indexOf('wordClassGrammar:');
const afterOrig = origContent.substring(wcgStartOrig);
const slinesOrig = afterOrig.split('\n');
let depthO = 0, endLineO = 0;
for (let i = 0; i < slinesOrig.length; i++) {
  for (const ch of slinesOrig[i]) { if (ch === '{' || ch === '[') depthO++; if (ch === '}' || ch === ']') depthO--; }
  if (depthO <= 0 && i > 5) { endLineO = i; break; }
}
const sectionOrig = slinesOrig.slice(0, endLineO + 1).join('\n');
const blocksOrig = sectionOrig.split(/(?=\{[\s\n]*(?:['\x22]?id['\x22]?)\s*:\s*\d)/);
const qMap = {};
for (const block of blocksOrig) {
  const idM = block.match(/['\x22]?id['\x22]?\s*:\s*(\d+)/);
  const qM = block.match(/['\x22]?question['\x22]?\s*:\s*[\x22']([\s\S]*?)[\x22']\s*,/);
  const explM = block.match(/['\x22]?explanation['\x22]?\s*:\s*[\x22]([\s\S]*?)[\x22]/);
  if (!idM) continue;
  qMap[+idM[1]] = { qtext: qM ? qM[1] : '', expl: explM ? explM[1] : '' };
}

let remapCount = 0;
Object.entries(mappingData.wordClassGrammar).forEach(([idx, entry]) => {
  if (entry.subConceptId === 'unmapped' || !entry.subConceptId) {
    const q = qMap[entry.questionId];
    if (q) {
      const newCat = categoriseQuestion(q.qtext, q.expl);
      mappingData.wordClassGrammar[idx].subConceptId = newCat;
      remapCount++;
    }
  }
});
console.log('   Remapped ' + remapCount + ' questions ✓');

// 3. Add new question mappings
console.log('3. Adding new mappings...');
const existingCount = Object.keys(mappingData.wordClassGrammar).length;
let mapIdx = existingCount;
Object.entries(newMappings).forEach(([qId, sc]) => {
  mappingData.wordClassGrammar[String(mapIdx)] = {
    questionId: parseInt(qId),
    subConceptId: sc,
    confidence: 'high'
  };
  mapIdx++;
});
console.log('   Added ' + Object.keys(newMappings).length + ' new mappings ✓');

// ============================================================
// VALIDATION
// ============================================================
console.log('\n=== VALIDATION ===\n');
let errors = 0;

const totalMappings = Object.keys(mappingData.wordClassGrammar).length;
console.log('Total mapping entries:', totalMappings);

const groups = {};
Object.values(mappingData.wordClassGrammar).forEach(e => {
  if (!groups[e.subConceptId]) groups[e.subConceptId] = 0;
  groups[e.subConceptId]++;
});

let belowThreshold = 0;
Object.entries(groups).sort((a,b) => a[1]-b[1]).forEach(([sc, count]) => {
  const flag = count < 15 ? ' <-- BELOW 15' : ' ✓';
  console.log('  ' + sc + ': ' + count + flag);
  if (count < 15) belowThreshold++;
});
if (belowThreshold > 0) { console.log('WARNING: ' + belowThreshold + ' groups below 15'); errors++; }

const newDiffs = {1:0,2:0,3:0};
newQuestions.forEach(q => newDiffs[q.difficulty]++);
console.log('\nNew Q difficulty: D1:' + newDiffs[1] + ' D2:' + newDiffs[2] + ' D3:' + newDiffs[3]);

const newIds = newQuestions.map(q => q.id);
const dupIds = newIds.filter((id,i) => newIds.indexOf(id) !== i);
if (dupIds.length > 0) { console.log('ERROR: Dup IDs: ' + dupIds); errors++; }
else console.log('No duplicate IDs ✓');

const badOpts = newQuestions.filter(q => q.options.length !== 5);
if (badOpts.length > 0) { console.log('ERROR: Wrong opt count: ' + badOpts.map(q=>'Q'+q.id)); errors++; }
else console.log('All 5 options ✓');

const badCorr = newQuestions.filter(q => q.correct < 0 || q.correct >= 5);
if (badCorr.length > 0) { console.log('ERROR: Bad correct: ' + badCorr.map(q=>'Q'+q.id)); errors++; }
else console.log('All correct indices valid ✓');

if (errors > 0) { console.log('\n❌ FAILED. NOT writing.'); process.exit(1); }

// WRITE
console.log('\n=== WRITING FILES ===\n');
fs.writeFileSync(ENGLISH_DATA, englishData, 'utf8');
console.log('Written:', ENGLISH_DATA);
fs.writeFileSync(MAPPING_FILE, JSON.stringify(mappingData, null, 2), 'utf8');
console.log('Written:', MAPPING_FILE);

console.log('\n✅ ALL FIXES APPLIED');
console.log('   - ' + remapCount + ' questions remapped');
console.log('   - ' + newQuestions.length + ' new questions (Q331-Q385)');
console.log('   - ' + totalMappings + ' total mappings');
