/**
 * Remap 4 topics using teaching-based principle:
 * "If a child got this wrong, which lesson would help them get it right?"
 *
 * Topics: wordClassGrammar, letterPairSeries, letterSums, logicAndLanguage
 *
 * For each question:
 * 1. Read the question text and explanation
 * 2. Read what each lesson teaches (from staging file)
 * 3. Map to the best-fit lesson
 * 4. Flag questions where NO lesson covers the skill (LESSON GAP)
 */

const fs = require('fs');
const path = require('path');

const VR_DATA = path.resolve(__dirname, '..', 'src/questionData/vrData.js');
const ENG_DATA = path.resolve(__dirname, '..', 'src/questionData/englishData.js');
const VR_MAP_FILE = path.resolve(__dirname, '..', 'public/vr-question-lesson-map.json');
const ENG_MAP_FILE = path.resolve(__dirname, '..', 'public/english-question-lesson-map.json');

function parseQuestions(content, topicKey) {
  const start = content.indexOf(topicKey);
  // Find next topic
  const lines = content.substring(start).split('\n');
  let depth = 0, endLine = 0;
  for (let i = 0; i < lines.length; i++) {
    for (const ch of lines[i]) { if (ch === '{' || ch === '[') depth++; if (ch === '}' || ch === ']') depth--; }
    if (depth <= 0 && i > 5) { endLine = i; break; }
  }
  const section = lines.slice(0, endLine + 1).join('\n');

  const blocks = section.split(/(?=\{[\s\n]*(?:["']?id["']?)\s*:\s*\d)/);
  const questions = [];
  for (const block of blocks) {
    const idM = block.match(/["']?id["']?\s*:\s*(\d+)/);
    const diffM = block.match(/["']?difficulty["']?\s*:\s*(\d+)/);
    const qM = block.match(/["']?question["']?\s*:\s*["']([^"']*?)["']/);
    const explM = block.match(/["']?explanation["']?\s*:\s*["']([^"]*?)["']/);
    if (!idM) continue;
    questions.push({
      id: +idM[1],
      diff: diffM ? +diffM[1] : 0,
      qtext: qM ? qM[1] : '',
      expl: explM ? explM[1] : '',
    });
  }
  return questions;
}

// ============================================================
// LESSON DESCRIPTIONS (what each lesson teaches)
// These are derived from the staging file lesson IDs and learning goals
// ============================================================

const lessonDescriptions = {

  // Word Class & Grammar lessons
  wordClassGrammar: {
    'nouns': 'Identifying nouns (naming words for people, places, things)',
    'verbs': 'Identifying verbs (action words and state/being words like was, seemed)',
    'adjectives-adverbs': 'Distinguishing adjectives (describe nouns) from adverbs (describe verbs/adjectives)',
    'pronouns-prepositions': 'Identifying pronouns (I, he, she, they) and prepositions (in, on, under, between)',
    'conjunctions-determiners': 'Identifying conjunctions (and, but, because) and determiners (the, a, some, every)',
    'coord-vs-subord': 'Distinguishing coordinating (and, but, or) from subordinating (because, although, when) conjunctions',
    'words-changing-class': 'Words that change class based on context (run as noun vs verb, light as noun/adj/verb)',
    'pronoun-types': 'Different pronoun types: personal, possessive, reflexive, relative, demonstrative, interrogative, indefinite',
    'determiners': 'Identifying determiners: articles (a/an/the), possessive (my/your), demonstrative (this/that), quantifiers (some/every)',
    'clauses': 'Main clauses, subordinate clauses, relative clauses — identifying and distinguishing',
    'sentence-types': 'Statement, question, command, exclamation — identifying sentence types',
    'punctuation-knowledge': 'What punctuation marks are called and when to use them',
    'literary-devices': 'Simile, metaphor, alliteration, personification, hyperbole, onomatopoeia — identifying and understanding',
  },

  // Letter Pair Series lessons
  letterPairSeries: {
    'both-forward': 'Both letters in the pair advance by the same amount each step',
    'opposite-directions': 'One letter goes forward, the other goes backward',
    'skip-one-pattern': 'Letters skip by 2 positions each step (every other letter)',
    'constant-gap': 'The gap between the two letters in each pair stays the same as the pair shifts along',
    'alternating-pattern': 'Pattern changes or alternates — non-constant gaps, accelerating, or interleaved sequences',
    'reverse-alphabet': 'Letters going backwards through the alphabet',
    'double-jump': 'Letters jumping by 3+ positions, or different jump sizes for each letter',
  },

  // Letter Sums lessons
  letterSums: {
    'simple-addition': 'Adding letter values for short words (2-3 letters, A-M range)',
    'simple-subtraction': 'Subtracting letter values',
    'mixed-operations': 'Questions with × and + or - combined (BODMAS required)',
    'left-to-right-rule': 'Multi-step letter arithmetic: A + B - C + D (working left to right)',
    'multiply-operations': 'Multiplying letter values',
    'larger-numbers': 'Longer words (5+ letters), comparison questions, same-value pairs',
    'convert-back': 'Finding which letter equals a calculated value (reverse: number → letter)',
    'ejoty-shortcuts': 'Using EJOTY anchor points to count letter positions quickly',
  },

  // Logic & Language lessons
  logicAndLanguage: {
    'three-person-ordering': 'Ordering 3 people/things from comparison clues (A>B, B>C, who is smallest?)',
    'four-person-ordering': 'Ordering 4-5 people from multiple comparison clues',
    'true-false-statements': 'Syllogisms: All X are Y, Z is X, what must be true? Including reverse trap',
    'comparative-language': 'Understanding comparison words (taller, fewer, heavier) and their direction',
    'superlative-questions': 'Finding the most/least/best/worst from ordered comparisons',
    'sentence-rearrangement': 'Rearranging jumbled words into a correct sentence',
    'syllogisms': 'Logical deductions from "All/Some/None" statements',
    'negation-traps': 'Reasoning with "none", "not", "never" — what must NOT be true',
  },
};

// ============================================================
// MAPPING FUNCTIONS
// ============================================================

function mapWordClassQuestion(q) {
  const t = (q.qtext + ' ' + q.expl).toLowerCase();

  // Literary devices — specific terms
  if (t.match(/simile|metaphor|alliteration|onomatopoeia|personification|hyperbole|figure of speech/)) return { sc: 'literary-devices', confidence: 'high' };

  // Sentence types
  if (t.match(/what type of sentence|statement.*question.*command|exclamation.*sentence|rhetorical question/)) return { sc: 'sentence-types', confidence: 'high' };

  // Punctuation knowledge
  if (t.match(/punctuation mark|full stop|comma.*used|question mark|exclamation mark|colon|semi-colon|semicolon|apostrophe.*look|speech mark|inverted comma|bracket|dash|ellipsis|what.*this.*mark/)) return { sc: 'punctuation-knowledge', confidence: 'high' };

  // Clauses
  if (t.match(/clause|main clause|subordinate clause|relative clause|dependent|independent|how many clauses/)) return { sc: 'clauses', confidence: 'high' };

  // Pronoun types (specific types)
  if (t.match(/reflexive|relative pronoun|possessive pronoun|demonstrative pronoun|interrogative pronoun|indefinite pronoun|personal pronoun|what type of pronoun/)) return { sc: 'pronoun-types', confidence: 'high' };

  // Words changing class
  if (t.match(/what word class is.*in|changes class|noun.*verb.*same word|adjective.*adverb.*same|flat adverb|\brun\b.*noun|\blight\b.*adjective|\blight\b.*verb|\bplay\b.*noun|\bwell\b.*adjective|\bwell\b.*noun|fast.*adverb|hard.*adverb|\bbook\b.*verb|before.*preposition.*conjunction|after.*preposition|since.*preposition|round.*preposition|outside.*adjective|pretty.*adverb|little.*pronoun|daily.*adjective|early.*adjective|iron.*verb|down.*adverb|more.*noun|broken.*verb.*passive|friendly.*adjective.*not adverb|running.*adjective|sleeping.*adjective|-ly.*adjective/)) return { sc: 'words-changing-class', confidence: 'high' };

  // Determiners
  if (t.match(/\bdeterminer\b|article|what.*job.*determiner|what type of.*the\b|what type of.*\ba\b|what type of.*\ban\b|what is.*\bthe\b.*called|\bno\b.*determiner|demonstrative determiner|interrogative determiner|quantifier|possessive determiner|\bwhich\b.*determiner/)) return { sc: 'determiners', confidence: 'high' };

  // Coordinating vs subordinating
  if (t.match(/coordinating|subordinating|which type of conjunction|coord.*vs.*subord|fanboys|because.*conjunction|although.*conjunction/)) return { sc: 'coord-vs-subord', confidence: 'high' };

  // Conjunctions & determiners (general)
  if (t.match(/\bconjunction\b|joining word|\bdeterminer\b/)) return { sc: 'conjunctions-determiners', confidence: 'high' };

  // Pronouns & prepositions
  if (t.match(/\bpronoun\b|replaces.*noun|stands for|preposition|position word|where.*relationship/)) return { sc: 'pronouns-prepositions', confidence: 'high' };

  // Adjectives vs adverbs
  if (t.match(/\badjective\b|\badverb\b|describe.*noun|describe.*verb|modify/)) return { sc: 'adjectives-adverbs', confidence: 'high' };

  // Verbs
  if (t.match(/\bverb\b|action word|doing word|state verb|being verb|tense|past.*present|active.*passive|contraction/)) return { sc: 'verbs', confidence: 'high' };

  // Nouns
  if (t.match(/\bnoun\b|naming word|proper noun|common noun|collective noun|abstract noun|concrete noun|singular.*plural|prefix|suffix/)) return { sc: 'nouns', confidence: 'high' };

  // Default — LESSON GAP
  return { sc: null, confidence: 'low', gap: 'No clear lesson match for: ' + q.qtext.substring(0, 60) };
}

function mapLetterPairSeriesQuestion(q) {
  const t = (q.qtext + ' ' + q.expl).toLowerCase();

  // Check if it's a pair series or single letter series
  const isPair = q.qtext.match(/[A-Z]{2},\s*[A-Z]{2}/);

  if (isPair) {
    // Analyse the pair pattern from the series
    const pairM = q.qtext.match(/([A-Z]{2}(?:,\s*[A-Z]{2}){2,})/);
    if (pairM) {
      const items = pairM[1].split(/,\s*/);
      const first = items.map(p => p.charCodeAt(0) - 65);
      const second = items.map(p => p.charCodeAt(1) - 65);
      const fGaps = []; for (let i = 1; i < first.length; i++) fGaps.push(first[i] - first[i-1]);
      const sGaps = []; for (let i = 1; i < second.length; i++) sGaps.push(second[i] - second[i-1]);
      const fConst = fGaps.every(g => g === fGaps[0]);
      const sConst = sGaps.every(g => g === sGaps[0]);

      if (fConst && sConst) {
        if (fGaps[0] > 0 && sGaps[0] < 0) return { sc: 'opposite-directions', confidence: 'high' };
        if (fGaps[0] < 0 && sGaps[0] > 0) return { sc: 'opposite-directions', confidence: 'high' };
        if (fGaps[0] < 0 && sGaps[0] < 0) return { sc: 'reverse-alphabet', confidence: 'high' };
        if (fGaps[0] === sGaps[0]) {
          // Check for constant internal gap
          const withinGaps = items.map(p => p.charCodeAt(1) - p.charCodeAt(0));
          if (withinGaps.every(g => g === withinGaps[0])) return { sc: 'constant-gap', confidence: 'high' };
          return { sc: 'both-forward', confidence: 'high' };
        }
        return { sc: 'double-jump', confidence: 'high' };
      }
      return { sc: 'alternating-pattern', confidence: 'high' };
    }
  }

  // Single letter series
  const singleM = q.qtext.match(/([A-Z](?:,\s*[A-Z]){2,})/);
  if (singleM) {
    const items = singleM[1].split(/,\s*/);
    const pos = items.map(l => l.charCodeAt(0) - 65);
    const gaps = []; for (let i = 1; i < pos.length; i++) gaps.push(pos[i] - pos[i-1]);
    const allSame = gaps.every(g => g === gaps[0]);

    if (allSame) {
      if (gaps[0] === 1) return { sc: 'both-forward', confidence: 'high' };
      if (gaps[0] === 2) return { sc: 'skip-one-pattern', confidence: 'high' };
      if (gaps[0] < 0 && gaps[0] === -1) return { sc: 'reverse-alphabet', confidence: 'high' };
      if (gaps[0] < 0 && gaps[0] === -2) return { sc: 'skip-one-pattern', confidence: 'high' }; // skip backwards
      if (gaps[0] < 0) return { sc: 'reverse-alphabet', confidence: 'high' };
      if (gaps[0] > 2) return { sc: 'double-jump', confidence: 'high' };
    }
    return { sc: 'alternating-pattern', confidence: 'high' };
  }

  return { sc: 'both-forward', confidence: 'medium' };
}

function mapLetterSumsQuestion(q) {
  const t = q.qtext.toLowerCase();
  const expl = q.expl.toLowerCase();

  // Mixed operations (× combined with + or -)
  if (t.match(/[×x*].*[+-]|[+-].*[×x*]/) || expl.match(/bodmas/i)) return { sc: 'mixed-operations', confidence: 'high' };

  // Multiplication only
  if (t.match(/[×x*]|multiply/)) return { sc: 'multiply-operations', confidence: 'high' };

  // Comparison (which word has highest/lowest value, same value)
  if (t.match(/which.*word.*high|which.*word.*great|which.*word.*low|same.*value|equal.*value/)) return { sc: 'larger-numbers', confidence: 'high' };

  // Word difference
  if (t.match(/difference.*between|difference in value/)) return { sc: 'simple-subtraction', confidence: 'high' };

  // Find the letter (reverse: number → letter)
  if (t.match(/what letter|find.*letter|which letter|\?\s*=.*[a-z]|[a-z].*=\s*\?/i)) return { sc: 'convert-back', confidence: 'high' };

  // Multi-step addition/subtraction (3+ terms)
  if ((t.match(/[A-Z]\s*[+-]\s*[A-Z]\s*[+-]\s*[A-Z]/) || t.match(/[+-].*[+-]/))) return { sc: 'left-to-right-rule', confidence: 'high' };

  // Subtraction
  if (t.match(/[A-Z]\s*-\s*[A-Z]/) || t.match(/minus|subtract/)) return { sc: 'simple-subtraction', confidence: 'high' };

  // Long words (5+ letters)
  if (t.match(/value of.*[A-Z]{5,}/) || t.match(/value of the word\s+[A-Z]{5,}/)) return { sc: 'larger-numbers', confidence: 'high' };

  // Simple word value or letter addition
  return { sc: 'simple-addition', confidence: 'high' };
}

function mapLogicLanguageQuestion(q) {
  const t = (q.qtext + ' ' + q.expl).toLowerCase();

  // Sentence rearrangement
  if (t.match(/rearrange|jumbled|correct order|what.*word.*sentence|unjumble/)) return { sc: 'sentence-rearrangement', confidence: 'high' };

  // Negation traps
  if (t.match(/\bnone\b.*\bare\b|\bno\b.*\bis\b|\bnot\b.*any|does not|cannot|never.*must/)) return { sc: 'negation-traps', confidence: 'high' };

  // Syllogisms / true-false / must-be-true
  if (t.match(/must be true|which statement|all.*are.*is.*therefore|definitely|cannot tell|some.*all/)) return { sc: 'syllogisms', confidence: 'high' };

  // True/false with simple "every/all" statements
  if (t.match(/every.*has|every.*is|all.*have|all.*can/)) return { sc: 'true-false-statements', confidence: 'high' };

  // Superlative (most/least/best/worst from ranking)
  if (t.match(/who is the tallest|who is the shortest|who is the fastest|who is the slowest|which is the heaviest|which is the cheapest|who.*most|who.*least|who.*best|who.*worst|who finished first|who finished last|who came first|furthest/)) return { sc: 'superlative-questions', confidence: 'high' };

  // 4+ person ordering (complex)
  if (t.match(/(\w+).*than.*(\w+).*than.*(\w+).*than/) || t.match(/who came second|who came third|who finished second|who finished third|who finished fourth|second tallest|second shortest|second fastest/)) return { sc: 'four-person-ordering', confidence: 'high' };

  // 3-person ordering (simple)
  if (t.match(/taller than|shorter than|faster than|slower than|heavier than|lighter than|older than|younger than|more than|fewer than|further than|closer than/)) {
    // Count how many people/things are mentioned
    const names = t.match(/\b[A-Z][a-z]+(?:'s)?\b/g);
    const uniqueNames = new Set(names);
    if (uniqueNames.size <= 3) return { sc: 'three-person-ordering', confidence: 'high' };
    return { sc: 'four-person-ordering', confidence: 'high' };
  }

  // Comparative language (understanding comparison words)
  if (t.match(/comparative|superlative|more.*less|bigger.*smaller|what does.*mean/)) return { sc: 'comparative-language', confidence: 'high' };

  // Double meaning / homonyms — LESSON GAP (no lesson for this in logicAndLanguage staging)
  if (t.match(/both.*mean|two meaning|double meaning|which word can mean|rhyming.*word/)) return { sc: null, confidence: 'high', gap: 'Double meaning/homonym — no lesson exists in logicAndLanguage' };

  // Default
  return { sc: 'comparative-language', confidence: 'medium' };
}

// ============================================================
// MAIN
// ============================================================

console.log('=== TEACHING-BASED REMAPPING ===\n');

const vrContent = fs.readFileSync(VR_DATA, 'utf8');
const engContent = fs.readFileSync(ENG_DATA, 'utf8');
let vrMap = JSON.parse(fs.readFileSync(VR_MAP_FILE, 'utf8'));
let engMap = JSON.parse(fs.readFileSync(ENG_MAP_FILE, 'utf8'));

const results = {};

// 1. Word Class & Grammar
{
  console.log('--- Word Class & Grammar ---');
  const questions = parseQuestions(engContent, 'wordClassGrammar');
  const newMap = [];
  const gaps = [];
  const groupCounts = {};

  questions.forEach(q => {
    const result = mapWordClassQuestion(q);
    if (result.sc) {
      newMap.push({ questionId: q.id, subConceptId: result.sc, confidence: result.confidence });
      groupCounts[result.sc] = (groupCounts[result.sc] || 0) + 1;
    } else {
      gaps.push(result.gap);
      // Still map it to best guess
      newMap.push({ questionId: q.id, subConceptId: 'adjectives-adverbs', confidence: 'low' });
      groupCounts['adjectives-adverbs'] = (groupCounts['adjectives-adverbs'] || 0) + 1;
    }
  });

  engMap.wordClassGrammar = newMap;
  console.log('Mapped:', newMap.length, 'questions');
  Object.entries(groupCounts).sort((a,b) => b[1] - a[1]).forEach(([sc, c]) => console.log('  ' + sc + ': ' + c));
  if (gaps.length > 0) {
    console.log('LESSON GAPS (' + gaps.length + '):');
    gaps.forEach(g => console.log('  ⚠ ' + g));
  }
  results.wordClassGrammar = { total: newMap.length, groups: Object.keys(groupCounts).length, gaps: gaps.length };
}

// 2. Letter Pair Series
{
  console.log('\n--- Letter Pair Series ---');
  const questions = parseQuestions(vrContent, 'letterPairSeries');
  const newMap = [];
  const gaps = [];
  const groupCounts = {};

  questions.forEach(q => {
    const result = mapLetterPairSeriesQuestion(q);
    newMap.push({ questionId: q.id, subConceptId: result.sc, confidence: result.confidence });
    groupCounts[result.sc] = (groupCounts[result.sc] || 0) + 1;
  });

  vrMap.letterPairSeries = newMap;
  console.log('Mapped:', newMap.length, 'questions');
  Object.entries(groupCounts).sort((a,b) => b[1] - a[1]).forEach(([sc, c]) => console.log('  ' + sc + ': ' + c));
  results.letterPairSeries = { total: newMap.length, groups: Object.keys(groupCounts).length, gaps: 0 };
}

// 3. Letter Sums
{
  console.log('\n--- Letter Sums ---');
  const questions = parseQuestions(vrContent, 'letterSums');
  const newMap = [];
  const gaps = [];
  const groupCounts = {};

  questions.forEach(q => {
    const result = mapLetterSumsQuestion(q);
    if (result.sc) {
      newMap.push({ questionId: q.id, subConceptId: result.sc, confidence: result.confidence });
      groupCounts[result.sc] = (groupCounts[result.sc] || 0) + 1;
    } else {
      gaps.push(result.gap);
      newMap.push({ questionId: q.id, subConceptId: 'simple-addition', confidence: 'low' });
      groupCounts['simple-addition'] = (groupCounts['simple-addition'] || 0) + 1;
    }
  });

  vrMap.letterSums = newMap;
  console.log('Mapped:', newMap.length, 'questions');
  Object.entries(groupCounts).sort((a,b) => b[1] - a[1]).forEach(([sc, c]) => console.log('  ' + sc + ': ' + c));
  if (gaps.length > 0) {
    console.log('LESSON GAPS (' + gaps.length + '):');
    gaps.forEach(g => console.log('  ⚠ ' + g));
  }
  results.letterSums = { total: newMap.length, groups: Object.keys(groupCounts).length, gaps: gaps.length };
}

// 4. Logic & Language
{
  console.log('\n--- Logic & Language ---');
  const questions = parseQuestions(vrContent, 'logicAndLanguage');
  const newMap = [];
  const gaps = [];
  const groupCounts = {};

  questions.forEach(q => {
    const result = mapLogicLanguageQuestion(q);
    if (result.sc) {
      newMap.push({ questionId: q.id, subConceptId: result.sc, confidence: result.confidence });
      groupCounts[result.sc] = (groupCounts[result.sc] || 0) + 1;
    } else {
      gaps.push('Q' + q.id + ': ' + (result.gap || q.qtext.substring(0, 60)));
      newMap.push({ questionId: q.id, subConceptId: 'comparative-language', confidence: 'low' });
      groupCounts['comparative-language'] = (groupCounts['comparative-language'] || 0) + 1;
    }
  });

  vrMap.logicAndLanguage = newMap;
  console.log('Mapped:', newMap.length, 'questions');
  Object.entries(groupCounts).sort((a,b) => b[1] - a[1]).forEach(([sc, c]) => console.log('  ' + sc + ': ' + c));
  if (gaps.length > 0) {
    console.log('LESSON GAPS (' + gaps.length + '):');
    gaps.forEach(g => console.log('  ⚠ ' + g));
  }
  results.logicAndLanguage = { total: newMap.length, groups: Object.keys(groupCounts).length, gaps: gaps.length };
}

// Write
fs.writeFileSync(VR_MAP_FILE, JSON.stringify(vrMap, null, 2), 'utf8');
fs.writeFileSync(ENG_MAP_FILE, JSON.stringify(engMap, null, 2), 'utf8');

console.log('\n=== SUMMARY ===');
Object.entries(results).forEach(([topic, r]) => {
  console.log(topic + ': ' + r.total + ' mapped, ' + r.groups + ' groups, ' + r.gaps + ' lesson gaps');
});
console.log('\nWritten ✓');
