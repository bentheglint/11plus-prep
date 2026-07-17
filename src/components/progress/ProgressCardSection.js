import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Share2, Download, Copy, Check } from 'lucide-react';
import { deriveProgressCardData, shouldShowProgressCard } from '../../utils/progressCard';
import {
  serialiseProgressCard,
  svgMarkupToObjectUrl,
  svgMarkupToPngBlob,
  shareProgressCard,
  downloadProgressCardPng,
  copyProgressCardMessage,
} from '../../utils/progressCardExport';

// ── Parent Dashboard — "Celebrate their progress" ──
// plans/shareable-progress-card.md (growth loop 2).
//
// Gating (adversarial review outcome #7 — "no export from degraded data"):
// hidden unless data is fresh (loadState === 'server', never the stale-cache
// or failed-no-cache fallback from the 12 Jun observability work — see
// useD1Data.js's loadState), there IS a real active child, and that child
// has practised enough for the card to be worth showing (plan §5 — an empty
// card is a sad card). ParentDashboard renders this with `key={activeChildId}`
// so switching children fully remounts it — no stale toggle state or blob
// URL can bleed from one child to another.
//
// "Preview IS the export" (adversarial review outcome #1): the <img> below
// renders the exact serialised SVG string (as a Blob object URL) that later
// gets rasterised to PNG for share/download — never a separate live
// ProgressCardSVG render. What the parent previews is pixel-identical to
// what gets shared.
function ProgressCardSection({ questionResults, firstName, loadState, activeChildId, now }) {
  const [useChildName, setUseChildName] = useState(true);
  const [busy, setBusy] = useState(null); // 'share' | 'download' | 'copy' | null
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const cardData = useMemo(
    () => deriveProgressCardData(questionResults, firstName, now ? { now } : undefined),
    [questionResults, firstName, now]
  );

  const isFresh = loadState === 'server';
  const show = !!activeChildId && isFresh && shouldShowProgressCard(cardData);

  const markup = useMemo(() => {
    if (!show) return null;
    return serialiseProgressCard({ ...cardData, useChildName, now });
  }, [show, cardData, useChildName, now]);

  // The <img> preview source is a Blob URL of the SAME markup used for
  // export — see the file header. Recreated whenever the markup changes
  // (name toggle or fresh data), and always revoked to avoid leaking
  // object URLs across renders.
  useEffect(() => {
    if (!markup) {
      setPreviewUrl(null);
      return undefined;
    }
    const url = svgMarkupToObjectUrl(markup);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [markup]);

  const rasteriseAnd = useCallback(async (fn) => {
    if (!markup) return;
    setError(null);
    try {
      const blob = await svgMarkupToPngBlob(markup);
      await fn(blob);
    } catch (err) {
      console.error('[ProgressCardSection] export failed:', err);
      setError('Something went wrong creating the image. Please try again.');
    }
  }, [markup]);

  const displayName = useChildName ? firstName : null;

  const handleShare = () => {
    setBusy('share');
    rasteriseAnd(async (blob) => {
      const result = await shareProgressCard(blob, displayName);
      if (result.method === 'unsupported') {
        // No native share sheet on this device/browser — download is the
        // desktop-equivalent fallback (plan §2).
        downloadProgressCardPng(blob);
      }
    }).finally(() => setBusy(null));
  };

  const handleDownload = () => {
    setBusy('download');
    rasteriseAnd(async (blob) => {
      downloadProgressCardPng(blob);
    }).finally(() => setBusy(null));
  };

  const handleCopy = async () => {
    setBusy('copy');
    setError(null);
    try {
      await copyProgressCardMessage(displayName);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      setError("Couldn't copy the message — you can still share or download the image.");
    } finally {
      setBusy(null);
    }
  };

  if (!show) return null;

  const busyLabel = { share: 'Preparing…', download: 'Preparing…', copy: 'Copying…' };

  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between gap-3 mb-1 flex-wrap">
        <h2 className="text-base font-bold text-slate-800">Celebrate their progress</h2>
        <button
          type="button"
          onClick={() => setUseChildName(v => !v)}
          className="text-xs font-semibold text-[#7C3AED] hover:underline shrink-0"
        >
          {useChildName ? 'Use "my child" instead' : `Use ${firstName}'s name`}
        </button>
      </div>
      <p className="text-sm text-slate-500 mb-4">
        Made for the friend who asks how prep's going. Send it, or keep it for the fridge door.
      </p>

      {previewUrl && (
        <img
          src={previewUrl}
          alt={`${useChildName ? firstName : 'Your child'}'s progress card`}
          className="w-full max-w-sm mx-auto rounded-xl border border-slate-100 mb-4 block"
        />
      )}

      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleShare}
          disabled={busy !== null}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7C3AED] text-white text-sm font-semibold hover:bg-[#6D28D9] transition-colors disabled:opacity-50"
        >
          <Share2 className="w-4 h-4" /> {busy === 'share' ? busyLabel.share : 'Share'}
        </button>
        <button
          type="button"
          onClick={handleDownload}
          disabled={busy !== null}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          <Download className="w-4 h-4" /> {busy === 'download' ? busyLabel.download : 'Download PNG'}
        </button>
        <button
          type="button"
          onClick={handleCopy}
          disabled={busy !== null}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : (busy === 'copy' ? busyLabel.copy : 'Copy message')}
        </button>
      </div>
    </div>
  );
}

export default ProgressCardSection;
