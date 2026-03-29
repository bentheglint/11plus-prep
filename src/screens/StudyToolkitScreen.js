import React, { useState, useMemo } from 'react';
import { ArrowLeft, Lightbulb, Sparkles } from 'lucide-react';
import TipCard from '../components/TipCard';

function StudyToolkitScreen({ subject, tips, seenTips, onMarkSeen, onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(true);

  const subjectNames = { maths: 'Maths', english: 'English', verbalreasoning: 'Verbal Reasoning' };
  const subjectColours = { maths: '#0984E3', english: '#00B894', verbalreasoning: '#6C5CE7' };
  const colour = subjectColours[subject] || '#6C5CE7';
  const subjectName = subjectNames[subject] || 'General';

  // Filter tips for this subject + general tips, unseen first
  const availableTips = useMemo(() => {
    const subjectTips = (tips || []).filter(t => t.subject === subject || t.subject === 'general');
    const seenSet = new Set(seenTips || []);

    // Unseen first, then seen (least recently seen first)
    const unseen = subjectTips.filter(t => !seenSet.has(t.id));
    const seen = subjectTips.filter(t => seenSet.has(t.id));

    return [...unseen, ...seen];
  }, [tips, subject, seenTips]);

  const unseenCount = useMemo(() => {
    const seenSet = new Set(seenTips || []);
    return availableTips.filter(t => !seenSet.has(t.id)).length;
  }, [availableTips, seenTips]);

  const currentTip = availableTips[currentIndex];

  const handleNext = () => {
    // Mark current tip as seen
    if (currentTip && onMarkSeen) {
      onMarkSeen(currentTip.id);
    }
    if (currentIndex < availableTips.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onBack();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Intro screen
  if (showIntro) {
    return (
      <div className="app-bg p-4 min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto text-center animate-fade-in-up">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, ${colour}, ${colour}CC)` }}>
            <Lightbulb className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-heading font-bold text-[#2D3436] mb-3">
            {subjectName} Study Toolkit
          </h2>
          <p className="text-lg text-[#636E72] mb-2">
            Tips, tricks, and strategies to help you ace the exam!
          </p>
          {unseenCount > 0 ? (
            <div className="flex items-center justify-center gap-2 mb-8">
              <Sparkles className="w-5 h-5" style={{ color: colour }} />
              <p className="text-sm font-bold" style={{ color: colour }}>
                {unseenCount} new tip{unseenCount !== 1 ? 's' : ''} to discover!
              </p>
            </div>
          ) : (
            <p className="text-sm text-[#636E72] mb-8">
              You've seen all the tips — time to review your favourites!
            </p>
          )}
          <button
            onClick={() => setShowIntro(false)}
            className="px-10 py-4 text-white font-bold rounded-xl text-lg transition-all shadow-lg hover:shadow-xl"
            style={{ background: colour }}
          >
            Show Me Tips! ✨
          </button>
          <button
            onClick={onBack}
            className="block mx-auto mt-4 text-sm text-[#636E72] hover:text-[#2D3436]"
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  if (!currentTip) {
    return (
      <div className="app-bg p-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-[#636E72]">No tips available yet!</p>
          <button onClick={onBack} className="mt-4 px-6 py-3 btn-primary">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-bg p-4 min-h-screen">
      <div className="max-w-lg mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center text-[#6C5CE7] hover:text-[#5A4BD1] font-medium gap-1 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4" style={{ color: colour }} />
            <span className="text-xs font-bold text-[#636E72]">Study Toolkit</span>
          </div>
        </div>

        {/* Tip card */}
        <div className="animate-fade-in-up">
          <TipCard
            tip={currentTip}
            index={currentIndex}
            total={availableTips.length}
            onNext={handleNext}
            onBack={handlePrev}
            isLast={currentIndex === availableTips.length - 1}
          />
        </div>
      </div>
    </div>
  );
}

export default StudyToolkitScreen;
