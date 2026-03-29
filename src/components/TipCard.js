import React from 'react';
import { Lightbulb } from 'lucide-react';

// Full-screen study tip card — beautiful, engaging, child-friendly
// Think flashcard meets poster: big emoji, punchy title, clear advice

function TipCard({ tip, index, total, onNext, onBack, isLast }) {
  if (!tip) return null;

  const { title, emoji, keyInsight, explanation, tryThis, colour, category } = tip;

  // Softer background gradient derived from accent colour
  const bgStyle = {
    background: `linear-gradient(135deg, ${colour}08 0%, ${colour}15 50%, ${colour}05 100%)`,
  };

  return (
    <div className="min-h-[80vh] flex flex-col" style={bgStyle}>
      {/* Category badge + counter */}
      <div className="flex items-center justify-between mb-6">
        <span
          className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full"
          style={{ background: `${colour}15`, color: colour }}
        >
          {category}
        </span>
        <span className="text-xs text-[#636E72] font-medium">
          {index + 1} of {total}
        </span>
      </div>

      {/* Big emoji — the visual hook */}
      <div className="text-center mb-4">
        <span className="text-6xl leading-none">{emoji}</span>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-heading font-bold text-[#2D3436] text-center mb-6 px-2">
        {title}
      </h2>

      {/* Key insight — highlighted callout */}
      <div
        className="rounded-2xl p-5 mb-5 border-2"
        style={{ borderColor: `${colour}30`, background: `${colour}08` }}
      >
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: colour }} />
          <p className="text-base font-semibold text-[#2D3436] leading-relaxed">
            {keyInsight}
          </p>
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-white rounded-2xl p-5 mb-5 shadow-sm border border-gray-100">
        <p className="text-sm text-[#4A5568] leading-relaxed">
          {explanation}
        </p>
      </div>

      {/* Try this! — action step */}
      <div
        className="rounded-2xl p-5 mb-6"
        style={{ background: `${colour}12` }}
      >
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: colour }}>
          Try this! 👇
        </p>
        <p className="text-sm font-medium text-[#2D3436] leading-relaxed">
          {tryThis}
        </p>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Navigation */}
      <div className="flex items-center gap-3 mt-auto">
        {index > 0 && (
          <button
            onClick={onBack}
            className="px-5 py-3 text-sm font-bold text-[#636E72] hover:text-[#2D3436] transition-colors"
          >
            ← Previous
          </button>
        )}
        <div className="flex-1" />
        <button
          onClick={onNext}
          className="px-8 py-3 text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg"
          style={{ background: colour }}
        >
          {isLast ? 'Done!' : 'Next Tip →'}
        </button>
      </div>
    </div>
  );
}

export default TipCard;
