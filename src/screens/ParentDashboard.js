import React, { useEffect, useState } from 'react';
import { useClerk } from '@clerk/clerk-react';
import { Download, Trash2, AlertTriangle } from 'lucide-react';
import OnTrackCard from '../components/progress/OnTrackCard';
import ExamReadinessCard from '../components/progress/ExamReadinessCard';
import TopicHeatMap from '../components/progress/TopicHeatMap';
import PracticeCalendar from '../components/progress/PracticeCalendar';
import FocusAreas from '../components/progress/FocusAreas';
import MockTestHistory from '../components/progress/MockTestHistory';
import SpeedTracking from '../components/progress/SpeedTracking';
import SpeedAccuracyQuadrant from '../components/progress/SpeedAccuracyQuadrant';
import ParentGuidance from '../components/progress/ParentGuidance';
import parentGuides from '../data/parentGuides';

const API_URL = process.env.REACT_APP_TUTOR_API_URL;

function ParentDashboard({ mastery, streaksAndPP, userData, currentUser, getToken, onTopicClick, onHome }) {
  const practiceDays = streaksAndPP.getPracticeDays(84);
  const { signOut } = useClerk();
  const [deleteState, setDeleteState] = useState('idle'); // idle | confirm | deleting | done
  const [downloadState, setDownloadState] = useState('idle'); // idle | downloading

  useEffect(() => { window.scrollTo(0, 0); }, []);

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

        {/* The most important card — answers "Is my child on track?" */}
        <OnTrackCard
          mastery={mastery}
          streaksAndPP={streaksAndPP}
          userData={userData}
          currentUser={currentUser}
        />

        <ExamReadinessCard mastery={mastery} />

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

        {/* Data & Privacy */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-base font-bold text-slate-800 mb-1">Data &amp; Privacy</h2>
          <p className="text-sm text-slate-500 mb-5">
            Under UK GDPR you can download or delete all data associated with this account at any time.
          </p>

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
