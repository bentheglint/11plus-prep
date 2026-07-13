// Guard test for landing.css scoping (plans/landing-react-port-plan.md must-fix 3/4).
//
// deploy.sh's Puppeteer smoke runs with REACT_APP_SMOKE_MODE=true, which makes
// AuthGate skip the entire signed-out tree (see AuthGate.js SMOKE_BYPASS), so an
// unscoped selector or a colliding @keyframes name would deploy green and only
// show up as a visual regression in the SIGNED-IN app. This test reads landing.css
// as text and asserts every rule is properly namespaced under .landing-root, so a
// future edit can't silently reintroduce a document-global leak.
//
// This is a "derive-or-pin" test per the project's duplicated-truth doctrine
// (CLAUDE.md): it parses the real file rather than hand-copying its selectors.

const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'landing.css');
const raw = fs.readFileSync(cssPath, 'utf8');

// Strip /* ... */ comments (including the multi-line file banner) before parsing.
function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

// Walk the CSS text tracking brace depth. At depth 0 (or depth 1 inside an
// @media block), collect the selector text immediately preceding each `{`.
// @keyframes bodies are skipped (their internal selectors are percentages/
// from/to, not CSS selectors) but the @keyframes name itself is captured.
function collectRules(css) {
  const selectors = []; // top-level (or @media-nested) selector strings
  const keyframeNames = [];
  let i = 0;
  let depth = 0;
  let buf = '';
  let inMediaBlockAtDepth = null; // depth at which the enclosing @media started
  let inKeyframesAtDepth = null; // depth at which the enclosing @keyframes started

  while (i < css.length) {
    const ch = css[i];

    if (ch === '{') {
      const header = buf.trim();
      buf = '';

      if (/^@keyframes\s+/.test(header)) {
        const name = header.replace(/^@keyframes\s+/, '').trim();
        keyframeNames.push(name);
        inKeyframesAtDepth = depth;
      } else if (/^@media/.test(header)) {
        inMediaBlockAtDepth = depth;
      } else if (inKeyframesAtDepth === null && header.length > 0) {
        // A real selector list (top-level, or one level inside @media).
        selectors.push(header);
      }
      depth += 1;
      i += 1;
      continue;
    }

    if (ch === '}') {
      depth -= 1;
      if (inMediaBlockAtDepth !== null && depth === inMediaBlockAtDepth) {
        inMediaBlockAtDepth = null;
      }
      if (inKeyframesAtDepth !== null && depth === inKeyframesAtDepth) {
        inKeyframesAtDepth = null;
      }
      buf = '';
      i += 1;
      continue;
    }

    buf += ch;
    i += 1;
  }

  return { selectors, keyframeNames };
}

describe('landing.css scoping guard', () => {
  const cleaned = stripComments(raw);
  const { selectors, keyframeNames } = collectRules(cleaned);

  test('parsed at least a representative number of rules (sanity check on the parser itself)', () => {
    expect(selectors.length).toBeGreaterThan(50);
  });

  test('every top-level/media-nested selector list is scoped under .landing-root', () => {
    const offenders = [];
    selectors.forEach((sel) => {
      // A selector list may be comma-separated (e.g. "h1,h2,h3,h4" or
      // ".landing-root h1,.landing-root h2"). EVERY branch must be scoped.
      const branches = sel.split(',').map((s) => s.trim()).filter(Boolean);
      branches.forEach((branch) => {
        if (!branch.startsWith('.landing-root')) {
          offenders.push(branch);
        }
      });
    });
    expect(offenders).toEqual([]);
  });

  test('no bare html, body, :root, or unscoped universal selector exists', () => {
    const offenders = [];
    selectors.forEach((sel) => {
      const branches = sel.split(',').map((s) => s.trim()).filter(Boolean);
      branches.forEach((branch) => {
        // Bare html/body/:root as the selector itself (not "html.foo" etc,
        // which the mockup never uses, and not ".landing-root html" which
        // would be nonsensical and also never appears).
        if (/^(html|body|:root)(\s|$|,)/.test(branch) || branch === 'html' || branch === 'body' || branch === ':root') {
          offenders.push(branch);
        }
        // A universal selector must never appear un-namespaced ("*" alone,
        // or as the first token of the selector, e.g. "* html").
        if (branch === '*' || /^\*\s/.test(branch)) {
          offenders.push(branch);
        }
      });
    });
    expect(offenders).toEqual([]);
  });

  test('every @keyframes declaration is lp-prefixed', () => {
    expect(keyframeNames.length).toBeGreaterThan(0);
    keyframeNames.forEach((name) => {
      expect(name.startsWith('lp-')).toBe(true);
    });
  });

  test('the four expected keyframes exist, renamed, and the originals are gone', () => {
    expect(keyframeNames.sort()).toEqual(['lp-blink', 'lp-pop', 'lp-pulse', 'lp-rise'].sort());
  });

  test('every animation: / animation-name: reference uses an lp-prefixed name, and no bare pulse/rise/pop/blink keyframe reference remains', () => {
    const animationDeclarations = cleaned.match(/animation(?:-name)?\s*:\s*[^;]+;/g) || [];
    expect(animationDeclarations.length).toBeGreaterThan(0);
    const unrenamed = animationDeclarations.filter((decl) =>
      /\b(pulse|rise|pop|blink)\b/.test(decl) && !/\blp-(pulse|rise|pop|blink)\b/.test(decl)
    );
    expect(unrenamed).toEqual([]);
  });

  test('the deleted document-global rules (html/body overflow, html scroll-behavior) are not present', () => {
    expect(cleaned).not.toMatch(/\bhtml\s*,\s*body\s*\{/);
    expect(cleaned).not.toMatch(/\bhtml\s*\{\s*scroll-behavior/);
  });

  test('custom properties live on .landing-root, not :root', () => {
    expect(cleaned).not.toMatch(/:root\s*\{/);
    expect(cleaned).toMatch(/\.landing-root\s*\{\s*\n\s*--ink:/);
  });
});
