// Plan A v2.1 process-gate configuration.
//
// This file is the single source of truth for gate parameters that should
// be reviewable in a PR. Adding a branch to PROTECTED_BRANCHES — for example
// — should always be visible in source control.
//
// (The plan v2.1 spec called for these values in `.claude/settings.json` but
// `.claude/` is gitignored in this repo, so settings.json edits are not
// reviewable. Living here in a tracked file better serves the spec's intent.)

export const PROTECTED_BRANCHES = ['master', 'main'];

// Freshness windows (seconds) — how recent an artefact must be to satisfy
// each gate. Plan v2.1 defaults; tune at the 2-week soak if calibration
// proves wrong.
export const FRESHNESS = {
  preCheckSeconds: 5 * 60,        // Gate 2 — Worker schema precheck (5 min)
  rehearsalSeconds: 24 * 60 * 60, // Gate 3 — migration rehearsal (24 h)
  verificationSeconds: 60 * 60,   // Gate 4 — post-mutation verification (1 h)
  weeklyRestoreSeconds: 8 * 24 * 60 * 60, // Soft-warning gate (8 days)
};

// Production D1 binding — used by hooks to verify they're checking the
// right database when interpreting wrangler invocations.
export const PROD_DB_NAME = '11plus-user-data';
export const DRILL_DB_NAME = '11plus-restore-drill';
