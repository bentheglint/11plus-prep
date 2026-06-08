#!/usr/bin/env node
/**
 * prebuild guard — refuse to run `npm run build` while .env.local is present.
 *
 * Create React App bakes REACT_APP_* vars into the JS bundle at build time, and
 * .env.local OVERRIDES .env in production builds too (CRA precedence). In this
 * repo .env.local points the frontend at the local wrangler worker
 * (127.0.0.1:8787) and test keys — so a build with it present ships a broken
 * bundle to prepstep.co.uk. This exact mistake took production down on
 * 8 June 2026.
 *
 * deploy.sh already moves .env.local aside before building, so it passes this
 * check. This guard catches the OTHER path: a manual `npm run build`.
 *
 * Escape hatch (rare, intentional): ALLOW_ENV_LOCAL_BUILD=1 npm run build
 */
const fs = require('fs');
const path = require('path');

const envLocal = path.join(process.cwd(), '.env.local');

if (fs.existsSync(envLocal) && process.env.ALLOW_ENV_LOCAL_BUILD !== '1') {
  console.error('\n  ✖ Build blocked: .env.local is present.\n');
  console.error('  CRA bakes .env.local into the production bundle (it overrides .env),');
  console.error('  which would ship localhost/test config to production.\n');
  console.error('  Fix one of:');
  console.error('    • Deploy with `bash deploy.sh` (it moves .env.local aside automatically), or');
  console.error('    • Temporarily: `mv .env.local .env.local.bak` → build → restore, or');
  console.error('    • Intentional override: `ALLOW_ENV_LOCAL_BUILD=1 npm run build`\n');
  process.exit(1);
}
