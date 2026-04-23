import React from 'react';
import { AlertCircle, Star, ChevronRight } from 'lucide-react';
import { topicNames } from '../RecommendationCard';

const subjectColours = { maths: '#3B82F6', english: '#22C55E', verbalreasoning: '#7C3AED' };
const subjectNames = { maths: 'Maths', english: 'English', verbalreasoning: 'VR' };

function FocusAreas({ mastery, onTopicClick }) {
  const focusAreas = mastery.getFocusAreas();

  if (focusAreas.length === 0) {
    return (
      <div className="card-elevated p-5 mb-6 text-center">
        <h3 className="font-heading font-bold text-slate-800 mb-2">Focus Areas</h3>
        <p className="text-sm text-slate-500">Start practising to see personalised recommendations!</p>
      </div>
    );
  }

  return (
    <div className="card-elevated p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-5 h-5 text-[#7C3AED]" />
        <h3 className="font-heading font-bold text-slate-800">Focus Areas</h3>
      </div>
      <p className="text-sm text-slate-500 mb-4">Topics that need the most attention right now:</p>

      <div className="space-y-3">
        {focusAreas.map((area, i) => {
          const colour = subjectColours[area.subject] || '#7C3AED';
          const displayName = topicNames[area.topicKey] || area.topicKey;

          return (
            <button
              key={area.topicKey}
              onClick={() => onTopicClick?.(area.subject, area.topicKey)}
              className="w-full p-4 rounded-xl border-2 border-gray-100 hover:border-[#A29BFE] hover:shadow-md transition-all text-left flex items-center gap-3 group"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-white text-sm" style={{ background: colour }}>
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-bold text-sm text-slate-800">{displayName}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${colour}15`, color: colour }}>
                    {subjectNames[area.subject]}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{area.reason}</p>
                {area.mastery && area.mastery.totalQuestions > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className="w-2.5 h-2.5" fill={s <= area.mastery.stars ? '#FDCB6E' : 'none'} stroke={s <= area.mastery.stars ? '#F59E0B' : '#DFE6E9'} strokeWidth={2} />
                    ))}
                    <span className="text-[10px] text-slate-500 ml-1">{area.mastery.recentAccuracy}% accuracy</span>
                  </div>
                )}
              </div>
              <ChevronRight className="w-5 h-5 text-gray-200 group-hover:text-[#7C3AED] transition-colors flex-shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default FocusAreas;
