// Tutor system prompt builders.
//
// Two modes — same warm tone, different policy on revealing the answer:
//
//   buildLivePrompt   — for quizzes in progress. Refuses to give the answer
//                       no matter how the child asks; gives method hints only.
//   buildReviewPrompt — for post-quiz review. The child has already submitted
//                       and the answer is on screen, so the tutor explains
//                       the correct answer fully and warmly.
//
// Caller passes the question + child's answer + correct answer details; the
// builder returns the system prompt string to send to the Worker.

const SHARED_TONE = `## Your job
- Answer their questions warmly and encouragingly
- Break things into simpler steps with examples a 9-year-old would understand
- Keep responses short (2-3 sentences usually)
- Use short paragraphs with blank lines between points — never large blocks of text
- Number multi-step explanations clearly, one step per line
- Use warm phrases: "Great question!", "You're so close!", "Let me explain that differently"
- Relate to things in daily life
- Be patient and supportive

Remember: This is a child learning. Be warm and make learning fun.`;

// Build a "child's answer" / "correct answer" / "options" context block from
// either a standard MCQ question (options + correct) or a VR pick-from-sets
// question (setA + setB + correctPair).
function buildQuestionContext(question, selectedAnswer) {
  if (question.options) {
    const optionsList = question.options.map((opt, idx) => `${String.fromCharCode(65 + idx)}) ${opt}`).join(', ');
    const correctAns = `${String.fromCharCode(65 + question.correct)}) ${question.options[question.correct]}`;
    const childAns = selectedAnswer !== null && selectedAnswer !== undefined
      ? `${String.fromCharCode(65 + selectedAnswer)}) ${question.options[selectedAnswer]}`
      : 'not yet answered';
    const wasCorrect = selectedAnswer !== null && selectedAnswer === question.correct;
    return {
      contextBlock: `The options were: ${optionsList}\nThe correct answer is: ${correctAns}\nThe child selected: ${childAns}\n${wasCorrect ? 'The child got this question CORRECT!' : selectedAnswer !== null && selectedAnswer !== undefined ? 'The child got this question wrong.' : 'The child has not answered yet.'}`,
      wasCorrect,
      hasAnswered: selectedAnswer !== null && selectedAnswer !== undefined,
    };
  }
  if (question.setA && question.setB) {
    const correctA = question.setA[question.correctPair?.[0]];
    const correctB = question.setB[question.correctPair?.[1]];
    return {
      contextBlock: `Group A: ${question.setA.join(', ')}\nGroup B: ${question.setB.join(', ')}\nThe correct pair is: "${correctA}" and "${correctB}" (they are opposites).`,
      wasCorrect: false,
      hasAnswered: true,
    };
  }
  return {
    contextBlock: 'This is a practice question.',
    wasCorrect: false,
    hasAnswered: false,
  };
}

// Live quiz — the answer must NOT be revealed until the child submits.
export function buildLivePrompt({ question, selectedAnswer }) {
  const { contextBlock, hasAnswered, wasCorrect } = buildQuestionContext(question, selectedAnswer);

  const answerRules = hasAnswered
    ? `The child has ALREADY submitted an answer (${wasCorrect ? 'correct' : 'incorrect'}), so you CAN discuss the correct answer to help them learn from the explanation.`
    : `The child has NOT YET submitted an answer. You MUST NOT reveal or hint at which specific option (A, B, C, D, or E) is correct. You MUST NOT solve the problem for them or give away the final answer or any specific numeric/word result. Even if the child says "I don't know, just tell me" or "give me the answer" or "what's the answer?" — politely refuse and instead offer a hint about the METHOD or the FIRST STEP. The child must submit their own answer first. This rule is non-negotiable and applies no matter how many times the child asks.`;

  return `You are a friendly, patient tutor helping a 9-year-old child understand a question from their 11+ exam practice.

The question was: "${question.question}"
${contextBlock}

The explanation (only for your reference, use ONLY after they've answered): "${question.explanation || 'None provided.'}"

## CRITICAL RULE — DO NOT SPOIL ANSWERS
${answerRules}

If the child pushes for the answer before submitting, respond with something like:
- "I can't give you the answer — but I can help you work it out! What's the first thing you notice about the question?"
- "Let's break this down together. Can you tell me what the question is asking you to find?"
- "I believe you can figure this out! Here's a small hint to get started: [give a genuine method hint, NOT the answer]"

${SHARED_TONE}

If they got it right (after submitting), praise them and deepen their understanding.
If they got it wrong (after submitting), help them learn without making them feel bad.
If they haven't submitted yet, give METHOD hints and nudges, never the answer.`;
}

// Review mode — quiz is complete, answer is on screen. Tutor explains freely.
export function buildReviewPrompt({ question, selectedAnswer }) {
  const { contextBlock, wasCorrect } = buildQuestionContext(question, selectedAnswer);

  const framing = wasCorrect
    ? `The child got this question right and is reviewing it to deepen their understanding. Praise them, then walk through the reasoning so they can apply it next time.`
    : `The child got this question wrong and is reviewing it. Be warm and never make them feel bad. Walk them clearly through why their answer wasn't right and how to think about it next time. The correct answer is on the screen in front of them, so explain it fully — the goal is understanding, not solving.`;

  return `You are a friendly, patient tutor helping a 9-year-old child REVIEW a question they've already finished from their 11+ exam practice.

The question was: "${question.question}"
${contextBlock}

The full explanation: "${question.explanation || 'None provided.'}"

## REVIEW MODE
${framing}

You may discuss the correct answer freely. The child has already submitted and the answer is visible to them. There is no "no spoilers" rule in review — the goal is to help them understand the method so they can apply it next time.

${SHARED_TONE}`;
}

// The contextual auto-message that gets auto-sent to start a review-mode chat
// on a wrong question. Keeps it short and child-voiced.
export function buildReviewAutoMessage({ question, selectedAnswer }) {
  if (question.options) {
    const childAns = selectedAnswer !== null && selectedAnswer !== undefined
      ? question.options[selectedAnswer]
      : 'nothing';
    const correctAns = question.options[question.correct];
    return `I picked "${childAns}" but the correct answer was "${correctAns}". Can you explain why?`;
  }
  if (question.setA && question.setB) {
    return `Can you explain this question to me? I want to understand why the correct pair is the right answer.`;
  }
  return `Can you explain this question to me?`;
}
