import React, { useState } from 'react';
import ChildProgressView from './ChildProgressView';
import ParentDashboard from './ParentDashboard';

function ProgressScreen({ quizHistory, questionData, mastery, streaksAndPP, userData, currentUser, onHome, onStartTopic, onDrillDown }) {
  // Check URL for direct parent dashboard access
  const defaultView = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('view') === 'progress-parent' ? 'parent' : 'child';
  const [view, setView] = useState(defaultView);

  if (view === 'parent') {
    return (
      <ParentDashboard
        mastery={mastery}
        streaksAndPP={streaksAndPP}
        userData={userData}
        currentUser={currentUser}
        onTopicClick={onDrillDown || onStartTopic}
        onBack={() => setView('child')}
        onHome={onHome}
      />
    );
  }

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

export default ProgressScreen;
