import React from 'react';
import { Star, TrendingUp, TrendingDown, Minus, RotateCcw } from 'lucide-react';

function TopicStarRating({ stars, label, trend, daysSince, compact = false }) {
  const trendIcon = trend?.direction === 'up' ? TrendingUp :
                    trend?.direction === 'down' ? TrendingDown : Minus;
  const TrendIcon = trendIcon;
  const trendColour = trend?.direction === 'up' ? '#22C55E' :
                      trend?.direction === 'down' ? '#FF6B6B' : '#B2BEC3';
  const needsReview = daysSince > 14 && stars > 0;

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(i => (
          <Star key={i} className="w-3.5 h-3.5" fill={i <= stars ? '#FDCB6E' : 'none'} stroke={i <= stars ? '#F59E0B' : '#DFE6E9'} strokeWidth={2} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <Star key={i} className="w-4 h-4" fill={i <= stars ? '#FDCB6E' : 'none'} stroke={i <= stars ? '#F59E0B' : '#DFE6E9'} strokeWidth={2} />
        ))}
      </div>
      {label && <span className="text-xs font-medium text-slate-500">{label}</span>}
      {trend && trend.direction !== 'stable' && (
        <TrendIcon className="w-3.5 h-3.5" style={{ color: trendColour }} />
      )}
      {needsReview && (
        <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
          <RotateCcw className="w-2.5 h-2.5" />
          Review
        </span>
      )}
    </div>
  );
}

export default TopicStarRating;
