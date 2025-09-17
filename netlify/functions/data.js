// Netlify Function: Unified data read/write to GitHub Contents API
// Methods:
// - GET /api/data?filename=users.json -> returns file content as JSON
// - POST/PUT /api/data  body: { filename: "users.json", data: any, message?: string }
//
// Env vars supported:
// - GITHUB_TOKEN (required)
// - GITHUB_REPO ("owner/repo") OR GITHUB_OWNER + GITHUB_REPO_NAME
// - GITHUB_BRANCH (default: "main")
// - DATA_DIR (default: "data")

exports.handler = async function(event) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const OWNER = process.env.GITHUB_OWNER;
  const REPO_NAME = process.env.GITHUB_REPO_NAME;
  const GITHUB_REPO_COMBINED = process.env.GITHUB_REPO;
  const BRANCH = process.env.GITHUB_BRANCH || 'main';
  const DATA_DIR = process.env.DATA_DIR || 'data';

  const repoPath = (OWNER && REPO_NAME)
    ? `${OWNER}/${REPO_NAME}`
    : (GITHUB_REPO_COMBINED || '');

  if (!GITHUB_TOKEN || !repoPath) {
    return withCors({
      statusCode: 500,
      body: JSON.stringify({ error: 'Server misconfiguration: missing GITHUB_TOKEN or repository info' }),
    });
  }

  const baseUrl = `https://api.github.com/repos/${repoPath}/contents/${DATA_DIR}`;

  try {
    if (event.httpMethod === 'GET') {
      const params = new URLSearchParams(event.queryStringParameters || {});
      const filename = params.get('filename') || (event.queryStringParameters && event.queryStringParameters.filename);
      if (!filename) {
        return withCors({ statusCode: 400, body: JSON.stringify({ error: 'filename is required' }) });
      }

      const res = await fetch(`${baseUrl}/${encodeURIComponent(filename)}?ref=${encodeURIComponent(BRANCH)}`, {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'netlify-function'
        },
      });

      if (!res.ok) {
        return withCors({ statusCode: res.status, body: JSON.stringify({ error: `GitHub fetch failed: ${res.status}` }) });
      }

      const payload = await res.json();
      const decoded = Buffer.from(payload.content, 'base64').toString('utf8');
      return withCors({ statusCode: 200, body: decoded, headers: { 'Content-Type': 'application/json' } });
    }

    if (event.httpMethod === 'PUT' || event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { filename, data, message } = body;
      if (!filename) {
        return withCors({ statusCode: 400, body: JSON.stringify({ error: 'filename is required' }) });
      }
      if (typeof data === 'undefined') {
        return withCors({ statusCode: 400, body: JSON.stringify({ error: 'data is required' }) });
      }

      // Get current sha if exists
      let sha = undefined;
      const getRes = await fetch(`${baseUrl}/${encodeURIComponent(filename)}?ref=${encodeURIComponent(BRANCH)}`, {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'netlify-function'
        },
      });
      if (getRes.ok) {
        const existing = await getRes.json();
        sha = existing.sha;
      }

      const content = Buffer.from(typeof data === 'string' ? data : JSON.stringify(data, null, 2), 'utf8').toString('base64');

      const putRes = await fetch(`${baseUrl}/${encodeURIComponent(filename)}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'netlify-function'
        },
        body: JSON.stringify({
          message: message || `Update ${filename} via Netlify`,
          content,
          sha,
          branch: BRANCH,
        })
      });

      if (!putRes.ok) {
        const text = await putRes.text();
        return withCors({ statusCode: putRes.status, body: JSON.stringify({ error: 'GitHub write failed', details: text }) });
      }

      const result = await putRes.json();
      return withCors({ statusCode: 200, body: JSON.stringify({ ok: true, commit: result.commit && result.commit.sha }) });
    }

    return withCors({ statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) });
  } catch (err) {
    return withCors({ statusCode: 500, body: JSON.stringify({ error: 'Unhandled error', details: String(err) }) });
  }
}


// Basic CORS helper
function withCors(response) {
  const defaultHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
  return {
    ...response,
    headers: {
      ...defaultHeaders,
      ...(response.headers || {}),
    }
  };
}


