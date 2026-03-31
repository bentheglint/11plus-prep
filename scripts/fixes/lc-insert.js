const fs = require('fs');
const path = require('path');
let content = fs.readFileSync(path.join(__dirname, '..', 'src/questionData/vrData.js'), 'utf8');
const mapPath = path.join(__dirname, '..', 'public/vr-question-lesson-map.json');
let mapData = JSON.parse(fs.readFileSync(mapPath, 'utf8'));

function shiftLetter(l, s) { return String.fromCharCode(((l.toUpperCase().charCodeAt(0)-65+s%26+26)%26)+65); }
function encodeWord(w, s) { return typeof s==='number' ? w.split('').map(c=>shiftLetter(c,s)).join('') : w.split('').map((c,i)=>shiftLetter(c,s[i])).join(''); }
function mirrorLetter(l) { return String.fromCharCode((25-(l.toUpperCase().charCodeAt(0)-65))+65); }
function mirrorWord(w) { return w.split('').map(c=>mirrorLetter(c)).join(''); }

const qs = [];
function addQ(id,diff,q,opts,correct,expl,sc) { qs.push({id,difficulty:diff,questionType:'letter-codes',question:q,options:opts,correct,explanation:expl,_sc:sc}); }

// Variable shift (Q126-Q136)
const varData = [
  [126,2,'FISH',[1,2,3,4],'DRAW'],[127,2,'HELP',[-1,-2,-3,-4],'BARK'],[128,3,'LAND',[2,3,4,5],'CART'],
  [129,3,'STONE',[-1,-2,-3,-4,-5],'DRAWN'],[130,3,'BOOK',[1,-1,1,-1],'GAME'],[131,2,'MILK',[1,2,3,4],'COLD'],
  [132,3,'PIANO',[1,2,3,4,5],'TRAIN'],[133,3,'HOUSE',[-2,-3,-4,-5,-6],'RIVER'],[134,2,'RING',[2,1,2,1],'BELL'],
  [135,3,'QUEEN',[-1,-2,-3,-4,-5],'KINGS'],[136,3,'BEACH',[3,2,1,3,2],'HORSE'],
];
varData.forEach(([id,diff,word,shifts,exWord])=>{
  const code=encodeWord(word,shifts), exCode=encodeWord(exWord,shifts);
  const ss=shifts.map(s=>(s>0?'+':'')+s).join(', ');
  const d=[]; for(let i=0;i<4;i++){const t=code.split('');t[i%code.length]=shiftLetter(t[i%code.length],i%2===0?1:-1);d.push(t.join(''));}
  addQ(id,diff,'If '+exWord+' is coded as '+exCode+' (shifts of '+ss+'), what is the code for '+word+'?',
    [code,...d],0,'Apply shifts '+ss+': '+word.split('').map((c,i)=>c+(shifts[i]>0?'+':'')+shifts[i]+'='+shiftLetter(c,shifts[i])).join(', ')+' = '+code+'. ✓','variable-shift');
});

// Wrap-around (Q137-Q148)
[[137,2,'YARD',3,'e'],[138,2,'WAXY',2,'e'],[139,2,'ZERO',4,'e'],[140,2,'BUZZ',3,'e'],
 [141,3,'COZY',5,'e'],[142,3,'JINX',4,'e'],[143,2,'TAXI',-3,'d'],[144,2,'NEXT',-4,'d'],
 [145,3,'MAZE',-5,'d'],[146,3,'LYNX',3,'e'],[147,2,'YAWN',2,'e'],[148,3,'FIZZY',4,'e']
].forEach(([id,diff,word,shift,dir])=>{
  const code=encodeWord(word,shift), ex='HELP', exCode=encodeWord(ex,shift);
  if(dir==='e'){
    const d=[]; for(let i=0;i<4;i++){const t=code.split('');t[i%code.length]=shiftLetter(t[i%code.length],i%2===0?1:-1);d.push(t.join(''));}
    addQ(id,diff,'If '+ex+' is coded as '+exCode+' (each letter '+(shift>0?'+':'')+shift+'), what is the code for '+word+'?',
      [code,...d],0,'Apply '+(shift>0?'+':'')+shift+': '+word.split('').map(c=>c+(shift>0?'+':'')+shift+'='+shiftLetter(c,shift)).join(', ')+' = '+code+'. Wrap-around! ✓','wrap-around');
  } else {
    const opts=[word]; for(let i=0;i<4;i++){const t=word.split('');t[i%word.length]=shiftLetter(t[i%word.length],i%2===0?1:-1);opts.push(t.join(''));}
    addQ(id,diff,'If '+ex+' is coded as '+exCode+' (each letter '+(shift>0?'+':'')+shift+'), what word is coded as '+code+'?',
      opts,0,'Reverse: '+(shift>0?'-':'+')+Math.abs(shift)+' on '+code+': '+code.split('').map(c=>c+(shift>0?'-':'+')+Math.abs(shift)+'='+shiftLetter(c,-shift)).join(', ')+' = '+word+'. ✓','wrap-around');
  }
});

// Mirror (Q149-Q156)
[[149,2,'HELP','e'],[150,2,'COLD','e'],[151,2,'SWIM','e'],[152,3,'RAIN','d'],[153,3,'DARK','d'],[154,3,'LIGHT','e'],[155,3,'MONEY','e'],[156,3,'BRAVE','d']
].forEach(([id,diff,word,dir])=>{
  const code=mirrorWord(word), ex='STOP', exCode=mirrorWord(ex);
  if(dir==='e'){
    const d=[]; for(let i=0;i<4;i++){const t=code.split('');t[i%code.length]=shiftLetter(t[i%code.length],i+1);d.push(t.join(''));}
    addQ(id,diff,'If '+ex+' is coded as '+exCode+' (mirror code: A=Z, B=Y, C=X), what is the code for '+word+'?',
      [code,...d],0,'Mirror: '+word.split('').map(c=>c+'='+mirrorLetter(c)).join(', ')+' = '+code+'. ✓','mirror-code');
  } else {
    const opts=[word]; for(let i=0;i<4;i++){const t=word.split('');t[i%word.length]=shiftLetter(t[i%word.length],i%2===0?1:-1);opts.push(t.join(''));}
    addQ(id,diff,'If '+ex+' is coded as '+exCode+' (mirror code: A=Z, B=Y, C=X), what word is coded as '+code+'?',
      opts,0,'Mirror reverses itself: '+code.split('').map(c=>c+'='+mirrorLetter(c)).join(', ')+' = '+word+'. ✓','mirror-code');
  }
});

// Larger shifts (Q157-Q166)
[[157,2,'GOLD',3,'e'],[158,2,'FARM',-3,'e'],[159,2,'DESK',4,'e'],[160,2,'JUMP',-4,'e'],[161,3,'TRAIN',3,'e'],
 [162,3,'CLOCK',-3,'e'],[163,3,'RIVER',4,'e'],[164,3,'PLANE',-4,'d'],[165,3,'STORM',3,'d'],[166,2,'SHIP',-3,'d']
].forEach(([id,diff,word,shift,dir])=>{
  const code=encodeWord(word,shift), ex='BLUE', exCode=encodeWord(ex,shift);
  if(dir==='e'){
    const d=[]; for(let i=0;i<4;i++){const t=code.split('');t[i%code.length]=shiftLetter(t[i%code.length],i%2===0?1:-1);d.push(t.join(''));}
    addQ(id,diff,'If '+ex+' is coded as '+exCode+' (each letter '+(shift>0?'+':'')+shift+'), what is the code for '+word+'?',
      [code,...d],0,'Apply '+(shift>0?'+':'')+shift+': '+word.split('').map(c=>c+(shift>0?'+':'')+shift+'='+shiftLetter(c,shift)).join(', ')+' = '+code+'. ✓',
      shift>0?'forward-shift':'backward-shift');
  } else {
    const opts=[word]; for(let i=0;i<4;i++){const t=word.split('');t[i%word.length]=shiftLetter(t[i%word.length],i%2===0?1:-1);opts.push(t.join(''));}
    addQ(id,diff,'If '+ex+' is coded as '+exCode+' (each letter '+(shift>0?'+':'')+shift+'), what word is coded as '+code+'?',
      opts,0,'Reverse '+(shift>0?'-':'+')+Math.abs(shift)+': '+code.split('').map(c=>c+(shift>0?'-':'+')+Math.abs(shift)+'='+shiftLetter(c,-shift)).join(', ')+' = '+word+'. ✓','reverse-decoding');
  }
});

console.log('Generated', qs.length, 'questions');

// Validate
let ok=true;
qs.forEach(q=>{ if(new Set(q.options).size<5){console.log('Q'+q.id+': dup opts');ok=false;} if(q.options.length!==5){console.log('Q'+q.id+': '+q.options.length+' opts');ok=false;} });
if(!ok){process.exit(1);}
console.log('All valid');

// INSERT before the ] that closes letterCodes questions array
const lcStart = content.indexOf('letterCodes');
const nextTopic = content.indexOf('letterPairSeries');
const lcRange = content.substring(lcStart, nextTopic);
const lastBracket = lcRange.lastIndexOf(']');
const insertPos = lcStart + lastBracket;

const qStr = qs.map(q => {
  const os = q.options.map(o => '"'+o+'"').join(', ');
  return `        {\n          "id": ${q.id},\n          "difficulty": ${q.difficulty},\n          "questionType": "${q.questionType}",\n          "question": "${q.question}",\n          "options": [${os}],\n          "correct": ${q.correct},\n          "explanation": "${q.explanation}"\n        }`;
}).join(',\n');

content = content.substring(0, insertPos) + ',\n' + qStr + '\n      ' + content.substring(insertPos);

// Add mappings
const existingCount = Object.keys(mapData.letterCodes).length;
let idx = existingCount;
qs.forEach(q => {
  mapData.letterCodes[String(idx)] = { questionId: q.id, subConceptId: q._sc, confidence: 'high' };
  idx++;
});

// Verify
const r = content.substring(content.indexOf('letterCodes'), content.indexOf('letterPairSeries'));
const ids = [...r.matchAll(/"id":\s*(\d+)|id:\s*(\d+)/g)].map(m => +(m[1]||m[2]));
console.log('letterCodes total:', ids.length, 'questions');

const groups = {};
Object.values(mapData.letterCodes).forEach(e => { if(!groups[e.subConceptId])groups[e.subConceptId]=0; groups[e.subConceptId]++; });
Object.entries(groups).sort((a,b)=>a[1]-b[1]).forEach(([sc,c])=>console.log('  '+sc+': '+c+(c<15?' <--':'')));

fs.writeFileSync(path.join(__dirname, '..', 'src/questionData/vrData.js'), content, 'utf8');
fs.writeFileSync(mapPath, JSON.stringify(mapData, null, 2), 'utf8');
console.log('\nWritten successfully ✓');
