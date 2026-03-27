// Test the actual value resolution
const vars = { acuteAngle: 35, rightAngle: 90, obtuseAngle: 120 };
const anglesStr = '{ value: v.acuteAngle, label: `Acute: ${v.acuteAngle}°`, color: "#818cf8" }';

// Extract value
const valM = anglesStr.match(/value:\s*([^,}\n]+)/);
console.log('value match:', valM ? valM[1].trim() : 'NO MATCH');

// Resolve
function resolveVal(expr, vars) {
  if (!expr) return undefined;
  expr = String(expr).trim();
  if (/^-?\d+\.?\d*$/.test(expr)) return parseFloat(expr);
  if (expr === 'true') return true;
  if (expr === 'false') return false;
  const strM = expr.match(/^["'](.*)["']$/);
  if (strM) return strM[1];
  const vM = expr.match(/^v\.(\w+)$/);
  if (vM) return vars[vM[1]];
  const orM = expr.match(/^v\.(\w+)\s*\|\|\s*v\.(\w+)$/);
  if (orM) return vars[orM[1]] !== undefined ? vars[orM[1]] : vars[orM[2]];
  if (expr.startsWith('`') && expr.endsWith('`')) {
    let s = expr.slice(1, -1);
    s = s.replace(/\$\{v\.(\w+)\}/g, (_, k) => vars[k] !== undefined ? String(vars[k]) : '?');
    return s;
  }
  return undefined;
}

const resolved = resolveVal(valM[1].trim(), vars);
console.log('resolved value:', resolved, typeof resolved);

// Now trace the angle extraction
const fullAnglesStr = '{ value: v.acuteAngle, label: `Acute: ${v.acuteAngle}°`, color: "#818cf8" }';
const angleEntries = fullAnglesStr.split(/\},?\s*\{/);
console.log('\nAngle entries:', angleEntries.length);
for (const entry of angleEntries) {
  const vm = entry.match(/value:\s*([^,}\n]+)/);
  console.log('  entry match:', vm ? vm[1].trim() : 'NO');
  if (vm) {
    const val = resolveVal(vm[1].trim(), vars);
    console.log('  resolved:', val, typeof val);
  }
}

// Check if the check function would find issues
function checkAngleDisplay(anglesArr) {
  const issues = [];
  anglesArr.forEach((a, i) => {
    if (typeof a.value === 'number' && a.value > 0 && a.value < 20) {
      issues.push({ check: 'small-angle', msg: `Angle ${a.value}° is very small` });
    }
  });
  if (anglesArr.length >= 2) {
    const longLabels = anglesArr.filter(a => a.label && a.label.length > 8);
    if (longLabels.length >= 2) {
      issues.push({ check: 'long-labels', msg: `${longLabels.length} long labels` });
    }
  }
  return issues;
}

const testAngles = [
  { value: 35, label: 'Acute: 35°' },
  { value: 90, label: 'Right: 90°' },
  { value: 120, label: 'Obtuse: 120°' }
];
console.log('\nCheck result:', checkAngleDisplay(testAngles));
// This has 3 angles with labels > 8 chars, so should flag long-labels

const testSmall = [{ value: 10, label: '10°' }];
console.log('Small angle check:', checkAngleDisplay(testSmall));
