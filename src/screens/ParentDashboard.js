import React from 'react';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import OnTrackCard from '../components/progress/OnTrackCard';
import ExamReadinessCard from '../components/progress/ExamReadinessCard';
import TopicHeatMap from '../components/progress/TopicHeatMap';
import PracticeCalendar from '../components/progress/PracticeCalendar';
import FocusAreas from '../components/progress/FocusAreas';
import MockTestHistory from '../components/progress/MockTestHistory';
import SpeedTracking from '../components/progress/SpeedTracking';
import ParentGuidance from '../components/progress/ParentGuidance';
import parentGuides from '../data/parentGuides';

function ParentDashboard({ mastery, streaksAndPP, userData, currentUser, onTopicClick, onBack, onHome }) {
  const practiceDays = streaksAndPP.getPracticeDays(84);

  return (
    <div className="app-bg p-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-[#6C5CE7] hover:text-[#5A4BD1] font-medium gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            My Journey
          </button>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#6C5CE7]" />
            <h2 className="font-heading font-bold text-[#2D3436]">Parent Dashboard</h2>
          </div>
        </div>

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

        <button
          onClick={onHome}
          className="w-full py-3 text-[#6C5CE7] hover:text-[#5A4BD1] font-medium text-center mb-8"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

export default ParentDashboard;
