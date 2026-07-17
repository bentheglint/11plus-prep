import React, { useState } from 'react';

const API_URL = process.env.REACT_APP_TUTOR_API_URL;

// The label text is what a parent reads; the value is what routes/account.js
// validates against (HEARD_ABOUT_VALUES) and what the admin tally groups by.
const OPTIONS = [
  { value: 'progress-card', label: 'Another parent shared a progress card' },
  { value: 'tutor', label: "My child's tutor" },
  { value: 'search-or-ai', label: 'Search or an AI answer' },
  { value: 'word-of-mouth', label: 'Word of mouth' },
  { value: 'other', label: 'Somewhere else' },
];

// ── Parent Dashboard — "How did you hear about PrepStep?" ──
// plans/shareable-progress-card.md (growth loop 2 — catches the screenshot
// shares a /card pageview can never see, since a screenshot carries no
// link). Dismissible one-tap chip row, PARENT dashboard only, first visit
// only — never a modal, never in onboarding, never the child view
// (adversarial review outcome #6; this repo has prior form on post-signup
// interstitials going wrong, so this deliberately isn't one).
//
// Renders nothing once `heardAbout` is non-null. That covers both a real
// answer AND the quiet "No thanks" dismiss — both persist through the SAME
// one-shot server endpoint (POST /api/account/heard-about; 'dismissed' is a
// validated sentinel value, see routes/account.js), so "gone forever" is
// durable across devices, not just a local flag that a cleared browser or a
// second device would forget.
function HeardAboutChip({ heardAbout, getToken, onAnswered }) {
  const [thanked, setThanked] = useState(false);
  const [busy, setBusy] = useState(false);

  if (heardAbout) return null;

  async function submit(value) {
    if (busy) return;
    setBusy(true);
    try {
      if (getToken && API_URL) {
        const token = await getToken();
        await fetch(`${API_URL}/api/account/heard-about`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ value }),
        });
      }
    } catch (_) {
      // Best-effort — CLAUDE.md no-em-dash copy rule aside, a failed network
      // call here just means the chip may resurface next visit. It never
      // blocks the local thank-you state, and never throws into the caller.
    } finally {
      setBusy(false);
      setThanked(true);
      if (onAnswered) onAnswered(value);
    }
  }

  if (thanked) {
    return (
      <div className="mt-6 px-4 py-3 rounded-xl bg-[#F5F2FF] text-sm text-[#5A4BD1] font-medium">
        Thanks for letting us know.
      </div>
    );
  }

  return (
    <div className="mt-6 p-4 rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
        <p className="text-sm font-semibold text-slate-700">How did you hear about PrepStep?</p>
        <button
          type="button"
          onClick={() => submit('dismissed')}
          disabled={busy}
          className="text-xs text-slate-400 hover:text-slate-600 disabled:opacity-50"
        >
          No thanks
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {OPTIONS.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => submit(opt.value)}
            disabled={busy}
            className="text-xs font-medium px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:border-[#7C3AED] hover:text-[#7C3AED] transition-colors disabled:opacity-50"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default HeardAboutChip;
