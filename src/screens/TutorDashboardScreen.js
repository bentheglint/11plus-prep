import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft, Users, BookOpen, Clock, AlertCircle, CheckCircle2,
  ChevronRight, Copy, Check, Plus, X, Trash2, MessageCircle,
  TrendingDown, Activity, Calendar,
} from 'lucide-react';
import { motion } from '../components/Motion';
import PupilDetailScreen from './PupilDetailScreen';
import { TutorMessagingScreen } from './MessagingScreen';

const API_URL = process.env.REACT_APP_TUTOR_API_URL;

async function apiFetch(path, getToken, options = {}) {
  const token = await getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...options.headers },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
  return data;
}

// Subject + topic picker data for the assignment composer
const SUBJECT_TOPICS = {
  maths: {
    label: 'Maths',
    topics: [
      { key: 'percentages', label: 'Percentages' },
      { key: 'decimals', label: 'Decimals' },
      { key: 'longdivision', label: 'Long Division' },
      { key: 'ratio', label: 'Ratio & Proportion' },
      { key: 'fractions', label: 'Fractions' },
      { key: 'longmultiplication', label: 'Long Multiplication' },
      { key: 'algebra', label: 'Algebra' },
      { key: 'placevalue', label: 'Place Value' },
      { key: 'negativenumbers', label: 'Negative Numbers' },
      { key: 'primenumbersfactors', label: 'Prime Numbers & Factors' },
      { key: 'areaperimeter', label: 'Area & Perimeter' },
      { key: 'volume', label: 'Volume' },
      { key: 'anglesshapes', label: 'Angles & Shapes' },
      { key: 'sequences', label: 'Sequences' },
      { key: 'datahandling', label: 'Data Handling' },
      { key: 'speeddistancetime', label: 'Speed, Distance, Time' },
    ],
  },
  english: {
    label: 'English',
    topics: [
      { key: 'comprehension', label: 'Comprehension' },
      { key: 'spelling', label: 'Spelling' },
      { key: 'punctuation', label: 'Punctuation' },
      { key: 'grammar', label: 'Grammar' },
      { key: 'vocabulary', label: 'Vocabulary' },
    ],
  },
  verbalreasoning: {
    label: 'Verbal Reasoning',
    topics: [
      { key: 'synonyms', label: 'Synonyms' },
      { key: 'antonyms', label: 'Antonyms' },
      { key: 'verbalAnalogies', label: 'Verbal Analogies' },
      { key: 'oddTwoOut', label: 'Odd Two Out' },
      { key: 'compoundWords', label: 'Compound Words' },
      { key: 'hiddenWords', label: 'Hidden Words' },
      { key: 'letterCodes', label: 'Letter Codes' },
      { key: 'numberSeries', label: 'Number Series' },
      { key: 'letterSums', label: 'Letter Sums' },
    ],
  },
};

const TOPIC_LABELS = Object.values(SUBJECT_TOPICS).flatMap(s =>
  s.topics.map(t => ({ key: t.key, label: t.label, subject: s.label }))
);
function topicLabel(key) {
  return TOPIC_LABELS.find(t => t.key === key)?.label || key;
}

// ── Pulse stat card ──
function StatCard({ icon: Icon, value, label, sub, accent }) {
  const accentMap = {
    purple: 'bg-[#F8F7FF] text-[#7C3AED]',
    green:  'bg-[#F0FDF4] text-[#16A34A]',
    amber:  'bg-amber-50   text-amber-600',
    red:    'bg-red-50     text-red-600',
  };
  const iconBg = accentMap[accent] || accentMap.purple;

  return (
    <div className="bg-white rounded-2xl p-4 flex items-start gap-3 shadow-sm border border-slate-100">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <div className="text-2xl font-bold text-slate-800 leading-none mb-0.5">{value ?? '—'}</div>
        <div className="text-xs font-medium text-slate-600">{label}</div>
        {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

// ── Pupil row ──
function PupilRow({ pupil, onClick }) {
  const inactive = pupil.days_inactive;
  const atRisk = inactive !== null && inactive > 6;
  const statusColor = pupil.overdue_assignments > 0
    ? 'bg-red-100 text-red-700'
    : pupil.assignment_status === 'on_track'
    ? 'bg-green-100 text-green-700'
    : 'bg-slate-100 text-slate-500';
  const statusLabel = pupil.overdue_assignments > 0
    ? `${pupil.overdue_assignments} overdue`
    : pupil.assignment_status === 'on_track'
    ? 'On track'
    : 'No assignment';

  const lastActiveLabel = inactive === null
    ? 'Never practised'
    : inactive === 0
    ? 'Active today'
    : inactive === 1
    ? 'Yesterday'
    : `${inactive} days ago`;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0 ${atRisk ? 'bg-amber-50/40' : ''}`}
    >
      {/* At-risk indicator */}
      <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-0.5 ${
        atRisk ? 'bg-amber-400' :
        inactive === 0 ? 'bg-green-400' :
        'bg-slate-200'
      }`} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-semibold text-slate-800 text-sm">{pupil.display_name}</span>
          {pupil.year_group && (
            <span className="text-xs text-slate-400">Y{pupil.year_group}</span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className={atRisk ? 'text-amber-600 font-medium' : ''}>{lastActiveLabel}</span>
          {pupil.weakest_topic && (
            <>
              <span className="text-slate-300">·</span>
              <span className="flex items-center gap-1">
                <TrendingDown className="w-3 h-3 text-slate-400" />
                {topicLabel(pupil.weakest_topic)} {pupil.weakest_accuracy !== null ? `(${pupil.weakest_accuracy}%)` : ''}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor}`}>
          {statusLabel}
        </span>
        <ChevronRight className="w-4 h-4 text-slate-300" />
      </div>
    </button>
  );
}

// ── Empty state ──
function EmptyState({ tutor, getToken, onViewMessages }) {
  const [copied, setCopied] = useState(false);
  const inviteUrl = `https://prepstep.co.uk/join/${tutor?.tutor_code}`;

  const copyLink = () => {
    navigator.clipboard.writeText(inviteUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#F8F7FF] flex items-center justify-center mb-5">
        <Users className="w-8 h-8 text-[#7C3AED]" />
      </div>
      <h2 className="font-heading text-xl font-bold text-slate-800 mb-2">Share your invite link</h2>
      <p className="text-slate-500 text-sm max-w-xs mb-6">
        Send this link to your pupils' parents. When they sign up via your link, they appear in your pupil list automatically.
      </p>

      <div className="w-full max-w-sm bg-[#F8F7FF] rounded-xl border border-[#E8E5FF] p-3 flex items-center gap-2 mb-4">
        <span className="flex-1 text-sm text-[#7C3AED] font-mono truncate">{inviteUrl}</span>
        <button
          type="button"
          onClick={copyLink}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-[#7C3AED] text-white rounded-lg hover:bg-[#5A4BD1] transition-colors flex-shrink-0"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div className="w-full max-w-sm text-left bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">How it works</p>
        {[
          ['Share your link', 'Send it via WhatsApp or email to parents.'],
          ['Parent signs up', "They create an account and their child's profile. They pay — PrepStep is free for tutors."],
          ['You see everything', "Their child's progress, quiz history, weak areas, and assignments — all in one place."],
        ].map(([step, desc], i) => (
          <div key={i} className="flex gap-3 mb-3 last:mb-0">
            <div className="w-5 h-5 rounded-full bg-[#7C3AED] text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
              {i + 1}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">{step}</p>
              <p className="text-xs text-slate-500">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Assignment composer (redesigned with topic picker) ──
function AssignmentComposer({ roster, classes, getToken, onCreated, onClose }) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [targetType, setTargetType] = useState('class');
  const [targetId, setTargetId] = useState('');
  const [items, setItems] = useState([{ itemType: 'topic', subject: 'maths', topicKey: '' }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const addItem = () => setItems(prev => [...prev, { itemType: 'topic', subject: 'maths', topicKey: '' }]);
  const removeItem = (i) => setItems(prev => prev.filter((_, idx) => idx !== i));
  const updateItem = (i, field, value) => {
    setItems(prev => prev.map((it, idx) => {
      if (idx !== i) return it;
      const updated = { ...it, [field]: value };
      if (field === 'subject') updated.topicKey = ''; // reset topic when subject changes
      return updated;
    }));
  };

  const handleSend = async () => {
    if (!getToken) { setError('Assignments cannot be sent in preview mode'); return; }
    if (!dueDate) { setError('Please set a due date'); return; }
    if (!targetId) { setError('Please select a class or pupil'); return; }
    const invalidItem = items.find(it => it.itemType === 'topic' && !it.topicKey);
    if (invalidItem) { setError('Please select a topic for all items'); return; }

    setSaving(true);
    setError(null);
    try {
      const mappedItems = items.map(it => ({
        itemType: it.itemType,
        itemRef: it.topicKey,
        subject: it.subject,
      }));
      const body = {
        title: title.trim() || null,
        dueDate,
        items: mappedItems,
        ...(targetType === 'class' ? { targetClassId: targetId } : { targetChildId: targetId }),
      };
      const data = await apiFetch('/api/tutor/assignments', getToken, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      onCreated(data.assignment);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  const targetOptions = targetType === 'class'
    ? classes.map(c => ({ id: c.id, label: c.name }))
    : roster.map(p => ({ id: p.id, label: p.display_name }));

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="font-heading font-bold text-base text-slate-800">New assignment</h2>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Title (optional)</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              placeholder="e.g. Week 3 practice"
              value={title} onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Due date</label>
            <input
              type="date"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              value={dueDate} onChange={e => setDueDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Assign to</label>
            <div className="flex gap-2 mb-2">
              {['class', 'child'].map(t => (
                <button key={t} type="button"
                  onClick={() => { setTargetType(t); setTargetId(''); }}
                  className={`flex-1 py-1.5 text-sm rounded-lg border transition-colors ${
                    targetType === t
                      ? 'border-[#7C3AED] bg-[#F8F7FF] text-[#7C3AED] font-medium'
                      : 'border-gray-200 text-slate-600'
                  }`}
                >
                  {t === 'class' ? 'Class' : 'Individual pupil'}
                </button>
              ))}
            </div>
            <select
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              value={targetId} onChange={e => setTargetId(e.target.value)}
            >
              <option value="">Select…</option>
              {targetOptions.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-2">Topics to practise</label>
            <div className="flex flex-col gap-2">
              {items.map((item, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <div className="flex-1 flex flex-col gap-1.5">
                    <select
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                      value={item.subject}
                      onChange={e => updateItem(i, 'subject', e.target.value)}
                    >
                      {Object.entries(SUBJECT_TOPICS).map(([key, s]) => (
                        <option key={key} value={key}>{s.label}</option>
                      ))}
                    </select>
                    <select
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                      value={item.topicKey}
                      onChange={e => updateItem(i, 'topicKey', e.target.value)}
                    >
                      <option value="">Select topic…</option>
                      {SUBJECT_TOPICS[item.subject]?.topics.map(t => (
                        <option key={t.key} value={t.key}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  {items.length > 1 && (
                    <button type="button" onClick={() => removeItem(i)}
                      className="mt-2 p-2 text-slate-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={addItem}
              className="mt-2 text-xs text-[#7C3AED] hover:underline flex items-center gap-1">
              <Plus className="w-3 h-3" /> Add another topic
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
          )}

          <button
            type="button"
            onClick={handleSend}
            disabled={saving}
            className={`w-full py-3 rounded-xl font-bold text-white text-sm transition-colors ${
              saving ? 'bg-slate-300 cursor-not-allowed' : 'bg-[#7C3AED] hover:bg-[#5A4BD1]'
            }`}
          >
            {saving ? 'Saving…' : 'Send assignment'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main dashboard ──
export default function TutorDashboardScreen({ getToken, onBack, onViewQuizDetail, onViewAssignmentDetail }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePupil, setActivePupil] = useState(null);
  const [showComposer, setShowComposer] = useState(false);
  const [isSplit, setIsSplit] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024);
  const [showMessaging, setShowMessaging] = useState(false);
  const [classes, setClasses] = useState([]);
  const [copiedInvite, setCopiedInvite] = useState(false);

  const loadDashboard = useCallback(async () => {
    // Dev preview: inject mock data when getToken is unavailable
    const previewParam = process.env.NODE_ENV === 'development'
      && new URLSearchParams(window.location.search).get('preview');
    if (previewParam === 'tutorEmpty' || (!getToken && previewParam !== 'tutorDashboard')) {
      setData({ tutor: { id: 'dev', name: 'Mary Jones', tutor_code: 'MARY-XZ7Q', bio: '' }, roster: [], pulse: null });
      setLoading(false);
      return;
    }
    const IS_PREVIEW = previewParam === 'tutorDashboard';
    if (IS_PREVIEW) {
      setData({
        tutor: { id: 'dev', name: 'Mary Jones', tutor_code: 'MARY-XZ7Q', bio: '11+ GL specialist, Bournemouth.' },
        roster: [
          { id: 'c1', display_name: 'Evie', year_group: 5, target_school: 'Bournemouth School for Girls',
            last_active: new Date(Date.now() - 0).toISOString(), days_inactive: 0,
            quizzes_this_week: 5, accuracy_this_week: 78,
            weakest_topic: 'longdivision', weakest_subject: 'maths', weakest_accuracy: 52,
            overdue_assignments: 0, assignment_status: 'on_track' },
          { id: 'c2', display_name: 'James', year_group: 5, target_school: 'Parkstone Grammar',
            last_active: new Date(Date.now() - 3 * 86400000).toISOString(), days_inactive: 3,
            quizzes_this_week: 2, accuracy_this_week: 61,
            weakest_topic: 'fractions', weakest_subject: 'maths', weakest_accuracy: 44,
            overdue_assignments: 1, assignment_status: 'overdue' },
          { id: 'c3', display_name: 'Priya', year_group: 5, target_school: 'Poole Grammar',
            last_active: new Date(Date.now() - 9 * 86400000).toISOString(), days_inactive: 9,
            quizzes_this_week: 0, accuracy_this_week: null,
            weakest_topic: 'sequences', weakest_subject: 'maths', weakest_accuracy: 38,
            overdue_assignments: 0, assignment_status: 'none' },
          { id: 'c4', display_name: 'Tom', year_group: 5, target_school: 'Bournemouth School',
            last_active: new Date(Date.now() - 1 * 86400000).toISOString(), days_inactive: 1,
            quizzes_this_week: 3, accuracy_this_week: 82,
            weakest_topic: 'anglesshapes', weakest_subject: 'maths', weakest_accuracy: 65,
            overdue_assignments: 0, assignment_status: 'on_track' },
        ],
        pulse: {
          active_this_week: 3,
          total_pupils: 4,
          overdue_assignments: 1,
          avg_accuracy_this_week: 74,
          weakest_topic: { topic_key: 'fractions', subject: 'maths', accuracy: 48, pupil_count: 3 },
        },
      });
      setClasses([
        { id: 'cls1', name: 'Saturday group', enrolment_count: 3 },
      ]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const [dashboard, classesData] = await Promise.all([
        apiFetch('/api/tutor/dashboard', getToken),
        apiFetch('/api/tutor/classes', getToken).catch(() => ({ classes: [] })),
      ]);
      setData(dashboard);
      setClasses(classesData.classes || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  useEffect(() => {
    const handler = () => setIsSplit(window.innerWidth >= 1024);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const copyInvite = () => {
    if (!data?.tutor?.tutor_code) return;
    navigator.clipboard.writeText(`https://prepstep.co.uk/join/${data.tutor.tutor_code}`).then(() => {
      setCopiedInvite(true);
      setTimeout(() => setCopiedInvite(false), 2000);
    });
  };

  // Portrait/mobile: full-screen navigation (unchanged)
  if (!isSplit && activePupil) {
    return (
      <PupilDetailScreen
        childId={activePupil.id}
        getToken={getToken}
        onBack={() => { setActivePupil(null); loadDashboard(); }}
        onViewQuizDetail={onViewQuizDetail}
        onViewAssignmentDetail={onViewAssignmentDetail}
      />
    );
  }

  if (!isSplit && showMessaging) {
    return <TutorMessagingScreen getToken={getToken} onBack={() => setShowMessaging(false)} />;
  }

  const { tutor, roster = [], pulse } = data || {};

  // ── Shared dashboard body (used in both layouts) ──────────────────────────
  const dashboardBody = (
    <>
      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3 animate-pulse">
          <div className="grid grid-cols-2 gap-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-20 bg-white rounded-2xl border border-slate-100" />
            ))}
          </div>
          <div className="h-4 bg-slate-100 rounded w-24 mt-4" />
          {[1,2,3].map(i => (
            <div key={i} className="h-16 bg-white rounded-2xl border border-slate-100" />
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
          <p className="text-red-700 text-sm font-medium mb-1">Couldn't load dashboard</p>
          <p className="text-red-500 text-xs mb-3">{error}</p>
          <button type="button" onClick={loadDashboard}
            className="text-xs font-medium text-red-700 underline">Try again</button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && roster.length === 0 && tutor && (
        <EmptyState tutor={tutor} getToken={getToken} onViewMessages={() => setShowMessaging(true)} />
      )}

      {/* Main content */}
      {!loading && !error && roster.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        >
          {/* Pulse cards */}
          {pulse && (
            <div className="mb-5">
              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  icon={Activity}
                  value={`${pulse.active_this_week}/${pulse.total_pupils}`}
                  label="Active this week"
                  sub={pulse.active_this_week < pulse.total_pupils
                    ? `${pulse.total_pupils - pulse.active_this_week} haven't practised`
                    : 'Everyone active'}
                  accent={pulse.active_this_week === pulse.total_pupils ? 'green' : 'purple'}
                />
                <StatCard
                  icon={pulse.avg_accuracy_this_week !== null && pulse.avg_accuracy_this_week < 60 ? TrendingDown : BookOpen}
                  value={pulse.avg_accuracy_this_week !== null ? `${pulse.avg_accuracy_this_week}%` : null}
                  label="Avg accuracy this week"
                  sub={pulse.avg_accuracy_this_week === null ? 'No quizzes yet' : undefined}
                  accent={
                    pulse.avg_accuracy_this_week === null ? 'purple' :
                    pulse.avg_accuracy_this_week >= 70 ? 'green' :
                    pulse.avg_accuracy_this_week >= 50 ? 'amber' : 'red'
                  }
                />
                <StatCard
                  icon={AlertCircle}
                  value={pulse.overdue_assignments}
                  label="Overdue assignments"
                  sub={pulse.overdue_assignments === 0 ? 'All up to date' : 'Need chasing'}
                  accent={pulse.overdue_assignments > 0 ? 'red' : 'green'}
                />
                <StatCard
                  icon={TrendingDown}
                  value={pulse.weakest_topic ? topicLabel(pulse.weakest_topic.topic_key) : null}
                  label="Group weak spot"
                  sub={pulse.weakest_topic
                    ? `${pulse.weakest_topic.pupil_count} pupils · ${pulse.weakest_topic.accuracy}% avg`
                    : 'Not enough data yet'}
                  accent="amber"
                />
              </div>
            </div>
          )}

          {/* Pupil list */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-heading font-bold text-slate-800">
                Pupils <span className="text-slate-400 font-normal text-sm">({roster.length})</span>
              </h2>
              <button
                type="button"
                onClick={() => setShowComposer(true)}
                className="flex items-center gap-1.5 text-sm font-medium text-[#7C3AED] hover:bg-[#F8F7FF] px-3 py-1.5 rounded-xl transition-colors"
              >
                <Plus className="w-4 h-4" />
                Assign
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {roster.map(pupil => (
                <button
                  key={pupil.id}
                  type="button"
                  onClick={() => setActivePupil(pupil)}
                  className={`w-full text-left transition-colors border-b border-slate-100 last:border-b-0
                    ${activePupil?.id === pupil.id && isSplit
                      ? 'bg-[#F8F7FF] border-l-[3px] border-l-[#7C3AED]'
                      : 'hover:bg-slate-50'}`}
                >
                  <PupilRow pupil={pupil} onClick={() => {}} />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 mt-2 px-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <div className="w-2 h-2 rounded-full bg-amber-400" /> Inactive 7+ days
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <div className="w-2 h-2 rounded-full bg-green-400" /> Active today
              </div>
            </div>
          </div>

          {/* Classes */}
          {classes.length > 0 && (
            <div className="mb-4">
              <h2 className="font-heading font-bold text-slate-800 mb-3">
                Classes <span className="text-slate-400 font-normal text-sm">({classes.length})</span>
              </h2>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100">
                {classes.map(cls => (
                  <div key={cls.id} className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium text-slate-800 text-sm">{cls.name}</p>
                      <p className="text-xs text-slate-400">{cls.enrolment_count || 0} pupils</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </>
  );

  // ── Split layout (iPad landscape / desktop) ───────────────────────────────
  if (isSplit) {
    return (
      <div className="flex h-screen bg-[#FAF9FF]">

        {/* Left panel — roster */}
        <div className="w-72 xl:w-80 flex-shrink-0 flex flex-col border-r border-slate-200 bg-white h-full overflow-hidden">

          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100 flex-shrink-0">
            <div className="flex items-center gap-3">
              <button type="button" onClick={onBack} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h1 className="font-heading font-bold text-slate-800 text-base leading-tight">Tutor Dashboard</h1>
                {tutor && roster.length > 0 && (
                  <button type="button" onClick={copyInvite}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-[#7C3AED] transition-colors mt-0.5">
                    {copiedInvite ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                    {copiedInvite ? 'Copied!' : `join/${tutor.tutor_code}`}
                  </button>
                )}
              </div>
            </div>
            <button type="button" onClick={() => setShowMessaging(true)}
              className="p-2 text-slate-400 hover:text-[#7C3AED] hover:bg-[#F8F7FF] rounded-xl transition-colors">
              <MessageCircle className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable panel content */}
          <div className="flex-1 overflow-y-auto p-4">
            {dashboardBody}
          </div>
        </div>

        {/* Right panel — detail */}
        <div className="flex-1 overflow-y-auto bg-[#FAF9FF]">
          {activePupil ? (
            <PupilDetailScreen
              key={activePupil.id}
              childId={activePupil.id}
              getToken={getToken}
              panelMode
              onBack={() => setActivePupil(null)}
              onViewQuizDetail={onViewQuizDetail}
              onViewAssignmentDetail={onViewAssignmentDetail}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-[#F8F7FF] border border-[#E8E5FF] flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-[#7C3AED]" />
              </div>
              <h2 className="font-heading font-bold text-slate-800 text-lg mb-2">Select a pupil</h2>
              <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
                Tap any pupil from the list on the left to see their progress, recent activity, and assignments.
              </p>
            </div>
          )}
        </div>

        {/* Messaging overlay (full-screen on top) */}
        {showMessaging && (
          <div className="fixed inset-0 z-50 bg-[#FAF9FF]">
            <TutorMessagingScreen getToken={getToken} onBack={() => setShowMessaging(false)} />
          </div>
        )}

        {/* Assignment composer modal */}
        {showComposer && (
          <AssignmentComposer
            roster={roster}
            classes={classes}
            getToken={getToken}
            onCreated={() => { setShowComposer(false); loadDashboard(); }}
            onClose={() => setShowComposer(false)}
          />
        )}
      </div>
    );
  }

  // ── Single-column layout (portrait / mobile) ──────────────────────────────
  return (
    <div className="app-bg min-h-screen">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-4 pt-5">
          <div className="flex items-center gap-3">
            <button type="button" onClick={onBack} className="text-slate-400 hover:text-slate-700">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-heading font-bold text-slate-800 text-lg leading-tight">Tutor Dashboard</h1>
              {tutor && roster.length > 0 && (
                <button type="button" onClick={copyInvite}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-[#7C3AED] transition-colors mt-0.5">
                  {copiedInvite ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                  {copiedInvite ? 'Link copied!' : `prepstep.co.uk/join/${tutor.tutor_code}`}
                </button>
              )}
            </div>
          </div>
          <button type="button" onClick={() => setShowMessaging(true)}
            className="p-2 text-slate-500 hover:text-[#7C3AED] hover:bg-[#F8F7FF] rounded-xl transition-colors">
            <MessageCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 pb-8">
          {dashboardBody}
        </div>

        {/* Assignment composer modal */}
        {showComposer && (
          <AssignmentComposer
            roster={roster}
            classes={classes}
            getToken={getToken}
            onCreated={() => { setShowComposer(false); loadDashboard(); }}
            onClose={() => setShowComposer(false)}
          />
        )}
      </div>
    </div>
  );
}
