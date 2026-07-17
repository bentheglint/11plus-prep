/**
 * Shareable Progress Card, recipient landing page tests
 * (plans/shareable-progress-card.md, section 3 + adversarial-review
 * outcome 10 "Landing-page truth parity")
 *
 * public/card/index.html is the static, value-first page a parent lands on
 * after tapping the link on a shared progress card. It is hand-authored
 * (same pattern as the generated public/practice pages) so this test is
 * the only thing keeping its factual claims honest and its copy compliant
 * with CLAUDE.md's no-em-dash rule.
 *
 * Covers:
 * - The file exists at the path Cloudflare Pages serves for /card
 * - Required Open Graph tags are present with the approved values
 * - The question-count claim on the page never overstates the REAL total
 *   derived live from the three question-data files (duplicated-truth
 *   rule, CLAUDE.md "Duplicated-Truth Rules")
 * - No em dash anywhere in the file (CLAUDE.md: no em dashes in
 *   consumer-facing copy)
 */

import fs from 'fs';
import path from 'path';
import mathsData from '../../questionData/mathsData';
import englishData from '../../questionData/englishData';
import vrData from '../../questionData/vrData';

const CARD_HTML_PATH = path.join(__dirname, '..', '..', '..', 'public', 'card', 'index.html');

function realQuestionTotal() {
  let total = 0;
  for (const mod of [mathsData, englishData, vrData]) {
    for (const key of Object.keys(mod.topics)) {
      total += mod.topics[key].questions.length;
    }
  }
  return total;
}

describe('Shareable Progress Card landing page (public/card/index.html)', () => {
  test('the page file exists', () => {
    expect(fs.existsSync(CARD_HTML_PATH)).toBe(true);
  });

  const html = fs.readFileSync(CARD_HTML_PATH, 'utf8');

  describe('Open Graph tags', () => {
    test('og:title', () => {
      expect(html).toMatch(/<meta property="og:title"\s+content="A month of real 11\+ practice">/);
    });

    test('og:description is present and non-empty', () => {
      const match = html.match(/<meta property="og:description"\s+content="([^"]+)">/);
      expect(match).not.toBeNull();
      expect(match[1].trim().length).toBeGreaterThan(20);
    });

    test('og:image references the landing-shots asset', () => {
      expect(html).toMatch(/<meta property="og:image"\s+content="https:\/\/prepstep\.co\.uk\/landing-shots\/01-home\.webp">/);
    });

    test('og:url', () => {
      expect(html).toMatch(/<meta property="og:url"\s+content="https:\/\/prepstep\.co\.uk\/card">/);
    });
  });

  describe('og:image asset actually exists in public/', () => {
    test('01-home.webp is present', () => {
      const imagePath = path.join(__dirname, '..', '..', '..', 'public', 'landing-shots', '01-home.webp');
      expect(fs.existsSync(imagePath)).toBe(true);
    });
  });

  describe('Question-count truth parity (binding: adversarial-review outcome 10)', () => {
    test('the real, derived question total is what CLAUDE.md documents (sanity check on the derivation itself)', () => {
      // If this drifts, the content bank has changed size, update the
      // conservative claim below (and CLAUDE.md's content-bank table) only
      // after confirming the real number with scripts/count-content.js.
      expect(realQuestionTotal()).toBeGreaterThanOrEqual(8000);
    });

    test('the page never claims more questions than actually exist', () => {
      const match = html.match(/More than ([\d,]+) GL-style questions/);
      expect(match).not.toBeNull();
      const claimed = parseInt(match[1].replace(/,/g, ''), 10);
      expect(claimed).toBeLessThanOrEqual(realQuestionTotal());
    });
  });

  describe('Copy compliance', () => {
    test('contains no em dash anywhere in the file', () => {
      // U+2014 EM DASH. CLAUDE.md: "No em dashes in consumer-facing copy."
      // Checked over the whole file (not just visible text) since a stray
      // em dash in a meta description or title would still ship to users.
      expect(html).not.toMatch(/—/);
    });

    test('carries the approved verbatim copy blocks', () => {
      expect(html).toContain("You've just seen a month of real work.");
      expect(html).toContain('A few minutes of 11+ practice on most days adds up faster than anyone expects');
      expect(html).toContain('an 11+ practice app built by a parent taking his own children through the exam');
      expect(html).toContain('A short lesson before every focused quiz, so there is no cold testing');
      expect(html).toContain('A parent dashboard that names the exact topics to work on next');
      expect(html).toContain('PrepStep, made in the UK.');
      expect(html).toContain('prepstep.co.uk');
    });

    test('primary CTA appears twice, linking to /practice', () => {
      const matches = html.match(/href="\/practice" class="btn-primary">Try real questions now, free, no account</g);
      expect(matches).not.toBeNull();
      expect(matches.length).toBe(2);
    });

    test('secondary CTA links to the main signup flow', () => {
      expect(html).toMatch(/href="\/" class="btn-secondary">Start free with full access for 30 days, no card needed/);
    });
  });

  describe('Mobile-first / self-contained requirements', () => {
    test('has a mobile viewport meta tag', () => {
      expect(html).toMatch(/<meta name="viewport" content="width=device-width, initial-scale=1">/);
    });

    test('loads no external stylesheets or scripts other than the CF Analytics beacon', () => {
      // Only checks resources the browser actually FETCHES (script src= and
      // link rel=stylesheet href=) - not same-origin metadata links like
      // <link rel="canonical"> or og:url content, which never trigger a
      // network request.
      const scriptSrcs = [...html.matchAll(/<script[^>]*\bsrc="([^"]+)"/g)].map((m) => m[1]);
      const stylesheetHrefs = [...html.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g)].map((m) => m[1]);
      const loadedResources = [...scriptSrcs, ...stylesheetHrefs];
      const disallowed = loadedResources.filter((url) => !url.includes('static.cloudflareinsights.com'));
      expect(disallowed).toEqual([]);
    });
  });
});
