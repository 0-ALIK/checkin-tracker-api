-- ==========================================
-- SCRIPT DE LIMPIEZA Y DATOS DE PRUEBA
-- Fecha: 27 de Julio 2025
-- Flujo Correcto: Check-in → Aprobación → Trabajo → Check-out → Aprobación
-- ==========================================

-- PASO 1: LIMPIEZA COMPLETA DE DATOS
TRUNCATE TABLE "Auditoria", "Comentario", "Actividad", "Jornada", "Usuario", "Area", "Rol", "Estado" RESTART IDENTITY CASCADE;

-- PASO 2: INSERTAR DATOS MAESTROS
INSERT INTO "Rol" (nombre_rol) VALUES 
('Administrador'),
('Supervisor'),
('Empleado');

INSERT INTO "Area" (nombre_area) VALUES 
('Recursos Humanos'),
('Tecnología'),
('Finanzas'),
('Logística'),
('Marketing'),
('Ventas'),
('Administración');

INSERT INTO "Estado" (nombre_estado) VALUES 
('Pendiente'),
('En Progreso'),
('Completada'),
('Cancelada'),
('En Revisión');

-- PASO 3: INSERTAR USUARIOS
-- Contraseña por defecto: "password123"
INSERT INTO "Usuario" (nombre, apellido, email, contraseña, id_area, id_rol) VALUES 
-- Administradores
('Juan', 'Pérez', 'admin@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 7, 1),

-- Supervisores
('María', 'González', 'maria.gonzalez@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 2, 2),
('Carlos', 'Rodríguez', 'carlos.rodriguez@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 3, 2),
('Ana', 'Martínez', 'ana.martinez@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 1, 2),
('Luis', 'Fernández', 'luis.fernandez@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 6, 2),

-- Empleados
('Pedro', 'Silva', 'pedro.silva@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 2, 3),
('Laura', 'Fernández', 'laura.fernandez@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 2, 3),
('Roberto', 'López', 'roberto.lopez@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 3, 3),
('Sandra', 'García', 'sandra.garcia@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 4, 3),
('Miguel', 'Torres', 'miguel.torres@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 5, 3),
('Carmen', 'Ruiz', 'carmen.ruiz@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 6, 3),
('Diego', 'Herrera', 'diego.herrera@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 1, 3),
('Patricia', 'Morales', 'patricia.morales@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 3, 3),
('Alejandro', 'Vargas', 'alejandro.vargas@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 2, 3),
('Elena', 'Castro', 'elena.castro@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 4, 3),
('Andrés', 'Jiménez', 'andres.jimenez@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 5, 3),
('Isabel', 'Mendoza', 'isabel.mendoza@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 6, 3);

-- ==========================================
-- JORNADAS HISTÓRICAS (últimos 14 días)
-- Siguiendo el flujo: Check-in → Aprobación → Actividades → Check-out → Aprobación
-- ==========================================

-- HACE 14 DÍAS - JORNADAS COMPLETAMENTE APROBADAS
INSERT INTO "Jornada" (fecha, hora_checkin, hora_checkout, aprobado, id_usuario, id_supervisor, observaciones) VALUES 
-- Pedro Silva (Tecnología)
('2025-07-13', '2025-07-13 08:00:00', '2025-07-13 17:30:00', true, 6, 2, 'Desarrollo módulo autenticación'),
-- Laura Fernández (Tecnología)  
('2025-07-13', '2025-07-13 08:15:00', '2025-07-13 18:00:00', true, 7, 2, 'Testing y documentación'),
-- Roberto López (Finanzas)
('2025-07-13', '2025-07-13 07:45:00', '2025-07-13 17:00:00', true, 8, 3, 'Cierre contable mensual'),
-- Sandra García (Logística)
('2025-07-13', '2025-07-13 08:30:00', '2025-07-13 17:45:00', true, 9, 4, 'Gestión inventario'),
-- Miguel Torres (Marketing)
('2025-07-13', '2025-07-13 08:00:00', '2025-07-13 18:15:00', true, 10, 5, 'Campaña publicitaria Q3');

-- HACE 10 DÍAS - JORNADAS COMPLETAMENTE APROBADAS
INSERT INTO "Jornada" (fecha, hora_checkin, hora_checkout, aprobado, id_usuario, id_supervisor, observaciones) VALUES 
('2025-07-17', '2025-07-17 08:10:00', '2025-07-17 17:40:00', true, 11, 5, 'Análisis métricas marketing'),
('2025-07-17', '2025-07-17 08:05:00', '2025-07-17 17:35:00', true, 12, 4, 'Optimización logística'),
('2025-07-17', '2025-07-17 08:20:00', '2025-07-17 18:10:00', true, 13, 3, 'Auditoría financiera'),
('2025-07-17', '2025-07-17 07:50:00', '2025-07-17 17:20:00', true, 14, 2, 'Migración base datos'),
('2025-07-17', '2025-07-17 08:25:00', '2025-07-17 17:55:00', true, 15, 4, 'Proceso órdenes especiales');

-- HACE 5 DÍAS - JORNADAS COMPLETAMENTE APROBADAS  
INSERT INTO "Jornada" (fecha, hora_checkin, hora_checkout, aprobado, id_usuario, id_supervisor, observaciones) VALUES 
('2025-07-22', '2025-07-22 08:00:00', '2025-07-22 17:30:00', true, 6, 2, 'API REST implementation'),
('2025-07-22', '2025-07-22 08:15:00', '2025-07-22 18:00:00', true, 7, 2, 'Frontend integration'),
('2025-07-22', '2025-07-22 07:45:00', '2025-07-22 17:00:00', true, 8, 3, 'Budget planning 2025'),
('2025-07-22', '2025-07-22 08:30:00', '2025-07-22 17:45:00', true, 9, 4, 'Supply chain optimization'),
('2025-07-22', '2025-07-22 08:00:00', '2025-07-22 18:15:00', true, 10, 5, 'Digital campaign launch');

-- AYER (26 JULIO) - JORNADAS COMPLETAMENTE APROBADAS
INSERT INTO "Jornada" (fecha, hora_checkin, hora_checkout, aprobado, id_usuario, id_supervisor, observaciones) VALUES 
('2025-07-26', '2025-07-26 08:00:00', '2025-07-26 17:30:00', true, 6, 2, 'Code review y merge requests'),
('2025-07-26', '2025-07-26 08:15:00', '2025-07-26 18:00:00', true, 7, 2, 'Bug fixing crítico'),
('2025-07-26', '2025-07-26 07:45:00', '2025-07-26 17:00:00', true, 8, 3, 'Presentación stakeholders'),
('2025-07-26', '2025-07-26 08:30:00', '2025-07-26 17:45:00', true, 9, 4, 'Entrevistas candidatos'),
('2025-07-26', '2025-07-26 08:00:00', '2025-07-26 18:15:00', true, 10, 5, 'Planificación sprint');

-- ==========================================
-- JORNADAS DE HOY (27 JULIO 2025)
-- SIGUIENDO EL FLUJO CORRECTO PASO A PASO
-- ==========================================

-- ESCENARIO 1: JORNADAS COMPLETADAS Y TOTALMENTE APROBADAS
INSERT INTO "Jornada" (fecha, hora_checkin, hora_checkout, aprobado, id_usuario, id_supervisor, observaciones) VALUES 
('2025-07-27', '2025-07-27 08:00:00', '2025-07-27 17:30:00', true, 6, 2, 'Jornada completa exitosa - desarrollo completado'),
('2025-07-27', '2025-07-27 08:15:00', '2025-07-27 18:00:00', true, 7, 2, 'Hotfix crítico resuelto exitosamente');

-- ESCENARIO 2: JORNADAS COMPLETADAS PENDIENTES DE APROBACIÓN DE CHECK-OUT
INSERT INTO "Jornada" (fecha, hora_checkin, hora_checkout, aprobado, id_usuario, id_supervisor, observaciones) VALUES 
('2025-07-27', '2025-07-27 07:45:00', '2025-07-27 17:00:00', false, 8, 3, 'Check-out pendiente - completó todas las tareas'),
('2025-07-27', '2025-07-27 08:30:00', '2025-07-27 17:45:00', false, 9, 4, 'Check-out pendiente - reunión extendida');

-- ESCENARIO 3: EMPLEADOS TRABAJANDO (CHECK-IN APROBADO, SIN CHECK-OUT)
INSERT INTO "Jornada" (fecha, hora_checkin, hora_checkout, aprobado, id_usuario, id_supervisor, observaciones) VALUES 
('2025-07-27', '2025-07-27 08:00:00', NULL, true, 10, 5, 'Trabajando - desarrollo API'),
('2025-07-27', '2025-07-27 08:15:00', NULL, true, 11, 5, 'Trabajando - análisis marketing'),
('2025-07-27', '2025-07-27 08:05:00', NULL, true, 12, 4, 'Trabajando - gestión inventario'),
('2025-07-27', '2025-07-27 07:50:00', NULL, true, 13, 3, 'Trabajando - auditoría financiera');

-- ESCENARIO 4: CHECK-INS PENDIENTES DE APROBACIÓN
INSERT INTO "Jornada" (fecha, hora_checkin, hora_checkout, aprobado, id_usuario, id_supervisor, observaciones) VALUES 
('2025-07-27', '2025-07-27 08:25:00', NULL, false, 14, 2, 'Check-in pendiente aprobación'),
('2025-07-27', '2025-07-27 08:20:00', NULL, false, 15, 4, 'Check-in pendiente aprobación'),
('2025-07-27', '2025-07-27 08:10:00', NULL, false, 16, 5, 'Check-in pendiente aprobación'),
('2025-07-27', '2025-07-27 08:35:00', NULL, false, 17, 3, 'Check-in pendiente aprobación');

-- ==========================================
-- ACTIVIDADES HISTÓRICAS (siguiendo flujo)
-- Solo se crean actividades DESPUÉS de que el check-in sea aprobado
-- ==========================================

-- Actividades de hace 14 días (jornadas 1-5)
INSERT INTO "Actividad" (id_jornada, tarea, meta, id_estado, observaciones, es_arrastrada) VALUES 
-- Jornada 1: Pedro Silva (aprobada)
(1, 'Desarrollo módulo autenticación', 'Implementar login JWT seguro', 3, 'Completado con todas las validaciones', false),
(1, 'Configurar base datos', 'Setup PostgreSQL optimizado', 3, 'Configuración con índices optimizados', false),
(1, 'Documentar API endpoints', 'Swagger documentation', 3, 'Documentación completa creada', false),

-- Jornada 2: Laura Fernández (aprobada)
(2, 'Testing unitario', 'Alcanzar 85% cobertura', 3, 'Cobertura alcanzada: 87%', false),
(2, 'Refactoring código legacy', 'Mejorar performance 30%', 3, 'Performance mejorada en 35%', false),
(2, 'Crear casos prueba', 'Suite testing completa', 3, 'Suite de testing implementada', false),

-- Jornada 3: Roberto López (aprobada)
(3, 'Cierre contable mensual', 'Balances y conciliaciones', 3, 'Cierre completado sin observaciones', false),
(3, 'Análisis gastos operativos', 'Identificar ahorros', 3, 'Ahorros identificados: 12%', false),
(3, 'Reporte financiero ejecutivo', 'Dashboard KPIs', 3, 'Dashboard implementado', false),

-- Jornada 4: Sandra García (aprobada)
(4, 'Gestión inventario Q3', 'Actualizar stock completo', 3, 'Inventario actualizado 100%', false),
(4, 'Optimizar rutas entrega', 'Reducir costos logísticos', 3, 'Rutas optimizadas - ahorro 18%', false),
(4, 'Coordinación proveedores', 'Nuevos acuerdos comerciales', 3, 'Contratos renegociados exitosamente', false),

-- Jornada 5: Miguel Torres (aprobada)
(5, 'Campaña digital Q3', 'Lanzar en todas las redes', 3, 'Campaña lanzada exitosamente', false),
(5, 'Análisis competencia', 'Reporte positioning', 3, 'Análisis completo de mercado', false),
(5, 'Métricas conversión', 'Optimizar funnel ventas', 3, 'Funnel optimizado +25% conversión', false);

-- Actividades de ayer (jornadas 16-20)
INSERT INTO "Actividad" (id_jornada, tarea, meta, id_estado, observaciones, es_arrastrada) VALUES 
-- Jornada 16: Pedro Silva (aprobada)
(16, 'Code review PRs', 'Revisar 8 pull requests', 3, 'Todos los PRs revisados y aprobados', false),
(16, 'Bug fixing crítico', 'Resolver issue #1234', 3, 'Bug resuelto y desplegado', false),
(16, 'Optimización queries', 'Mejorar performance DB', 3, 'Queries optimizadas 40% más rápido', false),

-- Jornada 17: Laura Fernández (aprobada)
(17, 'Hotfix producción', 'Corregir error de login', 3, 'Hotfix desplegado exitosamente', false),
(17, 'Testing regresión', 'Validar todas las funciones', 3, 'Testing completo sin errores', false),
(17, 'Documentación técnica', 'Actualizar manuales', 3, 'Documentación actualizada', false);

-- ==========================================
-- ACTIVIDADES DE HOY (27 JULIO)
-- Solo para jornadas con check-in aprobado
-- ==========================================

-- JORNADAS COMPLETADAS Y APROBADAS (21-22)
INSERT INTO "Actividad" (id_jornada, tarea, meta, id_estado, observaciones, es_arrastrada) VALUES 
-- Jornada 21: Pedro Silva (completada y aprobada)
(21, 'Implementar nueva API', 'API de notificaciones en tiempo real', 3, 'API implementada y testeada', false),
(21, 'Deploy a producción', 'Subir nueva versión', 3, 'Deploy exitoso sin downtime', false),
(21, 'Monitoreo post-deploy', 'Verificar estabilidad', 3, 'Sistema estable, métricas normales', false),

-- Jornada 22: Laura Fernández (completada y aprobada)
(22, 'Testing integración', 'Probar nueva API', 3, 'Tests de integración pasando', false),
(22, 'Actualizar frontend', 'Integrar notificaciones', 3, 'Frontend actualizado y funcional', false),
(22, 'Documentar cambios', 'Changelog y guías', 3, 'Documentación completa', false);

-- JORNADAS COMPLETADAS PENDIENTES APROBACIÓN CHECK-OUT (23-24)
INSERT INTO "Actividad" (id_jornada, tarea, meta, id_estado, observaciones, es_arrastrada) VALUES 
-- Jornada 23: Roberto López (check-out pendiente)
(23, 'Presentación stakeholders', 'Demo Q3 resultados', 3, 'Presentación exitosa, feedback positivo', false),
(23, 'Análisis ROI campaña', 'Métricas y resultados', 3, 'ROI calculado: +180%', false),
(23, 'Planificación Q4', 'Budget y estrategia', 2, 'Borrador de plan Q4 en progreso', false),

-- Jornada 24: Sandra García (check-out pendiente)
(24, 'Entrevistas candidatos', 'Seleccionar 2 desarrolladores', 3, '4 candidatos entrevistados', false),
(24, 'Evaluación técnica', 'Pruebas de código', 3, 'Evaluaciones completadas', false),
(24, 'Reporte selección', 'Recomendaciones finales', 2, 'Reporte en elaboración final', false);

-- EMPLEADOS TRABAJANDO ACTUALMENTE (25-28)
INSERT INTO "Actividad" (id_jornada, tarea, meta, id_estado, observaciones, es_arrastrada) VALUES 
-- Jornada 25: Miguel Torres (trabajando)
(25, 'Desarrollo API pagos', 'Integrar Stripe y PayPal', 2, 'Stripe integrado 90%, PayPal en progreso', false),
(25, 'Testing pasarelas', 'Probar transacciones', 1, 'Configurando ambiente de pruebas', false),
(25, 'Documentar endpoints', 'API documentation', 1, 'Pendiente completar desarrollo', false),

-- Jornada 26: Carmen Ruiz (trabajando)
(26, 'Campaña redes sociales', 'Lanzar ads segmentados', 2, 'Facebook e Instagram configurados', false),
(26, 'Análisis competencia', 'Benchmarking precios', 2, 'Recopilando datos competidores', false),
(26, 'Creativos campaña', 'Diseño visual ads', 1, 'Pendiente aprobación creativo', false),

-- Jornada 27: Diego Herrera (trabajando)
(27, 'Inventario físico', 'Conteo almacén principal', 2, 'Conteo completado 75%', false),
(27, 'Actualizar sistema', 'Sync inventario ERP', 1, 'Esperando finalizar conteo', false),
(27, 'Reporte discrepancias', 'Análisis diferencias', 1, 'Pendiente completar inventario', false),

-- Jornada 28: Patricia Morales (trabajando)
(28, 'Auditoría Q3', 'Revisión gastos departamentales', 2, 'Auditando 60% de gastos', false),
(28, 'Conciliación bancaria', 'Verificar movimientos julio', 2, 'Conciliación 80% completada', false),
(28, 'Presupuesto 2025', 'Draft inicial', 1, 'Recopilando datos históricos', false);

-- ==========================================
-- COMENTARIOS DE SUPERVISORES
-- Solo en actividades de jornadas aprobadas
-- ==========================================

-- Comentarios históricos
INSERT INTO "Comentario" (id_actividad, id_supervisor, comentario, fecha_comentario) VALUES 
-- Hace 14 días
(1, 2, 'Excelente implementación de la autenticación. Código muy limpio y seguro.', '2025-07-13 18:00:00'),
(2, 2, 'Configuración de base de datos muy sólida. Buenos índices implementados.', '2025-07-13 18:15:00'),
(4, 2, 'Testing excepcional. La cobertura supera expectativas.', '2025-07-13 18:30:00'),
(7, 3, 'Cierre contable perfecto. Sin observaciones de auditoría.', '2025-07-13 17:30:00'),
(10, 4, 'Gestión de inventario muy eficiente. Excelente organización.', '2025-07-13 18:00:00'),

-- Comentarios de ayer
(19, 2, 'Code review muy detallado. Excelentes sugerencias implementadas.', '2025-07-26 17:45:00'),
(20, 2, 'Resolución rápida del bug crítico. Gran trabajo bajo presión.', '2025-07-26 18:00:00'),
(22, 2, 'Hotfix bien ejecutado. Testing de regresión muy completo.', '2025-07-26 18:15:00'),

-- Comentarios de hoy en jornadas completadas
(25, 2, 'API implementada perfectamente. Deploy sin problemas.', '2025-07-27 17:45:00'),
(26, 2, 'Excelente coordinación en el deploy. Monitoreo proactivo.', '2025-07-27 18:00:00'),
(28, 2, 'Testing de integración muy completo. Buena documentación.', '2025-07-27 18:15:00'),
(31, 3, 'Presentación excelente. Stakeholders muy satisfechos.', '2025-07-27 17:30:00'),
(34, 4, 'Buena selección de candidatos. Recomiendo proceder con ofertas.', '2025-07-27 18:00:00'),

-- Comentarios en actividades en progreso (solo para empleados trabajando)
(37, 5, 'Buen progreso en la integración. Continúa con PayPal.', '2025-07-27 14:30:00'),
(40, 5, 'Configuración de Facebook ads muy bien segmentada.', '2025-07-27 15:00:00'),
(43, 4, 'Inventario físico va bien. Coordina con turno noche para terminar.', '2025-07-27 15:30:00'),
(46, 3, 'Auditoría muy detallada. Incluye análisis de tendencias.', '2025-07-27 16:00:00');

-- ==========================================
-- AUDITORÍA SIGUIENDO EL FLUJO CORRECTO
-- ==========================================

INSERT INTO "Auditoria" (id_usuario, accion, fecha, descripcion) VALUES 
-- Logins de supervisores hoy
(1, 'LOGIN', '2025-07-27 07:00:00', 'Inicio de sesión administrador'),
(2, 'LOGIN', '2025-07-27 07:30:00', 'Inicio de sesión supervisor María González'),
(3, 'LOGIN', '2025-07-27 07:45:00', 'Inicio de sesión supervisor Carlos Rodríguez'),
(4, 'LOGIN', '2025-07-27 08:00:00', 'Inicio de sesión supervisor Ana Martínez'),
(5, 'LOGIN', '2025-07-27 08:15:00', 'Inicio de sesión supervisor Luis Fernández'),

-- Check-ins de hoy (triggers automáticos)
(6, 'CHECK_IN', '2025-07-27 08:00:00', 'Check-in empleado Pedro Silva'),
(7, 'CHECK_IN', '2025-07-27 08:15:00', 'Check-in empleado Laura Fernández'),
(8, 'CHECK_IN', '2025-07-27 07:45:00', 'Check-in empleado Roberto López'),
(9, 'CHECK_IN', '2025-07-27 08:30:00', 'Check-in empleado Sandra García'),
(10, 'CHECK_IN', '2025-07-27 08:00:00', 'Check-in empleado Miguel Torres'),
(11, 'CHECK_IN', '2025-07-27 08:15:00', 'Check-in empleado Carmen Ruiz'),
(12, 'CHECK_IN', '2025-07-27 08:05:00', 'Check-in empleado Diego Herrera'),
(13, 'CHECK_IN', '2025-07-27 07:50:00', 'Check-in empleado Patricia Morales'),
(14, 'CHECK_IN', '2025-07-27 08:25:00', 'Check-in empleado Alejandro Vargas'),
(15, 'CHECK_IN', '2025-07-27 08:20:00', 'Check-in empleado Elena Castro'),
(16, 'CHECK_IN', '2025-07-27 08:10:00', 'Check-in empleado Isabel Mendoza'),
(17, 'CHECK_IN', '2025-07-27 08:35:00', 'Check-in empleado Andrés Jiménez'),

-- Aprobaciones de check-ins (solo para empleados trabajando y completados)
(2, 'CAMBIO_ESTADO_JORNADA', '2025-07-27 08:30:00', 'Aprobación check-in Pedro Silva'),
(2, 'CAMBIO_ESTADO_JORNADA', '2025-07-27 08:45:00', 'Aprobación check-in Laura Fernández'),
(3, 'CAMBIO_ESTADO_JORNADA', '2025-07-27 09:00:00', 'Aprobación check-in Roberto López'),
(4, 'CAMBIO_ESTADO_JORNADA', '2025-07-27 09:15:00', 'Aprobación check-in Sandra García'),
(5, 'CAMBIO_ESTADO_JORNADA', '2025-07-27 08:30:00', 'Aprobación check-in Miguel Torres'),
(5, 'CAMBIO_ESTADO_JORNADA', '2025-07-27 08:45:00', 'Aprobación check-in Carmen Ruiz'),
(4, 'CAMBIO_ESTADO_JORNADA', '2025-07-27 08:35:00', 'Aprobación check-in Diego Herrera'),
(3, 'CAMBIO_ESTADO_JORNADA', '2025-07-27 08:20:00', 'Aprobación check-in Patricia Morales'),

-- Check-outs de hoy (solo jornadas completadas)
(6, 'CHECK_OUT', '2025-07-27 17:30:00', 'Check-out empleado Pedro Silva'),
(7, 'CHECK_OUT', '2025-07-27 18:00:00', 'Check-out empleado Laura Fernández'),
(8, 'CHECK_OUT', '2025-07-27 17:00:00', 'Check-out empleado Roberto López'),
(9, 'CHECK_OUT', '2025-07-27 17:45:00', 'Check-out empleado Sandra García'),

-- Aprobaciones de check-outs (solo para completamente aprobadas)
(2, 'CAMBIO_ESTADO_JORNADA', '2025-07-27 18:00:00', 'Aprobación check-out Pedro Silva'),
(2, 'CAMBIO_ESTADO_JORNADA', '2025-07-27 18:30:00', 'Aprobación check-out Laura Fernández'),

-- Comentarios del día
(2, 'CREATE_COMMENT', '2025-07-27 17:45:00', 'Comentario en deploy de Pedro'),
(2, 'CREATE_COMMENT', '2025-07-27 18:00:00', 'Comentario en testing de Laura'),
(5, 'CREATE_COMMENT', '2025-07-27 14:30:00', 'Seguimiento API pagos Miguel'),
(3, 'CREATE_COMMENT', '2025-07-27 17:30:00', 'Feedback presentación Roberto'),
(4, 'CREATE_COMMENT', '2025-07-27 18:00:00', 'Comentario entrevistas Sandra');

-- ==========================================
-- CONSULTAS DE VERIFICACIÓN
-- ==========================================

-- Verificar datos insertados
SELECT 'Usuarios creados' as tipo, COUNT(*) as cantidad FROM "Usuario"
UNION ALL
SELECT 'Jornadas creadas', COUNT(*) FROM "Jornada"
UNION ALL  
SELECT 'Jornadas de hoy', COUNT(*) FROM "Jornada" WHERE fecha::date = '2025-07-27'
UNION ALL
SELECT 'Check-ins aprobados hoy', COUNT(*) FROM "Jornada" WHERE fecha::date = '2025-07-27' AND aprobado = true
UNION ALL
SELECT 'Empleados trabajando', COUNT(*) FROM "Jornada" WHERE fecha::date = '2025-07-27' AND hora_checkout IS NULL AND aprobado = true
UNION ALL
SELECT 'Check-ins pendientes', COUNT(*) FROM "Jornada" WHERE fecha::date = '2025-07-27' AND hora_checkout IS NULL AND aprobado = false
UNION ALL
SELECT 'Check-outs pendientes', COUNT(*) FROM "Jornada" WHERE fecha::date = '2025-07-27' AND hora_checkout IS NOT NULL AND aprobado = false
UNION ALL
SELECT 'Actividades creadas', COUNT(*) FROM "Actividad"
UNION ALL
SELECT 'Comentarios creados', COUNT(*) FROM "Comentario"
UNION ALL
SELECT 'Auditorías creadas', COUNT(*) FROM "Auditoria";

-- Verificar jornadas de hoy por estado
SELECT 
    CASE 
        WHEN hora_checkout IS NULL AND aprobado = false THEN 'Check-in Pendiente'
        WHEN hora_checkout IS NULL AND aprobado = true THEN 'Trabajando'
        WHEN hora_checkout IS NOT NULL AND aprobado = false THEN 'Check-out Pendiente'
        WHEN hora_checkout IS NOT NULL AND aprobado = true THEN 'Completado'
    END as estado,
    COUNT(*) as cantidad
FROM "Jornada" 
WHERE fecha::date = '2025-07-27'
GROUP BY 
    CASE 
        WHEN hora_checkout IS NULL AND aprobado = false THEN 'Check-in Pendiente'
        WHEN hora_checkout IS NULL AND aprobado = true THEN 'Trabajando'
        WHEN hora_checkout IS NOT NULL AND aprobado = false THEN 'Check-out Pendiente'
        WHEN hora_checkout IS NOT NULL AND aprobado = true THEN 'Completado'
    END;
