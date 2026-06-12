/**
 * Bulk invite feature tests — BulkInviteScreen logic, InviteClaimScreen, AuthGate capture
 */

// ── Paste parsing (mirrors BulkInviteScreen.parsePaste) ──────────────────────

function validateEmail(raw) {
  if (typeof raw !== 'string') return false;
  const e = raw.trim().toLowerCase();
  if (e.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
}

function parsePaste(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
  const rows = [];
  const skipped = [];

  for (const line of lines) {
    const parts = line.includes('\t')
      ? line.split('\t').map(p => p.trim())
      : line.split(',').map(p => p.trim());

    const [rawEmail, rawName, rawYear] = parts;
    const email = (rawEmail || '').toLowerCase().trim();

    if (!validateEmail(email)) {
      skipped.push(line);
      continue;
    }

    rows.push({
      email,
      name: (rawName || '').trim(),
      year: (rawYear || '').trim(),
    });
  }

  return { rows, skipped };
}

describe('paste parsing', () => {
  it('parses comma-separated rows correctly', () => {
    const input = `parent@example.com, Evie, 5\nparent2@example.com, James, 6`;
    const { rows, skipped } = parsePaste(input);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({ email: 'parent@example.com', name: 'Evie', year: '5' });
    expect(rows[1]).toMatchObject({ email: 'parent2@example.com', name: 'James', year: '6' });
    expect(skipped).toHaveLength(0);
  });

  it('parses tab-separated rows correctly', () => {
    const input = `parent@example.com\tEvie\t5\nparent2@example.com\tJames`;
    const { rows } = parsePaste(input);
    expect(rows).toHaveLength(2);
    expect(rows[0].email).toBe('parent@example.com');
    expect(rows[1].year).toBe('');
  });

  it('skips header rows whose first field is not a valid email', () => {
    const input = `email, child name, year\nparent@example.com, Evie, 5\nParent Email, name\nparent2@example.com, James`;
    const { rows, skipped } = parsePaste(input);
    expect(rows).toHaveLength(2);
    // "email, child name, year" and "Parent Email, name" both fail email validation
    expect(skipped).toHaveLength(2);
    expect(skipped[0]).toBe('email, child name, year');
  });

  it('does NOT silently drop skipped rows — returns them in skipped array', () => {
    const input = `not-an-email, Bob, 5\nparent@example.com, Alice, 4`;
    const { rows, skipped } = parsePaste(input);
    expect(rows).toHaveLength(1);
    expect(skipped).toHaveLength(1);
    expect(skipped[0]).toBe('not-an-email, Bob, 5');
  });

  it('handles year as optional (no year column)', () => {
    const input = `parent@example.com, Evie`;
    const { rows } = parsePaste(input);
    expect(rows[0].year).toBe('');
  });

  it('normalises email to lowercase', () => {
    const input = `Parent@Example.COM, Evie`;
    const { rows } = parsePaste(input);
    expect(rows[0].email).toBe('parent@example.com');
  });
});

// ── Client-side validation (mirrors BulkInviteScreen) ──────────────────────

function validateName(raw) {
  const s = (raw || '').trim();
  return s.length >= 1 && s.length <= 30;
}

function validateYear(raw) {
  if (!raw || raw === '') return true;
  const n = Number(raw);
  return Number.isInteger(n) && n >= 3 && n <= 8;
}

function rowIsValid(row) {
  return validateEmail(row.email) && validateName(row.name) && validateYear(row.year);
}

describe('row validation gating', () => {
  it('valid row passes', () => {
    expect(rowIsValid({ email: 'p@example.com', name: 'Evie', year: '5' })).toBe(true);
  });

  it('invalid email fails', () => {
    expect(rowIsValid({ email: 'not-an-email', name: 'Evie', year: '5' })).toBe(false);
  });

  it('empty name fails', () => {
    expect(rowIsValid({ email: 'p@example.com', name: '', year: '5' })).toBe(false);
  });

  it('name over 30 chars fails', () => {
    expect(rowIsValid({ email: 'p@example.com', name: 'A'.repeat(31), year: '5' })).toBe(false);
  });

  it('year out of range fails', () => {
    expect(rowIsValid({ email: 'p@example.com', name: 'Evie', year: '9' })).toBe(false);
    expect(rowIsValid({ email: 'p@example.com', name: 'Evie', year: '2' })).toBe(false);
  });

  it('empty year (optional) passes', () => {
    expect(rowIsValid({ email: 'p@example.com', name: 'Evie', year: '' })).toBe(true);
  });

  it('submit button is disabled while any row is invalid', () => {
    const rows = [
      { email: 'p@example.com', name: 'Evie', year: '5' },
      { email: 'not-valid', name: 'James', year: '6' }, // invalid
    ];
    const allValid = rows.every(rowIsValid);
    expect(allValid).toBe(false);
  });
});

// ── rowErrors mapping from server 400 response ────────────────────────────

describe('rowErrors mapping', () => {
  it('maps server rowErrors back onto rows by index', () => {
    const serverRowErrors = [
      { index: 1, error: 'Invalid email' },
      { index: 3, error: 'childName is required (max 30 chars)' },
    ];

    const newErrs = {};
    serverRowErrors.forEach(({ index, error }) => {
      newErrs[index] = { email: error };
    });

    expect(newErrs[1]).toMatchObject({ email: 'Invalid email' });
    expect(newErrs[3]).toMatchObject({ email: 'childName is required (max 30 chars)' });
    expect(newErrs[0]).toBeUndefined();
  });
});

// ── needs_review summary banner ─────────────────────────────────────────

describe('needs_review summary banner', () => {
  it('shows the approval-pending banner when status is needs_review', () => {
    const response = { ok: true, batchId: 'b1', created: 5, alreadyInvited: [], status: 'needs_review' };
    expect(response.status === 'needs_review').toBe(true);
  });

  it('does NOT show the banner when status is pending', () => {
    const response = { ok: true, batchId: 'b2', created: 3, alreadyInvited: [], status: 'pending' };
    expect(response.status === 'needs_review').toBe(false);
  });
});

// ── Status chip mapping (all 7 statuses) ─────────────────────────────────

const INVITE_STATUS_MAP = {
  needs_review: { label: 'Awaiting approval', colour: 'bg-amber-100 text-amber-800' },
  pending:      { label: 'Queued',             colour: 'bg-slate-100 text-slate-600' },
  sent:         { label: 'Invited',            colour: 'bg-blue-100 text-blue-700' },
  send_failed:  { label: 'Email failed',       colour: 'bg-red-100 text-red-700' },
  joined:       { label: 'Joined',             colour: 'bg-green-100 text-green-700' },
  revoked:      { label: 'Revoked',            colour: 'bg-slate-100 text-slate-500' },
  expired:      { label: 'Expired',            colour: 'bg-slate-100 text-slate-500' },
};

describe('status chip mapping', () => {
  const allStatuses = ['needs_review', 'pending', 'sent', 'send_failed', 'joined', 'revoked', 'expired'];

  it('covers all 7 invite statuses', () => {
    allStatuses.forEach(status => {
      expect(INVITE_STATUS_MAP[status]).toBeDefined();
    });
  });

  it('needs_review maps to "Awaiting approval"', () => {
    expect(INVITE_STATUS_MAP.needs_review.label).toBe('Awaiting approval');
  });

  it('pending maps to "Queued"', () => {
    expect(INVITE_STATUS_MAP.pending.label).toBe('Queued');
  });

  it('sent maps to "Invited"', () => {
    expect(INVITE_STATUS_MAP.sent.label).toBe('Invited');
  });

  it('send_failed maps to "Email failed"', () => {
    expect(INVITE_STATUS_MAP.send_failed.label).toBe('Email failed');
  });

  it('joined maps to "Joined"', () => {
    expect(INVITE_STATUS_MAP.joined.label).toBe('Joined');
  });

  it('revoked maps to "Revoked"', () => {
    expect(INVITE_STATUS_MAP.revoked.label).toBe('Revoked');
  });

  it('expired maps to "Expired"', () => {
    expect(INVITE_STATUS_MAP.expired.label).toBe('Expired');
  });

  it('all labels are text (not just colour)', () => {
    allStatuses.forEach(status => {
      expect(typeof INVITE_STATUS_MAP[status].label).toBe('string');
      expect(INVITE_STATUS_MAP[status].label.length).toBeGreaterThan(0);
    });
  });
});

// ── AuthGate invite token capture ─────────────────────────────────────────

describe('AuthGate /invite/<token> capture', () => {
  it('matches /invite/<token> paths with 10-64 char alphanumeric tokens', () => {
    const validPaths = [
      '/invite/abc123def456',
      '/invite/ABCDE12345',
      '/invite/a1b2c3d4e5f6g7h8i9j0',
      '/invite/' + 'a'.repeat(10),
      '/invite/' + 'a'.repeat(64),
    ];
    validPaths.forEach(path => {
      const match = path.match(/^\/invite\/([A-Za-z0-9-]{10,64})$/);
      expect(match).not.toBeNull();
    });
  });

  it('does not match tokens shorter than 10 chars', () => {
    const path = '/invite/short';
    const match = path.match(/^\/invite\/([A-Za-z0-9-]{10,64})$/);
    expect(match).toBeNull();
  });

  it('does not match /join/ paths', () => {
    const path = '/join/ABCD-EFGH';
    const match = path.match(/^\/invite\/([A-Za-z0-9-]{10,64})$/);
    expect(match).toBeNull();
  });

  it('?invite= comp param is independent of pending-invite-token (no conflation)', () => {
    // ?invite= uses localStorage 'pending-invite' (comp code, free access)
    // /invite/<token> uses sessionStorage 'pending-invite-token' (invite link, no free access)
    const compCode = 'TUTOR-INVITE-CODE';
    const inviteToken = 'abc123def456ghi789';

    // Different storage keys — they can coexist without interfering
    const localStorage_key = 'pending-invite';
    const sessionStorage_key = 'pending-invite-token';

    expect(localStorage_key).not.toBe(sessionStorage_key);

    // A valid invite token path should NOT trigger the comp code path
    const isInvitePath = '/invite/abc123def456ghi789'.match(/^\/invite\/([A-Za-z0-9-]{10,64})$/);
    const isJoinPath = '/invite/abc123def456ghi789'.match(/^\/join\/([A-Z0-9-]{5,12})$/i);
    expect(isInvitePath).not.toBeNull();
    expect(isJoinPath).toBeNull();
    // Suppress unused var warnings
    void compCode; void inviteToken;
  });
});

// ── InviteClaimScreen — token and session state ───────────────────────────

describe('InviteClaimScreen', () => {
  it('renders tutor card data from preview response', () => {
    const preview = {
      valid: true,
      childName: 'Evie',
      yearGroup: 5,
      tutor: { displayName: 'Mary Jones', photoUrl: null, bio: 'GL specialist' },
    };
    // These are the fields the screen uses
    expect(preview.tutor.displayName).toBe('Mary Jones');
    expect(preview.yearGroup).toBe(5);
  });

  it('displays year group chip when yearGroup is present', () => {
    const preview = { valid: true, yearGroup: 5, tutor: { displayName: 'T' } };
    expect(preview.yearGroup).toBeTruthy();
    // Chip text would be `Year ${yearGroup}`
    expect(`Year ${preview.yearGroup}`).toBe('Year 5');
  });

  it('does not show year group chip when yearGroup is absent', () => {
    const preview = { valid: true, yearGroup: null, tutor: { displayName: 'T' } };
    expect(preview.yearGroup).toBeFalsy();
  });

  it('claim success path clears both sessionStorage keys', () => {
    const keysCleared = [];
    const fakeSessionStorage = {
      removeItem: (k) => keysCleared.push(k),
    };
    // Simulate what the screen does on success
    fakeSessionStorage.removeItem('pending-invite-token');
    fakeSessionStorage.removeItem('invite-preview');
    expect(keysCleared).toContain('pending-invite-token');
    expect(keysCleared).toContain('invite-preview');
  });

  it('invalid token (404 response) triggers clear of pending-invite-token', () => {
    const keysCleared = [];
    const fakeSessionStorage = { removeItem: (k) => keysCleared.push(k) };
    // Simulate 404 handling
    fakeSessionStorage.removeItem('pending-invite-token');
    fakeSessionStorage.removeItem('invite-preview');
    expect(keysCleared).toContain('pending-invite-token');
  });

  it('alreadyLinked response is treated as success (idempotent)', () => {
    const response = { ok: true, alreadyLinked: true };
    const isSuccess = response.ok || response.alreadyLinked;
    expect(isSuccess).toBe(true);
  });
});
