import React, { useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from '../components/Motion';
import { formatTopicKey } from '../utils/topicLabels';

const subjectNames = { maths: 'Maths', english: 'English', verbalreasoning: 'Verbal Reasoning' };

function buildQuestionLookup(mathsData, englishData, vrData) {
  const lookup = {};
  const add = (data, subject) => {
    if (!data?.topics) return;
    Object.entries(data.topics).forEach(([topicKey, topic]) => {
      const questions = topic.questions || (Array.isArray(topic) ? topic : []);
      questions.forEach(q => {
        lookup[`${subject}-${topicKey}-${q.id}`] = { ...q, _topicKey: topicKey, _subject: subject };
      });
    });
  };
  add(mathsData, 'maths');
  add(englishData, 'english');
  add(vrData, 'verbalreasoning');
  return lookup;
}

export default function AssignmentDetailScreen({
  assignment,
  questionResultsBlob,
  mathsData,
  englishData,
  vrData,
  onBack,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const lookup = useMemo(
    () => buildQuestionLookup(mathsData, englishData, vrData),
    [mathsData, englishData, vrData]
  );

  const topicKey = assignment.item_ref;
  const subject = assignment.subject;

  // Pair each result row with its question
  const items = useMemo(() => {
    return (questionResultsBlob || []).map(r => ({
      result: r,
      question: lookup[`${subject}-${topicKey}-${r.questionId}`] || null,
    }));
  }, [questionResultsBlob, lookup, subject, topicKey]);

  const total = items.length;
  const correct = items.filter(i => i.result.correct).length;
  const pct = total > 0 ? Math.round((correct / total) * 100) : null;

  const current = items[currentIndex];
  const q = current?.question;
  const r = current?.result;

  if (!total) {
    return (
      <div className="app-bg min-h-screen p-4 flex items-center justify-center">
        <div className="text-center text-slate-400">
          <p className="font-medium">No question data available for this assignment.</p>
          <button onClick={onBack} className="mt-4 text-[#7C3AED] text-sm font-medium hover:underline">
            ← Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-bg min-h-screen p-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-2 rounded-xl hover:bg-black/5 transition-colors text-slate-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-heading font-bold text-lg text-slate-800 truncate">
              {assignment.assignment_title || `${formatTopicKey(topicKey)} homework`}
            </h1>
            <p className="text-sm text-slate-500">
              {subjectNames[subject] || subject} · {formatTopicKey(topicKey)}
            </p>
          </div>
          {pct !== null && (
            <div className={`text-lg font-bold flex-shrink-0 ${pct >= 80 ? 'text-green-600' : pct >= 50 ? 'text-yellow-600' : 'text-red-500'}`}>
              {pct}%
            </div>
          )}
        </div>

        {/* Score summary bar */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3 mb-4 flex items-center gap-4">
          <div className="flex items-center gap-2 flex-1">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span className="text-sm text-slate-600">{correct} correct</span>
          </div>
          <div className="flex items-center gap-2 flex-1">
            <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span className="text-sm text-slate-600">{total - correct} wrong</span>
          </div>
          <div className="text-xs text-slate-400">{total} questions</div>
        </div>

        {/* Question navigation */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-8 h-8 rounded-full text-xs font-bold flex-shrink-0 transition-colors ${
                idx === currentIndex
                  ? item.result.correct ? 'bg-green-500 text-white' : 'bg-red-400 text-white'
                  : item.result.correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {/* Question card */}
        {current && (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-4"
          >
            {/* Status strip */}
            <div className={`px-4 py-2 flex items-center gap-2 ${r.correct ? 'bg-green-50' : 'bg-red-50'}`}>
              {r.correct
                ? <><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-sm font-medium text-green-700">Correct</span></>
                : <><XCircle className="w-4 h-4 text-red-400" /><span className="text-sm font-medium text-red-600">Incorrect</span></>
              }
              <span className="text-xs text-slate-400 ml-auto">Q{currentIndex + 1} of {total}</span>
            </div>

            <div className="p-4">
              {/* Question text */}
              {q ? (
                <>
                  <p className="text-sm text-slate-800 font-medium mb-4 leading-relaxed">{q.question}</p>

                  {/* Options */}
                  <div className="flex flex-col gap-2 mb-4">
                    {(q.options || []).map((opt, optIdx) => {
                      const isSelected = r.selectedIndex === optIdx;
                      const isCorrect = q.correct === optIdx;
                      let cls = 'border border-slate-200 text-slate-700';
                      if (isCorrect) cls = 'border-green-400 bg-green-50 text-green-800 font-medium';
                      else if (isSelected && !r.correct) cls = 'border-red-400 bg-red-50 text-red-700';
                      return (
                        <div key={optIdx} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm ${cls}`}>
                          <span className="w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xs font-bold
                            ${isCorrect ? 'border-green-500 bg-green-500 text-white' : isSelected && !r.correct ? 'border-red-400 bg-red-400 text-white' : 'border-slate-300'}">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="flex-1">{opt}</span>
                          {isCorrect && <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />}
                          {isSelected && !r.correct && <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {q.explanation && (
                    <div className="bg-[#F8F7FF] rounded-xl px-3 py-3">
                      <p className="text-xs font-semibold text-[#7C3AED] mb-1">Explanation</p>
                      <p className="text-sm text-slate-700 leading-relaxed">{q.explanation.replace(' ✓', '')}</p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-slate-400 italic">Question data not available (question may have been updated).</p>
              )}
            </div>
          </motion.div>
        )}

        {/* Prev / Next */}
        <div className="flex gap-3">
          <button
            onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-slate-50 transition-colors text-sm font-medium"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <button
            onClick={() => setCurrentIndex(i => Math.min(total - 1, i + 1))}
            disabled={currentIndex === total - 1}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-slate-50 transition-colors text-sm font-medium"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
