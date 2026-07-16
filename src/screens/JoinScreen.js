import React, { useState, useEffect } from 'react';
import { ArrowLeft, UserCheck, Loader, AlertCircle } from 'lucide-react';
import { motion } from '../components/Motion';

const API_URL = process.env.REACT_APP_TUTOR_API_URL;

// Fetch public tutor profile — no auth needed. Exported so the manual
// tutor-code entry point (layer 3b — TutorCodeEntryModal) can validate a
// typed-in code against the same lookup, rather than duplicating it.
export async function fetchTutorProfile(tutorCode) {
  const res = await fetch(`${API_URL}/api/tutor/public/${encodeURIComponent(tutorCode)}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Tutor not found');
  return data.tutor;
}

// Record the join-intent trace (attribution durability layer 2 — see
// plans/tutor-attribution-durability.md) the moment this screen mounts with
// an authed session, BEFORE the parent decides. The account is guaranteed to
// exist by the time JoinScreen renders (post-auth, past onboarding), so this
// is safe alongside AuthGate's own fire — the endpoint is idempotent, so
// double-firing is harmless. Fire-and-forget: never blocks the screen, never
// retried on failure.
async function postJoinIntent(tutorCode, getToken) {
  try {
    const token = await getToken();
    await fetch(`${API_URL}/api/tutor/join-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ tutorCode }),
    });
  } catch {} // fire-and-forget — swallow silently
}

// Record an explicit decline ("Not now"). Awaited by the caller so the
// localStorage clear + navigation only happen once this has had its chance
// to land, but a failure here must never trap the parent on this screen —
// caller tolerates rejection and proceeds regardless.
async function postJoinIntentDecline(tutorCode, getToken) {
  const token = await getToken();
  const res = await fetch(`${API_URL}/api/tutor/join-intent/decline`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ tutorCode }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Decline failed');
  return data;
}

async function joinTutor(tutorCode, childId, getToken) {
  const token = await getToken();
  const res = await fetch(`${API_URL}/api/tutor/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ tutorCode, childId }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Join failed');
  return data;
}

// ── Child selector (for existing parents with multiple children) ──
function ChildSelector({ children, selected, onSelect }) {
  if (children.length === 1) return null; // Auto-selected, no UI needed
  return (
    <div className="mb-6">
      <p className="text-sm font-medium text-slate-700 mb-3">Which child should be linked?</p>
      <div className="flex flex-col gap-2">
        {children.map(child => (
          <button
            key={child.id}
            onClick={() => onSelect(child.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${
              selected === child.id
                ? 'border-[#7C3AED] bg-[#F8F7FF]'
                : 'border-gray-200 bg-white hover:border-[#A29BFE]'
            }`}
          >
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ background: '#7C3AED' }}
            >
              {child.display_name[0]}
            </span>
            <span className="font-medium text-slate-800">{child.display_name}</span>
            {selected === child.id && <UserCheck className="w-4 h-4 text-[#7C3AED] ml-auto" />}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function JoinScreen({ tutorCode, childrenList, getToken, onJoined, onBack, onDecline }) {
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChildId, setSelectedChildId] = useState(childrenList?.[0]?.id || null);
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const [declining, setDeclining] = useState(false);

  useEffect(() => {
    if (!tutorCode) { setError('Invalid invite link'); setLoading(false); return; }
    fetchTutorProfile(tutorCode)
      .then(t => { setTutor(t); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [tutorCode]);

  // Mount-time join-intent fire (layer 2) — see postJoinIntent above.
  useEffect(() => {
    if (!tutorCode || !getToken) return;
    postJoinIntent(tutorCode, getToken);
  }, [tutorCode, getToken]);

  const handleJoin = async () => {
    if (!selectedChildId) return;
    setJoining(true);
    setError(null);
    try {
      await joinTutor(tutorCode, selectedChildId, getToken);
      setJoined(true);
      setTimeout(() => onJoined(selectedChildId), 1500);
    } catch (err) {
      setError(err.message);
      setJoining(false);
    }
  };

  // "Not now" — the only path besides a successful join that wipes the
  // pending code. Records the decline server-side first (tolerating failure —
  // a parent must never be trapped on this screen by a network blip), then
  // hands off to onDecline, which clears localStorage and returns home.
  const handleDecline = async () => {
    if (declining) return;
    setDeclining(true);
    try {
      await postJoinIntentDecline(tutorCode, getToken);
    } catch {} // tolerate failure — still proceed to clear locally and leave
    setDeclining(false);
    onDecline();
  };

  if (loading) {
    return (
      <div className="min-h-screen app-bg flex items-center justify-center">
        <Loader className="w-8 h-8 text-[#7C3AED] animate-spin" />
      </div>
    );
  }

  if (error && !tutor) {
    return (
      <div className="min-h-screen app-bg flex items-center justify-center p-6">
        <div className="max-w-sm w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="font-heading font-bold text-xl text-slate-800 mb-2">Link not found</h2>
          <p className="text-slate-500 text-sm mb-6">
            This invite link isn't valid. Ask your tutor for a new one.
          </p>
          <button onClick={onBack} className="w-full py-3 bg-[#7C3AED] text-white font-bold rounded-xl">
            Back to app
          </button>
        </div>
      </div>
    );
  }

  if (joined) {
    return (
      <div className="min-h-screen app-bg flex items-center justify-center p-6">
        <motion.div
          className="max-w-sm w-full bg-white rounded-2xl shadow-xl p-8 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <UserCheck className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="font-heading font-bold text-xl text-slate-800 mb-2">You're linked!</h2>
          <p className="text-slate-500 text-sm">
            {childrenList.find(c => c.id === selectedChildId)?.display_name || 'Your child'} is now connected to {tutor.display_name}.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen app-bg p-4">
      <div className="max-w-md mx-auto">
        {/* "Not deciding now" — the code and server-side intent stay pending
            and are re-offered next login. Only the explicit "Not now" button
            below actually declines. */}
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-600 mb-6 hover:text-slate-800">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <motion.div
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          {/* Tutor profile header */}
          <div className="bg-gradient-to-br from-[#7C3AED] to-[#5A4BD1] p-6 text-white">
            <div className="flex items-center gap-4">
              {tutor.photo_url ? (
                <img src={tutor.photo_url} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-white/30" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                  {tutor.display_name[0]}
                </div>
              )}
              <div>
                <h1 className="font-heading font-bold text-xl">{tutor.display_name}</h1>
                <p className="text-white/80 text-sm">Your PrepStep tutor</p>
              </div>
            </div>
            {tutor.bio && (
              <p className="mt-4 text-white/90 text-sm leading-relaxed">{tutor.bio}</p>
            )}
          </div>

          {/* Accept section */}
          <div className="p-6">
            <h2 className="font-heading font-bold text-lg text-slate-800 mb-4">
              Connect your child to {tutor.display_name}?
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              {tutor.display_name} will be able to see your child's quiz scores, topic performance, and learning history, and can set homework assignments.
            </p>

            <ChildSelector
              children={childrenList || []}
              selected={selectedChildId}
              onSelect={setSelectedChildId}
            />

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              onClick={handleJoin}
              disabled={!selectedChildId || joining}
              className="w-full py-3.5 bg-[#7C3AED] text-white font-bold rounded-xl hover:bg-[#6D28D9] disabled:opacity-50 transition-colors"
            >
              {joining ? 'Linking…' : `Connect to ${tutor.display_name}`}
            </button>

            {/* Explicit decline — calm, not alarming. The only path (besides
                a successful join) that wipes the pending code; a bare Back
                leaves it pending so it can be re-offered next login. */}
            <button
              onClick={handleDecline}
              disabled={joining || declining}
              className="w-full py-2.5 mt-2 text-sm text-slate-500 font-medium rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              {declining ? 'One moment…' : 'Not now'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
