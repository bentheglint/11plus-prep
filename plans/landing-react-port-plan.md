# Landing Page React Port — Finalised Plan

**Status:** Approved, not yet built. Build scheduled for next session.
**Date finalised:** 11 Jul 2026
**Reviews:** Codex (self-contained) + Fable (code-grounded) adversarial reviews, both
verdict REVISE-not-rethink. This plan folds in every must-fix. Fable's review was the
stronger (it read the actual code and verified the risks); where the two disagreed,
this plan follows Fable, with rationale noted.

Model plan: build delegated to **Sonnet** subagents; Opus orchestrates + runs the
verify pass (Visual QA of the landing AND a signed-in screen to prove zero CSS leak,
plus the acceptance checklist).

---

## The reframe (why this is a REPLACEMENT, not a new route)

The app has NO router; everything renders through Clerk's `AuthGate`
(`src/components/AuthGate.js`). AuthGate ALREADY contains a basic `LandingPage`
component (lines ~50-117) and a signed-out state machine
(`authView: landing | signin | signup`, line ~381; signed-out render branch ~895-953).
When a visitor is not signed in, AuthGate already renders a landing page and exposes
callbacks `onSignIn` / `onSignUp` / `onTutorSignup` / `inviteCode` wired to Clerk's
`<SignIn>` / `<SignUp>`.

So the task is: **replace the existing basic `LandingPage` with a rich one built from
the QA'd mockup (`design-mockups/landing/landing-prepstep.html`), reusing the existing
auth plumbing.** Not a new route. AuthGate's signed-out branch keeps calling
`<LandingPage onSignIn onSignUp onTutorSignup inviteCode />`; the old inline component
is deleted.

---

## Target structure

```
src/components/landing/
  LandingPage.js        ← top-level; same props AuthGate passes today
  TutorDemo.js          ← the NODES state machine -> React useState
  ParentCarousel.js     ← autoplay + arrows + dots (useRef/useEffect)
  useScrollReveal.js    ← IntersectionObserver hook
  landing.css           ← ALL mockup CSS, namespaced under .landing-root
  __tests__/
    landingCssScoping.test.js   ← selector-guard (see must-fix 4)
    landingCtas.test.js         ← render + CTA-fire (see must-fix 4)
public/landing-shots/   ← the 12 (of 18) PNGs the mockup references, COMPRESSED
public/index.html       ← head meta fix (must-fix 5)
```

The 12 referenced PNGs (only these; NOT the other 6, and NOT the seed .js files):
01-home, 02-progress-journey, 03b-parent-focus, 03-parent-topics, 04-mistakes,
05-microlesson-hook, 06-quiz, 07-quiz-tutor, p-consistency, p-headline, p-readiness,
p-speed-accuracy.

---

## MUST-FIX LIST (all must be in before build is "done")

### Blocking — ships broken or breaks the signed-in app

1. **Add a Sign In affordance + a tutor entry point to the new landing.** The mockup has
   NEITHER, but the current landing does and both callbacks are load-bearing: the
   commonest root visitor is a RETURNING signed-out parent (needs Sign In), and the
   tutor funnel (`?tutor=1`, `/join/<code>`) is a live acquisition channel. Add Sign In
   to the nav (must survive below 900px where `.nav-links` is `display:none` — put it in
   `.nav-cta`) wired to `onSignIn`; add a tutor link (footer "For tutors" is the natural
   home) wired to `onTutorSignup`.

2. **Keep `InviteBanner` + the tutor-token banner rendering ABOVE the landing.** AuthGate
   renders the tutor-token banner as a sibling (~936-940) and passes `inviteCode` to the
   comp-code `InviteBanner` (currently inside LandingPage, ~53). The new component must
   keep rendering `InviteBanner`, or comp-code visitors lose their "free access"
   confirmation. The `?tutor=1` / invite / join query flows themselves are handled in
   AuthGate BEFORE the landing renders and are not touched.

3. **CSS scoping specifics (verified real leaks, not theoretical):**
   - **Prefix all four `@keyframes`** (`pulse`, `rise`, `pop`, `blink`) to `lp-*` in BOTH
     the declaration and every `animation:` shorthand. `pulse` ACTIVELY collides with
     Tailwind's `animate-pulse` used on the app's "Loading…" screens (AuthGate.js:889,
     968, 1026) — keyframes are document-global, last declaration wins, so unprefixed it
     silently changes every loading animation in the signed-in app.
   - **Delete `html{scroll-behavior:smooth}`** (mockup line 36). `App.js:271` and
     `ParentDashboard.js:42` call `scrollTo(0,0)` on view change; global smooth scroll
     turns every in-app transition into a visible animated scroll. Implement the landing's
     anchor-nav smooth scrolling with `scrollIntoView({behavior:'smooth'})` in a click
     handler inside the landing component; skip smooth under `prefers-reduced-motion`.
   - **Do NOT put `overflow-x:hidden` on `.landing-root`.** The mockup nav is
     `position:sticky` (line 90); a non-visible-overflow ancestor breaks sticky, and the
     escape hatch `overflow:clip` is Safari 16+ (forbidden at the iOS 15.6 floor). Delete
     the `html,body{overflow-x:hidden}` rule and QA at 320px for horizontal overflow
     (visible pokes — carousel arrows `left:-8px`, step risers `right:-22px` — sit inside
     the 22px `.wrap` padding, so it should be clean, but verify).
   - **Declare the landing's custom properties on `.landing-root`, not `:root`.** No name
     collision today (app uses `--primary/--text/--surface`, mockup uses
     `--ink/--brand/--paper`), but leaving them on `:root` is a drift trap.
   - Note `.btn-primary` exists in both the app's index.css:153 (used in 18 files) and the
     mockup:73. Namespacing wins on specificity, but QA the landing side-by-side against
     the mockup: the app's Tailwind preflight and its global 12px scrollbar styling
     (index.css:226-252) now apply inside the landing — expect small fidelity diffs.

4. **Add two guard tests that slot into the existing test run** (`deploy.sh` is otherwise
   BLIND to this whole surface — its Puppeteer smoke runs with `REACT_APP_SMOKE_MODE=true`,
   which makes AuthGate skip the entire signed-out tree, AuthGate.js:366-373, so dead CTAs
   / a crashed TutorDemo / a blank signed-out page would all deploy GREEN):
   - `landingCssScoping.test.js`: parse `landing.css`, assert every top-level selector
     starts with `.landing-root`, every `@keyframes` name is `lp-` prefixed, and no
     `html` / `body` / `:root` / bare `*` selectors exist. (This is the project's own
     "duplicated-truth needs a pin test" doctrine applied to CSS scoping.)
   - `landingCtas.test.js`: render `LandingPage` with mock callbacks, click Start free /
     Sign In / tutor link, assert the right callback fires.

5. **Fix `public/index.html` head (live bug, independent of this port).** The static head
   currently says "GL Assessment grammar school entrance" (banned exam-board string) in the
   meta + og/twitter descriptions, and uses an em dash in the `<title>`/`og:title`
   ("PrepStep — Step-by-step..."). A CRA SPA serves that static head to crawlers and social
   unfurlers, so Google snippets and WhatsApp shares currently violate our own rules. Port
   the mockup's title/description (mockup lines 6-7). `og:image` is absent — fine to leave,
   but note it explicitly.

### Launch gates (content, not code)

6. **Testimonial gate covers BOTH the `.quotes` section AND the trust-strip quote**
   (mockup lines 530-534 — a second placeholder that's easy to miss because it lives
   outside `.quotes`). Build both to hide cleanly when no real quotes are supplied.
   **This is why quotes do NOT gate deployment:** we ship with the sections hidden and add
   real quotes whenever. Council's hard gate = real-in or hidden, never fake.

7. **Footer legal links -> the real pages.** `privacy.html`, `terms.html`, `help.html`,
   `tutor-terms.html` exist in `public/` and Cloudflare Pages serves them ahead of the
   `/*` SPA rewrite. Wire Privacy + Terms + Help. **DROP the "Safeguarding" link** (mockup
   footer) — there is no safeguarding page, and a dead safeguarding link on a children's
   product is worse than none. (Ben's call, 11 Jul: drop it for now.)

8. **Copy truth-check before ship:** verify "ten questions a day" and "free for 30 days"
   against the worker's real cap / trial-length constants; "£24.99/£199" already matches
   live Stripe (Ben confirmed 11 Jul). "Free for families on Free School Meals or Pupil
   Premium" is an existing policy commitment (Ben confirmed he stands behind it, 11 Jul).

### Quality / robustness

9. **Reduced motion:** gate the carousel's 5s autoplay `setInterval` and the demo's
   typing-dots choreography on `matchMedia('(prefers-reduced-motion: reduce)')`. (CSS
   already covers `.rise`/`.msg`/`.choice`; the JS-driven bits are the gap.)

10. **Accessibility:** preserve `role="log" aria-live="polite"` on the demo chat and real
    `<button>` choices; carousel needs keyboard nav + visible focus states; check alt text
    on all 12 images survives the JSX port.

11. **React 19 StrictMode double-fires effects in dev** (index.js wraps in StrictMode). The
    demo's mount-time `goNode('start')` setTimeout chain and the carousel interval need
    proper cleanup or you get doubled intro messages + doubled autoplay in dev (flaky QA).

12. **Compress the 12 PNGs (~3.5MB -> under 1MB).** p-headline.png is 489KB,
    04-mistakes.png 545KB. Use WebP (Safari 14+, inside the floor) or crushed PNGs at
    display resolution. Keep every `loading="lazy"` (mockup has them). Hero is text-only so
    LCP stays fast. Do NOT copy `seed-initscript.js` / `seed-parent-cache.js` into public/.

---

## Explicitly deferred (logged, NOT this task)

- **CSS Modules rewrite** — REJECTED. Fable's reasoning: the mockup's bare type selectors
  (`h1,h2,h3,h4`, `p`, `a`, `img`) compile to GLOBAL rules even inside `.module.css`, so
  you'd rewrite them under a wrapper anyway. Namespacing + the guard test (must-fix 4) is
  the right call and correctly sized for the product stage.
- **Code-splitting the landing** — REJECTED as wrong-term. The signed-OUT visitor already
  downloads the whole App.js bundle (all 8,210 questions are statically imported in
  index.js:8) plus Clerk before today's landing paints; ~20KB of landing code is noise.
  FOLLOW-UP (separate, measured with Lighthouse later): `React.lazy(() => import('./App'))`
  to take the question bank off the signed-out critical path. Not entangled with this task.
- **SSR / pre-render for SEO** — separate, bigger project. The in-scope slice is the head
  meta fix (must-fix 5).
- **Full responsive-image srcset pipeline** — not needed for launch; compression
  (must-fix 12) is enough.
- **CTA-click analytics** — excluded from v1. Flagged so nobody assumes conversion data
  will exist.

---

## Revised acceptance criteria

- [ ] Logged-out visitor at prepstep.co.uk sees the NEW polished landing, not the old basic one
- [ ] Nav has a working Sign In (opens Clerk sign-in) that survives below 900px; footer has a
      working tutor entry point (opens tutor sign-up)
- [ ] All 5 "Start free" CTAs open Clerk sign-up
- [ ] `InviteBanner` + tutor-token banner still render above the landing for invite/comp visitors
- [ ] Tutor demo runs the full Q1->Q2->Q3, hint branch, refusal moment, and reset, in React
- [ ] Parent carousel: arrows, dots, 5s autoplay that pauses on interaction; autoplay off under
      prefers-reduced-motion
- [ ] ZERO style regression in the signed-in app — proven by Visual QA of a loading screen +
      home screen before/after, AND the landingCssScoping guard test passing
- [ ] landingCtas test passes (deploy.sh gains real coverage of this surface)
- [ ] Renders correctly at 320px, 390px, and desktop (re-QA via Visual QA)
- [ ] No exam-board strings anywhere INCLUDING public/index.html; no em dashes in consumer copy;
      testimonial + trust-strip sections hide cleanly with no real quotes
- [ ] Footer Privacy/Terms/Help resolve to the real pages; no Safeguarding link
- [ ] 12 PNGs total under 1MB, all lazy-loaded
- [ ] `bash deploy.sh` passes (tests + smoke + bundle-compat) and deploys

---

## Build sequence (next session)

1. Move + compress the 12 PNGs into public/landing-shots/.
2. Extract landing.css from the mockup; scope under .landing-root; apply must-fix 3;
   write landingCssScoping.test.js FIRST (red), then make it green.
3. Build LandingPage.js markup from the mockup; add Sign In + tutor affordances; wire the
   5 CTAs + InviteBanner; write landingCtas.test.js.
4. Build TutorDemo.js (NODES -> useState), ParentCarousel.js, useScrollReveal.js — with
   StrictMode-safe cleanup + reduced-motion gating + a11y attributes.
5. Swap AuthGate's signed-out branch to the new component; delete the old inline LandingPage.
6. Fix public/index.html head.
7. Verify: Visual QA landing at 320/390/desktop + a signed-in loading & home screen
   (zero-leak proof); run the acceptance checklist; then `bash deploy.sh` (git fetch first).

## Note on deployment gating
Real testimonials do NOT gate deploying the landing — must-fix 6 hides the sections when no
quotes exist, so we can go live without quotes and add them later. The only true blockers are
the 12 must-fixes being done + the acceptance checklist passing.
