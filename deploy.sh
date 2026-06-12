#!/bin/bash
# Deploy 11+ Prep App to Cloudflare Pages
# Usage: bash deploy.sh
#
# Sequence:
#   0a. Git freshness guard — fetch origin; abort if local is behind master
#       (8 June 2026: a stale deploy silently reverted 6 laptop commits in prod)
#   0b. Pre-flight: refuse to deploy if .env.local is present
#   1.  Unit + integration tests (358+ covering data, hooks, utils)
#   2.  Smoke build (REACT_APP_SMOKE_MODE=true — skips Clerk auth)
#   3.  Puppeteer smoke test through Evie's golden path +
#       localStorage integrity assertions
#   4.  Production build (without smoke flag)
#   5.  Bundle compat check — same bytes that will be uploaded, no rewrites in between
#   6.  Wrangler deploy to Pages
#
# Any failure in steps 0a-3 blocks the deploy.
#
# Escape hatches (use sparingly):
#   SKIP_FRESHNESS_CHECK=1   — skip the git-freshness block entirely (no staleness
#                              protection at all; use only when git is unavailable)
#   ALLOW_OFFLINE_DEPLOY=1   — if `git fetch` fails, continue using last-known
#                              origin/master state for the behind-check

# ── Step 0a: Git freshness guard ────────────────────────────────────────────
# A stale deploy silently reverted 6 commits on 8 June 2026. This guard
# fetches origin so `git rev-list HEAD..origin/master` is accurate.
if [ "${SKIP_FRESHNESS_CHECK}" = "1" ]; then
  echo "WARNING: SKIP_FRESHNESS_CHECK=1 — deploying BLIND. No staleness protection at all."
else
  echo "Checking git freshness (fetching origin)..."
  git fetch origin --quiet
  FETCH_EXIT=$?
  if [ $FETCH_EXIT -ne 0 ]; then
    if [ "${ALLOW_OFFLINE_DEPLOY}" = "1" ]; then
      echo "WARNING: git fetch failed — origin is unreachable."
      echo "  ALLOW_OFFLINE_DEPLOY=1 is set; continuing with last-known origin/master state."
    else
      echo ""
      echo "  ✖ Cannot fetch from origin — unable to verify freshness."
      echo "    (8 June 2026: a stale deploy silently reverted 6 laptop commits in prod.)"
      echo ""
      echo "    Options:"
      echo "      • Fix network access and retry, or"
      echo "      • ALLOW_OFFLINE_DEPLOY=1 bash deploy.sh  — continue with last-known-state checking, or"
      echo "      • SKIP_FRESHNESS_CHECK=1 bash deploy.sh  — skip all freshness protection (last resort)"
      exit 1
    fi
  fi

  # Fail-closed: if rev-list itself errors (e.g. origin/master ref missing),
  # we cannot prove freshness, so abort rather than assume 0-behind.
  COUNT=$(git rev-list --count HEAD..origin/master 2>/dev/null)
  if [ $? -ne 0 ] || [ -z "$COUNT" ]; then
    echo "  ✖ Could not compare HEAD with origin/master — unable to verify freshness."
    echo "    SKIP_FRESHNESS_CHECK=1 bash deploy.sh to override (last resort)."
    exit 1
  fi
  if [ "$COUNT" -gt 0 ]; then
    echo ""
    echo "  ✖ Local is ${COUNT} commit(s) behind origin/master — pull/rebase first, then redeploy."
    echo ""
    git log --oneline HEAD..origin/master
    echo ""
    exit 1
  fi
  echo "Git freshness check passed (0 commits behind origin/master)."
fi

# ── Step 0b: .env.local guard ───────────────────────────────────────────────
# CRA bakes REACT_APP_* env vars into the JS bundle at build time.
# If .env.local exists, it overrides .env — localhost URLs would be
# baked into the production bundle. Auto-rename it for the build and
# restore it on exit regardless of outcome (success, failure, or Ctrl+C).
if [ -f .env.local ]; then
  mv .env.local .env.local.bak
  trap 'mv .env.local.bak .env.local 2>/dev/null' EXIT
  echo "(.env.local renamed for build — will be restored on exit)"
fi

echo "Running frontend tests..."
npx react-scripts test --watchAll=false 2>&1
if [ $? -ne 0 ]; then
  echo "Frontend tests failed. Fix failing tests before deploying."
  exit 1
fi
echo "Frontend tests passed."

echo "Running Worker tests..."
(cd workers/ai-tutor && npm test)
if [ $? -ne 0 ]; then
  echo "Worker tests failed. Fix failing tests before deploying."
  exit 1
fi
echo "Worker tests passed."

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

# ── Step 5: Bundle compat check ─────────────────────────────────────────────
# postbuild already ran check-bundle-compat.js as part of `npm run build`
# above. This explicit step re-asserts it here to guarantee that the bytes
# being scanned are the exact bytes about to be uploaded — nothing can rewrite
# build/ between this line and the wrangler deploy below.
echo "Running bundle compat check..."
node scripts/check-bundle-compat.js || exit 1
echo "Bundle compat check passed."

echo "Deploying to Cloudflare Pages..."
# npx: works whether wrangler is installed globally or only as a local dependency
npx wrangler pages deploy build/ --project-name 11plus-prep --branch main
if [ $? -ne 0 ]; then
  echo "DEPLOY FAILED — site NOT updated."
  exit 1
fi

echo "Done! Live at https://11plus-prep.pages.dev/"
