#!/bin/bash
# Deploy 11+ Prep App to Cloudflare Pages
# Usage: bash deploy.sh
#
# Sequence:
#   1. Unit + integration tests (358+ covering data, hooks, utils)
#   2. Smoke build (REACT_APP_SMOKE_MODE=true — skips Clerk auth)
#   3. Puppeteer smoke test through Evie's golden path +
#      localStorage integrity assertions
#   4. Production build (without smoke flag)
#   5. Wrangler deploy to Pages
#
# Any failure in steps 1-3 blocks the deploy.

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
wrangler pages deploy build/ --project-name 11plus-prep --branch main

echo "Done! Live at https://11plus-prep.pages.dev/"
