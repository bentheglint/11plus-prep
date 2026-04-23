import React, { useState } from 'react';
import { ArrowLeft, Home, User, BarChart3 } from 'lucide-react';
import ChildProgressView from './ChildProgressView';
import ParentDashboard from './ParentDashboard';

// Tab choice persists across ProgressScreen unmount/remount (e.g. drill-down →
// back) via sessionStorage — returning to the screen keeps you on the tab
// you came from. Flagged during 15 Apr walkthrough (Phase 11).
const TAB_STORAGE_KEY = 'progressScreen:view';

function ProgressScreen({ quizHistory, questionData, mastery, streaksAndPP, userData, currentUser, onHome, onStartTopic, onDrillDown, onViewQuiz, onViewAllActivity }) {
  const initialView = (() => {
    if (typeof window === 'undefined') return 'child';
    if (new URLSearchParams(window.location.search).get('view') === 'progress-parent') return 'parent';
    const stored = sessionStorage.getItem(TAB_STORAGE_KEY);
    return stored === 'parent' ? 'parent' : 'child';
  })();
  const [view, setViewState] = useState(initialView);
  const setView = (next) => {
    setViewState(next);
    try { sessionStorage.setItem(TAB_STORAGE_KEY, next); } catch (_) { /* noop */ }
  };

  return (
    <div className="app-bg min-h-screen">
      {/* Shared header with back, tabs, and home */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button onClick={onHome} className="flex items-center text-[#7C3AED] hover:text-[#5A4BD1] font-medium gap-2">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>

          {/* Child / Parent tabs */}
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setView('child')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                view === 'child' ? 'bg-white text-[#7C3AED] shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <User className="w-4 h-4" />
              My Journey
            </button>
            <button
              onClick={() => setView('parent')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                view === 'parent' ? 'bg-white text-[#7C3AED] shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Parent Dashboard
            </button>
          </div>

          <button onClick={onHome} className="p-2 text-gray-400 hover:text-[#7C3AED] transition-colors" title="Home">
            <Home className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* View content */}
      {view === 'parent' ? (
        <ParentDashboard
          mastery={mastery}
          streaksAndPP={streaksAndPP}
          userData={userData}
          currentUser={currentUser}
          onTopicClick={onDrillDown || onStartTopic}
          onHome={onHome}
        />
      ) : (
        <ChildProgressView
          mastery={mastery}
          streaksAndPP={streaksAndPP}
          quizHistory={quizHistory}
          onStartTopic={onStartTopic}
          onDrillDown={onDrillDown}
          onHome={onHome}
          onViewQuiz={onViewQuiz}
          onViewAllActivity={onViewAllActivity}
        />
      )}
    </div>
  );
}

export default ProgressScreen;
