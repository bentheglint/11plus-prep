import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Flag, ChevronDown, ChevronRight, Check, Filter, AlertTriangle, Eye } from 'lucide-react';
import {
  GridModel, WorkedExample, NumberLine, BarModel, PlaceValueChart,
  ColumnMethod, AngleDiagram, BusStopDiagram, RectangleDiagram,
  TriangleAreaDiagram, ParallelogramDiagram, CuboidDiagram, LShapeDiagram,
  SentenceDisplay, LetterTiles, AlphabetLine, SlidingWindow, LogicDiagram, CodeTable, SequenceChain,
  AnalogyDisplay, WordChipsDisplay, SDTTriangle, AngleDisplay, QuadShape,
  ParallelLines, ExteriorAngle, RegularPolygon, FunctionMachine, LineGraph,
  PathBorderDiagram, BarChart, PieChart, TwoWayTable
} from './microLessons/visuals';
import { lessonBank, testSubConceptBank } from './microLessons/lessonData';

// ---- Visual component map ----
const visualComponents = {
  GridModel, WorkedExample, NumberLine, BarModel, PlaceValueChart,
  ColumnMethod, AngleDiagram, BusStopDiagram, RectangleDiagram,
  TriangleAreaDiagram, ParallelogramDiagram, CuboidDiagram, LShapeDiagram,
  SentenceDisplay, LetterTiles, AlphabetLine, SlidingWindow, LogicDiagram, CodeTable, SequenceChain,
  AnalogyDisplay, WordChipsDisplay, SDTTriangle, AngleDisplay, QuadShape,
  ParallelLines, ExteriorAngle, RegularPolygon, FunctionMachine, LineGraph,
  PathBorderDiagram, BarChart, PieChart, TwoWayTable
};

// ---- Bold text renderer (same as MicroLessonScreen) ----
function renderBoldText(text) {
  if (!text) return null;
  const parts = String(text).split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-[#6C5CE7] font-bold">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

// ---- Render a visual component with props ----
function RenderVisual({ visual, variables }) {
  if (!visual || !visual.component) return null;
  const Component = visualComponents[visual.component];
  if (!Component) return <p className="text-xs text-red-400 italic">Unknown component: {visual.component}</p>;

  try {
    const props = typeof visual.props === 'function' ? visual.props(variables) : visual.props;
    // For WorkedExample, always show all steps revealed
    if (visual.component === 'WorkedExample') {
      return <Component {...props} allRevealed={true} />;
    }
    return <Component {...props} />;
  } catch (e) {
    return <p className="text-xs text-red-400 italic">Visual error: {e.message}</p>;
  }
}

// ---- Screen type badges ----
const screenTypeBadge = {
  hook: { label: 'HOOK', bg: 'bg-amber-100 text-amber-700' },
  teach: { label: 'TEACH', bg: 'bg-blue-100 text-blue-700' },
  interact: { label: 'INTERACT', bg: 'bg-green-100 text-green-700' },
  consolidate: { label: 'CONSOLIDATE', bg: 'bg-purple-100 text-purple-700' },
};

// ---- Interaction type labels ----
const interactionLabels = {
  'multiple-choice': 'MC',
  'fill-blank': 'Fill Blank',
  'order-steps': 'Order Steps',
  'match-pairs': 'Match Pairs',
  'true-false': 'True/False',
  'tap-to-reveal': 'Tap to Reveal',
};

// ---- Subject detection ----
const ENGLISH_TOPICS = new Set(['spelling', 'punctuation', 'grammar', 'vocabulary', 'wordClassGrammar', 'comprehension', 'antonyms', 'synonyms', 'compoundWords']);
const VR_TOPICS = new Set([
  'hiddenWords', 'letterCodes', 'letterMove', 'letterPairSeries', 'letterSums',
  'logicAndLanguage', 'missingLettersWords', 'numberSeries', 'numberWordCodes',
  'oddTwoOut', 'sharedLetter', 'verbalAnalogies', 'wordCodeAnalogies'
]);

function getSubject(topicKey) {
  if (ENGLISH_TOPICS.has(topicKey)) return 'English';
  if (VR_TOPICS.has(topicKey)) return 'VR';
  return 'Maths';
}

// ---- Lint report loader ----
function useLintReport() {
  const [lintData, setLintData] = useState(null);
  useEffect(() => {
    fetch('/lint-report.json')
      .then(r => r.ok ? r.json() : null)
      .then(setLintData)
      .catch(() => setLintData(null));
  }, []);
  return lintData;
}

// ============================================================
// MAIN COMPONENT
// ============================================================

// ============================================================
// QUESTION MAP VIEW — Review question-to-lesson mappings
// ============================================================
function QuestionMapView({ questionMap, setQuestionMap, mergedBank, topicList, onViewQuestion, onViewLesson, questionData, englishData, vrData, mapTopic, setMapTopic, reviewState, saveReviewState, flagScreen, devNotes }) {
  const [filterConf, setFilterConf] = useState('all'); // 'all', 'high', 'medium', 'low', 'none'

  // Load all mapping data from merged JSON files
  const [allMappings, setAllMappings] = useState(null);
  useEffect(() => {
    Promise.all([
      fetch('/maths-question-lesson-map.json').then(r => r.ok ? r.json() : {}).catch(() => ({})),
      fetch('/english-question-lesson-map.json').then(r => r.ok ? r.json() : {}).catch(() => ({})),
      fetch('/vr-question-lesson-map.json').then(r => r.ok ? r.json() : {}).catch(() => ({})),
    ]).then(([maths, english, vr]) => {
      setAllMappings({ ...maths, ...english, ...vr });
    });
  }, []);

  // When topic changes, build the questionMap view from allMappings
  useEffect(() => {
    if (!mapTopic || !allMappings || !allMappings[mapTopic]) {
      setQuestionMap(null);
      return;
    }
    const mappings = allMappings[mapTopic];
    // Build sub-concept list from the mappings
    const scSet = {};
    mappings.forEach(m => {
      if (m.subConceptId && !scSet[m.subConceptId]) {
        scSet[m.subConceptId] = m.subConceptId;
      }
    });
    const subConcepts = Object.keys(scSet).map(id => ({ id, name: id }));
    // Get sub-concept names from mergedBank if available
    const bankTopic = mergedBank[mapTopic];
    if (bankTopic) {
      bankTopic.subConcepts.forEach(sc => {
        const existing = subConcepts.find(s => s.id === sc.id);
        if (existing) existing.name = sc.name;
        else subConcepts.push({ id: sc.id, name: sc.name });
      });
    }
    const high = mappings.filter(m => m.confidence === 'high').length;
    const medium = mappings.filter(m => m.confidence === 'medium').length;
    const low = mappings.filter(m => m.confidence === 'low').length;
    const none = mappings.filter(m => !m.subConceptId).length;
    // Get question text from app data
    const getSubject = (key) => {
      const eng = ['spelling','punctuation','grammar','vocabulary','wordClassGrammar','comprehension'];
      const vr = ['hiddenWords','letterCodes','letterMove','letterPairSeries','letterSums','logicAndLanguage','missingLettersWords','numberSeries','numberWordCodes','oddTwoOut','sharedLetter','verbalAnalogies','wordCodeAnalogies','compoundWords','antonyms','synonyms'];
      if (eng.includes(key)) return 'english';
      if (vr.includes(key)) return 'vr';
      return 'maths';
    };
    const subject = getSubject(mapTopic);
    let questions = [];
    if (subject === 'english' && englishData) questions = englishData.topics?.[mapTopic]?.questions || englishData[mapTopic]?.questions || [];
    else if (subject === 'vr' && vrData) questions = vrData.topics?.[mapTopic]?.questions || vrData[mapTopic]?.questions || [];
    else if (questionData) questions = questionData.maths?.topics?.[mapTopic]?.questions || [];
    const qMap = {};
    questions.forEach(q => { qMap[q.id] = q; });

    setQuestionMap({
      topic: mapTopic,
      totalQuestions: mappings.length,
      totalSubConcepts: subConcepts.length,
      summary: { high, medium, low, none },
      subConcepts,
      mappings: mappings.map(m => {
        const q = qMap[m.questionId] || {};
        return {
          questionId: m.questionId,
          question: q.question || m.question || `Question ${m.questionId}`,
          options: q.options ? q.options.map((o, i) => typeof o === 'string' ? o : String(o)) : null,
          correctAnswer: q.options && q.correct !== undefined ? q.options[q.correct] : null,
          explanation: q.explanation || null,
          visual: q.visual || null,
          image: q.image || null,
          difficulty: q.difficulty || null,
          subConceptId: m.subConceptId,
          subConceptName: subConcepts.find(s => s.id === m.subConceptId)?.name || m.subConceptId,
          confidence: m.confidence || 'none',
          reason: m.reason || null,
        };
      }),
      gaps: []
    });
  }, [mapTopic, allMappings, mergedBank, setQuestionMap, questionData, englishData, vrData]);

  const confColors = {
    high: 'bg-green-50 border-green-200 text-green-700',
    medium: 'bg-amber-50 border-amber-200 text-amber-700',
    low: 'bg-orange-50 border-orange-200 text-orange-700',
    none: 'bg-red-50 border-red-200 text-red-700',
  };

  const confBadge = {
    high: 'bg-green-100 text-green-700',
    medium: 'bg-amber-100 text-amber-700',
    low: 'bg-orange-100 text-orange-700',
    none: 'bg-red-100 text-red-700',
  };

  const filteredMappings = questionMap?.mappings?.filter(m => {
    if (filterConf === 'all') return true;
    return m.confidence === filterConf;
  }) || [];

  // Group by sub-concept
  const grouped = {};
  for (const m of filteredMappings) {
    const key = m.subConceptId || 'UNMAPPED';
    if (!grouped[key]) grouped[key] = { name: m.subConceptName || 'No lesson match', questions: [] };
    grouped[key].questions.push(m);
  }

  return (
    <div>
      {/* Topic picker + Run button */}
      <div className="card rounded-xl p-4 mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 flex-1 min-w-[250px]">
          <label className="text-sm font-medium text-[#636E72]">Topic:</label>
          <select
            value={mapTopic}
            onChange={e => setMapTopic(e.target.value)}
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-[#6C5CE7]"
          >
            <option value="">-- Select topic --</option>
            {['Maths', 'English', 'VR'].map(subject => (
              <optgroup key={subject} label={subject}>
                {topicList.filter(t => t.subject === subject).map(t => (
                  <option key={t.key} value={t.key}>{t.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        {mapTopic && allMappings && !allMappings[mapTopic] && (
          <span className="text-xs text-gray-400 italic">No mapping data for this topic yet</span>
        )}
        {mapTopic && allMappings && allMappings[mapTopic] && (
          <span className="text-xs text-green-600 font-medium">✓ {allMappings[mapTopic].length} questions mapped</span>
        )}

        {/* Confidence filter */}
        {questionMap && (
          <div className="flex gap-1">
            {['all', 'high', 'medium', 'low', 'none'].map(f => (
              <button
                key={f}
                onClick={() => setFilterConf(f)}
                className={`px-2 py-1 rounded text-xs font-medium ${
                  filterConf === f ? 'bg-[#6C5CE7] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {questionMap && (
        <div className="card rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-heading font-bold text-[#2D3436]">
              {questionMap.topic} — {questionMap.totalQuestions} questions → {questionMap.totalSubConcepts} sub-concepts
            </h3>
            {(() => {
              const totalGroups = Object.keys(grouped).length;
              const reviewedGroups = Object.keys(grouped).filter(scId => reviewState[`qmap:${questionMap.topic}:${scId}`] === 'reviewed').length;
              if (totalGroups === 0) return null;
              return (
                <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  reviewedGroups === totalGroups ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  <Check className="w-3 h-3" /> {reviewedGroups}/{totalGroups} groups reviewed
                </span>
              );
            })()}
          </div>
          <div className="flex gap-3 text-sm">
            <span className="px-2 py-0.5 rounded bg-green-100 text-green-700">{questionMap.summary.high} high</span>
            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700">{questionMap.summary.medium} medium</span>
            <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-700">{questionMap.summary.low} low</span>
            <span className="px-2 py-0.5 rounded bg-red-100 text-red-700">{questionMap.summary.none} unmapped</span>
          </div>
          {/* Lesson gaps */}
          {questionMap.subConcepts && (() => {
            const mappedIds = new Set(questionMap.mappings.filter(m => m.subConceptId).map(m => m.subConceptId));
            const gaps = questionMap.subConcepts.filter(sc => !mappedIds.has(sc.id) && !sc.id.startsWith('master-'));
            if (gaps.length === 0) return null;
            return (
              <div className="mt-3 p-2 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-xs font-bold text-amber-700 mb-1">Lessons with no questions mapped:</p>
                {gaps.map(g => (
                  <span key={g.id} className="inline-block text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded mr-1 mb-1">{g.name}</span>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {/* Grouped question list */}
      {questionMap && Object.entries(grouped).map(([scId, group]) => {
        // Find the lesson for this sub-concept from the bank
        const bankTopic = mergedBank[questionMap.topic];
        const sc = bankTopic?.subConcepts?.find(s => s.id === scId);
        const lesson = sc?.lessons?.[0];

        const qmapReviewKey = `qmap:${questionMap.topic}:${scId}`;
        const isGroupReviewed = reviewState[qmapReviewKey] === 'reviewed';
        const groupFlags = devNotes.filter(n => n.topic === questionMap.topic && n.subConcept === scId && n.screenType === 'questionMap');
        const variables = lesson?.variableSets?.[0] || {};

        return (
        <div key={scId} className={`mb-6 ${isGroupReviewed ? 'opacity-60' : ''}`}>
          <div className="flex items-center justify-between mb-2 px-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#2D3436]">{group.name}</span>
              <span className="text-xs text-[#636E72]">({group.questions.length} questions)</span>
              {groupFlags.length > 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-medium">{groupFlags.length} flagged</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {onViewLesson && sc && lesson && (
                <button
                  onClick={() => onViewLesson(questionMap.topic, sc, lesson)}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[#6C5CE7]/30 bg-[#6C5CE7]/10 text-[#6C5CE7] hover:bg-[#6C5CE7]/20 font-bold"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View Lesson
                </button>
              )}
              <button
                onClick={() => {
                  const note = prompt(`Flag issue for ${group.name}:`);
                  if (note !== null && flagScreen) flagScreen(questionMap.topic, scId, lesson?.id || scId, 'questionMap', 'group', note);
                }}
                className={`flex items-center gap-1 text-xs px-2 py-1.5 rounded-lg transition-colors ${
                  groupFlags.length > 0 ? 'text-amber-600 bg-amber-50' : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50'
                }`}
                title="Flag an issue"
              >
                <Flag className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => saveReviewState(qmapReviewKey, isGroupReviewed ? undefined : 'reviewed')}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  isGroupReviewed
                    ? 'bg-green-500 text-white'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                {isGroupReviewed ? 'Reviewed' : 'Mark reviewed'}
              </button>
            </div>
          </div>

          {/* Lesson screen previews — full-width stacked cards (same as Lessons tab) */}
          {lesson && (
            <div className="mb-2 mx-2 space-y-2">
              {/* Intro card */}
              {lesson.learningGoal && lesson.learningGoal.length > 0 && (
                <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-100">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-200 text-gray-600">INTRO</span>
                    <span className="text-sm font-medium text-[#2D3436]">{sc?.name || group.name}</span>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-xs font-medium text-gray-500 mb-1">Learning goals:</p>
                    <ul className="text-sm text-gray-600 list-disc list-inside space-y-0.5">
                      {lesson.learningGoal.map((g, gi) => <li key={gi}>{renderBoldText(g)}</li>)}
                    </ul>
                  </div>
                </div>
              )}
              {/* Teach and Consolidate screens — full rendering */}
              {lesson.screens?.filter(s => s.type === 'teach' || s.type === 'consolidate').map((screen, sIdx) => {
                const badge = screenTypeBadge[screen.type] || { label: screen.type, bg: 'bg-gray-100 text-gray-600' };
                const v = variables;
                let title = '', body = '';
                let bodyPartsList = null;
                try { title = typeof screen.title === 'function' ? screen.title(v) : screen.title || ''; } catch { title = '[error]'; }
                try { body = typeof screen.body === 'function' ? screen.body(v) : screen.body || ''; } catch { body = '[error]'; }

                // Handle bodyParts (master methods with inline visuals)
                if (screen.bodyParts) {
                  try {
                    const parts = typeof screen.bodyParts === 'function' ? screen.bodyParts(v) : screen.bodyParts;
                    bodyPartsList = parts.map(p => {
                      if (p.type === 'text') return { type: 'text', content: typeof p.content === 'function' ? p.content(v) : p.content };
                      if (p.type === 'visual') return { type: 'visual', component: p.component, props: typeof p.props === 'function' ? p.props(v) : p.props };
                      return p;
                    });
                  } catch { /* ignore */ }
                }

                return (
                  <div key={`screen-${sIdx}`} className="rounded-lg border border-gray-200 bg-white overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-100">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${badge.bg}`}>{badge.label}</span>
                      <span className="text-sm font-medium text-[#2D3436]">{title}</span>
                    </div>
                    <div className="px-4 py-3">
                      {/* bodyParts rendering */}
                      {bodyPartsList ? (
                        <div className="space-y-3">
                          {bodyPartsList.map((part, pi) => {
                            if (part.type === 'text') {
                              return <div key={pi} className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{renderBoldText(part.content)}</div>;
                            }
                            if (part.type === 'visual' && part.component) {
                              const Comp = visualComponents[part.component];
                              if (!Comp) return <p key={pi} className="text-xs text-red-400">Unknown: {part.component}</p>;
                              try {
                                const vProps = part.component === 'WorkedExample' ? { ...part.props, allRevealed: true } : part.props;
                                return (
                                  <div key={pi} className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                                    <div className="text-xs text-gray-400 mb-2 font-mono">{part.component}</div>
                                    <Comp {...vProps} />
                                  </div>
                                );
                              } catch (e) { return <p key={pi} className="text-xs text-red-400">Visual error: {e.message}</p>; }
                            }
                            return null;
                          })}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{renderBoldText(body)}</div>
                      )}

                      {/* Visual component (non-bodyParts screens) */}
                      {!bodyPartsList && screen.visual && screen.visual.component && (
                        <div className="mt-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                          <div className="text-xs text-gray-400 mb-2 font-mono">{screen.visual.component}</div>
                          <RenderVisual visual={screen.visual} variables={v} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Flag notes for this group */}
          {groupFlags.length > 0 && (
            <div className="mb-2 mx-2 space-y-1">
              {groupFlags.map(n => (
                <div key={n.id} className="text-xs px-3 py-1.5 rounded bg-amber-50 border border-amber-200 flex items-start gap-2">
                  <Flag className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-amber-700">{n.note}</span>
                    <span className="text-gray-400 ml-2 text-[10px]">{new Date(n.timestamp).toLocaleDateString('en-GB')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="space-y-1">
            {group.questions.map(m => (
              <div key={m.questionId} className={`p-3 rounded-lg border ${confColors[m.confidence] || 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-start gap-3">
                  <span className="text-xs font-mono text-gray-400 mt-0.5 shrink-0 font-bold flex items-center gap-1">
                    Q{m.questionId}
                    {m.difficulty && (
                      <span className={`text-[10px] px-1 py-px rounded font-bold ${
                        m.difficulty === 1 ? 'bg-green-100 text-green-700' :
                        m.difficulty === 2 ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>D{m.difficulty}</span>
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 leading-snug font-medium">{m.question}</p>
                    {/* Visual component diagram */}
                    {m.visual && m.visual.component && (() => {
                      const Comp = visualComponents[m.visual.component];
                      if (!Comp) return <p className="text-xs text-red-400 mt-1">Unknown visual: {m.visual.component}</p>;
                      try {
                        return (
                          <div className="mt-2 p-2 rounded-lg bg-gray-50 border border-gray-100 max-w-md">
                            <Comp {...m.visual.props} />
                          </div>
                        );
                      } catch (e) { return <p className="text-xs text-red-400 mt-1">Visual error: {e.message}</p>; }
                    })()}
                    {/* Old SVG image fallback (only if no visual component) */}
                    {!m.visual && m.image && (
                      <div className="mt-2">
                        <img src={`/images/questions/${m.image}`} alt="Question diagram"
                          className="max-w-xs h-auto rounded border border-gray-200" />
                      </div>
                    )}
                    {m.options && (
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {m.options.map((opt, i) => (
                          <span key={i} className={`text-xs px-2 py-0.5 rounded-full ${
                            opt === m.correctAnswer
                              ? 'bg-green-100 text-green-700 font-bold ring-1 ring-green-300'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {String.fromCharCode(65 + i)}: {opt}
                          </span>
                        ))}
                      </div>
                    )}
                    {m.explanation && <p className="text-xs text-gray-500 mt-1 italic">{m.explanation}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${confBadge[m.confidence]}`}>
                      {m.confidence}
                    </span>
                    <button
                      onClick={() => onViewQuestion && onViewQuestion(questionMap.topic, m.questionId)}
                      className="text-xs px-2 py-0.5 rounded bg-[#6C5CE7]/10 text-[#6C5CE7] hover:bg-[#6C5CE7]/20 font-medium"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        const note = prompt(`Flag Q${m.questionId}:`);
                        if (note !== null && flagScreen) flagScreen(questionMap.topic, m.subConceptId, '', 'question', m.questionId, note);
                      }}
                      className={`text-xs px-2 py-0.5 rounded transition-colors ${
                        devNotes.some(n => n.topic === questionMap.topic && n.screenType === 'question' && n.screenIndex === m.questionId)
                          ? 'text-amber-600 bg-amber-50'
                          : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50'
                      }`}
                      title={`Flag Q${m.questionId}`}
                    >
                      <Flag className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                {/* Show flags for this question */}
                {devNotes.filter(n => n.topic === questionMap.topic && n.screenType === 'question' && n.screenIndex === m.questionId).map(n => (
                  <div key={n.id} className="mt-1 ml-11 text-xs px-3 py-1 rounded bg-amber-50 border border-amber-200 flex items-start gap-2">
                    <Flag className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                    <span className="text-amber-700">{n.note}</span>
                    <span className="text-gray-400 text-[10px] shrink-0">{new Date(n.timestamp).toLocaleDateString('en-GB')}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        );
      })}

      {/* No data state */}
      {!questionMap && (
        <div className="text-center py-20 text-[#636E72]">
          <p className="text-lg">Select a topic and click "Run Mapping" to map questions to lessons.</p>
        </div>
      )}
    </div>
  );
}

export default function SpeedReviewPanel({
  onBack, onViewQuestion, onViewLesson, questionData, englishData, vrData,
  activeTab: externalActiveTab, setActiveTab: externalSetActiveTab,
  mapTopic: externalMapTopic, setMapTopic: externalSetMapTopic,
  initialScrollY
}) {
  const activeTab = externalActiveTab || 'lessons';
  const setActiveTab = externalSetActiveTab || (() => {});
  const mapTopic = externalMapTopic || '';
  const setMapTopic = externalSetMapTopic || (() => {});
  const [selectedTopic, setSelectedTopic] = useState('');
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false);
  const [questionMap, setQuestionMap] = useState(null);
  const [showUnreviewedOnly, setShowUnreviewedOnly] = useState(false);
  const [showLintOverlay, setShowLintOverlay] = useState(true);
  const [reviewState, setReviewState] = useState(() => {
    try { return JSON.parse(localStorage.getItem('speed-review-state') || '{}'); }
    catch { return {}; }
  });
  const [flagNotes, setFlagNotes] = useState({});
  const [collapsedLessons, setCollapsedLessons] = useState(new Set());

  // Keep DevReviewPanel context updated with what we're viewing
  useEffect(() => {
    window.__devReviewContext = {
      view: 'speedReview',
      subject: selectedTopic ? getSubject(selectedTopic) : undefined,
      topic: selectedTopic || undefined,
      tab: activeTab,
    };
  }, [selectedTopic, activeTab]);

  // Restore scroll position when returning from question/lesson view
  useEffect(() => {
    if (initialScrollY) {
      requestAnimationFrame(() => window.scrollTo(0, initialScrollY));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const lintReport = useLintReport();

  // ---- Load dev-review-notes for per-screen display ----
  const [devNotes, setDevNotes] = useState([]);
  useEffect(() => {
    fetch('/api/dev-review')
      .then(r => r.ok ? r.json() : [])
      .then(notes => setDevNotes(Array.isArray(notes) ? notes : []))
      .catch(() => setDevNotes([]));
  }, []);

  // ---- Merge lessonBank master sub-concepts + testSubConceptBank staging sub-concepts ----
  const mergedBank = useMemo(() => {
    const merged = {};
    for (const [key, data] of Object.entries(lessonBank)) {
      const masterSCs = data.subConcepts || [];
      const stagingSCs = testSubConceptBank[key] || [];
      // Deduplicate by id (staging overrides master if same id)
      const seen = new Set();
      const all = [];
      for (const sc of masterSCs) { all.push(sc); seen.add(sc.id); }
      for (const sc of stagingSCs) { if (!seen.has(sc.id)) { all.push(sc); seen.add(sc.id); } }
      merged[key] = { name: data.name, subConcepts: all };
    }
    return merged;
  }, []);

  // ---- Build flat topic list ----
  const topicList = useMemo(() => {
    const topics = [];
    for (const [key, data] of Object.entries(mergedBank)) {
      if (data.subConcepts && data.subConcepts.length > 0) {
        topics.push({
          key,
          name: data.name,
          subject: getSubject(key),
          subConceptCount: data.subConcepts.length,
        });
      }
    }
    topics.sort((a, b) => {
      const subjectOrder = { Maths: 0, English: 1, VR: 2 };
      const so = (subjectOrder[a.subject] || 0) - (subjectOrder[b.subject] || 0);
      return so !== 0 ? so : a.name.localeCompare(b.name);
    });
    return topics;
  }, [mergedBank]);

  // ---- Get sub-concepts for selected topic ----
  const subConcepts = useMemo(() => {
    if (!selectedTopic || !mergedBank[selectedTopic]) return [];
    return mergedBank[selectedTopic].subConcepts;
  }, [selectedTopic, mergedBank]);

  // ---- Get lint issues for selected topic ----
  const lintIssues = useMemo(() => {
    if (!lintReport || !selectedTopic) return {};
    const issues = {};
    for (const issue of lintReport.issues) {
      if (issue.topicKey === selectedTopic) {
        const key = `${issue.subConcept}:${issue.lesson}:${issue.screen}`;
        if (!issues[key]) issues[key] = [];
        issues[key].push(issue);
      }
    }
    return issues;
  }, [lintReport, selectedTopic]);

  // ---- Progress stats ----
  const progressStats = useMemo(() => {
    let total = 0, reviewed = 0;
    for (const topic of topicList) {
      const data = mergedBank[topic.key];
      if (!data) continue;
      for (const sc of data.subConcepts) {
        for (const lesson of sc.lessons) {
          if (lesson.learningGoal && lesson.learningGoal.length > 0) {
            total++;
            if (reviewState[`${topic.key}:${sc.id}:${lesson.id}:intro`] === 'reviewed') reviewed++;
          }
          const screenCount = lesson.screens?.length || 0;
          for (let i = 0; i < screenCount; i++) {
            total++;
            if (reviewState[`${topic.key}:${sc.id}:${lesson.id}:s${i}`] === 'reviewed') reviewed++;
          }
        }
      }
    }
    return { total, reviewed, flagged: devNotes.length };
  }, [topicList, mergedBank, reviewState, devNotes]);

  // ---- Save review state ----
  const saveReviewState = (key, status) => {
    const updated = { ...reviewState, [key]: status };
    setReviewState(updated);
    localStorage.setItem('speed-review-state', JSON.stringify(updated));
  };

  // ---- Flag a screen (save to dev-review-notes.json) ----
  const flagScreen = async (topicKey, scId, lessonId, screenType, sIdx, note) => {
    const noteObj = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      view: 'speedReview',
      subject: getSubject(topicKey),
      topic: topicKey,
      subConcept: scId,
      lessonId,
      screenIndex: sIdx,
      screenType,
      note: note || `Flagged during speed review: ${scId} > ${lessonId} > ${screenType}`,
      status: 'pending',
    };

    try {
      const res = await fetch('/api/dev-review');
      const existing = res.ok ? await res.json() : [];
      existing.push(noteObj);
      await fetch('/api/dev-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(existing),
      });
      setDevNotes(prev => [...prev, noteObj]);
      setFlagNotes(prev => ({
        ...prev,
        [`${scId}:${lessonId}:${screenType}:${sIdx}`]: noteObj.note
      }));
    } catch (e) {
      console.error('Failed to save flag:', e);
    }
  };

  // ---- Toggle lesson collapse (all expanded by default) ----
  const toggleLesson = (lessonId) => {
    setCollapsedLessons(prev => {
      const next = new Set(prev);
      if (next.has(lessonId)) next.delete(lessonId);
      else next.add(lessonId);
      return next;
    });
  };

  // ---- Collapse all lessons for a sub-concept ----
  const collapseAll = (sc) => {
    setCollapsedLessons(prev => {
      const next = new Set(prev);
      for (const lesson of sc.lessons) next.add(lesson.id);
      return next;
    });
  };

  // ---- Expand all lessons for a sub-concept ----
  const expandAll = (sc) => {
    setCollapsedLessons(prev => {
      const next = new Set(prev);
      for (const lesson of sc.lessons) next.delete(lesson.id);
      return next;
    });
  };

  // ---- Filter sub-concepts ----
  const filteredSubConcepts = useMemo(() => {
    let filtered = subConcepts;
    if (showFlaggedOnly) {
      filtered = filtered.filter(sc =>
        devNotes.some(n => n.topic === selectedTopic && n.subConcept === sc.id)
      );
    }
    if (showUnreviewedOnly) {
      filtered = filtered.filter(sc => {
        for (const lesson of sc.lessons) {
          if (lesson.learningGoal && lesson.learningGoal.length > 0) {
            if (reviewState[`${selectedTopic}:${sc.id}:${lesson.id}:intro`] !== 'reviewed') return true;
          }
          const screenCount = lesson.screens?.length || 0;
          for (let i = 0; i < screenCount; i++) {
            if (reviewState[`${selectedTopic}:${sc.id}:${lesson.id}:s${i}`] !== 'reviewed') return true;
          }
        }
        return false;
      });
    }
    return filtered;
  }, [subConcepts, showFlaggedOnly, showUnreviewedOnly, selectedTopic, devNotes, reviewState]);

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="app-bg min-h-screen p-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="flex items-center text-[#6C5CE7] hover:text-[#5A4BD1] font-medium gap-2">
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h2 className="text-2xl font-heading font-bold text-[#2D3436]">Speed Review</h2>
          <div className="text-sm text-[#636E72]">
            {progressStats.reviewed}/{progressStats.total} reviewed
            {progressStats.flagged > 0 && <span className="text-amber-600 ml-2">{progressStats.flagged} flagged</span>}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('lessons')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              activeTab === 'lessons' ? 'bg-[#6C5CE7] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Lesson Review
          </button>
          <button
            onClick={() => setActiveTab('questionMap')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              activeTab === 'questionMap' ? 'bg-[#6C5CE7] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Question → Lesson Map
          </button>
        </div>

        {/* Controls */}
        {activeTab === 'lessons' && <div className="card rounded-xl p-4 mb-6 flex flex-wrap items-center gap-4">
          {/* Topic picker */}
          <div className="flex items-center gap-2 flex-1 min-w-[250px]">
            <label className="text-sm font-medium text-[#636E72]">Topic:</label>
            <select
              value={selectedTopic}
              onChange={e => { setSelectedTopic(e.target.value); setCollapsedLessons(new Set()); }}
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-[#6C5CE7] focus:border-transparent"
            >
              <option value="">-- Select topic --</option>
              {['Maths', 'English', 'VR'].map(subject => (
                <optgroup key={subject} label={subject}>
                  {topicList.filter(t => t.subject === subject).map(t => (
                    <option key={t.key} value={t.key}>{t.name} ({t.subConceptCount})</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Filters */}
          <button
            onClick={() => setShowUnreviewedOnly(!showUnreviewedOnly)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              showUnreviewedOnly ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-4 h-4" />
            {showUnreviewedOnly ? 'Unreviewed only' : 'All reviews'}
          </button>

          <button
            onClick={() => setShowFlaggedOnly(!showFlaggedOnly)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              showFlaggedOnly ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Flag className="w-4 h-4" />
            {showFlaggedOnly ? 'Flagged only' : 'All flags'}
          </button>

          <button
            onClick={() => setShowLintOverlay(!showLintOverlay)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              showLintOverlay ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            {showLintOverlay ? 'Lint on' : 'Lint off'}
          </button>
        </div>}

        {/* ============ QUESTION MAP TAB ============ */}
        {activeTab === 'questionMap' && (
          <QuestionMapView
            questionMap={questionMap}
            setQuestionMap={setQuestionMap}
            mergedBank={mergedBank}
            topicList={topicList}
            onViewQuestion={onViewQuestion}
            onViewLesson={onViewLesson}
            questionData={questionData}
            englishData={englishData}
            vrData={vrData}
            mapTopic={mapTopic}
            setMapTopic={setMapTopic}
            reviewState={reviewState}
            saveReviewState={saveReviewState}
            flagScreen={flagScreen}
            devNotes={devNotes}
          />
        )}

        {/* ============ LESSONS TAB ============ */}
        {activeTab === 'lessons' && <>
        {/* No topic selected */}
        {!selectedTopic && (
          <div className="text-center py-20 text-[#636E72]">
            <p className="text-lg">Select a topic above to begin speed review.</p>
            <p className="text-sm mt-2">Each sub-concept's lessons are shown on one scrollable page.</p>
          </div>
        )}

        {/* Sub-concepts list */}
        {selectedTopic && filteredSubConcepts.map((sc, scIdx) => {
          // Aggregate screen-level review counts for header badge
          const scScreenStats = (() => {
            let total = 0, reviewed = 0;
            for (const l of sc.lessons) {
              if (l.learningGoal && l.learningGoal.length > 0) {
                total++;
                if (reviewState[`${selectedTopic}:${sc.id}:${l.id}:intro`] === 'reviewed') reviewed++;
              }
              const count = l.screens?.length || 0;
              for (let i = 0; i < count; i++) {
                total++;
                if (reviewState[`${selectedTopic}:${sc.id}:${l.id}:s${i}`] === 'reviewed') reviewed++;
              }
            }
            return { total, reviewed };
          })();

          return (
            <div key={sc.id} className="mb-8 animate-fade-in-up" style={{ animationDelay: `${scIdx * 30}ms` }}>
              {/* Sub-concept header */}
              <div className="card rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-[#6C5CE7]/10 to-transparent border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[#636E72]">#{scIdx + 1}</span>
                    <h3 className="font-heading font-bold text-[#2D3436]">{sc.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{sc.category}</span>
                    <span className="text-xs text-gray-400">{sc.lessons.length} lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => collapseAll(sc)}
                      className="text-xs text-[#6C5CE7] hover:underline"
                    >
                      Collapse all
                    </button>
                    {scScreenStats.reviewed > 0 && (
                      <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        scScreenStats.reviewed === scScreenStats.total ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        <Check className="w-3 h-3" /> {scScreenStats.reviewed}/{scScreenStats.total}
                      </span>
                    )}
                  </div>
                </div>

                {/* Lessons */}
                {sc.lessons.map((lesson, lIdx) => {
                  const isExpanded = !collapsedLessons.has(lesson.id);
                  const variables = lesson.variableSets?.[0] || {};
                  const interactVariables = lesson.variableSets?.length > 1 ? lesson.variableSets[1] : variables;

                  return (
                    <div key={lesson.id} className={lIdx > 0 ? 'border-t border-gray-100' : ''}>
                      {/* Lesson header */}
                      <div className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                        <button
                          onClick={() => toggleLesson(lesson.id)}
                          className="flex items-center gap-3 text-left"
                        >
                          {isExpanded
                            ? <ChevronDown className="w-4 h-4 text-gray-400" />
                            : <ChevronRight className="w-4 h-4 text-gray-400" />
                          }
                          <span className="text-sm font-medium text-[#2D3436]">
                            Lesson {String.fromCharCode(65 + lIdx)}: {lesson.templateType}
                          </span>
                          <span className="text-xs text-gray-400">{lesson.screens?.length || 0} screens</span>
                        </button>
                        {onViewLesson && (
                          <button
                            onClick={() => onViewLesson(selectedTopic, sc, lesson)}
                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[#6C5CE7]/30 bg-[#6C5CE7]/10 text-[#6C5CE7] hover:bg-[#6C5CE7]/20 font-bold"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View Lesson
                          </button>
                        )}
                      </div>

                      {/* Expanded: show all screens */}
                      {isExpanded && (
                        <div className="px-5 pb-4 space-y-4">
                          {/* Intro card (auto-generated in app, not in data) */}
                          {lesson.learningGoal && lesson.learningGoal.length > 0 && (() => {
                            const introReviewKey = `${selectedTopic}:${sc.id}:${lesson.id}:intro`;
                            const introReviewState = reviewState[introReviewKey];
                            const introNotes = devNotes.filter(n =>
                              n.topic === selectedTopic &&
                              n.subConcept === sc.id &&
                              n.screenType === 'intro' &&
                              (n.lessonId === undefined || n.lessonId === lesson.id)
                            );
                            return (
                            <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
                              <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-200 text-gray-600">INTRO</span>
                                  <span className="text-sm font-medium text-[#2D3436]">{sc.name}</span>
                                </div>
                                <button
                                  onClick={() => {
                                    const note = prompt(`Flag issue for ${sc.id} > intro:`);
                                    if (note !== null) flagScreen(selectedTopic, sc.id, lesson.id, 'intro', 'intro', note);
                                  }}
                                  className={`p-1 rounded transition-colors ${introNotes.length > 0 ? 'text-amber-600' : 'text-gray-400 hover:text-amber-500'}`}
                                  title="Flag this screen"
                                >
                                  <Flag className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="px-4 py-3">
                                <p className="text-xs font-medium text-gray-500 mb-1">Learning goals:</p>
                                <ul className="text-sm text-gray-600 list-disc list-inside space-y-0.5">
                                  {lesson.learningGoal.map((g, gi) => <li key={gi}>{g}</li>)}
                                </ul>

                                {/* Per-screen notes and review button */}
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                  {introNotes.length > 0 && (
                                    <div className="mb-2 space-y-1">
                                      {introNotes.map(n => (
                                        <div key={n.id} className="text-xs px-3 py-1.5 rounded bg-amber-50 border border-amber-200">
                                          <div className="flex items-start gap-2">
                                            <Flag className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                                            <div>
                                              <span className="text-amber-700">{n.note}</span>
                                              {n.fixNote && (
                                                <div className="mt-1 text-green-600">
                                                  <span className="font-medium">Fix:</span> {n.fixNote}
                                                </div>
                                              )}
                                              <span className="text-gray-400 ml-2 text-[10px]">
                                                {new Date(n.timestamp).toLocaleDateString('en-GB')}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  <button
                                    onClick={() => saveReviewState(introReviewKey, introReviewState === 'reviewed' ? undefined : 'reviewed')}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                      introReviewState === 'reviewed'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                                    }`}
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    {introReviewState === 'reviewed' ? 'Reviewed' : 'Mark reviewed'}
                                  </button>
                                </div>
                              </div>
                            </div>
                            );
                          })()}
                          {lesson.screens?.map((screen, sIdx) => {
                            const badge = screenTypeBadge[screen.type] || { label: screen.type, bg: 'bg-gray-100 text-gray-600' };
                            const lintKey = `${sc.id}:${lesson.id}:${screen.type}`;
                            const screenLintIssues = showLintOverlay ? (lintIssues[lintKey] || []) : [];
                            const flagKey = `${sc.id}:${lesson.id}:${screen.type}:${sIdx}`;
                            const isFlagged = !!flagNotes[flagKey];
                            const screenReviewKey = `${selectedTopic}:${sc.id}:${lesson.id}:s${sIdx}`;
                            const screenReviewState = reviewState[screenReviewKey];
                            const screenNotes = devNotes.filter(n =>
                              n.topic === selectedTopic &&
                              n.subConcept === sc.id &&
                              n.screenType === screen.type &&
                              (n.lessonId === undefined || n.lessonId === lesson.id)
                            );

                            // Resolve dynamic content — interact screens use a different variable set
                            const v = screen.type === 'interact' ? interactVariables : variables;
                            let title = '', body = '';
                            let bodyPartsList = null; // For master methods with inline visuals
                            try { title = typeof screen.title === 'function' ? screen.title(v) : screen.title || ''; } catch { title = '[error]'; }
                            try { body = typeof screen.body === 'function' ? screen.body(v) : screen.body || ''; } catch { body = '[error]'; }

                            // Handle bodyParts (used by master methods — can be array or function)
                            if (screen.bodyParts) {
                              try {
                                const parts = typeof screen.bodyParts === 'function'
                                  ? screen.bodyParts(v)
                                  : screen.bodyParts;
                                bodyPartsList = parts.map(p => {
                                  if (p.type === 'text') {
                                    return { type: 'text', content: typeof p.content === 'function' ? p.content(v) : p.content };
                                  }
                                  if (p.type === 'visual') {
                                    return { type: 'visual', component: p.component, props: typeof p.props === 'function' ? p.props(v) : p.props };
                                  }
                                  return p;
                                });
                                // Also set body to text-only version for lint/flag purposes
                                body = parts.filter(p => p.type === 'text').map(p =>
                                  typeof p.content === 'function' ? p.content(v) : p.content
                                ).join('\n\n');
                              } catch { body = '[bodyParts error]'; }
                            }

                            // Interaction info (short label for header)
                            const interaction = screen.interaction;
                            let interactionInfo = null;
                            if (interaction && interaction.type) {
                              interactionInfo = interactionLabels[interaction.type] || interaction.type;
                            }

                            return (
                              <div key={sIdx} className={`rounded-lg border ${isFlagged ? 'border-amber-300 bg-amber-50/30' : 'border-gray-200 bg-white'} overflow-hidden`}>
                                {/* Screen header */}
                                <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-100">
                                  <div className="flex items-center gap-2">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${badge.bg}`}>{badge.label}</span>
                                    <span className="text-sm font-medium text-[#2D3436]">{title}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {interactionInfo && (
                                      <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-500">{interactionInfo}</span>
                                    )}
                                    <button
                                      onClick={() => {
                                        const note = prompt(`Flag issue for ${sc.id} > ${screen.type}:`);
                                        if (note !== null) flagScreen(selectedTopic, sc.id, lesson.id, screen.type, sIdx, note);
                                      }}
                                      className={`p-1 rounded transition-colors ${isFlagged ? 'text-amber-600' : 'text-gray-400 hover:text-amber-500'}`}
                                      title="Flag this screen"
                                    >
                                      <Flag className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>

                                {/* Screen body */}
                                <div className="px-4 py-3">
                                  {/* bodyParts rendering (master methods with inline visuals) */}
                                  {bodyPartsList ? (
                                    <div className="space-y-3">
                                      {bodyPartsList.map((part, pi) => {
                                        if (part.type === 'text') {
                                          return (
                                            <div key={pi} className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                              {renderBoldText(part.content)}
                                            </div>
                                          );
                                        }
                                        if (part.type === 'visual' && part.component) {
                                          const Comp = visualComponents[part.component];
                                          if (!Comp) return <p key={pi} className="text-xs text-red-400">Unknown: {part.component}</p>;
                                          try {
                                            const vProps = part.component === 'WorkedExample'
                                              ? { ...part.props, allRevealed: true }
                                              : part.props;
                                            return (
                                              <div key={pi} className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                                                <div className="text-xs text-gray-400 mb-2 font-mono">{part.component}</div>
                                                <Comp {...vProps} />
                                              </div>
                                            );
                                          } catch (e) {
                                            return <p key={pi} className="text-xs text-red-400">Visual error: {e.message}</p>;
                                          }
                                        }
                                        return null;
                                      })}
                                    </div>
                                  ) : (
                                    <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                      {renderBoldText(body)}
                                    </div>
                                  )}

                                  {/* Visual component (non-bodyParts screens) */}
                                  {!bodyPartsList && screen.visual && screen.visual.component && (
                                    <div className="mt-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                                      <div className="text-xs text-gray-400 mb-2 font-mono">{screen.visual.component}</div>
                                      <RenderVisual visual={screen.visual} variables={v} />
                                    </div>
                                  )}

                                  {/* Tap-to-reveal indicator */}
                                  {interaction?.type === 'tap-to-reveal' && (
                                    <div className="mt-3 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                                      Interaction: Tap to Reveal
                                    </div>
                                  )}

                                  {/* Interaction details — wrapped in visible container */}
                                  {interaction && interaction.type && interaction.type !== 'tap-to-reveal' && (
                                    <div className="mt-3 p-3 rounded-lg bg-indigo-50 border border-indigo-200 text-xs">
                                      <div className="font-bold text-indigo-600 mb-2 uppercase tracking-wide text-[11px]">
                                        Interaction: {interactionLabels[interaction.type] || interaction.type}
                                      </div>

                                  {/* Multiple-choice */}
                                  {interaction?.type === 'multiple-choice' && (
                                    <div>
                                      {(() => {
                                        try {
                                          const q = interaction.question ? (typeof interaction.question === 'function' ? interaction.question(v) : interaction.question) : null;
                                          const opts = interaction.getOptions
                                            ? (typeof interaction.getOptions === 'function' ? interaction.getOptions(v) : interaction.getOptions)
                                            : interaction.options
                                              ? (typeof interaction.options === 'function' ? interaction.options(v) : interaction.options)
                                              : [];
                                          const correct = interaction.correctAnswer
                                            ? (typeof interaction.correctAnswer === 'function' ? interaction.correctAnswer(v) : interaction.correctAnswer)
                                            : null;
                                          const correctFb = interaction.feedback?.correct
                                            ? (typeof interaction.feedback.correct === 'function' ? interaction.feedback.correct(v) : interaction.feedback.correct)
                                            : null;
                                          const incorrectFb = interaction.feedback?.incorrect
                                            ? (typeof interaction.feedback.incorrect === 'function' ? interaction.feedback.incorrect(v) : interaction.feedback.incorrect)
                                            : null;
                                          return (
                                            <div className="space-y-2">
                                              {q && <p className="font-medium text-gray-600">{q}</p>}
                                              <div className="flex flex-wrap gap-1.5">
                                                {(Array.isArray(opts) ? opts : []).map((opt, oi) => (
                                                  <span key={oi} className={`px-2 py-1 rounded ${String(opt) === String(correct) ? 'bg-green-100 text-green-700 font-bold ring-1 ring-green-300' : 'bg-white text-gray-600'}`}>
                                                    {String.fromCharCode(65 + oi)}: {String(opt)}
                                                  </span>
                                                ))}
                                              </div>
                                              {correctFb && <p className="text-green-600 mt-1">{renderBoldText(correctFb)}</p>}
                                              {incorrectFb && <p className="text-red-500 mt-1">{renderBoldText(incorrectFb)}</p>}
                                            </div>
                                          );
                                        } catch (e) { return <span className="text-red-400">Error rendering MC: {e.message}</span>; }
                                      })()}
                                    </div>
                                  )}

                                  {/* Fill-blank */}
                                  {interaction?.type === 'fill-blank' && (
                                    <div>
                                      {(() => {
                                        try {
                                          const sentence = interaction.sentence ? (typeof interaction.sentence === 'function' ? interaction.sentence(v) : interaction.sentence) : null;
                                          const opts = interaction.options ? (typeof interaction.options === 'function' ? interaction.options(v) : interaction.options) : [];
                                          const idx = interaction.correctIndex ? (typeof interaction.correctIndex === 'function' ? interaction.correctIndex(v) : interaction.correctIndex) : 0;
                                          return (
                                            <div className="space-y-2">
                                              {sentence && <p className="font-medium text-gray-600">{renderBoldText(sentence)}</p>}
                                              <div className="flex flex-wrap gap-1.5">
                                                {opts.map((opt, oi) => (
                                                  <span key={oi} className={`px-2 py-1 rounded ${oi === idx ? 'bg-green-100 text-green-700 font-bold ring-1 ring-green-300' : 'bg-white text-gray-600'}`}>
                                                    {opt}
                                                  </span>
                                                ))}
                                              </div>
                                            </div>
                                          );
                                        } catch (e) { return <span className="text-red-400">Error rendering fill-blank: {e.message}</span>; }
                                      })()}
                                    </div>
                                  )}

                                  {/* Match-pairs */}
                                  {interaction?.type === 'match-pairs' && interaction.pairs && (
                                    <div>
                                      <div className="flex flex-wrap gap-2">
                                        {(() => {
                                          try {
                                            const pairs = typeof interaction.pairs === 'function' ? interaction.pairs(v) : interaction.pairs;
                                            return pairs.map((p, pi) => (
                                              <span key={pi} className="px-2 py-1 rounded bg-white text-blue-700 border border-blue-200">{p.left} → {p.right}</span>
                                            ));
                                          } catch { return <span className="text-red-400">Error rendering pairs</span>; }
                                        })()}
                                      </div>
                                    </div>
                                  )}

                                  {/* Order-steps */}
                                  {interaction?.type === 'order-steps' && interaction.steps && (
                                    <div>
                                      <ol className="list-decimal list-inside text-gray-600">
                                        {(() => {
                                          try {
                                            const steps = typeof interaction.steps === 'function' ? interaction.steps(v) : interaction.steps;
                                            return steps.map((s, si) => <li key={si}>{s}</li>);
                                          } catch { return <li className="text-red-400">Error rendering steps</li>; }
                                        })()}
                                      </ol>
                                    </div>
                                  )}

                                  {/* True-false */}
                                  {interaction?.type === 'true-false' && interaction.statements && (
                                    <div>
                                      <div className="space-y-1">
                                        {(() => {
                                          try {
                                            const stmts = typeof interaction.statements === 'function' ? interaction.statements(v) : interaction.statements;
                                            return stmts.map((s, si) => (
                                              <div key={si} className={`px-2 py-1 rounded ${s.answer ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                                {s.answer ? 'T' : 'F'}: {s.text}
                                              </div>
                                            ));
                                          } catch { return <span className="text-red-400">Error rendering statements</span>; }
                                        })()}
                                      </div>
                                    </div>
                                  )}

                                    </div>
                                  )}

                                  {/* Lint overlay */}
                                  {screenLintIssues.length > 0 && (
                                    <div className="mt-3 space-y-1">
                                      {screenLintIssues.map((issue, ii) => (
                                        <div key={ii} className={`text-xs px-3 py-1.5 rounded flex items-start gap-2 ${
                                          issue.severity === 'P0' ? 'bg-red-50 text-red-700' :
                                          issue.severity === 'P1' ? 'bg-amber-50 text-amber-700' :
                                          'bg-gray-50 text-gray-500'
                                        }`}>
                                          <span className="font-bold shrink-0">{issue.severity}</span>
                                          <span className="font-mono shrink-0">{issue.id}</span>
                                          <span>{issue.message}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {/* Per-screen notes and review button */}
                                  <div className="mt-3 pt-3 border-t border-gray-100">
                                    {screenNotes.length > 0 && (
                                      <div className="mb-2 space-y-1">
                                        {screenNotes.map(n => (
                                          <div key={n.id} className="text-xs px-3 py-1.5 rounded bg-amber-50 border border-amber-200">
                                            <div className="flex items-start gap-2">
                                              <Flag className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                                              <div>
                                                <span className="text-amber-700">{n.note}</span>
                                                {n.fixNote && (
                                                  <div className="mt-1 text-green-600">
                                                    <span className="font-medium">Fix:</span> {n.fixNote}
                                                  </div>
                                                )}
                                                <span className="text-gray-400 ml-2 text-[10px]">
                                                  {new Date(n.timestamp).toLocaleDateString('en-GB')}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                    <button
                                      onClick={() => saveReviewState(screenReviewKey, screenReviewState === 'reviewed' ? undefined : 'reviewed')}
                                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                        screenReviewState === 'reviewed'
                                          ? 'bg-green-500 text-white'
                                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                                      }`}
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                      {screenReviewState === 'reviewed' ? 'Reviewed' : 'Mark reviewed'}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Sub-concept footer */}
                <div className="flex items-center justify-end px-5 py-2 border-t border-gray-100 bg-gray-50">
                  <span className="text-xs text-gray-400">{sc.id}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty state for flagged filter */}
        {selectedTopic && showFlaggedOnly && filteredSubConcepts.length === 0 && (
          <div className="text-center py-20 text-[#636E72]">
            <p className="text-lg">No flagged sub-concepts in this topic.</p>
          </div>
        )}
        </>}

      </div>
    </div>
  );
}
