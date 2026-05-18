import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Printer, Loader, AlertCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatTopicKey } from '../utils/topicLabels';

const API_URL = process.env.REACT_APP_TUTOR_API_URL;

const DEV_MOCK_REPORT = {
  child: { name: 'Evie Mitchell', yearGroup: 5, targetSchool: 'Bournemouth School for Girls' },
  tutorName: 'Sarah Mitchell',
  generatedAt: new Date().toISOString(),
  readiness: { band: 'Developing Well', description: 'Solid progress on practised topics. Building towards full curriculum coverage.', colour: '#7C3AED' },
  trajectory: 'improving',
  coverage: { coveredCount: 4, inProgressCount: 3 },
  coveredAccuracy: 68,
  recentAccuracy: 66,
  subjectBreakdown: {
    maths: { accuracy: 64, coveredTopics: 2, inProgressTopics: 2 },
    english: { accuracy: 74, coveredTopics: 1, inProgressTopics: 1 },
    verbalreasoning: { accuracy: 71, coveredTopics: 1, inProgressTopics: 0 },
  },
  coveredTopics: [
    { topicKey: 'volume', subject: 'maths', score: 55, questionCount: 30 },
    { topicKey: 'datahandling', subject: 'maths', score: 73, questionCount: 25 },
    { topicKey: 'comprehension', subject: 'english', score: 74, questionCount: 22 },
    { topicKey: 'synonyms', subject: 'verbalreasoning', score: 71, questionCount: 20 },
  ],
  inProgressTopics: [
    { topicKey: 'fractions', subject: 'maths', questionCount: 12 },
    { topicKey: 'sequences', subject: 'maths', questionCount: 8 },
    { topicKey: 'grammar', subject: 'english', questionCount: 7 },
  ],
  mockTests: [],
  assignments: { total: 3, completed: 2, late: 0 },
  recommendations: [
    { topicKey: 'volume', subject: 'maths', score: 55 },
    { topicKey: 'datahandling', subject: 'maths', score: 73 },
  ],
};

async function fetchReport(childId, getToken) {
  const token = await getToken();
  const res = await fetch(`${API_URL}/api/tutor/report/${childId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Could not generate report');
  return data;
}

const SUBJECT_LABELS = { maths: 'Maths', english: 'English', verbalreasoning: 'Verbal Reasoning' };

function ScoreBar({ score, colour }) {
  const bg = score >= 80 ? '#16a34a' : score >= 65 ? '#7C3AED' : score >= 50 ? '#ca8a04' : '#dc2626';
  return (
    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1">
      <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, backgroundColor: colour || bg }} />
    </div>
  );
}

function TopicRow({ topicKey, subject, score, bg, textColour }) {
  const scoreColour = score >= 80 ? '#16a34a' : score >= 65 ? '#7C3AED' : score >= 50 ? '#ca8a04' : '#dc2626';
  return (
    <div className={`flex items-center justify-between px-3 py-2 ${bg} rounded-lg`}>
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-slate-700">{formatTopicKey(topicKey)}</span>
        <span className="text-xs text-slate-400 ml-2">{SUBJECT_LABELS[subject] || subject}</span>
      </div>
      <span className={`text-sm font-bold ml-3 ${textColour}`} style={{ color: scoreColour }}>{score}%</span>
    </div>
  );
}

export default function ReportScreen({ childId, getToken, onBack }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tutorNote, setTutorNote] = useState('');
  const printRef = useRef(null);

  const isPreview = process.env.NODE_ENV === 'development'
    && new URLSearchParams(window.location.search).get('preview') === 'tutorDashboard';

  useEffect(() => {
    if (isPreview || !getToken) {
      setReport(DEV_MOCK_REPORT);
      setLoading(false);
      return;
    }
    fetchReport(childId, getToken)
      .then(d => { setReport(d); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [childId, getToken, isPreview]);

  if (loading) {
    return (
      <div className="min-h-screen app-bg flex items-center justify-center gap-3">
        <Loader className="w-6 h-6 text-[#7C3AED] animate-spin" />
        <span className="text-slate-600">Generating report…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen app-bg flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 text-center max-w-sm">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="font-medium text-slate-700 mb-4">{error}</p>
          <button onClick={onBack} className="px-6 py-2 bg-[#7C3AED] text-white font-bold rounded-xl">Back</button>
        </div>
      </div>
    );
  }

  const {
    child, tutorName, generatedAt,
    readiness, trajectory, coverage,
    coveredAccuracy, recentAccuracy,
    subjectBreakdown, coveredTopics, inProgressTopics,
    mockTests, assignments, recommendations,
  } = report;

  const TrajectoryIcon = trajectory === 'improving' ? TrendingUp : trajectory === 'declining' ? TrendingDown : Minus;
  const trajectoryColour = trajectory === 'improving' ? '#16a34a' : trajectory === 'declining' ? '#dc2626' : '#64748b';
  const trajectoryLabel = trajectory === 'improving' ? 'Improving' : trajectory === 'declining' ? 'Declining' : 'Consistent';

  const completionRate = assignments.total > 0
    ? Math.round((assignments.completed / assignments.total) * 100)
    : null;

  // Covered topics: split into weakest (bottom half) and strongest (top half)
  const weakest = [...(coveredTopics || [])].sort((a, b) => a.score - b.score).slice(0, 5);
  const strongest = [...(coveredTopics || [])].sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <div className="app-bg min-h-screen p-4">
      {/* Controls — hidden on print */}
      <div className="print:hidden max-w-2xl mx-auto flex items-center justify-between mb-4">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-[#7C3AED] text-white text-sm font-bold rounded-xl hover:bg-[#6D28D9] transition-colors"
        >
          <Printer className="w-4 h-4" /> Print / Save PDF
        </button>
      </div>

      <div ref={printRef} className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-6 print:shadow-none print:rounded-none">

        {/* Header */}
        <div className="border-b border-gray-100 pb-4 mb-5">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-heading text-2xl font-bold text-slate-900">{child.name}</h1>
              <p className="text-slate-500 text-sm mt-0.5">
                {child.yearGroup ? `Year ${child.yearGroup}` : ''}
                {child.targetSchool ? ` · ${child.targetSchool}` : ''}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Progress report by</p>
              <p className="text-sm font-bold text-slate-700">{tutorName}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {new Date(generatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Readiness band — the headline */}
        <div className="mb-5 rounded-2xl p-5 border-2" style={{ borderColor: readiness.colour, backgroundColor: readiness.colour + '0d' }}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: readiness.colour }}>Current stage</span>
              </div>
              <p className="font-heading text-2xl font-bold text-slate-900 mb-1" style={{ color: readiness.colour }}>
                {readiness.band}
              </p>
              <p className="text-sm text-slate-600">{readiness.description}</p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0 px-3 py-1.5 rounded-xl bg-white border" style={{ borderColor: trajectoryColour + '40' }}>
              <TrajectoryIcon className="w-4 h-4" style={{ color: trajectoryColour }} />
              <span className="text-xs font-bold" style={{ color: trajectoryColour }}>{trajectoryLabel}</span>
            </div>
          </div>
        </div>

        {/* Key metrics row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="text-center p-3 bg-slate-50 rounded-xl">
            <p className="text-2xl font-bold text-slate-800">{recentAccuracy != null ? `${recentAccuracy}%` : '—'}</p>
            <p className="text-xs text-slate-500 mt-0.5">Recent accuracy</p>
            <p className="text-[10px] text-slate-400">Last 20 quizzes</p>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-xl">
            <p className="text-2xl font-bold text-slate-800">{coveredAccuracy != null ? `${coveredAccuracy}%` : '—'}</p>
            <p className="text-xs text-slate-500 mt-0.5">Depth accuracy</p>
            <p className="text-[10px] text-slate-400">Practised topics only</p>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-xl">
            <p className="text-2xl font-bold text-slate-800">{coverage.coveredCount}</p>
            <p className="text-xs text-slate-500 mt-0.5">Topics well-practised</p>
            <p className="text-[10px] text-slate-400">20+ questions each</p>
          </div>
        </div>

        {/* Mock tests — lead with these if available */}
        {mockTests.length > 0 && (
          <section className="mb-5">
            <h2 className="font-heading font-bold text-slate-800 mb-1">Mock test results</h2>
            <p className="text-xs text-slate-400 mb-3">The closest available measure of exam readiness</p>
            <div className="flex gap-3 flex-wrap">
              {mockTests.map((m, i) => (
                <div key={i} className="flex-1 min-w-[100px] px-4 py-3 bg-[#F8F7FF] border border-[#E8E5FF] rounded-xl text-center">
                  <p className="text-2xl font-bold text-[#7C3AED]">{m.percentage}%</p>
                  <p className="text-xs text-slate-600 mt-0.5">{SUBJECT_LABELS[m.subject] || m.subject}</p>
                  {m.date && (
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(m.date.replace(' ', 'T')).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Subject breakdown */}
        {Object.keys(subjectBreakdown).length > 0 && (
          <section className="mb-5">
            <h2 className="font-heading font-bold text-slate-800 mb-3">By subject</h2>
            <div className="flex flex-col gap-3">
              {Object.entries(subjectBreakdown)
                .sort(([, a], [, b]) => (b.accuracy ?? -1) - (a.accuracy ?? -1))
                .map(([subject, data]) => (
                  <div key={subject}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700">{SUBJECT_LABELS[subject] || subject}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400">
                          {data.coveredTopics} topic{data.coveredTopics !== 1 ? 's' : ''} well-practised
                          {data.inProgressTopics > 0 ? `, ${data.inProgressTopics} in progress` : ''}
                        </span>
                        <span className="text-sm font-bold text-slate-800">
                          {data.accuracy != null ? `${data.accuracy}%` : '—'}
                        </span>
                      </div>
                    </div>
                    {data.accuracy != null && <ScoreBar score={data.accuracy} />}
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Areas needing most work */}
        {weakest.length > 0 && (
          <section className="mb-5">
            <h2 className="font-heading font-bold text-slate-800 mb-1">Areas needing most work</h2>
            <p className="text-xs text-slate-400 mb-3">Topics with enough practice data to be reliable</p>
            <div className="flex flex-col gap-1.5">
              {weakest.map(t => (
                <TopicRow key={t.topicKey} {...t} bg="bg-red-50" />
              ))}
            </div>
          </section>
        )}

        {/* Strongest areas */}
        {strongest.length > 0 && strongest[0]?.score > 0 && (
          <section className="mb-5">
            <h2 className="font-heading font-bold text-slate-800 mb-1">Strongest areas</h2>
            <p className="text-xs text-slate-400 mb-3">Topics showing solid performance</p>
            <div className="flex flex-col gap-1.5">
              {strongest.map(t => (
                <TopicRow key={t.topicKey} {...t} bg="bg-green-50" />
              ))}
            </div>
          </section>
        )}

        {/* Topics in progress */}
        {inProgressTopics.length > 0 && (
          <section className="mb-5">
            <h2 className="font-heading font-bold text-slate-800 mb-1">Topics being built</h2>
            <p className="text-xs text-slate-400 mb-3">5–19 questions completed — not enough data for a score yet</p>
            <div className="flex flex-wrap gap-2">
              {inProgressTopics.map(t => (
                <span key={t.topicKey} className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs text-slate-600 font-medium">
                  {formatTopicKey(t.topicKey)}
                  <span className="text-slate-400 ml-1">({t.questionCount}q)</span>
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Homework completion */}
        {assignments.total > 0 && (
          <section className="mb-5">
            <h2 className="font-heading font-bold text-slate-800 mb-3">Homework completion</h2>
            <div className="flex gap-3">
              <div className="flex-1 text-center p-3 bg-green-50 rounded-xl">
                <p className="text-xl font-bold text-green-700">{completionRate}%</p>
                <p className="text-xs text-green-600">completion rate</p>
              </div>
              <div className="flex-1 text-center p-3 bg-slate-50 rounded-xl">
                <p className="text-xl font-bold text-slate-700">{assignments.completed}/{assignments.total}</p>
                <p className="text-xs text-slate-500">tasks done</p>
              </div>
              {assignments.late > 0 && (
                <div className="flex-1 text-center p-3 bg-red-50 rounded-xl">
                  <p className="text-xl font-bold text-red-600">{assignments.late}</p>
                  <p className="text-xs text-red-500">late</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <section className="mb-5">
            <h2 className="font-heading font-bold text-slate-800 mb-1">Priority practice areas</h2>
            <p className="text-xs text-slate-400 mb-3">Weakest well-practised topics not recently assigned</p>
            <div className="flex flex-col gap-1.5">
              {recommendations.map(r => (
                <div key={r.topicKey} className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                  <span className="text-sm text-slate-700 flex-1">{formatTopicKey(r.topicKey)}</span>
                  <span className="text-xs text-slate-400">{SUBJECT_LABELS[r.subject] || r.subject}</span>
                  <span className="text-xs font-bold text-amber-700">{r.score}%</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tutor's note — editable on screen, renders on print */}
        <section className="mb-2">
          <h2 className="font-heading font-bold text-slate-800 mb-1">Tutor's note</h2>
          <p className="text-xs text-slate-400 mb-2 print:hidden">Add context about your approach, what you've been working on, or any observations for parents.</p>
          <textarea
            className="w-full min-h-[80px] p-3 border border-slate-200 rounded-xl text-sm text-slate-700 resize-none focus:outline-none focus:border-[#7C3AED] print:border-0 print:p-0 print:resize-none print:min-h-0"
            placeholder="e.g. Evie has been working through a focused programme covering key maths topics…"
            value={tutorNote}
            onChange={e => setTutorNote(e.target.value)}
          />
        </section>

        {/* Footer */}
        <p className="text-[10px] text-slate-300 text-center mt-4 border-t border-gray-100 pt-3">
          Generated by PrepStep · prepstep.co.uk · {new Date(generatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>
    </div>
  );
}
