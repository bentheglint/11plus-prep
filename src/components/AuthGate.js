import React, { useState, useEffect, useCallback } from 'react';
import { useUser, useAuth, SignIn, SignUp } from '@clerk/clerk-react';
import { BookOpen, Shield, ChevronRight, LogIn, UserPlus, ArrowLeft } from 'lucide-react';
import SubscribeScreen from './SubscribeScreen';
// apiSync imports removed — D1 data loading moved to useD1Data hook
// fetchAllData, setTokenProvider, setVersions no longer needed here
// MigrationScreen removed — the localStorage→D1 migration was a one-time
// transition completed in early April 2026. New users have no legitimate
// localStorage data to import and should go straight from onboarding to app.

const API_URL = process.env.REACT_APP_TUTOR_API_URL;

// ── API helper ──
async function apiFetch(path, token, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `API error ${res.status}`);
  return data;
}

// ── Invite banner (shown when ?invite=CODE was captured) ──
function InviteBanner({ code }) {
  if (!code) return null;
  return (
    <div className="bg-[#7C3AED] text-white text-sm text-center py-2 px-4">
      <span className="font-bold">Invite accepted!</span> You\u2019ll get free access — no card needed. Code: <span className="font-mono opacity-80">{code}</span>
    </div>
  );
}

// ── Landing Page (shown when signed out) ──
function LandingPage({ onSignIn, onSignUp, inviteCode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F7FF] to-[#E8E5FF] flex flex-col">
      <InviteBanner code={inviteCode} />
      {/* Header */}
      <header className="p-6 flex justify-end gap-3">
        <button
          onClick={onSignIn}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-[#7C3AED] border-2 border-[#7C3AED] rounded-xl hover:bg-[#7C3AED] hover:text-white transition-colors"
        >
          <LogIn className="w-4 h-4" />
          Sign In
        </button>
        <button
          onClick={onSignUp}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-[#7C3AED] rounded-xl hover:bg-[#5A4BD1] transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Create Account
        </button>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <img src="/logo.svg" alt="PrepStep" className="w-80 max-w-full mb-6" />
        <p className="text-lg text-slate-500 max-w-md mb-8">
          Step-by-step practice for the GL Assessment 11+ exam.
          Maths, English, and Verbal Reasoning — with smart revision that adapts to your child.
        </p>
        <button
          onClick={onSignUp}
          className="flex items-center gap-2 px-8 py-3.5 text-lg font-bold text-white bg-[#7C3AED] rounded-2xl hover:bg-[#5A4BD1] transition-colors shadow-md"
        >
          Get Started Free
          <ChevronRight className="w-5 h-5" />
        </button>
        <p className="text-sm text-slate-500 mt-4">
          Free while in early access
        </p>

        {/* Trust signals */}
        <div className="flex items-center gap-6 mt-10 text-sm text-slate-500">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-[#22C55E]" />
            <span>Your child's data is safe</span>
          </div>
          <a href="/privacy.html" className="underline hover:text-[#7C3AED]">
            Privacy Policy
          </a>
          <a href="/terms.html" className="underline hover:text-[#7C3AED]">
            Terms
          </a>
        </div>
      </main>
    </div>
  );
}

// ── Consent Screen ──
function ConsentScreen({ onConsent, isLoading, inviteCode }) {
  const [consentChecked, setConsentChecked] = useState(false);
  const [emailOptIn, setEmailOptIn] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F7FF] to-white flex flex-col">
      <InviteBanner code={inviteCode} />
      <div className="flex-1 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8">
        <h1 className="font-heading text-2xl font-bold text-slate-800 mb-2">Before we get started</h1>
        <p className="text-slate-500 mb-6">
          We need your permission to collect your child's learning data.
          Here's exactly what we collect and why.
        </p>

        {/* What we collect */}
        <div className="bg-[#F8F7FF] rounded-xl p-4 mb-6">
          <h2 className="font-heading font-bold text-sm text-[#7C3AED] mb-3">What we collect</h2>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-[#E8E5FF]">
                <td className="py-2 font-medium text-slate-800">First name</td>
                <td className="py-2 text-slate-500">So the app can personalise the experience</td>
              </tr>
              <tr className="border-b border-[#E8E5FF]">
                <td className="py-2 font-medium text-slate-800">Quiz scores</td>
                <td className="py-2 text-slate-500">To track progress and show you reports</td>
              </tr>
              <tr className="border-b border-[#E8E5FF]">
                <td className="py-2 font-medium text-slate-800">Answers</td>
                <td className="py-2 text-slate-500">To schedule reviews of tricky topics</td>
              </tr>
              <tr className="border-b border-[#E8E5FF]">
                <td className="py-2 font-medium text-slate-800">Practice days</td>
                <td className="py-2 text-slate-500">To help build a study routine</td>
              </tr>
              <tr>
                <td className="py-2 font-medium text-slate-800">AI tutor</td>
                <td className="py-2 text-slate-500">Answered and then forgotten — not saved</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Checkboxes */}
        <div className="space-y-3 mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consentChecked}
              onChange={(e) => setConsentChecked(e.target.checked)}
              className="mt-1 w-5 h-5 rounded accent-[#7C3AED]"
            />
            <span className="text-sm text-slate-800">
              I am the parent or guardian of the child who will use this app. I agree to the{' '}
              <a href="/terms.html" target="_blank" rel="noopener noreferrer" className="text-[#7C3AED] underline">
                terms of service
              </a>{' '}and consent to the processing of their learning data as described in our{' '}
              <a href="/privacy.html" target="_blank" rel="noopener noreferrer" className="text-[#7C3AED] underline">
                privacy policy
              </a>.
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={emailOptIn}
              onChange={(e) => setEmailOptIn(e.target.checked)}
              className="mt-1 w-5 h-5 rounded accent-[#7C3AED]"
            />
            <span className="text-sm text-slate-500">
              Send me weekly progress emails about my child's learning.
              <span className="text-xs ml-1">(optional)</span>
            </span>
          </label>
        </div>

        <button
          onClick={() => onConsent(emailOptIn)}
          disabled={!consentChecked || isLoading}
          className={`w-full py-3 rounded-xl font-bold text-white transition-colors ${
            consentChecked && !isLoading
              ? 'bg-[#7C3AED] hover:bg-[#5A4BD1]'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          {isLoading ? 'Creating account...' : 'Continue'}
        </button>
      </div>
      </div>
    </div>
  );
}

// ── Child Name Screen ──
function ChildNameScreen({ onSubmit, isLoading }) {
  const [name, setName] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F7FF] to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <h1 className="font-heading text-2xl font-bold text-slate-800 mb-2">
          What's your child's first name?
        </h1>
        <p className="text-slate-500 mb-6">
          We'll use this to personalise the app.
          Just their first name — nothing else.
        </p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Evie"
          maxLength={30}
          className="w-full px-4 py-3 text-lg text-center border-2 border-gray-200 rounded-xl focus:border-[#7C3AED] focus:outline-none mb-6"
          autoFocus
        />
        <button
          onClick={() => onSubmit(name.trim())}
          disabled={!name.trim() || isLoading}
          className={`w-full py-3 rounded-xl font-bold text-white transition-colors ${
            name.trim() && !isLoading
              ? 'bg-[#7C3AED] hover:bg-[#5A4BD1]'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          {isLoading ? 'Setting up...' : 'Start Learning'}
        </button>
      </div>
    </div>
  );
}

// ── Dev bypass: skip auth on localhost with ?dev-auth=true ──
const DEV_BYPASS = process.env.NODE_ENV === 'development'
  && typeof window !== 'undefined'
  && new URLSearchParams(window.location.search).get('dev-auth') === 'true';

// ── Smoke-test bypass: compile-time flag only set when building for
// the smoke test harness (REACT_APP_SMOKE_MODE=true). Production builds
// never set this variable, so real users can never hit this path.
const SMOKE_BYPASS = process.env.REACT_APP_SMOKE_MODE === 'true';

// ── Smoke bypass wrapper ──
// When SMOKE_BYPASS is true, AuthGate renders children directly without
// ever calling Clerk hooks — which is required because the smoke build
// doesn't wrap the tree in ClerkProvider.
function AuthGateSmoke({ children }) {
  return children(localStorage.getItem('current-user') || 'SmokeTest', null);
}

// ── Auth Gate (main orchestrator) ──
export default function AuthGate(props) {
  if (SMOKE_BYPASS) return <AuthGateSmoke {...props} />;
  return <AuthGateReal {...props} />;
}

function AuthGateReal({ children }) {
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { user } = useUser();
  const { getToken } = useAuth();

  const [authView, setAuthView] = useState('landing'); // landing | signin | signup
  const [onboardingStep, setOnboardingStep] = useState(null); // null | 'consent' | 'childName' | 'ready' | 'subscribe'
  const [childName, setChildName] = useState(null);
  const [activeChildId, setActiveChildId] = useState(null);
  const [access, setAccess] = useState(null); // { hasAccess, inTrial, trialDaysRemaining, subscriptionStatus, isComped }
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Invite code — captured from URL ?invite=CODE on first mount. Persists
  // in localStorage so it survives the Clerk signup redirect round-trip and
  // is consumed when we POST /api/account after consent.
  const [inviteCode, setInviteCode] = useState(() => {
    try {
      const param = new URLSearchParams(window.location.search).get('invite');
      if (param) {
        localStorage.setItem('pending-invite', param);
        // Clean the URL so ?invite= doesn't hang around after onboarding
        const params = new URLSearchParams(window.location.search);
        params.delete('invite');
        const q = params.toString();
        window.history.replaceState({}, '', window.location.pathname + (q ? '?' + q : ''));
        return param;
      }
      return localStorage.getItem('pending-invite') || null;
    } catch {
      return null;
    }
  });

  // seedLocalStorage REMOVED — D1 data loading now handled by useD1Data hook directly.
  // The hook fetches from /api/data/all on mount, with offline fallback to d1-cache.

  // Check if user has a D1 account + child when they sign in
  const checkAccount = useCallback(async () => {
    if (!isSignedIn) return;

    try {
      setIsLoading(true);

      const token = await getToken();
      const data = await apiFetch('/api/account', token);
      if (data.access) setAccess(data.access);
      const firstChild = data.children?.[0] || null;
      if (data.account && firstChild) {
        setChildName(firstChild.display_name);
        setActiveChildId(firstChild.id);
        if (data.access && !data.access.hasAccess) {
          setOnboardingStep('subscribe');
        } else {
          setOnboardingStep('ready');
        }
      } else if (data.account && !firstChild) {
        setOnboardingStep('childName');
      }
    } catch (err) {
      if (err.message.includes('not found') || err.message.includes('404')) {
        setOnboardingStep('consent');
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn, getToken]);

  useEffect(() => {
    if (authLoaded && isSignedIn) {
      checkAccount();
    }
  }, [authLoaded, isSignedIn, checkAccount]);

  // Stripe redirect return — 3DS flow sends the user back to /?subscribed=1.
  // Clear the param and re-fetch account so we see the new subscription_status.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('subscribed') === '1') {
      params.delete('subscribed');
      const newSearch = params.toString();
      window.history.replaceState({}, '', window.location.pathname + (newSearch ? '?' + newSearch : ''));
      if (isSignedIn) checkAccount();
    }
  }, [isSignedIn, checkAccount]);

  // Handle consent submission
  const handleConsent = async (emailOptIn) => {
    try {
      setIsLoading(true);
      setError(null);
      const token = await getToken();

      const res = await apiFetch('/api/account', token, {
        method: 'POST',
        body: JSON.stringify({
          email: user.primaryEmailAddress?.emailAddress || '',
          name: user.fullName || user.firstName || 'Parent',
          consentVersion: '1.0',
          inviteCode: inviteCode || undefined,
        }),
      });

      // Consume the invite code — whether it was valid or not, remove from
      // localStorage so it doesn't re-apply on future account creations.
      localStorage.removeItem('pending-invite');
      if (!res.comped && inviteCode) {
        // User submitted a code but it wasn't recognised. Silent on the server
        // (no leakage) — surface inline so they know they're still on the trial.
        console.warn('[AuthGate] Invite code not recognised; account on standard trial.');
      }
      setInviteCode(null);

      setOnboardingStep('childName');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle child name submission
  const handleChildName = async (displayName) => {
    try {
      setIsLoading(true);
      setError(null);
      const token = await getToken();

      const res = await apiFetch('/api/account/child', token, {
        method: 'POST',
        body: JSON.stringify({ displayName }),
      });

      setChildName(displayName);
      if (res?.childId) setActiveChildId(res.childId);
      // Go straight to app — no migration step for new accounts.
      setOnboardingStep('ready');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Render ──

  // Dev bypass: skip auth on localhost with ?dev-auth=true (development only)
  if (DEV_BYPASS) return children(localStorage.getItem('current-user') || 'Dev', null);

  // Still loading Clerk
  if (!authLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F8F7FF] to-white flex items-center justify-center">
        <div className="animate-pulse text-[#7C3AED] font-heading font-bold text-xl">Loading...</div>
      </div>
    );
  }

  // Not signed in
  if (!isSignedIn) {
    if (authView === 'signin') {
      return (
        <div className="min-h-screen bg-gradient-to-b from-[#F8F7FF] to-white flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setAuthView('landing')}
            className="flex items-center gap-2 text-sm text-[#7C3AED] font-bold mb-6 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <SignIn fallbackRedirectUrl="/" />
        </div>
      );
    }
    if (authView === 'signup') {
      return (
        <div className="min-h-screen bg-gradient-to-b from-[#F8F7FF] to-white flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setAuthView('landing')}
            className="flex items-center gap-2 text-sm text-[#7C3AED] font-bold mb-6 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <SignUp fallbackRedirectUrl="/" />
        </div>
      );
    }
    return <LandingPage onSignIn={() => setAuthView('signin')} onSignUp={() => setAuthView('signup')} inviteCode={inviteCode} />;
  }

  // Signed in but checking/loading account
  if (isLoading && !onboardingStep) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F8F7FF] to-white flex items-center justify-center">
        <div className="animate-pulse text-[#7C3AED] font-heading font-bold text-xl">Loading your data...</div>
      </div>
    );
  }

  // Error state
  if (error && !onboardingStep) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F8F7FF] to-white flex items-center justify-center p-4">
        <div className="max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
          <p className="text-red-500 font-bold mb-4">Something went wrong</p>
          <p className="text-slate-500 text-sm mb-4">{error}</p>
          <button
            onClick={checkAccount}
            className="px-6 py-2 bg-[#7C3AED] text-white rounded-xl font-bold"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // Onboarding: consent
  if (onboardingStep === 'consent') {
    return <ConsentScreen onConsent={handleConsent} isLoading={isLoading} inviteCode={inviteCode} />;
  }

  // Onboarding: child name
  if (onboardingStep === 'childName') {
    return <ChildNameScreen onSubmit={handleChildName} isLoading={isLoading} />;
  }

  // Paywall: no access (trial expired or subscription canceled)
  if (onboardingStep === 'subscribe') {
    return (
      <SubscribeScreen
        getToken={getToken}
        trialExpired={!access?.inTrial}
        onSuccess={() => checkAccount()}
        onBack={() => null /* no back from paywall — user must subscribe */}
      />
    );
  }

  // Ready — render the app with child name + access info + active child ID
  if (onboardingStep === 'ready') {
    return children(childName, getToken, access, activeChildId);
  }

  // Fallback loading
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F7FF] to-white flex items-center justify-center">
      <div className="animate-pulse text-[#7C3AED] font-heading font-bold text-xl">Loading...</div>
    </div>
  );
}
