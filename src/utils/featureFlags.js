// Feature flags — gate experimental work off the core code path until it's
// proven. New features should default to OFF and only flip on when ready.
//
// Precedence (highest wins):
//   1. URL param       ?ff-gamification=true    — per-session override
//   2. localStorage    ff:gamification=true     — per-user persistent override
//   3. Env var         REACT_APP_FF_GAMIFICATION=true  — build-time default
//
// Usage:
//   import { isFeatureEnabled } from '../utils/featureFlags';
//   if (isFeatureEnabled('gamification')) { ... }
//
// Register each flag below so the debug panel can list them all.

export const FLAGS = {
  // Core — these toggle real product features that are currently behind a gate.
  gamification: {
    description: 'Character system, XP, mini-games, economy',
    default: false,
  },
  experimental: {
    description: 'Catch-all flag for ad-hoc experiments',
    default: false,
  },
  freeTier: {
    description: 'Client-side free-tier gating (Phase 0 freemium): locked cards, daily-set cap, upgrade prompts',
    default: false,
    // Rollout-only flag: in production this is purely a build-time switch
    // for turning the free-tier UI on/off. URL/localStorage overrides must
    // never be able to weaken gating in production — per-user gating is the
    // server entitlement's job (see effectiveEntitlement in App.js), not
    // this flag. Overrides still work in development for QA.
    productionLocked: true,
  },
};

function readEnvFlag(name) {
  // CRA bakes REACT_APP_* at build time; others are undefined.
  const key = `REACT_APP_FF_${name.toUpperCase()}`;
  const val = process.env[key];
  if (val === 'true') return true;
  if (val === 'false') return false;
  return null;
}

function readUrlFlag(name) {
  if (typeof window === 'undefined') return null;
  const v = new URLSearchParams(window.location.search).get(`ff-${name}`);
  if (v === 'true') return true;
  if (v === 'false') return false;
  return null;
}

function readStorageFlag(name) {
  if (typeof localStorage === 'undefined') return null;
  const v = localStorage.getItem(`ff:${name}`);
  if (v === 'true') return true;
  if (v === 'false') return false;
  return null;
}

export function isFeatureEnabled(name) {
  // Production-locked flags can't be weakened by a shareable URL param or a
  // localStorage write — those overrides are skipped entirely in production,
  // and only the build-time env var / default are consulted.
  const locked = FLAGS[name]?.productionLocked && process.env.NODE_ENV === 'production';
  if (!locked) {
    const urlFlag = readUrlFlag(name);
    if (urlFlag !== null) return urlFlag;
    const storageFlag = readStorageFlag(name);
    if (storageFlag !== null) return storageFlag;
  }
  const envFlag = readEnvFlag(name);
  if (envFlag !== null) return envFlag;
  return FLAGS[name]?.default ?? false;
}

// Persist an override for this browser. Call from dev UI or console.
export function setFeatureFlag(name, enabled) {
  if (enabled === null) {
    localStorage.removeItem(`ff:${name}`);
  } else {
    localStorage.setItem(`ff:${name}`, enabled ? 'true' : 'false');
  }
}

// List every flag + its currently-effective value and source. Used by the
// debug panel so you can see at a glance what's on.
export function getAllFlagStates() {
  return Object.keys(FLAGS).map(name => {
    const url = readUrlFlag(name);
    const storage = readStorageFlag(name);
    const env = readEnvFlag(name);
    const defaultVal = FLAGS[name].default;
    let source = 'default';
    let value = defaultVal;
    if (url !== null) { source = 'url'; value = url; }
    else if (storage !== null) { source = 'localStorage'; value = storage; }
    else if (env !== null) { source = 'env'; value = env; }
    return {
      name,
      description: FLAGS[name].description,
      value,
      source,
      default: defaultVal,
    };
  });
}

// Expose on window for quick console access in dev.
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.__featureFlags = { isFeatureEnabled, setFeatureFlag, getAllFlagStates };
}
