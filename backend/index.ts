interface Env {
  DB: any; // D1 Database
}

interface Service {
  id?: number;
  user_id: string;
  category: 'bike' | 'lift' | 'tuition' | 'notes' | 'room';
  type: 'offer' | 'request';
  title: string;
  description?: string;
  contact_number?: string;
  contact_name?: string;
  location?: string;
  created_at: number;
  updated_at: number;
  is_active?: number;
}

interface ApiResponse<T> {
  data?: T;
  error?: { code: string; message: string; details?: unknown };
  status: number;
  timestamp: string;
}

// --- Helpers ---
function corsHeaders(origin?: string) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Encrypted-Yw-ID, X-Is-Login, X-Project-Id',
  };
}

function jsonResponse<T>(payload: ApiResponse<T>, status = 200, origin?: string) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  });
}

// --- API Handler ---
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '*';
    const userId = request.headers.get('X-Encrypted-Yw-ID') || '';

    // Handle CORS preflight
    if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders(origin) });

    try {
      // --- GET /api/services ---
      if (url.pathname === '/api/services' && request.method === 'GET') {
        const category = url.searchParams.get('category');
        const type = url.searchParams.get('type');
        const search = url.searchParams.get('search');

        let query = 'SELECT * FROM services WHERE is_active = 1';
        const params: any[] = [];

        if (category) { query += ' AND category = ?'; params.push(category); }
        if (type) { query += ' AND type = ?'; params.push(type); }
        if (search) { query += ' AND (title LIKE ? OR description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }

        query += ' ORDER BY created_at DESC';

        const res = await env.DB.prepare(query).bind(...params).all();
        const results = res.results || [];

        return jsonResponse({ data: results, status: 200, timestamp: new Date().toISOString() }, 200, origin);
      }

      // --- GET /api/services/:id ---
      if (url.pathname.startsWith('/api/services/') && request.method === 'GET' && !url.pathname.endsWith('/my')) {
        const parts = url.pathname.split('/');
        const id = parts[3];
        if (!id || isNaN(Number(id))) {
          return jsonResponse({ error: { code: 'INVALID_ID', message: 'Invalid service ID' }, status: 400, timestamp: new Date().toISOString() }, 400, origin);
        }

        const res = await env.DB.prepare('SELECT * FROM services WHERE id = ? AND is_active = 1').bind(id).all();
        const results = res.results || [];

        if (!results.length) {
          return jsonResponse({ error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' }, status: 404, timestamp: new Date().toISOString() }, 404, origin);
        }

        return jsonResponse({ data: results[0], status: 200, timestamp: new Date().toISOString() }, 200, origin);
      }

      // --- GET /api/services/my ---
      if (url.pathname === '/api/services/my' && request.method === 'GET') {
        if (!userId) return jsonResponse({ error: { code: 'UNAUTHORIZED', message: 'Unauthorized' }, status: 401, timestamp: new Date().toISOString() }, 401, origin);

        const res = await env.DB.prepare('SELECT * FROM services WHERE user_id = ? AND is_active = 1 ORDER BY created_at DESC').bind(userId).all();
        const results = res.results || [];

        return jsonResponse({ data: results, status: 200, timestamp: new Date().toISOString() }, 200, origin);
      }

      // --- POST /api/services ---
      if (url.pathname === '/api/services' && request.method === 'POST') {
        if (!userId) return jsonResponse({ error: { code: 'UNAUTHORIZED', message: 'Unauthorized' }, status: 401, timestamp: new Date().toISOString() }, 401, origin);

        const body = await request.json() as Partial<Service>;
        if (!body.category || !body.type || !body.title) return jsonResponse({ error: { code: 'VALIDATION_ERROR', message: 'Missing required fields: category, type, title' }, status: 400, timestamp: new Date().toISOString() }, 400, origin);

        const now = Date.now();
        const stmt = env.DB.prepare(
          `INSERT INTO services (user_id, category, type, title, description, contact_number, contact_name, location, created_at, updated_at, is_active)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`
        );

        const result = await stmt.bind(userId, body.category, body.type, body.title, body.description || null, body.contact_number || null, body.contact_name || null, body.location || null, now, now).run();

        return jsonResponse({ data: { id: result.meta.last_row_id }, status: 201, timestamp: new Date().toISOString() }, 201, origin);
      }

      // --- PUT /api/services/:id ---
      if (url.pathname.startsWith('/api/services/') && request.method === 'PUT') {
        if (!userId) return jsonResponse({ error: { code: 'UNAUTHORIZED', message: 'Unauthorized' }, status: 401, timestamp: new Date().toISOString() }, 401, origin);

        const parts = url.pathname.split('/');
        const id = parts[3];
        if (!id || isNaN(Number(id))) return jsonResponse({ error: { code: 'INVALID_ID', message: 'Invalid service ID' }, status: 400, timestamp: new Date().toISOString() }, 400, origin);

        const body = await request.json() as Partial<Service>;
        const res = await env.DB.prepare('SELECT * FROM services WHERE id = ? AND is_active = 1').bind(id).all();
        const results = res.results || [];

        if (!results.length) return jsonResponse({ error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' }, status: 404, timestamp: new Date().toISOString() }, 404, origin);
        if (results[0].user_id.toString() !== userId.toString()) return jsonResponse({ error: { code: 'FORBIDDEN', message: 'Not your service' }, status: 403, timestamp: new Date().toISOString() }, 403, origin);

        const now = Date.now();
        await env.DB.prepare(
          `UPDATE services SET title = ?, description = ?, contact_number = ?, contact_name = ?, location = ?, updated_at = ? WHERE id = ?`
        ).bind(body.title || results[0].title, body.description ?? results[0].description, body.contact_number ?? results[0].contact_number, body.contact_name ?? results[0].contact_name, body.location ?? results[0].location, now, id).run();

        return jsonResponse({ data: null, status: 200, timestamp: new Date().toISOString() }, 200, origin);
      }

      // --- DELETE /api/services/:id ---
      if (url.pathname.startsWith('/api/services/') && request.method === 'DELETE') {
        if (!userId) return jsonResponse({ error: { code: 'UNAUTHORIZED', message: 'Unauthorized' }, status: 401, timestamp: new Date().toISOString() }, 401, origin);

        const parts = url.pathname.split('/');
        const id = parts[3];
        if (!id || isNaN(Number(id))) return jsonResponse({ error: { code: 'INVALID_ID', message: 'Invalid service ID' }, status: 400, timestamp: new Date().toISOString() }, 400, origin);

        const res = await env.DB.prepare('SELECT * FROM services WHERE id = ? AND is_active = 1').bind(id).all();
        const results = res.results || [];

        if (!results.length) return jsonResponse({ error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' }, status: 404, timestamp: new Date().toISOString() }, 404, origin);
        if (results[0].user_id.toString() !== userId.toString()) return jsonResponse({ error: { code: 'FORBIDDEN', message: 'Not your service' }, status: 403, timestamp: new Date().toISOString() }, 403, origin);

        await env.DB.prepare('UPDATE services SET is_active = 0 WHERE id = ?').bind(id).run();
        return jsonResponse({ data: null, status: 200, timestamp: new Date().toISOString() }, 200, origin);
      }

      // --- PATCH /api/services/:id/status ---
      if (url.pathname.endsWith('/status') && request.method === 'PATCH') {
        if (!userId) return jsonResponse({ error: { code: 'UNAUTHORIZED', message: 'Unauthorized' }, status: 401, timestamp: new Date().toISOString() }, 401, origin);

        const parts = url.pathname.split('/');
        const id = parts[3];
        if (!id || isNaN(Number(id))) return jsonResponse({ error: { code: 'INVALID_ID', message: 'Invalid service ID' }, status: 400, timestamp: new Date().toISOString() }, 400, origin);

        const body = await request.json() as { is_active: boolean };
        const res = await env.DB.prepare('SELECT * FROM services WHERE id = ?').bind(id).all();
        const results = res.results || [];

        if (!results.length) return jsonResponse({ error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' }, status: 404, timestamp: new Date().toISOString() }, 404, origin);
        if (results[0].user_id.toString() !== userId.toString()) return jsonResponse({ error: { code: 'FORBIDDEN', message: 'Not your service' }, status: 403, timestamp: new Date().toISOString() }, 403, origin);

        const now = Date.now();
        await env.DB.prepare('UPDATE services SET is_active = ?, updated_at = ? WHERE id = ?').bind(body.is_active ? 1 : 0, now, id).run();

        return jsonResponse({ data: { ...results[0], is_active: body.is_active ? 1 : 0, updated_at: now }, status: 200, timestamp: new Date().toISOString() }, 200, origin);
      }

      // --- Default Not Found ---
      return jsonResponse({ error: { code: 'NOT_FOUND', message: 'Endpoint not found' }, status: 404, timestamp: new Date().toISOString() }, 404, origin);

    } catch (error: any) {
      console.error('API Error:', error);
      return jsonResponse({ error: { code: 'INTERNAL_SERVER_ERROR', message: error.message || 'Internal Server Error', details: error }, status: 500, timestamp: new Date().toISOString() }, 500, origin);
    }
  },
};
