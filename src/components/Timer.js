import React, { useState, useEffect, useRef } from 'react';

function Timer({ totalSeconds, onTimeUp, mode = 'countdown', resetKey, className, paused = false, startFrom = 0, onTick }) {
  const [remaining, setRemaining] = useState(mode === 'elapsed' ? startFrom : totalSeconds);
  const intervalRef = useRef(null);
  const hasExpired = useRef(false);

  useEffect(() => {
    if (mode === 'countdown') {
      setRemaining(totalSeconds);
      hasExpired.current = false;
    }
  }, [totalSeconds, mode]);

  // Reset elapsed timer when resetKey changes (e.g. for per-question timing)
  useEffect(() => {
    if (mode === 'elapsed' && resetKey !== undefined) {
      setRemaining(0);
    }
  }, [resetKey, mode]);

  useEffect(() => {
    if (mode === 'countdown') {
      intervalRef.current = setInterval(() => {
        setRemaining(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            if (!hasExpired.current) {
              hasExpired.current = true;
              setTimeout(() => onTimeUp(), 0);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Elapsed mode: count up, but pause when paused prop is true
      if (!paused) {
        intervalRef.current = setInterval(() => {
          setRemaining(prev => {
            const next = prev + 1;
            if (onTick) onTick(next);
            return next;
          });
        }, 1000);
      }
    }

    return () => clearInterval(intervalRef.current);
  }, [totalSeconds, onTimeUp, mode, resetKey, paused]);

  const displaySeconds = remaining;
  const minutes = Math.floor(displaySeconds / 60);
  const seconds = displaySeconds % 60;

  if (mode === 'elapsed') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-[#636E72] font-mono font-medium text-sm ${className || ''}`}>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
      </div>
    );
  }

  // Countdown mode (original behaviour)
  const isWarning = remaining <= 300 && remaining > 60;
  const isUrgent = remaining <= 60;

  const bgColor = isUrgent
    ? 'bg-red-500 text-white animate-pulse'
    : isWarning
    ? 'bg-amber-100 text-amber-800 border-amber-300'
    : 'bg-white/90 text-[#2D3436] border-gray-200';

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-mono font-bold text-lg ${bgColor} ${className || ''}`}>
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}

export default Timer;
