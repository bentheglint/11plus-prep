import React from 'react';
import { Zap, Calculator, BookOpen, Brain, ChevronRight } from 'lucide-react';

const subjectIcons = { maths: Calculator, english: BookOpen, verbalreasoning: Brain };
const subjectColours = { maths: '#0984E3', english: '#00B894', verbalreasoning: '#6C5CE7' };
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
};

function RecommendationCard({ recommendation, onStart }) {
  if (!recommendation) return null;

  const { topicKey, subject, reason } = recommendation;
  const Icon = subjectIcons[subject] || Zap;
  const colour = subjectColours[subject] || '#6C5CE7';
  const displayName = topicNames[topicKey] || topicKey;
  const subjectLabel = subjectNames[subject] || subject;

  return (
    <div className="card-elevated p-5 border-l-4 animate-fade-in-up" style={{ borderLeftColor: colour }}>
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${colour}15` }}>
          <Icon className="w-6 h-6" style={{ color: colour }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: colour }}>
            What to practise next
          </p>
          <h3 className="text-lg font-heading font-bold text-slate-800 mb-1">{displayName}</h3>
          <p className="text-sm text-slate-500 mb-3">{reason}</p>
          <button
            onClick={() => onStart(subject, topicKey)}
            className="flex items-center gap-2 px-5 py-2.5 font-bold text-white rounded-xl transition-colors text-sm"
            style={{ background: colour }}
          >
            Let's Go!
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export { topicNames };
export default RecommendationCard;
