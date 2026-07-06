import { isFeatureEnabled, setFeatureFlag, FLAGS } from './featureFlags';

// `freeTier` is productionLocked (Phase 0 Step 5 — closing the paywall
// bypass): in production, URL params and localStorage must never be able to
// weaken gating. `gamification` is NOT locked and is used as the control to
// prove overrides still work normally for everything else.

const originalNodeEnv = process.env.NODE_ENV;
const originalSearch = window.location.search;

function setUrlFlag(name, value) {
  window.history.pushState({}, '', `/?ff-${name}=${value}`);
}

function clearUrl() {
  window.history.pushState({}, '', '/');
}

afterEach(() => {
  process.env.NODE_ENV = originalNodeEnv;
  window.history.pushState({}, '', originalSearch || '/');
  localStorage.removeItem('ff:freeTier');
  localStorage.removeItem('ff:gamification');
});

describe('freeTier flag definition', () => {
  it('is declared productionLocked', () => {
    expect(FLAGS.freeTier.productionLocked).toBe(true);
  });
});

describe('isFeatureEnabled — productionLocked flags in production', () => {
  it('ignores a URL override (?ff-freeTier=false) and falls back to env/default', () => {
    process.env.NODE_ENV = 'production';
    setUrlFlag('freeTier', 'false');
    // No REACT_APP_FF_FREETIER env var set in this test run, so it should
    // resolve to the flag's default (false) — NOT because the URL said so,
    // but because the override was skipped entirely.
    expect(isFeatureEnabled('freeTier')).toBe(FLAGS.freeTier.default);
  });

  it('ignores a URL override (?ff-freeTier=true) and does not let it flip the flag on', () => {
    process.env.NODE_ENV = 'production';
    setUrlFlag('freeTier', 'true');
    expect(isFeatureEnabled('freeTier')).toBe(FLAGS.freeTier.default);
  });

  it('ignores a localStorage override and falls back to env/default', () => {
    process.env.NODE_ENV = 'production';
    clearUrl();
    setFeatureFlag('freeTier', false);
    expect(isFeatureEnabled('freeTier')).toBe(FLAGS.freeTier.default);
  });

  it('a NON-productionLocked flag still honours a URL override in production', () => {
    process.env.NODE_ENV = 'production';
    setUrlFlag('gamification', 'true');
    expect(isFeatureEnabled('gamification')).toBe(true);
  });

  it('a NON-productionLocked flag still honours a localStorage override in production', () => {
    process.env.NODE_ENV = 'production';
    clearUrl();
    setFeatureFlag('gamification', true);
    expect(isFeatureEnabled('gamification')).toBe(true);
  });
});

describe('isFeatureEnabled — productionLocked flags in development', () => {
  it('still honours a URL override for freeTier outside production', () => {
    process.env.NODE_ENV = 'development';
    setUrlFlag('freeTier', 'true');
    expect(isFeatureEnabled('freeTier')).toBe(true);
  });

  it('still honours a localStorage override for freeTier outside production', () => {
    process.env.NODE_ENV = 'development';
    clearUrl();
    setFeatureFlag('freeTier', true);
    expect(isFeatureEnabled('freeTier')).toBe(true);
  });
});
