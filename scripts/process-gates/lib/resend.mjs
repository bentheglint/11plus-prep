// Resend email helper — sends failure alerts and operational notifications
// from the daily-backup workflow and friends.
//
// Uses the default `onboarding@resend.dev` sender domain (no DNS setup
// required) until we add a custom sending domain for launch. Resend's free
// tier allows sending to your own verified email from this default domain.
//
// API: simple HTTPS POST to https://api.resend.com/emails. No SDK.

const RESEND_API_BASE = 'https://api.resend.com';
const DEFAULT_FROM = 'Backup Alerts <onboarding@resend.dev>';

export async function sendEmail({
  apiKey,
  to,
  subject,
  text,
  from = DEFAULT_FROM,
}) {
  if (!apiKey) throw new Error('RESEND_API_KEY is not set');
  if (!to) throw new Error('RESEND_TO_EMAIL is not set');
  const res = await fetch(`${RESEND_API_BASE}/emails`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, subject, text }),
  });
  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Resend send failed (${res.status}): ${errBody}`);
  }
  return await res.json();
}

// Convenience: a failure alert with a consistent subject prefix so it's
// recognisable in the inbox.
export async function alertFailure({ apiKey, to, subject, body }) {
  return await sendEmail({
    apiKey,
    to,
    subject: `[11+ backup ALERT] ${subject}`,
    text: body,
  });
}

// Convenience: an operational notification (e.g. quarterly drill ready).
export async function notifyOperational({ apiKey, to, subject, body }) {
  return await sendEmail({
    apiKey,
    to,
    subject: `[11+ backup] ${subject}`,
    text: body,
  });
}
