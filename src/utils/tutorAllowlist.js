// Tutor eligibility is now DB-backed (tutor_allowlist table, managed from the
// admin panel). The frontend reads it from /api/account as access.tutorEligible;
// the server enforces it via requireTutor. This file now only holds the
// separate Speed Review reviewer list.

// Speed Review is a content QA tool — separate from tutor access.
// Add emails here for trusted reviewers who should see it on the Home screen.
const SPEED_REVIEW_ALLOWLIST = [
  'ben@venortech.com',
  'suemedley65@gmail.com',
];

export function isSpeedReviewAllowlisted(email) {
  if (!email) return false;
  return SPEED_REVIEW_ALLOWLIST.includes(email.toLowerCase().trim());
}
