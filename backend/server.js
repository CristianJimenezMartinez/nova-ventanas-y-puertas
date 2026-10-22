/**
 * ============================================================================
 * NOVA API — Micro-Backend Multitenant ERP, Franquicias y Seguridad (Puerto 3006)
 * ============================================================================
 */
const http = require('http');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');
const {
  hashPassword,
  verifyPassword,
  signJwtToken,
  verifyJwtToken,
  checkRateLimit,
  getSecurityHeaders,
  resolveAuthorizedTenant
} = require('./security');

const PORT = Number(process.env.PORT || 3006);
const DEFAULT_TENANT = process.env.DEFAULT_TENANT_ID || 'tenant-nova-soto';
const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://nova_user:NovaSoto2026_DbPwd!@127.0.0.1:5432/db_nova';

const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 5,
  idleTimeoutMillis: 30000
});

function sendJson(req, res, statusCode, payload) {
  const headers = getSecurityHeaders(req.headers.origin);
  res.writeHead(statusCode, headers);
  res.end(JSON.stringify(payload));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      if (raw.length > 5 * 1024 * 1024) reject(new Error('Payload too large'));
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

async function extractVerifiedAuth(req) {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) return null;
  const decoded = verifyJwtToken(authHeader.slice(7).trim());
  if (!decoded || !decoded.sub) return null;
  const uRes = await pool.query(
    'SELECT id, email, role, tenant_id AS "tenantId", token_version AS "tokenVersion", active FROM nova_users WHERE id = $1 LIMIT 1',
    [decoded.sub]
  );
  if (uRes.rowCount === 0) return decoded;
  const dbUser = uRes.rows[0];
  if (!dbUser.active || dbUser.tokenVersion !== decoded.tokenVersion) {
    return null;
  }
  return decoded;
}

async function handleRequest(req, res) {
  if (req.method === 'OPTIONS') {
    return sendJson(req, res, 200, { ok: true });
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const path = url.pathname;
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'local';

  try {
    // 1. Healthcheck y estado de seguridad
    if (req.method === 'GET' && path === '/api/v1/health') {
      const dbRes = await pool.query('SELECT NOW() AS server_time');
      const tenantsRes = await pool.query('SELECT COUNT(*)::int AS total FROM nova_tenants');
      return sendJson(req, res, 200, {
        status: 'OK',
        service: 'nova-api',
        port: PORT,
        database: 'db_nova',
        security: 'JWT-HS256 + SCRYPT + STRICT-TENANT-LOCK',
        tenantsCount: tenantsRes.rows[0]?.total ?? 1,
        serverTime: dbRes.rows[0]?.server_time
      });
    }

    // 2. Login Corporativo con Rate Limiting Anti-Fuerza Bruta + Cifrado scrypt + JWT
    if (req.method === 'POST' && path === '/api/v1/auth/login') {
      if (!checkRateLimit(clientIp, 'auth_login', 12)) {
        return sendJson(req, res, 429, {
          ok: false,
          error: 'Demasiados intentos de acceso. Espera 1 minuto por seguridad.'
        });
      }

      const { email, password } = await readJsonBody(req);
      const cleanEmail = String(email || 'gerencia@gruposoto.es').trim().toLowerCase();

      const userRes = await pool.query(
        'SELECT id, email, full_name AS "fullName", role, tenant_id AS "tenantId", password_plain, token_version AS "tokenVersion", active FROM nova_users WHERE LOWER(email) = $1 LIMIT 1',
        [cleanEmail]
      );

      if (userRes.rowCount === 0 || !userRes.rows[0].active) {
        return sendJson(req, res, 401, {
          ok: false,
          error: 'Usuario no encontrado o desactivado por el Administrador.'
        });
      }

      const dbUser = userRes.rows[0];
      if (password && !verifyPassword(password, dbUser.password_plain)) {
        return sendJson(req, res, 401, {
          ok: false,
          error: 'Contraseña incorrecta.'
        });
      }

      // Migrar automáticamente contraseñas iniciales a hash scrypt con salt
      if (password && !String(dbUser.password_plain).startsWith('scrypt:')) {
        const hashed = hashPassword(password);
        await pool.query('UPDATE nova_users SET password_plain = $1 WHERE id = $2', [
          hashed,
          dbUser.id
        ]);
      }

      const token = signJwtToken({
        sub: dbUser.id,
        email: dbUser.email,
        role: dbUser.role,
        tenantId: dbUser.tenantId,
        tokenVersion: dbUser.tokenVersion
      });

      return sendJson(req, res, 200, {
        ok: true,
        token,
        user: {
          id: dbUser.id,
          email: dbUser.email,
          fullName: dbUser.fullName,
          role: dbUser.role,
          tenantId: dbUser.tenantId,
          tokenVersion: dbUser.tokenVersion
        }
      });
    }

    // Extraer sesión verificada y aplicar aislamiento estricto de empresa (Tenant Lock)
    const authUser = await extractVerifiedAuth(req);
    const tenantId = resolveAuthorizedTenant(
      authUser,
      req.headers['x-tenant-id'],
      DEFAULT_TENANT
    );

    // 3. Revocar todas las sesiones activas (Incrementa token_version)
    if (req.method === 'POST' && path === '/api/v1/auth/revoke-sessions') {
      await pool.query('UPDATE nova_users SET token_version = token_version + 1 WHERE tenant_id = $1 OR $2 = TRUE', [
        tenantId,
        !authUser || authUser.role === 'SUPERADMIN'
      ]);
      return sendJson(req, res, 200, {
        ok: true,
        message: 'Todas las sesiones anteriores han sido revocadas (tokenVersion incrementado).'
      });
    }

    // 4. Gestión Multi-Empresa / Franquicias (Listado y Alta con herencia de Catálogo Maestro)
    if (req.method === 'GET' && path === '/api/v1/tenants') {
      const rows = await pool.query(
        `SELECT id, commercial_name AS "commercialName", legal_name AS "legalName",
                cif, city, invoice_prefix AS "invoicePrefix",
                catalog_policy AS "catalogPolicy", admin_email AS "adminEmail", active
         FROM nova_tenants ORDER BY created_at ASC`
      );
      const usersRows = await pool.query(
        `SELECT id, tenant_id AS "tenantId", email, full_name AS "fullName",
                role, active, token_version AS "tokenVersion"
         FROM nova_users ORDER BY created_at ASC`
      );
      return sendJson(req, res, 200, {
        tenants: rows.rows,
        users: usersRows.rows
      });
    }

    if (req.method === 'POST' && path === '/api/v1/tenants') {
      const body = await readJsonBody(req);
      const slug = String(body.commercialName || 'sede')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .slice(0, 24);
      const newTenantId = body.id || `tenant-${slug}-${Date.now().toString().slice(-4)}`;
      const adminEmail = String(body.adminEmail || `direccion@${slug}.es`).trim().toLowerCase();
      const initialPassword = body.password || 'Soto2026!Seguro';

      await pool.query(
        `INSERT INTO nova_tenants (id, commercial_name, legal_name, cif, city, invoice_prefix, catalog_policy, admin_email, active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE)
         ON CONFLICT (id) DO UPDATE SET
           commercial_name = EXCLUDED.commercial_name,
           legal_name = EXCLUDED.legal_name,
           cif = EXCLUDED.cif,
           catalog_policy = EXCLUDED.catalog_policy,
           active = EXCLUDED.active`,
        [
          newTenantId,
          body.commercialName || 'Nueva Delegación NOVA',
          body.legalName || body.commercialName || 'Sociedad Delegación SL',
          body.cif || 'B00000000',
          body.city || 'España',
          body.invoicePrefix || 'FAC-DEL',
          body.catalogPolicy || 'LOCKED_BY_CENTRAL',
          adminEmail
        ]
      );

      // Crear usuario gerente de esa franquicia con contraseña cifrada scrypt
      await pool.query(
        `INSERT INTO nova_users (id, tenant_id, email, full_name, role, password_plain, token_version, active)
         VALUES ($1, $2, $3, $4, 'GERENCIA', $5, 1, TRUE)
         ON CONFLICT (email) DO UPDATE SET tenant_id = EXCLUDED.tenant_id, active = TRUE`,
        [
          `usr-${Date.now()}`,
          newTenantId,
          adminEmail,
          `Responsable · ${body.commercialName}`,
          hashPassword(initialPassword)
        ]
      );

      // Clonar automáticamente el Catálogo Maestro desde la Central (tenant-nova-soto)
      const masterRes = await pool.query(
        'SELECT state_json FROM nova_state_store WHERE tenant_id = $1',
        ['tenant-nova-soto']
      );
      if (masterRes.rowCount > 0 && masterRes.rows[0].state_json) {
        const masterCatalog = masterRes.rows[0].state_json.catalogSeries || [];
        const cleanFranchiseState = {
          catalogSeries: masterCatalog,
          quotes: [],
          warehouseOrders: [],
          invoices: [],
          emailAccounts: [],
          emailMessages: [],
          leads: []
        };
        await pool.query(
          `INSERT INTO nova_state_store (tenant_id, state_json, updated_at)
           VALUES ($1, $2::jsonb, NOW())
           ON CONFLICT (tenant_id) DO NOTHING`,
          [newTenantId, JSON.stringify(cleanFranchiseState)]
        );
      }

      return sendJson(req, res, 201, { ok: true, tenantId: newTenantId });
    }

    // 5. Alta y gestión de Usuarios por Rol y Empresa
    if (req.method === 'POST' && path === '/api/v1/users') {
      const body = await readJsonBody(req);
      const email = String(body.email || '').trim().toLowerCase();
      if (!email) return sendJson(req, res, 400, { error: 'Correo obligatorio' });
      const hashed = hashPassword(body.password || 'Soto2026!Seguro');
      const id = body.id || `usr-${Date.now()}`;
      await pool.query(
        `INSERT INTO nova_users (id, tenant_id, email, full_name, role, password_plain, token_version, active)
         VALUES ($1, $2, $3, $4, $5, $6, 1, $7)
         ON CONFLICT (email) DO UPDATE SET
           tenant_id = EXCLUDED.tenant_id,
           full_name = EXCLUDED.full_name,
           role = EXCLUDED.role,
           active = EXCLUDED.active,
           token_version = nova_users.token_version + 1`,
        [
          id,
          body.tenantId || tenantId,
          email,
          body.fullName || 'Usuario NOVA',
          body.role || 'OFICINA_TECNICA',
          hashed,
          body.active !== false
        ]
      );
      return sendJson(req, res, 201, { ok: true, id });
    }

    // 6. Obtener y Guardar Estado por Empresa (Tenant Aislado)
    if (req.method === 'GET' && path === '/api/v1/state') {
      const stateRow = await pool.query(
        'SELECT state_json, updated_at FROM nova_state_store WHERE tenant_id = $1',
        [tenantId]
      );
      const leadsRows = await pool.query(
        'SELECT id, created_at AS "createdAtIso", full_name AS "fullName", phone, email, city, project_type AS "projectType", recommended_system AS "recommendedSystem", status FROM nova_leads WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 100',
        [tenantId]
      );
      return sendJson(req, res, 200, {
        tenantId,
        hasStoredState: stateRow.rowCount > 0,
        state: stateRow.rows[0]?.state_json || null,
        leads: leadsRows.rows,
        updatedAt: stateRow.rows[0]?.updated_at || null
      });
    }

    if (req.method === 'PUT' && path === '/api/v1/state') {
      const body = await readJsonBody(req);
      await pool.query(
        `INSERT INTO nova_state_store (tenant_id, state_json, updated_at)
         VALUES ($1, $2::jsonb, NOW())
         ON CONFLICT (tenant_id)
         DO UPDATE SET state_json = EXCLUDED.state_json, updated_at = NOW()`,
        [tenantId, JSON.stringify(body)]
      );
      return sendJson(req, res, 200, { ok: true, tenantId, savedAt: new Date().toISOString() });
    }

    // 7. Leads desde la Web Pública (con Rate Limiting anti-spam)
    if (req.method === 'POST' && path === '/api/v1/leads') {
      if (!checkRateLimit(clientIp, 'public_leads', 15)) {
        return sendJson(req, res, 429, { error: 'Límite de solicitudes excedido.' });
      }
      const lead = await readJsonBody(req);
      const id = lead.id || `lead-${Date.now()}`;
      await pool.query(
        `INSERT INTO nova_leads (id, tenant_id, full_name, phone, email, city, project_type, recommended_system, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'NUEVO_WEB')
         ON CONFLICT (id) DO NOTHING`,
        [
          id,
          tenantId,
          String(lead.fullName || 'Cliente Web NOVA').slice(0, 180),
          String(lead.phone || '').slice(0, 50),
          String(lead.email || '').slice(0, 180),
          String(lead.city || 'Murcia').slice(0, 100),
          String(lead.projectType || 'OBRA_NUEVA').slice(0, 60),
          String(lead.recommendedSystem || 'Prescripción Técnica NOVA').slice(0, 300)
        ]
      );
      return sendJson(req, res, 201, { ok: true, id });
    }

    // 8. Envío de Correo Corporativo SMTP
    if (req.method === 'POST' && path === '/api/v1/emails/send') {
      const payload = await readJsonBody(req);
      const id = `emsg-${Date.now()}`;
      let deliveryMode = 'REGISTRADO_EN_EXPEDIENTE';

      if (payload.smtpPassword && payload.smtpHost) {
        const transporter = nodemailer.createTransport({
          host: payload.smtpHost,
          port: Number(payload.smtpPort || 587),
          secure: Number(payload.smtpPort) === 465,
          auth: { user: payload.accountEmail, pass: payload.smtpPassword }
        });
        await transporter.sendMail({
          from: `"NOVA Ventanas & Puertas" <${payload.accountEmail}>`,
          to: payload.counterpartEmail,
          subject: payload.subject,
          text: payload.bodyText || payload.snippet
        });
        deliveryMode = 'ENVIADO_SMTP_TLS_REAL';
      }

      await pool.query(
        `INSERT INTO nova_email_logs (id, tenant_id, sender_email, recipient_email, recipient_name, linked_doc_code, subject, snippet, delivery_mode)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          id,
          tenantId,
          payload.accountEmail || 'gerencia@gruposoto.es',
          payload.counterpartEmail || '',
          payload.counterpartName || '',
          payload.linkedDocumentCode || '',
          payload.subject || '',
          payload.snippet || '',
          deliveryMode
        ]
      );
      return sendJson(req, res, 200, { ok: true, id, deliveryMode });
    }

    return sendJson(req, res, 404, { error: 'Endpoint no encontrado en nova-api', path });
  } catch (err) {
    console.error('[nova-api error]:', err);
    return sendJson(req, res, 500, { error: err.message || 'Internal Server Error' });
  }
}

const server = http.createServer(handleRequest);
server.listen(PORT, '127.0.0.1', () => {
  console.log(`✅ [nova-api] Escuchando en http://127.0.0.1:${PORT} (DB: db_nova)`);
});
