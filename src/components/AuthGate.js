import React, { useState, useEffect, useCallback } from 'react';
import { useUser, useAuth, SignIn, SignUp } from '@clerk/clerk-react';
import { BookOpen, Shield, ChevronRight, LogIn, UserPlus, ArrowLeft } from 'lucide-react';
import SubscribeScreen from './SubscribeScreen';
import { isFeatureEnabled } from '../utils/featureFlags';
import { resolveAccessAdmission } from '../utils/entitlementGating';
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
function LandingPage({ onSignIn, onSignUp, onTutorSignup, inviteCode }) {
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
          Try free for 30 days
          <ChevronRight className="w-5 h-5" />
        </button>
        <p className="text-sm text-slate-500 mt-4">
          No card required. Full access from day one.
        </p>

        {/* Trust signals */}
        <div className="flex items-center gap-6 mt-10 text-sm text-slate-500">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-[#22C55E]" />
            <span>Your child's data is safe</span>
          </div>
          <a href="/privacy" className="underline hover:text-[#7C3AED]">
            Privacy Policy
          </a>
          <a href="/terms" className="underline hover:text-[#7C3AED]">
            Terms
          </a>
          <a href="/help" className="underline hover:text-[#7C3AED]">
            Help
          </a>
        </div>

        {/* Tutor entry point */}
        <p className="text-sm text-slate-500 mt-8">
          Are you a tutor?{' '}
          <button onClick={onTutorSignup} className="text-[#7C3AED] font-bold underline hover:text-[#5A4BD1]">
            Sign up here
          </button>
        </p>
      </main>
    </div>
  );
}

// ── Consent Screen ──
function ConsentScreen({ onConsent, isLoading, inviteCode }) {
  const [consentChecked, setConsentChecked] = useState(false);
  const [emailOptIn, setEmailOptIn] = useState(true);

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
              Send me weekly progress emails so I can see how my child is getting on.
              <span className="text-xs ml-1">You can turn these off any time.</span>
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
// prefillName: optionally pre-filled from the invite-preview call (still editable)
function ChildNameScreen({ onSubmit, isLoading, prefillName }) {
  const [name, setName] = useState(prefillName || '');

  // If prefillName arrives asynchronously (after initial render), sync it in
  // once — but don't overwrite a value the user has already typed.
  const [prefillApplied, setPrefillApplied] = useState(!!prefillName);
  React.useEffect(() => {
    if (prefillName && !prefillApplied) {
      setName(prefillName);
      setPrefillApplied(true);
    }
  }, [prefillName, prefillApplied]);

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

// ── Tutor Name Screen ──
function TutorNameScreen({ onSubmit, isLoading }) {
  const [name, setName] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F7FF] to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <h1 className="font-heading text-2xl font-bold text-slate-800 mb-2">
          Welcome! What's your name?
        </h1>
        <p className="text-slate-500 mb-6">
          This is how you'll appear to the parents you invite.
          You can add a short bio on the next step.
        </p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Mary Jones"
          maxLength={50}
          className="w-full px-4 py-3 text-lg text-center border-2 border-gray-200 rounded-xl focus:border-[#7C3AED] focus:outline-none mb-4"
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
          {isLoading ? 'Setting up...' : 'Continue'}
        </button>
        <p className="text-xs text-slate-400 mt-4">
          By continuing you agree to our{' '}
          <a href="/terms.html" target="_blank" rel="noopener noreferrer" className="text-[#7C3AED] underline">terms</a>
          {' '}and{' '}
          <a href="/privacy.html" target="_blank" rel="noopener noreferrer" className="text-[#7C3AED] underline">privacy policy</a>.
        </p>
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
  const [childrenList, setChildrenList] = useState([]);
  const [access, setAccess] = useState(null); // { hasAccess, inTrial, trialDaysRemaining, subscriptionStatus, isComped }
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Tutor join code — captured from /join/<code> path on first mount. Persists
  // in sessionStorage so it survives Clerk's sign-in redirect (which lands on /).
  // App.js reads it back after sign-in and routes to the join view.
  useState(() => {
    try {
      const pathMatch = window.location.pathname.match(/^\/join\/([A-Z0-9-]{5,12})$/i);
      if (pathMatch) sessionStorage.setItem('pending-join-code', pathMatch[1].toUpperCase());
    } catch {}
  });

  // Bulk invite token — captured from /invite/<token> path on first mount,
  // BEFORE Clerk can wipe the path on redirect. Stored in sessionStorage (not
  // localStorage) — token is one-time use and must not survive across sessions.
  // SEPARATE from the ?invite= comp-code (localStorage 'pending-invite') which
  // grants free access; an invite token grants NO free access.
  // App.js reads it post-auth and routes to 'inviteClaim'.
  const [inviteBanner, setInviteBanner] = useState(null); // { displayName } | null
  useState(() => {
    try {
      const tokenMatch = window.location.pathname.match(/^\/invite\/([A-Za-z0-9-]{10,64})$/);
      if (tokenMatch) {
        sessionStorage.setItem('pending-invite-token', tokenMatch[1]);
        // Clean the path so Clerk doesn't redirect to /invite/<token>
        window.history.replaceState({}, '', '/');
      }
    } catch {}
  });

  // Tutor signup intent — set when a visitor takes the "I'm a tutor" path
  // (landing-page link or a ?tutor=1 direct link). Stored in localStorage (not
  // sessionStorage) so it survives BOTH Clerk's signup redirect AND opening a
  // new tab — e.g. the Tutor Terms link (target=_blank) whose "Back to app"
  // would otherwise land an intent-less new tab on the child-name screen.
  // Cleared once the user commits to a path (tutor profile created, or parent
  // consent / parent CTA) so it can never misroute a later parent signup.
  const [signupIntent, setSignupIntent] = useState(() => {
    try {
      const param = new URLSearchParams(window.location.search).get('tutor');
      if (param === '1') {
        localStorage.setItem('signup-intent', 'tutor');
        // Clean the URL so ?tutor=1 doesn't linger after onboarding
        const params = new URLSearchParams(window.location.search);
        params.delete('tutor');
        const q = params.toString();
        window.history.replaceState({}, '', window.location.pathname + (q ? '?' + q : ''));
        return 'tutor';
      }
      return localStorage.getItem('signup-intent') || null;
    } catch {
      return null;
    }
  });

  // Clear tutor intent — called when a user commits to the parent path so a
  // stale flag can't push a parent into tutor onboarding.
  const clearTutorIntent = useCallback(() => {
    try { localStorage.removeItem('signup-intent'); } catch {}
    setSignupIntent(null);
  }, []);

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

  // Child name pre-fill from invite-preview (fetched once during consent→childName step)
  const [childNamePrefill, setChildNamePrefill] = useState(null);

  // Fetch the public invite-token lookup to show a landing banner.
  // Does NOT reveal the child's name (pre-auth privacy decision).
  // Only runs when a pending-invite-token is in sessionStorage AND the user is not
  // yet signed in, so the banner is visible on the landing/consent screen.
  useEffect(() => {
    if (isSignedIn) return; // banner only for signed-out visitors
    let cancelled = false;
    try {
      const token = sessionStorage.getItem('pending-invite-token');
      if (!token) return;
      const url = `${API_URL}/api/tutor/public/invite/${encodeURIComponent(token)}`;
      fetch(url)
        .then(r => r.json())
        .then(data => {
          if (cancelled) return;
          if (data.valid && data.tutor?.displayName) {
            setInviteBanner({ displayName: data.tutor.displayName });
          } else if (!data.valid) {
            // Token expired or revoked — clear it now, silently
            try { sessionStorage.removeItem('pending-invite-token'); } catch {}
          }
        })
        .catch(() => {}); // non-critical — banner is cosmetic
    } catch {}
    return () => { cancelled = true; };
  }, [isSignedIn]); // eslint-disable-line react-hooks/exhaustive-deps

  // Check if user has a D1 account + child when they sign in
  const checkAccount = useCallback(async () => {
    if (!isSignedIn) return;

    try {
      setIsLoading(true);

      const token = await getToken();
      const data = await apiFetch('/api/account', token);
      if (data.access) setAccess(data.access);
      const allChildren = data.children || [];
      const firstChild = allChildren[0] || null;
      if (data.account && firstChild) {
        // Has a child → parent (or dual-role tutor-parent). Unchanged flow:
        // land on the child home; tutors with a child reach their dashboard
        // via the account menu.
        setChildrenList(allChildren);
        setChildName(firstChild.display_name);
        setActiveChildId(firstChild.id);
        // Phase 0 freemium (Step 5): when the freeTier flag is on, a
        // would-be-walled user is admitted to the app's free floor instead
        // of hitting the paywall. Flag off keeps today's behaviour exactly
        // (walled → subscribe). comped/paid/trial/grace unchanged either way.
        setOnboardingStep(resolveAccessAdmission({
          hasAccess: !!(data.access && data.access.hasAccess),
          freeTierOn: isFeatureEnabled('freeTier'),
        }));
      } else if (data.account && data.access?.hasTutorProfile) {
        // Pure tutor (profile, no child) → land on their dashboard. No paywall
        // for tutors. Their own account name flows through as currentUser.
        try { sessionStorage.setItem('tutor-landing', 'dashboard'); } catch {}
        setChildName(data.account.name || 'Tutor');
        setOnboardingStep('ready');
      } else if (data.account && signupIntent === 'tutor') {
        // Tutor account created but no profile yet (fresh signup, or returning
        // after abandoning before profile creation) → send to profile setup.
        try { sessionStorage.setItem('tutor-landing', 'signup'); } catch {}
        setChildName(data.account.name || 'Tutor');
        setOnboardingStep('ready');
      } else if (data.account && !firstChild) {
        // Parent who hasn't named their child yet.
        setOnboardingStep('childName');
      }
    } catch (err) {
      if (err.message.includes('not found') || err.message.includes('404')) {
        // No account yet → onboarding. Tutors take their own fork (own name,
        // no child); everyone else gets the parent consent + child-name flow.
        setOnboardingStep(signupIntent === 'tutor' ? 'tutorName' : 'consent');
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn, getToken, signupIntent]);

  useEffect(() => {
    if (authLoaded && isSignedIn) {
      checkAccount();
    }
  }, [authLoaded, isSignedIn, checkAccount]);

  // A ?tutor=1 direct link (or lingering tutor intent) jumps straight to the
  // signup form rather than the parent-oriented landing hero.
  useEffect(() => {
    if (authLoaded && !isSignedIn && signupIntent === 'tutor') {
      setAuthView((v) => (v === 'landing' ? 'signup' : v));
    }
  }, [authLoaded, isSignedIn, signupIntent]);

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
          emailOptIn: emailOptIn ? true : false,
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

      clearTutorIntent(); // parent account created — drop any stale tutor intent

      // If an invite token is pending, call invite-preview now (authed) to
      // pre-fill the child name. Cache result in sessionStorage for InviteClaimScreen.
      try {
        const pendingToken = sessionStorage.getItem('pending-invite-token');
        if (pendingToken) {
          const freshToken = await getToken();
          const previewRes = await fetch(`${API_URL}/api/tutor/invite-preview`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${freshToken}` },
            body: JSON.stringify({ token: pendingToken }),
          });
          const previewData = await previewRes.json().catch(() => ({}));
          if (previewData.valid) {
            try { sessionStorage.setItem('invite-preview', JSON.stringify(previewData)); } catch {}
            if (previewData.childName) setChildNamePrefill(previewData.childName);
          }
        }
      } catch {} // non-critical — child-name screen is still usable without prefill

      setOnboardingStep('childName');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle tutor name submission — creates the account with the tutor's own
  // name and NO child record, then sends them to profile setup. The meaningful
  // commercial agreement (Tutor Terms clickwrap) is captured at profile creation.
  const handleTutorName = async (tutorName) => {
    try {
      setIsLoading(true);
      setError(null);
      const token = await getToken();

      await apiFetch('/api/account', token, {
        method: 'POST',
        body: JSON.stringify({
          email: user.primaryEmailAddress?.emailAddress || '',
          name: tutorName,
          consentVersion: '1.0',
          emailOptIn: false, // tutors don't need child-progress emails
        }),
      });

      setChildName(tutorName);
      try { sessionStorage.setItem('tutor-landing', 'signup'); } catch {}
      setOnboardingStep('ready');
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

      let childId = null;
      try {
        const res = await apiFetch('/api/account/child', token, {
          method: 'POST',
          body: JSON.stringify({ displayName }),
        });
        childId = res?.childId || null;
        if (childId) {
          setChildrenList([{ id: childId, display_name: displayName }]);
        }
      } catch (err) {
        // 409 means the child was already created (two-tab race). When an invite
        // token is pending, continue idempotently by re-fetching the account.
        // Outside the invite flow, surface the error as normal.
        const hasPendingInvite = (() => {
          try { return !!sessionStorage.getItem('pending-invite-token'); } catch { return false; }
        })();

        if (err.message.includes('409') && hasPendingInvite) {
          const accountData = await apiFetch('/api/account', token);
          const existing = accountData.children?.[0];
          if (existing) {
            childId = existing.id;
            setChildrenList(accountData.children);
          } else {
            throw err; // unexpected — re-surface
          }
        } else {
          throw err;
        }
      }

      setChildName(displayName);
      if (childId) {
        setActiveChildId(childId);
      }
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
    return (
      <>
        {/* Invite token banner — shown when a /invite/<token> link was followed */}
        {inviteBanner && (
          <div className="bg-[#7C3AED] text-white text-sm text-center py-2 px-4">
            <span className="font-bold">{inviteBanner.displayName}</span> has invited your child to PrepStep — create an account to connect.
          </div>
        )}
        <LandingPage
          onSignIn={() => { clearTutorIntent(); setAuthView('signin'); }}
          onSignUp={() => { clearTutorIntent(); setAuthView('signup'); }}
          onTutorSignup={() => {
            try { localStorage.setItem('signup-intent', 'tutor'); } catch {}
            setSignupIntent('tutor');
            setAuthView('signup');
          }}
          inviteCode={inviteCode}
        />
      </>
    );
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
    return <ChildNameScreen onSubmit={handleChildName} isLoading={isLoading} prefillName={childNamePrefill} />;
  }

  // Onboarding: tutor name (their own name, no child)
  if (onboardingStep === 'tutorName') {
    return <TutorNameScreen onSubmit={handleTutorName} isLoading={isLoading} />;
  }

  // Paywall: no access (trial expired or subscription canceled).
  // SubscribeScreen handles its own escape routes (sign out + email support).
  if (onboardingStep === 'subscribe') {
    return (
      <SubscribeScreen
        getToken={getToken}
        trialExpired={!access?.inTrial}
      />
    );
  }

  // Ready — render the app with child name + access info + active child ID + children list
  if (onboardingStep === 'ready') {
    const userEmail = user?.primaryEmailAddress?.emailAddress || '';
    return children(childName, getToken, access, activeChildId, childrenList, userEmail);
  }

  // Fallback loading
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F7FF] to-white flex items-center justify-center">
      <div className="animate-pulse text-[#7C3AED] font-heading font-bold text-xl">Loading...</div>
    </div>
  );
}
