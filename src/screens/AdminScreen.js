import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ShieldCheck, UserPlus, Trash2, Gift, RefreshCw, ChevronDown, ChevronUp, Check, X } from 'lucide-react';

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

function inactivityLabel(days) {
  if (days === null || days === undefined) return 'never';
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  return `${days}d ago`;
}

// ── Bulk invite review card ──
function BulkInviteReviews({ getToken }) {
  const [batches, setBatches] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({}); // batchId → bool
  const [approveTutor, setApproveTutor] = useState({}); // batchId → bool
  const [busy, setBusy] = useState(null); // batchId being actioned

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await apiFetch('/api/admin/bulk-invite-reviews', getToken);
      setBatches(d.batches || []);
    } catch {
      setBatches([]);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => { load(); }, [load]);

  const act = async (batchId, action) => {
    const msg = action === 'approve'
      ? `Approve this batch and send the invite emails?${approveTutor[batchId] ? '\n\nThis will also trust this tutor to skip review for future batches.' : ''}`
      : 'Reject this batch? The invites will be revoked.';
    if (!window.confirm(msg)) return; // eslint-disable-line no-alert
    setBusy(batchId);
    try {
      await apiFetch('/api/admin/bulk-invite-reviews', getToken, {
        method: 'POST',
        body: JSON.stringify({ batchId, action, ...(action === 'approve' && approveTutor[batchId] ? { approveTutor: true } : {}) }),
      });
      await load();
    } catch (err) {
      alert(err.message); // eslint-disable-line no-alert
    } finally {
      setBusy(null);
    }
  };

  if (loading) return <p className="text-slate-400 text-sm px-1 mt-2">Loading reviews…</p>;
  if (!batches || batches.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="font-heading font-bold text-slate-800 mb-2 px-1">
        Bulk invite reviews <span className="text-slate-400 font-normal text-sm">({batches.length})</span>
      </h2>
      <div className="space-y-3">
        {batches.map(batch => {
          const isExpanded = !!expanded[batch.batchId];
          const isBusy = busy === batch.batchId;
          const date = batch.createdAt ? new Date(batch.createdAt).toLocaleDateString('en-GB') : '';

          return (
            <div key={batch.batchId} className="bg-white rounded-2xl border border-amber-200 shadow-sm p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 text-sm">{batch.tutor.displayName}</p>
                  <p className="text-xs text-slate-400 truncate">{batch.tutor.email}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{batch.rowCount} pupils · submitted {date}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setExpanded(e => ({ ...e, [batch.batchId]: !isExpanded }))}
                  className="p-1 text-slate-400 hover:text-slate-700 flex-shrink-0"
                  aria-expanded={isExpanded}
                  aria-label={isExpanded ? 'Collapse rows' : 'Expand rows'}
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {isExpanded && (
                <div className="border-t border-slate-100 pt-2 mb-3 space-y-1">
                  {batch.rows.map((row, i) => (
                    <div key={row.id || i} className="flex items-center gap-2 text-xs">
                      <span className="text-slate-600 truncate">{row.child_name}</span>
                      <span className="text-slate-400 truncate">{row.parent_email}</span>
                      {row.year_group && <span className="text-slate-400">Y{row.year_group}</span>}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3 flex-wrap">
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!approveTutor[batch.batchId]}
                    onChange={e => setApproveTutor(prev => ({ ...prev, [batch.batchId]: e.target.checked }))}
                    className="rounded accent-[#7C3AED]"
                  />
                  Also trust this tutor for future batches
                </label>
                <div className="flex gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => act(batch.batchId, 'reject')}
                    disabled={isBusy}
                    className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-700 px-3 py-1.5 border border-red-200 rounded-lg disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => act(batch.batchId, 'approve')}
                    disabled={isBusy}
                    className="flex items-center gap-1.5 text-xs font-medium text-white bg-[#7C3AED] hover:bg-[#6D28D9] px-3 py-1.5 rounded-lg disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── "How parents heard" tally (Shareable Progress Card growth loop) ──
// Read-only count-by-value fed by GET /api/admin/heard-about (routes/admin.js),
// itself fed by the one-shot survey chip on the parent dashboard
// (src/components/HeardAboutChip.js). See plans/shareable-progress-card.md.
// 'dismissed' is shown too (not hidden) — it's the take-up signal for the
// chip itself, not something to bury.
const HEARD_ABOUT_LABELS = {
  'progress-card': 'Shared progress card',
  'tutor': 'Tutor',
  'search-or-ai': 'Search or AI answer',
  'word-of-mouth': 'Word of mouth',
  'other': 'Somewhere else',
  'dismissed': 'Dismissed without answering',
};

function HeardAboutTallySection({ getToken }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await apiFetch('/api/admin/heard-about', getToken));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <p className="text-slate-400 text-sm px-1 mt-2">Loading survey results…</p>;
  if (error) {
    return (
      <div className="mx-1 p-4 bg-red-50 rounded-2xl border border-red-100 mb-6">
        <p className="text-red-700 text-sm font-medium mb-1">Couldn't load the heard-about tally</p>
        <p className="text-red-500 text-xs">{error}</p>
      </div>
    );
  }
  if (!data) return null;

  const entries = Object.entries(data.counts || {}).sort((a, b) => b[1] - a[1]);

  return (
    <>
      <h2 className="font-heading font-bold text-slate-800 mb-2 px-1">
        How parents heard <span className="text-slate-400 font-normal text-sm">({data.total} response{data.total === 1 ? '' : 's'})</span>
      </h2>
      {entries.length === 0 ? (
        <p className="text-xs text-slate-400 px-1 mb-6">No responses yet.</p>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100 mb-6">
          {entries.map(([value, count]) => (
            <div key={value} className="flex items-center justify-between p-3">
              <p className="text-sm text-slate-700">{HEARD_ABOUT_LABELS[value] || value}</p>
              <p className="text-sm font-semibold text-slate-800">{count}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ── Tutor attribution visibility (layer 4) ──
// Read-only v1: answers "is this signup a tutor referral, and to whom?" in
// one screen, without messaging the tutor. See
// plans/tutor-attribution-durability.md.

function statusChipClasses(status) {
  if (status === 'joined') return 'bg-green-100 text-green-700';
  if (status === 'declined') return 'bg-slate-100 text-slate-500';
  return 'bg-amber-100 text-amber-700'; // pending
}

function formatDate(value) {
  if (!value) return '—';
  const d = new Date(value.includes(' ') && !value.includes('T') ? `${value}Z` : value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-GB');
}

function TutorAttributionSection({ getToken }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await apiFetch('/api/admin/join-intents', getToken));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <p className="text-slate-400 text-sm px-1 mt-2">Loading tutor referrals…</p>;
  if (error) {
    return (
      <div className="mx-1 p-4 bg-red-50 rounded-2xl border border-red-100 mb-6">
        <p className="text-red-700 text-sm font-medium mb-1">Couldn't load tutor referrals</p>
        <p className="text-red-500 text-xs">{error}</p>
      </div>
    );
  }
  if (!data) return null;

  const { intents, unlinked } = data;

  return (
    <>
      {/* Tutor referrals */}
      <h2 className="font-heading font-bold text-slate-800 mb-2 px-1">
        Tutor referrals <span className="text-slate-400 font-normal text-sm">({intents.length})</span>
      </h2>
      {intents.length === 0 ? (
        <p className="text-xs text-slate-400 px-1 mb-6">No tutor referrals yet.</p>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100 mb-6">
          {intents.map(intent => (
            <div key={intent.id} className="p-3">
              <div className="flex items-start justify-between gap-3 mb-1">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{intent.parentEmail}</p>
                  <p className="text-xs text-slate-400 truncate">
                    {intent.childrenNames.length > 0 ? intent.childrenNames.join(', ') : 'No children yet'}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${statusChipClasses(intent.status)}`}>
                  {intent.status}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                via {intent.tutorName} · signed up {formatDate(intent.signupDate)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Unlinked signups */}
      <h2 className="font-heading font-bold text-slate-800 mb-2 px-1">
        Unlinked signups <span className="text-slate-400 font-normal text-sm">({unlinked.length})</span>
      </h2>
      {unlinked.length === 0 ? (
        <p className="text-xs text-slate-400 px-1 mb-6">No unlinked signups.</p>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100 mb-6">
          {unlinked.map(acct => (
            <div key={acct.accountId} className="p-3">
              <p className="text-sm font-semibold text-slate-800 truncate">{acct.parentEmail}</p>
              <p className="text-xs text-slate-400 truncate">
                {acct.childrenNames.length > 0 ? acct.childrenNames.join(', ') : 'No children yet'}
                {' · signed up '}{formatDate(acct.signupDate)}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default function AdminScreen({ getToken, onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [grantEmail, setGrantEmail] = useState('');
  const [grantNote, setGrantNote] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await apiFetch('/api/admin/tutors', getToken));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => { load(); }, [load]);

  const act = async (fn) => {
    setBusy(true);
    try { await fn(); await load(); }
    catch (err) { alert(err.message); }      // eslint-disable-line no-alert
    finally { setBusy(false); }
  };

  const grant = () => act(async () => {
    await apiFetch('/api/admin/tutor-allowlist', getToken, {
      method: 'POST', body: JSON.stringify({ email: grantEmail, note: grantNote }),
    });
    setGrantEmail(''); setGrantNote('');
  });

  const revoke = (email) => act(async () => {
    if (!window.confirm(`Revoke tutor access for ${email}? Their profile and pupils are kept; they lose access until re-granted.`)) return; // eslint-disable-line no-alert
    await apiFetch('/api/admin/tutor-allowlist', getToken, { method: 'DELETE', body: JSON.stringify({ email }) });
  });

  const toggleComp = (tutor) => act(async () => {
    const comped = !tutor.is_comped;
    await apiFetch('/api/admin/comp', getToken, {
      method: 'POST', body: JSON.stringify({ accountId: tutor.id, comped, source: 'admin-panel' }),
    });
  });

  const removePupil = (tutorId, pupil) => act(async () => {
    const impact = await apiFetch(`/api/admin/remove-pupil-impact?tutorId=${tutorId}&childId=${pupil.child_id}`, getToken);
    const i = impact.impact;
    const msg = `Remove ${pupil.display_name} from this tutor?\n\nThis deletes:\n` +
      `• ${i.tutor_notes} note(s)\n• ${i.individual_assignments} individual assignment(s)\n` +
      `• ${i.assignment_recipients} assignment record(s)\n• ${i.conversations} conversation(s)\n` +
      `• ${i.class_enrolments} class enrolment(s)\n\nThe child and their account/learning data are NOT affected.`;
    if (!window.confirm(msg)) return; // eslint-disable-line no-alert
    await apiFetch('/api/admin/remove-pupil', getToken, {
      method: 'POST', body: JSON.stringify({ tutorId, childId: pupil.child_id }),
    });
  });

  return (
    <div className="app-bg min-h-screen">
      <div className="max-w-3xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between p-4 pt-5">
          <div className="flex items-center gap-3">
            <button type="button" onClick={onBack} className="text-slate-400 hover:text-slate-700">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#7C3AED]" />
              <h1 className="font-heading font-bold text-slate-800 text-lg">Tutor Admin</h1>
            </div>
          </div>
          <button type="button" onClick={load} disabled={busy}
            className="p-2 text-slate-400 hover:text-[#7C3AED] hover:bg-[#F8F7FF] rounded-xl transition-colors">
            <RefreshCw className={`w-4 h-4 ${busy ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading && <p className="text-slate-400 text-sm px-4">Loading…</p>}

        {!loading && error && (
          <div className="mx-4 p-4 bg-red-50 rounded-2xl border border-red-100">
            <p className="text-red-700 text-sm font-medium mb-1">Couldn't load admin data</p>
            <p className="text-red-500 text-xs">{error}</p>
            <p className="text-red-400 text-xs mt-2">If this says Forbidden, your account isn't an admin.</p>
          </div>
        )}

        {!loading && !error && data && (
          <>
            {/* Bulk invite reviews — top priority admin action */}
            <BulkInviteReviews getToken={getToken} />

            {/* How parents heard — Shareable Progress Card growth-loop survey */}
            <HeardAboutTallySection getToken={getToken} />

            {/* Tutor attribution — is this signup a tutor referral? */}
            <TutorAttributionSection getToken={getToken} />

            {/* Grant a new tutor */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <UserPlus className="w-3.5 h-3.5" /> Grant tutor access
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input value={grantEmail} onChange={e => setGrantEmail(e.target.value)} placeholder="email@example.com"
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]" />
                <input value={grantNote} onChange={e => setGrantNote(e.target.value)} placeholder="note (optional)"
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]" />
                <button type="button" onClick={grant} disabled={busy || !grantEmail}
                  className="px-4 py-2 bg-[#7C3AED] text-white text-sm font-bold rounded-xl hover:bg-[#6D28D9] disabled:opacity-50">
                  Grant
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-2">Works before they sign up — eligibility is matched on their email.</p>
            </div>

            {/* Tutors */}
            <h2 className="font-heading font-bold text-slate-800 mb-2 px-1">
              Tutors <span className="text-slate-400 font-normal text-sm">({data.tutors.length})</span>
            </h2>
            <div className="space-y-3 mb-6">
              {data.tutors.map(t => (
                <div key={t.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 text-sm">{t.display_name}</p>
                      <p className="text-xs text-slate-400 truncate">{t.email} · {t.tutor_code}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        t.is_comped ? 'bg-green-100 text-green-700'
                        : t.subscription_status ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-100 text-slate-500'}`}>
                        {t.is_comped ? 'Free (comped)' : t.subscription_status || 'No sub'}
                      </span>
                    </div>
                  </div>

                  {t.pupils.length > 0 ? (
                    <div className="border-t border-slate-100 pt-2 mt-2 space-y-1">
                      {t.pupils.map(p => (
                        <div key={p.child_id} className="flex items-center justify-between text-xs">
                          <span className="text-slate-600 truncate">
                            {p.display_name}
                            {p.year_group ? <span className="text-slate-400"> Y{p.year_group}</span> : null}
                            <span className="text-slate-400"> · active {inactivityLabel(p.days_inactive)}</span>
                          </span>
                          <button type="button" onClick={() => removePupil(t.id, p)} disabled={busy}
                            className="flex items-center gap-1 text-slate-400 hover:text-red-500 flex-shrink-0">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 border-t border-slate-100 pt-2 mt-2">No pupils yet</p>
                  )}

                  <div className="flex items-center gap-3 mt-3">
                    <button type="button" onClick={() => toggleComp(t)} disabled={busy}
                      className="flex items-center gap-1.5 text-xs font-medium text-[#7C3AED] hover:underline">
                      <Gift className="w-3.5 h-3.5" /> {t.is_comped ? 'Remove comp' : 'Comp account'}
                    </button>
                    <button type="button" onClick={() => revoke(t.email)} disabled={busy}
                      className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:underline">
                      <Trash2 className="w-3.5 h-3.5" /> Revoke tutor
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pending invites */}
            {data.pending_invites.length > 0 && (
              <>
                <h2 className="font-heading font-bold text-slate-800 mb-2 px-1">
                  Granted, not signed up <span className="text-slate-400 font-normal text-sm">({data.pending_invites.length})</span>
                </h2>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100">
                  {data.pending_invites.map(inv => (
                    <div key={inv.email} className="flex items-center justify-between p-3">
                      <div className="min-w-0">
                        <p className="text-sm text-slate-700 truncate">{inv.email}</p>
                        {inv.note && <p className="text-xs text-slate-400 truncate">{inv.note}</p>}
                      </div>
                      <button type="button" onClick={() => revoke(inv.email)} disabled={busy}
                        className="text-slate-400 hover:text-red-500 flex-shrink-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
