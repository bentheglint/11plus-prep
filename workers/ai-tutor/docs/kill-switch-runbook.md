# Freemium Kill-Switch Runbook

**Status:** Operational — emergency use only
**Purpose:** Instantly disengage ALL free-tier enforcement (every account
gets full access, as if freemium never shipped) without a code rebuild.
Use this when the deploy path is unhealthy mid-incident, or when the
enforcement logic itself is suspected of wrongly locking real users out.

## What it does

`lib/killSwitch.js` (`isEnforcementActive`) reads one row from the D1
`app_settings` table (migration `0018_app_settings.sql`). Every entitlement
resolution in the app goes through `lib/entitlementGate.js` →
`lib/entitlements.js`, so flipping this one flag reverts **every** gated
route (tutor, report, assignments, batch, data, entitlements, account) to
pre-freemium, full-access behaviour in one move.

**Default is ENFORCE-ON.** A missing row, missing table, malformed value,
or any read error all mean "keep enforcing" — the switch only disengages
on an explicit off value. It fails toward safety, never toward giving the
product away by accident.

## ENGAGE (turn enforcement OFF — emergency full access for everyone)

Run against the **remote** production D1 database:

```bash
npx wrangler d1 execute 11plus-user-data --remote --command \
  "INSERT INTO app_settings (key, value, updated_at) VALUES ('free_tier_enforcement', 'off', datetime('now')) ON CONFLICT(key) DO UPDATE SET value = 'off', updated_at = datetime('now')"
```

Any of `'off'`, `'false'`, `'0'`, `'disabled'` (case/whitespace-insensitive)
works as the value — `'off'` is the recommended convention.

## Propagation

- **Server:** the flag is cached per-Worker-instance for up to **10
  seconds**, so new requests pick up the change within ~10s of the UPSERT.
- **Already-open clients:** the browser fetched its entitlement once at
  sign-in. It re-fetches `/api/account` in the background on tab
  focus/visibility change (throttled to once per ~10s), so most users pick
  up the change the next time they switch back to the tab. **During an
  incident, tell users to refresh the page** if they need it immediately.

## RE-ENGAGE (turn enforcement back ON)

Either set the value back to `'on'`, or delete the row entirely (absence
also means enforce-on):

```bash
npx wrangler d1 execute 11plus-user-data --remote --command \
  "UPDATE app_settings SET value = 'on', updated_at = datetime('now') WHERE key = 'free_tier_enforcement'"
```

```bash
# equivalent — deleting the row also re-engages, since absence = enforce-on
npx wrangler d1 execute 11plus-user-data --remote --command \
  "DELETE FROM app_settings WHERE key = 'free_tier_enforcement'"
```

## VERIFY

Hit `GET /api/account` (authenticated) and check the entitlement payload:

```bash
curl -s https://<worker-host>/api/account -H "Authorization: Bearer <token>" | jq '.access.entitlement.enforcementActive'
```

- `false` → kill-switch engaged, that account has full access regardless
  of billing state (`tier` will read `"unrestricted"`, `reason` will read
  `"enforcement_disabled"`).
- `true` → enforcement active (normal operation).

You can also check the raw flag directly:

```bash
npx wrangler d1 execute 11plus-user-data --remote --command \
  "SELECT * FROM app_settings WHERE key = 'free_tier_enforcement'"
```
