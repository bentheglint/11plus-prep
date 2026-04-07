import React from 'react';
import { BookOpen, Calculator, Brain, GraduationCap, BarChart3, Wrench } from 'lucide-react';
import UserAvatar from '../components/UserAvatar';
import StreakDisplay from '../components/StreakDisplay';
import RecommendationCard from '../components/RecommendationCard';

function SubjectCard({ title, icon: Icon, gradient, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`bg-gradient-to-br ${gradient} text-white rounded-2xl p-8 transition-all transform hover:scale-[1.03] shadow-lg hover:shadow-xl animate-scale-in`}
    >
      <div className="w-16 h-16 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
        <Icon className="w-9 h-9" />
      </div>
      <h3 className="text-2xl font-heading font-bold">{title}</h3>
    </button>
  );
}

function HomeScreen({ currentUser, onSetCurrentUser, onSubjectSelect, onViewProgress, onViewMistakes, onSpeedReview, onStartTopic, mastery, streaksAndPP }) {
  // Get top 2 suggested topics from mastery system
  const suggestions = mastery ? mastery.getFocusAreas().slice(0, 2) : [];

  return (
    <div className="app-bg p-4">
      <div className="max-w-4xl mx-auto">
        {/* Top bar with streak + avatar */}
        <div className="flex items-center justify-between mb-4">
          {streaksAndPP ? (
            <StreakDisplay
              currentStreak={streaksAndPP.currentStreak}
              longestStreak={streaksAndPP.longestStreak}
              isActive={streaksAndPP.isStreakActive()}
              practiceDays={streaksAndPP.getPracticeDays(56)}
            />
          ) : <div />}
          <UserAvatar currentUser={currentUser} onSetCurrentUser={onSetCurrentUser} />
        </div>

        <div className="text-center mb-6 mt-2 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6C5CE7] to-[#A29BFE] flex items-center justify-center shadow-lg">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-[#2D3436]">
              11+ Test Prep
            </h1>
          </div>
          <p className="text-sm text-[#636E72] mb-1">Built by Ben</p>
          <p className="text-lg text-[#636E72] font-medium">Choose a subject to start practising!</p>
        </div>

        <div className="mb-8 flex justify-center gap-3 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <button
            onClick={onViewProgress}
            className="flex items-center gap-3 px-6 py-3 bg-white text-[#2D3436] font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <BarChart3 className="w-5 h-5 text-[#6C5CE7]" />
            <span className="font-heading">View My Progress</span>
          </button>
          {onViewMistakes && (
            <button
              onClick={onViewMistakes}
              className="flex items-center gap-3 px-6 py-3 bg-white text-[#2D3436] font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <BookOpen className="w-5 h-5 text-[#FF6B6B]" />
              <span className="font-heading">My Mistakes</span>
            </button>
          )}
          {(currentUser === 'Ben' || currentUser === 'Lauren' || currentUser === 'Daisy' || currentUser === 'Jacqui') && (
            <button
              onClick={onSpeedReview}
              className="flex items-center gap-3 px-6 py-3 bg-white text-[#2D3436] font-bold rounded-xl border border-amber-300 hover:bg-amber-50 transition-colors"
            >
              <Wrench className="w-5 h-5 text-amber-500" />
              <span className="font-heading">Speed Review</span>
            </button>
          )}
        </div>

        {/* Suggested next sessions */}
        {suggestions.length > 0 && (
          <div className="mb-8 max-w-xl mx-auto space-y-3 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            <p className="text-xs font-bold text-[#636E72] uppercase tracking-wider text-center mb-2">
              Suggested for you
            </p>
            {suggestions.map(rec => (
              <RecommendationCard
                key={rec.topicKey}
                recommendation={rec}
                onStart={onStartTopic}
              />
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 stagger-children">
          <SubjectCard
            title="Maths"
            icon={Calculator}
            gradient="from-[#0984E3] to-[#0652DD]"
            onClick={() => onSubjectSelect('maths')}
          />
          <SubjectCard
            title="English"
            icon={BookOpen}
            gradient="from-[#00B894] to-[#00876A]"
            onClick={() => onSubjectSelect('english')}
          />
          <SubjectCard
            title="Verbal Reasoning"
            icon={Brain}
            gradient="from-[#6C5CE7] to-[#5A4BD1]"
            onClick={() => onSubjectSelect('verbalreasoning')}
          />
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;
