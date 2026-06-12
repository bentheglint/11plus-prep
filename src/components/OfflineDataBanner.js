import React, { useState } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

/**
 * OfflineDataBanner
 *
 * Shown on HomeScreen when the load path fell back to cache or failed entirely.
 * Designed for child users: calm, informational, never alarming.
 *
 * Props:
 *   loadState  — 'cache' | 'failed-no-cache' | 'server' | null
 *   onRetry    — callback to re-run the load
 */
function OfflineDataBanner({ loadState, onRetry }) {
  const [retrying, setRetrying] = useState(false);
  const [failedAgain, setFailedAgain] = useState(false);

  if (!loadState || loadState === 'server') return null;

  const isCacheState = loadState === 'cache';

  const heading = isCacheState
    ? 'Showing saved progress'
    : "We couldn't load your progress";

  const body = isCacheState
    ? "We couldn't reach the internet just now — everything you do still counts and will be saved."
    : 'Check the internet connection and tap Try again — nothing has been lost.';

  async function handleRetry() {
    if (retrying) return;
    setRetrying(true);
    setFailedAgain(false);
    try {
      await onRetry();
    } catch {
      // onRetry is fire-and-forget; we infer failure by watching loadState
    }
    // Brief delay so "Trying…" is visible before the button resets.
    // loadState updates async via the hook — if still not 'server' after 5s,
    // show the gentle inline message.
    setTimeout(() => {
      setRetrying(false);
      // If the parent re-renders with loadState 'server', the banner disappears.
      // If it stays on cache/failed-no-cache, show the gentle inline message.
      setFailedAgain(true);
    }, 5000);
  }

  const borderColour = isCacheState ? 'border-amber-300' : 'border-amber-400';
  const bgColour = isCacheState ? 'bg-amber-50' : 'bg-amber-50';
  const headingColour = isCacheState ? 'text-amber-800' : 'text-amber-900';
  const bodyColour = isCacheState ? 'text-amber-700' : 'text-amber-800';
  const iconColour = isCacheState ? 'text-amber-500' : 'text-amber-600';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-start gap-3 rounded-xl border ${borderColour} ${bgColour} px-4 py-3 mb-4`}
    >
      <WifiOff className={`w-5 h-5 mt-0.5 shrink-0 ${iconColour}`} aria-hidden="true" />
      <div className="flex-1 min-w-0">
        <p className={`font-heading font-bold text-sm ${headingColour}`}>{heading}</p>
        <p className={`text-sm mt-0.5 ${bodyColour}`}>{body}</p>
        {failedAgain && (
          <p className="text-sm mt-1 text-amber-700">
            Still can&rsquo;t connect &mdash; your progress is safe.
          </p>
        )}
      </div>
      <button
        onClick={handleRetry}
        disabled={retrying}
        aria-label="Try again"
        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${retrying ? 'animate-spin' : ''}`} aria-hidden="true" />
        {retrying ? 'Trying…' : 'Try again'}
      </button>
    </div>
  );
}

export default OfflineDataBanner;
