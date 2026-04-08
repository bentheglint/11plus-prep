import React from 'react';
import { Lightbulb } from 'lucide-react';

function PostQuestionTipBanner({ tip }) {
  if (!tip) return null;

  return (
    <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
      <div className="flex items-start gap-2">
        <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <span className="text-xs font-bold text-amber-700">Quick tip: </span>
          <span className="text-sm text-slate-800">{tip.keyInsight}</span>
        </div>
      </div>
    </div>
  );
}

export default PostQuestionTipBanner;
