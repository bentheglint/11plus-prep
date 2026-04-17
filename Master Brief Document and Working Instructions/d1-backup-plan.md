# D1 Backup Plan — 11+ App

**Purpose:** ensure no user data is lost if D1 corrupts, a migration goes wrong, or someone accidentally drops a table.

**Principle:** layered protection. Automatic point-in-time recovery (Cloudflare Time Travel) as the first line of defence, weekly off-Cloudflare exports as a fallback if Cloudflare itself has an outage.

**Database:** `11plus-user-data` (ID: `11c21cbc-441a-4af0-b9ec-0151663393ab`)

---

## Layer 1 — Time Travel (automatic, built-in)

Cloudflare D1 automatically creates bookmarks. No configuration needed, runs continuously.

### Retention window

- **Free plan:** 7 days
- **Paid plan (Workers Paid $5/mo):** 30 days

**We are currently on:** *TODO — confirm plan when reviewing subscription.*

### Inspect available bookmarks

```bash
cd workers/ai-tutor
npx wrangler d1 time-travel info 11plus-user-data
```

### Restore to a point in time

```bash
# Restore to a specific UNIX timestamp (seconds since epoch)
npx wrangler d1 time-travel restore 11plus-user-data --timestamp=1713369600

# Or restore to a specific bookmark
npx wrangler d1 time-travel restore 11plus-user-data --bookmark=<bookmark-id>
```

**WARNING:** restore is destructive — it replaces the current DB state. Take a manual export first (Layer 2) if possible.

---

## Layer 2 — Weekly off-Cloudflare export (manual, belt-and-braces)

Guards against: Cloudflare outage, account compromise, Time Travel retention expiring before a problem is noticed.

### Manual export command

```bash
cd workers/ai-tutor
npx wrangler d1 export 11plus-user-data --output=../../backups/d1-export-$(date +%Y-%m-%d).sql --remote
```

This writes a full SQL dump to `backups/d1-export-YYYY-MM-DD.sql` in the repo root.

### Weekly cadence

Run manually each **Sunday evening** (aligns with the weekly email cron and low-usage window).

Add to the monitoring checklist: "Every Sunday: run D1 export, commit to `backups/` folder."

### Storage

**Do NOT commit SQL dumps to git.** They contain user emails, child display names, Clerk user IDs, and full quiz history — sensitive data that shouldn't live in version control history.

- Keep exports in the local `backups/` folder (which is gitignored)
- For off-site backup, upload the SQL file to password-protected cloud storage (e.g. encrypted folder in Google Drive, or a dedicated R2 bucket)
- If using cloud storage, encrypt the SQL file first (e.g. `gpg -c d1-export-*.sql`)

### Pruning

Keep last 4 weekly exports + last 3 monthly snapshots. Delete older (they're redundant with Time Travel).

---

## Layer 3 — Automated R2 export (future, recommended)

When paid plan is active and time permits, automate Layer 2 via Cloudflare Workflows:

1. Create an R2 bucket `d1-backups-11plus`
2. Schedule a Worker Workflow to run `wrangler d1 export` via REST API weekly
3. Upload to R2 with lifecycle rule (30-day retention)
4. Eliminates manual step

See: https://developers.cloudflare.com/d1/examples/d1-and-r2-example/ (approximate — verify)

---

## Restore procedure (incident playbook)

When someone says "we lost data":

1. **Don't panic.** Time Travel retains 7–30 days of state.
2. **Figure out when the bad state started.** Check:
   - Git log for recent migrations (`git log -- workers/ai-tutor/migrations/`)
   - Cloudflare D1 query logs
   - Client-side error dashboard (`?view=errors`)
3. **Decide restore target.** Pick a UNIX timestamp from before the problem started.
4. **Take a fresh export of current state** (Layer 2) before restoring — in case the restore target is wrong.
5. **Run restore** with the `wrangler d1 time-travel restore` command above.
6. **Verify** — log in as a test account, check a quiz history loads. Spot-check the monitoring dashboard.
7. **Notify affected users** if any data loss is visible (per incident-response.md SEV tiers).

---

## Known limits

- Time Travel can't recover data beyond the retention window (7d free / 30d paid)
- Time Travel restores the entire DB — no table-level selective restore
- Export + re-import is the only way to do selective restore (import specific rows from a SQL dump)
- D1 has no native replication to other regions — Cloudflare handles HA across their own edges

---

## Follow-up tasks

- [ ] Confirm current Cloudflare Workers plan (Free vs Paid) and update retention expectations above
- [ ] Create `backups/` folder in repo with `.gitignore` rule keeping the folder but skipping old exports
- [ ] Add "D1 export" to Sunday monitoring checklist
- [ ] After paid launch (Stripe live), set up automated R2 export workflow (Layer 3)
