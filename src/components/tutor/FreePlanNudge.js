import React from 'react';
import { Sparkles } from 'lucide-react';

// Tutor-facing nudge shown wherever a free-plan pupil's data is withheld
// from their tutor (locked pupil detail, locked report, blocked homework
// assignment). Unlike the child/parent LockedFeatureCard, there is no CTA
// button here — the tutor never checks out in-app, they relay the message
// to the parent, so the copy itself carries the ask.
export default function FreePlanNudge({ title, children, className = '' }) {
  return (
    <div className={`bg-[#F8F7FF] border border-[#E8E5FF] rounded-2xl p-5 flex gap-3 ${className}`}>
      <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E5FF] flex items-center justify-center flex-shrink-0">
        <Sparkles className="w-5 h-5 text-[#7C3AED]" />
      </div>
      <div className="min-w-0">
        <h3 className="font-heading font-bold text-slate-800 text-sm mb-1">{title}</h3>
        <p className="text-sm text-slate-600 leading-relaxed">{children}</p>
      </div>
    </div>
  );
}
