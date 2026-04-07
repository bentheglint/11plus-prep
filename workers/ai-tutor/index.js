const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

// ── Testing Flags (KV-backed) ──

async function getFlags(env) {
  const raw = await env.TESTING_FLAGS.get('all-flags');
  return raw ? JSON.parse(raw) : [];
}

async function handleGetFlags(env) {
  return json(await getFlags(env));
}

async function handlePostFlag(request, env) {
  const flag = await request.json();
  const flags = await getFlags(env);
  flags.push({
    id: Date.now(),
    timestamp: new Date().toISOString(),
    ...flag,
    status: 'pending',
  });
  await env.TESTING_FLAGS.put('all-flags', JSON.stringify(flags));
  return json({ ok: true, count: flags.length });
}

async function handleResolveFlag(request, env) {
  const { flagId } = await request.json();
  const flags = await getFlags(env);
  const updated = flags.filter(f => f.id !== flagId);
  await env.TESTING_FLAGS.put('all-flags', JSON.stringify(updated));
  return json({ ok: true, remaining: updated.length });
}

async function handleMarkFixed(request, env) {
  const { flagId, fixNote } = await request.json();
  const flags = await getFlags(env);
  const updated = flags.map(f =>
    f.id === flagId ? { ...f, status: 'fixed', fixNote: fixNote || '', fixedAt: new Date().toISOString() } : f
  );
  await env.TESTING_FLAGS.put('all-flags', JSON.stringify(updated));
  return json({ ok: true });
}

// ── AI Tutor (Anthropic proxy) ──

async function handleTutor(request, env) {
  const { system, messages } = await request.json();

  if (!system || !messages || !Array.isArray(messages)) {
    return json({ error: 'Missing system or messages' }, 400);
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      system,
      messages,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    return json({ error: data.error?.message || 'API error' }, response.status);
  }

  return json(data);
}

// ── Router ──

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // Flag routes
      if (path === '/flags' && request.method === 'GET') {
        return handleGetFlags(env);
      }
      if (path === '/flags' && request.method === 'POST') {
        return handlePostFlag(request, env);
      }
      if (path === '/flags/resolve' && request.method === 'POST') {
        return handleResolveFlag(request, env);
      }
      if (path === '/flags/fix' && request.method === 'POST') {
        return handleMarkFixed(request, env);
      }

      // Default: AI tutor (backward compatible — POST to root)
      if (request.method === 'POST') {
        return handleTutor(request, env);
      }

      return new Response('Not found', { status: 404, headers: CORS });
    } catch (err) {
      return json({ error: 'Internal server error' }, 500);
    }
  },
};
