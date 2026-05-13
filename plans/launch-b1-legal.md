---
title: Launch Readiness B1 — Legal Docs (Privacy Policy + ToS + Cookie consent + DPIA)
date: 2026-05-06
status: DRAFT — pending senior-dev review
parent-plan: plans/launch-readiness-plan.md
---

# B1 — Legal Documents

## What's already in place

Before building anything, here is the current state:

| Item | Status | Detail |
|------|--------|--------|
| Consent timestamp | ✅ Done | `consent_given_at TEXT NOT NULL` + `consent_version TEXT NOT NULL` in D1 accounts table |
| Consent recording | ✅ Done | `AuthGate.js` posts `consentVersion: "1.0"` to Worker on first login; Worker stores it in D1 |
| GDPR cascade DELETE | ✅ Done | FK chains from accounts → children → all downstream tables with `ON DELETE CASCADE` |
| No tracking cookies | ✅ Done | App uses Clerk auth cookies (essential/functional) + localStorage only. No analytics, no third-party trackers |
| Published Privacy Policy | ❌ Missing | No /privacy page |
| Published Terms of Service | ❌ Missing | No /terms page |
| Cookie consent banner | ❌ Missing | No banner |
| DPIA document | ❌ Missing | Not drafted |
| Footer with legal links | ❌ Missing | App has no footer |
| Signup flow links to legal | ❌ Missing | AuthGate has no ToS/Privacy links at signup |

## Cookie situation analysis

This is simpler than a typical SaaS product:

**Cookies in use:**
- Clerk session cookies — set by Clerk SDK during login. These are strictly necessary/functional cookies required for the service to operate. No consent required under PECR (they fall under the "strictly necessary" exemption).
- localStorage — not cookies. No PECR consent requirement.
- No analytics (no GA, no Mixpanel, no Hotjar)
- No advertising / third-party trackers

**Conclusion:** We do not need a full cookie consent popup with categories. We need a simple first-visit notice explaining we use essential cookies for login, with a link to the Privacy Policy. This satisfies PECR without adding friction. Revisit if analytics are ever added.

## AADC relevance assessment

The Age Appropriate Design Code (Children's Code) applies to "information society services likely to be accessed by children". An 11+ exam prep app is obviously in scope.

The 15 AADC standards and their applicability:

| Standard | Applies? | Action required |
|----------|----------|-----------------|
| 1. Best interests of child | Yes | Reflected in Privacy Policy tone + data minimisation |
| 2. Data Protection Impact Assessment | Yes | **Draft DPIA** — most significant gap |
| 3. Age appropriate application | Yes | All users are children or their parents; high-privacy defaults already set |
| 4. Transparency | Yes | **Child-friendly privacy notice** required (plain English, not legalese) |
| 5. Detrimental use of data | Yes | We don't profile for commercial purposes — document this explicitly |
| 6. Policies and community standards | Yes | ToS must cover conduct expectations for a child-facing service |
| 7. Default settings | Yes | Document that all defaults are privacy-protective (no profiling, no geolocation, no sharing) |
| 8. Data minimisation | Yes | Document in Privacy Policy: we collect name + email + quiz progress only |
| 9. Data sharing | Yes | Document: we share data with Clerk (auth), Cloudflare (hosting), no third-party ad networks |
| 10. Geolocation | N/A | Not used |
| 11. Parental controls | Partial | Parent dashboard exists; document it |
| 12. Profiling | Partial | We use quiz history to personalise topic suggestions — low-risk educational profiling; document + disable commercial profiling explicitly |
| 13. Nudge techniques | N/A | No dark patterns; confirm in DPIA |
| 14. Connected toys and devices | N/A | Web app only |
| 15. Online tools | Yes | "Undo" for account creation — data subject rights (B6); document the gap + reference B6 as follow-on |

**Highest-priority AADC gaps:** Standard 2 (DPIA), Standard 4 (transparent child-friendly notice), Standard 8 (documented data minimisation).

## What needs building

### 1. Privacy Policy (/privacy)

**Content requirements (GDPR Article 13 + AADC Standard 4):**
- Who we are: PrepStep / Ben Jackson, contact email
- What data we collect: name, email address, quiz progress, performance history, consent timestamp
- Why we collect it (lawful basis): legitimate interests for educational personalisation; contract performance for account management; consent for marketing emails (if any — not yet)
- How long we keep it: active while account is live; 30-day soft-delete grace after account deletion; hard-delete thereafter
- Who we share it with: Clerk (authentication), Cloudflare (hosting + D1), Backblaze B2 (encrypted backups)
- Children's privacy: this service is for children; parents create accounts on behalf of children; we do not allow children to sign up without parental involvement (Clerk + our age gate in AuthGate)
- Data subject rights: right to access, rectification, erasure, portability, objection — with links to B6's self-serve flow once built; interim: contact email
- Cookie notice: we use essential cookies for login only (Clerk); no tracking or advertising cookies
- ICO registration: state whether registered (if not, consider whether required — likely yes at launch)
- AADC commitment: high-privacy defaults, no commercial profiling, no nudge techniques

**Tone:** Plain English. Two versions: standard version + a short "for children" summary at the top (AADC Standard 4 requires age-appropriate transparency).

### 2. Terms of Service (/terms)

**Content requirements:**
- Service description: exam preparation tool, not a school, not an official GL Assessment product
- Who can use it: parents/guardians signing up on behalf of children aged 8-13 preparing for 11+ exams
- Account creation: parent/guardian must be 18+; child cannot create their own account
- Subscription and payment: what you're paying for, what happens if payment fails, how to cancel
- Liability cap: our liability is limited to the amount paid in the last 12 months (standard SaaS cap)
- No guarantee of exam success: educational tool only; we make no warranty of exam outcomes
- Acceptable use: no sharing accounts, no scraping, no reverse engineering
- Intellectual property: question content, explanations, and micro-lessons are our IP
- Data and account deletion: parent can request deletion at any time; we delete per our Privacy Policy
- Governing law: English law, England and Wales courts
- Contact for disputes: contact email

### 3. Cookie notice (not a full consent banner)

Since we only use strictly necessary cookies, we don't need an opt-in consent mechanism. We need:
- A dismissible first-visit banner: "We use essential cookies to keep you logged in. No tracking or advertising cookies. [Learn more] [OK]"
- "Learn more" links to the cookies section of /privacy
- Choice persists in localStorage (no irony — it's the appropriate tool for storing a UI preference)
- Banner does not fire on /privacy or /terms pages (unnecessary)

Implementation: a simple React component in `src/components/CookieBanner.js`, shown from `App.js` when `localStorage.getItem('cookie_notice_dismissed')` is falsy.

### 4. DPIA (Data Protection Impact Assessment)

This is a document, not code. Required by AADC Standard 2 before processing children's data at scale.

**DPIA must cover:**
- Description of the processing: what data, collected how, stored where, retained how long
- Necessity and proportionality: why each data item is needed
- Risks: data breach (mitigations: encryption at rest in D1, encrypted B2 backups), unauthorised access (mitigations: Clerk auth + D1 scoping), profiling risk (mitigations: educational purpose only, no commercial use)
- Children-specific risk assessment: AADC Standards checklist
- Residual risks and mitigations
- Consultation: note this is a sole-operator product; no DPO required at this scale (ICO guidance: SMEs processing data about children may need to register with ICO but don't need a DPO unless it's core/large-scale)
- Review cadence: DPIA should be re-reviewed when any new data practice is introduced

**Where it lives:** `~/Documents/My Brain/content/prepstep-dpia-v1.md` — not committed to the public repo; it's an internal operational document.

### 5. Footer component

A persistent footer on every screen linking to /privacy, /terms, and a contact email. Should be:
- Subtle — doesn't dominate the child-facing UI
- Present on home, topics, quiz completion, and settings screens
- Not shown mid-quiz (distraction risk) or mid-lesson
- Mobile-friendly

Implementation: `src/components/Footer.js`, added to `App.js` outside the main quiz flow conditional.

### 6. Signup flow links

`AuthGate.js` must show "By continuing, you agree to our [Terms of Service] and [Privacy Policy]" before the Clerk sign-up widget renders. This is the "informed consent at signup" moment required by GDPR Article 7 for services processing children's data.

The current `consent_version: "1.0"` recording already captures the timestamp — we just need the visible disclosure to be present.

## Implementation approach

**React routing:** The app currently uses state-driven navigation, not React Router. Options:
1. Add React Router just for /privacy and /terms (adds a dependency, breaks the no-router pattern)
2. Serve /privacy and /terms as separate static HTML files in `public/` (simplest, no dependency)
3. Handle them as app-state views like other screens (consistent, no dependency, slightly more work)

**Recommendation: Option 2** — static HTML files in `public/`. The legal pages don't need React — they're static documents. This keeps the app architecture clean, works with Cloudflare Pages routing, and the content can be updated without a React rebuild. A basic header with the PrepStep logo and a link back to the app is sufficient.

**Cookie banner:** React component, renders from App.js, persists dismissal in localStorage. ~50 lines.

**Footer:** React component, ~30 lines. Added to App.js around the existing screen switcher.

**AuthGate consent text:** Edit `src/components/AuthGate.js` — add 2 lines of styled text above the Clerk widget.

**DPIA:** Written in Markdown in My Brain, not shipped in the app.

## Acceptance criteria (from launch-readiness-plan.md B1)

- [ ] Privacy Policy drafted, reviewed for AADC compliance, published at /privacy
- [ ] Terms of Service drafted, includes liability cap + child consent handling, published at /terms
- [ ] Cookie notice shown on first visit; dismissible; persists in localStorage; links to /privacy cookies section
- [ ] DPIA document drafted and saved to My Brain
- [ ] Footer present on home/topics/results screens with links to /privacy, /terms, contact email
- [ ] AuthGate shows "By continuing you agree to [ToS] and [Privacy Policy]" before signup

## What this plan does NOT cover

- ICO registration (B1 surfaces this as a gap; Ben to investigate and register if required — takes ~15 min, £40/year for the smallest tier)
- Self-serve data deletion / download (B6 — separate blocker)
- Email unsubscribe / preference centre (S7 — separate should-have)
- Stripe terms / payment-specific disclosures (B4)

## Estimate

- Drafting legal text: 2-3 hours (using this plan as the brief, plus ICO guidance templates)
- Implementing static /privacy and /terms pages: 1 hour
- Cookie banner component: 30 mins
- Footer component: 30 mins
- AuthGate consent text: 15 mins
- DPIA document: 1-2 hours
- Total: ~1 day

## Review gates (per locked process)

1. Senior-dev review of this plan (focus: any legal/regulatory gap in the AADC analysis, cookie exemption claim, DPIA scope)
2. Codex adversarial review of the implementation (focus: consent recording correctness, cookie banner bypass paths, routing approach)
3. Build
4. Verify against all acceptance criteria
