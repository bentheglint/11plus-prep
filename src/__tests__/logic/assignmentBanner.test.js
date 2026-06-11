/**
 * selectActiveAssignment — the homepage homework-card picker.
 *
 * Regression: Evie's first assignment (fractions, due 20 May) had a NULL
 * subject in assignment_items and was silently hidden from her homepage for
 * three weeks while showing 'overdue' on the tutor profile. Missing subjects
 * are now derived from the topic key instead of dropping the assignment.
 */

import { selectActiveAssignment } from '../../components/AssignmentBanner';
import { quizSubjectForTopic } from '../../utils/topicSubjects';

function makeRecipient(overrides = {}) {
  return {
    id: 'recip-1',
    status: 'assigned',
    item_type: 'topic',
    item_ref: 'fractions',
    subject: 'maths',
    due_date: '2026-05-20',
    assignment_title: 'Fractions Work',
    tutor_name: 'Sue',
    ...overrides,
  };
}

describe('selectActiveAssignment', () => {
  it('REGRESSION: surfaces a late assignment whose subject is NULL, deriving subject from the topic key', () => {
    const item = selectActiveAssignment([
      makeRecipient({ subject: null, status: 'late' }),
    ]);
    expect(item).not.toBeNull();
    expect(item.subject).toBe('maths'); // derived — quiz can start
    expect(item.status).toBe('late');
  });

  it('keeps the stored subject when present', () => {
    const item = selectActiveAssignment([makeRecipient({ subject: 'maths' })]);
    expect(item.subject).toBe('maths');
  });

  it('excludes completed, cleared and cancelled items', () => {
    expect(selectActiveAssignment([
      makeRecipient({ status: 'completed' }),
      makeRecipient({ id: 'r2', status: 'cleared' }),
      makeRecipient({ id: 'r3', status: 'cancelled' }),
    ])).toBeNull();
  });

  it('drops items whose subject cannot be determined at all', () => {
    expect(selectActiveAssignment([
      makeRecipient({ subject: null, item_ref: 'no-such-topic' }),
    ])).toBeNull();
  });

  it('picks the earliest due date when multiple are active', () => {
    const item = selectActiveAssignment([
      makeRecipient({ id: 'later', due_date: '2026-07-01' }),
      makeRecipient({ id: 'sooner', due_date: '2026-05-20' }),
    ]);
    expect(item.id).toBe('sooner');
  });

  it('returns null for empty or missing input', () => {
    expect(selectActiveAssignment([])).toBeNull();
    expect(selectActiveAssignment(undefined)).toBeNull();
  });
});

describe('quizSubjectForTopic', () => {
  it('uses the quiz vocabulary (verbalreasoning, no hyphen)', () => {
    expect(quizSubjectForTopic('fractions')).toBe('maths');
    expect(quizSubjectForTopic('comprehension')).toBe('english');
    expect(quizSubjectForTopic('synonyms')).toBe('verbalreasoning');
    expect(quizSubjectForTopic('wordClassGrammar')).toBe('english');
    expect(quizSubjectForTopic('balanceEquations')).toBe('verbalreasoning');
    expect(quizSubjectForTopic('unknown')).toBeNull();
  });
});
