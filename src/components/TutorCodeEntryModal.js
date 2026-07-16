import React, { useState } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { fetchTutorProfile } from '../screens/JoinScreen';

// Layer 3b — manual tutor-code entry (attribution durability plan). Closes
// the residual gap that layer 1 can't bridge client-side: a join link
// clicked in one browser, signup completed in a completely unrelated one.
// A tutor can say "enter VHJ5-DRN3 in the app" over any channel (phone call,
// text, in person) and the parent lands here from the account menu.
//
// Validates against the SAME public profile lookup JoinScreen already uses
// (fetchTutorProfile, exported from screens/JoinScreen.js) — no duplicated
// lookup logic. On success it hands the resolved code up to the caller,
// which sets 'pending-join-code' and routes into the existing JoinScreen
// flow; that screen's own mount-time fire records the join-intent trace.
export default function TutorCodeEntryModal({ onClose, onCodeResolved }) {
  const [code, setCode] = useState('');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState(null);

  // Uppercase as they type, strip anything that isn't A-Z0-9, and insert the
  // dash after the 4th character — mirrors the XXXX-XXXX format tutor codes
  // are generated in (routes/tutor.js generateTutorCode).
  const formatCode = (raw) => {
    const clean = raw.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
    return clean.length > 4 ? `${clean.slice(0, 4)}-${clean.slice(4)}` : clean;
  };

  const handleChange = (e) => {
    setError(null);
    setCode(formatCode(e.target.value));
  };

  const handleContinue = async () => {
    if (!code || checking) return;
    setChecking(true);
    setError(null);
    try {
      await fetchTutorProfile(code);
      onCodeResolved(code);
    } catch {
      // Friendly, no dead end — the parent can just try again or double-check
      // the code with their tutor.
      setError("We couldn't find a tutor with that code. Check it and try again.");
      setChecking(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleContinue();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="tutor-code-title">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/30 cursor-default"
        tabIndex={-1}
        onClick={onClose}
      />
      <div className="relative z-10 bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 id="tutor-code-title" className="font-heading font-bold text-lg text-slate-800">
            Have a tutor code?
          </h2>
          <button onClick={onClose} aria-label="Close">
            <X className="w-5 h-5 text-slate-500" aria-hidden="true" />
          </button>
        </div>
        <p className="text-sm text-slate-500 mb-4">
          Enter the code your tutor gave you to connect your child's progress.
        </p>
        <input
          type="text"
          value={code}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="XXXX-XXXX"
          maxLength={9}
          className="w-full px-4 py-3 text-lg text-center font-mono tracking-wider border-2 border-gray-200 rounded-xl focus:border-[#7C3AED] focus:outline-none mb-3"
          autoFocus
        />
        {error && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
            {error}
          </div>
        )}
        <button
          onClick={handleContinue}
          disabled={!code || checking}
          className="w-full py-3 rounded-xl font-bold text-white bg-[#7C3AED] hover:bg-[#5A4BD1] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {checking && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
          {checking ? 'Checking…' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
