# Shareable Progress Card (Growth Loop 2) — v1 Plan

**Status:** Approved by Ben 17 Jul 2026 (design); adversarially reviewed by
Codex 17 Jul — 11 challenges, all absorbed below (see "Adversarial review
outcomes")
**Owner:** Fable designs/reviews, Sonnet builds
**Council input:** Marketing & Growth Council consulted 17 Jul (Mazal, Longton,
Parvez, Brooker, Chaudhary, Whately, Hatvany, Eyal voices) — findings below are
load-bearing design constraints, not decoration.

## Goal

Give parents a beautiful, WhatsApp-shareable celebration of their child's
practice effort, so PrepStep travels parent-to-parent into school-year groups.
Amplify (Loop 2) in the growth engine: seen card → curious parent → free
practice taste → trial.

## The load-bearing design decision

The card celebrates **effort and consistency, with the child as the hero**.
Never ability, never comparison. Rationale (council, converging from three
directions):

- Duolingo's growth did NOT come from sharing streaks; their built-for-purpose
  referral programme flopped (+3%). What spreads is the milestone trophy and
  the aggregate ("Wrapped"), not the daily token (Mazal).
- A UK school-year WhatsApp group is a room of rivals for the same grammar
  places. Ability brags are socially unshareable there (competitive-parenting
  taboo, Longton); effort stories are generous and safe.
- Effort framing is privacy-safe by construction: no scores, no rankings, no
  weaknesses, nothing a rival parent can use.

## V1 scope

### 1. The card (Parent Dashboard section: "Celebrate their progress")
- Pure inline **SVG component** (diagram-design tokens apply; this is a
  designed artefact, not a data dump). Aesthetic brief: warm, celebratory,
  distinctive — NOT default-Claude purple-gradient slop. Child first name
  only. PrepStep as a quiet footer with prepstep.co.uk/card.
- Content (rolling last 30 days, derived client-side from data already loaded
  for the dashboard): questions answered, days practised (of 30), topics
  explored. Seasonal title skin Jun–Sep ("{Name}'s Summer of Prep"),
  neutral otherwise ("{Name}'s month of prep").
- Preview-first: parent always sees exactly the artefact before any share.
- HARD EXCLUSIONS (enforced by test): no scores, percentages, accuracy,
  readiness bands, ranks, weak topics, surname, or photo. The derivation
  function's output type contains only the allowed fields.

### 2. Export + share (iOS 15.6 Safari floor — constrains everything)
- NO html-to-image / foreignObject (Safari-hostile). Path: serialise the SVG
  string → `new Image()` via data/blob URL → `canvas.drawImage` → `toBlob`
  PNG. All Safari 15 safe.
- Fonts: the SVG must render with a **system font stack** (fonts do not load
  inside SVG-as-image in Safari; no external/data-URI fonts on the export
  path). Design within that constraint.
- Share: `navigator.canShare({ files })` → native sheet with PNG + text +
  link (iOS 15+, Android Chrome). Fallback (desktop): download PNG button +
  copy-link button. Share text: one warm sentence + link.
- Link: `https://prepstep.co.uk/card` (path IS the attribution — Cloudflare
  Web Analytics logs paths, so any /card pageview = loop traffic).

### 3. Recipient landing: `public/card/index.html` (static, value-first)
- Same self-contained static pattern as the practice pages (can be
  hand-authored; doesn't need the SSR generator). NOT a signup wall.
- Content: what the card represents (a month of consistent 11+ practice),
  2–3 proof points a sceptical parent respects (question-bank scale, GL
  coverage nationally, teach-first method), one tap into `/practice/...`
  (real free questions, no account), then the Start-free CTA to the main
  landing. Copy must sing; British English; no em dashes.

### 4. "How did you hear about us?" (catches the screenshot shares)
- One-tap, skippable chips shown once post-signup (parent flow, after child
  creation — never blocks onboarding): Another parent shared a progress card /
  My child's tutor / Search or AI answer / Word of mouth / Somewhere else.
- Storage: `accounts.heard_about TEXT` — **migration 0020**, single additive
  ALTER TABLE ADD COLUMN (playbook-safe class; full ceremony still applies:
  staging test vs fresh snapshot, pre-apply snapshot, tracked
  `wrangler d1 migrations apply`).
- Worker: accept the value on an existing or small new endpoint
  (validated against the fixed option list, one write, idempotent).
- Admin: tiny "How parents heard" tally on the existing admin screen (else
  the data is a silent grave).

### 5. Tests (commit with the feature)
- Derivation: correct 30-day windows, days-practised count, topics count;
  graceful zero-data state (card section hidden below a minimum threshold —
  an empty card is a sad card; threshold: ≥3 practice days in window).
- Forbidden-fields: the card payload/type can never carry excluded data.
- Share URL + share-text format.
- Worker: heard_about endpoint validation + write; schema parity per rules.
- Migration 0020 staging test (node:sqlite harness pattern from 0019).

## Non-goals (v1)
- No referral bounty on the card (poisons the pride artefact — Mazal flop +
  Longton authenticity; if ever incentivised, reward the RECIPIENT with a
  longer trial, never cash to the sharer).
- No child-initiated sharing; no share affordance in the child view at all.
- No score / readiness / rank cards. Readiness stays inside the dashboard.
- No per-card personalised OG previews (v2 candidate: Worker route with
  dynamic og:title; adds storage + moderation surface, defer).
- No auto-posting of anything, anywhere.
- No streak-pressure mechanics aimed at the child (Eyal facilitator-not-
  dealer line).

## Risks / honest limits
- **Slow-compounding channel** (council flag): one card into a 30-parent
  group reaches a handful of 11+ families. Treat as a seed; Ben hand-plants
  the first real one (Evie's card into the year group). Not a month-one
  engine.
- Screenshot shares carry no link — that's what the survey chip is for.
- CF Analytics won't attribute past the landing (cookieless); the survey is
  the deeper-funnel signal.
- iOS 15.6 export path must be verified on a real device before calling
  done (bundle-compat guard does not catch runtime API gaps).

## Adversarial review outcomes (Codex, 17 Jul — all accepted)

1. **Preview IS the export.** The dashboard preview renders the SAME
   serialised, self-contained SVG as an `<img>` (not a separate live DOM),
   so what the parent sees is pixel-identical to the shared PNG. Kills both
   the export-equivalence and preview-mutation challenges at the root.
2. **Fully self-contained SVG.** All styling as SVG presentation attributes /
   inline style. NO Tailwind classes, CSS variables, external refs, filters,
   or masks on the card component. Test: rendered markup contains no
   `class=` attribute. Fixed export dimensions 1080×1080, devicePixelRatio-
   independent; long-first-name font step-down rule with a test.
3. **Web Share is best-effort.** WhatsApp may drop text/url when sharing
   files. Therefore the URL on the card image is the durable carrier: footer
   must be LEGIBLE at thumbnail size (readable at 300px-wide render — test
   the font size floor), while staying visually quiet (no CTA shout). Share
   call tries files+text+url and degrades gracefully; copy-message fallback
   provided.
4. **/card is a directional signal, not attribution truth.** Nothing inside
   the app or site ever links to /card (it exists only on shared artefacts),
   which removes most false positives; screenshots still bypass it. Honest
   read: /card pageviews + survey chips = two lossy signals read together.
5. **Privacy wording corrected.** The card is not "privacy-safe by
   construction" — first name + practice metadata in a school-year group is
   identifiable child data. Correct posture: data-minimised by design, and
   the PARENT makes a deliberate, previewed disclosure. Add a name toggle at
   generation time: first name ⇄ "my child". Nothing about weaknesses,
   scores, or ranks can appear regardless.
6. **Survey is inline, not interstitial.** A dismissible one-tap chip row on
   the parent dashboard's first visit (never a modal, never in onboarding,
   never child view) — the repo has prior form on post-signup interstitials
   going wrong. Self-report is systematically incomplete; treat as
   directional.
7. **No export from degraded data.** The card section hides when data came
   from the stale-cache fallback or while offline; derivation is keyed to
   the active child id. Test both.
8. **Day bucketing in Europe/London**, derived consistently from timestamps;
   DST-boundary test.
9. **Migration order + resilience.** Migrate 0020 before worker deploy;
   worker endpoint tolerates the column being absent (500-proof); PRAGMA
   check against prod before deploy per repo rule 2.
10. **Landing-page truth parity.** Any factual claim on /card (question
    counts etc.) is injected at build time from the question-data source or
    pinned by a parity test — no hand-maintained numbers (duplicated-truth
    rules).
11. **Real-device iOS 15.6 verification** remains a hard gate before "done"
    (compat guard cannot catch runtime API gaps).

## Acceptance criteria
- [ ] Parent dashboard shows the card with real derived data (questions,
      days-of-30, topics), first name only, ≥3-practice-day threshold
- [ ] Forbidden-fields test proves no scores/ranks/readiness/weak-topics/
      surname can appear
- [ ] Native share sheet with image + link on mobile; download + copy-link
      on desktop; export works on iOS 15.6 Safari
- [ ] prepstep.co.uk/card serves the value-first page with one-tap free
      practice; /card pageviews visible in CF Analytics
- [ ] Signup survey stores a validated heard_about value; admin tally visible
- [ ] Zero share affordances in the child view
- [ ] All suites green; deploy via bash deploy.sh; migration 0020 via full
      ceremony
