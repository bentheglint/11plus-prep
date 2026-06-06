#!/bin/bash
# Deploy 11+ Prep App to Cloudflare Pages
# Usage: bash deploy.sh
#
# Sequence:
#   0. Pre-flight: refuse to deploy if .env.local is present
#   1. Unit + integration tests (358+ covering data, hooks, utils)
#   2. Smoke build (REACT_APP_SMOKE_MODE=true — skips Clerk auth)
#   3. Puppeteer smoke test through Evie's golden path +
#      localStorage integrity assertions
#   4. Production build (without smoke flag)
#   5. Wrangler deploy to Pages
#
# Any failure in steps 0-3 blocks the deploy.

# ── Step 0: .env.local guard ──
# CRA bakes REACT_APP_* env vars into the JS bundle at build time.
# If .env.local exists, it overrides .env — localhost URLs would be
# baked into the production bundle. Auto-rename it for the build and
# restore it on exit regardless of outcome (success, failure, or Ctrl+C).
if [ -f .env.local ]; then
  mv .env.local .env.local.bak
  trap 'mv .env.local.bak .env.local 2>/dev/null' EXIT
  echo "(.env.local renamed for build — will be restored on exit)"
fi

echo "Running tests..."
npx react-scripts test --watchAll=false 2>&1
if [ $? -ne 0 ]; then
  echo "Tests failed. Fix failing tests before deploying."
  exit 1
fi
echo "Tests passed."

echo "Building smoke bundle..."
REACT_APP_SMOKE_MODE=true npx react-scripts build
if [ $? -ne 0 ]; then
  echo "Smoke build failed."
  exit 1
fi

echo "Running smoke test..."
node scripts/smoke.js
if [ $? -ne 0 ]; then
  echo "Smoke test failed. Fix before deploying."
  exit 1
fi
echo "Smoke passed."

echo "Building production app..."
npm run build
if [ $? -ne 0 ]; then
  echo "Build failed. Fix errors before deploying."
  exit 1
fi

echo "Deploying to Cloudflare Pages..."
# npx: works whether wrangler is installed globally or only as a local dependency
npx wrangler pages deploy build/ --project-name 11plus-prep --branch main
if [ $? -ne 0 ]; then
  echo "DEPLOY FAILED — site NOT updated."
  exit 1
fi

echo "Done! Live at https://11plus-prep.pages.dev/"
