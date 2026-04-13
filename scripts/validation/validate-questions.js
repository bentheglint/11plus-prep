// Validates all question data for structural issues that would cause runtime crashes
// Run: node scripts/validate-questions.js

const mathsData = require('../../src/questionData/mathsData.js');
const englishData = require('../../src/questionData/englishData.js');
const vrData = require('../../src/questionData/vrData.js');

const VALID_VISUAL_COMPONENTS = [
  'FunctionMachine', 'CuboidDiagram', 'SDTTriangle', 'AngleDiagram',
  'AngleDisplay', 'QuadShape', 'ParallelLines', 'ExteriorAngle', 'RegularPolygon',
  'BarChart', 'PieChart', 'LineGraph', 'TwoWayTable', 'RectangleDiagram',
  'TriangleAreaDiagram', 'ParallelogramDiagram', 'LShapeDiagram',
  'NumberLine', 'BarModel', 'GridModel', 'PathBorderDiagram', 'PlaceValueChart'
];

const errors = [];
const warnings = [];
let totalChecked = 0;

// ── Quality checks (catch patterns from user feedback) ──

function qualityChecks(q, subject, topicKey) {
  const prefix = `${subject}/${topicKey}/Q${q.id}`;

  // CHECK 1: Variable mismatch — question uses a named variable but diagram shows "?"
  // Catches: question says "and y°. What is y?" but diagram label is "?"
  if (q.visual && q.visual.props && q.question) {
    const varMatch = q.question.match(/and\s+([a-z])°.*What is \1/i)
      || q.question.match(/What is (?:the value of )?([a-z])\?/i)
      || q.question.match(/Angle\s+([a-z])\s/i);
    if (varMatch) {
      const varName = varMatch[1].toLowerCase();
      const comp = q.visual.component;
      const props = q.visual.props;

      // QuadShape labels
      if (comp === 'QuadShape' && props.labels && Array.isArray(props.labels)) {
        if (props.labels.includes('?') && !props.labels.includes(`${varName}°`)) {
          warnings.push(`${prefix}: QuadShape label "?" should be "${varName}°" (variable mismatch)`);
        }
      }

      // AngleDisplay labels
      if (comp === 'AngleDisplay' && props.angles && Array.isArray(props.angles)) {
        const hasQMark = props.angles.some(a => a.label === '?');
        const hasVar = props.angles.some(a => a.label === `${varName}°`);
        if (hasQMark && !hasVar) {
          warnings.push(`${prefix}: AngleDisplay label "?" should be "${varName}°" (variable mismatch)`);
        }
      }
    }
  }

  // CHECK 2: Diagram reveals algebraic method on ratio questions
  // Catches: question says "ratio 2:7" but diagram shows "2x°" and "7x°"
  if (q.visual && q.question && /ratio/i.test(q.question)) {
    const comp = q.visual.component;
    const props = q.visual.props;
    if (comp === 'AngleDisplay' && props.angles && Array.isArray(props.angles)) {
      const algebraicLabels = props.angles.filter(a => a.label && /\d+[a-z]°/.test(a.label));
      if (algebraicLabels.length > 0) {
        warnings.push(`${prefix}: Ratio question diagram shows algebraic labels (${algebraicLabels.map(a => a.label).join(', ')}) — gives away method`);
      }
    }
  }

  // CHECK 3: RegularPolygon visual reveals side count on "how many sides" questions
  if (q.visual && q.visual.component === 'RegularPolygon' && q.question && /how many sides/i.test(q.question)) {
    warnings.push(`${prefix}: RegularPolygon visual reveals the answer on a "how many sides?" question`);
  }

  // CHECK 4: Answer length bias — correct answer is longest option
  // Only flag when correct is >30% longer than the average of other options
  if (q.options && Array.isArray(q.options) && q.correct !== undefined) {
    const lengths = q.options.map(o => String(o).length);
    const correctLen = lengths[q.correct];
    const otherLens = lengths.filter((_, i) => i !== q.correct);
    const avgOther = otherLens.reduce((a, b) => a + b, 0) / otherLens.length;
    if (correctLen > avgOther * 1.5 && correctLen > 20) {
      // Only warn for comprehension/passage questions where this is a known systemic issue
      if (q.questionType === 'passage' || topicKey === 'comprehension') {
        warnings.push(`${prefix}: Correct answer is ${Math.round(correctLen/avgOther * 100 - 100)}% longer than average distractor (${correctLen} vs ${Math.round(avgOther)} chars)`);
      }
    }
  }
}

function validateQuestion(q, subject, topicKey) {
  totalChecked++;
  const prefix = `${subject}/${topicKey}/Q${q.id}`;

  // Basic required fields
  if (q.id === undefined) errors.push(`${prefix}: missing id`);
  if (!q.question && !q.questionType) errors.push(`${prefix}: missing question text`);
  if (q.difficulty === undefined) errors.push(`${prefix}: missing difficulty`);

  // Standard MC questions
  if (!q.questionType || q.questionType === 'passage' || q.questionType === 'error-spotting') {
    if (!q.options || !Array.isArray(q.options)) {
      errors.push(`${prefix}: missing or invalid options array`);
    } else {
      if (q.options.length < 2) errors.push(`${prefix}: too few options (${q.options.length})`);
      if (q.correct === undefined || q.correct === null) errors.push(`${prefix}: missing correct answer index`);
      else if (q.correct < 0 || q.correct >= q.options.length) errors.push(`${prefix}: correct index ${q.correct} out of range (${q.options.length} options)`);
    }
  }

  // Error-spotting questions
  if (q.questionType === 'error-spotting') {
    if (!q.segments || !Array.isArray(q.segments)) errors.push(`${prefix}: error-spotting missing segments array`);
    else if (q.segments.length !== 4) errors.push(`${prefix}: error-spotting has ${q.segments.length} segments (expected 4)`);
  }

  // Pick-from-sets questions
  if (q.questionType === 'pick-from-sets') {
    if (!q.setA || !Array.isArray(q.setA)) errors.push(`${prefix}: pick-from-sets missing setA`);
    if (!q.setB || !Array.isArray(q.setB)) errors.push(`${prefix}: pick-from-sets missing setB`);
    if (!q.correctPair || !Array.isArray(q.correctPair)) errors.push(`${prefix}: pick-from-sets missing correctPair`);
    else {
      if (q.correctPair.length !== 2) errors.push(`${prefix}: correctPair should have 2 elements, has ${q.correctPair.length}`);
      if (q.setA && q.correctPair[0] >= q.setA.length) errors.push(`${prefix}: correctPair[0]=${q.correctPair[0]} out of range for setA (${q.setA.length})`);
      if (q.setB && q.correctPair[1] >= q.setB.length) errors.push(`${prefix}: correctPair[1]=${q.correctPair[1]} out of range for setB (${q.setB.length})`);
    }
  }

  // Select-two questions
  if (q.questionType === 'select-two') {
    if (!q.options || !Array.isArray(q.options)) errors.push(`${prefix}: select-two missing options`);
    if (!q.correctPair || !Array.isArray(q.correctPair)) errors.push(`${prefix}: select-two missing correctPair`);
    else {
      if (q.correctPair.length !== 2) errors.push(`${prefix}: correctPair should have 2 elements`);
      if (q.options) {
        q.correctPair.forEach((idx, i) => {
          if (idx >= q.options.length) errors.push(`${prefix}: correctPair[${i}]=${idx} out of range (${q.options.length} options)`);
        });
      }
    }
  }

  // Passage questions
  if (q.questionType === 'passage') {
    if (!q.passageId) errors.push(`${prefix}: passage question missing passageId`);
    if (!q.passage) errors.push(`${prefix}: passage question missing passage text`);
  }

  // Visual component validation
  if (q.visual) {
    if (!q.visual.component) {
      errors.push(`${prefix}: visual missing component name`);
    } else if (!VALID_VISUAL_COMPONENTS.includes(q.visual.component)) {
      errors.push(`${prefix}: unknown visual component '${q.visual.component}'`);
    }
    if (!q.visual.props) {
      errors.push(`${prefix}: visual missing props`);
    } else {
      // Component-specific prop validation
      const comp = q.visual.component;
      const props = q.visual.props;

      if (comp === 'AngleDiagram') {
        if (props.angle1 === undefined) errors.push(`${prefix}: AngleDiagram missing angle1`);
        if (props.angle2 === undefined) errors.push(`${prefix}: AngleDiagram missing angle2`);
        if (props.angle3 === undefined) errors.push(`${prefix}: AngleDiagram missing angle3`);
        const sum = (props.angle1 || 0) + (props.angle2 || 0) + (props.angle3 || 0);
        if (sum !== 180 && props.angle1 && props.angle2 && props.angle3) {
          errors.push(`${prefix}: AngleDiagram angles sum to ${sum}° (should be 180°)`);
        }
      }

      if (comp === 'AngleDisplay') {
        if (!props.angles || !Array.isArray(props.angles)) errors.push(`${prefix}: AngleDisplay missing angles array`);
        else {
          props.angles.forEach((a, i) => {
            if (a.value === undefined) errors.push(`${prefix}: AngleDisplay angles[${i}] missing value`);
          });
        }
      }

      if (comp === 'RectangleDiagram') {
        if (props.length === undefined) errors.push(`${prefix}: RectangleDiagram missing length`);
        if (props.width === undefined) errors.push(`${prefix}: RectangleDiagram missing width`);
      }

      if (comp === 'CuboidDiagram') {
        if (props.length === undefined && props.l === undefined) errors.push(`${prefix}: CuboidDiagram missing length`);
        if (props.width === undefined && props.w === undefined) errors.push(`${prefix}: CuboidDiagram missing width`);
        if (props.height === undefined && props.h === undefined) errors.push(`${prefix}: CuboidDiagram missing height`);
      }

      if (comp === 'FunctionMachine') {
        if (!props.operations || !Array.isArray(props.operations)) errors.push(`${prefix}: FunctionMachine missing operations array`);
      }

      if (comp === 'SDTTriangle') {
        // Should have at least some props
        if (Object.keys(props).length === 0) errors.push(`${prefix}: SDTTriangle has empty props`);
      }
    }
  }

  // Check for duplicate visual key (JS uses last one — a silent bug)
  // Can't detect this at runtime, but we can check the raw file separately

  // Explanation check
  if (!q.explanation) errors.push(`${prefix}: missing explanation`);
}

function validateTopic(topics, subject) {
  for (const [topicKey, topic] of Object.entries(topics)) {
    if (!topic.questions || !Array.isArray(topic.questions)) {
      errors.push(`${subject}/${topicKey}: missing or invalid questions array`);
      continue;
    }

    // Check for duplicate IDs within topic
    const ids = new Set();
    for (const q of topic.questions) {
      if (ids.has(q.id)) errors.push(`${subject}/${topicKey}/Q${q.id}: DUPLICATE ID`);
      ids.add(q.id);
      validateQuestion(q, subject, topicKey);
      qualityChecks(q, subject, topicKey);
    }
  }
}

// Validate all subjects
console.log('Validating all question data...\n');

const maths = (mathsData.default || mathsData);
validateTopic(maths.topics, 'maths');

const english = (englishData.default || englishData);
validateTopic(english.topics, 'english');

const vr = (vrData.default || vrData);
validateTopic(vr.topics, 'vr');

// Report
console.log(`Checked ${totalChecked} questions across all subjects.\n`);

if (errors.length === 0) {
  console.log('✅ No structural issues found!');
} else {
  console.log(`❌ Found ${errors.length} structural issue(s):\n`);
  errors.forEach(e => console.log('  ' + e));
}

if (warnings.length > 0) {
  console.log(`\n⚠️  Found ${warnings.length} quality warning(s):\n`);
  warnings.forEach(w => console.log('  ' + w));
} else {
  console.log('\n✅ No quality warnings!');
}

process.exit(errors.length > 0 ? 1 : 0);
