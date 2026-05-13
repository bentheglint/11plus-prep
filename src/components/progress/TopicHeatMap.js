import React, { useState } from 'react';
import { Calculator, BookOpen, Brain, Star, TrendingUp, TrendingDown, RotateCcw } from 'lucide-react';
import { topicNames } from '../RecommendationCard';

const subjects = [
  { key: 'maths', name: 'Maths', icon: Calculator, colour: '#3B82F6', rgb: '9,132,227' },
  { key: 'english', name: 'English', icon: BookOpen, colour: '#22C55E', rgb: '0,184,148' },
  { key: 'verbalreasoning', name: 'VR', icon: Brain, colour: '#7C3AED', rgb: '108,92,231' },
];

// Solid hex scale per subject: index 0=1★ Exploring … index 3=4★ Strong. Full colour at index 3.
const masteryScale = {
  '#3B82F6': ['#DBEAFE', '#BFDBFE', '#93C5FD', '#3B82F6'],
  '#22C55E': ['#DCFCE7', '#BBF7D0', '#86EFAC', '#22C55E'],
  '#7C3AED': ['#EDE9FE', '#DDD6FE', '#C4B5FD', '#7C3AED'],
};

function TopicHeatMap({ mastery, onTopicClick }) {
  const [selected, setSelected] = useState('maths');
  const subj = subjects.find(s => s.key === selected);
  const topics = (mastery.SUBJECT_TOPICS[selected] || []).map(key => ({
    key,
    name: topicNames[key] || key,
    ...mastery.getTopicMastery(key),
  }));

  return (
    <div className="card-elevated p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-slate-800">Topic Mastery</h3>
        <div className="flex gap-1">
          {subjects.map(s => {
            const Icon = s.icon;
            return (
              <button
                key={s.key}
                onClick={() => setSelected(s.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selected === s.key
                    ? 'text-white shadow-sm'
                    : 'text-slate-500 bg-gray-50 hover:bg-gray-100'
                }`}
                style={selected === s.key ? { background: s.colour } : {}}
              >
                <Icon className="w-3.5 h-3.5" />
                {s.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      {(() => {
        const scale = masteryScale[subj.colour] || masteryScale['#7C3AED'];
        return (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-3 text-[10px] text-slate-500">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-gray-100 border border-gray-200" />
              Not started
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm" style={{ background: scale[0] }} />
              Exploring
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm" style={{ background: scale[2] }} />
              Confident
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm" style={{ background: scale[3] }} />
              Strong
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-[#FDCB6E]" />
              Mastered
            </div>
          </div>
        );
      })()}

      {/* Heat map grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {topics.map(topic => {
          const scale = masteryScale[subj.colour] || masteryScale['#7C3AED'];
          const bg = topic.score >= 90 ? '#FDCB6E' :
            topic.stars >= 1 ? scale[Math.min(topic.stars - 1, 3)] : '#F8F9FA';
          const textCol = topic.stars === 4 ? '#fff' : '#1E293B';
          const needsReview = topic.daysSince > 14 && topic.stars > 0;
          const TrendIcon = topic.trend?.direction === 'up' ? TrendingUp :
                           topic.trend?.direction === 'down' ? TrendingDown : null;
          const trendCol = topic.trend?.direction === 'up' ? '#22C55E' :
                          topic.trend?.direction === 'down' ? '#FF6B6B' : null;

          return (
            <button
              key={topic.key}
              onClick={() => onTopicClick?.(selected, topic.key)}
              className="relative p-2.5 rounded-lg text-left transition-all hover:shadow-md hover:scale-[1.02] border border-gray-100"
              style={{ background: bg }}
            >
              <p className="text-xs font-bold leading-tight mb-1" style={{ color: textCol }}>
                {topic.name}
              </p>
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-2.5 h-2.5"
                    fill={i <= topic.stars ? (topic.stars === 4 ? '#fff' : '#FDCB6E') : 'none'}
                    stroke={i <= topic.stars ? (topic.stars === 4 ? '#fff' : '#F59E0B') : (topic.stars === 4 ? 'rgba(255,255,255,0.4)' : '#DFE6E9')}
                    strokeWidth={2}
                  />
                ))}
              </div>
              {topic.totalQuestions > 0 && (
                <p className="text-[9px] mt-0.5" style={{ color: topic.score >= 70 ? 'rgba(255,255,255,0.8)' : '#64748B' }}>
                  {topic.recentAccuracy}%{topic.daysSince > 0 ? ` · ${topic.daysSince}d` : ''}
                </p>
              )}
              {TrendIcon && (
                <TrendIcon className="absolute top-1.5 right-1.5 w-3 h-3" style={{ color: topic.score >= 70 ? '#fff' : trendCol }} />
              )}
              {needsReview && (
                <RotateCcw className="absolute bottom-1.5 right-1.5 w-3 h-3 text-amber-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TopicHeatMap;
