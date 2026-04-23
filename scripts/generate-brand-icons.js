#!/usr/bin/env node
/**
 * generate-brand-icons.js
 *
 * Generates PNG brand icons from SVG source using Puppeteer.
 * Run: node scripts/generate-brand-icons.js
 *
 * Produces:
 *   public/logo192.png (PWA install icon, manifest)
 *   public/logo512.png (PWA install icon, manifest + social preview)
 *   public/apple-touch-icon.png (180x180, iOS home screen)
 *
 * Uses the Puppeteer that's already in devDependencies for smoke tests.
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SVG_PATH = path.join(ROOT, 'public', 'favicon.svg');
const OUTPUTS = [
  { name: 'logo192.png', size: 192 },
  { name: 'logo512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 }
];

(async () => {
  const svg = fs.readFileSync(SVG_PATH, 'utf8');
  // Embed the SVG in a minimal HTML page sized exactly to the target dimensions.
  // Nunito is loaded from Google Fonts so the typography renders correctly.
  const makeHtml = (size) => `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@800&display=swap" rel="stylesheet">
<style>
  html, body { margin: 0; padding: 0; width: ${size}px; height: ${size}px; overflow: hidden; background: transparent; }
  body { display: flex; align-items: center; justify-content: center; }
  svg { width: ${size}px; height: ${size}px; display: block; }
</style>
</head>
<body>
${svg}
</body>
</html>`;

  const browser = await puppeteer.launch({ headless: 'new' });

  for (const { name, size } of OUTPUTS) {
    const page = await browser.newPage();
    await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
    await page.setContent(makeHtml(size), { waitUntil: 'networkidle0' });
    // Wait a moment for font to finish rendering
    await new Promise(r => setTimeout(r, 800));
    const outPath = path.join(ROOT, 'public', name);
    await page.screenshot({
      path: outPath,
      omitBackground: false,
      type: 'png',
      clip: { x: 0, y: 0, width: size, height: size }
    });
    console.log(`✓ ${name} (${size}x${size}) → ${outPath}`);
    await page.close();
  }

  await browser.close();
  console.log('\nDone. Remember to also regenerate favicon.ico if needed (favicon.svg covers modern browsers).');
})();
