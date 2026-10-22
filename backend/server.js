/**
 * ============================================================================
 * NOVA API — Micro-Backend Multitenant ERP, Leads, SMTP & VeriFactu (Puerto 3006)
 * Consumo ultrabajo de RAM (~45 MB en PM2) · Base de datos PostgreSQL db_nova
 * Configuración 100% parametrizada por variables de entorno (.env)
 * ============================================================================
 */
const http = require('http');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');

const PORT = Number(process.env.PORT || 3006);
const TENANT_ID = process.env.DEFAULT_TENANT_ID || 'tenant-nova-soto';
const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://nova_user:NovaSoto2026_DbPwd!@127.0.0.1:5432/db_nova';

const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 5,
  idleTimeoutMillis: 30000
});

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Tenant-Id'
  });
  res.end(body);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      if (raw.length > 5 * 1024 * 1024) {
        reject(new Error('Payload too large'));
      }
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

async function handleRequest(req, res) {
  if (req.method === 'OPTIONS') {
    return sendJson(res, 200, { ok: true });
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const path = url.pathname;
  const tenantId = req.headers['x-tenant-id'] || TENANT_ID;

  try {
    // 1. Healthcheck y estado de conexión a PostgreSQL db_nova
    if (req.method === 'GET' && path === '/api/v1/health') {
      const dbRes = await pool.query('SELECT NOW() AS server_time');
      const countRes = await pool.query(
        'SELECT COUNT(*)::int AS total_leads FROM nova_leads WHERE tenant_id = $1',
        [tenantId]
      );
      return sendJson(res, 200, {
        status: 'OK',
        service: 'nova-api',
        port: PORT,
        database: 'db_nova',
        serverTime: dbRes.rows[0]?.server_time,
        leadsCount: countRes.rows[0]?.total_leads ?? 0
      });
    }

    // 2. Obtener estado persistido completo del Portal Multitenant
    if (req.method === 'GET' && path === '/api/v1/state') {
      const stateRow = await pool.query(
        'SELECT state_json, updated_at FROM nova_state_store WHERE tenant_id = $1',
        [tenantId]
      );
      const leadsRows = await pool.query(
        'SELECT id, created_at AS "createdAtIso", full_name AS "fullName", phone, email, city, project_type AS "projectType", recommended_system AS "recommendedSystem", status FROM nova_leads WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 100',
        [tenantId]
      );
      return sendJson(res, 200, {
        hasStoredState: stateRow.rowCount > 0,
        state: stateRow.rows[0]?.state_json || null,
        leads: leadsRows.rows,
        updatedAt: stateRow.rows[0]?.updated_at || null
      });
    }

    // 3. Guardar estado completo del Portal (Catálogo, Presupuestos, Almacén, Facturas VeriFactu)
    if (req.method === 'PUT' && path === '/api/v1/state') {
      const body = await readJsonBody(req);
      await pool.query(
        `INSERT INTO nova_state_store (tenant_id, state_json, updated_at)
         VALUES ($1, $2::jsonb, NOW())
         ON CONFLICT (tenant_id)
         DO UPDATE SET state_json = EXCLUDED.state_json, updated_at = NOW()`,
        [tenantId, JSON.stringify(body)]
      );

      // Sincronizar también la tabla auditable de facturas encadenadas VeriFactu
      if (Array.isArray(body.invoices)) {
        for (const inv of body.invoices) {
          await pool.query(
            `INSERT INTO nova_invoices_chain (
              id, tenant_id, series_and_number, invoice_type, order_code,
              client_name, client_nif, work_description, issue_date_iso,
              dias_pago, due_date_iso, base_imponible_eur, vat_rate_percent,
              vat_amount_eur, retencion_garantia_eur, total_importe_eur,
              cobrado_eur, operational_status, payment_status,
              previous_hash_64, current_hash_64, aeat_qr_url, aeat_submission_state
            ) VALUES (
              $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23
            )
            ON CONFLICT (series_and_number) DO UPDATE SET
              cobrado_eur = EXCLUDED.cobrado_eur,
              operational_status = EXCLUDED.operational_status,
              payment_status = EXCLUDED.payment_status,
              aeat_submission_state = EXCLUDED.aeat_submission_state`,
            [
              inv.id,
              tenantId,
              inv.seriesAndNumber,
              inv.invoiceType,
              inv.orderCode || '',
              inv.clientName,
              inv.clientNif,
              inv.workDescription || '',
              inv.issueDateIso,
              inv.diasPago ?? 0,
              inv.dueDateIso,
              inv.baseImponibleEur,
              inv.vatRatePercent,
              inv.vatAmountEur,
              inv.retencionGarantia5PercentEur || 0,
              inv.totalImporteEur,
              inv.cobradoEur || 0,
              inv.operationalStatus,
              inv.paymentStatus,
              inv.previousHash64,
              inv.currentHash64,
              inv.aeatQrUrl,
              inv.aeatSubmissionState || 'HUELLA_GENERADA'
            ]
          );
        }
      }

      return sendJson(res, 200, { ok: true, savedAt: new Date().toISOString() });
    }

    // 4. Registrar Lead directo desde el Configurador de la Web Pública
    if (req.method === 'POST' && path === '/api/v1/leads') {
      const lead = await readJsonBody(req);
      const id = lead.id || `lead-${Date.now()}`;
      await pool.query(
        `INSERT INTO nova_leads (id, tenant_id, full_name, phone, email, city, project_type, recommended_system, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'NUEVO_WEB')
         ON CONFLICT (id) DO NOTHING`,
        [
          id,
          tenantId,
          lead.fullName || 'Cliente Web NOVA',
          lead.phone || '',
          lead.email || '',
          lead.city || 'Murcia',
          lead.projectType || 'OBRA_NUEVA',
          lead.recommendedSystem || 'Prescripción Técnica NOVA'
        ]
      );
      return sendJson(res, 201, { ok: true, id });
    }

    // 5. Envío y registro de Correo Corporativo SMTP / IMAP
    if (req.method === 'POST' && path === '/api/v1/emails/send') {
      const payload = await readJsonBody(req);
      const id = `emsg-${Date.now()}`;
      let deliveryMode = 'REGISTRADO_EN_EXPEDIENTE';

      if (payload.smtpPassword && payload.smtpHost) {
        const transporter = nodemailer.createTransport({
          host: payload.smtpHost,
          port: Number(payload.smtpPort || 587),
          secure: Number(payload.smtpPort) === 465,
          auth: {
            user: payload.accountEmail,
            pass: payload.smtpPassword
          }
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
          payload.accountEmail || 'presupuestos@novaventanasypuertas.com',
          payload.counterpartEmail || '',
          payload.counterpartName || '',
          payload.linkedDocumentCode || '',
          payload.subject || '',
          payload.snippet || '',
          deliveryMode
        ]
      );

      return sendJson(res, 200, { ok: true, id, deliveryMode });
    }

    return sendJson(res, 404, { error: 'Endpoint no encontrado en nova-api', path });
  } catch (err) {
    console.error('[nova-api error]:', err);
    return sendJson(res, 500, { error: err.message || 'Internal Server Error' });
  }
}

const server = http.createServer(handleRequest);
server.listen(PORT, '127.0.0.1', () => {
  console.log(`✅ [nova-api] Escuchando en http://127.0.0.1:${PORT} (DB: db_nova)`);
});
