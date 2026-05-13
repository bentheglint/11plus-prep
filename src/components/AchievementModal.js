import React, { useEffect, useRef } from 'react';
import { motion } from './Motion';
import { celebrateCorrect } from '../utils/confetti';

function AchievementModal({ achievement, onDismiss }) {
  // Close on Escape key (keyboard a11y)
  useEffect(() => {
    if (!achievement) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onDismiss?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [achievement, onDismiss]);

  if (!achievement) return null;

  const Icon = achievement.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="achievement-title">
      <button
        type="button"
        aria-label="Close achievement"
        onClick={onDismiss}
        className="absolute inset-0 bg-black/50 cursor-default"
        tabIndex={-1}
      />
      <motion.div
        className="relative z-10 bg-white rounded-2xl p-8 max-w-sm w-full text-center"
        initial={{ opacity: 0, scale: 0.5, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className="relative mb-4">
          <motion.div
            className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center shadow-lg"
            style={{ background: `linear-gradient(135deg, ${achievement.colour}, ${achievement.colour}CC)` }}
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
          >
            {Icon && <Icon className="w-10 h-10 text-white" />}
          </motion.div>
        </div>

        <p className="text-sm font-bold text-[#7C3AED] uppercase tracking-wider mb-1">Achievement Unlocked!</p>
        <h2 id="achievement-title" className="text-2xl font-heading font-bold text-slate-800 mb-2">{achievement.name}</h2>
        <p className="text-slate-500 mb-6">{achievement.description}</p>

        <motion.button
          onClick={onDismiss}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 btn-primary text-lg"
        >
          Amazing!
        </motion.button>
        <ConfettiTrigger />
      </motion.div>
    </div>
  );
}

// Separate component to fire confetti (avoids hook-in-conditional issue)
function ConfettiTrigger() {
  const fired = useRef(false);
  useEffect(() => {
    if (!fired.current) {
      fired.current = true;
      celebrateCorrect();
      setTimeout(() => celebrateCorrect(), 300);
    }
  }, []);
  return null;
}

export default AchievementModal;
