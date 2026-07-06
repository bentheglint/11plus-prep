import React from 'react';
import { Lock } from 'lucide-react';
import { motion } from './Motion';

// A gated feature — same visual language everywhere a free-tier user hits a
// paid-only feature (LearningModeScreen's mode grid, ProgressScreen's deep
// analytics tab, MistakesScreen's practice action): a greyed-out icon,
// greyed-out copy, and a single "Upgrade to unlock" pill that calls
// onUpgrade. Extracted from LearningModeScreen's original local
// LockedModeCard so every lock in the app shares one definition instead of
// three near-identical copies drifting apart (Duplicated-Truth Rules,
// CLAUDE.md).
function LockedFeatureCard({ title, description, onUpgrade, className = '' }) {
  return (
    <div className={`card rounded-2xl p-8 text-left flex flex-col border-2 border-gray-200 ${className}`}>
      <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-4">
        <Lock className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-heading font-bold text-gray-400 mb-2">{title}</h3>
      <p className="text-gray-400 flex-1 mb-4">{description}</p>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        type="button"
        onClick={onUpgrade}
        className="self-start text-sm font-bold text-[#7C3AED] bg-[#7C3AED]/10 hover:bg-[#7C3AED]/20 rounded-full px-4 py-2 transition-colors"
      >
        Upgrade to unlock
      </motion.button>
    </div>
  );
}

export default LockedFeatureCard;
