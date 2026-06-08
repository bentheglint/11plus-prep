import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, ExternalLink, LayoutDashboard, Share2, Users, ClipboardList } from 'lucide-react';
import { motion } from '../components/Motion';

const API_URL = process.env.REACT_APP_TUTOR_API_URL;

async function apiFetch(path, getToken, options = {}) {
  const token = await getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
  return data;
}

// ── Tutor profile view (shown after signup) ──
function TutorProfile({ tutor, onBack, onOpenDashboard }) {
  const [copied, setCopied] = useState(false);
  const joinUrl = `${window.location.origin}/join/${tutor.tutor_code}`;

  const copyLink = () => {
    navigator.clipboard.writeText(joinUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-white transition-colors text-slate-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-heading font-bold text-xl text-slate-800">Your Tutor Profile</h1>
      </div>

      <motion.div
        className="bg-white rounded-2xl shadow-md overflow-hidden mb-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <div className="bg-gradient-to-br from-[#7C3AED] to-[#5A4BD1] p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
              {tutor.display_name[0]}
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg">{tutor.display_name}</h2>
              {tutor.bio && <p className="text-white/80 text-sm mt-0.5">{tutor.bio}</p>}
            </div>
          </div>
        </div>
        <div className="p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Your invite link</p>
          <div className="flex items-center gap-2 p-3 bg-[#F8F7FF] rounded-xl border border-[#A29BFE]">
            <span className="text-sm text-[#7C3AED] font-medium flex-1 truncate">{joinUrl}</span>
            <button onClick={copyLink} className="p-1 text-[#7C3AED] hover:text-[#5A4BD1] transition-colors flex-shrink-0">
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Share this link with parents. When they sign up and click it, their child will be added to your roster.
          </p>
        </div>
      </motion.div>

      <button
        onClick={onOpenDashboard}
        className="w-full flex items-center justify-center gap-2 py-3 bg-[#7C3AED] text-white font-bold rounded-xl hover:bg-[#6D28D9] transition-colors mb-4"
      >
        <LayoutDashboard className="w-4 h-4" />
        Open Tutor Dashboard
      </button>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <p className="font-medium mb-1">What's in the dashboard?</p>
        <ul className="space-y-1 text-amber-700">
          <li>• Pupil group — everyone who's joined via your link</li>
          <li>• Classes — group pupils into named sessions</li>
          <li>• Assignments — set homework with a due date</li>
        </ul>
      </div>
    </div>
  );
}

// ── Signup form ──
function SignupForm({ getToken, onCreated, defaultName }) {
  const [displayName, setDisplayName] = useState(defaultName || '');
  const [bio, setBio] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!displayName.trim()) { setError('Please enter your name'); return; }
    if (!termsAccepted) { setError('Please agree to the Tutor Terms to continue'); return; }
    setSaving(true);
    setError(null);
    try {
      const data = await apiFetch('/api/tutor', getToken, {
        method: 'POST',
        body: JSON.stringify({ displayName, bio }),
      });
      onCreated(data.tutor);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl text-slate-800 mb-1">Become a PrepStep tutor</h1>
        <p className="text-slate-500 text-sm">Free for tutors. Your pupils' parents pay the subscription.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 mb-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">Your name (shown to parents)</label>
          <input
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            placeholder="e.g. Mary Jones"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Brief description <span className="text-slate-400 font-normal">(optional — shown to parents on your invite page)</span>
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] resize-none"
            rows={2}
            placeholder="e.g. 11+ tutor based in Bournemouth. GL Assessment specialist, 10 years' experience."
            value={bio}
            onChange={e => setBio(e.target.value)}
            maxLength={200}
          />
          <p className="text-xs text-slate-400 mt-1 text-right">{bio.length}/200</p>
        </div>

        <label className="flex items-start gap-3 mb-4 cursor-pointer">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={e => setTermsAccepted(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded accent-[#7C3AED] flex-shrink-0"
          />
          <span className="text-sm text-slate-600">
            I agree to the{' '}
            <a href="/tutor-terms.html" target="_blank" rel="noopener noreferrer" className="text-[#7C3AED] underline">
              PrepStep Tutor Terms
            </a>
            , including the commission arrangement and data handling obligations.
          </span>
        </label>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={saving || !displayName.trim() || !termsAccepted}
          className="w-full py-3.5 bg-[#7C3AED] text-white font-bold rounded-xl hover:bg-[#6D28D9] disabled:opacity-50 transition-colors"
        >
          {saving ? 'Creating profile…' : 'Create tutor profile'}
        </button>
      </div>

      <p className="text-xs text-slate-400 text-center">
        Tutor accounts are free. Payments (v1.5) handled via Stripe Connect.
      </p>
    </div>
  );
}

// ── Post-signup walkthrough (shown once, right after profile creation) ──
function TutorWalkthrough({ tutor, onDone }) {
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const joinUrl = `${window.location.origin}/join/${tutor.tutor_code}`;

  const copyLink = () => {
    navigator.clipboard.writeText(joinUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const steps = [
    {
      icon: Share2,
      title: 'Share your invite link',
      body: 'Send this link to the parents of pupils you tutor. When they sign up through it, their child is added to your roster automatically.',
      showLink: true,
    },
    {
      icon: Users,
      title: 'Your pupils appear here',
      body: 'Every child who joins via your link shows up in your dashboard — with their quiz scores, topic strengths, and practice history.',
      showLink: false,
    },
    {
      icon: ClipboardList,
      title: 'Set homework & track progress',
      body: 'Group pupils into classes, set homework assignments with due dates, and see at a glance who needs a nudge.',
      showLink: false,
    },
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;
  const Icon = current.icon;

  return (
    <div className="max-w-lg mx-auto">
      <motion.div
        className="bg-white rounded-2xl shadow-md overflow-hidden"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <div className="bg-gradient-to-br from-[#7C3AED] to-[#5A4BD1] p-6 text-white text-center">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
            <Icon className="w-7 h-7" />
          </div>
          <p className="text-white/80 text-sm">You're all set up, {tutor.display_name.split(' ')[0]}!</p>
          <h1 className="font-heading font-bold text-xl mt-1">{current.title}</h1>
        </div>
        <div className="p-6">
          <p className="text-slate-600 text-sm mb-4">{current.body}</p>

          {current.showLink && (
            <div className="flex items-center gap-2 p-3 bg-[#F8F7FF] rounded-xl border border-[#A29BFE] mb-4">
              <span className="text-sm text-[#7C3AED] font-medium flex-1 truncate">{joinUrl}</span>
              <button onClick={copyLink} className="p-1 text-[#7C3AED] hover:text-[#5A4BD1] transition-colors flex-shrink-0">
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          )}

          {/* Step dots */}
          <div className="flex items-center justify-center gap-2 mb-5">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`h-2 rounded-full transition-all ${i === step ? 'w-6 bg-[#7C3AED]' : 'w-2 bg-[#E8E5FF]'}`}
              />
            ))}
          </div>

          <button
            onClick={() => (isLast ? onDone() : setStep(step + 1))}
            className="w-full py-3 bg-[#7C3AED] text-white font-bold rounded-xl hover:bg-[#6D28D9] transition-colors"
          >
            {isLast ? 'Go to my profile' : 'Next'}
          </button>
          {!isLast && (
            <button
              onClick={onDone}
              className="w-full py-2 mt-2 text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              Skip
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function TutorSignupScreen({ getToken, onBack, onOpenDashboard, defaultName }) {
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [justCreated, setJustCreated] = useState(false);

  // Check if already a tutor
  useEffect(() => {
    apiFetch('/api/tutor', getToken)
      .then(data => { setTutor(data.tutor); setLoading(false); })
      .catch(() => { setLoading(false); });
  }, [getToken]);

  // A freshly created profile completes tutor onboarding — clear the intent flag.
  const handleCreated = (newTutor) => {
    try { localStorage.removeItem('signup-intent'); } catch {}
    setTutor(newTutor);
    setJustCreated(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen app-bg flex items-center justify-center">
        <div className="animate-pulse text-[#7C3AED] font-heading font-bold text-xl">Loading…</div>
      </div>
    );
  }

  return (
    <div className="app-bg min-h-screen p-4">
      {tutor && justCreated ? (
        <TutorWalkthrough tutor={tutor} onDone={() => setJustCreated(false)} />
      ) : tutor ? (
        <TutorProfile tutor={tutor} onBack={onBack} onOpenDashboard={onOpenDashboard} />
      ) : (
        <div>
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-600 mb-6 hover:text-slate-800">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <SignupForm getToken={getToken} onCreated={handleCreated} defaultName={defaultName} />
        </div>
      )}
    </div>
  );
}
