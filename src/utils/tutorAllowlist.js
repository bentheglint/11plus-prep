// Tutor eligibility is now DB-backed (tutor_allowlist table, managed from the
// admin panel). The frontend reads it from /api/account as access.tutorEligible;
// the server enforces it via requireTutor. This file now only holds the
// separate Speed Review reviewer list.

// Speed Review is a content QA tool — separate from tutor access.
// Add emails here for trusted reviewers who should see it on the Home screen.
// Gate is by EMAIL only (never display name — a child named "Ben" must never
// see these tools).
const SPEED_REVIEW_ALLOWLIST = [
  'ben@venortech.com',
  'suemedley65@gmail.com',   // Sue Medley (tutor)
  'jacqui.jackson1@mail.com', // Jacqui Jackson
];

export function isSpeedReviewAllowlisted(email) {
  if (!email) return false;
  return SPEED_REVIEW_ALLOWLIST.includes(email.toLowerCase().trim());
}

// Testing Mode is a dev/QA tool — tighter than Speed Review (no tutors).
// Ben + Jacqui only. Email-gated for the same child-safety reason.
const TESTING_MODE_ALLOWLIST = [
  'ben@venortech.com',
  'jacqui.jackson1@mail.com',
];

export function isTestingModeAllowlisted(email) {
  if (!email) return false;
  return TESTING_MODE_ALLOWLIST.includes(email.toLowerCase().trim());
}
