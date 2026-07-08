import React from 'react';
import { Shuffle, ChevronRight } from 'lucide-react';
import { motion } from './Motion';

// The free-tier replacement for the "What to practise next" recommendation
// card (freemium phase-0 Change 1). Recommendation cards route straight
// into Focused Learning, a paid-only mode, so a free child needs a calm,
// always-available alternative that points at something they actually
// can do: their one free Daily Learning set. No lock look and no upgrade
// sell here, by design (Option A — never sell to the child). Shared
// between HomeScreen and ChildProgressView so the two surfaces match.
function TodaysPracticeCard({ onStart }) {
  return (
    <motion.div
      className="card-elevated p-5 border-l-4 border-[#7C3AED]"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#7C3AED]/10">
          <Shuffle className="w-6 h-6 text-[#7C3AED]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-[#7C3AED] mb-0.5">Today's practice</p>
          <h2 className="text-lg font-heading font-bold text-slate-800 mb-1">Daily Practice Set</h2>
          <p className="text-sm text-slate-500 mb-3">10 mixed questions across Maths, English and Verbal Reasoning.</p>
          <motion.button
            onClick={onStart}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="flex items-center gap-2 px-5 py-2.5 font-bold text-white rounded-xl transition-colors text-sm bg-[#7C3AED]"
          >
            Start today's practice
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default TodaysPracticeCard;
