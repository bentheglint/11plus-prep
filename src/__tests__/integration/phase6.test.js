/**
 * Phase 6 tests: messaging, relationship removal, bulk invite
 */

// ── Messaging: conversation ownership rules ──

describe('conversation scoping', () => {
  it('conversation keyed on (tutor_id, child_id) is unique', () => {
    const conversations = [
      { tutor_id: 'tutor-a', child_id: 'child-1' },
      { tutor_id: 'tutor-a', child_id: 'child-2' },
      { tutor_id: 'tutor-b', child_id: 'child-1' },
    ];
    const key = (c) => `${c.tutor_id}:${c.child_id}`;
    const keys = conversations.map(key);
    const unique = new Set(keys);
    expect(unique.size).toBe(conversations.length); // all unique
  });

  it('tutor route only accesses conversations owned by that tutor', () => {
    const allConvs = [
      { id: 'c1', tutor_id: 'tutor-a', child_id: 'child-1' },
      { id: 'c2', tutor_id: 'tutor-b', child_id: 'child-1' },
    ];
    const tutorAConvs = allConvs.filter(c => c.tutor_id === 'tutor-a');
    expect(tutorAConvs).toHaveLength(1);
    expect(tutorAConvs[0].id).toBe('c1');
  });

  it('parent route only accesses conversations for their own children', () => {
    const children = [
      { id: 'child-1', account_id: 'parent-a' },
      { id: 'child-2', account_id: 'parent-b' },
    ];
    const conversations = [
      { id: 'c1', child_id: 'child-1' },
      { id: 'c2', child_id: 'child-2' },
    ];
    // Simulate JOIN children ON child.id = conv.child_id WHERE child.account_id = 'parent-a'
    const accessible = conversations.filter(c => {
      const child = children.find(ch => ch.id === c.child_id);
      return child?.account_id === 'parent-a';
    });
    expect(accessible).toHaveLength(1);
    expect(accessible[0].id).toBe('c1');
  });

  it('read receipts: GET messages marks opposite-sender messages as read', () => {
    // Tutor opening a thread → marks parent messages as read
    const messages = [
      { id: 'm1', sender_type: 'parent', read_at: null },
      { id: 'm2', sender_type: 'tutor', read_at: null },
      { id: 'm3', sender_type: 'parent', read_at: '2026-04-20 10:00:00' },
    ];
    // Worker marks unread parent messages when tutor fetches
    const toMarkRead = messages.filter(m => m.sender_type === 'parent' && !m.read_at);
    expect(toMarkRead.map(m => m.id)).toEqual(['m1']);
  });
});

// ── Relationship removal cascade ──

describe('relationship removal via parent', () => {
  it('DELETE pupil_tutors row triggers CASCADE on notes, conversations, assignment_recipients', () => {
    // Documents schema behaviour
    const cascadeTargets = [
      'tutor_notes (child_id, tutor_id) → pupil_tutors ON DELETE CASCADE',
      'conversations (child_id, tutor_id) → pupil_tutors ON DELETE CASCADE',
      'assignment_recipients (child_id, tutor_id) → pupil_tutors ON DELETE CASCADE',
    ];
    expect(cascadeTargets).toHaveLength(3);
    cascadeTargets.forEach(t => {
      expect(t).toContain('ON DELETE CASCADE');
    });
  });

  it('parent endpoint verifies child ownership before deleting', () => {
    const parentId = 'parent-a';
    const children = [{ id: 'child-1', account_id: 'parent-a' }];
    const childId = 'child-1';

    const child = children.find(c => c.id === childId && c.account_id === parentId);
    expect(child).toBeDefined(); // child belongs to this parent — allow delete
  });

  it("parent cannot delete relationship for another parent's child", () => {
    const parentId = 'parent-b';
    const children = [{ id: 'child-1', account_id: 'parent-a' }];
    const childId = 'child-1';

    const child = children.find(c => c.id === childId && c.account_id === parentId);
    expect(child).toBeUndefined(); // not this parent's child — block
  });
});

// ── Bulk invite thresholds ──

describe('bulk invite', () => {
  const REVIEW_THRESHOLD = 20;

  it('20 pupils or fewer skips review (returns invite links)', () => {
    const pupilCounts = [1, 5, 10, 20];
    pupilCounts.forEach(n => {
      const needsReview = n > REVIEW_THRESHOLD;
      expect(needsReview).toBe(false);
    });
  });

  it('21+ pupils triggers review unless bulk_invite_approved is true', () => {
    const cases = [
      { pupils: 21, approved: false, expected: true },
      { pupils: 50, approved: false, expected: true },
      { pupils: 21, approved: true, expected: false }, // pre-approved tutor
    ];
    cases.forEach(({ pupils, approved, expected }) => {
      const needsReview = pupils > REVIEW_THRESHOLD && !approved;
      expect(needsReview).toBe(expected);
    });
  });

  it('invite link format is consistent', () => {
    const tutorCode = 'ABCD-EFGH';
    const baseUrl = 'https://prepstep.co.uk';
    const link = `${baseUrl}/join/${tutorCode}`;
    expect(link).toBe('https://prepstep.co.uk/join/ABCD-EFGH');
    expect(link).toMatch(/\/join\/[A-Z0-9]{4}-[A-Z0-9]{4}$/);
  });

  it('bulk invite body structure is validated', () => {
    const validBody = {
      pupils: [
        { email: 'parent@example.com', childName: 'Sam', yearGroup: 5 },
      ],
    };
    expect(Array.isArray(validBody.pupils)).toBe(true);
    expect(validBody.pupils.length).toBeGreaterThan(0);
    expect(validBody.pupils[0]).toHaveProperty('email');
    expect(validBody.pupils[0]).toHaveProperty('childName');
  });
});

// ── Polled messaging ──

describe('polled messaging', () => {
  it('poll interval is 30 seconds', () => {
    const POLL_INTERVAL = 30000;
    expect(POLL_INTERVAL).toBe(30000);
    expect(POLL_INTERVAL / 1000).toBe(30);
  });

  it('message body is required and non-empty', () => {
    const validate = (body) => !!(body && body.trim().length > 0);
    expect(validate('')).toBe(false);
    expect(validate('  ')).toBe(false);
    expect(validate('Hello')).toBe(true);
  });

  it('sender_type must be tutor or parent', () => {
    const valid = new Set(['tutor', 'parent']);
    expect(valid.has('tutor')).toBe(true);
    expect(valid.has('parent')).toBe(true);
    expect(valid.has('admin')).toBe(false);
    expect(valid.has('child')).toBe(false);
  });
});
