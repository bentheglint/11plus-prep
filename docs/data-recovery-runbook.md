# Data recovery runbook

> Use this runbook when Cloudflare itself is unavailable, compromised, or
> permanently gone. For routine D1 incidents (a bad migration, a single
> corrupted record, a single accidentally-dropped table) use **Time Travel
> first** — see `workers/ai-tutor/docs/migration-playbook.md` and Plan A
> v2.1 §"Recovery layer".
>
> This runbook is the off-Cloudflare path: when Time Travel itself is
> unavailable because Cloudflare-the-platform is.

**Status:** unverified end-to-end as of 4 May 2026. The annual disaster
drill (each January) updates the commands here against current vendor
reality. If the runbook hasn't been drilled in >12 months, treat the
specific commands as best-effort and verify each against vendor docs
before relying on them.

---

## 0. When to use this runbook

Use it when at least two of the following are true and you've been unable
to make progress for >2 hours:

- The Cloudflare dashboard is down or returning errors
- `wrangler whoami` fails with auth errors that aren't expected (token rotated, etc.)
- D1 reads or writes are returning errors that aren't D1-internal (i.e. the data plane appears unhealthy, not just slow)
- News reports a major Cloudflare incident, account suspension, or company-level event

If you're unsure: **prefer Time Travel** (still in Cloudflare) as the first
recovery attempt. This runbook's setup costs ~12-20 hours; Time Travel is
~2 minutes.

---

## 1. Pre-flight — things you must have

Before starting recovery, confirm you have:

- [ ] **Your age private key.** Located in: 1Password / Bitwarden + paper in home safe + paper with family member. Generated 4 May 2026. Public key (for cross-check): `age1elquppalxlqlew5nzcjl9rhad904mqd7jk5zltpr33hq6p6rt4tqka38cl`.
- [ ] **Backblaze B2 account credentials.** Email + password to log in to backblaze.com, NOT the application key (which is GitHub-side and may be unrecoverable if GitHub is also affected).
- [ ] **A working machine** with Git Bash, Node.js 22+, and ideally `age` installed.
- [ ] **Access to your domain registrar** — for DNS changes when the new stack is up.
- [ ] **Access to Clerk** — for moving JWT verification to the new origin.
- [ ] **Access to Stripe** (if subscriptions were live) — for webhook URL update.

If any of these is in doubt: **stop and confirm before proceeding** —
running through the runbook with a missing piece wastes time and risks
doing damage.

---

## 2. Get the latest backup off B2 and decrypted

```bash
# Set up the private key locally if it isn't already there
mkdir -p ~/.config
chmod 700 ~/.config 2>/dev/null  # noop on Windows but harmless
echo 'AGE-SECRET-KEY-...paste-from-password-manager...' > ~/.config/11plus-backup-key.txt
chmod 600 ~/.config/11plus-backup-key.txt 2>/dev/null

# Set B2 credentials in the shell
export B2_KEY_ID='...from B2 console (or recreate a new app key)...'
export B2_APPLICATION_KEY='...same...'

# Run the cold-restore drill against the freshest daily/ backup
node scripts/process-gates/local-cold-restore.mjs --source=latest-daily
```

The drill writes a verified SQLite database to `~/.cache/11plus-cold-restore/<date>.db`.
**This file is your starting point** — every subsequent step works against this DB.

If the drill fails the integrity check: try the second-newest daily, then
the freshest monthly, working backwards until you find a backup that
restores cleanly.

---

## 3. Provision Turso (replacement for D1)

[Turso](https://turso.tech/) is a libSQL/SQLite-compatible hosted DB.
Same dialect as D1 — the dump imports unchanged.

```bash
# Install Turso CLI (one-time)
curl -sSfL https://get.tur.so/install.sh | bash
# OR on Windows: irm get.tur.so/install.ps1 | iex
# OR via Homebrew on Mac: brew install tursodatabase/tap/turso

turso auth signup    # creates an account, opens browser
turso db create 11plus-user-data-restored
turso db show 11plus-user-data-restored  # note the URL and authenticated CLI token
```

Now import the cold-restored dump:

```bash
# Export the cold-restored SQLite DB to SQL
sqlite3 ~/.cache/11plus-cold-restore/<date>.db .dump > /tmp/restored-dump.sql

# Pipe to Turso
turso db shell 11plus-user-data-restored < /tmp/restored-dump.sql

# Smoke-test
turso db shell 11plus-user-data-restored "SELECT COUNT(*) FROM accounts"
```

You should see the same account count as the manifest (compare to
`process-gate-artefacts/last-manual-cold-restore-<date>.json`).

---

## 4. Provision Fly.io (replacement for Workers)

The Worker code uses [Hono](https://hono.dev/), which runs on Workers AND
on Node.js without code changes. Fly.io is the easiest place to run a
Node Hono server with a global edge.

```bash
# Install flyctl (one-time)
curl -L https://fly.io/install.sh | sh
# OR on Windows: iwr https://fly.io/install.ps1 -useb | iex

flyctl auth signup
cd workers/ai-tutor
flyctl launch  # follow prompts; pick a name like "11plus-worker-restored"
```

You'll need to:

1. **Add a `Dockerfile`** that runs the Worker as a Node app. Sketch:
   ```dockerfile
   FROM node:24-alpine
   WORKDIR /app
   COPY package.json ./
   RUN npm install hono libsql @clerk/backend
   COPY . .
   CMD ["node", "fly-entry.mjs"]
   ```
2. **Write `fly-entry.mjs`** — a thin Node wrapper that wires Hono to a
   Node HTTP server and uses libSQL for D1 calls:
   ```js
   import { Hono } from 'hono';
   import { serve } from '@hono/node-server';
   import { createClient } from '@libsql/client';
   // import the existing route handlers...

   const db = createClient({ url: process.env.TURSO_URL, authToken: process.env.TURSO_TOKEN });
   // ...wire env.DB to a libSQL-shaped object that the existing routes call...
   serve({ fetch: app.fetch, port: 8080 });
   ```
3. **Set Fly secrets:**
   ```bash
   flyctl secrets set TURSO_URL='libsql://...' TURSO_TOKEN='...' \
                      CLERK_SECRET_KEY='...' STRIPE_SECRET_KEY='...'
   flyctl deploy
   ```
4. **Verify the new Worker responds:** `curl https://<your-fly-app>.fly.dev/api/health`

The libSQL-shape adapter is the trickiest part. The annual disaster drill
will work this out and pin the exact code; if it's been >12 months since
the last drill, expect to spend an extra hour or two here.

---

## 5. Repoint the frontend

The React app currently calls Workers at the Cloudflare-hosted URL. Update
the API base in `src/App.js` (or wherever `WORKER_URL` is defined) to
point at the new Fly URL.

```bash
# Quick one-line edit
sed -i 's|https://11plus-ai-tutor[^/]*workers.dev|https://<your-fly-app>.fly.dev|g' src/App.js

# Build + redeploy frontend
npm run build
# Push build/ to whatever hosting you're using as a Cloudflare Pages
# replacement — Fly static, Netlify, Vercel, GitHub Pages all work.
```

---

## 6. Update Clerk

Clerk verifies JWTs against the worker's expected origin. If the origin
changes (Workers → Fly), Clerk must know.

1. Open Clerk dashboard → your application → API Keys / Domains
2. Add the new Fly domain to **Allowed origins**
3. (Optional) remove the old Cloudflare Pages domain once the migration is
   complete and verified

---

## 7. Update Stripe webhooks (if subscriptions live)

Stripe sends webhooks to a fixed URL. Update it.

1. Stripe dashboard → Developers → Webhooks
2. Edit the endpoint — change the URL from `https://11plus-ai-tutor...workers.dev/api/stripe/webhook` to `https://<your-fly-app>.fly.dev/api/stripe/webhook`
3. Take note of the new signing secret if Stripe rotates it; update Fly secrets accordingly

---

## 8. Smoke test — one real user logs in successfully

```bash
# Visit the new frontend URL in a private browser window
# Log in with a real existing account (Ben's own is fine)
# Verify:
#   - Account exists
#   - Quiz history is visible
#   - Streak count looks right
#   - One quiz completes successfully and saves
```

If all four pass: **the recovery is functionally complete.**

---

## 9. Post-recovery housekeeping

- [ ] Notify users: a short email via Resend explaining the migration, with the new domain if it changed.
- [ ] Plan a permanent migration: are we staying on Turso + Fly, or moving back to Cloudflare once it recovers? Decision: typically, stay on the new stack at least 30 days to confirm stability before any second migration.
- [ ] Update `plans/data-resilience-layer-1-plan.md` and this runbook with whatever you learned during the actual incident — provisioning paths that didn't work, command versions that had drifted, surprise dependencies. Make next year's drill faster.

---

## 10. Things that WILL go wrong on first attempt

- The libSQL adapter for D1's `db.prepare(...).bind(...).all()` shape requires a small wrapper. Plan for ~1h of debugging here.
- Clerk's `frontendApi` env var on the React side must be the same value, but the JWT verifying logic on the Worker side must pull the JWKS from the right URL. Test login carefully.
- DNS propagation lag — if you're moving the apex domain, expect 5-60 minutes after the change before all clients see the new origin.
- B2 application key may be missing or expired. Be prepared to issue a new one from the B2 console (need account email + password, NOT the GitHub secrets).
- Schema drift over time: if you're restoring from a >1-year-old backup, the Worker code on master may have evolved. Check out the worker SHA from the manifest:
  ```bash
  git checkout <worker_sha_from_manifest>
  # or: examine the schema differences and adapt
  ```

---

## Appendix A: Things outside this runbook's scope

- **Cloudflare Pages permanent loss + frontend recovery.** Frontend is a
  React static build; rehosting on Netlify / Fly / Vercel is a 10-minute
  job. The runbook focuses on data + Worker continuity.
- **Recovery from key loss.** If the age private key is permanently lost,
  the encrypted backups are unrecoverable. There is no backdoor by design.
  This is why the key has three independent copies + an annual
  recovery-drill.
- **Recovery from compromised B2 account.** If an attacker has B2 root
  credentials, they cannot delete in-retention objects (Compliance Object
  Lock backstops them). Issue new credentials from a clean machine,
  rotate the bucket access keys, and verify the data is intact.
