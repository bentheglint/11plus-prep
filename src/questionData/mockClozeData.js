// Mock Test Cloze Data (benchmark fix #6)
// Authentic GL running-passage Cloze (Q42-49): a short narrative (~80-100 words) with 8
// inline gaps, each a 5-option MCQ with real "errors children write" distractors
// (homophones, wrong verb forms, should-of, preposition traps). Gaps ramp D1->D3.
// All content 100% original — British English, UK context. Position-balanced A-E.
// Wired into the English mock via generateEnglishPaper() in src/hooks/useMockTest.js.

export const mockClozePassages = [
  {
    "id": "mock-cloze-market-stall",
    "title": "The Market Stall",
    "passage": "Every Saturday I help my uncle run his fruit stall at the market. This week there were far ___(1)___ many customers for him to serve alone, so I ___(2)___ the apples into neat rows. He told me to keep the change ___(3)___ the tin beneath the counter. Business was slow at first, ___(4)___ soon the stall was buzzing with people. As the last customer ___(5)___, I counted the coins. I knew I should ___(6)___ started earlier, because we had nearly ___(7)___ out of bags. Every stallholder around us ___(8)___ tired but happy.",
    "clozeQuestions": [
      {
        "id": 1,
        "difficulty": 1,
        "gapNumber": 1,
        "questionType": "cloze",
        "question": "Gap 1 — choose the word that best completes the passage.",
        "options": [
          "to",
          "two",
          "too",
          "tow",
          "toe"
        ],
        "correct": 2,
        "explanation": "'Too' means 'excessively', so 'far too many customers' means there were more than he could handle. 'To' and 'two' are the homophones children mix up, and 'tow'/'toe' are real words that sound alike but make no sense here. ✓"
      },
      {
        "id": 2,
        "difficulty": 1,
        "gapNumber": 2,
        "questionType": "cloze",
        "question": "Gap 2 — choose the word that best completes the passage.",
        "options": [
          "stack",
          "stacked",
          "stacks",
          "stacking",
          "stackt"
        ],
        "correct": 1,
        "explanation": "The story is told in the past, so the regular past tense 'stacked' is needed. 'Stack/stacks' slip into the present and 'stacking' has no helping verb. ✓"
      },
      {
        "id": 3,
        "difficulty": 1,
        "gapNumber": 3,
        "questionType": "cloze",
        "question": "Gap 3 — choose the word that best completes the passage.",
        "options": [
          "on",
          "at",
          "into",
          "in",
          "by"
        ],
        "correct": 3,
        "explanation": "The coins are kept inside the tin, so 'in' is correct. 'Into' suggests movement and 'on' means the surface; neither fits change resting inside. ✓"
      },
      {
        "id": 4,
        "difficulty": 2,
        "gapNumber": 4,
        "questionType": "cloze",
        "question": "Gap 4 — choose the word that best completes the passage.",
        "options": [
          "but",
          "so",
          "because",
          "and",
          "or"
        ],
        "correct": 0,
        "explanation": "Slow at first, then busy — that contrast needs 'but'. Children often reach for 'and', but 'and' only adds ideas; it does not signal the change. ✓"
      },
      {
        "id": 5,
        "difficulty": 2,
        "gapNumber": 5,
        "questionType": "cloze",
        "question": "Gap 5 — choose the word that best completes the passage.",
        "options": [
          "passed",
          "past",
          "pased",
          "passt",
          "passing"
        ],
        "correct": 0,
        "explanation": "'Passed' is the past tense of the verb 'to pass' — the customer walked by. 'Past' sounds identical but means a time or position, so it cannot be the verb here. ✓"
      },
      {
        "id": 6,
        "difficulty": 2,
        "gapNumber": 6,
        "questionType": "cloze",
        "question": "Gap 6 — choose the word that best completes the passage.",
        "options": [
          "of",
          "had",
          "off",
          "ov",
          "have"
        ],
        "correct": 4,
        "explanation": "'Should have started' is correct. 'Should've' sounds like 'should of', so children write 'of', but the word is always 'have'. ✓"
      },
      {
        "id": 7,
        "difficulty": 3,
        "gapNumber": 7,
        "questionType": "cloze",
        "question": "Gap 7 — choose the word that best completes the passage.",
        "options": [
          "ran",
          "runned",
          "running",
          "run",
          "runed"
        ],
        "correct": 3,
        "explanation": "After 'had' we need the past participle 'run', not the past simple 'ran'. 'We had run out' is correct; 'had ran' is a common slip. ✓"
      },
      {
        "id": 8,
        "difficulty": 3,
        "gapNumber": 8,
        "questionType": "cloze",
        "question": "Gap 8 — choose the word that best completes the passage.",
        "options": [
          "were",
          "are",
          "was",
          "is",
          "been"
        ],
        "correct": 2,
        "explanation": "'Every stallholder' is singular, so it takes 'was', even though it feels like many people. 'Were' is the trap for readers who hear 'stallholders' as plural. ✓"
      }
    ]
  },
  {
    "id": "mock-cloze-canal-boat",
    "title": "The Canal Boat Journey",
    "passage": "At last the summer holidays had arrived, and we were finally ___(1)___ on our narrowboat. My dad ___(2)___ the ropes while my sister and I fed the ducks. We wore thick coats ___(3)___ the morning wind was chilly. The old stone bridge was far too low ___(4)___ us to stand beneath. Dad said we should ___(5)___ brought more bread for the ducks. As we glided ___(6)___ the long, dark tunnel, my sister wished the journey ___(7)___ longer. By evening, everyone aboard ___(8)___ ready for a hot supper.",
    "clozeQuestions": [
      {
        "id": 1,
        "difficulty": 1,
        "gapNumber": 1,
        "questionType": "cloze",
        "question": "Gap 1 — choose the word that best completes the passage.",
        "options": [
          "hear",
          "heir",
          "hier",
          "here",
          "heer"
        ],
        "correct": 3,
        "explanation": "'Here' shows place — the family had arrived at the boat. 'Hear' sounds the same but means to listen with your ears, so it cannot fit. ✓"
      },
      {
        "id": 2,
        "difficulty": 1,
        "gapNumber": 2,
        "questionType": "cloze",
        "question": "Gap 2 — choose the word that best completes the passage.",
        "options": [
          "untie",
          "untied",
          "unties",
          "untying",
          "untyed"
        ],
        "correct": 1,
        "explanation": "The trip is told in the past, so 'untied' is right. 'Untie/unties' slip into the present and 'untying' needs a helping verb like 'was'. ✓"
      },
      {
        "id": 3,
        "difficulty": 1,
        "gapNumber": 3,
        "questionType": "cloze",
        "question": "Gap 3 — choose the word that best completes the passage.",
        "options": [
          "so",
          "but",
          "or",
          "although",
          "because"
        ],
        "correct": 4,
        "explanation": "The coats were worn for a reason — the chilly wind — so 'because' fits. 'So' would put the result and the cause the wrong way round. ✓"
      },
      {
        "id": 4,
        "difficulty": 2,
        "gapNumber": 4,
        "questionType": "cloze",
        "question": "Gap 4 — choose the word that best completes the passage.",
        "options": [
          "to",
          "of",
          "than",
          "with",
          "for"
        ],
        "correct": 4,
        "explanation": "The pattern is 'too low for us to stand' — 'for' introduces who cannot do it. 'To' is the tempting slip, but it belongs before the verb 'stand', not before 'us'. ✓"
      },
      {
        "id": 5,
        "difficulty": 2,
        "gapNumber": 5,
        "questionType": "cloze",
        "question": "Gap 5 — choose the word that best completes the passage.",
        "options": [
          "have",
          "of",
          "had",
          "off",
          "ov"
        ],
        "correct": 0,
        "explanation": "'Should have brought' is correct. It sounds like 'should of' when spoken quickly, but the word is always 'have'. ✓"
      },
      {
        "id": 6,
        "difficulty": 2,
        "gapNumber": 6,
        "questionType": "cloze",
        "question": "Gap 6 — choose the word that best completes the passage.",
        "options": [
          "threw",
          "thru",
          "through",
          "throo",
          "though"
        ],
        "correct": 2,
        "explanation": "'Through' means from one end of the tunnel to the other. 'Threw' sounds identical but is the past tense of 'throw', so it cannot fit. ✓"
      },
      {
        "id": 7,
        "difficulty": 3,
        "gapNumber": 7,
        "questionType": "cloze",
        "question": "Gap 7 — choose the word that best completes the passage.",
        "options": [
          "was",
          "is",
          "would be",
          "were",
          "had been"
        ],
        "correct": 3,
        "explanation": "After 'wish', standard English uses the subjunctive 'were', even for one journey: 'wished the journey were longer'. 'Was' sounds natural but is the trap. ✓"
      },
      {
        "id": 8,
        "difficulty": 3,
        "gapNumber": 8,
        "questionType": "cloze",
        "question": "Gap 8 — choose the word that best completes the passage.",
        "options": [
          "were",
          "was",
          "are",
          "is",
          "been"
        ],
        "correct": 1,
        "explanation": "'Everyone' is singular and takes 'was', even though many people were aboard. 'Were' is the trap for readers who treat 'everyone' as plural. ✓"
      }
    ]
  },
  {
    "id": "mock-cloze-missing-key",
    "title": "The Missing House Key",
    "passage": "When I got home from school, I pressed my ear to the door but could not ___(1)___ a sound. My key had vanished, ___(2)___ I ___(3)___ everything out of my schoolbag onto the step. A neighbour ___(4)___ by and asked whether I was locked out. I was so worried ___(5)___ getting into trouble that my hands shook. Mum would be home any minute, so I ___(6)___ stayed calm. By the time she pulled up, every one of my pockets ___(7)___ been turned inside out. Then I remembered that I had ___(8)___ a spare key under the doormat myself!",
    "clozeQuestions": [
      {
        "id": 1,
        "difficulty": 1,
        "gapNumber": 1,
        "questionType": "cloze",
        "question": "Gap 1 — choose the word that best completes the passage.",
        "options": [
          "here",
          "heard",
          "hears",
          "hearing",
          "hear"
        ],
        "correct": 4,
        "explanation": "After 'could not' we need the base verb, and the meaning is to listen for a noise, so 'hear' is correct. 'Here' is its homophone (a place word); 'heard/hears/hearing' are the wrong verb forms after 'could not'. ✓"
      },
      {
        "id": 2,
        "difficulty": 1,
        "gapNumber": 2,
        "questionType": "cloze",
        "question": "Gap 2 — choose the word that best completes the passage.",
        "options": [
          "but",
          "because",
          "so",
          "although",
          "or"
        ],
        "correct": 2,
        "explanation": "The key vanishing is the reason for emptying the bag, so 'so' (showing a result) is correct. 'Because' would wrongly make emptying the bag the cause of the key vanishing; 'but/although/or' do not fit a cause-and-result link. ✓"
      },
      {
        "id": 3,
        "difficulty": 1,
        "gapNumber": 3,
        "questionType": "cloze",
        "question": "Gap 3 — choose the word that best completes the passage.",
        "options": [
          "tiped",
          "tips",
          "tipping",
          "tipped",
          "tip"
        ],
        "correct": 3,
        "explanation": "The story is in the past tense, and the past of 'tip' doubles the 'p': 'tipped'. 'Tiped' is the common misspelling; 'tips/tip' are present tense and 'tipping' needs an auxiliary like 'was'. ✓"
      },
      {
        "id": 4,
        "difficulty": 2,
        "gapNumber": 4,
        "questionType": "cloze",
        "question": "Gap 4 — choose the word that best completes the passage.",
        "options": [
          "passed",
          "past",
          "passes",
          "passing",
          "pass"
        ],
        "correct": 0,
        "explanation": "This gap needs the past-tense verb 'passed' (the neighbour walked by). 'Past' is its homophone but a preposition or noun, never a verb; 'passes/passing/pass' are the wrong verb forms for a past-tense story. ✓"
      },
      {
        "id": 5,
        "difficulty": 2,
        "gapNumber": 5,
        "questionType": "cloze",
        "question": "Gap 5 — choose the word that best completes the passage.",
        "options": [
          "about",
          "for",
          "of",
          "with",
          "on"
        ],
        "correct": 0,
        "explanation": "The fixed phrase is 'worried about', and only 'about' fits before the -ing action 'getting into trouble'. 'Worried for' needs a person ('worried for her'); 'of/with/on' are not used with 'worried' here. ✓"
      },
      {
        "id": 6,
        "difficulty": 2,
        "gapNumber": 6,
        "questionType": "cloze",
        "question": "Gap 6 — choose the words that best complete the passage.",
        "options": [
          "should of",
          "should have",
          "should off",
          "should had",
          "should has"
        ],
        "correct": 1,
        "explanation": "A modal like 'should' is always followed by 'have' plus a past participle: 'should have stayed'. 'Should of/off' come from mishearing 'should've'; 'should had/has' use the wrong auxiliary after a modal. ✓"
      },
      {
        "id": 7,
        "difficulty": 3,
        "gapNumber": 7,
        "questionType": "cloze",
        "question": "Gap 7 — choose the word that best completes the passage.",
        "options": [
          "have",
          "had",
          "has",
          "were",
          "was"
        ],
        "correct": 1,
        "explanation": "The subject is singular ('every one'), and the past-tense story needs the past perfect passive 'had been turned'. 'Have' is tempting because 'pockets' is nearby, but it disagrees with 'every one'; 'has' is present tense, and 'were/was been' are not real verb forms. ✓"
      },
      {
        "id": 8,
        "difficulty": 3,
        "gapNumber": 8,
        "questionType": "cloze",
        "question": "Gap 8 — choose the word that best completes the passage.",
        "options": [
          "hid",
          "hide",
          "hidden",
          "hided",
          "hiding"
        ],
        "correct": 2,
        "explanation": "After 'had' we need the past participle, and for 'hide' that is 'hidden': 'had hidden'. 'Hid' is the past simple (children often use it here by mistake); 'hide/hided/hiding' are the wrong forms after 'had'. ✓"
      }
    ]
  }
];
