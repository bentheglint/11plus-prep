import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from './Motion';

function PreQuizTipCard({ tip, onDismiss }) {
  if (!tip) return null;

  return (
    <div className="app-bg p-4 min-h-screen flex items-center justify-center">
      <motion.div
        className="max-w-md mx-auto text-center"
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <motion.div
          className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center shadow-md"
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.15 }}
        >
          <Sparkles className="w-8 h-8 text-amber-500" />
        </motion.div>

        <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-3">Quick tip before you start</p>

        <motion.div
          className="bg-white rounded-xl p-6 shadow-md border border-amber-100 mb-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
        >
          <p className="text-lg text-slate-800 font-medium leading-relaxed">{tip.keyInsight}</p>
        </motion.div>

        <motion.button
          onClick={onDismiss}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="px-10 py-4 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-xl text-lg transition-all shadow-lg hover:shadow-xl"
        >
          Got it!
        </motion.button>
      </motion.div>
    </div>
  );
}

export default PreQuizTipCard;
