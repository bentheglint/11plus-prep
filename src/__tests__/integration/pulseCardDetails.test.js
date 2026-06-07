/**
 * Core-behaviour tests for the clickable pulse cards: tapping a card opens
 * its detail view, the detail's actions fire the right callbacks, and the
 * back button returns. Renders TutorPulseDetail directly (it owns all four
 * views) plus TutorDashboardScreen against a mocked dashboard fetch for the
 * card-tap wiring.
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TutorPulseDetail from '../../screens/TutorPulseDetail';
import TutorDashboardScreen from '../../screens/TutorDashboardScreen';
import { buildDashboardData } from '../../utils/tutorPulse';

const DAY = 86400000;
const NOW = Date.now();

// Same fixture family as the logic tests, run through the real builder so
// these tests consume exactly the payload shape the Worker produces.
function fixture() {
  return buildDashboardData({
    roster: [
      { id: 'c1', display_name: 'Evie', parent_name: 'Sarah' },
      { id: 'c2', display_name: 'James', parent_name: 'Mark' },
      { id: 'c3', display_name: 'Priya', parent_name: 'Anita' },
    ],
    quizActiveRows: [
      { child_id: 'c1', last_active: new Date(NOW - 1 * DAY).toISOString() },
      { child_id: 'c2', last_active: new Date(NOW - 10 * DAY).toISOString() },
    ],
    mockActiveRows: [],
    lessonActiveRows: [],
    weeklyRows: [
      { child_id: 'c1', quiz_count: 4, accuracy: 0.75 },
      { child_id: 'c2', quiz_count: 1, accuracy: 0.4 },
    ],
    topicRows: [
      { child_id: 'c1', topic_key: 'fractions', subject: 'maths', accuracy: 0.55, quiz_count: 2 },
      { child_id: 'c2', topic_key: 'fractions', subject: 'maths', accuracy: 0.45, quiz_count: 2 },
    ],
    overdueRows: [
      { child_id: 'c2', assignment_id: 'a1', title: 'Week 2 fractions', due_date: new Date(NOW - 3 * DAY).toISOString().slice(0, 10) },
    ],
    now: NOW,
  });
}

function noop() {}

describe('TutorPulseDetail views', () => {
  it('activity: groups non-practisers first and fires onMessageChild with parent context', () => {
    const { roster, pulse } = fixture();
    const onMessageChild = jest.fn();
    render(
      <TutorPulseDetail
        detailKey="activity" pulse={pulse} roster={roster} panelMode
        onBack={noop} onOpenPupil={noop} onViewAssignmentDetail={noop}
        onMessageChild={onMessageChild} onAssignTopic={noop}
      />
    );
    expect(screen.getByText('Not practised this week')).toBeInTheDocument();
    // James (10 days) and Priya (never) are inactive
    expect(screen.getByText('Never practised')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Message James's parent"));
    expect(onMessageChild).toHaveBeenCalledWith({ id: 'c2', name: 'James', parentName: 'Mark' });
  });

  it('accuracy: lists quizzed pupils weakest first and opens a pupil on tap', () => {
    const { roster, pulse } = fixture();
    const onOpenPupil = jest.fn();
    render(
      <TutorPulseDetail
        detailKey="accuracy" pulse={pulse} roster={roster} panelMode
        onBack={noop} onOpenPupil={onOpenPupil} onViewAssignmentDetail={noop}
        onMessageChild={noop} onAssignTopic={noop}
      />
    );
    const percents = screen.getAllByText(/^\d+%$/).map(el => el.textContent);
    expect(percents.indexOf('40%')).toBeLessThan(percents.indexOf('75%'));
    fireEvent.click(screen.getByText('James'));
    expect(onOpenPupil).toHaveBeenCalledWith(expect.objectContaining({ id: 'c2' }));
  });

  it('overdue: shows the assignment row and opens assignment detail on tap', () => {
    const { roster, pulse } = fixture();
    const onViewAssignmentDetail = jest.fn();
    render(
      <TutorPulseDetail
        detailKey="overdue" pulse={pulse} roster={roster} panelMode
        onBack={noop} onOpenPupil={noop} onViewAssignmentDetail={onViewAssignmentDetail}
        onMessageChild={noop} onAssignTopic={noop}
      />
    );
    expect(screen.getByText(/3 days overdue/)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Week 2 fractions'));
    expect(onViewAssignmentDetail).toHaveBeenCalledWith('a1');
  });

  it('overdue: shows the all-clear empty state when nothing is overdue', () => {
    const { roster, pulse } = fixture();
    render(
      <TutorPulseDetail
        detailKey="overdue" pulse={{ ...pulse, overdue: [] }} roster={roster} panelMode
        onBack={noop} onOpenPupil={noop} onViewAssignmentDetail={noop}
        onMessageChild={noop} onAssignTopic={noop}
      />
    );
    expect(screen.getByText('All up to date ✓')).toBeInTheDocument();
  });

  it('weakspot: expands the weakest topic and assigns practice pre-filled', () => {
    const { roster, pulse } = fixture();
    const onAssignTopic = jest.fn();
    render(
      <TutorPulseDetail
        detailKey="weakspot" pulse={pulse} roster={roster} panelMode
        onBack={noop} onOpenPupil={noop} onViewAssignmentDetail={noop}
        onMessageChild={noop} onAssignTopic={onAssignTopic}
      />
    );
    // Weakest topic is expanded by default — its pupils are visible
    expect(screen.getByText('James')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Assign practice'));
    expect(onAssignTopic).toHaveBeenCalledWith({
      subject: 'maths',
      topicKey: 'fractions',
      title: 'Fractions practice',
    });
  });

  it('weakspot: explains the threshold when there is not enough data', () => {
    const { roster, pulse } = fixture();
    render(
      <TutorPulseDetail
        detailKey="weakspot" pulse={{ ...pulse, weak_topics: [] }} roster={roster} panelMode
        onBack={noop} onOpenPupil={noop} onViewAssignmentDetail={noop}
        onMessageChild={noop} onAssignTopic={noop}
      />
    );
    expect(screen.getByText(/needs at least 2 pupils with 2\+ quizzes/)).toBeInTheDocument();
  });
});

describe('TutorDashboardScreen card wiring', () => {
  const dashboardPayload = {
    tutor: { id: 't1', name: 'Mary Jones', tutor_code: 'MARY-XZ7Q', bio: '' },
    ...fixture(),
  };

  beforeEach(() => {
    global.fetch = jest.fn((url) => {
      if (String(url).includes('/api/tutor/classes')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ classes: [] }) });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve(dashboardPayload) });
    });
  });
  afterEach(() => {
    delete global.fetch;
  });

  function renderDashboard() {
    return render(
      <TutorDashboardScreen
        getToken={() => Promise.resolve('test-token')}
        onBack={noop}
        onViewQuizDetail={noop}
        onViewAssignmentDetail={noop}
      />
    );
  }

  it('tapping a pulse card opens its detail view, back returns', async () => {
    renderDashboard();
    const card = await screen.findByRole('button', { name: 'Active this week' });
    fireEvent.click(card);
    expect(await screen.findByText(/pupils practised in the last 7 days/)).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Back'));
    await waitFor(() =>
      expect(screen.queryByText(/pupils practised in the last 7 days/)).not.toBeInTheDocument()
    );
  });

  it('tapping the weak spot card opens the weak spots detail', async () => {
    renderDashboard();
    const card = await screen.findByRole('button', { name: 'Group weak spot' });
    fireEvent.click(card);
    expect(await screen.findByText('Group weak spots')).toBeInTheDocument();
  });
});
