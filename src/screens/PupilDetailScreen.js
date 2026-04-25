import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, StickyNote, Plus, Edit2, Trash2, X, CheckCircle, AlertCircle, Clock, BookOpen, FileText, MessageCircle } from 'lucide-react';
import { motion } from '../components/Motion';
import ReportScreen from './ReportScreen';
import MessageThread from '../components/MessageThread';

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

// ── Notes panel ──
function NotesPanel({ childId, getToken }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiFetch(`/api/tutor/notes/${childId}`, getToken)
      .then(d => { setNotes(d.notes || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [childId, getToken]);

  const handleAdd = async () => {
    if (!draft.trim()) return;
    setSaving(true);
    try {
      const data = await apiFetch(`/api/tutor/notes/${childId}`, getToken, {
        method: 'POST', body: JSON.stringify({ note: draft }),
      });
      setNotes(prev => [data.note, ...prev]);
      setDraft('');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (noteId) => {
    if (!editDraft.trim()) return;
    setSaving(true);
    try {
      const data = await apiFetch(`/api/tutor/notes/note/${noteId}`, getToken, {
        method: 'PATCH', body: JSON.stringify({ note: editDraft }),
      });
      setNotes(prev => prev.map(n => n.id === noteId ? data.note : n));
      setEditingId(null);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (noteId) => {
    await apiFetch(`/api/tutor/notes/note/${noteId}`, getToken, { method: 'DELETE' });
    setNotes(prev => prev.filter(n => n.id !== noteId));
  };

  return (
    <div>
      <div className="mb-3">
        <textarea
          className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] resize-none"
          rows={3}
          placeholder="Add a private note about this pupil…"
          value={draft}
          onChange={e => setDraft(e.target.value)}
        />
        <button
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
          <div key={note.id} className="bg-amber-50 border border-amber-200 rounded-xl p-3">
            {editingId === note.id ? (
              <div>
                <textarea
                  className="w-full border border-amber-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none bg-white"
                  rows={3}
                  value={editDraft}
                  onChange={e => setEditDraft(e.target.value)}
                />
                <div className="flex gap-2 mt-1">
                  <button onClick={() => handleUpdate(note.id)} disabled={saving} className="px-3 py-1 text-xs bg-amber-500 text-white font-bold rounded-lg">Save</button>
                  <button onClick={() => setEditingId(null)} className="px-3 py-1 text-xs text-slate-600 border border-gray-200 rounded-lg">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <p className="text-sm text-slate-700 flex-1 whitespace-pre-wrap">{note.note}</p>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => { setEditingId(note.id); setEditDraft(note.note); }} className="p-1 text-slate-400 hover:text-amber-600">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(note.id)} className="p-1 text-slate-400 hover:text-red-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
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

// ── Topic mastery mini-bar ──
function MasteryBar({ score }) {
  const pct = Math.round((score || 0) * 100);
  const color = pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-400';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-slate-500 w-8 text-right">{pct}%</span>
    </div>
  );
}

// ── Assignment status badge ──
function RecipientBadge({ status }) {
  const map = {
    assigned: { icon: Clock, color: 'text-blue-500', label: 'Assigned' },
    in_progress: { icon: Clock, color: 'text-yellow-500', label: 'In progress' },
    completed: { icon: CheckCircle, color: 'text-green-500', label: 'Done' },
    late: { icon: AlertCircle, color: 'text-red-500', label: 'Late' },
    cleared: { icon: CheckCircle, color: 'text-slate-400', label: 'Cleared' },
  };
  const s = map[status] || { icon: Clock, color: 'text-slate-400', label: status };
  const Icon = s.icon;
  return (
    <span className={`flex items-center gap-1 text-xs font-medium ${s.color}`}>
      <Icon className="w-3.5 h-3.5" />
      {s.label}
    </span>
  );
}

export default function PupilDetailScreen({ childId, getToken, onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview'); // overview | quizzes | assignments | notes | messages
  const [showReport, setShowReport] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      const d = await apiFetch(`/api/tutor/pupils/${childId}`, getToken);
      setData(d);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [childId, getToken]);

  useEffect(() => { load(); }, [load]);

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
        <div className="bg-white rounded-2xl p-6 text-center max-w-sm">
          <p className="text-red-500 font-medium mb-4">{error || 'Could not load pupil data'}</p>
          <button onClick={onBack} className="px-6 py-2 bg-[#7C3AED] text-white font-bold rounded-xl">Back</button>
        </div>
      </div>
    );
  }

  const { child, quizResults, topicPerformance, assignmentRecipients, notesCount } = data;

  // Subject-level stats from quiz results
  const subjectStats = quizResults.reduce((acc, r) => {
    if (!acc[r.subject]) acc[r.subject] = { total: 0, correct: 0, quizzes: 0 };
    acc[r.subject].quizzes++;
    acc[r.subject].total += r.total;
    acc[r.subject].correct += r.score;
    return acc;
  }, {});

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'quizzes', label: `Quizzes (${quizResults.length})` },
    { key: 'assignments', label: `Homework (${assignmentRecipients.length})` },
    { key: 'notes', label: `Notes (${notesCount})` },
    { key: 'messages', label: 'Messages' },
  ];

  const handleOpenMessages = async () => {
    if (conversationId) { setTab('messages'); return; }
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.REACT_APP_TUTOR_API_URL}/api/tutor/conversations/${childId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      const d = await res.json();
      if (res.ok) { setConversationId(d.conversation.id); setTab('messages'); }
    } catch (_) {}
  };

  return (
    <div className="app-bg min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-2 rounded-xl hover:bg-white transition-colors text-slate-600">
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
              onClick={() => setShowReport(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#A29BFE] text-[#7C3AED] text-xs font-bold rounded-xl hover:bg-[#F8F7FF] transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              Report
            </button>
            <div className="w-10 h-10 rounded-full bg-[#7C3AED] text-white font-bold flex items-center justify-center">
              {child.display_name[0]}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-5 gap-1 mb-4 bg-white rounded-xl p-1 shadow-sm border border-gray-200">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => t.key === 'messages' ? handleOpenMessages() : setTab(t.key)}
              className={`py-2 text-xs font-bold rounded-lg transition-colors ${tab === t.key ? 'bg-[#7C3AED] text-white' : 'text-slate-600 hover:text-slate-800'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview tab */}
        {tab === 'overview' && (
          <div className="flex flex-col gap-4">
            {/* Subject stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
              <h2 className="text-sm font-bold text-slate-700 mb-3">Performance by subject</h2>
              {Object.entries(subjectStats).length === 0 && (
                <p className="text-sm text-slate-400">No quiz data yet.</p>
              )}
              {Object.entries(subjectStats).map(([subject, stats]) => (
                <div key={subject} className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-700 capitalize">{subject}</span>
                    <span className="text-xs text-slate-500">{stats.quizzes} quizzes · {Math.round((stats.correct / stats.total) * 100)}% avg</span>
                  </div>
                  <MasteryBar score={stats.correct / stats.total} />
                </div>
              ))}
            </div>

            {/* Weakest topics */}
            {topicPerformance.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                <h2 className="text-sm font-bold text-slate-700 mb-3">Weakest topics</h2>
                {topicPerformance
                  .filter(t => t.data?.score != null)
                  .sort((a, b) => (a.data.score || 0) - (b.data.score || 0))
                  .slice(0, 5)
                  .map(t => (
                    <div key={t.topicKey} className="mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-600 capitalize">{t.topicKey.replace(/([A-Z])/g, ' $1').trim()}</span>
                      </div>
                      <MasteryBar score={t.data?.score || 0} />
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Quiz history tab */}
        {tab === 'quizzes' && (
          <div className="flex flex-col gap-2">
            {quizResults.length === 0 && <p className="text-sm text-slate-400 text-center py-8">No quizzes completed yet.</p>}
            {quizResults.map((r, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-200"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 capitalize">
                    {r.topic_key?.replace(/([A-Z])/g, ' $1').trim() || r.topic_key}
                    <span className="text-slate-400 font-normal"> · {r.subject}</span>
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
                  }`}>
                    {r.total > 0 ? `${Math.round((r.score / r.total) * 100)}%` : '—'}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Assignments tab */}
        {tab === 'assignments' && (
          <div className="flex flex-col gap-2">
            {assignmentRecipients.length === 0 && <p className="text-sm text-slate-400 text-center py-8">No homework assigned yet.</p>}
            {assignmentRecipients.map((r, i) => (
              <div key={r.id} className="flex items-start gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-200">
                <BookOpen className="w-4 h-4 text-[#7C3AED] mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">
                    {r.assignment_title || 'Assignment'}
                    <span className="text-slate-400 font-normal"> · {r.item_type}</span>
                  </p>
                  <p className="text-xs text-slate-500 capitalize">{r.item_ref}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Due {new Date(r.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    {r.completed_at && ` · Completed ${new Date(normaliseDate(r.completed_at)).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`}
                    {r.score != null && ` · ${r.score}%`}
                  </p>
                </div>
                <RecipientBadge status={r.status} />
              </div>
            ))}
          </div>
        )}

        {/* Notes tab */}
        {tab === 'notes' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-4">
              <StickyNote className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-bold text-slate-700">Private notes</h2>
              <span className="text-xs text-slate-400 ml-auto">Only visible to you</span>
            </div>
            <NotesPanel childId={childId} getToken={getToken} />
          </div>
        )}

        {/* Messages tab */}
        {tab === 'messages' && conversationId && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden" style={{ height: 420 }}>
            <MessageThread
              messagesPath={`/api/tutor/conversations/${conversationId}/messages`}
              myRole="tutor"
              getToken={getToken}
              label={`${child.display_name}'s parent`}
            />
          </div>
        )}
        {tab === 'messages' && !conversationId && (
          <div className="text-center py-8 text-slate-400">Opening conversation…</div>
        )}
      </div>

      {showReport && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <ReportScreen
            childId={childId}
            getToken={getToken}
            onBack={() => setShowReport(false)}
          />
        </div>
      )}
    </div>
  );
}
