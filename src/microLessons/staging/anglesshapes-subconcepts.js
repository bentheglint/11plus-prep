// Supplementary sub-concepts for Angles & Shapes
// To merge: add these to lessonBank.anglesshapes.subConcepts array in lessonData.js
import { generateDistractors } from '../lessonData.js';

export const anglesshapesSubConcepts = [
  // ==========================================
  // SUB-CONCEPT 1: Recognising Angle Types
  // ==========================================
  {
    id: "angle-types",
    name: "Recognising Angle Types",
    category: "core",
    lessons: [
      // ---- Lesson A: Visual Discovery ----
      {
        id: "angle-types-discovery",
        templateType: "visual-discovery",
        learningGoal: [
          "How to tell the difference between acute (less than 90°), right, obtuse (between 90° and 180°), straight, and reflex (more than 180°) angles",
          "Why the size of an angle matters, not the length of the lines"
        ],
        variableSets: [
          {
            name: "Ella",
            scenario: "is sorting angles she found in buildings around her town",
            acuteAngle: 35,
            rightAngle: 90,
            obtuseAngle: 120,
            straightAngle: 180,
            reflexAngle: 270,
            mysteryAngle: 35,
            mysteryType: "acute",
            mysteryReason: "less than 90°"
          },
          {
            name: "Oscar",
            scenario: "is measuring angles on road signs for a geography project",
            acuteAngle: 55,
            rightAngle: 90,
            obtuseAngle: 145,
            straightAngle: 180,
            reflexAngle: 300,
            mysteryAngle: 145,
            mysteryType: "obtuse",
            mysteryReason: "between 90° and 180°"
          },
          {
            name: "Priya",
            scenario: "is identifying angles in her school's playground markings",
            acuteAngle: 60,
            rightAngle: 90,
            obtuseAngle: 110,
            straightAngle: 180,
            reflexAngle: 250,
            mysteryAngle: 250,
            mysteryType: "reflex",
            mysteryReason: "greater than 180°"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "What type of angle is that?",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `${v.name} ${v.scenario}. Angles come in **five types** depending on their size. Can you spot the difference between them?`
              },
              {
                type: 'visual',
                component: 'AngleDisplay',
                props: (v) => ({
                  angles: [{ value: v.acuteAngle, label: `Acute: ${v.acuteAngle}°`, color: "#818cf8" }]
                })
              },
              {
                type: 'visual',
                component: 'AngleDisplay',
                props: (v) => ({
                  angles: [{ value: v.rightAngle, label: "Right: 90°", color: "#34d399" }]
                })
              },
              {
                type: 'visual',
                component: 'AngleDisplay',
                props: (v) => ({
                  angles: [{ value: v.obtuseAngle, label: `Obtuse: ${v.obtuseAngle}°`, color: "#f59e0b" }]
                })
              },
              {
                type: 'visual',
                component: 'AngleDisplay',
                props: (v) => ({
                  angles: [{ value: v.straightAngle, label: "Straight: 180°", color: "#38bdf8" }]
                })
              },
              {
                type: 'visual',
                component: 'AngleDisplay',
                props: (v) => ({
                  angles: [{ value: v.reflexAngle, label: `Reflex: ${v.reflexAngle}°`, color: "#f87171" }]
                })
              }
            ],
            visual: null,
            interaction: null
          },
          {
            type: "teach",
            title: () => "The five angle types",
            bodyParts: [
              {
                type: 'text',
                content: () => `Every angle fits into one of **five categories**. The key is knowing the **boundary numbers**: **90°**, **180°**, and **360°**.`
              },
              {
                type: 'visual',
                component: 'AngleDisplay',
                props: () => ({
                  angles: [{ value: 45, label: "Acute (< 90°)", color: "#818cf8" }]
                })
              },
              {
                type: 'visual',
                component: 'AngleDisplay',
                props: () => ({
                  angles: [{ value: 90, label: "Right (90°)", color: "#34d399" }]
                })
              },
              {
                type: 'visual',
                component: 'AngleDisplay',
                props: () => ({
                  angles: [{ value: 135, label: "Obtuse (90°-180°)", color: "#f59e0b" }]
                })
              },
              {
                type: 'visual',
                component: 'AngleDisplay',
                props: () => ({
                  angles: [{ value: 180, label: "Straight (180°)", color: "#38bdf8" }]
                })
              },
              {
                type: 'visual',
                component: 'AngleDisplay',
                props: () => ({
                  angles: [{ value: 270, label: "Reflex (> 180°)", color: "#f87171" }]
                })
              },
              {
                type: 'text',
                content: () => `Remember: the **length of the lines** doesn't matter. It's only the **amount of turn** between the lines that counts! ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "fill-blank",
              sentence: (v) => `An angle between 90° and 180° is called ____`,
              options: (v) => ["acute", "obtuse", "reflex", "right"],
              correctIndex: (v) => 1,
              feedback: {
                correct: (v) => `Yes! An angle between 90° and 180° is obtuse — wider than a right angle (an angle of exactly 90 degrees) but less than a straight line. ✓`,
                incorrect: (v) => `Not quite — an angle between 90° and 180° is obtuse. Acute is less than 90°, reflex is more than 180°.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `${v.name} found an angle of **${v.mysteryAngle}°**. What type of angle is it?`,
            visual: null,
            bodyParts: [
              {
                type: 'visual',
                component: 'AngleDisplay',
                props: (v) => ({
                  angles: [{ value: v.mysteryAngle, label: `${v.mysteryAngle}°`, color: "#818cf8" }]
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `The angle is ${v.mysteryAngle}°`, why: `Is it less than 90°? Between 90° and 180°? Or more than 180°?` }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: {
              type: "multiple-choice",
              question: (v) => `An angle of ${v.mysteryAngle}° is...`,
              getOptions: () => ["Acute", "Right", "Obtuse", "Straight", "Reflex"],
              correctAnswer: (v) => {
                if (v.mysteryType === "acute") return "Acute";
                if (v.mysteryType === "right") return "Right";
                if (v.mysteryType === "obtuse") return "Obtuse";
                if (v.mysteryType === "straight") return "Straight";
                return "Reflex";
              },
              feedback: {
                correct: (v) => `Spot on! ${v.mysteryAngle}° is **${v.mysteryType}** because it's ${v.mysteryReason}. ✓`,
                incorrect: (v) => `Not quite! ${v.mysteryAngle}° is **${v.mysteryType}** because it's ${v.mysteryReason}. Remember: acute < 90°, right = 90°, obtuse is 91°-179°, straight = 180°, reflex > 180°.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The angle type checklist!",
            bodyParts: [
              {
                type: 'text',
                content: () => `When you see an angle, ask yourself: **how big is it compared to 90° and 180°?**`
              },
              {
                type: 'visual',
                component: 'AngleDisplay',
                props: () => ({
                  angles: [{ value: 90, label: "Right: 90°", color: "#34d399" }]
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Is it less than 90°?", why: "Then it's ACUTE — a small, sharp angle." },
                    { text: "Is it exactly 90°?", why: "Then it's a RIGHT angle (an angle of exactly 90 degrees) — look for the square corner symbol." },
                    { text: "Is it between 90° and 180°?", why: "Then it's OBTUSE — wider than a right angle (an angle of exactly 90 degrees)." },
                    { text: "Is it exactly 180°?", why: "Then it's STRAIGHT — a flat line." },
                    { text: "Is it more than 180°?", why: "Then it's REFLEX — the big way round. ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            visual: null,
            interaction: null
          }
        ]
      },
      // ---- Lesson B: Key Fact ----
      {
        id: "angle-types-keyfact",
        templateType: "key-fact",
        learningGoal: [
          "How to classify any angle by comparing it to 90° and 180°",
          "Why reflex angles (angles bigger than 180°) are the ones people forget most often"
        ],
        variableSets: [
          {
            name: "Tom",
            scenario: "is labelling angles on a treasure map for a class project",
            testAngle: 72,
            testType: "acute",
            testReason: "it's less than 90°",
            secondAngle: 155,
            secondType: "obtuse"
          },
          {
            name: "Nadia",
            scenario: "is checking angles on a mosaic pattern in art class",
            testAngle: 210,
            testType: "reflex",
            testReason: "it's greater than 180°",
            secondAngle: 85,
            secondType: "acute"
          },
          {
            name: "Finn",
            scenario: "is measuring the angle a door makes when it opens",
            testAngle: 130,
            testType: "obtuse",
            testReason: "it's between 90° and 180°",
            secondAngle: 310,
            secondType: "reflex"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Quick — what type?",
            body: (v) => `${v.name} ${v.scenario}. One angle measures **${v.testAngle}°**. Can you name its type in under 5 seconds? The trick is knowing just **two key numbers**...`,
            visual: {
              component: "AngleDisplay",
              props: (v) => ({
                angles: [{ value: v.testAngle, label: `${v.testAngle}°`, color: "#818cf8" }]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The two magic numbers: 90° and 180°",
            bodyParts: [
              {
                type: 'text',
                content: () => `You only need **two numbers** to classify any angle:\n**90°** (a right angle (an angle of exactly 90 degrees)) and **180°** (a straight line).`
              },
              {
                type: 'visual',
                component: 'AngleDisplay',
                props: () => ({
                  angles: [{ value: 45, label: "Acute (45°)", color: "#818cf8" }]
                })
              },
              {
                type: 'text',
                content: () => `**Acute**: less than 90°`
              },
              {
                type: 'visual',
                component: 'AngleDisplay',
                props: () => ({
                  angles: [{ value: 90, label: "Right (90°)", color: "#38bdf8" }]
                })
              },
              {
                type: 'text',
                content: () => `**Right**: exactly 90°`
              },
              {
                type: 'visual',
                component: 'AngleDisplay',
                props: () => ({
                  angles: [{ value: 135, label: "Obtuse (135°)", color: "#fbbf24" }]
                })
              },
              {
                type: 'text',
                content: () => `**Obtuse**: between 90° and 180°`
              },
              {
                type: 'visual',
                component: 'AngleDisplay',
                props: () => ({
                  angles: [{ value: 250, label: "Reflex (250°)", color: "#f87171" }]
                })
              },
              {
                type: 'text',
                content: () => `**Reflex**: greater than 180°\n\nSo the **two magic numbers** are **90°** and **180°** — every angle type is defined by where it sits relative to these boundaries. ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `An angle of ${v.testAngle}° is ${v.testType}`, answer: true, explanation: `Correct — ${v.testAngle}° is ${v.testType} because ${v.testReason}. ✓` },
                { text: "A reflex angle (an angle greater than 180 degrees) is smaller than 180°", answer: false, explanation: "No! A reflex angle is greater than 180°. Angles between 90° and 180° are obtuse." },
                { text: "The length of the lines affects the angle type", answer: false, explanation: "No! Only the amount of turn between the lines matters, not their length." }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `${v.name} found another angle: **${v.secondAngle}°**. What type is it?`,
            visual: {
              component: "AngleDisplay",
              props: (v) => ({
                angles: [{ value: v.secondAngle, label: `${v.secondAngle}°`, color: "#818cf8" }]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What type of angle is ${v.secondAngle}°?`,
              getOptions: () => ["Acute", "Right", "Obtuse", "Straight", "Reflex"],
              correctAnswer: (v) => {
                if (v.secondType === "acute") return "Acute";
                if (v.secondType === "right") return "Right";
                if (v.secondType === "obtuse") return "Obtuse";
                if (v.secondType === "straight") return "Straight";
                return "Reflex";
              },
              feedback: {
                correct: (v) => `Well done! ${v.secondAngle}° is **${v.secondType}**. You nailed it! ✓`,
                incorrect: (v) => `Not quite! ${v.secondAngle}° is **${v.secondType}**. Check where it sits on the number line — is it before 90°, between 90° and 180°, or after 180°?`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Remember the number line!",
            bodyParts: [
              {
                type: 'text',
                content: () => `Picture all angles on a number line from **0° to 360°**. The two boundaries are **90°** and **180°**.`
              },
              {
                type: 'visual',
                component: 'AngleDisplay',
                props: () => ({
                  angles: [{ value: 120, label: "Obtuse: 120°", color: "#f59e0b" }]
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Less than 90° → Acute", why: "A cute little angle — small and sharp." },
                    { text: "Exactly 90° → Right angle (an angle of exactly 90 degrees)", why: "A perfect corner, marked with a small square." },
                    { text: "Between 90° and 180° → Obtuse", why: "Wider than a right angle (an angle of exactly 90 degrees) but not flat yet." },
                    { text: "Exactly 180° → Straight", why: "A flat line — half a full turn." },
                    { text: "Between 180° and 360° → Reflex", why: "The big way round — more than half a turn. ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            visual: null,
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 2: Angles on a Straight Line
  // ==========================================
  {
    id: "straight-line",
    name: "Angles on a Straight Line = 180°",
    category: "core",
    lessons: [
      // ---- Lesson A: Step-by-Step ----
      {
        id: "straight-line-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to find a missing angle on a straight line",
          "Why angles on a straight line always add up to 180°"
        ],
        variableSets: [
          {
            name: "Grace",
            scenario: "is measuring angles where two paths meet at a crossroads",
            knownAngle: 65,
            missingAngle: 115,
            interactKnownAngle: 72,
            interactMissingAngle: 108
          },
          {
            name: "Isaac",
            scenario: "is working out the angle a ramp makes with the ground",
            knownAngle: 130,
            missingAngle: 50,
            interactKnownAngle: 145,
            interactMissingAngle: 35
          },
          {
            name: "Holly",
            scenario: "is finding the missing angle where a wall meets a sloped roof",
            knownAngle: 42,
            missingAngle: 138,
            interactKnownAngle: 57,
            interactMissingAngle: 123
          },
          {
            name: "Ravi",
            scenario: "is calculating angles on a clock face where the hands form a straight line",
            knownAngle: 110,
            missingAngle: 70,
            interactKnownAngle: 95,
            interactMissingAngle: 85
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What's the missing angle?`,
            body: (v) => `${v.name} ${v.scenario}. One angle is **${v.knownAngle}°** and the other sits on the same **straight line**. What could the missing angle be?`,
            visual: {
              component: "AngleDisplay",
              props: (v) => ({
                angles: [
                  { value: v.knownAngle, label: `${v.knownAngle}°`, color: "#818cf8" },
                  { value: v.missingAngle, label: "?°", color: "#d1d5db" }
                ]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Angles on a straight line add up to 180°",
            bodyParts: [
              {
                type: 'text',
                content: () => `A **straight line** is really an angle of **180°**. If a line divides that straight angle into two parts, those two parts must add up to **180°**.`
              },
              {
                type: 'visual',
                component: 'AngleDisplay',
                props: (v) => ({
                  angles: [
                    { value: v.knownAngle, label: `${v.knownAngle}°`, color: "#818cf8" },
                    { value: v.missingAngle, label: "?°", color: "#d1d5db" }
                  ]
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: "Rule: angles on a straight line = 180°", why: "This works for two angles, three angles, or more!" },
                    { text: `Known angle: ${v.knownAngle}°`, result: `${v.knownAngle}°` },
                    { text: `Missing angle: 180° − ${v.knownAngle}°`, result: `= ${v.missingAngle}°` }
                  ],
                  allRevealed: true
                })
              },
              {
                type: 'text',
                content: (v) => `**180° − ${v.knownAngle}° = ${v.missingAngle}°**. The missing angle is **${v.missingAngle}°**! ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Spot that the angles are on a straight line`,
                `Write the known angle: ${v.knownAngle}°`,
                `Subtract from 180°: 180° − ${v.knownAngle}° = ${v.missingAngle}°`
              ],
              feedback: {
                correct: (v) => `Perfect order! Spot the line, note the known angle, subtract from 180°. ✓`,
                incorrect: (v) => `Not quite — first spot it's a straight line, then note the known angle, then subtract from 180°.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `${v.name} ${v.scenario}. One angle is **${v.interactKnownAngle}°**. What is the other angle on the straight line?`,
            visual: {
              component: "AngleDisplay",
              props: (v) => ({
                angles: [
                  { value: v.interactKnownAngle, label: `${v.interactKnownAngle}°`, color: "#818cf8" },
                  { value: v.interactMissingAngle, label: "?°", color: "#d1d5db" }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the missing angle?`,
              getOptions: (v) => generateDistractors(v.interactMissingAngle),
              correctAnswer: (v) => v.interactMissingAngle,
              feedback: {
                correct: (v) => `Brilliant! **180° − ${v.interactKnownAngle}° = ${v.interactMissingAngle}°**. ✓`,
                incorrect: (v) => `Not quite! Angles on a straight line add up to 180°. So the missing angle is 180° − ${v.interactKnownAngle}° = **${v.interactMissingAngle}°**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The straight line rule!",
            bodyParts: [
              {
                type: 'text',
                content: () => `Whenever angles sit on a **straight line**, they add up to **180°**.`
              },
              {
                type: 'visual',
                component: 'AngleDisplay',
                props: () => ({
                  angles: [
                    { value: 115, label: "115°", color: "#818cf8" },
                    { value: 65, label: "65°", color: "#38bdf8" }
                  ]
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Step 1: Spot that the angles are on a straight line", why: "Look for angles that share a flat base line." },
                    { text: "Step 2: Add up all the angles you know", why: "There might be two, three, or more angles on the line." },
                    { text: "Step 3: Subtract from 180°", why: "The leftover is the missing angle. ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            visual: null,
            interaction: null
          }
        ]
      },
      // ---- Lesson B: Spot the Mistake ----
      {
        id: "straight-line-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid confusing 180° with 360° on straight line questions",
          "Why checking your answer matters"
        ],
        variableSets: [
          {
            name: "Charlie",
            scenario: "is finding the missing angle on a straight line where one angle is 75°",
            knownAngle: 75,
            wrongAnswer: 285,
            wrongReason: "subtracted from 360° instead of 180°",
            correctAnswer: 105,
            interactKnownAngle: 83,
            interactCorrectAnswer: 97
          },
          {
            name: "Daisy",
            scenario: "is working out the angle where a fence meets a wall in a straight line, with one angle of 118°",
            knownAngle: 118,
            wrongAnswer: 242,
            wrongReason: "subtracted from 360° instead of 180°",
            correctAnswer: 62,
            interactKnownAngle: 124,
            interactCorrectAnswer: 56
          },
          {
            name: "Jake",
            scenario: "is calculating the missing angle on a straight line where one angle is 53°",
            knownAngle: 53,
            wrongAnswer: 307,
            wrongReason: "subtracted from 360° instead of 180°",
            correctAnswer: 127,
            interactKnownAngle: 47,
            interactCorrectAnswer: 133
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Can you spot the mistake?",
            body: (v) => `${v.name} ${v.scenario}. ${v.name} wrote: "360° − ${v.knownAngle}° = **${v.wrongAnswer}°**". Something's gone wrong. Can you see it?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.name}'s working:`, why: "" },
                  { text: `360° − ${v.knownAngle}° = ${v.wrongAnswer}°`, why: "Does this look right to you?" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The mistake: using 360° instead of 180°",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `${v.name} ${v.wrongReason}!\n\nAngles **around a point** add up to 360°.\nBut angles **on a straight line** add up to **180°**.\nThese are different rules — don't mix them up!`
              },
              {
                type: 'visual',
                component: 'AngleDisplay',
                props: (v) => ({
                  angles: [
                    { value: v.knownAngle, label: `${v.knownAngle}°`, color: "#818cf8" },
                    { value: v.correctAnswer, label: `${v.correctAnswer}°`, color: "#34d399" }
                  ]
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Wrong: 360° − ${v.knownAngle}° = ${v.wrongAnswer}°`, why: "360° is for angles around a POINT, not a line!" },
                    { text: `Right: 180° − ${v.knownAngle}° = ${v.correctAnswer}°`, why: "180° is the rule for a STRAIGHT LINE. ✓" }
                  ],
                  allRevealed: false
                })
              },
              {
                type: 'text',
                content: (v) => `The correct answer is **${v.correctAnswer}°**, not ${v.wrongAnswer}°. Always check: is it a **line** (180°) or a **point** (360°)? ✓`
              }
            ],
            visual: null,
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `The angle on a straight line is **${v.interactKnownAngle}°**. What is the missing angle?`,
            visual: {
              component: "AngleDisplay",
              props: (v) => ({
                angles: [
                  { value: v.interactKnownAngle, label: `${v.interactKnownAngle}°`, color: "#818cf8" },
                  { value: v.interactCorrectAnswer, label: "?°", color: "#d1d5db" }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the missing angle on the straight line?`,
              getOptions: (v) => generateDistractors(v.interactCorrectAnswer),
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Yes! **180° − ${v.interactKnownAngle}° = ${v.interactCorrectAnswer}°**. You used the right rule! ✓`,
                incorrect: (v) => `Not quite! Remember: straight line = 180°. So 180° − ${v.interactKnownAngle}° = **${v.interactCorrectAnswer}°**. Don't use 360° here!`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Don't mix up 180° and 360°!",
            bodyParts: [
              {
                type: 'text',
                content: () => `This is one of the most common mistakes in angle questions. Here's how to avoid it:`
              },
              {
                type: 'visual',
                component: 'AngleDisplay',
                props: () => ({
                  angles: [
                    { value: 130, label: "130°", color: "#818cf8" },
                    { value: 50, label: "50°", color: "#38bdf8" }
                  ]
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Straight LINE → angles add to 180°", why: "A straight line is half a full turn." },
                    { text: "Around a POINT → angles add to 360°", why: "A full turn all the way round is 360°." },
                    { text: "Quick check: is your answer sensible?", why: "An angle on a straight line should be less than 180°. ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            visual: null,
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 3: Angles Around a Point
  // ==========================================
  {
    id: "around-a-point",
    name: "Angles Around a Point = 360°",
    category: "core",
    lessons: [
      // ---- Lesson A: Step-by-Step ----
      {
        id: "around-a-point-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to find a missing angle around a point",
          "Why angles around a point always add up to 360°"
        ],
        variableSets: [
          {
            name: "Sophie",
            scenario: "is measuring angles where four roads meet at a roundabout",
            angles: [90, 120, 80],
            knownSum: 290,
            missingAngle: 70,
            interactAngles: [105, 95, 85],
            interactKnownSum: 285,
            interactMissingAngle: 75
          },
          {
            name: "Ben",
            scenario: "is working out the missing angle on a pie chart for his science project",
            angles: [150, 100, 60],
            knownSum: 310,
            missingAngle: 50,
            interactAngles: [140, 110, 50],
            interactKnownSum: 300,
            interactMissingAngle: 60
          },
          {
            name: "Lily",
            scenario: "is calculating angles formed by paths crossing in a park",
            angles: [85, 95, 110],
            knownSum: 290,
            missingAngle: 70,
            interactAngles: [100, 80, 90],
            interactKnownSum: 270,
            interactMissingAngle: 90
          },
          {
            name: "Marcus",
            scenario: "is finding the missing angle where three lines meet at a point",
            angles: [130, 75, 55],
            knownSum: 260,
            missingAngle: 100,
            interactAngles: [115, 85, 70],
            interactKnownSum: 270,
            interactMissingAngle: 90
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Find the missing angle!",
            body: (v) => `${v.name} ${v.scenario}. The known angles are **${v.angles.join('°, ')}°**. There's one angle missing — and there's a simple rule to find it!`,
            visual: {
              component: "AngleDisplay",
              props: (v) => ({
                angles: [
                  ...v.angles.map((a, i) => ({ value: a, label: `${a}°`, color: ['#818cf8', '#38bdf8', '#c084fc'][i] })),
                  { value: v.missingAngle, label: "?°", color: "#d1d5db" }
                ]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Angles around a point add up to 360°",
            bodyParts: [
              {
                type: 'text',
                content: () => `A full turn is **360°**. When angles meet at a **single point**, they fill the full turn, so they must add up to **360°**.`
              },
              {
                type: 'visual',
                component: 'AngleDisplay',
                props: (v) => ({
                  angles: [
                    ...v.angles.map((a, i) => ({ value: a, label: `${a}°`, color: ['#818cf8', '#38bdf8', '#c084fc'][i] })),
                    { value: v.missingAngle, label: "?°", color: "#d1d5db" }
                  ]
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: "Rule: angles around a point = 360°", why: "A full turn is 360°." },
                    { text: `Add the known angles: ${v.angles.join('° + ')}°`, result: `= ${v.knownSum}°` },
                    { text: `Missing angle: 360° − ${v.knownSum}°`, result: `= ${v.missingAngle}°` }
                  ],
                  allRevealed: false
                })
              },
              {
                type: 'text',
                content: (v) => `**360° − ${v.knownSum}° = ${v.missingAngle}°**. The missing angle is **${v.missingAngle}°**! ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "Straight line", right: "180°" },
                { left: "Around a point", right: "360°" },
                { left: "Full turn", right: "All the way round" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `${v.name} ${v.scenario}. The known angles are **${v.interactAngles.join('°, ')}°**. What is the missing angle?`,
            visual: {
              component: "AngleDisplay",
              props: (v) => ({
                angles: [
                  ...v.interactAngles.map((a, i) => ({ value: a, label: `${a}°`, color: ['#818cf8', '#38bdf8', '#c084fc'][i] })),
                  { value: v.interactMissingAngle, label: "?°", color: "#d1d5db" }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: () => `What is the missing angle?`,
              getOptions: (v) => generateDistractors(v.interactMissingAngle),
              correctAnswer: (v) => v.interactMissingAngle,
              feedback: {
                correct: (v) => `Spot on! **360° − ${v.interactKnownSum}° = ${v.interactMissingAngle}°**. ✓`,
                incorrect: (v) => `Not quite! Add the known angles: ${v.interactAngles.join('° + ')}° = ${v.interactKnownSum}°. Then subtract from 360°: 360° − ${v.interactKnownSum}° = **${v.interactMissingAngle}°**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The full-turn rule!",
            bodyParts: [
              {
                type: 'text',
                content: () => `Whenever angles meet **at a point**, they make a **full turn** of 360°.`
              },
              {
                type: 'visual',
                component: 'AngleDisplay',
                props: () => ({
                  angles: [
                    { value: 90, label: "90°", color: "#818cf8" },
                    { value: 120, label: "120°", color: "#38bdf8" },
                    { value: 150, label: "150°", color: "#c084fc" }
                  ]
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Step 1: Spot that angles are around a point", why: "All the angles share the same centre point." },
                    { text: "Step 2: Add up all the known angles", why: "You might need to add two, three, or more." },
                    { text: "Step 3: Subtract from 360°", why: "The leftover is the missing angle. ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            visual: null,
            interaction: null
          }
        ]
      },
      // ---- Lesson B: Spot the Mistake ----
      {
        id: "around-a-point-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid using 180° when you need 360°",
          "When to use the 'around a point' rule versus the 'straight line' rule"
        ],
        variableSets: [
          {
            name: "Aisha",
            scenario: "is finding the missing angle at a point where angles are 140°, 95°, and ?°",
            angles: [140, 95],
            knownSum: 235,
            wrongAnswer: -55,
            wrongDisplay: "180° − 235° = can't do it!",
            wrongReason: "tried to use 180° (the straight line rule) instead of 360°",
            correctAnswer: 125,
            interactAngles: [130, 100],
            interactKnownSum: 230,
            interactCorrectAnswer: 130
          },
          {
            name: "Finn",
            scenario: "is calculating the missing angle at a point where angles are 80°, 110°, and 65°",
            angles: [80, 110, 65],
            knownSum: 255,
            wrongAnswer: -75,
            wrongDisplay: "180° − 255° = impossible!",
            wrongReason: "tried to subtract from 180° instead of 360°",
            correctAnswer: 105,
            interactAngles: [90, 100, 75],
            interactKnownSum: 265,
            interactCorrectAnswer: 95
          },
          {
            name: "Holly",
            scenario: "is finding the missing angle where three arrows meet: 90°, 150°, and ?°",
            angles: [90, 150],
            knownSum: 240,
            wrongAnswer: -60,
            wrongDisplay: "180° − 240° = negative!",
            wrongReason: "used 180° (straight line rule) instead of 360° (around a point)",
            correctAnswer: 120,
            interactAngles: [85, 160],
            interactKnownSum: 245,
            interactCorrectAnswer: 115
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Spot the mistake!",
            body: (v) => `${v.name} ${v.scenario}. ${v.name} wrote: "${v.wrongDisplay}"\nThey're stuck — the number went negative! What went wrong?`,
            visual: {
              component: "AngleDisplay",
              props: (v) => ({
                angles: [
                  ...v.angles.map((a, i) => ({ value: a, label: `${a}°`, color: ['#818cf8', '#38bdf8'][i] })),
                  { value: v.correctAnswer, label: "?°", color: "#d1d5db" }
                ]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Wrong rule! Use 360°, not 180°!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `${v.name} ${v.wrongReason}.\n\nThe angles are **around a point**, not on a straight line. So the total is **360°**, not 180°!`
              },
              {
                type: 'visual',
                component: 'AngleDisplay',
                props: (v) => ({
                  angles: [
                    ...v.angles.map((a, i) => ({ value: a, label: `${a}°`, color: ['#818cf8', '#38bdf8'][i] })),
                    { value: v.correctAnswer, label: `${v.correctAnswer}°`, color: "#34d399" }
                  ]
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Wrong rule: 180° − ${v.knownSum}° = impossible!`, why: "180° is only for straight lines!" },
                    { text: `Right rule: 360° − ${v.knownSum}° = ${v.correctAnswer}°`, why: "360° is for angles around a point. ✓" }
                  ],
                  allRevealed: false
                })
              },
              {
                type: 'text',
                content: (v) => `The correct answer is **${v.correctAnswer}°**. If subtracting from 180° gives a negative number, you probably need 360°! ✓`
              }
            ],
            visual: null,
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `The angles around a point are **${v.interactAngles.join('°, ')}°** and **?°**. What is the missing angle?`,
            visual: {
              component: "AngleDisplay",
              props: (v) => ({
                angles: [
                  ...v.interactAngles.map((a, i) => ({ value: a, label: `${a}°`, color: ['#818cf8', '#38bdf8', '#c084fc'][i] })),
                  { value: v.interactCorrectAnswer, label: "?°", color: "#d1d5db" }
                ]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: () => `What is the missing angle around the point?`,
              getOptions: (v) => generateDistractors(v.interactCorrectAnswer),
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Brilliant! **360° − ${v.interactKnownSum}° = ${v.interactCorrectAnswer}°**. You used the right rule! ✓`,
                incorrect: (v) => `Not quite! These angles are around a POINT, so use 360°. 360° − ${v.interactKnownSum}° = **${v.interactCorrectAnswer}°**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Straight line or around a point?",
            bodyParts: [
              {
                type: 'text',
                content: () => `The **most common mistake** is mixing up these two rules. Here's how to tell them apart:`
              },
              {
                type: 'visual',
                component: 'AngleDisplay',
                props: () => ({
                  angles: [
                    { value: 140, label: "140°", color: "#818cf8" },
                    { value: 95, label: "95°", color: "#38bdf8" },
                    { value: 125, label: "125°", color: "#c084fc" }
                  ]
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Angles on a STRAIGHT LINE → 180°", why: "The angles sit on a flat line (half turn)." },
                    { text: "Angles AROUND A POINT → 360°", why: "The angles go all the way round (full turn)." },
                    { text: "Top tip: if 180° gives a negative answer...", why: "...you probably need 360° instead! ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            visual: null,
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 4: Quadrilateral Angles
  // ==========================================
  {
    id: "quadrilateral-angles",
    name: "Angles in a Quadrilateral = 360°",
    category: "core",
    lessons: [
      // ---- Lesson A: Step-by-Step ----
      {
        id: "quadrilateral-angles-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to find a missing angle in a quadrilateral (a four-sided shape)",
          "Why the four angles in any quadrilateral add up to 360°"
        ],
        variableSets: [
          {
            name: "Tom",
            scenario: "is measuring angles on a rectangular picture frame that got squashed",
            angle1: 90,
            angle2: 110,
            angle3: 80,
            knownSum: 280,
            missingAngle: 80,
            shape: "quadrilateral",
            interactAngle1: 85,
            interactAngle2: 105,
            interactAngle3: 95,
            interactKnownSum: 285,
            interactMissingAngle: 75
          },
          {
            name: "Nadia",
            scenario: "is calculating angles on a kite she's building for a spring fair",
            angle1: 70,
            angle2: 120,
            angle3: 70,
            knownSum: 260,
            missingAngle: 100,
            shape: "kite",
            interactAngle1: 80,
            interactAngle2: 110,
            interactAngle3: 80,
            interactKnownSum: 270,
            interactMissingAngle: 90
          },
          {
            name: "Isaac",
            scenario: "is finding the missing angle on a trapezium in his textbook",
            angle1: 65,
            angle2: 115,
            angle3: 115,
            knownSum: 295,
            missingAngle: 65,
            shape: "trapezium",
            interactAngle1: 75,
            interactAngle2: 105,
            interactAngle3: 105,
            interactKnownSum: 285,
            interactMissingAngle: 75
          },
          {
            name: "Grace",
            scenario: "is working out angles on a parallelogram-shaped tile pattern",
            angle1: 60,
            angle2: 120,
            angle3: 60,
            knownSum: 240,
            missingAngle: 120,
            shape: "parallelogram",
            interactAngle1: 55,
            interactAngle2: 125,
            interactAngle3: 55,
            interactKnownSum: 235,
            interactMissingAngle: 125
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `Find the missing angle in the ${v.shape}!`,
            body: (v) => `${v.name} ${v.scenario}. Three angles are **${v.angle1}°**, **${v.angle2}°**, and **${v.angle3}°**. What's the fourth angle?`,
            visual: {
              component: "QuadShape",
              props: (v) => ({
                angles: [v.angle1, v.angle2, v.angle3, v.missingAngle],
                labels: [`${v.angle1}°`, `${v.angle2}°`, `${v.angle3}°`, "?°"],
                colors: ["#818cf8", "#38bdf8", "#c084fc", "#d1d5db"]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Angles in a quadrilateral add up to 360°",
            bodyParts: [
              {
                type: 'text',
                content: () => `A **quadrilateral** is any shape with four sides. The four angles **always** add up to **360°**.\n\nWhy? Because you can split any quadrilateral into **two triangles**, and 2 × 180° = 360°!`
              },
              {
                type: 'visual',
                component: 'QuadShape',
                props: (v) => ({
                  angles: [v.angle1, v.angle2, v.angle3, v.missingAngle],
                  labels: [`${v.angle1}°`, `${v.angle2}°`, `${v.angle3}°`, "?°"],
                  colors: ["#818cf8", "#38bdf8", "#c084fc", "#d1d5db"]
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: "Rule: angles in a quadrilateral = 360°", why: "Two triangles = 2 × 180° = 360°" },
                    { text: `Add the three known angles: ${v.angle1}° + ${v.angle2}° + ${v.angle3}°`, result: `= ${v.knownSum}°` },
                    { text: `Missing angle: 360° − ${v.knownSum}°`, result: `= ${v.missingAngle}°` }
                  ],
                  allRevealed: true
                })
              },
              {
                type: 'text',
                content: (v) => `**360° − ${v.knownSum}° = ${v.missingAngle}°**. The missing angle is **${v.missingAngle}°**! ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Add the known angles: ${v.angle1}° + ${v.angle2}° + ${v.angle3}° = ${v.knownSum}°`,
                `Remember: quadrilateral angles total 360°`,
                `Subtract: 360° − ${v.knownSum}° = ${v.missingAngle}°`
              ],
              feedback: {
                correct: (v) => `Perfect order! Add the known angles, recall the 360° total, then subtract. ✓`,
                incorrect: (v) => `Not quite — first add the known angles, then remember they total 360°, then subtract.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Three angles in the ${v.shape} are **${v.interactAngle1}°**, **${v.interactAngle2}°**, and **${v.interactAngle3}°**. What is the fourth angle?`,
            visual: {
              component: "QuadShape",
              props: (v) => ({
                angles: [v.interactAngle1, v.interactAngle2, v.interactAngle3, v.interactMissingAngle],
                labels: [`${v.interactAngle1}°`, `${v.interactAngle2}°`, `${v.interactAngle3}°`, "?°"],
                colors: ["#818cf8", "#38bdf8", "#c084fc", "#d1d5db"]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: () => `What is the missing angle?`,
              getOptions: (v) => generateDistractors(v.interactMissingAngle),
              correctAnswer: (v) => v.interactMissingAngle,
              feedback: {
                correct: (v) => `Brilliant! **360° − ${v.interactKnownSum}° = ${v.interactMissingAngle}°**. ✓`,
                incorrect: (v) => `Not quite! Add the three angles: ${v.interactAngle1}° + ${v.interactAngle2}° + ${v.interactAngle3}° = ${v.interactKnownSum}°. Then 360° − ${v.interactKnownSum}° = **${v.interactMissingAngle}°**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The quadrilateral rule!",
            bodyParts: [
              {
                type: 'text',
                content: () => `Any four-sided shape — rectangle, square, parallelogram, trapezium, kite — the angles add to **360°**.`
              },
              {
                type: 'visual',
                component: 'QuadShape',
                props: () => ({
                  angles: [90, 110, 80, 80],
                  labels: ["90°", "110°", "80°", "?°"],
                  colors: ["#818cf8", "#38bdf8", "#c084fc", "#d1d5db"]
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Step 1: Add all the known angles", why: "You'll usually know three out of four." },
                    { text: "Step 2: Subtract from 360°", why: "Quadrilateral angles always total 360°." },
                    { text: "Check: do all four angles add to 360°?", why: "If they don't, recheck your addition! ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            visual: null,
            interaction: null
          }
        ]
      },
      // ---- Lesson B: Spot the Mistake ----
      {
        id: "quadrilateral-angles-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid using 180° for quadrilaterals (four-sided shapes)",
          "Why a quadrilateral is not the same as a triangle"
        ],
        variableSets: [
          {
            name: "Oscar",
            scenario: "is finding the fourth angle of a quadrilateral with angles 85°, 100°, and 90°",
            angle1: 85,
            angle2: 100,
            angle3: 90,
            knownSum: 275,
            wrongAnswer: -95,
            wrongReason: "used 180° (the triangle rule) instead of 360°",
            correctAnswer: 85,
            interactAngle1: 95,
            interactAngle2: 80,
            interactAngle3: 110,
            interactKnownSum: 285,
            interactCorrectAnswer: 75
          },
          {
            name: "Ella",
            scenario: "is working out the missing angle of a quadrilateral with angles 110°, 95°, and 70°",
            angle1: 110,
            angle2: 95,
            angle3: 70,
            knownSum: 275,
            wrongAnswer: -95,
            wrongReason: "used the triangle rule (180°) for a four-sided shape",
            correctAnswer: 85,
            interactAngle1: 100,
            interactAngle2: 85,
            interactAngle3: 75,
            interactKnownSum: 260,
            interactCorrectAnswer: 100
          },
          {
            name: "Ravi",
            scenario: "is calculating the missing angle with known angles 75°, 130°, and 60°",
            angle1: 75,
            angle2: 130,
            angle3: 60,
            knownSum: 265,
            wrongAnswer: -85,
            wrongReason: "subtracted from 180° instead of 360°",
            correctAnswer: 95,
            interactAngle1: 80,
            interactAngle2: 120,
            interactAngle3: 65,
            interactKnownSum: 265,
            interactCorrectAnswer: 95
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "What went wrong?",
            body: (v) => `${v.name} ${v.scenario}. They wrote: "180° − ${v.knownSum}° = impossible!"\nThe answer came out negative. Can you spot the mistake?`,
            visual: {
              component: "QuadShape",
              props: (v) => ({
                angles: [v.angle1, v.angle2, v.angle3, v.correctAnswer],
                labels: [`${v.angle1}°`, `${v.angle2}°`, `${v.angle3}°`, "?°"],
                colors: ["#818cf8", "#38bdf8", "#c084fc", "#d1d5db"]
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Triangles use 180°, quadrilaterals use 360°!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `${v.name} ${v.wrongReason}.\n\nA **triangle** has three sides → angles add to **180°**.\nA **quadrilateral** has four sides → angles add to **360°**.`
              },
              {
                type: 'visual',
                component: 'QuadShape',
                props: (v) => ({
                  angles: [v.angle1, v.angle2, v.angle3, v.correctAnswer],
                  labels: [`${v.angle1}°`, `${v.angle2}°`, `${v.angle3}°`, `${v.correctAnswer}°`],
                  colors: ["#818cf8", "#38bdf8", "#c084fc", "#34d399"]
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: "Triangle (3 sides) → 180°", why: "One triangle = 180°" },
                    { text: "Quadrilateral (4 sides) → 360°", why: "Two triangles = 360°" },
                    { text: `Correct: 360° − ${v.knownSum}° = ${v.correctAnswer}°`, why: "Using the right rule gives a sensible answer! ✓" }
                  ],
                  allRevealed: false
                })
              },
              {
                type: 'text',
                content: (v) => `Always count the **number of sides** first. Four sides means **360°**! ✓`
              }
            ],
            visual: null,
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Three angles in a quadrilateral are **${v.interactAngle1}°**, **${v.interactAngle2}°**, and **${v.interactAngle3}°**. What is the fourth?`,
            visual: {
              component: "QuadShape",
              props: (v) => ({
                angles: [v.interactAngle1, v.interactAngle2, v.interactAngle3, v.interactCorrectAnswer],
                labels: [`${v.interactAngle1}°`, `${v.interactAngle2}°`, `${v.interactAngle3}°`, "?°"],
                colors: ["#818cf8", "#38bdf8", "#c084fc", "#d1d5db"]
              })
            },
            interaction: {
              type: "multiple-choice",
              question: () => `What is the missing angle?`,
              getOptions: (v) => generateDistractors(v.interactCorrectAnswer),
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Yes! **360° − ${v.interactKnownSum}° = ${v.interactCorrectAnswer}°**. ✓`,
                incorrect: (v) => `Not quite! Quadrilateral = 360°. So 360° − ${v.interactKnownSum}° = **${v.interactCorrectAnswer}°**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Count the sides first!",
            bodyParts: [
              {
                type: 'text',
                content: () => `Before subtracting, always count the sides of the shape:`
              },
              {
                type: 'visual',
                component: 'QuadShape',
                props: () => ({
                  angles: [75, 130, 60, 95],
                  labels: ["75°", "130°", "60°", "?°"],
                  colors: ["#818cf8", "#38bdf8", "#c084fc", "#d1d5db"]
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "3 sides (triangle) → subtract from 180°", why: "One triangle = 180°" },
                    { text: "4 sides (quadrilateral) → subtract from 360°", why: "Two triangles = 2 × 180° = 360°" },
                    { text: "If you get a negative number, check the total!", why: "You've probably used the wrong rule. ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            visual: null,
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 5: Isosceles Triangle
  // ==========================================
  {
    id: "isosceles-triangle",
    name: "Isosceles Triangle — Two Equal Angles",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Curiosity Hook ----
      {
        id: "isosceles-triangle-curiosity",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to spot an isosceles triangle (a triangle with two equal sides) from the tick marks",
          "Why two equal sides means two equal angles"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "is building a symmetrical arch for a school play set",
            topAngle: 40,
            baseAngle: 70,
            baseAngleCalc: "(180 − 40) ÷ 2 = 70",
            interactTopAngle: 60,
            interactBaseAngle: 60
          },
          {
            name: "Charlie",
            scenario: "is designing a pennant flag for sports day",
            topAngle: 80,
            baseAngle: 50,
            baseAngleCalc: "(180 − 80) ÷ 2 = 50",
            interactTopAngle: 50,
            interactBaseAngle: 65
          },
          {
            name: "Priya",
            scenario: "is drawing an isosceles triangle for her maths homework",
            topAngle: 100,
            baseAngle: 40,
            baseAngleCalc: "(180 − 100) ÷ 2 = 40",
            interactTopAngle: 80,
            interactBaseAngle: 50
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Two sides the same — what does that mean?",
            body: (v) => `${v.name} ${v.scenario}. The triangle has **two equal sides** (shown by tick marks). The top angle is **${v.topAngle}°**. Can you guess the two base angles without measuring?`,
            visual: {
              component: "AngleDiagram",
              props: (v) => ({
                angle1: v.topAngle,
                angle2: v.baseAngle,
                angle3: v.baseAngle,
                showAngle2: false,
                showAngle3: false,
                totalLabel: "Total: 180°"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Equal sides = equal angles!",
            bodyParts: [
              {
                type: 'text',
                content: () => `In an isosceles (a triangle with exactly two equal sides) triangle, two sides are the same length. The angles **opposite** those equal sides are also **equal**.\n\nSo if you know the odd angle, you can find the other two!`
              },
              {
                type: 'visual',
                component: 'AngleDiagram',
                props: (v) => ({
                  angle1: v.topAngle,
                  angle2: v.baseAngle,
                  angle3: v.baseAngle,
                  totalLabel: "Total: 180°"
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: "Angles in a triangle = 180°", why: "The golden rule still applies!" },
                    { text: `Subtract the known angle: 180° − ${v.topAngle}°`, result: `= ${180 - v.topAngle}°` },
                    { text: `Divide by 2 (two equal angles): ${180 - v.topAngle}° ÷ 2`, result: `= ${v.baseAngle}°` }
                  ],
                  allRevealed: true
                })
              },
              {
                type: 'text',
                content: (v) => `Each base angle is **${v.baseAngle}°**. Check: ${v.topAngle}° + ${v.baseAngle}° + ${v.baseAngle}° = **180°** ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "fill-blank",
              sentence: (v) => `In an isosceles triangle, two equal sides means two ____ angles`,
              options: (v) => ["different", "right", "equal", "obtuse"],
              correctIndex: (v) => 2,
              feedback: {
                correct: (v) => `Yes! Equal sides always means equal angles opposite them. ✓`,
                incorrect: (v) => `Not quite — in an isosceles triangle, the two sides that are equal have equal angles opposite them.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `An isosceles triangle has a top angle of **${v.interactTopAngle}°**. What is each base angle?`,
            visual: {
              component: "AngleDiagram",
              props: (v) => ({
                angle1: v.interactTopAngle,
                angle2: v.interactBaseAngle,
                angle3: v.interactBaseAngle,
                showAngle2: false,
                showAngle3: false,
                totalLabel: "Total: 180°"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is each base angle?`,
              getOptions: (v) => generateDistractors(v.interactBaseAngle),
              correctAnswer: (v) => v.interactBaseAngle,
              feedback: {
                correct: (v) => `Brilliant! (180° − ${v.interactTopAngle}°) ÷ 2 = **${v.interactBaseAngle}°**. ✓`,
                incorrect: (v) => `Not quite! Subtract the top angle from 180°: 180° − ${v.interactTopAngle}° = ${180 - v.interactTopAngle}°. Then divide by 2: ${180 - v.interactTopAngle}° ÷ 2 = **${v.interactBaseAngle}°**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The isosceles shortcut!",
            bodyParts: [
              {
                type: 'text',
                content: () => `Whenever you spot an **isosceles triangle** (two equal sides or tick marks), use this method:`
              },
              {
                type: 'visual',
                component: 'AngleDiagram',
                props: () => ({
                  angle1: 40,
                  angle2: 70,
                  angle3: 70,
                  totalLabel: "Total: 180°"
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Step 1: Subtract the odd angle from 180°", why: "This tells you the total of the two equal angles." },
                    { text: "Step 2: Divide the result by 2", why: "Both base angles are the same, so split equally." },
                    { text: "Check: all three angles add to 180°", why: "The odd angle + both base angles should equal 180°. ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            visual: null,
            interaction: null
          }
        ]
      },
      // ---- Lesson B: Spot the Mistake ----
      {
        id: "isosceles-triangle-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid forgetting to divide by 2 in isosceles (two equal sides) problems",
          "Why you must identify which angle is the 'odd one out'"
        ],
        variableSets: [
          {
            name: "Ben",
            scenario: "found an isosceles triangle with a top angle of 50°",
            topAngle: 50,
            wrongAnswer: 130,
            wrongReason: "forgot to divide by 2",
            correctAnswer: 65,
            interactTopAngle: 70,
            interactCorrectAnswer: 55
          },
          {
            name: "Sophie",
            scenario: "is working with an isosceles triangle where the top angle is 70°",
            topAngle: 70,
            wrongAnswer: 110,
            wrongReason: "forgot to divide by 2 — they gave the total of both base angles",
            correctAnswer: 55,
            interactTopAngle: 40,
            interactCorrectAnswer: 70
          },
          {
            name: "Marcus",
            scenario: "has an isosceles triangle with a top angle of 120°",
            topAngle: 120,
            wrongAnswer: 60,
            wrongReason: "forgot to divide by 2 — they gave the total of both base angles",
            correctAnswer: 30,
            interactTopAngle: 100,
            interactCorrectAnswer: 40
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Can you spot the mistake?",
            body: (v) => `${v.name} ${v.scenario}. They wrote: "180° − ${v.topAngle}° = ${180 - v.topAngle}°, so each base angle is ${180 - v.topAngle}°."\nBut that can't be right — can you see why?`,
            visual: {
              component: "AngleDiagram",
              props: (v) => ({
                angle1: v.topAngle,
                angle2: v.correctAnswer,
                angle3: v.correctAnswer,
                showAngle3: false,
                totalLabel: "Total: 180°"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Don't forget to divide by 2!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `In an **isosceles** (two equal sides) triangle, ${180 - v.topAngle}° is the **total** of both base angles, not the size of each one! There are **two** equal base angles, so you must **divide by 2**.`
              },
              {
                type: 'visual',
                component: 'AngleDiagram',
                props: (v) => ({
                  angle1: v.topAngle,
                  angle2: v.correctAnswer,
                  angle3: v.correctAnswer,
                  totalLabel: "Total: 180°"
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `180° − ${v.topAngle}° = ${180 - v.topAngle}°`, why: "This is the total of BOTH base angles." },
                    { text: `${180 - v.topAngle}° ÷ 2 = ${v.correctAnswer}°`, why: "Divide by 2 to find EACH base angle. ✓" }
                  ],
                  allRevealed: true
                })
              },
              {
                type: 'text',
                content: (v) => `Each base angle is **${v.correctAnswer}°**, not ${180 - v.topAngle}°. Check: ${v.topAngle}° + ${v.correctAnswer}° + ${v.correctAnswer}° = 180° ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `180° − ${v.topAngle}° gives each base angle directly`, answer: false, explanation: `No! 180° − ${v.topAngle}° = ${180 - v.topAngle}°, but that's the total of BOTH base angles. You must divide by 2.` },
                { text: `Each base angle is ${v.correctAnswer}°`, answer: true, explanation: `Correct — (180° − ${v.topAngle}°) ÷ 2 = ${v.correctAnswer}°. ✓` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `An isosceles (two equal sides) triangle has a top angle of **${v.interactTopAngle}°**. What is each base angle?`,
            visual: {
              component: "AngleDiagram",
              props: (v) => ({
                angle1: v.interactTopAngle,
                angle2: v.interactCorrectAnswer,
                angle3: v.interactCorrectAnswer,
                showAngle3: false,
                totalLabel: "Total: 180°"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is each base angle?`,
              getOptions: (v) => generateDistractors(v.interactCorrectAnswer),
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Well done! (180° − ${v.interactTopAngle}°) ÷ 2 = **${v.interactCorrectAnswer}°**. ✓`,
                incorrect: (v) => `Remember to divide by 2! 180° − ${v.interactTopAngle}° = ${180 - v.interactTopAngle}°, then ${180 - v.interactTopAngle}° ÷ 2 = **${v.interactCorrectAnswer}°**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The isosceles checklist!",
            bodyParts: [
              {
                type: 'text',
                content: () => `For isosceles triangles, remember the **three steps**:`
              },
              {
                type: 'visual',
                component: 'AngleDiagram',
                props: () => ({
                  angle1: 50,
                  angle2: 65,
                  angle3: 65,
                  totalLabel: "Total: 180°"
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Step 1: Subtract the odd angle from 180°", why: "This gives the TOTAL of both base angles." },
                    { text: "Step 2: DIVIDE BY 2", why: "This is the step people forget! Two equal angles, so halve the total." },
                    { text: "Step 3: Check all three add to 180°", why: "Odd angle + base + base = 180° ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            visual: null,
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 6: Right-Angled Triangle
  // ==========================================
  {
    id: "right-angled-triangle",
    name: "Missing Angle in a Right-Angled Triangle",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step-by-Step ----
      {
        id: "right-angled-triangle-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to use the right angle (90°) as a known angle",
          "Why the other two angles in a right-angled triangle add up to 90°"
        ],
        variableSets: [
          {
            name: "Ella",
            scenario: "is working out angles on a ramp for a school wheelchair access project",
            rightAngle: 90,
            knownAngle: 35,
            missingAngle: 55,
            twoAngleSum: 90,
            interactKnownAngle: 28,
            interactMissingAngle: 62
          },
          {
            name: "Jake",
            scenario: "is measuring the angle at the top of a ladder leaning against a wall",
            rightAngle: 90,
            knownAngle: 62,
            missingAngle: 28,
            twoAngleSum: 90,
            interactKnownAngle: 53,
            interactMissingAngle: 37
          },
          {
            name: "Holly",
            scenario: "is calculating angles on a right-angled triangle in her maths book",
            rightAngle: 90,
            knownAngle: 48,
            missingAngle: 42,
            twoAngleSum: 90,
            interactKnownAngle: 33,
            interactMissingAngle: 57
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "A right angle (an angle of exactly 90 degrees) gives you a head start!",
            body: (v) => `${v.name} ${v.scenario}. The triangle has a **right angle (90°)** and another angle of **${v.knownAngle}°**. Finding the third angle is easier than you think!`,
            visual: {
              component: "AngleDiagram",
              props: (v) => ({
                angle1: 90,
                angle2: v.knownAngle,
                angle3: v.missingAngle,
                showAngle3: false,
                totalLabel: "Total: 180°"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The other two angles add up to 90°!",
            bodyParts: [
              {
                type: 'text',
                content: () => `In a right-angled triangle, one angle is already **90°**. Since all three must add to 180°, the **other two angles** must add to **180° − 90° = 90°**.\n\nSo you only need to subtract from **90°**!`
              },
              {
                type: 'visual',
                component: 'AngleDiagram',
                props: (v) => ({
                  angle1: 90,
                  angle2: v.knownAngle,
                  angle3: v.missingAngle,
                  showAngle3: false,
                  totalLabel: "Total: 180°"
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: "One angle is 90° (the right angle (an angle of exactly 90 degrees))", why: "Look for the square corner symbol." },
                    { text: "The other two must add to 90°", why: "Because 180° − 90° = 90°" },
                    { text: `Missing angle: 90° − ${v.knownAngle}°`, result: `= ${v.missingAngle}°` }
                  ],
                  allRevealed: false
                })
              },
              {
                type: 'text',
                content: (v) => `**90° − ${v.knownAngle}° = ${v.missingAngle}°**. Quick check: 90° + ${v.knownAngle}° + ${v.missingAngle}° = 180° ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "A right angle is", right: "90°" },
                { left: "Other two angles add to", right: "180° − 90° = 90°" },
                { left: "Subtract from 90°, not", right: "180°" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `A right-angled triangle has one angle of **${v.interactKnownAngle}°**. What is the missing angle?`,
            visual: {
              component: "AngleDiagram",
              props: (v) => ({
                angle1: 90,
                angle2: v.interactKnownAngle,
                angle3: v.interactMissingAngle,
                showAngle3: false,
                totalLabel: "Total: 180°"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the missing angle?`,
              getOptions: (v) => generateDistractors(v.interactMissingAngle),
              correctAnswer: (v) => v.interactMissingAngle,
              feedback: {
                correct: (v) => `Yes! **90° − ${v.interactKnownAngle}° = ${v.interactMissingAngle}°**. ✓`,
                incorrect: (v) => `Not quite! In a right-angled triangle, the other two angles add to 90°. So 90° − ${v.interactKnownAngle}° = **${v.interactMissingAngle}°**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The right-angle shortcut!",
            bodyParts: [
              {
                type: 'text',
                content: () => `When you see a **right angle**, the other two angles must add to **90°**. It's a handy shortcut:`
              },
              {
                type: 'visual',
                component: 'AngleDiagram',
                props: () => ({
                  angle1: 90,
                  angle2: 35,
                  angle3: 55,
                  totalLabel: "Total: 180°"
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Step 1: Spot the right angle (90°)", why: "Look for the small square symbol in the corner." },
                    { text: "Step 2: The other two angles add to 90°", why: "Because 180° − 90° = 90°." },
                    { text: "Step 3: Subtract the known angle from 90°", why: "That gives you the missing angle. ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            visual: null,
            interaction: null
          }
        ]
      },
      // ---- Lesson B: Curiosity Hook ----
      {
        id: "right-angled-triangle-curiosity",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to spot right-angled triangles in real life",
          "When to use the 90° shortcut"
        ],
        variableSets: [
          {
            name: "Finn",
            scenario: "noticed a right-angled triangle in the roof of a bus shelter",
            knownAngle: 25,
            missingAngle: 65,
            interactKnownAngle: 38,
            interactMissingAngle: 52
          },
          {
            name: "Nadia",
            scenario: "spotted a right-angled triangle in the corner of a football pitch",
            knownAngle: 55,
            missingAngle: 35,
            interactKnownAngle: 47,
            interactMissingAngle: 43
          },
          {
            name: "Tom",
            scenario: "found a right-angled triangle shape in the sail of a boat",
            knownAngle: 40,
            missingAngle: 50,
            interactKnownAngle: 32,
            interactMissingAngle: 58
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Right angles are everywhere!",
            body: (v) => `${v.name} ${v.scenario}. Right-angled triangles are one of the **most common shapes** in the real world. Can you guess why architects and builders love them?`,
            visual: {
              component: "AngleDiagram",
              props: (v) => ({
                angle1: 90,
                angle2: v.knownAngle,
                angle3: v.missingAngle,
                showAngle3: false,
                totalLabel: "Total: 180°"
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The 90° shortcut makes life easy!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `Builders love right-angled triangles because the **90° corner** makes structures strong and stable — and the maths is simpler too!\n\n${v.name} ${v.scenario}. One angle is **90°** and another is **${v.knownAngle}°**. Because the right angle (an angle of exactly 90°) uses up half of 180°, the remaining two angles share just **90°** between them.`
              },
              {
                type: 'visual',
                component: 'AngleDiagram',
                props: (v) => ({
                  angle1: 90,
                  angle2: v.knownAngle,
                  angle3: v.missingAngle,
                  showAngle3: false,
                  totalLabel: "Total: 180°"
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Right angle: 90°`, why: "Already known — that's half of 180° used up!" },
                    { text: `Other known angle: ${v.knownAngle}°`, why: "Read from the diagram." },
                    { text: `Missing: 90° − ${v.knownAngle}° = ${v.missingAngle}°`, why: "Just subtract from 90°, not 180°! ✓" }
                  ],
                  allRevealed: false
                })
              },
              {
                type: 'text',
                content: (v) => `The missing angle is **${v.missingAngle}°**. ✓`
              }
            ],
            visual: null,
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `A right-angled triangle has another angle of **${v.interactKnownAngle}°**. What's the third angle?`,
            visual: {
              component: "AngleDiagram",
              props: (v) => ({
                angle1: 90,
                angle2: v.interactKnownAngle,
                angle3: v.interactMissingAngle,
                showAngle3: false,
                totalLabel: "Total: 180°"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the missing angle?`,
              getOptions: (v) => generateDistractors(v.interactMissingAngle),
              correctAnswer: (v) => v.interactMissingAngle,
              feedback: {
                correct: (v) => `Well done! **90° − ${v.interactKnownAngle}° = ${v.interactMissingAngle}°**. ✓`,
                incorrect: (v) => `Not quite! The other two angles add to 90°. So 90° − ${v.interactKnownAngle}° = **${v.interactMissingAngle}°**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Look for the square corner!",
            bodyParts: [
              {
                type: 'text',
                content: () => `Whenever you see a **small square** drawn in a corner, that's a right angle. Use the shortcut:`
              },
              {
                type: 'visual',
                component: 'AngleDiagram',
                props: () => ({
                  angle1: 90,
                  angle2: 45,
                  angle3: 45,
                  totalLabel: "Total: 180°"
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Spot the square symbol → it's 90°", why: "This is the right angle." },
                    { text: "The other two angles add to 90°", why: "Not 180° — the right angle already uses half!" },
                    { text: "Subtract the known angle from 90°", why: "Quick and easy every time. ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            visual: null,
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 7: Algebraic Angles
  // ==========================================
  {
    id: "algebraic-angles",
    name: "Using Algebra to Find Angles",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step-by-Step ----
      {
        id: "algebraic-angles-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to set up an equation when angles are given as expressions like 2x or 3x + 10",
          "Why you must substitute back to find the actual angle, not just x"
        ],
        variableSets: [
          {
            name: "Aisha",
            scenario: "is solving a triangle problem where the angles are x°, 2x°, and 3x°",
            expression1: "x",
            expression2: "2x",
            expression3: "3x",
            total: 180,
            equation: "x + 2x + 3x = 180",
            simplified: "6x = 180",
            xValue: 30,
            angle1: 30,
            angle2: 60,
            angle3: 90,
            context: "triangle",
            interactExpression1: "2x",
            interactExpression2: "3x",
            interactExpression3: "4x",
            interactEquation: "2x + 3x + 4x = 180",
            interactSimplified: "9x = 180",
            interactXValue: 20,
            interactAngle1: 40,
            interactAngle2: 60,
            interactAngle3: 80,
            interactContext: "triangle"
          },
          {
            name: "Oscar",
            scenario: "is finding angles on a straight line where one is x° and the other is 4x°",
            expression1: "x",
            expression2: "4x",
            expression3: null,
            total: 180,
            equation: "x + 4x = 180",
            simplified: "5x = 180",
            xValue: 36,
            angle1: 36,
            angle2: 144,
            angle3: null,
            context: "straight line",
            interactExpression1: "x",
            interactExpression2: "2x",
            interactExpression3: null,
            interactEquation: "x + 2x = 180",
            interactSimplified: "3x = 180",
            interactXValue: 60,
            interactAngle1: 60,
            interactAngle2: 120,
            interactAngle3: null,
            interactContext: "straight line"
          },
          {
            name: "Lily",
            scenario: "is working out angles in a triangle labelled 2x°, 3x°, and 5x°",
            expression1: "2x",
            expression2: "3x",
            expression3: "5x",
            total: 180,
            equation: "2x + 3x + 5x = 180",
            simplified: "10x = 180",
            xValue: 18,
            angle1: 36,
            angle2: 54,
            angle3: 90,
            context: "triangle",
            interactExpression1: "x",
            interactExpression2: "3x",
            interactExpression3: "5x",
            interactEquation: "x + 3x + 5x = 180",
            interactSimplified: "9x = 180",
            interactXValue: 20,
            interactAngle1: 20,
            interactAngle2: 60,
            interactAngle3: 100,
            interactContext: "triangle"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Algebra meets angles!",
            body: (v) => `${v.name} ${v.scenario}. The angles use **x** instead of numbers. Don't worry — if you know the total, you can find x!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `The angles: ${[v.expression1, v.expression2, v.expression3].filter(Boolean).join('°, ')}°`, why: `They're all written using x.` },
                  { text: `They're in a ${v.context}`, why: `So they add up to ${v.total}°.` }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Step by step: solve for x, then find each angle",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `Since the angles are in a **${v.context}**, they add up to **${v.total}°**.\nWrite an equation and solve for **x**.`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Write the equation: ${v.equation}`, why: `All the angle expressions must add to ${v.total}°.` },
                    { text: `Simplify: ${v.simplified}`, why: "Collect the x terms together." },
                    { text: `Solve: x = ${v.total} ÷ ${v.total / v.xValue} = ${v.xValue}`, why: "Divide both sides to find x." },
                    { text: `Angles: ${v.angle1}°${v.angle2 ? ', ' + v.angle2 + '°' : ''}${v.angle3 ? ', ' + v.angle3 + '°' : ''}`, why: "Substitute x back into each expression! ✓" }
                  ],
                  allRevealed: false
                })
              },
              {
                type: 'text',
                content: (v) => `**x = ${v.xValue}**, so the angles are **${[v.angle1, v.angle2, v.angle3].filter(a => a !== null).join('°, ')}°**. ✓`
              }
            ],
            visual: null,
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `The angles in a ${v.interactContext} are **${[v.interactExpression1, v.interactExpression2, v.interactExpression3].filter(Boolean).join('°, ')}°**. What is the value of **x**?`,
            visual: null,
            bodyParts: [
              {
                type: 'visual',
                component: 'AngleDisplay',
                props: (v) => ({
                  angles: [
                    { value: v.interactAngle1, label: `${v.interactExpression1}°`, color: "#818cf8" },
                    ...(v.interactExpression2 ? [{ value: v.interactAngle2, label: `${v.interactExpression2}°`, color: "#38bdf8" }] : []),
                    ...(v.interactExpression3 ? [{ value: v.interactAngle3, label: `${v.interactExpression3}°`, color: "#c084fc" }] : [])
                  ]
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `${v.interactEquation}`, why: `Angles in a ${v.interactContext} = ${v.total}°` },
                    { text: `${v.interactSimplified}`, why: "Collect like terms." }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the value of x?`,
              getOptions: (v) => generateDistractors(v.interactXValue),
              correctAnswer: (v) => v.interactXValue,
              feedback: {
                correct: (v) => `Yes! **x = ${v.interactXValue}**. The angles are ${[v.interactAngle1, v.interactAngle2, v.interactAngle3].filter(a => a !== null).join('°, ')}°. ✓`,
                incorrect: (v) => `Not quite! ${v.interactSimplified}, so x = ${v.total} ÷ ${v.total / v.interactXValue} = **${v.interactXValue}**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Algebra + angles recipe!",
            bodyParts: [
              {
                type: 'text',
                content: () => `When angles are given as expressions, follow these steps:`
              },
              {
                type: 'visual',
                component: 'AngleDisplay',
                props: () => ({
                  angles: [
                    { value: 30, label: "30°", color: "#818cf8" },
                    { value: 60, label: "60°", color: "#38bdf8" },
                    { value: 90, label: "90°", color: "#c084fc" }
                  ]
                })
              },
              {
                type: 'text',
                content: () => `x = 30, so: **x° = 30°**, **2x° = 60°**, **3x° = 90°**. They add up to 180°! ✓`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Step 1: Write the equation", why: "Add all the expressions and set equal to the angle total (180° or 360°)." },
                    { text: "Step 2: Simplify and solve for x", why: "Collect like terms, then divide." },
                    { text: "Step 3: Substitute back to find each angle", why: "Don't just give x — the question asks for the ANGLE! ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            visual: null,
            interaction: null
          }
        ]
      },
      // ---- Lesson B: Spot the Mistake ----
      {
        id: "algebraic-angles-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid giving x as the answer when the question asks for the angle",
          "Why substituting back into the expression is essential"
        ],
        variableSets: [
          {
            name: "Ravi",
            scenario: "solved 2x + 3x + x = 180 and got x = 30",
            equation: "2x + 3x + x = 180",
            xValue: 30,
            wrongAnswer: 30,
            wrongReason: "gave x = 30 as the angle, but the question asked for the angle 2x",
            expressionAsked: "2x",
            correctAnswer: 60,
            interactXValue: 25,
            interactExpressionAsked: "3x",
            interactCorrectAnswer: 75
          },
          {
            name: "Grace",
            scenario: "solved 4x + x = 180 and got x = 36",
            equation: "4x + x = 180",
            xValue: 36,
            wrongAnswer: 36,
            wrongReason: "gave x = 36 as the answer, but the question asked for the angle 4x",
            expressionAsked: "4x",
            correctAnswer: 144,
            interactXValue: 45,
            interactExpressionAsked: "3x",
            interactCorrectAnswer: 135
          },
          {
            name: "Charlie",
            scenario: "solved 3x + 2x + x = 180 and got x = 30",
            equation: "3x + 2x + x = 180",
            xValue: 30,
            wrongAnswer: 30,
            wrongReason: "gave x = 30 instead of the angle 3x",
            expressionAsked: "3x",
            correctAnswer: 90,
            interactXValue: 20,
            interactExpressionAsked: "4x",
            interactCorrectAnswer: 80
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "So close — but not quite!",
            body: (v) => `${v.name} ${v.scenario}. The question asks: "What is the angle ${v.expressionAsked}°?" ${v.name} wrote: "**${v.wrongAnswer}°**". Is that right?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.equation}`, why: "The equation is set up correctly." },
                  { text: `x = ${v.xValue}`, why: "Solving is correct too." },
                  { text: `Answer: ${v.wrongAnswer}°`, why: "But wait — is this the angle they asked for?" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "x is not always the answer!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `${v.name} ${v.wrongReason}.\n\nThe question asks for **${v.expressionAsked}°**, not just x. You need to **substitute x back** into the expression!`
              },
              {
                type: 'visual',
                component: 'AngleDisplay',
                props: (v) => ({
                  angles: [
                    { value: v.wrongAnswer, label: `x = ${v.wrongAnswer}°`, color: '#d1d5db' }
                  ]
                })
              },
              {
                type: 'text',
                content: (v) => `${v.name} gave **${v.wrongAnswer}°** — but that's just x, not the angle asked for! ✗`
              },
              {
                type: 'visual',
                component: 'AngleDisplay',
                props: (v) => ({
                  angles: [
                    { value: v.correctAnswer, label: `${v.expressionAsked} = ${v.correctAnswer}°`, color: '#818cf8' }
                  ]
                })
              },
              {
                type: 'text',
                content: (v) => `The correct answer is **${v.correctAnswer}°**. Substitute x into **${v.expressionAsked}** to get the actual angle! ✓`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `x = ${v.xValue}`, why: "This is just the value of x." },
                    { text: `The angle is ${v.expressionAsked}° = ${v.correctAnswer}°`, why: "Substitute x into the expression to get the actual angle! ✓" }
                  ],
                  allRevealed: false
                })
              }
            ],
            visual: null,
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `If x = ${v.interactXValue}, what is the angle **${v.interactExpressionAsked}°**?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `x = ${v.interactXValue}`, why: "The value of x." },
                  { text: `The angle asked for: ${v.interactExpressionAsked}°`, why: "Substitute x into this expression." }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the angle ${v.interactExpressionAsked}°?`,
              getOptions: (v) => generateDistractors(v.interactCorrectAnswer),
              correctAnswer: (v) => v.interactCorrectAnswer,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactExpressionAsked} = **${v.interactCorrectAnswer}°**. You remembered to substitute! ✓`,
                incorrect: (v) => `Not quite! x = ${v.interactXValue}, so ${v.interactExpressionAsked} = **${v.interactCorrectAnswer}°**. Don't confuse x with the angle!`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Always substitute back!",
            bodyParts: [
              {
                type: 'text',
                content: () => `The biggest mistake in algebraic angle problems: giving **x** when the question asks for the **angle**.`
              },
              {
                type: 'visual',
                component: 'AngleDisplay',
                props: () => ({
                  angles: [
                    { value: 36, label: "x = 36°", color: "#d1d5db" }
                  ]
                })
              },
              {
                type: 'text',
                content: () => `x = 36° is not the answer if the question asks for **4x**!`
              },
              {
                type: 'visual',
                component: 'AngleDisplay',
                props: () => ({
                  angles: [
                    { value: 144, label: "4x = 144°", color: "#818cf8" }
                  ]
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Step 1: Solve for x", why: "Set up the equation and find x." },
                    { text: "Step 2: READ THE QUESTION — which angle do they want?", why: "It might ask for 2x, 3x, or x + 10, not just x!" },
                    { text: "Step 3: Substitute x into the expression", why: "That gives you the actual angle in degrees. ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            visual: null,
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 8: Exterior Angles
  // ==========================================
  {
    id: "exterior-angles",
    name: "Exterior Angle of a Triangle",
    category: "other",
    lessons: [
      // ---- Lesson A: Curiosity Hook ----
      {
        id: "exterior-angles-curiosity",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to see that the exterior angle (the angle outside the shape) equals the two opposite interior angles (inside angles)",
          "Why this shortcut works every time"
        ],
        variableSets: [
          {
            name: "Sophie",
            scenario: "is investigating angles on a triangular road sign",
            interiorA: 50,
            interiorB: 70,
            interiorC: 60,
            exteriorAngle: 120,
            adjacentInterior: 60,
            interactInteriorA: 55,
            interactInteriorB: 75,
            interactAdjacentInterior: 50,
            interactExteriorAngle: 130
          },
          {
            name: "Marcus",
            scenario: "is measuring the exterior angle of a triangular flower bed",
            interiorA: 45,
            interiorB: 80,
            interiorC: 55,
            exteriorAngle: 125,
            adjacentInterior: 55,
            interactInteriorA: 50,
            interactInteriorB: 65,
            interactAdjacentInterior: 65,
            interactExteriorAngle: 115
          },
          {
            name: "Daisy",
            scenario: "is finding angles on a triangular shelf bracket",
            interiorA: 35,
            interiorB: 65,
            interiorC: 80,
            exteriorAngle: 100,
            adjacentInterior: 80,
            interactInteriorA: 30,
            interactInteriorB: 75,
            interactAdjacentInterior: 75,
            interactExteriorAngle: 105
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "A magic shortcut for exterior angles!",
            body: (v) => `${v.name} ${v.scenario}. When you extend one side of a triangle, the **exterior angle** that forms has a cool property. It equals the sum of the **two opposite interior angles**!`,
            visual: {
              component: "ExteriorAngle",
              props: (v) => ({
                angle1: v.interiorA,
                angle2: v.interiorB,
                angle3: v.adjacentInterior,
                showExterior: true,
                exteriorLabel: `${v.exteriorAngle}°`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Exterior angle = sum of two opposite interior angles",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `When you extend one side of a triangle, the **exterior angle** is formed. This exterior angle equals the **sum of the two opposite interior angles**.\n\nWhy? Because the exterior angle + the interior angle next to it = 180° (straight line), and the three interior angles also add to 180°.`
              },
              {
                type: 'visual',
                component: 'ExteriorAngle',
                props: (v) => ({
                  angle1: v.interiorA,
                  angle2: v.interiorB,
                  angle3: v.adjacentInterior,
                  showExterior: true,
                  exteriorLabel: `${v.exteriorAngle}°`
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Two opposite interior angles: ${v.interiorA}° and ${v.interiorB}°`, why: "The angles NOT next to the exterior angle." },
                    { text: `Exterior angle = ${v.interiorA}° + ${v.interiorB}°`, result: `= ${v.exteriorAngle}°` },
                    { text: `Check: exterior + next-door interior = ${v.exteriorAngle}° + ${v.adjacentInterior}° = 180°`, why: "They're on a straight line! ✓" }
                  ],
                  allRevealed: true
                })
              },
              {
                type: 'text',
                content: (v) => `The exterior angle is **${v.exteriorAngle}°**. This shortcut saves a step! ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "fill-blank",
              sentence: (v) => `The exterior angle of a triangle equals the ____ of the two opposite interior angles`,
              options: (v) => ["difference", "sum", "product", "average"],
              correctIndex: (v) => 1,
              feedback: {
                correct: (v) => `Yes! The exterior angle equals the sum of the two opposite interior angles. ✓`,
                incorrect: (v) => `Not quite — the exterior angle equals the sum (total) of the two opposite interior angles added together.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `The two opposite interior angles are **${v.interactInteriorA}°** and **${v.interactInteriorB}°**. What is the exterior angle?`,
            visual: {
              component: "ExteriorAngle",
              props: (v) => ({
                angle1: v.interactInteriorA,
                angle2: v.interactInteriorB,
                angle3: v.interactAdjacentInterior,
                showExterior: true,
                exteriorLabel: "?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the exterior angle?`,
              getOptions: (v) => generateDistractors(v.interactExteriorAngle),
              correctAnswer: (v) => v.interactExteriorAngle,
              feedback: {
                correct: (v) => `Yes! **${v.interactInteriorA}° + ${v.interactInteriorB}° = ${v.interactExteriorAngle}°**. ✓`,
                incorrect: (v) => `Not quite! The exterior angle equals the sum of the two opposite interior angles: ${v.interactInteriorA}° + ${v.interactInteriorB}° = **${v.interactExteriorAngle}°**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The exterior angle shortcut!",
            bodyParts: [
              {
                type: 'visual',
                component: 'ExteriorAngle',
                props: () => ({
                  angle1: 50,
                  angle2: 70,
                  angle3: 60,
                  showExterior: true,
                  exteriorLabel: "?"
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Exterior angle = sum of two OPPOSITE interior angles", why: "The two angles that are NOT next to the exterior angle." },
                    { text: "Exterior angle + next-door interior = 180°", why: "They sit on a straight line." },
                    { text: "Both methods give the same answer!", why: "Use whichever feels easier. ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            visual: null,
            interaction: null
          }
        ]
      },
      // ---- Lesson B: Key Fact ----
      {
        id: "exterior-angles-keyfact",
        templateType: "key-fact",
        learningGoal: [
          "When to use the exterior angle (outside angle) rule versus the straight line rule",
          "How to identify which interior angles (inside angles) are 'opposite'"
        ],
        variableSets: [
          {
            name: "Ben",
            scenario: "knows two interior angles of a triangle are 40° and 75°",
            interiorA: 40,
            interiorB: 75,
            exteriorAngle: 115,
            interactInteriorA: 45,
            interactInteriorB: 60,
            interactExteriorAngle: 105
          },
          {
            name: "Holly",
            scenario: "has a triangle with interior angles of 50° and 70°",
            interiorA: 50,
            interiorB: 70,
            exteriorAngle: 120,
            interactInteriorA: 60,
            interactInteriorB: 65,
            interactExteriorAngle: 125
          },
          {
            name: "Ravi",
            scenario: "is looking at a triangle with interior angles of 45° and 90°",
            interiorA: 45,
            interiorB: 90,
            exteriorAngle: 135,
            interactInteriorA: 55,
            interactInteriorB: 80,
            interactExteriorAngle: 135
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Quick fact: exterior angles!",
            body: (v) => `${v.name} ${v.scenario}. There's a quick way to find the exterior angle without finding the third interior angle first. Just **add the two opposite interior angles**!`,
            visual: {
              component: "ExteriorAngle",
              props: (v) => ({
                angle1: v.interiorA,
                angle2: v.interiorB,
                angle3: 180 - v.interiorA - v.interiorB,
                showExterior: true,
                exteriorLabel: `${v.exteriorAngle}°`
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Why does this work?",
            bodyParts: [
              {
                type: 'text',
                content: () => `The three interior angles add to **180°**. The exterior angle and the interior angle next to it also add to **180°** (straight line).\n\nSo the exterior angle must equal the **other two** interior angles combined!`
              },
              {
                type: 'visual',
                component: 'ExteriorAngle',
                props: (v) => ({
                  angle1: v.interiorA,
                  angle2: v.interiorB,
                  angle3: 180 - v.interiorA - v.interiorB,
                  showExterior: true,
                  exteriorLabel: `${v.exteriorAngle}°`
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Interior angles: a + b + c = 180°`, why: "Triangle angle sum." },
                    { text: `Exterior angle + c = 180°`, why: "Straight line." },
                    { text: `So exterior angle = a + b`, why: "Both equal 180° − c! ✓" }
                  ],
                  allRevealed: true
                })
              },
              {
                type: 'text',
                content: () => `The maths works out perfectly. **Exterior angle = the two opposite interior angles added together.** ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "true-false",
              statements: (v) => [
                { text: `The exterior angle equals the sum of the two opposite interior angles`, answer: true, explanation: `Correct — add the two interior angles that are NOT next to the exterior angle. ✓` },
                { text: `The exterior angle and its adjacent interior angle add to 360°`, answer: false, explanation: `No! They add to 180° because they sit on a straight line.` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Two interior angles are **${v.interactInteriorA}°** and **${v.interactInteriorB}°**. What is the exterior angle at the third corner?`,
            visual: {
              component: "ExteriorAngle",
              props: (v) => ({
                angle1: v.interactInteriorA,
                angle2: v.interactInteriorB,
                angle3: 180 - v.interactInteriorA - v.interactInteriorB,
                showExterior: true,
                exteriorLabel: "?"
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the exterior angle?`,
              getOptions: (v) => generateDistractors(v.interactExteriorAngle),
              correctAnswer: (v) => v.interactExteriorAngle,
              feedback: {
                correct: (v) => `Spot on! **${v.interactInteriorA}° + ${v.interactInteriorB}° = ${v.interactExteriorAngle}°**. ✓`,
                incorrect: (v) => `Not quite! Add the two opposite interior angles: ${v.interactInteriorA}° + ${v.interactInteriorB}° = **${v.interactExteriorAngle}°**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Remember this shortcut!",
            bodyParts: [
              {
                type: 'visual',
                component: 'ExteriorAngle',
                props: () => ({
                  angle1: 45,
                  angle2: 75,
                  angle3: 60,
                  showExterior: true,
                  exteriorLabel: "?"
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Find the two OPPOSITE interior angles", why: "The ones NOT next to the exterior angle." },
                    { text: "Add them together", why: "Their sum IS the exterior angle." },
                    { text: "Check: exterior + next-door interior = 180°", why: "They should sit on a straight line. ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            visual: null,
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 9: Parallel Lines
  // ==========================================
  {
    id: "parallel-lines",
    name: "Angles with Parallel Lines",
    category: "other",
    lessons: [
      // ---- Lesson A: Visual Discovery ----
      {
        id: "parallel-lines-discovery",
        templateType: "visual-discovery",
        learningGoal: [
          "How to spot corresponding angles (in matching positions) and alternate angles (in Z-shapes) with parallel lines (lines that never meet)",
          "Why these angles are equal when lines are parallel"
        ],
        variableSets: [
          {
            name: "Grace",
            scenario: "is looking at the angles formed where a path crosses two parallel fences",
            givenAngle: 65,
            correspondingAngle: 65,
            alternateAngle: 65,
            coInteriorAngle: 115,
            interactGivenAngle: 58,
            interactCoInteriorAngle: 122
          },
          {
            name: "Finn",
            scenario: "is examining angles where a road crosses two parallel railway lines",
            givenAngle: 50,
            correspondingAngle: 50,
            alternateAngle: 50,
            coInteriorAngle: 130,
            interactGivenAngle: 43,
            interactCoInteriorAngle: 137
          },
          {
            name: "Nadia",
            scenario: "is studying the angles where a ladder leans across two parallel shelves",
            givenAngle: 72,
            correspondingAngle: 72,
            alternateAngle: 72,
            coInteriorAngle: 108,
            interactGivenAngle: 67,
            interactCoInteriorAngle: 113
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Parallel lines create equal angles!",
            body: (v) => `${v.name} ${v.scenario}. When a line crosses two **parallel lines** (lines that run in the same direction and never meet), some angles are **exactly equal** and some add to 180°. Let's find the pattern!`,
            visual: {
              component: "ParallelLines",
              props: (v) => ({
                givenAngle: v.givenAngle,
                highlight: null
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Corresponding and alternate angles",
            bodyParts: [
              {
                type: 'text',
                content: () => `When a line (called a **transversal** — the line that crosses both parallel lines) crosses two **parallel lines**, it creates three special angle pairs. Each one makes a letter shape:`
              },
              {
                type: 'text',
                content: (v) => `**F-shape → Corresponding angles → EQUAL**\nThe angles are in the **same position** at each crossing. Trace an F (or backwards F) along the parallels and transversal to spot them.`
              },
              {
                type: 'visual',
                component: 'ParallelLines',
                props: (v) => ({
                  givenAngle: v.givenAngle,
                  highlight: "corresponding"
                })
              },
              {
                type: 'text',
                content: (v) => `**Z-shape → Alternate angles → EQUAL**\nThe angles are on **opposite sides** of the transversal, between the parallel lines. Trace a Z (or S) shape to find them.`
              },
              {
                type: 'visual',
                component: 'ParallelLines',
                props: (v) => ({
                  givenAngle: v.givenAngle,
                  highlight: "alternate"
                })
              },
              {
                type: 'text',
                content: (v) => `**C-shape → Co-interior angles → ADD TO 180°**\nThe angles are on the **same side** of the transversal, between the parallel lines. Trace a C (or U) shape. These add to 180° instead of being equal.`
              },
              {
                type: 'visual',
                component: 'ParallelLines',
                props: (v) => ({
                  givenAngle: v.givenAngle,
                  highlight: "co-interior"
                })
              },
              {
                type: 'text',
                content: (v) => `So for ${v.givenAngle}°: corresponding = **${v.correspondingAngle}°**, alternate = **${v.alternateAngle}°**, co-interior = **${v.coInteriorAngle}°**. ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "F-shape (corresponding)", right: "Equal angles (same position)" },
                { left: "Z-shape (alternate)", right: "Equal angles (opposite sides)" },
                { left: "C-shape (co-interior)", right: "Add to 180°" }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `One angle is **${v.interactGivenAngle}°**. What is the **co-interior angle** (the one on the same side, between the parallel lines)?`,
            visual: {
              component: "ParallelLines",
              props: (v) => ({
                givenAngle: v.interactGivenAngle,
                highlight: "co-interior",
                hideAnswer: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the co-interior angle?`,
              getOptions: (v) => generateDistractors(v.interactCoInteriorAngle),
              correctAnswer: (v) => v.interactCoInteriorAngle,
              feedback: {
                correct: (v) => `Yes! Co-interior angles add to 180°, so 180° − ${v.interactGivenAngle}° = **${v.interactCoInteriorAngle}°**. ✓`,
                incorrect: (v) => `Not quite! Co-interior angles add to 180°. So 180° − ${v.interactGivenAngle}° = **${v.interactCoInteriorAngle}°**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "F, Z, and C — the parallel line letters!",
            body: () => `When you see parallel lines (shown with arrows), look for these letter shapes:`,
            visual: null,
            bodyParts: [
              {
                type: 'visual',
                component: 'ParallelLines',
                props: () => ({
                  givenAngle: 65,
                  highlight: "corresponding"
                })
              },
              {
                type: 'text',
                content: () => `**F** = Corresponding = **Equal**`
              },
              {
                type: 'visual',
                component: 'ParallelLines',
                props: () => ({
                  givenAngle: 65,
                  highlight: "alternate"
                })
              },
              {
                type: 'text',
                content: () => `**Z** = Alternate = **Equal**`
              },
              {
                type: 'visual',
                component: 'ParallelLines',
                props: () => ({
                  givenAngle: 65,
                  highlight: "co-interior"
                })
              },
              {
                type: 'text',
                content: () => `**C** = Co-interior = **Add to 180°** ✓`
              }
            ],
            interaction: null
          }
        ]
      },
      // ---- Lesson B: Key Fact ----
      {
        id: "parallel-lines-keyfact",
        templateType: "key-fact",
        learningGoal: [
          "How to quickly identify which angle rule to use with parallel lines (lines that never meet)",
          "When angles are equal versus when they add to 180°"
        ],
        variableSets: [
          {
            name: "Isaac",
            scenario: "sees an angle of 48° and needs the alternate angle",
            givenAngle: 48,
            targetAngle: 48,
            relationship: "alternate",
            rule: "equal",
            interactGivenAngle: 62,
            interactTargetAngle: 62,
            interactRelationship: "alternate",
            interactRule: "equal"
          },
          {
            name: "Ella",
            scenario: "sees an angle of 115° and needs the co-interior angle",
            givenAngle: 115,
            targetAngle: 65,
            relationship: "co-interior",
            rule: "add to 180°",
            interactGivenAngle: 108,
            interactTargetAngle: 72,
            interactRelationship: "co-interior",
            interactRule: "add to 180°"
          },
          {
            name: "Jake",
            scenario: "sees an angle of 73° and needs the corresponding angle",
            givenAngle: 73,
            targetAngle: 73,
            relationship: "corresponding",
            rule: "equal",
            interactGivenAngle: 58,
            interactTargetAngle: 58,
            interactRelationship: "corresponding",
            interactRule: "equal"
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Equal or add to 180°?",
            body: (v) => `${v.name} ${v.scenario}. The **${v.relationship}** angle (${v.relationship === 'alternate' ? 'the angle on the opposite side of the transversal' : v.relationship === 'co-interior' ? 'the angle on the same side of the transversal' : 'the angle in the matching position'}) — is it **equal** to ${v.givenAngle}°, or does it **add** to 180°? There's an easy way to remember!`,
            visual: {
              component: "ParallelLines",
              props: (v) => ({
                givenAngle: v.givenAngle,
                highlight: v.relationship
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The simple rule",
            bodyParts: [
              {
                type: 'text',
                content: () => `**Corresponding** (matching position) and **alternate** (opposite sides) angles are **EQUAL**.\n**Co-interior** (same side) angles **ADD TO 180°**.\n\nThat's the key fact: two out of three are equal, one adds to 180°.`
              },
              {
                type: 'visual',
                component: 'ParallelLines',
                props: (v) => ({
                  givenAngle: v.givenAngle,
                  highlight: v.relationship
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Given angle: ${v.givenAngle}°`, why: "" },
                    { text: `Type: ${v.relationship}`, why: `These angles ${v.rule}.` },
                    { text: `Answer: ${v.targetAngle}°`, why: v.rule === "equal" ? `Same as the given angle!` : `180° − ${v.givenAngle}° = ${v.targetAngle}° ✓` }
                  ],
                  allRevealed: false
                })
              },
              {
                type: 'text',
                content: (v) => `The ${v.relationship} angle is **${v.targetAngle}°**. ✓`
              }
            ],
            visual: null,
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `The given angle is **${v.interactGivenAngle}°**. What is the **${v.interactRelationship}** angle?`,
            visual: null,
            bodyParts: [
              {
                type: 'visual',
                component: 'ParallelLines',
                props: (v) => ({
                  givenAngle: v.interactGivenAngle,
                  highlight: v.interactRelationship,
                  hideAnswer: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `${v.interactRelationship} angles ${v.interactRule}`, why: "" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the ${v.interactRelationship} angle?`,
              getOptions: (v) => generateDistractors(v.interactTargetAngle),
              correctAnswer: (v) => v.interactTargetAngle,
              feedback: {
                correct: (v) => `Yes! The ${v.interactRelationship} angle is **${v.interactTargetAngle}°**. ✓`,
                incorrect: (v) => `Not quite! ${v.interactRelationship} angles ${v.interactRule}. The answer is **${v.interactTargetAngle}°**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The parallel lines cheat sheet!",
            body: () => `Just remember which angle pairs are **equal** and which **add to 180°**:`,
            visual: null,
            bodyParts: [
              {
                type: 'visual',
                component: 'ParallelLines',
                props: () => ({
                  givenAngle: 70,
                  highlight: "corresponding"
                })
              },
              {
                type: 'text',
                content: () => `**F** = Corresponding = **Equal**`
              },
              {
                type: 'visual',
                component: 'ParallelLines',
                props: () => ({
                  givenAngle: 70,
                  highlight: "alternate"
                })
              },
              {
                type: 'text',
                content: () => `**Z** = Alternate = **Equal**`
              },
              {
                type: 'visual',
                component: 'ParallelLines',
                props: () => ({
                  givenAngle: 70,
                  highlight: "co-interior"
                })
              },
              {
                type: 'text',
                content: () => `**C** = Co-interior = **Add to 180°** ✓`
              }
            ],
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 10: Polygon Angles
  // ==========================================
  {
    id: "polygon-angles",
    name: "Interior Angles of Regular Polygons",
    category: "other",
    lessons: [
      // ---- Lesson A: Step-by-Step ----
      {
        id: "polygon-angles-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to calculate the sum of interior angles (inside angles) using (n - 2) x 180°",
          "How to find one angle in a regular polygon (a shape where all sides and angles are equal)"
        ],
        variableSets: [
          {
            name: "Priya",
            scenario: "is calculating angles in a regular pentagon for a tiling project",
            shapeName: "pentagon",
            sides: 5,
            triangles: 3,
            angleSum: 540,
            eachAngle: 108,
            interactShapeName: "hexagon",
            interactSides: 6,
            interactTriangles: 4,
            interactAngleSum: 720,
            interactEachAngle: 120
          },
          {
            name: "Tom",
            scenario: "is working out the interior angle of a regular hexagon for a bee honeycomb project",
            shapeName: "hexagon",
            sides: 6,
            triangles: 4,
            angleSum: 720,
            eachAngle: 120,
            interactShapeName: "octagon",
            interactSides: 8,
            interactTriangles: 6,
            interactAngleSum: 1080,
            interactEachAngle: 135
          },
          {
            name: "Daisy",
            scenario: "is finding angles in a regular octagon (stop sign shape)",
            shapeName: "octagon",
            sides: 8,
            triangles: 6,
            angleSum: 1080,
            eachAngle: 135,
            interactShapeName: "pentagon",
            interactSides: 5,
            interactTriangles: 3,
            interactAngleSum: 540,
            interactEachAngle: 108
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What's each angle in a regular ${v.shapeName}?`,
            body: (v) => `${v.name} ${v.scenario}. A ${v.shapeName} has **${v.sides} sides**. In a **regular** polygon (a shape where all sides and angles are equal), all angles are equal — but what are they?`,
            visual: {
              component: "RegularPolygon",
              props: (v) => ({
                sides: v.sides,
                eachAngle: v.eachAngle,
                angleLabel: "?",
                showDiagonals: false,
                highlightAngle: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "The (n - 2) x 180° rule",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `Any polygon (multi-sided shape) can be split into **triangles** by drawing diagonals from one corner. The more sides, the more triangles:`
              },
              {
                type: 'visual',
                component: 'RegularPolygon',
                props: () => ({
                  sides: 3,
                  eachAngle: 60,
                  showDiagonals: true,
                  highlightAngle: true
                })
              },
              {
                type: 'text',
                content: () => `**Triangle**: 1 triangle → 180° → each angle = **60°**`
              },
              {
                type: 'visual',
                component: 'RegularPolygon',
                props: () => ({
                  sides: 4,
                  eachAngle: 90,
                  showDiagonals: true,
                  highlightAngle: true
                })
              },
              {
                type: 'text',
                content: () => `**Square**: 2 triangles → 360° → each angle = **90°**`
              },
              {
                type: 'visual',
                component: 'RegularPolygon',
                props: (v) => ({
                  sides: v.sides,
                  eachAngle: v.eachAngle,
                  showDiagonals: true,
                  highlightAngle: true
                })
              },
              {
                type: 'text',
                content: (v) => `**${v.shapeName.charAt(0).toUpperCase() + v.shapeName.slice(1)}**: ${v.triangles} triangles → ${v.angleSum}° → each angle = **${v.eachAngle}°**`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Number of sides (n): ${v.sides}`, why: `Count the sides of the ${v.shapeName}.` },
                    { text: `Number of triangles: ${v.sides} − 2 = ${v.triangles}`, why: "Always 2 fewer triangles than sides." },
                    { text: `Angle sum: ${v.triangles} × 180° = ${v.angleSum}°`, why: "Each triangle contributes 180°." },
                    { text: `Each angle: ${v.angleSum}° ÷ ${v.sides} = ${v.eachAngle}°`, why: "All angles equal in a regular polygon. ✓" }
                  ],
                  allRevealed: false
                })
              },
              {
                type: 'text',
                content: (v) => `Each interior angle of a regular ${v.shapeName} is **${v.eachAngle}°**. ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "match-pairs",
              pairs: (v) => [
                { left: "Triangle (3 sides)", right: "180°" },
                { left: "Quadrilateral (4 sides)", right: "360°" },
                { left: `${v.shapeName} (${v.sides} sides)`, right: `${v.angleSum}°` }
              ]
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `A regular ${v.interactShapeName} has ${v.interactSides} sides. What is each interior angle?`,
            visual: {
              component: "RegularPolygon",
              props: (v) => ({
                sides: v.interactSides,
                eachAngle: v.interactEachAngle,
                angleLabel: "?",
                showDiagonals: true,
                highlightAngle: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is each interior angle?`,
              getOptions: (v) => generateDistractors(v.interactEachAngle),
              correctAnswer: (v) => v.interactEachAngle,
              feedback: {
                correct: (v) => `Yes! ${v.interactAngleSum}° ÷ ${v.interactSides} = **${v.interactEachAngle}°**. ✓`,
                incorrect: (v) => `Not quite! Angle sum = (${v.interactSides} − 2) × 180° = ${v.interactAngleSum}°. Then ${v.interactAngleSum}° ÷ ${v.interactSides} = **${v.interactEachAngle}°**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The polygon angle rule!",
            bodyParts: [
              {
                type: 'visual',
                component: 'RegularPolygon',
                props: () => ({
                  sides: 6,
                  eachAngle: 120,
                  showDiagonals: true,
                  highlightAngle: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Step 1: Count the sides (n)", why: "Pentagon = 5, hexagon = 6, octagon = 8, etc." },
                    { text: "Step 2: Angle sum = (n − 2) × 180°", why: "Split into triangles — always 2 fewer than the number of sides." },
                    { text: "Step 3: For REGULAR polygons, divide by n", why: "All angles are equal, so share the total equally. ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            visual: null,
            interaction: null
          }
        ]
      },
      // ---- Lesson B: Visual Discovery ----
      {
        id: "polygon-angles-visual",
        templateType: "visual-discovery",
        learningGoal: [
          "How to see that the number of triangles grows as the polygon (multi-sided shape) gets more sides",
          "Why the rule (n - 2) x 180° always works"
        ],
        variableSets: [
          {
            name: "Oscar",
            scenario: "is comparing angles in different regular polygons",
            shapes: [
              { name: "triangle", sides: 3, triangles: 1, sum: 180, each: 60 },
              { name: "square", sides: 4, triangles: 2, sum: 360, each: 90 },
              { name: "pentagon", sides: 5, triangles: 3, sum: 540, each: 108 }
            ],
            testShape: "pentagon",
            testEach: 108
          },
          {
            name: "Lily",
            scenario: "is building a chart of polygon angles for a classroom display",
            shapes: [
              { name: "square", sides: 4, triangles: 2, sum: 360, each: 90 },
              { name: "pentagon", sides: 5, triangles: 3, sum: 540, each: 108 },
              { name: "hexagon", sides: 6, triangles: 4, sum: 720, each: 120 }
            ],
            testShape: "hexagon",
            testEach: 120
          },
          {
            name: "Charlie",
            scenario: "is exploring how angles change as polygons get more sides",
            shapes: [
              { name: "hexagon", sides: 6, triangles: 4, sum: 720, each: 120 },
              { name: "heptagon", sides: 7, triangles: 5, sum: 900, each: 128.6 },
              { name: "octagon", sides: 8, triangles: 6, sum: 1080, each: 135 }
            ],
            testShape: "octagon",
            testEach: 135
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Spot the pattern!",
            body: (v) => `${v.name} ${v.scenario}. Look at how the angle sum grows as the polygon (multi-sided shape) gets more sides. Can you see the pattern?`,
            visual: {
              component: "RegularPolygon",
              props: (v) => ({
                sides: v.shapes[v.shapes.length - 1].sides,
                eachAngle: v.shapes[v.shapes.length - 1].each,
                showDiagonals: true,
                highlightAngle: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Each extra side adds 180°!",
            bodyParts: [
              {
                type: 'text',
                content: () => `Every time you add one more side, you add **one more triangle** — which adds **180°** to the total.\n\nTriangle: 1 × 180° = 180°\nSquare: 2 × 180° = 360°\nPentagon: 3 × 180° = 540°\n...and so on!`
              },
              {
                type: 'visual',
                component: 'RegularPolygon',
                props: (v) => ({
                  sides: v.shapes[0].sides,
                  eachAngle: v.shapes[0].each,
                  showDiagonals: true,
                  highlightAngle: true
                })
              },
              {
                type: 'text',
                content: (v) => v.shapes.map(s => `**${s.name}** (${s.sides} sides) → ${s.triangles} triangles → sum = **${s.sum}°** → each = **${s.each}°**`).join('\n')
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: v.shapes.map(s => ({
                    text: `${s.name}: (${s.sides} − 2) × 180° = ${s.sum}°`,
                    result: `Each angle: ${s.sum}° ÷ ${s.sides} = ${s.each}°`
                  })),
                  allRevealed: false
                })
              },
              {
                type: 'text',
                content: () => `As polygons get more sides, each angle gets **bigger** — closer and closer to 180°! ✓`
              }
            ],
            visual: null,
            interaction: null
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is each interior angle of a regular **${v.testShape}**?`,
            visual: {
              component: "RegularPolygon",
              props: (v) => ({
                sides: v.shapes[v.shapes.length - 1].sides,
                eachAngle: v.shapes[v.shapes.length - 1].each,
                angleLabel: "?",
                showDiagonals: true,
                highlightAngle: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `Each angle of a regular ${v.testShape} is...`,
              getOptions: (v) => generateDistractors(v.testEach),
              correctAnswer: (v) => v.testEach,
              feedback: {
                correct: (v) => `Well done! Each angle of a regular ${v.testShape} is **${v.testEach}°**. ✓`,
                incorrect: (v) => `Not quite! Use the rule (n − 2) × 180° and divide by n to find **${v.testEach}°**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The polygon angle pattern!",
            bodyParts: [
              {
                type: 'visual',
                component: 'RegularPolygon',
                props: () => ({
                  sides: 5,
                  eachAngle: 108,
                  showDiagonals: true,
                  highlightAngle: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Angle sum = (n − 2) × 180°", why: "n = number of sides. Subtract 2, multiply by 180°." },
                    { text: "For regular polygons: each angle = sum ÷ n", why: "All angles equal, so divide evenly." },
                    { text: "Each extra side adds 180° to the total", why: "That's because one more side = one more triangle. ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            visual: null,
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 11: Missing Angle in Irregular Polygons
  // ==========================================
  {
    id: "irregular-polygon-angle",
    name: "Finding a Missing Angle in an Irregular Polygon",
    category: "other",
    lessons: [
      // ---- Lesson A: Step-by-Step ----
      {
        id: "irregular-polygon-angle-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to find the sum of interior angles (inside angles) using (n - 2) × 180°",
          "How to subtract the known angles to find a missing angle"
        ],
        variableSets: [
          {
            name: "Ella",
            scenario: "is calculating a missing angle in an irregular pentagon on her homework",
            shapeName: "pentagon",
            sides: 5,
            angleSum: 540,
            knownAngles: [110, 95, 130, 85],
            knownSum: 420,
            missingAngle: 120,
            interactKnownAngles: [105, 100, 120, 90],
            interactKnownSum: 415,
            interactMissingAngle: 125
          },
          {
            name: "Oscar",
            scenario: "needs to find the missing angle in an irregular hexagon for a design project",
            shapeName: "hexagon",
            sides: 6,
            angleSum: 720,
            knownAngles: [135, 110, 125, 140, 100],
            knownSum: 610,
            missingAngle: 110,
            interactKnownAngles: [130, 115, 120, 135, 105],
            interactKnownSum: 605,
            interactMissingAngle: 115
          },
          {
            name: "Priya",
            scenario: "is working out the missing angle in a quadrilateral for her maths test",
            shapeName: "quadrilateral",
            sides: 4,
            angleSum: 360,
            knownAngles: [85, 110, 70],
            knownSum: 265,
            missingAngle: 95,
            interactKnownAngles: [95, 105, 80],
            interactKnownSum: 280,
            interactMissingAngle: 80
          }
        ],
        screens: [
          {
            type: "hook",
            title: (v) => `What's the missing angle in this ${v.shapeName}?`,
            body: (v) => `${v.name} ${v.scenario}. The ${v.shapeName} has **${v.sides} sides** and the known angles are **${v.knownAngles.join('°, ')}°**. One angle is missing!`,
            visual: {
              component: "RegularPolygon",
              props: (v) => ({
                sides: v.sides,
                eachAngle: v.missingAngle,
                angleLabel: "?",
                showDiagonals: false,
                highlightAngle: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Use the rule, then subtract!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `Any polygon (multi-sided shape) can be split into triangles. The number of triangles is always **2 fewer** than the number of sides. Since each triangle = 180°, the formula is:\n\n**Angle sum = (n − 2) × 180°** (where n = number of sides)\n\nThen **add up** the angles you know and **subtract** from the total.`
              },
              {
                type: 'visual',
                component: 'RegularPolygon',
                props: (v) => ({
                  sides: v.sides,
                  eachAngle: v.angleSum / v.sides,
                  angleLabel: "?",
                  showDiagonals: true,
                  highlightAngle: true
                })
              },
              {
                type: 'text',
                content: (v) => `**Irregular ${v.shapeName}** (${v.sides} sides):\nAngles: ${v.knownAngles.map(a => '**' + a + '°**').join(', ')}, **?°**\nAngle sum = (${v.sides} − 2) × 180° = **${v.angleSum}°**`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Step 1: Count the sides: n = ${v.sides}`, why: `A ${v.shapeName} has ${v.sides} sides.` },
                    { text: `Step 2: Angle sum = (n − 2) × 180°`, why: `Any polygon can be split into (n − 2) triangles. Each triangle = 180°.` },
                    { text: `So: (${v.sides} − 2) × 180° = ${v.sides - 2} × 180° = ${v.angleSum}°`, why: `The ${v.sides - 2} triangles give a total of ${v.angleSum}°.` },
                    { text: `Step 3: Add known angles: ${v.knownAngles.join('° + ')}° = ${v.knownSum}°`, why: "Add them up carefully." },
                    { text: `Step 4: Missing angle = ${v.angleSum}° − ${v.knownSum}° = ${v.missingAngle}°`, why: "Subtract to find what's left. ✓" }
                  ],
                  allRevealed: true
                })
              },
              {
                type: 'text',
                content: (v) => `The missing angle is **${v.missingAngle}°**. ✓`
              }
            ],
            visual: null,
            interaction: {
              type: "order-steps",
              steps: (v) => [
                `Find the angle sum: (${v.sides} − 2) × 180° = ${v.angleSum}°`,
                `Add the known angles: ${v.knownSum}°`,
                `Subtract: ${v.angleSum}° − ${v.knownSum}° = ${v.missingAngle}°`
              ],
              feedback: {
                correct: (v) => `Perfect order! Find the total, add the known angles, then subtract. ✓`,
                incorrect: (v) => `Not quite — first find the total using (n − 2) × 180°, then add the known angles, then subtract.`
              }
            }
          },
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `An irregular ${v.shapeName} has angles of **${v.interactKnownAngles.join('°, ')}°** and one unknown. What is the missing angle?`,
            visual: null,
            bodyParts: [
              {
                type: 'visual',
                component: 'RegularPolygon',
                props: (v) => ({
                  sides: v.sides,
                  eachAngle: v.angleSum / v.sides,
                  angleLabel: "?",
                  showDiagonals: false,
                  highlightAngle: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Angle sum of a ${v.shapeName}: ${v.angleSum}°`, why: `(${v.sides} − 2) × 180°` },
                    { text: `Known angles add up to: ${v.interactKnownSum}°`, why: `${v.interactKnownAngles.join('° + ')}°` }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the missing angle?`,
              getOptions: (v) => generateDistractors(v.interactMissingAngle),
              correctAnswer: (v) => v.interactMissingAngle,
              feedback: {
                correct: (v) => `Yes! ${v.angleSum}° − ${v.interactKnownSum}° = **${v.interactMissingAngle}°**. ✓`,
                incorrect: (v) => `Not quite. Total = ${v.angleSum}°. Known = ${v.interactKnownSum}°. So missing = ${v.angleSum}° − ${v.interactKnownSum}° = **${v.interactMissingAngle}°**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "The 3-step method for missing angles!",
            bodyParts: [
              {
                type: 'text',
                content: () => `This works for **any** polygon — regular or irregular:`
              },
              {
                type: 'visual',
                component: 'RegularPolygon',
                props: () => ({
                  sides: 5,
                  eachAngle: 108,
                  angleLabel: "?",
                  showDiagonals: false,
                  highlightAngle: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Step 1: Find the total — (n − 2) × 180°", why: "n = number of sides." },
                    { text: "Step 2: Add up all the angles you know", why: "Be careful with the addition!" },
                    { text: "Step 3: Subtract from the total", why: "Total − known angles = missing angle. ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            visual: null,
            interaction: null
          }
        ]
      },
      // ---- Lesson B: Mistake Analysis ----
      {
        id: "irregular-polygon-angle-mistake",
        templateType: "mistake-analysis",
        learningGoal: [
          "How to spot common mistakes when finding missing angles in polygons (multi-sided shapes)",
          "Why getting the angle sum right is the most important first step"
        ],
        variableSets: [
          {
            name: "Tom",
            scenario: "made a mistake finding the missing angle of an irregular pentagon",
            shapeName: "pentagon",
            sides: 5,
            angleSum: 540,
            knownAngles: [100, 120, 95, 115],
            knownSum: 430,
            missingAngle: 110,
            wrongAnswer: 130,
            mistake: "used 360° instead of 540° — he forgot pentagons aren't quadrilaterals",
            interactKnownAngles: [115, 105, 90, 125],
            interactKnownSum: 435,
            interactMissingAngle: 105
          },
          {
            name: "Lily",
            scenario: "got the wrong answer for a missing angle in an irregular hexagon",
            shapeName: "hexagon",
            sides: 6,
            angleSum: 720,
            knownAngles: [130, 115, 140, 120, 105],
            knownSum: 610,
            missingAngle: 110,
            wrongAnswer: 290,
            mistake: "added only 3 of the 5 known angles before subtracting",
            interactKnownAngles: [125, 120, 135, 115, 110],
            interactKnownSum: 605,
            interactMissingAngle: 115
          },
          {
            name: "Jake",
            scenario: "is confused about a missing angle in an irregular quadrilateral",
            shapeName: "quadrilateral",
            sides: 4,
            angleSum: 360,
            knownAngles: [75, 105, 90],
            knownSum: 270,
            missingAngle: 90,
            wrongAnswer: 180,
            mistake: "used 450° as the total — he accidentally calculated (4 − 1) × 150° instead of (4 − 2) × 180°",
            interactKnownAngles: [80, 95, 100],
            interactKnownSum: 275,
            interactMissingAngle: 85
          }
        ],
        screens: [
          {
            type: "hook",
            title: () => "Can you spot the mistake?",
            body: (v) => `${v.name} ${v.scenario}. He got **${v.wrongAnswer}°** but the teacher marked it wrong. What went wrong?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Shape: irregular ${v.shapeName} (${v.sides} sides)`, why: "" },
                  { text: `Known angles: ${v.knownAngles.join('°, ')}°`, why: "" },
                  { text: `${v.name}'s answer: ${v.wrongAnswer}°  ✗`, why: "Something went wrong..." }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          {
            type: "teach",
            title: () => "Here's what went wrong!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `The mistake: ${v.name} ${v.mistake}.\n\nLet's do it correctly:`
              },
              {
                type: 'visual',
                component: 'RegularPolygon',
                props: (v) => ({
                  sides: v.sides,
                  eachAngle: v.angleSum / v.sides,
                  angleLabel: "?",
                  showDiagonals: false,
                  highlightAngle: true
                })
              },
              {
                type: 'text',
                content: (v) => `**Irregular ${v.shapeName}** (${v.sides} sides):\nAngles: ${v.knownAngles.map(a => '**' + a + '°**').join(', ')}, **?°**\n${v.name}'s wrong answer: ${v.wrongAnswer}°  ✗   Correct total: (${v.sides} − 2) × 180° = **${v.angleSum}°**`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Angle sum = (${v.sides} − 2) × 180° = ${v.angleSum}°`, why: "Always use this rule first." },
                    { text: `Known angles: ${v.knownAngles.join('° + ')}° = ${v.knownSum}°`, why: "Add ALL the known angles carefully." },
                    { text: `Missing = ${v.angleSum}° − ${v.knownSum}° = ${v.missingAngle}°`, why: "Subtract to find the missing one. ✓" }
                  ],
                  allRevealed: false
                })
              }
            ],
            visual: null,
            interaction: null
          },
          {
            type: "interact",
            title: () => "Now you try!",
            body: (v) => `An irregular ${v.shapeName} has angles **${v.interactKnownAngles.join('°, ')}°** and one unknown. What is it?`,
            visual: {
              component: "RegularPolygon",
              props: (v) => ({
                sides: v.sides,
                eachAngle: v.angleSum / v.sides,
                angleLabel: "?",
                showDiagonals: false,
                highlightAngle: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the missing angle?`,
              getOptions: (v) => generateDistractors(v.interactMissingAngle),
              correctAnswer: (v) => v.interactMissingAngle,
              feedback: {
                correct: (v) => `Spot on! ${v.angleSum}° − ${v.interactKnownSum}° = **${v.interactMissingAngle}°**. ✓`,
                incorrect: (v) => `Remember: total = (${v.sides} − 2) × 180° = ${v.angleSum}°. Then ${v.angleSum}° − ${v.interactKnownSum}° = **${v.interactMissingAngle}°**.`
              }
            }
          },
          {
            type: "consolidate",
            title: () => "Watch out for these traps!",
            bodyParts: [
              {
                type: 'text',
                content: () => `The most common mistakes when finding missing polygon angles:`
              },
              {
                type: 'visual',
                component: 'RegularPolygon',
                props: () => ({
                  sides: 6,
                  eachAngle: 120,
                  angleLabel: "?",
                  showDiagonals: false,
                  highlightAngle: true
                })
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Trap 1: Using 360° for everything", why: "Only quadrilaterals = 360°. Use (n − 2) × 180° for others!" },
                    { text: "Trap 2: Forgetting to add ALL known angles", why: "Count them — you should have n − 1 known angles." },
                    { text: "Trap 3: Getting the rule wrong", why: "It's (n − 2) × 180°, not (n − 1) or (n − 2) × 360°. ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            visual: null,
            interaction: null
          }
        ]
      }
    ]
  }
];
