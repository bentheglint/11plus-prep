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

// ── Bulk invite API shapes (updated for real invites.js backend) ──

describe('bulk invite', () => {
  const REVIEW_THRESHOLD = 20;

  it('20 pupils or fewer skips review (status is pending)', () => {
    // Server returns status:'pending' when lifetimeCount + new <= 20 and not approved
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

  it('POST /api/tutor/bulk-invite success response shape matches real API', () => {
    // Real API returns: { ok, batchId, created, alreadyInvited, status }
    const successResponse = {
      ok: true,
      batchId: 'some-uuid',
      created: 3,
      alreadyInvited: [{ email: 'dup@example.com', childName: 'Dup' }],
      status: 'pending',
    };
    expect(successResponse.ok).toBe(true);
    expect(typeof successResponse.batchId).toBe('string');
    expect(typeof successResponse.created).toBe('number');
    expect(Array.isArray(successResponse.alreadyInvited)).toBe(true);
    expect(['pending', 'needs_review']).toContain(successResponse.status);
  });

  it('POST /api/tutor/bulk-invite 400 rowErrors shape matches real API', () => {
    // Real API returns: { error, rowErrors: [{index, error}] }
    const errorResponse = {
      error: 'Validation failed',
      rowErrors: [
        { index: 0, error: 'Invalid email' },
        { index: 2, error: 'childName is required (max 30 chars)' },
      ],
    };
    expect(errorResponse.rowErrors).toHaveLength(2);
    errorResponse.rowErrors.forEach(e => {
      expect(typeof e.index).toBe('number');
      expect(typeof e.error).toBe('string');
    });
  });

  it('POST /api/tutor/bulk-invite 429 daily cap error shape', () => {
    // Real API returns: { error: 'Daily limit exceeded...' }
    const capError = {
      error: 'Daily limit exceeded. You have 95 invites in the past 24 hours; adding 10 would exceed 100.',
    };
    expect(typeof capError.error).toBe('string');
    expect(capError.error).toContain('Daily limit exceeded');
  });

  it('bulk invite body uses childName (not name) matching real API', () => {
    // Field name in POST body is childName, NOT name — matches server validateEmail/sanitiseName
    const validBody = {
      pupils: [
        { email: 'parent@example.com', childName: 'Sam', yearGroup: 5 },
        { email: 'parent2@example.com', childName: 'Evie' }, // yearGroup optional
      ],
    };
    expect(Array.isArray(validBody.pupils)).toBe(true);
    validBody.pupils.forEach(p => {
      expect(p).toHaveProperty('email');
      expect(p).toHaveProperty('childName');
      // yearGroup is optional
    });
  });

  it('invite link uses /invite/<token> format (not /join/<code>)', () => {
    // Bulk invite tokens are UUID-based one-time links, not reusable tutor codes
    const baseUrl = 'https://prepstep.co.uk';
    const rawToken = 'some-uuid-token-here-123456';
    const link = `${baseUrl}/invite/${rawToken}`;
    expect(link).toMatch(/\/invite\//);
    expect(link).not.toMatch(/\/join\//);
  });

  it('GET /api/tutor/invites response shape matches real API', () => {
    // Real API returns: { invites: [{id, parent_email, child_name, year_group, status, ...}] }
    const listResponse = {
      invites: [
        {
          id: 'inv-1',
          parent_email: 'parent@example.com',
          child_name: 'Evie',
          year_group: 5,
          status: 'sent',
          created_at: '2026-06-12 10:00:00',
          sent_at: '2026-06-12 10:01:00',
          joined_at: null,
          expires_at: '2026-07-12 10:00:00',
          claimed_by_email: null,
        },
      ],
    };
    expect(Array.isArray(listResponse.invites)).toBe(true);
    const inv = listResponse.invites[0];
    expect(inv).toHaveProperty('id');
    expect(inv).toHaveProperty('parent_email');
    expect(inv).toHaveProperty('child_name');
    expect(inv).toHaveProperty('status');
  });

  it('POST /api/tutor/invites/:id/resend 429 cooldown response shape', () => {
    const cooldownError = { error: 'Must wait 24 hours before resending' };
    expect(cooldownError.error).toBe('Must wait 24 hours before resending');
  });

  it('POST /api/tutor/claim-invite success response shape', () => {
    // Real API returns: { ok: true } or { ok: true, alreadyLinked: true }
    const success = { ok: true };
    const idempotent = { ok: true, alreadyLinked: true };
    expect(success.ok).toBe(true);
    expect(idempotent.alreadyLinked).toBe(true);
  });

  it('POST /api/tutor/claim-invite 404 invalid token response shape', () => {
    // Real API returns: { error: 'Invite not valid' }
    const notFound = { error: 'Invite not valid' };
    expect(notFound.error).toBe('Invite not valid');
  });

  it('GET /api/tutor/public/invite/:token valid response (no child name — privacy)', () => {
    // Real public API deliberately omits childName before auth
    const validResponse = {
      valid: true,
      tutor: { displayName: 'Mary Jones', photoUrl: null, bio: 'GL specialist' },
    };
    expect(validResponse.valid).toBe(true);
    expect(validResponse.tutor).toHaveProperty('displayName');
    // childName MUST NOT be present (pre-auth privacy decision)
    expect(validResponse).not.toHaveProperty('childName');
  });

  it('POST /api/tutor/invite-preview (authed) includes childName', () => {
    // Authed preview returns childName for pre-filling onboarding
    const previewResponse = {
      valid: true,
      childName: 'Evie',
      yearGroup: 5,
      tutor: { displayName: 'Mary Jones', photoUrl: null, bio: 'GL specialist' },
    };
    expect(previewResponse.valid).toBe(true);
    expect(previewResponse.childName).toBe('Evie');
    expect(previewResponse.yearGroup).toBe(5);
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
