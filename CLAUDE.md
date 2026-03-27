# 11+ Exam Prep App

## What This Project Is
A React web app to help a 9-year-old prepare for the GL Assessment 11+ exam (target: September 2026). Targeting Bournemouth Grammar School and Parkstone Grammar School. It presents multiple-choice maths questions across 16 topics, tracks progress via localStorage, and includes an AI tutor chat feature (Claude API).

**NOT a git repository.** No version control is set up.

## Master Brief
The full project brief and history lives in `Master Brief Document and Working Instructions/Master_Brief_v6_0.md`. Refer to this for detailed diagram breakdowns, question expansion history, and platform transition notes.

## Tech Stack
- **Framework:** React 19 (Create React App)
- **Styling:** Tailwind CSS 4
- **Icons:** lucide-react
- **Build:** react-scripts 5 (`npm start` / `npm run build`)
- **No router** — state-driven views (`home` → `topics` → `quiz` → `results`)

## Architecture

### Single-file app
Everything lives in `src/App.js` (~15,500 lines). All 2,061 questions are embedded inline in the `questionData` object. There are no separate component files or imports for question data.

### Question data structure
```js
{
  id: 1,
  question: "Question text here",
  image: "topic-folder/filename.svg",  // optional - path relative to /images/questions/
  options: ["A", "B", "C", "D", "E"],  // always 5 options
  correct: 2,                           // 0-indexed
  explanation: "Step-by-step explanation. ✓"
}
```

### 16 Maths Topics (all loaded in App.js)
| Topic | Key in questionData | Questions |
|-------|-------------------|-----------|
| Percentages | percentages | 35 |
| Decimals | decimals | 35 |
| Long Division | longdivision | 30 |
| Ratio & Proportion | ratio | 30 |
| Fractions | fractions | 35 |
| Long Multiplication | longmultiplication | 25 |
| Algebra | algebra | 35 |
| Place Value & Rounding | placevalue | 25 |
| Negative Numbers | negativenumbers | 20 |
| Prime Numbers & Factors | primenumbersfactors | 15 |
| Area & Perimeter | areaperimeter | 30 |
| Volume | volume | 18 |
| Angles & Shapes | anglesshapes | 22 |
| Sequences | sequences | 20 |
| Data Handling | datahandling | 25 |
| Speed, Distance, Time | speeddistancetime | 15 |

English and Verbal Reasoning sections exist but are placeholder/coming soon.

### V2 question files (external, not yet merged into App.js)
Located in `JS Files for Question Bank/`. Each topic has:
- Original file (e.g. `volume.js`) — the first batch already in App.js
- V2 file (e.g. `volume_v2_questions_19_118.js`) — 100 additional questions per topic

V2 files contain raw JS object fragments (not full modules). They need to be appended to the corresponding topic's questions array in App.js.

## SVG Diagrams

### Location
`public/images/questions/[topic-folder]/` — referenced in questions via the `image` property.

### Current diagram counts
| Folder | SVGs | Status |
|--------|------|--------|
| area-perimeter | 74 | Complete |
| volume | 74 | Complete |
| angles-shapes | 17 | In progress |
| data-handling | 10 | In progress |

### Diagram standards (for Volume 3D cuboids)
- See `.claude/projects/*/memory/diagram-rules.md` for dimension line placement rules
- See `.claude/projects/*/memory/volume-diagram-template.md` for the locked SVG template
- ViewBox: `0 0 400 300`
- Colours: lightskyblue (front), lightcyan (top), skyblue (right)
- Cubes use 120x120 square front face; cuboids use the standard template
- Dimension lines: length (bottom horizontal), height (left vertical), width (bottom-right angled)
- Unknown values shown in red with "? cm"

### Diagram backlog (from Master Brief v6.0)
- **Angles & Shapes:** ~72 diagrams needed (Q23-Q122 v2)
- **Data Handling:** ~55 diagrams needed (Q26-Q125 v2)
- **Volume (remaining v2):** Cuboids (17), Cubes (20), Tanks (5), Pools (6), Rooms (4), Storage (2), Comparisons (4), Algebraic (4) = ~62 total

See `Master Brief Document and Working Instructions/Master_Brief_v6_0.md` lines 104-116 for the exact question numbers per shape type.

## App Features
- **Quiz mode:** 5 multiple-choice options per question, immediate feedback with explanations
- **Progress tracking:** Quiz history saved to localStorage (score, date, topic, percentage)
- **AI Tutor chat:** Built-in chat interface (shows thinking state)
- **Navigation:** Home → Subject → Topic → Quiz → Results

## Key File Paths
| What | Path |
|------|------|
| Main app | `src/App.js` |
| Question bank source files | `JS Files for Question Bank/*.js` |
| SVG diagrams | `public/images/questions/[topic]/` |
| Entry point | `src/index.js` |
| Tailwind config | `postcss.config.js` (Tailwind 4 style) |
| Master brief (latest) | `Master Brief Document and Working Instructions/Master_Brief_v6_0.md` |
| Working instructions | `Master Brief Document and Working Instructions/Working_Instructions_v6_0.md` |
| App backup | `src/App_BACKUP.js` |

## Working Conventions
- Questions always have exactly 5 options (A–E), 0-indexed correct answer
- Explanations end with ✓
- British English and UK context (£, metres, British names)
- SVG diagrams verified visually in browser (File Explorer → double-click)
- When creating SVGs, follow the locked templates in memory files

## Installed Skills

### Skill Creator (`.claude/skills/skill-creator/`)
Comprehensive skill/agent engineering system. Use `/skill-creator` or say "create skill", "new skill", "build agent" etc.
