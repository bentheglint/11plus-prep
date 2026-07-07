// DEV-ONLY visual preview script — NOT part of the app or Worker runtime.
//
// Renders buildDay25Email / buildDay30Email (workers/ai-tutor/routes/email.js)
// to static HTML files under demo-preview/ so they can be opened in a
// browser for review, without sending anything via Resend or touching prod.
//
// Usage: node scripts/preview-emails.mjs

import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDay25Email, buildDay30Email } from '../workers/ai-tutor/routes/email.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'demo-preview');

// Realistic sample data — Amara is the demo's free-plan pupil (see the
// tutor-dashboard dev preview), so these emails use her for continuity.
const account = { display_name: 'Amara', name: 'Deepa Iyer' };
const quizCount = 18;
const currentStreak = 4;
const weakest = { topicKey: 'longdivision', accuracy: 58 };

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const day25 = buildDay25Email(account, quizCount, currentStreak, weakest);
  const day25Path = path.join(OUT_DIR, 'email-day25.html');
  await writeFile(day25Path, day25.html, 'utf8');

  const day30 = buildDay30Email(account, quizCount, currentStreak);
  const day30Path = path.join(OUT_DIR, 'email-day30.html');
  await writeFile(day30Path, day30.html, 'utf8');

  console.log('Day 25 subject:', day25.subject);
  console.log('Day 25 written to:', day25Path);
  console.log('Day 30 subject:', day30.subject);
  console.log('Day 30 written to:', day30Path);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
