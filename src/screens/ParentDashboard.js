import React, { useEffect, useState } from 'react';
import { useClerk } from '@clerk/clerk-react';
import { Download, Trash2, AlertTriangle, CreditCard } from 'lucide-react';
import OnTrackCard from '../components/progress/OnTrackCard';
import ExamReadinessCard from '../components/progress/ExamReadinessCard';
import BasicProgressSummary from '../components/progress/BasicProgressSummary';
import TopicHeatMap from '../components/progress/TopicHeatMap';
import PracticeCalendar from '../components/progress/PracticeCalendar';
import FocusAreas from '../components/progress/FocusAreas';
import MockTestHistory from '../components/progress/MockTestHistory';
import SpeedTracking from '../components/progress/SpeedTracking';
import SpeedAccuracyQuadrant from '../components/progress/SpeedAccuracyQuadrant';
import ParentGuidance from '../components/progress/ParentGuidance';
import TutorHomeworkCard from '../components/progress/TutorHomeworkCard';
import TutorManagementCard from '../components/progress/TutorManagementCard';
import LockedFeatureCard from '../components/LockedFeatureCard';
import parentGuides from '../data/parentGuides';
import { canUseFeature } from '../utils/entitlementGating';

const API_URL = process.env.REACT_APP_TUTOR_API_URL;

function ParentDashboard({ mastery, streaksAndPP, userData, currentUser, getToken, activeChildId, onTopicClick, onHome, onOpenParentMessages, entitlement, freeTierActive, onUpgrade }) {
  // Deep progress analytics (topic heat map, focus areas, mock history,
  // speed/accuracy detail) are a paid-tier feature (spec §4 / §11-E-14).
  // The basic set (overall accuracy, the three subject-level readiness
  // bars, and engagement) stays visible either way — only the diagnostic
  // half is behind this gate (basic-vs-deep progress line, freemium
  // phase-0 Change 4a). Tutor linking, subscription management, and GDPR
  // data rights below are NOT part of this gate — they stay available to
  // every tier.
  const deepProgressLocked = !!freeTierActive && !canUseFeature(entitlement, 'deepProgress');
  const practiceDays = streaksAndPP.getPracticeDays(84);
  const { signOut } = useClerk();
  const [deleteState, setDeleteState] = useState('idle'); // idle | confirm | deleting | done
  const [downloadState, setDownloadState] = useState('idle'); // idle | downloading
  const [emailOptIn, setEmailOptIn] = useState(null); // null = loading
  const [emailPrefSaving, setEmailPrefSaving] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [portalState, setPortalState] = useState('idle'); // idle | loading | error
  const [portalError, setPortalError] = useState(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Load account state on mount: email preference + subscription status.
  // Single fetch — the GET /api/account response carries both.
  useEffect(() => {
    if (!getToken || !API_URL) return;
    (async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${API_URL}/api/account`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setEmailOptIn(!!data.account?.email_opt_in);
          setSubscriptionStatus(data.access?.subscriptionStatus || null);
        }
      } catch (_) {}
    })();
  }, [getToken]);

  async function handleManageSubscription() {
    if (!getToken || !API_URL || portalState === 'loading') return;
    setPortalState('loading');
    setPortalError(null);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/stripe/portal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ returnUrl: window.location.origin + '/' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Portal failed: ${res.status}`);
      if (!data.url) throw new Error('Stripe did not return a portal URL');
      window.location.href = data.url;
    } catch (err) {
      setPortalError(err.message);
      setPortalState('idle');
    }
  }

  async function handleEmailPrefToggle() {
    if (!getToken || !API_URL || emailPrefSaving) return;
    const newVal = !emailOptIn;
    setEmailOptIn(newVal);
    setEmailPrefSaving(true);
    try {
      const token = await getToken();
      await fetch(`${API_URL}/api/account/email-preference`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ emailOptIn: newVal }),
      });
    } catch (_) {
      setEmailOptIn(!newVal); // revert on error
    } finally {
      setEmailPrefSaving(false);
    }
  }

  async function handleDownload() {
    if (!getToken || !API_URL) return;
    setDownloadState('downloading');
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/data/export`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Export failed: ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prepstep-data-${currentUser}-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('[ParentDashboard] Export failed:', err);
      alert('Download failed. Please try again or contact hello@prepstep.co.uk.');
    } finally {
      setDownloadState('idle');
    }
  }

  async function handleDelete() {
    if (!getToken || !API_URL) return;
    setDeleteState('deleting');
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/account`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      // Clear local state then sign out
      try { localStorage.clear(); } catch (_) {}
      setDeleteState('done');
      setTimeout(() => signOut(), 1500);
    } catch (err) {
      console.error('[ParentDashboard] Delete failed:', err);
      setDeleteState('idle');
      alert('Deletion failed. Please try again or contact hello@prepstep.co.uk.');
    }
  }

  return (
    <div className="app-bg p-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header handled by ProgressScreen tabs */}

        {/* Tutor Homework card — dormant when no tutor has assigned anything */}
        <TutorHomeworkCard activeChildId={activeChildId} getToken={getToken} />

        {/* Tutor management — dormant when no tutors linked */}
        <TutorManagementCard
          activeChildId={activeChildId}
          getToken={getToken}
          onOpenMessages={onOpenParentMessages}
        />

        {/* Basic progress — always visible, free or paid (basic-vs-deep
            progress line, freemium phase-0 Change 4a): the three subject
            readiness bars plus engagement and one overall accuracy number. */}
        <ExamReadinessCard mastery={mastery} />

        {deepProgressLocked && (
          <BasicProgressSummary streaksAndPP={streaksAndPP} userData={userData} />
        )}

        {/* Deep progress analytics — the topic-level diagnosis, locked for
            free-tier children. The underlying data already lives on the
            client (§9); this is a UI lock only, driven by the server
            entitlement, never a client flag. */}
        {deepProgressLocked ? (
          <LockedFeatureCard
            className="mb-6"
            title="Topic-by-Topic Diagnosis"
            description="See exactly which topics need work, track trends over time, and review mock test results and speed data."
            onUpgrade={onUpgrade}
          />
        ) : (
          <>
            {/* The most important card — answers "Is my child on track?" */}
            <OnTrackCard
              mastery={mastery}
              streaksAndPP={streaksAndPP}
              userData={userData}
              currentUser={currentUser}
            />

            <TopicHeatMap mastery={mastery} onTopicClick={onTopicClick} />

            <FocusAreas mastery={mastery} onTopicClick={onTopicClick} />

            <ParentGuidance
              guides={parentGuides}
              mastery={mastery}
              userData={userData}
            />

            <PracticeCalendar
              practiceDays={practiceDays}
              practiceLog={userData.practiceLog}
            />

            <MockTestHistory mockTestHistory={userData.mockTestHistory} />

            <SpeedTracking questionResults={userData.questionResults} />

            <SpeedAccuracyQuadrant questionResults={userData.questionResults} />
          </>
        )}

        {/* Subscription — only shown for paying customers (active/past_due/trialing).
            Comped, trial-only, and cancelled accounts don't see this card. */}
        {['active', 'past_due', 'trialing'].includes(subscriptionStatus) && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-base font-bold text-slate-800 mb-1">Subscription</h2>
            <p className="text-sm text-slate-500 mb-5">
              Update your card, view invoices, or cancel your subscription.
            </p>

            {portalError && (
              <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm mb-4">
                {portalError}
              </div>
            )}

            <button
              onClick={handleManageSubscription}
              disabled={portalState === 'loading'}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              <CreditCard className="w-4 h-4" />
              {portalState === 'loading' ? 'Opening secure portal…' : 'Manage subscription'}
            </button>
          </div>
        )}

        {/* Data & Privacy */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-base font-bold text-slate-800 mb-1">Data &amp; Privacy</h2>
          <p className="text-sm text-slate-500 mb-5">
            Under UK GDPR you can download or delete all data associated with this account at any time.
          </p>

          {/* Email preference toggle */}
          {emailOptIn !== null && (
            <div className="flex items-center justify-between py-3 border-b border-slate-100 mb-4">
              <div>
                <p className="text-sm font-semibold text-slate-700">Weekly progress emails</p>
                <p className="text-xs text-slate-400 mt-0.5">Sent every Sunday — {currentUser}'s quiz results and accuracy</p>
              </div>
              <button
                onClick={handleEmailPrefToggle}
                disabled={emailPrefSaving}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ml-4 ${emailOptIn ? 'bg-[#7C3AED]' : 'bg-slate-200'}`}
                aria-label={emailOptIn ? 'Unsubscribe from weekly emails' : 'Subscribe to weekly emails'}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${emailOptIn ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Download */}
            <button
              onClick={handleDownload}
              disabled={downloadState === 'downloading'}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {downloadState === 'downloading' ? 'Downloading…' : 'Download all data'}
            </button>

            {/* Delete — idle state */}
            {deleteState === 'idle' && (
              <button
                onClick={() => setDeleteState('confirm')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete account &amp; all data
              </button>
            )}
          </div>

          {/* Delete confirmation */}
          {deleteState === 'confirm' && (
            <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200">
              <div className="flex gap-3 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-red-800">This cannot be undone</p>
                  <p className="text-sm text-red-700 mt-0.5">
                    All quiz history, progress, and {currentUser}'s learning data will be permanently deleted. Your Clerk login will be removed.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setDeleteState('idle')}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
                >
                  Yes, delete everything
                </button>
              </div>
            </div>
          )}

          {/* Deleting / done states */}
          {deleteState === 'deleting' && (
            <p className="mt-4 text-sm text-slate-500">Deleting account…</p>
          )}
          {deleteState === 'done' && (
            <p className="mt-4 text-sm text-green-700 font-semibold">Account deleted. Signing you out…</p>
          )}
        </div>

        <div className="h-8" />
      </div>
    </div>
  );
}

export default ParentDashboard;
