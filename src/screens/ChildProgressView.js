import React, { useState } from 'react';
import { Calculator, BookOpen, Brain, Star, ChevronRight, TrendingUp, TrendingDown, RotateCcw } from 'lucide-react';
import StreakDisplay from '../components/StreakDisplay';
import PrepPointsBar from '../components/PrepPointsBar';
import TopicStarRating from '../components/TopicStarRating';
import RecommendationCard, { topicNames } from '../components/RecommendationCard';

const subjectConfig = {
  maths: { key: 'maths', name: 'Maths', icon: Calculator, colour: '#0770C2', gradient: 'from-[#0770C2] to-[#0652DD]' },
  english: { key: 'english', name: 'English', icon: BookOpen, colour: '#007D62', gradient: 'from-[#007D62] to-[#00876A]' },
  verbalreasoning: { key: 'verbalreasoning', name: 'Verbal Reasoning', icon: Brain, colour: '#6C5CE7', gradient: 'from-[#6C5CE7] to-[#5A4BD1]' },
};

function ChildProgressView({ mastery, streaksAndPP, quizHistory, onStartTopic, onDrillDown, onHome }) {
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
        <div className="flex items-center justify-between mb-6">
          <StreakDisplay
            currentStreak={streaksAndPP.currentStreak}
            longestStreak={streaksAndPP.longestStreak}
            isActive={streaksAndPP.isStreakActive()}
          />
          <div className="w-48">
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
              const bgIntensity = topic.score > 0 ? Math.min(0.15, topic.score / 600) : 0;
              const colour = subjectConfig[selectedSubject]?.colour || '#6C5CE7';
              const trendColour = topic.trend?.direction === 'up' ? '#007D62' :
                                  topic.trend?.direction === 'down' ? '#FF6B6B' : null;
              const TrendIcon = topic.trend?.direction === 'up' ? TrendingUp :
                               topic.trend?.direction === 'down' ? TrendingDown : null;

              return (
                <button
                  key={topic.key}
                  onClick={() => onDrillDown ? onDrillDown(selectedSubject, topic.key) : onStartTopic(selectedSubject, topic.key)}
                  className="p-3 rounded-lg border border-gray-100 text-left hover:shadow-md transition-all relative overflow-hidden group"
                  style={{ background: topic.score > 0 ? `rgba(${colour === '#0770C2' ? '9,132,227' : colour === '#007D62' ? '0,184,148' : '108,92,231'},${bgIntensity})` : undefined }}
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-sm font-bold text-slate-800 leading-tight">{topic.name}</p>
                    {TrendIcon && (
                      <TrendIcon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: trendColour }} />
                    )}
                  </div>
                  <div className="flex items-center gap-0.5 mb-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} className="w-3 h-3" fill={i <= topic.stars ? '#FDCB6E' : 'none'} stroke={i <= topic.stars ? '#F39C12' : '#DFE6E9'} strokeWidth={2} />
                    ))}
                  </div>
                  {topic.totalQuestions > 0 ? (
                    <p className="text-[10px] text-slate-500">
                      {topic.recentAccuracy}% accuracy
                      {topic.daysSince > 0 && ` · ${topic.daysSince}d ago`}
                    </p>
                  ) : (
                    <p className="text-[10px] text-[#A29BFE] font-medium">Tap to start!</p>
                  )}
                  {topic.daysSince > 14 && topic.stars > 0 && (
                    <span className="absolute top-1 right-1 text-[8px] font-bold text-amber-500 bg-amber-50 px-1 py-0.5 rounded">
                      <RotateCcw className="w-2 h-2 inline mr-0.5" />Review
                    </span>
                  )}
                  <ChevronRight className="absolute right-2 bottom-2 w-4 h-4 text-gray-200 group-hover:text-gray-400 transition-colors" />
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
              {recentQuizzes.map(quiz => {
                const dotColour = quiz.percentage >= 80 ? '#007D62' : quiz.percentage >= 60 ? '#FDCB6E' : '#FF6B6B';
                const date = new Date(quiz.date);
                const isToday = date.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
                const dateLabel = isToday ? 'Today' : date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

                return (
                  <div key={quiz.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: dotColour }} />
                      <div>
                        <p className="text-sm font-medium text-slate-800">{quiz.topic}</p>
                        <p className="text-[10px] text-slate-500">{dateLabel} · {quiz.score}/{quiz.total}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold" style={{ color: dotColour }}>{quiz.percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Spacer for bottom scroll room */}
        <div className="h-4" />
      </div>
    </div>
  );
}

export default ChildProgressView;
