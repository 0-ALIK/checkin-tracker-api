-- Active: 1744142670839@@localhost@5432@checkin@public
-- Insertar roles básicos
INSERT INTO "Rol" (nombre_rol) VALUES 
('Administrador'),
('Supervisor'),
('Empleado');

-- Insertar áreas de la empresa
INSERT INTO "Area" (nombre_area) VALUES 
('Recursos Humanos'),
('Tecnología'),
('Finanzas'),
('Logística'),
('Marketing'),
('Ventas'),
('Administración');

-- Insertar estados para las actividades
INSERT INTO "Estado" (nombre_estado) VALUES 
('Pendiente'),
('En Progreso'),
('Completada'),
('Cancelada'),
('En Revisión');

-- Insertar usuarios de prueba (contraseñas hasheadas con bcrypt)
-- Contraseña por defecto: "password123"
INSERT INTO "Usuario" (nombre, apellido, email, contraseña, id_area, id_rol) VALUES 
-- Administradores
('Juan', 'Pérez', 'admin@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 7, 1),
-- Supervisores
('María', 'González', 'maria.gonzalez@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 2, 2),
('Carlos', 'Rodríguez', 'carlos.rodriguez@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 3, 2),
('Ana', 'Martínez', 'ana.martinez@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 1, 2),
-- Empleados
('Pedro', 'Silva', 'pedro.silva@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 2, 3),
('Laura', 'Fernández', 'laura.fernandez@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 2, 3),
('Roberto', 'López', 'roberto.lopez@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 3, 3),
('Sandra', 'García', 'sandra.garcia@pfdb.com', '$$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 4, 3),
('Miguel', 'Torres', 'miguel.torres@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 5, 3);

-- Insertar jornadas de ejemplo (últimos 7 días)
INSERT INTO "Jornada" (fecha, hora_checkin, hora_checkout, aprobado, id_usuario, id_supervisor, observaciones) VALUES 
(CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE - INTERVAL '6 days' + TIME '08:00:00', CURRENT_DATE - INTERVAL '6 days' + TIME '17:30:00', true, 5, 2, 'Jornada regular'),
(CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '5 days' + TIME '08:15:00', CURRENT_DATE - INTERVAL '5 days' + TIME '18:00:00', true, 5, 2, NULL),
(CURRENT_DATE - INTERVAL '4 days', CURRENT_DATE - INTERVAL '4 days' + TIME '07:45:00', CURRENT_DATE - INTERVAL '4 days' + TIME '17:00:00', true, 6, 2, 'Salida temprana por cita médica'),
(CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE - INTERVAL '3 days' + TIME '08:00:00', CURRENT_DATE - INTERVAL '3 days' + TIME '17:30:00', false, 7, 3, NULL),
(CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE - INTERVAL '2 days' + TIME '08:30:00', CURRENT_DATE - INTERVAL '2 days' + TIME '18:15:00', true, 8, 4, NULL),
(CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE - INTERVAL '1 day' + TIME '08:00:00', CURRENT_DATE - INTERVAL '1 day' + TIME '17:45:00', false, 5, 2, NULL),
(CURRENT_DATE, CURRENT_DATE + TIME '08:10:00', NULL, false, 5, 2, NULL);

-- Insertar actividades para las jornadas
INSERT INTO "Actividad" (id_jornada, tarea, meta, id_estado, observaciones) VALUES 
(1, 'Desarrollo de módulo de autenticación', 'Completar login y registro de usuarios', 3, 'Finalizado exitosamente'),
(1, 'Revisión de código del equipo', 'Revisar 5 pull requests', 3, NULL),
(2, 'Implementación de API REST', 'Crear endpoints para gestión de usuarios', 3, 'Documentación actualizada'),
(3, 'Configuración de servidor de producción', 'Deploy de aplicación en AWS', 2, 'En proceso de configuración'),
(4, 'Análisis de requerimientos', 'Documentar nuevas funcionalidades', 1, NULL),
(5, 'Reunión con cliente', 'Presentar avances del proyecto', 3, 'Cliente satisfecho con el progreso'),
(6, 'Corrección de bugs reportados', 'Resolver issues críticos', 2, 'Trabajando en 3 bugs principales'),
(7, 'Planificación sprint', 'Definir tareas para próxima semana', 1, NULL);

-- Insertar comentarios de supervisores
INSERT INTO "Comentario" (id_actividad, id_usuario, comentario, fecha_comentario) VALUES 
(1, 2, 'Excelente trabajo en la implementación del módulo', NOW()),
(2, 2, 'Buena práctica mantener el código revisado', NOW()),
(3, 2, 'Documentación clara y completa', NOW()),
(6, 3, 'Necesitamos priorizar el bug de login', NOW());

-- Insertar registros de auditoría
INSERT INTO public."Auditoria" (id, accion, descripcion, fecha, id_usuario) VALUES
(1, 'CREATE', 'Creación de nuevo usuario', NOW(), 9),
(2, 'UPDATE', 'Aprobación de jornada', NOW(), 1),
(5, 'CREATE', 'Registro de check-in', NOW(), 7);
