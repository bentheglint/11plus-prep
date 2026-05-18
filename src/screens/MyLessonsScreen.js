import React from 'react';
import { ArrowLeft, BookOpen, Calculator, Brain, ChevronRight } from 'lucide-react';
import { motion } from '../components/Motion';
import { formatTopicKey } from '../utils/topicLabels';

const SUBJECTS = [
  { key: 'maths',          label: 'Maths',           icon: Calculator, gradient: 'from-[#3B82F6] to-[#2563EB]', light: 'bg-[#EFF6FF]', text: 'text-[#2563EB]' },
  { key: 'english',        label: 'English',          icon: BookOpen,   gradient: 'from-[#22C55E] to-[#16A34A]', light: 'bg-[#F0FDF4]', text: 'text-[#16A34A]' },
  { key: 'verbalreasoning',label: 'Verbal Reasoning', icon: Brain,      gradient: 'from-[#7C3AED] to-[#5A4BD1]', light: 'bg-[#F5F3FF]', text: 'text-[#5A4BD1]' },
];

export default function MyLessonsScreen({ mastery, onStartLesson, onBack }) {
  const recommendations = SUBJECTS.map(sub => {
    const rec = mastery?.getRecommendedNext?.(sub.key);
    return { ...sub, rec };
  }).filter(s => s.rec);

  return (
    <div className="app-bg min-h-screen p-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBack}
            className="p-2 rounded-xl hover:bg-black/5 transition-colors text-slate-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-heading font-bold text-xl text-slate-800">My Lessons</h1>
            <p className="text-sm text-slate-500">Quick refreshers on your weakest topics right now</p>
          </div>
        </div>

        {/* Lesson cards */}
        <div className="flex flex-col gap-4">
          {recommendations.map((sub, idx) => {
            const topicLabel = formatTopicKey(sub.rec.topicKey);
            return (
              <motion.button
                key={sub.key}
                onClick={() => onStartLesson(sub.rec.topicKey, sub.key)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 24, delay: idx * 0.07 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full text-left bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
              >
                {/* Subject strip */}
                <div className={`bg-gradient-to-r ${sub.gradient} px-4 py-2 flex items-center gap-2`}>
                  <sub.icon className="w-4 h-4 text-white/80 flex-shrink-0" />
                  <span className="text-white text-xs font-bold tracking-wide uppercase">{sub.label}</span>
                </div>

                {/* Content */}
                <div className="px-4 py-4 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${sub.light} flex items-center justify-center flex-shrink-0`}>
                    <sub.icon className={`w-6 h-6 ${sub.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-bold text-slate-800 text-base">{topicLabel}</p>
                    <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">{sub.rec.reason}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 flex-shrink-0" />
                </div>
              </motion.button>
            );
          })}

          {recommendations.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No lessons available yet</p>
              <p className="text-sm mt-1">Complete some practice first to unlock personalised lessons</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
