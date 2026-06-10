import { TEST_KID, TEST_PRIVATE_JWK } from './test-keys.js';

export const CLERK_DOMAIN = 'test.clerk.11plus.dev';

// Import the fixed test signing key once at module load.
// The corresponding public key is served by the jwks-mock outbound service.
export const testPrivateKey = await crypto.subtle.importKey(
  'jwk',
  TEST_PRIVATE_JWK,
  { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
  false,
  ['sign']
);

function bufToBase64Url(buf) {
  const bytes = new Uint8Array(buf);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function objToBase64Url(obj) {
  return btoa(JSON.stringify(obj))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export async function makeAuthToken({ userId, email = 'test@test.com', emailVerified = true }) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT', kid: TEST_KID };
  const payload = {
    sub: userId,
    email,
    email_verified: emailVerified,
    iss: `https://${CLERK_DOMAIN}`,
    iat: now,
    exp: now + 3600,
  };
  const headerB64 = objToBase64Url(header);
  const payloadB64 = objToBase64Url(payload);
  const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', testPrivateKey, data);
  return `${headerB64}.${payloadB64}.${bufToBase64Url(sig)}`;
}

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  consent_given_at TEXT NOT NULL,
  consent_version TEXT NOT NULL,
  last_login_at TEXT,
  stripe_customer_id TEXT,
  subscription_status TEXT,
  subscription_current_period_end INTEGER,
  is_comped INTEGER NOT NULL DEFAULT 0,
  comp_source TEXT,
  email_opt_in INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS children (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  year_group INTEGER,
  target_school TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS tutors (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  photo_url TEXT,
  bio TEXT,
  tutor_code TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  payout_earned_cents INTEGER NOT NULL DEFAULT 0,
  payout_approved INTEGER NOT NULL DEFAULT 0,
  bulk_invite_approved INTEGER NOT NULL DEFAULT 0,
  terms_version TEXT,
  terms_agreed_at TEXT
);

CREATE TABLE IF NOT EXISTS pupil_tutors (
  child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  tutor_id TEXT NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  joined_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (child_id, tutor_id)
);

CREATE TABLE IF NOT EXISTS assignments (
  id TEXT PRIMARY KEY,
  tutor_id TEXT NOT NULL,
  target_class_id TEXT,
  target_child_id TEXT,
  title TEXT,
  due_date TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS assignment_items (
  id TEXT PRIMARY KEY,
  assignment_id TEXT NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL,
  item_ref TEXT NOT NULL,
  subject TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS assignment_recipients (
  id TEXT PRIMARY KEY,
  assignment_id TEXT NOT NULL,
  assignment_item_id TEXT NOT NULL,
  child_id TEXT NOT NULL,
  tutor_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'assigned',
  assigned_at TEXT NOT NULL DEFAULT (datetime('now')),
  started_at TEXT,
  completed_at TEXT,
  score INTEGER,
  question_results TEXT,
  cleared_at TEXT
);

CREATE TABLE IF NOT EXISTS admin_audit (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  admin_id TEXT NOT NULL,
  action TEXT NOT NULL,
  target TEXT,
  detail TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS tutor_allowlist (
  email TEXT PRIMARY KEY,
  note TEXT,
  added_by TEXT NOT NULL,
  added_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS classes (
  id TEXT PRIMARY KEY,
  tutor_id TEXT NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  schedule_note TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS class_enrolments (
  class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  enrolled_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (class_id, child_id)
);

CREATE TABLE IF NOT EXISTS tutor_notes (
  id TEXT PRIMARY KEY,
  tutor_id TEXT NOT NULL,
  child_id TEXT NOT NULL,
  note TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  tutor_id TEXT NOT NULL,
  child_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (tutor_id, child_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  read_at TEXT
);
`;

export async function createSchema(db) {
  // D1 exec() splits on newlines in Miniflare; use batch() with individual statements.
  const stmts = SCHEMA_SQL
    .split(/;\s*\n/)
    .map(s => s.trim())
    .filter(Boolean);
  await db.batch(stmts.map(sql => db.prepare(sql)));
}

export async function cleanDb(db) {
  await db.batch([
    db.prepare('DELETE FROM messages'),
    db.prepare('DELETE FROM conversations'),
    db.prepare('DELETE FROM tutor_notes'),
    db.prepare('DELETE FROM class_enrolments'),
    db.prepare('DELETE FROM classes'),
    db.prepare('DELETE FROM assignment_recipients'),
    db.prepare('DELETE FROM assignment_items'),
    db.prepare('DELETE FROM assignments'),
    db.prepare('DELETE FROM pupil_tutors'),
    db.prepare('DELETE FROM tutors'),
    db.prepare('DELETE FROM children'),
    db.prepare('DELETE FROM accounts'),
    db.prepare('DELETE FROM admin_audit'),
    db.prepare('DELETE FROM tutor_allowlist'),
  ]);
}

export const seed = {
  async account(db, userId, email = 'test@test.com') {
    await db
      .prepare(
        `INSERT INTO accounts (id, email, name, consent_given_at, consent_version, email_opt_in)
         VALUES (?, ?, 'Test User', datetime('now'), '1.0', 1)`
      )
      .bind(userId, email)
      .run();
  },

  async child(db, childId, accountId) {
    await db
      .prepare(
        `INSERT INTO children (id, account_id, display_name)
         VALUES (?, ?, 'Test Child')`
      )
      .bind(childId, accountId)
      .run();
  },

  async tutor(db, userId, email = 'tutor@test.com') {
    await db
      .prepare(
        `INSERT INTO tutors (id, email, display_name, tutor_code)
         VALUES (?, ?, 'Test Tutor', 'TEST-CODE')`
      )
      .bind(userId, email)
      .run();
  },

  async pupilTutor(db, childId, tutorId) {
    await db
      .prepare(
        `INSERT OR IGNORE INTO pupil_tutors (child_id, tutor_id)
         VALUES (?, ?)`
      )
      .bind(childId, tutorId)
      .run();
  },

  async class_(db, classId, tutorId, name = 'Test Class') {
    await db
      .prepare(
        `INSERT INTO classes (id, tutor_id, name)
         VALUES (?, ?, ?)`
      )
      .bind(classId, tutorId, name)
      .run();
  },

  async recipient(db, { id, assignmentId, itemId, childId, tutorId, status = 'assigned' }) {
    await db
      .prepare(
        `INSERT INTO assignment_recipients
           (id, assignment_id, assignment_item_id, child_id, tutor_id, status, assigned_at)
         VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`
      )
      .bind(id, assignmentId, itemId, childId, tutorId, status)
      .run();
  },
};

export function makeRequest(method, path, { auth, body } = {}) {
  const headers = new Headers({ 'content-type': 'application/json' });
  if (auth) headers.set('Authorization', `Bearer ${auth}`);
  return new Request(`https://worker.test${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}
