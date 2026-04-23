import React from 'react';
import { ChevronRight, Star, Crown, Rocket, Target, Wrench, ArrowLeft, Home } from 'lucide-react';

function getTopicBadge(pct) {
  if (pct >= 90) return { label: 'Jedi Master', icon: Crown, color: 'text-[#F59E0B]', bg: 'bg-[#FDCB6E]/20' };
  if (pct >= 70) return { label: 'Space Captain', icon: Rocket, color: 'text-[#3B82F6]', bg: 'bg-[#3B82F6]/10' };
  if (pct >= 50) return { label: 'Star Cadet', icon: Star, color: 'text-[#7C3AED]', bg: 'bg-[#7C3AED]/10' };
  if (pct >= 30) return { label: 'Rocket Rookie', icon: Wrench, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' };
  return { label: 'Launch Pad', icon: Target, color: 'text-slate-500', bg: 'bg-gray-100' };
}

function TopicCard({ title, performance, onClick }) {
  let perfDisplay = null;
  let perfPct = null;
  let perfBarColor = '#EDE8FF';
  if (performance) {
    if (performance.total >= 5) {
      const pct = Math.round((performance.correct / performance.total) * 100);
      perfPct = pct;
      perfBarColor = pct >= 70 ? '#22C55E' : pct >= 40 ? '#FDCB6E' : '#FF6B6B';
      const pctColor = pct >= 70 ? 'text-[#22C55E]' : pct >= 40 ? 'text-[#F59E0B]' : 'text-[#FF6B6B]';
      const badge = getTopicBadge(pct);
      const BadgeIcon = badge.icon;
      perfDisplay = (
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-sm font-bold ${pctColor}`}>{pct}%</span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge.bg} ${badge.color} flex items-center gap-1`}>
            <BadgeIcon className="w-3 h-3" />
            {badge.label}
          </span>
        </div>
      );
    } else {
      perfDisplay = <p className="text-sm text-slate-500 mt-1">Not enough data</p>;
    }
  }
  return (
    <button
      onClick={onClick}
      className="w-full card hover:bg-[#EDE8FF]/30 rounded-xl p-6 transition-all flex items-center justify-between group overflow-hidden relative"
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
        style={{ background: perfPct !== null ? perfBarColor : '#EDE8FF' }}
      />
      <div className="text-left pl-3">
        <h4 className="text-xl font-heading font-bold text-slate-800 mb-1">{title}</h4>
        {perfDisplay}
      </div>
      <ChevronRight className="w-8 h-8 text-[#A29BFE] group-hover:translate-x-1 transition-transform" />
    </button>
  );
}

function TopicsScreen({ subject, topicPerformance, onTopicSelect, onBack, onHome }) {
  const topicEntries = Object.entries(subject.topics);
  const sortedTopics = [...topicEntries].sort((a, b) => {
    const perfA = topicPerformance[a[0]];
    const perfB = topicPerformance[b[0]];
    const tierOf = (p) => !p ? 0 : p.total < 5 ? 1 : 2;
    const tierA = tierOf(perfA);
    const tierB = tierOf(perfB);
    if (tierA !== tierB) return tierA - tierB;
    if (tierA === 2) return (perfA.correct / perfA.total) - (perfB.correct / perfB.total);
    return 0;
  });

  return (
    <div className="app-bg p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-[#7C3AED] hover:text-[#5A4BD1] font-medium gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Learning Modes
          </button>
          {onHome && (
            <button onClick={onHome} className="p-2 text-gray-400 hover:text-[#7C3AED] transition-colors" title="Home">
              <Home className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-heading font-bold text-slate-800 mb-2">
            {subject.name} Topics
          </h2>
          <p className="text-slate-500">Pick a topic to practise</p>
        </div>

        <div className="space-y-4">
          {sortedTopics.map(([key, topic]) => (
            <TopicCard
              key={key}
              title={topic.name}
              performance={topicPerformance[key]}
              onClick={() => onTopicSelect(key)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default TopicsScreen;
