#!/usr/bin/env node
// Scan ALL letterCodes Qs (not just the generic-tip ones) and report any
// constant-shift Q whose tip doesn't match the Oracle canonical tip for
// its shift skill (the skill the child must apply to solve the Q).

const fs = require('fs');
const path = require('path');

const CANONICAL_TIPS = {
  '+1': "For +1, each letter moves one step forward. A handy check: the last letter of the alphabet, Z, wraps round to A.",
  '-1': "For -1, each letter moves one step back. Watch the start of the alphabet — A wraps round to Z.",
  '+2': "For +2, skip one letter each time — B goes to D, skipping C. Use the alphabet line to count carefully.",
  '-2': "For -2, skip one letter going backwards — F goes to D, skipping E. Near A, letters wrap round to the end.",
  '+3': "For +3, use the EJOTY anchors (E=5, J=10, O=15, T=20, Y=25) as signposts — jump to the nearest anchor, then count on.",
  '-3': "For -3, count back three places using EJOTY anchors (E, J, O, T, Y) as signposts. Near A, letters wrap round to Z, Y, X.",
};

function classifySkill(exp) {
  // Progressive shifts (varying per position) → not constant-shift.
  if (/\+1,\s*\+2,\s*\+3|\+2,\s*\+3,\s*\+4|progressive|increasing|pattern above the letters/i.test(exp)) return null;
  // Mirror codes.
  if (/mirror|A=Z|reverse.*alphabet|reflected/i.test(exp)) return null;

  // "To decode, move each letter forward N" → child applies +N skill.
  let m = exp.match(/to decode[^.]*?forward (\d+)/i);
  if (m) return `+${m[1]}`;
  m = exp.match(/to decode[^.]*?back (\d+)/i);
  if (m) return `-${m[1]}`;

  // Direct "Each letter moves forward N" / "moves back N" etc.
  m = exp.match(/(?:move(?:s)? (?:each letter )?forward|moves forward|moved forward) (\d+)/i);
  if (m) return `+${m[1]}`;
  m = exp.match(/(?:move(?:s)? (?:each letter )?back|moves back|moved back) (\d+)/i);
  if (m) return `-${m[1]}`;

  return null;
}

function loadLetterCodes() {
  const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'questionData', 'vrData.js'), 'utf8');
  const start = src.indexOf('letterCodes: {');
  const rest = src.slice(start);
  const nextTopic = rest.search(/\n {4}[a-zA-Z]+: \{$/m);
  return nextTopic === -1 ? rest : rest.slice(0, nextTopic);
}

function parseQuestions(block) {
  const qs = [];
  const re = /id: (\d+),\s*difficulty: (\d+),[\s\S]*?question: "([^"]*)",[\s\S]*?explanation: "([^"]*)"/g;
  let m;
  while ((m = re.exec(block)) !== null) {
    qs.push({ id: Number(m[1]), difficulty: Number(m[2]), question: m[3], explanation: m[4] });
  }
  return qs;
}

function main() {
  const block = loadLetterCodes();
  const qs = parseQuestions(block);

  const summary = { skill: {}, mismatched: [] };

  for (const q of qs) {
    const skill = classifySkill(q.explanation);
    if (!skill) continue;
    if (!CANONICAL_TIPS[skill]) continue;
    summary.skill[skill] = (summary.skill[skill] || 0) + 1;

    if (!q.explanation.includes(CANONICAL_TIPS[skill])) {
      // Extract the current tip (everything after "Tip: " to the end or "✓")
      const tipMatch = q.explanation.match(/Tip: ([^✓]*)/);
      summary.mismatched.push({
        id: q.id,
        skill,
        currentTip: tipMatch ? tipMatch[1].trim() : '(no tip)',
      });
    }
  }

  console.log('Constant-shift Q counts (by skill):');
  for (const [k, v] of Object.entries(summary.skill).sort()) {
    console.log(`  ${k.padEnd(4)} ${v}`);
  }
  console.log('');
  console.log(`Mismatched tips: ${summary.mismatched.length}`);
  for (const m of summary.mismatched) {
    console.log(`  Q${m.id} [${m.skill}]: ${m.currentTip.slice(0, 100)}`);
  }
}

main();
