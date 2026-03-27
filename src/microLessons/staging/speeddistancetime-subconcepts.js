// Supplementary sub-concepts for Speed, Distance, Time
// To merge: add these to lessonBank.speeddistancetime.subConcepts array in lessonData.js
import { generateDistractors } from '../lessonData.js';

export const speeddistancetimeSubConcepts = [
  // ==========================================
  // SUB-CONCEPT 2: calculate-distance
  // Distance = Speed × Time
  // Category: core
  // Lesson A: step-by-step | Lesson B: curiosity-hook
  // ==========================================
  {
    id: "calculate-distance",
    name: "Distance = Speed × Time",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "calculate-distance-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to calculate distance using speed and time",
          "Why distance equals speed multiplied by time"
        ],
        variableSets: [
          {
            name: "Priya",
            scenario: "cycled at a steady speed from her house to the beach",
            speed: 12,
            time: 3,
            distance: 36,
            speedUnit: "km/h",
            timeUnit: "hours",
            distanceUnit: "km",
            interactSpeed: 15,
            interactTime: 4,
            interactDistance: 60
          },
          {
            name: "Dad",
            scenario: "drove on the motorway from Bournemouth towards London",
            speed: 60,
            time: 2,
            distance: 120,
            speedUnit: "mph",
            timeUnit: "hours",
            distanceUnit: "miles",
            interactSpeed: 50,
            interactTime: 3,
            interactDistance: 150
          },
          {
            name: "Finn",
            scenario: "jogged around the park at a steady pace",
            speed: 8,
            time: 2,
            distance: 16,
            speedUnit: "km/h",
            timeUnit: "hours",
            distanceUnit: "km",
            interactSpeed: 10,
            interactTime: 3,
            interactDistance: 30
          },
          {
            name: "Aisha",
            scenario: "took the train from Manchester to Leeds",
            speed: 80,
            time: 1,
            distance: 80,
            speedUnit: "mph",
            timeUnit: "hour",
            distanceUnit: "miles",
            interactSpeed: 70,
            interactTime: 2,
            interactDistance: 140
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `How far did ${v.name} go?`,
            body: (v) => `${v.name} ${v.scenario}.\nThey travelled at **${v.speed} ${v.speedUnit}** for **${v.time} ${v.timeUnit}**.\nWe know the speed and the time — but how **far** did they go? There's a simple way to work it out!`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: 0,
                max: v.distance,
                points: [
                  { value: 0, label: "Start", color: "#818cf8" },
                  { value: v.distance, label: "?", color: "#f87171" }
                ],
                jumps: [{ from: 0, to: v.distance, label: `${v.speed} ${v.speedUnit} for ${v.time} ${v.timeUnit}` }],
                tickInterval: Math.round(v.distance / 4)
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Distance = Speed × Time",
            bodyParts: [
              { type: "text", content: (v) => `If you know the speed and the time, **multiply** them together to get the distance.\n\n**Distance = Speed × Time**\n\nThink of it like this: if you travel at ${v.speed} ${v.distanceUnit} **every hour**, and you keep going for ${v.time} ${v.timeUnit}, you cover ${v.speed} × ${v.time} = **${v.distance} ${v.distanceUnit}**.` },
              { type: "visual", component: "SDTTriangle", props: () => ({ cover: "D", label: "Cover D to find Distance" }) },
              {
                type: "visual",
                component: "WorkedExample",
                props: (v) => ({
                  steps: [
                    { text: "Write the formula (a rule written as a calculation)", why: "Distance = Speed × Time", result: "D = S × T" },
                    { text: `Plug in the numbers`, why: `Speed = ${v.speed}, Time = ${v.time}`, result: `D = ${v.speed} × ${v.time}` },
                    { text: `Calculate`, why: "Multiply speed by time", result: `= ${v.distance} ${v.distanceUnit} ✓` }
                  ],
                  allRevealed: false
                })
              }
            ],
            interaction: { type: "tap-to-reveal" }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `${v.name} travels at **${v.interactSpeed} ${v.speedUnit}** for **${v.interactTime} ${v.timeUnit}**. How far do they go?`,
            visual: {
              component: "NumberLine",
              props: (v) => {
                const points = [{ value: 0, label: "Start", color: "#818cf8" }];
                const jumps = [];
                for (let i = 1; i <= v.interactTime; i++) {
                  const pos = v.interactSpeed * i;
                  points.push({ value: pos, label: i === v.interactTime ? "?" : `${pos}`, color: i === v.interactTime ? "#f87171" : "#c084fc" });
                  jumps.push({ from: v.interactSpeed * (i - 1), to: pos, label: `${v.interactSpeed} ${v.distanceUnit}` });
                }
                return {
                  min: 0,
                  max: v.interactDistance,
                  points,
                  jumps,
                  tickInterval: Math.round(v.interactDistance / 4)
                };
              }
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.interactSpeed} × ${v.interactTime}?`,
              getOptions: (v) => generateDistractors(v.interactDistance),
              correctAnswer: (v) => v.interactDistance,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactSpeed} × ${v.interactTime} = **${v.interactDistance} ${v.distanceUnit}**. Distance = Speed × Time! ✓`,
                incorrect: (v) => `Not quite! Distance = Speed × Time = ${v.interactSpeed} × ${v.interactTime} = **${v.interactDistance} ${v.distanceUnit}**.`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "The distance rule recipe!",
            bodyParts: [
              { type: "text", content: () => `To find how far something travels:` },
              { type: "visual", component: "SDTTriangle", props: () => ({ cover: "D", label: "Cover D to find Distance" }) },
              {
                type: "visual",
                component: "WorkedExample",
                props: () => ({
                  steps: [
                    { text: "Step 1: Find the speed", why: "How fast? Read it from the question." },
                    { text: "Step 2: Find the time", why: "How long? Make sure it's in hours if speed is per hour!" },
                    { text: "Step 3: Multiply speed × time", why: "Distance = Speed × Time — that's it!" },
                    { text: "Check: does the answer make sense?", why: "A car at 60 mph for 2 hours = 120 miles. ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Curiosity Hook ----
      {
        id: "calculate-distance-curiosity",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to apply the distance rule to real journeys and races",
          "When to watch out for using the wrong units in distance calculations"
        ],
        variableSets: [
          {
            name: "Sophie",
            scenario: "is on a road trip and wondering how far the family has driven",
            speed: 50,
            time: 3,
            distance: 150,
            speedUnit: "mph",
            timeUnit: "hours",
            distanceUnit: "miles",
            funFact: "That's about Bournemouth to Bristol and back!",
            interactSpeed: 40,
            interactTime: 4,
            interactDistance: 160
          },
          {
            name: "Marcus",
            scenario: "wants to know how far a cheetah runs in a real chase",
            speed: 100,
            time: 1,
            distance: 100,
            speedUnit: "km/h",
            timeUnit: "hour",
            distanceUnit: "km",
            funFact: "Cheetahs can only keep this up for about 60 seconds though!",
            interactSpeed: 80,
            interactTime: 2,
            interactDistance: 160
          },
          {
            name: "Holly",
            scenario: "timed how long the school bus took on the motorway",
            speed: 55,
            time: 2,
            distance: 110,
            speedUnit: "mph",
            timeUnit: "hours",
            distanceUnit: "miles",
            funFact: "That's longer than a marathon — from the comfort of a seat!",
            interactSpeed: 45,
            interactTime: 3,
            interactDistance: 135
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `How far at ${v.speed} ${v.speedUnit}?`,
            body: (v) => `${v.name} ${v.scenario}.\nThey've been going at **${v.speed} ${v.speedUnit}** for **${v.time} ${v.timeUnit}**.\nCan you figure out the distance without a sat-nav? All you need is a **one-step multiplication**!`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: 0,
                max: v.distance,
                points: [
                  { value: 0, label: "Start", color: "#818cf8" },
                  { value: v.distance, label: `? ${v.distanceUnit}`, color: "#f87171" }
                ],
                jumps: [{ from: 0, to: v.distance, label: `${v.time} ${v.timeUnit}` }],
                tickInterval: Math.round(v.distance / 4)
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Just multiply!",
            bodyParts: [
              { type: "text", content: (v) => `Speed tells you how far you go in **one** unit of time.\nSo in **${v.time} ${v.timeUnit}**, you go ${v.time} lots of ${v.speed}:\n\n**${v.speed} × ${v.time} = ${v.distance} ${v.distanceUnit}**\n\n${v.funFact}` },
              { type: "visual", component: "SDTTriangle", props: () => ({ cover: "D", label: "Cover D to find Distance" }) },
              {
                type: "visual",
                component: "WorkedExample",
                props: (v) => ({
                  steps: [
                    { text: `Speed = ${v.speed} ${v.speedUnit}`, why: `That's ${v.speed} ${v.distanceUnit} every hour` },
                    { text: `Time = ${v.time} ${v.timeUnit}`, why: `So that's ${v.time} lots of ${v.speed}` },
                    { text: `Distance = ${v.speed} × ${v.time}`, result: `= ${v.distance} ${v.distanceUnit} ✓` }
                  ],
                  allRevealed: false
                })
              }
            ],
            interaction: { type: "tap-to-reveal" }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Travelling at **${v.interactSpeed} ${v.speedUnit}** for **${v.interactTime} ${v.timeUnit}**. What's the distance?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Distance = Speed × Time = ${v.interactSpeed} × ${v.interactTime} = ?` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.interactSpeed} × ${v.interactTime}?`,
              getOptions: (v) => generateDistractors(v.interactDistance),
              correctAnswer: (v) => v.interactDistance,
              feedback: {
                correct: (v) => `Spot on! **${v.interactDistance} ${v.distanceUnit}**. Just multiply and you're done! ✓`,
                incorrect: (v) => `Not quite! ${v.interactSpeed} × ${v.interactTime} = **${v.interactDistance} ${v.distanceUnit}**. Distance = Speed × Time.`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Distance = Speed × Time!",
            bodyParts: [
              { type: "text", content: () => `Remember this simple recipe:` },
              { type: "visual", component: "SDTTriangle", props: () => ({ cover: "D", label: "Cover D → S × T" }) },
              {
                type: "visual",
                component: "WorkedExample",
                props: () => ({
                  steps: [
                    { text: "Distance = Speed × Time", why: "Multiply to find how far!" },
                    { text: "Speed = how far per unit of time", why: "e.g. 60 mph = 60 miles every hour" },
                    { text: "More time at the same speed = more distance!", why: "It's just repeated addition — multiplication! ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 3: calculate-time
  // Time = Distance ÷ Speed
  // Category: core
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "calculate-time",
    name: "Time = Distance ÷ Speed",
    category: "core",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "calculate-time-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to calculate time using distance and speed",
          "Why time equals distance divided by speed"
        ],
        variableSets: [
          {
            name: "Ben",
            scenario: "is driving from London to Brighton at a steady speed",
            distance: 120,
            speed: 60,
            time: 2,
            distanceUnit: "miles",
            speedUnit: "mph",
            timeUnit: "hours",
            interactDistance: 150,
            interactSpeed: 50,
            interactTime: 3
          },
          {
            name: "Daisy",
            scenario: "is cycling to her friend's house",
            distance: 24,
            speed: 12,
            time: 2,
            distanceUnit: "km",
            speedUnit: "km/h",
            timeUnit: "hours",
            interactDistance: 45,
            interactSpeed: 15,
            interactTime: 3
          },
          {
            name: "Tom",
            scenario: "is walking to school",
            distance: 3,
            speed: 6,
            time: 0.5,
            timeInMinutes: 30,
            distanceUnit: "km",
            speedUnit: "km/h",
            timeUnit: "hours",
            interactDistance: 8,
            interactSpeed: 4,
            interactTime: 2
          },
          {
            name: "Grace",
            scenario: "is on a train from Manchester to Leeds",
            distance: 70,
            speed: 140,
            time: 0.5,
            timeInMinutes: 30,
            distanceUnit: "miles",
            speedUnit: "mph",
            timeUnit: "hours",
            interactDistance: 180,
            interactSpeed: 120,
            interactTime: 1.5
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `How long will it take?`,
            body: (v) => `${v.name} ${v.scenario}.\nThe journey is **${v.distance} ${v.distanceUnit}** and they travel at **${v.speed} ${v.speedUnit}**.\nWe know how far and how fast — but how **long** will it take?`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: 0,
                max: v.distance,
                points: [
                  { value: 0, label: "Start", color: "#818cf8" },
                  { value: v.distance, label: `${v.distance} ${v.distanceUnit}`, color: "#34d399" }
                ],
                jumps: [{ from: 0, to: v.distance, label: `${v.speed} ${v.speedUnit} — how long?` }],
                tickInterval: Math.round(v.distance / 4)
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Time = Distance ÷ Speed",
            bodyParts: [
              { type: "text", content: (v) => `To find the time, **divide** the distance by the speed.\n\n**Time = Distance ÷ Speed**\n\nThink of it like this: if you go ${v.speed} ${v.distanceUnit} every hour, how many hours does it take to cover ${v.distance} ${v.distanceUnit}?` },
              { type: "visual", component: "SDTTriangle", props: () => ({ cover: "T", label: "Cover T to find Time" }) },
              {
                type: "visual",
                component: "WorkedExample",
                props: (v) => ({
                  steps: [
                    { text: "Write the rule", why: "Time = Distance ÷ Speed", result: "T = D ÷ S" },
                    { text: `Plug in the numbers`, why: `Distance = ${v.distance}, Speed = ${v.speed}`, result: `T = ${v.distance} ÷ ${v.speed}` },
                    { text: `Calculate`, why: "Divide distance by speed", result: `= ${v.time} ${v.timeUnit} ✓` }
                  ],
                  allRevealed: false
                })
              }
            ],
            interaction: { type: "tap-to-reveal" }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `${v.name} travels **${v.interactDistance} ${v.distanceUnit}** at **${v.interactSpeed} ${v.speedUnit}**. How long does it take?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Time = Distance ÷ Speed = ${v.interactDistance} ÷ ${v.interactSpeed} = ?` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.interactDistance} ÷ ${v.interactSpeed}?`,
              getOptions: (v) => generateDistractors(v.interactTime),
              correctAnswer: (v) => v.interactTime,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactDistance} ÷ ${v.interactSpeed} = **${v.interactTime} ${v.timeUnit}**. Time = Distance ÷ Speed! ✓`,
                incorrect: (v) => `Not quite! Time = Distance ÷ Speed = ${v.interactDistance} ÷ ${v.interactSpeed} = **${v.interactTime} ${v.timeUnit}**.`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "The time rule recipe!",
            bodyParts: [
              { type: "text", content: () => `To find how long a journey takes:` },
              { type: "visual", component: "SDTTriangle", props: () => ({ cover: "T", label: "Cover T to find Time" }) },
              {
                type: "visual",
                component: "WorkedExample",
                props: () => ({
                  steps: [
                    { text: "Step 1: Find the distance", why: "How far? Read it from the question." },
                    { text: "Step 2: Find the speed", why: "How fast? Check the units." },
                    { text: "Step 3: Divide distance by speed", why: "Time = Distance ÷ Speed — that's it!" },
                    { text: "Watch out for decimal answers!", why: "0.5 hours = 30 minutes. Convert if asked! ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot the Mistake ----
      {
        id: "calculate-time-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid dividing speed by distance instead of the other way round",
          "When to watch out for giving a decimal answer when minutes are needed"
        ],
        variableSets: [
          {
            name: "Isaac",
            scenario: "drove 200 miles at 50 mph",
            distance: 200,
            speed: 50,
            wrongTime: 10000,
            wrongMethod: "multiplied instead of dividing: 200 × 50 = 10,000",
            correctTime: 4,
            correctMethod: "200 ÷ 50 = 4 hours",
            distanceUnit: "miles",
            speedUnit: "mph",
            timeUnit: "hours",
            mistake: "multiplied distance × speed instead of dividing",
            interactDistance: 180,
            interactSpeed: 60,
            interactCorrectTime: 3
          },
          {
            name: "Nadia",
            scenario: "ran 10 km at 5 km/h",
            distance: 10,
            speed: 5,
            wrongTime: 50,
            wrongMethod: "multiplied instead of dividing: 10 × 5 = 50",
            correctTime: 2,
            correctMethod: "10 ÷ 5 = 2 hours",
            distanceUnit: "km",
            speedUnit: "km/h",
            timeUnit: "hours",
            mistake: "multiplied distance × speed instead of dividing",
            interactDistance: 30,
            interactSpeed: 10,
            interactCorrectTime: 3
          },
          {
            name: "Jake",
            scenario: "cycled 30 km at 15 km/h",
            distance: 30,
            speed: 15,
            wrongTime: 450,
            wrongMethod: "multiplied instead of dividing: 30 × 15 = 450",
            correctTime: 2,
            correctMethod: "30 ÷ 15 = 2 hours",
            distanceUnit: "km",
            speedUnit: "km/h",
            timeUnit: "hours",
            mistake: "multiplied distance × speed instead of dividing",
            interactDistance: 60,
            interactSpeed: 20,
            interactCorrectTime: 3
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `${v.name} got the wrong answer!`,
            bodyParts: [
              { type: "text", content: (v) => `${v.name} ${v.scenario}.\n${v.name} says the journey took **${v.wrongTime} ${v.timeUnit}**.\n\nThat can't be right! Can you spot the mistake?` },
              { type: "visual", component: "SDTTriangle", props: () => ({ cover: "T", label: "Cover T to find Time" }) },
              {
                type: "visual",
                component: "WorkedExample",
                props: (v) => ({
                  steps: [
                    { text: `${v.name}'s working: ${v.distance} × ${v.speed} = ${v.wrongTime}`, why: "Does this look right?" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Divide, don't multiply!",
            bodyParts: [
              { type: "text", content: (v) => `${v.name} ${v.mistake}.\n\nTo find **time**, you need to **divide** distance by speed — not multiply!\n\n**Time = Distance ÷ Speed**` },
              { type: "visual", component: "SDTTriangle", props: () => ({ cover: "T", label: "Cover T to find Time" }) },
              {
                type: "visual",
                component: "WorkedExample",
                props: (v) => ({
                  steps: [
                    { text: `WRONG: ${v.distance} × ${v.speed} = ${v.wrongTime}`, why: "Multiplying gives a huge number — clearly wrong!" },
                    { text: `RIGHT: ${v.distance} ÷ ${v.speed}`, why: "Divide distance by speed to get time", result: `= ${v.correctTime} ${v.timeUnit} ✓` }
                  ],
                  allRevealed: false
                })
              }
            ],
            interaction: { type: "tap-to-reveal" }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `A journey of **${v.interactDistance} ${v.distanceUnit}** at **${v.interactSpeed} ${v.speedUnit}**. How long does it take?`,
            visual: {
              component: "SDTTriangle",
              props: () => ({ cover: "T", label: "Cover T → D ÷ S" })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.interactDistance} ÷ ${v.interactSpeed}?`,
              getOptions: (v) => generateDistractors(v.interactCorrectTime),
              correctAnswer: (v) => v.interactCorrectTime,
              feedback: {
                correct: (v) => `Well done! ${v.interactDistance} ÷ ${v.interactSpeed} = **${v.interactCorrectTime} ${v.timeUnit}**. Remember: for time, always DIVIDE! ✓`,
                incorrect: (v) => `Not quite! Time = Distance ÷ Speed = ${v.interactDistance} ÷ ${v.interactSpeed} = **${v.interactCorrectTime} ${v.timeUnit}**.`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Time = DIVIDE, never multiply!",
            bodyParts: [
              { type: "text", content: () => `The most common mistake is multiplying instead of dividing:` },
              { type: "visual", component: "SDTTriangle", props: () => ({ cover: "T", label: "Cover T → D ÷ S" }) },
              {
                type: "visual",
                component: "WorkedExample",
                props: () => ({
                  steps: [
                    { text: "Time = Distance ÷ Speed", why: "Always divide when finding time!" },
                    { text: "If the answer seems huge, you've probably multiplied", why: "A 200-mile journey can't take 10,000 hours!" },
                    { text: "Sense-check your answer", why: "Walking ≈ 1 hour per 5 km. Driving ≈ 1 hour per 60 miles. ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 4: sdt-triangle
  // The SDT triangle and how to use it
  // Category: core
  // Lesson A: visual-discovery | Lesson B: key-fact
  // ==========================================
  {
    id: "sdt-triangle",
    name: "The SDT Triangle",
    category: "core",
    lessons: [
      // ---- Lesson A: Visual Discovery ----
      {
        id: "sdt-triangle-discovery",
        templateType: "visual-discovery",
        learningGoal: [
          "How to use the speed-distance-time triangle",
          "How to cover up the value you want to find"
        ],
        variableSets: [
          {
            name: "Lily",
            scenario: "is learning how to remember all three SDT rules at once",
            findWhat: "speed",
            distance: 100,
            time: 4,
            answer: 25,
            formula: "Speed = Distance ÷ Time",
            coverUp: "S",
            whatRemains: "D ÷ T",
            answerUnit: "mph",
            distanceUnit: "miles",
            timeUnit: "hours",
            interactFindWhat: "distance",
            interactCoverUp: "D",
            interactWhatRemains: "S × T",
            interactFormula: "Distance = Speed × Time"
          },
          {
            name: "Oscar",
            scenario: "wants a quick way to remember which rule to use",
            findWhat: "distance",
            distance: 150,
            time: 3,
            answer: 150,
            formula: "Distance = Speed × Time",
            speed: 50,
            coverUp: "D",
            whatRemains: "S × T",
            answerUnit: "miles",
            distanceUnit: "miles",
            timeUnit: "hours",
            interactFindWhat: "time",
            interactCoverUp: "T",
            interactWhatRemains: "D ÷ S",
            interactFormula: "Time = Distance ÷ Speed"
          },
          {
            name: "Ella",
            scenario: "keeps forgetting whether to multiply or divide",
            findWhat: "time",
            distance: 200,
            time: 4,
            answer: 4,
            formula: "Time = Distance ÷ Speed",
            speed: 50,
            coverUp: "T",
            whatRemains: "D ÷ S",
            answerUnit: "hours",
            distanceUnit: "miles",
            timeUnit: "hours",
            interactFindWhat: "speed",
            interactCoverUp: "S",
            interactWhatRemains: "D ÷ T",
            interactFormula: "Speed = Distance ÷ Time"
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: () => "One triangle, three rules!",
            bodyParts: [
              { type: "text", content: (v) => `${v.name} ${v.scenario}.\nThere's a brilliant trick: the **SDT triangle**. To find any value, just **cover it up** and read what's left!` },
              { type: "visual", component: "SDTTriangle", props: () => ({ label: "The SDT Triangle" }) },
              { type: "text", content: () => `**D** (Distance) on top, **S** (Speed) and **T** (Time) on the bottom. The **÷** means divide, the **×** means multiply.` }
            ],
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Cover up what you want to find!",
            bodyParts: [
              { type: "text", content: (v) => `${v.name} wants to find **${v.findWhat}**. Cover up **${v.coverUp}** in the triangle:` },
              { type: "visual", component: "SDTTriangle", props: (v) => ({ cover: v.coverUp, label: `Cover ${v.coverUp} → ${v.whatRemains}` }) },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: () => ({
                  steps: [
                    { text: "Cover S → D ÷ T", why: "Speed = Distance ÷ Time" },
                    { text: "Cover D → S × T", why: "Distance = Speed × Time" },
                    { text: "Cover T → D ÷ S", why: "Time = Distance ÷ Speed" }
                  ],
                  allRevealed: false
                })
              },
              { type: "text", content: (v) => `So: **${v.formula}** ✓` }
            ],
            interaction: { type: "tap-to-reveal" }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Your turn — use the triangle!",
            body: (v) => `Now you need to find the **${v.interactFindWhat}**. Which letter do you cover up?`,
            visual: {
              component: "SDTTriangle",
              props: () => ({})
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `To find ${v.interactFindWhat}, which letter do you cover?`,
              getOptions: () => ["S", "D", "T", "S × T", "D ÷ T"],
              correctAnswer: (v) => v.interactCoverUp,
              feedback: {
                correct: (v) => `That's right! Cover **${v.interactCoverUp}** and you see **${v.interactWhatRemains}**. So ${v.interactFormula}! ✓`,
                incorrect: (v) => `Not quite! To find ${v.interactFindWhat}, cover up **${v.interactCoverUp}**. What's left is **${v.interactWhatRemains}** — so ${v.interactFormula}.`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "The SDT triangle — your secret weapon!",
            bodyParts: [
              { type: "text", content: () => "Draw this triangle and you'll never forget the rules:" },
              { type: "visual", component: "SDTTriangle", props: () => ({ label: "Memorise this!" }) },
              {
                type: "visual",
                component: "WorkedExample",
                props: () => ({
                  steps: [
                    { text: "Cover what you want to find", why: "Then read what's left" },
                    { text: "Speed = D ÷ T", why: "Cover the S" },
                    { text: "Distance = S × T", why: "Cover the D" },
                    { text: "Time = D ÷ S", why: "Cover the T ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Key Fact ----
      {
        id: "sdt-triangle-keyfact",
        templateType: "key-fact",
        learningGoal: [
          "How to apply the SDT (Speed, Distance, Time) triangle to quickly choose the right rule",
          "When to watch out for covering up the wrong letter in the triangle"
        ],
        variableSets: [
          {
            name: "Charlie",
            scenario: "is doing an 11+ practice paper and needs to pick the right rule fast",
            findWhat: "distance",
            coverUp: "D",
            whatRemains: "S × T",
            formula: "Distance = Speed × Time",
            speed: 40,
            time: 3,
            answer: 120,
            answerUnit: "miles"
          },
          {
            name: "Ravi",
            scenario: "has a speed-distance-time question and wants to remember which way to calculate",
            findWhat: "speed",
            coverUp: "S",
            whatRemains: "D ÷ T",
            formula: "Speed = Distance ÷ Time",
            distance: 90,
            time: 3,
            answer: 30,
            answerUnit: "km/h"
          },
          {
            name: "Priya",
            scenario: "is racing through an exam paper and needs to work out time quickly",
            findWhat: "time",
            coverUp: "T",
            whatRemains: "D ÷ S",
            formula: "Time = Distance ÷ Speed",
            distance: 200,
            speed: 50,
            answer: 4,
            answerUnit: "hours"
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: () => "One triangle rules them all!",
            bodyParts: [
              { type: "text", content: (v) => `${v.name} ${v.scenario}.\nInstead of remembering three separate rules, just draw **one triangle** and cover up what you want!` },
              { type: "visual", component: "SDTTriangle", props: () => ({ label: "The SDT Triangle" }) }
            ],
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "The key fact to memorise!",
            bodyParts: [
              { type: "text", content: (v) => `${v.name} wants to find **${v.findWhat}**. Cover up **${v.coverUp}**:` },
              { type: "visual", component: "SDTTriangle", props: (v) => ({ cover: v.coverUp, label: `Cover ${v.coverUp} → ${v.whatRemains}` }) },
              {
                type: "visual",
                component: "WorkedExample",
                props: () => ({
                  steps: [
                    { text: "Want Speed? Cover S → D ÷ T", why: "Speed = Distance ÷ Time" },
                    { text: "Want Distance? Cover D → S × T", why: "Distance = Speed × Time" },
                    { text: "Want Time? Cover T → D ÷ S", why: "Time = Distance ÷ Speed ✓" }
                  ],
                  allRevealed: false
                })
              }
            ],
            interaction: { type: "tap-to-reveal" }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: (v) => `Find the ${v.findWhat}!`,
            body: (v) => v.findWhat === "distance"
              ? `Speed = **${v.speed} ${v.answerUnit.replace('miles','mph').replace('km','km/h')}** and Time = **${v.time} hours**. Cover **D** — what formula do you get?`
              : v.findWhat === "speed"
              ? `Distance = **${v.distance} ${v.answerUnit === 'km/h' ? 'km' : 'miles'}** and Time = **${v.time} hours**. Cover **S** — what formula do you get?`
              : `Distance = **${v.distance} ${v.answerUnit === 'hours' ? 'miles' : 'km'}** and Speed = **${v.speed} mph**. Cover **T** — what formula do you get?`,
            visual: {
              component: "SDTTriangle",
              props: (v) => ({ cover: v.coverUp, label: `Cover ${v.coverUp} → ${v.whatRemains}` })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the ${v.findWhat}?`,
              getOptions: (v) => generateDistractors(v.answer),
              correctAnswer: (v) => v.answer,
              feedback: {
                correct: (v) => `Spot on! ${v.formula} = **${v.answer} ${v.answerUnit}**. The triangle never lies! ✓`,
                incorrect: (v) => `Not quite! ${v.formula}. Work it out: the answer is **${v.answer} ${v.answerUnit}**.`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "SDT triangle — memorise this!",
            bodyParts: [
              { type: "text", content: () => "Draw this triangle on your exam paper first thing:" },
              { type: "visual", component: "SDTTriangle", props: () => ({ label: "Draw it in 3 seconds!" }) },
              {
                type: "visual",
                component: "WorkedExample",
                props: () => ({
                  steps: [
                    { text: "Cover the letter you need to find", why: "What's left tells you the rule" },
                    { text: "Top over bottom = divide", why: "Speed = D ÷ T, Time = D ÷ S" },
                    { text: "Bottom across = multiply", why: "Distance = S × T ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 5: minutes-to-hours
  // Converting minutes ↔ hours for SDT
  // Category: supporting
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "minutes-to-hours",
    name: "Converting Minutes to Hours for SDT",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "minutes-to-hours-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to convert (change) minutes into hours for speed calculations",
          "Why 30 minutes is 0.5 hours, not 0.30 hours"
        ],
        variableSets: [
          {
            name: "Holly",
            scenario: "ran 6 km in 30 minutes and wants to find her speed in km/h",
            minutes: 30,
            hours: 0.5,
            hoursAsFraction: "30/60",
            distance: 6,
            speed: 12,
            distanceUnit: "km",
            speedUnit: "km/h",
            wrongHours: 0.30,
            wrongSpeed: 20,
            interactMinutes: 45,
            interactHours: 0.75
          },
          {
            name: "Tom",
            scenario: "cycled 10 km in 45 minutes and wants his speed in km/h",
            minutes: 45,
            hours: 0.75,
            hoursAsFraction: "45/60",
            distance: 10,
            speed: 13.3,
            distanceUnit: "km",
            speedUnit: "km/h",
            wrongHours: 0.45,
            wrongSpeed: 22.2,
            interactMinutes: 15,
            interactHours: 0.25
          },
          {
            name: "Ella",
            scenario: "drove 20 miles in 15 minutes and wants the speed in mph",
            minutes: 15,
            hours: 0.25,
            hoursAsFraction: "15/60",
            distance: 20,
            speed: 80,
            distanceUnit: "miles",
            speedUnit: "mph",
            wrongHours: 0.15,
            wrongSpeed: 133.3,
            interactMinutes: 30,
            interactHours: 0.5
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `${v.minutes} minutes — but the speed is per HOUR!`,
            bodyParts: [
              { type: "text", content: (v) => `${v.name} ${v.scenario}.\nThe speed is in **${v.speedUnit}** — that's per **hour**. But the time is in **minutes**. You can't just use ${v.minutes} in the rule!\nYou need to **convert (change) minutes to hours** first.` },
              { type: "visual", component: "SDTTriangle", props: () => ({ cover: "S", label: "Finding Speed — but convert time first!" }) },
              {
                type: "visual",
                component: "WorkedExample",
                props: (v) => ({
                  steps: [
                    { text: `Time given: ${v.minutes} minutes`, why: "But we need hours!" },
                    { text: `${v.minutes} minutes is NOT ${v.wrongHours} hours!`, why: "This is the most common trap!" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Divide minutes by 60!",
            body: (v) => `There are **60 minutes** in an hour. So to convert minutes to hours, divide by 60:\n\n**${v.minutes} ÷ 60 = ${v.hours} hours**\n\n**Key conversions to memorise:**\n15 min = 0.25 hrs (¼) | 30 min = 0.5 hrs (½) | 45 min = 0.75 hrs (¾) | 20 min = ⅓ hr ≈ 0.333`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.minutes} minutes ÷ 60`, why: "60 minutes in one hour", result: `= ${v.hours} hours` },
                  { text: `Now: Speed = Distance ÷ Time`, why: `Speed = ${v.distance} ÷ ${v.hours}`, result: `= ${v.speed} ${v.speedUnit} ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Convert **${v.interactMinutes} minutes** into hours. Remember: divide by 60!`,
            visual: {
              component: "NumberLine",
              props: (v) => ({
                min: 0,
                max: 60,
                points: [
                  { value: 0, label: "0 min", color: "#818cf8" },
                  { value: v.interactMinutes, label: `${v.interactMinutes} min`, color: "#34d399" },
                  { value: 60, label: "60 min = 1 hr", color: "#f87171" }
                ],
                jumps: [],
                tickInterval: 15
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactMinutes} minutes = ? hours`,
              getOptions: (v) => generateDistractors(v.interactHours * 100).map(x => x / 100),
              correctAnswer: (v) => v.interactHours,
              feedback: {
                correct: (v) => `Yes! ${v.interactMinutes} ÷ 60 = **${v.interactHours} hours**. Always divide by 60, never just move the decimal! ✓`,
                incorrect: (v) => `Not quite! ${v.interactMinutes} ÷ 60 = **${v.interactHours} hours**. Remember: 60 minutes = 1 hour, so divide by 60.`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Quick recap!",
            bodyParts: [
              { type: "text", content: (v) => `To convert minutes to hours, **divide by 60**. Remember: ${v.minutes} min ÷ 60 = ${v.hours} hours — NOT ${v.wrongHours}! Always divide by 60, never just move the decimal. ✓` },
              { type: "visual", component: "SDTTriangle", props: () => ({ cover: "S", label: "Convert time before using the triangle!" }) }
            ],
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot the Mistake ----
      {
        id: "minutes-to-hours-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid the 0.30 hours trap when converting 30 minutes",
          "When to watch out for treating minutes as decimals of an hour"
        ],
        variableSets: [
          {
            name: "Ben",
            scenario: "ran 5 km in 30 minutes",
            minutes: 30,
            wrongHours: 0.30,
            correctHours: 0.5,
            distance: 5,
            wrongSpeed: 16.7,
            correctSpeed: 10,
            distanceUnit: "km",
            speedUnit: "km/h",
            mistake: "wrote 30 minutes as 0.30 hours instead of 0.5 hours",
            interactDistance: 9,
            interactCorrectHours: 0.75,
            interactMinutes: 45,
            interactCorrectSpeed: 12
          },
          {
            name: "Grace",
            scenario: "drove 30 miles in 45 minutes",
            minutes: 45,
            wrongHours: 0.45,
            correctHours: 0.75,
            distance: 30,
            wrongSpeed: 66.7,
            correctSpeed: 40,
            distanceUnit: "miles",
            speedUnit: "mph",
            mistake: "wrote 45 minutes as 0.45 hours instead of 0.75 hours",
            interactDistance: 15,
            interactCorrectHours: 0.25,
            interactMinutes: 15,
            interactCorrectSpeed: 60
          },
          {
            name: "Ravi",
            scenario: "cycled 5 km in 15 minutes",
            minutes: 15,
            wrongHours: 0.15,
            correctHours: 0.25,
            distance: 5,
            wrongSpeed: 33.3,
            correctSpeed: 20,
            distanceUnit: "km",
            speedUnit: "km/h",
            mistake: "wrote 15 minutes as 0.15 hours instead of 0.25 hours",
            interactDistance: 12,
            interactCorrectHours: 0.5,
            interactMinutes: 30,
            interactCorrectSpeed: 24
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `${v.name}'s conversion went wrong!`,
            bodyParts: [
              { type: "text", content: (v) => `${v.name} ${v.scenario}.\n${v.name} converted the time like this: "${v.minutes} minutes = ${v.wrongHours} hours".\nThen calculated speed = ${v.distance} ÷ ${v.wrongHours} = ${v.wrongSpeed} ${v.speedUnit}.\n\nCan you spot the mistake?` },
              { type: "visual", component: "SDTTriangle", props: () => ({ cover: "S", label: "Finding Speed — but is the time right?" }) },
              {
                type: "visual",
                component: "WorkedExample",
                props: (v) => ({
                  steps: [
                    { text: `${v.name}'s working: ${v.minutes} min = ${v.wrongHours} hours`, why: "Is this conversion correct?" },
                    { text: `Speed = ${v.distance} ÷ ${v.wrongHours} = ${v.wrongSpeed} ${v.speedUnit}`, why: "Does this speed make sense?" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Minutes are NOT decimals of an hour!",
            body: (v) => `${v.name} ${v.mistake}.\n\n**${v.minutes} minutes is NOT ${v.wrongHours} hours!**\nTo convert: divide by 60 (because there are 60 minutes in an hour).\n\n${v.minutes} ÷ 60 = **${v.correctHours} hours**`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `WRONG: ${v.minutes} min = ${v.wrongHours} hours`, why: "Just moving the decimal point doesn't work!" },
                  { text: `RIGHT: ${v.minutes} ÷ 60 = ${v.correctHours} hours`, why: "Always divide by 60" },
                  { text: `Correct speed: ${v.distance} ÷ ${v.correctHours} = ${v.correctSpeed} ${v.speedUnit}`, result: "✓" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `What is the correct speed for ${v.interactDistance} ${v.distanceUnit} in ${v.interactMinutes} minutes?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Time: ${v.interactMinutes} ÷ 60 = ${v.interactCorrectHours} hours` },
                  { text: `Speed = ${v.interactDistance} ÷ ${v.interactCorrectHours} = ?` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.interactDistance} ÷ ${v.interactCorrectHours}?`,
              getOptions: (v) => generateDistractors(v.interactCorrectSpeed),
              correctAnswer: (v) => v.interactCorrectSpeed,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactDistance} ÷ ${v.interactCorrectHours} = **${v.interactCorrectSpeed} ${v.speedUnit}**. You converted the minutes properly! ✓`,
                incorrect: (v) => `Not quite! First convert: ${v.interactMinutes} min = ${v.interactCorrectHours} hours. Then ${v.interactDistance} ÷ ${v.interactCorrectHours} = **${v.interactCorrectSpeed} ${v.speedUnit}**.`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Never just move the decimal!",
            bodyParts: [
              { type: "text", content: () => `The most common SDT mistake is converting minutes wrong:` },
              { type: "visual", component: "SDTTriangle", props: () => ({ cover: "S", label: "Convert time before finding Speed!" }) },
              {
                type: "visual",
                component: "WorkedExample",
                props: () => ({
                  steps: [
                    { text: "30 min = 0.5 hours (NOT 0.30!)", why: "30 ÷ 60 = 0.5" },
                    { text: "45 min = 0.75 hours (NOT 0.45!)", why: "45 ÷ 60 = 0.75" },
                    { text: "15 min = 0.25 hours (NOT 0.15!)", why: "15 ÷ 60 = 0.25" },
                    { text: "Always DIVIDE by 60!", why: "Minutes and hours are NOT decimal! ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 6: metres-to-km
  // Converting metres ↔ kilometres for SDT
  // Category: supporting
  // Lesson A: key-fact | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "metres-to-km",
    name: "Converting Metres to Kilometres for SDT",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Key Fact ----
      {
        id: "metres-to-km-keyfact",
        templateType: "key-fact",
        learningGoal: [
          "How to convert (change) metres to kilometres",
          "When to change the units before calculating speed"
        ],
        variableSets: [
          {
            name: "Jake",
            scenario: "ran 1500 metres in a park run and wants his speed in km/h",
            metres: 1500,
            km: 1.5,
            time: 0.25,
            timeMinutes: 15,
            speed: 6,
            speedUnit: "km/h",
            interactMetres: 2500,
            interactKm: 2.5
          },
          {
            name: "Sophie",
            scenario: "walked 2000 metres to school and wants her speed in km/h",
            metres: 2000,
            km: 2,
            time: 0.5,
            timeMinutes: 30,
            speed: 4,
            speedUnit: "km/h",
            interactMetres: 3500,
            interactKm: 3.5
          },
          {
            name: "Isaac",
            scenario: "swam 800 metres in a lake race and wants to know his speed in km/h",
            metres: 800,
            km: 0.8,
            time: 0.5,
            timeMinutes: 30,
            speed: 1.6,
            speedUnit: "km/h",
            interactMetres: 1200,
            interactKm: 1.2
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: () => "Metres or kilometres?",
            bodyParts: [
              { type: "text", content: (v) => `${v.name} ${v.scenario}.\nBut the distance is in **metres** and the speed is in **km/h**. You can't mix them up!\nThere's one key fact that sorts this out instantly...` },
              { type: "visual", component: "SDTTriangle", props: () => ({ cover: "S", label: "Finding Speed — convert distance first!" }) },
              {
                type: "visual",
                component: "WorkedExample",
                props: (v) => ({
                  steps: [
                    { text: "Key fact: 1,000 metres = 1 kilometre", why: "To convert metres to km, divide by 1,000" },
                    { text: `${v.metres} m ÷ 1,000 = ${v.km} km`, result: `${v.metres} m = ${v.km} km` }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "1000 metres = 1 kilometre!",
            body: (v) => `The key fact:\n**1 km = 1000 m**\n\nTo convert metres to km: **divide by 1000**\nTo convert km to metres: **multiply by 1000**\n\n${v.metres} m ÷ 1000 = **${v.km} km**`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: "1 km = 1000 m", why: "'Kilo' means thousand!" },
                  { text: `${v.metres} m ÷ 1000 = ${v.km} km`, why: "Divide by 1000 to go from m to km", result: `= ${v.km} km ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Convert **${v.interactMetres} metres** to kilometres.`,
            visual: {
              component: "NumberLine",
              props: () => ({
                min: 0,
                max: 4,
                points: [
                  { value: 0, label: "0 km", color: "#818cf8" },
                  { value: 1, label: "1 km", color: "#c084fc" },
                  { value: 2, label: "2 km", color: "#c084fc" },
                  { value: 3, label: "3 km", color: "#c084fc" },
                  { value: 4, label: "4 km", color: "#c084fc" }
                ],
                jumps: [],
                tickInterval: 0.5
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactMetres} metres = ? km`,
              getOptions: (v) => generateDistractors(v.interactKm * 10).map(x => x / 10),
              correctAnswer: (v) => v.interactKm,
              feedback: {
                correct: (v) => `Spot on! ${v.interactMetres} ÷ 1000 = **${v.interactKm} km**. Divide by 1000 every time! ✓`,
                incorrect: (v) => `Not quite! ${v.interactMetres} ÷ 1000 = **${v.interactKm} km**. Remember: 1000 metres = 1 kilometre.`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Metres ↔ kilometres!",
            bodyParts: [
              { type: "text", content: () => `Key conversions to know:` },
              { type: "visual", component: "SDTTriangle", props: () => ({ cover: "S", label: "Convert distance before finding Speed!" }) },
              {
                type: "visual",
                component: "WorkedExample",
                props: () => ({
                  steps: [
                    { text: "Metres → km: divide by 1000", why: "Move the decimal point 3 places left" },
                    { text: "km → metres: multiply by 1000", why: "Move the decimal point 3 places right" },
                    { text: "Always convert BEFORE calculating speed", why: "Don't mix m and km in the same calculation!" },
                    { text: "500 m = 0.5 km, 1500 m = 1.5 km, 2500 m = 2.5 km", why: "'Kilo' means thousand! ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot the Mistake ----
      {
        id: "metres-to-km-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid dividing by 100 instead of 1000 when converting metres to km",
          "When to watch out for mixing metres and kilometres in the same calculation"
        ],
        variableSets: [
          {
            name: "Daisy",
            scenario: "ran 1500 m in 0.5 hours",
            metres: 1500,
            km: 1.5,
            time: 0.5,
            wrongSpeed: 3000,
            correctSpeed: 3,
            speedUnit: "km/h",
            mistake: "used metres instead of km: 1500 ÷ 0.5 = 3000 km/h — impossible!",
            interactMetres: 2000,
            interactKm: 2,
            interactTime: 0.5,
            interactCorrectSpeed: 4
          },
          {
            name: "Finn",
            scenario: "walked 2500 m in 0.5 hours",
            metres: 2500,
            km: 2.5,
            time: 0.5,
            wrongSpeed: 5000,
            correctSpeed: 5,
            speedUnit: "km/h",
            mistake: "used metres instead of km: 2500 ÷ 0.5 = 5000 km/h — faster than a plane!",
            interactMetres: 3000,
            interactKm: 3,
            interactTime: 0.75,
            interactCorrectSpeed: 4
          },
          {
            name: "Aisha",
            scenario: "swam 400 m in 0.25 hours",
            metres: 400,
            km: 0.4,
            time: 0.25,
            wrongSpeed: 1600,
            correctSpeed: 1.6,
            speedUnit: "km/h",
            mistake: "used metres instead of km: 400 ÷ 0.25 = 1600 km/h — faster than a racing car!",
            interactMetres: 600,
            interactKm: 0.6,
            interactTime: 0.25,
            interactCorrectSpeed: 2.4
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `${v.wrongSpeed} km/h? That can't be right!`,
            bodyParts: [
              { type: "text", content: (v) => `${v.name} ${v.scenario}.\n${v.name} calculated: ${v.metres} ÷ ${v.time} = **${v.wrongSpeed} ${v.speedUnit}**.\n\nThat's ${v.wrongSpeed} km/h! Can you spot what went wrong?` },
              { type: "visual", component: "SDTTriangle", props: () => ({ cover: "S", label: "Finding Speed — units must match!" }) },
              {
                type: "visual",
                component: "WorkedExample",
                props: (v) => ({
                  steps: [
                    { text: `${v.name}'s working: ${v.metres} ÷ ${v.time} = ${v.wrongSpeed} ${v.speedUnit}`, why: "Something is very wrong here!" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Convert metres to km FIRST!",
            body: (v) => `${v.name} ${v.mistake}\n\nThe speed is in **km/h**, so the distance must be in **km** too!\n\n${v.metres} m ÷ 1000 = **${v.km} km**\nThen: ${v.km} ÷ ${v.time} = **${v.correctSpeed} ${v.speedUnit}** — much more sensible!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `WRONG: ${v.metres} ÷ ${v.time} = ${v.wrongSpeed} ${v.speedUnit}`, why: "Used metres with km/h — units don't match!" },
                  { text: `Convert: ${v.metres} m ÷ 1000 = ${v.km} km`, why: "Convert to km first" },
                  { text: `RIGHT: ${v.km} ÷ ${v.time} = ${v.correctSpeed} ${v.speedUnit}`, result: "✓" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Someone ran **${v.interactMetres} m** in **${v.interactTime} hours**. What is the correct speed in ${v.speedUnit}?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.interactMetres} m = ${v.interactKm} km` },
                  { text: `Speed = ${v.interactKm} ÷ ${v.interactTime} = ?` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.interactKm} ÷ ${v.interactTime}?`,
              getOptions: (v) => generateDistractors(v.interactCorrectSpeed * 10).map(x => x / 10),
              correctAnswer: (v) => v.interactCorrectSpeed,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactKm} ÷ ${v.interactTime} = **${v.interactCorrectSpeed} ${v.speedUnit}**. Always convert metres to km first! ✓`,
                incorrect: (v) => `Not quite! Convert first: ${v.interactMetres} m = ${v.interactKm} km. Then ${v.interactKm} ÷ ${v.interactTime} = **${v.interactCorrectSpeed} ${v.speedUnit}**.`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Always match your units!",
            bodyParts: [
              { type: "text", content: () => `Before calculating speed, make sure units match:` },
              { type: "visual", component: "SDTTriangle", props: () => ({ cover: "S", label: "Match units before using the triangle!" }) },
              {
                type: "visual",
                component: "WorkedExample",
                props: () => ({
                  steps: [
                    { text: "km/h → distance must be in km", why: "Divide metres by 1000 first" },
                    { text: "mph → distance must be in miles", why: "Convert if given in other units" },
                    { text: "If the answer is HUGE, check your units!", why: "A person can't run at 5000 km/h!" },
                    { text: "Sense-check: walking ≈ 5 km/h, running ≈ 10-15 km/h", why: "Does your answer make sense? ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 7: kmh-to-ms
  // Converting km/h ↔ m/s (÷3.6)
  // Category: supporting
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "kmh-to-ms",
    name: "Converting km/h to m/s",
    category: "supporting",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "kmh-to-ms-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to convert (change) km/h to m/s",
          "Why you multiply by 1000 then divide by 3600"
        ],
        variableSets: [
          {
            name: "Charlie",
            scenario: "is working out a cheetah's speed in metres per second",
            kmh: 72,
            ms: 20,
            kmToMetres: 72000,
            hoursToSeconds: 3600,
            context: "The fastest land animal!",
            interactKmh: 54,
            interactMs: 15
          },
          {
            name: "Priya",
            scenario: "wants to know how fast a car on the motorway goes in m/s",
            kmh: 108,
            ms: 30,
            kmToMetres: 108000,
            hoursToSeconds: 3600,
            context: "That's about 67 mph!",
            interactKmh: 90,
            interactMs: 25
          },
          {
            name: "Oscar",
            scenario: "is converting a sprinter's top speed to m/s",
            kmh: 36,
            ms: 10,
            kmToMetres: 36000,
            hoursToSeconds: 3600,
            context: "Usain Bolt actually topped 44 km/h!",
            interactKmh: 18,
            interactMs: 5
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `${v.kmh} km/h — but what's that in m/s?`,
            bodyParts: [
              { type: "text", content: (v) => `${v.name} ${v.scenario}.\nThe speed is **${v.kmh} km/h**, but the question asks for **metres per second**.\n${v.context}\nThere's a neat shortcut: just **divide by 3.6**!` },
              { type: "visual", component: "SDTTriangle", props: () => ({ cover: "S", label: "Converting Speed units" }) },
              {
                type: "visual",
                component: "WorkedExample",
                props: (v) => ({
                  steps: [
                    { text: `${v.kmh} km/h = ? m/s`, why: "We need to convert the units" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "The ÷ 3.6 shortcut!",
            bodyParts: [
              {
                type: 'text',
                content: () => `Here's **why** dividing by 3.6 works:\n\n1 km = **1000 metres**\n1 hour = **3600 seconds**\n\nSo km/h → m/s means: × 1000 (to get metres) then ÷ 3600 (to get seconds).\n1000 ÷ 3600 = **1 ÷ 3.6**\n\nSo just **divide by 3.6**!`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `${v.kmh} km/h × 1000 = ${v.kmToMetres} m/h`, why: "Convert km to metres" },
                    { text: `${v.kmToMetres} ÷ 3600 = ${v.ms} m/s`, why: "Convert hours to seconds" },
                    { text: `Shortcut: ${v.kmh} ÷ 3.6 = ${v.ms} m/s`, result: "Same answer! ✓" }
                  ],
                  allRevealed: false
                })
              }
            ],
            visual: null,
            interaction: null
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Convert **${v.interactKmh} km/h** to m/s. Use the shortcut: divide by 3.6!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.interactKmh} ÷ 3.6 = ?` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.interactKmh} ÷ 3.6?`,
              getOptions: (v) => generateDistractors(v.interactMs),
              correctAnswer: (v) => v.interactMs,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactKmh} ÷ 3.6 = **${v.interactMs} m/s**. The ÷ 3.6 trick works every time! ✓`,
                incorrect: (v) => `Not quite! ${v.interactKmh} ÷ 3.6 = **${v.interactMs} m/s**. Remember: km/h to m/s = divide by 3.6.`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "km/h ↔ m/s — the shortcuts!",
            bodyParts: [
              { type: "text", content: () => `Two shortcuts to memorise:` },
              { type: "visual", component: "SDTTriangle", props: () => ({ cover: "S", label: "Speed in different units" }) },
              {
                type: "visual",
                component: "WorkedExample",
                props: () => ({
                  steps: [
                    { text: "km/h → m/s: DIVIDE by 3.6", why: "Going to a smaller unit per shorter time" },
                    { text: "m/s → km/h: MULTIPLY by 3.6", why: "Going the other way" },
                    { text: "Why 3.6? Because 3600 ÷ 1000 = 3.6", why: "3600 seconds in an hour, 1000 m in a km" },
                    { text: "Quick check: 36 km/h = 10 m/s", why: "A handy reference to remember! ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: null
          }
        ]
      },

      // ---- Lesson B: Spot the Mistake ----
      {
        id: "kmh-to-ms-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid multiplying or dividing in the wrong order when converting speed units",
          "When to watch out for confusing km/h to m/s with m/s to km/h"
        ],
        variableSets: [
          {
            name: "Tom",
            scenario: "tried to convert 90 km/h to m/s",
            kmh: 90,
            wrongMs: 90000,
            wrongMethod: "just multiplied by 1000 and forgot to divide by 3600",
            correctMs: 25,
            mistake: "converted km to metres but forgot to convert hours to seconds",
            interactKmh: 72,
            interactCorrectMs: 20
          },
          {
            name: "Lily",
            scenario: "tried to convert 54 km/h to m/s",
            kmh: 54,
            wrongMs: 54000,
            wrongMethod: "multiplied by 1000 only — forgetting the seconds conversion",
            correctMs: 15,
            mistake: "only did half the conversion — km to m but not hours to seconds",
            interactKmh: 36,
            interactCorrectMs: 10
          },
          {
            name: "Marcus",
            scenario: "tried to convert 108 km/h to m/s",
            kmh: 108,
            wrongMs: 388800,
            wrongMethod: "multiplied by 3600 instead of dividing",
            correctMs: 30,
            mistake: "multiplied by 3600 instead of dividing — went the wrong way!",
            interactKmh: 144,
            interactCorrectMs: 40
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `${v.wrongMs} m/s? Something's off!`,
            bodyParts: [
              { type: "text", content: (v) => `${v.name} ${v.scenario}.\n${v.name} got **${v.wrongMs} m/s**.\n\nThat's impossibly fast! A bullet only goes about 400 m/s. Can you spot the mistake?` },
              { type: "visual", component: "SDTTriangle", props: () => ({ cover: "S", label: "Converting Speed — both steps needed!" }) },
              {
                type: "visual",
                component: "WorkedExample",
                props: (v) => ({
                  steps: [
                    { text: `${v.name}'s answer: ${v.kmh} km/h = ${v.wrongMs} m/s`, why: "Way too fast! Something went wrong." }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "You need BOTH conversions!",
            body: (v) => `${v.name} ${v.mistake}.\n\nTo go from km/h to m/s, you need **two** steps:\n1. km → m (× 1000)\n2. hours → seconds (÷ 3600)\n\nOr use the shortcut: **÷ 3.6**`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `WRONG: ${v.wrongMethod}`, why: "Missing a step!" },
                  { text: `RIGHT: ${v.kmh} ÷ 3.6 = ${v.correctMs} m/s`, result: "✓" },
                  { text: `Check: a fast car ≈ 30 m/s, sprinter ≈ 10 m/s`, why: "Does it make sense now?" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Convert **${v.interactKmh} km/h** to m/s correctly.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.interactKmh} ÷ 3.6 = ?` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.interactKmh} km/h in m/s?`,
              getOptions: (v) => generateDistractors(v.interactCorrectMs),
              correctAnswer: (v) => v.interactCorrectMs,
              feedback: {
                correct: (v) => `Spot on! ${v.interactKmh} ÷ 3.6 = **${v.interactCorrectMs} m/s**. Both units must be converted! ✓`,
                incorrect: (v) => `Not quite! ${v.interactKmh} ÷ 3.6 = **${v.interactCorrectMs} m/s**. Remember: divide by 3.6 to go from km/h to m/s.`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Don't forget both conversions!",
            bodyParts: [
              { type: "text", content: () => `When converting km/h to m/s:` },
              { type: "visual", component: "SDTTriangle", props: () => ({ cover: "S", label: "Speed needs both unit conversions!" }) },
              {
                type: "visual",
                component: "WorkedExample",
                props: () => ({
                  steps: [
                    { text: "× 1000 (km → m) AND ÷ 3600 (h → s)", why: "Both steps are needed" },
                    { text: "Shortcut: ÷ 3.6 does both at once!", why: "1000 ÷ 3600 = 1 ÷ 3.6" },
                    { text: "If your answer is thousands, you probably forgot ÷ 3600", why: "Humans don't move at 54,000 m/s!" },
                    { text: "Reference: 36 km/h = 10 m/s", why: "Use this to sense-check! ✓" }
                  ],
                  allRevealed: true
                })
              }
            ],
            interaction: null
          }
        ]
      }
    ]
  },

  // ==========================================
  // SUB-CONCEPT 8: time-in-minutes
  // Converting decimal hours back to minutes
  // Category: other
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "time-in-minutes",
    name: "Converting Decimal Hours to Minutes",
    category: "other",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "time-in-minutes-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to convert (change) a decimal answer back into minutes",
          "Why 0.25 hours equals 15 minutes"
        ],
        variableSets: [
          {
            name: "Grace",
            scenario: "calculated her running time as 0.75 hours and needs to know the minutes",
            decimalHours: 0.75,
            minutes: 45,
            wholeHours: 0,
            remainderDecimal: 0.75,
            context: "She ran a 5K in the park",
            interactDecimalHours: 0.5,
            interactMinutes: 30
          },
          {
            name: "Ben",
            scenario: "worked out his cycling time as 1.5 hours",
            decimalHours: 1.5,
            minutes: 90,
            wholeHours: 1,
            remainderDecimal: 0.5,
            remainderMinutes: 30,
            context: "He cycled from home to his grandparents' house",
            displayTime: "1 hour 30 minutes",
            interactDecimalHours: 2.25,
            interactMinutes: 135
          },
          {
            name: "Nadia",
            scenario: "calculated a journey time of 2.25 hours",
            decimalHours: 2.25,
            minutes: 135,
            wholeHours: 2,
            remainderDecimal: 0.25,
            remainderMinutes: 15,
            context: "The family drove to the seaside",
            displayTime: "2 hours 15 minutes",
            interactDecimalHours: 1.75,
            interactMinutes: 105
          },
          {
            name: "Charlie",
            scenario: "got an answer of 0.5 hours for his walk to school",
            decimalHours: 0.5,
            minutes: 30,
            wholeHours: 0,
            remainderDecimal: 0.5,
            context: "It's a 30-minute walk",
            interactDecimalHours: 0.25,
            interactMinutes: 15
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `${v.decimalHours} hours — but what's that in minutes?`,
            body: (v) => `${v.name} ${v.scenario}.\nBut **${v.decimalHours} hours** isn't very useful — ${v.context}.\nHow many **minutes** is ${v.decimalHours} hours?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.decimalHours} hours = ? minutes`, why: "We need to convert to a unit we understand!" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Multiply by 60!",
            body: (v) => `To convert hours to minutes, **multiply by 60** (because there are 60 minutes in an hour).\n\n**${v.decimalHours} × 60 = ${v.minutes} minutes**\n\nThat makes much more sense!`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.decimalHours} hours × 60`, why: "60 minutes in every hour", result: `= ${v.minutes} minutes` },
                  { text: `So ${v.decimalHours} hours = ${v.minutes} minutes`, result: "✓" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Convert **${v.interactDecimalHours} hours** into minutes.`,
            visual: {
              component: "NumberLine",
              props: () => ({
                min: 0,
                max: 180,
                points: [
                  { value: 0, label: "0", color: "#818cf8" },
                  { value: 60, label: "60 min", color: "#c084fc" },
                  { value: 120, label: "120 min", color: "#c084fc" },
                  { value: 180, label: "180 min", color: "#c084fc" }
                ],
                jumps: [],
                tickInterval: 30
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactDecimalHours} hours = ? minutes`,
              getOptions: (v) => generateDistractors(v.interactMinutes),
              correctAnswer: (v) => v.interactMinutes,
              feedback: {
                correct: (v) => `Spot on! ${v.interactDecimalHours} × 60 = **${v.interactMinutes} minutes**. Always multiply by 60! ✓`,
                incorrect: (v) => `Not quite! ${v.interactDecimalHours} × 60 = **${v.interactMinutes} minutes**. Multiply decimal hours by 60 to get minutes.`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Decimal hours → minutes: × 60!",
            body: () => `Key decimal-to-minutes conversions:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "0.25 hours = 15 minutes", why: "0.25 × 60 = 15 (a quarter of an hour)" },
                  { text: "0.5 hours = 30 minutes", why: "0.5 × 60 = 30 (half an hour)" },
                  { text: "0.75 hours = 45 minutes", why: "0.75 × 60 = 45 (three quarters of an hour)" },
                  { text: "For mixed: 1.5 hours = 1 hr 30 min", why: "The whole part stays, multiply the decimal by 60 ✓" }
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
        id: "time-in-minutes-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid leaving a time answer as a confusing decimal",
          "When to watch out for writing 0.5 hours as 50 minutes instead of 30"
        ],
        variableSets: [
          {
            name: "Isaac",
            scenario: "calculated a journey time of 0.25 hours",
            decimalHours: 0.25,
            wrongMinutes: 25,
            correctMinutes: 15,
            mistake: "read 0.25 hours as 25 minutes — but 0.25 means a QUARTER, not 25!",
            interactDecimalHours: 0.5,
            interactCorrectMinutes: 30
          },
          {
            name: "Holly",
            scenario: "got an answer of 0.75 hours for her walk",
            decimalHours: 0.75,
            wrongMinutes: 75,
            correctMinutes: 45,
            mistake: "read 0.75 hours as 75 minutes — but 0.75 means three quarters, not 75!",
            interactDecimalHours: 0.25,
            interactCorrectMinutes: 15
          },
          {
            name: "Jake",
            scenario: "worked out a bus journey as 1.5 hours",
            decimalHours: 1.5,
            wrongMinutes: 150,
            correctMinutes: 90,
            mistake: "multiplied by 100 instead of 60: 1.5 × 100 = 150 instead of 1.5 × 60 = 90",
            interactDecimalHours: 2.5,
            interactCorrectMinutes: 150
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `${v.decimalHours} hours = ${v.wrongMinutes} minutes?`,
            body: (v) => `${v.name} ${v.scenario}.\n${v.name} wrote: "${v.decimalHours} hours = **${v.wrongMinutes} minutes**".\n\nThat's not right! Can you spot the error?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.name}'s answer: ${v.decimalHours} hours = ${v.wrongMinutes} minutes`, why: "Is this correct?" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Multiply by 60, not 100!",
            body: (v) => `${v.name} ${v.mistake}\n\nHours are NOT like money (where 0.25 = 25p). There are **60 minutes** in an hour, not 100!\n\n**${v.decimalHours} × 60 = ${v.correctMinutes} minutes**`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `WRONG: ${v.decimalHours} hours = ${v.wrongMinutes} minutes`, why: "Treated decimals like pence — but hours have 60 mins, not 100!" },
                  { text: `RIGHT: ${v.decimalHours} × 60 = ${v.correctMinutes} minutes`, result: "✓" }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `How many minutes is **${v.interactDecimalHours} hours**?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.interactDecimalHours} × 60 = ?` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `${v.interactDecimalHours} hours = ? minutes`,
              getOptions: (v) => generateDistractors(v.interactCorrectMinutes),
              correctAnswer: (v) => v.interactCorrectMinutes,
              feedback: {
                correct: (v) => `Yes! ${v.interactDecimalHours} × 60 = **${v.interactCorrectMinutes} minutes**. Multiply by 60, never by 100! ✓`,
                incorrect: (v) => `Not quite! ${v.interactDecimalHours} × 60 = **${v.interactCorrectMinutes} minutes**. Remember: 60 minutes in an hour.`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Hours are NOT like money!",
            body: () => `The big trap: treating decimal hours like pounds and pence.`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "0.25 hours = 15 minutes (NOT 25!)", why: "0.25 × 60 = 15" },
                  { text: "0.5 hours = 30 minutes (NOT 50!)", why: "0.5 × 60 = 30" },
                  { text: "0.75 hours = 45 minutes (NOT 75!)", why: "0.75 × 60 = 45" },
                  { text: "Always multiply by 60 to convert!", why: "60 minutes in an hour, not 100! ✓" }
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
  // SUB-CONCEPT 9: average-speed
  // Average speed for two-part journeys
  // Category: other
  // Lesson A: step-by-step | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "average-speed",
    name: "Average Speed for Two-Part Journeys",
    category: "other",
    lessons: [
      // ---- Lesson A: Step by Step ----
      {
        id: "average-speed-steps",
        templateType: "step-by-step",
        learningGoal: [
          "How to calculate average speed (total distance divided by total time) for a journey with two parts",
          "Why you must NOT just average the two speeds"
        ],
        variableSets: [
          {
            name: "Aisha",
            scenario: "drove to her grandmother's house in two parts",
            part1Distance: 60,
            part1Speed: 30,
            part1Time: 2,
            part2Distance: 40,
            part2Speed: 40,
            part2Time: 1,
            totalDistance: 100,
            totalTime: 3,
            averageSpeed: 33.3,
            averageSpeedRounded: 33,
            wrongAverage: 35,
            distanceUnit: "miles",
            speedUnit: "mph",
            timeUnit: "hours",
            part1Desc: "through the town",
            part2Desc: "on the main road",
            interactTotalDistance: 80,
            interactTotalTime: 2,
            interactAverageSpeedRounded: 40
          },
          {
            name: "Mr Patel",
            scenario: "drove the school bus on a trip with two stretches",
            part1Distance: 40,
            part1Speed: 20,
            part1Time: 2,
            part2Distance: 60,
            part2Speed: 60,
            part2Time: 1,
            totalDistance: 100,
            totalTime: 3,
            averageSpeed: 33.3,
            averageSpeedRounded: 33,
            wrongAverage: 40,
            distanceUnit: "miles",
            speedUnit: "mph",
            timeUnit: "hours",
            part1Desc: "through villages",
            part2Desc: "on the dual carriageway",
            interactTotalDistance: 150,
            interactTotalTime: 5,
            interactAverageSpeedRounded: 30
          },
          {
            name: "Ella",
            scenario: "cycled to the beach in two stages",
            part1Distance: 12,
            part1Speed: 12,
            part1Time: 1,
            part2Distance: 8,
            part2Speed: 8,
            part2Time: 1,
            totalDistance: 20,
            totalTime: 2,
            averageSpeed: 10,
            averageSpeedRounded: 10,
            wrongAverage: 10,
            distanceUnit: "km",
            speedUnit: "km/h",
            timeUnit: "hours",
            part1Desc: "downhill on the road",
            part2Desc: "along the seafront path",
            interactTotalDistance: 30,
            interactTotalTime: 2,
            interactAverageSpeedRounded: 15
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `What's the average speed?`,
            body: (v) => `${v.name} ${v.scenario}.\nPart 1 (${v.part1Desc}): **${v.part1Distance} ${v.distanceUnit}** at **${v.part1Speed} ${v.speedUnit}**\nPart 2 (${v.part2Desc}): **${v.part2Distance} ${v.distanceUnit}** at **${v.part2Speed} ${v.speedUnit}**\n\nWhat was their average speed? **Don't** just add the speeds and divide by 2!`,
            visual: {
              component: "SDTTriangle",
              props: (v) => ({
                cover: "S",
                size: 180,
                label: `Total: ${v.totalDistance} ${v.distanceUnit}`
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Total distance ÷ total time!",
            bodyParts: [
              {
                type: 'text',
                content: (v) => `Average speed = **total distance ÷ total time**\n\nFirst, work out the time for each part:\n- Part 1: ${v.part1Distance} ÷ ${v.part1Speed} = **${v.part1Time} ${v.part1Time === 1 ? 'hour' : v.timeUnit}**\n- Part 2: ${v.part2Distance} ÷ ${v.part2Speed} = **${v.part2Time} ${v.part2Time === 1 ? 'hour' : v.timeUnit}**`
              },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: `Total distance: ${v.part1Distance} + ${v.part2Distance} = ${v.totalDistance} ${v.distanceUnit}`, why: "Add both distances" },
                    { text: `Total time: ${v.part1Time} + ${v.part2Time} = ${v.totalTime} ${v.timeUnit}`, why: "Add both times" },
                    { text: `Average speed = ${v.totalDistance} ÷ ${v.totalTime}`, result: `≈ ${v.averageSpeedRounded} ${v.speedUnit} ✓` }
                  ],
                  allRevealed: false
                })
              },
              {
                type: 'text',
                content: (v) => `If you just averaged the speeds: (${v.part1Speed} + ${v.part2Speed}) ÷ 2 = ${v.wrongAverage} — that's **wrong** because you spend different amounts of time at each speed!`
              }
            ],
            visual: null,
            interaction: null
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Total distance = **${v.interactTotalDistance} ${v.distanceUnit}**. Total time = **${v.interactTotalTime} ${v.timeUnit}**.\nWhat is the average speed?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Average speed = ${v.interactTotalDistance} ÷ ${v.interactTotalTime} = ?` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.interactTotalDistance} ÷ ${v.interactTotalTime} (to the nearest whole number)?`,
              getOptions: (v) => generateDistractors(v.interactAverageSpeedRounded),
              correctAnswer: (v) => v.interactAverageSpeedRounded,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactTotalDistance} ÷ ${v.interactTotalTime} = **${v.interactAverageSpeedRounded} ${v.speedUnit}**. Total distance ÷ total time! ✓`,
                incorrect: (v) => `Not quite! Average speed = total distance ÷ total time = ${v.interactTotalDistance} ÷ ${v.interactTotalTime} = **${v.interactAverageSpeedRounded} ${v.speedUnit}**.`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Average speed — the golden rule!",
            body: () => `Average speed is NOT the average of the two speeds:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Average speed = TOTAL distance ÷ TOTAL time", why: "Add up all the distances, add up all the times, then divide" },
                  { text: "DON'T add speeds and divide by 2!", why: "This only works if you spend the SAME time at each speed" },
                  { text: "You may need to calculate each time first", why: "Time = Distance ÷ Speed for each part" },
                  { text: "Then add distances, add times, and divide!", why: "That gives the true average speed ✓" }
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
        id: "average-speed-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid the trap of just averaging two speeds",
          "Why total distance divided by total time is the only correct method"
        ],
        variableSets: [
          {
            name: "Sophie",
            scenario: "drove 60 miles at 30 mph, then 60 miles at 60 mph",
            part1Distance: 60,
            part1Speed: 30,
            part1Time: 2,
            part2Distance: 60,
            part2Speed: 60,
            part2Time: 1,
            totalDistance: 120,
            totalTime: 3,
            correctAverage: 40,
            wrongAverage: 45,
            wrongMethod: "(30 + 60) ÷ 2 = 45 mph",
            correctMethod: "120 ÷ 3 = 40 mph",
            speedUnit: "mph",
            distanceUnit: "miles",
            timeUnit: "hours",
            interactTotalDistance: 200,
            interactTotalTime: 4,
            interactCorrectAverage: 50
          },
          {
            name: "Oscar",
            scenario: "cycled 20 km at 10 km/h, then 10 km at 20 km/h",
            part1Distance: 20,
            part1Speed: 10,
            part1Time: 2,
            part2Distance: 10,
            part2Speed: 20,
            part2Time: 0.5,
            totalDistance: 30,
            totalTime: 2.5,
            correctAverage: 12,
            wrongAverage: 15,
            wrongMethod: "(10 + 20) ÷ 2 = 15 km/h",
            correctMethod: "30 ÷ 2.5 = 12 km/h",
            speedUnit: "km/h",
            distanceUnit: "km",
            timeUnit: "hours",
            interactTotalDistance: 40,
            interactTotalTime: 2,
            interactCorrectAverage: 20
          },
          {
            name: "Ravi",
            scenario: "ran 4 km at 8 km/h, then 6 km at 12 km/h",
            part1Distance: 4,
            part1Speed: 8,
            part1Time: 0.5,
            part2Distance: 6,
            part2Speed: 12,
            part2Time: 0.5,
            totalDistance: 10,
            totalTime: 1,
            correctAverage: 10,
            wrongAverage: 10,
            wrongMethod: "(8 + 12) ÷ 2 = 10 km/h",
            correctMethod: "10 ÷ 1 = 10 km/h",
            speedUnit: "km/h",
            distanceUnit: "km",
            timeUnit: "hours",
            interactTotalDistance: 24,
            interactTotalTime: 2,
            interactCorrectAverage: 12
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `${v.name} took a shortcut — and got it wrong!`,
            body: (v) => `${v.name} ${v.scenario}.\n${v.name} calculated: **${v.wrongMethod}**.\n\nIs that correct? Or did ${v.name} fall into the biggest SDT trap?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.name}'s working: ${v.wrongMethod}`, why: "Just averaged the two speeds — is that OK?" }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "You can't just average the speeds!",
            body: (v) => `${v.name} added the two speeds and divided by 2. That's the **wrong** method!\n\nYou spend **different amounts of time** at each speed, so you must use:\n**Average speed = total distance ÷ total time**`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `WRONG: ${v.wrongMethod}`, why: "Simply averaging speeds ignores how long you spent at each one" },
                  { text: `Part 1 time: ${v.part1Distance} ÷ ${v.part1Speed} = ${v.part1Time}h`, why: "Work out each time separately" },
                  { text: `Part 2 time: ${v.part2Distance} ÷ ${v.part2Speed} = ${v.part2Time}h`, why: "Then add them up" },
                  { text: `RIGHT: ${v.correctMethod}`, result: `= ${v.correctAverage} ${v.speedUnit} ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `Total distance = **${v.interactTotalDistance} ${v.distanceUnit}**, total time = **${v.interactTotalTime} ${v.timeUnit}**.\nWhat is the correct average speed?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Average speed = ${v.interactTotalDistance} ÷ ${v.interactTotalTime} = ?` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.interactTotalDistance} ÷ ${v.interactTotalTime}?`,
              getOptions: (v) => generateDistractors(v.interactCorrectAverage),
              correctAnswer: (v) => v.interactCorrectAverage,
              feedback: {
                correct: (v) => `Brilliant! ${v.interactTotalDistance} ÷ ${v.interactTotalTime} = **${v.interactCorrectAverage} ${v.speedUnit}**. Total distance ÷ total time! ✓`,
                incorrect: (v) => `Not quite! Average speed = ${v.interactTotalDistance} ÷ ${v.interactTotalTime} = **${v.interactCorrectAverage} ${v.speedUnit}**. Don't just average the two speeds!`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "The average speed trap!",
            body: () => `This is the sneakiest question type in the 11+:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "NEVER add speeds and divide by 2!", why: "That only works if you spend equal TIME at each speed" },
                  { text: "Average speed = total distance ÷ total time", why: "This ALWAYS works" },
                  { text: "Work out each journey time first if needed", why: "Time = Distance ÷ Speed for each part" },
                  { text: "Then: add all distances, add all times, divide!", why: "That's the real average speed ✓" }
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
  // SUB-CONCEPT 10: word-problems
  // Multi-step SDT word problems
  // Category: other
  // Lesson A: curiosity-hook | Lesson B: spot-the-mistake
  // ==========================================
  {
    id: "word-problems",
    name: "Multi-Step SDT Word Problems",
    category: "other",
    lessons: [
      // ---- Lesson A: Curiosity Hook ----
      {
        id: "word-problems-curiosity",
        templateType: "curiosity-hook",
        learningGoal: [
          "How to pick out speed, distance, and time from a wordy question",
          "How to decide which rule to use"
        ],
        variableSets: [
          {
            name: "Ben",
            scenario: "A train travels at 80 mph from London to Manchester, which is 160 miles away. How long is the journey?",
            speed: 80,
            distance: 160,
            time: 2,
            findWhat: "time",
            formula: "Time = Distance \u00f7 Speed",
            distanceUnit: "miles",
            speedUnit: "mph",
            timeUnit: "hours",
            answerNum: 2,
            answerLabel: "2 hours",
            step1: "Identify: Distance = 160 miles, Speed = 80 mph",
            step2: "Time = 160 \u00f7 80 = 2 hours"
          },
          {
            name: "Daisy",
            scenario: "A cyclist travels 24 km in 2 hours. What was her average speed?",
            speed: 12,
            distance: 24,
            time: 2,
            findWhat: "speed",
            formula: "Speed = Distance \u00f7 Time",
            distanceUnit: "km",
            speedUnit: "km/h",
            timeUnit: "hours",
            answerNum: 12,
            answerLabel: "12 km/h",
            step1: "Identify: Distance = 24 km, Time = 2 hours",
            step2: "Speed = 24 \u00f7 2 = 12 km/h"
          },
          {
            name: "Tom",
            scenario: "Mum drives at 40 mph for 1.5 hours, then at 60 mph for 1 hour. How far did she travel in total?",
            speed: 0,
            distance: 120,
            time: 2.5,
            answerNum: 120,
            answerLabel: "120 miles",
            findWhat: "total distance (two parts)",
            formula: "Distance = Speed × Time (twice)",
            distanceUnit: "miles",
            speedUnit: "mph",
            timeUnit: "hours",
            part1Speed: 40,
            part1Time: 1.5,
            part1Distance: 60,
            part2Speed: 60,
            part2Time: 1,
            part2Distance: 60,
            step1: "Part 1: 40 × 1.5 = 60 miles",
            step2: "Part 2: 60 × 1 = 60 miles. Total: 60 + 60 = 120 miles"
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: () => "A wordy question — where do you start?",
            body: (v) => `Here's the question:\n"${v.scenario}"\n\nLong and confusing? **Not if you know the trick.** Start by finding the three key pieces: **speed**, **distance**, and **time**.`,
            visual: {
              component: "SDTTriangle",
              props: () => ({ label: "Find S, D, and T in the question" })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Pick out S, D, and T!",
            bodyParts: [
              {
                type: 'text',
                content: () => `Every SDT word problem follows the same pattern:\n\n1. **Read** the question carefully\n2. **Underline** any numbers (speeds, distances, times)\n3. **Decide** which rule you need\n4. **Calculate** step by step`
              },
              { type: "visual", component: "SDTTriangle", props: (v) => ({ cover: v.findWhat === "time" ? "T" : v.findWhat === "speed" ? "S" : "D", label: "Cover what you need to find" }) },
              {
                type: 'visual',
                component: 'WorkedExample',
                props: (v) => ({
                  steps: [
                    { text: v.step1, why: "First calculation" },
                    { text: v.step2, result: "✓" }
                  ],
                  allRevealed: false
                })
              },
              {
                type: 'text',
                content: (v) => `The answer is **${v.answerLabel}**. The hard part isn't the maths \u2014 it's reading the question!`
              }
            ],
            visual: null,
            interaction: null
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `${v.scenario}`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `What rule do you need?`, why: v.formula }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is the answer?`,
              getOptions: (v) => generateDistractors(v.answerNum),
              correctAnswer: (v) => v.answerNum,
              feedback: {
                correct: (v) => `Brilliant! You picked the right rule and got **${v.answerLabel}**! \u2713`,
                incorrect: (v) => `Not quite! ${v.step1}. ${v.step2}. The answer is **${v.answerLabel}**.`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Word problems — a step-by-step recipe!",
            body: () => `For any SDT word problem:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: READ the question — what are you asked to find?", why: "Speed, distance, or time?" },
                  { text: "Step 2: UNDERLINE the numbers given", why: "Circle speeds, distances, and times" },
                  { text: "Step 3: CHOOSE the right rule using SDT triangle", why: "Cover up what you need to find" },
                  { text: "Step 4: CHECK — does your answer make sense?", why: "Walking speed ≈ 5 km/h, car ≈ 50 mph ✓" }
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
        id: "word-problems-mistake",
        templateType: "spot-the-mistake",
        learningGoal: [
          "How to avoid using the wrong values from a multi-step word problem",
          "When to watch out for extra information that is not needed in the calculation"
        ],
        variableSets: [
          {
            name: "Grace",
            scenario: "A bus travels 90 miles in 1 hour 30 minutes. What is its average speed?",
            distance: 90,
            timeHours: 1.5,
            timeMinutes: 90,
            correctSpeed: 60,
            wrongSpeed: 90,
            wrongMethod: "forgot 1 hr 30 min = 1.5 hours, not 1 hour. Used 90 ÷ 1 = 90 mph",
            correctMethod: "Convert: 1 hr 30 min = 1.5 hours. Speed = 90 ÷ 1.5 = 60 mph",
            speedUnit: "mph",
            distanceUnit: "miles",
            interactDistance: 100,
            interactTimeHours: 2.5,
            interactCorrectSpeed: 40
          },
          {
            name: "Ravi",
            scenario: "A plane flies 900 km in 1 hour 15 minutes. What is its speed?",
            distance: 900,
            timeHours: 1.25,
            timeMinutes: 75,
            correctSpeed: 720,
            wrongSpeed: 900,
            wrongMethod: "used just the 1 hour and ignored the 15 minutes: 900 ÷ 1 = 900 km/h",
            correctMethod: "Convert: 1 hr 15 min = 1.25 hours. Speed = 900 ÷ 1.25 = 720 km/h",
            speedUnit: "km/h",
            distanceUnit: "km",
            interactDistance: 600,
            interactTimeHours: 1.5,
            interactCorrectSpeed: 400
          },
          {
            name: "Lily",
            scenario: "A boat sails 45 miles in 2 hours 30 minutes. What is its speed?",
            distance: 45,
            timeHours: 2.5,
            timeMinutes: 150,
            correctSpeed: 18,
            wrongSpeed: 22.5,
            wrongMethod: "converted incorrectly: 2 hr 30 min = 2.3 hours (should be 2.5). Got 45 ÷ 2.3 = 19.6 mph",
            correctMethod: "Convert: 2 hr 30 min = 2.5 hours. Speed = 45 ÷ 2.5 = 18 mph",
            speedUnit: "mph",
            distanceUnit: "miles",
            interactDistance: 75,
            interactTimeHours: 1.25,
            interactCorrectSpeed: 60
          }
        ],
        screens: [
          // ---- Screen 1: HOOK ----
          {
            type: "hook",
            title: (v) => `Where did ${v.name} go wrong?`,
            body: (v) => `${v.scenario}\n\n${v.name} worked it out and got **${v.wrongSpeed} ${v.speedUnit}**.\n\nThat doesn't seem right. Can you spot the mistake?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `${v.name}'s answer: ${v.wrongSpeed} ${v.speedUnit}`, why: v.wrongMethod }
                ],
                allRevealed: true
              })
            },
            interaction: null
          },
          // ---- Screen 2: TEACH ----
          {
            type: "teach",
            title: () => "Convert the time properly!",
            body: (v) => `${v.name} ${v.wrongMethod}\n\nThe time must be converted to a **decimal** before dividing.\n\n**${v.correctMethod}**\n\n**Watch out for these traps:**\n1 hr 30 min = **1.5** hours (NOT 1.30!)\n1 hr 15 min = **1.25** hours (NOT 1.15!)\n2 hr 45 min = **2.75** hours (NOT 2.45!)\nAlways divide the minutes by 60, then add to the hours.`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `WRONG: ${v.wrongMethod}`, why: "Time wasn't converted properly!" },
                  { text: `RIGHT: ${v.correctMethod}`, result: `= ${v.correctSpeed} ${v.speedUnit} ✓` }
                ],
                allRevealed: false
              })
            },
            interaction: { type: "tap-to-reveal" }
          },
          // ---- Screen 3: INTERACT ----
          {
            type: "interact",
            title: () => "Your turn!",
            body: (v) => `A vehicle travels **${v.interactDistance} ${v.distanceUnit}** in **${v.interactTimeHours} hours**. What is its speed?`,
            visual: {
              component: "WorkedExample",
              props: (v) => ({
                steps: [
                  { text: `Speed = ${v.interactDistance} ÷ ${v.interactTimeHours} = ?` }
                ],
                allRevealed: true
              })
            },
            interaction: {
              type: "multiple-choice",
              question: (v) => `What is ${v.interactDistance} ÷ ${v.interactTimeHours}?`,
              getOptions: (v) => generateDistractors(v.interactCorrectSpeed),
              correctAnswer: (v) => v.interactCorrectSpeed,
              feedback: {
                correct: (v) => `Spot on! ${v.interactDistance} ÷ ${v.interactTimeHours} = **${v.interactCorrectSpeed} ${v.speedUnit}**. You converted the time properly! ✓`,
                incorrect: (v) => `Not quite! ${v.interactDistance} ÷ ${v.interactTimeHours} = **${v.interactCorrectSpeed} ${v.speedUnit}**.`
              }
            }
          },
          // ---- Screen 4: CONSOLIDATE ----
          {
            type: "consolidate",
            title: () => "Word problem checklist!",
            body: () => `Follow these steps every time you get a speed, distance or time word problem:`,
            visual: {
              component: "WorkedExample",
              props: () => ({
                steps: [
                  { text: "Step 1: Read the question — what are you finding?", why: "Speed, distance, or time? Cover that letter in the triangle" },
                  { text: "Step 2: Convert the time to hours first!", why: "Divide minutes by 60 (e.g. 30 min = 30 ÷ 60 = 0.5 hours)" },
                  { text: "Step 3: Watch the trap — 1 hour 30 min is NOT 1.30", why: "It's 1.5 hours (because 30 ÷ 60 = 0.5)" },
                  { text: "Step 4: Put the numbers into the formula and calculate", why: "Use the triangle: D = S × T, S = D ÷ T, T = D ÷ S ✓" }
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
