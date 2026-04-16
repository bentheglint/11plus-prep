# Incident Response — 11+ App

**Purpose:** when something goes badly wrong, what to do in what order.

**Principle:** roll back first, diagnose second. A few minutes of stale UI is always better than a broken deploy in front of children.

---

## Severity tiers

| Tier | Symptom | Example | Response time |
|---|---|---|---|
| **SEV-1** | App unusable for all users | Home screen crashes, sign-in broken, 500s across the board | Immediate rollback |
| **SEV-2** | App unusable for some users or feature broken | Daily Learning crashes, progress not saving, specific topic crashes | Rollback if easy, otherwise hot-fix same day |
| **SEV-3** | Feature degraded but usable | Wrong answer in one question, diagram misaligned, tutor unhelpful | Fix in next batch |

---

## SEV-1: Full rollback

### Frontend (Cloudflare Pages)

Every `bash deploy.sh` creates a new Pages deployment. Rolling back = promoting a previous deployment.

1. Go to https://dash.cloudflare.com → Workers & Pages → `11plus-prep`
2. Click the **Deployments** tab
3. Find the last known-good deployment (check the commit message / date)
4. Click the **"..."** menu on that row → **"Rollback to this deployment"**
5. Confirm
6. Verify: https://11plus-prep.pages.dev/ should now serve the rolled-back version (hard refresh / incognito to bypass cache)

### Worker (Cloudflare Workers)

If the Worker itself is the problem (auth errors, data API broken):

1. Dashboard → Compute → Workers & Pages → `11plus-ai-tutor`
2. **Deployments** tab → find the previous good version
3. Click **"..."** → **"Rollback"**
4. Confirm

### After rollback

- Post a note to the Google Sheet so Lauren / Jacqui know what happened
- Create a commit reverting the bad change locally (`git revert <commit>`)
- Don't re-deploy until the bug is fixed AND smoke test passes
- Write up a short post-mortem in `~/Documents/My Brain/context/incidents/YYYY-MM-DD-incident.md`

---

## SEV-2: Selective problems

### Data not saving for a user

1. Check `?view=errors` for error reports tied to that user
2. Check the Worker logs (Cloudflare → Workers → `11plus-ai-tutor` → Logs → live tail) for 500s or auth failures
3. Check the D1 dashboard — is the database up?
4. If localStorage has data that D1 doesn't: `useD1Data` flush queue may be stuck; ask the user to refresh; if persistent, manual D1 insert or fix the flush bug

### Specific topic or screen crashes

1. Reproduce in dev (`?dev-auth=true&view=...`)
2. Check error dashboard for stack traces
3. Hot-fix, test, deploy via `bash deploy.sh` (smoke test must still pass)
4. If the fix is non-trivial and users are blocked, **temporarily** feature-flag the broken screen off — toggle via URL (`?ff-<name>=false`) only works if a flag exists, so this is a pre-positioning concern

### Wrong answer in a question (reported by user)

1. Verify the report (check the question, calculation, Oracle if unclear)
2. Fix in `src/questionData/<subject>Data.js`
3. Commit, deploy, reply to reporter
4. SEV-3 really — not urgent unless it's a repeated pattern

---

## Cloudflare limits hit

If a free-tier limit is reached:

- **KV writes hit 1,000/day** → Testing Mode and `/api/error-report` start returning errors
  - **Short-term:** identify the chatty caller (check Worker logs), throttle client-side
  - **Long-term:** upgrade to Workers Paid ($5/month → 1M writes/month)
- **Workers requests hit 100,000/day** → entire Worker returns 429
  - **Short-term:** likely a bot or loop; check request patterns
  - **Long-term:** Workers Paid → 10M requests/month

---

## Clerk auth outage

Clerk hosts authentication. If it's down, new sign-ins fail but existing sessions (with unexpired JWTs) should keep working until the token expires (~60min).

1. Check https://status.clerk.com/
2. If down: post an apology to the Google Sheet, wait. Do not build around it.
3. `?dev-auth=true` still works for dev/local.

---

## Data breach / suspected compromise

If you suspect credentials or user data have been exposed:

1. **Rotate Clerk secret key immediately** (dashboard → API Keys → rotate). Update `wrangler secret put CLERK_SECRET_KEY` in `workers/ai-tutor/`.
2. **Rotate Anthropic API key** (console.anthropic.com).
3. **Force sign-out all sessions** via Clerk dashboard.
4. **Audit D1** — any suspicious inserts/reads from the last 30 days?
5. **Notify affected users** within 72 hours per UK GDPR Article 33 if personal data was actually exposed (not just potentially).
6. Write up what happened in `~/Documents/My Brain/context/incidents/` and file with the ICO if required.

---

## Contact card

- **Primary:** Ben Jackson · ben@venortech.com
- **Cloudflare support:** available via dashboard (Paid plan only)
- **Clerk support:** via https://clerk.com/support
- **Anthropic support:** via https://console.anthropic.com

---

*Last updated: 16 April 2026*
