-- ============================================================================
-- ESQUEMA OFICIAL POSTGRESQL — NOVA VENTANAS & PUERTAS (db_nova)
-- Multi-Empresa (Franquicias / Delegaciones) + Seguridad TokenVersion
-- ============================================================================

CREATE TABLE IF NOT EXISTS nova_tenants (
  id VARCHAR(64) PRIMARY KEY,
  commercial_name VARCHAR(200) NOT NULL,
  legal_name VARCHAR(200) NOT NULL,
  cif VARCHAR(40) NOT NULL,
  city VARCHAR(120) NOT NULL,
  invoice_prefix VARCHAR(24) NOT NULL DEFAULT 'FAC',
  catalog_policy VARCHAR(40) NOT NULL DEFAULT 'LOCKED_BY_CENTRAL',
  admin_email VARCHAR(200) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO nova_tenants (id, commercial_name, legal_name, cif, city, invoice_prefix, catalog_policy, admin_email, active)
VALUES
  ('tenant-nova-soto', 'NOVA Central · Murcia (Matriz)', 'GRUPO SOTO EMPRESARIAL SL', 'B73849102', 'Molina de Segura · Murcia', 'FAC-MUR', 'LOCKED_BY_CENTRAL', 'gerencia@gruposoto.es', TRUE)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS nova_state_store (
  tenant_id VARCHAR(64) PRIMARY KEY,
  state_json JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nova_leads (
  id VARCHAR(64) PRIMARY KEY,
  tenant_id VARCHAR(64) NOT NULL DEFAULT 'tenant-nova-soto',
  full_name VARCHAR(200) NOT NULL,
  phone VARCHAR(60) NOT NULL,
  email VARCHAR(200) NOT NULL,
  city VARCHAR(120) NOT NULL,
  project_type VARCHAR(80) NOT NULL,
  recommended_system TEXT NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'NUEVO_WEB',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nova_invoices_chain (
  id VARCHAR(64) PRIMARY KEY,
  tenant_id VARCHAR(64) NOT NULL DEFAULT 'tenant-nova-soto',
  series_and_number VARCHAR(60) NOT NULL UNIQUE,
  invoice_type VARCHAR(40) NOT NULL,
  order_code VARCHAR(60) NOT NULL,
  client_name VARCHAR(200) NOT NULL,
  client_nif VARCHAR(40) NOT NULL,
  work_description TEXT NOT NULL,
  issue_date_iso VARCHAR(40) NOT NULL,
  dias_pago INTEGER NOT NULL DEFAULT 0,
  due_date_iso VARCHAR(40) NOT NULL,
  base_imponible_eur NUMERIC(12,2) NOT NULL,
  vat_rate_percent INTEGER NOT NULL,
  vat_amount_eur NUMERIC(12,2) NOT NULL,
  retencion_garantia_eur NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_importe_eur NUMERIC(12,2) NOT NULL,
  cobrado_eur NUMERIC(12,2) NOT NULL DEFAULT 0,
  operational_status VARCHAR(50) NOT NULL,
  payment_status VARCHAR(40) NOT NULL,
  previous_hash_64 CHAR(64) NOT NULL,
  current_hash_64 CHAR(64) NOT NULL,
  aeat_qr_url TEXT NOT NULL,
  aeat_submission_state VARCHAR(40) NOT NULL DEFAULT 'HUELLA_GENERADA',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nova_email_logs (
  id VARCHAR(64) PRIMARY KEY,
  tenant_id VARCHAR(64) NOT NULL DEFAULT 'tenant-nova-soto',
  sender_email VARCHAR(200) NOT NULL,
  recipient_email VARCHAR(200) NOT NULL,
  recipient_name VARCHAR(200) NOT NULL,
  linked_doc_code VARCHAR(60) NOT NULL,
  subject TEXT NOT NULL,
  snippet TEXT NOT NULL,
  delivery_mode VARCHAR(40) NOT NULL DEFAULT 'SMTP_PROCESSED',
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nova_users (
  id VARCHAR(64) PRIMARY KEY,
  tenant_id VARCHAR(64) NOT NULL DEFAULT 'tenant-nova-soto',
  email VARCHAR(200) NOT NULL UNIQUE,
  full_name VARCHAR(200) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'SUPERADMIN',
  password_plain VARCHAR(255) NOT NULL DEFAULT 'Soto2026!Seguro',
  token_version INTEGER NOT NULL DEFAULT 1,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE nova_users ADD COLUMN IF NOT EXISTS token_version INTEGER NOT NULL DEFAULT 1;

INSERT INTO nova_users (id, tenant_id, email, full_name, role, password_plain, token_version, active)
VALUES
  ('usr-gerencia-soto', 'tenant-nova-soto', 'gerencia@gruposoto.es', 'Gerencia General · Grupo Soto', 'SUPERADMIN', 'Soto2026!Seguro', 1, TRUE)
ON CONFLICT (email) DO NOTHING;

-- Limpieza de datos mock antiguos de demostración
DELETE FROM nova_leads WHERE id = 'lead-01' OR email = 'carmen.riquelme@clinicarq.es';
DELETE FROM nova_tenants WHERE id IN ('tenant-nova-alicante', 'tenant-nova-valencia');
DELETE FROM nova_users WHERE email IN (
  'alicante@novaventanasypuertas.com',
  'valencia@novaventanasypuertas.com',
  'presupuestos@novaventanasypuertas.com',
  'almacen@novaventanasypuertas.com',
  'administracion@novaventanasypuertas.com'
);
UPDATE nova_state_store
SET state_json = jsonb_set(
  jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(state_json, '{quotes}', '[]'::jsonb, true),
          '{warehouseOrders}', '[]'::jsonb, true
        ),
        '{invoices}', '[]'::jsonb, true
      ),
      '{emailMessages}', '[]'::jsonb, true
    ),
    '{leads}', '[]'::jsonb, true
  ),
  '{emailAccounts}',
  '[{"id":"mail-gerencia-soto","aliasName":"Gerencia General · Grupo Soto","emailAddress":"gerencia@gruposoto.es","department":"GENERAL","smtpHost":"smtp.ionos.es","smtpPort":587,"imapHost":"imap.ionos.es","imapPort":993,"useTls":true,"status":"CONECTADO_OK","signatureHtml":"GRUPO SOTO EMPRESARIAL SL · NOVA Ventanas & Puertas"}]'::jsonb,
  true
)
WHERE tenant_id = 'tenant-nova-soto' AND (
  state_json::text LIKE '%quo-init-1%' OR
  state_json::text LIKE '%ord-01%' OR
  state_json::text LIKE '%inv-01%' OR
  state_json::text LIKE '%mail-presupuestos%'
);
