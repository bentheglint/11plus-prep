#!/usr/bin/env node
// Quarterly cold-restore handoff — Layer 1 long-tail bit-rot defence.
//
// Runs in GitHub Actions on the 1st of Jan/Apr/Jul/Oct. The workflow CANNOT
// decrypt (private age key never enters CI), so its job is:
//
//   1. Authorize B2, list monthly/, find the OLDEST .sql.gz.age object
//   2. Download it (just to verify B2 can still serve those bytes — the
//      "do my old backups survive" question, distinct from "are new backups
//      being made")
//   3. Send Resend notification asking Ben to do the local decrypt drill
//
// Ben then runs locally:
//   node scripts/process-gates/local-cold-restore.mjs --source=oldest-monthly
//
// That's the actual integrity check; this workflow is the prompt.
//
// Required env vars:
//   B2_KEY_ID, B2_APPLICATION_KEY  — read access to the bucket
//   RESEND_API_KEY, RESEND_TO_EMAIL — alerting

import { authorize, listFileNames, downloadFile } from './lib/b2.mjs';
import { notifyOperational, alertFailure } from './lib/resend.mjs';

const PREFIX = 'monthly/';

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

  console.log(`[quarterly-handoff] checking oldest ${PREFIX} object`);
  let oldest;
  try {
    const auth = await authorize({ keyId, applicationKey });
    const list = await listFileNames({
      apiUrl: auth.apiUrl,
      authorizationToken: auth.authorizationToken,
      bucketId: auth.bucketId,
      prefix: PREFIX,
      maxFileCount: 1000,
    });
    if (!list.files || list.files.length === 0) {
      throw new Error(
        `no objects found under ${PREFIX} — no monthly checkpoint has ever been ` +
        `produced. This may be expected if the system was set up <1 month ago, ` +
        `but log this as a P1 if it persists past 35 days from first daily-backup run.`
      );
    }
    const encryptedFiles = list.files.filter(f => f.fileName.endsWith('.sql.gz.age'));
    oldest = encryptedFiles.reduce((acc, f) => (!acc || f.uploadTimestamp < acc.uploadTimestamp ? f : acc), null);

    // Verify download works (do not decrypt)
    console.log(`[quarterly-handoff] verifying download of ${oldest.fileName}`);
    const bytes = await downloadFile({
      downloadUrl: auth.downloadUrl,
      authorizationToken: auth.authorizationToken,
      bucketName: auth.bucketName,
      fileName: oldest.fileName,
    });
    console.log(`[quarterly-handoff] download OK — ${bytes.length} bytes`);
  } catch (err) {
    await alertFailure({
      apiKey: resendKey,
      to: resendTo,
      subject: 'Quarterly cold-restore handoff: B2 ERROR',
      body:
`The quarterly cold-restore handoff workflow failed before reaching the local-drill stage.

Error: ${err.message}

What this means:
  We could not list or download from monthly/ in B2. The bytes may still be
  there but unreachable, OR the bucket / credentials may be in a bad state.

Action:
  1. Check Backblaze B2 console — is the bucket healthy? Are the credentials still valid?
  2. If credentials need rotating: issue a new Application Key, update GH secrets B2_KEY_ID and B2_APPLICATION_KEY.
  3. If the bucket is missing / corrupted: this is a P0. Treat as a recovery scenario.
  4. Re-run this workflow manually to verify after fixing.

This alert is independent of the daily backup itself, which may still be running.`,
    });
    process.exit(1);
  }

  // Notify Ben
  await notifyOperational({
    apiKey: resendKey,
    to: resendTo,
    subject: 'Quarterly cold-restore drill ready',
    body:
`Quarterly cold-restore drill is ready for you to complete.

Target object:
  Path: ${oldest.fileName}
  Uploaded: ${new Date(oldest.uploadTimestamp).toISOString()}
  Age: ${Math.round((Date.now() - oldest.uploadTimestamp) / (1000 * 60 * 60 * 24))} days

We've verified B2 can serve the bytes. What's left is the local part —
decrypt with your private key and confirm the restore is clean.

To complete the drill, run on your machine:

    node scripts/process-gates/local-cold-restore.mjs --source=oldest-monthly

Expected output: a PASS verdict and a summary artefact at
  process-gate-artefacts/last-quarterly-cold-restore-<date>.json

If the drill FAILS, this is a P0: a backup older than 90 days has corrupted
or become incompatible with current restore tooling. Investigate immediately.

The quarterly drill exists to catch long-tail bit-rot that the weekly drill
can't see (it always tests the freshest backup). This is the only check
that confirms our 1-year and 5-year backups are still recoverable.`,
  });
  console.log('[quarterly-handoff] OK — notification sent');
  process.exit(0);
}

main().catch(err => {
  console.error('[quarterly-handoff] internal error:', err.message);
  if (process.env.RESEND_API_KEY && process.env.RESEND_TO_EMAIL) {
    alertFailure({
      apiKey: process.env.RESEND_API_KEY,
      to: process.env.RESEND_TO_EMAIL,
      subject: 'Quarterly handoff workflow CRASHED',
      body: `${err.message}\n\n${err.stack}`,
    }).catch(() => {});
  }
  process.exit(1);
});
