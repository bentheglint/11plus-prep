const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src', 'App.js');
let content = fs.readFileSync(appPath, 'utf8');
let lines = content.split('\n');

// Long Division section: lines 2366-3571
// Find all questions of the form "What is XXXX ÷ YY?" where the division doesn't produce an integer
const fixes = [];

for (let i = 2366; i < 3572; i++) {
  const line = lines[i];
  if (!line.includes('question:')) continue;

  // Match "What is XXXX ÷ YY?" pattern
  const match = line.match(/What is (\d[\d,]*)\s*÷\s*(\d[\d,]*)\?/);
  if (!match) continue;

  const dividend = parseInt(match[1].replace(/,/g, ''));
  const divisor = parseInt(match[2].replace(/,/g, ''));
  const result = dividend / divisor;

  if (Number.isInteger(result)) continue; // Already correct

  // Find the correct option value (what the answer is supposed to be)
  // The correct field is 2 lines after question
  const optionsLine = lines[i + 1]; // options line
  const correctLine = lines[i + 2]; // correct line

  const correctMatch = correctLine.match(/correct:\s*(\d+)/);
  if (!correctMatch) continue;
  const correctIdx = parseInt(correctMatch[1]);

  // Parse options
  const optionsMatch = optionsLine.match(/options:\s*\[(.*)\]/);
  if (!optionsMatch) continue;
  const options = [];
  const optRegex = /"([^"]*)"/g;
  let optM;
  while ((optM = optRegex.exec(optionsMatch[1])) !== null) {
    options.push(optM[1]);
  }

  const intendedAnswer = parseInt(options[correctIdx]);
  if (isNaN(intendedAnswer)) continue;

  // Fix: adjust dividend so that dividend ÷ divisor = intendedAnswer exactly
  const newDividend = divisor * intendedAnswer;

  // Format dividend with comma if >= 1000
  const formatNum = (n) => n >= 1000 ? n.toLocaleString('en-GB') : String(n);

  const newDividendStr = formatNum(newDividend);
  const oldDividendStr = match[1];

  // Find the id
  let qId = '?';
  for (let j = i - 3; j < i; j++) {
    const idMatch = lines[j].match(/id:\s*(\d+)/);
    if (idMatch) { qId = idMatch[1]; break; }
  }

  console.log(`ID ${qId}: ${dividend} ÷ ${divisor} = ${result.toFixed(2)} → fixing dividend to ${newDividend} (${newDividend} ÷ ${divisor} = ${intendedAnswer})`);

  // Fix the question line
  lines[i] = lines[i].replace(
    `What is ${oldDividendStr} ÷ ${divisor}?`,
    `What is ${newDividendStr} ÷ ${divisor}?`
  );

  // Fix the explanation line (i + 3)
  const explLine = lines[i + 3];
  if (explLine && explLine.includes('explanation:')) {
    // Generate a clean explanation
    const d1 = Math.floor(newDividend / divisor); // should equal intendedAnswer
    // Build long division steps
    let expl = '';

    // Simple two-step long division explanation
    const dividendStr = String(newDividend);
    const firstPart = parseInt(dividendStr.substring(0, dividendStr.length - 1));
    const lastDigit = parseInt(dividendStr[dividendStr.length - 1]);

    // How many times does divisor go into first part?
    const firstQuot = Math.floor(firstPart / divisor);
    const firstProd = firstQuot * divisor;
    const firstRemainder = firstPart - firstProd;
    const bringDown = firstRemainder * 10 + lastDigit;
    const secondQuot = Math.floor(bringDown / divisor);
    const secondProd = secondQuot * divisor;

    if (firstQuot > 0 && bringDown >= 0 && secondProd === bringDown) {
      expl = `${divisor} goes into ${firstPart} ${firstQuot === 1 ? 'once' : firstQuot + ' times'} (${divisor} × ${firstQuot} = ${firstProd}), remainder ${firstRemainder}. Bring down ${lastDigit} to make ${bringDown}. ${divisor} goes into ${bringDown} ${secondQuot === 1 ? 'once' : secondQuot + ' times'} (${divisor} × ${secondQuot} = ${secondProd}). Answer: ${intendedAnswer}. ✓`;
    } else {
      // Simpler explanation
      expl = `${newDividendStr} ÷ ${divisor} = ${intendedAnswer}. Check: ${divisor} × ${intendedAnswer} = ${formatNum(newDividend)}. ✓`;
    }

    lines[i + 3] = lines[i + 3].replace(/explanation:\s*"[^"]*"/, `explanation: "${expl}"`);
  }

  fixes.push(qId);
}

console.log(`\nTotal fixes: ${fixes.length}`);
console.log(`Fixed IDs: ${fixes.join(', ')}`);

// Write back
fs.writeFileSync(appPath, lines.join('\n'), 'utf8');
console.log('App.js updated successfully.');
