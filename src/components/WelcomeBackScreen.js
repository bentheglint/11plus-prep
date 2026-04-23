import React from 'react';
import { Lightbulb } from 'lucide-react';
import { motion } from './Motion';

function WelcomeBackScreen({ tip, onDismiss }) {
  if (!tip) return null;

  return (
    <div className="app-bg p-4 min-h-screen flex items-center justify-center">
      <motion.div
        className="max-w-md mx-auto text-center"
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <p className="text-4xl mb-4">👋</p>
        <h2 className="text-3xl font-heading font-bold text-slate-800 mb-2">Welcome back!</h2>
        <p className="text-lg text-slate-500 mb-6">Remember this?</p>

        <motion.div
          className="bg-white rounded-xl p-6 shadow-md border border-amber-100 mb-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
        >
          <div className="flex items-start gap-3 text-left">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Lightbulb className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1">{tip.category}</p>
              <p className="text-base text-slate-800 font-medium leading-relaxed">{tip.keyInsight}</p>
            </div>
          </div>
        </motion.div>

        <motion.button
          onClick={onDismiss}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="px-10 py-4 bg-gradient-to-r from-[#7C3AED] to-[#5A4BD1] hover:from-[#5A4BD1] hover:to-[#4A3BC1] text-white font-bold rounded-xl text-lg transition-all shadow-lg hover:shadow-xl"
        >
          Let's go!
        </motion.button>
      </motion.div>
    </div>
  );
}

export default WelcomeBackScreen;
