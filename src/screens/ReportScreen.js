import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Printer, Loader, AlertCircle } from 'lucide-react';
import { formatTopicKey } from '../utils/topicLabels';

const API_URL = process.env.REACT_APP_TUTOR_API_URL;

const DEV_MOCK_REPORT = {
  child: { name: 'Evie Mitchell', yearGroup: 5, targetSchool: 'Bournemouth School for Girls' },
  tutorName: 'Sarah Mitchell',
  generatedAt: new Date().toISOString(),
  summary: { estimatedPercentile: 72, overallScore: 61, recentAccuracy: 67, topicsAssessed: 5 },
  subjectMastery: { maths: 61, english: 74, verbalreasoning: 67 },
  weakestTopics: [
    { topicKey: 'longDivision', subject: 'maths', score: 48 },
    { topicKey: 'fractions', subject: 'maths', score: 67 },
    { topicKey: 'synonyms', subject: 'verbalreasoning', score: 67 },
  ],
  strongestTopics: [
    { topicKey: 'sequences', subject: 'maths', score: 75 },
    { topicKey: 'comprehension', subject: 'english', score: 74 },
  ],
  mockTests: [],
  assignments: { total: 2, completed: 1, late: 0 },
  recommendations: [
    { topicKey: 'longDivision', subject: 'maths', score: 48 },
    { topicKey: 'fractions', subject: 'maths', score: 67 },
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

function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

function PercentileGauge({ pct }) {
  const label =
    pct >= 90 ? 'Excellent — well above expected standard' :
    pct >= 75 ? 'Strong — above expected standard' :
    pct >= 50 ? 'On track — meeting expected standard' :
    pct >= 30 ? 'Developing — working towards standard' :
    'Needs support — below expected standard';

  const color =
    pct >= 75 ? '#16a34a' :
    pct >= 50 ? '#ca8a04' :
    '#dc2626';

  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 mb-2" style={{ borderColor: color }}>
        <span className="text-2xl font-bold" style={{ color }}>{pct}<sup className="text-sm">{ordinal(pct)}</sup></span>
      </div>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}

function SubjectBar({ subject, score, max = 100 }) {
  const color = score >= 75 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-400';
  const subjectLabels = { maths: 'Maths', english: 'English', verbalreasoning: 'Verbal Reasoning' };
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-slate-700">{subjectLabels[subject] || subject}</span>
        <span className="text-sm font-bold text-slate-800">{score}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${(score / max) * 100}%` }} />
      </div>
    </div>
  );
}

export default function ReportScreen({ childId, getToken, onBack }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const handlePrint = () => window.print();

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

  const { child, summary, subjectMastery, weakestTopics, strongestTopics, mockTests, assignments, recommendations, tutorName, generatedAt } = report;

  const subjectLabel = { maths: 'Maths', english: 'English', verbalreasoning: 'Verbal Reasoning' };
  const topicLabel = formatTopicKey;
  const completionRate = assignments.total > 0
    ? Math.round((assignments.completed / assignments.total) * 100)
    : null;

  return (
    <div className="app-bg min-h-screen p-4">
      {/* Controls — hidden when printing */}
      <div className="print:hidden max-w-2xl mx-auto flex items-center justify-between mb-4">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-[#7C3AED] text-white text-sm font-bold rounded-xl hover:bg-[#6D28D9] transition-colors"
        >
          <Printer className="w-4 h-4" />
          Print / Save PDF
        </button>
      </div>

      {/* Report — printed as-is */}
      <div ref={printRef} className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-6 print:shadow-none print:rounded-none">

        {/* Header */}
        <div className="border-b border-gray-200 pb-4 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-heading text-2xl font-bold text-slate-900">{child.name}</h1>
              <p className="text-slate-500 text-sm mt-1">
                {child.yearGroup ? `Year ${child.yearGroup}` : ''}
                {child.targetSchool ? ` · ${child.targetSchool}` : ''}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Report by</p>
              <p className="text-sm font-bold text-slate-700">{tutorName}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {new Date(generatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Summary headline */}
        <div className="flex items-center gap-6 mb-6 p-4 bg-[#F8F7FF] rounded-xl">
          <PercentileGauge pct={summary.estimatedPercentile} />
          <div className="flex-1">
            <p className="font-heading font-bold text-slate-900 mb-1">
              {child.name} is in the estimated <span className="text-[#7C3AED]">{summary.estimatedPercentile}{ordinal(summary.estimatedPercentile)} percentile</span>
            </p>
            <p className="text-sm text-slate-600">
              Based on GL Assessment grade expectations.
              {child.targetSchool ? ` Preparing for ${child.targetSchool}.` : ''}
            </p>
            <div className="flex gap-4 mt-2 text-xs text-slate-500">
              <span><b className="text-slate-700">{summary.overallScore}%</b> overall mastery</span>
              <span><b className="text-slate-700">{summary.recentAccuracy}%</b> recent accuracy</span>
              <span><b className="text-slate-700">{summary.topicsAssessed}</b> topics assessed</span>
            </div>
          </div>
        </div>

        {/* Subject breakdown */}
        {Object.keys(subjectMastery).length > 0 && (
          <section className="mb-6">
            <h2 className="font-heading font-bold text-slate-800 mb-3">Performance by subject</h2>
            {Object.entries(subjectMastery)
              .sort(([, a], [, b]) => b - a)
              .map(([subject, score]) => (
                <SubjectBar key={subject} subject={subject} score={score} />
              ))}
          </section>
        )}

        {/* Areas needing work */}
        {weakestTopics.length > 0 && (
          <section className="mb-6">
            <h2 className="font-heading font-bold text-slate-800 mb-3">Areas needing most work</h2>
            <div className="flex flex-col gap-1.5">
              {weakestTopics.map(t => (
                <div key={t.topicKey} className="flex items-center justify-between px-3 py-2 bg-red-50 border border-red-100 rounded-lg">
                  <span className="text-sm text-slate-700 capitalize">{topicLabel(t.topicKey)}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{subjectLabel[t.subject] || t.subject}</span>
                    <span className="text-sm font-bold text-red-600">{t.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Strongest areas */}
        {strongestTopics.length > 0 && (
          <section className="mb-6">
            <h2 className="font-heading font-bold text-slate-800 mb-3">Strongest areas</h2>
            <div className="flex flex-col gap-1.5">
              {strongestTopics.map(t => (
                <div key={t.topicKey} className="flex items-center justify-between px-3 py-2 bg-green-50 border border-green-100 rounded-lg">
                  <span className="text-sm text-slate-700 capitalize">{topicLabel(t.topicKey)}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{subjectLabel[t.subject] || t.subject}</span>
                    <span className="text-sm font-bold text-green-600">{t.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Mock tests */}
        {mockTests.length > 0 && (
          <section className="mb-6">
            <h2 className="font-heading font-bold text-slate-800 mb-3">Mock test results</h2>
            <div className="flex gap-3 flex-wrap">
              {mockTests.map((m, i) => (
                <div key={i} className="flex-1 min-w-24 px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-center">
                  <p className="text-lg font-bold text-slate-800">{m.percentage}%</p>
                  <p className="text-xs text-slate-500">{subjectLabel[m.subject] || m.subject}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Homework completion */}
        {assignments.total > 0 && (
          <section className="mb-6">
            <h2 className="font-heading font-bold text-slate-800 mb-3">Homework completion</h2>
            <div className="flex gap-4 text-sm">
              <div className="flex-1 text-center p-3 bg-green-50 rounded-xl">
                <p className="text-xl font-bold text-green-700">{completionRate}%</p>
                <p className="text-xs text-green-600">completion rate</p>
              </div>
              <div className="flex-1 text-center p-3 bg-slate-50 rounded-xl">
                <p className="text-xl font-bold text-slate-700">{assignments.completed}/{assignments.total}</p>
                <p className="text-xs text-slate-500">items done</p>
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

        {/* Recommended practice */}
        {recommendations.length > 0 && (
          <section className="mb-6">
            <h2 className="font-heading font-bold text-slate-800 mb-1">Recommended practice this week</h2>
            <p className="text-xs text-slate-400 mb-3">Weakest areas not recently assigned</p>
            <div className="flex flex-col gap-1.5">
              {recommendations.map(r => (
                <div key={r.topicKey} className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                  <span className="text-sm text-slate-700 capitalize flex-1">{topicLabel(r.topicKey)}</span>
                  <span className="text-xs text-slate-400">{subjectLabel[r.subject] || r.subject}</span>
                  <span className="text-xs font-bold text-amber-700">{r.score}%</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <div className="border-t border-gray-200 pt-4 mt-4 text-center text-xs text-slate-400">
          Generated by PrepStep · prepstep.co.uk · {new Date(generatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>
    </div>
  );
}
