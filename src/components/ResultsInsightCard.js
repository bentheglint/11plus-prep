import React from 'react';
import { Lightbulb } from 'lucide-react';

function ResultsInsightCard({ tip }) {
  if (!tip) return null;

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5 mb-6 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Lightbulb className="w-4 h-4 text-amber-600" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1">Level-up tip</p>
          <p className="text-sm text-slate-800 font-medium leading-relaxed">{tip.keyInsight}</p>
        </div>
      </div>
    </div>
  );
}

export default ResultsInsightCard;
