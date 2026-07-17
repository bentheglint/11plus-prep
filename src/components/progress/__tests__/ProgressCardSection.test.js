import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProgressCardSection from '../ProgressCardSection';
import * as exportUtils from '../../../utils/progressCardExport';
import { progressCardFullMessage } from '../../../utils/progressCardExport';

// CRA's Jest preset defaults `resetMocks: true`, which strips any
// implementation set here via the factory before EVERY test runs — so the
// factory only needs to establish these as jest.fn()s; the real
// implementations are (re)installed in beforeEach below, after the reset.
//
// canShareFile and progressCardFullMessage are deliberately left as their
// REAL (jest.requireActual) implementations rather than mocked: the
// "renders only in the fallback branch" and "href encodes the message"
// tests below exist specifically to prove the component asks the real
// capability question and builds the real single-source message string,
// not a test-only stand-in for either.
jest.mock('../../../utils/progressCardExport', () => {
  const actual = jest.requireActual('../../../utils/progressCardExport');
  return {
    ...actual,
    serialiseProgressCard: jest.fn(),
    svgMarkupToObjectUrl: jest.fn(),
    svgMarkupToPngBlob: jest.fn(),
    shareProgressCard: jest.fn(),
    downloadProgressCardPng: jest.fn(),
    copyProgressCardMessage: jest.fn(),
  };
});

const NOW = new Date('2026-07-30T12:00:00Z');

// N distinct London calendar days of practice, well clear of any DST edge,
// each contributing one question on a distinct topic.
function practiceDays(n) {
  const results = [];
  for (let i = 0; i < n; i++) {
    const d = new Date(NOW.getTime() - i * 24 * 60 * 60 * 1000);
    results.push({ date: d.toISOString(), topicKey: `topic-${i}` });
  }
  return results;
}

beforeEach(() => {
  global.URL.revokeObjectURL = jest.fn();

  exportUtils.serialiseProgressCard.mockImplementation(
    (props) => `<svg data-mock-name="${props.useChildName ? props.firstName : 'anon'}"></svg>`
  );
  exportUtils.svgMarkupToObjectUrl.mockImplementation((markup) => `blob:${markup}`);
  exportUtils.svgMarkupToPngBlob.mockImplementation(() => Promise.resolve(new Blob(['x'], { type: 'image/png' })));
  exportUtils.shareProgressCard.mockImplementation(() => Promise.resolve({ method: 'share' }));
  exportUtils.downloadProgressCardPng.mockImplementation(() => {});
  exportUtils.copyProgressCardMessage.mockImplementation(() => Promise.resolve('message'));
});

afterEach(() => {
  // navigator.canShare isn't a real jsdom API — any test that stubs it to
  // simulate native file-share support must not leak into the next test.
  delete global.navigator.canShare;
});

describe('ProgressCardSection — gating', () => {
  it('renders nothing below the minimum practice-day threshold', () => {
    const { container } = render(
      <ProgressCardSection
        questionResults={practiceDays(2)}
        firstName="Evie"
        loadState="server"
        activeChildId="child-1"
        now={NOW}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when the data is stale-cache (loadState !== "server")', () => {
    const { container } = render(
      <ProgressCardSection
        questionResults={practiceDays(10)}
        firstName="Evie"
        loadState="cache"
        activeChildId="child-1"
        now={NOW}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when loadState is "failed-no-cache"', () => {
    const { container } = render(
      <ProgressCardSection
        questionResults={practiceDays(10)}
        firstName="Evie"
        loadState="failed-no-cache"
        activeChildId="child-1"
        now={NOW}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing without a real active child id', () => {
    const { container } = render(
      <ProgressCardSection
        questionResults={practiceDays(10)}
        firstName="Evie"
        loadState="server"
        activeChildId={null}
        now={NOW}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders the card when fresh, an active child, and enough practice days', () => {
    render(
      <ProgressCardSection
        questionResults={practiceDays(10)}
        firstName="Evie"
        loadState="server"
        activeChildId="child-1"
        now={NOW}
      />
    );
    expect(screen.getByText('Celebrate their progress')).toBeInTheDocument();
  });

  it('uses the "friend who asks" supporting copy (Ben, 17 Jul revision), not the old "school-year group" framing', () => {
    render(
      <ProgressCardSection
        questionResults={practiceDays(10)}
        firstName="Evie"
        loadState="server"
        activeChildId="child-1"
        now={NOW}
      />
    );
    expect(screen.getByText("Made for the friend who asks how prep's going. Send it, or keep it for the fridge door.")).toBeInTheDocument();
    expect(screen.queryByText(/school-year group/)).toBeNull();
  });
});

describe('ProgressCardSection — preview is the export', () => {
  it('the preview <img> src is the object URL of the serialised markup', async () => {
    render(
      <ProgressCardSection
        questionResults={practiceDays(10)}
        firstName="Evie"
        loadState="server"
        activeChildId="child-1"
        now={NOW}
      />
    );
    const img = await screen.findByAltText("Evie's progress card");
    expect(img.src).toContain('blob:');
    expect(exportUtils.svgMarkupToObjectUrl).toHaveBeenCalledWith(
      expect.stringContaining('data-mock-name="Evie"')
    );
  });

  it('toggling the name re-serialises the card with the anonymised name and updates the preview', async () => {
    render(
      <ProgressCardSection
        questionResults={practiceDays(10)}
        firstName="Evie"
        loadState="server"
        activeChildId="child-1"
        now={NOW}
      />
    );
    fireEvent.click(screen.getByText('Use "my child" instead'));

    await waitFor(() =>
      expect(exportUtils.serialiseProgressCard).toHaveBeenCalledWith(
        expect.objectContaining({ useChildName: false })
      )
    );
    expect(await screen.findByAltText("Your child's progress card")).toBeInTheDocument();
  });
});

describe('ProgressCardSection — actions', () => {
  function renderShown() {
    return render(
      <ProgressCardSection
        questionResults={practiceDays(10)}
        firstName="Evie"
        loadState="server"
        activeChildId="child-1"
        now={NOW}
      />
    );
  }

  it('Share rasterises then calls shareProgressCard with the child name', async () => {
    renderShown();
    fireEvent.click(screen.getByText('Share'));
    await waitFor(() => expect(exportUtils.shareProgressCard).toHaveBeenCalled());
    expect(exportUtils.svgMarkupToPngBlob).toHaveBeenCalled();
    expect(exportUtils.shareProgressCard.mock.calls[0][1]).toBe('Evie');
  });

  it('falls back to download when share is unsupported', async () => {
    exportUtils.shareProgressCard.mockResolvedValueOnce({ method: 'unsupported' });
    renderShown();
    fireEvent.click(screen.getByText('Share'));
    await waitFor(() => expect(exportUtils.downloadProgressCardPng).toHaveBeenCalled());
  });

  it('Download PNG rasterises then downloads', async () => {
    renderShown();
    fireEvent.click(screen.getByText('Download PNG'));
    await waitFor(() => expect(exportUtils.downloadProgressCardPng).toHaveBeenCalled());
  });

  it('Copy message shows a "Copied!" confirmation', async () => {
    renderShown();
    fireEvent.click(screen.getByText('Copy message'));
    await waitFor(() => expect(screen.getByText('Copied!')).toBeInTheDocument());
    expect(exportUtils.copyProgressCardMessage).toHaveBeenCalledWith('Evie');
  });

  it('passes null (not the real name) to share/copy when the name toggle is off', async () => {
    renderShown();
    fireEvent.click(screen.getByText('Use "my child" instead'));
    fireEvent.click(screen.getByText('Copy message'));
    await waitFor(() => expect(exportUtils.copyProgressCardMessage).toHaveBeenCalledWith(null));
  });

  it('shows a friendly error if rasterising fails, without crashing', async () => {
    exportUtils.svgMarkupToPngBlob.mockRejectedValueOnce(new Error('canvas boom'));
    renderShown();
    fireEvent.click(screen.getByText('Download PNG'));
    await waitFor(() => expect(screen.getByText(/went wrong creating the image/)).toBeInTheDocument());
  });
});

describe('ProgressCardSection — Send on WhatsApp (desktop fallback)', () => {
  function renderShown() {
    return render(
      <ProgressCardSection
        questionResults={practiceDays(10)}
        firstName="Evie"
        loadState="server"
        activeChildId="child-1"
        now={NOW}
      />
    );
  }

  it('renders in the fallback (no-file-share) branch — jsdom has no navigator.canShare — as the FIRST button in the row', () => {
    renderShown();
    const buttons = screen.getAllByRole('link').concat(screen.getAllByRole('button'));
    // The WhatsApp link is the very first actionable element in the button row.
    const whatsapp = screen.getByRole('link', { name: /Send on WhatsApp/ });
    expect(whatsapp).toBeInTheDocument();
    expect(buttons[0]).toBe(whatsapp);
  });

  it('opens wa.me in a new tab with rel="noopener noreferrer"', () => {
    renderShown();
    const whatsapp = screen.getByRole('link', { name: /Send on WhatsApp/ });
    expect(whatsapp).toHaveAttribute('target', '_blank');
    expect(whatsapp).toHaveAttribute('rel', 'noopener noreferrer');
    expect(whatsapp.getAttribute('href')).toMatch(/^https:\/\/wa\.me\/\?text=/);
  });

  it('does NOT render when the native file-share sheet IS supported', () => {
    global.navigator.canShare = jest.fn(() => true);
    renderShown();
    expect(screen.queryByRole('link', { name: /Send on WhatsApp/ })).toBeNull();
  });

  it('URL-encodes the SAME single-source message Copy message uses, for the real child name', () => {
    renderShown();
    const whatsapp = screen.getByRole('link', { name: /Send on WhatsApp/ });
    const expectedMessage = progressCardFullMessage('Evie');
    expect(whatsapp.getAttribute('href')).toBe(`https://wa.me/?text=${encodeURIComponent(expectedMessage)}`);
    // Prove it round-trips to the exact human-readable message, not a mangled encoding.
    const [, encoded] = whatsapp.getAttribute('href').split('?text=');
    expect(decodeURIComponent(encoded)).toBe(expectedMessage);
  });

  it('URL-encodes the "my child" variant when the name toggle is off', () => {
    renderShown();
    fireEvent.click(screen.getByText('Use "my child" instead'));
    const whatsapp = screen.getByRole('link', { name: /Send on WhatsApp/ });
    const expectedMessage = progressCardFullMessage(null);
    expect(whatsapp.getAttribute('href')).toBe(`https://wa.me/?text=${encodeURIComponent(expectedMessage)}`);
    const [, encoded] = whatsapp.getAttribute('href').split('?text=');
    expect(decodeURIComponent(encoded)).toBe(expectedMessage);
  });
});
