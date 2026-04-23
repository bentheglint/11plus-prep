import React, { useEffect, useState } from 'react';

// AppLoader — defers loading the three question-data modules (maths, English,
// verbal reasoning) until after Clerk auth + account check pass. Each module
// is ~1–2 MB minified. Static imports would put all three in the main bundle.
// Dynamic import() tells Webpack to emit each as its own chunk, so first paint
// renders with a tiny main bundle and the data streams in alongside.
//
// Chunks cache aggressively on Cloudflare Pages (content-hashed filenames +
// immutable Cache-Control from public/_headers), so after the first visit
// the data loads from the browser cache instantly.

export default function AppLoader({ App, ...appProps }) {
  const [loadedData, setLoadedData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      import(/* webpackChunkName: "maths-data" */ '../questionData/mathsData'),
      import(/* webpackChunkName: "english-data" */ '../questionData/englishData'),
      import(/* webpackChunkName: "vr-data" */ '../questionData/vrData'),
    ])
      .then(([maths, english, vr]) => {
        if (cancelled) return;
        setLoadedData({
          maths: maths.default,
          english: english.default,
          verbalreasoning: vr.default,
        });
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      });

    return () => { cancelled = true; };
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F8F7FF] to-white flex items-center justify-center p-4">
        <div className="max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
          <p className="text-red-500 font-bold mb-4">Couldn\u2019t load question data</p>
          <p className="text-slate-500 text-sm mb-4">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#7C3AED] text-white rounded-xl font-bold"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!loadedData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F8F7FF] to-white flex items-center justify-center">
        <div className="animate-pulse text-[#7C3AED] font-heading font-bold text-xl">
          Loading questions\u2026
        </div>
      </div>
    );
  }

  return <App {...appProps} loadedData={loadedData} />;
}
