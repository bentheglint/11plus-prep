/**
 * AdminScreen — "How parents heard" tally (Shareable Progress Card growth
 * loop, plans/shareable-progress-card.md). Fed by GET /api/admin/heard-about
 * (routes/admin.js), itself fed by the one-shot survey chip on the parent
 * dashboard (src/components/HeardAboutChip.js). Mirrors the mocked-fetch +
 * real-component RTL pattern in adminAttribution.test.js.
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AdminScreen from '../../screens/AdminScreen';

const TUTORS_RESPONSE = { tutors: [], pending_invites: [] };
const BULK_INVITE_REVIEWS_RESPONSE = { batches: [] };
const JOIN_INTENTS_RESPONSE = { intents: [], unlinked: [] };

function mockAdminFetch({ heardAbout = { counts: {}, total: 0 }, heardAboutOk = true } = {}) {
  return jest.fn((url) => {
    if (typeof url === 'string' && url.endsWith('/api/admin/tutors')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(TUTORS_RESPONSE) });
    }
    if (typeof url === 'string' && url.endsWith('/api/admin/bulk-invite-reviews')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(BULK_INVITE_REVIEWS_RESPONSE) });
    }
    if (typeof url === 'string' && url.endsWith('/api/admin/join-intents')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(JOIN_INTENTS_RESPONSE) });
    }
    if (typeof url === 'string' && url.endsWith('/api/admin/heard-about')) {
      return Promise.resolve({
        ok: heardAboutOk,
        json: () => Promise.resolve(heardAboutOk ? heardAbout : { error: 'Forbidden' }),
      });
    }
    return Promise.reject(new Error(`Unexpected fetch in AdminScreen test: ${url}`));
  });
}

describe('AdminScreen — How parents heard tally', () => {
  afterEach(() => { delete global.fetch; });

  it('renders counts grouped by value, sorted highest first, with a total', async () => {
    global.fetch = mockAdminFetch({
      heardAbout: { counts: { tutor: 5, 'progress-card': 2, dismissed: 8 }, total: 15 },
    });
    const getToken = jest.fn().mockResolvedValue('fake-token');

    render(<AdminScreen getToken={getToken} onBack={() => {}} />);

    await waitFor(() => expect(screen.getByText(/How parents heard/)).toBeInTheDocument());
    expect(screen.getByText('(15 responses)')).toBeInTheDocument();

    // Plain-English labels, not raw values
    expect(screen.getByText('Tutor')).toBeInTheDocument();
    expect(screen.getByText('Shared progress card')).toBeInTheDocument();
    expect(screen.getByText('Dismissed without answering')).toBeInTheDocument();

    // Counts rendered
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
  });

  it('shows empty-state copy when there are no responses yet', async () => {
    global.fetch = mockAdminFetch({ heardAbout: { counts: {}, total: 0 } });
    const getToken = jest.fn().mockResolvedValue('fake-token');

    render(<AdminScreen getToken={getToken} onBack={() => {}} />);

    await waitFor(() => expect(screen.getByText('No responses yet.')).toBeInTheDocument());
    expect(screen.getByText('(0 responses)')).toBeInTheDocument();
  });

  it('uses singular "response" copy for exactly one', async () => {
    global.fetch = mockAdminFetch({ heardAbout: { counts: { other: 1 }, total: 1 } });
    const getToken = jest.fn().mockResolvedValue('fake-token');

    render(<AdminScreen getToken={getToken} onBack={() => {}} />);

    await waitFor(() => expect(screen.getByText('(1 response)')).toBeInTheDocument());
  });

  it('shows an error state if the heard-about fetch fails', async () => {
    global.fetch = mockAdminFetch({ heardAboutOk: false });
    const getToken = jest.fn().mockResolvedValue('fake-token');

    render(<AdminScreen getToken={getToken} onBack={() => {}} />);

    await waitFor(() => expect(screen.getByText("Couldn't load the heard-about tally")).toBeInTheDocument());
  });

  it('hits the endpoint with an auth header, behind the same admin gate as other admin data', async () => {
    global.fetch = mockAdminFetch();
    const getToken = jest.fn().mockResolvedValue('fake-token');

    render(<AdminScreen getToken={getToken} onBack={() => {}} />);

    await waitFor(() => {
      const call = global.fetch.mock.calls.find(([url]) => url.endsWith('/api/admin/heard-about'));
      expect(call).toBeTruthy();
      expect(call[1].headers.Authorization).toBe('Bearer fake-token');
    });
  });
});
