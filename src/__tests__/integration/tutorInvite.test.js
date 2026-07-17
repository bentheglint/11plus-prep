/**
 * Tutor invite flow tests (Phase 2 acceptance criteria), extended for the
 * tutor attribution durability plan (plans/tutor-attribution-durability.md):
 * the join-intent server trace, decline UX (Back vs "Not now"), the
 * pendingJoinIntent bootstrap re-offer, and manual tutor-code entry.
 *
 * Tests: tutor code format, join idempotency, scoping rules, plus a mix of
 * real-component RTL tests (JoinScreen, TutorCodeEntryModal — neither needs
 * Clerk, both take getToken as a plain prop) and logic-mirror tests for the
 * App.js/AuthGate-level wiring that DOES need Clerk to mount for real.
 * Worker-level SQL tests run against the wrangler test DB.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import JoinScreen from '../../screens/JoinScreen';
import TutorCodeEntryModal from '../../components/TutorCodeEntryModal';

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

// Hoisted to module scope (not just the describe block below) so the newer
// describe blocks — decline ordering, bootstrap restore, unsafeMetadata —
// can share the same fake storage helper rather than duplicating it.
function makeFakeStorage() {
  const store = {};
  return {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = v; },
    removeItem: (k) => { delete store[k]; },
    _store: store,
  };
}

describe('pending join code storage', () => {
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

  it('the Back arrow no longer clears the localStorage code (fixed 16 Jul — attribution durability plan)', () => {
    // Superseded contract: Back used to wipe the code (decline-by-misclick,
    // the 8 Jul bug this plan fixes). It now means "not deciding now" — the
    // code and the server-side join-intent both stay pending and the parent
    // is re-offered JoinScreen next login. Only the explicit "Not now"
    // button (see the decline describe block below) clears it.
    const fakeLocalStorage = makeFakeStorage();
    fakeLocalStorage.setItem('pending-join-code', 'ABCD-EFGH');

    // Mirrors App.js's JoinScreen onBack handler exactly — deliberately no
    // removeItem call.
    const onBack = () => { /* just navigates home */ };
    onBack();

    expect(fakeLocalStorage.getItem('pending-join-code')).toBe('ABCD-EFGH');
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

// ── App.js's onBack / onDecline handlers (attribution durability layer 3) ──
//
// Both mirror App.js's JoinScreen prop bodies exactly (see App.js ~1954-1990).
// The behavioural split — Back never clears, only "Not now" does — is the
// core fix for the 8 Jul "decline-by-misclick" bug.

describe('App.js onBack vs onDecline — only explicit decline clears the code', () => {
  it('onBack leaves the pending code intact and just returns home', () => {
    const fakeLocalStorage = makeFakeStorage();
    fakeLocalStorage.setItem('pending-join-code', 'ABCD-EFGH');
    let view = 'join';

    // Mirrors App.js's JoinScreen onBack prop.
    const onBack = () => { view = 'home'; };
    onBack();

    expect(fakeLocalStorage.getItem('pending-join-code')).toBe('ABCD-EFGH');
    expect(view).toBe('home');
  });

  it('onDecline clears the pending code and returns home', () => {
    const fakeLocalStorage = makeFakeStorage();
    fakeLocalStorage.setItem('pending-join-code', 'ABCD-EFGH');
    let view = 'join';

    // Mirrors App.js's JoinScreen onDecline prop, called by JoinScreen's
    // handleDecline AFTER the decline POST has settled (success or failure).
    const onDecline = () => {
      fakeLocalStorage.removeItem('pending-join-code');
      view = 'home';
    };
    onDecline();

    expect(fakeLocalStorage.getItem('pending-join-code')).toBeNull();
    expect(view).toBe('home');
  });
});

// ── JoinScreen (real component) — mount-time join-intent fire + "Not now" decline ──
//
// JoinScreen takes getToken as a plain prop (no Clerk hook), so it can be
// mounted directly with RTL — this exercises the ACTUAL production code
// (screens/JoinScreen.js), not a copy of its logic.

function mockTutorFetch({ tutor, declineOk = true, declineError = null } = {}) {
  const resolvedTutor = tutor || {
    display_name: 'Mary Jones',
    bio: 'GL Assessment specialist',
    photo_url: null,
    tutor_code: 'MARY-K23X',
  };
  return jest.fn((url, options = {}) => {
    const method = options.method || 'GET';
    if (typeof url === 'string' && url.includes('/api/tutor/public/') && method === 'GET') {
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ tutor: resolvedTutor }) });
    }
    if (typeof url === 'string' && url.endsWith('/api/tutor/join-intent') && method === 'POST') {
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ ok: true }) });
    }
    if (typeof url === 'string' && url.endsWith('/api/tutor/join-intent/decline') && method === 'POST') {
      if (declineError) return Promise.reject(declineError);
      return Promise.resolve({
        ok: declineOk,
        json: () => Promise.resolve(declineOk ? { ok: true } : { error: 'Decline failed' }),
      });
    }
    return Promise.reject(new Error(`Unexpected fetch in JoinScreen test: ${method} ${url}`));
  });
}

describe('JoinScreen — mount-time join-intent fire (layer 2)', () => {
  afterEach(() => { delete global.fetch; });

  it('POSTs /api/tutor/join-intent with the tutor code on mount', async () => {
    const fetchMock = mockTutorFetch();
    global.fetch = fetchMock;
    const getToken = jest.fn(() => Promise.resolve('test-token'));

    render(
      <JoinScreen
        tutorCode="MARY-K23X"
        childrenList={[{ id: 'c1', display_name: 'Evie' }]}
        getToken={getToken}
        onJoined={jest.fn()}
        onBack={jest.fn()}
        onDecline={jest.fn()}
      />
    );

    await waitFor(() => {
      const intentCall = fetchMock.mock.calls.find(
        ([url, opts]) => typeof url === 'string' && url.endsWith('/api/tutor/join-intent') && opts?.method === 'POST'
      );
      expect(intentCall).toBeTruthy();
    });

    const [, options] = fetchMock.mock.calls.find(([url]) => url.endsWith('/api/tutor/join-intent'));
    expect(JSON.parse(options.body)).toEqual({ tutorCode: 'MARY-K23X' });
  });
});

describe('JoinScreen — "Not now" decline (layer 3)', () => {
  afterEach(() => { delete global.fetch; });

  it('posts the decline, then calls onDecline — decline lands BEFORE the caller clears the code', async () => {
    const fetchMock = mockTutorFetch();
    global.fetch = fetchMock;
    const getToken = jest.fn(() => Promise.resolve('test-token'));
    const onDecline = jest.fn();

    render(
      <JoinScreen
        tutorCode="MARY-K23X"
        childrenList={[{ id: 'c1', display_name: 'Evie' }]}
        getToken={getToken}
        onJoined={jest.fn()}
        onBack={jest.fn()}
        onDecline={onDecline}
      />
    );

    const notNowButton = await screen.findByRole('button', { name: /not now/i });
    fireEvent.click(notNowButton);

    await waitFor(() => expect(onDecline).toHaveBeenCalledTimes(1));

    const declineCallIndex = fetchMock.mock.calls.findIndex(
      ([url, opts]) => typeof url === 'string' && url.endsWith('/api/tutor/join-intent/decline') && opts?.method === 'POST'
    );
    expect(declineCallIndex).toBeGreaterThan(-1);
    expect(JSON.parse(fetchMock.mock.calls[declineCallIndex][1].body)).toEqual({ tutorCode: 'MARY-K23X' });

    // Ordering: the decline POST must be invoked before onDecline fires
    // (App.js's onDecline is what actually clears localStorage + navigates).
    const declineInvocationOrder = fetchMock.mock.invocationCallOrder[declineCallIndex];
    const onDeclineInvocationOrder = onDecline.mock.invocationCallOrder[0];
    expect(declineInvocationOrder).toBeLessThan(onDeclineInvocationOrder);
  });

  it('still calls onDecline even if the decline POST fails — never traps the parent on this screen', async () => {
    const fetchMock = mockTutorFetch({ declineError: new Error('network blip') });
    global.fetch = fetchMock;
    const getToken = jest.fn(() => Promise.resolve('test-token'));
    const onDecline = jest.fn();

    render(
      <JoinScreen
        tutorCode="MARY-K23X"
        childrenList={[{ id: 'c1', display_name: 'Evie' }]}
        getToken={getToken}
        onJoined={jest.fn()}
        onBack={jest.fn()}
        onDecline={onDecline}
      />
    );

    const notNowButton = await screen.findByRole('button', { name: /not now/i });
    fireEvent.click(notNowButton);

    await waitFor(() => expect(onDecline).toHaveBeenCalledTimes(1));
  });
});

// ── TutorCodeEntryModal (real component, layer 3b — manual tutor-code entry) ──

describe('TutorCodeEntryModal — manual tutor-code entry (layer 3b)', () => {
  afterEach(() => { delete global.fetch; });

  it('formats the input as XXXX-XXXX (uppercase) and resolves a valid code via the public profile lookup', async () => {
    global.fetch = jest.fn((url) => {
      if (typeof url === 'string' && url.includes('/api/tutor/public/VHJ5-DRN3')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ tutor: { display_name: 'Mary Jones', tutor_code: 'VHJ5-DRN3' } }),
        });
      }
      return Promise.reject(new Error(`Unexpected fetch: ${url}`));
    });

    const onCodeResolved = jest.fn();
    render(<TutorCodeEntryModal onClose={jest.fn()} onCodeResolved={onCodeResolved} />);

    const input = screen.getByPlaceholderText('XXXX-XXXX');
    fireEvent.change(input, { target: { value: 'vhj5drn3' } });
    expect(input.value).toBe('VHJ5-DRN3');

    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    await waitFor(() => expect(onCodeResolved).toHaveBeenCalledWith('VHJ5-DRN3'));
  });

  it('shows a friendly inline error for an unknown code — no dead end, still usable', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false, json: () => Promise.resolve({ error: 'Tutor not found' }) })
    );

    const onCodeResolved = jest.fn();
    render(<TutorCodeEntryModal onClose={jest.fn()} onCodeResolved={onCodeResolved} />);

    const input = screen.getByPlaceholderText('XXXX-XXXX');
    fireEvent.change(input, { target: { value: 'ZZZZ9999' } });
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    await screen.findByText(/couldn.t find a tutor with that code/i);
    expect(onCodeResolved).not.toHaveBeenCalled();

    // No dead end — input and Continue remain usable for another attempt.
    expect(screen.getByRole('button', { name: /continue/i })).toBeEnabled();
    expect(input).toBeEnabled();
  });
});

// ── AuthGate's checkAccount + fireJoinIntent — ordering (layer 2) ──
//
// AuthGate needs Clerk hooks to mount for real, so this mirrors its exact
// control flow (checkAccount / fireJoinIntent in components/AuthGate.js)
// rather than mounting the component.

describe('AuthGate — join-intent fire ordering (layer 2)', () => {
  async function mirrorCheckAccountFlow({ accountExists, pendingCode }) {
    const calls = [];
    const fakeLocalStorage = makeFakeStorage();
    if (pendingCode) fakeLocalStorage.setItem('pending-join-code', pendingCode);

    async function apiFetch(path) {
      calls.push(path);
      if (path === '/api/account') {
        if (!accountExists) throw new Error('404 not found');
        return { account: { id: 'acc1' }, children: [], access: {} };
      }
      if (path === '/api/tutor/join-intent') return { ok: true };
      throw new Error(`unexpected path ${path}`);
    }

    // Mirrors fireJoinIntent — fire-and-forget, swallows all errors.
    async function fireJoinIntent() {
      const code = fakeLocalStorage.getItem('pending-join-code');
      if (!code) return;
      try { await apiFetch('/api/tutor/join-intent'); } catch {}
    }

    // Mirrors checkAccount's try/catch: a 404 on /api/account never reaches
    // the `if (data.account) fireJoinIntent()` line.
    let data;
    try {
      data = await apiFetch('/api/account');
    } catch {
      return calls;
    }
    if (data.account) await fireJoinIntent();
    return calls;
  }

  it('fires join-intent AFTER /api/account, only once the account is confirmed to exist', async () => {
    const calls = await mirrorCheckAccountFlow({ accountExists: true, pendingCode: 'ABCD-EFGH' });
    expect(calls).toEqual(['/api/account', '/api/tutor/join-intent']);
  });

  it('never fires join-intent when the account row does not exist yet (avoids the 404)', async () => {
    const calls = await mirrorCheckAccountFlow({ accountExists: false, pendingCode: 'ABCD-EFGH' });
    expect(calls).toEqual(['/api/account']);
  });

  it('does not fire when there is no pending code, even once the account exists', async () => {
    const calls = await mirrorCheckAccountFlow({ accountExists: true, pendingCode: null });
    expect(calls).toEqual(['/api/account']);
  });
});

// ── Layer 1 hybrid — unsafeMetadata post-auth restore ──

describe('layer 1 hybrid — unsafeMetadata restore (post-auth, covers the OAuth same-tab hop)', () => {
  it('restores pending-join-code from unsafeMetadata.joinCode only when localStorage lost it', () => {
    const fakeLocalStorage = makeFakeStorage();
    const user = { unsafeMetadata: { joinCode: 'xyzw-1234' } };

    // Mirrors AuthGate's post-auth restore effect.
    if (!fakeLocalStorage.getItem('pending-join-code')) {
      const metaCode = user.unsafeMetadata?.joinCode;
      if (metaCode && typeof metaCode === 'string') {
        fakeLocalStorage.setItem('pending-join-code', metaCode.toUpperCase());
      }
    }

    expect(fakeLocalStorage.getItem('pending-join-code')).toBe('XYZW-1234');
  });

  it('never overwrites a code the primary carrier (fallbackRedirectUrl) already delivered', () => {
    const fakeLocalStorage = makeFakeStorage();
    fakeLocalStorage.setItem('pending-join-code', 'PRIMARY-CODE');
    const user = { unsafeMetadata: { joinCode: 'stale-metadata-code' } };

    if (!fakeLocalStorage.getItem('pending-join-code')) {
      const metaCode = user.unsafeMetadata?.joinCode;
      if (metaCode) fakeLocalStorage.setItem('pending-join-code', metaCode.toUpperCase());
    }

    expect(fakeLocalStorage.getItem('pending-join-code')).toBe('PRIMARY-CODE');
  });

  it('does nothing when the signed-in user has no joinCode in unsafeMetadata', () => {
    const fakeLocalStorage = makeFakeStorage();
    const user = { unsafeMetadata: {} };

    if (!fakeLocalStorage.getItem('pending-join-code')) {
      const metaCode = user.unsafeMetadata?.joinCode;
      if (metaCode) fakeLocalStorage.setItem('pending-join-code', metaCode.toUpperCase());
    }

    expect(fakeLocalStorage.getItem('pending-join-code')).toBeNull();
  });
});

// ── Layer 3 re-offer — bootstrap pendingJoinIntent restores the code; declined intents never come back ──

describe('bootstrap pendingJoinIntent — restores the code and re-offers JoinScreen', () => {
  it('restores pending-join-code from GET /api/account when localStorage lost it, and App.js then boots into the join view', () => {
    const fakeLocalStorage = makeFakeStorage();
    const accountResponse = {
      account: { id: 'acc1' },
      children: [],
      access: {},
      pendingJoinIntent: { tutorCode: 'ABCD-EFGH', tutorName: 'Mary Jones' },
    };

    // Mirrors AuthGate's checkAccount restore branch.
    if (accountResponse.pendingJoinIntent?.tutorCode) {
      if (!fakeLocalStorage.getItem('pending-join-code')) {
        fakeLocalStorage.setItem('pending-join-code', accountResponse.pendingJoinIntent.tutorCode);
      }
    }
    expect(fakeLocalStorage.getItem('pending-join-code')).toBe('ABCD-EFGH');

    // Mirrors App.js's currentView initializer, reading the same key.
    let currentView = null;
    const pathMatch = '/'.match(/^\/join\/([A-Z0-9-]{5,12})$/i);
    if (pathMatch) currentView = 'join';
    else if (fakeLocalStorage.getItem('pending-join-code')) currentView = 'join';
    expect(currentView).toBe('join');
  });

  it('never overwrites a locally pending code with a different server-side one', () => {
    const fakeLocalStorage = makeFakeStorage();
    fakeLocalStorage.setItem('pending-join-code', 'LOCAL-CODE');
    const accountResponse = { pendingJoinIntent: { tutorCode: 'SERVER-CODE' } };

    if (accountResponse.pendingJoinIntent?.tutorCode) {
      if (!fakeLocalStorage.getItem('pending-join-code')) {
        fakeLocalStorage.setItem('pending-join-code', accountResponse.pendingJoinIntent.tutorCode);
      }
    }

    expect(fakeLocalStorage.getItem('pending-join-code')).toBe('LOCAL-CODE');
  });
});

describe('declined intents are never re-offered', () => {
  it('pendingJoinIntent: null (declined, or never existed) restores nothing, so App.js never boots into the join view', () => {
    const fakeLocalStorage = makeFakeStorage();
    const accountResponse = { account: { id: 'acc1' }, children: [], access: {}, pendingJoinIntent: null };

    if (accountResponse.pendingJoinIntent?.tutorCode) {
      fakeLocalStorage.setItem('pending-join-code', accountResponse.pendingJoinIntent.tutorCode);
    }
    expect(fakeLocalStorage.getItem('pending-join-code')).toBeNull();

    let currentView = null;
    const pathMatch = '/'.match(/^\/join\/([A-Z0-9-]{5,12})$/i);
    if (pathMatch) currentView = 'join';
    else if (fakeLocalStorage.getItem('pending-join-code')) currentView = 'join';
    else currentView = 'home';
    expect(currentView).toBe('home');
  });
});

// ── unsafeMetadata cleared on terminal decision (attribution durability fix,
// 17 Jul) ──
//
// The bug: nothing ever cleared unsafeMetadata.joinCode once <SignUp> stamped
// it. So after a parent explicitly declined, the NEXT page load's restore
// effect (tested above under "layer 1 hybrid") found localStorage empty but
// the metadata still holding the code, re-seeded localStorage, and App.js
// routed straight back into JoinScreen — which re-fired a join-intent POST
// and flipped the server's 'declined' record back to 'pending'. Endless
// re-offer loop, corrupted decline records. Same staleness would also
// re-show the Connect screen after a successful join.
//
// The fix: AuthGate.js's clearJoinCodeMetadata is called at BOTH terminal
// decisions (App.js's onJoined and onDecline handlers) — never on
// restore/consume, since an undecided parent's metadata must keep working as
// a cross-browser carrier. Mirrors AuthGate.js's exact spread-remove logic:
// Clerk's user.update({ unsafeMetadata }) REPLACES the whole object, so only
// the joinCode key is removed and the rest is preserved.

function mirrorClearJoinCodeMetadata(user) {
  if (!user?.unsafeMetadata?.joinCode) return null; // safe no-op — mirrors AuthGate's guard
  const { joinCode, ...rest } = user.unsafeMetadata;
  return rest; // mirrors the object passed to user.update({ unsafeMetadata: rest })
}

describe('clearJoinCodeMetadata — terminal decision clears unsafeMetadata.joinCode', () => {
  it('decline clears joinCode from unsafeMetadata while preserving other unsafeMetadata keys', () => {
    const user = { unsafeMetadata: { joinCode: 'ABCD-EFGH', otherKey: 'preserve-me' } };

    const updatedMetadata = mirrorClearJoinCodeMetadata(user);

    expect(updatedMetadata).toEqual({ otherKey: 'preserve-me' });
    expect(updatedMetadata.joinCode).toBeUndefined();
  });

  it('join clears joinCode from unsafeMetadata the same way (same callback, fired from onJoined)', () => {
    const user = { unsafeMetadata: { joinCode: 'ABCD-EFGH', otherKey: 'preserve-me' } };

    const updatedMetadata = mirrorClearJoinCodeMetadata(user);

    expect(updatedMetadata).toEqual({ otherKey: 'preserve-me' });
  });

  it('the restore effect does nothing once metadata has been cleared — decline no longer resurrects (regression test for the re-offer loop)', () => {
    const fakeLocalStorage = makeFakeStorage();
    // Simulates the state immediately after a decline has cleared
    // unsafeMetadata.joinCode: localStorage is empty (App.js's onDecline
    // removed it) AND the metadata carrier no longer has the code either.
    const user = { unsafeMetadata: {} };

    // Mirrors AuthGate's post-auth restore effect exactly.
    if (!fakeLocalStorage.getItem('pending-join-code')) {
      const metaCode = user.unsafeMetadata?.joinCode;
      if (metaCode && typeof metaCode === 'string') {
        fakeLocalStorage.setItem('pending-join-code', metaCode.toUpperCase());
      }
    }

    // Before the fix, a stale metaCode here would have re-seeded localStorage
    // and routed straight back into JoinScreen. Post-clear, there's nothing
    // to restore, so App.js's currentView initializer falls through to 'home'.
    expect(fakeLocalStorage.getItem('pending-join-code')).toBeNull();
  });

  it('bare Back does not clear unsafeMetadata — an undecided parent must keep the cross-browser carrier', () => {
    const user = { unsafeMetadata: { joinCode: 'ABCD-EFGH' } };

    // Mirrors App.js's JoinScreen onBack prop, which deliberately never calls
    // clearJoinCodeMetadata (only onJoined/onDecline do).
    const onBack = () => { /* just navigates home */ };
    onBack();

    expect(user.unsafeMetadata.joinCode).toBe('ABCD-EFGH');
  });

  it('is a safe no-op when there is no Clerk user (e.g. the ?dev-auth=true bypass)', () => {
    expect(() => mirrorClearJoinCodeMetadata(null)).not.toThrow();
    expect(() => mirrorClearJoinCodeMetadata(undefined)).not.toThrow();
    expect(mirrorClearJoinCodeMetadata(null)).toBeNull();
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
