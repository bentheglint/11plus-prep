/**
 * Free-tier gating on the TUTOR side (Phase 0 freemium, Unit C).
 *
 * The server withholds deep pupil data and blocks Focused Learning
 * assignment for free-plan pupils, marking each response with a stable
 * machine marker (deepProgressLocked / report.locked / assignment
 * `skipped`). These tests cover the two known crash guards
 * (PupilDetailScreen destructuring an absent quizResults, ReportScreen
 * destructuring an absent `assignments.total`) plus the AssignmentComposer
 * skipped-pupil banner.
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PupilDetailScreen from '../../screens/PupilDetailScreen';
import ReportScreen from '../../screens/ReportScreen';
import TutorDashboardScreen from '../../screens/TutorDashboardScreen';
import { buildDashboardData } from '../../utils/tutorPulse';

function noop() {}
const getToken = () => Promise.resolve('test-token');

afterEach(() => {
  delete global.fetch;
});

describe('PupilDetailScreen — locked (free-plan) pupil payload', () => {
  const LOCKED_PUPIL_PAYLOAD = {
    child: {
      id: 'c1',
      display_name: 'Evie',
      account_name: 'Sarah Mitchell',
      year_group: 5,
      target_school: 'Bournemouth School for Girls',
    },
    assignmentRecipients: [],
    notesCount: 0,
    pupilPlan: 'free',
    deepProgressLocked: true,
    // Deliberately no quizResults / questionResults / topicPerformance /
    // mockTestHistory / practiceLog — this is exactly the shape the server
    // sends for a free pupil, and is what used to crash on
    // `quizResults.length`.
  };

  beforeEach(() => {
    global.fetch = jest.fn((url) => {
      if (String(url).includes('/api/tutor/pupils/')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(LOCKED_PUPIL_PAYLOAD) });
      }
      if (String(url).includes('/api/tutor/notes/')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ notes: [] }) });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });
  });

  it('renders the free-plan nudge instead of crashing on the missing quizResults', async () => {
    render(
      <PupilDetailScreen
        childId="c1"
        getToken={getToken}
        onBack={noop}
        onViewQuizDetail={noop}
        onViewAssignmentDetail={noop}
      />
    );

    // Header still renders from the fields the locked payload does carry.
    expect(await screen.findByText('Evie')).toBeInTheDocument();

    // The nudge replaces the analytics stack.
    expect(screen.getByText(/Full analytics need PrepStep Plus/i)).toBeInTheDocument();
    expect(screen.getByText(/is on the free PrepStep plan/i)).toBeInTheDocument();

    // The deep-analytics cards are gone.
    expect(screen.queryByRole('heading', { name: 'Exam Readiness' })).not.toBeInTheDocument();

    // Homework section (present, just empty) still renders — never gated.
    expect(screen.getByText(/Homework/i)).toBeInTheDocument();
  });
});

describe('ReportScreen — locked (free-plan) pupil payload', () => {
  const LOCKED_REPORT_PAYLOAD = {
    locked: true,
    code: 'deep_progress_locked',
    pupilPlan: 'free',
    child: { id: 'c1', displayName: 'Evie', yearGroup: 5, targetSchool: 'Bournemouth School for Girls' },
    // No readiness / subjectBreakdown / assignments / recommendations etc —
    // this used to crash on `assignments.total`.
  };

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(LOCKED_REPORT_PAYLOAD) })
    );
  });

  it('renders the locked view without crashing on the missing assignments field', async () => {
    render(<ReportScreen childId="c1" getToken={getToken} onBack={noop} />);

    expect(await screen.findByText(/Progress report needs PrepStep Plus/i)).toBeInTheDocument();
    expect(screen.getByText('Evie')).toBeInTheDocument();
    expect(screen.getByText(/is on the free PrepStep plan/i)).toBeInTheDocument();
    // No print control — nothing to print for a locked report. (Body copy
    // legitimately contains "printable", so match the button specifically.)
    expect(screen.queryByRole('button', { name: /print/i })).not.toBeInTheDocument();
  });
});

describe('AssignmentComposer — skipped free-plan pupils on a mixed-class send', () => {
  const DAY = 86400000;
  const NOW = Date.now();

  function fixture() {
    return buildDashboardData({
      roster: [{ id: 'c1', display_name: 'Evie', parent_name: 'Sarah' }],
      quizActiveRows: [],
      mockActiveRows: [],
      lessonActiveRows: [],
      weeklyRows: [],
      topicRows: [],
      overdueRows: [],
      now: NOW,
    });
  }

  const dashboardPayload = {
    tutor: { id: 't1', name: 'Mary Jones', tutor_code: 'MARY-XZ7Q', bio: '' },
    ...fixture(),
  };

  beforeEach(() => {
    global.fetch = jest.fn((url, options) => {
      const u = String(url);
      if (u.includes('/api/tutor/classes')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ classes: [{ id: 'cls1', name: 'Saturday group', enrolment_count: 3 }] }) });
      }
      if (u.includes('/api/tutor/assignments') && options?.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            ok: true,
            assignment: { id: 'a1' },
            recipientCount: 2,
            skipped: [{ childId: 'c9', childName: 'Sam', pupilPlan: 'free' }],
          }),
        });
      }
      if (u.includes('/api/tutor/dashboard')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(dashboardPayload) });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });
  });

  it('keeps the modal open and shows the skipped-pupil banner instead of closing on success', async () => {
    render(
      <TutorDashboardScreen
        getToken={getToken}
        onBack={noop}
        onViewQuizDetail={noop}
        onViewAssignmentDetail={noop}
      />
    );

    fireEvent.click(await screen.findByRole('button', { name: /^assign$/i }));
    expect(await screen.findByText('New assignment')).toBeInTheDocument();

    // Due date
    const dateInput = document.querySelector('input[type="date"]');
    fireEvent.change(dateInput, { target: { value: '2026-08-01' } });

    // Target: default is 'Class' — pick the class option (comboboxes are
    // ordered [target, item-subject, item-topic] for a single-item form).
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'cls1' } });
    // selects[1] is the subject picker (defaults to maths, already valid)
    fireEvent.change(selects[2], { target: { value: 'percentages' } });

    fireEvent.click(screen.getByRole('button', { name: /send assignment/i }));

    expect(await screen.findByText(/1 pupil on the free plan was skipped: Sam/i)).toBeInTheDocument();
    expect(screen.getByText(/Upgrade them to PrepStep Plus to include them/i)).toBeInTheDocument();

    // Modal stayed open — the "New assignment" header and a "Done" button
    // are both still present, and the normal Send button is gone.
    expect(screen.getByText('New assignment')).toBeInTheDocument();
    const doneButton = screen.getByRole('button', { name: /^done$/i });
    expect(doneButton).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /send assignment/i })).not.toBeInTheDocument();

    fireEvent.click(doneButton);
    await waitFor(() => expect(screen.queryByText('New assignment')).not.toBeInTheDocument());
  });
});
