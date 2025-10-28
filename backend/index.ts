interface Env {
  DB: any;
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

// Helper to create CORS headers
function corsHeaders(origin?: string) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Encrypted-Yw-ID, X-Is-Login, X-Project-Id',
  };
}

// Helper to create JSON response
function jsonResponse<T>(payload: ApiResponse<T>, status = 200, origin?: string) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(origin),
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(origin) });
    }

    const userId = request.headers.get('X-Encrypted-Yw-ID') || '';
    const isLogin = request.headers.get('X-Is-Login') === '1';

    try {

      // GET /api/services - list all services

      if (url.pathname === '/api/services' && request.method === 'GET') {
        const category = url.searchParams.get('category');
        const type = url.searchParams.get('type');
        const search = url.searchParams.get('search');

        let query = 'SELECT * FROM services WHERE is_active = 1';
        const params: any[] = [];

        if (category) {
          query += ' AND category = ?';
          params.push(category);
        }

        if (type) {
          query += ' AND type = ?';
          params.push(type);
        }

        if (search) {
          query += ' AND (title LIKE ? OR description LIKE ?)';
          params.push(`%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY created_at DESC';

        const stmt = env.DB.prepare(query);
        const { results } = await stmt.bind(...params).all();

        return jsonResponse({ data: results, status: 200, timestamp: new Date().toISOString() }, 200, origin);
      }

      // GET /api/services/:id - get single service
      
      if (url.pathname.startsWith('/api/services/') && request.method === 'GET' && !url.pathname.endsWith('/my')) {
        const parts = url.pathname.split('/');
        const id = parts[3]; // /api/services/:id

        const stmt = env.DB.prepare('SELECT * FROM services WHERE id = ? AND is_active = 1');
        const { results } = await stmt.bind(id).all();

        if (!results.length) {
          return jsonResponse({
            error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' },
            status: 404,
            timestamp: new Date().toISOString()
          }, 404, origin);
        }

        return jsonResponse({ data: results[0], status: 200, timestamp: new Date().toISOString() }, 200, origin);
      }

      // GET /api/services/my - current user's services
      if (url.pathname === '/api/services/my' && request.method === 'GET') {
        if (!userId) {
          return jsonResponse({
            error: { code: 'UNAUTHORIZED', message: 'Unauthorized' },
            status: 401,
            timestamp: new Date().toISOString()
          }, 401, origin);
        }

        const stmt = env.DB.prepare('SELECT * FROM services WHERE user_id = ? AND is_active = 1 ORDER BY created_at DESC');
        const { results } = await stmt.bind(userId).all();

        return jsonResponse({ data: results, status: 200, timestamp: new Date().toISOString() }, 200, origin);
      }

 
      if (url.pathname === '/api/services' && request.method === 'POST') {
        if (!userId) {
          return jsonResponse({
            error: { code: 'UNAUTHORIZED', message: 'Unauthorized - User ID required' },
            status: 401,
            timestamp: new Date().toISOString()
          }, 401, origin);
        }

        const body = await request.json() as Partial<Service>;

        if (!body.category || !body.type || !body.title) {
          return jsonResponse({
            error: { code: 'VALIDATION_ERROR', message: 'Missing required fields: category, type, title' },
            status: 400,
            timestamp: new Date().toISOString()
          }, 400, origin);
        }

        const now = Date.now();
        const stmt = env.DB.prepare(
          `INSERT INTO services 
           (user_id, category, type, title, description, contact_number, contact_name, location, created_at, updated_at, is_active) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`
        );

        const result = await stmt.bind(
          userId,
          body.category,
          body.type,
          body.title,
          body.description || null,
          body.contact_number || null,
          body.contact_name || null,
          body.location || null,
          now,
          now
        ).run();

        return jsonResponse({
          data: { id: result.meta.last_row_id },
          status: 201,
          timestamp: new Date().toISOString()
        }, 201, origin);
      }

 
      if (url.pathname.startsWith('/api/services/') && request.method === 'PUT') {
        if (!userId) {
          return jsonResponse({
            error: { code: 'UNAUTHORIZED', message: 'Unauthorized' },
            status: 401,
            timestamp: new Date().toISOString()
          }, 401, origin);
        }

        const parts = url.pathname.split('/');
        const id = parts[3];
        const body = await request.json() as Partial<Service>;

        const checkStmt = env.DB.prepare('SELECT * FROM services WHERE id = ? AND is_active = 1');
        const { results } = await checkStmt.bind(id).all();

        if (!results.length) {
          return jsonResponse({
            error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' },
            status: 404,
            timestamp: new Date().toISOString()
          }, 404, origin);
        }

        if (results[0].user_id !== userId) {
          return jsonResponse({
            error: { code: 'FORBIDDEN', message: 'Not your service' },
            status: 403,
            timestamp: new Date().toISOString()
          }, 403, origin);
        }

        const now = Date.now();
        const updateStmt = env.DB.prepare(
          `UPDATE services 
           SET title = ?, description = ?, contact_number = ?, contact_name = ?, location = ?, updated_at = ? 
           WHERE id = ?`
        );

        await updateStmt.bind(
          body.title || results[0].title,
          body.description !== undefined ? body.description : results[0].description,
          body.contact_number !== undefined ? body.contact_number : results[0].contact_number,
          body.contact_name !== undefined ? body.contact_name : results[0].contact_name,
          body.location !== undefined ? body.location : results[0].location,
          now,
          id
        ).run();

        return jsonResponse({ data: null, status: 200, timestamp: new Date().toISOString() }, 200, origin);
      }

      if (url.pathname.startsWith('/api/services/') && request.method === 'DELETE') {
        if (!userId) {
          return jsonResponse({
            error: { code: 'UNAUTHORIZED', message: 'Unauthorized' },
            status: 401,
            timestamp: new Date().toISOString()
          }, 401, origin);
        }

        const parts = url.pathname.split('/');
        const id = parts[3];

        const checkStmt = env.DB.prepare('SELECT * FROM services WHERE id = ? AND is_active = 1');
        const { results } = await checkStmt.bind(id).all();

        if (!results.length) {
          return jsonResponse({
            error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' },
            status: 404,
            timestamp: new Date().toISOString()
          }, 404, origin);
        }

        if (results[0].user_id !== userId) {
          return jsonResponse({
            error: { code: 'FORBIDDEN', message: 'Not your service' },
            status: 403,
            timestamp: new Date().toISOString()
          }, 403, origin);
        }

        const deleteStmt = env.DB.prepare('UPDATE services SET is_active = 0 WHERE id = ?');
        await deleteStmt.bind(id).run();

        return jsonResponse({ data: null, status: 200, timestamp: new Date().toISOString() }, 200, origin);
      }

  
      if (url.pathname.endsWith('/status') && request.method === 'PATCH') {
        if (!userId) {
          return jsonResponse({
            error: { code: 'UNAUTHORIZED', message: 'Unauthorized' },
            status: 401,
            timestamp: new Date().toISOString()
          }, 401, origin);
        }

        const parts = url.pathname.split('/');
        const id = parts[3]; // /api/services/:id/status
        const body = await request.json() as { is_active: boolean };

        const checkStmt = env.DB.prepare('SELECT * FROM services WHERE id = ?');
        const { results } = await checkStmt.bind(id).all();

        if (!results.length) {
          return jsonResponse({
            error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' },
            status: 404,
            timestamp: new Date().toISOString()
          }, 404, origin);
        }

        if (results[0].user_id !== userId) {
          return jsonResponse({
            error: { code: 'FORBIDDEN', message: 'Not your service' },
            status: 403,
            timestamp: new Date().toISOString()
          }, 403, origin);
        }

        const now = Date.now();
        const updateStmt = env.DB.prepare('UPDATE services SET is_active = ?, updated_at = ? WHERE id = ?');
        await updateStmt.bind(body.is_active ? 1 : 0, now, id).run();

        return jsonResponse({
          data: { ...results[0], is_active: body.is_active ? 1 : 0, updated_at: now },
          status: 200,
          timestamp: new Date().toISOString()
        }, 200, origin);
      }

   
      return jsonResponse({
        error: { code: 'NOT_FOUND', message: 'Endpoint not found' },
        status: 404,
        timestamp: new Date().toISOString()
      }, 404, origin);

    } catch (error: any) {
      console.error('API Error:', error);
      return jsonResponse({
        error: { code: 'INTERNAL_SERVER_ERROR', message: error.message || 'Internal Server Error', details: error },
        status: 500,
        timestamp: new Date().toISOString()
      }, 500, origin);
    }
  },
};

// interface Env {
//   DB: any; // Use D1Database in prod
// }

// interface Service {
//   id?: number;
//   user_id: string;
//   category: 'bike' | 'lift' | 'tuition' | 'notes' | 'room';
//   type: 'offer' | 'request';
//   title: string;
//   description?: string;
//   contact_number?: string;
//   contact_name?: string;
//   location?: string;
//   created_at: number;
//   updated_at: number;
//   is_active?: number;
// }

// interface ApiResponse<T> {
//   data?: T;
//   error?: { code: string; message: string; details?: unknown };
//   status: number;
//   timestamp: string;
// }

// function corsHeaders(origin?: string) {
//   return {
//     'Access-Control-Allow-Origin': origin || '*',
//     'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
//     'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Encrypted-Yw-ID, X-Is-Login, X-Project-Id',
//   };
// }

// function jsonResponse<T>(payload: ApiResponse<T>, status = 200, origin?: string) {
//   return new Response(JSON.stringify(payload), {
//     status,
//     headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
//   });
// }

// export default {
//   async fetch(request: Request, env: Env): Promise<Response> {
//     const url = new URL(request.url);
//     const origin = request.headers.get('Origin');
//     const userId = request.headers.get('X-Encrypted-Yw-ID') || '';

//     if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders(origin) });

//     try {
//       // --- GET /services ---
//       if (url.pathname === '/api/services' && request.method === 'GET') {
//         let query = 'SELECT * FROM services WHERE is_active = 1';
//         const params: any[] = [];

//         const category = url.searchParams.get('category');
//         const type = url.searchParams.get('type');
//         const search = url.searchParams.get('search');

//         if (category) { query += ' AND category = ?'; params.push(category); }
//         if (type) { query += ' AND type = ?'; params.push(type); }
//         if (search) { query += ' AND (title LIKE ? OR description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }

//         query += ' ORDER BY created_at DESC';

//         const stmt = env.DB.prepare(query);
//         const { results } = await stmt.bind(...params).all();

//         return jsonResponse({ data: results, status: 200, timestamp: new Date().toISOString() }, 200, origin);
//       }

   
//       if (url.pathname.startsWith('/api/services/') && request.method === 'GET') {
//         const parts = url.pathname.split('/');
//         const id = parts[3];
//         const stmt = env.DB.prepare('SELECT * FROM services WHERE id = ? AND is_active = 1');
//         const { results } = await stmt.bind(id).all();

//         if (!results.length) return jsonResponse({
//           error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' },
//           status: 404,
//           timestamp: new Date().toISOString()
//         }, 404, origin);

//         return jsonResponse({ data: results[0], status: 200, timestamp: new Date().toISOString() }, 200, origin);
//       }

//       // --- POST /services ---
//       if (url.pathname === '/api/services' && request.method === 'POST') {
//         if (!userId) return jsonResponse({
//           error: { code: 'UNAUTHORIZED', message: 'Unauthorized' },
//           status: 401,
//           timestamp: new Date().toISOString()
//         }, 401, origin);

//         const body = await request.json() as Partial<Service>;
//         if (!body.category || !body.type || !body.title) return jsonResponse({
//           error: { code: 'VALIDATION_ERROR', message: 'Missing required fields' },
//           status: 400,
//           timestamp: new Date().toISOString()
//         }, 400, origin);

//         const now = Date.now();
//         const stmt = env.DB.prepare(`INSERT INTO services 
//           (user_id, category, type, title, description, contact_number, contact_name, location, created_at, updated_at, is_active)
//           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`);
//         const result = await stmt.bind(
//           userId, body.category, body.type, body.title,
//           body.description || null, body.contact_number || null,
//           body.contact_name || null, body.location || null,
//           now, now
//         ).run();

//         return jsonResponse({ data: { id: result.meta.last_row_id }, status: 201, timestamp: new Date().toISOString() }, 201, origin);
//       }

//       // --- PUT /services/:id ---
//       if (url.pathname.startsWith('/api/services/') && request.method === 'PUT') {
//         if (!userId) return jsonResponse({
//           error: { code: 'UNAUTHORIZED', message: 'Unauthorized' },
//           status: 401,
//           timestamp: new Date().toISOString()
//         }, 401, origin);

//         const parts = url.pathname.split('/');
//         const id = parts[3];
//         const body = await request.json() as Partial<Service>;

//         const checkStmt = env.DB.prepare('SELECT * FROM services WHERE id = ? AND is_active = 1');
//         const { results } = await checkStmt.bind(id).all();

//         if (!results.length) return jsonResponse({
//           error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' },
//           status: 404,
//           timestamp: new Date().toISOString()
//         }, 404, origin);

//         if (results[0].user_id !== userId) return jsonResponse({
//           error: { code: 'FORBIDDEN', message: 'Not your service' },
//           status: 403,
//           timestamp: new Date().toISOString()
//         }, 403, origin);

//         const now = Date.now();
//         const updateStmt = env.DB.prepare(
//           `UPDATE services SET title = ?, description = ?, contact_number = ?, contact_name = ?, location = ?, updated_at = ? WHERE id = ?`
//         );
//         await updateStmt.bind(
//           body.title || results[0].title,
//           body.description ?? results[0].description,
//           body.contact_number ?? results[0].contact_number,
//           body.contact_name ?? results[0].contact_name,
//           body.location ?? results[0].location,
//           now,
//           id
//         ).run();

//         return jsonResponse({ data: null, status: 200, timestamp: new Date().toISOString() }, 200, origin);
//       }

//       // --- DELETE /services/:id ---
//       if (url.pathname.startsWith('/api/services/') && request.method === 'DELETE') {
//         if (!userId) return jsonResponse({
//           error: { code: 'UNAUTHORIZED', message: 'Unauthorized' },
//           status: 401,
//           timestamp: new Date().toISOString()
//         }, 401, origin);

//         const parts = url.pathname.split('/');
//         const id = parts[3];
//         const checkStmt = env.DB.prepare('SELECT * FROM services WHERE id = ? AND is_active = 1');
//         const { results } = await checkStmt.bind(id).all();

//         if (!results.length) return jsonResponse({
//           error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' },
//           status: 404,
//           timestamp: new Date().toISOString()
//         }, 404, origin);

//         if (results[0].user_id !== userId) return jsonResponse({
//           error: { code: 'FORBIDDEN', message: 'Not your service' },
//           status: 403,
//           timestamp: new Date().toISOString()
//         }, 403, origin);

//         const deleteStmt = env.DB.prepare('UPDATE services SET is_active = 0 WHERE id = ?');
//         await deleteStmt.bind(id).run();

//         return jsonResponse({ data: null, status: 200, timestamp: new Date().toISOString() }, 200, origin);
//       }

//       return jsonResponse({ error: { code: 'NOT_FOUND', message: 'Endpoint not found' }, status: 404, timestamp: new Date().toISOString() }, 404, origin);
//     } catch (err: any) {
//       return jsonResponse({ error: { code: 'INTERNAL_SERVER_ERROR', message: err.message, details: err }, status: 500, timestamp: new Date().toISOString() }, 500, origin);
//     }
//   },
// };
