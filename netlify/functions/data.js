// Netlify Function: Unified data read/write to GitHub Contents API
// Methods:
// - GET /api/data?filename=users.json -> returns parsed JSON array/object
// - PUT /api/data  body: { filename: "users.json", data: any, message?: string }

exports.handler = async function(event) {
  const GITHUB_REPO = process.env.GITHUB_REPO;
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

  if (!GITHUB_REPO || !GITHUB_TOKEN) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server misconfiguration: missing GITHUB_REPO or GITHUB_TOKEN' }),
    };
  }

  const baseUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/data`;

  try {
    if (event.httpMethod === 'GET') {
      const params = new URLSearchParams(event.queryStringParameters || {});
      const filename = params.get('filename') || (event.queryStringParameters && event.queryStringParameters.filename);
      if (!filename) {
        return { statusCode: 400, body: JSON.stringify({ error: 'filename is required' }) };
      }

      const res = await fetch(`${baseUrl}/${filename}`, {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'netlify-function'
        },
      });

      if (!res.ok) {
        return { statusCode: res.status, body: JSON.stringify({ error: `GitHub fetch failed: ${res.status}` }) };
      }

      const payload = await res.json();
      const decoded = Buffer.from(payload.content, 'base64').toString('utf8');
      return { statusCode: 200, body: decoded, headers: { 'Content-Type': 'application/json' } };
    }

    if (event.httpMethod === 'PUT' || event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { filename, data, message } = body;
      if (!filename) {
        return { statusCode: 400, body: JSON.stringify({ error: 'filename is required' }) };
      }
      if (typeof data === 'undefined') {
        return { statusCode: 400, body: JSON.stringify({ error: 'data is required' }) };
      }

      // Get current sha if exists
      let sha = undefined;
      const getRes = await fetch(`${baseUrl}/${filename}`, {
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

      const putRes = await fetch(`${baseUrl}/${filename}`, {
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
        })
      });

      if (!putRes.ok) {
        const text = await putRes.text();
        return { statusCode: putRes.status, body: JSON.stringify({ error: 'GitHub write failed', details: text }) };
      }

      const result = await putRes.json();
      return { statusCode: 200, body: JSON.stringify({ ok: true, commit: result.commit && result.commit.sha }) };
    }

    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Unhandled error', details: String(err) }) };
  }
}


