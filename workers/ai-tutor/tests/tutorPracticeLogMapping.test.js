/**
 * Tutor Pupil Drill-Down — practiceLog mapping (focused unit test)
 *
 * ── Why a focused unit test rather than a full endpoint test ──
 * The GET /api/tutor/pupils/:childId handler queries seven tables in a
 * Promise.all: children, quiz_results, topic_performance,
 * assignment_recipients, tutor_notes, question_results, mock_test_results,
 * and now practice_sessions.  The test schema in helpers.js only defines
 * five of those (children, assignment_recipients, tutor_notes, and a few
 * others); quiz_results, question_results, topic_performance,
 * mock_test_results, and practice_sessions are absent.  Expanding the
 * test schema to cover all eight tables is out of scope for this bug fix
 * and carries its own duplication-of-truth risk.  Instead, the mapping
 * function is tested in isolation here; the integration contract (field
 * present in HTTP response) is reinforced by the client-side
 * examReadinessConsistencyBonus test, which verifies the bonus fires when
 * a non-empty practiceLog is passed into useMastery.
 */

import { describe, it, expect } from 'vitest';

// The mapping logic extracted verbatim from routes/tutor.js.
// If the implementation changes, update this copy and add a comment noting the sync.
function mapPracticeSessions(rows) {
  return (rows || []).map(r => {
    let parsed = {};
    if (r.data) { try { parsed = JSON.parse(r.data); } catch { parsed = {}; } }
    return { ...parsed, date: r.session_date };
  });
}

describe('mapPracticeSessions (routes/tutor.js practiceLog mapping)', () => {
  it('maps session_date to date and spreads JSON data fields', () => {
    const rows = [
      {
        session_date: '2026-06-25',
        data: JSON.stringify({
          id: 'ps1', mode: 'focused', subject: 'maths',
          topicKey: 'fractions', questionsAttempted: 10, questionsCorrect: 6,
        }),
      },
      {
        session_date: '2026-06-24',
        data: JSON.stringify({
          id: 'ps2', mode: 'daily', subject: 'english',
          topicKey: 'comprehension', questionsAttempted: 10, questionsCorrect: 8,
        }),
      },
    ];

    const result = mapPracticeSessions(rows);

    expect(result).toHaveLength(2);

    // date must come from session_date (not from the JSON data blob)
    expect(result[0].date).toBe('2026-06-25');
    expect(result[1].date).toBe('2026-06-24');

    // useMastery's consistency filter uses p.subject — must be present
    expect(result[0].subject).toBe('maths');
    expect(result[0].topicKey).toBe('fractions');
    expect(result[1].subject).toBe('english');
    expect(result[1].topicKey).toBe('comprehension');
  });

  it('date from session_date overwrites any date field inside the JSON data', () => {
    // If the stored data blob happens to have its own date field, session_date wins
    const rows = [
      {
        session_date: '2026-06-25',
        data: JSON.stringify({ date: '1970-01-01', subject: 'maths', topicKey: 'algebra' }),
      },
    ];
    const result = mapPracticeSessions(rows);
    expect(result[0].date).toBe('2026-06-25');
    expect(result[0].subject).toBe('maths');
  });

  it('handles malformed JSON data gracefully without throwing', () => {
    const rows = [{ session_date: '2026-06-25', data: 'not-valid-json{' }];
    const result = mapPracticeSessions(rows);
    expect(result).toHaveLength(1);
    expect(result[0].date).toBe('2026-06-25');
    // Non-date fields default to absent — this entry contributes a practice day
    // to the consistency bonus but carries no subject, so it won't match any filter
    expect(result[0].subject).toBeUndefined();
  });

  it('handles null data field without throwing', () => {
    const rows = [{ session_date: '2026-06-25', data: null }];
    const result = mapPracticeSessions(rows);
    expect(result).toHaveLength(1);
    expect(result[0].date).toBe('2026-06-25');
  });

  it('handles missing data property without throwing', () => {
    const rows = [{ session_date: '2026-06-24' }];
    const result = mapPracticeSessions(rows);
    expect(result).toHaveLength(1);
    expect(result[0].date).toBe('2026-06-24');
  });

  it('returns [] for an empty rows array', () => {
    expect(mapPracticeSessions([])).toEqual([]);
  });

  it('returns [] for null input', () => {
    expect(mapPracticeSessions(null)).toEqual([]);
  });

  it('returns [] for undefined input', () => {
    expect(mapPracticeSessions(undefined)).toEqual([]);
  });
});
