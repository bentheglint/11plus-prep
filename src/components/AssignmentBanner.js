import React, { useState, useEffect } from 'react';
import { GraduationCap, ChevronRight } from 'lucide-react';
import { motion } from './Motion';
import { quizSubjectForTopic } from '../utils/topicSubjects';

const API_URL = process.env.REACT_APP_TUTOR_API_URL;

// Pick the most urgent incomplete topic assignment. Subject missing on the
// row (legacy rows predate the server setting it) is derived from the topic
// key rather than hiding the assignment — Evie's first homework sat invisible
// on the homepage for three weeks because of a NULL subject (11 Jun 2026).
// Exported for testing.
export function selectActiveAssignment(recipients) {
  return (recipients || [])
    .filter(r => r.item_type === 'topic' && !['completed', 'cleared', 'cancelled'].includes(r.status))
    .map(r => ({ ...r, subject: r.subject || quizSubjectForTopic(r.item_ref) }))
    .filter(r => r.subject) // unknown topic AND no stored subject — can't start a quiz
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))[0] || null;
}

async function fetchAssignments(childId, getToken) {
  const token = await getToken();
  const res = await fetch(`${API_URL}/api/pupil/assignments?child_id=${childId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json();
}

async function markStarted(recipientId, getToken) {
  const token = await getToken();
  await fetch(`${API_URL}/api/pupil/assignments/${recipientId}/start`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
}

// Returns urgency level based on days until/since due date
function getUrgency(dueDateStr) {
  const now = new Date();
  const due = new Date(dueDateStr);
  const daysUntil = (due - now) / (1000 * 60 * 60 * 24);
  if (daysUntil < 0) return 'overdue';
  if (daysUntil <= 2) return 'urgent';
  return 'normal';
}

const URGENCY_STYLES = {
  normal: {
    card: 'bg-gradient-to-br from-[#7C3AED] to-[#5A4BD1]',
    glow: '0 0 24px 4px rgba(124,58,237,0.35)',
    badge: null,
  },
  urgent: {
    card: 'bg-gradient-to-br from-amber-500 to-orange-500',
    glow: '0 0 28px 6px rgba(245,158,11,0.45)',
    badge: 'Due soon',
  },
  overdue: {
    card: 'bg-gradient-to-br from-red-500 to-rose-600',
    glow: '0 0 32px 8px rgba(239,68,68,0.55)',
    badge: 'Overdue',
  },
};

const SUBJECT_LABELS = {
  maths: 'Maths',
  english: 'English',
  verbalreasoning: 'Verbal Reasoning',
};

export default function AssignmentBanner({ activeChildId, getToken, onStart }) {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeChildId || !getToken) { setLoading(false); return; }
    fetchAssignments(activeChildId, getToken)
      .then(data => {
        setItem(selectActiveAssignment(data?.recipients));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [activeChildId, getToken]);

  if (loading || !item) return null;

  const urgency = getUrgency(item.due_date);
  const styles = URGENCY_STYLES[urgency];
  const dueLabel = new Date(item.due_date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  const subjectLabel = SUBJECT_LABELS[item.subject] || item.subject;

  const handleTap = async () => {
    // Mark in_progress (fire-and-forget — don't block the navigation)
    if (item.status === 'assigned') {
      markStarted(item.id, getToken).catch(() => {});
    }
    onStart(item.subject, item.item_ref, item.id);
  };

  return (
    <motion.button
      onClick={handleTap}
      className={`w-full ${styles.card} rounded-2xl p-4 text-left relative overflow-hidden mb-4`}
      style={{ boxShadow: styles.glow }}
      initial={{ opacity: 0, y: -8 }}
      animate={urgency === 'overdue'
        ? { opacity: 1, y: 0, boxShadow: [styles.glow, '0 0 48px 12px rgba(239,68,68,0.7)', styles.glow] }
        : { opacity: 1, y: 0 }
      }
      transition={urgency === 'overdue'
        ? { opacity: { duration: 0.3 }, boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }
        : { type: 'spring', stiffness: 220, damping: 22 }
      }
      whileTap={{ scale: 0.98 }}
    >
      {/* Decorative orb */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10 blur-2xl pointer-events-none" />

      <div className="flex items-center gap-3 relative">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-white/80 text-xs font-medium">
              Assignment from {item.tutor_name}
            </p>
            {styles.badge && (
              <span className="text-xs bg-white/25 text-white font-bold px-2 py-0.5 rounded-full">
                {styles.badge}
              </span>
            )}
          </div>
          <p className="text-white font-bold text-sm leading-snug">
            {item.assignment_title || `Practise ${subjectLabel}`}
          </p>
          <p className="text-white/70 text-xs mt-0.5">
            {subjectLabel} · {item.item_ref} · Due {dueLabel}
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-white/60 flex-shrink-0" />
      </div>
    </motion.button>
  );
}
