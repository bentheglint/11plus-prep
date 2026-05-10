import React, { useState } from 'react';
import { useClerk } from '@clerk/clerk-react';
import { CreditCard, Shield, CheckCircle2, LogOut, Mail } from 'lucide-react';

const API_URL = process.env.REACT_APP_TUTOR_API_URL;

// Subscribe screen — kicks off Stripe Checkout (hosted page).
// User clicks Subscribe → POST to Worker → Worker creates Checkout Session
// → frontend redirects to session.url → user pays on Stripe → Stripe
// redirects back to APP_URL?subscribed=1 → AuthGate re-fetches account.
//
// Escape routes for users who don't want to subscribe right now:
//   - Sign out → returns to landing page (can sign in as a different account)
//   - Email support → for refund/cancellation/access questions
export default function SubscribeScreen({ getToken, trialExpired }) {
  const { signOut } = useClerk();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubscribe = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/stripe/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ returnUrl: window.location.origin + '/' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
      if (!data.url) throw new Error('Stripe did not return a checkout URL');

      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F7FF] to-white flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="w-14 h-14 rounded-2xl bg-[#7C3AED] flex items-center justify-center mb-5">
          <CreditCard className="w-7 h-7 text-white" />
        </div>

        <h1 className="font-heading text-2xl font-bold text-slate-800 mb-2">
          {trialExpired ? 'Your free week is over' : 'Subscribe to keep going'}
        </h1>
        <p className="text-slate-500 mb-6">
          {trialExpired
            ? 'Add a card to keep your child’s progress and continue practising.'
            : 'Get unlimited access to all 6,682 questions and the AI tutor.'}
        </p>

        {/* What's included */}
        <div className="bg-[#F8F7FF] rounded-xl p-4 mb-6 space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
            <span>All three subjects — maths, English, verbal reasoning</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
            <span>AI tutor on every question</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
            <span>Mock tests + progress tracking</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
            <span>Cancel any time — 14-day refund guarantee</span>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm mb-4">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleSubscribe}
          disabled={submitting}
          className={`w-full py-3 rounded-xl font-bold text-white transition-colors ${
            !submitting
              ? 'bg-[#7C3AED] hover:bg-[#5A4BD1]'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          {submitting ? 'Redirecting to secure checkout…' : 'Subscribe — £30/month'}
        </button>

        {/* Escape routes */}
        <div className="mt-5 pt-5 border-t border-slate-100 flex flex-col sm:flex-row gap-3 justify-between">
          <a
            href="mailto:hello@prepstep.co.uk?subject=PrepStep%20support"
            className="flex items-center justify-center gap-2 py-2 text-sm text-slate-500 hover:text-[#7C3AED]"
          >
            <Mail className="w-4 h-4" /> Need help?
          </a>
          <button
            type="button"
            onClick={() => signOut({ redirectUrl: window.location.origin + '/' })}
            className="flex items-center justify-center gap-2 py-2 text-sm text-slate-500 hover:text-[#7C3AED]"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>

        {/* Trust signals */}
        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-500">
          <Shield className="w-3.5 h-3.5" />
          <span>Secure payment by Stripe. Your card details never touch our servers.</span>
        </div>
      </div>
    </div>
  );
}
