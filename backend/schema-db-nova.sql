-- ============================================================================
-- ESQUEMA OFICIAL POSTGRESQL — NOVA VENTANAS & PUERTAS (db_nova)
-- Portabilidad 100% parametrizada por variables de entorno (.env)
-- ============================================================================

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
  password_plain VARCHAR(120) NOT NULL DEFAULT 'Soto2026!Seguro',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO nova_users (id, tenant_id, email, full_name, role, password_plain, active)
VALUES
  ('usr-gerencia-soto', 'tenant-nova-soto', 'gerencia@gruposoto.es', 'Gerencia General · Grupo Soto', 'SUPERADMIN', 'Soto2026!Seguro', TRUE),
  ('usr-admin-soto', 'tenant-nova-soto', 'admin@gruposoto.es', 'Administrador · Grupo Soto', 'SUPERADMIN', 'Soto2026!Seguro', TRUE),
  ('usr-presupuestos', 'tenant-nova-soto', 'presupuestos@novaventanasypuertas.com', 'Oficina Técnica · NOVA', 'OFICINA_TECNICA', 'Soto2026!Seguro', TRUE),
  ('usr-almacen', 'tenant-nova-soto', 'almacen@novaventanasypuertas.com', 'Almacén & Recepción · NOVA', 'MEDIDOR_OBRA', 'Soto2026!Seguro', TRUE),
  ('usr-facturacion', 'tenant-nova-soto', 'administracion@novaventanasypuertas.com', 'Administración & VeriFactu · NOVA', 'ADMINISTRACION_FACTURACION', 'Soto2026!Seguro', TRUE)
ON CONFLICT (email) DO UPDATE SET
  role = EXCLUDED.role,
  full_name = EXCLUDED.full_name,
  active = TRUE;
