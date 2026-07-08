// DEV-ONLY visual preview script — NOT part of the app or Worker runtime.
//
// Renders every PrepStep email (workers/ai-tutor/routes/email.js) to static
// HTML under demo-preview/ so they can be opened in a browser for review,
// without sending anything via Resend or touching prod.
//
// Usage: node scripts/preview-emails.mjs

import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildDay1Email,
  buildDay7Email,
  buildDay14Email,
  buildDay25Email,
  buildDay30Email,
  weeklyEmailHtml,
} from '../workers/ai-tutor/routes/email.js';
import { getAllSubjectReadiness, buildMasterySummary } from '../workers/ai-tutor/lib/mastery.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'demo-preview');

// Realistic sample data — Amara is the demo's free-plan pupil (see the
// tutor-dashboard dev preview), so these emails use her for continuity.
const account = { display_name: 'Amara', name: 'Deepa Iyer', child_id: 'demo-amara' };
const quizCount = 18;
const currentStreak = 4;
const weakest = { topicKey: 'longdivision', accuracy: 58 };
const recentQuizzes = [
  { topic_key: 'longdivision' }, { topic_key: 'longdivision' }, { topic_key: 'fractions' },
  { topic_key: 'synonyms' }, { topic_key: 'comprehension' },
];

// Mock question-result rows for the weekly email's mastery heatmap + per-subject
// readiness (these run through the SAME helpers the Worker uses).
const SUBJECT_TOPICS = {
  maths: ['longdivision', 'fractions', 'percentages', 'ratio', 'algebra'],
  english: ['comprehension', 'spelling', 'grammar', 'vocabulary'],
  verbalreasoning: ['synonyms', 'antonyms', 'verbalAnalogies', 'oddTwoOut'],
};
const now = Date.now();
const rows = [];
let i = 0;
for (const [subject, topics] of Object.entries(SUBJECT_TOPICS)) {
  for (const topic_key of topics) {
    // ~8 attempts per topic, correctness varied so some topics read strong, some weak
    const strength = 0.45 + ((i * 7) % 5) * 0.1; // 0.45..0.85
    for (let n = 0; n < 8; n++) {
      const daysAgo = (i + n) % 20;
      const d = new Date(now - daysAgo * 24 * 60 * 60 * 1000);
      rows.push({
        topic_key,
        subject,
        is_correct: (n / 8) < strength ? 1 : 0,
        attempted_at: d.toISOString().slice(0, 19).replace('T', ' '),
      });
    }
    i++;
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const emails = [
    ['email-day1.html', buildDay1Email(account, quizCount, weakest)],
    ['email-day7.html', buildDay7Email(account, quizCount, currentStreak, recentQuizzes, weakest)],
    ['email-day14.html', buildDay14Email(account, quizCount, currentStreak, weakest)],
    ['email-day25.html', buildDay25Email(account, quizCount, currentStreak, weakest)],
    ['email-day30.html', buildDay30Email(account, quizCount, currentStreak)],
  ];

  // Weekly progress email — feed the mock rows through the real helpers.
  const summary = buildMasterySummary(rows, now);
  const subjectReadiness = getAllSubjectReadiness(rows, [], now);
  const weeklyHtml = weeklyEmailHtml({
    parentFirst: 'Deepa',
    childName: 'Amara',
    weeklyQuizCount: 14,
    weeklyQuestionCount: 142,
    weeklyAccuracy: 71,
    currentStreak: 4,
    mocksThisWeek: [{ subject: 'maths', percentage: 68, completed_at: new Date(now).toISOString() }],
    summary,
    subjectReadiness,
  });
  emails.push(['email-weekly.html', { subject: 'Weekly progress', html: weeklyHtml }]);

  for (const [file, out] of emails) {
    const html = typeof out === 'string' ? out : out.html;
    await writeFile(path.join(OUT_DIR, file), html, 'utf8');
    console.log(`${file}${out.subject ? `  —  ${out.subject}` : ''}`);
  }
  console.log(`\n${emails.length} emails written to ${OUT_DIR}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
