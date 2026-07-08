import React, { useEffect } from 'react';
import { Crown, CheckCircle2 } from 'lucide-react';

// Hard, full-screen, non-dismissible trial-end interstitial (Phase 0
// freemium). This is the key conversion moment: a 30-day full-access trial
// has lapsed, and a grown-up — not the child alone — must choose between
// PrepStep Plus and the free plan. It supersedes the old FreePlanWelcomeModal,
// which silently switched the account to free with no real choice made.
//
// No close button, no backdrop-click handler, no ESC handler — deliberately
// not dismissible. The only two ways out are the two buttons below,
// wired in App.js (onChoosePlus routes to checkout; onContinueFree persists
// the "choice made" key and closes it). The free option must stay just as
// easy to reach as Plus — a child must be able to continue for free with no
// payment prompt and no dead end.
export default function TrialEndedChoiceModal({ childName, onChoosePlus, onContinueFree }) {
  const child = childName || 'Your child';

  // Lock the background from scrolling while this full-screen gate is open, so
  // only the interstitial scrolls (otherwise the page behind adds a second
  // scrollbar). Restored on unmount.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <div className="fixed inset-0 z-[60] bg-[#F8F7FF] overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-xs font-bold tracking-wide uppercase text-[#7C3AED] mb-3">
            Time to choose
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-800 mb-6 leading-tight">
            {child}'s free trial has finished
          </h1>
          <div className="bg-[#EDE8FF] border border-[#A29BFE]/40 rounded-2xl p-5 max-w-xl mx-auto">
            <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
              This next bit is for a grown-up. Please go and get Mum, Dad or whoever looks
              after your PrepStep, and choose together how to carry on.
            </p>
          </div>
        </div>

        {/* Two cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Card A — PrepStep Plus (primary/highlighted) */}
          <div className="relative bg-white rounded-2xl border-2 border-[#7C3AED] shadow-lg p-6 flex flex-col">
            <span className="absolute -top-3 left-6 bg-[#7C3AED] text-white text-xs font-bold uppercase tracking-wide rounded-full px-3 py-1">
              Recommended
            </span>
            <div className="flex items-center gap-2 mb-1 mt-1">
              <Crown className="w-5 h-5 text-[#7C3AED]" />
              <h2 className="font-heading font-bold text-lg text-slate-800">PrepStep Plus</h2>
            </div>
            <p className="text-sm text-slate-500 mb-4">Keep everything unlocked.</p>
            <ul className="space-y-2.5 mb-5 flex-1">
              {[
                'Unlimited practice, every day',
                'Focused Learning on every topic (a short lesson, then a quiz)',
                'Timed Mock Tests and Challenge Mode',
                'The full Parent Dashboard: exactly which topics are strong, which are weak, and what to do next',
                'The AI Tutor, on hand the moment they get stuck',
              ].map((line) => (
                <li key={line} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0 mt-0.5" />
                  {line}
                </li>
              ))}
            </ul>
            <p className="text-sm font-bold text-slate-800 mb-4">
              £24.99 a month, or £199 a year (you save £101)
            </p>
            <button
              type="button"
              onClick={onChoosePlus}
              className="w-full py-3.5 rounded-xl font-bold text-white bg-[#7C3AED] hover:bg-[#5A4BD1] transition-colors"
            >
              Choose PrepStep Plus
            </button>
          </div>

          {/* Card B — Free plan */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col">
            <h2 className="font-heading font-bold text-lg text-slate-800 mb-1">Free plan</h2>
            <p className="text-sm text-slate-500 mb-4">Carry on for free, for as long as you like.</p>
            <ul className="space-y-2.5 mb-5 flex-1">
              {[
                'One Daily Learning set every day',
                'All the streaks, prep points and badges',
                `Everything ${child} has done so far, kept safe`,
                'A simple overall progress view',
              ].map((line) => (
                <li key={line} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  {line}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={onContinueFree}
              className="w-full py-3.5 rounded-xl font-bold text-slate-700 bg-white border-2 border-slate-300 hover:border-[#7C3AED] hover:text-[#7C3AED] transition-colors"
            >
              Continue on the free plan
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-8 max-w-xl mx-auto leading-relaxed">
          You can switch to PrepStep Plus any time from the parent menu. On Free School Meals
          or Pupil Premium? PrepStep Plus is free, just email{' '}
          <a href="mailto:hello@prepstep.co.uk" className="underline hover:text-[#7C3AED]">
            hello@prepstep.co.uk
          </a>.
        </p>
      </div>
    </div>
  );
}
