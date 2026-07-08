// ── Email Routes ──
// Triggered by Cloudflare Cron:
//   "0 18 * * SUN" — weekly progress emails
//   "0 6 * * *"    — trial lifecycle emails (Days 1, 7, 14, 25)
//
// Requires Worker secrets: EMAIL_API_KEY, EMAIL_FROM

import { json } from '../helpers.js';
import { runLateFlagJob } from './assignments.js';
import { formatTopicKey, SUBJECT_LABELS } from '../lib/topicLabels.js';
import { buildMasterySummary, SUBJECT_TOPICS, getAllSubjectReadiness } from '../lib/mastery.js';

const APP_URL = 'https://prepstep.co.uk';

// ── Resend helper ──
async function sendEmail(env, { to, subject, html }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.EMAIL_API_KEY}`,
    },
    body: JSON.stringify({
      from: env.EMAIL_FROM,
      to,
      subject,
      html,
      headers: {
        'List-Unsubscribe': `<mailto:hello@prepstep.co.uk?subject=unsubscribe>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend ${res.status}: ${err}`);
  }
}

// ── Trial Lifecycle Emails ──
// Fires daily at 06:00 UTC. Sends one email per account per milestone.
// All trial milestones (Days 1/7/14/25/30) are now sent to every trial account
// regardless of opt_in — these are activation-critical, not marketing.
// Users who explicitly opt out via the Parent Dashboard toggle can stop the
// weekly progress email but trial milestones still ship.
export async function handleTrialEmails(env) {
  if (!env.EMAIL_API_KEY || !env.EMAIL_FROM) {
    console.log('[trial-email] Skipping — EMAIL_API_KEY or EMAIL_FROM not configured');
    return;
  }

  const db = env.DB;

  // Find all accounts currently in their free trial (no subscription, not comped)
  // julianday arithmetic gives days since created_at (stored as UTC ISO string).
  // Day 30 also goes out to recently-expired trials (capture window: 30-32 days).
  const { results: trialAccounts } = await db.prepare(`
    SELECT a.id, a.email, a.name, a.email_opt_in,
           CAST(julianday('now') - julianday(a.created_at || 'Z') AS INTEGER) as days_since_create,
           c.id as child_id, c.display_name
    FROM accounts a
    JOIN children c ON c.account_id = a.id
    WHERE a.is_comped = 0
      AND (a.subscription_status IS NULL OR a.subscription_status NOT IN ('active', 'trialing', 'past_due'))
  `).all();

  // Trial email schedule:
  //   Day 1  — welcome + first findings
  //   Day 7  — week 1 milestone + weakest topic
  //   Day 14 — mid-trial check + mock test push
  //   Day 21 — weekly progress (rich data view — uses weeklyEmailHtml)
  //   Day 25 — 5 days left conversion push
  //   Day 28 — weekly progress (last full data view before paywall)
  //   Day 30 — trial ended
  const MILESTONES = [1, 7, 14, 21, 25, 28, 30];
  const WEEKLY_DAYS = new Set([21, 28]);

  for (const account of trialAccounts) {
    const d = account.days_since_create;
    if (!MILESTONES.includes(d)) continue;

    try {
      let subject, html;

      if (WEEKLY_DAYS.has(d)) {
        // Day 21 / Day 28 — send the rich weekly progress email
        html = await buildWeeklyProgressEmail(env.DB, account);
        // If user has done nothing at all this week AND nothing historical, skip
        if (!html) {
          console.log(`[trial-email] Skipped day${d} (no activity) for ${account.email}`);
          continue;
        }
        subject = `${account.display_name}'s week on PrepStep`;
      } else {
        // Standard trial milestone email — fetch personalisation data
        const [recentQuizzes, streak, weakestTopic] = await Promise.all([
          db.prepare(
            `SELECT topic_key, subject, score, total FROM quiz_results
             WHERE child_id = ? ORDER BY completed_at DESC LIMIT 50`
          ).bind(account.child_id).all(),
          db.prepare(
            'SELECT current_streak FROM streaks WHERE child_id = ?'
          ).bind(account.child_id).first(),
          db.prepare(
            `SELECT topic_key, subject,
                    SUM(is_correct) * 1.0 / COUNT(*) as accuracy,
                    COUNT(*) as attempts
             FROM question_results
             WHERE child_id = ?
             GROUP BY topic_key, subject
             HAVING COUNT(*) >= 5
             ORDER BY accuracy ASC
             LIMIT 1`
          ).bind(account.child_id).first(),
        ]);

        const quizCount = recentQuizzes.results?.length || 0;
        const currentStreak = streak?.current_streak || 0;
        const weakest = weakestTopic
          ? { topicKey: weakestTopic.topic_key, accuracy: Math.round(weakestTopic.accuracy * 100) }
          : null;

        if (d === 1) ({ subject, html } = buildDay1Email(account, quizCount, weakest));
        else if (d === 7) ({ subject, html } = buildDay7Email(account, quizCount, currentStreak, recentQuizzes.results || [], weakest));
        else if (d === 14) ({ subject, html } = buildDay14Email(account, quizCount, currentStreak, weakest));
        else if (d === 25) ({ subject, html } = buildDay25Email(account, quizCount, currentStreak, weakest));
        else if (d === 30) ({ subject, html } = buildDay30Email(account, quizCount, currentStreak));
      }

      await sendEmail(env, { to: account.email, subject, html });
      console.log(`[trial-email] Sent day${d} to ${account.email}`);
    } catch (err) {
      console.error(`[trial-email] Failed day${d} for ${account.email}:`, err.message);
    }
  }
}

// ── Design system ──
// Single source of truth for all email styling. Mirrors the brand brief:
// warm neutrals (not Atom-blue corporate-safe), distinctive typography
// (Fraunces serif headings + Inter sans body), single accent purple.

const FONTS_LINK = `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">`;

// Body font stack — Inter where available, system fallback otherwise (Outlook strips webfonts)
const BODY_FONT = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`;
// Heading font stack — Fraunces where available, Georgia fallback
const HEAD_FONT = `'Fraunces', Georgia, 'Times New Roman', serif`;

// Colour tokens
const C = {
  bgPage: '#FAF7F2',          // warm cream page background
  bgCard: '#FFFFFF',
  bgCardSubtle: '#FCFAF6',    // off-white for nested elements
  bgBrandSoft: '#F4F0FF',     // soft purple fill
  brand: '#7C3AED',
  brandDeep: '#6B21A8',
  textPrimary: '#1C1A1F',     // warm near-black, not flat #000
  textSecondary: '#5B5662',
  textMuted: '#9B95A2',
  border: '#ECE7E1',          // warm border
  borderBrand: '#E5DDFA',     // purple-tinted border
  // Mastery colours — toned-down, less heatmap-of-doom
  bandMastered: '#15803D',
  bandStrong: '#16A34A',
  bandConfident: '#7C3AED',
  bandDeveloping: '#A78BFA',
  bandExploring: '#D97706',
  bandNotStarted: '#E5E2DD',
};

function emailWrapper(childName, content) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light only">
${FONTS_LINK}
</head>
<body style="margin:0;padding:0;font-family:${BODY_FONT};background:${C.bgPage};color:${C.textPrimary};-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bgPage};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
          <!-- Brand header (no card, sits on cream background) -->
          <tr>
            <td style="padding:0 8px 24px;text-align:left;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-family:${BODY_FONT};font-size:22px;font-weight:800;color:${C.textPrimary};letter-spacing:-0.5px;padding-right:8px;">PrepStep</td>
                  <td style="vertical-align:bottom;padding-bottom:5px;">
                    <span style="display:inline-block;width:5px;height:7px;background:#3B82F6;margin-right:2px;border-radius:1px;"></span><span style="display:inline-block;width:5px;height:11px;background:${C.brand};margin-right:2px;border-radius:1px;"></span><span style="display:inline-block;width:5px;height:15px;background:#22C55E;border-radius:1px;"></span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Main card -->
          <tr>
            <td style="background:${C.bgCard};border-radius:16px;padding:36px 32px;border:1px solid ${C.border};">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 8px 0;text-align:center;color:${C.textMuted};font-size:11px;font-family:${BODY_FONT};line-height:1.5;">
              <p style="margin:0 0 4px;">${childName}'s 11+ prep · PrepStep · Made in Bournemouth</p>
              <p style="margin:0;"><a href="mailto:hello@prepstep.co.uk?subject=unsubscribe" style="color:${C.textMuted};text-decoration:underline;">Unsubscribe</a> · <a href="${APP_URL}" style="color:${C.textMuted};text-decoration:underline;">prepstep.co.uk</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function ctaButton(text, url) {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
    <tr>
      <td style="background:${C.brand};border-radius:10px;">
        <a href="${url}" style="display:inline-block;padding:14px 28px;font-family:${BODY_FONT};font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.2px;">${text} →</a>
      </td>
    </tr>
  </table>`;
}

// Refined heading — serif, generous size, warm dark colour
function heading(level, text, marginTop = 0) {
  const sizes = { h1: 28, h2: 22, h3: 16 };
  const size = sizes[level] || 18;
  return `<p style="margin:${marginTop}px 0 8px;font-family:${HEAD_FONT};font-size:${size}px;font-weight:600;color:${C.textPrimary};line-height:1.25;letter-spacing:-0.3px;">${text}</p>`;
}

function bodyText(text, options = {}) {
  const { muted = false, size = 15, marginTop = 0, marginBottom = 12 } = options;
  const colour = muted ? C.textSecondary : C.textPrimary;
  return `<p style="margin:${marginTop}px 0 ${marginBottom}px;font-family:${BODY_FONT};font-size:${size}px;font-weight:400;color:${colour};line-height:1.55;">${text}</p>`;
}

function smallLabel(text, colour = C.textMuted) {
  return `<p style="margin:0 0 4px;font-family:${BODY_FONT};font-size:11px;font-weight:600;color:${colour};letter-spacing:1.2px;text-transform:uppercase;">${text}</p>`;
}

// Hidden preheader text — shows in the inbox preview line, never in the body.
function preheaderSpan(text) {
  return `<span style="display:none;font-size:1px;color:${C.bgCard};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${text}</span>`;
}

// Simple bullet list — table rows for Outlook-safe rendering (mirrors the
// "Three ways to start" pattern used in buildDay1Email).
function bulletList(items) {
  const rows = items.map((item, i) => `
      <tr><td style="padding:10px 0;${i < items.length - 1 ? `border-bottom:1px solid ${C.border};` : ''}">
        ${bodyText(item, { size: 14, marginBottom: 0 })}
      </td></tr>`).join('');
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 4px;">${rows}</table>`;
}

// Info card — used for tips, focus areas, FSM hint, etc.
function infoCard({ label, title, body, accent = 'brand' }) {
  const palette = accent === 'amber'
    ? { bg: '#FEF3E2', border: '#F9D7A8', labelColour: '#B45309', textColour: '#7C3F0A' }
    : accent === 'green'
    ? { bg: '#F0FDF4', border: '#BBF7D0', labelColour: '#15803D', textColour: '#14532D' }
    : { bg: C.bgBrandSoft, border: C.borderBrand, labelColour: C.brand, textColour: C.textPrimary };

  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
    <tr>
      <td style="background:${palette.bg};border:1px solid ${palette.border};border-radius:12px;padding:18px 20px;">
        ${label ? `<p style="margin:0 0 4px;font-family:${BODY_FONT};font-size:11px;font-weight:700;color:${palette.labelColour};letter-spacing:1.2px;text-transform:uppercase;">${label}</p>` : ''}
        ${title ? `<p style="margin:0 0 6px;font-family:${HEAD_FONT};font-size:17px;font-weight:600;color:${palette.textColour};line-height:1.3;">${title}</p>` : ''}
        <p style="margin:0;font-family:${BODY_FONT};font-size:14px;color:${palette.textColour};line-height:1.55;">${body}</p>
      </td>
    </tr>
  </table>`;
}

export function buildDay1Email(account, quizCount, weakest) {
  const child = account.display_name;
  const parentFirst = account.name?.split(' ')[0] || account.name;
  const hasActivity = quizCount > 0;
  const subject = hasActivity
    ? `${child} has already made a start on PrepStep`
    : `${child}'s 30-day PrepStep trial has started`;

  const intro = hasActivity
    ? `Great news — ${child} has already jumped in. PrepStep is now tracking progress across every topic, so you'll see exactly where they're strong and where they need more practice.`
    : `${child}'s 30-day trial just started. Here's the quickest way to see what PrepStep can do.`;

  const weakestCard = weakest
    ? infoCard({
        label: 'First findings',
        title: `${formatTopicKey(weakest.topicKey)} is the area with most room to grow`,
        body: `${weakest.accuracy}% accuracy so far. A Focused Learning session — lesson first, then 10 questions — is the fastest way to shift it.`,
        accent: 'amber',
      })
    : '';

  const gettingStarted = !hasActivity ? `
    ${heading('h3', 'Three ways to start')}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 4px;">
      <tr><td style="padding:10px 0;border-bottom:1px solid ${C.border};">
        ${bodyText(`<strong style="color:${C.textPrimary};font-weight:600;">Daily Learning</strong> — 10 mixed questions, around 8 minutes. The quickest way to see what ${child} knows.`, { size: 14, marginBottom: 0 })}
      </td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid ${C.border};">
        ${bodyText(`<strong style="color:${C.textPrimary};font-weight:600;">Focused Learning</strong> — a short lesson then 10 questions on one topic. Builds real understanding.`, { size: 14, marginBottom: 0 })}
      </td></tr>
      <tr><td style="padding:10px 0;">
        ${bodyText(`<strong style="color:${C.textPrimary};font-weight:600;">Mock Test</strong> — a full timed paper, marked instantly. Shows you where ${child} stands today.`, { size: 14, marginBottom: 0 })}
      </td></tr>
    </table>
  ` : '';

  const content = `
    ${bodyText(`Hi ${parentFirst},`, { size: 16, marginBottom: 16 })}
    ${bodyText(intro, { muted: true, size: 15 })}
    ${weakestCard}
    ${gettingStarted}
    ${ctaButton('Open PrepStep', APP_URL)}
    ${bodyText(`Any questions, just reply to this email.<br/>— Ben`, { muted: true, size: 13, marginTop: 20 })}
  `;

  return { subject, html: emailWrapper(child, content) };
}

export function buildDay7Email(account, quizCount, currentStreak, recentQuizzes, weakest) {
  const child = account.display_name;
  const parentFirst = account.name?.split(' ')[0] || account.name;
  const subject = weakest
    ? `${child}'s first week: ${formatTopicKey(weakest.topicKey)} is the topic to focus on`
    : `${child}'s first week on PrepStep`;

  const topicCounts = {};
  recentQuizzes.forEach(q => { topicCounts[q.topic_key] = (topicCounts[q.topic_key] || 0) + 1; });
  const topTopic = Object.entries(topicCounts).sort((a, b) => b[1] - a[1])[0];
  const topTopicName = topTopic ? formatTopicKey(topTopic[0]) : null;

  const summary = quizCount > 0
    ? `${child} has completed <strong>${quizCount} quiz${quizCount > 1 ? 'zes' : ''}</strong> in the first week${currentStreak > 1 ? ` and is on a <strong>${currentStreak}-day streak</strong>` : ''}.${topTopicName ? ` Most time spent on <strong>${topTopicName}</strong>.` : ''}`
    : `A week has passed since ${child}'s trial started. If you haven't had a chance to try PrepStep yet, there are still 23 days to explore, no rush.`;

  const weakestCard = weakest
    ? infoCard({
        label: 'This week\'s focus area',
        title: `${formatTopicKey(weakest.topicKey)} · ${weakest.accuracy}% accuracy`,
        body: `A Focused Learning session walks through the method first, then practises with 10 questions. The fastest way to shift a tricky topic.`,
        accent: 'amber',
      })
    : '';

  const content = `
    ${bodyText(`Hi ${parentFirst},`, { size: 16, marginBottom: 16 })}
    ${bodyText(summary, { muted: true, size: 15 })}
    ${weakestCard}
    ${ctaButton('Continue on PrepStep', APP_URL)}
    ${bodyText('23 days left in your free trial.', { muted: true, size: 13, marginTop: 16 })}
  `;

  return { subject, html: emailWrapper(child, content) };
}

export function buildDay14Email(account, quizCount, currentStreak, weakest) {
  const child = account.display_name;
  const parentFirst = account.name?.split(' ')[0] || account.name;
  const subject = `Two weeks in: how is ${child} getting on?`;

  const summary = quizCount > 0
    ? `Two weeks into ${child}'s trial. They've completed ${quizCount} quiz${quizCount > 1 ? 'zes' : ''}${currentStreak > 1 ? ` and kept a ${currentStreak}-day streak going` : ''}. The Parent Dashboard shows a full breakdown of where they're strong and where to focus next.`
    : `Two weeks in. If you haven't started yet, you've still got 16 days to try PrepStep properly, which is plenty of time to see whether it works for ${child}.`;

  const weakestLine = weakest
    ? bodyText(`Right now <strong>${formatTopicKey(weakest.topicKey)}</strong> is the weakest area (${weakest.accuracy}% accuracy). A Focused Learning session this week would be worth it.`, { muted: true, size: 15 })
    : '';

  const mockCard = infoCard({
    label: 'Worth trying',
    title: 'A timed Mock Test',
    body: `A full timed GL Assessment paper, marked instantly with a topic-by-topic breakdown. The best way to see how ${child} would perform on the day, and where to focus the last weeks of prep.`,
    accent: 'brand',
  });

  const content = `
    ${bodyText(`Hi ${parentFirst},`, { size: 16, marginBottom: 16 })}
    ${bodyText(summary, { muted: true, size: 15 })}
    ${weakestLine}
    ${mockCard}
    ${ctaButton('Try a Mock Test', APP_URL)}
    ${bodyText('16 days left in your free trial.', { muted: true, size: 13, marginTop: 16 })}
  `;

  return { subject, html: emailWrapper(child, content) };
}

export function buildDay25Email(account, quizCount, currentStreak, weakest) {
  const child = account.display_name;
  const parentFirst = account.name?.split(' ')[0] || account.name;
  const subject = `${child}'s full-access trial ends in 5 days`;
  const preheader = `After your trial ends, you will see the overall score, but not the topic holding ${child} back.`;

  // Personalised block covers two source paragraphs: the quizzes/streak
  // momentum line, and the weakest-topic "part most parents want to hold
  // on to" line (which also carries the "deep view is part of Plus"
  // explanation, since it leans on the same weakest-topic data). Falls
  // back to a generic five-days-left nudge when there's nothing to
  // personalise with yet.
  let personalisedBlock;
  if (quizCount > 0 && weakest) {
    const momentumLine = currentStreak > 1
      ? `${child} has completed <strong>${quizCount} quiz${quizCount > 1 ? 'zes' : ''}</strong> and is on a <strong>${currentStreak}-day streak</strong>. That is real momentum, and none of it goes anywhere.`
      : `${child} has completed <strong>${quizCount} quiz${quizCount > 1 ? 'zes' : ''}</strong> so far. That is real momentum, and none of it goes anywhere.`;

    const holdingBackPhrase = weakest.accuracy > 80 ? 'their next area to sharpen up' : 'holding them back';
    const weakestTopicName = formatTopicKey(weakest.topicKey);

    const weakestLine = `Here is the part most parents want to hold on to. Right now you can see that ${child}'s weakest topic is <strong>${weakestTopicName}</strong>, where they are answering around ${weakest.accuracy}% correctly. That one insight, knowing the exact topic that is ${holdingBackPhrase}, is the whole point of proper 11+ prep. It is the difference between practising harder and practising the right thing.`;

    const deepViewLine = `When the trial ends, ${child} moves to the free plan and keeps learning every day. But the deep view (the per-topic strong-and-weak breakdown, the "what to work on next" recommendations, and how each topic is trending over time) is part of PrepStep Plus. On free, you will see one overall accuracy figure. You will not see that ${weakestTopicName} is where the help is needed.`;

    personalisedBlock = `
      ${bodyText(momentumLine, { muted: true, size: 15 })}
      ${bodyText(weakestLine, { muted: true, size: 15 })}
      ${bodyText(deepViewLine, { muted: true, size: 15 })}
    `;
  } else {
    personalisedBlock = bodyText(
      `There are still five days of full access left, and it is the best time for ${child} to try a Focused Learning lesson or a timed Mock Test. Those are the tools that show you exactly which topics need work, and they are part of PrepStep Plus once the trial ends.`,
      { muted: true, size: 15 }
    );
  }

  const featureList = bulletList([
    'The full Parent Dashboard: exactly which topics are strong, which are weak, and what to do next',
    'Unlimited practice, not one set a day',
    'Focused Learning on every topic (a short lesson, then a 10-question quiz)',
    'Timed Mock Tests and Challenge Mode',
    `The AI Tutor, on hand the moment ${child} gets stuck`,
    'Per-question drill-down and printable progress reports',
  ]);

  const priceCard = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
      <tr>
        <td style="background:${C.bgBrandSoft};border:1px solid ${C.borderBrand};border-radius:12px;padding:24px;text-align:center;">
          <p style="margin:0 0 4px;font-family:${HEAD_FONT};font-size:22px;font-weight:600;color:${C.textPrimary};letter-spacing:-0.3px;">£24.99<span style="font-family:${BODY_FONT};font-size:14px;font-weight:400;color:${C.textSecondary};"> / month</span></p>
          <p style="margin:0 0 12px;font-family:${BODY_FONT};font-size:13px;color:${C.textSecondary};">or £199 a year (you save £101)</p>
          <p style="margin:0;font-family:${BODY_FONT};font-size:12px;color:${C.textMuted};">That is less than the cost of a single hour with a private tutor. Cancel any time, and the free plan always stays free.</p>
        </td>
      </tr>
    </table>`;

  const fsmCard = infoCard({
    label: 'A note on access',
    title: 'Free for FSM and Pupil Premium families',
    body: `On Free School Meals or Pupil Premium? PrepStep Plus is free for your family, permanently. Just email <a href="mailto:hello@prepstep.co.uk?subject=FSM access" style="color:${C.brand};text-decoration:underline;">hello@prepstep.co.uk</a> and we will sort it. No card needed.`,
    accent: 'green',
  });

  const content = `
    ${preheaderSpan(preheader)}
    ${bodyText(`Hi ${parentFirst},`, { size: 16, marginBottom: 16 })}
    ${bodyText(`In five days, ${child}'s 30-day full-access trial ends. I wanted to give you plenty of notice, and show you what ${child} has built up so far.`, { muted: true, size: 15 })}
    ${personalisedBlock}
    ${bodyText('PrepStep Plus keeps the full picture, and unlocks:', { size: 15, marginBottom: 4 })}
    ${featureList}
    ${priceCard}
    ${ctaButton(`Keep ${child}'s full access`, APP_URL)}
    ${fsmCard}
    ${bodyText('Thanks for giving PrepStep a proper try.<br/>Ben', { muted: true, size: 13, marginTop: 20 })}
  `;

  return { subject, html: emailWrapper(child, content) };
}

export function buildDay30Email(account, quizCount, currentStreak) {
  const child = account.display_name;
  const parentFirst = account.name?.split(' ')[0] || account.name;
  const subject = `${child} has moved to the free PrepStep plan`;
  const preheader = 'Every quiz and every streak is kept. Here is what free includes, and what comes next.';

  const reassuranceLine = quizCount > 0
    ? `Reassurance first, because it matters: ${child}'s trial has ended, and nothing has been lost. Every quiz, every badge, the streak, and all ${quizCount} quiz${quizCount > 1 ? 'zes' : ''} of history are exactly where you left them.`
    : `Reassurance first: ${child}'s trial has ended, but nothing is lost and nothing is deleted. The moment ${child} is ready, a fresh set of 10 questions is waiting, free every day.`;

  const freePlanLine = currentStreak > 1
    ? `${child} is now on the free PrepStep plan, and will keep learning every single day: a fresh set of 10 mixed questions daily, with streaks, prep points and badges all still going. Their current <strong>${currentStreak}-day streak</strong> carries straight on.`
    : `${child} is now on the free PrepStep plan, and will keep learning every single day: a fresh set of 10 mixed questions daily, with streaks, prep points and badges all still going.`;

  const priceCard = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
      <tr>
        <td style="background:${C.bgBrandSoft};border:1px solid ${C.borderBrand};border-radius:12px;padding:24px;text-align:center;">
          <p style="margin:0 0 4px;font-family:${HEAD_FONT};font-size:22px;font-weight:600;color:${C.textPrimary};letter-spacing:-0.3px;">£24.99<span style="font-family:${BODY_FONT};font-size:14px;font-weight:400;color:${C.textSecondary};"> / month</span></p>
          <p style="margin:0 0 12px;font-family:${BODY_FONT};font-size:13px;color:${C.textSecondary};">or £199 a year (you save £101)</p>
          <p style="margin:0;font-family:${BODY_FONT};font-size:12px;color:${C.textMuted};">Less than the cost of a single hour with a private tutor. Cancel any time.</p>
        </td>
      </tr>
    </table>`;

  const fsmCard = infoCard({
    label: 'A note on access',
    title: 'Free for FSM and Pupil Premium families',
    body: `On Free School Meals or Pupil Premium? PrepStep Plus is free for your family, permanently. Just email <a href="mailto:hello@prepstep.co.uk?subject=FSM access" style="color:${C.brand};text-decoration:underline;">hello@prepstep.co.uk</a>. No card needed, and no awkward questions.`,
    accent: 'green',
  });

  const content = `
    ${preheaderSpan(preheader)}
    ${bodyText(`Hi ${parentFirst},`, { size: 16, marginBottom: 16 })}
    ${bodyText(reassuranceLine, { muted: true, size: 15 })}
    ${bodyText(freePlanLine, { muted: true, size: 15 })}
    ${bodyText('Free is genuinely free, and it stays that way. We built it so no child is ever locked out of practising, whatever a family can spend. That is a promise, not an offer that expires.', { muted: true, size: 15 })}
    ${bodyText(`When you are ready for more, PrepStep Plus is there. The biggest thing it gives you back is the full Parent Dashboard: the per-topic breakdown that shows exactly where ${child} is strong, where they are weak, and what to work on next. It is the difference between knowing ${child}'s overall score and knowing the one topic that is quietly costing them marks.`, { muted: true, size: 15 })}
    ${bodyText('Plus also reopens unlimited practice, Focused Learning on every topic, timed Mock Tests, Challenge Mode, the AI Tutor, and printable progress reports you can bring to a parents\' evening.', { muted: true, size: 15 })}
    ${priceCard}
    ${ctaButton(`See ${child}'s full progress`, APP_URL)}
    ${fsmCard}
    ${bodyText(`One more thing, ${parentFirst}. I am Ben, PrepStep's founder. I would love to know how ${child} has got on: what worked, what did not, and anything you would change. Hit reply and it comes straight to me, and I read every message.<br/>Ben`, { muted: true, size: 13, marginTop: 20 })}
  `;

  return { subject, html: emailWrapper(child, content) };
}

export async function handleScheduled(env) {
  // Run late-flag job unconditionally — doesn't need email config
  try {
    await runLateFlagJob(env.DB);
  } catch (err) {
    console.error('[scheduled] Late-flag job error:', err.message);
  }

  // Guard: don't send if email not configured
  if (!env.EMAIL_API_KEY || !env.EMAIL_FROM) {
    console.log('[email] Skipping weekly emails — EMAIL_API_KEY or EMAIL_FROM not configured');
    return;
  }

  const db = env.DB;

  // Weekly progress emails: only sent to active subscribers (and comped accounts).
  // Trial accounts get the rich weekly progress email at Days 21 and 28 of their
  // trial via handleTrialEmails — that's intentional sales pacing, not Sunday cadence.
  // Users on cancelled / expired / never-subscribed status don't get weekly emails.
  const { results: accounts } = await db.prepare(`
    SELECT a.id, a.email, a.name, c.id as child_id, c.display_name
    FROM accounts a
    JOIN children c ON c.account_id = a.id
    WHERE a.last_login_at IS NOT NULL
      AND a.email_opt_in = 1
      AND (a.is_comped = 1 OR a.subscription_status IN ('active', 'trialing', 'past_due'))
  `).all();

  if (accounts.length === 0) {
    console.log('[email] No active accounts to email');
    return;
  }

  for (const account of accounts) {
    try {
      const html = await buildWeeklyProgressEmail(db, account);
      if (!html) {
        console.log(`[email] Skipping ${account.email} — no activity this week`);
        continue;
      }
      const subject = `${account.display_name}'s week on PrepStep`;
      await sendEmail(env, { to: account.email, subject, html });
      console.log(`[email] Sent weekly progress to ${account.email}`);
    } catch (err) {
      console.error(`[email] Failed for ${account.email}:`, err.message);
    }
  }
}

// ── Weekly Progress Email ──
// The single most important parent-facing email. For parents who don't open
// the dashboard, this IS the dashboard. Mirrors the dashboard structure:
// readiness band header, this-week stats, mock test (if any), full topic
// heatmap, focus area, mock CTA.
//
// Returns null if there's no activity this week (skip send).
async function buildWeeklyProgressEmail(db, account) {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // Fetch everything in parallel
  const [weeklyQuestions, weeklyQuizzes, weeklyMocks, streak, allQuestions, allMocks] = await Promise.all([
    db.prepare(
      `SELECT COUNT(*) as total, SUM(is_correct) as correct
       FROM question_results
       WHERE child_id = ? AND attempted_at > ?`
    ).bind(account.child_id, weekAgo).first(),
    db.prepare(
      `SELECT COUNT(*) as total FROM quiz_results
       WHERE child_id = ? AND completed_at > ?`
    ).bind(account.child_id, weekAgo).first(),
    db.prepare(
      `SELECT subject, percentage, completed_at FROM mock_test_results
       WHERE child_id = ? AND completed_at > ?
       ORDER BY completed_at DESC`
    ).bind(account.child_id, weekAgo).all(),
    db.prepare(
      'SELECT current_streak, longest_streak FROM streaks WHERE child_id = ?'
    ).bind(account.child_id).first(),
    db.prepare(
      `SELECT topic_key, subject, is_correct, attempted_at
       FROM question_results
       WHERE child_id = ?
       ORDER BY attempted_at DESC
       LIMIT 2000`
    ).bind(account.child_id).all(),
    // All-time mocks — needed for per-subject readiness (most recent per subject)
    db.prepare(
      `SELECT subject, percentage, completed_at FROM mock_test_results
       WHERE child_id = ?
       ORDER BY completed_at DESC`
    ).bind(account.child_id).all(),
  ]);

  const weeklyQuestionCount = weeklyQuestions?.total || 0;
  const weeklyQuizCount = weeklyQuizzes?.total || 0;
  const weeklyAccuracy = weeklyQuestionCount > 0
    ? Math.round(((weeklyQuestions.correct || 0) / weeklyQuestionCount) * 100)
    : null;
  const currentStreak = streak?.current_streak || 0;
  const mocksThisWeek = weeklyMocks.results || [];

  // Skip if no activity at all
  if (weeklyQuestionCount === 0 && weeklyQuizCount === 0 && mocksThisWeek.length === 0) {
    return null;
  }

  // Full mastery summary (for heatmap + weakest topic)
  const summary = buildMasterySummary(allQuestions.results || [], now.getTime());

  // Per-subject readiness using the SAME algorithm as the in-app
  // ExamReadinessCard so the email and app always agree.
  const subjectReadiness = getAllSubjectReadiness(
    allQuestions.results || [],
    allMocks.results || [],
    now.getTime()
  );

  // Pull child name for personalisation
  const childName = account.display_name;
  const parentFirst = account.name?.split(' ')[0] || account.name;

  return weeklyEmailHtml({
    parentFirst,
    childName,
    weeklyQuizCount,
    weeklyQuestionCount,
    weeklyAccuracy,
    currentStreak,
    mocksThisWeek,
    summary,
    subjectReadiness,
  });
}

export function weeklyEmailHtml({ parentFirst, childName, weeklyQuizCount, weeklyQuestionCount, weeklyAccuracy, currentStreak, mocksThisWeek, summary, subjectReadiness }) {
  const { inProgressTopics, weakestCovered } = summary;

  // ── Encouragement based on activity level ──
  let encouragement;
  if (weeklyQuestionCount >= 50) {
    encouragement = `Brilliant week — ${weeklyQuestionCount} questions is a strong amount of practice.`;
  } else if (weeklyQuestionCount >= 20) {
    encouragement = `Good consistency this week.`;
  } else if (weeklyQuestionCount > 0) {
    encouragement = `${childName} made a start this week — even a little practice keeps the streak alive.`;
  } else {
    encouragement = `${childName} didn't practise this week, but every other week's data is preserved. Pick up any time.`;
  }

  // ── Exam readiness, per subject (matches in-app ExamReadinessCard) ──
  const renderSubjectBand = (sr) => {
    if (!sr) return '';
    return `
      <tr><td style="padding:6px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="background:${sr.colour}0d;border:1px solid ${sr.colour}40;border-radius:12px;padding:14px 18px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:middle;">
                    <p style="margin:0 0 2px;font-family:${BODY_FONT};font-size:11px;font-weight:700;color:${sr.colour};letter-spacing:1.2px;text-transform:uppercase;">${SUBJECT_LABELS[sr.subject] || sr.subject}</p>
                    <p style="margin:0;font-family:${HEAD_FONT};font-size:20px;font-weight:600;color:${sr.colour};letter-spacing:-0.3px;line-height:1.15;">${sr.band}</p>
                  </td>
                  <td style="vertical-align:middle;text-align:right;width:60px;">
                    <p style="margin:0;font-family:${HEAD_FONT};font-size:22px;font-weight:600;color:${sr.colour};letter-spacing:-0.5px;line-height:1;">${sr.score}</p>
                    <p style="margin:0;font-family:${BODY_FONT};font-size:10px;color:${C.textMuted};letter-spacing:0.5px;">/ 100</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td></tr>`;
  };

  const readinessBand = `
    <p style="margin:24px 0 6px;font-family:${BODY_FONT};font-size:11px;font-weight:700;color:${C.textMuted};letter-spacing:1.4px;text-transform:uppercase;">Exam readiness</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
      ${renderSubjectBand(subjectReadiness?.maths)}
      ${renderSubjectBand(subjectReadiness?.english)}
      ${renderSubjectBand(subjectReadiness?.verbalreasoning)}
    </table>`;

  // ── Stats row — three pill cards ──
  const statsRow = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 16px;">
      <tr>
        <td style="width:33.33%;padding-right:6px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="background:${C.bgCardSubtle};border:1px solid ${C.border};border-radius:10px;padding:16px 8px;text-align:center;">
            <p style="margin:0 0 4px;font-family:${HEAD_FONT};font-size:26px;font-weight:600;color:${C.textPrimary};letter-spacing:-0.5px;line-height:1;">${weeklyQuestionCount}</p>
            <p style="margin:0;font-family:${BODY_FONT};font-size:11px;color:${C.textMuted};">Questions</p>
          </td></tr></table>
        </td>
        <td style="width:33.33%;padding:0 3px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="background:${C.bgCardSubtle};border:1px solid ${C.border};border-radius:10px;padding:16px 8px;text-align:center;">
            <p style="margin:0 0 4px;font-family:${HEAD_FONT};font-size:26px;font-weight:600;color:${C.textPrimary};letter-spacing:-0.5px;line-height:1;">${weeklyAccuracy != null ? `${weeklyAccuracy}%` : '—'}</p>
            <p style="margin:0;font-family:${BODY_FONT};font-size:11px;color:${C.textMuted};">Accuracy</p>
          </td></tr></table>
        </td>
        <td style="width:33.33%;padding-left:6px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="background:${C.bgCardSubtle};border:1px solid ${C.border};border-radius:10px;padding:16px 8px;text-align:center;">
            <p style="margin:0 0 4px;font-family:${HEAD_FONT};font-size:26px;font-weight:600;color:${C.textPrimary};letter-spacing:-0.5px;line-height:1;">${currentStreak}</p>
            <p style="margin:0;font-family:${BODY_FONT};font-size:11px;color:${C.textMuted};">Day streak</p>
          </td></tr></table>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 4px;font-family:${BODY_FONT};font-size:12px;color:${C.textMuted};">${weeklyQuizCount} quiz${weeklyQuizCount === 1 ? '' : 'zes'} completed this week</p>
  `;

  // ── Mock test card (when a mock was sat this week) ──
  const mockBlock = mocksThisWeek.length > 0
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 0;">
        ${mocksThisWeek.map(m => `
          <tr><td style="background:${C.bgBrandSoft};border:1px solid ${C.borderBrand};border-radius:12px;padding:20px;text-align:center;margin:4px 0;">
            <p style="margin:0 0 4px;font-family:${BODY_FONT};font-size:11px;font-weight:700;color:${C.brand};letter-spacing:1.4px;text-transform:uppercase;">${SUBJECT_LABELS[m.subject] || m.subject} Mock Test</p>
            <p style="margin:0;font-family:${HEAD_FONT};font-size:42px;font-weight:600;color:${C.brand};letter-spacing:-1px;line-height:1;">${m.percentage}%</p>
          </td></tr>
        `).join('<tr><td style="height:8px;"></td></tr>')}
      </table>`
    : '';

  // ── Topic heatmap ──
  // Each topic = a card with a coloured strip at the top (mastery indicator).
  // Topic name + accuracy/q-count below in clean typography. Far less heatmap-y.
  const subjectSections = Object.keys(SUBJECT_TOPICS).map(subject => {
    const subjectTopics = summary.topics.filter(t => t.subject === subject);
    const topicCells = subjectTopics.map(t => {
      const b = t.band;
      const detail = t.totalQuestions === 0
        ? 'Not started'
        : `${t.recentAccuracy}% · ${t.totalQuestions}q`;
      return `
        <td style="width:33.33%;padding:3px;vertical-align:top;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="background:${C.bgCard};border:1px solid ${C.border};border-radius:8px;overflow:hidden;">
            <div style="height:3px;background:${b.colour};line-height:3px;font-size:1px;">&nbsp;</div>
            <div style="padding:10px 10px 8px;">
              <p style="margin:0 0 2px;font-family:${BODY_FONT};font-size:12px;font-weight:600;color:${C.textPrimary};line-height:1.25;">${formatTopicKey(t.topicKey)}</p>
              <p style="margin:0;font-family:${BODY_FONT};font-size:10px;color:${C.textMuted};">${detail}</p>
            </div>
          </td></tr></table>
        </td>
      `;
    });

    const rows = [];
    for (let i = 0; i < topicCells.length; i += 3) {
      const rowCells = topicCells.slice(i, i + 3);
      while (rowCells.length < 3) rowCells.push('<td style="width:33.33%;padding:3px;"></td>');
      rows.push(`<tr>${rowCells.join('')}</tr>`);
    }

    return `
      <p style="margin:24px 0 6px;font-family:${HEAD_FONT};font-size:18px;font-weight:600;color:${C.textPrimary};letter-spacing:-0.2px;">${SUBJECT_LABELS[subject]}</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;">
        ${rows.join('')}
      </table>
    `;
  }).join('');

  // ── Heatmap legend ──
  const legendDot = (colour, label) => `<span style="display:inline-block;width:8px;height:8px;background:${colour};border-radius:50%;vertical-align:middle;margin-right:5px;"></span><span style="vertical-align:middle;">${label}</span>`;
  const legend = `
    <p style="margin:12px 0 0;font-family:${BODY_FONT};font-size:10px;color:${C.textMuted};text-align:center;line-height:1.8;">
      ${legendDot(C.bandMastered, 'Mastered')}&nbsp;&nbsp;&nbsp;
      ${legendDot(C.bandConfident, 'Confident')}&nbsp;&nbsp;&nbsp;
      ${legendDot(C.bandDeveloping, 'Developing')}&nbsp;&nbsp;&nbsp;
      ${legendDot(C.bandExploring, 'Exploring')}&nbsp;&nbsp;&nbsp;
      ${legendDot(C.bandNotStarted, 'Not started')}
    </p>
  `;

  // ── Focus area for next week ──
  const focusBlock = weakestCovered
    ? infoCard({
        label: 'Focus for next week',
        title: `${formatTopicKey(weakestCovered.topicKey)} · ${weakestCovered.recentAccuracy}% accuracy`,
        body: `This is ${childName}'s weakest well-practised topic (${weakestCovered.totalQuestions} questions answered). Two Focused Learning sessions on it this week would make the biggest difference.`,
        accent: 'amber',
      })
    : (inProgressTopics.length > 0
      ? infoCard({
          label: 'Building coverage',
          title: `${inProgressTopics.length} topic${inProgressTopics.length > 1 ? 's' : ''} in progress`,
          body: `5–19 questions answered. Once a topic hits 20 questions we can give you a reliable accuracy reading.`,
          accent: 'brand',
        })
      : '');

  const bestBand = subjectReadiness
    ? [subjectReadiness.maths, subjectReadiness.english, subjectReadiness.verbalreasoning]
        .filter(Boolean).sort((a, b) => b.score - a.score)[0]?.band
    : null;
  const reviewPretext = `${childName}'s week on PrepStep — ${weeklyQuestionCount} questions, ${weeklyAccuracy != null ? `${weeklyAccuracy}% accuracy` : 'no quizzes yet'}${bestBand ? `, ${bestBand}` : ''}.`;

  const content = `
    <span style="display:none;font-size:1px;color:${C.bgCard};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${reviewPretext}</span>
    ${smallLabel("This week's review", C.brand)}
    ${heading('h1', `${childName}'s week`, 0)}
    ${bodyText(`Hi ${parentFirst},`, { size: 16, marginTop: 4, marginBottom: 12 })}
    ${bodyText(encouragement, { muted: true, size: 15 })}

    ${readinessBand}

    ${heading('h3', 'This week', 8)}
    ${statsRow}

    ${mocksThisWeek.length > 0 ? `${heading('h3', `Mock test${mocksThisWeek.length > 1 ? 's' : ''} this week`, 24)}${mockBlock}` : ''}

    ${heading('h3', 'Full curriculum view', 28)}
    ${bodyText(`Every topic ${childName} will face in the exam. The coloured strip shows current mastery.`, { muted: true, size: 13, marginBottom: 4 })}
    ${subjectSections}
    ${legend}

    ${focusBlock}

    ${ctaButton('Open full dashboard', APP_URL)}

    ${bodyText(`Sent every Sunday. Turn off weekly emails any time from your <a href="${APP_URL}/?view=progress-parent" style="color:${C.brand};text-decoration:underline;">Parent Dashboard</a>.`, { muted: true, size: 11, marginTop: 20 })}
  `;

  return emailWrapper(childName, content);
}

// ── Preview an email using the authenticated user's account data ──
// Sends to `toOverride` if provided, else to the account's own email.
// Used for testing how emails render in real clients (Gmail, Outlook).
// Routed at POST /api/dev/preview-email — requires Clerk auth.
export async function handlePreviewEmailForUser(env, userId, day, toOverride) {
  const db = env.DB;

  const account = await db.prepare(`
    SELECT a.id, a.email, a.name, a.email_opt_in,
           c.id as child_id, c.display_name
    FROM accounts a
    JOIN children c ON c.account_id = a.id
    WHERE a.id = ?
    LIMIT 1
  `).bind(userId).first();

  if (!account) return { error: 'No account found for authenticated user' };

  const recipient = toOverride || account.email;

  // Days 21 / 28 use the weekly progress builder (rich data view)
  if (day === 21 || day === 28) {
    const html = await buildWeeklyProgressEmail(db, account);
    if (!html) return { error: 'No activity data to render weekly email — practise some quizzes first' };
    const subject = `${account.display_name}'s week on PrepStep`;
    await sendEmail(env, { to: recipient, subject, html });
    return { ok: true, to: recipient, day, format: 'weekly-progress' };
  }

  // Fetch personalisation data for trial milestones
  const [recentQuizzes, streak, weakestTopic] = await Promise.all([
    db.prepare(
      `SELECT topic_key, subject, score, total FROM quiz_results
       WHERE child_id = ? ORDER BY completed_at DESC LIMIT 50`
    ).bind(account.child_id).all(),
    db.prepare(
      'SELECT current_streak FROM streaks WHERE child_id = ?'
    ).bind(account.child_id).first(),
    db.prepare(
      `SELECT topic_key, subject,
              SUM(is_correct) * 1.0 / COUNT(*) as accuracy,
              COUNT(*) as attempts
       FROM question_results
       WHERE child_id = ?
       GROUP BY topic_key, subject
       HAVING COUNT(*) >= 5
       ORDER BY accuracy ASC
       LIMIT 1`
    ).bind(account.child_id).first(),
  ]);

  const quizCount = recentQuizzes.results?.length || 0;
  const currentStreak = streak?.current_streak || 0;
  const weakest = weakestTopic
    ? { topicKey: weakestTopic.topic_key, accuracy: Math.round(weakestTopic.accuracy * 100) }
    : null;

  let subject, html;
  if (day === 1) ({ subject, html } = buildDay1Email(account, quizCount, weakest));
  else if (day === 7) ({ subject, html } = buildDay7Email(account, quizCount, currentStreak, recentQuizzes.results || [], weakest));
  else if (day === 14) ({ subject, html } = buildDay14Email(account, quizCount, currentStreak, weakest));
  else if (day === 25) ({ subject, html } = buildDay25Email(account, quizCount, currentStreak, weakest));
  else if (day === 30) ({ subject, html } = buildDay30Email(account, quizCount, currentStreak));
  else return { error: `Unknown day ${day}. Valid: 1, 7, 14, 21, 25, 28, 30` };

  await sendEmail(env, { to: recipient, subject, html });
  return { ok: true, to: recipient, day, quizCount, currentStreak };
}

// ── TEMPORARY: send a specific trial email to a specific account ──
// Called from /api/dev/send-trial-email. Remove after testing.
export async function handleTrialEmailForAccount(env, emailAddress, day) {
  const db = env.DB;

  const account = await db.prepare(`
    SELECT a.id, a.email, a.name, a.email_opt_in,
           c.id as child_id, c.display_name
    FROM accounts a
    JOIN children c ON c.account_id = a.id
    WHERE a.email = ?
    LIMIT 1
  `).bind(emailAddress).first();

  if (!account) return { error: `No account found for ${emailAddress}` };

  const [recentQuizzes, streak, weakestTopic] = await Promise.all([
    db.prepare(
      `SELECT topic_key, subject, score, total FROM quiz_results
       WHERE child_id = ? ORDER BY completed_at DESC LIMIT 50`
    ).bind(account.child_id).all(),
    db.prepare(
      'SELECT current_streak FROM streaks WHERE child_id = ?'
    ).bind(account.child_id).first(),
    db.prepare(
      `SELECT topic_key, subject,
              SUM(is_correct) * 1.0 / COUNT(*) as accuracy,
              COUNT(*) as attempts
       FROM question_results
       WHERE child_id = ?
       GROUP BY topic_key, subject
       HAVING COUNT(*) >= 5
       ORDER BY accuracy ASC
       LIMIT 1`
    ).bind(account.child_id).first(),
  ]);

  const quizCount = recentQuizzes.results?.length || 0;
  const currentStreak = streak?.current_streak || 0;
  const weakest = weakestTopic
    ? { topicKey: weakestTopic.topic_key, accuracy: Math.round(weakestTopic.accuracy * 100) }
    : null;

  let subject, html;
  if (day === 1)       ({ subject, html } = buildDay1Email(account, quizCount, weakest));
  else if (day === 7)  ({ subject, html } = buildDay7Email(account, quizCount, currentStreak, recentQuizzes.results || [], weakest));
  else if (day === 14) ({ subject, html } = buildDay14Email(account, quizCount, currentStreak, weakest));
  else if (day === 25) ({ subject, html } = buildDay25Email(account, quizCount, currentStreak, weakest));
  else if (day === 30) ({ subject, html } = buildDay30Email(account, quizCount, currentStreak));
  else return { error: `Unknown day ${day}` };

  await sendEmail(env, { to: emailAddress, subject, html });
  return { ok: true, to: emailAddress, day, quizCount, currentStreak };
}
