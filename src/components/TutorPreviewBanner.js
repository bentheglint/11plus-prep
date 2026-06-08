import React, { useEffect } from 'react';
import { Eye, X } from 'lucide-react';

// Persistent banner shown while a tutor is exploring the pupil experience in
// preview mode. Rendered at the app root so it survives every per-view render
// in App.js. State is read from sessionStorage; entering/exiting preview is a
// reload, so this component always reflects the current flag at mount.
export default function TutorPreviewBanner() {
  let active = false;
  try { active = sessionStorage.getItem('tutor-preview') === '1'; } catch {}

  // Push page content down so the fixed bar never covers top-left back buttons.
  useEffect(() => {
    if (!active) return undefined;
    const prev = document.body.style.paddingTop;
    document.body.style.paddingTop = '44px';
    return () => { document.body.style.paddingTop = prev; };
  }, [active]);

  if (!active) return null;

  const exit = () => {
    try {
      sessionStorage.removeItem('tutor-preview');
      sessionStorage.setItem('tutor-landing', 'dashboard');
    } catch {}
    window.location.reload();
  };

  return (
    <div
      style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }}
      className="bg-[#7C3AED] text-white flex items-center justify-center gap-3 px-4 py-2.5 text-sm shadow-md"
    >
      <Eye className="w-4 h-4 flex-shrink-0" />
      <span className="font-medium text-center">
        Preview mode — this is what your pupils see. Nothing is saved.
      </span>
      <button
        onClick={exit}
        className="ml-1 flex items-center gap-1 bg-white/20 hover:bg-white/30 rounded-lg px-3 py-1 font-bold transition-colors flex-shrink-0"
      >
        <X className="w-3.5 h-3.5" /> Exit
      </button>
    </div>
  );
}
