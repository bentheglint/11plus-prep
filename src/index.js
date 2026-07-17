import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import { ClerkProvider } from '@clerk/clerk-react';
import '@fontsource-variable/dm-sans';
import '@fontsource-variable/outfit';
import './index.css';
import App from './App';
import AppLoader from './components/AppLoader';
import DevReviewPanel from './DevReviewPanel';
import DiagramViewer from './DiagramViewer';
import TutorLandingPage from './components/landing/TutorLandingPage';
import AuthGate from './components/AuthGate';
import ErrorBoundary from './components/ErrorBoundary';
import OfflineBanner from './components/OfflineBanner';
import TutorPreviewBanner from './components/TutorPreviewBanner';
import reportWebVitals from './reportWebVitals';

if (process.env.REACT_APP_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    environment: process.env.NODE_ENV || 'production',
    release: process.env.REACT_APP_VERSION,
    // Errors only — no performance tracing (not needed at this scale)
    tracesSampleRate: 0,
    beforeSend(event) {
      // Scrub PII before sending to Sentry — no emails, no child names
      if (event.user) {
        delete event.user.email;
        delete event.user.ip_address;
        delete event.user.username;
      }
      return event;
    },
  });
}

const CLERK_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
const SMOKE_MODE = process.env.REACT_APP_SMOKE_MODE === 'true';

const isDiagramViewer = new URLSearchParams(window.location.search).has('diagram-viewer');
const isTutorLanding = window.location.pathname === '/for-tutors';

// Shared app tree — rendered with or without ClerkProvider depending on mode.
const appTree = isDiagramViewer ? (
  <DiagramViewer />
) : isTutorLanding ? (
  <TutorLandingPage />
) : (
  <AuthGate>
    {(childName, getToken, access, activeChildId, childrenList, userEmail, clearJoinCodeMetadata) => (
      <>
        <a href="#main-content" className="skip-to-content">Skip to content</a>
        <main id="main-content">
          <AppLoader App={App} currentUser={childName} getToken={getToken} activeChildId={activeChildId} childrenList={childrenList || []} userEmail={userEmail || ''} tutorEligible={access?.tutorEligible || false} isAdmin={access?.isAdmin || false} entitlement={access?.entitlement || null} clearJoinCodeMetadata={clearJoinCodeMetadata} />
          <DevReviewPanel />
        </main>
      </>
    )}
  </AuthGate>
);

// Mount into #root. If the container is missing — seen in prod from bots,
// prefetchers, and DOM-mangling browser extensions (Sentry JAVASCRIPT-REACT-A)
// — recreate it rather than throwing "Target container is not a DOM element",
// so a real user with a tampered DOM still gets a working app instead of a
// blank page. The normal path (container present) is unchanged.
let container = document.getElementById('root');
if (!container) {
  container = document.createElement('div');
  container.id = 'root';
  document.body.appendChild(container);
}
const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <OfflineBanner />
      <TutorPreviewBanner />
      {SMOKE_MODE ? (
        // Smoke test harness: skip ClerkProvider so the app boots without
        // needing a live Clerk key. Never true in production builds.
        appTree
      ) : (
        <ClerkProvider publishableKey={CLERK_KEY}>
          {appTree}
        </ClerkProvider>
      )}
    </ErrorBoundary>
  </React.StrictMode>
);
// Cancels the boot watchdog in public/index.html — must be set after render().
window.__APP_BOOTED = true;

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
