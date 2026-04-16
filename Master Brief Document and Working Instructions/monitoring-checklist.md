# Daily Monitoring Checklist — 11+ App

**Purpose:** catch problems before users tell you. ~2 minutes daily during soft launch.

**Frequency:** once per day, any time. Weekends too during the first 2 weeks of soft launch.

---

## The 2-minute daily check

### 1. Error dashboard — https://11plus-prep.pages.dev/?view=errors

- **Expected:** empty state ("No errors recorded") or a handful of identical deduplicated entries
- **Concerning:** any new unique error message since yesterday, or a cluster from one user
- **Action if concerning:** read the stack, reproduce if you can, fix or flag a task. For urgent crashes, roll back (see [incident-response.md](incident-response.md)).

### 2. Google Sheet feedback — [11+ Feedback](https://docs.google.com/spreadsheets/d/139AkRkO3UxVitGyL1ZMPfsjD5fvp98M14xtEKwQMpEo/edit)

- **Expected:** new rows from anyone using the app
- **Look for:** blocker issues (wrong answer, broken diagram, crash) vs nice-to-haves
- **Action:** triage, reply within 48 hours, fix blockers the same week

### 3. Cloudflare usage — https://dash.cloudflare.com

- **Storage + databases → KV → TESTING_FLAGS → Metrics**
  - Expected: Writes ≪ 500/day
  - Concerning: Writes climbing towards 500 (means something chatty is back)
- **Compute → Workers & Pages → 11plus-ai-tutor → Metrics**
  - Expected: requests scale with active users, errors < 1%
  - Concerning: error rate spike, or requests >> users
- **Storage + databases → D1 → 11plus-user-data → Metrics**
  - Expected: low write volume, healthy read latency

### 4. Testing Mode flags — https://11plus-prep.pages.dev/ (sign in, Testing Mode from home)

- **Expected:** Jacqui's flags steadily decreasing as fixes ship
- **Look for:** any urgent content issues flagged overnight
- **Action:** fix same-day where trivial, otherwise add to the feedback batch

---

## Weekly (Sundays)

- Check the week's commit activity — 3-5 commits/week is normal
- Run `bash deploy.sh` at least once even if no code changes — keeps the smoke test verified against real browser behaviour
- Update MEMORY.md with any new project context worth carrying forward
- Review Master Brief v7.0 for drift — note updates needed for next revision

---

## Monthly (or after big feature ship)

- Re-check Cloudflare usage trends — if KV writes >500/day sustained, upgrade to Workers Paid ($5/month gets 1M KV writes)
- Audit error dashboard for patterns — any error that's hit 5+ times across different users is worth investigating even if no one's reported it
- Check Clerk dashboard for account activity — steady growth? any deletions?
- Backup: `npm run smoke` locally to confirm the golden path still works

---

## Red flags that warrant immediate action

- 🚨 **Error dashboard shows 10+ entries from the same day** — likely a broken deploy
- 🚨 **Cloudflare email about exceeding a free-tier limit** — investigate which product; the KV write pattern (delta sync + no-op guard) should keep us clear
- 🚨 **A parent reports their child can't log in** — Clerk auth issue; check Clerk status page first
- 🚨 **A parent reports data loss** — compare D1 state vs their localStorage cache; usually a sync hiccup, but rollback if actual loss

See [incident-response.md](incident-response.md) for what to do in each case.

---

*Last updated: 16 April 2026*
