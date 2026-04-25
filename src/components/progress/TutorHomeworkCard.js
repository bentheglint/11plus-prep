import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, Clock, AlertCircle, ChevronRight, GraduationCap } from 'lucide-react';
import { motion } from '../Motion';

const API_URL = process.env.REACT_APP_TUTOR_API_URL;

async function fetchAssignments(childId, getToken) {
  const token = await getToken();
  const res = await fetch(`${API_URL}/api/pupil/assignments?child_id=${childId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json();
}

function statusIcon(status) {
  if (status === 'completed') return <CheckCircle className="w-4 h-4 text-green-500" />;
  if (status === 'late') return <AlertCircle className="w-4 h-4 text-red-500" />;
  return <Clock className="w-4 h-4 text-slate-400" />;
}

// Group recipient rows by assignment
function groupByAssignment(recipients) {
  const map = new Map();
  for (const r of recipients) {
    const key = r.assignment_id;
    if (!map.has(key)) {
      map.set(key, {
        assignmentId: key,
        title: r.assignment_title,
        dueDate: r.due_date,
        tutorName: r.tutor_name,
        items: [],
      });
    }
    map.get(key).items.push(r);
  }
  // Sort: most imminent due date first
  return [...map.values()].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
}

export default function TutorHomeworkCard({ activeChildId, getToken }) {
  const [assignments, setAssignments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!activeChildId || !getToken) { setLoading(false); return; }
    fetchAssignments(activeChildId, getToken)
      .then(d => { setAssignments(d?.recipients || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [activeChildId, getToken]);

  // Don't render if no tutor has assigned anything yet
  if (loading || !assignments || assignments.length === 0) return null;

  const grouped = groupByAssignment(assignments);
  const active = grouped.filter(a => {
    const allDone = a.items.every(i => i.status === 'completed' || i.status === 'cleared');
    return !allDone;
  });

  if (active.length === 0) return null;

  const current = active[0]; // most imminent
  const done = current.items.filter(i => i.status === 'completed').length;
  const total = current.items.length;
  const isPast = new Date(current.dueDate) < new Date();
  const anyLate = current.items.some(i => i.status === 'late');
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <motion.div
      className="mb-4 rounded-2xl overflow-hidden shadow-md border border-[#A29BFE]/30"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 22 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#7C3AED] to-[#5A4BD1] px-4 py-3 flex items-center gap-2">
        <GraduationCap className="w-4 h-4 text-white/80 flex-shrink-0" />
        <p className="text-white text-sm font-bold flex-1 truncate">
          Homework from {current.tutorName}
        </p>
        {anyLate && (
          <span className="text-xs bg-red-400/90 text-white font-bold px-2 py-0.5 rounded-full">Late</span>
        )}
      </div>

      {/* Body */}
      <div className="bg-white px-4 py-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <p className="font-bold text-slate-800 text-sm">
              {current.title || 'This week\'s homework'}
            </p>
            <p className="text-xs text-slate-500">
              Due {new Date(current.dueDate).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
              {isPast && !anyLate && <span className="text-amber-500 ml-1">· overdue</span>}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-lg font-bold text-[#7C3AED]">{done}/{total}</p>
            <p className="text-xs text-slate-400">done</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-3">
          <div
            className={`h-full rounded-full transition-all ${pct === 100 ? 'bg-green-500' : anyLate ? 'bg-red-400' : 'bg-[#7C3AED]'}`}
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Items (collapsed by default) */}
        <button
          onClick={() => setExpanded(v => !v)}
          className="flex items-center gap-1 text-xs text-[#7C3AED] font-medium hover:underline"
        >
          {expanded ? 'Hide items' : 'See all items'}
          <ChevronRight className={`w-3 h-3 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </button>

        {expanded && (
          <div className="mt-2 flex flex-col gap-1.5">
            {current.items.map(item => (
              <div key={item.id} className="flex items-center gap-2 px-3 py-2 bg-[#F8F7FF] rounded-lg">
                {statusIcon(item.status)}
                <span className="text-xs text-slate-700 flex-1 capitalize">
                  {item.item_type} · <span className="font-medium">{item.item_ref}</span>
                </span>
              </div>
            ))}
          </div>
        )}

        {active.length > 1 && (
          <p className="text-xs text-slate-400 mt-2">
            + {active.length - 1} more assignment{active.length > 2 ? 's' : ''}
          </p>
        )}
      </div>
    </motion.div>
  );
}
