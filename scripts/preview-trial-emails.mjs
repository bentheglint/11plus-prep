// Generates HTML previews of all trial + weekly emails and opens them in the
// browser. Run with: node scripts/preview-trial-emails.mjs
//
// Imports the actual templates from workers/ai-tutor/routes/email.js so what
// you see here is exactly what users will receive — no manual mirroring.

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import {
  buildDay1Email,
  buildDay7Email,
  buildDay14Email,
  buildDay25Email,
  buildDay30Email,
  weeklyEmailHtml,
} from '../workers/ai-tutor/routes/email.js';
import { buildMasterySummary } from '../workers/ai-tutor/lib/mastery.js';

const DUMMY = {
  name: 'Sarah Mitchell',
  display_name: 'Evie',
  email: 'sarah@example.com',
  email_opt_in: 1,
};

// Sample weakest-topic data
const WEAKEST_NUMBER_SERIES = { topicKey: 'numberSeries', accuracy: 42 };
const WEAKEST_FRACTIONS = { topicKey: 'fractions', accuracy: 38 };

// Sample recent quizzes for Day 7 top-topic logic
const recentQuizzes = [
  { topic_key: 'longdivision', subject: 'maths', score: 7, total: 10 },
  { topic_key: 'longdivision', subject: 'maths', score: 6, total: 10 },
  { topic_key: 'fractions', subject: 'maths', score: 5, total: 10 },
];

// ── Generate a realistic question_results fixture for the weekly email ──
// Aim: produce a mastery summary where some topics are covered (≥20q),
// some are in progress (5-19q), and most are untouched. This shows the
// full heatmap layout including all the band colours.
function generateQuestionResults() {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const rows = [];
  let id = 1;

  // Mastered: fractions (90%+, 30 questions, recent)
  for (let i = 0; i < 30; i++) {
    rows.push({
      topic_key: 'fractions', subject: 'maths',
      is_correct: i < 28 ? 1 : 0, // 93%
      attempted_at: new Date(now - (i % 7) * day).toISOString(),
    });
  }
  // Strong: decimals (76-89%, 22 questions, recent)
  for (let i = 0; i < 22; i++) {
    rows.push({
      topic_key: 'decimals', subject: 'maths',
      is_correct: i < 18 ? 1 : 0, // 82%
      attempted_at: new Date(now - (i % 5) * day).toISOString(),
    });
  }
  // Confident: comprehension (56-75%, 25 questions)
  for (let i = 0; i < 25; i++) {
    rows.push({
      topic_key: 'comprehension', subject: 'english',
      is_correct: i < 17 ? 1 : 0, // 68%
      attempted_at: new Date(now - (i % 6) * day).toISOString(),
    });
  }
  // Developing: synonyms (31-55%, 21 questions)
  for (let i = 0; i < 21; i++) {
    rows.push({
      topic_key: 'synonyms', subject: 'verbalreasoning',
      is_correct: i < 10 ? 1 : 0, // 48%
      attempted_at: new Date(now - (i % 7) * day).toISOString(),
    });
  }
  // Exploring (low score, covered): numberSeries (10-30%, 20 questions) — this becomes the weakest covered
  for (let i = 0; i < 20; i++) {
    rows.push({
      topic_key: 'numberSeries', subject: 'verbalreasoning',
      is_correct: i < 7 ? 1 : 0, // 35%
      attempted_at: new Date(now - (i % 5) * day).toISOString(),
    });
  }
  // In progress (5-19 questions): algebra, sequences, antonyms, vocabulary
  ['algebra', 'sequences'].forEach(topic => {
    for (let i = 0; i < 8; i++) {
      rows.push({
        topic_key: topic, subject: 'maths',
        is_correct: i < 5 ? 1 : 0,
        attempted_at: new Date(now - i * day).toISOString(),
      });
    }
  });
  ['vocabulary'].forEach(topic => {
    for (let i = 0; i < 12; i++) {
      rows.push({
        topic_key: topic, subject: 'english',
        is_correct: i < 8 ? 1 : 0,
        attempted_at: new Date(now - i * day).toISOString(),
      });
    }
  });
  ['antonyms', 'verbalAnalogies'].forEach(topic => {
    for (let i = 0; i < 10; i++) {
      rows.push({
        topic_key: topic, subject: 'verbalreasoning',
        is_correct: i < 6 ? 1 : 0,
        attempted_at: new Date(now - i * day).toISOString(),
      });
    }
  });

  return rows;
}

// ── Generate previews ──
const outDir = path.join(process.cwd(), 'scripts', 'email-previews');
fs.mkdirSync(outDir, { recursive: true });

const fullSummary = buildMasterySummary(generateQuestionResults(), Date.now());
const emptySummary = buildMasterySummary([], Date.now());

// Generate a moderate summary (used for Day 21 — less data than full)
const moderateSummary = buildMasterySummary(generateQuestionResults().slice(0, 80), Date.now());

const emails = [
  // ── Trial milestones ──
  { file: '01-day1-no-activity.html', ...buildDay1Email(DUMMY, 0, null) },
  { file: '02-day1-with-activity.html', ...buildDay1Email(DUMMY, 3, WEAKEST_FRACTIONS) },

  { file: '03-day7-active.html', ...buildDay7Email(DUMMY, 8, 5, recentQuizzes, WEAKEST_NUMBER_SERIES) },
  { file: '04-day7-no-activity.html', ...buildDay7Email(DUMMY, 0, 0, [], null) },

  { file: '05-day14-active.html', ...buildDay14Email(DUMMY, 14, 7, WEAKEST_NUMBER_SERIES) },
  { file: '06-day14-no-activity.html', ...buildDay14Email(DUMMY, 0, 0, null) },

  // Day 21 weekly progress (moderate data — third week of trial)
  {
    file: '07-day21-weekly.html',
    subject: `${DUMMY.display_name}'s week on PrepStep`,
    html: weeklyEmailHtml({
      parentFirst: 'Sarah',
      childName: 'Evie',
      weeklyQuizCount: 6,
      weeklyQuestionCount: 52,
      weeklyAccuracy: 68,
      currentStreak: 9,
      mocksThisWeek: [],
      summary: moderateSummary,
    }),
  },

  { file: '08-day25-active.html', ...buildDay25Email(DUMMY, 22, 12, WEAKEST_NUMBER_SERIES) },
  { file: '09-day25-no-activity.html', ...buildDay25Email(DUMMY, 0, 0, null) },

  // Day 28 weekly progress (full data — last week of trial, mock included)
  {
    file: '10-day28-weekly.html',
    subject: `${DUMMY.display_name}'s week on PrepStep`,
    html: weeklyEmailHtml({
      parentFirst: 'Sarah',
      childName: 'Evie',
      weeklyQuizCount: 8,
      weeklyQuestionCount: 76,
      weeklyAccuracy: 71,
      currentStreak: 14,
      mocksThisWeek: [{ subject: 'maths', percentage: 78, completed_at: new Date().toISOString() }],
      summary: fullSummary,
    }),
  },

  { file: '11-day30-active.html', ...buildDay30Email(DUMMY, 28, 14) },
  { file: '12-day30-no-activity.html', ...buildDay30Email(DUMMY, 0, 0) },

  // ── Post-subscription weekly cadence ──
  {
    file: '13-weekly-subscriber-rich.html',
    subject: `${DUMMY.display_name}'s week on PrepStep`,
    html: weeklyEmailHtml({
      parentFirst: 'Sarah',
      childName: 'Evie',
      weeklyQuizCount: 8,
      weeklyQuestionCount: 76,
      weeklyAccuracy: 71,
      currentStreak: 31,
      mocksThisWeek: [{ subject: 'maths', percentage: 78, completed_at: new Date().toISOString() }],
      summary: fullSummary,
    }),
  },
];

for (const { file, subject, html } of emails) {
  const fullPath = path.join(outDir, file);
  const preview = html.replace(
    '<body',
    `<body><div style="background:#222;color:#fff;font-family:monospace;font-size:12px;padding:8px 16px;">Subject: ${subject}</div>`
  );
  fs.writeFileSync(fullPath, preview, 'utf8');
  console.log(`Written: scripts/email-previews/${file}`);
}

console.log('\nOpening in browser...');
for (const { file } of emails) {
  const fullPath = path.join(outDir, file).replace(/\//g, '\\');
  try { execSync(`start "" "${fullPath}"`); } catch {}
}
