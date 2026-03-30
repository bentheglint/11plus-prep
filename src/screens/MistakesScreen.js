import React, { useState, useMemo } from 'react';
import { ArrowLeft, XCircle, ChevronDown, ChevronRight, Target, Sparkles } from 'lucide-react';
import { topicNames } from '../components/RecommendationCard';

const subjectColours = { maths: '#0984E3', english: '#00B894', verbalreasoning: '#6C5CE7' };
const subjectNames = { maths: 'Maths', english: 'English', verbalreasoning: 'VR' };

function MistakesScreen({ questionResults, questionData, englishData, vrData, onPractiseTopic, onBack }) {
  const [expandedTopic, setExpandedTopic] = useState(null);

  // Build a lookup map for all questions across all subjects
  const questionLookup = useMemo(() => {
    const lookup = {};
    const addQuestions = (data, subject) => {
      if (!data) return;
      const topics = data.topics || data;
      Object.entries(topics).forEach(([topicKey, topic]) => {
        const questions = topic.questions || (Array.isArray(topic) ? topic : []);
        questions.forEach(q => {
          lookup[`${topicKey}-${q.id}`] = { ...q, _topicKey: topicKey, _subject: subject };
        });
      });
    };
    if (questionData) {
      Object.entries(questionData).forEach(([subject, subjectData]) => {
        if (subjectData && subjectData.topics) {
          addQuestions(subjectData, subject);
        }
      });
    }
    if (englishData && englishData.topics) addQuestions(englishData, 'english');
    if (vrData && vrData.topics) addQuestions(vrData, 'verbalreasoning');
    return lookup;
  }, [questionData, englishData, vrData]);

  // Get recent mistakes grouped by topic
  const groupedMistakes = useMemo(() => {
    if (!questionResults) return {};

    const mistakes = questionResults
      .filter(r => !r.correct)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 100);

    const groups = {};
    mistakes.forEach(result => {
      const key = result.topicKey;
      if (!groups[key]) {
        groups[key] = {
          topicKey: key,
          subject: result.subject,
          mistakes: [],
        };
      }
      // Look up the actual question
      const question = questionLookup[`${key}-${result.questionId}`];
      groups[key].mistakes.push({
        ...result,
        questionText: question ? question.question : `Question #${result.questionId}`,
        explanation: question ? question.explanation : null,
        options: question ? question.options : null,
        correct: question ? question.correct : null,
        correctPair: question ? question.correctPair : null,
      });
    });

    // Sort groups by most recent mistake
    return Object.fromEntries(
      Object.entries(groups).sort((a, b) => {
        const aDate = new Date(a[1].mistakes[0]?.date || 0);
        const bDate = new Date(b[1].mistakes[0]?.date || 0);
        return bDate - aDate;
      })
    );
  }, [questionResults, questionLookup]);

  const topicEntries = Object.entries(groupedMistakes);
  const totalMistakes = topicEntries.reduce((sum, [, g]) => sum + g.mistakes.length, 0);

  return (
    <div className="app-bg p-4 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 flex items-center text-[#6C5CE7] hover:text-[#5A4BD1] font-medium gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="text-center mb-6 animate-fade-in-up">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-[#FF6B6B]/10 flex items-center justify-center">
            <XCircle className="w-7 h-7 text-[#FF6B6B]" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-[#2D3436] mb-1">My Mistakes</h2>
          {totalMistakes > 0 ? (
            <p className="text-[#636E72]">
              {totalMistakes} recent mistake{totalMistakes !== 1 ? 's' : ''} across {topicEntries.length} topic{topicEntries.length !== 1 ? 's' : ''}
            </p>
          ) : (
            <p className="text-[#636E72]">Review your mistakes to learn from them</p>
          )}
        </div>

        {topicEntries.length === 0 ? (
          <div className="card-elevated p-8 text-center animate-fade-in-up">
            <Sparkles className="w-10 h-10 text-[#FDCB6E] mx-auto mb-3" />
            <h3 className="text-xl font-heading font-bold text-[#2D3436] mb-2">No mistakes to review!</h3>
            <p className="text-[#636E72]">Keep practising — when you get something wrong, it will appear here so you can learn from it.</p>
          </div>
        ) : (
          <div className="space-y-3 stagger-children">
            {topicEntries.map(([topicKey, group]) => {
              const isExpanded = expandedTopic === topicKey;
              const colour = subjectColours[group.subject] || '#6C5CE7';
              const displayName = topicNames[topicKey] || topicKey;
              const subjectLabel = subjectNames[group.subject] || group.subject;

              return (
                <div key={topicKey} className="card-elevated overflow-hidden animate-fade-in-up">
                  {/* Topic header */}
                  <button
                    onClick={() => setExpandedTopic(isExpanded ? null : topicKey)}
                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ background: colour }}>
                        {group.mistakes.length}
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-bold text-[#2D3436]">{displayName}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${colour}15`, color: colour }}>
                            {subjectLabel}
                          </span>
                        </div>
                        <p className="text-xs text-[#636E72]">
                          Last mistake: {new Date(group.mistakes[0]?.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </div>
                    {isExpanded
                      ? <ChevronDown className="w-4 h-4 text-[#636E72]" />
                      : <ChevronRight className="w-4 h-4 text-[#636E72]" />
                    }
                  </button>

                  {/* Expanded mistake details */}
                  {isExpanded && (
                    <div className="border-t border-gray-100">
                      {group.mistakes.slice(0, 10).map((mistake, i) => (
                        <div key={mistake.id || i} className="px-5 py-3 border-b border-gray-50 last:border-b-0">
                          <p className="text-sm text-[#2D3436] font-medium mb-1">
                            {(mistake.questionText || '').slice(0, 120)}{(mistake.questionText || '').length > 120 ? '...' : ''}
                          </p>
                          {mistake.explanation && (
                            <p className="text-xs text-[#636E72] mb-1">{mistake.explanation}</p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-[#636E72]">
                            <span>D{mistake.difficulty || '?'}</span>
                            <span>{new Date(mistake.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                          </div>
                        </div>
                      ))}
                      {group.mistakes.length > 10 && (
                        <p className="px-5 py-2 text-xs text-[#636E72] italic">
                          + {group.mistakes.length - 10} more mistake{group.mistakes.length - 10 !== 1 ? 's' : ''}
                        </p>
                      )}
                      <div className="px-5 py-3 bg-gray-50">
                        <button
                          onClick={() => onPractiseTopic(group.subject, topicKey)}
                          className="flex items-center gap-2 px-4 py-2 text-white font-bold rounded-lg text-sm transition-colors"
                          style={{ background: colour }}
                        >
                          <Target className="w-4 h-4" />
                          Practise {displayName}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MistakesScreen;
