// ── Email Routes ──
// Triggered by Cloudflare Cron:
//   "0 18 * * SUN" — weekly progress emails
//   "0 6 * * *"    — trial lifecycle emails (Days 1, 7, 14, 25)
//
// Requires Worker secrets: EMAIL_API_KEY, EMAIL_FROM

import { json } from '../helpers.js';

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
// Days 1/7/14 go to email_opt_in accounts only (engagement emails).
// Day 25 goes to all accounts in trial (transactional — account access notice).
export async function handleTrialEmails(env) {
  if (!env.EMAIL_API_KEY || !env.EMAIL_FROM) {
    console.log('[trial-email] Skipping — EMAIL_API_KEY or EMAIL_FROM not configured');
    return;
  }

  const db = env.DB;

  // Find all accounts currently in their free trial (no subscription, not comped)
  // julianday arithmetic gives days since created_at (stored as UTC ISO string).
  const { results: trialAccounts } = await db.prepare(`
    SELECT a.id, a.email, a.name, a.email_opt_in,
           CAST(julianday('now') - julianday(a.created_at || 'Z') AS INTEGER) as days_since_create,
           c.id as child_id, c.display_name
    FROM accounts a
    JOIN children c ON c.account_id = a.id
    WHERE a.is_comped = 0
      AND (a.subscription_status IS NULL OR a.subscription_status NOT IN ('active', 'trialing', 'past_due'))
  `).all();

  const MILESTONES = [
    { day: 1,  key: 'day1',  optInOnly: true  },
    { day: 7,  key: 'day7',  optInOnly: true  },
    { day: 14, key: 'day14', optInOnly: true  },
    { day: 25, key: 'day25', optInOnly: false },
  ];

  for (const account of trialAccounts) {
    const d = account.days_since_create;
    const milestone = MILESTONES.find(m => m.day === d);
    if (!milestone) continue;
    if (milestone.optInOnly && !account.email_opt_in) continue;

    try {
      // Fetch activity data for personalisation
      const [recentQuizzes, streak] = await Promise.all([
        db.prepare(
          `SELECT topic_key, subject, score, total FROM quiz_results
           WHERE child_id = ? ORDER BY completed_at DESC LIMIT 20`
        ).bind(account.child_id).all(),
        db.prepare(
          'SELECT current_streak FROM streaks WHERE child_id = ?'
        ).bind(account.child_id).first(),
      ]);

      const quizCount = recentQuizzes.results?.length || 0;
      const currentStreak = streak?.current_streak || 0;

      let subject, html;

      if (milestone.key === 'day1') {
        ({ subject, html } = buildDay1Email(account, quizCount));
      } else if (milestone.key === 'day7') {
        ({ subject, html } = buildDay7Email(account, quizCount, currentStreak, recentQuizzes.results || []));
      } else if (milestone.key === 'day14') {
        ({ subject, html } = buildDay14Email(account, quizCount, currentStreak));
      } else if (milestone.key === 'day25') {
        ({ subject, html } = buildDay25Email(account, quizCount, currentStreak));
      }

      await sendEmail(env, { to: account.email, subject, html });
      console.log(`[trial-email] Sent ${milestone.key} to ${account.email}`);
    } catch (err) {
      console.error(`[trial-email] Failed ${milestone.key} for ${account.email}:`, err.message);
    }
  }
}

// ── Email template helpers ──

function emailWrapper(childName, content) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f8f7ff;">
  <div style="max-width:520px;margin:0 auto;padding:32px 16px;">
    <div style="background:#7C3AED;border-radius:16px 16px 0 0;padding:24px;text-align:center;">
      <p style="color:white;margin:0;font-size:20px;font-weight:700;">PrepStep</p>
      <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:13px;">${childName}'s 11+ prep</p>
    </div>
    <div style="background:white;padding:28px 24px;border-radius:0 0 16px 16px;">
      ${content}
    </div>
    <p style="text-align:center;font-size:11px;color:#aaa;margin-top:16px;">
      PrepStep · Made in Bournemouth · Built by a parent<br>
      <a href="mailto:hello@prepstep.co.uk?subject=unsubscribe" style="color:#aaa;">Unsubscribe</a>
    </p>
  </div>
</body>
</html>`;
}

function ctaButton(text, url) {
  return `<div style="text-align:center;margin:24px 0;">
    <a href="${url}" style="background:#7C3AED;color:white;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:700;font-size:15px;display:inline-block;">${text}</a>
  </div>`;
}

function buildDay1Email(account, quizCount) {
  const child = account.display_name;
  const hasActivity = quizCount > 0;
  const subject = hasActivity
    ? `${child} has already made a start — here's what PrepStep found`
    : `${child}'s 30-day trial has started — here's how to get the most out of it`;

  const content = `
    <p style="color:#2D3436;font-size:15px;margin-top:0;">Hi ${account.name},</p>
    ${hasActivity
      ? `<p style="color:#636E72;font-size:14px;">Great news — ${child} has already jumped in. PrepStep is now tracking their progress across every topic, so you'll be able to see exactly where they're strong and where they need more practice.</p>`
      : `<p style="color:#636E72;font-size:14px;">${child}'s 30-day trial just started. Here's the quickest way to see what PrepStep can do:</p>`
    }
    <div style="background:#f8f7ff;border-radius:12px;padding:16px;margin:20px 0;">
      <p style="color:#2D3436;font-size:14px;font-weight:600;margin:0 0 10px;">Three things to do in the first week:</p>
      <p style="color:#636E72;font-size:13px;margin:6px 0;">1. <strong>Start a Daily Learning quiz</strong> — 10 questions across all subjects, takes about 8 minutes.</p>
      <p style="color:#636E72;font-size:13px;margin:6px 0;">2. <strong>Try Focused Learning</strong> — pick a topic ${child} finds tricky and work through it with a lesson first.</p>
      <p style="color:#636E72;font-size:13px;margin:6px 0;">3. <strong>Sit a Mock Test</strong> — timed, full-paper, instantly marked. Great for seeing where things stand.</p>
    </div>
    ${ctaButton('Open PrepStep', APP_URL)}
    <p style="color:#636E72;font-size:13px;">Any questions, just reply to this email. — Ben</p>
  `;

  return { subject, html: emailWrapper(child, content) };
}

function buildDay7Email(account, quizCount, currentStreak, recentQuizzes) {
  const child = account.display_name;
  const subject = `${child}'s first week on PrepStep`;

  // Top topic by quiz count
  const topicCounts = {};
  recentQuizzes.forEach(q => { topicCounts[q.topic_key] = (topicCounts[q.topic_key] || 0) + 1; });
  const topTopic = Object.entries(topicCounts).sort((a, b) => b[1] - a[1])[0];
  const topTopicName = topTopic
    ? topTopic[0].replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())
    : null;

  const content = `
    <p style="color:#2D3436;font-size:15px;margin-top:0;">Hi ${account.name},</p>
    ${quizCount > 0
      ? `<p style="color:#636E72;font-size:14px;">${child} has completed <strong>${quizCount} quiz${quizCount > 1 ? 'zes' : ''}</strong> in their first week${currentStreak > 1 ? ` and is on a <strong>${currentStreak}-day streak</strong>` : ''}. ${topTopicName ? `Most time spent on <strong>${topTopicName}</strong>.` : ''}</p>`
      : `<p style="color:#636E72;font-size:14px;">A week has passed since ${child}'s trial started. If you haven't had a chance to try PrepStep yet, there are still 23 days to explore it fully — no rush.</p>`
    }
    <div style="background:#f8f7ff;border-radius:12px;padding:16px;margin:20px 0;">
      <p style="color:#2D3436;font-size:13px;margin:0;">
        ${quizCount > 0
          ? `<strong>Tip for week 2:</strong> Try a Focused Learning session on a topic ${child} found tricky. The lesson before the quiz makes a real difference — it teaches the method, not just tests it.`
          : `<strong>Where to start:</strong> Daily Learning is the easiest entry point — 10 questions, about 8 minutes, across all three subjects. It'll show you immediately where ${child} needs to focus.`
        }
      </p>
    </div>
    ${ctaButton('Continue on PrepStep', APP_URL)}
    <p style="color:#636E72;font-size:13px;">23 days left in your free trial.</p>
  `;

  return { subject, html: emailWrapper(child, content) };
}

function buildDay14Email(account, quizCount, currentStreak) {
  const child = account.display_name;
  const subject = `Two weeks in — how is ${child} getting on?`;

  const content = `
    <p style="color:#2D3436;font-size:15px;margin-top:0;">Hi ${account.name},</p>
    <p style="color:#636E72;font-size:14px;">Two weeks into ${child}'s trial. ${quizCount > 0
      ? `They've completed ${quizCount} quiz${quizCount > 1 ? 'zes' : ''}${currentStreak > 1 ? ` and kept a ${currentStreak}-day streak going` : ''}. The Parent Dashboard in the app shows a full breakdown of where they're strong and where to focus next.`
      : `If you haven't started yet, you've still got 16 days to try it properly — that's plenty of time to see whether it works for ${child}.`
    }</p>
    <div style="background:#f8f7ff;border-radius:12px;padding:16px;margin:20px 0;">
      <p style="color:#2D3436;font-size:14px;font-weight:600;margin:0 0 8px;">Have you tried a Mock Test yet?</p>
      <p style="color:#636E72;font-size:13px;margin:0;">A full timed GL Assessment paper, marked instantly with a topic-by-topic breakdown. It's the best way to see how ${child} would perform on the day — and where to focus the last weeks of prep.</p>
    </div>
    ${ctaButton('Try a Mock Test', APP_URL)}
    <p style="color:#636E72;font-size:13px;">16 days left in your free trial.</p>
  `;

  return { subject, html: emailWrapper(child, content) };
}

function buildDay25Email(account, quizCount, currentStreak) {
  const child = account.display_name;
  const subject = `5 days left in ${child}'s PrepStep trial`;

  const content = `
    <p style="color:#2D3436;font-size:15px;margin-top:0;">Hi ${account.name},</p>
    <p style="color:#636E72;font-size:14px;">Your free trial ends in 5 days. ${quizCount > 0
      ? `${child} has completed ${quizCount} quiz${quizCount > 1 ? 'zes' : ''} and built up ${currentStreak > 0 ? `a ${currentStreak}-day streak and ` : ''}real learning data — all of which stays in the app when you subscribe.`
      : `If you haven't had a chance to try PrepStep yet, there are still 5 days of full access before the trial ends.`
    }</p>
    <div style="background:#f8f7ff;border-radius:12px;padding:20px;margin:20px 0;">
      <p style="color:#2D3436;font-size:15px;font-weight:700;margin:0 0 4px;">£24.99/month or £199/year</p>
      <p style="color:#636E72;font-size:13px;margin:0 0 4px;">Annual saves £101 — over four months free.</p>
      <p style="color:#636E72;font-size:13px;margin:0;">Cancel any time from your account page. No refund policy — you've had 30 days free to decide.</p>
    </div>
    ${ctaButton('Subscribe now', APP_URL)}
    <p style="color:#636E72;font-size:13px;">
      On Free School Meals or Pupil Premium? PrepStep is free for your family.
      Email <a href="mailto:hello@prepstep.co.uk?subject=FSM access" style="color:#7C3AED;">hello@prepstep.co.uk</a> and we'll set you up.
    </p>
  `;

  return { subject, html: emailWrapper(child, content) };
}

export async function handleScheduled(env) {
  // Guard: don't send if email not configured
  if (!env.EMAIL_API_KEY || !env.EMAIL_FROM) {
    console.log('[email] Skipping weekly emails — EMAIL_API_KEY or EMAIL_FROM not configured');
    return;
  }

  const db = env.DB;

  // Get all accounts with children where parent opted in to progress emails
  const { results: accounts } = await db.prepare(`
    SELECT a.id, a.email, a.name, c.id as child_id, c.display_name
    FROM accounts a
    JOIN children c ON c.account_id = a.id
    WHERE a.last_login_at IS NOT NULL AND a.email_opt_in = 1
  `).all();

  if (accounts.length === 0) {
    console.log('[email] No active accounts to email');
    return;
  }

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  for (const account of accounts) {
    try {
      // Aggregate this week's data
      const [quizzes, questions, streak] = await Promise.all([
        db.prepare(
          `SELECT topic_key, subject, score, total FROM quiz_results
           WHERE child_id = ? AND completed_at > ? ORDER BY completed_at`
        ).bind(account.child_id, weekAgo).all(),
        db.prepare(
          `SELECT COUNT(*) as total, SUM(is_correct) as correct FROM question_results
           WHERE child_id = ? AND attempted_at > ?`
        ).bind(account.child_id, weekAgo).first(),
        db.prepare(
          'SELECT current_streak, longest_streak FROM streaks WHERE child_id = ?'
        ).bind(account.child_id).first(),
      ]);

      const quizCount = quizzes.results.length;
      const questionCount = questions?.total || 0;
      const correctCount = questions?.correct || 0;
      const accuracy = questionCount > 0 ? Math.round((correctCount / questionCount) * 100) : 0;
      const currentStreak = streak?.current_streak || 0;

      // Skip if no activity this week
      if (quizCount === 0 && questionCount === 0) {
        console.log(`[email] Skipping ${account.email} — no activity this week`);
        continue;
      }

      // Group quizzes by topic
      const topicSummary = {};
      quizzes.results.forEach(q => {
        if (!topicSummary[q.topic_key]) {
          topicSummary[q.topic_key] = { quizzes: 0, totalScore: 0, totalQuestions: 0 };
        }
        topicSummary[q.topic_key].quizzes++;
        topicSummary[q.topic_key].totalScore += q.score;
        topicSummary[q.topic_key].totalQuestions += q.total;
      });

      const topicLines = Object.entries(topicSummary)
        .map(([topic, data]) => {
          const avg = Math.round((data.totalScore / data.totalQuestions) * 100);
          const name = topic.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
          return `${name}: ${data.quizzes} quiz${data.quizzes > 1 ? 'zes' : ''}, ${avg}% average`;
        })
        .join('\n  ');

      // Build email
      const subject = `${account.display_name}'s Weekly Progress — PrepStep`;
      const html = buildEmailHtml({
        parentName: account.name,
        childName: account.display_name,
        quizCount,
        questionCount,
        accuracy,
        currentStreak,
        topicLines: Object.entries(topicSummary).map(([topic, data]) => ({
          name: topic.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()),
          quizzes: data.quizzes,
          average: Math.round((data.totalScore / data.totalQuestions) * 100),
        })),
      });

      // Send via Resend API
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.EMAIL_API_KEY}`,
        },
        body: JSON.stringify({
          from: env.EMAIL_FROM,
          to: account.email,
          subject,
          html,
          headers: {
            'List-Unsubscribe': `<mailto:hello@prepstep.co.uk?subject=unsubscribe>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          },
        }),
      });

      console.log(`[email] Sent weekly progress to ${account.email}`);
    } catch (err) {
      console.error(`[email] Failed for ${account.email}:`, err.message);
    }
  }
}

// ── Email HTML Template ──
function buildEmailHtml({ parentName, childName, quizCount, questionCount, accuracy, currentStreak, topicLines }) {
  const topicRows = topicLines.map(t => `
    <tr>
      <td style="padding: 8px 12px; border-bottom: 1px solid #f0f0f0;">${t.name}</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #f0f0f0; text-align: center;">${t.quizzes}</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #f0f0f0; text-align: center;">${t.average}%</td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8f7ff;">
  <div style="max-width: 520px; margin: 0 auto; padding: 32px 16px;">
    <!-- Header -->
    <div style="background: #6C5CE7; border-radius: 16px 16px 0 0; padding: 24px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 22px;">${childName}'s Week in Review</h1>
      <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">PrepStep</p>
    </div>

    <!-- Body -->
    <div style="background: white; padding: 24px; border-radius: 0 0 16px 16px;">
      <p style="color: #2D3436; font-size: 15px; margin-top: 0;">Hi ${parentName},</p>
      <p style="color: #636E72; font-size: 14px;">Here's what ${childName} achieved this week:</p>

      <!-- Stats -->
      <div style="display: flex; gap: 12px; margin: 20px 0;">
        <div style="flex: 1; background: #f8f7ff; border-radius: 12px; padding: 16px; text-align: center;">
          <div style="font-size: 28px; font-weight: 700; color: #6C5CE7;">${quizCount}</div>
          <div style="font-size: 12px; color: #636E72;">Quizzes</div>
        </div>
        <div style="flex: 1; background: #f8f7ff; border-radius: 12px; padding: 16px; text-align: center;">
          <div style="font-size: 28px; font-weight: 700; color: #6C5CE7;">${accuracy}%</div>
          <div style="font-size: 12px; color: #636E72;">Accuracy</div>
        </div>
        <div style="flex: 1; background: #f8f7ff; border-radius: 12px; padding: 16px; text-align: center;">
          <div style="font-size: 28px; font-weight: 700; color: #6C5CE7;">${currentStreak}</div>
          <div style="font-size: 12px; color: #636E72;">Day Streak</div>
        </div>
      </div>

      <!-- Topic breakdown -->
      ${topicRows ? `
      <h3 style="color: #2D3436; font-size: 14px; margin: 20px 0 8px;">Topics Practised</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #2D3436;">
        <tr style="background: #f8f7ff;">
          <th style="padding: 8px 12px; text-align: left; font-weight: 600;">Topic</th>
          <th style="padding: 8px 12px; text-align: center; font-weight: 600;">Quizzes</th>
          <th style="padding: 8px 12px; text-align: center; font-weight: 600;">Avg Score</th>
        </tr>
        ${topicRows}
      </table>
      ` : ''}

      <!-- Encouragement -->
      <div style="background: #f0fff4; border-radius: 12px; padding: 16px; margin: 20px 0;">
        <p style="color: #2D3436; font-size: 14px; margin: 0;">
          ${quizCount >= 5
            ? `Brilliant week! ${childName} is putting in great effort.`
            : quizCount >= 2
              ? `Good progress this week. Every quiz counts!`
              : `${childName} made a start this week. Even a little practice makes a difference.`
          }
        </p>
      </div>

      <p style="color: #636E72; font-size: 12px; margin-top: 24px;">
        This email is sent weekly. To stop receiving these, update your preferences in the app
        or reply to this email.
      </p>
    </div>
  </div>
</body>
</html>`;
}
