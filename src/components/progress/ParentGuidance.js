import React, { useState, useMemo } from 'react';
import { BookOpen, ChevronDown, ChevronRight, ArrowLeft } from 'lucide-react';

// Category display config
const categoryConfig = {
  'How to Praise & Respond': { colour: '#6C5CE7', icon: '💬' },
  'Understanding How Practice Works': { colour: '#0770C2', icon: '🧠' },
  'Managing Anxiety': { colour: '#007D62', icon: '🌱' },
  'Sleep, Exercise & Downtime': { colour: '#FF6B6B', icon: '😴' },
};

function GuideCard({ guide, onClose }) {
  const config = categoryConfig[guide.category] || { colour: '#6C5CE7', icon: '📖' };

  return (
    <div className="">
      {onClose && (
        <button
          onClick={onClose}
          className="flex items-center text-[#6C5CE7] hover:text-[#5A4BD1] font-medium gap-1 text-sm mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to guides
        </button>
      )}
      <div className="bg-white rounded-xl border-2 p-5" style={{ borderColor: `${config.colour}30` }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wide" style={{ color: config.colour }}>
            {guide.category}
          </span>
        </div>
        <h4 className="font-heading font-bold text-lg text-slate-800 mb-3">{guide.title}</h4>
        <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">{guide.body}</div>
        {guide.researchNote && (
          <p className="mt-4 text-xs text-slate-500 italic border-t border-gray-100 pt-3">
            {guide.researchNote}
          </p>
        )}
      </div>
    </div>
  );
}

function ParentGuidance({ guides, mastery, userData }) {
  const [browsing, setBrowsing] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);

  // Select the most relevant featured guide based on context
  const featuredGuide = useMemo(() => {
    if (!guides || guides.length === 0) return null;

    // Check contextual triggers
    const topicPerformance = userData?.topicPerformance || {};
    const practiceLog = userData?.practiceLog || [];

    // Check for low-scoring topics (any topic below 50%)
    const hasLowScore = Object.values(topicPerformance).some(
      t => t.total >= 5 && (t.correct / t.total) < 0.5
    );

    // Check for high-scoring topics (any topic above 90%)
    const hasHighScore = Object.values(topicPerformance).some(
      t => t.total >= 10 && (t.correct / t.total) > 0.9
    );

    // Check for inactivity (no practice in last 5 days)
    const lastPractice = practiceLog.length > 0
      ? new Date(practiceLog[practiceLog.length - 1].date).getTime()
      : 0;
    const daysSincePractice = lastPractice > 0
      ? (Date.now() - lastPractice) / (1000 * 60 * 60 * 24)
      : Infinity;
    const isInactive = daysSincePractice > 5;

    // Check for recent mock test
    const mockHistory = userData?.mockTestHistory || [];
    const recentMock = mockHistory.length > 0 &&
      (Date.now() - new Date(mockHistory[mockHistory.length - 1].date).getTime()) < (2 * 24 * 60 * 60 * 1000);

    // Priority: mock-complete > low-score > inactivity > high-score > first-visit > null
    let trigger = null;
    if (recentMock) trigger = 'mock-complete';
    else if (hasLowScore) trigger = 'low-score';
    else if (isInactive) trigger = 'inactivity';
    else if (hasHighScore) trigger = 'high-score';

    // Find a guide matching the trigger
    if (trigger) {
      const matching = guides.filter(g => g.contextTrigger === trigger);
      if (matching.length > 0) {
        return matching[Math.floor(Math.random() * matching.length)];
      }
    }

    // Check first-visit
    const firstVisit = guides.find(g => g.contextTrigger === 'first-visit');
    if (firstVisit && Object.keys(topicPerformance).length < 3) {
      return firstVisit;
    }

    // Fallback: random guide
    return guides[Math.floor(Math.random() * guides.length)];
  }, [guides, userData]);

  // Group guides by category for browsing
  const groupedGuides = useMemo(() => {
    const groups = {};
    (guides || []).forEach(g => {
      if (!groups[g.category]) groups[g.category] = [];
      groups[g.category].push(g);
    });
    return groups;
  }, [guides]);

  if (!guides || guides.length === 0) return null;

  // Full guide view
  if (selectedGuide) {
    return (
      <div className="card-elevated p-5 mb-6">
        <GuideCard guide={selectedGuide} onClose={() => setSelectedGuide(null)} />
      </div>
    );
  }

  // Browse all view
  if (browsing) {
    return (
      <div className="card-elevated p-5 mb-6">
        <button
          onClick={() => setBrowsing(false)}
          className="flex items-center text-[#6C5CE7] hover:text-[#5A4BD1] font-medium gap-1 text-sm mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-[#6C5CE7]" />
          <h3 className="font-heading font-bold text-slate-800">All Parent Guides</h3>
        </div>

        <div className="space-y-2">
          {Object.entries(groupedGuides).map(([category, categoryGuides]) => {
            const config = categoryConfig[category] || { colour: '#6C5CE7', icon: '📖' };
            const isExpanded = expandedCategory === category;

            return (
              <div key={category} className="rounded-xl border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setExpandedCategory(isExpanded ? null : category)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{config.icon}</span>
                    <span className="font-heading font-bold text-sm text-slate-800">{category}</span>
                    <span className="text-xs text-slate-500">({categoryGuides.length})</span>
                  </div>
                  {isExpanded
                    ? <ChevronDown className="w-4 h-4 text-slate-500" />
                    : <ChevronRight className="w-4 h-4 text-slate-500" />
                  }
                </button>
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50">
                    {categoryGuides.map(guide => (
                      <button
                        key={guide.id}
                        onClick={() => { setSelectedGuide(guide); setBrowsing(false); }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <p className="text-sm font-medium text-slate-800">{guide.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{guide.summary}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Default: featured guide + browse link
  return (
    <div className="card-elevated p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#6C5CE7]" />
          <h3 className="font-heading font-bold text-slate-800">Parent Guidance</h3>
        </div>
        <button
          onClick={() => setBrowsing(true)}
          className="text-xs font-bold text-[#6C5CE7] hover:text-[#5A4BD1] transition-colors"
        >
          Browse all guides ({guides.length})
        </button>
      </div>

      <p className="text-sm text-slate-500 mb-4">Evidence-based advice to support your child's preparation:</p>

      {featuredGuide && (
        <button
          onClick={() => setSelectedGuide(featuredGuide)}
          className="w-full text-left"
        >
          <GuideCard guide={featuredGuide} />
        </button>
      )}
    </div>
  );
}

export default ParentGuidance;
