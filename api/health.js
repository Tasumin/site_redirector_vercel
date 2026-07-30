const TABLE = 'website_requests';

function sendJson(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store, no-cache, must-revalidate'
  });
  res.end(JSON.stringify(data, null, 2));
}

function getConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Supabase environment variables are not configured');
  }

  return { url, key };
}

async function checkDatabase() {
  const { url, key } = getConfig();
  const started = Date.now();

  const response = await fetch(
    `${url}/rest/v1/${TABLE}?select=id&limit=1`,
    {
      method: 'GET',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: 'count=exact',
        Range: '0-0'
      }
    }
  );

  const text = await response.text();
  let body = null;

  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  if (!response.ok) {
    const message = body?.message || body?.hint || `Supabase returned HTTP ${response.status}`;
    throw new Error(message);
  }

  const contentRange = response.headers.get('content-range') || '';
  const totalText = contentRange.split('/')[1];
  const requestCount = totalText && totalText !== '*' ? Number(totalText) : null;

  return {
    connected: true,
    table: TABLE,
    requestCount: Number.isFinite(requestCount) ? requestCount : null,
    responseTimeMs: Date.now() - started
  };
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return sendJson(res, 405, {
      status: 'unhealthy',
      error: 'Method not allowed'
    });
  }

  const path = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
    .pathname
    .toLowerCase()
    .replace(/\/$/, '') || '/health';

  const detailed = path === '/health/details';
  const timestamp = new Date().toISOString();

  try {
    const database = await checkDatabase();

    if (req.method === 'HEAD') {
      res.writeHead(200, {
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      });
      return res.end();
    }

    return sendJson(
      res,
      200,
      detailed
        ? {
            status: 'healthy',
            timestamp,
            service: 'TalonDNS',
            environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'unknown',
            vercel: {
              running: true,
              region: process.env.VERCEL_REGION || null,
              deploymentUrl: process.env.VERCEL_URL || null
            },
            supabase: database
          }
        : {
            status: 'healthy',
            timestamp,
            database: true
          }
    );
  } catch (error) {
    console.error('Health check failed:', error);

    if (req.method === 'HEAD') {
      res.writeHead(503, {
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      });
      return res.end();
    }

    return sendJson(
      res,
      503,
      detailed
        ? {
            status: 'unhealthy',
            timestamp,
            service: 'TalonDNS',
            supabase: {
              connected: false,
              table: TABLE,
              configured: Boolean(
                process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
              ),
              error: error instanceof Error ? error.message : 'Unknown database error'
            }
          }
        : {
            status: 'unhealthy',
            timestamp,
            database: false
          }
    );
  }
}
