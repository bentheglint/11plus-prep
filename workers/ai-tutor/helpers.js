// ── Shared helpers ──

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export { CORS };

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

// Get the child ID for an authenticated user. Returns null if no child profile.
export async function getChildId(db, userId) {
  const row = await db.prepare('SELECT id FROM children WHERE account_id = ?').bind(userId).first();
  return row ? row.id : null;
}
