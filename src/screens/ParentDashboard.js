import React, { useEffect } from 'react';
// Icons handled by ProgressScreen header
import OnTrackCard from '../components/progress/OnTrackCard';
import ExamReadinessCard from '../components/progress/ExamReadinessCard';
import TopicHeatMap from '../components/progress/TopicHeatMap';
import PracticeCalendar from '../components/progress/PracticeCalendar';
import FocusAreas from '../components/progress/FocusAreas';
import MockTestHistory from '../components/progress/MockTestHistory';
import SpeedTracking from '../components/progress/SpeedTracking';
import SpeedAccuracyQuadrant from '../components/progress/SpeedAccuracyQuadrant';
import ParentGuidance from '../components/progress/ParentGuidance';
import TutorHomeworkCard from '../components/progress/TutorHomeworkCard';
import parentGuides from '../data/parentGuides';

function ParentDashboard({ mastery, streaksAndPP, userData, currentUser, getToken, activeChildId, onTopicClick, onHome }) {
  const practiceDays = streaksAndPP.getPracticeDays(84);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="app-bg p-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header handled by ProgressScreen tabs */}

        {/* Tutor Homework card — dormant when no tutor has assigned anything */}
        <TutorHomeworkCard activeChildId={activeChildId} getToken={getToken} />

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

        <div className="h-8" />
      </div>
    </div>
  );
}

export default ParentDashboard;
