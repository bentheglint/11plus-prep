#!/usr/bin/env node
/**
 * generate-favicon-ico.js
 *
 * Generates public/favicon.ico from favicon.svg at multiple sizes (16, 32, 48).
 * Replaces the old Create-React-App default favicon.ico.
 *
 * Uses Puppeteer (already in devDeps) to render SVG → PNG at each size,
 * then png-to-ico to package them into a multi-resolution .ico file.
 *
 * Run: node scripts/generate-favicon-ico.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SVG_PATH = path.join(ROOT, 'public', 'favicon.svg');
const ICO_OUT = path.join(ROOT, 'public', 'favicon.ico');
const TEMP_DIR = path.join(ROOT, 'scripts', '.favicon-temp');
const SIZES = [16, 32, 48];

(async () => {
  // png-to-ico is an ES module; dynamic import keeps this script CommonJS
  const pngToIco = (await import('png-to-ico')).default;
  const svg = fs.readFileSync(SVG_PATH, 'utf8');
  if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

  const browser = await puppeteer.launch({ headless: 'new' });
  const tempFiles = [];

  for (const size of SIZES) {
    const page = await browser.newPage();
    await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
    const html = `<!DOCTYPE html><html><head><style>
      html, body { margin: 0; padding: 0; width: ${size}px; height: ${size}px; overflow: hidden; }
      svg { width: ${size}px; height: ${size}px; display: block; }
    </style></head><body>${svg}</body></html>`;
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const tempPng = path.join(TEMP_DIR, `favicon-${size}.png`);
    await page.screenshot({
      path: tempPng,
      type: 'png',
      clip: { x: 0, y: 0, width: size, height: size }
    });
    tempFiles.push(tempPng);
    await page.close();
    console.log(`  rendered ${size}x${size}`);
  }

  await browser.close();

  // Pack all sizes into a single multi-resolution .ico
  const icoBuffer = await pngToIco(tempFiles);
  fs.writeFileSync(ICO_OUT, icoBuffer);
  console.log(`✓ ${ICO_OUT} (multi-size: ${SIZES.join(', ')})`);

  // Clean temp
  for (const f of tempFiles) fs.unlinkSync(f);
  fs.rmdirSync(TEMP_DIR);
  console.log('  (cleaned temp files)');
})();
