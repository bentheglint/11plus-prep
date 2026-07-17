import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ProgressCardSVG, { CARD_SIZE } from '../components/progress/ProgressCardSVG';

// ── Shareable Progress Card — export + share ──
// plans/shareable-progress-card.md (growth loop 2).
//
// iOS 15.6 Safari floor constrains this entire file (see CLAUDE.md's Safari
// browser-floor note): NO html-to-image, NO foreignObject. The only
// Safari-15-safe path from a React SVG tree to a shareable PNG is:
//   React tree -> static markup STRING -> Blob (image/svg+xml) -> Object URL
//   -> new Image() -> canvas.drawImage -> canvas.toBlob (image/png)
// Every function below is plain ES2020-safe syntax (no lookbehind regex, no
// optional chaining shortcuts that trip the bundle-compat guard) —
// scripts/check-bundle-compat.js runs on every production build.
//
// "Preview IS the export" (adversarial review outcome #1): the markup
// string produced by serialiseProgressCard() is the SAME string used both
// for the dashboard's <img> preview (as a Blob URL) and for PNG
// rasterisation — never a separately-rendered live DOM copy. Callers should
// serialise once per (cardData, useChildName) combination and reuse the
// resulting markup for both the preview <img src> and the export pipeline.

export const PROGRESS_CARD_SHARE_URL = 'https://prepstep.co.uk/card';

/**
 * Render the card to a static SVG markup string — the single artefact both
 * the dashboard preview and the exported PNG are derived from.
 */
export function serialiseProgressCard(props) {
  return renderToStaticMarkup(React.createElement(ProgressCardSVG, props));
}

/**
 * Wrap SVG markup in a Blob and return an object URL for it. Caller owns the
 * URL's lifetime and must revokeObjectURL() when done with it (e.g. on
 * unmount or when the card data changes).
 */
export function svgMarkupToObjectUrl(svgMarkup) {
  const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
  return URL.createObjectURL(blob);
}

/**
 * Rasterise SVG markup to a PNG Blob via the Image -> canvas pipeline.
 * Rejects if the image fails to load or the canvas can't produce a blob —
 * callers should catch and fall back gracefully rather than let a share
 * attempt hang.
 */
export function svgMarkupToPngBlob(svgMarkup, size = CARD_SIZE) {
  return new Promise((resolve, reject) => {
    const objectUrl = svgMarkupToObjectUrl(svgMarkup);
    const img = new Image();

    const cleanup = () => {
      try { URL.revokeObjectURL(objectUrl); } catch (_) { /* non-critical */ }
    };

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          cleanup();
          reject(new Error('Canvas 2D context unavailable'));
          return;
        }
        ctx.drawImage(img, 0, 0, size, size);
        canvas.toBlob((pngBlob) => {
          cleanup();
          if (pngBlob) resolve(pngBlob);
          else reject(new Error('Canvas toBlob returned null'));
        }, 'image/png');
      } catch (err) {
        cleanup();
        reject(err);
      }
    };

    img.onerror = () => {
      cleanup();
      reject(new Error('Failed to load the progress card SVG as an image'));
    };

    img.src = objectUrl;
  });
}

/**
 * One warm sentence for the share text / copy-message fallback. Best-effort
 * only (adversarial review outcome #3 — WhatsApp and others may drop
 * text/url on a file share; the on-card footer URL is the durable carrier).
 * British English, no em dash (CLAUDE.md copy rule).
 */
export function progressCardShareText(firstName) {
  const name = firstName || 'my child';
  return `A little celebration of ${name}'s steady 11+ practice this month.`;
}

/**
 * Attempt a native share (image + text + link). Returns a result object
 * rather than throwing on an unsupported browser or a user cancel, so
 * callers can fall back to download/copy without special-casing errors.
 *
 * @returns {Promise<{ method: 'share' | 'cancelled' | 'unsupported' }>}
 */
export async function shareProgressCard(pngBlob, firstName, fileNamePrefix = 'prepstep-progress-card') {
  const file = new File([pngBlob], `${fileNamePrefix}.png`, { type: 'image/png' });
  const text = progressCardShareText(firstName);

  const canShareFiles = typeof navigator !== 'undefined'
    && typeof navigator.canShare === 'function'
    && navigator.canShare({ files: [file] });

  if (!canShareFiles) {
    return { method: 'unsupported' };
  }

  try {
    await navigator.share({ files: [file], text, url: PROGRESS_CARD_SHARE_URL });
    return { method: 'share' };
  } catch (err) {
    if (err && err.name === 'AbortError') {
      return { method: 'cancelled' }; // user dismissed the native sheet — not a failure
    }
    throw err;
  }
}

/** Trigger a browser download of the PNG blob. */
export function downloadProgressCardPng(pngBlob, fileNamePrefix = 'prepstep-progress-card') {
  const url = URL.createObjectURL(pngBlob);
  try {
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileNamePrefix}.png`;
    a.click();
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Copy the warm sentence + link to the clipboard. Throws if unsupported — caller shows a friendly error. */
export async function copyProgressCardMessage(firstName) {
  const message = `${progressCardShareText(firstName)} ${PROGRESS_CARD_SHARE_URL}`;
  if (typeof navigator === 'undefined' || !navigator.clipboard || !navigator.clipboard.writeText) {
    throw new Error('Clipboard not available');
  }
  await navigator.clipboard.writeText(message);
  return message;
}
