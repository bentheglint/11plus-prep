import {
  serialiseProgressCard,
  svgMarkupToObjectUrl,
  svgMarkupToPngBlob,
  progressCardShareText,
  shareProgressCard,
  downloadProgressCardPng,
  copyProgressCardMessage,
  PROGRESS_CARD_SHARE_URL,
} from './progressCardExport';

const BASE_PROPS = {
  firstName: 'Evie',
  questionsAnswered: 120,
  daysPractised: 12,
  topicsExplored: 5,
  now: new Date('2026-07-15T12:00:00Z'),
};

// ── Browser API mocks (jsdom doesn't implement canvas 2D context or real
// image loading) ──
class MockImage {
  set src(value) {
    this._src = value;
    // Simulate the async decode — real browsers fire onload once the
    // Blob URL's SVG has decoded.
    setTimeout(() => { if (this.onload) this.onload(); });
  }
  get src() { return this._src; }
}

function installCanvasMocks({ toBlobResult = 'ok' } = {}) {
  window.HTMLCanvasElement.prototype.getContext = jest.fn(() => ({ drawImage: jest.fn() }));
  window.HTMLCanvasElement.prototype.toBlob = jest.fn(function (cb) {
    if (toBlobResult === 'ok') {
      cb(new Blob(['fake-png-bytes'], { type: 'image/png' }));
    } else {
      cb(null);
    }
  });
}

beforeEach(() => {
  global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
  global.URL.revokeObjectURL = jest.fn();
  global.Image = MockImage;
  installCanvasMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
  delete global.navigator.share;
  delete global.navigator.canShare;
  delete global.navigator.clipboard;
});

describe('serialiseProgressCard — preview IS the export (adversarial review outcome #1)', () => {
  it('produces a self-contained SVG markup string', () => {
    const markup = serialiseProgressCard(BASE_PROPS);
    expect(typeof markup).toBe('string');
    expect(markup).toMatch(/^<svg/);
    expect(markup).toContain('viewBox="0 0 1080 1080"');
    expect(markup).not.toMatch(/class=/);
  });

  it('is deterministic for the same props (same string both times)', () => {
    const a = serialiseProgressCard(BASE_PROPS);
    const b = serialiseProgressCard(BASE_PROPS);
    expect(a).toBe(b);
  });

  it('reflects the name toggle in the markup', () => {
    const named = serialiseProgressCard({ ...BASE_PROPS, useChildName: true });
    const anonymised = serialiseProgressCard({ ...BASE_PROPS, useChildName: false });
    expect(named).toContain('Evie');
    expect(anonymised).not.toContain('Evie');
    expect(anonymised).toContain('my child');
  });
});

describe('svgMarkupToObjectUrl', () => {
  it('creates a Blob object URL from the markup', () => {
    const markup = serialiseProgressCard(BASE_PROPS);
    const url = svgMarkupToObjectUrl(markup);
    expect(url).toBe('blob:mock-url');
    expect(global.URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
  });
});

describe('svgMarkupToPngBlob — the Image -> canvas -> PNG pipeline (no html-to-image, no foreignObject)', () => {
  it('resolves with a PNG blob on success', async () => {
    const markup = serialiseProgressCard(BASE_PROPS);
    const blob = await svgMarkupToPngBlob(markup);
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('image/png');
  });

  it('revokes the intermediate object URL after rasterising', async () => {
    const markup = serialiseProgressCard(BASE_PROPS);
    await svgMarkupToPngBlob(markup);
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });

  it('rejects if canvas.toBlob returns null', async () => {
    installCanvasMocks({ toBlobResult: 'null' });
    const markup = serialiseProgressCard(BASE_PROPS);
    await expect(svgMarkupToPngBlob(markup)).rejects.toThrow(/toBlob returned null/);
  });

  it('rejects if the image fails to load', async () => {
    class FailingImage {
      set src(value) {
        this._src = value;
        setTimeout(() => { if (this.onerror) this.onerror(); });
      }
      get src() { return this._src; }
    }
    global.Image = FailingImage;
    const markup = serialiseProgressCard(BASE_PROPS);
    await expect(svgMarkupToPngBlob(markup)).rejects.toThrow(/Failed to load/);
  });

  it('rejects if the canvas 2D context is unavailable', async () => {
    window.HTMLCanvasElement.prototype.getContext = jest.fn(() => null);
    const markup = serialiseProgressCard(BASE_PROPS);
    await expect(svgMarkupToPngBlob(markup)).rejects.toThrow(/context unavailable/);
  });
});

describe('progressCardShareText — copy (CLAUDE.md: no em dash, warm, plain)', () => {
  it('mentions the child by name', () => {
    expect(progressCardShareText('Evie')).toContain('Evie');
  });

  it('falls back to "my child" with no firstName', () => {
    expect(progressCardShareText(null)).toContain('my child');
  });

  it('never contains an em dash', () => {
    expect(progressCardShareText('Evie')).not.toMatch(/—/);
    expect(progressCardShareText(null)).not.toMatch(/—/);
  });
});

describe('shareProgressCard — best-effort native share (adversarial review outcome #3)', () => {
  const fakeBlob = new Blob(['x'], { type: 'image/png' });

  it('returns "unsupported" when navigator.canShare is absent', async () => {
    const result = await shareProgressCard(fakeBlob, 'Evie');
    expect(result).toEqual({ method: 'unsupported' });
  });

  it('returns "unsupported" when canShare({files}) is false', async () => {
    global.navigator.canShare = jest.fn(() => false);
    global.navigator.share = jest.fn();
    const result = await shareProgressCard(fakeBlob, 'Evie');
    expect(result).toEqual({ method: 'unsupported' });
    expect(global.navigator.share).not.toHaveBeenCalled();
  });

  it('calls navigator.share with files, text, and the card URL when supported', async () => {
    global.navigator.canShare = jest.fn(() => true);
    global.navigator.share = jest.fn().mockResolvedValue(undefined);

    const result = await shareProgressCard(fakeBlob, 'Evie');

    expect(result).toEqual({ method: 'share' });
    expect(global.navigator.share).toHaveBeenCalledWith(
      expect.objectContaining({
        text: expect.stringContaining('Evie'),
        url: PROGRESS_CARD_SHARE_URL,
        files: expect.any(Array),
      })
    );
  });

  it('treats a user-cancelled share (AbortError) as non-fatal', async () => {
    global.navigator.canShare = jest.fn(() => true);
    const abortError = Object.assign(new Error('cancelled'), { name: 'AbortError' });
    global.navigator.share = jest.fn().mockRejectedValue(abortError);

    const result = await shareProgressCard(fakeBlob, 'Evie');
    expect(result).toEqual({ method: 'cancelled' });
  });

  it('rethrows a genuine share failure (not AbortError)', async () => {
    global.navigator.canShare = jest.fn(() => true);
    global.navigator.share = jest.fn().mockRejectedValue(new Error('boom'));

    await expect(shareProgressCard(fakeBlob, 'Evie')).rejects.toThrow('boom');
  });
});

describe('downloadProgressCardPng', () => {
  it('creates and revokes an object URL for the blob', () => {
    const fakeBlob = new Blob(['x'], { type: 'image/png' });
    downloadProgressCardPng(fakeBlob);
    expect(global.URL.createObjectURL).toHaveBeenCalledWith(fakeBlob);
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });
});

describe('copyProgressCardMessage', () => {
  it('writes the warm sentence + link to the clipboard', async () => {
    global.navigator.clipboard = { writeText: jest.fn().mockResolvedValue(undefined) };
    const message = await copyProgressCardMessage('Evie');
    expect(message).toContain('Evie');
    expect(message).toContain(PROGRESS_CARD_SHARE_URL);
    expect(global.navigator.clipboard.writeText).toHaveBeenCalledWith(message);
  });

  it('throws a friendly error when the clipboard API is unavailable', async () => {
    delete global.navigator.clipboard;
    await expect(copyProgressCardMessage('Evie')).rejects.toThrow(/Clipboard not available/);
  });
});
