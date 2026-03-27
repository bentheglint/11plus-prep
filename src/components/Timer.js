import React, { useState, useEffect, useRef } from 'react';

function Timer({ totalSeconds, onTimeUp, className }) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const intervalRef = useRef(null);
  const hasExpired = useRef(false);

  useEffect(() => {
    setRemaining(totalSeconds);
    hasExpired.current = false;
  }, [totalSeconds]);

  useEffect(() => {
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

    return () => clearInterval(intervalRef.current);
  }, [totalSeconds, onTimeUp]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const isWarning = remaining <= 300 && remaining > 60; // last 5 minutes
  const isUrgent = remaining <= 60; // last minute

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
