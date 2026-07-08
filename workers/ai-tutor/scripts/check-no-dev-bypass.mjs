// Pre-deploy safety guard.
//
// The dev auth bypass in index.js (verifyClerkJWT) activates ONLY when the
// env var DEV_AUTH_BYPASS === 'enabled'. That var is meant to live ONLY in the
// gitignored .dev.vars for local `wrangler dev`. It must NEVER reach a deployed
// environment, or Clerk auth would be fully bypassable in prod.
//
// This guard aborts the deploy if DEV_AUTH_BYPASS appears in any committed
// wrangler config. It cannot see out-of-repo config (e.g. a secret added by
// hand in the Cloudflare dashboard), so the code comment in index.js also
// warns against that. Run automatically via the `predeploy` npm script.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const files = ['wrangler.toml', 'wrangler.test.toml'];

let found = false;
for (const f of files) {
  let txt = '';
  try {
    txt = readFileSync(join(root, f), 'utf8');
  } catch {
    continue; // file absent is fine
  }
  if (/DEV_AUTH_BYPASS/.test(txt)) {
    console.error(`ABORT: DEV_AUTH_BYPASS found in ${f}. It must NEVER be in deployed config; it belongs only in the gitignored .dev.vars for local dev.`);
    found = true;
  }
}

if (found) process.exit(1);
console.log('dev-bypass guard: OK (DEV_AUTH_BYPASS not present in deployed config)');
