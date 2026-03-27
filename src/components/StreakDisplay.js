import React from 'react';

function StreakDisplay({ currentStreak, longestStreak, isActive }) {
  const flameColour = isActive ? '#FF6B6B' : '#B2BEC3';
  const textColour = isActive ? '#2D3436' : '#636E72';

  return (
    <div className="flex items-center gap-2">
      <div className={`relative ${isActive && currentStreak >= 3 ? 'animate-pulse' : ''}`}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill={flameColour}>
          <path d="M12 23c-4.97 0-9-3.58-9-8 0-3.19 2.13-6.01 3.5-7.5.31-.34.85-.1.84.36-.07 2.67 1.86 4.54 3.16 5.34.36.22.8-.06.74-.47-.3-2.09.52-4.33 2.05-6.23.26-.33.76-.2.84.21.6 2.92 3.37 5.12 3.37 8.29 0 4.42-4.03 8-9 8z"/>
        </svg>
        {currentStreak > 0 && (
          <span className="absolute -top-1 -right-2 text-[10px] font-bold bg-white rounded-full px-1 shadow-sm" style={{ color: flameColour }}>
            {currentStreak}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-bold leading-tight" style={{ color: textColour }}>
          {currentStreak === 0 ? 'Start a streak!' :
           currentStreak === 1 ? '1 day streak' :
           `${currentStreak}-day streak!`}
        </p>
        {longestStreak > currentStreak && (
          <p className="text-[10px] text-[#636E72]">Best: {longestStreak} days</p>
        )}
      </div>
    </div>
  );
}

export default StreakDisplay;
