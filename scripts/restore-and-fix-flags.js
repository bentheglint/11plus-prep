#!/usr/bin/env node
/**
 * restore-and-fix-flags.js
 *
 * Restores the 14 flags I accidentally deleted via /flags/resolve, then
 * correctly marks them all as 'fixed' (green tick, still visible for review)
 * via /flags/fix.
 *
 * For each flag:
 *   1. POST /flags with original content → gets new id + timestamp (pending)
 *   2. POST /flags/fix with the new id + fix note → status: fixed
 */

const WORKER = 'https://11plus-ai-tutor.benjacko82.workers.dev';

// Original flags (copied from the fetch before resolve was called).
const flags = [
  { origId: 1776352351388, submitter: 'Jacqui', type: 'question', questionId: 155, topicKey: 'datahandling', topicName: 'Data Handling', subject: 'maths', difficulty: 2, hasVisual: true, category: 'Bad diagram', note: 'Colours are labelled incorrectly ',
    fixNote: 'Added label-colour mapping in BarChart/PieChart — bars/slices labelled "Red"/"Blue" etc now render in matching colours.' },
  { origId: 1776440553534, submitter: 'Jacqui', type: 'question', questionId: 122, topicKey: 'letterCodes', topicName: 'Letter Codes', subject: 'verbalreasoning', difficulty: 3, hasVisual: true, category: 'Other', note: 'Question tells you the code and mentions GL',
    fixNote: 'GL reference removed (replaced with "11+" across the app). Oracle kept the progressive-shift scaffold as legitimate D3 introduction.' },
  { origId: 1776692991888, submitter: 'Ben', type: 'question', questionId: 9, topicKey: 'areaperimeter', topicName: 'Area and Perimeter', subject: 'maths', difficulty: 1, hasVisual: true, category: 'Bad diagram', note: 'The dotted lines means you just have to count the number of tiles rather than work it out. ',
    fixNote: 'Removed showGrid:true — rectangle now shown without tile grid, child calculates 3×2.' },
  { origId: 1776693436110, submitter: 'Ben', type: 'question', questionId: 147, topicKey: 'anglesshapes', topicName: 'Angles and Shapes', subject: 'maths', difficulty: 1, hasVisual: true, category: 'Bad diagram', note: 'Diagram shows 90 label which is the answer',
    fixNote: 'Label changed from "90°" to "?°". Explanation expanded to describe the right-angle shape.' },
  { origId: 1776693545454, submitter: 'Ben', type: 'question', questionId: 121, topicKey: 'areaperimeter', topicName: 'Area and Perimeter', subject: 'maths', difficulty: 2, hasVisual: true, category: 'Bad diagram', note: 'Diagram is not a square',
    fixNote: 'Added square:true prop to RectangleDiagram — now forces 1:1 aspect regardless of defaults.' },
  { origId: 1776693680284, submitter: 'Ben', type: 'question', questionId: 103, topicKey: 'areaperimeter', topicName: 'Area and Perimeter', subject: 'maths', difficulty: 2, hasVisual: true, category: 'Bad diagram', note: 'Diagram shows the answer',
    fixNote: 'length changed from 22 to "?", label "Perimeter = 72 m" added. Child now has to calculate.' },
  { origId: 1776696141375, submitter: 'Ben', type: 'question', questionId: 34, topicKey: 'areaperimeter', topicName: 'Area and Perimeter', subject: 'maths', difficulty: 1, hasVisual: true, category: 'Bad diagram', note: 'Diagram is not a square',
    fixNote: 'Added square:true prop — diagram now renders as a square matching the question.' },
  { origId: 1776696874913, submitter: 'Jacqui', type: 'lesson', topicKey: 'areaperimeter', topicName: 'Area & Perimeter', subConceptId: 'paths-and-borders', subConceptName: 'Area of Path/Border (outer minus inner)', lessonId: 'paths-and-borders-curiosity', screenIndex: 3, screenType: 'interact', category: 'Visual/diagram issue', note: 'Measurements and areas are wrong',
    fixNote: 'Interact screen now uses the same outerArea/innerArea/pathArea values as the teach screen — diagram and question numbers now match.' },
  { origId: 1776697308674, submitter: 'Jacqui', type: 'question', questionId: 16, topicKey: 'volume', topicName: 'Volume', subject: 'maths', difficulty: 2, hasVisual: true, category: 'Bad diagram', note: 'Cuboid diagram shows the height answer',
    fixNote: 'cuboid2.height changed from 4 to "?". Diagram no longer reveals the answer.' },
  { origId: 1776697714151, submitter: 'Jacqui', type: 'question', questionId: 103, topicKey: 'areaperimeter', topicName: 'Area and Perimeter', subject: 'maths', difficulty: 2, hasVisual: true, category: 'Bad diagram', note: 'Diagram shows the answer',
    fixNote: 'Same fix as Ben\'s Q103 flag: length "?" + perimeter label added.' },
  { origId: 1776697797730, submitter: 'Jacqui', type: 'question', questionId: 123, topicKey: 'areaperimeter', topicName: 'Area and Perimeter', subject: 'maths', difficulty: 2, hasVisual: true, category: 'Bad diagram', note: '',
    fixNote: 'length changed from 26 to "?", label "Perimeter = 84 cm" added.' },
  { origId: 1776697820508, submitter: 'Jacqui', type: 'question', questionId: 123, topicKey: 'areaperimeter', topicName: 'Area and Perimeter', subject: 'maths', difficulty: 2, hasVisual: true, category: 'Bad diagram', note: 'Diagram shows the answer ',
    fixNote: 'Same fix as the other Q123 flag: length "?" + perimeter label added.' },
  { origId: 1776698583777, submitter: 'Jacqui', type: 'lesson', topicKey: 'datahandling', topicName: 'Data Handling', subConceptId: 'reading-bar-charts', subConceptName: 'Reading Bar Charts', lessonId: 'reading-bar-charts-discovery', screenIndex: 3, screenType: 'interact', category: 'Visual/diagram issue', note: 'Diagram shows the answer above the bar rather than working it out from the axis',
    fixNote: 'Added showValues:false on interact BarChart. Child now reads values off the axis instead of seeing them printed above the bars.' },
  { origId: 1776782159204, submitter: 'Jacqui', type: 'question', questionId: 92, topicKey: 'datahandling', topicName: 'Data Handling', subject: 'maths', difficulty: 2, hasVisual: true, category: 'Confusing wording', note: 'Again using different colours from those labelled',
    fixNote: 'Same PieChart colour-mapping fix as Q155 — label-based colour matching now applied.' }
];

async function post(path, body) {
  const res = await fetch(`${WORKER}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return res.json();
}

async function getAll() {
  const res = await fetch(`${WORKER}/flags`);
  return res.json();
}

(async () => {
  for (const f of flags) {
    const { origId, fixNote, ...payload } = f;
    // Re-post (creates a new flag with fresh id + pending status)
    await post('/flags', payload);
    // Fetch to find the one we just posted (last in list)
    const all = await getAll();
    const newest = all[all.length - 1];
    // Mark it as fixed with the fix note
    await post('/flags/fix', { flagId: newest.id, fixNote });
    console.log(`Restored+fixed: Q${payload.questionId || payload.subConceptId} (${payload.submitter})`);
  }
  const final = await getAll();
  console.log(`\nTotal flags now: ${final.length}`);
  console.log(`Fixed: ${final.filter(f => f.status === 'fixed').length}`);
  console.log(`Pending: ${final.filter(f => f.status === 'pending').length}`);
})();
