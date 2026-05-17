import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ArrowLeft, StickyNote, Edit2, Trash2, MessageCircle, BookOpen, CheckCircle, AlertCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from '../components/Motion';
import useMastery from '../hooks/useMastery';
import ExamReadinessCard from '../components/progress/ExamReadinessCard';
import TopicHeatMap from '../components/progress/TopicHeatMap';
import FocusAreas from '../components/progress/FocusAreas';
import MockTestHistory from '../components/progress/MockTestHistory';
import PracticeCalendar from '../components/progress/PracticeCalendar';
import SpeedTracking from '../components/progress/SpeedTracking';
import SpeedAccuracyQuadrant from '../components/progress/SpeedAccuracyQuadrant';
import ReportScreen from './ReportScreen';
import MessageThread from '../components/MessageThread';
import { formatTopicKey } from '../utils/topicLabels';

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

function normaliseDate(d) {
  if (!d) return null;
  return d.includes('T') ? d : d.replace(' ', 'T') + 'Z';
}

// ── Private notes panel ──
function NotesPanel({ childId, getToken }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!getToken) { setLoading(false); return; }
    apiFetch(`/api/tutor/notes/${childId}`, getToken)
      .then(d => { setNotes(d.notes || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [childId, getToken]);

  const handleAdd = async () => {
    if (!draft.trim() || !getToken) return;
    setSaving(true);
    try {
      const data = await apiFetch(`/api/tutor/notes/${childId}`, getToken, {
        method: 'POST', body: JSON.stringify({ note: draft }),
      });
      setNotes(prev => [data.note, ...prev]);
      setDraft('');
    } finally { setSaving(false); }
  };

  const handleUpdate = async (noteId) => {
    if (!editDraft.trim() || !getToken) return;
    setSaving(true);
    try {
      const data = await apiFetch(`/api/tutor/notes/note/${noteId}`, getToken, {
        method: 'PATCH', body: JSON.stringify({ note: editDraft }),
      });
      setNotes(prev => prev.map(n => n.id === noteId ? data.note : n));
      setEditingId(null);
    } finally { setSaving(false); }
  };

  const handleDelete = async (noteId) => {
    if (!getToken) return;
    await apiFetch(`/api/tutor/notes/note/${noteId}`, getToken, { method: 'DELETE' });
    setNotes(prev => prev.filter(n => n.id !== noteId));
  };

  return (
    <div>
      <div className="mb-3">
        <textarea
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] resize-none"
          rows={3}
          placeholder="Add a private note about this pupil…"
          value={draft}
          onChange={e => setDraft(e.target.value)}
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={saving || !draft.trim()}
          className="mt-1 px-4 py-1.5 bg-[#7C3AED] text-white text-xs font-bold rounded-lg disabled:opacity-50 hover:bg-[#6D28D9] transition-colors"
        >
          {saving ? 'Saving…' : 'Add note'}
        </button>
      </div>
      {loading && <p className="text-xs text-slate-400">Loading…</p>}
      <div className="flex flex-col gap-2">
        {notes.map(note => (
          <div key={note.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            {editingId === note.id ? (
              <div>
                <textarea
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] resize-none"
                  rows={3}
                  value={editDraft}
                  onChange={e => setEditDraft(e.target.value)}
                />
                <div className="flex gap-2 mt-1">
                  <button type="button" onClick={() => handleUpdate(note.id)} disabled={saving}
                    className="px-3 py-1 text-xs bg-[#7C3AED] text-white font-bold rounded-lg">Save</button>
                  <button type="button" onClick={() => setEditingId(null)}
                    className="px-3 py-1 text-xs text-slate-600 border border-gray-200 rounded-lg">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <p className="text-sm text-slate-700 flex-1 whitespace-pre-wrap">{note.note}</p>
                <div className="flex gap-1 flex-shrink-0">
                  <button type="button" onClick={() => { setEditingId(note.id); setEditDraft(note.note); }}
                    className="p-1 text-slate-400 hover:text-[#7C3AED]"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button type="button" onClick={() => handleDelete(note.id)}
                    className="p-1 text-slate-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            )}
            <p className="text-xs text-slate-400 mt-1">
              {new Date(normaliseDate(note.updated_at)).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        ))}
        {!loading && notes.length === 0 && (
          <p className="text-xs text-slate-400 italic">No notes yet. Notes are private to you.</p>
        )}
      </div>
    </div>
  );
}

// ── Collapsible section wrapper ──
function Section({ title, count, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-4 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
      >
        <span className="font-heading font-bold text-slate-800 text-sm">
          {title}{count !== undefined && <span className="text-slate-400 font-normal ml-1">({count})</span>}
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

// ── Assignment status badge ──
function StatusBadge({ status }) {
  const map = {
    assigned:    { icon: Clock,         color: 'text-blue-500',   label: 'Assigned' },
    in_progress: { icon: Clock,         color: 'text-yellow-500', label: 'In progress' },
    completed:   { icon: CheckCircle,   color: 'text-green-500',  label: 'Done' },
    late:        { icon: AlertCircle,   color: 'text-red-500',    label: 'Late' },
    cleared:     { icon: CheckCircle,   color: 'text-slate-400',  label: 'Cleared' },
  };
  const s = map[status] || { icon: Clock, color: 'text-slate-400', label: status };
  const Icon = s.icon;
  return (
    <span className={`flex items-center gap-1 text-xs font-medium ${s.color}`}>
      <Icon className="w-3.5 h-3.5" />{s.label}
    </span>
  );
}

// ── Mock data for dev preview ──
const DEV_MOCK = {
  child: { id: 'c1', display_name: 'Evie', account_name: 'Sarah Mitchell', year_group: 5, target_school: 'Bournemouth School for Girls' },
  quizResults: [
    { topic_key: 'fractions', subject: 'maths', score: 5, total: 10, completed_at: new Date(Date.now() - 86400000).toISOString() },
    { topic_key: 'longdivision', subject: 'maths', score: 4, total: 10, completed_at: new Date(Date.now() - 2 * 86400000).toISOString() },
    { topic_key: 'comprehension', subject: 'english', score: 8, total: 10, completed_at: new Date(Date.now() - 3 * 86400000).toISOString() },
    { topic_key: 'sequences', subject: 'maths', score: 3, total: 10, completed_at: new Date(Date.now() - 4 * 86400000).toISOString() },
  ],
  questionResults: [
    ...Array.from({ length: 30 }, (_, i) => ({ date: new Date(Date.now() - i * 86400000).toISOString(), topicKey: 'fractions', subject: 'maths', correct: i % 3 !== 0, timeSpentMs: 8000 })),
    ...Array.from({ length: 25 }, (_, i) => ({ date: new Date(Date.now() - i * 86400000).toISOString(), topicKey: 'longdivision', subject: 'maths', correct: i % 2 !== 0, timeSpentMs: 12000 })),
    ...Array.from({ length: 20 }, (_, i) => ({ date: new Date(Date.now() - i * 86400000).toISOString(), topicKey: 'sequences', subject: 'maths', correct: i % 4 !== 0, timeSpentMs: 9000 })),
    ...Array.from({ length: 20 }, (_, i) => ({ date: new Date(Date.now() - i * 86400000).toISOString(), topicKey: 'comprehension', subject: 'english', correct: i % 5 < 4, timeSpentMs: 15000 })),
    ...Array.from({ length: 15 }, (_, i) => ({ date: new Date(Date.now() - i * 86400000).toISOString(), topicKey: 'synonyms', subject: 'verbalreasoning', correct: i % 3 < 2, timeSpentMs: 7000 })),
  ],
  mockTestHistory: [],
  assignmentRecipients: [
    { id: 'a1', assignment_title: 'Week 3 practice', item_type: 'topic', item_ref: 'fractions', due_date: '2026-05-10', status: 'completed', completed_at: new Date(Date.now() - 2 * 86400000).toISOString(), score: 52 },
    { id: 'a2', assignment_title: 'Mock test', item_type: 'mock', item_ref: 'maths', due_date: '2026-05-17', status: 'assigned', completed_at: null, score: null },
  ],
  notesCount: 1,
};

export default function PupilDetailScreen({ childId, getToken, onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [error, setError] = useState(null);

  const IS_PREVIEW = process.env.NODE_ENV === 'development'
    && new URLSearchParams(window.location.search).get('preview') === 'tutorDashboard';

  const load = useCallback(async () => {
    if (IS_PREVIEW || !getToken) {
      setData(DEV_MOCK);
      setLoading(false);
      return;
    }
    try {
      const d = await apiFetch(`/api/tutor/pupils/${childId}`, getToken);
      setData(d);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [childId, getToken, IS_PREVIEW]);

  useEffect(() => { load(); }, [load]);

  // Compute mastery from the pupil's question results (same hook ParentDashboard uses)
  const mastery = useMastery(
    data?.questionResults || [],
    [],
    data?.mockTestHistory || []
  );

  // Derive practice days + per-day question counts from question results
  const { practiceDays, practiceLog } = useMemo(() => {
    const byDate = {};
    (data?.questionResults || []).forEach(r => {
      const date = r.date?.split('T')[0];
      if (!date) return;
      byDate[date] = (byDate[date] || 0) + 1;
    });
    return {
      practiceDays: Object.keys(byDate),
      practiceLog: Object.entries(byDate).map(([date, count]) => ({ date, questionsAttempted: count })),
    };
  }, [data?.questionResults]);

  const handleOpenMessages = async () => {
    if (conversationId) { setShowMessages(true); return; }
    if (!getToken) { setConversationId('preview'); setShowMessages(true); return; }
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/tutor/conversations/${childId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      const d = await res.json();
      if (res.ok) { setConversationId(d.conversation.id); setShowMessages(true); }
    } catch (_) {}
  };

  if (loading) {
    return (
      <div className="min-h-screen app-bg flex items-center justify-center">
        <div className="animate-pulse text-[#7C3AED] font-heading font-bold text-xl">Loading…</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen app-bg flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 text-center max-w-sm shadow-sm border border-slate-100">
          <p className="text-red-500 font-medium mb-4">{error || 'Could not load pupil data'}</p>
          <button type="button" onClick={onBack}
            className="px-6 py-2 bg-[#7C3AED] text-white font-bold rounded-xl">Back</button>
        </div>
      </div>
    );
  }

  const { child, quizResults, assignmentRecipients } = data;

  // Messages full-screen
  if (showMessages && conversationId) {
    return (
      <div className="app-bg min-h-screen">
        <div className="flex items-center gap-3 p-4">
          <button type="button" onClick={() => setShowMessages(false)}
            className="p-2 rounded-xl hover:bg-white transition-colors text-slate-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-heading font-bold text-slate-800">{child.display_name}'s parent</h1>
        </div>
        <div className="mx-4 bg-white rounded-2xl border border-slate-100 overflow-hidden" style={{ height: 'calc(100vh - 80px)' }}>
          <MessageThread
            messagesPath={`/api/tutor/conversations/${conversationId}/messages`}
            myRole="tutor"
            getToken={getToken}
            label={`${child.display_name}'s parent`}
          />
        </div>
      </div>
    );
  }

  // Report full-screen overlay
  if (showReport) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <ReportScreen childId={childId} getToken={getToken} onBack={() => setShowReport(false)} />
      </div>
    );
  }

  return (
    <div className="app-bg min-h-screen pb-8">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 p-4 pt-5">
          <button type="button" onClick={onBack}
            className="p-2 rounded-xl hover:bg-white transition-colors text-slate-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-heading font-bold text-xl text-slate-800">{child.display_name}</h1>
            <p className="text-xs text-slate-500">
              {child.account_name}
              {child.year_group ? ` · Year ${child.year_group}` : ''}
              {child.target_school ? ` · ${child.target_school}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => handleOpenMessages()}
              className="p-2 text-slate-500 hover:text-[#7C3AED] hover:bg-[#F8F7FF] rounded-xl transition-colors"
              title="Message parent"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setShowReport(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#A29BFE] text-[#7C3AED] text-xs font-bold rounded-xl hover:bg-[#F8F7FF] transition-colors"
            >
              Report
            </button>
            <div className="w-9 h-9 rounded-full bg-[#7C3AED] text-white font-bold flex items-center justify-center text-sm flex-shrink-0">
              {child.display_name[0]}
            </div>
          </div>
        </div>

        {/* Progress — uses the same shared components as ParentDashboard */}
        <motion.div
          className="px-4"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        >
          <ExamReadinessCard mastery={mastery} />
          <TopicHeatMap mastery={mastery} onTopicClick={() => {}} />
          <FocusAreas mastery={mastery} onTopicClick={() => {}} pupilName={child.display_name} />
          {data.mockTestHistory?.length > 0 && (
            <MockTestHistory mockTestHistory={data.mockTestHistory} />
          )}

          <PracticeCalendar practiceDays={practiceDays} practiceLog={practiceLog} />
          <SpeedTracking questionResults={data?.questionResults || []} />
          <SpeedAccuracyQuadrant questionResults={data?.questionResults || []} />

          {/* Recent quizzes */}
          {quizResults.length > 0 && (
            <Section title="Recent quizzes" count={quizResults.length} defaultOpen={false}>
              <div className="flex flex-col gap-2">
                {quizResults.slice(0, 20).map((r, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-b-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 capitalize">
                        {formatTopicKey(r.topic_key)}
                        <span className="text-slate-400 font-normal text-xs"> · {r.subject}</span>
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(normaliseDate(r.completed_at)).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-slate-800">{r.score}/{r.total}</p>
                      <p className={`text-xs font-medium ${
                        r.total > 0 && r.score / r.total >= 0.8 ? 'text-green-600' :
                        r.total > 0 && r.score / r.total >= 0.5 ? 'text-yellow-600' : 'text-red-500'
                      }`}>{r.total > 0 ? `${Math.round((r.score / r.total) * 100)}%` : '—'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Assignments */}
          <Section title="Homework" count={assignmentRecipients.length} defaultOpen={assignmentRecipients.length > 0}>
            {assignmentRecipients.length === 0
              ? <p className="text-sm text-slate-400 py-2">No homework assigned yet.</p>
              : assignmentRecipients.map(r => (
                <div key={r.id} className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-b-0">
                  <BookOpen className="w-4 h-4 text-[#7C3AED] mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">
                      {r.assignment_title || 'Assignment'}
                      <span className="text-slate-400 font-normal text-xs"> · {r.item_ref}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Due {new Date(r.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      {r.score != null && ` · ${r.score}%`}
                    </p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              ))
            }
          </Section>

          {/* Private notes */}
          <Section title="Private notes" defaultOpen={false}>
            <p className="text-xs text-slate-400 mb-3">Only visible to you.</p>
            <NotesPanel childId={childId} getToken={getToken} />
          </Section>
        </motion.div>
      </div>
    </div>
  );
}
