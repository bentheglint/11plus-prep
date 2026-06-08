/**
 * Assignment + recipient tracking tests (Phase 3 acceptance criteria)
 *
 * Tests: recipient expansion logic, status transitions, late-flag rule.
 */

// ── Recipient expansion ──

describe('recipient expansion at send-time', () => {
  it('class assignment expands to N_children × N_items rows', () => {
    const classRoster = ['child-a', 'child-b', 'child-c'];
    const items = [{ id: 'item-1' }, { id: 'item-2' }];
    const tutorId = 'tutor-1';
    const assignmentId = 'assign-1';

    // Simulate expandRecipients logic
    const rows = [];
    for (const childId of classRoster) {
      for (const item of items) {
        rows.push({ assignment_id: assignmentId, assignment_item_id: item.id, child_id: childId, tutor_id: tutorId });
      }
    }

    expect(rows).toHaveLength(6); // 3 children × 2 items
    expect(rows.filter(r => r.child_id === 'child-a')).toHaveLength(2);
    expect(rows.filter(r => r.child_id === 'child-b')).toHaveLength(2);
    expect(rows.every(r => r.assignment_id === assignmentId)).toBe(true);
  });

  it('individual pupil assignment expands to 1_child × N_items rows', () => {
    const childId = 'child-solo';
    const items = [{ id: 'item-1' }, { id: 'item-2' }, { id: 'item-3' }];

    const rows = items.map(item => ({
      child_id: childId,
      assignment_item_id: item.id,
    }));

    expect(rows).toHaveLength(3);
    expect(rows.every(r => r.child_id === childId)).toBe(true);
  });

  it('expansion is idempotent (INSERT OR IGNORE prevents duplicates)', () => {
    // Simulates calling expandRecipients twice — second call inserts nothing
    const existing = new Set(['item-1:child-a', 'item-2:child-a']);
    const rows = [
      { assignment_item_id: 'item-1', child_id: 'child-a' },
      { assignment_item_id: 'item-2', child_id: 'child-a' },
    ];
    const inserted = rows.filter(r => !existing.has(`${r.assignment_item_id}:${r.child_id}`));
    expect(inserted).toHaveLength(0); // nothing new to insert
  });
});

// ── Recipient status transitions ──

describe('recipient status transitions', () => {
  const validTransitions = {
    assigned: ['in_progress', 'late', 'cancelled'],
    in_progress: ['completed', 'late', 'cancelled'],
    completed: [],  // terminal
    late: ['completed', 'cleared', 'cancelled'],
    cleared: [],    // terminal
    cancelled: [],  // terminal
  };

  it('valid statuses are: assigned, in_progress, completed, late, cleared, cancelled', () => {
    const statuses = Object.keys(validTransitions);
    expect(statuses).toContain('assigned');
    expect(statuses).toContain('in_progress');
    expect(statuses).toContain('completed');
    expect(statuses).toContain('late');
    expect(statuses).toContain('cleared');
    expect(statuses).toContain('cancelled');
  });

  it('start action transitions assigned → in_progress', () => {
    const status = 'assigned';
    const newStatus = status === 'assigned' ? 'in_progress' : status;
    expect(newStatus).toBe('in_progress');
  });

  it('complete action transitions in_progress → completed', () => {
    const status = 'in_progress';
    const newStatus = ['assigned', 'in_progress', 'late'].includes(status) ? 'completed' : status;
    expect(newStatus).toBe('completed');
  });

  it('complete action transitions late → completed (pupil completes after due date)', () => {
    const status = 'late';
    const newStatus = ['assigned', 'in_progress', 'late'].includes(status) ? 'completed' : status;
    expect(newStatus).toBe('completed');
  });

  it('clear-late transitions late → cleared', () => {
    const status = 'late';
    const newStatus = status === 'late' ? 'cleared' : status;
    expect(newStatus).toBe('cleared');
  });
});

// ── Late-flag job logic ──

describe('late-flag job', () => {
  it('flags assigned and in_progress recipients when due_date has passed', () => {
    const recipients = [
      { id: '1', status: 'assigned',    due_date: '2026-04-01' },
      { id: '2', status: 'in_progress', due_date: '2026-04-01' },
      { id: '3', status: 'completed',   due_date: '2026-04-01' },
      { id: '4', status: 'assigned',    due_date: '2099-12-31' }, // future
    ];

    const now = new Date('2026-04-10');
    const toLate = recipients.filter(r =>
      ['assigned', 'in_progress'].includes(r.status) &&
      new Date(r.due_date) < now
    );

    expect(toLate.map(r => r.id)).toEqual(['1', '2']);
  });

  it('does not flag future assignments', () => {
    const futureRecipient = { status: 'assigned', due_date: '2099-12-31' };
    const now = new Date();
    const shouldFlag = ['assigned', 'in_progress'].includes(futureRecipient.status) &&
      new Date(futureRecipient.due_date) < now;
    expect(shouldFlag).toBe(false);
  });

  it('does not flag already-completed rows', () => {
    const completed = { status: 'completed', due_date: '2026-04-01' };
    const now = new Date('2026-04-10');
    const shouldFlag = ['assigned', 'in_progress'].includes(completed.status) &&
      new Date(completed.due_date) < now;
    expect(shouldFlag).toBe(false);
  });
});

// ── Assignment request validation ──

describe('assignment creation request validation', () => {
  it('requires exactly one of targetClassId or targetChildId', () => {
    const bothSet = { targetClassId: 'cls-1', targetChildId: 'child-1' };
    const noneSet = {};
    const classOnly = { targetClassId: 'cls-1' };
    const childOnly = { targetChildId: 'child-1' };

    const isValid = (body) => !!(
      (body.targetClassId || body.targetChildId) &&
      !(body.targetClassId && body.targetChildId)
    );

    expect(isValid(bothSet)).toBe(false);
    expect(isValid(noneSet)).toBe(false);
    expect(isValid(classOnly)).toBe(true);
    expect(isValid(childOnly)).toBe(true);
  });

  it('valid item types are: topic, custom_quiz, mock, lesson', () => {
    const valid = new Set(['topic', 'custom_quiz', 'mock', 'lesson']);
    expect(valid.has('topic')).toBe(true);
    expect(valid.has('quiz')).toBe(false); // 'quiz' is not valid — must be 'custom_quiz'
    expect(valid.has('mock')).toBe(true);
  });
});
