import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Plus, Users, BookOpen, Trash2, X, ChevronRight, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { motion } from '../components/Motion';
import PupilDetailScreen from './PupilDetailScreen';

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

// ── Status badge ──
function StatusBadge({ status }) {
  const map = {
    assigned: { label: 'Assigned', color: 'bg-blue-100 text-blue-700' },
    in_progress: { label: 'In progress', color: 'bg-yellow-100 text-yellow-700' },
    completed: { label: 'Done', color: 'bg-green-100 text-green-700' },
    late: { label: 'Late', color: 'bg-red-100 text-red-600' },
    cleared: { label: 'Cleared', color: 'bg-slate-100 text-slate-500' },
  };
  const s = map[status] || { label: status, color: 'bg-gray-100 text-gray-500' };
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.color}`}>{s.label}</span>;
}

// ── Assignment detail modal ──
function AssignmentDetail({ assignment, onClose, onClearLate, getToken }) {
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    apiFetch(`/api/tutor/assignments/${assignment.id}`, getToken)
      .then(d => setDetail(d))
      .catch(() => {});
  }, [assignment.id, getToken]);

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div>
            <h2 className="font-heading font-bold text-base text-slate-800">{assignment.title || 'Assignment'}</h2>
            <p className="text-xs text-slate-500">Due {new Date(assignment.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-4">
          {!detail && <p className="text-sm text-slate-400 text-center py-8">Loading…</p>}
          {detail && (
            <>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Items</p>
              <div className="flex flex-col gap-1.5 mb-4">
                {detail.items.map(item => (
                  <div key={item.id} className="flex items-center gap-2 px-3 py-2 bg-[#F8F7FF] rounded-lg text-sm text-slate-700">
                    <BookOpen className="w-4 h-4 text-[#7C3AED] flex-shrink-0" />
                    <span className="capitalize">{item.item_type}</span>
                    <span className="text-slate-400 mx-1">·</span>
                    <span className="font-medium">{item.item_ref}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                Pupils ({detail.recipients.length / (detail.items.length || 1)} pupils)
              </p>
              <div className="flex flex-col gap-2">
                {Object.entries(
                  detail.recipients.reduce((acc, r) => {
                    if (!acc[r.child_id]) acc[r.child_id] = { name: r.child_name, items: [] };
                    acc[r.child_id].items.push(r);
                    return acc;
                  }, {})
                ).map(([childId, { name, items }]) => {
                  const allDone = items.every(i => i.status === 'completed');
                  const anyLate = items.some(i => i.status === 'late');
                  const doneCount = items.filter(i => i.status === 'completed').length;
                  return (
                    <div key={childId} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#7C3AED] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{name[0]}</span>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{name}</p>
                          <p className="text-xs text-slate-400">{doneCount}/{items.length} done</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={allDone ? 'completed' : anyLate ? 'late' : items[0]?.status} />
                        {anyLate && (
                          <button
                            onClick={() => onClearLate(assignment.id, childId)}
                            className="text-xs text-[#7C3AED] hover:underline"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Create assignment modal ──
const ITEM_TYPES = [
  { value: 'topic', label: 'Topic practice' },
  { value: 'mock', label: 'Mock test' },
  { value: 'lesson', label: 'Micro-lesson' },
];

function AssignmentComposer({ roster, classes, getToken, onCreated, onClose }) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [targetType, setTargetType] = useState('class'); // 'class' | 'child'
  const [targetId, setTargetId] = useState('');
  const [items, setItems] = useState([{ itemType: 'topic', itemRef: '' }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const addItem = () => setItems(prev => [...prev, { itemType: 'topic', itemRef: '' }]);
  const removeItem = (i) => setItems(prev => prev.filter((_, idx) => idx !== i));
  const updateItem = (i, field, value) => setItems(prev => prev.map((it, idx) => idx === i ? { ...it, [field]: value } : it));

  const handleSend = async () => {
    if (!dueDate) { setError('Please set a due date'); return; }
    if (!targetId) { setError('Please select a target class or pupil'); return; }
    if (items.some(it => !it.itemRef.trim())) { setError('All items need a topic/ref'); return; }
    setSaving(true);
    setError(null);
    try {
      const body = {
        title: title.trim() || null,
        dueDate,
        items: items.map(it => ({ itemType: it.itemType, itemRef: it.itemRef.trim() })),
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
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Title (optional)</label>
            <input className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              placeholder="e.g. Week of 5 May" value={title} onChange={e => setTitle(e.target.value)} />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Due date</label>
            <input type="date" className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              value={dueDate} onChange={e => setDueDate(e.target.value)} />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Assign to</label>
            <div className="flex gap-2 mb-2">
              {['class', 'child'].map(t => (
                <button key={t} onClick={() => { setTargetType(t); setTargetId(''); }}
                  className={`flex-1 py-1.5 text-sm rounded-lg border transition-colors ${targetType === t ? 'border-[#7C3AED] bg-[#F8F7FF] text-[#7C3AED] font-medium' : 'border-gray-200 text-slate-600'}`}>
                  {t === 'class' ? 'Class' : 'Individual pupil'}
                </button>
              ))}
            </div>
            <select className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
              value={targetId} onChange={e => setTargetId(e.target.value)}>
              <option value="">Select…</option>
              {targetOptions.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-2">Items</label>
            <div className="flex flex-col gap-2">
              {items.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <select className="border border-gray-300 rounded-xl px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                    value={item.itemType} onChange={e => updateItem(i, 'itemType', e.target.value)}>
                    {ITEM_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                  <input className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                    placeholder={item.itemType === 'topic' ? 'e.g. fractions' : item.itemType === 'mock' ? 'e.g. maths' : 'lesson id'}
                    value={item.itemRef} onChange={e => updateItem(i, 'itemRef', e.target.value)} />
                  {items.length > 1 && (
                    <button onClick={() => removeItem(i)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  )}
                </div>
              ))}
            </div>
            <button onClick={addItem} className="mt-2 text-xs text-[#7C3AED] hover:underline flex items-center gap-1">
              <Plus className="w-3 h-3" /> Add item
            </button>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button onClick={handleSend} disabled={saving}
            className="w-full py-3 bg-[#7C3AED] text-white font-bold rounded-xl hover:bg-[#6D28D9] disabled:opacity-50 transition-colors">
            {saving ? 'Sending…' : 'Send assignment'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main dashboard ──
export default function TutorDashboardScreen({ getToken, onBack }) {
  const [tutor, setTutor] = useState(null);
  const [roster, setRoster] = useState([]);
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [tab, setTab] = useState('pupils'); // pupils | classes | assignments
  const [loading, setLoading] = useState(true);
  const [showAssignComposer, setShowAssignComposer] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedPupilId, setSelectedPupilId] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      const [tutorData, rosterData, classData, assignData] = await Promise.all([
        apiFetch('/api/tutor', getToken),
        apiFetch('/api/tutor/roster', getToken),
        apiFetch('/api/tutor/classes', getToken),
        apiFetch('/api/tutor/assignments', getToken),
      ]);
      setTutor(tutorData.tutor);
      setRoster(rosterData.pupils || []);
      setClasses(classData.classes || []);
      setAssignments(assignData.assignments || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => { load(); }, [load]);

  const handleClearLate = async (assignmentId, childId) => {
    try {
      await apiFetch(`/api/tutor/assignments/${assignmentId}/clear-late/${childId}`, getToken, { method: 'POST' });
      setSelectedAssignment(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateClass = async () => {
    const name = window.prompt('Class name (e.g. "Year 5 Wednesday 6pm")');
    if (!name?.trim()) return;
    try {
      const data = await apiFetch('/api/tutor/classes', getToken, {
        method: 'POST', body: JSON.stringify({ name }),
      });
      setClasses(prev => [...prev, data.class]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteClass = async (classId) => {
    if (!window.confirm('Delete this class? Pupils stay on your roster.')) return;
    try {
      await apiFetch(`/api/tutor/classes/${classId}`, getToken, { method: 'DELETE' });
      setClasses(prev => prev.filter(c => c.id !== classId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!window.confirm('Delete this assignment? This cannot be undone.')) return;
    try {
      await apiFetch(`/api/tutor/assignments/${assignmentId}`, getToken, { method: 'DELETE' });
      setAssignments(prev => prev.filter(a => a.id !== assignmentId));
    } catch (err) {
      setError(err.message);
    }
  };

  const tabs = [
    { key: 'pupils', label: `Pupils (${roster.length})` },
    { key: 'classes', label: `Classes (${classes.length})` },
    { key: 'assignments', label: `Assignments (${assignments.length})` },
  ];

  return (
    <div className="app-bg min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-2 rounded-xl hover:bg-white transition-colors text-slate-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-heading font-bold text-xl text-slate-800">Tutor Dashboard</h1>
            <p className="text-xs text-slate-500 truncate">
              Invite link: prepstep.co.uk/join/{tutor?.tutor_code}
            </p>
          </div>
          {tab === 'assignments' && (
            <button
              onClick={() => setShowAssignComposer(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#7C3AED] text-white text-sm font-bold rounded-xl hover:bg-[#6D28D9] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Assign
            </button>
          )}
          {tab === 'classes' && (
            <button
              onClick={handleCreateClass}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#7C3AED] text-white text-sm font-bold rounded-xl hover:bg-[#6D28D9] transition-colors"
            >
              <Plus className="w-4 h-4" />
              New class
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 bg-white rounded-xl p-1 shadow-sm border border-gray-200">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${tab === t.key ? 'bg-[#7C3AED] text-white' : 'text-slate-600 hover:text-slate-800'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center justify-between">
            {error}
            <button onClick={() => setError(null)}><X className="w-4 h-4" /></button>
          </div>
        )}

        {loading && <p className="text-center text-slate-400 py-12">Loading…</p>}

        {/* Pupils tab */}
        {!loading && tab === 'pupils' && (
          <div className="flex flex-col gap-3">
            {roster.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="font-medium">No pupils yet</p>
                <p className="text-sm mt-1">Share your invite link to add pupils to your roster.</p>
              </div>
            )}
            {roster.map(pupil => (
              <motion.button
                key={pupil.id}
                onClick={() => setSelectedPupilId(pupil.id)}
                className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-200 w-full text-left hover:border-[#A29BFE] transition-colors"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="w-9 h-9 rounded-full bg-[#7C3AED] text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {pupil.display_name[0]}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800">{pupil.display_name}</p>
                  <p className="text-xs text-slate-400">
                    {pupil.account_name} · {pupil.year_group ? `Year ${pupil.year_group}` : 'Year group not set'}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
              </motion.button>
            ))}
          </div>
        )}

        {/* Classes tab */}
        {!loading && tab === 'classes' && (
          <div className="flex flex-col gap-3">
            {classes.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="font-medium">No classes yet</p>
                <p className="text-sm mt-1">Create a class to group pupils (e.g. "Year 5 Wednesday 6pm").</p>
              </div>
            )}
            {classes.map(cls => (
              <div key={cls.id} className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="w-9 h-9 rounded-full bg-[#F8F7FF] border border-[#A29BFE] flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-[#7C3AED]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800">{cls.name}</p>
                  <p className="text-xs text-slate-400">{cls.pupil_count} pupils{cls.schedule_note ? ` · ${cls.schedule_note}` : ''}</p>
                </div>
                <button onClick={() => handleDeleteClass(cls.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Assignments tab */}
        {!loading && tab === 'assignments' && (
          <div className="flex flex-col gap-3">
            {assignments.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="font-medium">No assignments yet</p>
                <p className="text-sm mt-1">Create an assignment to set homework for a class or individual pupil.</p>
              </div>
            )}
            {assignments.map(a => {
              const isPast = new Date(a.due_date) < new Date();
              const completedPct = a.total_recipients > 0
                ? Math.round((a.completed_count / a.total_recipients) * 100)
                : 0;
              return (
                <button
                  key={a.id}
                  onClick={() => setSelectedAssignment(a)}
                  className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-200 text-left hover:border-[#A29BFE] transition-colors w-full"
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${isPast && completedPct < 100 ? 'bg-red-100' : 'bg-green-100'}`}>
                    {isPast && completedPct < 100
                      ? <AlertCircle className="w-5 h-5 text-red-500" />
                      : <CheckCircle className="w-5 h-5 text-green-500" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 truncate">{a.title || 'Assignment'}</p>
                    <p className="text-xs text-slate-400">
                      Due {new Date(a.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      {' · '}{a.item_count} items · {completedPct}% done
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {showAssignComposer && (
        <AssignmentComposer
          roster={roster}
          classes={classes}
          getToken={getToken}
          onCreated={(a) => { setAssignments(prev => [a, ...prev]); setShowAssignComposer(false); load(); }}
          onClose={() => setShowAssignComposer(false)}
        />
      )}

      {selectedAssignment && (
        <AssignmentDetail
          assignment={selectedAssignment}
          getToken={getToken}
          onClose={() => setSelectedAssignment(null)}
          onClearLate={handleClearLate}
        />
      )}

      {selectedPupilId && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <PupilDetailScreen
            childId={selectedPupilId}
            getToken={getToken}
            onBack={() => setSelectedPupilId(null)}
          />
        </div>
      )}
    </div>
  );
}
