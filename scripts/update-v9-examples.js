const fs = require('fs');
const path = require('path');

const instruction = "The word in brackets is made from letters taken from the two outer words. Find the missing word.";

// Oracle-written unique example pairs, all verified
const questions = {
  126: { ex1: "crab (rake) keep",    ex2: "spin (pine) need",    test: "hope ( ? ) ends" },
  127: { ex1: "clip (lily) lynx",    ex2: "snap (name) merry",   test: "frog ( ? ) pest" },
  128: { ex1: "plot (lobe) bend",    ex2: "grew (real) ally",    test: "idol ( ? ) melt" },
  129: { ex1: "brag (raid) idle",    ex2: "brim (ride) deny",    test: "trap ( ? ) vent" },
  130: { ex1: "drum (rust) stem",    ex2: "crow (robe) best",    test: "afar ( ? ) stay" },
  131: { ex1: "slot (load) adze",    ex2: "swap (wash) shed",    test: "flat ( ? ) tent" },
  132: { ex1: "drip (rich) child",   ex2: "smile (mine) nest",   test: "blow ( ? ) neat" },
  133: { ex1: "grip (rite) test",    ex2: "crust (rude) depth",  test: "icon ( ? ) menu" },
  134: { ex1: "clue (lust) step",    ex2: "snug (nude) dean",    test: "twig ( ? ) deer" },
  135: { ex1: "swim (wise) send",    ex2: "spit (pies) escape",  test: "clap ( ? ) mesh" },
  136: { ex1: "ploy (love) verb",    ex2: "brat (rage) gear",    test: "amid ( ? ) rest" },
  137: { ex1: "train (race) cell",   ex2: "trip (ripe) peat",    test: "smog ( ? ) demo" },
  138: { ex1: "flap (lava) vase",    ex2: "slug (lure) reach",   test: "amen ( ? ) team" },
  139: { ex1: "opine (pile) lemon",  ex2: "gram (rare) recall",  test: "bird ( ? ) isle" },
  140: { ex1: "crisp (risk) skip",   ex2: "swirl (with) thorn",  test: "blot ( ? ) rein" },
  141: { ex1: "drug (ruin) inch",    ex2: "brush (rush) ship",   test: "snow ( ? ) deaf" },
  142: { ex1: "drift (rile) less",   ex2: "trick (rice) cellar", test: "snob ( ? ) tens" },
  143: { ex1: "stick (tide) deli",   ex2: "aside (side) dean",   test: "spat ( ? ) germ" },
  144: { ex1: "ovary (vase) season", ex2: "shake (haze) zest",   test: "ebony ( ? ) debt" },
  145: { ex1: "tweed (weep) epic",   ex2: "amend (menu) nutty",  test: "avid ( ? ) lean" },
  146: { ex1: "ozone (zone) nettle", ex2: "ideal (deaf) after",  test: "smug ( ? ) tear" },
  147: { ex1: "again (gape) period", ex2: "usher (shed) edify",  test: "prim ( ? ) feat" },
  148: { ex1: "naive (aide) decade", ex2: "prom (rosy) symbol",  test: "usage ( ? ) gene" },
  149: { ex1: "abode (body) dye",    ex2: "fatal (atom) omega",  test: "idol ( ? ) zero" },
  150: { ex1: "maple (apex) exit",   ex2: "demon (emit) item",   test: "edit ( ? ) redo" },
};

const vrDataPath = path.join(__dirname, '../src/questionData/vrData.js');
let src = fs.readFileSync(vrDataPath, 'utf8');

// Each question field sits on one line in the file, like:
//   question: "The word in brackets...\n\nex1\nex2\ntest triplet",
// We find the line containing the test triplet and the instruction, then rebuild it.

let count = 0;
const lines = src.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (!line.includes(instruction)) continue;

  // Find which question this line belongs to
  for (const [id, q] of Object.entries(questions)) {
    if (line.includes(q.test + '"')) {
      // Rebuild the question field
      const prefix = line.slice(0, line.indexOf('"') + 1);
      const suffix = line.slice(line.lastIndexOf('"'));
      const newQ = instruction + '\\n\\n' + q.ex1 + '\\n' + q.ex2 + '\\n' + q.test;
      lines[i] = prefix + newQ + suffix;
      count++;
      break;
    }
  }
}

fs.writeFileSync(vrDataPath, lines.join('\n'));
console.log('Replaced', count, 'of 25 expected');

// Verify
delete require.cache[require.resolve('../src/questionData/vrData.js')];
const { default: vr } = require('../src/questionData/vrData.js');
const wca = vr.topics.wordCodeAnalogies.questions;
const v9 = wca.filter(q => q.id >= 126 && q.id <= 150);

const allExamples = [];
let leaks = 0;
v9.forEach(q => {
  const lines2 = q.question.split('\n').filter(l => l.trim());
  const ex1 = lines2[1], ex2 = lines2[2];
  allExamples.push(ex1, ex2);
  const answer = q.options[q.correct];
  if (ex1.includes(answer) || ex2.includes(answer)) {
    console.log('LEAK Q' + q.id + ': answer=' + answer);
    leaks++;
  }
});

const unique = new Set(allExamples).size;
console.log('Example pairs: ' + allExamples.length + ' total, ' + unique + ' unique' + (leaks === 0 ? ', no leaks ✓' : ', LEAKS: ' + leaks));
console.log('\nSample:');
[126, 133, 140, 150].forEach(id => {
  const q = v9.find(x => x.id === id);
  const ql = q.question.split('\n').filter(l => l.trim());
  console.log('Q' + id + ': ' + ql[1] + ' | ' + ql[2]);
});
