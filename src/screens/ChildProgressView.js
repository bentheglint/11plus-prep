import React, { useState } from 'react';
import { Calculator, BookOpen, Brain, Star, ChevronRight, TrendingUp, TrendingDown, RotateCcw } from 'lucide-react';
import StreakDisplay from '../components/StreakDisplay';
import PrepPointsBar from '../components/PrepPointsBar';
import TopicStarRating from '../components/TopicStarRating';
import RecommendationCard, { topicNames } from '../components/RecommendationCard';
import QuizHistoryRow from '../components/QuizHistoryRow';

const subjectConfig = {
  maths: { key: 'maths', name: 'Maths', icon: Calculator, colour: '#3B82F6', gradient: 'from-[#3B82F6] to-[#2563EB]' },
  english: { key: 'english', name: 'English', icon: BookOpen, colour: '#22C55E', gradient: 'from-[#22C55E] to-[#16A34A]' },
  verbalreasoning: { key: 'verbalreasoning', name: 'Verbal Reasoning', icon: Brain, colour: '#7C3AED', gradient: 'from-[#7C3AED] to-[#5A4BD1]' },
};

function ChildProgressView({ mastery, streaksAndPP, quizHistory, onStartTopic, onDrillDown, onHome, onViewQuiz, onViewAllActivity }) {
  const [selectedSubject, setSelectedSubject] = useState('maths');

  const levelInfo = streaksAndPP.getLevelInfo();
  const allMastery = mastery.getAllMastery();

  // Get recommendation for the selected subject
  const recommendation = mastery.getRecommendedNext(selectedSubject);

  // Get topics for the selected subject
  const subjectTopics = mastery.SUBJECT_TOPICS[selectedSubject] || [];
  const topicMasteries = subjectTopics.map(key => ({
    key,
    name: topicNames[key] || key,
    ...mastery.getTopicMastery(key),
  }));

  // Subject mastery summaries
  const subjectSummaries = Object.keys(subjectConfig).map(key => ({
    ...subjectConfig[key],
    mastery: mastery.getSubjectMastery(key),
  }));

  // Recent activity (last 5 quizzes — most recent first)
  const recentQuizzes = [...quizHistory]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="app-bg p-4 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* Header: Streak + Level */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <StreakDisplay
            currentStreak={streaksAndPP.currentStreak}
            longestStreak={streaksAndPP.longestStreak}
            isActive={streaksAndPP.isStreakActive()}
          />
          <div className="w-full sm:w-48">
            <PrepPointsBar levelInfo={levelInfo} />
          </div>
        </div>

        {/* What to Practise Next */}
        <div className="mb-6">
          <RecommendationCard
            recommendation={recommendation}
            onStart={onStartTopic}
          />
        </div>

        {/* Subject Mastery Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {subjectSummaries.map(s => {
            const Icon = s.icon;
            const isSelected = selectedSubject === s.key;
            return (
              <button
                key={s.key}
                onClick={() => setSelectedSubject(s.key)}
                className={`card rounded-xl p-4 text-center transition-all ${
                  isSelected ? 'ring-2 ring-offset-2 shadow-lg' : 'hover:shadow-md'
                }`}
                style={isSelected ? { '--tw-ring-color': s.colour } : {}}
              >
                <Icon className="w-6 h-6 mx-auto mb-2" style={{ color: s.colour }} />
                <p className="text-sm font-bold text-slate-800 mb-1">{s.name}</p>
                <TopicStarRating stars={s.mastery.stars} compact />
                <p className="text-[10px] text-slate-500 mt-1">
                  {s.mastery.topicsCovered}/{s.mastery.topicsTotal} topics
                </p>
              </button>
            );
          })}
        </div>

        {/* Topic Star Grid for Selected Subject */}
        <div className="card-elevated p-5 mb-6">
          <h3 className="font-heading font-bold text-slate-800 mb-4">
            {subjectConfig[selectedSubject]?.name} Topics
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {topicMasteries.map(topic => {
              const colour = subjectConfig[selectedSubject]?.colour || '#7C3AED';
              const masteryScale = {
                '#3B82F6': ['#DBEAFE', '#BFDBFE', '#93C5FD', '#3B82F6'],
                '#22C55E': ['#DCFCE7', '#BBF7D0', '#86EFAC', '#22C55E'],
                '#7C3AED': ['#EDE9FE', '#DDD6FE', '#C4B5FD', '#7C3AED'],
              };
              const scale = masteryScale[colour] || masteryScale['#7C3AED'];
              const cardBg = topic.score >= 90 ? '#FDCB6E'
                : topic.stars >= 1 ? scale[Math.min(topic.stars - 1, 3)]
                : undefined;
              const textOnDark = topic.stars === 4;
              const trendColour = topic.trend?.direction === 'up' ? '#22C55E' :
                                  topic.trend?.direction === 'down' ? '#FF6B6B' : null;
              const TrendIcon = topic.trend?.direction === 'up' ? TrendingUp :
                               topic.trend?.direction === 'down' ? TrendingDown : null;

              return (
                <button
                  key={topic.key}
                  onClick={() => onDrillDown ? onDrillDown(selectedSubject, topic.key) : onStartTopic(selectedSubject, topic.key)}
                  className="p-3 rounded-lg border border-gray-100 text-left hover:shadow-md transition-all relative overflow-hidden group"
                  style={{ background: cardBg }}
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className={`text-sm font-bold leading-tight ${textOnDark ? 'text-white' : 'text-slate-800'}`}>{topic.name}</p>
                    {TrendIcon && (
                      <TrendIcon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: textOnDark ? '#fff' : trendColour }} />
                    )}
                  </div>
                  <div className="flex items-center gap-0.5 mb-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} className="w-3 h-3"
                        fill={i <= topic.stars ? (textOnDark ? '#fff' : '#FDCB6E') : 'none'}
                        stroke={i <= topic.stars ? (textOnDark ? '#fff' : '#F59E0B') : (textOnDark ? 'rgba(255,255,255,0.4)' : '#DFE6E9')}
                        strokeWidth={2} />
                    ))}
                  </div>
                  {topic.totalQuestions > 0 ? (
                    <p className={`text-[10px] ${textOnDark ? 'text-white/70' : 'text-slate-500'}`}>
                      {topic.recentAccuracy}% accuracy
                      {topic.daysSince > 0 && ` · ${topic.daysSince}d ago`}
                    </p>
                  ) : (
                    <p className="text-[10px] text-[#A29BFE] font-medium">Tap to start!</p>
                  )}
                  {topic.daysSince > 14 && topic.stars > 0 && (
                    <span className={`absolute top-1 right-1 text-[8px] font-bold px-1 py-0.5 rounded ${textOnDark ? 'text-white/80 bg-white/20' : 'text-amber-500 bg-amber-50'}`}>
                      <RotateCcw className="w-2 h-2 inline mr-0.5" />Review
                    </span>
                  )}
                  <ChevronRight className={`absolute right-2 bottom-2 w-4 h-4 transition-colors ${textOnDark ? 'text-white/30 group-hover:text-white/60' : 'text-gray-200 group-hover:text-gray-400'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        {recentQuizzes.length > 0 && (
          <div className="card-elevated p-5 mb-6">
            <h3 className="font-heading font-bold text-slate-800 mb-3">Recent Activity</h3>
            <div className="space-y-2">
              {recentQuizzes.map(quiz => (
                <QuizHistoryRow key={quiz.id} quiz={quiz} onView={onViewQuiz} />
              ))}
            </div>
            {onViewAllActivity && quizHistory.length > recentQuizzes.length && (
              <button
                onClick={onViewAllActivity}
                className="w-full mt-3 pt-3 border-t border-gray-100 flex items-center justify-center gap-1 text-sm font-bold text-[#7C3AED] hover:text-[#5A4BD1] transition-colors"
              >
                View all activity
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Spacer for bottom scroll room */}
        <div className="h-4" />
      </div>
    </div>
  );
}

export default ChildProgressView;
