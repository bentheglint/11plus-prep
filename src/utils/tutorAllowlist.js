// Email allowlist for the Tutor Mode soft beta.
// Only users whose primary email matches an entry here see the
// "Tutor profile" link in the account menu. The /join/<code> route
// remains public — invited parents can always accept an invite.
const ALLOWLIST = [
  'ben@venortech.com',
  'suemedley65@gmail.com',
];

export function isTutorAllowlisted(email) {
  if (!email) return false;
  return ALLOWLIST.includes(email.toLowerCase().trim());
}
