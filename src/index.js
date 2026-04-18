import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import '@fontsource-variable/dm-sans';
import '@fontsource-variable/outfit';
import './index.css';
import App from './App';
import AppLoader from './components/AppLoader';
import DevReviewPanel from './DevReviewPanel';
import DiagramViewer from './DiagramViewer';
import AuthGate from './components/AuthGate';
import ErrorBoundary from './components/ErrorBoundary';
import OfflineBanner from './components/OfflineBanner';
import reportWebVitals from './reportWebVitals';

const CLERK_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
const SMOKE_MODE = process.env.REACT_APP_SMOKE_MODE === 'true';

const isDiagramViewer = new URLSearchParams(window.location.search).has('diagram-viewer');

// Shared app tree — rendered with or without ClerkProvider depending on mode.
const appTree = isDiagramViewer ? (
  <DiagramViewer />
) : (
  <AuthGate>
    {(childName, getToken) => (
      <main>
        <AppLoader App={App} currentUser={childName} getToken={getToken} />
        <DevReviewPanel />
      </main>
    )}
  </AuthGate>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <OfflineBanner />
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
