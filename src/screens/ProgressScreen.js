import React, { useState } from 'react';
import ChildProgressView from './ChildProgressView';

function ProgressScreen({ quizHistory, questionData, mastery, streaksAndPP, onHome, onStartTopic }) {
  const [view, setView] = useState('child'); // 'child' or 'parent'

  if (view === 'child') {
    return (
      <div>
        <ChildProgressView
          mastery={mastery}
          streaksAndPP={streaksAndPP}
          quizHistory={quizHistory}
          onStartTopic={onStartTopic}
          onHome={onHome}
        />
        <div className="text-center pb-6">
          <button
            onClick={() => setView('parent')}
            className="text-xs text-[#A29BFE] hover:text-[#6C5CE7] font-medium"
          >
            Switch to Parent Dashboard →
          </button>
        </div>
      </div>
    );
  }

  // Parent dashboard placeholder — Phase 3
  return (
    <div className="app-bg p-4 min-h-screen">
      <div className="max-w-3xl mx-auto text-center py-12">
        <h2 className="text-2xl font-heading font-bold text-[#2D3436] mb-4">Parent Dashboard</h2>
        <p className="text-[#636E72] mb-6">Detailed analytics coming soon — topic heat maps, exam readiness, speed tracking, and more.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => setView('child')} className="px-6 py-3 btn-primary">
            Back to My Journey
          </button>
          <button onClick={onHome} className="px-6 py-3 bg-[#EDE8FF] hover:bg-[#DDD6FE] text-[#2D3436] font-bold rounded-xl">
            Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProgressScreen;
