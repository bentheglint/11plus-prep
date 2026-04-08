import React from 'react';
import { Sparkles } from 'lucide-react';

function PreQuizTipCard({ tip, onDismiss }) {
  if (!tip) return null;

  return (
    <div className="app-bg p-4 min-h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto text-center animate-fade-in-up">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center shadow-md">
          <Sparkles className="w-8 h-8 text-amber-500" />
        </div>

        <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-3">Quick tip before you start</p>

        <div className="bg-white rounded-xl p-6 shadow-md border border-amber-100 mb-6">
          <p className="text-lg text-slate-800 font-medium leading-relaxed">{tip.keyInsight}</p>
        </div>

        <button
          onClick={onDismiss}
          className="px-10 py-4 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-xl text-lg transition-all shadow-lg hover:shadow-xl"
        >
          Got it!
        </button>
      </div>
    </div>
  );
}

export default PreQuizTipCard;
