// ============================================================
// Supplementary sub-concepts for Grammar
// To merge: add these to lessonBank.grammar.subConcepts array in lessonData.js
// ============================================================

export const grammarSubConcepts = [
  // ==========================================
  // SUB-CONCEPT 1: Subject-Verb Agreement
  // ==========================================
  {
    id: "subject-verb-agreement",
    name: "Subject-Verb Agreement",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "subject-verb-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to match singular subjects with singular verbs — and why getting it right makes your writing sound spot on",
          "How to match plural subjects with plural verbs (it's easier than you think!)"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "is writing a report about her school sports day",
            subject: "The dogs",
            verb: "were",
            wrongVerb: "was",
            correctSentence: "The dogs were barking loudly in the park.",
            wrongSentence: "The dogs was barking loudly in the park.",
            trickySentence: "Neither the captain nor the goalkeeper was late.",
            trickyWrong: "Neither the captain nor the goalkeeper were late.",
            trickyRule: "With 'neither...nor', the verb agrees with the subject closest to it",
            subjectType: "plural",
            explanation: "'The dogs' is plural, so we need the plural verb 'were' — not the singular 'was'",
            interactCorrectSentence: "The cats were sleeping on the sofa.",
            interactWrongSentence: "The cats was sleeping on the sofa.",
            interactTrickyWrong: "Neither the teacher nor the pupils was ready for assembly.",
            interactSubject: "The cats",
            interactWrongVerb: "was",
            interactExplanation: "'The cats' is plural, so we need the plural verb 'were' — not the singular 'was'"
          },
          {
            name: "Finn",
            scenario: "is writing about his weekend",
            subject: "She",
            verb: "doesn't",
            wrongVerb: "don't",
            correctSentence: "She doesn't know the answer to the question.",
            wrongSentence: "She don't know the answer to the question.",
            trickySentence: "Neither the teacher nor the pupils were ready for the test.",
            trickyWrong: "Neither the teacher nor the pupils was ready for the test.",
            trickyRule: "With 'neither...nor', the verb agrees with the subject closest to it — here 'pupils' is plural, so we use 'were'",
            subjectType: "singular",
            explanation: "'She' is singular, so we need the singular verb 'doesn't' — not the plural 'don't'",
            interactCorrectSentence: "He doesn't like broccoli at all.",
            interactWrongSentence: "He don't like broccoli at all.",
            interactTrickyWrong: "Neither the boys nor the girl were chosen for the team.",
            interactSubject: "He",
            interactWrongVerb: "don't",
            interactExplanation: "'He' is singular, so we need the singular verb 'doesn't' — not the plural 'don't'"
          },
          {
            name: "Aisha",
            scenario: "is writing a paragraph about playtime",
            subject: "The children",
            verb: "were",
            wrongVerb: "was",
            correctSentence: "The children were playing outside after lunch.",
            wrongSentence: "The children was playing outside after lunch.",
            trickySentence: "Neither Mum nor the children were upset about the rain.",
            trickyWrong: "Neither Mum nor the children was upset about the rain.",
            trickyRule: "With 'neither...nor', the verb agrees with the nearest subject — 'the children' is plural, so we use 'were'",
            subjectType: "plural",
            explanation: "'The children' is plural, so we need the plural verb 'were' — not the singular 'was'",
            interactCorrectSentence: "The birds were singing in the trees.",
            interactWrongSentence: "The birds was singing in the trees.",
            interactTrickyWrong: "Neither Dad nor the neighbours was happy about the noise.",
            interactSubject: "The birds",
            interactWrongVerb: "was",
            interactExplanation: "'The birds' is plural, so we need the plural verb 'were' — not the singular 'was'"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Something sounds dodgy here...`,
            body: (v) => `${v.name} ${v.scenario}. But read this sentence aloud — does something sound off to you?\n\n"${v.wrongSentence}"`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.wrongSentence,
                highlightWords: [{ word: v.wrongVerb || "", color: "#e74c3c" }],
                label: "Does this sound right?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The subject-verb handshake!",
            body: (v) => `Think of the subject and verb as dance partners — they have to match! In ${v.name}'s sentence, **"${v.subject}"** is the subject. The word **"${v.wrongVerb}"** is the wrong partner — it should be **"${v.verb}"**.\nSingular subjects need singular verbs, and plural subjects need plural verbs. Get this right and your writing will sound professional!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Find the subject: "${v.subject}"`, why: `This is a ${v.subjectType} subject` },
                  { text: `${v.explanation}`, why: `So: "${v.subject}" → "${v.verb}"` },
                  { text: `✓ "${v.correctSentence}"`, why: `${v.subjectType === "plural" ? "Plural" : "Singular"} subject → ${v.subjectType === "plural" ? "plural" : "singular"} verb` },
                  { text: `Tricky: "${v.trickySentence}"`, why: `${v.trickyRule}` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Find the subject — who or what is the sentence about?`,
                `Decide: is the subject singular or plural?`,
                `Pick the verb that matches — singular verb for singular subject, plural verb for plural`
              ],
              feedback: {
                correct: (v) => `Nailed it! Find the subject, check singular or plural, then match the verb. That's the recipe! ✓`,
                incorrect: (v) => `Almost there! Start by finding the subject, then decide if it's singular or plural, then match the verb. You'll get it!`
              }
            }
          },
          {
            type: "interact",
            title: () => "You're up!",
            body: (v) => `Time to put your new skill to the test — which sentence sounds right?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.interactWrongSentence,
                highlightWords: [],
                label: "Which version is correct?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which sentence uses the correct verb?`,
              getOptions: (v) => [
                v.interactCorrectSentence,
                v.interactWrongSentence,
                v.interactTrickyWrong,
                `${v.interactSubject} ${v.interactWrongVerb} ${v.interactWrongVerb === "don't" ? "like playing football." : v.interactWrongVerb === "was" ? "always ready for school." : "happy about the result."}`,
                `${v.interactSubject} ${v.interactWrongVerb} ${v.interactWrongVerb === "don't" ? "know the way home." : v.interactWrongVerb === "was" ? "running in the corridor." : "excited about the trip."}`
              ],
              correctAnswer: (v) => v.interactCorrectSentence,
              feedback: {
                correct: (v) => `Brilliant — you've got a great ear for this! ${v.interactExplanation}. ✓`,
                incorrect: (v) => `Not quite — but don't worry, this trips up loads of people! ${v.interactExplanation}. The correct sentence is: "${v.interactCorrectSentence}".`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Subject-verb agreement — you've got this!",
            body: () => `Follow these steps to get your verbs right every time — it'll become second nature:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Find the subject of the sentence", why: "Who or what is doing the action?" },
                  { text: "Step 2: Is it singular or plural?", why: "Singular = one (she, the dog, everyone). Plural = more than one (they, the dogs, the children)" },
                  { text: "Step 3: Match the verb", why: "Singular subject → singular verb (is, was, has, doesn't). Plural → plural verb (are, were, have, don't)" },
                  { text: "Step 4: Check 'neither...nor' carefully", why: "The verb agrees with the subject CLOSEST to it ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot the Mistake ----
      {
        id: "subject-verb-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to spot subject-verb disagreement — and why even grown-ups get caught out by this one!",
          "Why some sneaky subjects trick people into using the wrong verb"
        ],
        variableSets: [
          {
            name: "Oliver",
            scenario: "wrote a paragraph about sports day",
            wrongSentence: "The boys in my class was running the relay race.",
            correctSentence: "The boys in my class were running the relay race.",
            mistake: "used the singular verb 'was' with the plural subject 'The boys'",
            rule: "'The boys' is plural, so it needs the plural verb 'were' — don't be tricked by 'in my class' in the middle",
            interactCorrectSentence: "The girls in our team were winning the race.",
            interactWrongSentence: "The girls in our team was winning the race.",
            interactRule: "'The girls' is plural, so it needs the plural verb 'were' — don't be tricked by 'in our team' in the middle"
          },
          {
            name: "Zara",
            scenario: "wrote about her weekend",
            wrongSentence: "My sisters goes to the cinema every Saturday.",
            correctSentence: "My sisters go to the cinema every Saturday.",
            mistake: "used the singular verb 'goes' with the plural subject 'My sisters'",
            rule: "'My sisters' is plural, so it needs the plural verb 'go' — not the singular 'goes'",
            interactCorrectSentence: "My brothers walk to school together.",
            interactWrongSentence: "My brothers walks to school together.",
            interactRule: "'My brothers' is plural, so it needs the plural verb 'walk' — not the singular 'walks'"
          },
          {
            name: "Ethan",
            scenario: "wrote a letter to his pen pal",
            wrongSentence: "Everyone in my class have a pet at home.",
            correctSentence: "Everyone in my class has a pet at home.",
            mistake: "used 'have' instead of 'has' — 'everyone' is always singular",
            rule: "'Everyone' always takes a singular verb, even though it talks about lots of people",
            interactCorrectSentence: "Nobody in the playground wants to come inside.",
            interactWrongSentence: "Nobody in the playground want to come inside.",
            interactRule: "'Nobody' always takes a singular verb, even though it talks about multiple people"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Did you know? Even news presenters make this mistake!`,
            body: (v) => `${v.name} ${v.scenario}. But one sentence has a sneaky grammar mistake — can you hear it?\n\n"${v.wrongSentence}"`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.wrongSentence,
                highlightWords: [],
                label: "Can you spot the mistake?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Here's the trap — and how to dodge it!",
            body: (v) => `${v.name} ${v.mistake}.\n\n${v.rule}. Once you spot this pattern, you'll catch it every time!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `✗ "${v.wrongSentence}"`, why: `${v.mistake}` },
                  { text: `✓ "${v.correctSentence}"`, why: `${v.rule}` }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "The dogs", right: "were (plural)" },
                { left: "She", right: "doesn't (singular)" },
                { left: "Everyone", right: "has (singular)" },
                { left: "The children", right: "are (plural)" },
                { left: "Nobody", right: "was (singular)" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn — fix the sentence!",
            body: (v) => `Can you pick the one that sounds right? Trust your ear!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.interactWrongSentence,
                highlightWords: [],
                label: "Which version is correct?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which sentence is grammatically correct?`,
              getOptions: (v) => [
                v.interactCorrectSentence,
                v.interactWrongSentence,
                `The team of players were arguing about the rules.`,
                `Nobody in the class have finished yet.`,
                `Each of the pupils in the group are ready.`
              ],
              correctAnswer: (v) => v.interactCorrectSentence,
              feedback: {
                correct: (v) => `Well done — that's a tricky one and you nailed it! ${v.interactRule}. ✓`,
                incorrect: (v) => `Nearly! This one catches out loads of people. ${v.interactRule}. The correct sentence is: "${v.interactCorrectSentence}".`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "You're now a subject-verb detective!",
            body: () => `Here's your checklist — keep this in your back pocket for the exam:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Find the TRUE subject", why: "Who or what is the sentence really about? Don't be distracted!" },
                  { text: "Step 2: Ignore words in between", why: "'The box of chocolates WAS heavy' — 'box' is the subject, not 'chocolates'" },
                  { text: "Step 3: Is the subject singular or plural?", why: "One thing = singular. More than one = plural" },
                  { text: "Step 4: Match the verb", why: "Singular: was, is, has, goes. Plural: were, are, have, go" },
                  { text: "Bonus trap: everyone, nobody, each = always singular", why: "Even though they talk about lots of people — sneaky!" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 2: Past, Present, and Future Tenses
  // ==========================================
  {
    id: "verb-tenses",
    name: "Past, Present, and Future Tenses",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "verb-tenses-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to spot whether something happened yesterday, is happening now, or will happen tomorrow — just from the verb!",
          "How to keep your tenses consistent so your writing flows smoothly"
        ],
        variableSets: [
          {
            name: "Grace",
            scenario: "is writing a diary entry about her school trip",
            pastSentence: "We walked to the museum and looked at the dinosaurs.",
            presentSentence: "We are walking to the museum and looking at the dinosaurs.",
            futureSentence: "We will walk to the museum and will look at the dinosaurs.",
            verb: "walk",
            pastForm: "walked",
            presentForm: "is walking",
            futureForm: "will walk",
            inconsistent: "We walked to the museum and are looking at the dinosaurs.",
            consistent: "We walked to the museum and looked at the dinosaurs.",
            inconsistentExplanation: "'walked' is past tense but 'are looking' is present tense — they don't match",
            interactConsistent: "She painted a picture and hung it on the wall.",
            interactInconsistent: "She painted a picture and hangs it on the wall.",
            interactExplanation: "Both verbs should be past tense: 'painted' and 'hung'"
          },
          {
            name: "Ben",
            scenario: "is writing a story about a football match",
            pastSentence: "The striker kicked the ball and scored a goal.",
            presentSentence: "The striker kicks the ball and scores a goal.",
            futureSentence: "The striker will kick the ball and will score a goal.",
            verb: "kick",
            pastForm: "kicked",
            presentForm: "kicks",
            futureForm: "will kick",
            inconsistent: "The striker kicked the ball and scores a goal.",
            consistent: "The striker kicked the ball and scored a goal.",
            inconsistentExplanation: "'kicked' is past tense but 'scores' is present tense — pick one and stick with it",
            interactConsistent: "He caught the ball and threw it back quickly.",
            interactInconsistent: "He caught the ball and throws it back quickly.",
            interactExplanation: "Both verbs should be past tense: 'caught' and 'threw'"
          },
          {
            name: "Priya",
            scenario: "is writing about her swimming lessons",
            pastSentence: "She dived into the pool and swam ten lengths.",
            presentSentence: "She dives into the pool and swims ten lengths.",
            futureSentence: "She will dive into the pool and will swim ten lengths.",
            verb: "dive",
            pastForm: "dived",
            presentForm: "dives",
            futureForm: "will dive",
            inconsistent: "She dived into the pool and swims ten lengths.",
            consistent: "She dived into the pool and swam ten lengths.",
            inconsistentExplanation: "'dived' is past tense but 'swims' is present tense — both verbs should be in the same tense",
            interactConsistent: "They ran across the field and climbed over the fence.",
            interactInconsistent: "They ran across the field and climb over the fence.",
            interactExplanation: "Both verbs should be past tense: 'ran' and 'climbed'"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Did you know? Verbs are like time machines!`,
            body: (v) => `${v.name} ${v.scenario}. Here's the cool thing — every verb tells us **when** something happens. Change the verb and you travel in time! Let's learn how to spot the **tense** and keep it consistent.`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `Past: ${v.pastForm} | Present: ${v.presentForm} | Future: ${v.futureForm}`,
                highlightWords: [{ word: v.pastForm, color: "#7C3AED" }, { word: v.presentForm, color: "#22c55e" }, { word: v.futureForm, color: "#f59e0b" }],
                label: "Three tenses of the same verb:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Watch the verb change shape!",
            body: (v) => `Look at how the verb **"${v.verb}"** transforms depending on the tense — same action, different time:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Past tense: "${v.pastSentence}"`, why: "Done and dusted — it happened before now" },
                  { text: `Present tense: "${v.presentSentence}"`, why: "Happening right now, as we speak!" },
                  { text: `Future tense: "${v.futureSentence}"`, why: "Coming soon — look for 'will' as your clue" },
                  { text: `Keep tenses consistent!`, why: `Don't mix: "${v.inconsistent}" ✗ — ${v.inconsistentExplanation}` }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "walked", right: "past tense" },
                { left: "is walking", right: "present tense" },
                { left: "will walk", right: "future tense" },
                { left: "-ed ending", right: "usually past" },
                { left: "will + verb", right: "always future" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Can you spot the smooth one?",
            body: (v) => `One of these sentences keeps its tenses perfectly consistent — which one?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: "All verbs should be in the SAME tense",
                highlightWords: [],
                label: "Which sentence is consistent?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which sentence has consistent tenses?`,
              getOptions: (v) => [
                v.interactConsistent,
                v.interactInconsistent,
                `The dog chased the ball and catches it near the fence.`,
                `We arrived at the park and will eat our picnic there.`,
                `She opened the door and is walking inside slowly.`
              ],
              correctAnswer: (v) => v.interactConsistent,
              feedback: {
                correct: (v) => `Brilliant — you've got a great ear for this! ${v.interactExplanation}. ✓`,
                incorrect: (v) => `Close! Look for a sentence where ALL the verbs are in the same tense. "${v.interactConsistent}" — ${v.interactExplanation}.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Tense consistency — you've cracked it!",
            body: () => `Here's your 3-step check — use it every time you write:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Find all the verbs in the sentence", why: "Look for the 'doing' or 'being' words — there might be more than one!" },
                  { text: "Step 2: Check — are they all in the same tense?", why: "Past (-ed, irregular), present (-s, -ing), future (will)" },
                  { text: "Step 3: If they don't match, fix them!", why: "Change ALL the verbs to the same tense — consistency is king! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot the Mistake ----
      {
        id: "verb-tenses-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to spot when tenses go haywire in a sentence — your secret weapon for the exam!",
          "Why mixing tenses confuses the reader (and how to fix it in seconds)"
        ],
        variableSets: [
          {
            name: "Marcus",
            scenario: "wrote a paragraph about his birthday party",
            wrongSentence: "We played musical chairs and then everyone is eating cake.",
            correctSentence: "We played musical chairs and then everyone ate cake.",
            mistake: "switched from past tense ('played') to present tense ('is eating') mid-sentence",
            rule: "Both actions happened at the party, so both verbs should be in the past tense",
            interactCorrectSentence: "The guests arrived early and helped set up the decorations.",
            interactWrongSentence: "The guests arrived early and help set up the decorations.",
            interactRule: "Both actions happened at the party, so both verbs should be past tense: 'arrived' and 'helped'"
          },
          {
            name: "Ella",
            scenario: "wrote about what she did at the weekend",
            wrongSentence: "On Saturday I go swimming and then I watched a film.",
            correctSentence: "On Saturday I went swimming and then I watched a film.",
            mistake: "started with present tense ('go') but then switched to past tense ('watched')",
            rule: "Both events happened on Saturday, so both should be in the past: 'went' and 'watched'",
            interactCorrectSentence: "On Sunday she tidied her room and finished her homework.",
            interactWrongSentence: "On Sunday she tidy her room and finished her homework.",
            interactRule: "Both events happened on Sunday, so both verbs should be past tense: 'tidied' and 'finished'"
          },
          {
            name: "Charlie",
            scenario: "wrote a story about exploring a cave",
            wrongSentence: "The children crept into the cave and find a hidden treasure chest.",
            correctSentence: "The children crept into the cave and found a hidden treasure chest.",
            mistake: "used past tense ('crept') for the first verb but present tense ('find') for the second",
            rule: "In a story set in the past, all verbs must be past tense: 'crept' and 'found'",
            interactCorrectSentence: "The explorers climbed the hill and spotted a deer in the valley.",
            interactWrongSentence: "The explorers climbed the hill and spot a deer in the valley.",
            interactRule: "In a story set in the past, all verbs must be past tense: 'climbed' and 'spotted'"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Can your ear catch the time-travel glitch?`,
            body: (v) => `${v.name} ${v.scenario}. But this sentence jumps between time zones! Can you hear the mix-up?\n\n"${v.wrongSentence}"`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.wrongSentence,
                highlightWords: [],
                label: "Can you spot the mistake?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Caught it! Here's what went wrong.",
            body: (v) => `${v.name} ${v.mistake}.\n\n${v.rule}. This is one of the most common mistakes in writing — spotting it is a real superpower!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `✗ "${v.wrongSentence}"`, why: `${v.mistake}` },
                  { text: `✓ "${v.correctSentence}"`, why: `${v.rule}` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `It's fine to start a sentence in the past tense and finish it in the present tense`, answer: false, explanation: `No! All verbs in a sentence should be in the same tense — don't mix past and present. ✓` },
                { text: `"${v.correctSentence}" keeps consistent tenses throughout`, answer: true, explanation: `Yes! Both verbs are in the past tense, so the sentence is consistent. ✓` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn — fix the time-travel!",
            body: (v) => `Which sentence stays in the same time zone?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.interactWrongSentence,
                highlightWords: [],
                label: "Which version is correct?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which sentence is correct?`,
              getOptions: (v) => [
                v.interactCorrectSentence,
                v.interactWrongSentence,
                `The children walked to school and are eating lunch now.`,
                `She opened the book and reads the first page.`,
                `They ran outside and is playing in the garden.`
              ],
              correctAnswer: (v) => v.interactCorrectSentence,
              feedback: {
                correct: (v) => `Spot on! You're getting really good at this. ${v.interactRule}. ✓`,
                incorrect: (v) => `Close! ${v.interactRule}. The correct sentence is: "${v.interactCorrectSentence}". Keep practising — you're nearly there!`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The golden rule — stay in your time zone!",
            body: () => `Remember these three steps and you'll never mix up tenses again:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Pick your tense and STICK with it", why: "If you start in the past, stay in the past — no time-travelling!" },
                  { text: "Check every verb in the sentence", why: "Each one should be in the same tense as the others" },
                  { text: "Read it aloud — mixed tenses often sound wrong", why: "Your ear is your best tool — trust it! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 3: Irregular Past Tenses
  // ==========================================
  {
    id: "irregular-past",
    name: "Irregular Past Tenses",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "irregular-past-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to use irregular past tenses correctly — these rebel verbs don't follow the rules!",
          "Why 'I have went' is wrong but 'I have gone' is right (and how to never mix them up again)"
        ],
        variableSets: [
          {
            name: "Holly",
            scenario: "is writing about what happened at school yesterday",
            verb: "go",
            simplePast: "went",
            pastParticiple: "gone",
            wrongUsage: "I have went to the office.",
            correctUsage: "I have gone to the office.",
            simplePastSentence: "I went to the office.",
            helperVerb: "have",
            extraExample: "She has gone home.",
            extraWrong: "She has went home.",
            interactCorrectUsage: "They have gone to the assembly hall.",
            interactWrongUsage: "They have went to the assembly hall.",
            interactExtraWrong: "He has went out for break.",
            interactPastParticiple: "gone",
            interactSimplePast: "went"
          },
          {
            name: "Jack",
            scenario: "is telling his friend about the weekend",
            verb: "do",
            simplePast: "did",
            pastParticiple: "done",
            wrongUsage: "I have did all my homework.",
            correctUsage: "I have done all my homework.",
            simplePastSentence: "I did all my homework.",
            helperVerb: "have",
            extraExample: "She has done her chores.",
            extraWrong: "She has did her chores.",
            interactCorrectUsage: "We have done the washing-up already.",
            interactWrongUsage: "We have did the washing-up already.",
            interactExtraWrong: "They has did all the tidying.",
            interactPastParticiple: "done",
            interactSimplePast: "did"
          },
          {
            name: "Evie",
            scenario: "is writing about what she saw at the zoo",
            verb: "see",
            simplePast: "saw",
            pastParticiple: "seen",
            wrongUsage: "I have saw the lions.",
            correctUsage: "I have seen the lions.",
            simplePastSentence: "I saw the lions.",
            helperVerb: "have",
            extraExample: "He has seen that film before.",
            extraWrong: "He has saw that film before.",
            interactCorrectUsage: "She has seen the new exhibit twice.",
            interactWrongUsage: "She has saw the new exhibit twice.",
            interactExtraWrong: "We has saw the penguins already.",
            interactPastParticiple: "seen",
            interactSimplePast: "saw"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Did you know? These verbs are rebels!`,
            body: (v) => `${v.name} ${v.scenario}. Most verbs just add "-ed" for the past tense — easy, right? But some verbs are rebels! They change in unexpected ways. Let's learn when to use **"${v.simplePast}"** and when to use **"${v.pastParticiple}"**.`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `${v.wrongUsage} — or — ${v.correctUsage}`,
                highlightWords: [{ word: v.simplePast, color: "#e74c3c" }, { word: v.pastParticiple, color: "#22c55e" }],
                label: "Which is correct?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "One verb, two past forms — here's the trick!",
            body: (v) => `The verb **"${v.verb}"** has two past forms, and mixing them up is one of the most common mistakes in English. Here's how to get it right every time:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Simple past: "${v.simplePast}"`, why: `Stands on its own like a solo act: "${v.simplePastSentence}"` },
                  { text: `Past participle: "${v.pastParticiple}"`, why: `Always needs a helper (have/has/had): "${v.correctUsage}"` },
                  { text: `✗ NEVER say "${v.wrongUsage}"`, why: `"${v.simplePast}" and "${v.helperVerb}" don't go together — like wearing two left shoes!` },
                  { text: `✓ Always say "${v.correctUsage}"`, why: `"${v.helperVerb}" + "${v.pastParticiple}" is the winning combo` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `"I have ____" — which past form of "${v.verb}" goes with "have"?`,
              options: (v) => [v.pastParticiple, v.simplePast, v.verb, v.verb + "ing"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! With "have/has/had", always use "${v.pastParticiple}" — never "${v.simplePast}". You've got this! ✓`,
                incorrect: (v) => `Nearly! With "have/has/had", you need the past participle "${v.pastParticiple}", not "${v.simplePast}". Think: helper verb = participle partner.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Time to show off your skills!",
            body: (v) => `You know the rule — now put it into action!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `Use "${v.interactPastParticiple}" with have/has/had`,
                highlightWords: [{ word: v.interactPastParticiple, color: "#22c55e" }],
                label: "Remember the rule:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which sentence is grammatically correct?`,
              getOptions: (v) => [
                v.interactCorrectUsage,
                v.interactWrongUsage,
                v.interactExtraWrong,
                `They has ${v.interactPastParticiple} it already.`,
                `We ${v.interactPastParticiple} there yesterday.`
              ],
              correctAnswer: (v) => v.interactCorrectUsage,
              feedback: {
                correct: (v) => `Brilliant — you're a natural! With "have" you always use "${v.interactPastParticiple}", not "${v.interactSimplePast}". ✓`,
                incorrect: (v) => `Almost! When you see "have/has/had", reach for the past participle "${v.interactPastParticiple}": "${v.interactCorrectUsage}". You'll nail it next time!`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Irregular past tenses — sorted!",
            body: () => `Here's your foolproof method. Learn this and you'll be ahead of most grown-ups!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Is there a helper verb (have, has, had)?", why: "Spot it before the verb — it's the clue!" },
                  { text: "Step 2: If YES → use the past participle", why: "have GONE, has DONE, had SEEN — the helper's partner" },
                  { text: "Step 3: If NO → use the simple past", why: "I WENT, she DID, we SAW — flying solo" },
                  { text: "Key irregular verbs to learn:", why: "go→went/gone, do→did/done, see→saw/seen, eat→ate/eaten ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot the Mistake ----
      {
        id: "irregular-past-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to spot common irregular verb mistakes — the ones that trip up almost everyone!",
          "Why these errors happen (blame your ears!) and how to dodge them every time"
        ],
        variableSets: [
          {
            name: "Tom",
            scenario: "wrote a letter to his grandparents",
            wrongSentence: "I have went to the park every day this week.",
            correctSentence: "I have gone to the park every day this week.",
            mistake: "used 'went' with 'have' — but 'went' is the simple past, not the past participle",
            rule: "With 'have', always use 'gone' (not 'went'): 'I have gone'",
            interactCorrectSentence: "She has gone to the shops with Mum.",
            interactWrongSentence: "She has went to the shops with Mum.",
            interactRule: "With 'has', always use 'gone' (not 'went'): 'She has gone'"
          },
          {
            name: "Lily",
            scenario: "told her teacher about the school play",
            wrongSentence: "We have did a brilliant performance.",
            correctSentence: "We have done a brilliant performance.",
            mistake: "used 'did' with 'have' — but 'did' is the simple past, not the past participle",
            rule: "With 'have', always use 'done' (not 'did'): 'We have done'",
            interactCorrectSentence: "They have done all the rehearsals for the concert.",
            interactWrongSentence: "They have did all the rehearsals for the concert.",
            interactRule: "With 'have', always use 'done' (not 'did'): 'They have done'"
          },
          {
            name: "Noah",
            scenario: "wrote a book review",
            wrongSentence: "I have saw this film three times already.",
            correctSentence: "I have seen this film three times already.",
            mistake: "used 'saw' with 'have' — but 'saw' is the simple past, not the past participle",
            rule: "With 'have', always use 'seen' (not 'saw'): 'I have seen'",
            interactCorrectSentence: "We have seen that programme on telly before.",
            interactWrongSentence: "We have saw that programme on telly before.",
            interactRule: "With 'have', always use 'seen' (not 'saw'): 'We have seen'"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `This mistake is EVERYWHERE — can you catch it?`,
            body: (v) => `${v.name} ${v.scenario}. You'll hear this mistake on telly, in shops, even from teachers sometimes! Can you spot it?\n\n"${v.wrongSentence}"`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.wrongSentence,
                highlightWords: [],
                label: "Can you spot the mistake?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Here's why it sounds right but isn't!",
            body: (v) => `${v.name} ${v.mistake}.\n\n${v.rule}. People make this mistake because both forms sound like they could work — but only one is correct!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `✗ "${v.wrongSentence}"`, why: `${v.mistake}` },
                  { text: `✓ "${v.correctSentence}"`, why: `${v.rule}` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `"I have went to the park" is correct because "went" is the past tense of "go"`, answer: false, explanation: `"Went" is the simple past, but with "have" you need the past participle "gone": "I have gone." ✓` },
                { text: `With "have", "has", or "had", you always need the past participle (gone, done, seen)`, answer: true, explanation: `Exactly! Have/has/had + past participle is the rule: have gone, has done, had seen. ✓` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn — fix the rebel verb!",
            body: (v) => `Which sentence uses the correct past form? Remember: look for the helper!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.interactWrongSentence,
                highlightWords: [],
                label: "Which version is correct?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which sentence is correct?`,
              getOptions: (v) => [
                v.interactCorrectSentence,
                v.interactWrongSentence,
                `They has ate all of the cake at the party.`,
                `The children have wrote a letter to the headteacher.`,
                `She has broke the school record in the sprint.`
              ],
              correctAnswer: (v) => v.interactCorrectSentence,
              feedback: {
                correct: (v) => `Excellent work! You didn't fall for the trap. ${v.interactRule}. ✓`,
                incorrect: (v) => `Not quite — but don't worry, this catches out grown-ups too! ${v.interactRule}. The correct sentence is: "${v.interactCorrectSentence}".`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The big three — learn these and you're golden!",
            body: () => `These are the three most common irregular verb mix-ups. Get these right and you'll be ahead of most adults!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "✗ 'I have went' → ✓ 'I have gone'", why: "went flies solo, gone needs a helper (have/has/had)" },
                  { text: "✗ 'I have did' → ✓ 'I have done'", why: "did flies solo, done needs a helper" },
                  { text: "✗ 'I have saw' → ✓ 'I have seen'", why: "saw flies solo, seen needs a helper ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 4: Comparatives and Superlatives
  // ==========================================
  {
    id: "comparative-superlative",
    name: "Comparatives and Superlatives",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "comparative-superlative-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to form comparatives and superlatives — the words that let you crown a winner!",
          "When to use 'more' and 'most' instead of '-er' and '-est' (there's a neat trick for this)"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "is comparing three cakes she baked for a competition",
            shortAdj: "tall",
            comparative: "taller",
            superlative: "tallest",
            longAdj: "beautiful",
            longComparative: "more beautiful",
            longSuperlative: "most beautiful",
            irregAdj: "good",
            irregComparative: "better",
            irregSuperlative: "best",
            wrongDouble: "more taller",
            context: "cakes",
            interactLongAdj: "beautiful",
            interactLongSuperlative: "most beautiful",
            interactContext: "cakes",
            interactWrongSuperlative: "beautifulest",
            interactWrongDouble: "most beautifulest"
          },
          {
            name: "Oscar",
            scenario: "is writing a review of three different bikes",
            shortAdj: "fast",
            comparative: "faster",
            superlative: "fastest",
            longAdj: "comfortable",
            longComparative: "more comfortable",
            longSuperlative: "most comfortable",
            irregAdj: "good",
            irregComparative: "better",
            irregSuperlative: "best",
            wrongDouble: "more faster",
            context: "bikes",
            interactLongAdj: "comfortable",
            interactLongSuperlative: "most comfortable",
            interactContext: "bikes",
            interactWrongSuperlative: "comfortablest",
            interactWrongDouble: "most comfortablest"
          },
          {
            name: "Amara",
            scenario: "is describing three buildings she saw on a school trip",
            shortAdj: "old",
            comparative: "older",
            superlative: "oldest",
            longAdj: "impressive",
            longComparative: "more impressive",
            longSuperlative: "most impressive",
            irregAdj: "bad",
            irregComparative: "worse",
            irregSuperlative: "worst",
            wrongDouble: "more older",
            context: "buildings",
            interactLongAdj: "impressive",
            interactLongSuperlative: "most impressive",
            interactContext: "buildings",
            interactWrongSuperlative: "impressivest",
            interactWrongDouble: "most impressivest"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.comparative} or more ${v.shortAdj}? Only one is right!`,
            body: (v) => `${v.name} ${v.scenario}. When you compare things, you need the right word — but here's the thing: some words use "-er" and some use "more". Pick the wrong one and it sounds really odd!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `${v.shortAdj} → ${v.comparative} → ${v.superlative}`,
                highlightWords: [{ word: v.comparative, color: "#7C3AED" }],
                label: "Comparing words:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The syllable trick — it works every time!",
            body: (v) => `We saw **"${v.shortAdj}"** becoming **"${v.comparative}"** — but how do you know whether to add -er or use "more"? Here's the secret: it all comes down to how many syllables the word has!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Short words (1-2 syllables): add -er / -est`, why: `${v.shortAdj} → ${v.comparative} → ${v.superlative}` },
                  { text: `Long words (3+ syllables): use more / most`, why: `${v.longAdj} → ${v.longComparative} → ${v.longSuperlative}` },
                  { text: `Irregular words: learn these by heart!`, why: `${v.irregAdj} → ${v.irregComparative} → ${v.irregSuperlative}` },
                  { text: `✗ NEVER double up: "${v.wrongDouble}"`, why: `Using "more" AND "-er" together is like wearing a belt AND braces — pick one!` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `"${v.wrongDouble}" is correct because "more" makes the comparison stronger`, answer: false, explanation: `No! You can't use "more" AND "-er" together — that's a double comparative. Just say "${v.comparative}". ✓` },
                { text: `Short words (1-2 syllables) use -er/-est, while long words (3+) use more/most`, answer: true, explanation: `Correct! "${v.shortAdj}" is short so it becomes "${v.comparative}/${v.superlative}", but "${v.longAdj}" uses "${v.longComparative}/${v.longSuperlative}". ✓` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Now you try — count those syllables!",
            body: (v) => `Use the syllable trick to work out which comparison is correct!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `${v.interactLongAdj} → ? → ?`,
                highlightWords: [],
                label: "Complete the pattern:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which sentence is correct?`,
              getOptions: (v) => [
                `This is the ${v.interactLongSuperlative} of all three ${v.interactContext}.`,
                `This is the ${v.interactWrongDouble} of all three ${v.interactContext}.`,
                `This is the ${v.interactWrongSuperlative} of all three ${v.interactContext}.`,
                `This is the more ${v.interactLongAdj} of all three ${v.interactContext}.`,
                `This is the ${v.comparative} of all three ${v.interactContext}.`
              ],
              correctAnswer: (v) => `This is the ${v.interactLongSuperlative} of all three ${v.interactContext}.`,
              feedback: {
                correct: (v) => `Brilliant! You counted the syllables perfectly. "${v.interactLongAdj}" is a long word (3+ syllables), so we use "most": "${v.interactLongSuperlative}". ✓`,
                incorrect: (v) => `Nearly! Try clapping out the syllables — "${v.interactLongAdj}" is a long word, so use "most" before it: "the ${v.interactLongSuperlative} of all three".`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Comparisons — you've nailed it!",
            body: () => `Here's your 4-step recipe. Getting this right will make your writing sound really polished!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Count the syllables in the word", why: "Clap them out: beau-ti-ful = 3, tall = 1 — easy!" },
                  { text: "Step 2: Short (1-2 syllables) → add -er or -est", why: "tall → taller → tallest, happy → happier → happiest" },
                  { text: "Step 3: Long (3+ syllables) → use more or most", why: "beautiful → more beautiful → most beautiful" },
                  { text: "Step 4: NEVER double up!", why: "✗ more taller, most fastest — pick ONE method only. Belt or braces, not both! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot the Mistake ----
      {
        id: "comparative-superlative-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to spot double comparatives (like 'more bigger') — a mistake you'll hear everywhere once you know it!",
          "How to fix irregular comparative errors and sound like a grammar pro"
        ],
        variableSets: [
          {
            name: "Ruby",
            scenario: "wrote a sentence about her dog",
            wrongSentence: "My dog is more bigger than yours.",
            correctSentence: "My dog is bigger than yours.",
            mistake: "used 'more' AND '-er' at the same time — that's a double comparative",
            rule: "'Big' is a short word, so just add -er: 'bigger'. Never say 'more bigger'",
            interactCorrectSentence: "My cat is smaller than your rabbit.",
            interactWrongSentence: "My cat is more smaller than your rabbit.",
            interactRule: "'Small' is a short word, so just add -er: 'smaller'. Never say 'more smaller'"
          },
          {
            name: "Jake",
            scenario: "wrote about his test results",
            wrongSentence: "I got the most best score in the class.",
            correctSentence: "I got the best score in the class.",
            mistake: "used 'most' with 'best' — but 'best' is already the superlative of 'good'",
            rule: "'Good' is irregular: good → better → best. 'Best' already means 'most good' — don't add 'most'!",
            interactCorrectSentence: "That was the worst day of the whole term.",
            interactWrongSentence: "That was the most worst day of the whole term.",
            interactRule: "'Bad' is irregular: bad → worse → worst. 'Worst' already means 'most bad' — don't add 'most'!"
          },
          {
            name: "Maisie",
            scenario: "described a race on sports day",
            wrongSentence: "She ran the most fastest of everyone.",
            correctSentence: "She ran the fastest of everyone.",
            mistake: "used 'most' AND '-est' together — that's a double superlative",
            rule: "'Fast' is a short word, so just add -est: 'fastest'. Never say 'most fastest'",
            interactCorrectSentence: "He jumped the highest of anyone in the class.",
            interactWrongSentence: "He jumped the most highest of anyone in the class.",
            interactRule: "'High' is a short word, so just add -est: 'highest'. Never say 'most highest'"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Did you know? This mistake is in TV adverts all the time!`,
            body: (v) => `${v.name} ${v.scenario}. There's a really common grammar blunder hiding here — once you spot it, you'll notice it everywhere!\n\n"${v.wrongSentence}"`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.wrongSentence,
                highlightWords: [],
                label: "Can you spot the mistake?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "One method only — don't be greedy!",
            body: (v) => `${v.name} ${v.mistake}.\n\n${v.rule}.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `✗ "${v.wrongSentence}"`, why: `${v.mistake}` },
                  { text: `✓ "${v.correctSentence}"`, why: `${v.rule}` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn — spot the correct one!",
            body: (v) => `Which sentence avoids the double-up trap?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.interactWrongSentence,
                highlightWords: [],
                label: "Which version is correct?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which sentence is grammatically correct?`,
              getOptions: (v) => [
                v.interactCorrectSentence,
                v.interactWrongSentence,
                `It was the most easiest question on the test.`,
                `The new painting looked more better than the old one.`,
                `That was the most worst result of the whole year.`
              ],
              correctAnswer: (v) => v.interactCorrectSentence,
              feedback: {
                correct: (v) => `Excellent! You dodged the trap perfectly. ${v.interactRule}. ✓`,
                incorrect: (v) => `Nearly! ${v.interactRule}. The correct sentence is: "${v.interactCorrectSentence}". You'll spot it next time!`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Double-up trap — you'll never fall for it again!",
            body: () => `Here are the three most common comparison mistakes. Knowing these is a superpower for the exam!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "✗ more bigger → ✓ bigger", why: "Short word = just add -er. No 'more' needed!" },
                  { text: "✗ most fastest → ✓ fastest", why: "Short word = just add -est. No 'most' needed!" },
                  { text: "✗ most best → ✓ best", why: "Irregular: good → better → best (it's already the top — you can't make it more top!) ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 5: Pronouns — Who, Whom, I, and Me
  // ==========================================
  {
    id: "pronouns",
    name: "Pronouns — Who, Whom, I, and Me",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "pronouns-steps",
        templateType: "step-by-step",
        learningGoal: [
          "When to use 'I' and when to use 'me' — there's a brilliant trick for this!",
          "The removal trick that works every single time (even grown-ups don't know this one)"
        ],
        variableSets: [
          {
            name: "Sophie",
            scenario: "is writing an invitation for her birthday party",
            correctSubject: "Sophie and I went to the cinema.",
            wrongSubject: "Sophie and me went to the cinema.",
            correctObject: "Mum gave the tickets to Sophie and me.",
            wrongObject: "Mum gave the tickets to Sophie and I.",
            testSubject: "I went to the cinema.",
            testSubjectWrong: "Me went to the cinema.",
            testObject: "Mum gave the tickets to me.",
            testObjectWrong: "Mum gave the tickets to I.",
            friend: "Sophie",
            interactCorrectSubject: "Sophie and I played in the garden.",
            interactWrongSubject: "Sophie and me played in the garden.",
            interactTestSubject: "I played in the garden.",
            interactTestSubjectWrong: "Me played in the garden.",
            interactFriend: "Sophie"
          },
          {
            name: "Leo",
            scenario: "is writing about a school project with his friend",
            correctSubject: "Leo and I built a volcano.",
            wrongSubject: "Leo and me built a volcano.",
            correctObject: "The teacher praised Leo and me.",
            wrongObject: "The teacher praised Leo and I.",
            testSubject: "I built a volcano.",
            testSubjectWrong: "Me built a volcano.",
            testObject: "The teacher praised me.",
            testObjectWrong: "The teacher praised I.",
            friend: "Leo",
            interactCorrectSubject: "Leo and I painted the poster together.",
            interactWrongSubject: "Leo and me painted the poster together.",
            interactTestSubject: "I painted the poster together.",
            interactTestSubjectWrong: "Me painted the poster together.",
            interactFriend: "Leo"
          },
          {
            name: "Isla",
            scenario: "is telling her nan about the school play",
            correctSubject: "Isla and I performed on stage.",
            wrongSubject: "Isla and me performed on stage.",
            correctObject: "The audience clapped for Isla and me.",
            wrongObject: "The audience clapped for Isla and I.",
            testSubject: "I performed on stage.",
            testSubjectWrong: "Me performed on stage.",
            testObject: "The audience clapped for me.",
            testObjectWrong: "The audience clapped for I.",
            friend: "Isla",
            interactCorrectSubject: "Isla and I sang a duet at the concert.",
            interactWrongSubject: "Isla and me sang a duet at the concert.",
            interactTestSubject: "I sang a duet at the concert.",
            interactTestSubjectWrong: "Me sang a duet at the concert.",
            interactFriend: "Isla"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `This one tricks EVERYONE — even teachers!`,
            body: (v) => `${v.name} ${v.scenario}. Quick — which sounds right: "${v.friend} and I" or "${v.friend} and me"? Most people guess... and get it wrong! But there's a foolproof trick.`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `"${v.wrongSubject}" — is this the right pronoun?`,
                highlightWords: [{ word: v.wrongSubject, color: "#e74c3c" }],
                label: "Check the pronoun:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The removal trick — your secret weapon!",
            body: (v) => `Is it **"${v.friend} and I"** or **"${v.friend} and me"**? Here's the magic trick: **cross out the other person's name** and see which sounds right on its own. It works every single time!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Test the subject: remove "${v.friend} and"`, why: `"${v.testSubject}" ✓ sounds right. "${v.testSubjectWrong}" ✗ sounds wrong.` },
                  { text: `So: "${v.correctSubject}" ✓`, why: `"I" is correct when it's the SUBJECT (doing the action)` },
                  { text: `Test the object: remove "${v.friend} and"`, why: `"${v.testObject}" ✓ sounds right. "${v.testObjectWrong}" ✗ sounds wrong.` },
                  { text: `So: "${v.correctObject}" ✓`, why: `"Me" is correct when it's the OBJECT (receiving the action)` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Remove the other person from the sentence`,
                `Try "I" — does it sound right on its own?`,
                `Try "me" — does it sound right on its own?`,
                `Put the other person back in with the correct pronoun`
              ],
              feedback: {
                correct: (v) => `Perfect! Remove, test, put back — that's the trick! You've got this. ✓`,
                incorrect: (v) => `Almost! Start by crossing out the other person's name, then test which pronoun sounds right on its own. Try again!`
              }
            }
          },
          {
            type: "interact",
            title: () => "Time to use your secret weapon!",
            body: (v) => `Use the removal trick to find the correct sentence — cross out the name and listen!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: "Subject pronouns: I, you, he, she, it, we, they",
                highlightWords: [],
                label: "Which pronoun is correct?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which sentence is correct?`,
              getOptions: (v) => [
                v.interactCorrectSubject,
                v.interactWrongSubject,
                `Me and ${v.interactFriend} went to the cinema.`,
                `${v.interactFriend} and me was late.`,
                `Me and ${v.interactFriend} is going now.`
              ],
              correctAnswer: (v) => v.interactCorrectSubject,
              feedback: {
                correct: (v) => `Brilliant — the removal trick wins again! Remove "${v.interactFriend} and" — you'd say "${v.interactTestSubject}", not "${v.interactTestSubjectWrong}". So "I" is correct. ✓`,
                incorrect: (v) => `Nearly! Use the trick: remove "${v.interactFriend} and" — "${v.interactTestSubject}" sounds right, but "${v.interactTestSubjectWrong}" sounds wrong. So use "I": "${v.interactCorrectSubject}".`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "I or me? — never get it wrong again!",
            body: () => `The removal trick is your superpower. Use it every time and you'll always be right:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Remove the other person from the sentence", why: "Cross out 'Sophie and' or 'my friend and'" },
                  { text: "Step 2: Try 'I' — does it sound right?", why: "'I went to the shop' ✓ → use 'I' (subject)" },
                  { text: "Step 3: Try 'me' — does it sound right?", why: "'Give it to me' ✓ → use 'me' (object)" },
                  { text: "Step 4: Put the other person back in", why: "'Sophie and I went' or 'Give it to Sophie and me' ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot the Mistake ----
      {
        id: "pronouns-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to spot 'I' used incorrectly as an object — the poshest mistake in English!",
          "Why people make this mistake (they think 'I' always sounds better) and how to dodge it"
        ],
        variableSets: [
          {
            name: "Alfie",
            scenario: "wrote a thank-you card",
            wrongSentence: "Thank you for inviting Harry and I to your party.",
            correctSentence: "Thank you for inviting Harry and me to your party.",
            mistake: "used 'I' as the object — but 'inviting' is done TO someone, so it needs 'me'",
            rule: "Remove 'Harry and': 'Thank you for inviting me' ✓ not 'Thank you for inviting I' ✗",
            interactCorrectSentence: "The teacher gave a prize to Lucy and me.",
            interactWrongSentence: "The teacher gave a prize to Lucy and I.",
            interactRule: "Remove 'Lucy and': 'The teacher gave a prize to me' ✓ not 'The teacher gave a prize to I' ✗"
          },
          {
            name: "Poppy",
            scenario: "wrote about a trip to the seaside",
            wrongSentence: "Dad drove Millie and I to the beach.",
            correctSentence: "Dad drove Millie and me to the beach.",
            mistake: "used 'I' after 'drove' — but the driving is done TO them, so it needs 'me'",
            rule: "Remove 'Millie and': 'Dad drove me' ✓ not 'Dad drove I' ✗",
            interactCorrectSentence: "Mum took Ellie and me to the swimming pool.",
            interactWrongSentence: "Mum took Ellie and I to the swimming pool.",
            interactRule: "Remove 'Ellie and': 'Mum took me to the swimming pool' ✓ not 'Mum took I to the swimming pool' ✗"
          },
          {
            name: "George",
            scenario: "wrote about lunchtime at school",
            wrongSentence: "The dinner lady served Sam and I our lunch.",
            correctSentence: "The dinner lady served Sam and me our lunch.",
            mistake: "used 'I' after 'served' — but the serving is done TO them, so it needs 'me'",
            rule: "Remove 'Sam and': 'The dinner lady served me' ✓ not 'The dinner lady served I' ✗",
            interactCorrectSentence: "The coach picked Jake and me for the team.",
            interactWrongSentence: "The coach picked Jake and I for the team.",
            interactRule: "Remove 'Jake and': 'The coach picked me' ✓ not 'The coach picked I' ✗"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Did you know? Trying to sound posh can backfire!`,
            body: (v) => `${v.name} ${v.scenario}. This one sounds polite and fancy... but it's actually wrong! Even the Queen's English gets this one muddled.\n\n"${v.wrongSentence}"`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.wrongSentence,
                highlightWords: [],
                label: "Can you spot the mistake?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Fancy doesn't always mean right!",
            body: (v) => `Many people think "and I" always sounds better than "and me". But ${v.name} ${v.mistake}.\n\n${v.rule}.\n\n**4-step check:**\n1. 'And I' is NOT always correct — it just sounds polite\n2. Subject = I (doing the action): 'My friend and I played football'\n3. Object = me (receiving the action): 'The coach picked my friend and me'\n4. Use the removal trick: remove the other person and listen`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `✗ "${v.wrongSentence}"`, why: `${v.mistake}` },
                  { text: `✓ "${v.correctSentence}"`, why: `${v.rule}` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn — don't fall for the posh trap!",
            body: (v) => `Which sentence uses the correct pronoun? Use the removal trick!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.interactWrongSentence,
                highlightWords: [],
                label: "Which version is correct?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which sentence is correct?`,
              getOptions: (v) => [
                v.interactCorrectSentence,
                v.interactWrongSentence,
                `The teacher told my friend and I off for being late.`,
                `Mum took my sister and I to the dentist yesterday.`,
                `Please pass the book to my brother and I.`
              ],
              correctAnswer: (v) => v.interactCorrectSentence,
              feedback: {
                correct: (v) => `Brilliant — you didn't fall for the posh trap! ${v.interactRule}. ✓`,
                incorrect: (v) => `Almost! This one catches out lots of people. ${v.interactRule}. The correct sentence is: "${v.interactCorrectSentence}".`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "'And I' isn't always right — now you know!",
            body: () => `You've learned something most grown-ups don't know. Here's your foolproof method:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Remove the other person from the sentence", why: "Cross out 'Sarah and' or 'My friend and'" },
                  { text: "Step 2: Read it with just 'I' or 'me'", why: "Does it sound right on its own? Your ear knows!" },
                  { text: "Example: 'Sarah and ___ went to the park'", why: "'I went to the park' sounds right. 'Me went to the park' — nope!" },
                  { text: "Example: 'Mum gave it to Sarah and ___'", why: "'Mum gave it to me' sounds right. 'Mum gave it to I' — definitely not!" },
                  { text: "Trust your ear — if it sounds wrong, it IS wrong!", why: "This trick works every single time. That's a superpower for the exam! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 6: Conjunctions and Connectives
  // ==========================================
  {
    id: "conjunctions",
    name: "Conjunctions and Connectives",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "conjunctions-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to use coordinating conjunctions (and, but, or) — the glue that holds sentences together!",
          "How to use subordinating conjunctions (because, although, when) — and why picking the right one changes everything"
        ],
        variableSets: [
          {
            name: "Mia",
            scenario: "is writing about her weekend",
            coordSentence: "I wanted to go to the park, but it was raining.",
            coordConj: "but",
            coordPurpose: "shows a contrast — she wanted to go, but the weather stopped her",
            subordSentence: "Although it was raining, I still played outside.",
            subordConj: "although",
            subordPurpose: "introduces a subordinate clause — the rain didn't stop her",
            corrSentence: "Neither the rain nor the cold could stop me.",
            corrConj: "neither...nor",
            corrPurpose: "links two negatives together",
            interactSentence: "I wanted to stay up late, _____ Mum said it was bedtime.",
            interactCoordConj: "but",
            interactCoordPurpose: "shows a contrast — she wanted to stay up, but Mum said no"
          },
          {
            name: "Harry",
            scenario: "is writing a story about a treasure hunt",
            coordSentence: "We found the map and followed the clues to the treasure.",
            coordConj: "and",
            coordPurpose: "joins two actions that happened one after another",
            subordSentence: "Because the clue was tricky, we asked the teacher for help.",
            subordConj: "because",
            subordPurpose: "explains WHY they asked for help",
            corrSentence: "Either we solve the puzzle or we give up.",
            corrConj: "either...or",
            corrPurpose: "shows two choices",
            interactSentence: "We packed our bags _____ walked to school together.",
            interactCoordConj: "and",
            interactCoordPurpose: "joins two actions that happened one after another"
          },
          {
            name: "Freya",
            scenario: "is describing her school day",
            coordSentence: "I could choose art or music for my afternoon lesson.",
            coordConj: "or",
            coordPurpose: "shows a choice between two options",
            subordSentence: "When the bell rang, everyone rushed to the playground.",
            subordConj: "when",
            subordPurpose: "tells us the TIME the action happened",
            corrSentence: "Neither the boys nor the girls wanted to come inside.",
            corrConj: "neither...nor",
            corrPurpose: "links two negatives — nobody wanted to come in",
            interactSentence: "Would you like cake _____ biscuits for pudding?",
            interactCoordConj: "or",
            interactCoordPurpose: "shows a choice between two options"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Did you know? These little words are the glue of English!`,
            body: (v) => `${v.name} ${v.scenario}. Without **conjunctions** (joining words like 'and', 'but', 'because'), we'd all talk in tiny, choppy sentences. There are three types — and knowing them makes your writing flow beautifully!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.coordSentence,
                highlightWords: [{ word: v.coordConj, color: "#7C3AED" }],
                label: "Spot the joining word:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Three flavours of joining word!",
            body: (v) => `In ${v.name}'s sentence, **"${v.coordConj}"** is a conjunction. Think of conjunctions as bridges between ideas — and there are three types of bridge:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Coordinating: "${v.coordSentence}"`, why: `The big three: and, but, or — join two equal ideas like best mates. "${v.coordConj}" ${v.coordPurpose}` },
                  { text: `Subordinating: "${v.subordSentence}"`, why: `The explainers: because, although, when, if, while — one idea depends on the other. "${v.subordConj}" ${v.subordPurpose}` },
                  { text: `Correlative: "${v.corrSentence}"`, why: `The duo: either...or, neither...nor, both...and — they always work in PAIRS. "${v.corrConj}" ${v.corrPurpose}` }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "and, but, or", right: "coordinating" },
                { left: "because, although, when", right: "subordinating" },
                { left: "either...or, neither...nor", right: "correlative" },
                { left: "but", right: "shows contrast" },
                { left: "because", right: "gives a reason" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn — pick the right bridge!",
            body: (v) => `Which conjunction best completes this sentence? Think about what the sentence means!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: "Think about the MEANING: Contrast = but, Reason = because, Choice = or",
                highlightWords: [],
                label: "Which conjunction fits?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `"${v.interactSentence}" Which conjunction fits?`,
              getOptions: (v) => {
                const allConjs = ["and", "but", "or", "because", "although", "when", "nor"];
                const used = [v.interactCoordConj, v.subordConj];
                const distractors = allConjs.filter(c => !used.includes(c));
                return [v.interactCoordConj, v.subordConj, distractors[0], distractors[1], distractors[2]];
              },
              correctAnswer: (v) => v.interactCoordConj,
              feedback: {
                correct: (v) => `Spot on! "${v.interactCoordConj}" is the perfect fit — it ${v.interactCoordPurpose}. ✓`,
                incorrect: (v) => `Close! Think about what the sentence is trying to say: "${v.interactCoordConj}" ${v.interactCoordPurpose}. "${v.interactSentence.replace("_____", v.interactCoordConj)}".`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Conjunctions — the sentence glue you need!",
            body: () => `Knowing your conjunctions will make your writing flow — and that means better marks!`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Coordinating: and, but, or", why: "The big three — join equal ideas like best mates" },
                  { text: "Subordinating: because, although, when, if, while", why: "One idea depends on the other — the explainers" },
                  { text: "Correlative: either...or, neither...nor, both...and", why: "The dynamic duos — pairs that always work together" },
                  { text: "Match to meaning: contrast → but, reason → because, choice → or", why: "Think about what the sentence means — the meaning picks the conjunction! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot the Mistake ----
      {
        id: "conjunctions-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to spot when someone's used the wrong conjunction — it changes the whole meaning!",
          "Why the right conjunction matters: it's like choosing the right key for a lock"
        ],
        variableSets: [
          {
            name: "Theo",
            scenario: "wrote about his science experiment",
            wrongSentence: "The experiment worked or we followed the instructions carefully.",
            correctSentence: "The experiment worked because we followed the instructions carefully.",
            mistake: "used 'or' (which means a choice) when the sentence needs 'because' (which explains the reason)",
            rule: "When you're explaining WHY something happened, use 'because' — not 'or'",
            interactWrongSentence: "She passed the test or she revised every night.",
            interactCorrectSentence: "She passed the test because she revised every night.",
            interactRule: "When you're explaining WHY something happened, use 'because' — not 'or'"
          },
          {
            name: "Ava",
            scenario: "wrote a book review",
            wrongSentence: "The book was exciting because the ending was disappointing.",
            correctSentence: "The book was exciting but the ending was disappointing.",
            mistake: "used 'because' (which explains a reason) when the sentence needs 'but' (which shows a contrast)",
            rule: "When two ideas contrast (exciting vs. disappointing), use 'but' — not 'because'",
            interactWrongSentence: "The weather was lovely because we had to stay indoors.",
            interactCorrectSentence: "The weather was lovely but we had to stay indoors.",
            interactRule: "When two ideas contrast (lovely weather vs. staying indoors), use 'but' — not 'because'"
          },
          {
            name: "Zain",
            scenario: "wrote about choosing his school clubs",
            wrongSentence: "I couldn't decide because I liked football or I liked cricket.",
            correctSentence: "I couldn't decide because I liked football and I liked cricket.",
            mistake: "used 'or' (which means a choice between them) when he actually liked BOTH sports",
            rule: "When you like both things, use 'and' to join them — 'or' means you're choosing only one",
            interactWrongSentence: "She enjoyed swimming or she enjoyed running at sports day.",
            interactCorrectSentence: "She enjoyed swimming and she enjoyed running at sports day.",
            interactRule: "When someone likes both things, use 'and' — 'or' means choosing only one"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Read this — does the meaning feel right?`,
            body: (v) => `${v.name} ${v.scenario}. But something's off — the joining word changes the meaning completely!\n\n"${v.wrongSentence}"`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.wrongSentence,
                highlightWords: [],
                label: "Can you spot the mistake?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "One tiny word, totally different meaning!",
            body: (v) => `${v.name} ${v.mistake}.\n\n${v.rule}.\n\n**Quick guide to choosing conjunctions:**\n• Giving a REASON? → because, since, as\n• Showing a CONTRAST? → but, although, however\n• Offering a CHOICE? → or, either...or\n\nAlways read the sentence aloud — does the meaning make sense?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `✗ "${v.wrongSentence}"`, why: `${v.mistake}` },
                  { text: `✓ "${v.correctSentence}"`, why: `${v.rule}` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn — pick the right key!",
            body: (v) => `Which sentence uses the conjunction that actually makes sense?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.interactWrongSentence,
                highlightWords: [],
                label: "Which version is correct?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which sentence uses the correct conjunction?`,
              getOptions: (v) => [
                v.interactCorrectSentence,
                v.interactWrongSentence,
                `She was tired or went to bed early.`,
                `He smiled because was upset about the result.`,
                `They ran fast but wanted to win the race.`
              ],
              correctAnswer: (v) => v.interactCorrectSentence,
              feedback: {
                correct: (v) => `Spot on! You matched the meaning perfectly. ${v.interactRule}. ✓`,
                incorrect: (v) => `Close! Think about what the sentence is trying to say. ${v.interactRule}. The correct sentence is: "${v.interactCorrectSentence}".`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Right conjunction, right meaning — sorted!",
            body: () => `Getting this right will make your writing crystal clear. Here's the method:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Work out the relationship", why: "Are you giving a reason, showing contrast, or offering a choice?" },
                  { text: "Step 2: Pick the conjunction", why: "Reason → because. Contrast → but. Choice → or. Easy!" },
                  { text: "Step 3: Read the sentence aloud", why: "Does it make sense? If it sounds odd, you've picked the wrong one" },
                  { text: "Step 4: Check the meaning hasn't changed", why: "The conjunction must match what you actually mean — it's the key to the lock! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 7: Active and Passive Voice
  // ==========================================
  {
    id: "active-passive",
    name: "Active and Passive Voice",
    category: "other",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "active-passive-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to tell the difference between active and passive voice — it's like flipping a sentence inside out!",
          "How to convert between active and passive (a skill that comes up loads in the exam)"
        ],
        variableSets: [
          {
            name: "Ellie",
            scenario: "is writing about what happened during a cooking lesson",
            activeSentence: "The chef baked the cake.",
            passiveSentence: "The cake was baked by the chef.",
            subject: "The chef",
            verb: "baked",
            object: "the cake",
            activeExplanation: "the subject (the chef) does the action",
            passiveExplanation: "the object (the cake) comes first and has the action done TO it",
            interactPassive: "The biscuits were decorated by the pupils.",
            interactActive: "The pupils decorated the biscuits.",
            interactPassiveExplanation: "the object (the biscuits) comes first and has the action done TO it"
          },
          {
            name: "Rory",
            scenario: "is writing a report about a football match",
            activeSentence: "The goalkeeper saved the penalty.",
            passiveSentence: "The penalty was saved by the goalkeeper.",
            subject: "The goalkeeper",
            verb: "saved",
            object: "the penalty",
            activeExplanation: "the subject (the goalkeeper) does the action",
            passiveExplanation: "the object (the penalty) comes first and has the action done TO it",
            interactPassive: "The trophy was lifted by the captain.",
            interactActive: "The captain lifted the trophy.",
            interactPassiveExplanation: "the object (the trophy) comes first and has the action done TO it"
          },
          {
            name: "Nadia",
            scenario: "is writing about her school's art exhibition",
            activeSentence: "The children painted the mural.",
            passiveSentence: "The mural was painted by the children.",
            subject: "The children",
            verb: "painted",
            object: "the mural",
            activeExplanation: "the subject (the children) does the action",
            passiveExplanation: "the object (the mural) comes first and has the action done TO it",
            interactPassive: "The sculptures were displayed by the art teacher.",
            interactActive: "The art teacher displayed the sculptures.",
            interactPassiveExplanation: "the object (the sculptures) comes first and has the action done TO it"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Same story, two ways to tell it!`,
            body: (v) => `${v.name} ${v.scenario}. Here's something brilliant — these two sentences mean the exact same thing, but they put the spotlight on different characters!\n\n**"${v.activeSentence}"** vs **"${v.passiveSentence}"**`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `Active: ${v.activeSentence}`,
                highlightWords: [{ word: v.subject, color: "#7C3AED" }],
                label: "Who is doing the action?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Active vs passive — flip the spotlight!",
            body: (v) => `Look at ${v.name}'s sentences: **"${v.activeSentence}"** and **"${v.passiveSentence}"**. In **active voice**, the doer is the star. In **passive voice**, the thing being done to gets the spotlight. Same story, different camera angle!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Active: "${v.activeSentence}"`, why: `${v.activeExplanation}` },
                  { text: `Passive: "${v.passiveSentence}"`, why: `${v.passiveExplanation}` },
                  { text: `To make it passive: move the object to the front`, why: `"${v.object}" becomes the new subject` },
                  { text: `Add "was/were" + "by"`, why: `"was ${v.verb} by ${v.subject.toLowerCase()}"` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `In passive voice, the ____ receives the action instead of doing it`,
              options: (v) => ["subject", "verb", "conjunction", "adjective"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! In passive voice, the subject receives the action — it's in the spotlight instead of the doer: "${v.passiveSentence}". ✓`,
                incorrect: (v) => `Nearly! In passive voice, the SUBJECT receives the action instead of doing it. Think of it as flipping who gets the spotlight.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn — spot the passive!",
            body: (v) => `Which sentence flips the spotlight onto the thing being done to?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: "Look for 'was/were ... by' to spot the passive voice",
                highlightWords: [],
                label: "Active or passive?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which sentence is in the passive voice?`,
              getOptions: (v) => [
                v.interactPassive,
                v.interactActive,
                `${v.subject} quickly ${v.verb} ${v.object}.`,
                `${v.subject} always ${v.verb} ${v.object}.`,
                `${v.subject} ${v.verb} ${v.object} yesterday.`
              ],
              correctAnswer: (v) => v.interactPassive,
              feedback: {
                correct: (v) => `Brilliant! You spotted it. "${v.interactPassive}" is passive because ${v.interactPassiveExplanation}. ✓`,
                incorrect: (v) => `Close! Look for the magic words "was/were ... by" — they're the giveaway for passive voice. The passive version is "${v.interactPassive}".`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Active and passive — you can flip any sentence!",
            body: () => `This skill comes up all the time in 11+ papers. Here's how to nail it:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Active: Subject → Verb → Object", why: "'The dog chased the cat' — the dog is the star, doing the chasing" },
                  { text: "Passive: Object → was/were + verb → by Subject", why: "'The cat was chased by the dog' — the cat gets the spotlight instead" },
                  { text: "Spot passive by looking for 'was/were...by'", why: "These magic words are the giveaway: 'was painted by', 'were eaten by' = passive" },
                  { text: "To convert: swap subject and object, add 'was/were...by'", why: "It's like flipping a pancake — same ingredients, different side up! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot the Mistake ----
      {
        id: "active-passive-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to spot when someone's muddled up active and passive — a common exam question!",
          "Why getting this right gives you easy marks in comprehension"
        ],
        variableSets: [
          {
            name: "Will",
            scenario: "was asked to rewrite a sentence in the passive voice",
            original: "The dog chased the cat.",
            wrongAnswer: "The dog was chased the cat.",
            correctAnswer: "The cat was chased by the dog.",
            mistake: "kept 'the dog' at the start and just added 'was' — but in passive voice, the OBJECT must come first",
            rule: "In passive voice, the thing receiving the action goes first: 'The cat was chased by the dog'",
            interactOriginal: "The teacher read the story.",
            interactCorrectAnswer: "The story was read by the teacher.",
            interactWrongAnswer: "The teacher was read the story.",
            interactRule: "In passive voice, the thing receiving the action goes first: 'The story was read by the teacher'"
          },
          {
            name: "Lottie",
            scenario: "was asked to identify the passive sentence",
            original: "The window was broken by the ball.",
            wrongAnswer: "The ball broke the window.",
            correctAnswer: "The window was broken by the ball.",
            mistake: "picked the active sentence instead of the passive one",
            rule: "Passive voice has 'was/were + past participle + by': 'was broken by the ball'",
            interactOriginal: "The cake was baked by Grandma.",
            interactCorrectAnswer: "Grandma baked the cake.",
            interactWrongAnswer: "The cake baked Grandma.",
            interactRule: "To convert passive to active: the doer (Grandma) goes first, then the verb (baked), then the object (the cake)"
          },
          {
            name: "Sam",
            scenario: "was asked to change a sentence to active voice",
            original: "The song was sung by the choir.",
            wrongAnswer: "The song sang the choir.",
            correctAnswer: "The choir sang the song.",
            mistake: "swapped the words but forgot to remove 'was' and 'by', creating nonsense",
            rule: "Active voice: the doer (choir) goes first, then the verb (sang), then the object (the song)",
            interactOriginal: "The cake was eaten by the children.",
            interactCorrectAnswer: "The children ate the cake.",
            interactWrongAnswer: "The cake ate the children.",
            interactRule: "Active voice: the doer (children) goes first, then the verb (ate), then the object (the cake)"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `${v.name} got in a muddle — can you help?`,
            body: (v) => `${v.name} ${v.scenario}. But the answer's gone a bit wonky! Can you see why?\n\n"${v.wrongAnswer}"`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.original,
                highlightWords: [],
                label: "Can you spot the mistake?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Here's the flip gone wrong — and how to fix it!",
            body: (v) => `**How to convert:** Active → Passive: move the object to the front, add 'was/were + past participle (the -ed or irregular form, like "broken" or "eaten") + by'. Passive → Active: find the doer (after 'by'), put them first, then verb, then object.\n\n${v.name} ${v.mistake}.\n\n${v.rule}. Once you get the hang of this, it's actually quite satisfying!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `✗ "${v.wrongAnswer}"`, why: `${v.mistake}` },
                  { text: `✓ "${v.correctAnswer}"`, why: `${v.rule}` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn — flip the sentence!",
            body: (v) => `Can you convert this sentence? If it's active, make it passive — if it's passive, make it active. You've got this!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.interactOriginal,
                highlightWords: [],
                label: "Convert this sentence:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which is the correct conversion?`,
              getOptions: (v) => [
                v.interactCorrectAnswer,
                v.interactWrongAnswer,
                v.interactOriginal.replace(/\.$/, '') + ' was done.',
                'The ' + v.interactOriginal.split(' ').slice(-1)[0].replace(/\.$/, '') + ' was being done.',
                v.interactOriginal.split(' ').reverse().join(' ').replace(/\.$/, '') + '.'
              ],
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Nailed it! You flipped it perfectly. ${v.interactRule}. ✓`,
                incorrect: (v) => `Nearly! ${v.interactRule}. The correct answer is: "${v.interactCorrectAnswer}". Keep practising — it gets easier every time!`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Voice flipping — you're a pro now!",
            body: () => `Here's your step-by-step guide for switching between active and passive voice:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Active → Passive: Step 1", why: "Move the object to the front of the sentence" },
                  { text: "Active → Passive: Step 2", why: "Add was/were + past participle (the -ed or irregular form) + by" },
                  { text: "Passive → Active: Step 1", why: "Find the doer — they come after 'by'" },
                  { text: "Passive → Active: Step 2", why: "Put the doer first, then the verb, then the object ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 8: Common Grammar Traps
  // ==========================================
  {
    id: "should-have",
    name: "Common Grammar Traps",
    category: "other",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "should-have-steps",
        templateType: "step-by-step",
        learningGoal: [
          "Why 'should of' is wrong — and why your ears have been lying to you!",
          "The 'fewer vs less' trick that even supermarkets get wrong (seriously!)"
        ],
        variableSets: [
          {
            name: "Lauren",
            scenario: "is checking her English homework for common mistakes",
            wrongShould: "I should of revised more for the test.",
            correctShould: "I should have revised more for the test.",
            shouldContraction: "I should've revised more for the test.",
            fewerItem: "sweets",
            lessItem: "sugar",
            wrongFewer: "There are less sweets in the bag.",
            correctFewer: "There are fewer sweets in the bag.",
            wrongLess: "We need fewer sugar in the recipe.",
            correctLess: "We need less sugar in the recipe.",
            fewerRule: "'Sweets' are countable (you can count individual sweets), so use 'fewer'",
            lessRule: "'Sugar' is uncountable (you can't count individual sugars), so use 'less'",
            interactWrongShould: "We could of left earlier to catch the bus.",
            interactCorrectShould: "We could have left earlier to catch the bus."
          },
          {
            name: "Dylan",
            scenario: "is proofreading his story before handing it in",
            wrongShould: "We could of won the match if we'd tried harder.",
            correctShould: "We could have won the match if we'd tried harder.",
            shouldContraction: "We could've won the match if we'd tried harder.",
            fewerItem: "goals",
            lessItem: "time",
            wrongFewer: "We scored less goals than the other team.",
            correctFewer: "We scored fewer goals than the other team.",
            wrongLess: "We had fewer time to practise.",
            correctLess: "We had less time to practise.",
            fewerRule: "'Goals' are countable (you can count 1 goal, 2 goals), so use 'fewer'",
            lessRule: "'Time' is uncountable (you can't count individual times), so use 'less'",
            interactWrongShould: "They might of scored if the whistle hadn't blown.",
            interactCorrectShould: "They might have scored if the whistle hadn't blown."
          },
          {
            name: "Rosie",
            scenario: "is editing her book report",
            wrongShould: "The character would of been happier in the countryside.",
            correctShould: "The character would have been happier in the countryside.",
            shouldContraction: "The character would've been happier in the countryside.",
            fewerItem: "mistakes",
            lessItem: "noise",
            wrongFewer: "I made less mistakes in this test.",
            correctFewer: "I made fewer mistakes in this test.",
            wrongLess: "There was fewer noise in the library.",
            correctLess: "There was less noise in the library.",
            fewerRule: "'Mistakes' are countable (1 mistake, 2 mistakes), so use 'fewer'",
            lessRule: "'Noise' is uncountable (you can't count individual noises like that), so use 'less'",
            interactWrongShould: "She would of enjoyed the film if she'd gone.",
            interactCorrectShould: "She would have enjoyed the film if she'd gone."
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Did you know? Even supermarkets get this wrong!`,
            body: (v) => `${v.name} ${v.scenario}. You know those signs in shops that say "10 items or less"? That's actually WRONG! We're about to learn two grammar traps that catch out almost everyone — and once you know them, you'll spot them everywhere!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `"${v.wrongShould}" — is this correct?`,
                highlightWords: [{ word: v.wrongShould, color: "#e74c3c" }],
                label: "Common mistake:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Two traps — and you're about to outsmart them both!",
            body: (v) => `${v.name} wrote **"${v.wrongShould}"** — but that's wrong! The good news? Once you know these two rules, you'll be smarter than most grown-ups:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Trap 1: "should of" sounds like "should've"`, why: `Your ears are tricking you! People write "of" because it SOUNDS like "have" when spoken quickly` },
                  { text: `✗ "${v.wrongShould}"`, why: `✓ "${v.correctShould}" — it's always HAVE, never OF` },
                  { text: `Trap 2: fewer vs less`, why: `Fewer = countable things. Less = uncountable things.` },
                  { text: `✗ "${v.wrongFewer}" → ✓ "${v.correctFewer}"`, why: `${v.fewerRule}` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `"I should of done my homework" is correct because "of" sounds right`, answer: false, explanation: `No! "Should of" is always wrong — it should be "should HAVE" (or "should've"). It only sounds like "of" when spoken quickly. ✓` },
                { text: `You use "fewer" for things you can count and "less" for things you can't`, answer: true, explanation: `Correct! Fewer mistakes (countable), less noise (uncountable). ✓` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Can you dodge the trap?",
            body: (v) => `Don't let your ears fool you — which sentence is actually correct?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `Is it "${v.interactWrongShould}" or "${v.interactCorrectShould}"?`,
                highlightWords: [],
                label: "Which is correct?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which sentence is grammatically correct?`,
              getOptions: (v) => [
                v.interactCorrectShould,
                v.interactWrongShould,
                v.interactCorrectShould.replace(' have ', " has "),
                v.interactCorrectShould.replace(' have ', " had "),
                v.interactCorrectShould.replace(' have ', " of had ")
              ],
              correctAnswer: (v) => v.interactCorrectShould,
              feedback: {
                correct: (v) => `Brilliant — you didn't fall for it! It's always "HAVE" (or "'ve"), never "of". The word "of" is not a verb! ✓`,
                incorrect: (v) => `Tricky, right? "Of" is NEVER correct after should/could/would/might. It's always HAVE: "${v.interactCorrectShould}". Now you know!`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Two traps — and now you can dodge them both!",
            body: () => `You now know more about these two traps than most adults. Here's your cheat sheet:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Trap 1: should/could/would + HAVE", why: "Never 'of'! Your ears lie — 'should've' sounds like 'should of', but it's 'should HAVE'" },
                  { text: "Trap 2: FEWER for countable things", why: "Fewer goals, fewer people, fewer biscuits — you can COUNT them" },
                  { text: "Trap 2: LESS for uncountable things", why: "Less water, less time, less noise — you can't COUNT them" },
                  { text: "Quick test: can you put a number in front?", why: "'5 goals' ✓ = fewer. '5 waters' ✗ = less. Easy once you know! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot the Mistake ----
      {
        id: "should-have-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to spot 'should of' and 'less/fewer' errors hiding in writing — like a grammar detective!",
          "Why these mistakes are everywhere (and why knowing them gives you an edge)"
        ],
        variableSets: [
          {
            name: "Chloe",
            scenario: "wrote about a baking competition",
            wrongSentence: "I should of added less eggs to the mixture.",
            correctSentence: "I should have added fewer eggs to the mixture.",
            mistake: "made TWO errors: 'should of' (should be 'should have') AND 'less eggs' (should be 'fewer eggs' because eggs are countable)",
            rule: "Always 'should have' (not 'of') and 'fewer' for countable things (you can count eggs: 1 egg, 2 eggs)",
            interactWrongSentence: "We could of used less ingredients in the recipe.",
            interactCorrectSentence: "We could have used fewer ingredients in the recipe.",
            interactRule: "Always 'could have' (not 'of') and 'fewer' for countable things (you can count ingredients: 1 ingredient, 2 ingredients)"
          },
          {
            name: "Josh",
            scenario: "wrote about a spelling test",
            wrongSentence: "He could of got less answers wrong if he'd practised.",
            correctSentence: "He could have got fewer answers wrong if he'd practised.",
            mistake: "made TWO errors: 'could of' (should be 'could have') AND 'less answers' (should be 'fewer answers' because answers are countable)",
            rule: "Always 'could have' (not 'of') and 'fewer' for countable things (you can count answers: 1 answer, 2 answers)",
            interactWrongSentence: "She should of made less errors in her writing.",
            interactCorrectSentence: "She should have made fewer errors in her writing.",
            interactRule: "Always 'should have' (not 'of') and 'fewer' for countable things (you can count errors: 1 error, 2 errors)"
          },
          {
            name: "Imogen",
            scenario: "wrote about choosing a library book",
            wrongSentence: "I would of chosen a book with less pages.",
            correctSentence: "I would have chosen a book with fewer pages.",
            mistake: "made TWO errors: 'would of' (should be 'would have') AND 'less pages' (should be 'fewer pages' because pages are countable)",
            rule: "Always 'would have' (not 'of') and 'fewer' for countable things (you can count pages: 1 page, 2 pages)",
            interactWrongSentence: "They might of eaten less biscuits at the party.",
            interactCorrectSentence: "They might have eaten fewer biscuits at the party.",
            interactRule: "Always 'might have' (not 'of') and 'fewer' for countable things (you can count biscuits: 1 biscuit, 2 biscuits)"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Double trouble — can you find BOTH mistakes?`,
            body: (v) => `${v.name} ${v.scenario}. There are TWO grammar traps hiding in one sentence. This is like being a detective — can you find them both?\n\n"${v.wrongSentence}"`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.wrongSentence,
                highlightWords: [],
                label: "Can you spot the mistake?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Both traps in one go — here's how to fix them!",
            body: (v) => `${v.name} ${v.mistake}.\n\n${v.rule}.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `✗ "${v.wrongSentence}"`, why: `${v.mistake}` },
                  { text: `✓ "${v.correctSentence}"`, why: `${v.rule}` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn — fix the double trouble!",
            body: (v) => `Can you find the sentence that fixes BOTH errors? Look carefully!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.interactWrongSentence,
                highlightWords: [],
                label: "Which version is correct?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which sentence is fully correct?`,
              getOptions: (v) => [
                v.interactCorrectSentence,
                v.interactWrongSentence,
                v.interactWrongSentence.replace(" of ", " have "),
                v.interactWrongSentence.replace("less ", "fewer "),
                v.interactCorrectSentence.replace("have ", "of ")
              ],
              correctAnswer: (v) => v.interactCorrectSentence,
              feedback: {
                correct: (v) => `Amazing — you caught both traps! "Have" instead of "of", and "fewer" instead of "less". You're officially smarter than most grown-ups at this! ✓`,
                incorrect: (v) => `Close, but both traps need fixing! ${v.interactRule}. The fully correct sentence is: "${v.interactCorrectSentence}". You'll get it next time!`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Grammar detective mode — activated!",
            body: () => `Now you know these traps, use them like a proofreading superpower:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Search for 'of' after should/could/would/might", why: "Change every 'of' to 'have' — it's ALWAYS wrong. Always!" },
                  { text: "Search for 'less' — can you count the thing?", why: "Less water ✓ but fewer biscuits ✓ — try putting a number in front" },
                  { text: "Say it aloud: 'should HAVE' not 'should OF'", why: "Your ear might trick you, but your brain won't — trust it! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 9: Clauses and Sentence Types
  // ==========================================
  {
    id: "clauses-sentence-structure",
    name: "Clauses and Sentence Types",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "clauses-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to spot main clauses and subordinate clauses — think of them as the captain and the sidekick!",
          "How to tell simple, compound, and complex sentences apart (this comes up loads in the exam!)"
        ],
        variableSets: [
          {
            name: "Aisha",
            scenario: "is writing a story about a school trip to the seaside",
            mainClause: "The children built a sandcastle",
            subordinateClause: "because the tide was out",
            fullComplex: "The children built a sandcastle because the tide was out.",
            simpleSentence: "The children built a sandcastle.",
            compoundSentence: "The children built a sandcastle and the teacher took a photograph.",
            compoundJoiner: "and",
            relativeClause: "who was wearing a red coat",
            relativeExample: "The girl who was wearing a red coat found a starfish.",
            relativeNoun: "The girl",
            interactFullComplex: "The seagull swooped down because it spotted some chips.",
            interactMainClause: "The seagull swooped down",
            interactSubordinateClause: "because it spotted some chips"
          },
          {
            name: "Charlie",
            scenario: "is writing about his weekend football match",
            mainClause: "The striker scored a goal",
            subordinateClause: "although the goalkeeper dived to save it",
            fullComplex: "The striker scored a goal although the goalkeeper dived to save it.",
            simpleSentence: "The striker scored a goal.",
            compoundSentence: "The striker scored a goal but the referee blew the whistle.",
            compoundJoiner: "but",
            relativeClause: "who had practised every day",
            relativeExample: "The striker who had practised every day scored the winning goal.",
            relativeNoun: "The striker",
            interactFullComplex: "The crowd cheered loudly when the final whistle blew.",
            interactMainClause: "The crowd cheered loudly",
            interactSubordinateClause: "when the final whistle blew"
          },
          {
            name: "Ella",
            scenario: "is writing a book review for her English class",
            mainClause: "The hero escaped from the tower",
            subordinateClause: "when the guard fell asleep",
            fullComplex: "The hero escaped from the tower when the guard fell asleep.",
            simpleSentence: "The hero escaped from the tower.",
            compoundSentence: "The hero escaped from the tower and the princess followed close behind.",
            compoundJoiner: "and",
            relativeClause: "which had stood for a hundred years",
            relativeExample: "The tower which had stood for a hundred years finally crumbled.",
            relativeNoun: "The tower",
            interactFullComplex: "The dragon roared fiercely although the knight stood his ground.",
            interactMainClause: "The dragon roared fiercely",
            interactSubordinateClause: "although the knight stood his ground"
          },
          {
            name: "Finn",
            scenario: "is describing his pet hamster in a class project",
            mainClause: "The hamster ran on its wheel",
            subordinateClause: "while everyone was asleep",
            fullComplex: "The hamster ran on its wheel while everyone was asleep.",
            simpleSentence: "The hamster ran on its wheel.",
            compoundSentence: "The hamster ran on its wheel and it nibbled some seeds.",
            compoundJoiner: "and",
            relativeClause: "that Finn had named Biscuit",
            relativeExample: "The hamster that Finn had named Biscuit escaped from its cage.",
            relativeNoun: "The hamster",
            interactFullComplex: "The rabbit hid in the corner because the cat was prowling nearby.",
            interactMainClause: "The rabbit hid in the corner",
            interactSubordinateClause: "because the cat was prowling nearby"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Did you know? Every sentence has a secret structure!`,
            body: (v) => `${v.name} ${v.scenario}. Some sentences are short and punchy. Others are longer and layered. The difference? It's all about **clauses** — and once you can spot them, you'll see them everywhere!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.fullComplex,
                highlightWords: [{ word: v.subordinateClause, color: "#7C3AED" }],
                label: "Spot the clauses:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The captain and the sidekick!",
            body: (v) => `Let's look at ${v.name}'s sentence: **"${v.fullComplex}"**. Think of clauses like characters in a story. The **main clause** is the captain — it can stand on its own. The **subordinate clause** is the sidekick — it adds extra detail but can't survive without the captain!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Main clause: "${v.mainClause}"`, why: "The captain — makes complete sense on its own!" },
                  { text: `Subordinate clause: "${v.subordinateClause}"`, why: "The sidekick — can't stand alone, needs the captain" },
                  { text: `Together: "${v.fullComplex}"`, why: "Captain + sidekick = a COMPLEX sentence" },
                  { text: `Relative clause: "${v.relativeClause}"`, why: `A special sidekick that adds detail about "${v.relativeNoun}" — starts with who, which, that, where, or when` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Find the main clause — the part that makes sense on its own`,
                `Find the subordinate clause — the part that can't stand alone`,
                `Check: does the subordinate clause add time, reason, or extra detail?`,
                `Name the sentence type: simple, compound, or complex`
              ],
              feedback: {
                correct: (v) => `Perfect order! Find the captain, spot the sidekick, check what it adds, and name the type. You've got it! ✓`,
                incorrect: (v) => `Almost! Start by finding the main clause (the captain — the part that makes sense alone), then look for the subordinate clause (the sidekick).`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn — what type of sentence is this?",
            body: (v) => `Use what you've learnt to crack this one!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.interactFullComplex || "",
                highlightWords: [],
                label: "Main or subordinate clause?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `"${v.interactFullComplex}" — what type of sentence is this?`,
              getOptions: (v) => [
                "Complex sentence",
                "Simple sentence",
                "Compound sentence",
                `It has no main clause — "${v.interactSubordinateClause}" is the only part`,
                `It has two main clauses joined by "${v.compoundJoiner}"`
              ],
              correctAnswer: (v) => "Complex sentence",
              feedback: {
                correct: (v) => `Brilliant! "${v.interactMainClause}" is the captain and "${v.interactSubordinateClause}" is the sidekick — captain + sidekick = complex! ✓`,
                incorrect: (v) => `Nearly! "${v.interactMainClause}" is the captain (makes sense alone) and "${v.interactSubordinateClause}" is the sidekick (can't stand alone). Captain + sidekick = complex sentence.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Sentence types — sorted!",
            body: () => `This comes up loads in 11+ papers. Here's your foolproof method:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Find the clauses", why: "Each clause has a subject and a verb — look for the action!" },
                  { text: "Step 2: Can each clause stand alone?", why: "If yes = captain (main clause). If no = sidekick (subordinate)." },
                  { text: "Step 3: Count the clauses", why: "1 captain = simple. 2 captains (and/but/or) = compound. Captain + sidekick = complex." },
                  { text: "Bonus: Relative clauses use who, which, that, where, when", why: "Special sidekicks that add detail about a noun — easy marks! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot the Mistake ----
      {
        id: "clauses-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to identify sentence types in context — a favourite 11+ question!",
          "How to spot when a sidekick clause is pretending to be a full sentence (cheeky!)"
        ],
        variableSets: [
          {
            name: "Grace",
            scenario: "wrote a paragraph about her holiday in Wales",
            wrongSentence: "Because it rained all morning.",
            correctSentence: "We stayed indoors because it rained all morning.",
            mistake: "wrote a subordinate clause as if it were a complete sentence — 'because it rained all morning' can't stand alone",
            rule: "A subordinate clause needs a main clause to make a complete sentence",
            interactWrongSentence: "Although the sun was shining brightly.",
            interactCorrectSentence: "We went to the beach although the sun was shining brightly.",
            interactRule: "A subordinate clause starting with 'although' needs a main clause to make a complete sentence"
          },
          {
            name: "Ben",
            scenario: "wrote about his science experiment",
            wrongSentence: "Although the mixture changed colour.",
            correctSentence: "The experiment worked although the mixture changed colour.",
            mistake: "wrote a subordinate clause ('although the mixture changed colour') as a full sentence — it needs a main clause",
            rule: "Words like 'although', 'because', 'when', and 'while' start subordinate clauses — they can't be sentences on their own",
            interactWrongSentence: "Because the chemicals reacted quickly.",
            interactCorrectSentence: "We wrote down the results because the chemicals reacted quickly.",
            interactRule: "A subordinate clause starting with 'because' needs a main clause to make a complete sentence"
          },
          {
            name: "Daisy",
            scenario: "wrote a letter to her pen pal",
            wrongSentence: "When we arrived at the park.",
            correctSentence: "We played on the swings when we arrived at the park.",
            mistake: "wrote a subordinate clause ('when we arrived at the park') as a complete sentence — it leaves the reader asking 'what happened?'",
            rule: "A subordinate clause starting with 'when' needs a main clause to tell us what actually happened",
            interactWrongSentence: "While everyone was eating lunch.",
            interactCorrectSentence: "The bell rang while everyone was eating lunch.",
            interactRule: "A subordinate clause starting with 'while' needs a main clause to tell us what actually happened"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Hmm... does this sentence feel complete to you?`,
            body: (v) => `${v.name} ${v.scenario}. Read this out loud — something feels like it's missing:\n\n"${v.wrongSentence}"`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.wrongSentence,
                highlightWords: [],
                label: "Can you spot the mistake?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The sidekick can't go it alone!",
            body: (v) => `${v.name} ${v.mistake}.\n\n${v.rule}. Think of it this way: a sidekick without a captain is just someone standing around looking lost!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `✗ "${v.wrongSentence}"`, why: `${v.mistake}` },
                  { text: `✓ "${v.correctSentence}"`, why: `${v.rule}` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn — rescue the fragment!",
            body: (v) => `Which one is a proper, complete sentence with a captain AND a sidekick?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.interactWrongSentence,
                highlightWords: [],
                label: "Which version is correct?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `"${v.interactWrongSentence}" is a fragment. Which is a complete, correct sentence?`,
              getOptions: (v) => [
                v.interactCorrectSentence,
                v.interactWrongSentence,
                `While the teacher was writing on the board.`,
                `Because the class forgot to check their answers.`,
                `Although everyone tried really hard on the test.`
              ],
              correctAnswer: (v) => v.interactCorrectSentence,
              feedback: {
                correct: (v) => `Spot on! "${v.interactCorrectSentence}" has a captain AND a sidekick — that's a proper complex sentence. ✓`,
                incorrect: (v) => `Nearly! The other options are all sidekicks pretending to be complete sentences — they need a captain! "${v.interactCorrectSentence}" is correct because it has a main clause.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "No more sentence fragments — you've got this!",
            body: () => `Here's how to make sure every sentence is complete and ready for the exam:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Read the sentence aloud", why: "Does it feel complete? Does it answer 'what happened?' If not, something's missing!" },
                  { text: "Watch for danger words at the start", why: "because, although, when, while, if, unless — these are sidekick starters!" },
                  { text: "Add a main clause if needed", why: "Every sidekick needs a captain. Tell the reader WHAT happened, not just WHY or WHEN ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 10: Modal Verbs — Possibility and Certainty
  // ==========================================
  {
    id: "modal-verbs",
    name: "Modal Verbs — Possibility and Certainty",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "modal-verbs-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to recognise modal verbs — the words that tell you how sure someone is!",
          "How modal verbs create a scale from 'maybe' all the way to 'definitely' (this is really handy for comprehension)"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "is planning what to do at the weekend",
            mightSentence: "It might rain on Saturday.",
            maySentence: "We may go to the cinema instead.",
            shouldSentence: "We should bring an umbrella just in case.",
            willSentence: "The film will start at three o'clock.",
            mustSentence: "We must leave by two o'clock to get there on time.",
            certaintyScale: "might → may → should → will → must",
            modalVerb: "might",
            modalMeaning: "possible but not very likely",
            wrongForm: "She mights go swimming.",
            correctForm: "She might go swimming.",
            formRule: "Modal verbs never change form — no 's', no 'ed', no 'ing'"
          },
          {
            name: "Ben",
            scenario: "is talking about what might happen at sports day",
            mightSentence: "I might win the egg-and-spoon race.",
            maySentence: "The teachers may cancel it if it rains.",
            shouldSentence: "We should practise our relay handovers.",
            willSentence: "Sports day will be on Friday.",
            mustSentence: "Everyone must wear their PE kit.",
            certaintyScale: "might → may → should → will → must",
            modalVerb: "should",
            modalMeaning: "likely or a good idea",
            wrongForm: "He shoulds try harder.",
            correctForm: "He should try harder.",
            formRule: "Modal verbs never change form — no 's', no 'ed', no 'ing'"
          },
          {
            name: "Grace",
            scenario: "is writing about a school science experiment",
            mightSentence: "The mixture might change colour.",
            maySentence: "It may take a few minutes to react.",
            shouldSentence: "You should wear safety goggles.",
            willSentence: "The teacher will explain the results.",
            mustSentence: "You must not touch the chemicals.",
            certaintyScale: "might → may → should → will → must",
            modalVerb: "must",
            modalMeaning: "definite or necessary",
            wrongForm: "She musts wear her goggles.",
            correctForm: "She must wear her goggles.",
            formRule: "Modal verbs never change form — no 's', no 'ed', no 'ing'"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `"Might", "should", "must" — spot the difference!`,
            body: (v) => `${v.name} ${v.scenario}. Did you know that tiny words like "might", "should", and "must" completely change how sure you sound? These special words are called **modal verbs** — and they're like a volume dial for certainty!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.modalVerb === 'might' ? v.mightSentence : v.modalVerb === 'should' ? v.shouldSentence : v.mustSentence,
                highlightWords: [{ word: v.modalVerb, color: "#7C3AED" }],
                label: "Spot the modal verb:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The certainty dial — from 'maybe' to 'definitely'!",
            body: (v) => `${v.name} used **"${v.modalVerb}"** which means ${v.modalMeaning}. **Modal verbs** are like a volume dial — turn it up for more certainty, turn it down for less. Here's the scale:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `might — "${v.mightSentence}"`, why: "Dial at 1 — just a possibility, who knows?" },
                  { text: `may — "${v.maySentence}"`, why: "Dial at 3 — possible, it could go either way" },
                  { text: `should — "${v.shouldSentence}"`, why: "Dial at 5 — likely or recommended, a good idea" },
                  { text: `will — "${v.willSentence}"`, why: "Dial at 8 — we're pretty confident this is happening" },
                  { text: `must — "${v.mustSentence}"`, why: "Dial at 10 — definite, no choice, it's happening!" }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `On the certainty scale, "might" means ____ and "must" means definite`,
              options: (v) => ["unlikely", "certain", "recommended", "impossible"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! "Might" is the dial at 1 — just a possibility. "Must" cranks it up to 10! ✓`,
                incorrect: (v) => `Nearly! "Might" means something is just possible — the dial is turned way down. The scale goes: might → may → should → will → must.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Crank the dial — which modal fits?",
            body: (v) => `Which modal verb turns the certainty dial all the way up?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: "Modal verbs show how likely something is",
                highlightWords: [],
                label: "Which modal fits?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `"${v.mustSentence.replace("must", "_____").replace("Must", "_____")}" Which modal verb fits best?`,
              getOptions: (v) => [
                "must",
                "might",
                "may",
                v.modalVerb === "should" ? "could" : "should",
                "can"
              ],
              correctAnswer: (v) => "must",
              feedback: {
                correct: (v) => `Brilliant! "Must" cranks the certainty dial to 10 — it's definite and there's no choice! "${v.mustSentence}" ✓`,
                incorrect: (v) => `Close! This sentence needs the dial at maximum — "must" means it's definite and required: "${v.mustSentence}".`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Modal verbs — you've mastered the dial!",
            body: () => `Knowing this will help you in comprehension AND in your own writing. Here's the summary:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Modal verbs are the certainty dial", why: "might, may, could, should, would, will, shall, can, must — from 'maybe' to 'definitely'" },
                  { text: "The certainty scale: might → may → should → will → must", why: "Turn the dial up or down depending on how sure you are" },
                  { text: "Modal verbs NEVER change form", why: "No 's' (not 'musts'), no 'ed' (not 'shoulded'), no 'ing' (not 'mighting') — they stay the same!" },
                  { text: "Choose the right modal for your meaning", why: "Giving advice? Use 'should'. Giving an order? Use 'must'. Not sure? Use 'might'. ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot the Mistake ----
      {
        id: "modal-verbs-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to choose the right modal verb for the context — getting the certainty level spot on!",
          "Why modal verbs are stubborn and never change form (no 'musts' or 'shoulded'!)"
        ],
        variableSets: [
          {
            name: "Oliver",
            scenario: "wrote a set of class rules",
            wrongSentence: "You might hand in your homework on time.",
            correctSentence: "You must hand in your homework on time.",
            mistake: "used 'might' (which means 'perhaps') when the sentence needs 'must' (which means 'you have to')",
            rule: "Class rules are definite instructions — use 'must' for things that are required, not 'might' which means it's only a possibility",
            interactWrongSentence: "You might listen to the teacher during lessons.",
            interactCorrectSentence: "You must listen to the teacher during lessons.",
            interactRule: "School rules are definite instructions — use 'must' for things that are required"
          },
          {
            name: "Priya",
            scenario: "wrote about the weather forecast",
            wrongSentence: "It must snow tomorrow, but the forecasters are not sure.",
            correctSentence: "It might snow tomorrow, but the forecasters are not sure.",
            mistake: "used 'must' (definite) when the sentence says 'not sure' — that means it's only a possibility",
            rule: "If you're not sure, use 'might' or 'may' — 'must' means something is definite or necessary",
            interactWrongSentence: "It must be sunny at the weekend, but nobody knows for certain.",
            interactCorrectSentence: "It might be sunny at the weekend, but nobody knows for certain.",
            interactRule: "If nobody knows for certain, use 'might' or 'may' — 'must' means it's definite"
          },
          {
            name: "Zara",
            scenario: "wrote a letter to her cousin",
            wrongSentence: "You should comes to visit us in the summer.",
            correctSentence: "You should come to visit us in the summer.",
            mistake: "added an 's' to the verb after 'should' — modal verbs are followed by the base form of the verb",
            rule: "After a modal verb, always use the base form: should COME, must GO, might RAIN — never add 's', 'ed', or 'ing' to the next verb",
            interactWrongSentence: "We could goes to the cinema on Saturday.",
            interactCorrectSentence: "We could go to the cinema on Saturday.",
            interactRule: "After a modal verb, always use the base form: could GO, not 'could goes'"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Something's off with the certainty dial here...`,
            body: (v) => `${v.name} ${v.scenario}. Read this carefully — the modal verb doesn't match the meaning:\n\n"${v.wrongSentence}"`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.wrongSentence,
                highlightWords: [],
                label: "Can you spot the mistake?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Wrong dial setting — let's fix it!",
            body: (v) => `${v.name} ${v.mistake}.\n\n${v.rule}.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `✗ "${v.wrongSentence}"`, why: `${v.mistake}` },
                  { text: `✓ "${v.correctSentence}"`, why: `${v.rule}` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn — set the right dial!",
            body: (v) => `Which sentence uses the correct modal verb? Think about how certain the sentence should be!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.interactWrongSentence,
                highlightWords: [],
                label: "Which version is correct?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `"${v.interactWrongSentence}" — which sentence fixes the modal verb?`,
              getOptions: (v) => [
                v.interactCorrectSentence,
                v.interactWrongSentence,
                `She cans play the piano very well.`,
                `The pupils wills arrive at noon.`,
                `He musted finish the work on time.`
              ],
              correctAnswer: (v) => v.interactCorrectSentence,
              feedback: {
                correct: (v) => `Spot on! You set the dial perfectly. ${v.interactRule}. ✓`,
                incorrect: (v) => `Nearly! Think about the certainty level. ${v.interactRule}. The correct sentence is: "${v.interactCorrectSentence}".`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Modal verbs — your 3-point checklist!",
            body: () => `Use this checklist every time and you'll never get modal verbs wrong:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Does the modal match the meaning?", why: "Check the dial: Definite = must/will. Possible = might/may. Advice = should." },
                  { text: "Is the next verb in its base form?", why: "should GO (not goes), might RAIN (not rains), must EAT (not eats) — always plain!" },
                  { text: "Has the modal verb changed form?", why: "Modal verbs are stubborn — they NEVER change: no 'cans', no 'shoulded', no 'musting' ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 11: Formal vs Informal Language
  // ==========================================
  {
    id: "formal-register",
    name: "Formal vs Informal Language",
    category: "other",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "formal-register-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to tell the difference between formal and informal language — like knowing when to wear a suit vs joggers!",
          "When to use formal or informal writing (getting this right shows the examiner you really understand English)"
        ],
        variableSets: [
          {
            name: "Ella",
            scenario: "needs to write a letter to her headteacher about a school trip",
            formalSentence: "I would like to request permission to organise a trip to the Natural History Museum.",
            informalSentence: "Can we go on a trip to the museum? It'd be really cool!",
            formalFeature: "no contractions, polite language, full sentences",
            informalFeature: "contractions ('it'd'), casual words ('cool'), exclamation mark",
            formalPassive: "The trip has been arranged for Thursday.",
            informalActive: "Mrs Clark sorted the trip for Thursday.",
            context: "letter to headteacher",
            correctRegister: "formal"
          },
          {
            name: "Charlie",
            scenario: "is writing two versions of the same message — one for a report and one for a text to his friend",
            formalSentence: "Furthermore, the evidence suggests that exercise improves concentration.",
            informalSentence: "Also, it looks like doing sport helps you focus better.",
            formalFeature: "connecting word 'furthermore', formal vocabulary 'evidence suggests'",
            informalFeature: "casual connector 'also', everyday words 'looks like', 'focus better'",
            formalPassive: "The results were recorded in the table.",
            informalActive: "We wrote the results in the table.",
            context: "science report",
            correctRegister: "formal"
          },
          {
            name: "Aisha",
            scenario: "is writing a complaint letter about a faulty product",
            formalSentence: "I am writing to inform you that the item I purchased is not functioning correctly.",
            informalSentence: "The thing I bought doesn't work!",
            formalFeature: "no contractions, formal vocabulary ('inform', 'purchased', 'functioning')",
            informalFeature: "contraction ('doesn't'), casual words ('thing', 'bought'), exclamation",
            formalPassive: "The item was delivered on Tuesday.",
            informalActive: "They sent it on Tuesday.",
            context: "complaint letter",
            correctRegister: "formal"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Imagine sending this to your headteacher...`,
            body: (v) => `${v.name} ${v.scenario}. Here's the thing — HOW you write matters just as much as WHAT you write. It's like wearing the right outfit for the occasion! Compare these two:\n\n**Formal:** "${v.formalSentence}"\n\n**Informal:** "${v.informalSentence}"`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.informalSentence,
                highlightWords: [],
                label: "Formal or informal?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Suit or joggers? Picking the right register!",
            body: (v) => `${v.name} is writing a ${v.context}, so the **register** (how formal or informal the language is) matters — like choosing the right outfit. Formal is your smart suit — letters, reports, essays. Informal is your comfy joggers — friends, diaries, and dialogue.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: "Formal avoids contractions", why: `"do not" instead of "don't", "I am" instead of "I'm" — no squishing words together!` },
                  { text: "Formal uses sophisticated vocabulary", why: `"purchase" not "buy", "inform" not "tell" — fancier words for fancier writing` },
                  { text: "Formal uses passive voice", why: `"${v.formalPassive}" sounds more official than "${v.informalActive}"` },
                  { text: "Formal avoids slang and exclamation marks", why: `No "cool", "awesome", or "loads of" — keep it calm and professional` }
                ],
                allRevealed: false
              })
            },
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "don't", right: "do not (formal)" },
                { left: "buy", right: "purchase (formal)" },
                { left: "tell", right: "inform (formal)" },
                { left: "also", right: "furthermore (formal)" },
                { left: "loads of", right: "a significant number (formal)" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Time to dress your words properly!",
            body: (v) => `Which sentence is wearing the right outfit for a ${v.context}?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: "Formal uses longer words, no slang, passive voice",
                highlightWords: [],
                label: "Formal or informal?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Which sentence is most appropriate for a ${v.context}?`,
              getOptions: (v) => [
                v.formalSentence,
                v.informalSentence,
                `Yeah, so basically the whole idea is well good, innit.`,
                `Loads of people reckon the ${v.context} was dead good.`,
                `Gonna need you to sort this out pretty sharpish, cheers.`
              ],
              correctAnswer: (v) => v.formalSentence,
              feedback: {
                correct: (v) => `Brilliant — perfectly dressed for the occasion! A ${v.context} needs formal language: ${v.formalFeature}. ✓`,
                incorrect: (v) => `Not quite! A ${v.context} needs the smart suit, not joggers. "${v.formalSentence}" is correct because it uses ${v.formalFeature}.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Formal vs informal — you'll always pick the right outfit now!",
            body: () => `Knowing when to be formal and when to be informal shows the examiner you really understand English:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Who is your audience?", why: "Headteacher/stranger = smart suit. Friend/diary = comfy joggers." },
                  { text: "Formal: no contractions, sophisticated vocabulary", why: "'I would like to request' not 'Can I have' — dress it up!" },
                  { text: "Formal: passive voice sounds more official", why: "'The window was broken' not 'Someone broke the window' — more grown-up" },
                  { text: "Informal: contractions, everyday words, personality", why: "Fine for dialogue, texts, and diary entries — relax and be yourself! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot the Mistake ----
      {
        id: "formal-register-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to spot when someone's wearing a suit jacket with joggers — mixed register!",
          "How to convert between formal and informal so your tone stays consistent"
        ],
        variableSets: [
          {
            name: "Finn",
            scenario: "wrote a formal letter to the local council",
            wrongSentence: "I am writing to complain about the park cos it's a right mess.",
            correctSentence: "I am writing to complain about the state of the park, which has not been properly maintained.",
            mistake: "mixed formal and informal language — started formally ('I am writing to complain') but then used slang ('cos', 'a right mess')",
            rule: "Keep the same register throughout — if you start formally, stay formal. Replace slang with proper vocabulary.",
            interactWrongSentence: "I would like to request a meeting cos I've got loads of ideas.",
            interactCorrectSentence: "I would like to request a meeting because I have several suggestions to discuss.",
            interactRule: "Keep your register consistent — replace 'cos' with 'because', 'loads of ideas' with 'several suggestions', and expand contractions"
          },
          {
            name: "Imogen",
            scenario: "wrote a science report for her teacher",
            wrongSentence: "The experiment was conducted carefully and the results were well good.",
            correctSentence: "The experiment was conducted carefully and the results were very positive.",
            mistake: "used informal slang ('well good') in a formal report — the rest of the sentence is formal",
            rule: "In reports and essays, use formal vocabulary throughout — 'very positive' or 'excellent' instead of 'well good'",
            interactWrongSentence: "The investigation was planned thoroughly and the findings were dead useful.",
            interactCorrectSentence: "The investigation was planned thoroughly and the findings were extremely valuable.",
            interactRule: "In reports, use formal vocabulary throughout — 'extremely valuable' instead of 'dead useful'"
          },
          {
            name: "Ethan",
            scenario: "wrote a book review for the school newsletter",
            wrongSentence: "The author's use of metaphor is effective and the book is basically epic.",
            correctSentence: "The author's use of metaphor is effective and the book is thoroughly engaging.",
            mistake: "used slang ('basically epic') in a formal book review — this doesn't match the formal tone of the rest",
            rule: "In formal writing, replace casual words like 'basically' and 'epic' with precise, formal alternatives like 'thoroughly engaging'",
            interactWrongSentence: "The poet's choice of language is impressive and the poem is proper brilliant.",
            interactCorrectSentence: "The poet's choice of language is impressive and the poem is remarkably powerful.",
            interactRule: "In formal writing, replace slang like 'proper brilliant' with precise, formal alternatives like 'remarkably powerful'"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Suit jacket... with joggers? Something's off!`,
            body: (v) => `${v.name} ${v.scenario}. The tone starts smart but then goes casual — can you spot where it goes wrong?\n\n"${v.wrongSentence}"`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.wrongSentence,
                highlightWords: [],
                label: "Can you spot the mistake?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Pick an outfit and stick with it!",
            body: (v) => `${v.name} ${v.mistake}.\n\n${v.rule}.\n\n**How to keep your tone consistent:**\n1. Decide your register before you start (formal for letters/reports, informal for dialogue/diaries)\n2. Read your writing aloud — if any word sounds out of place, it probably is\n3. Replace slang with formal alternatives ('well good' → 'very effective', 'loads of' → 'a significant number of')\n4. Check contractions in formal writing — expand them: 'don't' → 'do not', 'it's' → 'it is'`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `✗ "${v.wrongSentence}"`, why: `${v.mistake}` },
                  { text: `✓ "${v.correctSentence}"`, why: `${v.rule}` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn — find the one that matches!",
            body: (v) => `Which sentence stays in the same outfit all the way through?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.interactWrongSentence,
                highlightWords: [],
                label: "Which version is correct?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `"${v.interactWrongSentence}" — which version is consistently formal?`,
              getOptions: (v) => [
                v.interactCorrectSentence,
                v.interactWrongSentence,
                `The findings were significant and that's well impressive.`,
                `We request your assistance cos we really need help.`,
                `The data was collected carefully and it was dead interesting.`
              ],
              correctAnswer: (v) => v.interactCorrectSentence,
              feedback: {
                correct: (v) => `Brilliant! "${v.interactCorrectSentence}" keeps a smart suit on from start to finish — no slang sneaking in! ✓`,
                incorrect: (v) => `Nearly! ${v.interactRule}. The correct version is: "${v.interactCorrectSentence}". No joggers with a suit jacket!`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Consistent register — easy marks in the bag!",
            body: () => `Getting this right is a brilliant way to pick up marks. Here's the method:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Pick your outfit before you start", why: "Decide: smart suit (formal letter/report) or comfy joggers (text/diary)?" },
                  { text: "Step 2: Stay consistent throughout", why: "Don't mix — suit jacket with joggers sounds odd and loses marks!" },
                  { text: "Step 3: Replace slang in formal writing", why: "Swap words like 'kids' → 'children', 'stuff' → 'belongings', 'loads' → 'many'" },
                  { text: "Step 4: Expand contractions in formal writing", why: "Use 'do not' instead of 'don't', 'it is' instead of 'it's' ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 12: Expanded Noun Phrases
  // ==========================================
  {
    id: "expanded-noun-phrases",
    name: "Expanded Noun Phrases",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "expanded-noun-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to build expanded noun phrases — the secret to making your writing vivid and interesting!",
          "How adjectives, prepositional phrases, and relative clauses turn a boring noun into a mini movie"
        ],
        variableSets: [
          {
            name: "Grace",
            scenario: "is making her story writing more descriptive",
            simpleNoun: "the dog",
            withAdjectives: "the big, scruffy dog",
            withPrepPhrase: "the big, scruffy dog by the gate",
            withRelative: "the big, scruffy dog by the gate, which wagged its tail excitedly",
            nounWord: "dog",
            adjectives: "big, scruffy",
            prepPhrase: "by the gate",
            relativeClause: "which wagged its tail excitedly",
            identifySentence: "The old stone cottage at the end of the lane looked mysterious.",
            identifyNounPhrase: "The old stone cottage at the end of the lane",
            identifyNoun: "cottage"
          },
          {
            name: "Ben",
            scenario: "is improving his description of a character in his story",
            simpleNoun: "the man",
            withAdjectives: "the tall, grey-haired man",
            withPrepPhrase: "the tall, grey-haired man in the navy coat",
            withRelative: "the tall, grey-haired man in the navy coat, who had a kind smile",
            nounWord: "man",
            adjectives: "tall, grey-haired",
            prepPhrase: "in the navy coat",
            relativeClause: "who had a kind smile",
            identifySentence: "The nervous young boy with the red rucksack waited at the bus stop.",
            identifyNounPhrase: "The nervous young boy with the red rucksack",
            identifyNoun: "boy"
          },
          {
            name: "Daisy",
            scenario: "is writing a setting description for her English homework",
            simpleNoun: "the castle",
            withAdjectives: "the ancient, crumbling castle",
            withPrepPhrase: "the ancient, crumbling castle on the hilltop",
            withRelative: "the ancient, crumbling castle on the hilltop, which overlooked the whole valley",
            nounWord: "castle",
            adjectives: "ancient, crumbling",
            prepPhrase: "on the hilltop",
            relativeClause: "which overlooked the whole valley",
            identifySentence: "The bright red bus with the broken window rattled down the street.",
            identifyNounPhrase: "The bright red bus with the broken window",
            identifyNoun: "bus"
          },
          {
            name: "Aisha",
            scenario: "is writing about her favourite place for a class project",
            simpleNoun: "the tree",
            withAdjectives: "the enormous, ancient oak tree",
            withPrepPhrase: "the enormous, ancient oak tree in the village square",
            withRelative: "the enormous, ancient oak tree in the village square, which had stood for centuries",
            nounWord: "tree",
            adjectives: "enormous, ancient",
            prepPhrase: "in the village square",
            relativeClause: "which had stood for centuries",
            identifySentence: "The tiny black kitten with the white paws purred on the windowsill.",
            identifyNounPhrase: "The tiny black kitten with the white paws",
            identifyNoun: "kitten"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Watch this — from plain to amazing in 3 steps!`,
            body: (v) => `${v.name} ${v.scenario}. This is like a makeover for your nouns — watch how a plain, boring noun phrase becomes vivid and interesting:`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `"${v.simpleNoun}" → "${v.withAdjectives}"`,
                highlightWords: [{ word: v.withAdjectives, color: "#7C3AED" }],
                label: "Expand the noun phrase:"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The noun phrase makeover — step by step!",
            body: (v) => `We turned **"${v.simpleNoun}"** into **"${v.withAdjectives}"** — and we can go even further! Think of it as layering: each layer adds more detail, like painting a picture with words:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Start with the noun: "${v.nounWord}"`, why: "Layer 1 — the plain base, like a blank canvas" },
                  { text: `Add adjectives: "${v.withAdjectives}"`, why: `Layer 2 — "${v.adjectives}" paint a picture of WHAT the ${v.nounWord} is like` },
                  { text: `Add a prepositional phrase: "${v.withPrepPhrase}"`, why: `Layer 3 — "${v.prepPhrase}" tells us WHERE it is` },
                  { text: `Add a relative clause: "${v.withRelative}"`, why: `Layer 4 — "${v.relativeClause}" brings it to life!` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "fill-blank",
              sentence: (v) => `To expand a noun phrase, add adjectives, a prepositional phrase, or a ____ clause`,
              options: (v) => ["relative", "subordinate", "main", "passive"],
              correctIndex: (v) => 0,
              feedback: {
                correct: (v) => `Yes! A relative clause is the final layer — it adds that extra sparkle of detail to the noun phrase. ✓`,
                incorrect: (v) => `Nearly! A RELATIVE clause (starting with who, which, or that) is the right answer. It's the top layer that adds extra detail about the noun.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Can you spot the makeover?",
            body: (v) => `Find the expanded noun phrase hiding in this sentence!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.identifySentence,
                highlightWords: [{ word: v.identifyNounPhrase || "", color: "#7C3AED" }],
                label: "Spot the expanded noun phrase:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `In "${v.identifySentence}", what is the expanded noun phrase?`,
              getOptions: (v) => [
                v.identifyNounPhrase,
                v.identifyNoun,
                v.identifySentence.replace(v.identifyNounPhrase, "").replace(/^\s+/, "").replace(/\.$/, ""),
                v.prepPhrase,
                v.relativeClause
              ],
              correctAnswer: (v) => v.identifyNounPhrase,
              feedback: {
                correct: (v) => `Brilliant! "${v.identifyNounPhrase}" is the expanded noun phrase — it takes "${v.identifyNoun}" and layers on detail to paint a vivid picture. ✓`,
                incorrect: (v) => `Nearly! The expanded noun phrase is "${v.identifyNounPhrase}". Find the noun "${v.identifyNoun}" first, then gather all the layers of detail around it.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Noun phrase makeovers — your new skill!",
            body: () => `Using expanded noun phrases makes your writing vivid and interesting — that means better marks! Here's the recipe:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Layer 1: Start with a noun", why: "dog, castle, boy, tree — your blank canvas" },
                  { text: "Layer 2: Add adjectives before the noun", why: "the BIG, SCRUFFY dog — what is it like?" },
                  { text: "Layer 3: Add a prepositional phrase", why: "the big, scruffy dog BY THE GATE — where is it?" },
                  { text: "Layer 4: Add a relative clause (optional)", why: "...WHICH WAGGED ITS TAIL — the finishing touch! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot the Mistake ----
      {
        id: "expanded-noun-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to spot expanded noun phrases in a sentence — a common exam question!",
          "How to tell noun phrases (about things) from verb phrases (about actions) — they look similar but are totally different"
        ],
        variableSets: [
          {
            name: "Oliver",
            scenario: "was asked to underline the expanded noun phrase in his test",
            wrongSentence: "The old wooden boat sailed across the lake.",
            correctSentence: "The old wooden boat sailed across the lake.",
            wrongAnswer: "sailed across the lake",
            correctAnswer: "The old wooden boat",
            mistake: "underlined the verb phrase ('sailed across the lake') instead of the noun phrase ('The old wooden boat')",
            rule: "An expanded noun phrase describes a THING (noun) — not an action (verb). 'The old wooden boat' is the noun phrase; 'sailed' is the verb.",
            interactSentence: "The large grey elephant at the zoo trumpeted loudly.",
            interactCorrectAnswer: "The large grey elephant at the zoo",
            interactWrongAnswer: "trumpeted loudly",
            interactNoun: "elephant",
            interactRule: "Find the noun ('elephant'), then gather adjectives ('large grey') and the prepositional phrase ('at the zoo')"
          },
          {
            name: "Chloe",
            scenario: "was asked to find the noun phrase in a sentence",
            wrongSentence: "A tiny, frightened mouse under the floorboards scratched and squeaked all night.",
            correctSentence: "A tiny, frightened mouse under the floorboards scratched and squeaked all night.",
            wrongAnswer: "scratched and squeaked all night",
            correctAnswer: "A tiny, frightened mouse under the floorboards",
            mistake: "chose the verb phrase ('scratched and squeaked all night') instead of the expanded noun phrase",
            rule: "Look for the noun first ('mouse'), then find all the words that describe it: 'A tiny, frightened mouse under the floorboards'",
            interactSentence: "The beautiful golden retriever with the red collar bounded across the field.",
            interactCorrectAnswer: "The beautiful golden retriever with the red collar",
            interactWrongAnswer: "bounded across the field",
            interactNoun: "retriever",
            interactRule: "Find the noun ('retriever'), then gather adjectives ('beautiful golden') and the prepositional phrase ('with the red collar')"
          },
          {
            name: "Josh",
            scenario: "was asked to identify the expanded noun phrase in his reading test",
            wrongSentence: "The mysterious old lighthouse on the cliff edge flashed its beam across the water.",
            correctSentence: "The mysterious old lighthouse on the cliff edge flashed its beam across the water.",
            wrongAnswer: "flashed its beam across the water",
            correctAnswer: "The mysterious old lighthouse on the cliff edge",
            mistake: "selected the verb phrase instead of the expanded noun phrase that comes before the verb",
            rule: "Find the main noun ('lighthouse'), then gather all words that modify it: adjectives ('mysterious old') and prepositional phrase ('on the cliff edge')",
            interactSentence: "The tall brick chimney on the factory roof crumbled during the storm.",
            interactCorrectAnswer: "The tall brick chimney on the factory roof",
            interactWrongAnswer: "crumbled during the storm",
            interactNoun: "chimney",
            interactRule: "Find the noun ('chimney'), then gather adjectives ('tall brick') and the prepositional phrase ('on the factory roof')"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Oops — ${v.name} picked the wrong bit!`,
            body: (v) => `${v.name} ${v.scenario}. But ${v.name} grabbed the wrong part of the sentence! Can you see what went wrong?\n\n"${v.wrongSentence}"\n\n${v.name} chose: "${v.wrongAnswer}"`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.wrongSentence,
                highlightWords: [],
                label: "Can you spot the mistake?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Start with the noun — everything else follows!",
            body: (v) => `**4-step method:** 1) Find the main noun (the THING). 2) Gather adjectives before it. 3) Look for a prepositional phrase (a group starting with 'in', 'on', 'with', etc.) after it. 4) Ignore the verb phrase (the ACTION).\n\n${v.name} ${v.mistake}.\n\n${v.rule}.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `✗ "${v.wrongAnswer}"`, why: `${v.mistake}` },
                  { text: `✓ "${v.correctAnswer}"`, why: `${v.rule}` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn — grab the right part!",
            body: (v) => `Find the noun first, then gather all its layers of detail. Which is the expanded noun phrase?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.interactSentence,
                highlightWords: [],
                label: "Spot the expanded noun phrase:"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `"${v.interactSentence}" — what is the expanded noun phrase?`,
              getOptions: (v) => [
                v.interactCorrectAnswer,
                v.interactWrongAnswer,
                v.interactNoun,
                v.interactSentence.split(" ").slice(-2).join(" "),
                v.interactSentence.split(" ").slice(0, 2).join(" ")
              ],
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Spot on! "${v.interactCorrectAnswer}" is the expanded noun phrase — you grabbed exactly the right bit. ${v.interactRule}. ✓`,
                incorrect: (v) => `Nearly! ${v.interactRule}. The expanded noun phrase is "${v.interactCorrectAnswer}". Remember: find the noun first, then gather its layers!`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Expanded noun phrases — sorted for the exam!",
            body: () => `This question comes up loads. Here's your 4-step method:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Find the main noun", why: "The noun is the THING — a person, place, or object. Start here!" },
                  { text: "Step 2: Gather the adjectives before it", why: "These describe the noun, e.g. 'the tall, ancient oak' — layer 2" },
                  { text: "Step 3: Check for a prepositional phrase after it", why: "e.g. 'the tall, ancient oak by the river' — layer 3 adds location" },
                  { text: "Step 4: Ignore the verb phrase", why: "The verb phrase is the ACTION — don't be distracted by it! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 13: Perfect and Progressive Verb Forms
  // ==========================================
  {
    id: "perfect-progressive",
    name: "Perfect and Progressive Verb Forms",
    category: "other",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "perfect-progressive-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to identify the four verb forms — they tell you exactly WHEN and HOW an action happens!",
          "How to choose the right verb form for the meaning (this is a favourite 11+ question)"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "is writing about what happened at the school fair",
            presentPerfect: "She has sold twenty cakes.",
            presentPerfectHelper: "has",
            presentPerfectParticiple: "sold",
            presentPerfectMeaning: "started in the past but matters right now — she's still at the fair",
            pastPerfect: "She had sold all the cakes before lunchtime.",
            pastPerfectHelper: "had",
            pastPerfectMeaning: "happened before another past event — the selling finished BEFORE lunch",
            presentProgressive: "She is counting the money.",
            progressiveHelper: "is",
            progressiveVerb: "counting",
            presentProgressiveMeaning: "happening right now, at this moment",
            pastProgressive: "She was counting the money when the bell rang.",
            pastProgressiveHelper: "was",
            pastProgressiveMeaning: "was happening in the past when something else interrupted it",
            testSentence: "Daisy has raised fifty pounds for charity.",
            testAnswer: "present perfect",
            testExplanation: "'has raised' = has/have + past participle — it started in the past and is relevant now"
          },
          {
            name: "Charlie",
            scenario: "is writing about a football tournament",
            presentPerfect: "He has scored three goals today.",
            presentPerfectHelper: "has",
            presentPerfectParticiple: "scored",
            presentPerfectMeaning: "started in the past but relevant now — the match might still be going",
            pastPerfect: "He had scored twice before half-time.",
            pastPerfectHelper: "had",
            pastPerfectMeaning: "happened before another past event — the goals came BEFORE half-time",
            presentProgressive: "He is warming up for the final.",
            progressiveHelper: "is",
            progressiveVerb: "warming",
            presentProgressiveMeaning: "happening right now, at this very moment",
            pastProgressive: "He was warming up when the rain started.",
            pastProgressiveHelper: "was",
            pastProgressiveMeaning: "was ongoing in the past when something else happened",
            testSentence: "Charlie was dribbling the ball when he slipped.",
            testAnswer: "past progressive",
            testExplanation: "'was dribbling' = was/were + -ing — an ongoing past action interrupted by another event"
          },
          {
            name: "Ella",
            scenario: "is writing a diary entry about learning to bake",
            presentPerfect: "She has learnt how to make scones.",
            presentPerfectHelper: "has",
            presentPerfectParticiple: "learnt",
            presentPerfectMeaning: "started in the past and is relevant now — she still knows how",
            pastPerfect: "She had already mixed the dough before Mum arrived.",
            pastPerfectHelper: "had",
            pastPerfectMeaning: "happened before another past event — mixing came BEFORE Mum arriving",
            presentProgressive: "She is decorating the cupcakes.",
            progressiveHelper: "is",
            progressiveVerb: "decorating",
            presentProgressiveMeaning: "happening right now, at this moment",
            pastProgressive: "She was stirring the mixture when the timer went off.",
            pastProgressiveHelper: "was",
            pastProgressiveMeaning: "was happening in the past when something else interrupted it",
            testSentence: "Ella had finished the icing before the party started.",
            testAnswer: "past perfect",
            testExplanation: "'had finished' = had + past participle — it happened BEFORE another past event (the party starting)"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Did you know? English has FOUR ways to describe actions!`,
            body: (v) => `${v.name} ${v.scenario}. Most languages don't have this many options, but English gives you four special verb forms to say exactly WHEN and HOW something happens. Let's learn them — it's like having four different camera angles!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: `${v.presentPerfect} / ${v.presentProgressive}`,
                highlightWords: [],
                label: "Perfect or progressive?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Four camera angles — four verb forms!",
            body: (v) => `Each verb form gives you a different view of the action. Think of them as four camera angles, each showing something different:`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Present perfect (has/have + done)`, why: `Camera 1: started in the past but still matters NOW. "${v.presentPerfect}"` },
                  { text: `Past perfect (had + done)`, why: `Camera 2: happened BEFORE another past event — the flashback! "${v.pastPerfect}"` },
                  { text: `Present progressive (is/are + -ing)`, why: `Camera 3: happening RIGHT NOW, live action! "${v.presentProgressive}"` },
                  { text: `Past progressive (was/were + -ing)`, why: `Camera 4: WAS happening when something else interrupted. "${v.pastProgressive}"` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `Present perfect uses "has" or "have" plus the past participle (e.g. has learnt, have gone)`, answer: true, explanation: `Correct! Present perfect = has/have + past participle. It shows something started in the past and is still relevant now. ✓` },
                { text: `Progressive forms always end in "-ed"`, answer: false, explanation: `No! Progressive forms always end in "-ing" (is running, was dancing). It's the perfect forms that use past participles. ✓` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Which camera angle is this?",
            body: (v) => `Can you work out which verb form is being used?`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.testSentence,
                highlightWords: [],
                label: "Which tense is this?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `"${v.testSentence}" — which verb form is used?`,
              getOptions: (v) => [
                v.testAnswer,
                ...["present perfect", "past perfect", "present progressive", "past progressive", "simple past"].filter(t => t !== v.testAnswer).slice(0, 4)
              ],
              correctAnswer: (v) => v.testAnswer,
              feedback: {
                correct: (v) => `Brilliant — you spotted the right camera angle! ${v.testExplanation}. ✓`,
                incorrect: (v) => `Close! ${v.testExplanation}. The answer is ${v.testAnswer}. Keep practising — you'll nail it!`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Four verb forms — you've got them all!",
            body: () => `This comes up in loads of 11+ papers. Here's your quick-reference guide:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Present perfect: has/have + past participle", why: "Camera 1: 'She has finished' — started in the past, still matters NOW" },
                  { text: "Past perfect: had + past participle", why: "Camera 2: 'She had finished before tea' — the flashback, before ANOTHER past event" },
                  { text: "Present progressive: am/is/are + -ing", why: "Camera 3: 'She is running' — happening RIGHT NOW, live!" },
                  { text: "Past progressive: was/were + -ing", why: "Camera 4: 'She was running when it rained' — ongoing action interrupted ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot the Mistake ----
      {
        id: "perfect-progressive-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to spot when someone's used the wrong verb form — like a camera pointing the wrong way!",
          "How to choose the correct verb form for the context (practice makes perfect with this one)"
        ],
        variableSets: [
          {
            name: "Finn",
            scenario: "wrote about what happened at the school concert",
            wrongSentence: "The choir has sung three songs before the interval started.",
            correctSentence: "The choir had sung three songs before the interval started.",
            mistake: "used the present perfect ('has sung') instead of the past perfect ('had sung') — both events are in the past, so we need 'had' to show which came first",
            rule: "When one past event happened BEFORE another past event, use the past perfect (had + past participle): 'had sung' came before 'started'",
            interactWrongSentence: "The band has played two pieces before the audience arrived.",
            interactCorrectSentence: "The band had played two pieces before the audience arrived.",
            interactRule: "Both events are in the past, so use the past perfect ('had played') to show which came first"
          },
          {
            name: "Priya",
            scenario: "wrote about a race on sports day",
            wrongSentence: "She was winning the race when she has tripped over a hurdle.",
            correctSentence: "She was winning the race when she tripped over a hurdle.",
            mistake: "used the present perfect ('has tripped') for a past event that interrupted another — it should be simple past ('tripped')",
            rule: "Past progressive (was winning) describes the ongoing action. The interrupting event uses the simple past (tripped), not the present perfect.",
            interactWrongSentence: "He was leading the relay when he has dropped the baton.",
            interactCorrectSentence: "He was leading the relay when he dropped the baton.",
            interactRule: "Past progressive ('was leading') describes the ongoing action. The interrupting event uses simple past ('dropped'), not present perfect"
          },
          {
            name: "Oliver",
            scenario: "wrote a paragraph about his morning routine",
            wrongSentence: "I was ate my breakfast when the doorbell rang.",
            correctSentence: "I was eating my breakfast when the doorbell rang.",
            mistake: "used 'was ate' instead of 'was eating' — the past progressive needs was/were + -ing form, not the past participle",
            rule: "For past progressive, use was/were + the -ing form: 'was eating', not 'was ate'. The -ing shows the action was ongoing.",
            interactWrongSentence: "She was wrote her homework when the lights went out.",
            interactCorrectSentence: "She was writing her homework when the lights went out.",
            interactRule: "For past progressive, use was/were + the -ing form: 'was writing', not 'was wrote'. The -ing shows the action was ongoing"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `The wrong camera angle — can you spot it?`,
            body: (v) => `${v.name} ${v.scenario}. But the verb form is pointing the wrong way! Can you hear what's off?\n\n"${v.wrongSentence}"`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.wrongSentence,
                highlightWords: [],
                label: "Can you spot the mistake?"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Right camera angle, right picture!",
            body: (v) => {
              // Tailored "right camera angle" tip per mistake type —
              // avoids the wall-of-text cheat sheet that overwhelmed readers.
              const cameraTip = v.name === "Finn"
                ? `🎥 Wrong camera angle: **'has sung'** — that one connects to *now*. But the interval is in the past, so 'now' doesn't fit.\n\nRight camera angle: **'had sung'** — the flashback camera. Use 'had + past participle' when one past event happened *before* another past event.`
                : v.name === "Priya"
                ? `🎥 Wrong camera angle: **'has tripped'** — that one connects to *now*. But the race is already over, so 'now' doesn't fit.\n\nRight camera angle: **'tripped'** — simple past. When something ongoing (*was winning*) gets interrupted, the interrupting bit is just simple past, not present perfect.`
                : v.name === "Oliver"
                ? `🎥 Wrong camera angle: **'was ate'** — 'ate' is the wrong shape for this camera.\n\nRight camera angle: **'was eating'** — past progressive always uses *was/were + the -ing form*. The -ing is what makes the action feel ongoing, like a camera rolling.`
                : `🎥 Wrong camera angle: it doesn't match the timing. Right camera angle: ${v.rule}.`;
              return `Here's what's going on: ${v.name} ${v.mistake}.\n\n${cameraTip}\n\nOne trick that always helps — ask yourself *when* the action happened, and *what else* was happening at the same time. The timing tells you which camera to pick.`;
            },
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `✗ "${v.wrongSentence}"`, why: `${v.mistake}` },
                  { text: `✓ "${v.correctSentence}"`, why: `${v.rule}` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          {
            type: "interact",
            title: () => "Your turn — pick the right angle!",
            body: (v) => `Which sentence uses the correct verb form? Think about the timing!`,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({
                mode: "highlight",
                text: v.interactWrongSentence,
                highlightWords: [],
                label: "Which version is correct?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `"${v.interactWrongSentence}" — which sentence fixes the verb form?`,
              getOptions: (v) => [
                v.interactCorrectSentence,
                v.interactWrongSentence,
                `The children was ran to the classroom before the bell.`,
                `The pupils has been playing outside all day.`,
                `She had ate lunch before the bell rang.`
              ],
              correctAnswer: (v) => v.interactCorrectSentence,
              feedback: {
                correct: (v) => `Spot on! You picked the right camera angle. ${v.interactRule}. ✓`,
                incorrect: (v) => `Nearly! Think about the timing of the events. ${v.interactRule}. The correct sentence is: "${v.interactCorrectSentence}".`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Four verb forms — ready for the exam!",
            body: () => `You've now learnt all four camera angles. Here's your cheat sheet:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "has / have + past participle", why: "Present perfect — connects past to now. Camera 1!" },
                  { text: "had + past participle", why: "Past perfect — the flashback, before another past event. Camera 2!" },
                  { text: "is / are + -ing", why: "Present progressive — live action, right now! Camera 3!" },
                  { text: "was / were + -ing", why: "Past progressive — ongoing past action that got interrupted. Camera 4! ✓" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      }
    ]
  },


  // ==========================================
  // SUB-CONCEPT: Standard English
  // Category: core — 2 lessons (step-by-step + spot-the-mistake)
  // PLAYBOOK compliant: child-friendly language, no unexplained technical terms,
  // visuals on every screen, 4+3 variable sets
  // ==========================================
  {
    id: "standard-english",
    name: "Standard English — Getting It Right in Writing",
    category: "core",
    lessons: [
      {
        id: "standard-english-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to spot things we say every day that are actually wrong in writing",
          "How to fix the most common writing mistakes so your English sounds polished"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "is checking her story for mistakes her teacher always marks",
            wrong1: "I done my homework before tea.",
            right1: "I did my homework before tea.",
            tip1: "'Done' always needs a helper word before it (like 'has done' or 'had done'). On its own, say **'did'**.",
            wrong2: "We was going to the park.",
            right2: "We were going to the park.",
            tip2: "'Was' is for one person (I was, he was). 'Were' is for more than one (we were, they were).",
            intQuestion: "Choose the correct word: 'She ___ her best in the race.'",
            intOptions: ["done", "did", "does", "doing", "has do"],
            intCorrect: "did",
            intExplanation: "'She did' is correct. Remember: 'done' needs a helper word — you can say 'she has done' but never 'she done' on its own."
          },
          {
            name: "Oliver",
            scenario: "keeps writing 'should of' and his teacher has circled it again",
            wrong1: "I should of brought my umbrella.",
            right1: "I should have brought my umbrella.",
            tip1: "'Should of' is ALWAYS wrong! It sounds like 'should've' when we say it quickly, but the short form is 'should **have**', not 'should of'.",
            wrong2: "We could of left earlier.",
            right2: "We could have left earlier.",
            tip2: "Same rule for 'could of', 'would of', and 'might of' — they're all wrong. Always write **'have'**.",
            intQuestion: "Choose the correct word: 'You should ___ told me about the change.'",
            intOptions: ["of", "have", "had", "been", "has"],
            intCorrect: "have",
            intExplanation: "'Should have' is correct. It sounds like 'should of' when spoken fast, but 'of' is never right here."
          },
          {
            name: "Priya",
            scenario: "is confused about when to use 'I' and when to use 'me'",
            wrong1: "Me and my friend went to the cinema.",
            right1: "My friend and I went to the cinema.",
            tip1: "When you're the one **doing** something, use 'I'. Try removing the other person: 'I went to the cinema' sounds right, 'me went to the cinema' doesn't!",
            wrong2: "The teacher told my brother and I to stay behind.",
            right2: "The teacher told my brother and me to stay behind.",
            tip2: "When something is being done **to you**, use 'me'. Try removing the other person: 'told me' sounds right, 'told I' doesn't!",
            intQuestion: "Choose the correct word: 'Between you and ___, I think the test was easy.'",
            intOptions: ["I", "me", "myself", "we", "mine"],
            intCorrect: "me",
            intExplanation: "'Between you and me' is correct. After words like 'between', 'for', 'to', and 'with', always use 'me' not 'I'."
          },
          {
            name: "Jake",
            scenario: "is learning to spot 'seen' and 'done' mistakes in his writing",
            wrong1: "I seen him at the shops yesterday.",
            right1: "I saw him at the shops yesterday.",
            tip1: "'Seen' needs a helper word (like 'I have seen'). On its own, the past of 'see' is **'saw'**.",
            wrong2: "She don't like broccoli.",
            right2: "She doesn't like broccoli.",
            tip2: "With 'he', 'she', or 'it', use **'doesn't'** not 'don't'. Save 'don't' for 'I', 'you', 'we', and 'they'.",
            intQuestion: "Choose the correct word: 'He ___ want to come to the party.'",
            intOptions: ["don't", "doesn't", "hasn't", "weren't", "isn't"],
            intCorrect: "doesn't",
            intExplanation: "'He doesn't' is correct. With he, she, or it, always use 'doesn't' — save 'don't' for I, you, we, and they."
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => v.name + "'s writing check",
            body: (v) => v.name + " " + v.scenario + ". Can you spot what's wrong here?\n\n**\"" + v.wrong1 + "\"**",
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({ sentence: v.wrong1, highlightWords: [v.wrong1.split(" ")[1]] })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "What we say vs what we write",
            body: () => "Lots of things we say every day are actually **wrong** in writing. Here are the fixes:",
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: 'Wrong: "' + v.wrong1 + '"', why: "This sounds OK when speaking, but it's wrong in writing" },
                  { text: 'Right: "' + v.right1 + '"', why: v.tip1 },
                  { text: 'Wrong: "' + v.wrong2 + '"', why: "Another very common mistake" },
                  { text: 'Right: "' + v.right2 + '"', why: v.tip2 }
                ]
              })
            },
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => v.intQuestion,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({ sentence: v.intQuestion.replace("Choose the correct word: ", ""), highlightWords: ["___"] })
            },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.intOptions,
              correctAnswer: (v) => v.intCorrect,
              feedback: {
                correct: (v) => "Brilliant! " + v.intExplanation + " ✓",
                incorrect: (v) => "Not quite! " + v.intExplanation
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Standard English — sorted!",
            body: () => "Remember these rules when you're writing:",
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. 'Did' not 'done' on its own", why: "'I did it' ✓ — 'I done it' ✗" },
                  { text: "2. 'Were' not 'was' with we/they", why: "'We were' ✓ — 'We was' ✗" },
                  { text: "3. 'Have' not 'of' after should/could/would", why: "'Should have' ✓ — 'Should of' ✗" },
                  { text: "4. 'I' when doing, 'me' when it's done to you", why: "Remove the other person to check which sounds right" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "standard-english-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to spot common spoken English mistakes hiding in written sentences",
          "Why some things that sound perfectly normal are actually wrong in writing"
        ],
        variableSets: [
          {
            name: "Ella",
            scenario: "is proofreading her friend's story",
            sentence: "Me and Amira gone to the shops and we buyed some sweets.",
            mistakes: ["'Me and Amira' should be 'Amira and I'", "'gone' should be 'went'", "'buyed' should be 'bought'"],
            corrected: "Amira and I went to the shops and we bought some sweets.",
            intQuestion: "Which sentence is correct?",
            intOptions: ["Me and Tom done our homework.", "Tom and me did our homework.", "Tom and I did our homework.", "Me and Tom did our homework.", "Tom and I done our homework."],
            intCorrect: "Tom and I did our homework.",
            intExplanation: "'Tom and I' (not 'me and Tom') because 'I' is doing the action. 'Did' (not 'done') because 'done' needs a helper word."
          },
          {
            name: "Ben",
            scenario: "is checking a letter before sending it",
            sentence: "We should of came earlier but we was stuck in traffic.",
            mistakes: ["'should of' should be 'should have'", "'came' should be 'come' (after 'have')", "'we was' should be 'we were'"],
            corrected: "We should have come earlier but we were stuck in traffic.",
            intQuestion: "Which sentence is correct?",
            intOptions: ["I could of helped.", "I could have helped.", "I could has helped.", "I could had helped.", "I could helping."],
            intCorrect: "I could have helped.",
            intExplanation: "'Could have' is always correct. 'Could of' just sounds like 'could've' but 'of' is never right here."
          },
          {
            name: "Sophie",
            scenario: "is marking her own test answers",
            sentence: "Her and her sister don't never agree on nothing.",
            mistakes: ["'Her and her sister' should be 'She and her sister'", "'don't never' — pick one: 'don't ever' or 'never'", "'nothing' should be 'anything' (to match 'don't')"],
            corrected: "She and her sister don't ever agree on anything.",
            intQuestion: "Which sentence is correct?",
            intOptions: ["She don't like it.", "She doesn't like it.", "She not like it.", "She do not likes it.", "She don't likes it."],
            intCorrect: "She doesn't like it.",
            intExplanation: "With 'she', always use 'doesn't' not 'don't'. 'Don't' is for I, you, we, and they."
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Can you spot the mistakes?",
            body: (v) => v.name + " " + v.scenario + ". This sentence has several things wrong — how many can you find?\n\n**\"" + v.sentence + "\"**",
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({ sentence: v.sentence })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Here are the mistakes",
            body: () => "Let's fix each one:",
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: v.mistakes.map((m, i) => ({ text: "Mistake " + (i+1) + ": " + m, why: "" })).concat([
                  { text: 'Corrected: "' + v.corrected + '"', why: "Now it's proper written English!" }
                ])
              })
            },
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => v.intQuestion,
            visual: {
              component: "WorkedExample",
              props: (v) => ({ steps: v.intOptions.map((o, i) => ({ text: (i+1) + ". " + o, why: "" })), allRevealed: true })
            },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.intOptions,
              correctAnswer: (v) => v.intCorrect,
              feedback: {
                correct: (v) => "Brilliant! " + v.intExplanation + " ✓",
                incorrect: (v) => "Not quite! " + v.intExplanation
              }
            }
          },
          {
            type: "consolidate",
            title: () => "You're a proofreading pro!",
            body: () => "When checking writing, watch out for these sneaky mistakes:",
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "'Me and...' at the start", why: "Change to '... and I' (remove the other person to check)" },
                  { text: "'Done', 'seen', 'gone' without a helper word", why: "Should be 'did', 'saw', 'went' on their own" },
                  { text: "'Should of', 'could of', 'would of'", why: "Always 'should have', 'could have', 'would have'" },
                  { text: "'Don't' with he/she/it", why: "Should be 'doesn't'" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT: Advanced Subject-Verb Agreement
  // Category: core — 2 lessons (step-by-step + spot-the-mistake)
  // ==========================================
  {
    id: "advanced-sva",
    name: "Tricky Subject-Verb Agreement",
    category: "core",
    lessons: [
      {
        id: "advanced-sva-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to choose the right verb when sneaky words try to trick you",
          "Why 'neither...nor' and 'a number of' follow special rules"
        ],
        variableSets: [
          {
            name: "Evie",
            scenario: "keeps getting tripped up by sentences with extra words in the middle",
            wrong: "The basket of oranges are on the table.",
            right: "The basket of oranges is on the table.",
            tip: "Cross out 'of oranges' in your head. What's left? 'The basket ___ on the table.' Basket is one thing, so it's **'is'**.",
            rule: "Ignore the 'of...' part — find the real subject",
            intQuestion: "Choose the correct word: 'The packet of crisps ___ already been opened.'",
            intOptions: ["have", "are", "has", "were", "is"],
            intCorrect: "has",
            intExplanation: "The subject is 'packet' (one thing), not 'crisps'. Cross out 'of crisps' — 'the packet has been opened'."
          },
          {
            name: "Jake",
            scenario: "is learning about 'neither...nor' — one of the trickiest grammar patterns",
            wrong: "Neither the captain nor the players was happy.",
            right: "Neither the captain nor the players were happy.",
            tip: "With 'neither...nor', the verb matches whichever word is **closest** to it. 'Players' is closest and it means more than one, so use **'were'**.",
            rule: "Neither...nor and either...or: the verb matches the nearest word",
            intQuestion: "Choose the correct word: 'Either the twins or their older sister ___ responsible.'",
            intOptions: ["are", "were", "is", "have", "do"],
            intCorrect: "is",
            intExplanation: "'Sister' is the nearest word to the verb, and sister is one person, so it's 'is'."
          },
          {
            name: "Amira",
            scenario: "is learning a really useful trick about 'the number of' vs 'a number of'",
            wrong: "A number of children is absent today.",
            right: "A number of children are absent today.",
            tip: "'A number of' just means 'several' or 'many', so use a verb for more than one: **'are'**.",
            rule: "THE number of = one thing. A number of = many things.",
            intQuestion: "Choose the correct word: 'The number of pupils arriving by bus ___ increased.'",
            intOptions: ["have", "are", "has", "were", "do"],
            intCorrect: "has",
            intExplanation: "'THE number of' talks about the number itself — one number — so it's 'has increased'."
          },
          {
            name: "Oscar",
            scenario: "is figuring out when groups (like 'the team' or 'the jury') are one thing or many",
            wrong: "The jury is unable to agree.",
            right: "The jury were unable to agree.",
            tip: "The jury members can't agree — they're all thinking different things! When a group is split, use a verb for more than one: **'were'**.",
            rule: "Group words: 'is' when acting as one, 'are/were' when acting separately",
            intQuestion: "Choose the correct word: 'The team ___ celebrating after their victory.'",
            intOptions: ["is", "was", "are", "has", "does"],
            intCorrect: "are",
            intExplanation: "The team members are each celebrating — so use 'are'. The word 'their' also tells you it's more than one."
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => v.name + "'s grammar puzzle",
            body: (v) => v.name + " " + v.scenario + ".\n\nWhich is correct?\n\n**\"" + v.wrong + "\"** or **\"" + v.right + "\"**",
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({ sentence: v.wrong })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The trick to getting it right",
            body: (v) => v.rule,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: 'Wrong: "' + v.wrong + '"', why: "This is wrong because..." },
                  { text: 'Right: "' + v.right + '"', why: v.tip },
                  { text: "The rule: " + v.rule, why: "Remember this for the exam!" }
                ]
              })
            },
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => v.intQuestion,
            visual: {
              component: "SentenceDisplay",
              props: (v) => ({ sentence: v.intQuestion.replace("Choose the correct word: ", ""), highlightWords: ["___"] })
            },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.intOptions,
              correctAnswer: (v) => v.intCorrect,
              feedback: {
                correct: (v) => "Well done! " + v.intExplanation + " ✓",
                incorrect: (v) => "Not quite! " + v.intExplanation
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Tricky agreement — mastered!",
            body: () => "Three sneaky patterns to watch for:",
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "1. 'Of...' phrases: cross them out!", why: "'The basket of oranges IS...' — basket is the real subject" },
                  { text: "2. Neither/nor: match the NEAREST word", why: "'Neither the captain nor the players WERE...'" },
                  { text: "3. Group words: one unit = 'is', acting separately = 'are'", why: "'The team IS winning' but 'The jury WERE unable to agree'" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "advanced-sva-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to spot when a sentence has the wrong verb because of a tricky subject"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "is proofreading sentences",
            sentence: "One of my friends are moving to a new school next term.",
            mistake: "'Are' should be 'is' — the subject is 'one' (one friend), not 'friends'.",
            corrected: "One of my friends is moving to a new school next term.",
            intQuestion: "Which sentence is correct?",
            intOptions: ["The box of chocolates were lovely.", "The box of chocolates was lovely.", "The box of chocolates are lovely.", "The box of chocolates have been lovely.", "The box of chocolates be lovely."],
            intCorrect: "The box of chocolates was lovely.",
            intExplanation: "The subject is 'box' (one thing). Cross out 'of chocolates' and it's clear: 'the box was lovely'."
          },
          {
            name: "Oliver",
            scenario: "found a mistake in a news article",
            sentence: "A number of pupils has been absent this week due to illness.",
            mistake: "'Has' should be 'have' — 'a number of' means 'several' so it needs a verb for more than one.",
            corrected: "A number of pupils have been absent this week due to illness.",
            intQuestion: "Which sentence is correct?",
            intOptions: ["The number of visitors have increased.", "The number of visitors has increased.", "The number of visitors are increased.", "The number of visitors were increased.", "The number of visitors be increased."],
            intCorrect: "The number of visitors has increased.",
            intExplanation: "'THE number of' is about the number itself — one number — so it's 'has'. Remember: THE = one thing, A = many."
          },
          {
            name: "Grace",
            scenario: "is checking her essay",
            sentence: "Neither the teacher nor the pupils was aware of the problem.",
            mistake: "'Was' should be 'were' — with 'neither...nor', the verb matches the nearest word. 'Pupils' is nearest and means more than one.",
            corrected: "Neither the teacher nor the pupils were aware of the problem.",
            intQuestion: "Which sentence is correct?",
            intOptions: ["Either the cake or the biscuits is ready.", "Either the cake or the biscuits are ready.", "Either the cake or the biscuits was ready.", "Either the cake or the biscuits has ready.", "Either the cake or the biscuits be ready."],
            intCorrect: "Either the cake or the biscuits are ready.",
            intExplanation: "'Biscuits' is nearest to the verb and means more than one, so it's 'are'."
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Can you spot the mistake?",
            body: (v) => v.name + " " + v.scenario + ". Something is wrong here:\n\n**\"" + v.sentence + "\"**",
            visual: { component: "SentenceDisplay", props: (v) => ({ sentence: v.sentence }) },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Here's the mistake",
            body: (v) => v.mistake,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: 'Wrong: "' + v.sentence + '"', why: v.mistake },
                  { text: 'Right: "' + v.corrected + '"', why: "Now the verb matches the real subject!" }
                ]
              })
            },
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => v.intQuestion,
            visual: { component: "WorkedExample", props: (v) => ({ steps: v.intOptions.map((o, i) => ({ text: (i+1) + ". " + o, why: "" })), allRevealed: true }) },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.intOptions,
              correctAnswer: (v) => v.intCorrect,
              feedback: {
                correct: (v) => "Brilliant! " + v.intExplanation + " ✓",
                incorrect: (v) => "Not quite! " + v.intExplanation
              }
            }
          },
          {
            type: "consolidate",
            title: () => "You're a mistake-spotting expert!",
            body: () => "Always check: what is the REAL subject of the sentence?",
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Cross out 'of...' phrases", why: "They hide the real subject" },
                  { text: "With neither/nor: look at the nearest word", why: "The verb matches whichever word is closest" },
                  { text: "THE number of = one thing. A number of = many", why: "This is a favourite exam trick!" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT: Future Perfect Tense
  // Category: supporting — 2 lessons
  // ==========================================
  {
    id: "future-perfect",
    name: "Future Perfect — Finished Before a Deadline",
    category: "supporting",
    lessons: [
      {
        id: "future-perfect-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to talk about things that will be **finished** before a future time",
          "How to spot the trigger words that tell you this special verb form is needed"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "is talking about her 11+ preparation",
            sentence: "By next September, she will have completed all her preparation.",
            trigger: "By next September",
            wrong: "By next September, she will complete all her preparation.",
            whyWrong: "'Will complete' just says she'll do it sometime. 'Will have completed' means she'll have **already finished** by that date.",
            intQuestion: "Choose the correct form: 'By the end of this term, we ___ all our times tables.'",
            intOptions: ["learn", "learned", "will learn", "will have learned", "are learning"],
            intCorrect: "will have learned",
            intExplanation: "'Will have learned' tells us the learning will be **finished** before the end of term. The 'by' is the clue!"
          },
          {
            name: "Oliver",
            scenario: "is writing about his exam timetable",
            sentence: "By Friday, we will have finished all our exams.",
            trigger: "By Friday",
            wrong: "By Friday, we will finish all our exams.",
            whyWrong: "'Will finish' doesn't say the exams will be done BEFORE Friday. 'Will have finished' makes it clear they'll be completed by then.",
            intQuestion: "Choose the correct form: 'By this time next year, I ___ primary school.'",
            intOptions: ["finish", "finished", "will finish", "will have finished", "am finishing"],
            intCorrect: "will have finished",
            intExplanation: "'Will have finished' is correct — it tells us primary school will be done before 'this time next year'."
          },
          {
            name: "Amira",
            scenario: "is describing her reading goal",
            sentence: "By Christmas, she will have read fifty books this year.",
            trigger: "By Christmas",
            wrong: "By Christmas, she will read fifty books this year.",
            whyWrong: "'Will read' just means she'll read them at some point. 'Will have read' means the fifty books will be **done** by Christmas.",
            intQuestion: "Choose the correct form: 'By the time Mum arrives, we ___ the house.'",
            intOptions: ["clean", "cleaned", "will clean", "will have cleaned", "are cleaning"],
            intCorrect: "will have cleaned",
            intExplanation: "'Will have cleaned' tells us the cleaning will be finished BEFORE Mum arrives. Look for 'by the time' as a trigger!"
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => v.name + "'s future deadline",
            body: (v) => v.name + " " + v.scenario + ".\n\n**\"" + v.sentence + "\"**\n\nThis sentence talks about something that will be **finished before** a future time.",
            visual: { component: "SentenceDisplay", props: (v) => ({ sentence: v.sentence, highlightWords: ["will", "have"] }) },
            interaction: null
          },
          {
            type: "teach",
            title: () => "How to build this verb form",
            body: () => "It's actually really simple — just three words put together:",
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: "The pattern: will + have + done-word", why: "Three parts put together" },
                  { text: "The trigger: '" + v.trigger + "'", why: "When you see 'by + a future time', that's your clue!" },
                  { text: 'Wrong: "' + v.wrong + '"', why: v.whyWrong },
                  { text: 'Right: "' + v.sentence + '"', why: "This makes it clear it'll be DONE by the deadline" }
                ]
              })
            },
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => v.intQuestion,
            visual: { component: "SentenceDisplay", props: (v) => ({ sentence: v.intQuestion.replace("Choose the correct form: ", ""), highlightWords: ["___"] }) },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.intOptions,
              correctAnswer: (v) => v.intCorrect,
              feedback: {
                correct: (v) => "Amazing! " + v.intExplanation + " ✓",
                incorrect: (v) => "Not quite! " + v.intExplanation
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Future perfect — nailed it!",
            body: () => "Here's your quick recipe:",
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Pattern: will + have + done-word", why: "e.g. 'will have finished', 'will have completed'" },
                  { text: "Trigger: 'by + future time'", why: "'By Friday', 'By next year', 'By the time...'" },
                  { text: "It means: completely DONE before the deadline", why: "Not just happening — finished!" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      },
      {
        id: "future-perfect-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to spot when a sentence needs 'will have' instead of just 'will'"
        ],
        variableSets: [
          {
            name: "Jake",
            scenario: "is checking his writing",
            sentence: "By the end of the week, I will finish my project.",
            mistake: "'Will finish' should be 'will have finished' because 'by the end of the week' tells us there's a deadline.",
            corrected: "By the end of the week, I will have finished my project.",
            intQuestion: "Which sentence is correct?",
            intOptions: ["By June, she will pass all her exams.", "By June, she will have passed all her exams.", "By June, she will had passed all her exams.", "By June, she will has passed all her exams.", "By June, she will been passed all her exams."],
            intCorrect: "By June, she will have passed all her exams.",
            intExplanation: "'By June' is the trigger — it tells us the exams need to be DONE by then, so it's 'will have passed'."
          },
          {
            name: "Grace",
            scenario: "found an error in her homework",
            sentence: "By next Monday, the builders will repair the roof.",
            mistake: "With 'by next Monday', we need 'will have repaired' to show the repair will be done before Monday.",
            corrected: "By next Monday, the builders will have repaired the roof.",
            intQuestion: "Which sentence is correct?",
            intOptions: ["By tonight, I will read three chapters.", "By tonight, I will have read three chapters.", "By tonight, I will had read three chapters.", "By tonight, I will has read three chapters.", "By tonight, I will reading three chapters."],
            intCorrect: "By tonight, I will have read three chapters.",
            intExplanation: "'By tonight' is the deadline trigger. 'Will have read' tells us the three chapters will be done by then."
          },
          {
            name: "Ben",
            scenario: "is practising for the exam",
            sentence: "By the time we get there, the show will start.",
            mistake: "'Will start' should be 'will have started' — 'by the time' tells us the show starts BEFORE we arrive.",
            corrected: "By the time we get there, the show will have started.",
            intQuestion: "Which sentence is correct?",
            intOptions: ["By 2030, scientists will discover a cure.", "By 2030, scientists will have discovered a cure.", "By 2030, scientists will had discovered a cure.", "By 2030, scientists will has discovered a cure.", "By 2030, scientists will discovering a cure."],
            intCorrect: "By 2030, scientists will have discovered a cure.",
            intExplanation: "'By 2030' is the future deadline. 'Will have discovered' means the discovery will be complete by then."
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Can you spot the mistake?",
            body: (v) => v.name + " " + v.scenario + ". Something isn't quite right:\n\n**\"" + v.sentence + "\"**",
            visual: { component: "SentenceDisplay", props: (v) => ({ sentence: v.sentence }) },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Here's the mistake",
            body: (v) => v.mistake,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: 'Wrong: "' + v.sentence + '"', why: v.mistake },
                  { text: 'Right: "' + v.corrected + '"', why: "Now it's clear the action is finished before the deadline" }
                ]
              })
            },
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => v.intQuestion,
            visual: { component: "WorkedExample", props: (v) => ({ steps: v.intOptions.map((o, i) => ({ text: (i+1) + ". " + o, why: "" })), allRevealed: true }) },
            interaction: {
              type: "multiple-choice",
              getOptions: (v) => v.intOptions,
              correctAnswer: (v) => v.intCorrect,
              feedback: {
                correct: (v) => "Superstar! " + v.intExplanation + " ✓",
                incorrect: (v) => "Nearly there! " + v.intExplanation
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Deadline detector — activated!",
            body: () => "Whenever you see 'by + future time', check if you need 'will have':",
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Spot the trigger: 'by Friday', 'by next year', 'by the time...'", why: "These all mean there's a deadline" },
                  { text: "Use: will + have + done-word", why: "'Will have finished', 'will have completed'" },
                  { text: "It means: completely DONE before the deadline", why: "That's the future perfect!" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          }
        ]
      }
    ]
  }

];
