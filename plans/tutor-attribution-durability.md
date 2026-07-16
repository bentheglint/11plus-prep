# Tutor Attribution Durability — approved design (16 Jul 2026)

**Priority: HIGH.** Approved by Ben 16 Jul 2026. Fable diagnosed + reviews; Sonnet builds.

## Problem / root cause
Tutor attribution (pupil ↔ referring tutor) lives ONLY in a fragile client-side
carrier (URL `/join/<code>` → localStorage `pending-join-code`) until the parent
taps Connect. Every failure mode is silent and leaves ZERO server trace, so a
failed referral is indistinguishable from an organic signup. Two real incidents:
6 unlinked pupils (Jul 8, retro-linked) + Leila Shrubsole (signed up 13 Jul,
AFTER the localStorage fix; confirmed Colette's; retro-linked 16 Jul, snapshot
taken first). The 8 Jul fix hardened same-browser tab handoff only. Unknowable
failure modes (verified by code trace 16 Jul):
1. Code never reaches signup browser (in-app browser → different browser hop).
2. Parent taps the bare "Back" arrow on JoinScreen (`JoinScreen.js:137`) —
   App.js onBack wipes the code permanently (`App.js:1967-1973`), no confirm,
   no recovery. Decline-by-misclick.
3. Parent abandons at JoinScreen (code survives; re-offers next login — only
   self-healing case).
Server records only SUCCESS (pupil_tutors row). This violates the project rule
"silent fallbacks/losses must be observable" (CLAUDE.md Duplicated-Truth §3).

Business impact: tutor channel is the PRIMARY growth channel; failed links =
uncredited 25% commission + pupils invisible to their tutor + Ben manually
asking tutors "is this yours?" per signup. Does not scale past one tutor.

## Approved design — four layers

### Layer 1 — harden the code carry at signup (SPIKE RESOLVED 16 Jul: hybrid)
Spike verdict (@clerk/clerk-react 5.61.4): `unsafeMetadata` on <SignUp> IS
supported (SignUpProps in @clerk/shared/types ~L9472; docs: "automatically
copies to the created user's unsafe metadata"; 8KB cap, non-issue). CAVEAT THAT
CHANGES THE DESIGN: metadata is set at <SignUp> MOUNT in the browser completing
signup — it survives the same-tab OAuth hop (authenticateWithRedirect carries
unsafeMetadata) but CANNOT bridge two unrelated browsers. The existing
fallbackRedirectUrl={joinRedirectUrl} carry (AuthGate ~L846/L860) is the
stronger cross-browser mechanism (code rides the URL). THEREFORE hybrid:
1. KEEP fallbackRedirectUrl carry as primary (already wired).
2. ADD unsafeMetadata={{ joinCode }} on <SignUp>, read from URL/localStorage at
   mount → covers the OAuth hop; post-auth, AuthGate restores
   `pending-join-code` from user.unsafeMetadata (useUser()) if localStorage
   lost it. Tamperable by design (unsafe) → drives the CONSENT PROMPT ONLY,
   never auto-join, no backend trust.
3. RESIDUAL GAP (accepted, unbridgeable client-side): link clicked in browser A,
   fresh signup typed into unrelated browser B — nothing can carry the code.
   Mitigated by layer 3b (manual code entry) + layer 4 (visibility) + the join
   link being reusable post-signup (parent taps it again while logged in →
   JoinScreen → Connect).
Consent model UNCHANGED: Connect tap remains the parent consent moment.

### Layer 3b — manual tutor-code entry (NEW, closes the residual gap humanly)
A "Have a tutor code?" entry point on the parent surface (account menu and/or
parent dashboard) → small screen with a code input → routes into the existing
JoinScreen flow (which already resolves a code → tutor profile → consent tap).
Tutor can then say "enter VHJ5-DRN3 in the app" in any channel. Copy: parent-
facing, British English, no em dashes. Records the same join-intent on entry.

### Layer 2 — server-side join-intent record (makes losses visible forever)
New table `join_intents` (MIGRATION 0019 — additive, no FK to accounts to keep
erasure simple? NO — follow existing patterns; FK with ON DELETE CASCADE like
daily_claims; check erasure path covers it):
  id, account_id (FK accounts ON DELETE CASCADE), tutor_id (FK tutors ON DELETE
  CASCADE), tutor_code TEXT, status TEXT CHECK ('pending','joined','declined')
  DEFAULT 'pending', created_at, updated_at.
  UNIQUE(account_id, tutor_id) — idempotent re-posts update updated_at only.
Client: whenever an AUTHED session holds a pending code (from path, localStorage
or Clerk metadata), POST /api/tutor/join-intent {tutorCode} — fire-and-forget,
non-blocking, before the parent decides (so decline/abandon still traced).
Worker: resolve code→tutor, INSERT OR IGNORE (update updated_at on conflict).
On successful join (existing /api/tutor/join): set status='joined'.
On explicit decline (new): set status='declined'.
Tests: worker tests incl. schemaParity pin for the new table; idempotency;
unknown-code handling (record nothing or status row? → record NOTHING for
invalid codes, they 404 today; don't create junk).

### Layer 3 — decline UX (JoinScreen)
- Back arrow NO LONGER wipes the code (returns home, code + intent stay pending).
- New explicit secondary button "Not now" → records decline (PATCH or POST
  /api/tutor/join-intent/decline {tutorCode}), THEN wipes localStorage code.
- Re-offer: on login, if a pending (not declined) intent exists server-side OR
  code in localStorage, show JoinScreen as today. (Server-side pending intents:
  client GET on boot? Simplest: /api/account bootstrap response gains
  `pendingJoinIntent: {tutorCode, tutorName} | null` — one payload, no extra
  round trip. Declined = never re-offered. Copy: calm, parent-facing, British
  English, NO em dashes.)
- A parent who declined can still join later via the link (intent flips back
  pending on new POST → allowed).

### Layer 4 — ops visibility (stop asking Colette)
Admin surface (existing admin panel pattern, email-gated): list join_intents
with status + account email + child name(s) + tutor name + timestamps; plus
"unlinked signups" (accounts with children, no pupil_tutors row, no intent) so
organic vs failed-referral is answerable in one screen. Tutor-side count
("invited, not yet connected: N") = LATER, not this release.

## Acceptance criteria
- [ ] Signup starting at /join/<code> in browser A, completed in browser B →
      Connect still offered post-signup; intent row exists (layer 1+2)
- [ ] Decline requires explicit "Not now"; recorded 'declined'; Back is safe
- [ ] Abandoned mid-flow → 'pending' intent visible in admin; re-offered next login
- [ ] Admin answers "is this signup a tutor referral?" without asking the tutor
- [ ] Join endpoint idempotent; existing 25 links unaffected
- [ ] No auto-join anywhere; consent tap unchanged
- [ ] Worker + client suites green; schema-parity + entitlement-key parity intact

## Build order (Sonnet builds, Fable reviews every diff)
1. SPIKE: verify Clerk unsafeMetadata support (types + docs + manual dev signup).
2. Migration 0019 + worker endpoints + tests (independent of spike outcome).
3. Client: AuthGate stamp/restore + JoinScreen decline UX + bootstrap
   pendingJoinIntent + client tests.
4. Admin visibility view.
5. Deploy: FRESH-CONTEXT migration ceremony per workers/ai-tutor/docs/
   migration-playbook.md (staging-test vs fresh prod snapshot → snapshot →
   apply 0019 → worker deploy → bash deploy.sh frontend), then live E2E:
   real /join/47BP-K563 signup (test tutor, NEVER VHJ5-DRN3).

## Constraints
- PRAGMA-check prod schema before any SQL (CLAUDE.md rule 2).
- No load-bearing "keep in sync" comments — parity tests for any duplicated map.
- All parent/child-facing copy: British English, no em dashes, no selling at
  children.
- privacy: intents contain no child data beyond what joining reveals; erasure
  path must delete intents with the account (FK CASCADE + verify erasure test).
