import React, { useState, useEffect } from 'react';
import { ArrowLeft, UserCheck, Loader, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from '../components/Motion';

const API_URL = process.env.REACT_APP_TUTOR_API_URL;

// ── Child selector (mirrors JoinScreen's ChildSelector) ──
function ChildSelector({ children, selected, onSelect }) {
  if (children.length <= 1) return null;
  return (
    <div className="mb-6">
      <p className="text-sm font-medium text-slate-700 mb-3">Which child should be connected?</p>
      <div className="flex flex-col gap-2">
        {children.map(child => (
          <button
            key={child.id}
            type="button"
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

// Fetch invite preview (authed)
async function fetchInvitePreview(token, inviteToken) {
  const res = await fetch(`${API_URL}/api/tutor/invite-preview`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ token: inviteToken }),
  });
  const data = await res.json().catch(() => ({}));
  return data;
}

async function claimInvite(authToken, inviteToken, childId) {
  const res = await fetch(`${API_URL}/api/tutor/claim-invite`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ token: inviteToken, childId }),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

export default function InviteClaimScreen({ inviteToken, childrenList, getToken, onClaimed, onBack }) {
  const [preview, setPreview] = useState(() => {
    // Re-use cached preview from AuthGate's ChildNameScreen pre-fill call
    try {
      const cached = sessionStorage.getItem('invite-preview');
      if (cached) return JSON.parse(cached);
    } catch {}
    return null;
  });
  const [loading, setLoading] = useState(!preview);
  const [error, setError] = useState(null);
  const [selectedChildId, setSelectedChildId] = useState(childrenList?.[0]?.id || null);
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [invalidToken, setInvalidToken] = useState(false);

  useEffect(() => {
    if (preview) return; // already have cached preview

    if (!inviteToken) {
      setInvalidToken(true);
      setLoading(false);
      return;
    }

    let cancelled = false;
    getToken().then(token => {
      return fetchInvitePreview(token, inviteToken);
    }).then(data => {
      if (cancelled) return;
      if (!data.valid) {
        setInvalidToken(true);
      } else {
        setPreview(data);
        // Cache it
        try { sessionStorage.setItem('invite-preview', JSON.stringify(data)); } catch {}
      }
      setLoading(false);
    }).catch(() => {
      if (!cancelled) {
        setError('Couldn\'t load the invite details. Check your connection.');
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [inviteToken, getToken, preview]);

  const handleClaim = async () => {
    if (!selectedChildId) return;
    setClaiming(true);
    setError(null);
    try {
      const authToken = await getToken();
      const { ok, status, data } = await claimInvite(authToken, inviteToken, selectedChildId);

      if (ok || data.alreadyLinked) {
        setClaimed(true);
        // Clear session storage tokens
        try {
          sessionStorage.removeItem('pending-invite-token');
          sessionStorage.removeItem('invite-preview');
        } catch {}
        setTimeout(() => onClaimed(selectedChildId), 1500);
        return;
      }

      if (status === 404) {
        // Token no longer valid
        setInvalidToken(true);
        try {
          sessionStorage.removeItem('pending-invite-token');
          sessionStorage.removeItem('invite-preview');
        } catch {}
        return;
      }

      setError(data.error || 'Something went wrong. Please try again.');
    } catch {
      setError('Couldn\'t reach the server. Check your connection and try again.');
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen app-bg flex items-center justify-center">
        <Loader className="w-8 h-8 text-[#7C3AED] animate-spin" />
      </div>
    );
  }

  if (invalidToken) {
    return (
      <div className="min-h-screen app-bg flex items-center justify-center p-6">
        <div className="max-w-sm w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="font-heading font-bold text-xl text-slate-800 mb-2">Invitation link not valid</h2>
          <p className="text-slate-500 text-sm mb-6">
            This invitation link is no longer valid — ask your tutor for a new one.
          </p>
          <button
            type="button"
            onClick={onBack}
            className="w-full py-3 bg-[#7C3AED] text-white font-bold rounded-xl hover:bg-[#6D28D9] transition-colors"
          >
            Go home
          </button>
        </div>
      </div>
    );
  }

  if (claimed) {
    const child = childrenList.find(c => c.id === selectedChildId);
    return (
      <div className="min-h-screen app-bg flex items-center justify-center p-6">
        <motion.div
          className="max-w-sm w-full bg-white rounded-2xl shadow-xl p-8 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="font-heading font-bold text-xl text-slate-800 mb-2">You're linked!</h2>
          <p className="text-slate-500 text-sm">
            {child?.display_name || 'Your child'} is now connected to {preview?.tutor?.displayName || 'your tutor'}.
          </p>
        </motion.div>
      </div>
    );
  }

  const tutor = preview?.tutor;
  const yearGroup = preview?.yearGroup;

  return (
    <div className="min-h-screen app-bg p-4">
      <div className="max-w-md mx-auto">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-600 mb-6 hover:text-slate-800"
        >
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
              {tutor?.photoUrl ? (
                <img
                  src={tutor.photoUrl}
                  alt=""
                  className="w-16 h-16 rounded-full object-cover border-2 border-white/30"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                  {tutor?.displayName?.[0] || '?'}
                </div>
              )}
              <div>
                <h1 className="font-heading font-bold text-xl">{tutor?.displayName || 'Your tutor'}</h1>
                <p className="text-white/80 text-sm">Your PrepStep tutor</p>
              </div>
            </div>
            {tutor?.bio && (
              <p className="mt-4 text-white/90 text-sm leading-relaxed">{tutor.bio}</p>
            )}
          </div>

          {/* Accept section */}
          <div className="p-6">
            <h2 className="font-heading font-bold text-lg text-slate-800 mb-2">
              Connect your child to {tutor?.displayName || 'this tutor'}?
            </h2>

            <p className="text-sm text-slate-500 mb-4">
              {tutor?.displayName} will be able to see your child's quiz scores, topic performance, and learning history.
            </p>

            {/* Year group chip */}
            {yearGroup && (
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#F8F7FF] text-[#7C3AED] border border-[#E8E5FF]">
                  Year {yearGroup}
                </span>
              </div>
            )}

            <ChildSelector
              children={childrenList || []}
              selected={selectedChildId}
              onSelect={setSelectedChildId}
            />

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600" role="alert">
                {error}
              </div>
            )}

            {(childrenList || []).length === 0 ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700" role="alert">
                There's no child profile on this account yet. Add a child first, then open this invitation link again.
              </div>
            ) : (
              <button
                type="button"
                onClick={handleClaim}
                disabled={!selectedChildId || claiming}
                className="w-full py-3.5 bg-[#7C3AED] text-white font-bold rounded-xl hover:bg-[#6D28D9] disabled:opacity-50 transition-colors"
              >
                {claiming ? 'Connecting…' : `Connect to ${tutor?.displayName || 'tutor'}`}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
