const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src', 'App.js');
let content = fs.readFileSync(appPath, 'utf8');
let lines = content.split('\n');

// Scan Long Division section for word problems with non-integer division
const errors = [];

for (let i = 2366; i < 3572; i++) {
  if (!lines[i].includes('question:')) continue;
  // Skip pure "What is X ÷ Y?" - already fixed
  if (lines[i].includes('What is') && lines[i].includes('÷')) continue;

  const question = lines[i];

  // Find all numbers in the question
  const nums = [];
  const numRegex = /[\d,]+/g;
  let m;
  const cleanQ = question.replace(/question:\s*"/, '').replace(/",$/, '');
  while ((m = numRegex.exec(cleanQ)) !== null) {
    const n = parseInt(m[0].replace(/,/g, ''));
    if (n > 0) nums.push(n);
  }

  // For division word problems, typically the larger number is divided by the smaller
  if (nums.length < 2) continue;

  // Sort: largest first
  const sorted = [...nums].sort((a, b) => b - a);
  const dividend = sorted[0];
  const divisor = sorted[1];

  if (divisor === 0 || dividend === divisor) continue;
  if (dividend / divisor > 200) continue; // Probably not a simple division

  const result = dividend / divisor;

  // Get correct answer
  const optionsLine = lines[i + 1];
  const correctLine = lines[i + 2];

  const correctMatch = correctLine?.match(/correct:\s*(\d+)/);
  if (!correctMatch) continue;
  const correctIdx = parseInt(correctMatch[1]);

  const optionsMatch = optionsLine?.match(/options:\s*\[(.*)\]/);
  if (!optionsMatch) continue;
  const options = [];
  const optRegex = /"([^"]*)"/g;
  let optM;
  while ((optM = optRegex.exec(optionsMatch[1])) !== null) {
    options.push(optM[1]);
  }

  const correctOption = options[correctIdx];
  const intendedAnswer = parseInt(correctOption?.replace(/[^0-9]/g, ''));

  if (!Number.isInteger(result) && intendedAnswer) {
    // Check if dividend / divisor actually equals intendedAnswer
    if (divisor * intendedAnswer !== dividend) {
      // Find the id
      let qId = '?';
      for (let j = i - 3; j < i; j++) {
        const idMatch = lines[j]?.match(/id:\s*(\d+)/);
        if (idMatch) { qId = idMatch[1]; break; }
      }

      const newDividend = divisor * intendedAnswer;
      console.log(`ID ${qId} (line ${i}): ${dividend} ÷ ${divisor} = ${result.toFixed(2)}, intended=${intendedAnswer}`);
      console.log(`  Fix: change ${dividend} to ${newDividend}`);
      console.log(`  Q: ${cleanQ.substring(0, 100)}`);

      // Fix the dividend in the question
      const oldDividendStr = dividend >= 1000 ? dividend.toLocaleString('en-GB') : String(dividend);
      const newDividendStr = newDividend >= 1000 ? newDividend.toLocaleString('en-GB') : String(newDividend);

      // Try with and without commas
      const variants = [String(dividend), dividend.toLocaleString('en-GB')];
      let fixed = false;
      for (const v of variants) {
        if (lines[i].includes(v)) {
          lines[i] = lines[i].replace(v, newDividendStr);
          fixed = true;
          break;
        }
      }

      if (fixed) {
        // Fix explanation
        const explLine = lines[i + 3];
        if (explLine?.includes('explanation:')) {
          const formatNum = (n) => n >= 1000 ? n.toLocaleString('en-GB') : String(n);
          const unit = correctOption.includes('£') ? '£' : '';
          const newExpl = `Divide: ${unit}${formatNum(newDividend)} ÷ ${divisor} = ${unit}${intendedAnswer}. Check: ${divisor} × ${unit}${intendedAnswer} = ${unit}${formatNum(newDividend)}. ✓`;
          lines[i + 3] = lines[i + 3].replace(/explanation:\s*"[^"]*"/, `explanation: "${newExpl}"`);
        }
        console.log(`  FIXED!`);
        errors.push(qId);
      } else {
        console.log(`  Could not find "${dividend}" in question text to replace`);
      }
      console.log();
    }
  }
}

console.log(`\nTotal word problem fixes: ${errors.length}`);
fs.writeFileSync(appPath, lines.join('\n'), 'utf8');
console.log('App.js updated.');
