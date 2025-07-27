-- Gestión de Jobs de pg_cron
-- Scripts para administrar los trabajos programados

-- Ver todos los jobs activos
SELECT 
    jobid,
    schedule,
    command,
    active,
    jobname
FROM cron.job;

-- Ver el historial de ejecución de jobs (últimas 24 horas)
SELECT 
    job_id,
    start_time,
    end_time,
    return_message,
    status
FROM cron.job_run_details 
WHERE start_time >= NOW() - INTERVAL '24 hours'
ORDER BY start_time DESC;

-- Deshabilitar un job específico (cambiar 'nombre-del-job' por el nombre real)
-- SELECT cron.unschedule('limpieza-auditoria-semanal');

-- Eliminar un job completamente
-- SELECT cron.unschedule('nombre-del-job');

-- Actualizar la programación de un job existente
-- SELECT cron.alter_job(job_id, schedule := '0 3 * * 0'); -- Cambiar horario

-- Habilitar/deshabilitar un job
-- UPDATE cron.job SET active = false WHERE jobname = 'nombre-del-job';
-- UPDATE cron.job SET active = true WHERE jobname = 'nombre-del-job';

-- Limpiar historial de ejecución antiguo (más de 30 días)
DELETE FROM cron.job_run_details 
WHERE start_time < NOW() - INTERVAL '30 days';
