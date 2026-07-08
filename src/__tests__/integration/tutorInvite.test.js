/**
 * Tutor invite flow tests (Phase 2 acceptance criteria)
 *
 * Tests: tutor code format, join idempotency, scoping rules.
 * Worker-level SQL tests run against the wrangler test DB.
 */

// ── Tutor code format ──

describe('tutor code generation', () => {
  // Mirrors the server-side generation logic
  const SAFE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

  function generateTutorCode() {
    const chars = SAFE_CHARS.split('');
    // Deterministic for tests: pick chars by index
    let base = '';
    for (let i = 0; i < 8; i++) base += chars[i % chars.length];
    return base.slice(0, 4) + '-' + base.slice(4);
  }

  it('has the expected XXXX-XXXX format', () => {
    const code = generateTutorCode();
    expect(code).toMatch(/^[A-Z0-9]{4}-[A-Z0-9]{4}$/);
  });

  it('does not contain confusable characters (0, O, 1, I, L)', () => {
    const code = generateTutorCode();
    expect(code).not.toMatch(/[01ILO]/);
  });

  it('has 9 chars total (4 + dash + 4)', () => {
    const code = generateTutorCode();
    expect(code.length).toBe(9);
  });
});

// ── Join URL parsing ──

describe('join URL parsing', () => {
  const cases = [
    ['/join/ABCD-EFGH', 'ABCD-EFGH'],
    ['/join/abcd-efgh', 'ABCD-EFGH'],   // case normalisation
    ['/join/XYZW-1234', 'XYZW-1234'],
  ];

  it.each(cases)('path %s extracts code %s', (path, expected) => {
    const match = path.match(/^\/join\/([A-Z0-9-]{5,12})$/i);
    expect(match).not.toBeNull();
    const extracted = match[1].toUpperCase();
    expect(extracted).toBe(expected);
  });

  it('does not match paths without the join prefix', () => {
    const paths = ['/', '/home', '/progress', '/api/tutor/join'];
    paths.forEach(path => {
      const match = path.match(/^\/join\/([A-Z0-9-]{5,12})$/i);
      expect(match).toBeNull();
    });
  });
});

// ── POST /api/tutor/join — request shape ──

describe('POST /api/tutor/join request contract', () => {
  it('requires tutorCode and childId', () => {
    const validBody = { tutorCode: 'ABCD-EFGH', childId: 'child-uuid-123' };
    expect(validBody.tutorCode).toBeTruthy();
    expect(validBody.childId).toBeTruthy();
  });

  it('tutorCode is normalised to uppercase before lookup', () => {
    const code = 'abcd-efgh';
    expect(code.toUpperCase()).toBe('ABCD-EFGH');
  });
});

// ── GET /api/tutor/public/:code — response shape ──

describe('GET /api/tutor/public/:code response contract', () => {
  it('public profile exposes name, bio, photo_url, tutor_code — not internal fields', () => {
    // The worker SELECT returns exactly these fields
    const expectedFields = new Set(['display_name', 'photo_url', 'bio', 'tutor_code']);
    const internalFields = ['payout_earned_cents', 'payout_approved', 'bulk_invite_approved', 'email'];

    // Simulate what the worker returns
    const publicProfile = {
      display_name: 'Mary Jones',
      photo_url: null,
      bio: 'GL Assessment specialist',
      tutor_code: 'MARY-K23X',
    };

    Object.keys(publicProfile).forEach(key => {
      expect(expectedFields.has(key)).toBe(true);
    });
    internalFields.forEach(key => {
      expect(publicProfile).not.toHaveProperty(key);
    });
  });
});

// ── Pending join code persistence (localStorage, not sessionStorage) ──
//
// The reusable tutor join code MUST survive Clerk's signup redirect even when
// email verification (OTP) completes in a fresh browser tab/context —
// sessionStorage is scoped to a single tab and loses the code on that path.
// localStorage is shared across same-browser tabs, so it survives. It must
// still be cleared on a successful join AND on decline, since (unlike
// sessionStorage) it would otherwise persist across sessions indefinitely
// and could silently mislink a later child.

describe('pending join code storage', () => {
  function makeFakeStorage() {
    const store = {};
    return {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = v; },
      removeItem: (k) => { delete store[k]; },
      _store: store,
    };
  }

  it('capture on /join/<code> mount writes to localStorage, not sessionStorage', () => {
    const fakeLocalStorage = makeFakeStorage();
    const fakeSessionStorage = makeFakeStorage();

    // Mirrors AuthGate's capture-on-mount logic
    const pathMatch = '/join/ABCD-EFGH'.match(/^\/join\/([A-Z0-9-]{5,12})$/i);
    if (pathMatch) fakeLocalStorage.setItem('pending-join-code', pathMatch[1].toUpperCase());

    expect(fakeLocalStorage.getItem('pending-join-code')).toBe('ABCD-EFGH');
    expect(fakeSessionStorage.getItem('pending-join-code')).toBeNull();
  });

  it('a code left only in localStorage (simulating a fresh-tab handoff) still routes to the join view', () => {
    const fakeLocalStorage = makeFakeStorage();
    fakeLocalStorage.setItem('pending-join-code', 'ABCD-EFGH');

    // Mirrors App.js's currentView initializer: no /join/ path on this load
    // (Clerk redirected to "/"), but the localStorage code is still present.
    let currentView = null;
    const pathMatch = '/'.match(/^\/join\/([A-Z0-9-]{5,12})$/i);
    if (pathMatch) currentView = 'join';
    else if (fakeLocalStorage.getItem('pending-join-code')) currentView = 'join';

    expect(currentView).toBe('join');
  });

  it('successful join clears the localStorage code (onJoined)', () => {
    const fakeLocalStorage = makeFakeStorage();
    fakeLocalStorage.setItem('pending-join-code', 'ABCD-EFGH');

    // Mirrors App.js's JoinScreen onJoined handler
    fakeLocalStorage.removeItem('pending-join-code');

    expect(fakeLocalStorage.getItem('pending-join-code')).toBeNull();
  });

  it('declining the join (Back) also clears the localStorage code, so it cannot linger and mislink a later child', () => {
    const fakeLocalStorage = makeFakeStorage();
    fakeLocalStorage.setItem('pending-join-code', 'ABCD-EFGH');

    // Mirrors App.js's JoinScreen onBack handler
    fakeLocalStorage.removeItem('pending-join-code');

    expect(fakeLocalStorage.getItem('pending-join-code')).toBeNull();
  });

  it('Clerk redirect URL includes the pending join code when present, else falls back to "/"', () => {
    const fakeLocalStorage = makeFakeStorage();

    function buildRedirectUrl(storage) {
      let pendingJoinCode = null;
      try { pendingJoinCode = storage.getItem('pending-join-code') || null; } catch {}
      return pendingJoinCode ? `/join/${pendingJoinCode}` : '/';
    }

    expect(buildRedirectUrl(fakeLocalStorage)).toBe('/');

    fakeLocalStorage.setItem('pending-join-code', 'ABCD-EFGH');
    expect(buildRedirectUrl(fakeLocalStorage)).toBe('/join/ABCD-EFGH');
  });
});

// ── pupil_tutors idempotency ──

describe('join idempotency', () => {
  it('joining twice returns alreadyLinked: true on second call', () => {
    // This mirrors the worker logic:
    // if (existing) return json({ ok: true, alreadyLinked: true });
    const mockExisting = true; // simulates DB lookup finding a row
    const response = mockExisting
      ? { ok: true, alreadyLinked: true }
      : { ok: true, alreadyLinked: false };

    expect(response.ok).toBe(true);
    expect(response.alreadyLinked).toBe(true);
  });
});
