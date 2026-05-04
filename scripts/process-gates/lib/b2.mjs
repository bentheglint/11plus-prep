// Backblaze B2 API helpers — minimal client for the daily-backup workflow.
//
// Uses native fetch (Node 18+) — no SDK dependency. Implements the three
// endpoints we need:
//
//   - authorize     POST b2_authorize_account     (Basic auth → token)
//   - getUploadUrl  POST b2_get_upload_url        (per-bucket upload URL)
//   - uploadFile    POST <uploadUrl>              (the actual upload)
//   - listFileNames POST b2_list_file_names       (heartbeat freshness check)
//
// All other B2 endpoints (delete, copy, etc.) are intentionally NOT exposed
// here — the daily-backup workflow has no business doing them, and Object
// Lock in Compliance mode prevents deletion anyway.

import { createHash } from 'node:crypto';

const B2_API_BASE = 'https://api.backblazeb2.com';

// ── Authorize account: returns { apiUrl, authorizationToken, accountId } ──

export async function authorize({ keyId, applicationKey }) {
  const credentials = Buffer.from(`${keyId}:${applicationKey}`).toString('base64');
  const res = await fetch(`${B2_API_BASE}/b2api/v3/b2_authorize_account`, {
    method: 'GET',
    headers: { Authorization: `Basic ${credentials}` },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`b2_authorize_account failed (${res.status}): ${body}`);
  }
  const data = await res.json();
  // v3 nests api info under apiInfo.storageApi
  const storage = data.apiInfo?.storageApi ?? data;
  return {
    apiUrl: storage.apiUrl ?? data.apiUrl,
    downloadUrl: storage.downloadUrl ?? data.downloadUrl,
    authorizationToken: data.authorizationToken,
    accountId: data.accountId,
    bucketId: storage.bucketId ?? data.allowed?.bucketId ?? null,
    bucketName: storage.bucketName ?? data.allowed?.bucketName ?? null,
  };
}

// ── Get an upload URL for the bucket ──

export async function getUploadUrl({ apiUrl, authorizationToken, bucketId }) {
  const res = await fetch(`${apiUrl}/b2api/v3/b2_get_upload_url`, {
    method: 'POST',
    headers: {
      Authorization: authorizationToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ bucketId }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`b2_get_upload_url failed (${res.status}): ${body}`);
  }
  return await res.json(); // { uploadUrl, authorizationToken, ... }
}

// ── Upload a file with optional Object Lock retention ──

export async function uploadFile({
  uploadUrl,
  uploadAuthToken,
  fileName,
  body,
  contentType = 'application/octet-stream',
  retainUntilMs = null, // milliseconds since epoch
  retentionMode = 'compliance',
}) {
  const sha1 = createHash('sha1').update(body).digest('hex');
  const headers = {
    Authorization: uploadAuthToken,
    'X-Bz-File-Name': encodeURIComponent(fileName),
    'Content-Type': contentType,
    'Content-Length': String(body.length),
    'X-Bz-Content-Sha1': sha1,
  };
  if (retainUntilMs) {
    headers['X-Bz-File-Retention-Mode'] = retentionMode;
    headers['X-Bz-File-Retention-Retain-Until-Timestamp'] = String(retainUntilMs);
  }
  const res = await fetch(uploadUrl, {
    method: 'POST',
    headers,
    body,
  });
  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`upload of ${fileName} failed (${res.status}): ${errBody}`);
  }
  return await res.json(); // { fileId, fileName, contentLength, ... }
}

// ── List file names with optional prefix and limit ──

export async function listFileNames({
  apiUrl,
  authorizationToken,
  bucketId,
  prefix = '',
  maxFileCount = 1000,
  startFileName = null,
}) {
  const body = { bucketId, maxFileCount, prefix };
  if (startFileName) body.startFileName = startFileName;
  const res = await fetch(`${apiUrl}/b2api/v3/b2_list_file_names`, {
    method: 'POST',
    headers: {
      Authorization: authorizationToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`b2_list_file_names failed (${res.status}): ${errBody}`);
  }
  return await res.json(); // { files: [...], nextFileName }
}

// ── Convenience: full upload flow (authorize → get URL → upload) ──

export async function uploadOnce({
  keyId,
  applicationKey,
  bucketId, // optional; falls back to the key's allowed bucket
  fileName,
  body,
  retainUntilMs = null,
  retentionMode = 'compliance',
  contentType = 'application/octet-stream',
}) {
  const auth = await authorize({ keyId, applicationKey });
  const targetBucketId = bucketId || auth.bucketId;
  if (!targetBucketId) {
    throw new Error('No bucketId provided and the application key is not bucket-scoped');
  }
  const upload = await getUploadUrl({
    apiUrl: auth.apiUrl,
    authorizationToken: auth.authorizationToken,
    bucketId: targetBucketId,
  });
  return await uploadFile({
    uploadUrl: upload.uploadUrl,
    uploadAuthToken: upload.authorizationToken,
    fileName,
    body,
    contentType,
    retainUntilMs,
    retentionMode,
  });
}

// Compute a "retain until" timestamp N days from now, in milliseconds since epoch.
export function retainUntil(daysFromNow) {
  return Date.now() + daysFromNow * 24 * 60 * 60 * 1000;
}

// ── Download a file by name. Returns the body as a Uint8Array. ──
//
// The authorize() response includes downloadUrl. Files are fetched via:
//   GET <downloadUrl>/file/<bucketName>/<fileName>
// with Authorization: <authorizationToken>.

export async function downloadFile({
  downloadUrl,
  authorizationToken,
  bucketName,
  fileName,
}) {
  const url = `${downloadUrl}/file/${bucketName}/${encodeURIComponent(fileName).replace(/%2F/g, '/')}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: { Authorization: authorizationToken },
  });
  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`download of ${fileName} failed (${res.status}): ${errBody}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

