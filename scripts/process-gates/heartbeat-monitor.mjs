#!/usr/bin/env node
// Heartbeat monitor — Layer 1 silent-failure defence.
//
// Runs every 6 hours. Lists the B2 daily/ prefix, finds the freshest
// object, and alerts via Resend if its age exceeds the threshold.
//
// Catches "the daily-backup workflow stopped firing" — the failure mode
// where there's nothing to alert ON because the cron itself didn't run.
// (GitLab 2017's pg_dump silently failed for an unknown duration; their
// failure-emails were DMARC-dropped. This is the architectural defence
// against an exact replay.)
//
// Required env vars (subset of daily-backup):
//   B2_KEY_ID, B2_APPLICATION_KEY, RESEND_API_KEY, RESEND_TO_EMAIL

import { authorize, listFileNames } from './lib/b2.mjs';
import { alertFailure } from './lib/resend.mjs';

const STALE_HOURS = 36; // Alert if newest daily/ object is older than this
const PREFIX = 'daily/';

function envOrThrow(name) {
  const v = process.env[name];
  if (!v) throw new Error(`required env var ${name} is not set`);
  return v;
}

async function main() {
  const keyId = envOrThrow('B2_KEY_ID');
  const applicationKey = envOrThrow('B2_APPLICATION_KEY');
  const resendKey = envOrThrow('RESEND_API_KEY');
  const resendTo = envOrThrow('RESEND_TO_EMAIL');

  console.log(`[heartbeat] checking freshest object under ${PREFIX}...`);

  let freshest;
  try {
    const auth = await authorize({ keyId, applicationKey });
    const list = await listFileNames({
      apiUrl: auth.apiUrl,
      authorizationToken: auth.authorizationToken,
      bucketId: auth.bucketId,
      prefix: PREFIX,
      maxFileCount: 1000, // small bucket; one page is plenty
    });

    if (!list.files || list.files.length === 0) {
      throw new Error(`no objects found under ${PREFIX} — the daily workflow has never produced a backup, or all backups have been deleted`);
    }

    // Find max uploadTimestamp (B2 returns ms since epoch).
    freshest = list.files.reduce((acc, f) => (f.uploadTimestamp > (acc?.uploadTimestamp ?? 0) ? f : acc), null);
  } catch (err) {
    // Listing itself failed. Alert and exit non-zero.
    await alertFailure({
      apiKey: resendKey,
      to: resendTo,
      subject: 'Heartbeat monitor cannot reach B2',
      body:
`Heartbeat monitor failed to list the B2 daily/ prefix at ${new Date().toISOString()}.

Error:
  ${err.message}

This means we can't currently verify whether daily backups are running.
Investigate immediately:
  1. Is the B2 bucket reachable at all?
  2. Is B2_KEY_ID + B2_APPLICATION_KEY still valid (key may have been rotated)?
  3. Are there any active Backblaze service incidents?

The daily-backup workflow may itself be working — this alert is about the
monitor's ability to verify, not about backups failing.`,
    });
    console.error('[heartbeat] B2 listing failed; alert sent.');
    process.exit(1);
  }

  const ageHours = (Date.now() - freshest.uploadTimestamp) / (1000 * 60 * 60);
  console.log(`[heartbeat] freshest: ${freshest.fileName} (uploaded ${ageHours.toFixed(1)}h ago)`);

  if (ageHours > STALE_HOURS) {
    await alertFailure({
      apiKey: resendKey,
      to: resendTo,
      subject: `Daily backup is STALE (${ageHours.toFixed(1)}h since last upload)`,
      body:
`The daily backup workflow appears to have stopped running.

Freshest object under ${PREFIX}:
  ${freshest.fileName}
  uploaded: ${new Date(freshest.uploadTimestamp).toISOString()}
  age: ${ageHours.toFixed(1)}h (threshold: ${STALE_HOURS}h)

What this means:
  - At least one daily backup window has passed without producing an artefact.
  - GitHub Actions may have had a global outage, the cron may have been
    accidentally disabled, the workflow file may have been edited and
    broken, or the wrangler/B2 credentials may have rotated.

Action:
  1. Check https://github.com/bentheglint/11plus-prep/actions/workflows/daily-backup.yml
  2. Look at the most recent run — did it fail, or simply not exist?
  3. If credentials need rotating, follow plans/data-resilience-layer-1-plan.md
     §"Recovery runbook" or use the B2 / Resend dashboards to issue new keys
     and update GitHub secrets.
  4. Manually trigger the daily-backup workflow once to verify the fix
     before relying on the cron again.`,
    });
    console.error(`[heartbeat] STALE — alert sent (${ageHours.toFixed(1)}h > ${STALE_HOURS}h)`);
    process.exit(2);
  }

  console.log(`[heartbeat] OK — freshest backup is ${ageHours.toFixed(1)}h old (threshold: ${STALE_HOURS}h)`);
  process.exit(0);
}

main().catch(err => {
  // Swallow-all path: an uncaught error in the script itself. Best-effort
  // alert (without dependency on the env vars being set, since envOrThrow
  // could have been the failure).
  console.error('[heartbeat] internal error:', err.message);
  if (process.env.RESEND_API_KEY && process.env.RESEND_TO_EMAIL) {
    alertFailure({
      apiKey: process.env.RESEND_API_KEY,
      to: process.env.RESEND_TO_EMAIL,
      subject: 'Heartbeat monitor crashed',
      body: `The heartbeat monitor itself crashed at ${new Date().toISOString()}.\n\nError: ${err.message}\n\n${err.stack}`,
    }).catch(() => {});
  }
  process.exit(1);
});
