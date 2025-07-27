-- Jobs de mantenimiento para Checkin Tracker
-- Estos scripts programan tareas automáticas en PostgreSQL

-- 1. Job para limpieza de auditoría antigua (ejecuta todos los domingos a la 1 AM)
SELECT cron.schedule(
    'limpieza-auditoria-semanal',
    '0 1 * * 0', -- Formato cron: Min Hora Día Mes DíaSemana (0 = domingo)
    $$ DELETE FROM "Auditoria" WHERE fecha < NOW() - INTERVAL '90 days'; $$
);

-- 2. Job para backup automático de datos críticos (ejecuta todos los días a las 2 AM)
SELECT cron.schedule(
    'backup-datos-criticos',
    '0 2 * * *', -- Todos los días a las 2 AM
    $$ 
    CREATE TABLE IF NOT EXISTS backup_jornadas AS 
    SELECT * FROM "Jornada" WHERE fecha >= CURRENT_DATE - INTERVAL '30 days';
    $$
);

-- 3. Job para actualizar estadísticas de la base de datos (ejecuta cada hora)
SELECT cron.schedule(
    'actualizar-estadisticas-bd',
    '0 * * * *', -- Cada hora en punto
    $$ ANALYZE; $$
);

-- 4. Job para notificar jornadas pendientes de aprobación (ejecuta de lunes a viernes a las 9 AM)
SELECT cron.schedule(
    'notificacion-jornadas-pendientes',
    '0 9 * * 1-5', -- Lunes a viernes a las 9 AM
    $$ 
    DO $$
    DECLARE
        jornadas_pendientes INTEGER;
    BEGIN
        SELECT COUNT(*) INTO jornadas_pendientes 
        FROM "Jornada" 
        WHERE aprobado IS NULL OR aprobado = false;
        
        -- Solo hacer algo si hay jornadas pendientes
        IF jornadas_pendientes > 0 THEN
            INSERT INTO "Auditoria"(id_usuario, accion, descripcion)
            VALUES (1, 'SISTEMA_NOTIFICACION', 'Hay ' || jornadas_pendientes || ' jornadas pendientes de aprobación.');
        END IF;
    END $$;
    $$
);

-- Consultar todos los jobs programados
SELECT jobid, schedule, command, active 
FROM cron.job 
ORDER BY jobid;
