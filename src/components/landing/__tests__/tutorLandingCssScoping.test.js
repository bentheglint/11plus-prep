// Guard test for tutor-landing.css scoping, mirroring
// __tests__/landingCssScoping.test.js for the main landing page.
//
// deploy.sh's Puppeteer smoke runs with REACT_APP_SMOKE_MODE=true, which
// makes AuthGate skip the entire signed-out tree, and /for-tutors bypasses
// AuthGate entirely (see src/index.js), so an unscoped selector here would
// deploy green and only show up as a visual regression against the rest of
// the app. This test reads tutor-landing.css as text and asserts every rule
// is properly namespaced under .tutor-landing-root, so a future edit can't
// silently reintroduce a document-global leak.
//
// This is a "derive-or-pin" test per the project's duplicated-truth doctrine
// (CLAUDE.md): it parses the real file rather than hand-copying its selectors.

const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'tutor-landing.css');
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

describe('tutor-landing.css scoping guard', () => {
  const cleaned = stripComments(raw);
  const { selectors } = collectRules(cleaned);

  test('parsed at least a representative number of rules (sanity check on the parser itself)', () => {
    expect(selectors.length).toBeGreaterThan(50);
  });

  test('every top-level/media-nested selector list is scoped under .tutor-landing-root', () => {
    const offenders = [];
    selectors.forEach((sel) => {
      // A selector list may be comma-separated (e.g. "h1,h2,h3,h4" or
      // ".tutor-landing-root h1,.tutor-landing-root h2"). EVERY branch must
      // be scoped.
      const branches = sel.split(',').map((s) => s.trim()).filter(Boolean);
      branches.forEach((branch) => {
        if (!branch.startsWith('.tutor-landing-root')) {
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
        // which the mockup never uses, and not ".tutor-landing-root html"
        // which would be nonsensical and also never appears).
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

  test('the document-global rules from the mockup (html/body overflow, html scroll-behavior) are not present', () => {
    expect(cleaned).not.toMatch(/\bhtml\s*,\s*body\s*\{/);
    expect(cleaned).not.toMatch(/\bhtml\s*\{\s*scroll-behavior/);
  });

  test('custom properties live on .tutor-landing-root, not :root', () => {
    expect(cleaned).not.toMatch(/:root\s*\{/);
    expect(cleaned).toMatch(/\.tutor-landing-root\s*\{\s*\n\s*--ink:/);
  });

  test('scroll-behavior:smooth is scoped to .tutor-landing-root rather than applied document-wide', () => {
    expect(cleaned).toMatch(/\.tutor-landing-root\{[^}]*scroll-behavior:smooth/);
  });

  test('font tokens point at the self-hosted variable fonts, not a Google Fonts CDN', () => {
    expect(cleaned).toMatch(/--sans:"DM Sans Variable"/);
    expect(cleaned).toMatch(/--display:"Outfit Variable"/);
    expect(cleaned).not.toMatch(/fonts\.googleapis\.com/);
    expect(cleaned).not.toMatch(/fonts\.gstatic\.com/);
  });
});
