import { useState, useEffect } from 'react';

const STORAGE_KEY = 'cookie_notice_dismissed';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 flex justify-center pointer-events-none">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-lg px-5 py-3.5 max-w-lg w-full flex items-center gap-4 pointer-events-auto">
        <p className="text-sm text-slate-600 flex-1">
          We use essential cookies to keep you signed in.{' '}
          <a href="/privacy" className="text-[#7C3AED] underline underline-offset-2">
            Learn more
          </a>
        </p>
        <button
          onClick={dismiss}
          className="shrink-0 text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#5A4BD1] px-4 py-1.5 rounded-xl transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  );
}
