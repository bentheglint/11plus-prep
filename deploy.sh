#!/bin/bash
# Deploy 11+ Prep App to Cloudflare Pages
# Usage: bash deploy.sh

echo "Running tests..."
npx react-scripts test --watchAll=false 2>&1
if [ $? -ne 0 ]; then
  echo "Tests failed. Fix failing tests before deploying."
  exit 1
fi
echo "Tests passed."

echo "Building app..."
npm run build

if [ $? -ne 0 ]; then
  echo "Build failed. Fix errors before deploying."
  exit 1
fi

echo "Deploying to Cloudflare Pages..."
wrangler pages deploy build/ --project-name 11plus-prep --branch main

echo "Done! Live at https://11plus-prep.pages.dev/"
