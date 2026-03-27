const fs = require('fs');
const path = require('path');

const ENGLISH_DATA = path.join(__dirname, '..', 'src/questionData/englishData.js');
let content = fs.readFileSync(ENGLISH_DATA, 'utf8');

const spellingTips = [
  "Look out for this one in the exam!",
  "Say the word slowly — listen for each sound.",
  "Try writing it both ways and see which looks right.",
  "Break it into chunks to spot the tricky bit.",
  "This one catches loads of people — now you know!",
  "Sound it out carefully — the spelling matches the sounds.",
  "You'll have an advantage if you remember this one!",
  "Picture the word in your mind — visual memory helps.",
  "This is a common exam word — worth practising!",
  "If unsure, try covering the options and spelling it yourself first.",
];

const vocabTips = [
  "A great word to use in your own writing!",
  "Try using this word in a sentence today to make it stick.",
  "Reading widely helps you learn words like this naturally.",
  "Look for prefixes and suffixes you recognise in unfamiliar words.",
  "Words with similar meanings often have subtle differences.",
  "Context is your best friend — surrounding words give clues.",
  "This type of question comes up regularly in GL papers.",
  "Think about when you'd use this word versus its synonym.",
  "Learning word families helps you decode new words.",
  "Building a strong vocabulary is one of the best exam skills.",
];

function addTipsToSection(sectionContent, tips, topicName) {
  let tipCount = 0;

  // Match BOTH formats: "explanation": "..." and explanation: "..."
  // Use a function replacement to handle both
  const result = sectionContent.replace(
    /((?:"explanation"|explanation)\s*:\s*")([^"]+)(")/g,
    (full, prefix, expl, suffix) => {
      // Skip if already has a tip-like phrase
      if (expl.match(/Look out|Say the word|Try writing|Break it|catches loads|Sound it out|advantage|Picture the|common exam|cover the options|great word|Try using|Reading widely|prefixes and suffixes|subtle differences|Context is|comes up regularly|when you'd use|word families|strong vocabulary|Tip:/i)) {
        return full;
      }
      // Skip very short explanations (likely parsing issues)
      if (expl.length < 30) return full;

      const tip = tips[tipCount % tips.length];
      tipCount++;

      let improved = expl;
      if (improved.endsWith(' \u2713')) {
        improved = improved.slice(0, -2) + ' ' + tip + ' \u2713';
      } else if (improved.endsWith('\u2713')) {
        improved = improved.slice(0, -1) + ' ' + tip + ' \u2713';
      } else {
        improved += ' ' + tip;
      }

      return prefix + improved + suffix;
    }
  );

  console.log('  ' + topicName + ': added tips to ' + tipCount + ' explanations');
  return result;
}

// Process spelling
console.log('=== EXPLANATION WARMTH PASS ===');
const spStart = content.indexOf('spelling: {');
const spEnd = content.indexOf('punctuation:', spStart);
const spSection = content.substring(spStart, spEnd);
const newSpSection = addTipsToSection(spSection, spellingTips, 'Spelling');
content = content.substring(0, spStart) + newSpSection + content.substring(spEnd);

// Process vocabulary (recalculate positions since content changed)
const vStart = content.indexOf('vocabulary:');
const vEnd = content.indexOf('wordClassGrammar:', vStart);
const vSection = content.substring(vStart, vEnd);
const newVSection = addTipsToSection(vSection, vocabTips, 'Vocabulary');
content = content.substring(0, vStart) + newVSection + content.substring(vEnd);

// Verify
function countTips(sectionContent) {
  const expls = [...sectionContent.matchAll(/(?:"explanation"|explanation)\s*:\s*"([^"]+)"/g)].map(m => m[1]);
  const withTip = expls.filter(e => e.match(/Look out|Say the word|Try writing|Break it|catches loads|Sound it out|advantage|Picture the|common exam|cover the|great word|Try using|Reading widely|prefixes|subtle|Context is|comes up|when you'd|word families|strong vocab|Tip:/i));
  return { total: expls.length, withTip: withTip.length, avgLen: Math.round(expls.reduce((s, e) => s + e.length, 0) / expls.length) };
}

const spStats = countTips(content.substring(content.indexOf('spelling: {'), content.indexOf('punctuation:')));
const vStats = countTips(content.substring(content.indexOf('vocabulary:'), content.indexOf('wordClassGrammar:')));

console.log('\n  Spelling: ' + spStats.withTip + '/' + spStats.total + ' have tips, avg ' + spStats.avgLen + ' chars');
console.log('  Vocabulary: ' + vStats.withTip + '/' + vStats.total + ' have tips, avg ' + vStats.avgLen + ' chars');

fs.writeFileSync(ENGLISH_DATA, content, 'utf8');
console.log('\n✅ Written');
