#!/usr/bin/env node
/**
 * Recalibrate difficulty ratings across all 16 maths topics.
 * Based on GL Assessment Oracle criteria analysis.
 *
 * Reads mathsData.js, applies changes, writes back preserving formatting.
 */

const fs = require('fs');
const path = require('path');

// All changes: { topicKey: { questionId: newDifficulty } }
const CHANGES = {
  percentages: {
    13:2, 35:2, 48:2, 67:2, 77:2, 84:3, 86:2, 89:2, 92:2,
    107:2, 117:2, 124:2, 133:2, 147:2, 150:2, 152:2, 158:2,
    161:2, 166:2, 173:3, 175:3, 176:3
  },
  decimals: {
    1:2, 9:3, 13:2, 15:2, 24:2, 25:1, 36:2, 40:2, 48:2, 50:2,
    54:3, 56:3, 60:2, 67:2, 68:1, 73:2, 79:3, 84:2, 86:2, 89:1,
    96:2, 100:2, 101:1, 109:2, 113:2, 116:3, 122:2, 124:3, 128:2,
    132:1, 133:2, 149:2, 163:3, 170:3, 179:2, 180:2, 185:3, 188:3,
    190:3, 192:3, 200:3, 209:3, 210:2, 214:3
  },
  longdivision: {
    2:1, 6:2, 32:1, 39:1, 46:2, 47:1, 48:2, 49:2, 50:2, 51:2,
    52:2, 53:2, 54:2, 55:2, 56:2, 58:1, 155:1, 156:1, 157:1,
    163:1, 172:1, 184:1, 185:1, 191:1, 192:1, 193:1, 196:1,
    203:1, 204:1, 205:1, 210:1, 211:1, 212:1, 228:2, 229:2,
    230:2, 231:2, 248:2, 250:2, 252:2, 253:2, 259:1
  },
  ratio: {
    1:1, 2:1, 3:1, 5:1, 11:1, 16:1, 18:1, 20:1, 22:1, 25:1,
    26:3, 31:1, 32:1, 34:1, 35:1, 36:2, 41:1, 42:1, 48:1, 50:1,
    52:1, 56:3, 60:1, 66:2, 74:3, 81:2, 86:3, 96:2, 97:2, 99:2,
    104:3, 114:2, 115:1, 117:2, 160:2, 166:2, 168:2
  },
  fractions: {
    3:2, 7:2, 10:1, 13:2, 18:2, 19:1, 23:2, 28:2, 31:1, 33:2,
    38:2, 41:2, 45:3, 46:1, 47:1, 49:2, 51:2, 52:2, 55:1, 58:2,
    64:2, 65:2, 67:2, 70:2, 74:2, 76:2, 77:2, 83:2, 88:1, 90:2,
    92:2, 94:3, 96:2, 98:2, 99:2, 101:2, 105:2, 106:2, 108:2,
    109:3, 110:2, 112:3, 114:2, 117:3, 118:2, 121:2, 122:2,
    124:1, 126:3, 128:2, 133:2, 135:2, 137:2, 141:2, 143:2,
    148:2, 156:3, 157:3, 158:3, 159:3, 160:3, 161:3, 163:3,
    175:1, 176:3, 178:3, 181:2, 182:2, 183:2, 184:3, 185:3,
    186:3, 187:3, 190:2, 191:2, 192:3, 193:3, 194:3, 195:2,
    196:2, 197:2, 198:2, 199:3, 200:3, 205:2, 206:2
  },
  longmultiplication: {
    1:2, 9:2, 19:3, 20:3, 25:3, 26:2, 27:2, 36:2, 39:3, 40:3,
    42:3, 43:3, 44:3, 46:2, 49:3, 50:3, 52:3, 53:3, 54:3, 55:3,
    58:3, 62:3, 63:3, 64:3, 65:3, 67:3, 69:3, 71:2, 73:3, 74:2,
    76:2, 82:3, 83:3, 85:3, 88:3, 89:2, 91:2, 93:3, 95:3, 97:3,
    98:3, 99:2, 102:3, 103:3, 105:3, 107:3, 108:3, 112:3, 113:3,
    114:2, 115:3, 117:3, 118:3, 122:3,
    149:1, 150:1, 151:1, 152:1, 153:1, 154:1, 155:1, 156:1,
    167:1, 168:1, 169:1, 170:1, 171:1, 172:1, 173:1, 174:1,
    175:1, 176:1, 177:1,
    189:2, 190:2, 191:2, 192:2, 204:2, 205:2, 206:2, 207:2,
    211:1, 212:1, 215:1, 217:2, 222:2, 224:1
  },
  algebra: {
    2:2, 6:2, 10:2, 12:3, 14:1, 16:2, 17:3, 20:1, 22:1, 23:1,
    24:2, 25:2, 27:2, 29:1, 30:2, 32:2, 34:1, 47:1, 50:3, 52:1,
    55:2, 58:1, 59:2, 60:1, 62:1, 64:2, 65:2, 68:1, 69:2, 70:3,
    72:1, 78:1, 79:2, 84:1, 87:1, 90:1, 91:2, 93:1, 96:1, 97:2,
    99:1, 102:2, 105:2, 108:2, 111:1, 114:1, 115:2, 117:1, 120:1,
    126:1, 129:2, 132:2, 135:1, 142:1, 143:1, 146:3, 147:1,
    149:3, 171:2, 176:1, 182:2, 183:2, 189:3, 190:3, 191:3,
    192:3, 193:3, 198:3, 199:2, 200:2
  },
  placevalue: {
    2:1, 5:2, 6:1, 8:3, 9:1, 11:2, 14:1, 16:1, 19:1, 21:1,
    22:3, 23:1, 24:3, 27:1, 29:1, 30:1, 33:1, 34:3, 40:1, 49:3,
    50:1, 51:3, 56:2, 59:3, 64:3, 65:1, 67:3, 73:3, 86:2, 87:3,
    94:3, 101:3, 106:3, 119:1, 122:2, 137:3, 149:1, 152:1, 153:3,
    155:1, 162:1, 163:1, 164:1, 165:2, 166:2, 168:3, 169:3,
    170:3, 171:2, 175:3
  },
  negativenumbers: {
    1:1, 3:1, 4:1, 7:1, 10:1, 12:1, 17:3, 19:1, 23:1, 24:1,
    26:2, 32:1, 35:1, 37:3, 38:2, 40:2, 44:2, 50:3, 51:2, 52:1,
    53:3, 56:2, 58:3, 59:1, 65:2, 66:3, 67:3, 69:3, 73:1, 74:3,
    77:2, 78:3, 79:3, 80:3, 81:2, 86:2, 92:2, 93:1, 94:3, 97:3,
    99:2, 101:3, 102:3, 103:3, 104:3, 107:3, 108:3, 109:1,
    110:3, 112:3, 113:3, 115:3, 117:3, 118:3, 119:3, 124:2,
    131:2, 134:2, 146:1, 148:1, 149:2, 157:2, 168:1, 172:2, 177:3
  },
  primenumbers: {
    15:3, 18:2, 20:2, 26:2, 28:3, 33:3, 35:3, 39:3, 42:3, 43:2,
    47:2, 49:3, 53:2, 55:3, 60:3, 63:2, 68:2, 69:3, 71:3, 80:3,
    83:2, 86:2, 91:3, 94:2, 96:3, 99:2, 100:3, 102:3, 105:2,
    109:2, 111:2, 112:3, 125:3, 129:3, 173:3, 177:3
  },
  areaperimeter: {
    5:3, 12:3, 14:3, 18:3, 20:3, 21:2, 26:2, 36:3, 42:3, 43:3,
    48:3, 49:3, 52:3, 58:3, 62:3, 64:3, 66:2, 70:3, 80:3, 82:3,
    85:2, 90:3, 91:2, 95:3, 97:3, 100:3, 102:3, 106:3, 108:3,
    113:3, 116:2, 118:3, 124:3, 130:3, 131:2, 132:2, 133:2,
    134:2, 135:2, 136:2, 137:2, 138:2, 142:3, 145:2, 149:2,
    150:2, 151:2, 152:2, 153:2, 156:3, 157:3, 159:3, 160:3,
    162:2, 165:2, 166:2, 167:2, 172:2, 175:2, 176:2, 177:2,
    178:2, 179:2, 180:3, 182:3, 183:3, 184:2, 185:2, 186:3,
    187:2, 188:2, 191:2, 192:2, 193:3, 194:3, 195:3, 196:2, 197:2
  },
  volume: {
    7:2, 8:2, 16:2, 17:2, 18:3, 24:2, 35:2, 38:2, 46:2, 47:3,
    50:3, 56:2, 59:3, 64:3, 65:2, 70:3, 72:2, 78:3, 80:3, 83:2,
    84:2, 88:3, 89:2, 92:3, 96:3, 97:2, 100:3, 102:3, 104:2,
    112:3, 113:2, 114:3, 129:3, 130:3, 132:3, 135:3, 137:2, 138:3
  },
  anglesshapes: {
    9:2, 14:2, 15:2, 18:2, 19:2, 35:2, 39:2, 43:2, 62:2, 76:2,
    81:2, 91:3, 95:2, 100:2, 101:2, 107:3, 112:3, 121:2, 122:2,
    153:3, 155:3, 170:2, 186:3, 191:3, 192:3, 193:3, 194:3,
    199:2, 200:2, 203:3, 204:3, 205:3, 207:3, 213:2, 214:2,
    217:2, 218:2, 219:2, 220:3, 221:3, 222:3
  },
  sequences: {
    5:2, 8:1, 9:1, 19:2, 22:1, 25:2, 27:2, 32:2, 35:1, 36:1,
    44:1, 48:2, 50:1, 51:2, 52:2, 60:2, 62:1, 65:2, 71:1, 72:1,
    74:3, 76:1, 77:3, 79:3, 84:3, 88:3, 90:3, 92:1, 94:3, 96:3,
    97:3, 99:3, 102:3, 105:1, 106:3, 107:3, 108:3, 111:3, 115:2,
    116:3, 117:3, 118:1, 119:3, 121:2, 128:2, 134:3, 136:2,
    137:2, 138:3, 141:1, 142:2, 143:2, 145:2, 146:2, 147:3,
    148:3, 149:3
  },
  datahandling: {
    2:2, 7:2, 8:2, 16:1, 22:2, 26:2, 30:2, 37:2, 42:2, 44:2,
    49:2, 54:2, 59:2, 60:2, 66:2, 72:2, 77:2, 84:2, 89:2, 92:2,
    96:2, 101:2, 108:2, 113:2, 120:2, 125:2, 127:1, 129:1, 130:1,
    131:3, 133:3, 134:1, 135:3, 148:2, 150:2, 163:2, 164:2,
    176:2, 180:3, 181:3, 182:3, 183:3, 198:3, 199:3, 202:1,
    210:2, 211:2, 214:2, 215:2, 218:2, 219:2
  },
  speeddistancetime: {
    2:2, 15:3, 19:1, 27:2, 29:2, 34:3, 36:2, 39:2, 44:3, 46:1,
    47:2, 48:2, 49:2, 55:3, 56:2, 57:2, 58:2, 64:3, 67:2, 69:3,
    74:3, 76:1, 77:2, 81:3, 84:3, 86:1, 87:2, 88:2, 89:3, 91:3,
    96:1, 97:2, 99:3, 104:1, 106:1, 107:2, 116:1, 118:1, 120:3,
    121:3, 122:2, 124:3
  }
};

// Count total changes
let totalChanges = 0;
for (const topic of Object.keys(CHANGES)) {
  totalChanges += Object.keys(CHANGES[topic]).length;
}
console.log(`Total changes to apply: ${totalChanges}`);

// Read mathsData.js
const filePath = path.join(__dirname, '..', 'src', 'questionData', 'mathsData.js');
let content = fs.readFileSync(filePath, 'utf8');

// Track current topic and question id as we scan the file
let currentTopic = null;
let changesApplied = 0;
let changesFailed = 0;

const lines = content.split('\n');
const newLines = [];
let inTopic = null;
let currentQId = null;

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];

  // Detect topic boundaries
  for (const topicKey of Object.keys(CHANGES)) {
    // Match patterns like: topicKey: { or topicKey:{
    const topicRegex = new RegExp(`\\b${topicKey}\\s*:\\s*\\{`);
    if (topicRegex.test(line)) {
      inTopic = topicKey;
      break;
    }
  }

  // Detect question id
  const idMatch = line.match(/^\s*id:\s*(\d+)\s*,/);
  if (idMatch) {
    currentQId = parseInt(idMatch[1]);
  }

  // Check if this line has a difficulty property we need to change
  if (inTopic && currentQId && CHANGES[inTopic] && CHANGES[inTopic][currentQId] !== undefined) {
    const diffMatch = line.match(/^(\s*difficulty:\s*)(\d)(\s*,?.*)$/);
    if (diffMatch) {
      const currentDiff = parseInt(diffMatch[2]);
      const newDiff = CHANGES[inTopic][currentQId];
      if (currentDiff !== newDiff) {
        line = `${diffMatch[1]}${newDiff}${diffMatch[3]}`;
        changesApplied++;
      }
      // Clear current question id after processing its difficulty
      currentQId = null;
    }
  }

  newLines.push(line);
}

console.log(`Changes applied: ${changesApplied}`);
if (changesFailed > 0) {
  console.log(`Changes failed: ${changesFailed}`);
}

// Write back
fs.writeFileSync(filePath, newLines.join('\n'));
console.log(`File written: ${filePath}`);

// Verify by loading the module and checking distributions
delete require.cache[require.resolve('../src/questionData/mathsData')];
const mathsData = require('../src/questionData/mathsData').default;

console.log('\n=== Post-recalibration distributions ===');
console.log('Topic                    | Total | D1       | D2       | D3       | Status');
console.log('-------------------------|-------|----------|----------|----------|-------');

let totalD1 = 0, totalD2 = 0, totalD3 = 0, totalQs = 0;

for (const [key, topic] of Object.entries(mathsData.topics)) {
  const qs = topic.questions || [];
  const total = qs.length;
  const d1 = qs.filter(q => q.difficulty === 1).length;
  const d2 = qs.filter(q => !q.difficulty || q.difficulty === 2).length;
  const d3 = qs.filter(q => q.difficulty === 3).length;
  const d1pct = Math.round(d1/total*100);
  const d2pct = Math.round(d2/total*100);
  const d3pct = Math.round(d3/total*100);

  totalD1 += d1; totalD2 += d2; totalD3 += d3; totalQs += total;

  const ok = Math.abs(d1pct - 30) <= 8 && Math.abs(d2pct - 40) <= 8 && Math.abs(d3pct - 30) <= 8;

  console.log(
    key.padEnd(25) + '| ' +
    String(total).padStart(3) + '   | ' +
    String(d1).padStart(3) + ' (' + String(d1pct).padStart(2) + '%) | ' +
    String(d2).padStart(3) + ' (' + String(d2pct).padStart(2) + '%) | ' +
    String(d3).padStart(3) + ' (' + String(d3pct).padStart(2) + '%) | ' +
    (ok ? 'OK' : 'NEEDS WORK')
  );
}

const d1pct = Math.round(totalD1/totalQs*100);
const d2pct = Math.round(totalD2/totalQs*100);
const d3pct = Math.round(totalD3/totalQs*100);
console.log('-------------------------|-------|----------|----------|----------|-------');
console.log(
  'TOTAL'.padEnd(25) + '| ' +
  String(totalQs).padStart(3) + '   | ' +
  String(totalD1).padStart(3) + ' (' + String(d1pct).padStart(2) + '%) | ' +
  String(totalD2).padStart(3) + ' (' + String(d2pct).padStart(2) + '%) | ' +
  String(totalD3).padStart(3) + ' (' + String(d3pct).padStart(2) + '%) | '
);
console.log('\nTarget: 30% D1 / 40% D2 / 30% D3');
