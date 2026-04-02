/**
 * Post-Question Tips Integration Tests (Testing Strategy Part 5, Priority 4)
 *
 * Tests selectPostQuestionTip from tipSelection.js and the tip scheduling
 * cadence (shouldShowPostQuestionTip from quizOrchestration.js).
 */

import { selectPostQuestionTip } from '../../utils/tipSelection';
import { shouldShowPostQuestionTip } from '../../utils/quizOrchestration';

// Mock tips matching the real tip data structure
const mockTips = [
  { id: 'tip-1', topicKeys: ['percentages', 'decimals'], keyInsight: 'Percent means per 100', subject: 'maths', category: 'Strategy' },
  { id: 'tip-2', topicKeys: ['percentages'], keyInsight: 'Find 10% first', subject: 'maths', category: 'Strategy' },
  { id: 'tip-3', topicKeys: ['algebra'], keyInsight: 'Use inverse operations', subject: 'maths', category: 'Strategy' },
  { id: 'tip-4', topicKeys: ['fractions'], keyInsight: 'Common denominator', subject: 'maths', category: 'Strategy' },
];

describe('selectPostQuestionTip', () => {

  it('returns a matching tip for the topic', () => {
    const tip = selectPostQuestionTip('percentages', mockTips, new Set(), []);
    expect(tip).not.toBeNull();
    expect(tip.topicKeys).toContain('percentages');
  });

  it('returns null when no tips match the topic', () => {
    const tip = selectPostQuestionTip('volume', mockTips, new Set(), []);
    expect(tip).toBeNull();
  });

  it('returns null when all matching tips shown this session', () => {
    const sessionShown = new Set(['tip-1', 'tip-2']);
    const tip = selectPostQuestionTip('percentages', mockTips, sessionShown, []);
    expect(tip).toBeNull();
  });

  it('excludes tips already shown this session', () => {
    const sessionShown = new Set(['tip-1']);
    const tip = selectPostQuestionTip('percentages', mockTips, sessionShown, []);
    expect(tip).not.toBeNull();
    expect(tip.id).toBe('tip-2'); // only remaining match
  });

  it('prefers never-seen tips over recently-seen', () => {
    // tip-1 was seen recently, tip-2 was never seen
    const seenTips = [{ id: 'tip-1', lastSeenDate: new Date().toISOString() }];
    const results = new Set();

    // Run multiple times — should always get tip-2 (never seen)
    for (let i = 0; i < 10; i++) {
      const tip = selectPostQuestionTip('percentages', mockTips, new Set(), seenTips);
      results.add(tip.id);
    }
    // tip-2 should appear since it's never been seen
    expect(results.has('tip-2')).toBe(true);
  });

  it('returns oldest-seen tip when all have been seen', () => {
    const seenTips = [
      { id: 'tip-1', lastSeenDate: '2026-03-01T00:00:00Z' }, // older
      { id: 'tip-2', lastSeenDate: '2026-04-01T00:00:00Z' }, // newer
    ];
    const tip = selectPostQuestionTip('percentages', mockTips, new Set(), seenTips);
    expect(tip.id).toBe('tip-1'); // oldest seen
  });
});

describe('Tip scheduling cadence', () => {
  it('follows the every-3rd-wrong-answer pattern', () => {
    const expected = [
      // count: show?
      [1, true],   // 1st wrong → show
      [2, false],  // 2nd wrong → skip
      [3, false],  // 3rd wrong → skip
      [4, true],   // 4th wrong → show
      [5, false],
      [6, false],
      [7, true],   // 7th wrong → show
      [8, false],
      [9, false],
      [10, true],  // 10th wrong → show
    ];

    expected.forEach(([count, shouldShow]) => {
      expect(shouldShowPostQuestionTip(count)).toBe(shouldShow);
    });
  });
});
