---
title: Data Resilience — Layer 1 (Off-Cloudflare Daily Backup) — v2
date: 2026-05-01 (last amended 2026-05-04)
status: BUILD IN PROGRESS — manual provisioning complete (4 May); building daily-backup script + workflow now
companion-work: plans/process-gates-plan-v2.md (Plan A v2.1, shipped)
trigger-context: post-27-April; data is the product; current state has Cloudflare as a single point of failure
review-history:
  - v1 → senior-dev review: ship with two named pushbacks (Path C key boundary; named fallback platform). Three smaller items (third key copy required; B2 compliance-mode lock; alerting must not depend on GH email).
  - v1 → codex adversarial review: needs-attention with three findings (Path C trust boundary [agrees with senior-dev]; retention 30/12/5 not actually implementable from a single daily stream; restore verification too shallow to catch corrupted/incompatible backups).
  - v2 (this file) → all 8 items reconciled inline. No v3 round-trip planned.
implementation-amendments:
  - 4 May 2026 — Pushover → Resend. Pushover free tier doesn't support outbound email (only inbound email-becomes-push aliases). Resend covers backup alerts AND will serve launch parent emails, so this swap is a two-birds-one-stone. Functionally equivalent for the alerting design requirement (sender is reputable, not GitHub-Actions email).
  - 4 May 2026 — B2 Application Key uses Read+Write preset (not granular writeFiles+listFiles only). B2 UI doesn't expose granular capability selection; Object Lock in Compliance mode backstops the delete capability for any in-retention file regardless of key caps.
  - 4 May 2026 — yearly/ retention has NO lifecycle rule (B2 default = files match no rule = kept forever). Plan v2 said "yearly/* lifecycle 5y / forever" — implementation realises this via "no rule" rather than an explicit lifecycle entry. Same outcome.
supersedes: ~/Documents/My Brain/content/11plus-data-resilience-layer-1-plan.md (v1 stays in My Brain for narrative context; v2 in the repo is canonical)
---

# Data Resilience — Layer 1 Plan (v2)

## Goal (unchanged)

Make it true that **if Cloudflare disappeared overnight, every child's
data could be restored within 24 hours on a new vendor**, by Ben alone,
without phoning anyone.

## Changes from v1

Reconciles 8 items raised across senior-dev (Plan B advisor) and codex
adversarial review:

1. **Path C — private key never enters GitHub Actions.** The weekly
   cold-restore drill is now manual on Ben's machine (5 min/week).
   Closes the trust-boundary collapse both reviewers flagged.
2. **Named fallback platform: Turso (DB) + Fly.io (Worker).** Replaces
   the v1 hand-wave "fresh D1 elsewhere".
3. **Annual full disaster drill** added — Ben provisions Turso + Fly
   from scratch from a cold backup once a year. Validates the 24h SLA
   end-to-end.
4. **Third copy of the encryption key — required, not optional.**
5. **B2 object-lock in COMPLIANCE mode** (not governance). Cannot be
   disabled by account root.
6. **Daily-backup-failure alerting via Pushover** + a heartbeat monitor.
   GH email is no longer the primary signal (DMARC-drop class).
7. **Retention layout: separate `daily/`, `monthly/`, `yearly/` paths.**
   Script writes copies on month/year boundaries. v1's lifecycle-only
   approach would have left no monthly/yearly checkpoints.
8. **Restore verification deepens** — backup-time manifest with schema
   hash, per-table source counts, post-import `PRAGMA integrity_check`,
   pinned worker SHA. Row-count parity alone is no longer sufficient.

## Acceptance criteria

A successful build means all of these are demonstrably true on the day
of ship:

- [ ] Daily, automatically, without human action: a complete dump of
  the production D1 database is exported, gzipped, encrypted with a
  key Ben controls, and uploaded to a non-Cloudflare provider.
- [ ] **Asymmetric encryption: GitHub Actions has only the public
  key. The private key NEVER enters GitHub Actions secrets, ever.**
- [ ] Retention layout: `daily/` (30 days), `monthly/` (365 days),
  `yearly/` (forever). Each backup is also written to the matching
  longer-horizon path on the 1st of the month / Jan 1st.
- [ ] Each upload also writes a sidecar **manifest** containing the
  schema sha256, per-table source row counts at backup time, the
  source worker SHA, and the wrangler version used to export. Manifest
  travels with the backup.
- [ ] **Weekly cold-restore drill (manual, on Ben's machine):** Ben
  pulls the latest `daily/` backup, decrypts with the private key
  locally, imports to a throwaway SQLite, runs `PRAGMA integrity_check`,
  diffs row counts against the manifest, and produces
  `process-gate-artefacts/last-manual-cold-restore-<date>.json`. A
  separate check warns if the most recent manual drill is >14 days old.
- [ ] **Quarterly oldest-restore (automated handoff, no private key needed):**
  GH Actions pulls the *oldest* `monthly/` backup, copies it
  (still encrypted) to a "to-be-decrypted-locally" location, and
  pings Ben to complete the drill manually. We accept the manual leg
  as a necessary cost of preserving the asymmetric boundary.
- [ ] **Annual full disaster drill (manual, January each year):** Ben
  actually provisions Turso + Fly, brings up the app from a cold
  backup end-to-end, smoke-tests one user logging in successfully,
  records wall-clock time as the new SLA benchmark.
- [ ] Recovery runbook: a markdown file in the repo
  (`docs/data-recovery-runbook.md`) takes Ben from "Cloudflare is
  gone" to "Turso + Fly stack serving traffic" with every command
  spelled out and known good as of the most recent annual drill.
- [ ] Encryption key stored in **three** places Ben controls:
  password manager + paper copy in a home safe + paper copy with a
  trusted family member. Annual key-recovery drill verifies all three
  decrypt successfully.
- [ ] B2 bucket has **Object Lock in Compliance retention mode** at
  the matching duration for each path (30/365/forever-equivalent).
  Cannot be disabled by account root.
- [ ] **Failure alerting:** daily-backup failures fire a Pushover
  push notification to Ben's phone within 5 minutes; a separate
  heartbeat job confirms an object exists in `daily/` with mtime
  <36h and alerts via Pushover if not. GH email retained as fallback
  but is not the primary channel.

## Architecture

```
Cloudflare D1 (production)
        │
        │ wrangler d1 export --remote   (GitHub Actions, daily 02:00 UTC)
        ▼
   <db>-<date>.sql + manifest.json
        │
        │ gzip
        │ age -r <PUBLIC-key>           (GH only ever sees public key)
        ▼
   <db>-<date>.sql.gz.age + manifest.json (manifest unencrypted — metadata only)
        │
        │ b2 upload-file (× up to 3 paths)
        ▼
   Backblaze B2 bucket "11plus-prep-cold-backups", Compliance Object Lock
        ├── daily/<date>/...      (30d retention)
        ├── monthly/<date>/...    (365d retention; written on 1st of month)
        └── yearly/<date>/...     (forever; written on Jan 1st)
        │
   ┌────┴────────────────────────────────────────┐
   │                                             │
   ▼ Weekly (manual, Ben's machine)              ▼ Quarterly (GH triggers, Ben completes)
   1. Pull latest daily/                         1. GH pulls oldest monthly/
   2. age decrypt with PRIVATE key locally       2. GH copies to "to-decrypt" location
   3. Import to throwaway SQLite                 3. GH pings Ben (Pushover)
   4. PRAGMA integrity_check                     4. Ben decrypts + imports + verifies locally
   5. Compare per-table counts to manifest       5. Records wall-clock + verdict
   6. Write last-manual-cold-restore-<date>.json
        │
   Separate from cron:
   ▼ Annually (manual, January)
   Bring up Turso + Fly stack from cold backup, end-to-end.
   Validates 24h SLA.
        │
   Plus continuous:
   ▼ Failure alerting (every backup)
   Pushover push to Ben on any non-zero exit.
   Heartbeat monitor: separate job confirms freshest daily/ object
   exists and is <36h old; Pushover if not.
```

## Decisions (ranked by reversibility)

### Provider — Backblaze B2 (unchanged from v1)

Cost ~£0.005/GB/month. At our scale (~1MB compressed × 30 daily +
12 monthly + 5 yearly = ~50MB), bill is essentially £0/month.

**v2 addition:** Object Lock in **Compliance** retention mode. Per B2
docs, Compliance mode prevents file deletion or modification by
anyone — including the account root — until the retention period
expires. Governance mode allows deletion by accounts with the right
role; Compliance does not. Worth confirming the exact bucket
configuration before locking it in production.

### Encryption — `age` with asymmetric keys (unchanged primitive)

`age` (https://age-encryption.org). GitHub Actions has only the public
key (write-encrypt-only). The private key lives in three places Ben
controls: password manager, sealed envelope at home, and sealed envelope
with a trusted family member.

**v2 fix:** the v1 plan considered putting the private key in GH for
the weekly drill. v2 explicitly DOES NOT do this. Both reviewers
flagged the trust-boundary collapse: GH already needs B2 credentials
to download the ciphertext, so adding the private key to the same
trust boundary means a GH compromise yields full decryption capability
in one step. The asymmetric guarantee only meaningfully holds if the
private key never enters GH.

The cost is that the weekly cold-restore drill becomes manual (5
minutes on Ben's machine, weekly). That cost is acceptable.

### Cron host — GitHub Actions (unchanged)

Free at our scale. Independent of Cloudflare. Native scheduling.
Same auth pattern as the existing weekly drill.

### Retention — three explicit paths (NEW in v2)

v1 hand-waved "30 daily + 12 monthly + 5 yearly" with lifecycle
rules, which doesn't actually work — age-based lifecycle on a single
upload stream just expires old objects, it doesn't promote them into
longer-horizon retention.

v2 layout:
- `daily/<YYYY-MM-DD>/<db>.sql.gz.age` + `<manifest>.json`
  Lifecycle: expire after 30 days. Written every day.
- `monthly/<YYYY-MM-01>/<db>.sql.gz.age` + `<manifest>.json`
  Lifecycle: expire after 365 days. Written when day-of-month == 01.
- `yearly/<YYYY-01-01>/<db>.sql.gz.age` + `<manifest>.json`
  Lifecycle: never expire (object lock for 5+ years). Written when
  date == Jan 1st.

The script always writes to `daily/`, conditionally also to `monthly/`
and `yearly/`. Each path has its own lifecycle rule + Object Lock
compliance retention period.

Verification: a separate periodic job enumerates `monthly/` and
`yearly/` and asserts at least one object per expected period. Catches
"the cron has been silently failing on month boundaries for 6 months."

### Manifest — captured at backup time (NEW in v2)

Stored alongside each encrypted dump (unencrypted — metadata only,
no user data):

```json
{
  "schema_version": "0007_replay_protection",
  "schema_sha256": "<sha256 of CREATE TABLE statements only>",
  "per_table_counts": {"accounts": 6, "children": 6, "quiz_results": 135, "...": "..."},
  "row_count_total": 1389,
  "worker_sha": "87b16f7...",
  "wrangler_version": "4.70.0",
  "backup_at": "2026-05-01T02:00:00.000Z",
  "backup_size_bytes": 843776,
  "encrypted_size_bytes": 152400,
  "encrypted_sha256": "<hash of the .sql.gz.age file>"
}
```

Restore verification (v2):
1. Decrypt + decompress + import to throwaway SQLite
2. Run `PRAGMA integrity_check` — must return "ok"
3. Compute schema sha256 of the imported DB; must match manifest
4. Run per-table COUNT(*); must match manifest exactly (this is
   source-truth, not "compare to current prod")
5. Spot-check: read 3 known account rows and confirm email/name fields
   are non-null and match recorded format
6. Record verdict in `last-manual-cold-restore-<date>.json` (or
   `last-good-quarterly-restore-<date>.json`)

This catches v1's blind spots: wrong rows with right counts, missing
indexes/triggers (PRAGMA integrity_check), schema-vs-code drift
(schema_sha256 + worker_sha pinned).

### Named fallback — Turso (DB) + Fly.io (Worker) (NEW in v2)

The v1 plan said "fresh D1 elsewhere," which is incoherent — D1 is a
Cloudflare product. v2 names a specific fallback stack:

- **Database: Turso (libSQL).** libSQL is a SQLite fork; the dialect
  is identical to D1's. Importing the dump is `turso db shell <db>
  < dump.sql`. Free tier: 9 GB storage, 1B row reads/month, 25M row
  writes/month — vastly more than we'll need.
- **Worker-equivalent: Fly.io running Hono on Node.js.** Hono runs on
  Workers AND on Node.js with minimal code change. Fly's free tier
  (3 small VMs) is sufficient for our scale. The same Worker code
  ships to both.
- **Auth: Clerk (unchanged).** Clerk is independent of Cloudflare.
- **Frontend hosting: Cloudflare Pages currently — fall back to Fly
  static-site or Netlify if Cloudflare Pages is gone too.**

Caveat: free-tier terms change. The annual full disaster drill
(below) tests the named fallback against current vendor terms.

### Annual full disaster drill (NEW in v2)

Each January, Ben spends a day:
1. Provisions a new Turso DB
2. Provisions a new Fly app
3. Pulls the most recent monthly backup, decrypts locally
4. Imports to Turso
5. Builds a Worker-equivalent on Fly with the same code
6. Smoke-tests one user (Evie) logging in successfully on the new stack
7. Records wall-clock time and any provisioning issues encountered

The annual drill is the ONLY thing that validates the 24h SLA against
real current vendor reality. Quarterly drills validate data only;
annual drill validates infrastructure too.

Add a one-time-fire scheduled remote agent for January 2027 that
reminds Ben to run the drill.

### Failure alerting — Pushover + heartbeat (NEW in v2)

GitLab 2017 had pg_dump silently failing for an unknown duration
because the failure-alert emails were DMARC-dropped. v2 does not
trust email-from-GitHub.

- **Primary: Pushover.** $5 one-time license per device. POST a
  notification on any non-zero exit from the daily backup workflow.
  Push notifications survive on the phone and don't depend on email
  routing or SPF/DKIM/DMARC.
- **Heartbeat: separate periodic job (every 6h) that checks B2 for
  the freshest object in `daily/`.** If the freshest is >36h old,
  Pushover an alarm. This catches "the daily workflow hasn't
  triggered at all" — the failure mode where there's no error to
  alert on, just silence.
- **GH Actions email retained as a tertiary fallback only.**

Pushover credentials in GH secrets are acceptable: they don't grant
data access, only signal failure.

## Implementation tasks

1. **Provision B2:** create bucket `11plus-prep-cold-backups`,
   enable Object Lock (Compliance mode), create scoped Application
   Key with `writeFiles` only (no `deleteFiles`). Three lifecycle
   rules: `daily/*` → 30d, `monthly/*` → 365d, `yearly/*` → never
   (or 5y compliance retention).
2. **Generate age keypair locally** (`age-keygen -o ~/age-key.txt`).
   Public key embedded as constant. Private key written to:
   - 1Password / Bitwarden vault entry
   - Sealed envelope, home safe
   - Sealed envelope, mum's safe
   Verify each copy decrypts a test message before destroying any
   intermediate state.
3. **Set up Pushover account + device.** Generate user key + app
   token. Add as GH secrets `PUSHOVER_USER_KEY`, `PUSHOVER_APP_TOKEN`.
4. **Build `scripts/process-gates/daily-backup.mjs`:**
   - `wrangler d1 export --remote` → temp file
   - Build manifest (schema sha256, per-table counts, worker_sha,
     wrangler version)
   - Gzip the dump
   - `age -r <PUBLIC-KEY>` encrypt
   - SHA-256 the encrypted file; record in manifest
   - Determine target paths: always `daily/`, conditionally
     `monthly/` and `yearly/`
   - Upload encrypted file + manifest to each target path via
     `b2 upload-file`
   - Produce `process-gate-artefacts/daily-backup-<date>.json`
     summary artefact (no sensitive data)
   - On any failure: POST Pushover, exit non-zero
5. **Build `.github/workflows/daily-backup.yml`:**
   - Schedule `0 2 * * *`
   - Secrets: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID, B2_KEY_ID,
     B2_APPLICATION_KEY, BACKUP_PUBLIC_AGE_KEY, PUSHOVER_USER_KEY,
     PUSHOVER_APP_TOKEN
   - Steps: checkout, setup Node, install wrangler + age + b2,
     run daily-backup.mjs
   - Artefact upload of `process-gate-artefacts/daily-backup-*.json`
6. **Build `.github/workflows/heartbeat-monitor.yml`:**
   - Schedule `0 */6 * * *`
   - Lists `daily/` in B2, reads the freshest object's mtime
   - If mtime >36h ago: POST Pushover ALARM
   - No data access, only metadata — no private key required
7. **Build `scripts/process-gates/local-cold-restore.mjs`** (manual,
   Ben runs weekly on his machine):
   - Reads private key from `~/.config/11plus-backup-key.txt`
     (gitignored, machine-local)
   - Pulls latest object from B2 `daily/`
   - Decrypts, decompresses, imports to throwaway SQLite at
     `/tmp/cold-restore-<date>.db`
   - PRAGMA integrity_check + per-table count diff against manifest
   - Writes `process-gate-artefacts/last-manual-cold-restore-<date>.json`
   - Prints a clear PASS/FAIL summary
8. **Extend the existing weekly Plan A v2.1 cron with a "manual
   drill freshness" check:** if the most recent
   `last-manual-cold-restore-*.json` is >14 days old, fire a
   Pushover reminder for Ben to run the local drill.
9. **Build `.github/workflows/quarterly-coldest-restore.yml`:**
   - Schedule `0 4 1 1,4,7,10 *` (1st of Jan/Apr/Jul/Oct, 04:00 UTC)
   - Lists `monthly/` in B2; pulls the OLDEST object
   - Copies (still encrypted) to a "to-decrypt-locally" location
     (could be a separate B2 prefix or a GitHub Action artefact —
     decide at implementation time)
   - POSTs Pushover: "Quarterly drill ready — decrypt locally and
     verify <object>"
   - Workflow does NOT decrypt (private key not available)
10. **Write `docs/data-recovery-runbook.md`:**
    - Step-by-step recovery from "Cloudflare is gone"
    - Where the encryption private key lives
    - How to provision Turso (commands)
    - How to provision Fly.io + deploy Hono (commands)
    - How to import the decrypted backup into Turso
    - DNS/Clerk/Stripe re-binding steps
    - Smoke test: one user logs in successfully on the restored stack
11. **Schedule annual disaster drill remote agent** for January 2027
    via the schedule skill.
12. **Trigger daily-backup workflow manually once** before relying
    on the cron. Verify backup lands in B2, manifest is correct,
    heartbeat monitor finds it, Pushover alerts work end-to-end.
13. **Run weekly cold-restore once locally** before relying on the
    weekly drill cadence. Verify decrypt + import + integrity check
    all pass and the summary artefact is well-formed.

## Risk register (updated)

### High — encryption key loss

Three independent copies (password manager + two paper) + annual
recovery drill. Loss probability over 5y: low.

### Medium — Pushover account compromise / phone loss

Mitigation: Pushover is for ALERTING only, not data access. A
compromised Pushover account would allow an attacker to mute alarms
but not read data. Annual phone-replacement recovery flow is part of
Pushover's standard onboarding.

### Medium — Annual drill never actually happens

Ben is a single operator. Calendar reminders get dismissed. Mitigation:
the scheduled remote agent files an issue against the repo if the
previous-year drill artefact is missing. Visible in repo activity.

### Low — B2 bucket compromise

Mitigation: Application Key is write-only; Object Lock in Compliance
mode prevents deletion even by account root.

### Low — Schema drift across years

Acknowledged in v1 and unchanged in v2. Data is recoverable; running
app from year N is best-effort. Runbook says this. Manifest pins the
worker SHA so the matching code can be checked out from git.

### NEW Low — Manual weekly drill skipped indefinitely

Without the GH-Actions automation, the weekly drill becomes a
discipline problem. Mitigation: rule #8 above — automated freshness
check that pings Pushover if the most recent local drill is >14 days
old. The pressure shifts from "did I remember?" to "the system is
asking me to do it."

## What this plan does NOT cover (unchanged)

Out of scope for Layer 1:
- Layer 2: per-family copies (deferred to email infrastructure go-live)
- Layer 3: account hardening (MFA, key rotation policy, audit log)
- Layer 4: append-only event log for silent-corruption defence
- Real-time replication to a hot standby on another vendor

## Implementation order (refreshed for v2)

1. Provision B2 + Compliance Object Lock + scoped key (manual, 30 min)
2. Generate age keypair + distribute three copies + verify all three
   decrypt (manual, 30 min — this is the single most important step)
3. Set up Pushover + GH secrets (manual, 15 min)
4. daily-backup.mjs + manifest builder + multi-path uploads (~3h)
5. daily-backup.yml workflow + Pushover failure path (~1h)
6. heartbeat-monitor.yml workflow (~1h)
7. local-cold-restore.mjs + manual drill once (~2h)
8. quarterly-coldest-restore.yml + Pushover handoff (~1h)
9. Recovery runbook (~2h)
10. Schedule annual remote agent (~15 min)
11. End-to-end manual test of full daily flow (~30 min)

Total: ~1.5 development days plus the manual provisioning steps.

## Decision rule (post-soak, ~2 weeks after ship)

- If 14 daily backups all succeeded: keep as-is.
- If any daily backup failed and Pushover did not deliver: the
  alerting is broken; Pushover dependency is wrong; redesign.
- If weekly local drill was skipped and the freshness reminder did
  NOT fire after 14 days: the freshness check is broken; fix.
- If the heartbeat monitor never fired during the soak even though
  daily backups did succeed: the heartbeat is detecting "still
  working" silently — confirm by deliberately disabling the daily
  for one cycle and verifying the heartbeat alarms.
- If the quarterly drill was missed (no Pushover handoff arrived
  on the scheduled date): the cron is broken; fix.

## Sync to My Brain

After v2 is signed off and built, sync the final plan back to
`~/Documents/My Brain/content/11plus-data-resilience-layer-1-plan.md`
so cross-project Brain queries find the latest version. The repo copy
remains canonical for review provenance and git history.
