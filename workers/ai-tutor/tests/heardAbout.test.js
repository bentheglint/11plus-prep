/**
 * accounts.heard_about — Shareable Progress Card growth-loop survey
 * (plans/shareable-progress-card.md, migration 0020).
 *
 * Covers: POST /api/account/heard-about (validation, first-write-wins,
 * column-absent soft-fail) and GET /api/admin/heard-about (admin gate,
 * tally, column-absent soft-fail).
 *
 * Deliberately does NOT rely on helpers.js's shared createSchema() adding
 * the heard_about column, so the "before migration 0020" tests below run
 * against a real pre-migration `accounts` table — the same state prod is in
 * until the migration ceremony (docs/migration-playbook.md) is actually run.
 * Migration 0020 is then applied mid-file (via the real .sql file, not a
 * hand copy — same derive-from-migration pattern as 0019 in helpers.js) so
 * the "after migration" tests exercise the real column.
 */

import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { env } from 'cloudflare:test';
import worker from '../index.js';
import migration0020 from '../migrations/0020_heard_about.sql?raw';
import {
  makeAuthToken,
  createSchema,
  cleanDb,
  seed,
  makeRequest,
} from './helpers.js';

async function applyMigration0020(db) {
  const stmts = migration0020
    .split(/;\s*\n/)
    .map(s =>
      s
        .split('\n')
        .filter(line => !line.trim().startsWith('--'))
        .join('\n')
        .trim()
    )
    .filter(Boolean);
  for (const sql of stmts) {
    await db.prepare(sql).run();
  }
}

async function getHeardAbout(db, userId) {
  const row = await db.prepare('SELECT heard_about FROM accounts WHERE id = ?').bind(userId).first();
  return row ? row.heard_about : null;
}

beforeAll(async () => {
  // Base schema only — no migration 0020 yet. Models real pre-migration prod.
  await createSchema(env.DB);
});

afterEach(async () => {
  await cleanDb(env.DB);
});

describe('POST /api/account/heard-about — before migration 0020 is applied', () => {
  it('column absent → 200 {stored:false}, never a 500', async () => {
    const userId = 'parent-premigration';
    await seed.account(env.DB, userId, 'pre@test.com');
    const token = await makeAuthToken({ userId, email: 'pre@test.com' });

    const res = await worker.fetch(
      makeRequest('POST', '/api/account/heard-about', { auth: token, body: { value: 'progress-card' } }),
      env
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.stored).toBe(false);
  });

  it('still validates the value even before the column exists', async () => {
    const userId = 'parent-premigration-invalid';
    await seed.account(env.DB, userId, 'preinv@test.com');
    const token = await makeAuthToken({ userId, email: 'preinv@test.com' });

    const res = await worker.fetch(
      makeRequest('POST', '/api/account/heard-about', { auth: token, body: { value: 'nonsense' } }),
      env
    );
    expect(res.status).toBe(400);
  });

  it('without auth → 401 (checked before the column-absent path even runs)', async () => {
    const res = await worker.fetch(
      makeRequest('POST', '/api/account/heard-about', { body: { value: 'tutor' } }),
      env
    );
    expect(res.status).toBe(401);
  });
});

describe('GET /api/account — heardAbout field, before migration 0020 is applied', () => {
  it('column absent → 200, heardAbout: null, never a 500 (highest-blast-radius endpoint in the app)', async () => {
    const userId = 'parent-bootstrap-premigration';
    await seed.account(env.DB, userId, 'bootstrap-pre@test.com');
    const token = await makeAuthToken({ userId, email: 'bootstrap-pre@test.com' });

    const res = await worker.fetch(makeRequest('GET', '/api/account', { auth: token }), env);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.heardAbout).toBeNull();
  });
});

describe('GET /api/admin/heard-about — before migration 0020 is applied', () => {
  const ADMIN_ID = 'admin-heard-about-premigration';
  const adminEnv = () => ({ ...env, ADMIN_USER_IDS: ADMIN_ID });

  it('column absent → 200 with empty counts, never a 500', async () => {
    await seed.account(env.DB, ADMIN_ID, 'admin-pre@test.com');
    const token = await makeAuthToken({ userId: ADMIN_ID, email: 'admin-pre@test.com' });

    const res = await worker.fetch(
      makeRequest('GET', '/api/admin/heard-about', { auth: token }),
      adminEnv()
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ counts: {}, total: 0 });
  });
});

describe('after migration 0020 is applied', () => {
  beforeAll(async () => {
    await applyMigration0020(env.DB);
  });

  describe('POST /api/account/heard-about', () => {
    it('missing value → 400', async () => {
      const userId = 'parent-missing-value';
      await seed.account(env.DB, userId, 'missing@test.com');
      const token = await makeAuthToken({ userId, email: 'missing@test.com' });

      const res = await worker.fetch(
        makeRequest('POST', '/api/account/heard-about', { auth: token, body: {} }),
        env
      );
      expect(res.status).toBe(400);
    });

    it('invalid value → 400, writes nothing', async () => {
      const userId = 'parent-invalid-value';
      await seed.account(env.DB, userId, 'invalid@test.com');
      const token = await makeAuthToken({ userId, email: 'invalid@test.com' });

      const res = await worker.fetch(
        makeRequest('POST', '/api/account/heard-about', { auth: token, body: { value: 'not-a-real-option' } }),
        env
      );
      expect(res.status).toBe(400);
      expect(await getHeardAbout(env.DB, userId)).toBeNull();
    });

    it.each(['progress-card', 'tutor', 'search-or-ai', 'word-of-mouth', 'other', 'dismissed'])(
      'accepts the valid value %s and persists it',
      async (value) => {
        const userId = `parent-valid-${value}`;
        await seed.account(env.DB, userId, `${value}@test.com`);
        const token = await makeAuthToken({ userId, email: `${value}@test.com` });

        const res = await worker.fetch(
          makeRequest('POST', '/api/account/heard-about', { auth: token, body: { value } }),
          env
        );
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.stored).toBe(true);
        expect(await getHeardAbout(env.DB, userId)).toBe(value);
      }
    );

    it('first-write-wins: a second POST with a different value does not overwrite', async () => {
      const userId = 'parent-second-write';
      await seed.account(env.DB, userId, 'second@test.com');
      const token = await makeAuthToken({ userId, email: 'second@test.com' });

      const first = await worker.fetch(
        makeRequest('POST', '/api/account/heard-about', { auth: token, body: { value: 'tutor' } }),
        env
      );
      expect((await first.json()).stored).toBe(true);

      const second = await worker.fetch(
        makeRequest('POST', '/api/account/heard-about', { auth: token, body: { value: 'other' } }),
        env
      );
      expect(second.status).toBe(200);
      const body2 = await second.json();
      expect(body2.stored).toBe(false);
      expect(await getHeardAbout(env.DB, userId)).toBe('tutor'); // unchanged
    });

    it('unknown account → 200 {stored:false}, no error', async () => {
      const token = await makeAuthToken({ userId: 'ghost-account', email: 'ghost@test.com' });
      const res = await worker.fetch(
        makeRequest('POST', '/api/account/heard-about', { auth: token, body: { value: 'other' } }),
        env
      );
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.stored).toBe(false);
    });

    it('without auth → 401', async () => {
      const res = await worker.fetch(
        makeRequest('POST', '/api/account/heard-about', { body: { value: 'tutor' } }),
        env
      );
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/account — heardAbout field', () => {
    it('is null before the parent has answered or dismissed', async () => {
      const userId = 'parent-bootstrap-unanswered';
      await seed.account(env.DB, userId, 'bootstrap-unanswered@test.com');
      const token = await makeAuthToken({ userId, email: 'bootstrap-unanswered@test.com' });

      const res = await worker.fetch(makeRequest('GET', '/api/account', { auth: token }), env);
      const body = await res.json();
      expect(body.heardAbout).toBeNull();
    });

    it('reflects a real answer once stored', async () => {
      const userId = 'parent-bootstrap-answered';
      await seed.account(env.DB, userId, 'bootstrap-answered@test.com');
      const token = await makeAuthToken({ userId, email: 'bootstrap-answered@test.com' });

      await worker.fetch(
        makeRequest('POST', '/api/account/heard-about', { auth: token, body: { value: 'word-of-mouth' } }),
        env
      );

      const res = await worker.fetch(makeRequest('GET', '/api/account', { auth: token }), env);
      const body = await res.json();
      expect(body.heardAbout).toBe('word-of-mouth');
    });

    it('reflects the "dismissed" sentinel — the chip never re-shows after a quiet dismiss either', async () => {
      const userId = 'parent-bootstrap-dismissed';
      await seed.account(env.DB, userId, 'bootstrap-dismissed@test.com');
      const token = await makeAuthToken({ userId, email: 'bootstrap-dismissed@test.com' });

      await worker.fetch(
        makeRequest('POST', '/api/account/heard-about', { auth: token, body: { value: 'dismissed' } }),
        env
      );

      const res = await worker.fetch(makeRequest('GET', '/api/account', { auth: token }), env);
      const body = await res.json();
      expect(body.heardAbout).toBe('dismissed');
    });
  });

  describe('GET /api/admin/heard-about', () => {
    const ADMIN_ID = 'admin-heard-about-tally';
    const adminEnv = () => ({ ...env, ADMIN_USER_IDS: ADMIN_ID });

    it('without auth → 401', async () => {
      const res = await worker.fetch(makeRequest('GET', '/api/admin/heard-about', {}), adminEnv());
      expect(res.status).toBe(401);
    });

    it('authed non-admin → 403', async () => {
      const userId = 'plain-user-heard-about';
      await seed.account(env.DB, userId, 'plain-heard-about@test.com');
      const token = await makeAuthToken({ userId, email: 'plain-heard-about@test.com' });

      const res = await worker.fetch(
        makeRequest('GET', '/api/admin/heard-about', { auth: token }),
        adminEnv()
      );
      expect(res.status).toBe(403);
    });

    it('ADMIN_USER_IDS unset (fail-closed) → 403 even for a real admin id', async () => {
      const token = await makeAuthToken({ userId: ADMIN_ID, email: 'admin-heard-about@test.com' });
      const res = await worker.fetch(
        makeRequest('GET', '/api/admin/heard-about', { auth: token }),
        env // no ADMIN_USER_IDS override
      );
      expect(res.status).toBe(403);
    });

    it('returns a count grouped by value, excluding unanswered accounts', async () => {
      await seed.account(env.DB, ADMIN_ID, 'admin-tally@test.com');
      const adminToken = await makeAuthToken({ userId: ADMIN_ID, email: 'admin-tally@test.com' });

      const respondents = [
        ['parent-tally-1', 'tutor'],
        ['parent-tally-2', 'tutor'],
        ['parent-tally-3', 'progress-card'],
      ];
      for (const [userId, value] of respondents) {
        await seed.account(env.DB, userId, `${userId}@test.com`);
        const token = await makeAuthToken({ userId, email: `${userId}@test.com` });
        await worker.fetch(
          makeRequest('POST', '/api/account/heard-about', { auth: token, body: { value } }),
          env
        );
      }
      // An account that never answers must not appear in the tally.
      await seed.account(env.DB, 'parent-tally-unanswered', 'unanswered@test.com');

      const res = await worker.fetch(
        makeRequest('GET', '/api/admin/heard-about', { auth: adminToken }),
        adminEnv()
      );
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.counts).toEqual({ tutor: 2, 'progress-card': 1 });
      expect(body.total).toBe(3);
    });
  });
});
