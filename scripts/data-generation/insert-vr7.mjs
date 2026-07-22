#!/usr/bin/env node
// Insert verified VR fix #7 content.
//  A) hiddenWords: IN-PLACE rewrite of ids 1-150 (natural sentences). Difficulty layout
//     preserved: D1->ids 1-45, D2->46-105, D3->106-150. Full-block replace. No position
//     balancing (correctPair is content-determined). Payload stripped.
//  B) balanceEquations: APPEND ids 31-100 (+70). Numeric answer position-balanced A-E (seeded).
//  C) lesson map: +70 balanceEquations entries (reuse 'balance-equations' subConcept).
// Deterministic (seeded). CRLF-safe. Guard: refuses if balanceEq maxid != 30.
//
// Usage: node scripts/data-generation/insert-vr7.mjs            (dry-run)
//        node scripts/data-generation/insert-vr7.mjs --apply

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..', '..');
const SP = 'C:/Users/benja/AppData/Local/Temp/claude/C--Users-benja-Documents-11plus-prep/580f678c-31ee-402e-88fe-6de06ba58629/scratchpad';
const apply = process.argv.includes('--apply');

function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function shuffle(arr,rng){const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function balancedPositions(n,seed){const pool=[];for(let i=0;i<n;i++)pool.push(i%5);return shuffle(pool,mulberry32(seed));}
function rebalance(options,correct,target){const c=options[correct];const others=options.filter((_,i)=>i!==correct);const out=new Array(5);out[target]=c;let k=0;for(let i=0;i<5;i++){if(i===target)continue;out[i]=others[k++];}return{options:out,correct:target};}

const data = JSON.parse(fs.readFileSync(path.join(SP,'vr7-clean.json'),'utf8'));

// ---------- A) hiddenWords in-place rewrite ----------
const hw = data.hiddenWords;
const byDiff = {1:[],2:[],3:[]};
hw.forEach(q=>byDiff[q.difficulty].push(q));
if(byDiff[1].length!==45||byDiff[2].length!==60||byDiff[3].length!==45){console.error('hiddenWords difficulty split not 45/60/45:',byDiff[1].length,byDiff[2].length,byDiff[3].length);process.exit(1);}
const ordered = [...byDiff[1],...byDiff[2],...byDiff[3]]; // -> ids 1..150
const hwItems = ordered.map((q,i)=>({id:i+1,difficulty:q.difficulty,questionType:'select-two',question:q.question,options:q.options,correctPair:q.correctPair,explanation:q.explanation}));

function serHw(it){
  const q=JSON.stringify;
  return ['        {',
    `          id: ${it.id},`,
    `          difficulty: ${it.difficulty},`,
    `          questionType: "select-two",`,
    `          question: ${q(it.question)},`,
    `          options: ${q(it.options)},`,
    `          correctPair: [${it.correctPair[0]}, ${it.correctPair[1]}],`,
    `          explanation: ${q(it.explanation)}`,
    '        }'].join('\r\n');
}
const hwBlock = '    hiddenWords: {\r\n      name: "Hidden Words",\r\n      questions: [\r\n' + hwItems.map(serHw).join(',\r\n') + '\r\n      ]\r\n    },';

const vrPath = path.join(REPO,'src','questionData','vrData.js');
let vr = fs.readFileSync(vrPath,'utf8');
const HW_START='    hiddenWords: {';
const LM_START='    letterMove: {';
if(vr.indexOf(HW_START)<0||vr.indexOf(HW_START)!==vr.lastIndexOf(HW_START)){console.error('hiddenWords anchor missing/duplicate');process.exit(1);}
if(vr.indexOf(LM_START)<0||vr.indexOf(LM_START)!==vr.lastIndexOf(LM_START)){console.error('letterMove anchor missing/duplicate');process.exit(1);}
const before = vr.slice(0, vr.indexOf(HW_START));
const afterLM = vr.slice(vr.indexOf(LM_START)+LM_START.length);
let vrNew = before + hwBlock + '\r\n\r\n' + LM_START + afterLM;

// ---------- B) balanceEquations append (ids 31-100, position-balanced) ----------
const be = data.balanceEquations;
if(be.length!==70){console.error('expected 70 balanceEq, got',be.length);process.exit(1);}
const bePos = balancedPositions(70,20260724);
const beItems = be.map((q,i)=>{
  const {options,correct}=rebalance(q.options,q.correct,bePos[i]);
  return {id:31+i,difficulty:q.difficulty,question:q.question,options,correct,explanation:q.explanation};
});
function serBe(it){
  const q=JSON.stringify;
  return ['        {',
    `          id: ${it.id},`,
    `          difficulty: ${it.difficulty},`,
    `          question: ${q(it.question)},`,
    `          options: ${q(it.options)},`,
    `          correct: ${it.correct},`,
    `          explanation: ${q(it.explanation)}`,
    '        }'].join('\r\n');
}
const beText = beItems.map(serBe).join(',\r\n');
// file ends: <id30 }>\r\n      ]\r\n    }\r\n  }\r\n};  (balanceEq is last topic)
const BE_ANCHOR='\r\n        }\r\n      ]\r\n    }\r\n  }\r\n};';
if(vrNew.indexOf(BE_ANCHOR)<0||vrNew.indexOf(BE_ANCHOR)!==vrNew.lastIndexOf(BE_ANCHOR)){console.error('balanceEq end anchor missing/duplicate');process.exit(1);}
vrNew = vrNew.replace(BE_ANCHOR, '\r\n        },\r\n'+beText+'\r\n      ]\r\n    }\r\n  }\r\n};');

// ---------- C) lesson map ----------
const mapPath = path.join(REPO,'public','vr-question-lesson-map.json');
const map = JSON.parse(fs.readFileSync(mapPath,'utf8'));
const newMap = beItems.map(it=>({questionId:it.id,subConceptId:'balance-equations',confidence:'high'}));

// ---------- report ----------
const bePosDist=[0,0,0,0,0];beItems.forEach(it=>bePosDist[it.correct]++);
console.log('=== INSERT VR7 — '+(apply?'APPLY':'DRY-RUN')+' ===');
console.log('hiddenWords: rewrite 150 in place (D1 ids1-45, D2 46-105, D3 106-150)');
console.log('balanceEquations: append 70, ids 31-100; new answer-position spread A-E:',bePosDist.join('/'));
console.log('lesson-map: +'+newMap.length+' balanceEquations entries');

if(!apply){console.log('\n(dry-run — nothing written)');process.exit(0);}
// GUARD: balanceEq must currently end at id 30
const beBlock = vr.slice(vr.indexOf('    balanceEquations: {'));
const beIds=[...beBlock.matchAll(/id:\s*(\d+)/g)].map(m=>+m[1]);
if(Math.max(...beIds)!==30){console.error('GUARD: balanceEq maxid is',Math.max(...beIds),'expected 30 — aborting (already inserted?)');process.exit(1);}

fs.writeFileSync(vrPath,vrNew);
map.balanceEquations=[...(map.balanceEquations||[]),...newMap];
fs.writeFileSync(mapPath,JSON.stringify(map,null,2)+'\n');
console.log('\nWROTE: vrData.js (hiddenWords rewritten + 70 balanceEq appended), vr-question-lesson-map.json (+70)');
