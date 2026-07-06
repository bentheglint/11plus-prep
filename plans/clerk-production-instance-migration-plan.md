# Plan — Move PrepStep auth from a Clerk DEVELOPMENT instance to a PRODUCTION instance

**Status:** drafted 6 Jul 2026, NOT started. Needs a decision on the identity-continuity
approach (§4) and a senior-dev/Codex review before execution.
**Severity of the problem being fixed:** medium-high and time-boxed — a Clerk dev instance
hard-caps at **100 users** (we have 17 and are about to push growth), and transmits the session
token in the URL querystring rather than a secure cookie (Clerk: "not secure enough for
production"). This is NOT the 7-day-logout issue (see §1).
**Clerk cost:** £0 — a production instance is on the free Hobby plan (50k users). Only *longer*
sessions + debranding need Pro ($25/mo), which stays deferred.

---

## 1. Objective & scope

Move production authentication from the current Clerk **development** instance
(`grown-piglet-53.clerk.accounts.dev`, `pk_test_…`) to a Clerk **production** instance
(`clerk.prepstep.co.uk`, `pk_live_…`).

**This fixes:** the 100-user cap (→ 50k) and the insecure querystring session token.
**This does NOT fix:** the 7-day logout. Clerk's free Hobby plan has a *fixed* 7-day session
lifetime on any instance; a longer session needs Clerk Pro ($25/mo). Keep that decision separate
and deferred (see memory `project_11plus_clerk_session_decision`).

**Out of scope:** Clerk Pro upgrade; any change to the app's features.

---

## 2. Current state (verified 6 Jul 2026, cited)

- Frontend passes only `publishableKey` to `ClerkProvider` (`src/index.js:81`), sourced from
  `REACT_APP_CLERK_PUBLISHABLE_KEY` (`src/index.js:37`). Current `.env` value is the dev key
  `pk_test_Z3Jvd24tcGlnbGV0LTUz…` (decodes to `grown-piglet-53.clerk.accounts.dev`).
- `AuthGate.js` uses Clerk's default `<SignIn>`/`<SignUp>` components (`AuthGate.js:694,708`),
  `useAuth().getToken()` for the **default** session JWT, sent as `Authorization: Bearer` to the
  worker. Dev bypass `?dev-auth=true` only in `NODE_ENV=development` (`AuthGate.js:300`).
- Worker verifies tokens itself via JWKS/RS256 in `verifyClerkJWT` (`workers/ai-tutor/index.js:29-99`):
  JWKS URL and `expectedIssuer` are both built from **`env.CLERK_DOMAIN`** (`index.js:45,78`), a
  **wrangler secret** (NOT in `wrangler.toml`). It also checks `azp` against `env.ALLOWED_ORIGINS`
  (`index.js:82`). It does **not** use `CLERK_SECRET_KEY` (that appears only in stale docs — see §11).
- **No hardcoded Clerk instance domain anywhere in source** — fully parameterised via
  `CLERK_DOMAIN`. Only the `pk_test_` value in `.env` carries the dev domain.
- **No Clerk webhooks.** Account creation is client-driven: after sign-up the frontend calls
  `POST /api/account` with the verified JWT (`AuthGate.js:537`), which inserts
  `accounts(id = Clerk userId, email, …)` (`routes/account.js:50`).
- **No social/OAuth in code** — controlled entirely by the Clerk dashboard (dev instances use
  Clerk's *shared* OAuth creds; prod needs our own). Must be checked in the dashboard (§10).
- `accounts.id = the Clerk user ID`; `accounts.email` is `NOT NULL UNIQUE`
  (`migrations/0001:11-12`); all data hangs off `accounts.id` via `children.account_id` FK.

---

## 3. The straightforward part: a TWO-VALUE change (must land in lockstep)

The key swap itself is small but **atomic across two separately-deployed components**:

| # | Value | From → To | Where |
|---|-------|-----------|-------|
| 1 | `REACT_APP_CLERK_PUBLISHABLE_KEY` | `pk_test_…` → `pk_live_…` | frontend `.env` (baked at build by `deploy.sh`) |
| 2 | `CLERK_DOMAIN` (worker secret) | `grown-piglet-53.clerk.accounts.dev` → `clerk.prepstep.co.uk` | `npx wrangler secret put CLERK_DOMAIN` |

If only #1 changes: frontend mints prod-instance tokens, worker still checks them against the dev
JWKS + issuer → **every authenticated request 401s** (signature + issuer mismatch). If only #2
changes: same, mirrored. **They must deploy together.** Also re-verify #3:

3. `ALLOWED_ORIGINS` (worker secret; doubles as CORS + `azp` allowlist) — confirm the prod
   instance's authorized-party value still matches our origins (`https://prepstep.co.uk` etc.).
   Likely unchanged, but check `azp` on a real prod-instance token before cutover.

---

## 4. The hard part: user identity continuity (THE decision + main risk)

Dev and prod Clerk instances are **separate user pools**. Confirmed with Clerk: you cannot copy
users dev→prod directly, and migrated/re-registered users get **NEW Clerk user IDs**. Because
PrepStep keys every account by the Clerk user ID (`accounts.id`), a naive cutover would orphan all
17 existing users' children/progress (new ID → no account found → they look brand-new).

`accounts.email` being `UNIQUE` is the lever. Two viable designs:

**Option A (RECOMMENDED) — Clerk `external_id`, no D1 re-key.**
Clerk explicitly recommends this for FK continuity. Steps:
1. Migrate the 17 users into the prod instance using Clerk's user-import (Backend API), setting each
   new user's **`external_id` = their old dev Clerk id** (= current `accounts.id`).
2. Add `external_id` to the prod instance's **session token** (Clerk session-token customization).
3. Change the worker's account resolution to key on `external_id` when present, else `sub`
   (new post-migration signups have no `external_id`). One small, well-tested change in the auth/
   account-resolution path.
- **Pro:** zero changes to the `accounts` primary key → **avoids the FK-parent D1 migration
  entirely** (the class that caused the 27-Apr data-wipe). Clerk-native.
- **Con:** worker auth-code change (dual resolution — auth-critical, must be exactly right) +
  token customization. New vs migrated users key differently (mix of old-dev-ids and new-subs in
  `accounts.id`) — acceptable, resolves uniformly via `external_id ?? sub`.

**Option B — email-based one-time re-key of `accounts.id` (dev-id → prod-id).**
Map old→new via unique email; a tested D1 migration updates `accounts.id` + `children.account_id`
+ every `account_id` reference for all 17 rows; thereafter everyone keys on `sub`.
- **Pro:** clean uniform end-state (always `sub`); no lasting auth-code change.
- **Con:** re-keys the `accounts` **FK parent** → full D1 safety protocol, highest-risk class in
  this codebase even as an UPDATE. Bounded to 17 rows but genuinely dangerous.

**Recommendation: Option A.** It keeps the dangerous operation (FK-parent re-key) off the table.
Confirm one fact first: does the default worker-verified session JWT carry what we need, and can
`external_id` be added as a claim (yes, via Clerk session-token settings). The worker currently
reads only `sub`/`iss`/`exp`/`azp` — it does **not** read email today, so email-based logic would
require adding an email claim too; `external_id` is the cleaner single addition.

Either way this is a real project, not a config tweak — flag for senior-dev/Codex review before build.

---

## 5. Prerequisites (do these BEFORE the cutover window)

1. **Create the production instance** in the Clerk dashboard (choose "replicate development settings"
   so sign-in options/appearance carry over as config — users do NOT).
2. **DNS:** add the CNAME records Clerk lists on its Domains page to `prepstep.co.uk` (DNS is on
   Cloudflare → straightforward). **Allow up to 48h propagation** — do this days ahead.
3. **Grab prod keys:** `pk_live_…` (frontend) and `sk_live_…` (only needed for the user-import
   Backend API in §4, not for runtime — the worker verifies via JWKS, not the secret key).
4. **Own OAuth creds** for any social providers enabled on the dev instance (check dashboard, §10).
5. **User import** (§4 Option A): export dev users, import to prod with `external_id` set, verify
   all 17 present with correct `external_id`. Do this in advance; it does not affect live dev auth.

---

## 6. Execution sequence (cutover window — pick a zero-traffic slot, e.g. late night)

1. `git fetch` + confirm master current (freshness rule).
2. Take a **fresh prod D1 snapshot** (`wrangler d1 export`) — rollback point, even though Option A
   doesn't write D1 (belt-and-braces; the auth-code change could still misbehave).
3. Deploy the worker with: the account-resolution change (§4A) + `CLERK_DOMAIN` secret → prod domain,
   in one `npx wrangler deploy`. (Worker deploys separately from the frontend.)
4. Update `.env` → `pk_live_…`, then `bash deploy.sh` (tests + smoke + compat guard + Pages deploy).
5. Verify (§9) immediately: a real sign-in mints a prod token, the worker accepts it, and a
   migrated user sees their existing children/progress (external_id resolution working).

Steps 3 and 4 should be as close together as possible (the two-value lockstep). Existing users'
dev-instance sessions become invalid at cutover → a **one-time forced re-login for all users**
(unavoidable; data is preserved via §4A). Communicate it if needed.

---

## 7. User impact

- **One-time forced re-login** for all ~17 users at cutover (their dev-instance sessions no longer
  verify). Minor at a quiet hour.
- **Data preserved** via §4 Option A (external_id → existing `accounts.id`). This is the make-or-break
  acceptance check.
- After cutover, sessions still expire at **7 days** (unchanged — that needs Pro, out of scope).

---

## 8. Rollback

- Revert worker: `wrangler secret put CLERK_DOMAIN` back to the dev domain + redeploy the previous
  worker version; revert `.env` → `pk_test_` and `bash deploy.sh` (or Pages instant-rollback to the
  prior deployment). Because Option A adds no D1 writes, rollback is config+deploy only.
- If Option B were chosen, rollback also requires restoring the D1 snapshot — another reason to
  prefer A.

---

## 9. Testing / acceptance criteria

- [ ] A brand-new sign-up on the prod instance creates an account and can save/read progress.
- [ ] A **migrated** user (one of the 17) logs in and sees their **existing** children + progress
      (external_id resolution verified end-to-end) — the critical check.
- [ ] Worker rejects a token from the *dev* instance after cutover (issuer/JWKS now prod).
- [ ] `azp`/`ALLOWED_ORIGINS` check passes for the prod origin; CORS unaffected.
- [ ] No increase in 401s / auth errors in Sentry post-cutover.
- [ ] Social login (if any) works with prod OAuth creds.
- [ ] Smoke test + full worker test suite green (note: tests use fake `CLERK_DOMAIN`, unaffected).

---

## 10. Open items to verify BEFORE executing

- **Social providers:** check the Clerk dashboard for any enabled social connections on the dev
  instance — not visible in code. If any, provision our own OAuth apps for prod.
- **Session-token customization:** confirm `external_id` can be added to the prod session token and
  appears in the worker-verified JWT (it should; verify on a real token).
- **`ALLOWED_ORIGINS`/`azp`:** confirm the prod instance's `azp` value matches our allowlist.
- **User-import mechanics:** confirm Clerk's import preserves email + lets us set `external_id` for
  all 17 (password-based users need `password_digest`; passwordless/social differ).

---

## 11. Incidental cleanup (not blocking)

- **Stale doc:** `Master Brief.../incident-response.md:102` tells a responder to rotate
  `CLERK_SECRET_KEY` via `wrangler secret put` — but the worker never reads it (verifies via JWKS).
  Fix the doc so a future incident doesn't chase a dead key. `docs/machine-setup.md:90-92` already
  correctly flags the pk_test→pk_live swap as a pre-launch task.

---

## 12. Effort & risk

- **Effort:** ~half a day of focused work + the DNS lead time (up to 48h) + the user-import step.
  Not a quick config tweak; a proper critical-path auth change.
- **Risk:** medium. The key swap is simple; the identity-continuity change (§4) is the risk centre
  and touches the auth path. Option A keeps it off the D1 FK parent. Mitigations: senior-dev/Codex
  review of the §4 design + worker diff; snapshot; test the migrated-user login BEFORE announcing;
  quiet-hour cutover; config-only rollback.
- **Recommendation:** worth doing before nearing the 100-user cap, decoupled from revenue. Sequence
  it as its own change (not bundled with the tonight Sentry deploy). Review the §4 decision with
  senior-dev before building.
