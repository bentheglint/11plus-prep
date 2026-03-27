import React from 'react';
import { BookOpen, BarChart3, ArrowLeft } from 'lucide-react';

function ProgressScreen({ quizHistory, questionData, onHome }) {
  const groupedBySubject = {};
  quizHistory.forEach(quiz => {
    if (!groupedBySubject[quiz.subject]) {
      groupedBySubject[quiz.subject] = [];
    }
    groupedBySubject[quiz.subject].push(quiz);
  });

  return (
    <div className="app-bg p-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onHome}
          className="mb-6 flex items-center text-[#6C5CE7] hover:text-[#5A4BD1] font-medium gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="text-center mb-8 animate-fade-in-up">
          <h2 className="text-3xl font-heading font-bold text-[#2D3436] mb-2 flex items-center justify-center gap-3">
            <BarChart3 className="w-8 h-8 text-[#6C5CE7]" />
            My Progress
          </h2>
          <p className="text-lg text-[#636E72]">Track your learning journey!</p>
        </div>

        {quizHistory.length === 0 ? (
          <div className="card-elevated p-8 text-center animate-fade-in-up">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#EDE8FF] flex items-center justify-center mb-4">
              <BookOpen className="w-10 h-10 text-[#6C5CE7]" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-[#2D3436] mb-2">No quizzes taken yet!</h3>
            <p className="text-[#636E72] mb-6">Start practising to see your progress here.</p>
            <button
              onClick={onHome}
              className="px-6 py-3 btn-primary"
            >
              Start Learning
            </button>
          </div>
        ) : (
          <div className="space-y-6 stagger-children">
            {Object.entries(groupedBySubject).map(([subject, quizzes]) => {
              const subjectData = questionData[subject];
              const SubjectIcon = subjectData?.icon || BookOpen;
              const subjectName = subjectData?.name || subject;

              const totalQuizzes = quizzes.length;
              const totalScore = quizzes.reduce((sum, q) => sum + q.score, 0);
              const totalQuestions = quizzes.reduce((sum, q) => sum + q.total, 0);
              const avgPercentage = Math.round((totalScore / totalQuestions) * 100);

              const subjectColorMap = {
                maths: { accent: '#0984E3', light: 'rgba(9,132,227,0.08)' },
                english: { accent: '#00B894', light: 'rgba(0,184,148,0.08)' },
                verbalreasoning: { accent: '#6C5CE7', light: 'rgba(108,92,231,0.08)' }
              };
              const sc = subjectColorMap[subject] || subjectColorMap.maths;

              return (
                <div key={subject} className="card-elevated p-6 animate-fade-in-up" style={{ borderLeft: `4px solid ${sc.accent}` }}>
                  <div className="flex items-center gap-3 mb-4">
                    <SubjectIcon className="w-8 h-8" style={{ color: sc.accent }} />
                    <h3 className="text-2xl font-heading font-bold text-[#2D3436]">{subjectName}</h3>
                  </div>

                  <div className="rounded-xl p-4 mb-4" style={{ background: sc.light }}>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-heading font-bold text-[#2D3436]">{totalQuizzes}</p>
                        <p className="text-sm text-[#636E72]">Quizzes</p>
                      </div>
                      <div>
                        <p className="text-2xl font-heading font-bold text-[#2D3436]">{avgPercentage}%</p>
                        <p className="text-sm text-[#636E72]">Average</p>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1.5">
                          <div className="h-full rounded-full" style={{ width: `${avgPercentage}%`, background: sc.accent }} />
                        </div>
                      </div>
                      <div>
                        <p className="text-2xl font-heading font-bold text-[#2D3436]">{totalScore}/{totalQuestions}</p>
                        <p className="text-sm text-[#636E72]">Correct</p>
                      </div>
                    </div>
                  </div>

                  <h4 className="font-heading font-bold text-[#2D3436] mb-3">Quiz History</h4>
                  <div className="space-y-2">
                    {[...quizzes].reverse().map((quiz) => {
                      const date = new Date(quiz.date);
                      const formattedDate = date.toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      });
                      const dotColor = quiz.percentage >= 80 ? '#00B894' : quiz.percentage >= 60 ? '#FDCB6E' : '#FF6B6B';

                      return (
                        <div key={quiz.id} className="flex items-center justify-between p-3 rounded-lg bg-[#FAFBFF] border border-[#EDE8FF]">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: dotColor }} />
                            <div>
                              <p className="font-bold text-[#2D3436]">{quiz.topic}</p>
                              <p className="text-sm text-[#636E72]">{formattedDate}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-heading font-bold text-[#2D3436]">{quiz.percentage}%</p>
                            <p className="text-sm text-[#636E72]">{quiz.score}/{quiz.total}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProgressScreen;
