import React, { useState } from 'react';
import { ArrowLeft, Flag, Check, X } from 'lucide-react';
import { getAllFlagStates, setFeatureFlag } from '../utils/featureFlags';

// FeatureFlagsScreen — inspect and toggle feature flags for this browser.
// Accessed via ?view=flags. Each row shows the effective value and where
// it was resolved from (url → localStorage → env → default).
//
// Toggles only affect the localStorage override. Env + URL precedence
// still wins. "Reset" clears the localStorage override for that flag.
export default function FeatureFlagsScreen({ onBack }) {
  const [version, setVersion] = useState(0); // bump to re-read state after toggling
  const flags = getAllFlagStates();

  const refresh = () => setVersion(v => v + 1);

  const sourceLabel = (src) => {
    if (src === 'url') return { text: 'URL param', class: 'bg-amber-50 text-amber-700 border-amber-200' };
    if (src === 'localStorage') return { text: 'Your override', class: 'bg-purple-50 text-purple-700 border-purple-200' };
    if (src === 'env') return { text: 'Build default', class: 'bg-blue-50 text-blue-700 border-blue-200' };
    return { text: 'Default (off)', class: 'bg-gray-50 text-gray-600 border-gray-200' };
  };

  return (
    <div className="app-bg p-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack} className="mb-4 flex items-center text-[#7C3AED] hover:text-[#5A4BD1] font-medium gap-2">
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <Flag className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="font-heading text-3xl font-extrabold text-slate-800">Feature Flags</h1>
            <p className="text-sm text-gray-500">Gate experimental features off the core path</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-sm text-amber-800">
          <strong>Scope:</strong> flag overrides saved here only affect this browser.
          URL params (e.g. <code className="bg-white px-1 rounded">?ff-gamification=true</code>) take precedence.
        </div>

        <div className="space-y-2" key={version}>
          {flags.map(flag => {
            const src = sourceLabel(flag.source);
            return (
              <div key={flag.name} className="card-elevated p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base font-bold text-slate-800 font-mono">{flag.name}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${src.class}`}>
                        {src.text}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{flag.description}</p>
                    <div className="flex items-center gap-1.5 text-sm">
                      {flag.value ? (
                        <><Check className="w-4 h-4 text-emerald-500" /><span className="font-medium text-emerald-700">Enabled</span></>
                      ) : (
                        <><X className="w-4 h-4 text-gray-400" /><span className="font-medium text-gray-600">Disabled</span></>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => { setFeatureFlag(flag.name, !flag.value); refresh(); }}
                      className="px-3 py-1.5 rounded-lg bg-[#7C3AED] text-white text-sm font-medium hover:bg-[#5A4BD1]"
                    >
                      {flag.value ? 'Disable' : 'Enable'}
                    </button>
                    {flag.source === 'localStorage' && (
                      <button
                        onClick={() => { setFeatureFlag(flag.name, null); refresh(); }}
                        className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium hover:bg-gray-200"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
