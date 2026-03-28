import React from 'react';

function AchievementModal({ achievement, onDismiss }) {
  if (!achievement) return null;

  const Icon = achievement.icon;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onDismiss}>
      <div
        className="bg-white rounded-2xl p-8 max-w-sm w-full text-center animate-fade-in-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Confetti-style decorative dots */}
        <div className="relative mb-4">
          <div className="absolute -top-2 left-1/4 w-2 h-2 rounded-full bg-[#FDCB6E] animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="absolute -top-3 right-1/3 w-1.5 h-1.5 rounded-full bg-[#FF6B6B] animate-bounce" style={{ animationDelay: '100ms' }} />
          <div className="absolute top-0 left-1/3 w-1.5 h-1.5 rounded-full bg-[#00B894] animate-bounce" style={{ animationDelay: '200ms' }} />
          <div className="absolute -top-1 right-1/4 w-2 h-2 rounded-full bg-[#6C5CE7] animate-bounce" style={{ animationDelay: '150ms' }} />

          <div
            className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center shadow-lg"
            style={{ background: `linear-gradient(135deg, ${achievement.colour}, ${achievement.colour}CC)` }}
          >
            {Icon && <Icon className="w-10 h-10 text-white" />}
          </div>
        </div>

        <p className="text-sm font-bold text-[#6C5CE7] uppercase tracking-wider mb-1">Achievement Unlocked!</p>
        <h2 className="text-2xl font-heading font-bold text-[#2D3436] mb-2">{achievement.name}</h2>
        <p className="text-[#636E72] mb-6">{achievement.description}</p>

        <button
          onClick={onDismiss}
          className="px-8 py-3 btn-primary text-lg"
        >
          Amazing!
        </button>
      </div>
    </div>
  );
}

export default AchievementModal;
