import React, { useState } from 'react';
import { useClerk } from '@clerk/clerk-react';
import { CheckCircle2, LogOut, Mail, Shield, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';

const API_URL = process.env.REACT_APP_TUTOR_API_URL;

const FEATURES = [
  'Thousands of GL-pattern questions across Maths, English and Verbal Reasoning',
  'Hundreds of micro-lessons that teach the method before every quiz, not after',
  'AI Tutor on every quiz and lesson — your child asks, it explains',
  'Quiz Review with AI Tutor — go over every wrong answer with a tutor that talks them through it',
  'Mock tests — timed, full-paper, marked instantly with detailed feedback',
  'Parent dashboard — see exactly where your child is strong, where they\'re stuck, and what to work on next',
  'My Mistakes — every wrong answer in one place, tap any to practise again',
  'Mastery tracking, streaks, and prep points',
];

const COMPARISON = [
  ['All GL subjects (Maths, English, VR)', true, true],
  ['Mock tests', true, true],
  ['Progress tracking', true, true],
  ['AI Tutor on every screen', true, false],
  ['Teaches the method before every quiz', true, false],
  ['Talks through every wrong answer with your child', true, false],
];

const FAQS = [
  {
    q: 'What happens when I subscribe?',
    a: "You'll get immediate full access. We'll charge your card today, then monthly or annually from that date. You can cancel any time from your account page.",
  },
  {
    q: 'Can I cancel?',
    a: "Any time, from your account page. If you cancel mid-period, you'll keep access until the end of the period you've paid for.",
  },
  {
    q: 'I have two children sitting the 11+ — can I add them?',
    a: "Not on the standard plan yet — each subscription covers one child. Email us at hello@prepstep.co.uk and we'll sort something out.",
  },
  {
    q: 'My child gets Free School Meals — is there free access?',
    a: 'Yes. PrepStep is free for families on Free School Meals or Pupil Premium. See the section below, or email hello@prepstep.co.uk.',
  },
  {
    q: 'What about Verbal Reasoning?',
    a: 'Fully covered. Every VR question type: synonyms, antonyms, letter codes, number series, hidden words, and the rest.',
  },
  {
    q: 'What about CEM or Pre-Test exams?',
    a: 'PrepStep is GL Assessment-specific. CEM and Pre-Test prep is on our roadmap for 2027.',
  },
  {
    q: 'What is the GL Assessment?',
    a: 'The GL Assessment is the most widely used 11+ test in England, used by grammar schools across Berkshire, Buckinghamshire, Birmingham, Essex, Kent, Lincolnshire, and Dorset, among others.',
  },
  {
    q: "Is this for state schools too?",
    a: "Yes — PrepStep is built for any child sitting the GL Assessment 11+, whatever school they're at now.",
  },
];

export default function SubscribeScreen({ getToken, trialExpired, onBack }) {
  const { signOut } = useClerk();
  const [plan, setPlan] = useState('annual');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

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
        body: JSON.stringify({ returnUrl: window.location.origin + '/', plan }),
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

  const isAnnual = plan === 'annual';

  return (
    <div className="min-h-screen bg-[#F8F7FF]">
      {/* Top bar — escape routes always visible */}
      <div className="flex justify-between items-center px-4 py-3 bg-white border-b border-slate-100 sticky top-0 z-10">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-[#7C3AED] transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
        ) : (
          <img src="/logo.svg" alt="PrepStep" className="h-7" />
        )}
        <div className="flex items-center gap-4">
          <a
            href="mailto:hello@prepstep.co.uk?subject=PrepStep%20support"
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#7C3AED] transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span className="hidden sm:inline">Need help?</span>
          </a>
          <button
            type="button"
            onClick={() => signOut({ redirectUrl: window.location.origin + '/' })}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#7C3AED] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-800 mb-3 leading-tight">
            {trialExpired
              ? 'Your 30-day trial has ended.'
              : 'The 11+ prep app that actually teaches.'}
          </h1>
          <p className="text-slate-500 text-base max-w-md mx-auto">
            {trialExpired
              ? "Subscribe to keep your child's progress and continue practising."
              : 'We teach the method first, then practise it, with a patient tutor on hand whenever your child gets stuck.'}
          </p>
        </div>

        {/* Plan picker + CTA */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
          <div className="flex gap-3 mb-5">
            {/* Annual */}
            <button
              type="button"
              onClick={() => setPlan('annual')}
              className={`flex-1 rounded-xl border-2 p-4 text-left transition-colors ${
                isAnnual ? 'border-[#7C3AED] bg-[#F8F7FF]' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-800 text-sm">Annual</span>
                <span className="text-xs font-bold text-white bg-[#22C55E] rounded-full px-2 py-0.5">Best value</span>
              </div>
              <div className="text-2xl font-bold text-[#7C3AED]">
                £199 <span className="text-sm font-normal text-slate-500">/year</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">Save £101, over four months free</div>
            </button>

            {/* Monthly */}
            <button
              type="button"
              onClick={() => setPlan('monthly')}
              className={`flex-1 rounded-xl border-2 p-4 text-left transition-colors ${
                !isAnnual ? 'border-[#7C3AED] bg-[#F8F7FF]' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="font-bold text-slate-800 text-sm block mb-1">Monthly</span>
              <div className="text-2xl font-bold text-[#7C3AED]">
                £24.99 <span className="text-sm font-normal text-slate-500">/month</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">Cancel any time</div>
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm mb-4">{error}</div>
          )}

          <button
            type="button"
            onClick={handleSubscribe}
            disabled={submitting}
            className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-colors ${
              submitting ? 'bg-slate-300 cursor-not-allowed' : 'bg-[#7C3AED] hover:bg-[#5A4BD1]'
            }`}
          >
            {submitting
              ? 'Redirecting to secure checkout…'
              : isAnnual
              ? 'Subscribe for £199/year'
              : 'Subscribe for £24.99/month'}
          </button>

          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-500">
            <Shield className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Secure payment by Stripe. Your card details never touch our servers.</span>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
          <h2 className="font-heading font-bold text-slate-800 mb-1">Everything included</h2>
          <p className="text-sm text-slate-500 mb-4">One price. Every feature. Every subject.</p>
          <ul className="space-y-3">
            {FEATURES.map((f, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Comparison table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
          <h2 className="font-heading font-bold text-slate-800 mb-1">How we compare</h2>
          <p className="text-sm text-slate-500 mb-4">
            Atom Exam Prep Plus is the closest comparable product on the market.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[400px]">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-2 font-medium text-slate-400 pr-4"></th>
                  <th className="text-center py-2 font-bold text-[#7C3AED] px-3">PrepStep</th>
                  <th className="text-center py-2 font-medium text-slate-400 px-3">Atom Exam Prep Plus</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map(([label, us, them], i) => (
                  <tr key={i} className="border-b border-slate-50">
                    <td className="py-2.5 text-slate-700 pr-4">{label}</td>
                    <td className="py-2.5 text-center text-[#22C55E] font-bold px-3">{us ? '✓' : '✗'}</td>
                    <td className="py-2.5 text-center text-slate-400 px-3">{them ? '✓' : '✗'}</td>
                  </tr>
                ))}
                <tr className="border-b border-slate-50">
                  <td className="py-2.5 text-slate-700 font-medium pr-4">Annual price</td>
                  <td className="py-2.5 text-center font-bold text-[#7C3AED] px-3">£199</td>
                  <td className="py-2.5 text-center text-slate-400 px-3">£671.90</td>
                </tr>
                <tr>
                  <td className="py-2.5 text-slate-700 font-medium pr-4">Monthly price</td>
                  <td className="py-2.5 text-center font-bold text-[#7C3AED] px-3">£24.99</td>
                  <td className="py-2.5 text-center text-slate-400 px-3">£69.99</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 mt-3">Prices verified May 2026.</p>
        </div>

        {/* Founder note */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
          <h2 className="font-heading font-bold text-slate-800 mb-4">Why we built PrepStep</h2>
          <p className="text-slate-700 text-sm leading-relaxed">
            I've been through the 11+ as a parent, and spent years looking closely at how these exams work. One thing stands out: the questions fall into a set of recurring patterns, and every child is strong at some and quietly losing marks on others. The whole game is finding exactly where a child is losing marks, and learning how to turn those areas around.
          </p>
          <p className="text-slate-700 text-sm leading-relaxed mt-3">
            That is the hard part, and it is where most prep falls down. Books and apps drill away without pinpointing the weak spots or teaching a way through them. And when a child gets something wrong, they need someone there to explain why, so they can fix it. Parents cannot sit alongside every session, and a tutor, as good as they are, is an hour a week and expensive.
          </p>
          <p className="text-slate-700 text-sm leading-relaxed mt-3">
            PrepStep is built to close that gap. It surfaces where a child is losing marks, teaches the method behind each one, and has a patient tutor built in to explain any answer, any time. We built the 11+ tool we always wished existed, and we built it properly.
          </p>
          <p className="text-slate-700 text-sm font-medium mt-3">Ben, founder of PrepStep</p>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
          <h2 className="font-heading font-bold text-slate-800 mb-4">Frequently asked questions</h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className="border border-slate-100 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors gap-3"
                >
                  <span className="font-medium text-slate-800 text-sm">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-sm text-slate-500 leading-relaxed">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* FSM / Pupil Premium */}
        <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-5 mb-8 text-center">
          <p className="text-sm font-medium text-[#15803D] mb-1">
            Free for families on Free School Meals or Pupil Premium.
          </p>
          <p className="text-xs text-[#16A34A]">
            Full access until exam day. Email{' '}
            <a
              href="mailto:hello@prepstep.co.uk?subject=FSM%2FPupil%20Premium%20access"
              className="underline"
            >
              hello@prepstep.co.uk
            </a>{' '}
            with proof of eligibility and we'll set you up. No catch.
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 pb-8">
          Made in Bournemouth. Built by a parent.
          <span className="mx-2">·</span>
          <a href="/terms.html" className="underline hover:text-[#7C3AED]">Terms</a>
          <span className="mx-2">·</span>
          <a href="/privacy.html" className="underline hover:text-[#7C3AED]">Privacy</a>
          <span className="mx-2">·</span>
          <a href="mailto:hello@prepstep.co.uk" className="underline hover:text-[#7C3AED]">Contact</a>
        </p>
      </div>
    </div>
  );
}
