import React from 'react';
import { ChevronRight, Star, ArrowLeft, Home } from 'lucide-react';

function StarRow({ count, label }) {
  return (
    <div className="flex items-center gap-1.5 mt-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < count ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-slate-200 fill-slate-200'}`}
        />
      ))}
      <span className="text-sm font-semibold text-slate-600 ml-1">{label}</span>
    </div>
  );
}

/**
 * Derive the display state for a topic card given mastery + topicPerformance data.
 * Exported as a pure function so it can be unit-tested independently.
 *
 * Returns one of:
 *   { state: 'not-started' }
 *   { state: 'has-mastery', bestStars, bestLabel, daysSince, volume }
 *   { state: 'lifetime-only', daysSince, volume }   ← lifetime>0, no recent rows
 *   { state: 'mastery-no-volume', bestStars, bestLabel, daysSince }
 */
export function deriveTopicCardState(m, tp) {
  const hasRecentRows = m.totalQuestions > 0;
  const hasLifetimeVolume = tp && tp.total > 0;

  if (!hasRecentRows && !hasLifetimeVolume) {
    return { state: 'not-started' };
  }

  // Lifetime tally can lag behind local rows while the sync queue is offline —
  // never show a smaller count than the questions we can see locally.
  const volume = Math.max(tp ? tp.total : 0, hasRecentRows ? m.totalQuestions : 0);

  if (hasRecentRows && tp) {
    return { state: 'has-mastery', bestStars: m.bestStars, bestLabel: m.bestLabel, daysSince: m.daysSince, volume };
  }

  if (hasRecentRows && !tp) {
    return { state: 'mastery-no-volume', bestStars: m.bestStars, bestLabel: m.bestLabel, daysSince: m.daysSince };
  }

  // !hasRecentRows but hasLifetimeVolume — precedence rule: never show 'Not started'
  return { state: 'lifetime-only', daysSince: m.daysSince, volume: tp.total };
}

function RevisitChip() {
  return (
    <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 mt-1.5">
      Time to revisit
    </span>
  );
}

function TopicCard({ title, mastery, topicPerf, onClick }) {
  const cardState = deriveTopicCardState(mastery, topicPerf);
  const stale = cardState.daysSince !== undefined && cardState.daysSince > 14;

  let perfDisplay = null;
  let accentColor = '#EDE8FF';

  if (cardState.state === 'not-started') {
    perfDisplay = <p className="text-sm text-slate-500 mt-1">Not started</p>;
  } else if (cardState.state === 'has-mastery') {
    accentColor = cardState.bestStars >= 4 ? '#22C55E' : cardState.bestStars >= 3 ? '#FDCB6E' : '#A29BFE';
    perfDisplay = (
      <div>
        <StarRow count={cardState.bestStars} label={cardState.bestLabel} />
        {stale && <RevisitChip />}
        <p className="text-xs text-slate-500 mt-1">{cardState.volume} questions answered</p>
      </div>
    );
  } else if (cardState.state === 'mastery-no-volume') {
    accentColor = cardState.bestStars >= 4 ? '#22C55E' : cardState.bestStars >= 3 ? '#FDCB6E' : '#A29BFE';
    perfDisplay = (
      <div>
        <StarRow count={cardState.bestStars} label={cardState.bestLabel} />
        {stale && <RevisitChip />}
      </div>
    );
  } else if (cardState.state === 'lifetime-only') {
    accentColor = '#FDCB6E';
    perfDisplay = (
      <div>
        <RevisitChip />
        <p className="text-xs text-slate-500 mt-1">{cardState.volume} questions answered</p>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-full card hover:bg-[#EDE8FF]/30 rounded-xl p-6 transition-all flex items-center justify-between group overflow-hidden relative"
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
        style={{ background: accentColor }}
      />
      <div className="text-left pl-3">
        <h4 className="text-xl font-heading font-bold text-slate-800 mb-1">{title}</h4>
        {perfDisplay}
      </div>
      <ChevronRight className="w-8 h-8 text-[#A29BFE] group-hover:translate-x-1 transition-transform" />
    </button>
  );
}

function TopicsScreen({ subject, topicPerformance, mastery, onTopicSelect, onBack, onHome }) {
  // Canonical definition order — stable spatial layout for the child
  const topicEntries = Object.entries(subject.topics);

  return (
    <div className="app-bg p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-[#7C3AED] hover:text-[#5A4BD1] font-medium gap-1 sm:gap-2 min-h-[44px] px-1"
            aria-label="Back to Learning Modes"
          >
            <ArrowLeft className="w-5 h-5 shrink-0" />
            <span className="hidden sm:inline">Back to Learning Modes</span>
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
          {topicEntries.map(([key, topic]) => (
            <TopicCard
              key={key}
              title={topic.name}
              mastery={mastery ? mastery.getTopicMastery(key) : { totalQuestions: 0, daysSince: Infinity, bestStars: 0, bestLabel: 'Not started' }}
              topicPerf={topicPerformance ? topicPerformance[key] : undefined}
              onClick={() => onTopicSelect(key)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default TopicsScreen;
