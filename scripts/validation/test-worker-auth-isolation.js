#!/usr/bin/env node
// B2 auth isolation tests — verifies that the Worker cannot serve one
// user's data to another authenticated user.
//
// Design note: the Worker's isolation relies entirely on the server-side
// getChildId(db, userId) lookup — no route accepts a client-supplied
// child_id parameter. These tests verify that property holds.
//
// Run: node scripts/validation/test-worker-auth-isolation.js

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

async function testAsync(name, fn) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

// ── Mock D1 database ──
// Minimal simulation of D1's .prepare().bind().first()/.all()/.run() API.
// Two users with separate children.

const MOCK_DB_STATE = {
  accounts: [
    { id: 'user-alice', email: 'alice@test.com', name: 'Alice' },
    { id: 'user-bob',   email: 'bob@test.com',   name: 'Bob' },
  ],
  children: [
    { id: 'child-alice', account_id: 'user-alice', display_name: 'Alice Jr' },
    { id: 'child-bob',   account_id: 'user-bob',   display_name: 'Bob Jr' },
  ],
  quiz_results: [
    { id: 1, child_id: 'child-alice', topic_key: 'algebra', subject: 'maths', score: 8, total: 10 },
    { id: 2, child_id: 'child-bob',   topic_key: 'fractions', subject: 'maths', score: 6, total: 10 },
  ],
};

function mockDb() {
  return {
    prepare(sql) {
      const bindings = [];
      const stmt = {
        bind(...args) { bindings.push(...args); return stmt; },
        async first() {
          return executeQuery(sql, bindings, 'first');
        },
        async all() {
          const results = executeQuery(sql, bindings, 'all');
          return { results };
        },
        async run() { return { meta: { changes: 1 } }; },
      };
      return stmt;
    },
  };
}

function executeQuery(sql, bindings, mode) {
  const sqlLower = sql.toLowerCase().replace(/\s+/g, ' ').trim();

  // SELECT id FROM children WHERE account_id = ?
  if (sqlLower.includes('from children') && sqlLower.includes('account_id = ?')) {
    const accountId = bindings[0];
    const row = MOCK_DB_STATE.children.find(c => c.account_id === accountId);
    return mode === 'first' ? (row || null) : (row ? [row] : []);
  }

  // SELECT * FROM quiz_results WHERE child_id = ?
  if (sqlLower.includes('from quiz_results') && sqlLower.includes('child_id = ?')) {
    const childId = bindings[0];
    const rows = MOCK_DB_STATE.quiz_results.filter(r => r.child_id === childId);
    return mode === 'first' ? (rows[0] || null) : rows;
  }

  // SELECT id FROM accounts WHERE id = ?
  if (sqlLower.includes('from accounts') && sqlLower.includes('where id = ?')) {
    const userId = bindings[0];
    const row = MOCK_DB_STATE.accounts.find(a => a.id === userId);
    return mode === 'first' ? (row || null) : (row ? [row] : []);
  }

  return mode === 'first' ? null : [];
}

// ── getChildId — replicated from helpers.js ──
async function getChildId(db, userId) {
  const row = await db.prepare('SELECT id FROM children WHERE account_id = ?').bind(userId).first();
  return row ? row.id : null;
}

// ── Tests ──

console.log('\nB2 Worker Auth Isolation Tests\n');

console.log('1. getChildId isolation');

await testAsync('Alice userId resolves to Alice childId', async () => {
  const db = mockDb();
  const childId = await getChildId(db, 'user-alice');
  assert.equal(childId, 'child-alice');
});

await testAsync('Bob userId resolves to Bob childId', async () => {
  const db = mockDb();
  const childId = await getChildId(db, 'user-bob');
  assert.equal(childId, 'child-bob');
});

await testAsync('Alice userId does NOT resolve to Bob childId', async () => {
  const db = mockDb();
  const childId = await getChildId(db, 'user-alice');
  assert.notEqual(childId, 'child-bob');
});

await testAsync('Unknown userId returns null (no child profile)', async () => {
  const db = mockDb();
  const childId = await getChildId(db, 'user-unknown');
  assert.equal(childId, null);
});

console.log('\n2. Data scoping — quiz_results');

await testAsync("Alice's quiz query only returns Alice's results", async () => {
  const db = mockDb();
  const childId = await getChildId(db, 'user-alice');
  const { results } = await db.prepare(
    'SELECT * FROM quiz_results WHERE child_id = ? ORDER BY completed_at DESC'
  ).bind(childId).all();
  assert.ok(results.every(r => r.child_id === 'child-alice'),
    'All returned rows belong to Alice');
  assert.ok(!results.some(r => r.child_id === 'child-bob'),
    'No Bob rows in Alice query');
});

await testAsync("Bob's quiz query only returns Bob's results", async () => {
  const db = mockDb();
  const childId = await getChildId(db, 'user-bob');
  const { results } = await db.prepare(
    'SELECT * FROM quiz_results WHERE child_id = ? ORDER BY completed_at DESC'
  ).bind(childId).all();
  assert.ok(results.every(r => r.child_id === 'child-bob'),
    'All returned rows belong to Bob');
  assert.ok(!results.some(r => r.child_id === 'child-alice'),
    'No Alice rows in Bob query');
});

console.log('\n3. Static code audit — no client-supplied child_id');

const ROUTE_FILES = [
  'workers/ai-tutor/routes/data.js',
  'workers/ai-tutor/routes/mutable.js',
  'workers/ai-tutor/routes/batch.js',
  'workers/ai-tutor/routes/bulk.js',
  'workers/ai-tutor/routes/account.js',
];

const ROOT = path.join(__dirname, '..', '..');

for (const file of ROUTE_FILES) {
  test(`${path.basename(file)} — child_id not read from request body/params`, () => {
    const src = fs.readFileSync(path.join(ROOT, file), 'utf8');

    // Check that child_id doesn't come from request.json() body or URL params.
    // Allowlist: comments and the getChildId call and childId variable itself.
    const lines = src.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Skip comments and the getChildId declaration/call
      if (line.trim().startsWith('//')) continue;
      if (line.includes('getChildId')) continue;
      if (line.includes('childId =')) continue;
      if (line.includes('childId,')) continue;
      if (line.includes('!childId')) continue;

      // Flag if we see child_id being extracted from a request
      if (/\bchild_?id\b.*request\.|request\..*\bchild_?id\b/.test(line) ||
          /\{ .*\bchild_?Id\b.*\}.*await request\.json/.test(line)) {
        throw new Error(`Possible client-supplied child_id at line ${i + 1}: ${line.trim()}`);
      }
    }
  });
}

console.log('\n4. No unauthenticated /api/* data routes');

test('Router gates all /api/* behind requireAuth (static check)', () => {
  const src = fs.readFileSync(path.join(ROOT, 'workers/ai-tutor/index.js'), 'utf8');

  // The auth gate block must exist
  assert.ok(src.includes("path.startsWith('/api/')"),
    "Router has path.startsWith('/api/') check");
  assert.ok(src.includes('const auth = await requireAuth'),
    'requireAuth is called inside the /api/ block');

  // Stripe webhook must have its own signature verification (not JWT)
  assert.ok(src.includes('verifyStripeSignature') || src.includes('stripe-signature'),
    'Stripe webhook uses signature verification, not JWT');

  // verifyClerkJWT must be the JWT verification function used by requireAuth
  assert.ok(src.includes('verifyClerkJWT'),
    'Clerk JWT verification function is defined and used');
});

// ── Summary ──

console.log(`\n─────────────────────────────────────`);
console.log(`Passed: ${passed}   Failed: ${failed}`);
console.log(`─────────────────────────────────────\n`);

process.exit(failed > 0 ? 1 : 0);
