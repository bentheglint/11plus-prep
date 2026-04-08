import React from 'react';
import { Calculator, BookOpen, Brain, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const subjectConfig = {
  maths: { icon: Calculator, name: 'Maths' },
  english: { icon: BookOpen, name: 'English' },
  verbalreasoning: { icon: Brain, name: 'Verbal Reasoning' },
};

const bandColours = {
  'Building Foundations': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'Developing Well': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  'Exam Ready': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  'Excelling': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
};

function ExamReadinessCard({ mastery }) {
  const subjects = ['maths', 'english', 'verbalreasoning'];

  return (
    <div className="card-elevated p-5 mb-6">
      <h3 className="font-heading font-bold text-slate-800 mb-4">Exam Readiness</h3>
      <div className="grid grid-cols-3 gap-3">
        {subjects.map(subject => {
          const config = subjectConfig[subject];
          const Icon = config.icon;
          const readiness = mastery.getExamReadiness(subject);
          const subjectM = mastery.getSubjectMastery(subject);
          const bc = bandColours[readiness.band] || bandColours['Building Foundations'];

          return (
            <div key={subject} className="text-center">
              <Icon className="w-6 h-6 mx-auto mb-2" style={{ color: readiness.colour }} />
              <p className="text-sm font-bold text-slate-800 mb-1">{config.name}</p>
              <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full border ${bc.bg} ${bc.text} ${bc.border}`}>
                {readiness.band}
              </span>
              <div className="mt-2 w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${readiness.score}%`, background: readiness.colour }}
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                {subjectM.topicsCovered}/{subjectM.topicsTotal} topics covered
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ExamReadinessCard;
