import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HeardAboutChip from '../HeardAboutChip';

const getToken = () => Promise.resolve('fake-token');

beforeEach(() => {
  process.env.REACT_APP_TUTOR_API_URL = 'https://api.test';
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ ok: true, stored: true }) });
});

afterEach(() => {
  delete global.fetch;
});

describe('HeardAboutChip — gating', () => {
  it('renders the chip row when heardAbout is null (never answered/dismissed)', () => {
    render(<HeardAboutChip heardAbout={null} getToken={getToken} />);
    expect(screen.getByText('How did you hear about PrepStep?')).toBeInTheDocument();
  });

  it('renders nothing once heardAbout carries a real answer', () => {
    const { container } = render(<HeardAboutChip heardAbout="tutor" getToken={getToken} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing once heardAbout is the "dismissed" sentinel', () => {
    const { container } = render(<HeardAboutChip heardAbout="dismissed" getToken={getToken} />);
    expect(container.firstChild).toBeNull();
  });
});

describe('HeardAboutChip — options', () => {
  it('shows all five option chips with plain-English labels', () => {
    render(<HeardAboutChip heardAbout={null} getToken={getToken} />);
    expect(screen.getByText('Another parent shared a progress card')).toBeInTheDocument();
    expect(screen.getByText("My child's tutor")).toBeInTheDocument();
    expect(screen.getByText('Search or an AI answer')).toBeInTheDocument();
    expect(screen.getByText('Word of mouth')).toBeInTheDocument();
    expect(screen.getByText('Somewhere else')).toBeInTheDocument();
  });

  it('never contains an em dash anywhere in its copy', () => {
    const { container } = render(<HeardAboutChip heardAbout={null} getToken={getToken} />);
    expect(container.textContent).not.toMatch(/—/);
  });

  it('tapping an option POSTs the matching value and shows the thank-you microcopy', async () => {
    render(<HeardAboutChip heardAbout={null} getToken={getToken} />);
    fireEvent.click(screen.getByText("My child's tutor"));

    // API_URL is read once at module-load time (same pattern as
    // ParentDashboard.js/AdminScreen.js), so it's whatever the test
    // environment's default was at import — assert on the path, not origin.
    await waitFor(() => {
      const call = global.fetch.mock.calls.find(([url]) => String(url).endsWith('/api/account/heard-about'));
      expect(call).toBeTruthy();
      expect(call[1]).toMatchObject({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer fake-token' }),
        body: JSON.stringify({ value: 'tutor' }),
      });
    });
    expect(await screen.findByText('Thanks for letting us know.')).toBeInTheDocument();
  });

  it('after answering, the option chips are gone (replaced by the thank-you state)', async () => {
    render(<HeardAboutChip heardAbout={null} getToken={getToken} />);
    fireEvent.click(screen.getByText('Word of mouth'));
    await screen.findByText('Thanks for letting us know.');
    expect(screen.queryByText('Word of mouth')).not.toBeInTheDocument();
  });

  it('calls onAnswered with the chosen value so the parent can persist it upward', async () => {
    const onAnswered = jest.fn();
    render(<HeardAboutChip heardAbout={null} getToken={getToken} onAnswered={onAnswered} />);
    fireEvent.click(screen.getByText('Somewhere else'));
    await waitFor(() => expect(onAnswered).toHaveBeenCalledWith('other'));
  });
});

describe('HeardAboutChip — quiet dismiss', () => {
  it('"No thanks" POSTs the dismissed sentinel and shows the thank-you state too', async () => {
    render(<HeardAboutChip heardAbout={null} getToken={getToken} />);
    fireEvent.click(screen.getByText('No thanks'));

    await waitFor(() => {
      const call = global.fetch.mock.calls.find(([url]) => String(url).endsWith('/api/account/heard-about'));
      expect(call).toBeTruthy();
      expect(call[1]).toMatchObject({ body: JSON.stringify({ value: 'dismissed' }) });
    });
    expect(await screen.findByText('Thanks for letting us know.')).toBeInTheDocument();
  });
});

describe('HeardAboutChip — resilience', () => {
  it('a failed network call still shows the thank-you state locally, never throws', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('network down'));
    render(<HeardAboutChip heardAbout={null} getToken={getToken} />);
    fireEvent.click(screen.getByText('Word of mouth'));
    expect(await screen.findByText('Thanks for letting us know.')).toBeInTheDocument();
  });

  it('does nothing (no fetch) when getToken is unavailable, but still resolves to thanked', async () => {
    render(<HeardAboutChip heardAbout={null} getToken={undefined} />);
    fireEvent.click(screen.getByText('Word of mouth'));
    expect(await screen.findByText('Thanks for letting us know.')).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
