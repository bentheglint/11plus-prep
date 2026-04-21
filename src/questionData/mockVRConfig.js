// Mock Test VR Configuration
// Instructions, worked examples, and section structure matching 11+ exam format
// Each VR paper: 85 questions, 50 minutes, grouped by type with instructions before each section

// Two paper variants (matching 11+ Tests A/B vs C/D):
// Variant A: uses letterCodes (6 Qs) + antonyms replaces one type
// Variant B: uses sharedLetter (6 Qs) + numberWordCodes replaces one type
// Both variants total 85 questions

export const vrTypeInstructions = {
  letterMove: {
    typeName: "Move a Letter",
    questionsPerSection: 7,
    instruction: "Take one letter from the word on the left and add it to the word on the right to make two new, proper words. The order of the letters must not be changed. Mark the letter that moves on your answer sheet.",
    workedExample: {
      question: "paint → men",
      answer: "a",
      explanation: "Remove the letter 'a' from 'paint' to make 'pint'. Add 'a' to 'men' to make 'mean'. Both pint and mean are real words, so the answer is 'a'."
    }
  },

  oddTwoOut: {
    typeName: "Odd Two Out",
    questionsPerSection: 7,
    instruction: "In each question, there are five words. Three of the words go together in some way. Find the two words that do not belong with the other three. Mark both words on your answer sheet.",
    workedExample: {
      question: "March, Monday, July, December, Christmas",
      answer: "Monday and Christmas",
      explanation: "March, July, and December are all months of the year. Monday is a day of the week and Christmas is a festival — these two do not belong with the months."
    }
  },

  letterSums: {
    typeName: "Letter Sums",
    questionsPerSection: 7,
    instruction: "In these questions, letters stand for numbers. Work out the answer to each sum and mark the letter that represents the correct answer. You may find it helpful to write the numbers next to the letters before you start.",
    workedExample: {
      question: "If A = 3, B = 5, C = 8, D = 12, E = 15, what is A + D?",
      answer: "E",
      explanation: "First, find the values: A = 3 and D = 12. Then calculate: 3 + 12 = 15. Now find which letter equals 15: E = 15. So the answer is E."
    }
  },

  verbalAnalogies: {
    typeName: "Verbal Analogies",
    questionsPerSection: 7,
    instruction: "Choose one word from each set of brackets to complete the sentence in the best way. Mark one word from the first set and one word from the second set on your answer sheet.",
    workedExample: {
      question: "Hot is to (fire, cold, summer) as wet is to (rain, dry, water)",
      answer: "cold and dry",
      explanation: "Hot and cold are opposites. Wet and dry are opposites. The relationship is antonyms (opposites), so the answer is 'cold' from the first set and 'dry' from the second set."
    }
  },

  compoundWords: {
    typeName: "Compound Words",
    questionsPerSection: 7,
    instruction: "Find two words, one from each set of brackets, that together make one new word. The word from the first set always comes first. Mark one word from each set on your answer sheet.",
    workedExample: {
      question: "(red, garden, green) (jumper, house, rose)",
      answer: "green and house",
      explanation: "'Green' from the first set and 'house' from the second set combine to make 'greenhouse' — a single compound word. No other combination makes a real compound word."
    }
  },

  hiddenWords: {
    typeName: "Hidden Words",
    questionsPerSection: 7,
    instruction: "A four-letter word is hidden between two words that are next to each other in the sentence. Find the word and mark the two words it is hidden between on your answer sheet.",
    workedExample: {
      question: "The child fell over the stone.",
      answer: "fell and over (the hidden word is LOVE)",
      explanation: "Look at the end of 'fell' and the start of 'over': fe-LL OV-Er. The letters L, O, V, E spell LOVE. The hidden word is always across a word boundary — it uses the end of one word and the start of the next."
    }
  },

  missingLettersWords: {
    typeName: "Missing Three Letters",
    questionsPerSection: 7,
    instruction: "One word in CAPITAL LETTERS has had three letters removed. These three missing letters make a proper three-letter word. Find the three-letter word and mark it on your answer sheet.",
    workedExample: {
      question: "The children played in the FYARD all afternoon.",
      answer: "ARM (the complete word is FARMYARD)",
      explanation: "The word in capitals is F_YARD. If we add ARM, we get FARMYARD: F + ARM + YARD. The three missing letters A, R, M make the word ARM."
    }
  },

  synonyms: {
    typeName: "Closest Meaning",
    questionsPerSection: 7,
    instruction: "Choose two words, one from each set of brackets, that are closest in meaning. Mark one word from each set on your answer sheet.",
    workedExample: {
      question: "(race, shop, start) (flag, end, begin)",
      answer: "start and begin",
      explanation: "'Start' and 'begin' mean the same thing — they are synonyms. No other pair from the two sets are as close in meaning."
    }
  },

  antonyms: {
    typeName: "Opposite Meaning",
    questionsPerSection: 7,
    instruction: "Choose two words, one from each set of brackets, that are most opposite in meaning. Mark one word from each set on your answer sheet.",
    workedExample: {
      question: "(brave, kind, strong) (gentle, cowardly, weak)",
      answer: "brave and cowardly",
      explanation: "'Brave' means having courage, and 'cowardly' means lacking courage — they are opposites. 'Strong' and 'weak' are also opposites, but the question asks for the MOST opposite pair. Both pairs work, but brave/cowardly is a more precise match."
    }
  },

  letterPairSeries: {
    typeName: "Letter Pair Series",
    questionsPerSection: 7,
    instruction: "Look at the pairs of letters below. They follow a pattern. Work out which pair of letters comes next in the series and mark it on your answer sheet. The alphabet is printed below to help you.",
    workedExample: {
      question: "AZ, CY, EX, GW, ?",
      answer: "IV",
      explanation: "The first letter goes forward by 2 each time: A, C, E, G, I. The second letter goes backward by 1 each time: Z, Y, X, W, V. So the next pair is IV."
    },
    showAlphabet: true
  },

  wordCodeAnalogies: {
    typeName: "Word-Code Analogies",
    questionsPerSection: 7,
    instruction: "The three words on the left go together in a certain way. The three words on the right go together in the same way. Work out the rule and find the missing word. Mark it on your answer sheet.",
    workedExample: {
      question: "ship (hip) help → cart (?) cape",
      answer: "arc",
      explanation: "Look at the left side: 'ship' contains the word 'hip', and 'help' also contains the letters h, e, l, p. The rule is: the middle word uses the 2nd, 3rd, and 4th letters of the first word. S-H-I-P → H-I-P = 'hip'. Apply the same rule to the right: C-A-R-T → A-R-C = 'arc'. Check: 'cape' — yes, this works. The answer is 'arc'."
    }
  },

  numberSeries: {
    typeName: "Number Series",
    questionsPerSection: 7,
    instruction: "Look at the numbers below. They follow a pattern. Work out what number comes next in the series and mark it on your answer sheet.",
    workedExample: {
      question: "3, 6, 12, 24, ?",
      answer: "48",
      explanation: "Each number is doubled (multiplied by 2): 3 × 2 = 6, 6 × 2 = 12, 12 × 2 = 24, 24 × 2 = 48."
    }
  },

  letterCodes: {
    typeName: "Letter Codes",
    questionsPerSection: 6,
    instruction: "Some words have been written in code. The code for the first word has been worked out for you. Using the same code, work out the second coded word and find what real word it stands for. The alphabet is printed below to help you.",
    workedExample: {
      question: "If SHOP is written as RGNO in code, what does QNZC mean?",
      answer: "ROAD",
      explanation: "In the code, each letter has been shifted back by 1 position in the alphabet: S→R, H→G, O→N, P→O. So RGNO = SHOP. Applying the same code in reverse (shift forward by 1): Q→R, N→O, Z→A, C→D. The answer is ROAD."
    },
    showAlphabet: true
  },

  sharedLetter: {
    typeName: "Shared Letter",
    questionsPerSection: 6,
    instruction: "Find the one letter that can complete both pairs of words. The same letter must fit all four gaps. Mark the letter on your answer sheet.",
    workedExample: {
      question: "MEA(?) ABLE and COS(?) ENNIS",
      answer: "T",
      explanation: "Adding 'T': MEA + T = MEAT, T + ABLE = TABLE, COS + T = COST, T + ENNIS = TENNIS. The letter T completes all four words."
    }
  },

  numberWordCodes: {
    typeName: "Number-Word Codes",
    questionsPerSection: 7,
    instruction: "In these questions, numbers stand for letters. Work out which letter each number represents and find the word that answers the question. Mark it on your answer sheet.",
    workedExample: {
      question: "If the code for CAT is 3-1-20 and the code for DOG is 4-15-7, what is the code for BAD?",
      answer: "2-1-4",
      explanation: "Each letter is replaced by its position in the alphabet: A=1, B=2, C=3, D=4... So B=2, A=1, D=4. The code for BAD is 2-1-4."
    }
  },

  logicShort: {
    typeName: "Logic Puzzle (Short)",
    questionsPerSection: 1,
    instruction: "Read the information carefully and answer the question. Only use the facts you are given — do not guess or assume anything that is not stated.",
    workedExample: {
      question: "All cats have whiskers. Tibbles has whiskers. Is Tibbles definitely a cat?",
      answer: "No, not necessarily",
      explanation: "Just because all cats have whiskers does not mean that only cats have whiskers. Other animals (like dogs and rabbits) also have whiskers. Having whiskers does not prove Tibbles is a cat."
    }
  },

  logicLong: {
    typeName: "Logic Puzzle (Long)",
    questionsPerSection: 1,
    instruction: "Read all the clues carefully, then answer the question. You may find it helpful to make notes or draw a grid to work out the answer.",
    workedExample: {
      question: "Five children — Amy, Ben, Cat, Dan, and Eve — finished a race. Amy finished before Ben but after Cat. Dan finished last. Eve finished before Cat. Who won the race?",
      answer: "Eve",
      explanation: "Working through the clues: Eve finished before Cat, Cat finished before Amy, Amy finished before Ben, Dan finished last. So the order is: Eve, Cat, Amy, Ben, Dan. Eve won the race."
    }
  }
};

// Paper structure: which types appear and in what order
// Two variants to provide variety across mock tests
export const vrPaperVariants = [
  {
    id: 'variant-a',
    name: 'Paper Variant A',
    totalQuestions: 85,
    timeMinutes: 50,
    sections: [
      { topicKey: 'letterMove', questions: 7 },
      { topicKey: 'oddTwoOut', questions: 7 },
      { topicKey: 'letterSums', questions: 7 },
      { topicKey: 'logicShort', questions: 1, sourceKey: 'logicAndLanguage' },
      { topicKey: 'verbalAnalogies', questions: 7 },
      { topicKey: 'compoundWords', questions: 7 },
      { topicKey: 'hiddenWords', questions: 7 },
      { topicKey: 'missingLettersWords', questions: 7 },
      { topicKey: 'synonyms', questions: 7 },
      { topicKey: 'logicLong', questions: 1, sourceKey: 'logicAndLanguage' },
      { topicKey: 'letterPairSeries', questions: 7 },
      { topicKey: 'numberSeries', questions: 7 },
      { topicKey: 'letterCodes', questions: 6 },
      { topicKey: 'wordCodeAnalogies', questions: 7 },
    ]
  },
  {
    id: 'variant-b',
    name: 'Paper Variant B',
    totalQuestions: 85,
    timeMinutes: 50,
    sections: [
      { topicKey: 'oddTwoOut', questions: 7 },
      { topicKey: 'letterMove', questions: 7 },
      { topicKey: 'numberSeries', questions: 7 },
      { topicKey: 'logicShort', questions: 1, sourceKey: 'logicAndLanguage' },
      { topicKey: 'synonyms', questions: 7 },
      { topicKey: 'hiddenWords', questions: 7 },
      { topicKey: 'compoundWords', questions: 7 },
      { topicKey: 'verbalAnalogies', questions: 7 },
      { topicKey: 'letterSums', questions: 7 },
      { topicKey: 'logicLong', questions: 1, sourceKey: 'logicAndLanguage' },
      { topicKey: 'missingLettersWords', questions: 7 },
      { topicKey: 'letterPairSeries', questions: 7 },
      { topicKey: 'sharedLetter', questions: 6 },
      { topicKey: 'wordCodeAnalogies', questions: 7 },
    ]
  },
  {
    id: 'variant-c',
    name: 'Paper Variant C',
    totalQuestions: 85,
    timeMinutes: 50,
    sections: [
      { topicKey: 'compoundWords', questions: 7 },
      { topicKey: 'letterSums', questions: 7 },
      { topicKey: 'oddTwoOut', questions: 7 },
      { topicKey: 'logicShort', questions: 1, sourceKey: 'logicAndLanguage' },
      { topicKey: 'hiddenWords', questions: 7 },
      { topicKey: 'letterMove', questions: 7 },
      { topicKey: 'antonyms', questions: 7 },
      { topicKey: 'numberSeries', questions: 7 },
      { topicKey: 'missingLettersWords', questions: 7 },
      { topicKey: 'logicLong', questions: 1, sourceKey: 'logicAndLanguage' },
      { topicKey: 'verbalAnalogies', questions: 7 },
      { topicKey: 'letterPairSeries', questions: 7 },
      { topicKey: 'sharedLetter', questions: 6 },
      { topicKey: 'numberWordCodes', questions: 7 },
    ]
  }
];

// Maths paper configuration (simpler — no type grouping)
export const mathsPaperConfig = {
  totalQuestions: 50,
  timeMinutes: 50,
  // Questions selected from all 16 topics, mixed throughout
  // Difficulty progression: ~15 D1 (Q1-15), ~20 D2 (Q16-35), ~15 D3 (Q36-50)
  difficultyDistribution: [
    { difficulty: 1, count: 15 },
    { difficulty: 2, count: 20 },
    { difficulty: 3, count: 15 },
  ],
  // All topics participate — questions distributed roughly evenly
  // but weighted toward Number topics (fractions, decimals, percentages)
  topicWeights: {
    percentages: 1.5,
    decimals: 1.5,
    fractions: 1.5,
    longdivision: 1.0,
    longmultiplication: 1.0,
    ratio: 1.0,
    algebra: 1.0,
    placevalue: 0.8,
    negativenumbers: 0.8,
    primenumbersfactors: 0.8,
    areaperimeter: 1.0,
    volume: 0.8,
    anglesshapes: 1.0,
    sequences: 0.8,
    datahandling: 1.0,
    speeddistancetime: 0.7,
  }
};

// English paper configuration
export const englishPaperConfig = {
  totalQuestions: 49,
  timeMinutes: 50,
  sections: [
    { name: 'Reading Comprehension', key: 'comprehension', questions: 18, source: 'mockComprehension' },
    { name: 'Vocabulary in Context', key: 'vocabulary', questions: 4, source: 'mockComprehension' },
    { name: 'Word Class & Grammar', key: 'wordClass', questions: 3, source: 'mockComprehension' },
    { name: 'Spelling', key: 'spelling', questions: 8, source: 'englishData' },
    { name: 'Punctuation', key: 'punctuation', questions: 8, source: 'englishData' },
    { name: 'Grammar & Cloze', key: 'grammar', questions: 8, source: 'englishData' },
  ]
};

export default { vrTypeInstructions, vrPaperVariants, mathsPaperConfig, englishPaperConfig };
