// ── Weekly Progress Email ──
// Triggered by Cloudflare Cron (Sunday 18:00 UTC).
// DORMANT until EMAIL_API_KEY + EMAIL_FROM are configured as Worker secrets.
//
// To activate:
//   1. Sign up for Resend (resend.com) — 100 emails/day free
//   2. Verify your sending domain
//   3. wrangler secret put EMAIL_API_KEY
//   4. wrangler secret put EMAIL_FROM  (e.g. progress@yourdomain.com)
//
// The cron runs every Sunday. If EMAIL_API_KEY is missing, it logs and exits.

import { json } from '../helpers.js';

export async function handleScheduled(env) {
  // Guard: don't send if email not configured
  if (!env.EMAIL_API_KEY || !env.EMAIL_FROM) {
    console.log('[email] Skipping weekly emails — EMAIL_API_KEY or EMAIL_FROM not configured');
    return;
  }

  const db = env.DB;

  // Get all accounts with children
  const { results: accounts } = await db.prepare(`
    SELECT a.id, a.email, a.name, c.id as child_id, c.display_name
    FROM accounts a
    JOIN children c ON c.account_id = a.id
    WHERE a.last_login_at IS NOT NULL
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
      const subject = `${account.display_name}'s Weekly Progress — 11+ Prep`;
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
      <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">11+ Exam Prep</p>
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
