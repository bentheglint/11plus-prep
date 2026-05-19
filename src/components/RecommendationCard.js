import React from 'react';
import { Zap, Calculator, BookOpen, Brain, ChevronRight, Shuffle, Target } from 'lucide-react';
import { motion } from './Motion';

const subjectIcons = { maths: Calculator, english: BookOpen, verbalreasoning: Brain };
const subjectColours = { maths: '#3B82F6', english: '#22C55E', verbalreasoning: '#7C3AED' };
const subjectNames = { maths: 'Maths', english: 'English', verbalreasoning: 'Verbal Reasoning' };

// Topic key to display name mapping
const topicNames = {
  percentages: 'Percentages', decimals: 'Decimals', longdivision: 'Long Division',
  ratio: 'Ratio & Proportion', fractions: 'Fractions', longmultiplication: 'Long Multiplication',
  algebra: 'Algebra', placevalue: 'Place Value', negativenumbers: 'Negative Numbers',
  primenumbersfactors: 'Prime Numbers & Factors', areaperimeter: 'Area & Perimeter',
  volume: 'Volume', anglesshapes: 'Angles & Shapes', sequences: 'Sequences',
  datahandling: 'Data Handling', speeddistancetime: 'Speed, Distance, Time',
  comprehension: 'Comprehension', spelling: 'Spelling', punctuation: 'Punctuation',
  grammar: 'Grammar', vocabulary: 'Vocabulary', wordClassGrammar: 'Word Class',
  synonyms: 'Synonyms', antonyms: 'Antonyms', verbalAnalogies: 'Verbal Analogies',
  oddTwoOut: 'Odd Two Out', compoundWords: 'Compound Words', hiddenWords: 'Hidden Words',
  letterMove: 'Letter Move', missingLettersWords: 'Missing Letters',
  letterCodes: 'Letter Codes', letterPairSeries: 'Letter Pairs',
  numberSeries: 'Number Series', letterSums: 'Letter Sums',
  wordCodeAnalogies: 'Word Codes', numberWordCodes: 'Number Word Codes',
  logicAndLanguage: 'Logic & Language', sharedLetter: 'Shared Letter',
  balanceEquations: 'Balance Equations',
  // Slug for the Daily Learning quiz mode (mixed topics)
  'daily-learning': 'Daily Learning',
};

function RecommendationCard({ recommendation, onStart }) {
  if (!recommendation) return null;

  const { topicKey, subject, reason, mode = 'focused' } = recommendation;
  const Icon = subjectIcons[subject] || Zap;
  const colour = subjectColours[subject] || '#7C3AED';
  const subjectLabel = subjectNames[subject] || subject;
  const isDaily = mode === 'daily';

  const displayName = isDaily ? `Mixed ${subjectLabel}` : (topicNames[topicKey] || topicKey);
  const cardLabel = isDaily ? 'Keep it sharp' : 'What to practise next';
  const ctaText = isDaily ? 'Start Daily Mix' : "Let's Go!";
  const ModeIcon = isDaily ? Shuffle : Target;

  return (
    <motion.div
      className="card-elevated p-5 border-l-4"
      style={{ borderLeftColor: colour }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${colour}15` }}>
          <Icon className="w-6 h-6" style={{ color: colour }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: colour }}>
              {cardLabel}
            </p>
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold" style={{ background: `${colour}15`, color: colour }}>
              <ModeIcon className="w-2.5 h-2.5" />
              {isDaily ? 'Daily Mix' : 'Focused'}
            </span>
          </div>
          <h2 className="text-lg font-heading font-bold text-slate-800 mb-1">{displayName}</h2>
          <p className="text-sm text-slate-500 mb-3">{reason}</p>
          <motion.button
            onClick={() => onStart(subject, topicKey, mode)}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="flex items-center gap-2 px-5 py-2.5 font-bold text-white rounded-xl transition-colors text-sm"
            style={{ background: colour }}
          >
            {ctaText}
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export { topicNames };
export default RecommendationCard;
