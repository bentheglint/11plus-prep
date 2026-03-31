const fs = require('fs');
const path = require('path');

const VR_DATA = path.join(__dirname, '..', 'src/questionData/vrData.js');
let content = fs.readFileSync(VR_DATA, 'utf8');

const shiftTips = {
  '+1': "Tip: +1 is the most common GL code — practise until it's automatic!",
  '-1': "Tip: -1 is the reverse of +1. If encoding goes forward, decoding goes back!",
  '+2': "Tip: For +2, skip one letter each time. Use the alphabet line!",
  '-2': "Tip: For -2, count back two letters. Use EJOTY anchors to check!",
  '+3': "Tip: For +3, use EJOTY (E=5, J=10, O=15, T=20, Y=25) as anchor points.",
  '-3': "Tip: For -3, count back three. Watch for wrap-around near A!",
  '+4': "Tip: Larger shifts need careful counting — write out the alphabet!",
  '-4': "Tip: With -4, letters near A wrap around (A-4=W).",
  'general': "Tip: Always check every letter — don't assume the shift from just the first one."
};

const lcStart = content.indexOf('letterCodes');
const lpStart = content.indexOf('letterPairSeries');
const before = content.substring(0, lcStart);
let section = content.substring(lcStart, lpStart);
const after = content.substring(lpStart);

// Fix unquoted-key explanations: explanation: "..."
const pattern = /explanation:\s*"([^"]+)"/g;
let match;
let count = 0;

section = section.replace(pattern, (fullMatch, expl) => {
  if (expl.length >= 110 && expl.toLowerCase().match(/tip:|remember|trick/)) return fullMatch;

  let improved = expl;
  const lower = expl.toLowerCase();

  // Determine tip type
  let tipKey = 'general';
  if (lower.includes('mirror')) tipKey = 'mirror';
  else if (lower.includes('wrap') || lower.match(/[xyz].*=[abc]/i)) tipKey = 'wrap';
  else {
    const shiftM = expl.match(/([+-]\d+)/);
    if (shiftM && shiftTips[shiftM[1]]) tipKey = shiftM[1];
  }

  if (!lower.match(/tip:|remember|trick|helpful|think of/)) {
    const tip = shiftTips[tipKey] || shiftTips['general'];
    if (improved.endsWith(' \u2713')) {
      improved = improved.slice(0, -2) + ' ' + tip + ' \u2713';
    } else if (improved.endsWith('\u2713')) {
      improved = improved.slice(0, -1) + ' ' + tip + ' \u2713';
    } else {
      improved = improved + ' ' + tip + ' \u2713';
    }
    count++;
  }

  return 'explanation: "' + improved + '"';
});

console.log('Enhanced:', count, 'unquoted-key explanations');

// Verify
const allExpls = [...section.matchAll(/(?:"explanation":|explanation:)\s*"([^"]+)"/g)].map(m => m[1]);
console.log('Total explanations:', allExpls.length);
console.log('Avg length:', Math.round(allExpls.reduce((s, e) => s + e.length, 0) / allExpls.length));
console.log('Under 80 chars:', allExpls.filter(e => e.length < 80).length);
console.log('Has tip:', allExpls.filter(e => e.toLowerCase().match(/tip:|remember|trick|helpful/)).length, '/', allExpls.length);

content = before + section + after;
fs.writeFileSync(VR_DATA, content, 'utf8');
console.log('Written ✓');
