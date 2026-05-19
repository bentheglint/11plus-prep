#!/usr/bin/env node
/**
 * Smoke test — drives the app through Evie's golden path in a headless
 * browser, then verifies that the core data-integrity layer (quiz history,
 * topic performance, per-question results) persists correctly.
 *
 * A failure here blocks deploys. The app is built with REACT_APP_SMOKE_MODE=true
 * which skips Clerk auth and runs entirely off localStorage — no D1, no KV,
 * no Anthropic calls.
 *
 * Run manually: npm run smoke
 * Run full (build+smoke): npm run smoke:build
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const PORT = 4173;
const BUILD_DIR = path.join(__dirname, '..', 'build');
const BASE_URL = `http://localhost:${PORT}`;

// ── Static server ──
const MIME = {
  '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.woff': 'font/woff',
  '.ico': 'image/x-icon', '.map': 'application/json',
};

function startServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const urlPath = req.url.split('?')[0];
      let filePath = path.join(BUILD_DIR, urlPath === '/' ? 'index.html' : urlPath);
      // SPA fallback — any unknown path serves index.html
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(BUILD_DIR, 'index.html');
      }
      const ext = path.extname(filePath).toLowerCase();
      const mime = MIME[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': mime });
      fs.createReadStream(filePath).pipe(res);
    });
    server.listen(PORT, (err) => err ? reject(err) : resolve(server));
  });
}

// ── Assertions ──
class AssertionError extends Error {}
function assert(cond, msg) {
  if (!cond) throw new AssertionError(msg);
  console.log(`  ✓ ${msg}`);
}

// Viewports to test. Runs the golden path against each — catches layout or
// event-handler regressions that only reproduce at tablet/phone width.
// iPhone + iPad sizes match their 2024 device-pixel viewports.
const VIEWPORTS = [
  { name: 'Desktop', width: 1280, height: 800, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
  { name: 'iPad',    width: 820,  height: 1180, deviceScaleFactor: 2, isMobile: true,  hasTouch: true  },
  { name: 'iPhone',  width: 390,  height: 844, deviceScaleFactor: 3, isMobile: true,  hasTouch: true  },
];

// ── Golden-path test, runs once per viewport ──
async function runGoldenPath(browser, viewport) {
  console.log(`\n=== ${viewport.name} (${viewport.width}x${viewport.height}) ===`);

  const page = await browser.newPage();
  page.setDefaultTimeout(15000);
  await page.setViewport(viewport);

  // Forward console/page errors so CI logs show them
  page.on('pageerror', (err) => console.error(`  [${viewport.name} pageerror]`, err.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') console.error(`  [${viewport.name} console.error]`, msg.text());
  });

  // Seed the user before navigation so the app treats us as signed-in.
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('current-user', 'SmokeTest');
  });

  console.log('\n1. Load home screen');
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    await page.waitForFunction(
      () => document.body.innerText.includes('SmokeTest') || document.body.innerText.includes('Hey'),
      { timeout: 10000 }
    );
    assert(
      await page.evaluate(() => document.body.innerText.includes('SmokeTest')),
      'home greets SmokeTest by name'
    );
    assert(
      await page.evaluate(() => !!document.querySelector('button')),
      'home has clickable buttons'
    );

    console.log('\n2. Pick Maths subject');
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll('button')].find(b => b.innerText.includes('Maths'));
      btn.click();
    });
    await page.waitForFunction(
      () => document.body.innerText.includes('Choose how'),
      { timeout: 10000 }
    );
    assert(true, 'learningMode screen shows practice modes');

    console.log('\n3. Start Daily Learning');
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll('button')].find(b => /Daily/i.test(b.innerText));
      btn.click();
    });
    // Daily may show a pre-quiz tip first — dismiss if present
    await page.waitForFunction(() => {
      const text = document.body.innerText;
      return /Question\s+\d+\s+of\s+\d+/i.test(text) || /Got it|Let's go|Start/i.test(text);
    }, { timeout: 10000 });
    // If pre-quiz tip, click through
    const hasTip = await page.evaluate(() => !/Question\s+\d+\s+of\s+\d+/i.test(document.body.innerText));
    if (hasTip) {
      await page.evaluate(() => {
        const btn = [...document.querySelectorAll('button')].find(b => /Got it|Let's go|Start|Continue/i.test(b.innerText));
        if (btn) btn.click();
      });
      await page.waitForFunction(
        () => /Question\s+\d+\s+of\s+\d+/i.test(document.body.innerText),
        { timeout: 10000 }
      );
    }
    assert(true, 'quiz screen reached with question counter');

    console.log('\n4. Answer all 10 questions');
    for (let i = 0; i < 10; i++) {
      // Wait until progressed to question i+1 (counter shows "Question N of 10")
      await page.waitForFunction(
        (expected) => {
          const match = document.body.innerText.match(/Question\s+(\d+)\s+of\s+10/i);
          return match && parseInt(match[1], 10) === expected;
        },
        { timeout: 10000 },
        i + 1
      );

      // Select the first standard option button (A/B/C/D/E)
      await page.evaluate(() => {
        // Prefer options by letter prefix
        const optionBtns = [...document.querySelectorAll('button')]
          .filter(b => /^[A-E][\s.:)]/.test(b.innerText.trim()));
        (optionBtns[0] || [...document.querySelectorAll('button')][0]).click();
      });

      // Click Check Answer
      await page.waitForFunction(
        () => [...document.querySelectorAll('button')].some(b => /Check Answer/i.test(b.innerText)),
        { timeout: 5000 }
      );
      await page.evaluate(() => {
        const btn = [...document.querySelectorAll('button')].find(b => /Check Answer/i.test(b.innerText));
        btn.click();
      });

      // Wait for feedback (Next / See Results / Finish button appears)
      await page.waitForFunction(
        () => [...document.querySelectorAll('button')].some(b => /Next Question|See Results|Finish/i.test(b.innerText)),
        { timeout: 5000 }
      );

      // Click Next (or See Results on the last Q)
      await page.evaluate(() => {
        const btn = [...document.querySelectorAll('button')].find(b => /Next Question|See Results|Finish/i.test(b.innerText));
        btn.click();
      });
    }
    assert(true, 'answered all 10 questions');

    console.log('\n5. Score screen renders');
    await page.waitForFunction(
      () => /\d+\s*(\/|out of)\s*10|Quiz Complete|Your Score|Score/i.test(document.body.innerText),
      { timeout: 10000 }
    );
    assert(true, 'score screen shows after quiz completion');

    console.log('\n6. Data integrity — check SyncQueue writes');
    // Dual-write to legacy user:SmokeTest:* keys was removed 2026-04-23.
    // The sync queue is now the canonical offline buffer — every save enqueues
    // an operation that eventually flushes to D1. Assert against that.
    const storage = await page.evaluate(() => {
      const all = {};
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        all[k] = localStorage.getItem(k);
      }
      return all;
    });

    const parse = (k) => { try { return JSON.parse(storage[k] || 'null'); } catch { return null; } };
    const queue = parse('sync-queue:SmokeTest') || [];

    assert(
      Array.isArray(queue) && queue.length > 0,
      `sync-queue has ≥1 operation (found ${queue.length})`
    );

    const quizResultOps = queue.filter(op => op.type === 'quiz-result');
    assert(
      quizResultOps.length >= 1,
      `sync-queue has ≥1 quiz-result op (found ${quizResultOps.length})`
    );
    const latestQuiz = quizResultOps[quizResultOps.length - 1]?.payload || {};
    assert(
      typeof latestQuiz.score === 'number' && typeof latestQuiz.total === 'number',
      `latest quiz-result op has score (${latestQuiz.score}) and total (${latestQuiz.total})`
    );

    const questionResultOps = queue.filter(op => op.type === 'question-result');
    assert(
      questionResultOps.length > 0,
      `sync-queue has ≥1 question-result op (found ${questionResultOps.length}) — feeds My Mistakes`
    );
    assert(
      questionResultOps.every(op => op.payload && typeof op.payload.questionId !== 'undefined' && typeof op.payload.isCorrect !== 'undefined'),
      'every question-result op has questionId + isCorrect fields'
    );

    // Every op carries the expected child + retry metadata.
    assert(
      queue.every(op => op.childId === 'SmokeTest' && typeof op.retryCount === 'number' && typeof op.uuid === 'string'),
      'every sync-queue op has childId, retryCount, and uuid'
    );

  console.log(`\n✓ ${viewport.name} smoke passed`);
  await page.close();
}

// ── Driver ──
async function run() {
  if (!fs.existsSync(BUILD_DIR)) {
    console.error(`✗ No build found at ${BUILD_DIR}. Run \`npm run build\` first (with REACT_APP_SMOKE_MODE=true).`);
    process.exit(1);
  }

  console.log('Starting static server...');
  const server = await startServer();
  console.log(`  Serving ${BUILD_DIR} on ${BASE_URL}`);

  let browser;
  let exitCode = 0;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    for (const viewport of VIEWPORTS) {
      await runGoldenPath(browser, viewport);
    }

    console.log(`\n✓ All ${VIEWPORTS.length} viewports passed`);
  } catch (err) {
    exitCode = 1;
    if (err instanceof AssertionError) {
      console.error(`\n✗ Smoke assertion failed: ${err.message}`);
    } else {
      console.error('\n✗ Smoke test errored:', err);
    }
  } finally {
    if (browser) await browser.close();
    server.close();
  }

  process.exit(exitCode);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
