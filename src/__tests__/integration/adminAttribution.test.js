/**
 * AdminScreen — tutor attribution visibility (layer 4 of
 * plans/tutor-attribution-durability.md). No existing render test covered
 * AdminScreen, so this adds one following the mocked-fetch + real-component
 * RTL pattern used elsewhere (see tutorInvite.test.js's mockTutorFetch()).
 *
 * AdminScreen takes getToken and onBack as plain props (no Clerk hook), so
 * it mounts directly with RTL and exercises the actual production component.
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AdminScreen from '../../screens/AdminScreen';

const TUTORS_RESPONSE = { tutors: [], pending_invites: [] };
const BULK_INVITE_REVIEWS_RESPONSE = { batches: [] };

const JOIN_INTENTS_RESPONSE = {
  intents: [
    {
      id: 'intent-1',
      status: 'pending',
      createdAt: '2026-07-15 10:00:00',
      updatedAt: '2026-07-15 10:00:00',
      tutorCode: 'MARY-K23X',
      tutorName: 'Mary Jones',
      parentEmail: 'parent-a@test.com',
      parentName: 'Parent A',
      signupDate: '2026-07-15 09:55:00',
      childrenNames: ['Amara'],
    },
    {
      id: 'intent-2',
      status: 'joined',
      createdAt: '2026-07-14 08:00:00',
      updatedAt: '2026-07-14 08:05:00',
      tutorCode: 'MARY-K23X',
      tutorName: 'Mary Jones',
      parentEmail: 'parent-b@test.com',
      parentName: 'Parent B',
      signupDate: '2026-07-14 07:50:00',
      childrenNames: ['Femi', 'Grace'],
    },
  ],
  unlinked: [
    {
      accountId: 'account-c',
      parentEmail: 'parent-c@test.com',
      parentName: 'Parent C',
      signupDate: '2026-07-13 12:00:00',
      childrenNames: ['Hassan'],
    },
  ],
};

function mockAdminFetch({ joinIntents = JOIN_INTENTS_RESPONSE, joinIntentsOk = true } = {}) {
  return jest.fn((url) => {
    if (typeof url === 'string' && url.endsWith('/api/admin/tutors')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(TUTORS_RESPONSE) });
    }
    if (typeof url === 'string' && url.endsWith('/api/admin/bulk-invite-reviews')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(BULK_INVITE_REVIEWS_RESPONSE) });
    }
    if (typeof url === 'string' && url.endsWith('/api/admin/join-intents')) {
      return Promise.resolve({
        ok: joinIntentsOk,
        json: () => Promise.resolve(joinIntentsOk ? joinIntents : { error: 'Forbidden' }),
      });
    }
    return Promise.reject(new Error(`Unexpected fetch in AdminScreen test: ${url}`));
  });
}

describe('AdminScreen — tutor attribution section', () => {
  afterEach(() => { delete global.fetch; });

  it('renders tutor referrals and unlinked signups from the admin endpoint', async () => {
    global.fetch = mockAdminFetch();
    const getToken = jest.fn().mockResolvedValue('fake-token');

    render(<AdminScreen getToken={getToken} onBack={() => {}} />);

    await waitFor(() => expect(screen.getByText(/Tutor referrals/)).toBeInTheDocument());

    // Intent rows
    expect(screen.getByText('parent-a@test.com')).toBeInTheDocument();
    expect(screen.getByText('parent-b@test.com')).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();
    expect(screen.getByText('joined')).toBeInTheDocument();
    expect(screen.getByText('Amara')).toBeInTheDocument();
    expect(screen.getByText('Femi, Grace')).toBeInTheDocument();
    // "via {tutorName} · signed up {date}" — same tutor on both rows.
    expect(screen.getAllByText((_, node) => node?.textContent?.startsWith('via Mary Jones') ?? false)).toHaveLength(2);

    // Unlinked signups
    expect(screen.getByText(/Unlinked signups/)).toBeInTheDocument();
    expect(screen.getByText('parent-c@test.com')).toBeInTheDocument();
    expect(screen.getByText(/Hassan/)).toBeInTheDocument();

    // The endpoint was actually hit with an auth header
    const call = global.fetch.mock.calls.find(([url]) => url.endsWith('/api/admin/join-intents'));
    expect(call).toBeTruthy();
    expect(call[1].headers.Authorization).toBe('Bearer fake-token');
  });

  it('shows empty-state copy when there are no referrals or unlinked signups', async () => {
    global.fetch = mockAdminFetch({ joinIntents: { intents: [], unlinked: [] } });
    const getToken = jest.fn().mockResolvedValue('fake-token');

    render(<AdminScreen getToken={getToken} onBack={() => {}} />);

    await waitFor(() => expect(screen.getByText('No tutor referrals yet.')).toBeInTheDocument());
    expect(screen.getByText('No unlinked signups.')).toBeInTheDocument();
  });

  it('shows an error state if the join-intents fetch fails (e.g. non-admin 403)', async () => {
    global.fetch = mockAdminFetch({ joinIntentsOk: false });
    const getToken = jest.fn().mockResolvedValue('fake-token');

    render(<AdminScreen getToken={getToken} onBack={() => {}} />);

    await waitFor(() => expect(screen.getByText("Couldn't load tutor referrals")).toBeInTheDocument());
  });
});
