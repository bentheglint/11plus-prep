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
# If .env.local exists, it overrides .env — and .env.local typically
# contains localhost URLs for wrangler dev. Deploying with .env.local
# present ships a bundle that points at 127.0.0.1, breaking the live
# app. This rule has been broken 3 times. Hardening at the deploy
# script so it cannot happen a 4th.
if [ -f .env.local ]; then
  echo "BLOCKED: .env.local is present in the project root."
  echo ""
  echo "If left in place, Create React App will bake the localhost URL"
  echo "from .env.local into the production bundle, breaking the live app."
  echo ""
  echo "Rename it before deploying:"
  echo "    mv .env.local .env.local.bak && bash deploy.sh && mv .env.local.bak .env.local"
  echo ""
  echo "Or delete it permanently if you don't need the local-dev override."
  exit 1
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
wrangler pages deploy build/ --project-name 11plus-prep --branch main

echo "Done! Live at https://11plus-prep.pages.dev/"
