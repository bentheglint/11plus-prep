import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, Shield, CheckCircle2, ArrowLeft } from 'lucide-react';

const API_URL = process.env.REACT_APP_TUTOR_API_URL;
const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;

// loadStripe is idempotent — cached module-side so we don't re-request
// Stripe.js on every mount.
const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null;

// ── Checkout form (inside Elements provider) ──

function CheckoutForm({ onSuccess, onBack }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message);
      setSubmitting(false);
      return;
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/?subscribed=1',
      },
      redirect: 'if_required',
    });

    if (confirmError) {
      setError(confirmError.message);
      setSubmitting(false);
      return;
    }

    // No redirect needed — payment confirmed inline. Webhook will flip
    // D1 to subscription_status='active'. Small poll delay so the parent
    // can refetch fresh account data.
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PaymentElement options={{ layout: 'tabs' }} />

      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={!stripe || submitting}
        className={`w-full py-3 rounded-xl font-bold text-white transition-colors ${
          stripe && !submitting
            ? 'bg-[#7C3AED] hover:bg-[#5A4BD1]'
            : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        {submitting ? 'Processing…' : 'Subscribe — £15/month'}
      </button>

      <button
        type="button"
        onClick={onBack}
        className="w-full flex items-center justify-center gap-2 py-2 text-sm text-slate-500 hover:text-[#7C3AED]"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
    </form>
  );
}

// ── Top-level SubscribeScreen ──
//
// Two phases:
//   1. Creating subscription (Worker call to /api/stripe/subscribe)
//   2. Confirming payment (Stripe Elements with clientSecret)
//
// If the user already has a customer + incomplete sub, we reuse it
// client-side by re-calling subscribe (Worker returns the same secret).

export default function SubscribeScreen({ getToken, trialExpired, onSuccess, onBack }) {
  const [clientSecret, setClientSecret] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        if (!STRIPE_PUBLISHABLE_KEY) {
          throw new Error('Stripe publishable key not configured');
        }
        const token = await getToken();
        const res = await fetch(`${API_URL}/api/stripe/subscribe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
        if (!cancelled) setClientSecret(data.clientSecret);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [getToken]);

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
            ? 'Add a card to keep your child\u2019s progress and continue practising.'
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

        {/* Payment area */}
        {loading && (
          <div className="py-8 text-center text-slate-500 animate-pulse">Preparing checkout…</div>
        )}

        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm mb-4">
            {error}
          </div>
        )}

        {!loading && clientSecret && stripePromise && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: 'stripe',
                variables: {
                  colorPrimary: '#7C3AED',
                  colorBackground: '#ffffff',
                  colorText: '#1e293b',
                  borderRadius: '12px',
                  fontFamily: 'system-ui, sans-serif',
                },
              },
            }}
          >
            <CheckoutForm onSuccess={onSuccess} onBack={onBack} />
          </Elements>
        )}

        {/* Trust signals */}
        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-500">
          <Shield className="w-3.5 h-3.5" />
          <span>Secure payment by Stripe. Your card details never touch our servers.</span>
        </div>
      </div>
    </div>
  );
}
