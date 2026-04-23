import React, { useState, useMemo } from 'react';
import { ArrowLeft, Lightbulb, Sparkles, BookOpen, Home } from 'lucide-react';
import TipCard from '../components/TipCard';
import LessonBrowser from '../components/LessonBrowser';
import { getWeakTopics } from '../utils/tipSelection';

function StudyToolkitScreen({ subject, tips, seenTips, onMarkSeen, topicPerformance, lessonBank, lessonHistory, onLaunchLesson, toolkitLessonsViewed, onStartQuiz, onBack, onHome }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [activeTab, setActiveTab] = useState('tips');

  const subjectNames = { maths: 'Maths', english: 'English', verbalreasoning: 'Verbal Reasoning' };
  const subjectColours = { maths: '#3B82F6', english: '#22C55E', verbalreasoning: '#7C3AED' };
  const colour = subjectColours[subject] || '#7C3AED';
  const subjectName = subjectNames[subject] || 'General';

  // Filter tips for this subject + general tips, sorted by relevance to weak topics
  const availableTips = useMemo(() => {
    const subjectTips = (tips || []).filter(t => t.subject === subject || t.subject === 'general');
    const seenSet = new Set(seenTips || []);

    // Find child's weakest topics for relevance-based sorting
    const weakTopics = getWeakTopics(topicPerformance, 3);
    const weakSet = new Set(weakTopics);

    // 3-tier sort: unseen+weak-relevant (3), unseen (2), seen+weak-relevant (1), seen (0)
    const scored = subjectTips.map(t => {
      const isUnseen = !seenSet.has(t.id);
      const isWeakRelevant = (t.topicKeys || []).some(k => weakSet.has(k));
      let score = 0;
      if (isUnseen && isWeakRelevant) score = 3;
      else if (isUnseen) score = 2;
      else if (isWeakRelevant) score = 1;
      return { tip: t, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.map(s => s.tip);
  }, [tips, subject, seenTips, topicPerformance]);

  const unseenCount = useMemo(() => {
    const seenSet = new Set(seenTips || []);
    return availableTips.filter(t => !seenSet.has(t.id)).length;
  }, [availableTips, seenTips]);

  const currentTip = availableTips[currentIndex];

  const handleNext = () => {
    // Mark current tip as seen
    if (currentTip && onMarkSeen) {
      onMarkSeen(currentTip.id);
    }
    if (currentIndex < availableTips.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Last tip — loop back to start instead of exiting
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Intro screen
  if (showIntro) {
    return (
      <div className="app-bg p-4 min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, ${colour}, ${colour}CC)` }}>
            <Lightbulb className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-heading font-bold text-slate-800 mb-3">
            {subjectName} Study Toolkit
          </h2>
          <p className="text-lg text-slate-500 mb-2">
            Tips, strategies, and lessons to help you ace the exam!
          </p>
          {unseenCount > 0 ? (
            <div className="flex items-center justify-center gap-2 mb-8">
              <Sparkles className="w-5 h-5" style={{ color: colour }} />
              <p className="text-sm font-bold" style={{ color: colour }}>
                {unseenCount} new tip{unseenCount !== 1 ? 's' : ''} to discover!
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-500 mb-8">
              You've seen all the tips — time to review your favourites!
            </p>
          )}
          <button
            onClick={() => setShowIntro(false)}
            className="px-10 py-4 text-white font-bold rounded-xl text-lg transition-all shadow-lg hover:shadow-xl"
            style={{ background: colour }}
          >
            Let's Study!
          </button>
          <button
            onClick={onBack}
            className="block mx-auto mt-4 text-sm text-slate-500 hover:text-slate-800"
          >
            &larr; Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-bg p-4 min-h-screen">
      <div className="max-w-lg mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="flex items-center text-[#7C3AED] hover:text-[#5A4BD1] font-medium gap-1 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Learning Modes
            </button>
            {onHome && (
              <button onClick={onHome} className="p-1.5 text-gray-400 hover:text-[#7C3AED] transition-colors" title="Home">
                <Home className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4" style={{ color: colour }} />
            <span className="text-xs font-bold text-slate-500">Study Toolkit</span>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-4">
          <button
            onClick={() => setActiveTab('tips')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'tips'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            Tips & Strategies
          </button>
          <button
            onClick={() => setActiveTab('lessons')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'lessons'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Lessons
          </button>
        </div>

        {/* Tab content */}
        {activeTab === 'tips' ? (
          // Tips carousel
          currentTip ? (
            <div className="">
              <TipCard
                tip={currentTip}
                index={currentIndex}
                total={availableTips.length}
                onNext={handleNext}
                onBack={handlePrev}
                isLast={currentIndex === availableTips.length - 1}
              />
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-lg text-slate-500">No tips available yet!</p>
            </div>
          )
        ) : (
          // Lesson browser
          <div className="">
            <LessonBrowser
              subject={subject}
              lessonBank={lessonBank}
              lessonHistory={lessonHistory}
              onLaunchLesson={onLaunchLesson}
              toolkitLessonsViewed={toolkitLessonsViewed || 0}
              onStartQuiz={onStartQuiz}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default StudyToolkitScreen;
