DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'nova_user') THEN
    CREATE ROLE nova_user WITH LOGIN PASSWORD 'NovaSoto2026_DbPwd!';
  END IF;
END
$$;

SELECT 'CREATE DATABASE db_nova OWNER nova_user'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'db_nova')\gexec

\c db_nova

\i /var/www/nova-api/schema-db-nova.sql

GRANT ALL PRIVILEGES ON DATABASE db_nova TO nova_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO nova_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO nova_user;
