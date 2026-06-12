/**
 * Tests for scripts/check-bundle-compat.js — the post-build Safari 15.6
 * compatibility guard.
 *
 * Covers:
 * 1.  Regex literal lookbehind → regex-lookbehind finding
 * 2.  Lookbehind in a plain string literal → NO finding (false-positive control;
 *     the reason this guard is AST-based not text-scan-based)
 * 3.  new RegExp("(?<=x)y") → regex-lookbehind finding
 * 4.  Static class block → static-block finding
 *     (also proves the v8 acorn-walk actually visits StaticBlock nodes;
 *     v7 silently skipped them — a guard that matches nothing is the worst case)
 * 5.  `#x in obj` private-in → private-in finding
 * 6.  /abc/d regex flag → regex-flag finding
 * 7.  ES2024 /v flag syntax → parse-floor finding (acorn 2022 floor rejects it)
 * 8.  localhost / 127.0.0.1 in source → dev-url findings
 * 9.  Known-good prod Worker URL → NO findings
 * 10. Safe-modern syntax (optional chaining, nullish coalescing, class fields)
 *     → NO findings (Safari 15.6 supports these; guard must not over-block)
 */

const { scanSource } = require('../../../scripts/check-bundle-compat');

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function rulesOf(findings) {
  return findings.map(f => f.rule);
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Regex literal lookbehind
// ─────────────────────────────────────────────────────────────────────────────

describe('regex-lookbehind: literal', () => {
  it('flags a positive lookbehind in a regex literal', () => {
    // This is the construct that blanked the child's iPad on 9 June 2026.
    const source = 'var re = /(?<=£)\\d+/;';
    const findings = scanSource(source, 'test.js');
    expect(findings).toHaveLength(1);
    expect(findings[0].rule).toBe('regex-lookbehind');
  });

  it('flags a negative lookbehind in a regex literal', () => {
    const source = 'var re = /(?<!foo)bar/;';
    const findings = scanSource(source, 'test.js');
    expect(findings).toHaveLength(1);
    expect(findings[0].rule).toBe('regex-lookbehind');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Lookbehind in a plain string — NO finding
// (false-positive control: the guard is AST-based, not a text scan)
// ─────────────────────────────────────────────────────────────────────────────

describe('regex-lookbehind: false-positive control', () => {
  it('does NOT flag a lookbehind pattern in a plain string literal', () => {
    const source = 'var s = "(?<=x)";';
    const findings = scanSource(source, 'test.js');
    expect(findings).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. new RegExp("(?<=x)y") — dynamic construction
// ─────────────────────────────────────────────────────────────────────────────

describe('regex-lookbehind: new RegExp(str)', () => {
  it('flags a positive lookbehind passed as a string to new RegExp()', () => {
    const source = 'var re = new RegExp("(?<=x)y");';
    const findings = scanSource(source, 'test.js');
    expect(rulesOf(findings)).toContain('regex-lookbehind');
  });

  it('flags a negative lookbehind passed as a string to RegExp() (without new)', () => {
    const source = 'var re = RegExp("(?<!foo)bar");';
    const findings = scanSource(source, 'test.js');
    expect(rulesOf(findings)).toContain('regex-lookbehind');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. Static class block
// Proves acorn-walk v8 actually visits StaticBlock nodes.
// acorn-walk v7 silently skipped them — the guard would pass corrupt bundles.
// ─────────────────────────────────────────────────────────────────────────────

describe('static-block', () => {
  it('flags a static class initialisation block', () => {
    // Requires Safari 16.4+; the acorn-walk v7 silent-skip was the exact
    // failure mode this guard was built to prevent.
    const source = 'class A { static { init() } }';
    const findings = scanSource(source, 'test.js');
    expect(rulesOf(findings)).toContain('static-block');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. Private-in (`#x in obj`)
// ─────────────────────────────────────────────────────────────────────────────

describe('private-in', () => {
  it('flags the ergonomic brand-check syntax', () => {
    // class A { #x; check(o){ return #x in o } }
    const source = 'class A { #x; check(o){ return #x in o } }';
    const findings = scanSource(source, 'test.js');
    expect(rulesOf(findings)).toContain('private-in');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. Regex flag 'd' (hasIndices)
// ─────────────────────────────────────────────────────────────────────────────

describe('regex-flag', () => {
  it('flags the /d (hasIndices) flag — requires Safari 17.4+', () => {
    const source = 'var re = /abc/d;';
    const findings = scanSource(source, 'test.js');
    expect(rulesOf(findings)).toContain('regex-flag');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. ES2024 syntax: /v flag — rejected by acorn at ecmaVersion 2022
// ─────────────────────────────────────────────────────────────────────────────

describe('parse-floor', () => {
  it('flags ES2024 /v regex flag as a parse-floor error', () => {
    // The /v (unicodeSets) flag is ES2024; acorn at 2022 should throw a
    // SyntaxError, producing a parse-floor finding.
    const source = 'var re = /[\\p{L}]/v;';
    const findings = scanSource(source, 'test.js');
    expect(rulesOf(findings)).toContain('parse-floor');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. Dev URLs in bundle
// ─────────────────────────────────────────────────────────────────────────────

describe('dev-url', () => {
  it('flags localhost in a fetch call', () => {
    const source = 'fetch("http://localhost:8787/api")';
    const findings = scanSource(source, 'test.js');
    expect(rulesOf(findings)).toContain('dev-url');
  });

  it('flags 127.0.0.1 in a fetch call', () => {
    const source = 'fetch("http://127.0.0.1:8787")';
    const findings = scanSource(source, 'test.js');
    expect(rulesOf(findings)).toContain('dev-url');
  });

  it('flags 0.0.0.0 as a dev URL', () => {
    const source = 'var host = "0.0.0.0";';
    const findings = scanSource(source, 'test.js');
    expect(rulesOf(findings)).toContain('dev-url');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 9. Known-good production Worker URL — NO findings
// ─────────────────────────────────────────────────────────────────────────────

describe('known-good prod URL: no findings', () => {
  it('does not flag the real production Worker URL', () => {
    const source = 'var API = "https://11plus-ai-tutor.benjacko82.workers.dev";';
    const findings = scanSource(source, 'test.js');
    expect(findings).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 10. Safe-modern syntax — NO findings
// Safari 15.6 supports optional chaining, nullish coalescing, and class fields.
// The guard must not over-block these.
// ─────────────────────────────────────────────────────────────────────────────

describe('safe-modern syntax: no findings', () => {
  it('does not flag optional chaining, nullish coalescing, or class fields', () => {
    const source = 'class B { x = 1; } var a = {}; var r = a?.b ?? "default";';
    const findings = scanSource(source, 'test.js');
    expect(findings).toHaveLength(0);
  });

  it('does not flag standard arrow functions or template literals', () => {
    const source = 'const f = (x) => `hello ${x}`;';
    const findings = scanSource(source, 'test.js');
    expect(findings).toHaveLength(0);
  });
});
