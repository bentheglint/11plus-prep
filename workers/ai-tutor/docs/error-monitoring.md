# Error Monitoring — Setup and Triage Runbook

## Overview

PrepStep uses Sentry for production error monitoring on both the React frontend and the Cloudflare Worker. Errors from both surfaces appear in the same Sentry project, tagged by environment and source.

The existing `/api/error-report` → KV → `/errors` dashboard remains as a lightweight fallback for errors captured before Sentry initialises.

---

## One-time Setup (Ben does this)

### 1. Create Sentry project

1. Go to sentry.io → sign up / log in
2. Create a new project → platform: **React**
3. Copy the DSN — looks like `https://abc123@o123.ingest.sentry.io/456`

### 2. Add DSN to React (Cloudflare Pages)

In the Cloudflare Pages dashboard → prepstep project → Settings → Environment variables:

| Variable | Value |
|----------|-------|
| `REACT_APP_SENTRY_DSN` | your DSN |
| `REACT_APP_VERSION` | e.g. `1.0.0` (optional — helps correlate releases) |

Re-deploy after adding.

### 3. Add DSN to Worker

```bash
cd workers/ai-tutor
wrangler secret put SENTRY_DSN
# paste the DSN when prompted
```

Re-deploy Worker: `wrangler deploy` from `workers/ai-tutor/`.

### 4. Configure Sentry alert rules (sentry.io dashboard)

In your Sentry project → Alerts → Create Alert Rule:

- **Condition:** A new issue is created
- **Action:** Send email to ben@venortech.com
- **Frequency:** Once per issue (not per occurrence — avoids spam)

This gives you one email per new error class, which is the right signal at 100 accounts.

---

## What gets captured

### React frontend
- All uncaught exceptions (via `window.onerror`)
- Unhandled promise rejections
- React render errors (via `ErrorBoundary.componentDidCatch`)
- Each error includes: message, stack trace, current view/screen, browser info
- **PII scrubbing:** email addresses and IP addresses are removed before sending

### Cloudflare Worker
- All unhandled Worker errors (via Sentry's `withSentry` wrapper)
- Includes: request path, method, error message, stack
- **PII scrubbing:** Sentry does not capture request bodies (no user data in transit)

### What is NOT captured
- Successful requests (no performance monitoring — `tracesSampleRate: 0`)
- Errors when the DSN env var is not set (graceful no-op)
- AI tutor request/response content (never logged)

---

## Triage process

### When you receive a Sentry alert email

1. **Click the issue link** in the email → lands on the Sentry issue page

2. **Read the breadcrumbs** — the sequence of events leading to the error (navigation, clicks, network requests)

3. **Check the Tags panel** (right side of the issue):
   - `view` — which screen the user was on (home / quiz / lesson / etc.)
   - `environment` — production vs development
   - `browser` — Safari/Chrome/Firefox (relevant for mobile layout bugs)

4. **Read the stack trace** — with source maps uploaded, you'll see the actual file and line number, not minified code

5. **Check the event count** — is this one user once, or many users repeatedly?

6. **Reproduce locally** if needed: use the screen name from the `view` tag to navigate directly

7. **Classify severity:**
   - **SEV 1 (fix now):** Affects payment flow, auth, or data loss — any error in `/api/stripe/*`, `/api/account` DELETE, or the batch write endpoint
   - **SEV 2 (fix today):** Affects core quiz or lesson experience — ErrorBoundary caught, child can't practise
   - **SEV 3 (fix this week):** Isolated UI bug, one user, non-blocking

8. **Resolve in Sentry** after deploying the fix — this closes the issue and resets the alert so you'll be notified if it regresses

---

## Source maps

Source maps make stack traces readable. Without them, Sentry shows minified code. To upload:

```bash
# Install Sentry CLI
npm install -g @sentry/cli

# After production build:
sentry-cli releases new <version>
sentry-cli releases files <version> upload-sourcemaps ./build/static/js
sentry-cli releases finalize <version>
```

This can be added to `deploy.sh` once Sentry is set up. Until then, stack traces will show minified code — still useful for error message and breadcrumbs.

---

## Existing fallback — KV error dashboard

The `/errors` endpoint and `?view=errors` dashboard still work as a fallback for errors that occur before Sentry initialises (rare) or during local development (no Sentry DSN set).

- View in app: `https://prepstep.co.uk/?view=errors` (dev mode only)
- Clear: POST to `https://11plus-ai-tutor.benjacko82.workers.dev/errors/clear`
- Holds the last 50 errors in a ring buffer
