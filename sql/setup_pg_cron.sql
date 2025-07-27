-- Setup para pg_cron
-- IMPORTANTE: Este script debe ser ejecutado por un superusuario de PostgreSQL

-- 1. Crear la extensión pg_cron (requiere permisos de superusuario)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 2. Verificar que la extensión esté instalada
SELECT extname FROM pg_extension WHERE extname = 'pg_cron';

-- 3. Mostrar trabajos programados existentes
SELECT * FROM cron.job;
