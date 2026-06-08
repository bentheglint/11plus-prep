import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ShieldCheck, UserPlus, Trash2, Gift, RefreshCw } from 'lucide-react';

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
