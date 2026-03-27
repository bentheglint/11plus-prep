import React from 'react';
import { Calendar, Target, ArrowLeft, Clock } from 'lucide-react';

const mockTestInfo = {
  maths: { questions: 50, time: 50 },
  english: { questions: 49, time: 50 },
  verbalreasoning: { questions: 85, time: 50 },
};

function LearningModeScreen({ subjectName, subjectKey, onStartDaily, onFocusedLearning, onMockTest, onBack }) {
  const testInfo = mockTestInfo[subjectKey] || { questions: 50, time: 50 };

  return (
    <div className="app-bg p-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 flex items-center text-[#6C5CE7] hover:text-[#5A4BD1] font-medium gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="text-center mb-8 animate-fade-in-up">
          <h2 className="text-3xl font-heading font-bold text-[#2D3436] mb-2">
            {subjectName || 'Subject'}
          </h2>
          <p className="text-[#636E72]">Choose how you'd like to practise</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 stagger-children">
          <button
            onClick={onStartDaily}
            className="card rounded-2xl p-8 text-left hover:scale-[1.02] transition-all border-2 border-transparent hover:border-[#0984E3]/30 animate-scale-in"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-[#0984E3]/10 rounded-2xl mb-4">
              <Calendar className="w-8 h-8 text-[#0984E3]" />
            </div>
            <h3 className="text-xl font-heading font-bold text-[#2D3436] mb-2">Daily Learning</h3>
            <p className="text-[#636E72]">10 questions from across all topics. A great way to keep your skills sharp!</p>
          </button>

          <button
            onClick={onFocusedLearning}
            className="card rounded-2xl p-8 text-left hover:scale-[1.02] transition-all border-2 border-transparent hover:border-[#6C5CE7]/30 animate-scale-in"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-[#6C5CE7]/10 rounded-2xl mb-4">
              <Target className="w-8 h-8 text-[#6C5CE7]" />
            </div>
            <h3 className="text-xl font-heading font-bold text-[#2D3436] mb-2">Focused Learning</h3>
            <p className="text-[#636E72]">Pick a topic and practise 10 questions to build your confidence.</p>
          </button>

          <button
            onClick={onMockTest}
            className="card rounded-2xl p-8 text-left hover:scale-[1.02] transition-all border-2 border-transparent hover:border-[#FF6B6B]/30 animate-scale-in"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-[#FF6B6B]/10 rounded-2xl mb-4">
              <Clock className="w-8 h-8 text-[#FF6B6B]" />
            </div>
            <h3 className="text-xl font-heading font-bold text-[#2D3436] mb-2">Mock Test</h3>
            <p className="text-[#636E72]">
              Full practice paper — {testInfo.questions} questions in {testInfo.time} minutes. Timed, just like the real exam!
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default LearningModeScreen;
