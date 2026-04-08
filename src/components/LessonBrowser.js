import React, { useState } from 'react';
import { ChevronDown, ChevronRight, BookOpen, CheckCircle, Circle } from 'lucide-react';

// Subject-to-topic mapping
const ENGLISH_TOPICS = new Set(['spelling', 'punctuation', 'grammar', 'vocabulary', 'wordClassGrammar', 'comprehension']);
const VR_TOPICS = new Set(['synonyms', 'antonyms', 'oddTwoOut', 'verbalAnalogies', 'compoundWords', 'hiddenWords', 'letterMove', 'missingLettersWords', 'sharedLetter', 'letterCodes', 'letterPairSeries', 'wordCodeAnalogies', 'numberWordCodes', 'numberSeries', 'letterSums', 'logicAndLanguage']);

function getSubjectForTopic(topicKey) {
  if (ENGLISH_TOPICS.has(topicKey)) return 'english';
  if (VR_TOPICS.has(topicKey)) return 'verbalreasoning';
  return 'maths';
}

function LessonBrowser({ subject, lessonBank, lessonHistory, onLaunchLesson, toolkitLessonsViewed, onStartQuiz }) {
  const [expandedTopic, setExpandedTopic] = useState(null);

  // Filter lessonBank topics to just this subject
  const topicKeys = Object.keys(lessonBank || {}).filter(key => {
    const topicSubject = getSubjectForTopic(key);
    return topicSubject === subject;
  });

  // Sort topics alphabetically by display name
  const sortedTopics = topicKeys
    .map(key => ({ key, name: lessonBank[key]?.name || key }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const getSubConceptStatus = (topicKey, subConceptId) => {
    const history = lessonHistory?.[topicKey]?.shown || [];
    return history.some(h => h.subConcept === subConceptId);
  };

  const getTopicProgress = (topicKey) => {
    const subConcepts = lessonBank[topicKey]?.subConcepts || [];
    const total = subConcepts.length;
    const seen = subConcepts.filter(sc => getSubConceptStatus(topicKey, sc.id)).length;
    return { seen, total };
  };

  const handleSelectLesson = (topicKey, subConcept) => {
    // Pick the first available lesson for this sub-concept
    const lesson = subConcept.lessons?.[0];
    if (lesson && onLaunchLesson) {
      onLaunchLesson(topicKey, subConcept.id, lesson);
    }
  };

  const showNudge = toolkitLessonsViewed >= 2;

  return (
    <div className="space-y-3">
      {/* Gentle nudge after 2+ lessons browsed without quiz */}
      {showNudge && (
        <div className="bg-[#EDE8FF] border border-[#DDD6FE] rounded-xl p-4 mb-2">
          <p className="text-sm text-slate-800 font-medium mb-2">
            You've been studying hard! Ready to test what you've learned?
          </p>
          <button
            onClick={onStartQuiz}
            className="px-4 py-2 bg-[#6C5CE7] hover:bg-[#5A4BD1] text-white font-bold rounded-lg text-sm transition-colors"
          >
            Try a quiz
          </button>
        </div>
      )}

      {sortedTopics.map(({ key, name }) => {
        const isExpanded = expandedTopic === key;
        const progress = getTopicProgress(key);
        const subConcepts = lessonBank[key]?.subConcepts || [];

        return (
          <div key={key} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
            {/* Topic header */}
            <button
              onClick={() => setExpandedTopic(isExpanded ? null : key)}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#EDE8FF] flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-[#6C5CE7]" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-heading font-bold text-slate-800">{name}</h3>
                  <p className="text-xs text-slate-500">
                    {progress.seen}/{progress.total} lessons studied
                  </p>
                </div>
              </div>
              {isExpanded
                ? <ChevronDown className="w-4 h-4 text-slate-500" />
                : <ChevronRight className="w-4 h-4 text-slate-500" />
              }
            </button>

            {/* Sub-concepts list */}
            {isExpanded && subConcepts.length > 0 && (
              <div className="border-t border-gray-100 bg-gray-50">
                {subConcepts.map(sc => {
                  const isSeen = getSubConceptStatus(key, sc.id);
                  return (
                    <button
                      key={sc.id}
                      onClick={() => handleSelectLesson(key, sc)}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0 text-left"
                    >
                      {isSeen
                        ? <CheckCircle className="w-4 h-4 text-[#00B894] flex-shrink-0" />
                        : <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                      }
                      <span className={`text-sm ${isSeen ? 'text-slate-500' : 'text-slate-800 font-medium'}`}>
                        {sc.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {sortedTopics.length === 0 && (
        <p className="text-center text-slate-500 py-8">No lessons available for this subject yet.</p>
      )}
    </div>
  );
}

export default LessonBrowser;
