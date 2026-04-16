import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, ClipboardCheck, Flag, AlertTriangle, CheckCircle2, ChevronDown, ChevronRight, X, Eye, BookOpen, Play } from 'lucide-react';

// ============================================================
// Testing Mode — Manual QA dashboard for Ben + Jacqui
// ============================================================

const SUBJECT_LABELS = {
  maths: 'Maths',
  english: 'English',
  verbalreasoning: 'Verbal Reasoning',
};

const SUBJECT_ORDER = ['maths', 'english', 'verbalreasoning'];

const Q_FLAG_CATEGORIES = [
  'Wrong answer',
  'Bad diagram',
  'Confusing wording',
  'Explanation wrong',
  'Typo/spelling',
  'Other',
];

const L_FLAG_CATEGORIES = [
  'Confusing explanation',
  'Visual/diagram issue',
  'Interaction broken',
  'Typo/spelling',
  'Content wrong',
  'Other',
];

// ---- Coverage colour helpers ----

function coverageColour(pct) {
  if (pct >= 0.8) return 'bg-emerald-500';
  if (pct >= 0.2) return 'bg-amber-400';
  return 'bg-red-400';
}

function coverageBadge(pct) {
  if (pct >= 0.8) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
  if (pct >= 0.2) return 'text-amber-700 bg-amber-50 border-amber-200';
  return 'text-red-700 bg-red-50 border-red-200';
}

function subjectGradient(subject) {
  if (subject === 'maths') return 'from-[#0770C2] to-[#0652DD]';
  if (subject === 'english') return 'from-[#007D62] to-[#00876A]';
  return 'from-[#6C5CE7] to-[#5A4BD1]';
}

function subjectBadgeClass(subject) {
  if (subject === 'maths') return 'bg-blue-100 text-blue-700';
  if (subject === 'english') return 'bg-green-100 text-green-700';
  return 'bg-purple-100 text-purple-700';
}

// ============================================================
// FlagModal — shared structured bug reporting
// ============================================================

export function FlagModal({ isOpen, onClose, onSubmit, categories, context }) {
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!category) return;
    onSubmit({ ...context, category, note });
    setCategory('');
    setNote('');
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-bold text-slate-800 flex items-center gap-2">
            <Flag className="w-5 h-5 text-red-500" />
            Flag Issue
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Context info */}
        {context.questionId && (
          <p className="text-xs text-gray-500 mb-3">
            Question {context.questionId} · {context.topicName} · Difficulty {context.difficulty}
          </p>
        )}
        {context.subConceptName && (
          <p className="text-xs text-gray-500 mb-3">
            {context.subConceptName} · Screen {context.screenIndex + 1} · {context.topicName}
          </p>
        )}

        {/* Category picker */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-800 mb-2">What's wrong?</label>
          <div className="grid grid-cols-2 gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  category === cat
                    ? 'bg-red-50 border-red-300 text-red-700'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Optional note */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-slate-800 mb-1">Details (optional)</label>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Describe what's wrong..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-red-300"
          />
        </div>

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!category}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              category ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Flag It
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ============================================================
// TestingResultsSummary — shown after completing a testing quiz
// ============================================================

export function TestingResultsSummary({
  quizQuestions, answers, sessionFlags, onContinueTopic, onBackToDashboard, testingCoverage
}) {
  const correctCount = answers.filter(a => a.correct).length;

  // Record session
  React.useEffect(() => {
    testingCoverage.recordSession({
      questionsChecked: quizQuestions.length,
      lessonsChecked: 0,
      issuesFlagged: sessionFlags.length,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app-bg p-4">
      <div className="max-w-lg mx-auto">
        <div className="card-elevated p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-2xl flex items-center justify-center">
            <CheckCircle2 className="w-9 h-9 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-slate-800 mb-2">
            {quizQuestions.length} Questions Checked
          </h2>
          <p className="text-gray-500 mb-6">
            {correctCount}/{quizQuestions.length} answered correctly · {sessionFlags.length} issue{sessionFlags.length !== 1 ? 's' : ''} flagged
          </p>

          {sessionFlags.length > 0 && (
            <div className="mb-6 text-left">
              <h3 className="text-sm font-bold text-slate-800 mb-2">Flagged Issues</h3>
              <div className="space-y-2">
                {sessionFlags.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    <Flag className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-sm font-medium text-red-700">Q{f.questionId}</span>
                      <span className="text-sm text-red-600"> — {f.category}</span>
                      {f.note && <p className="text-xs text-red-500 mt-0.5">{f.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onBackToDashboard}
              className="flex-1 px-4 py-3 bg-gray-100 text-slate-800 font-bold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Back to Dashboard
            </button>
            <button
              onClick={onContinueTopic}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-[#6C5CE7] to-[#A29BFE] text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
            >
              Continue Testing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TopicLessonPicker — choose sub-concepts to test lessons
// ============================================================

function TopicLessonPicker({ topicKey, topicName, lessonBank, testingCoverage, onStartLesson, onBack }) {
  const bankEntry = lessonBank[topicKey];
  const subConcepts = bankEntry?.subConcepts || [];
  const testedIds = testingCoverage.data.lessons[topicKey]?.tested || [];

  return (
    <div>
      <button onClick={onBack} className="mb-4 flex items-center text-[#6C5CE7] hover:text-[#5A4BD1] font-medium gap-2">
        <ArrowLeft className="w-5 h-5" />
        Back to Dashboard
      </button>

      <h2 className="text-xl font-heading font-bold text-slate-800 mb-1">{topicName} — Lessons</h2>
      <p className="text-sm text-gray-500 mb-4">{testedIds.length}/{subConcepts.length} sub-concepts tested</p>

      <div className="space-y-2">
        {subConcepts.map(sc => {
          const isTested = testedIds.includes(sc.id);
          return (
            <button
              key={sc.id}
              onClick={() => onStartLesson(topicKey, sc)}
              className={`w-full text-left px-4 py-3 rounded-xl border transition-colors flex items-center justify-between ${
                isTested
                  ? 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                {isTested ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                ) : (
                  <Play className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
                <div>
                  <span className="text-sm font-medium text-slate-800">{sc.name}</span>
                  <span className="text-xs text-gray-400 ml-2">({sc.lessons?.length || 0} lesson{sc.lessons?.length !== 1 ? 's' : ''})</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          );
        })}
      </div>

      {subConcepts.length === 0 && (
        <p className="text-gray-400 text-center py-8">No lessons available for this topic yet.</p>
      )}
    </div>
  );
}

// ============================================================
// FlaggedIssuesPanel — shows all pending flags in one place
// ============================================================

function FlaggedIssuesPanel({ testingCoverage, coverage, onViewQuestion, remoteFlags, onResolveRemote }) {
  const [expanded, setExpanded] = useState(true);

  // Merge local flags (this user's localStorage) with remote flags (Worker KV — both users)
  const allFlags = useMemo(() => {
    const flags = [];
    // Remote flags from Worker (canonical — both users)
    for (const rf of remoteFlags) {
      // Infer type for legacy flags posted without a `type` field:
      // lesson flags carry subConceptId/lessonId; question flags carry questionId.
      const inferredType = rf.type
        || (rf.subConceptId || rf.lessonId ? 'lesson' : 'question');
      flags.push({
        ...rf,
        topicName: rf.topicName || coverage[rf.topicKey]?.topicName || rf.topicKey,
        subject: rf.subject || coverage[rf.topicKey]?.subject,
        type: inferredType,
        source: 'remote',
      });
    }
    // If no remote flags, fall back to local (e.g. Worker unreachable)
    if (remoteFlags.length === 0) {
      for (const [topicKey, topicData] of Object.entries(testingCoverage.data.questions)) {
        for (const flag of (topicData.flagged || [])) {
          flags.push({ ...flag, topicKey, topicName: coverage[topicKey]?.topicName || topicKey, subject: coverage[topicKey]?.subject, type: 'question', source: 'local' });
        }
      }
      for (const [topicKey, topicData] of Object.entries(testingCoverage.data.lessons)) {
        for (const flag of (topicData.flagged || [])) {
          flags.push({ ...flag, topicKey, topicName: coverage[topicKey]?.topicName || topicKey, subject: coverage[topicKey]?.subject, type: 'lesson', source: 'local' });
        }
      }
    }
    // Most recent first
    flags.sort((a, b) => (b.timestamp || b.date || '').localeCompare(a.timestamp || a.date || ''));
    return flags;
  }, [remoteFlags, testingCoverage.data, coverage]);

  return (
    <div className="mb-6">
      <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-2 mb-3">
        {expanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Flagged Issues</h2>
        <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">{allFlags.length}</span>
      </button>
      {expanded && (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {allFlags.map((flag, i) => {
            const isFixed = flag.status === 'fixed';
            return (
              <div key={i} className={`card-elevated p-3 flex items-start gap-3 ${isFixed ? 'ring-2 ring-emerald-300 bg-emerald-50/30' : ''}`}>
                {isFixed
                  ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  : <Flag className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-slate-800">
                      {flag.type === 'question'
                        ? `Q${flag.questionId}`
                        : `Lesson: ${flag.subConceptName || flag.subConceptId || flag.lessonId}${typeof flag.screenIndex === 'number' ? ` · Screen ${flag.screenIndex + 1}` : ''}`}
                    </span>
                    <span className="text-xs text-gray-400">{flag.topicName}</span>
                    <span className="text-xs font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded">{flag.category}</span>
                    {isFixed && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full animate-pulse">
                        Fixed — please review
                      </span>
                    )}
                  </div>
                  {flag.note && <p className="text-xs text-gray-600 mt-0.5">{flag.note}</p>}
                  {isFixed && flag.fixNote && (
                    <p className="text-xs text-emerald-700 mt-0.5 italic">Fix: {flag.fixNote}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1.5">
                    {flag.type === 'question' && (
                      <button
                        onClick={() => onViewQuestion(flag.topicKey, flag.subject, flag.questionId)}
                        className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                          isFixed
                            ? 'text-emerald-700 bg-emerald-100 hover:bg-emerald-200 ring-1 ring-emerald-300'
                            : 'text-[#6C5CE7] bg-[#EDE8FF] hover:bg-[#DDD6FF]'
                        }`}
                      >
                        <Eye className="w-3 h-3" />
                        {isFixed ? 'Review Fix' : 'View'}
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (flag.source === 'remote' && onResolveRemote) {
                          onResolveRemote(flag.id);
                        }
                        if (flag.type === 'question') {
                          testingCoverage.resolveQuestionFlag(flag.topicKey, flag.questionId);
                        } else {
                          testingCoverage.resolveLessonFlag(flag.topicKey, flag.subConceptId, flag.date);
                        }
                      }}
                      className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      <X className="w-3 h-3" />
                      Clear
                    </button>
                    {flag.submitter && <span className="text-[10px] font-medium text-purple-500">{flag.submitter}</span>}
                    <span className="text-[10px] text-gray-400">{(flag.timestamp || flag.date) ? new Date(flag.timestamp || flag.date).toLocaleString('en-GB') : ''}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================
// TestingDashboard — main dashboard component
// ============================================================

export default function TestingDashboard({
  questionData, lessonBank, testingCoverage,
  onStartTestingQuiz, onStartTestingLesson,
  onViewQuestion, onBack,
}) {
  const [activeTab, setActiveTab] = useState('maths');
  const [lessonPickerTopic, setLessonPickerTopic] = useState(null);
  const [expandedRisk, setExpandedRisk] = useState(true);
  const [remoteFlags, setRemoteFlags] = useState([]);

  const workerUrl = process.env.REACT_APP_TUTOR_API_URL;

  // Load flags from Worker on mount and after resolve
  const loadRemoteFlags = useCallback(() => {
    if (!workerUrl) return;
    fetch(`${workerUrl}/flags`)
      .then(r => r.json())
      .then(flags => setRemoteFlags(Array.isArray(flags) ? flags : []))
      .catch(() => {});
  }, [workerUrl]);

  useEffect(() => { loadRemoteFlags(); }, [loadRemoteFlags]);

  const handleResolveRemote = useCallback((flagId) => {
    if (!workerUrl) return;
    fetch(`${workerUrl}/flags/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ flagId }),
    })
      .then(() => loadRemoteFlags())
      .catch(() => {});
  }, [workerUrl, loadRemoteFlags]);

  const coverage = useMemo(
    () => testingCoverage.getCoverage(questionData, lessonBank),
    [testingCoverage, questionData, lessonBank]
  );

  const riskScores = useMemo(
    () => testingCoverage.getRiskScores(questionData, lessonBank),
    [testingCoverage, questionData, lessonBank]
  );

  const { totals } = testingCoverage;

  // Top 5 riskiest topics that haven't hit 80% question coverage
  const topRisks = riskScores.filter(r => r.qCoverage < 0.8).slice(0, 5);

  // Group coverage by subject
  const bySubject = useMemo(() => {
    const grouped = { maths: [], english: [], verbalreasoning: [] };
    for (const [topicKey, cov] of Object.entries(coverage)) {
      if (grouped[cov.subject]) {
        grouped[cov.subject].push({ topicKey, ...cov });
      }
    }
    // Sort each subject alphabetically by topic name
    for (const arr of Object.values(grouped)) {
      arr.sort((a, b) => a.topicName.localeCompare(b.topicName));
    }
    return grouped;
  }, [coverage]);

  // Subject-level summary
  const subjectSummary = useMemo(() => {
    const result = {};
    for (const [subject, topics] of Object.entries(bySubject)) {
      const totalQs = topics.reduce((s, t) => s + t.totalQs, 0);
      const testedQs = topics.reduce((s, t) => s + t.testedQs, 0);
      result[subject] = { totalQs, testedQs, pct: totalQs > 0 ? testedQs / totalQs : 1 };
    }
    return result;
  }, [bySubject]);

  // Lesson picker sub-view
  if (lessonPickerTopic) {
    const topicCov = coverage[lessonPickerTopic];
    return (
      <div className="app-bg p-4">
        <div className="max-w-4xl mx-auto">
          <TopicLessonPicker
            topicKey={lessonPickerTopic}
            topicName={topicCov?.topicName || lessonPickerTopic}
            lessonBank={lessonBank}
            testingCoverage={testingCoverage}
            onStartLesson={onStartTestingLesson}
            onBack={() => setLessonPickerTopic(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="app-bg p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button onClick={onBack} className="mb-4 flex items-center text-[#6C5CE7] hover:text-[#5A4BD1] font-medium gap-2">
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg">
            <ClipboardCheck className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="font-heading text-3xl font-extrabold text-slate-800">Testing Mode</h1>
            <p className="text-sm text-gray-500">Systematic QA — find bugs before the kids do</p>
          </div>
        </div>

        {/* Session stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Questions Checked', value: totals.questionsChecked, colour: 'text-blue-600' },
            { label: 'Lessons Checked', value: totals.lessonsChecked, colour: 'text-green-600' },
            { label: 'Issues Flagged', value: totals.issuesFlagged, colour: 'text-red-600' },
            { label: 'Sessions', value: totals.sessions, colour: 'text-purple-600' },
          ].map(stat => (
            <div key={stat.label} className="card-elevated p-3 text-center">
              <div className={`text-2xl font-bold ${stat.colour}`}>{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Flagged Issues — all pending flags */}
        {(totals.issuesFlagged > 0 || remoteFlags.length > 0) && (
          <FlaggedIssuesPanel testingCoverage={testingCoverage} coverage={coverage} onViewQuestion={onViewQuestion} remoteFlags={remoteFlags} onResolveRemote={handleResolveRemote} />
        )}

        {/* Test Next — risk-based suggestions */}
        {topRisks.length > 0 && (
          <div className="mb-6">
            <button
              onClick={() => setExpandedRisk(!expandedRisk)}
              className="flex items-center gap-2 mb-3"
            >
              {expandedRisk ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Test Next</h2>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </button>
            {expandedRisk && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {topRisks.map(risk => (
                  <div key={risk.topicKey} className="card-elevated p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${subjectBadgeClass(risk.subject)}`}>
                        {SUBJECT_LABELS[risk.subject]}
                      </span>
                      <span className="text-sm font-bold text-slate-800">{risk.topicName}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{risk.reason}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onStartTestingQuiz(risk.topicKey, risk.subject)}
                        className="flex-1 px-3 py-1.5 bg-red-50 text-red-700 text-sm font-medium rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
                      >
                        Test Questions
                      </button>
                      {(lessonBank[risk.topicKey]?.subConcepts?.length || 0) > 0 && (
                        <button
                          onClick={() => setLessonPickerTopic(risk.topicKey)}
                          className="px-3 py-1.5 bg-purple-50 text-purple-700 text-sm font-medium rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors"
                        >
                          Lessons
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Subject tabs */}
        <div className="flex gap-1 mb-4">
          {SUBJECT_ORDER.map(subject => {
            const summary = subjectSummary[subject];
            const isActive = activeTab === subject;
            return (
              <button
                key={subject}
                onClick={() => setActiveTab(subject)}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  isActive
                    ? `bg-gradient-to-r ${subjectGradient(subject)} text-white shadow-md`
                    : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <span>{SUBJECT_LABELS[subject]}</span>
                <span className={`block text-xs font-normal ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
                  {Math.round((summary?.pct || 0) * 100)}% tested
                </span>
              </button>
            );
          })}
        </div>

        {/* Coverage grid */}
        <div className="space-y-2">
          {(bySubject[activeTab] || []).map(topic => (
            <div key={topic.topicKey} className="card-elevated p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-800">{topic.topicName}</h3>
                <div className="flex items-center gap-2">
                  {topic.flaggedQs + topic.flaggedLessons > 0 && (
                    <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Flag className="w-3 h-3" />
                      {topic.flaggedQs + topic.flaggedLessons}
                    </span>
                  )}
                </div>
              </div>

              {/* Question coverage bar */}
              <div className="flex items-center gap-3 mb-1.5">
                <span className="text-xs text-gray-500 w-20 flex-shrink-0">Questions</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${coverageColour(topic.qCoverage)} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.max(topic.qCoverage * 100, topic.testedQs > 0 ? 2 : 0)}%` }}
                  />
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${coverageBadge(topic.qCoverage)}`}>
                  {topic.testedQs}/{topic.totalQs}
                </span>
              </div>

              {/* Lesson coverage bar */}
              {topic.totalLessons > 0 && (
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs text-gray-500 w-20 flex-shrink-0">Lessons</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${coverageColour(topic.lCoverage)} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max(topic.lCoverage * 100, topic.testedLessons > 0 ? 2 : 0)}%` }}
                    />
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${coverageBadge(topic.lCoverage)}`}>
                    {topic.testedLessons}/{topic.totalLessons}
                  </span>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => onStartTestingQuiz(topic.topicKey, activeTab)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Test Questions
                </button>
                {topic.totalLessons > 0 && (
                  <button
                    onClick={() => setLessonPickerTopic(topic.topicKey)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Test Lessons
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
