import React, { useState, useEffect, useCallback } from 'react';
import { useUser, useAuth, SignIn, SignUp } from '@clerk/clerk-react';
import { BookOpen, Shield, ChevronRight, LogIn, UserPlus, ArrowLeft } from 'lucide-react';
import { fetchAllData, setTokenProvider, setVersions } from '../utils/apiSync';
import MigrationScreen from './MigrationScreen';

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

// ── Landing Page (shown when signed out) ──
function LandingPage({ onSignIn, onSignUp }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F7FF] to-[#E8E5FF] flex flex-col">
      {/* Header */}
      <header className="p-6 flex justify-end gap-3">
        <button
          onClick={onSignIn}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-[#6C5CE7] border-2 border-[#6C5CE7] rounded-xl hover:bg-[#6C5CE7] hover:text-white transition-colors"
        >
          <LogIn className="w-4 h-4" />
          Sign In
        </button>
        <button
          onClick={onSignUp}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-[#6C5CE7] rounded-xl hover:bg-[#5A4BD1] transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Create Account
        </button>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 rounded-2xl bg-[#6C5CE7] flex items-center justify-center mb-6 shadow-lg">
          <BookOpen className="w-10 h-10 text-white" />
        </div>
        <h1 className="font-heading text-4xl font-bold text-slate-800 mb-3">
          11+ Exam Prep
        </h1>
        <p className="text-lg text-slate-500 max-w-md mb-8">
          Personalised practice for the GL Assessment 11+ exam.
          Maths, English, and Verbal Reasoning — with smart revision that adapts to your child.
        </p>
        <button
          onClick={onSignUp}
          className="flex items-center gap-2 px-8 py-3.5 text-lg font-bold text-white bg-[#6C5CE7] rounded-2xl hover:bg-[#5A4BD1] transition-colors shadow-md"
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
            <Shield className="w-4 h-4 text-[#00B894]" />
            <span>Your child's data is safe</span>
          </div>
          <a href="/privacy.html" className="underline hover:text-[#6C5CE7]">
            Privacy Policy
          </a>
        </div>
      </main>
    </div>
  );
}

// ── Consent Screen ──
function ConsentScreen({ onConsent, isLoading }) {
  const [consentChecked, setConsentChecked] = useState(false);
  const [emailOptIn, setEmailOptIn] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F7FF] to-white flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8">
        <h1 className="font-heading text-2xl font-bold text-slate-800 mb-2">Before we get started</h1>
        <p className="text-slate-500 mb-6">
          We need your permission to collect your child's learning data.
          Here's exactly what we collect and why.
        </p>

        {/* What we collect */}
        <div className="bg-[#F8F7FF] rounded-xl p-4 mb-6">
          <h2 className="font-heading font-bold text-sm text-[#6C5CE7] mb-3">What we collect</h2>
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
              className="mt-1 w-5 h-5 rounded accent-[#6C5CE7]"
            />
            <span className="text-sm text-slate-800">
              I am the parent or guardian of the child who will use this app, and I consent to the
              processing of their learning data as described above and in our{' '}
              <a href="/privacy.html" target="_blank" rel="noopener noreferrer" className="text-[#6C5CE7] underline">
                privacy policy
              </a>.
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={emailOptIn}
              onChange={(e) => setEmailOptIn(e.target.checked)}
              className="mt-1 w-5 h-5 rounded accent-[#6C5CE7]"
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
              ? 'bg-[#6C5CE7] hover:bg-[#5A4BD1]'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          {isLoading ? 'Creating account...' : 'Continue'}
        </button>
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
          className="w-full px-4 py-3 text-lg text-center border-2 border-gray-200 rounded-xl focus:border-[#6C5CE7] focus:outline-none mb-6"
          autoFocus
        />
        <button
          onClick={() => onSubmit(name.trim())}
          disabled={!name.trim() || isLoading}
          className={`w-full py-3 rounded-xl font-bold text-white transition-colors ${
            name.trim() && !isLoading
              ? 'bg-[#6C5CE7] hover:bg-[#5A4BD1]'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          {isLoading ? 'Setting up...' : 'Start Learning'}
        </button>
      </div>
    </div>
  );
}

// ── Auth Gate (main orchestrator) ──
export default function AuthGate({ children }) {
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { user } = useUser();
  const { getToken } = useAuth();

  const [authView, setAuthView] = useState('landing'); // landing | signin | signup
  const [onboardingStep, setOnboardingStep] = useState(null); // null | 'consent' | 'childName' | 'ready'
  const [childName, setChildName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Seed localStorage from server data so useUserData picks it up
  const seedLocalStorage = useCallback(async (childDisplayName) => {
    const serverData = await fetchAllData(getToken);
    if (!serverData) return; // No server data yet, that's fine

    // Seed version cache so mutable PATCHes use correct versions
    setVersions(serverData);

    const prefix = `user:${childDisplayName}:`;

    // Only seed if server has data (don't overwrite localStorage with empty)
    if (serverData.quizResults?.length > 0) {
      // Convert server format back to localStorage format
      const quizHistory = serverData.quizResults.map(r => ({
        id: Date.parse(r.completed_at) || Date.now(),
        topic: r.topic_key,
        subject: r.subject,
        score: r.score,
        total: r.total,
        percentage: r.total > 0 ? Math.round((r.score / r.total) * 100) : 0,
        date: r.completed_at,
      }));
      localStorage.setItem(prefix + 'quiz-history', JSON.stringify(quizHistory));
    }

    if (serverData.mockTestResults?.length > 0) {
      const mockHistory = serverData.mockTestResults.map(r => ({
        subject: r.subject, totalQuestions: r.total_questions,
        totalCorrect: r.total_correct, percentage: r.percentage,
        timeTaken: r.time_taken, timeLimit: r.time_limit,
        sectionResults: r.section_results, questionTimes: r.question_times,
        date: r.completed_at,
      }));
      localStorage.setItem(prefix + 'mock-test-history', JSON.stringify(mockHistory));
    }

    if (serverData.questionResults?.length > 0) {
      // Convert server format (snake_case) to localStorage format (camelCase)
      const qr = serverData.questionResults.map(r => ({
        id: r.id || Date.parse(r.created_at) || Date.now(),
        date: r.created_at || r.date,
        questionId: r.question_id ?? r.questionId,
        topicKey: r.topic_key ?? r.topicKey,
        subject: r.subject,
        difficulty: r.difficulty ?? 2,
        correct: r.is_correct ?? r.correct ?? false,
        timeSpentMs: r.time_ms ?? r.timeSpentMs ?? 0,
        mode: r.mode || 'focused',
        sessionId: r.session_id ?? r.sessionId,
      }));
      localStorage.setItem(prefix + 'question-results', JSON.stringify(qr));
    }

    if (serverData.topicPerformance?.length > 0) {
      const tp = {};
      serverData.topicPerformance.forEach(r => { tp[r.topic_key] = r.data; });
      localStorage.setItem(prefix + 'topic-performance', JSON.stringify(tp));
    }

    if (serverData.lessonHistory?.length > 0) {
      const lh = {};
      serverData.lessonHistory.forEach(r => { lh[r.lesson_id] = { completedAt: r.completed_at }; });
      localStorage.setItem(prefix + 'lesson-history', JSON.stringify(lh));
    }

    if (serverData.leitnerQueue?.length > 0) {
      localStorage.setItem(prefix + 'leitner-queue', JSON.stringify(serverData.leitnerQueue));
    }

    if (serverData.practiceSessions?.length > 0) {
      localStorage.setItem(prefix + 'practice-log', JSON.stringify(
        serverData.practiceSessions.map(r => ({ ...r.data, date: r.session_date }))
      ));
    }

    if (serverData.seenQuestions?.length > 0) {
      // Local format: { topicKey: [questionId1, questionId2, ...] }
      const sq = {};
      serverData.seenQuestions.forEach(r => {
        const key = r.topic_key;
        if (!sq[key]) sq[key] = [];
        if (!sq[key].includes(r.question_id)) sq[key].push(r.question_id);
      });
      localStorage.setItem(prefix + 'seen-questions', JSON.stringify(sq));
    }

    if (serverData.streaks) {
      localStorage.setItem(prefix + 'streaks', JSON.stringify({
        currentStreak: serverData.streaks.current_streak,
        longestStreak: serverData.streaks.longest_streak,
        lastQuizDate: serverData.streaks.last_quiz_date,
        streakHistory: serverData.streaks.streak_history,
      }));
    }

    if (serverData.prepPoints) {
      localStorage.setItem(prefix + 'prep-points', JSON.stringify({
        total: serverData.prepPoints.total,
        level: serverData.prepPoints.level,
        todayPP: serverData.prepPoints.today_pp,
        todayDate: serverData.prepPoints.today_date,
      }));
    }

    if (serverData.achievements?.length > 0) {
      localStorage.setItem(prefix + 'achievements', JSON.stringify(
        serverData.achievements.map(a => ({ id: a.achievement_id, unlockedAt: a.unlocked_at }))
      ));
    }

    if (serverData.seenTips?.length > 0) {
      localStorage.setItem(prefix + 'seen-tips', JSON.stringify(
        serverData.seenTips.map(t => ({ id: t.tip_id, lastSeenDate: t.last_seen_date }))
      ));
    }

    if (serverData.preferences?.last_session_date) {
      localStorage.setItem(prefix + 'last-session-date',
        JSON.stringify(serverData.preferences.last_session_date)
      );
    }
  }, [getToken]);

  // Check if user has a D1 account + child when they sign in
  const checkAccount = useCallback(async () => {
    if (!isSignedIn) return;

    try {
      setIsLoading(true);
      // Set the token provider so apiSync can make API calls
      setTokenProvider(getToken);

      const token = await getToken();
      const data = await apiFetch('/api/account', token);
      if (data.account && data.child) {
        // Seed localStorage from server before rendering app
        await seedLocalStorage(data.child.display_name);
        setChildName(data.child.display_name);

        // Check if migration has already been done (either server-side or localStorage flag)
        const migrationDone = localStorage.getItem(`migration-complete:${data.child.display_name}`);
        if (migrationDone) {
          setOnboardingStep('ready');
        } else {
          // First login on this device — check for localStorage data to migrate
          setOnboardingStep('migration');
        }
      } else if (data.account && !data.child) {
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
  }, [isSignedIn, getToken, seedLocalStorage]);

  useEffect(() => {
    if (authLoaded && isSignedIn) {
      checkAccount();
    }
  }, [authLoaded, isSignedIn, checkAccount]);

  // Handle consent submission
  const handleConsent = async (emailOptIn) => {
    try {
      setIsLoading(true);
      setError(null);
      const token = await getToken();

      await apiFetch('/api/account', token, {
        method: 'POST',
        body: JSON.stringify({
          email: user.primaryEmailAddress?.emailAddress || '',
          name: user.fullName || user.firstName || 'Parent',
          consentVersion: '1.0',
        }),
      });

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

      await apiFetch('/api/account/child', token, {
        method: 'POST',
        body: JSON.stringify({ displayName }),
      });

      setChildName(displayName);
      // After creating child, check for localStorage data to migrate
      setOnboardingStep('migration');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle migration complete or skip
  const handleMigrationDone = () => {
    setOnboardingStep('ready');
  };

  // ── Render ──

  // Still loading Clerk
  if (!authLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F8F7FF] to-white flex items-center justify-center">
        <div className="animate-pulse text-[#6C5CE7] font-heading font-bold text-xl">Loading...</div>
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
            className="flex items-center gap-2 text-sm text-[#6C5CE7] font-bold mb-6 hover:underline"
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
            className="flex items-center gap-2 text-sm text-[#6C5CE7] font-bold mb-6 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <SignUp fallbackRedirectUrl="/" />
        </div>
      );
    }
    return <LandingPage onSignIn={() => setAuthView('signin')} onSignUp={() => setAuthView('signup')} />;
  }

  // Signed in but checking/loading account
  if (isLoading && !onboardingStep) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F8F7FF] to-white flex items-center justify-center">
        <div className="animate-pulse text-[#6C5CE7] font-heading font-bold text-xl">Loading your data...</div>
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
            className="px-6 py-2 bg-[#6C5CE7] text-white rounded-xl font-bold"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // Onboarding: consent
  if (onboardingStep === 'consent') {
    return <ConsentScreen onConsent={handleConsent} isLoading={isLoading} />;
  }

  // Onboarding: child name
  if (onboardingStep === 'childName') {
    return <ChildNameScreen onSubmit={handleChildName} isLoading={isLoading} />;
  }

  // Migration: check for existing localStorage data
  if (onboardingStep === 'migration') {
    return (
      <MigrationScreen
        childName={childName}
        onComplete={handleMigrationDone}
        onSkip={handleMigrationDone}
      />
    );
  }

  // Ready — render the app with child name
  if (onboardingStep === 'ready') {
    return children(childName);
  }

  // Fallback loading
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F7FF] to-white flex items-center justify-center">
      <div className="animate-pulse text-[#6C5CE7] font-heading font-bold text-xl">Loading...</div>
    </div>
  );
}
