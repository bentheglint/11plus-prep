/** @type {import('tailwindcss').Config} */
// Tailwind v3 — pinned. v4 requires Safari 16.4+ (@property, color-mix) and
// this app supports iOS 15.6 iPads (see the 9 Jun 2026 browser-floor
// incident). Do not upgrade to v4 while the Safari 15.6 floor stands.
//
// Production previously loaded the v3 Play CDN at runtime (cdn.tailwindcss.com
// in index.html); this config produces the same v3 utilities at build time.
// Custom design-system classes (font-heading, text-fluid-*, card, btn-primary)
// are plain CSS in src/index.css, not theme extensions.
module.exports = {
  content: [
    './src/**/*.{js,jsx}',
    './public/index.html',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
