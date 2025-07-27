-- Triggers para auditoría de Jornadas

-- 1. Función para registrar el check-in (INSERT en Jornada)
CREATE OR REPLACE FUNCTION registrar_checkin()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO "Auditoria"(id_usuario, accion, descripcion)
    VALUES (NEW.id_usuario, 'CHECK_IN', 'El usuario ' || NEW.id_usuario || ' ha iniciado jornada (check-in).');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger que llama a la función después de un INSERT en Jornada
CREATE TRIGGER tr_jornada_checkin
AFTER INSERT ON "Jornada"
FOR EACH ROW
EXECUTE FUNCTION registrar_checkin();

-- 2. Función para registrar el check-out y la aprobación (UPDATE en Jornada)
CREATE OR REPLACE FUNCTION registrar_modificacion_jornada()
RETURNS TRIGGER AS $$
BEGIN
    -- Registrar check-out cuando se actualiza la hora de checkout
    IF OLD.hora_checkout IS NULL AND NEW.hora_checkout IS NOT NULL THEN
        INSERT INTO "Auditoria"(id_usuario, accion, descripcion)
        VALUES (NEW.id_usuario, 'CHECK_OUT', 'El usuario ' || NEW.id_usuario || ' ha finalizado jornada (check-out).');
    END IF;

    -- Registrar cambio de estado de aprobación
    IF OLD.aprobado IS DISTINCT FROM NEW.aprobado THEN
        INSERT INTO "Auditoria"(id_usuario, accion, descripcion)
        VALUES (NEW.id_supervisor, 'CAMBIO_ESTADO_JORNADA', 'El supervisor ' || NEW.id_supervisor || ' cambió el estado de aprobación de la jornada ' || NEW.id_jornada || ' a ' || NEW.aprobado);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger que llama a la función después de un UPDATE en Jornada
CREATE TRIGGER tr_jornada_modificacion
AFTER UPDATE ON "Jornada"
FOR EACH ROW
EXECUTE FUNCTION registrar_modificacion_jornada();

-- 3. Función para obtener estadísticas de empleado
CREATE OR REPLACE FUNCTION obtener_estadisticas_empleado(
    p_id_usuario INT,
    p_fecha_inicio DATE,
    p_fecha_fin DATE
)
RETURNS TABLE(total_jornadas BIGINT, horas_trabajadas NUMERIC, actividades_completadas BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(j.id_jornada) as total_jornadas,
        COALESCE(SUM(EXTRACT(EPOCH FROM (j.hora_checkout - j.hora_checkin))/3600), 0) as horas_trabajadas,
        (SELECT COUNT(*) 
         FROM "Actividad" a 
         JOIN "Jornada" j_inner ON a.id_jornada = j_inner.id_jornada 
         WHERE j_inner.id_usuario = p_id_usuario 
           AND a.id_estado = 3 
           AND j_inner.fecha BETWEEN p_fecha_inicio AND p_fecha_fin) as actividades_completadas
    FROM "Jornada" j
    WHERE j.id_usuario = p_id_usuario
      AND j.fecha BETWEEN p_fecha_inicio AND p_fecha_fin;
END;
$$ LANGUAGE plpgsql;
