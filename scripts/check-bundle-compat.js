#!/usr/bin/env node
/**
 * post-build bundle compatibility guard — catches parse-time SYNTAX that
 * Safari 15.6 (iOS 15.6, iPads) cannot parse.
 *
 * SCOPE LIMIT: this guard catches constructs the Safari 15.6 JS engine rejects
 * at parse time — the class of failure that caused the blank-iPad incident on
 * 9 June 2026 (a regex lookbehind in main.js killed the entire bundle before
 * any code ran). It does NOT catch missing runtime APIs: a library calling a
 * method that iOS 15.6 lacks will still break at call time, silently.
 *
 * Rules checked (in scan order):
 *   parse-floor      — acorn parse at ES2022; anything newer (or corrupt) fails
 *   static-block     — StaticBlock nodes (class static {}); Safari 16.4+
 *   private-in       — `#x in obj` syntax;                  Safari 16.4+
 *   regex-lookbehind — (?<=…) or (?<!…) in regex literal or new RegExp(str)
 *                      This exact construct caused the 9 June 2026 incident.
 *   regex-flag       — /…/d or /…/v flag;                   Safari 17.4+ / ES2024
 *   dev-url          — localhost / 127.0.0.1 / 0.0.0.0 literals in bundle
 *                      (second line of defence behind the .env.local prebuild
 *                      guard; calibrated 12 Jun 2026: zero hits in the known-
 *                      good production build)
 *
 * Module API (for tests):
 *   exports.scanSource(source, filename) → Finding[]
 *   Finding: { rule, file, index, message, snippet }
 *
 * CLI: node scripts/check-bundle-compat.js
 *   Scans build/static/js/*.js (not .map, not .LICENSE.txt).
 *   Exit 0 — all clean. Exit 1 — one or more findings.
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ── Dependency guard: require acorn-walk v8 explicitly ──────────────────────
// acorn-walk 7.x predates ES2022 node types and silently skips StaticBlock —
// the exact failure mode this guard exists to prevent. A guard that runs but
// never matches is the worst possible outcome, so we fail loudly here if the
// resolved version is not ^8.
const acorn     = require('acorn');
const walkPkg   = require(path.join(
  path.dirname(require.resolve('acorn-walk')),
  '../package.json'
));
const walkMajor = parseInt(walkPkg.version.split('.')[0], 10);
if (walkMajor < 8) {
  console.error(
    `\n  ✖ check-bundle-compat: acorn-walk v${walkPkg.version} is installed, ` +
    `but v8+ is required.\n` +
    `  v7 silently skips StaticBlock nodes — the guard would pass corrupt bundles.\n` +
    `  Run: npm install --save-dev acorn-walk@^8\n`
  );
  process.exit(1);
}
const walk = require('acorn-walk');

// ── VLQ decoder (sourcemap attribution) ─────────────────────────────────────
// Minimal implementation — no new dependency. Decodes a single VLQ-encoded
// segment field (5 fields per segment: genCol, srcIdx, origLine, origCol, namesIdx).
// Returns null on any error (attribution is best-effort; never crashes the guard).

const VLQ_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const VLQ_MAP   = Object.fromEntries([...VLQ_CHARS].map((c, i) => [c, i]));

function vlqDecode(str) {
  // Returns array of signed integers decoded from a VLQ string.
  const result = [];
  let i = 0;
  while (i < str.length) {
    let shift = 0, value = 0;
    let cont;
    do {
      if (i >= str.length) return null;
      const digit = VLQ_MAP[str[i++]];
      if (digit === undefined) return null;
      cont  = (digit & 0x20) !== 0;
      value |= (digit & 0x1f) << shift;
      shift += 5;
    } while (cont);
    result.push((value & 1) ? -(value >> 1) : (value >> 1));
  }
  return result;
}

function sourcemapLookup(mapPath, byteIndex) {
  // Given a sourcemap file path and a byte offset in the generated file,
  // return the best-guess original source path, or null.
  try {
    const raw = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
    const { sources, mappings } = raw;
    if (!sources || !mappings) return null;

    // CRA produces single-line minified output, so all mappings are on
    // generated line 0. Walk through every segment to find the one whose
    // generated column is at or just before byteIndex.
    const groups = mappings.split(';');
    const lineSegs = groups[0] ? groups[0].split(',') : [];

    let genCol = 0, srcIdx = 0, origLine = 0, origCol = 0;
    let bestSrc = null, bestDist = Infinity;

    for (const seg of lineSegs) {
      if (!seg) continue;
      const fields = vlqDecode(seg);
      if (!fields) continue;

      if (fields.length >= 1) genCol    += fields[0];
      if (fields.length >= 2) srcIdx    += fields[1];
      if (fields.length >= 3) origLine  += fields[2];
      if (fields.length >= 4) origCol   += fields[3];

      if (fields.length < 2) continue; // no source mapping for this segment

      const dist = byteIndex - genCol;
      if (dist >= 0 && dist < bestDist) {
        bestDist = dist;
        bestSrc  = sources[srcIdx] || null;
      }
    }

    return bestSrc;
  } catch (_) {
    return null;
  }
}

// ── Snippet helper ───────────────────────────────────────────────────────────

function snippet(source, index, radius) {
  // Extract ±radius chars around index, replacing newlines for readability.
  const r   = radius || 150;
  const lo  = Math.max(0, index - r);
  const hi  = Math.min(source.length, index + r);
  return source.slice(lo, hi).replace(/\r?\n/g, '↵');
}

// ── Core scanner ─────────────────────────────────────────────────────────────

/**
 * Scan a single source string for compatibility findings.
 *
 * @param  {string} source   — raw JS source text
 * @param  {string} filename — display name for findings (file path or label)
 * @returns {Array<{rule, file, index, message, snippet}>}
 */
function scanSource(source, filename) {
  const findings = [];
  const file = filename || '<source>';

  function addFinding(rule, index, message) {
    findings.push({
      rule,
      file,
      index,
      message,
      snippet: snippet(source, index),
    });
  }

  // ── Rule 1: parse-floor ──────────────────────────────────────────────────
  // Parse with acorn at ES2022 (script mode — CRA webpack output is script).
  // Anything newer than ES2022, or corrupt output, throws here.
  let ast;
  try {
    ast = acorn.parse(source, {
      ecmaVersion: 2022,
      sourceType: 'script',
      locations: false,
      ranges:    false,
    });
  } catch (err) {
    addFinding(
      'parse-floor',
      err.pos || 0,
      `Parse error (ES2022 floor): ${err.message}`
    );
    // Cannot walk a failed parse — skip AST rules but still run dev-url scan.
    ast = null;
  }

  // ── Rules 2a–2e: AST walk ────────────────────────────────────────────────
  if (ast) {
    const LOOKBEHIND_RE = /\(\?<[=!]/;

    walk.full(ast, (node) => {
      // 2a. static-block — Safari 16.4+
      if (node.type === 'StaticBlock') {
        addFinding(
          'static-block',
          node.start,
          'Static class block (class static { … }) — requires Safari 16.4+'
        );
      }

      // 2b. private-in — `#x in obj` — Safari 16.4+
      if (
        node.type === 'BinaryExpression' &&
        node.operator === 'in' &&
        node.left &&
        node.left.type === 'PrivateIdentifier'
      ) {
        addFinding(
          'private-in',
          node.start,
          '`#x in obj` ergonomic brand check — requires Safari 16.4+'
        );
      }

      // 2c. regex-lookbehind via regex literal — Safari 16.4+
      // (9 June 2026: this exact construct blanked the child's iPad)
      if (
        node.type === 'Literal' &&
        node.regex &&
        LOOKBEHIND_RE.test(node.regex.pattern)
      ) {
        addFinding(
          'regex-lookbehind',
          node.start,
          `Regex lookbehind /${node.regex.pattern}/ — requires Safari 16.4+`
        );
      }

      // 2d. regex-flag 'd' or 'v' — Safari 17.4+ / ES2024
      if (
        node.type === 'Literal' &&
        node.regex &&
        /[dv]/.test(node.regex.flags)
      ) {
        addFinding(
          'regex-flag',
          node.start,
          `Regex flag '${node.regex.flags.match(/[dv]/g).join("', '")}' — requires Safari 17.4+`
        );
      }

      // 2e. regex-lookbehind via new RegExp(str) or RegExp(str) — heuristic
      if (
        (node.type === 'NewExpression' || node.type === 'CallExpression') &&
        node.callee &&
        node.callee.type === 'Identifier' &&
        node.callee.name === 'RegExp' &&
        node.arguments &&
        node.arguments.length >= 1 &&
        node.arguments[0].type === 'Literal' &&
        typeof node.arguments[0].value === 'string' &&
        LOOKBEHIND_RE.test(node.arguments[0].value)
      ) {
        addFinding(
          'regex-lookbehind',
          node.start,
          `Regex lookbehind in RegExp("${node.arguments[0].value}") — requires Safari 16.4+`
        );
      }
    });
  }

  // ── Rule 3: dev-url ──────────────────────────────────────────────────────
  // Catch localhost/127.0.0.1/0.0.0.0 in the final bundle.
  // Calibrated 12 Jun 2026: zero hits in the known-good production build.
  const DEV_URL_RE = /\blocalhost\b|127\.0\.0\.1|\b0\.0\.0\.0\b/g;
  let m;
  while ((m = DEV_URL_RE.exec(source)) !== null) {
    addFinding(
      'dev-url',
      m.index,
      `Dev URL in bundle: "${m[0]}" — likely a baked-in .env.local value`
    );
  }

  return findings;
}

// ── CLI runner ───────────────────────────────────────────────────────────────

function run() {
  const buildDir  = path.join(process.cwd(), 'build', 'static', 'js');
  let   files;

  try {
    files = fs.readdirSync(buildDir)
      .filter(f => f.endsWith('.js') && !f.endsWith('.LICENSE.txt'))
      .map(f => path.join(buildDir, f));
  } catch (err) {
    console.error(`\n  ✖ Cannot read ${buildDir}: ${err.message}`);
    console.error('  Run `npm run build` first.\n');
    process.exit(1);
  }

  if (files.length === 0) {
    console.error(`\n  ✖ No .js files found in ${buildDir}. Run \`npm run build\` first.\n`);
    process.exit(1);
  }

  let totalFindings = 0;

  for (const filePath of files) {
    const source = fs.readFileSync(filePath, 'utf8');
    const found  = scanSource(source, filePath);

    if (found.length === 0) {
      console.log(`  ✔ PASS  ${path.basename(filePath)}`);
    } else {
      totalFindings += found.length;
      for (const f of found) {
        console.error(`\n  ✖ ${f.rule.toUpperCase()}  ${path.basename(f.file)}  (offset ${f.index})`);
        console.error(`    ${f.message}`);

        // Best-effort sourcemap attribution
        const mapPath = filePath + '.map';
        if (fs.existsSync(mapPath)) {
          const orig = sourcemapLookup(mapPath, f.index);
          if (orig) {
            console.error(`    ↳ Source: ${orig}`);
          }
        }

        // Snippet (±150 chars of minified context)
        console.error(`    Snippet: …${f.snippet}…`);
      }
    }
  }

  if (totalFindings === 0) {
    console.log(
      `\n  ✔ Bundle compat check passed — ${files.length} file(s) scanned, no findings.\n`
    );
    process.exit(0);
  } else {
    console.error(
      `\n  ✖ Bundle compat check FAILED — ${totalFindings} finding(s) across ${files.length} file(s).\n`
    );
    process.exit(1);
  }
}

// ── Exports ──────────────────────────────────────────────────────────────────

exports.scanSource = scanSource;
exports.run        = run;

// ── Entry point ──────────────────────────────────────────────────────────────

if (require.main === module) {
  run();
}
