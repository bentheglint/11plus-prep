import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft, Users, BookOpen, Clock, AlertCircle, CheckCircle2,
  ChevronRight, ChevronDown, ChevronUp, Copy, Check, Plus, X, Trash2, MessageCircle,
  TrendingDown, Activity, Calendar, Eye, Mail, MailPlus, RefreshCw, Link2,
} from 'lucide-react';
import { motion } from '../components/Motion';
import PupilDetailScreen from './PupilDetailScreen';
import { TutorMessagingScreen } from './MessagingScreen';
import TutorPulseDetail from './TutorPulseDetail';
import { SUBJECT_TOPICS, topicLabel } from '../utils/topicCatalogue';
import { buildDashboardData } from '../utils/tutorPulse';

const API_URL = process.env.REACT_APP_TUTOR_API_URL;

async function apiFetch(path, getToken, options = {}) {
  const token = await getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...options.headers },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // Attach the parsed body + status so callers that need the machine
    // detail (e.g. AssignmentComposer reading .code/.skipped off a 422) can
    // get at it. The message itself is unchanged, so every existing caller
    // that only reads err.message is unaffected.
    const err = new Error(data.error || `Error ${res.status}`);
    err.data = data;
    err.status = res.status;
    throw err;
  }
  return data;
}

// Subject + topic picker data lives in utils/topicCatalogue (shared with
// TutorPulseDetail).

// ── Pulse stat card ──
function StatCard({ icon: Icon, value, label, sub, accent, onClick, active }) {
  const accentMap = {
    purple: 'bg-[#F8F7FF] text-[#7C3AED]',
    green:  'bg-[#F0FDF4] text-[#16A34A]',
    amber:  'bg-amber-50   text-amber-600',
    red:    'bg-red-50     text-red-600',
  };
  const iconBg = accentMap[accent] || accentMap.purple;

  const borderClass = active
    ? 'border-[#7C3AED]'
    : onClick
    ? 'border-slate-100 hover:border-slate-200 hover:shadow-md'
    : 'border-slate-100';

  const inner = (
    <>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-2xl font-bold text-slate-800 leading-none mb-0.5 truncate">{value ?? '—'}</div>
        <div className="text-xs font-medium text-slate-600">{label}</div>
        {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
      </div>
      {onClick && <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0 self-center" />}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className={`bg-white rounded-2xl p-4 flex items-start gap-3 text-left shadow-sm border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-1 ${borderClass}`}
      >
        {inner}
      </button>
    );
  }

  return (
    <div className={`bg-white rounded-2xl p-4 flex items-start gap-3 shadow-sm border ${borderClass}`}>
      {inner}
    </div>
  );
}

// ── Pupil row ──
function PupilRow({ pupil, onClick, isActive }) {
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
      className={`w-full flex items-center gap-3 p-4 text-left transition-colors border-b border-slate-100 last:border-b-0 ${
        isActive
          ? 'bg-[#F8F7FF] border-l-[3px] border-l-[#7C3AED]'
          : atRisk
          ? 'bg-amber-50/40 hover:bg-amber-50/60'
          : 'hover:bg-slate-50'
      }`}
    >
      {/* At-risk indicator */}
      <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-0.5 ${
        atRisk ? 'bg-amber-400' :
        inactive === 0 ? 'bg-green-400' :
        'bg-slate-200'
      }`} />

      <div className="flex-1 min-w-0">
        {/* Name line — status badge sits here (right-aligned) so it never
            squeezes the activity/weak-topic line below it. */}
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-semibold text-slate-800 text-sm truncate">{pupil.display_name}</span>
          {pupil.year_group && (
            <span className="text-xs text-slate-400 flex-shrink-0">Y{pupil.year_group}</span>
          )}
          {pupil.deepProgressLocked && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 flex-shrink-0">
              Free plan
            </span>
          )}
          <span className={`ml-auto flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${statusColor}`}>
            {statusLabel}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 min-w-0 overflow-hidden">
          <span className={`flex-shrink-0 ${atRisk ? 'text-amber-600 font-medium' : ''}`}>{lastActiveLabel}</span>
          {pupil.weakest_topic && (
            <>
              <span className="text-slate-300 flex-shrink-0">·</span>
              <span className="flex items-center gap-1 min-w-0">
                <TrendingDown className="w-3 h-3 text-slate-400 flex-shrink-0" />
                <span className="truncate">{topicLabel(pupil.weakest_topic)}{pupil.weakest_accuracy !== null ? ` (${pupil.weakest_accuracy}%)` : ''}</span>
              </span>
            </>
          )}
        </div>
      </div>

      <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
    </button>
  );
}

// ── Status chip label + colour mappings ──
const INVITE_STATUS_MAP = {
  needs_review: { label: 'Awaiting approval', colour: 'bg-amber-100 text-amber-800' },
  pending:      { label: 'Queued',             colour: 'bg-slate-100 text-slate-600' },
  sent:         { label: 'Invited',            colour: 'bg-blue-100 text-blue-700' },
  send_failed:  { label: 'Email failed',       colour: 'bg-red-100 text-red-700' },
  joined:       { label: 'Joined',             colour: 'bg-green-100 text-green-700' },
  revoked:      { label: 'Revoked',            colour: 'bg-slate-100 text-slate-500' },
  expired:      { label: 'Expired',            colour: 'bg-slate-100 text-slate-500' },
};

const LIVE_STATUSES = new Set(['needs_review', 'pending', 'sent', 'send_failed']);

// Binned = revoked/expired. Deleting one of these is permanent ("empty the
// bin"); 'joined' is roster history and is never deletable from this panel.
const BINNED_STATUSES = new Set(['revoked', 'expired']);

// ── Invites panel ──
function InvitesPanel({ getToken, onBulkInvite }) {
  const [invites, setInvites] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [actionBusy, setActionBusy] = useState(null); // invite id being actioned

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/tutor/invites', getToken);
      setInvites(data.invites || []);
    } catch {
      setInvites([]);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  // Load lazily when panel opens
  useEffect(() => {
    if (open && invites === null) load();
  }, [open, invites, load]);

  const doResend = async (id) => {
    setActionBusy(id);
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.REACT_APP_TUTOR_API_URL}/api/tutor/invites/${id}/resend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 429) {
        alert('You can resend tomorrow — the 24-hour cooldown hasn\'t passed yet.'); // eslint-disable-line no-alert
        return;
      }
      if (!res.ok) {
        alert(data.error || 'Couldn\'t resend. Please try again.'); // eslint-disable-line no-alert
        return;
      }
      await load();
    } finally {
      setActionBusy(null);
    }
  };

  const doCopyLink = async (id) => {
    setActionBusy(id);
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.REACT_APP_TUTOR_API_URL}/api/tutor/invites/${id}/link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || 'Couldn\'t get the link. Please try again.'); // eslint-disable-line no-alert
        return;
      }
      // The link is returned exactly once (the server wipes its copy after this
      // call), so a failed clipboard write must surface the link, never claim success.
      const copiedOk = await navigator.clipboard.writeText(data.link).then(() => true).catch(() => false);
      if (copiedOk) {
        alert('Link copied! Note: this replaces the emailed link — share it only with the parent.'); // eslint-disable-line no-alert
      } else {
        window.prompt('Copy this link by hand (it replaces the emailed one):', data.link); // eslint-disable-line no-alert
      }
      await load();
    } finally {
      setActionBusy(null);
    }
  };

  // One action, two meanings (bin semantics): removing a live invite revokes
  // it; removing a revoked/expired one deletes it permanently.
  const doRemove = async (invite) => {
    const isBinned = BINNED_STATUSES.has(invite.status);
    const message = isBinned
      ? `Delete the invitation for ${invite.child_name} (${invite.parent_email}) permanently?`
      : `Revoke the invitation for ${invite.child_name} (${invite.parent_email})?`;
    if (!window.confirm(message)) return; // eslint-disable-line no-alert
    setActionBusy(invite.id);
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.REACT_APP_TUTOR_API_URL}/api/tutor/invites/${invite.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Couldn\'t remove the invitation. Please try again.'); // eslint-disable-line no-alert
        return;
      }
      await load();
    } finally {
      setActionBusy(null);
    }
  };

  const doEmptyBin = async (count) => {
    if (!window.confirm(`Delete all ${count} revoked and expired invitations permanently?`)) return; // eslint-disable-line no-alert
    setActionBusy('bin');
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.REACT_APP_TUTOR_API_URL}/api/tutor/invites/bin`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Couldn\'t empty the bin. Please try again.'); // eslint-disable-line no-alert
        return;
      }
      await load();
    } finally {
      setActionBusy(null);
    }
  };

  // Pre-load invite count to decide whether to show the panel toggle
  const [hasAny, setHasAny] = useState(false);
  useEffect(() => {
    if (!getToken) return;
    apiFetch('/api/tutor/invites', getToken)
      .then(d => { if ((d.invites || []).length > 0) { setHasAny(true); setInvites(d.invites); } })
      .catch(() => {});
  }, [getToken]);

  if (!hasAny && !onBulkInvite) return null;

  const needsReviewInvites = invites?.filter(i => i.status === 'needs_review') || [];

  return (
    <div className="mt-4">
      {/* Invite pupils button */}
      {onBulkInvite && (
        <button
          type="button"
          onClick={onBulkInvite}
          className="w-full flex items-center gap-3 mb-3 p-3.5 bg-white rounded-2xl border border-[#A29BFE] hover:border-[#7C3AED] hover:bg-[#F8F7FF] transition-colors text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-[#F0EDFF] flex items-center justify-center flex-shrink-0">
            <MailPlus className="w-5 h-5 text-[#7C3AED]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-slate-800 text-sm">Invite pupils by email</p>
            <p className="text-xs text-slate-500">Send personalised invite links directly to parents.</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
        </button>
      )}

      {/* Collapsible invites panel — only shown when there are invites */}
      {hasAny && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          <button
            type="button"
            onClick={() => setOpen(v => !v)}
            className="w-full flex items-center justify-between p-4 text-left"
            aria-expanded={open}
          >
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-slate-800 text-sm">Invitations</span>
              {invites && (
                <span className="text-xs text-slate-400">({invites.length})</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!open && (
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); load(); }}
                  className="p-1 text-slate-400 hover:text-[#7C3AED] rounded"
                  aria-label="Refresh invitations"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                </button>
              )}
              {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>
          </button>

          {open && (
            <div className="border-t border-slate-100">
              {loading && (
                <div className="p-4 text-center">
                  <RefreshCw className="w-4 h-4 text-slate-400 animate-spin mx-auto" />
                </div>
              )}

              {!loading && invites && invites.length === 0 && (
                <p className="p-4 text-sm text-slate-400 text-center">No invitations yet.</p>
              )}

              {!loading && needsReviewInvites.length > 0 && (
                <div className="px-4 pt-3 pb-1">
                  <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2 border border-amber-100">
                    Batches over 20 pupils are checked by PrepStep before sending — usually within 24 hours.
                  </p>
                </div>
              )}

              {!loading && invites && invites.filter(i => BINNED_STATUSES.has(i.status)).length > 0 && (
                <div className="px-4 pt-3 pb-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => doEmptyBin(invites.filter(i => BINNED_STATUSES.has(i.status)).length)}
                    disabled={actionBusy === 'bin'}
                    className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Empty bin ({invites.filter(i => BINNED_STATUSES.has(i.status)).length})
                  </button>
                </div>
              )}

              {!loading && invites && invites.map(invite => {
                const { label, colour } = INVITE_STATUS_MAP[invite.status] || { label: invite.status, colour: 'bg-slate-100 text-slate-600' };
                const isLive = LIVE_STATUSES.has(invite.status);
                const isBinned = BINNED_STATUSES.has(invite.status);
                const canLink = ['pending', 'sent', 'send_failed'].includes(invite.status);
                const canResend = invite.status === 'send_failed' || invite.status === 'sent';
                const busy = actionBusy === invite.id;

                return (
                  <div key={invite.id} className="flex items-start gap-3 p-4 border-t border-slate-50">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="font-medium text-slate-800 text-sm">{invite.child_name}</span>
                        <span
                          className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${colour}`}
                          role="status"
                        >
                          {label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">{invite.parent_email}</p>
                      {invite.claimed_by_email && invite.claimed_by_email !== invite.parent_email && (
                        <p className="text-xs text-amber-700 mt-0.5">
                          Joined with a different email: {invite.claimed_by_email}
                        </p>
                      )}
                    </div>

                    {/* Row actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {canLink && (
                        <button
                          type="button"
                          onClick={() => doCopyLink(invite.id)}
                          disabled={busy}
                          className="p-1.5 text-slate-400 hover:text-[#7C3AED] rounded-lg transition-colors"
                          title="Copy invite link"
                          aria-label="Copy invite link"
                        >
                          <Link2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {canResend && (
                        <button
                          type="button"
                          onClick={() => doResend(invite.id)}
                          disabled={busy}
                          className="p-1.5 text-slate-400 hover:text-[#7C3AED] rounded-lg transition-colors"
                          title="Resend invitation"
                          aria-label="Resend invitation"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {(isLive || isBinned) && (
                        <button
                          type="button"
                          onClick={() => doRemove(invite)}
                          disabled={busy}
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                          title={isBinned ? 'Delete permanently' : 'Revoke invitation'}
                          aria-label={isBinned ? 'Delete permanently' : 'Revoke invitation'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Empty state ──
function EmptyState({ tutor, getToken, onViewMessages, onBulkInvite }) {
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

      {/* Bulk invite entry point — primary action in empty state */}
      {onBulkInvite && (
        <button
          type="button"
          onClick={onBulkInvite}
          className="w-full max-w-sm flex items-center gap-3 mb-4 p-3.5 bg-[#7C3AED] text-white rounded-2xl hover:bg-[#6D28D9] transition-colors text-left"
        >
          <MailPlus className="w-5 h-5 flex-shrink-0" />
          <div className="min-w-0">
            <p className="font-bold text-sm">Invite pupils by email</p>
            <p className="text-white/80 text-xs">Send personalised links directly to parents</p>
          </div>
          <ChevronRight className="w-4 h-4 flex-shrink-0 ml-auto" />
        </button>
      )}

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
function AssignmentComposer({ roster, classes, getToken, onCreated, onClose, initialItems, initialTitle }) {
  const [title, setTitle] = useState(initialTitle || '');
  const [dueDate, setDueDate] = useState('');
  const [targetType, setTargetType] = useState('class');
  const [targetId, setTargetId] = useState('');
  const [items, setItems] = useState(initialItems?.length ? initialItems : [{ itemType: 'topic', subject: 'maths', topicKey: '' }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  // Free pupils dropped from a mixed-class assignment (server-side skip).
  // Non-null keeps the modal open with a summary banner instead of closing
  // it, since a tutor sending to a class needs to see who was left out.
  const [skippedInfo, setSkippedInfo] = useState(null);

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
    if (!getToken) {
      // Dev preview only (getToken is always present for a real tutor).
      // Simulate the two server responses so the demo can show both the
      // mixed-class skip banner and the individual-pupil confirmation,
      // without ever calling the API.
      if (targetType === 'class') {
        setSkippedInfo([{ childId: 'c5', childName: 'Amara', pupilPlan: 'free' }]);
      } else {
        setError('Preview mode: assignment not actually sent.');
      }
      return;
    }
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
      if (data.skipped && data.skipped.length) {
        // Some recipients were free-plan pupils dropped server-side. Refresh
        // the roster/list in the background but keep the modal open so the
        // tutor can see who was skipped, rather than closing straight away.
        onCreated(data.assignment);
        setSkippedInfo(data.skipped);
        setSaving(false);
      } else {
        onCreated(data.assignment);
        onClose();
      }
    } catch (err) {
      const code = err.data?.code;
      if (code === 'no_eligible_recipients') {
        setError("Everyone you selected is on the free plan. Upgrade them to PrepStep Plus to assign Focused Learning homework.");
      } else if (code === 'empty_target') {
        setError('That class has no pupils to assign to yet.');
      } else {
        setError(err.message);
      }
      setSaving(false);
    }
  };

  const targetOptions = targetType === 'class'
    ? classes.map(c => ({ id: c.id, label: c.name, disabled: false }))
    : roster.map(p => ({
        id: p.id,
        label: p.deepProgressLocked ? `${p.display_name} · Free plan` : p.display_name,
        disabled: !!p.deepProgressLocked,
      }));

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
              {targetOptions.map(o => <option key={o.id} value={o.id} disabled={o.disabled}>{o.label}</option>)}
            </select>
            {targetType === 'child' && (
              <p className="text-xs text-slate-400 mt-1.5">
                Pupils on the free plan can't be set Focused Learning homework. Upgrade them to PrepStep Plus to assign work.
              </p>
            )}
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

          {skippedInfo && (
            <div className="p-3 rounded-lg bg-amber-50 text-amber-700 text-sm">
              {skippedInfo.length} pupil{skippedInfo.length !== 1 ? 's' : ''} on the free plan {skippedInfo.length !== 1 ? 'were' : 'was'} skipped: {skippedInfo.map(s => s.childName).join(', ')}. Upgrade them to PrepStep Plus to include them.
            </div>
          )}

          {skippedInfo ? (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-xl font-bold text-white text-sm bg-[#7C3AED] hover:bg-[#5A4BD1] transition-colors"
            >
              Done
            </button>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}

// Split (master-detail) layout: roster on the left, pupil detail on the right.
// Kicks in at 1024px so iPad portrait (incl. 12.9" Pro at 1024px) keeps the
// two-panel view; phones and small tablets fall back to single-column.
const SPLIT_BREAKPOINT = 1024;

// ── Main dashboard ──
export default function TutorDashboardScreen({ getToken, onBack, onViewQuizDetail, onViewAssignmentDetail, onPreview, onBulkInvite }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // One occupant for the detail pane — a pupil OR a pulse-card detail, never
  // both. A single value makes the conflicting state unrepresentable.
  // null | { type: 'pupil', pupil } | { type: 'card', key: 'activity'|'accuracy'|'overdue'|'weakspot' }
  const [activePane, setActivePane] = useState(null);
  const [showComposer, setShowComposer] = useState(false);
  const [composerPrefill, setComposerPrefill] = useState(null); // { initialItems, initialTitle } | null
  const [isSplit, setIsSplit] = useState(() => typeof window !== 'undefined' && window.innerWidth >= SPLIT_BREAKPOINT);
  const [showMessaging, setShowMessaging] = useState(false);
  const [messagingChild, setMessagingChild] = useState(null); // { id, name, parentName } | null
  const [classes, setClasses] = useState([]);
  const [copiedInvite, setCopiedInvite] = useState(false);

  const activePupil = activePane?.type === 'pupil' ? activePane.pupil : null;
  const activeCardKey = activePane?.type === 'card' ? activePane.key : null;

  const openMessaging = (child = null) => {
    setMessagingChild(child);
    setShowMessaging(true);
  };
  const closeMessaging = () => {
    setShowMessaging(false);
    setMessagingChild(null);
  };
  const openComposerForTopic = ({ subject, topicKey, title }) => {
    setComposerPrefill({ initialItems: [{ itemType: 'topic', subject, topicKey }], initialTitle: title });
    setShowComposer(true);
  };
  const closeComposer = () => {
    setShowComposer(false);
    setComposerPrefill(null);
  };

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
      // The mock supplies RAW rows and derives roster + pulse through the same
      // buildDashboardData the Worker uses, so the preview cannot drift from
      // the real payload shape.
      const now = Date.now();
      const day = 86400000;
      // Amara (c5) is a free-plan pupil so the demo shows the Unit C locked
      // tutor states (Free plan chip, locked pupil detail, locked report,
      // composer skip). Dev preview only.
      const mock = buildDashboardData({
        roster: [
          { id: 'c1', display_name: 'Evie', year_group: 5, target_school: 'Bournemouth School for Girls', parent_name: 'Sarah' },
          { id: 'c2', display_name: 'James', year_group: 5, target_school: 'Parkstone Grammar', parent_name: 'Mark' },
          { id: 'c3', display_name: 'Priya', year_group: 5, target_school: 'Poole Grammar', parent_name: 'Anita' },
          { id: 'c4', display_name: 'Tom', year_group: 5, target_school: 'Bournemouth School', parent_name: 'Claire' },
          { id: 'c5', display_name: 'Amara', year_group: 5, target_school: 'Talbot Heath', parent_name: 'Deepa' },
        ],
        quizActiveRows: [
          { child_id: 'c1', last_active: new Date(now).toISOString() },
          { child_id: 'c2', last_active: new Date(now - 3 * day).toISOString() },
          { child_id: 'c3', last_active: new Date(now - 9 * day).toISOString() },
          { child_id: 'c4', last_active: new Date(now - 1 * day).toISOString() },
          { child_id: 'c5', last_active: new Date(now - 2 * day).toISOString() },
        ],
        mockActiveRows: [],
        lessonActiveRows: [],
        weeklyRows: [
          { child_id: 'c1', quiz_count: 5, accuracy: 0.78 },
          { child_id: 'c2', quiz_count: 2, accuracy: 0.61 },
          { child_id: 'c4', quiz_count: 3, accuracy: 0.82 },
        ],
        // Ordered accuracy ASC per child, matching the Worker query
        topicRows: [
          { child_id: 'c1', topic_key: 'longdivision', subject: 'maths', accuracy: 0.52, quiz_count: 3 },
          { child_id: 'c1', topic_key: 'fractions', subject: 'maths', accuracy: 0.55, quiz_count: 2 },
          { child_id: 'c2', topic_key: 'fractions', subject: 'maths', accuracy: 0.44, quiz_count: 2 },
          { child_id: 'c3', topic_key: 'sequences', subject: 'maths', accuracy: 0.38, quiz_count: 2 },
          { child_id: 'c3', topic_key: 'fractions', subject: 'maths', accuracy: 0.45, quiz_count: 2 },
          { child_id: 'c4', topic_key: 'anglesshapes', subject: 'maths', accuracy: 0.65, quiz_count: 4 },
        ],
        overdueRows: [
          { child_id: 'c2', assignment_id: 'a1', title: 'Week 2 fractions', due_date: new Date(now - 3 * day).toISOString().slice(0, 10) },
        ],
        now,
        // c5 (Amara) deliberately excluded — this is what makes buildDashboardData
        // set deepProgressLocked:true for her, driving the "Free plan" chip on her
        // roster row and disabling her in the assignment composer's pupil picker.
        entitledDeepChildIds: new Set(['c1', 'c2', 'c3', 'c4']),
      });
      setData({
        tutor: { id: 'dev', name: 'Mary Jones', tutor_code: 'MARY-XZ7Q', bio: '11+ GL specialist, Bournemouth.' },
        ...mock,
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
    const handler = () => setIsSplit(window.innerWidth >= SPLIT_BREAKPOINT);
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

  // Portrait/mobile: full-screen navigation
  if (!isSplit && showMessaging) {
    return <TutorMessagingScreen getToken={getToken} onBack={closeMessaging} initialChild={messagingChild} />;
  }

  if (!isSplit && activePupil) {
    return (
      <PupilDetailScreen
        childId={activePupil.id}
        getToken={getToken}
        onBack={() => { setActivePane(null); loadDashboard(); }}
        onViewQuizDetail={onViewQuizDetail}
        onViewAssignmentDetail={onViewAssignmentDetail}
      />
    );
  }

  if (!isSplit && activeCardKey) {
    return (
      <>
        <TutorPulseDetail
          detailKey={activeCardKey}
          pulse={data?.pulse}
          roster={data?.roster || []}
          panelMode={false}
          onBack={() => setActivePane(null)}
          onOpenPupil={(pupil) => setActivePane({ type: 'pupil', pupil })}
          onViewAssignmentDetail={onViewAssignmentDetail}
          onMessageChild={openMessaging}
          onAssignTopic={openComposerForTopic}
        />
        {showComposer && (
          <AssignmentComposer
            key={composerPrefill?.initialItems?.[0]?.topicKey || 'blank'}
            roster={data?.roster || []}
            classes={classes}
            getToken={getToken}
            initialItems={composerPrefill?.initialItems}
            initialTitle={composerPrefill?.initialTitle}
            // AssignmentComposer now closes itself on a clean send (so it can
            // stay open instead when pupils were skipped for being on the
            // free plan) — onCreated here only needs to refresh the roster.
            onCreated={() => { loadDashboard(); }}
            onClose={closeComposer}
          />
        )}
      </>
    );
  }

  const { tutor, roster = [], pulse } = data || {};

  // ── Shared dashboard body (used in both layouts) ──────────────────────────
  const dashboardBody = (
    <>
      {/* Preview the pupil experience — lets a tutor wander the full quiz/lesson
          flow sandboxed (nothing saved) so they can evaluate and demo it. */}
      {!loading && onPreview && (
        <button
          type="button"
          onClick={onPreview}
          className="w-full flex items-center gap-3 mb-4 p-3.5 bg-white rounded-2xl border border-[#A29BFE] hover:border-[#7C3AED] hover:bg-[#F8F7FF] transition-colors text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-[#F0EDFF] flex items-center justify-center flex-shrink-0">
            <Eye className="w-5 h-5 text-[#7C3AED]" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-800 text-sm">Preview the pupil experience</p>
            <p className="text-xs text-slate-500">See exactly what your pupils see — nothing is saved.</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 ml-auto flex-shrink-0" />
        </button>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3 animate-pulse">
          <div className={`grid gap-3 ${isSplit ? 'grid-cols-1' : 'grid-cols-2'}`}>
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
        <EmptyState tutor={tutor} getToken={getToken} onViewMessages={() => setShowMessaging(true)} onBulkInvite={onBulkInvite} />
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
              <div className={`grid gap-3 ${isSplit ? 'grid-cols-1' : 'grid-cols-2'}`}>
                <StatCard
                  icon={Activity}
                  value={`${pulse.active_this_week}/${pulse.total_pupils}`}
                  label="Active this week"
                  sub={pulse.active_this_week < pulse.total_pupils
                    ? `${pulse.total_pupils - pulse.active_this_week} haven't practised`
                    : 'Everyone active'}
                  accent={pulse.active_this_week === pulse.total_pupils ? 'green' : 'purple'}
                  onClick={() => setActivePane({ type: 'card', key: 'activity' })}
                  active={activeCardKey === 'activity'}
                />
                <StatCard
                  icon={pulse.avg_accuracy_this_week !== null && pulse.avg_accuracy_this_week < 60 ? TrendingDown : BookOpen}
                  value={pulse.avg_accuracy_this_week !== null ? `${pulse.avg_accuracy_this_week}%` : null}
                  label="Avg accuracy per pupil"
                  sub={pulse.avg_accuracy_this_week === null ? 'No quizzes yet' : 'this week'}
                  accent={
                    pulse.avg_accuracy_this_week === null ? 'purple' :
                    pulse.avg_accuracy_this_week >= 70 ? 'green' :
                    pulse.avg_accuracy_this_week >= 50 ? 'amber' : 'red'
                  }
                  onClick={() => setActivePane({ type: 'card', key: 'accuracy' })}
                  active={activeCardKey === 'accuracy'}
                />
                <StatCard
                  icon={AlertCircle}
                  value={pulse.overdue_assignments}
                  label="Overdue assignments"
                  sub={pulse.overdue_assignments === 0 ? 'All up to date' : 'Need chasing'}
                  accent={pulse.overdue_assignments > 0 ? 'red' : 'green'}
                  onClick={() => setActivePane({ type: 'card', key: 'overdue' })}
                  active={activeCardKey === 'overdue'}
                />
                <StatCard
                  icon={TrendingDown}
                  value={pulse.weak_topics?.[0] ? topicLabel(pulse.weak_topics[0].topic_key) : null}
                  label="Group weak spot"
                  sub={pulse.weak_topics?.[0]
                    ? `${pulse.weak_topics[0].pupil_count} pupils · ${pulse.weak_topics[0].accuracy}% avg`
                    : 'Not enough data yet'}
                  accent="amber"
                  onClick={() => setActivePane({ type: 'card', key: 'weakspot' })}
                  active={activeCardKey === 'weakspot'}
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
                <PupilRow
                  key={pupil.id}
                  pupil={pupil}
                  isActive={activePupil?.id === pupil.id && isSplit}
                  onClick={() => setActivePane({ type: 'pupil', pupil })}
                />
              ))}
            </div>

            {/* Dot colour key — labelled so it reads as a legend, not a pupil's status */}
            <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-3 pt-3 px-1 border-t border-slate-100">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Key</span>
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

          {/* Invites panel — collapsible, lazy-loaded */}
          {getToken && (
            <InvitesPanel getToken={getToken} onBulkInvite={onBulkInvite} />
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
            <div className="flex items-center gap-1">
              {onBulkInvite && (
                <button type="button" onClick={onBulkInvite}
                  className="p-2 text-slate-400 hover:text-[#7C3AED] hover:bg-[#F8F7FF] rounded-xl transition-colors"
                  title="Invite pupils by email"
                  aria-label="Invite pupils by email">
                  <MailPlus className="w-4 h-4" />
                </button>
              )}
              <button type="button" onClick={() => setShowMessaging(true)}
                className="p-2 text-slate-400 hover:text-[#7C3AED] hover:bg-[#F8F7FF] rounded-xl transition-colors">
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable panel content */}
          <div className="flex-1 overflow-y-auto p-4">
            {dashboardBody}
          </div>
        </div>

        {/* Right panel — detail (pupil OR pulse-card, one occupant) */}
        <div className="flex-1 overflow-y-auto bg-[#FAF9FF]">
          {activePupil ? (
            <PupilDetailScreen
              key={activePupil.id}
              childId={activePupil.id}
              getToken={getToken}
              panelMode
              onBack={() => setActivePane(null)}
              onViewQuizDetail={onViewQuizDetail}
              onViewAssignmentDetail={onViewAssignmentDetail}
            />
          ) : activeCardKey ? (
            <TutorPulseDetail
              key={activeCardKey}
              detailKey={activeCardKey}
              pulse={pulse}
              roster={roster}
              panelMode
              onBack={() => setActivePane(null)}
              onOpenPupil={(pupil) => setActivePane({ type: 'pupil', pupil })}
              onViewAssignmentDetail={onViewAssignmentDetail}
              onMessageChild={openMessaging}
              onAssignTopic={openComposerForTopic}
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
            <TutorMessagingScreen getToken={getToken} onBack={closeMessaging} initialChild={messagingChild} />
          </div>
        )}

        {/* Assignment composer modal */}
        {showComposer && (
          <AssignmentComposer
            key={composerPrefill?.initialItems?.[0]?.topicKey || 'blank'}
            roster={roster}
            classes={classes}
            getToken={getToken}
            initialItems={composerPrefill?.initialItems}
            initialTitle={composerPrefill?.initialTitle}
            // AssignmentComposer now closes itself on a clean send (so it can
            // stay open instead when pupils were skipped for being on the
            // free plan) — onCreated here only needs to refresh the roster.
            onCreated={() => { loadDashboard(); }}
            onClose={closeComposer}
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
          <div className="flex items-center gap-1">
            {onBulkInvite && (
              <button type="button" onClick={onBulkInvite}
                className="p-2 text-slate-500 hover:text-[#7C3AED] hover:bg-[#F8F7FF] rounded-xl transition-colors"
                title="Invite pupils by email"
                aria-label="Invite pupils by email">
                <MailPlus className="w-5 h-5" />
              </button>
            )}
            <button type="button" onClick={() => setShowMessaging(true)}
              className="p-2 text-slate-500 hover:text-[#7C3AED] hover:bg-[#F8F7FF] rounded-xl transition-colors">
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-4 pb-8">
          {dashboardBody}
        </div>

        {/* Assignment composer modal */}
        {showComposer && (
          <AssignmentComposer
            key={composerPrefill?.initialItems?.[0]?.topicKey || 'blank'}
            roster={roster}
            classes={classes}
            getToken={getToken}
            initialItems={composerPrefill?.initialItems}
            initialTitle={composerPrefill?.initialTitle}
            // AssignmentComposer now closes itself on a clean send (so it can
            // stay open instead when pupils were skipped for being on the
            // free plan) — onCreated here only needs to refresh the roster.
            onCreated={() => { loadDashboard(); }}
            onClose={closeComposer}
          />
        )}
      </div>
    </div>
  );
}
