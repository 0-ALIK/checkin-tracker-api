-- ==========================================
-- SCRIPT DE LIMPIEZA Y DATOS DE PRUEBA
-- Fecha: 28 de Julio 2025
-- Optimizado para ejecutar en pgAdmin
-- ==========================================

-- PASO 1: LIMPIEZA COMPLETA DE DATOS
-- TRUNCATE TABLE para limpiar datos y reiniciar secuencias de IDs.
-- CASCADE asegura que las tablas dependientes también se limpien.
TRUNCATE TABLE "Auditoria", "Comentario", "Actividad", "Jornada", "Usuario", "Area", "Rol", "Estado" RESTART IDENTITY CASCADE;

-- PASO 2: INSERTAR DATOS MAESTROS
-- Insertar roles predefinidos
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

-- Insertar estados de actividad
INSERT INTO "Estado" (nombre_estado) VALUES 
('Pendiente'),
('En Progreso'),
('Completada'),
('Cancelada'),
('En Revisión');

-- PASO 3: INSERTAR USUARIOS
-- Contraseña por defecto: "password123" (hash bcrypt)
-- Los IDs de usuario se generarán automáticamente, comenzando desde 1.
-- Es crucial que los id_area y id_rol existan en sus respectivas tablas.
INSERT INTO "Usuario" (nombre, apellido, email, contraseña, id_area, id_rol) VALUES 
-- Administradores (id_rol = 1)
-- Juan Pérez (id = 1) - Administración (id_area = 7)
('Juan', 'Pérez', 'admin@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 7, 1),

-- Supervisores (id_rol = 2)
-- María González (id = 2) - Tecnología (id_area = 2)
('María', 'González', 'maria.gonzalez@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 2, 2),
-- Carlos Rodríguez (id = 3) - Finanzas (id_area = 3)
('Carlos', 'Rodríguez', 'carlos.rodríguez@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 3, 2),
-- Ana Martínez (id = 4) - Recursos Humanos (id_area = 1)
('Ana', 'Martínez', 'ana.martinez@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 1, 2),
-- Luis Fernández (id = 5) - Ventas (id_area = 6)
('Luis', 'Fernández', 'luis.fernandez@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 6, 2),

-- Empleados (id_rol = 3) - 10 por área = 70 empleados totales

-- RECURSOS HUMANOS (Área 1) - 10 empleados (IDs 6-15) - Supervisor: Ana Martínez (id=4)
('Diego', 'Herrera', 'diego.herrera@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 1, 3),
('Carmen', 'Vidal', 'carmen.vidal@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 1, 3),
('Raúl', 'Mendez', 'raul.mendez@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 1, 3),
('Sofía', 'Romero', 'sofia.romero@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 1, 3),
('Gabriel', 'Ortega', 'gabriel.ortega@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 1, 3),
('Valeria', 'Acosta', 'valeria.acosta@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 1, 3),
('Francisco', 'Delgado', 'francisco.delgado@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 1, 3),
('Natalia', 'Flores', 'natalia.flores@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 1, 3),
('Eduardo', 'Campos', 'eduardo.campos@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 1, 3),
('Cristina', 'Vargas', 'cristina.vargas@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 1, 3),

-- TECNOLOGÍA (Área 2) - 10 empleados (IDs 16-25) - Supervisor: María González (id=2)
('Pedro', 'Silva', 'pedro.silva@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 2, 3),
('Laura', 'Fernández', 'laura.fernandez@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 2, 3),
('Alejandro', 'Vargas', 'alejandro.vargas@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 2, 3),
('Marina', 'Castillo', 'marina.castillo@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 2, 3),
('Javier', 'Moreno', 'javier.moreno@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 2, 3),
('Paola', 'Ramos', 'paola.ramos@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 2, 3),
('Daniel', 'Guerrero', 'daniel.guerrero@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 2, 3),
('Andrea', 'Peña', 'andrea.pena@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 2, 3),
('Sergio', 'Luna', 'sergio.luna@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 2, 3),
('Fernanda', 'Cruz', 'fernanda.cruz@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 2, 3),

-- FINANZAS (Área 3) - 10 empleados (IDs 26-35) - Supervisor: Carlos Rodríguez (id=3)
('Roberto', 'López', 'roberto.lopez@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 3, 3),
('Patricia', 'Morales', 'patricia.morales@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 3, 3),
('Marcos', 'Jiménez', 'marcos.jimenez@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 3, 3),
('Lucía', 'Herrera', 'lucia.herrera@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 3, 3),
('Ricardo', 'Medina', 'ricardo.medina@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 3, 3),
('Elena', 'Soto', 'elena.soto@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 3, 3),
('Andrés', 'Vega', 'andres.vega@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 3, 3),
('Mónica', 'Silva', 'monica.silva@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 3, 3),
('Tomás', 'Rojas', 'tomas.rojas@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 3, 3),
('Carolina', 'Paredes', 'carolina.paredes@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 3, 3),

-- LOGÍSTICA (Área 4) - 10 empleados (IDs 36-45) - Supervisor: Ana Martínez (id=4)
('Sandra', 'García', 'sandra.garcia@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 4, 3),
('Elena', 'Castro', 'elena.castro@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 4, 3),
('Carlos', 'Mendoza', 'carlos.mendoza@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 4, 3),
('Beatriz', 'Fuentes', 'beatriz.fuentes@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 4, 3),
('Nicolás', 'Reyes', 'nicolas.reyes@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 4, 3),
('Alicia', 'Domínguez', 'alicia.dominguez@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 4, 3),
('Pablo', 'Navarro', 'pablo.navarro@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 4, 3),
('Verónica', 'Torres', 'veronica.torres@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 4, 3),
('Iván', 'Gómez', 'ivan.gomez@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 4, 3),
('Julia', 'Espinoza', 'julia.espinoza@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 4, 3),

-- MARKETING (Área 5) - 10 empleados (IDs 46-55) - Supervisor: Luis Fernández (id=5)
('Miguel', 'Torres', 'miguel.torres@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 5, 3),
('Andrés', 'Jiménez', 'andres.jimenez@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 5, 3),
('Lorena', 'Cabrera', 'lorena.cabrera@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 5, 3),
('Óscar', 'Benítez', 'oscar.benitez@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 5, 3),
('Claudia', 'Herrera', 'claudia.herrera@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 5, 3),
('Rodrigo', 'Salinas', 'rodrigo.salinas@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 5, 3),
('Adriana', 'Miranda', 'adriana.miranda@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 5, 3),
('Fernando', 'Aguilar', 'fernando.aguilar@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 5, 3),
('Rocío', 'Díaz', 'rocio.diaz@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 5, 3),
('Esteban', 'Morales', 'esteban.morales@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 5, 3),

-- VENTAS (Área 6) - 10 empleados (IDs 56-65) - Supervisor: Luis Fernández (id=5)
('Carmen', 'Ruiz', 'carmen.ruiz@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 6, 3),
('Isabel', 'Mendoza', 'isabel.mendoza@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 6, 3),
('Emilio', 'Santana', 'emilio.santana@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 6, 3),
('Alejandra', 'Vera', 'alejandra.vera@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 6, 3),
('Mateo', 'Ríos', 'mateo.rios@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 6, 3),
('Carla', 'Montoya', 'carla.montoya@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 6, 3),
('Sebastián', 'Chávez', 'sebastian.chavez@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 6, 3),
('Daniela', 'Cordero', 'daniela.cordero@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 6, 3),
('Hugo', 'Lara', 'hugo.lara@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 6, 3),
('Silvia', 'Blanco', 'silvia.blanco@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 6, 3),

-- ADMINISTRACIÓN (Área 7) - 10 empleados (IDs 66-75) - Supervisor: Ana Martínez (id=4)
('Gustavo', 'Pereira', 'gustavo.pereira@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 7, 3),
('Irene', 'Molina', 'irene.molina@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 7, 3),
('Raquel', 'Sandoval', 'raquel.sandoval@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 7, 3),
('Maximiliano', 'Figueroa', 'maximiliano.figueroa@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 7, 3),
('Pilar', 'Valencia', 'pilar.valencia@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 7, 3),
('Joaquín', 'Muñoz', 'joaquin.munoz@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 7, 3),
('Gloria', 'Pardo', 'gloria.pardo@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 7, 3),
('Renato', 'Ibarra', 'renato.ibarra@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 7, 3),
('Teresa', 'Ramírez', 'teresa.ramirez@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 7, 3),
('Víctor', 'Carrillo', 'victor.carrillo@pfdb.com', '$2b$10$fmInKBiib3SXI.rsZZ0I0euKDoGKKpaIEdr44FGevdPgGGRChQlua', 7, 3);

-- ==========================================
-- JORNADAS HISTÓRICAS (últimos 30 días)
-- Los IDs de jornada se auto-incrementarán de forma secuencial.
-- ==========================================

-- HACE 30 DÍAS - Selección aleatoria de empleados (Jornadas IDs 1-7)
-- CUIDADO: id_supervisor debe coincidir con el área del id_usuario.
INSERT INTO "Jornada" (fecha, hora_checkin, hora_checkout, aprobado, id_usuario, id_supervisor, observaciones) VALUES 
-- id_usuario 6 (Diego Herrera - RH) -> id_supervisor 4 (Ana Martínez - RH) - CORREGIDO
('2025-06-28', '2025-06-28 08:00:00', '2025-06-28 17:30:00', true, 6, 4, 'Desarrollo inicial proyecto Q3'),
-- id_usuario 17 (Laura Fernández - Tecnología) -> id_supervisor 2 (María González - Tecnología)
('2025-06-28', '2025-06-28 08:15:00', '2025-06-28 18:00:00', true, 17, 2, 'Setup ambiente desarrollo'),
-- id_usuario 26 (Roberto López - Finanzas) -> id_supervisor 3 (Carlos Rodríguez - Finanzas)
('2025-06-28', '2025-06-28 07:45:00', '2025-06-28 17:00:00', true, 26, 3, 'Revisión presupuesto mensual'),
-- id_usuario 36 (Sandra García - Logística) -> id_supervisor 4 (Ana Martínez - Logística)
('2025-06-28', '2025-07-28 08:30:00', '2025-07-28 17:45:00', true, 36, 4, 'Inventario productos verano'),
-- id_usuario 46 (Miguel Torres - Marketing) -> id_supervisor 5 (Luis Fernández - Marketing)
('2025-06-28', '2025-07-28 08:00:00', '2025-07-28 18:15:00', true, 46, 5, 'Lanzamiento campaña julio'),
-- id_usuario 56 (Carmen Ruiz - Ventas) -> id_supervisor 5 (Luis Fernández - Ventas)
('2025-06-28', '2025-07-28 08:10:00', '2025-07-28 17:40:00', true, 56, 5, 'Prospección clientes nuevos'),
-- id_usuario 66 (Gustavo Pereira - Administración) -> id_supervisor 4 (Ana Martínez - Administración)
('2025-06-28', '2025-07-28 08:05:00', '2025-07-28 17:35:00', true, 66, 4, 'Planificación recursos Q3');

-- HACE 25 DÍAS (Jornadas IDs 8-14)
INSERT INTO "Jornada" (fecha, hora_checkin, hora_checkout, aprobado, id_usuario, id_supervisor, observaciones) VALUES 
-- id_usuario 7 (Carmen Vidal - RH) -> id_supervisor 4 (Ana Martínez - RH) - CORREGIDO
('2025-07-02', '2025-07-02 08:00:00', '2025-07-02 17:30:00', true, 7, 4, 'Testing módulos críticos'),
-- id_usuario 18 (Alejandro Vargas - Tecnología) -> id_supervisor 2 (María González - Tecnología)
('2025-07-02', '2025-07-02 08:15:00', '2025-07-02 18:00:00', true, 18, 2, 'Optimización queries'),
-- id_usuario 28 (Patricia Morales - Finanzas) -> id_supervisor 3 (Carlos Rodríguez - Finanzas)
('2025-07-02', '2025-07-02 07:45:00', '2025-07-02 17:00:00', true, 28, 3, 'Cierre contable junio'),
-- id_usuario 37 (Elena Castro - Logística) -> id_supervisor 4 (Ana Martínez - Logística)
('2025-07-02', '2025-07-02 08:30:00', '2025-07-02 17:45:00', true, 37, 4, 'Coordinación proveedores'),
-- id_usuario 47 (Andrés Jiménez - Marketing) -> id_supervisor 5 (Luis Fernández - Marketing)
('2025-07-02', '2025-07-02 08:00:00', '2025-07-02 18:15:00', true, 47, 5, 'Análisis competencia'),
-- id_usuario 57 (Isabel Mendoza - Ventas) -> id_supervisor 5 (Luis Fernández - Ventas)
('2025-07-02', '2025-07-02 08:10:00', '2025-07-02 17:40:00', true, 57, 5, 'Seguimiento leads calientes'),
-- id_usuario 67 (Irene Molina - Administración) -> id_supervisor 4 (Ana Martínez - Administración)
('2025-07-02', '2025-07-02 08:05:00', '2025-07-02 17:35:00', true, 67, 4, 'Capacitación nuevo personal');

-- HACE 20 DÍAS (Jornadas IDs 15-21)
INSERT INTO "Jornada" (fecha, hora_checkin, hora_checkout, aprobado, id_usuario, id_supervisor, observaciones) VALUES 
-- id_usuario 8 (Raúl Mendez - RH) -> id_supervisor 4 (Ana Martínez - RH) - CORREGIDO
('2025-07-07', '2025-07-07 08:00:00', '2025-07-07 17:30:00', true, 8, 4, 'Deploy features Q3'),
-- id_usuario 19 (Marina Castillo - Tecnología) -> id_supervisor 2 (María González - Tecnología)
('2025-07-07', '2025-07-07 08:15:00', '2025-07-07 18:00:00', true, 19, 2, 'Code review semana'),
-- id_usuario 28 (Marcos Jiménez - Finanzas) -> id_supervisor 3 (Carlos Rodríguez - Finanzas)
('2025-07-07', '2025-07-07 07:45:00', '2025-07-07 17:00:00', true, 28, 3, 'Análisis flujo caja'),
-- id_usuario 38 (Carlos Mendoza - Logística) -> id_supervisor 4 (Ana Martínez - Logística)
('2025-07-07', '2025-07-07 08:30:00', '2025-07-07 17:45:00', true, 38, 4, 'Optimización rutas'),
-- id_usuario 48 (Lorena Cabrera - Marketing) -> id_supervisor 5 (Luis Fernández - Marketing)
('2025-07-07', '2025-07-07 08:00:00', '2025-07-07 18:15:00', true, 48, 5, 'Métricas engagement'),
-- id_usuario 58 (Emilio Santana - Ventas) -> id_supervisor 5 (Luis Fernández - Ventas)
('2025-07-07', '2025-07-07 08:10:00', '2025-07-07 17:40:00', true, 58, 5, 'Reunión clientes VIP'),
-- id_usuario 68 (Raquel Sandoval - Administración) -> id_supervisor 4 (Ana Martínez - Administración)
('2025-07-07', '2025-07-07 08:05:00', '2025-07-07 17:35:00', true, 68, 4, 'Auditoría procesos');

-- HACE 14 DÍAS - JORNADAS COMPLETAMENTE APROBADAS (Jornadas IDs 22-31)
INSERT INTO "Jornada" (fecha, hora_checkin, hora_checkout, aprobado, id_usuario, id_supervisor, observaciones) VALUES 
-- Tecnología (Supervisor: María González id=2)
('2025-07-13', '2025-07-13 08:00:00', '2025-07-13 17:30:00', true, 16, 2, 'Desarrollo módulo autenticación'),
('2025-07-13', '2025-07-13 08:15:00', '2025-07-13 18:00:00', true, 17, 2, 'Testing y documentación'),
('2025-07-13', '2025-07-13 08:20:00', '2025-07-13 17:45:00', true, 18, 2, 'Refactoring código legacy'),
-- Finanzas (Supervisor: Carlos Rodríguez id=3)
('2025-07-13', '2025-07-13 07:45:00', '2025-07-13 17:00:00', true, 26, 3, 'Cierre contable mensual'),
('2025-07-13', '2025-07-13 08:00:00', '2025-07-13 17:30:00', true, 28, 3, 'Análisis gastos operativos'),
('2025-07-13', '2025-07-13 08:10:00', '2025-07-13 17:40:00', true, 28, 3, 'Reportes financieros'),
-- Logística (Supervisor: Ana Martínez id=4)
('2025-07-13', '2025-07-13 08:30:00', '2025-07-13 17:45:00', true, 36, 4, 'Gestión inventario'),
('2025-07-13', '2025-07-13 08:15:00', '2025-07-13 17:30:00', true, 37, 4, 'Coordinación entregas'),
-- Marketing (Supervisor: Luis Fernández id=5)
('2025-07-13', '2025-07-13 08:00:00', '2025-07-13 18:15:00', true, 46, 5, 'Campaña publicitaria Q3'),
('2025-07-13', '2025-07-13 08:05:00', '2025-07-13 17:35:00', true, 47, 5, 'Análisis métricas');

-- HACE 10 DÍAS - JORNADAS COMPLETAMENTE APROBADAS (Jornadas IDs 32-38)
INSERT INTO "Jornada" (fecha, hora_checkin, hora_checkout, aprobado, id_usuario, id_supervisor, observaciones) VALUES 
-- id_usuario 56 (Carmen Ruiz - Ventas) -> id_supervisor 5 (Luis Fernández - Ventas)
('2025-07-17', '2025-07-17 08:10:00', '2025-07-17 17:40:00', true, 56, 5, 'Análisis métricas marketing'),
-- id_usuario 38 (Carlos Mendoza - Logística) -> id_supervisor 4 (Ana Martínez - Logística)
('2025-07-17', '2025-07-17 08:05:00', '2025-07-17 17:35:00', true, 38, 4, 'Optimización logística'),
-- id_usuario 29 (Lucía Herrera - Finanzas) -> id_supervisor 3 (Carlos Rodríguez - Finanzas)
('2025-07-17', '2025-07-17 08:20:00', '2025-07-17 18:10:00', true, 29, 3, 'Auditoría financiera'),
-- id_usuario 19 (Marina Castillo - Tecnología) -> id_supervisor 2 (María González - Tecnología)
('2025-07-17', '2025-07-17 07:50:00', '2025-07-17 17:20:00', true, 19, 2, 'Migración base datos'),
-- id_usuario 39 (Beatriz Fuentes - Logística) -> id_supervisor 4 (Ana Martínez - Logística)
('2025-07-17', '2025-07-17 08:25:00', '2025-07-17 17:55:00', true, 39, 4, 'Proceso órdenes especiales'),
-- id_usuario 6 (Diego Herrera - RH) -> id_supervisor 4 (Ana Martínez - RH)
('2025-07-17', '2025-07-17 08:00:00', '2025-07-17 17:30:00', true, 6, 4, 'Reclutamiento candidatos'),
-- id_usuario 7 (Carmen Vidal - RH) -> id_supervisor 4 (Ana Martínez - RH)
('2025-07-17', '2025-07-17 08:15:00', '2025-07-17 18:00:00', true, 7, 4, 'Evaluación desempeño');

-- HACE 5 DÍAS - JORNADAS COMPLETAMENTE APROBADAS (Jornadas IDs 39-45)
INSERT INTO "Jornada" (fecha, hora_checkin, hora_checkout, aprobado, id_usuario, id_supervisor, observaciones) VALUES 
-- Tecnología (Supervisor: María González id=2)
('2025-07-22', '2025-07-22 08:00:00', '2025-07-22 17:30:00', true, 16, 2, 'API REST implementation'),
('2025-07-22', '2025-07-22 08:15:00', '2025-07-22 18:00:00', true, 17, 2, 'Frontend integration'),
-- Finanzas (Supervisor: Carlos Rodríguez id=3)
('2025-07-22', '2025-07-22 07:45:00', '2025-07-22 17:00:00', true, 26, 3, 'Budget planning 2025'),
-- Logística (Supervisor: Ana Martínez id=4)
('2025-07-22', '2025-07-22 08:30:00', '2025-07-22 17:45:00', true, 36, 4, 'Supply chain optimization'),
-- Marketing (Supervisor: Luis Fernández id=5)
('2025-07-22', '2025-07-22 08:00:00', '2025-07-22 18:15:00', true, 46, 5, 'Digital campaign launch'),
-- Ventas (Supervisor: Luis Fernández id=5)
('2025-07-22', '2025-07-22 08:10:00', '2025-07-22 17:40:00', true, 56, 5, 'Cliente presentation'),
-- Administración (Supervisor: Ana Martínez id=4)
('2025-07-22', '2025-07-22 08:05:00', '2025-07-22 17:35:00', true, 66, 4, 'Process improvement');

-- AYER (26 JULIO) - JORNADAS COMPLETAMENTE APROBADAS CON MÁS EMPLEADOS (Jornadas IDs 46-60)
INSERT INTO "Jornada" (fecha, hora_checkin, hora_checkout, aprobado, id_usuario, id_supervisor, observaciones) VALUES 
-- Tecnología (Supervisor: María González id=2)
('2025-07-26', '2025-07-26 08:00:00', '2025-07-26 17:30:00', true, 16, 2, 'Code review y merge requests'),
('2025-07-26', '2025-07-26 08:15:00', '2025-07-26 18:00:00', true, 17, 2, 'Bug fixing crítico'),
('2025-07-26', '2025-07-26 08:20:00', '2025-07-26 17:45:00', true, 18, 2, 'Testing regresión'),
('2025-07-26', '2025-07-26 08:10:00', '2025-07-26 17:40:00', true, 19, 2, 'Deploy hotfix'),
-- Finanzas (Supervisor: Carlos Rodríguez id=3)
('2025-07-26', '2025-07-26 07:45:00', '2025-07-26 17:00:00', true, 26, 3, 'Presentación stakeholders'),
('2025-07-26', '2025-07-26 08:00:00', '2025-07-26 17:30:00', true, 28, 3, 'Análisis ROI Q3'),
('2025-07-26', '2025-07-26 08:15:00', '2025-07-26 17:45:00', true, 28, 3, 'Presupuesto Q4'),
-- Logística (Supervisor: Ana Martínez id=4)
('2025-07-26', '2025-07-26 08:30:00', '2025-07-26 17:45:00', true, 36, 4, 'Entrevistas candidatos'),
('2025-07-26', '2025-07-26 08:25:00', '2025-07-26 17:40:00', true, 37, 4, 'Evaluación técnica'),
-- Marketing (Supervisor: Luis Fernández id=5)
('2025-07-26', '2025-07-26 08:00:00', '2025-07-26 18:15:00', true, 46, 5, 'Planificación sprint'),
('2025-07-26', '2025-07-26 08:05:00', '2025-07-26 17:35:00', true, 47, 5, 'Análisis métricas'),
-- Ventas (Supervisor: Luis Fernández id=5)
('2025-07-26', '2025-07-26 08:10:00', '2025-07-26 17:40:00', true, 56, 5, 'Seguimiento clientes'),
('2025-07-26', '2025-07-26 08:15:00', '2025-07-26 18:00:00', true, 57, 5, 'Propuestas comerciales'),
-- RRHH (Supervisor: Ana Martínez id=4)
('2025-07-26', '2025-07-26 08:00:00', '2025-07-26 17:30:00', true, 6, 4, 'Evaluaciones personal'),
('2025-07-26', '2025-07-26 08:05:00', '2025-07-26 17:35:00', true, 7, 4, 'Capacitaciones equipo');

-- ==========================================
-- JORNADAS DE HOY (28 JULIO 2025) - REPRESENTACIÓN COMPLETA
-- Los IDs de jornada continuarán secuencialmente.
-- ==========================================

-- ESCENARIO 1: JORNADAS COMPLETADAS Y TOTALMENTE APROBADAS (15 empleados) (Jornadas IDs 61-75)
INSERT INTO "Jornada" (fecha, hora_checkin, hora_checkout, aprobado, id_usuario, id_supervisor, observaciones) VALUES 
-- Tecnología (Supervisor: María González id=2)
('2025-07-28', '2025-07-28 08:00:00', '2025-07-28 17:30:00', true, 16, 2, 'Deploy exitoso nueva versión API'),
('2025-07-28', '2025-07-28 08:15:00', '2025-07-28 18:00:00', true, 17, 2, 'Hotfix crítico resuelto exitosamente'),
('2025-07-28', '2025-07-28 08:10:00', '2025-07-28 17:45:00', true, 18, 2, 'Testing integración completo'),

-- Finanzas (Supervisor: Carlos Rodríguez id=3)
('2025-07-28', '2025-07-28 07:45:00', '2025-07-28 17:00:00', true, 26, 3, 'Presentación resultados Q3'),
('2025-07-28', '2025-07-28 08:00:00', '2025-07-28 17:30:00', true, 28, 3, 'Análisis ROI campaña digital'),
('2025-07-28', '2025-07-28 08:05:00', '2025-07-28 17:35:00', true, 28, 3, 'Cierre contable julio'),

-- Logística (Supervisor: Ana Martínez id=4)
('2025-07-28', '2025-07-28 08:30:00', '2025-07-28 17:45:00', true, 36, 4, 'Optimización rutas entrega'),
('2025-07-28', '2025-07-28 08:20:00', '2025-07-28 17:40:00', true, 37, 4, 'Coordinación proveedores Q4'),
('2025-07-28', '2025-07-28 08:15:00', '2025-07-28 17:35:00', true, 38, 4, 'Inventario productos agosto'),

-- Marketing (Supervisor: Luis Fernández id=5)
('2025-07-28', '2025-07-28 08:05:00', '2025-07-28 18:10:00', true, 46, 5, 'Lanzamiento campaña agosto'),
('2025-07-28', '2025-07-28 08:10:00', '2025-07-28 17:55:00', true, 47, 5, 'Análisis competencia Q3'),
('2025-07-28', '2025-07-28 08:00:00', '2025-07-28 18:00:00', true, 48, 5, 'Métricas conversión julio'),

-- Ventas (Supervisor: Luis Fernández id=5)
('2025-07-28', '2025-07-28 08:15:00', '2025-07-28 17:45:00', true, 56, 5, 'Cierre ventas mes exitoso'),
('2025-07-28', '2025-07-28 08:10:00', '2025-07-28 17:50:00', true, 57, 5, 'Presentación cliente VIP'),

-- RRHH (Supervisor: Ana Martínez id=4)
('2025-07-28', '2025-07-28 08:00:00', '2025-07-28 17:30:00', true, 6, 4, 'Evaluaciones desempeño Q3');

-- ESCENARIO 2: JORNADAS COMPLETADAS PENDIENTES DE APROBACIÓN DE CHECK-OUT (10 empleados) (Jornadas IDs 76-85)
INSERT INTO "Jornada" (fecha, hora_checkin, hora_checkout, aprobado, id_usuario, id_supervisor, observaciones) VALUES 
-- Tecnología (Supervisor: María González id=2)
('2025-07-28', '2025-07-28 07:45:00', '2025-07-28 17:00:00', false, 19, 2, 'Check-out pendiente - refactoring completado'),
('2025-07-28', '2025-07-28 08:25:00', '2025-07-28 17:55:00', false, 20, 2, 'Check-out pendiente - documentación actualizada'),

-- Finanzas (Supervisor: Carlos Rodríguez id=3)
('2025-07-28', '2025-07-28 08:10:00', '2025-07-28 17:40:00', false, 29, 3, 'Check-out pendiente - auditoría completada'),
('2025-07-28', '2025-07-28 08:05:00', '2025-07-28 17:35:00', false, 30, 3, 'Check-out pendiente - reporte financiero listo'),

-- Logística (Supervisor: Ana Martínez id=4)
('2025-07-28', '2025-07-28 08:30:00', '2025-07-28 17:45:00', false, 39, 4, 'Check-out pendiente - inventario actualizado'),
('2025-07-28', '2025-07-28 08:15:00', '2025-07-28 17:30:00', false, 40, 4, 'Check-out pendiente - entregas coordinadas'),

-- Marketing (Supervisor: Luis Fernández id=5)
('2025-07-28', '2025-07-28 08:20:00', '2025-07-28 18:05:00', false, 49, 5, 'Check-out pendiente - creativos aprobados'),
('2025-07-28', '2025-07-28 08:00:00', '2025-07-28 17:45:00', false, 50, 5, 'Check-out pendiente - campaña configurada'),

-- Ventas (Supervisor: Luis Fernández id=5)
('2025-07-28', '2025-07-28 08:10:00', '2025-07-28 17:50:00', false, 58, 5, 'Check-out pendiente - propuestas enviadas'),

-- Administración (Supervisor: Ana Martínez id=4)
('2025-07-28', '2025-07-28 08:05:00', '2025-07-28 17:40:00', false, 66, 4, 'Check-out pendiente - procesos optimizados'); -- id_usuario 76 no existe, usando 66 (Gustavo Pereira)

-- ESCENARIO 3: EMPLEADOS TRABAJANDO (CHECK-IN APROBADO, SIN CHECK-OUT) (20 empleados) (Jornadas IDs 86-105)
INSERT INTO "Jornada" (fecha, hora_checkin, hora_checkout, aprobado, id_usuario, id_supervisor, observaciones) VALUES 
-- Tecnología (Supervisor: María González id=2)
('2025-07-28', '2025-07-28 08:00:00', NULL, true, 21, 2, 'Trabajando - desarrollo microservicios'),
('2025-07-28', '2025-07-28 08:15:00', NULL, true, 22, 2, 'Trabajando - optimización performance'),
('2025-07-28', '2025-07-28 08:05:00', NULL, true, 23, 2, 'Trabajando - integración APIs externas'),

-- Finanzas (Supervisor: Carlos Rodríguez id=3)
('2025-07-28', '2025-07-28 07:50:00', NULL, true, 31, 3, 'Trabajando - presupuesto 2026'),
('2025-07-28', '2025-07-28 08:10:00', NULL, true, 32, 3, 'Trabajando - análisis costos'),
('2025-07-28', '2025-07-28 08:00:00', NULL, true, 33, 3, 'Trabajando - conciliación bancaria'),

-- Logística (Supervisor: Ana Martínez id=4)
('2025-07-28', '2025-07-28 08:05:00', NULL, true, 41, 4, 'Trabajando - gestión almacén'),
('2025-07-28', '2025-07-28 08:20:00', NULL, true, 42, 4, 'Trabajando - seguimiento pedidos'),
('2025-07-28', '2025-07-28 08:15:00', NULL, true, 43, 4, 'Trabajando - evaluación proveedores'),

-- Marketing (Supervisor: Luis Fernández id=5)
('2025-07-28', '2025-07-28 08:10:00', NULL, true, 51, 5, 'Trabajando - estrategia redes sociales'),
('2025-07-28', '2025-07-28 08:00:00', NULL, true, 52, 5, 'Trabajando - análisis mercado'),
('2025-07-28', '2025-07-28 08:05:00', NULL, true, 53, 5, 'Trabajando - contenido digital'),

-- Ventas (Supervisor: Luis Fernández id=5)
('2025-07-28', '2025-07-28 08:15:00', NULL, true, 59, 5, 'Trabajando - seguimiento clientes'),
('2025-07-28', '2025-07-28 08:20:00', NULL, true, 60, 5, 'Trabajando - prospección leads'),
('2025-07-28', '2025-07-28 08:10:00', NULL, true, 61, 5, 'Trabajando - propuestas comerciales'),

-- RRHH (Supervisor: Ana Martínez id=4)
('2025-07-28', '2025-07-28 08:00:00', NULL, true, 7, 4, 'Trabajando - proceso selección'), -- id_usuario 7 (Carmen Vidal)
('2025-07-28', '2025-07-28 08:05:00', NULL, true, 8, 4, 'Trabajando - capacitación equipos'), -- id_usuario 8 (Raúl Mendez)
('2025-07-28', '2025-07-28 08:10:00', NULL, true, 9, 4, 'Trabajando - evaluación clima laboral'), -- id_usuario 9 (Sofía Romero)

-- Administración (Supervisor: Ana Martínez id=4)
('2025-07-28', '2025-07-28 08:15:00', NULL, true, 67, 4, 'Trabajando - gestión documentos'), -- id_usuario 77 no existe, usando 67 (Irene Molina)
('2025-07-28', '2025-07-28 08:00:00', NULL, true, 68, 4, 'Trabajando - mejora procesos'); -- id_usuario 78 no existe, usando 68 (Raquel Sandoval)

-- ESCENARIO 4: CHECK-INS PENDIENTES DE APROBACIÓN (25 empleados) (Jornadas IDs 106-130)
INSERT INTO "Jornada" (fecha, hora_checkin, hora_checkout, aprobado, id_usuario, id_supervisor, observaciones) VALUES 
-- Tecnología (Supervisor: María González id=2)
('2025-07-28', '2025-07-28 08:25:00', NULL, false, 24, 2, 'Check-in pendiente - desarrollo frontend'),
('2025-07-28', '2025-07-28 08:20:00', NULL, false, 25, 2, 'Check-in pendiente - testing automatizado'),
('2025-07-28', '2025-07-28 08:30:00', NULL, false, 16, 2, 'Check-in pendiente - migración datos'), -- id_usuario 15 no existe en Tecnología, usando 16 (Pedro Silva)

-- Finanzas (Supervisor: Carlos Rodríguez id=3)
('2025-07-28', '2025-07-28 08:15:00', NULL, false, 34, 3, 'Check-in pendiente - análisis rentabilidad'),
('2025-07-28', '2025-07-28 08:35:00', NULL, false, 35, 3, 'Check-in pendiente - planning presupuestal'),
('2025-07-28', '2025-07-28 08:10:00', NULL, false, 26, 3, 'Check-in pendiente - auditoría interna'), -- id_usuario 14 no existe en Finanzas, usando 26 (Roberto López)
('2025-07-28', '2025-07-28 08:40:00', NULL, false, 28, 3, 'Check-in pendiente - control gastos'), -- id_usuario 13 no existe en Finanzas, usando 28 (Patricia Morales)

-- Logística (Supervisor: Ana Martínez id=4)
('2025-07-28', '2025-07-28 08:30:00', NULL, false, 44, 4, 'Check-in pendiente - coordinación envíos'),
('2025-07-28', '2025-07-28 08:25:00', NULL, false, 45, 4, 'Check-in pendiente - gestión inventario'),
('2025-07-28', '2025-07-28 08:35:00', NULL, false, 36, 4, 'Check-in pendiente - optimización procesos'), -- id_usuario 12 no existe en Logística, usando 36 (Sandra García)
('2025-07-28', '2025-07-28 08:20:00', NULL, false, 37, 4, 'Check-in pendiente - control calidad'), -- id_usuario 11 no existe en Logística, usando 37 (Elena Castro)

-- Marketing (Supervisor: Luis Fernández id=5)
('2025-07-28', '2025-07-28 08:40:00', NULL, false, 54, 5, 'Check-in pendiente - campaña digital'),
('2025-07-28', '2025-07-28 08:15:00', NULL, false, 55, 5, 'Check-in pendiente - análisis ROI'),
('2025-07-28', '2025-07-28 08:25:00', NULL, false, 46, 5, 'Check-in pendiente - estrategia contenido'), -- id_usuario 10 no existe en Marketing, usando 46 (Miguel Torres)
('2025-07-28', '2025-07-28 08:30:00', NULL, false, 47, 5, 'Check-in pendiente - gestión marca'), -- id_usuario 74 no existe, usando 47 (Andrés Jiménez)

-- Ventas (Supervisor: Luis Fernández id=5)
('2025-07-28', '2025-07-28 08:35:00', NULL, false, 62, 5, 'Check-in pendiente - seguimiento leads'),
('2025-07-28', '2025-07-28 08:45:00', NULL, false, 63, 5, 'Check-in pendiente - cierre ventas'),
('2025-07-28', '2025-07-28 08:20:00', NULL, false, 64, 5, 'Check-in pendiente - atención clientes'),
('2025-07-28', '2025-07-28 08:25:00', NULL, false, 65, 5, 'Check-in pendiente - prospección nuevos'),

-- RRHH (Supervisor: Ana Martínez id=4)
('2025-07-28', '2025-07-28 08:40:00', NULL, false, 6, 4, 'Check-in pendiente - entrevistas candidatos'), -- id_usuario 66 no existe en RH, usando 6 (Diego Herrera)
('2025-07-28', '2025-07-28 08:15:00', NULL, false, 7, 4, 'Check-in pendiente - onboarding nuevo personal'), -- id_usuario 67 no existe en RH, usando 7 (Carmen Vidal)
('2025-07-28', '2025-07-28 08:30:00', NULL, false, 8, 4, 'Check-in pendiente - evaluación desempeño'), -- id_usuario 68 no existe en RH, usando 8 (Raúl Mendez)

-- Administración (Supervisor: Ana Martínez id=4)
('2025-07-28', '2025-07-28 08:35:00', NULL, false, 69, 4, 'Check-in pendiente - gestión contratos'), -- id_usuario 79 no existe, usando 69 (Maximiliano Figueroa)
('2025-07-28', '2025-07-28 08:25:00', NULL, false, 70, 4, 'Check-in pendiente - actualización políticas'), -- id_usuario 80 no existe, usando 70 (Pilar Valencia)
('2025-07-28', '2025-07-28 08:45:00', NULL, false, 71, 4, 'Check-in pendiente - coordinación áreas'); -- id_usuario 75 no existe, usando 71 (Joaquín Muñoz)


-- ==========================================
-- ACTIVIDADES HISTÓRICAS
-- Los IDs de actividad se auto-incrementarán de forma secuencial.
-- Los id_jornada se han ajustado para reflejar los IDs reales de la tabla Jornada.
-- ==========================================

-- Actividades de hace 14 días (para Jornadas IDs 22-26)
INSERT INTO "Actividad" (id_jornada, tarea, meta, id_estado, observaciones, es_arrastrada) VALUES 
-- Jornada 22: Pedro Silva (aprobada)
(22, 'Desarrollo módulo autenticación', 'Implementar login JWT seguro', 3, 'Completado con todas las validaciones', false),
(22, 'Configurar base datos', 'Setup PostgreSQL optimizado', 3, 'Configuración con índices optimizados', false),
(22, 'Documentar API endpoints', 'Swagger documentation', 3, 'Documentación completa creada', false),

-- Jornada 23: Laura Fernández (aprobada)
(23, 'Testing unitario', 'Alcanzar 85% cobertura', 3, 'Cobertura alcanzada: 87%', false),
(23, 'Refactoring código legacy', 'Mejorar performance 30%', 3, 'Performance mejorada en 35%', false),
(23, 'Crear casos prueba', 'Suite testing completa', 3, 'Suite de testing implementada', false),

-- Jornada 24: Roberto López (aprobada)
(24, 'Cierre contable mensual', 'Balances y conciliaciones', 3, 'Cierre completado sin observaciones', false),
(24, 'Análisis gastos operativos', 'Identificar ahorros', 3, 'Ahorros identificados: 12%', false),
(24, 'Reporte financiero ejecutivo', 'Dashboard KPIs', 3, 'Dashboard implementado', false),

-- Jornada 25: Sandra García (aprobada)
(25, 'Gestión inventario Q3', 'Actualizar stock completo', 3, 'Inventario actualizado 100%', false),
(25, 'Optimizar rutas entrega', 'Reducir costos logísticos', 3, 'Rutas optimizadas - ahorro 18%', false),
(25, 'Coordinación proveedores', 'Nuevos acuerdos comerciales', 3, 'Contratos renegociados exitosamente', false),

-- Jornada 26: Miguel Torres (aprobada)
(26, 'Campaña digital Q3', 'Lanzar en todas las redes', 3, 'Campaña lanzada exitosamente', false),
(26, 'Análisis competencia', 'Reporte positioning', 3, 'Análisis completo de mercado', false),
(26, 'Métricas conversión', 'Optimizar funnel ventas', 3, 'Funnel optimizado +25% conversión', false);

-- Actividades de ayer (para Jornadas IDs 46-47)
INSERT INTO "Actividad" (id_jornada, tarea, meta, id_estado, observaciones, es_arrastrada) VALUES 
-- Jornada 46: Pedro Silva (aprobada)
(46, 'Code review PRs', 'Revisar 8 pull requests', 3, 'Todos los PRs revisados y aprobados', false),
(46, 'Bug fixing crítico', 'Resolver issue #1234', 3, 'Bug resuelto y desplegado', false),
(46, 'Optimización queries', 'Mejorar performance DB', 3, 'Queries optimizadas 40% más rápido', false),

-- Jornada 47: Laura Fernández (aprobada)
(47, 'Hotfix producción', 'Corregir error de login', 3, 'Hotfix desplegado exitosamente', false),
(47, 'Testing regresión', 'Validar todas las funciones', 3, 'Testing completo sin errores', false),
(47, 'Documentación técnica', 'Actualizar manuales', 3, 'Documentación actualizada', false);

-- ==========================================
-- ACTIVIDADES EXPANDIDAS DE HOY (28 JULIO)
-- Los id_jornada se han ajustado para reflejar los IDs reales de la tabla Jornada.
-- ==========================================

-- JORNADAS COMPLETADAS Y APROBADAS (actividades terminadas) (para Jornadas IDs 61-75)
INSERT INTO "Actividad" (id_jornada, tarea, meta, id_estado, observaciones, es_arrastrada) VALUES 

-- Tecnología (Jornadas 61-63)
(61, 'Deploy nueva versión API', 'Actualizar API notificaciones v2.1', 3, 'Deploy exitoso sin downtime', false),
(61, 'Testing post-deploy', 'Verificar funcionalidad crítica', 3, 'Todos los tests pasando', false),
(61, 'Documentación release', 'Actualizar changelog y docs', 3, 'Documentación completada', false),

(62, 'Hotfix seguridad crítico', 'Resolver vulnerabilidad CVE-2024', 3, 'Vulnerabilidad corregida', false),
(62, 'Testing seguridad', 'Validar corrección completa', 3, 'Tests de seguridad OK', false),
(62, 'Deploy urgente', 'Subir hotfix a producción', 3, 'Deploy ejecutado exitosamente', false),

(63, 'Testing integración APIs', 'Validar conectores externos', 3, 'Integración completamente funcional', false),
(63, 'Optimización queries', 'Mejorar performance 30%', 3, 'Performance mejorada 35%', false),
(63, 'Code review final', 'Validar calidad código', 3, 'Code review aprobado', false),

-- Finanzas (Jornadas 64-66)
(64, 'Presentación resultados Q3', 'Demo stakeholders ejecutivos', 3, 'Presentación exitosa, feedback positivo', false),
(64, 'Análisis ROI marketing', 'Calcular retorno inversión', 3, 'ROI calculado: +187%', false),
(64, 'Planning Q4', 'Estrategia cuarto trimestre', 3, 'Plan Q4 aprobado por dirección', false),

(65, 'Análisis ROI campaña', 'Métricas campaña digital julio', 3, 'ROI superior a expectativas 23%', false),
(65, 'Reporte ejecutivo', 'Dashboard KPIs financieros', 3, 'Dashboard implementado', false),
(65, 'Optimización costos', 'Identificar ahorros potenciales', 3, 'Ahorros identificados: 15%', false),

(66, 'Cierre contable julio', 'Conciliación completa mes', 3, 'Cierre sin observaciones', false),
(66, 'Análisis gastos', 'Revisión gastos departamentales', 3, 'Análisis completado', false),
(66, 'Reporte compliance', 'Validación normativas', 3, 'Compliance 100% validado', false),

-- Logística (Jornadas 67-69)
(67, 'Optimización rutas', 'Reducir costos entrega 20%', 3, 'Rutas optimizadas ahorro 22%', false),
(67, 'Negociación proveedores', 'Renegociar contratos Q4', 3, 'Contratos mejorados exitosamente', false),
(67, 'KPIs logísticos', 'Dashboard métricas entrega', 3, 'Dashboard operativo', false),

(68, 'Coordinación proveedores', 'Sincronizar entregas Q4', 3, 'Cronograma Q4 coordinado', false),
(68, 'Gestión inventario', 'Actualización stock agosto', 3, 'Inventario actualizado 100%', false),
(68, 'Optimización almacén', 'Mejora layout espacios', 3, 'Layout optimizado +30% eficiencia', false),

(69, 'Inventario productos', 'Conteo físico completo', 3, 'Inventario completado sin diferencias', false),
(69, 'Análisis rotación', 'Estudio productos lentos', 3, 'Estrategia productos lentos definida', false),
(69, 'Coordinación cross-dock', 'Optimizar flujo mercancía', 3, 'Cross-docking implementado', false),

-- Marketing (Jornadas 70-72)
(70, 'Lanzamiento campaña agosto', 'Campaign multi-canal Q4', 3, 'Campaña lanzada en todas plataformas', false),
(70, 'Configuración analytics', 'Setup tracking conversiones', 3, 'Analytics configurado completamente', false),
(70, 'Brief creativo', 'Lineamientos creativos Q4', 3, 'Brief aprobado por dirección', false),

(71, 'Análisis competencia Q3', 'Benchmarking mercado', 3, 'Análisis competitivo completado', false),
(71, 'Estrategia positioning', 'Redefinir propuesta valor', 3, 'Nuevo positioning aprobado', false),
(71, 'Plan medios Q4', 'Distribución presupuesto', 3, 'Plan medios optimizado', false),

(72, 'Métricas conversión julio', 'Análisis funnel ventas', 3, 'Funnel optimizado +28% conversión', false),
(72, 'A/B testing ads', 'Optimizar creativos', 3, 'Mejores creativos identificados', false),
(72, 'Reporte performance', 'KPIs marketing julio', 3, 'Reporte ejecutivo entregado', false),

-- Ventas (Jornadas 73-74)
(73, 'Cierre ventas mes', 'Alcanzar meta 120%', 3, 'Meta superada 125%', false),
(73, 'Seguimiento leads calientes', 'Convertir 15 leads', 3, '17 leads convertidos exitosamente', false),
(73, 'Reporte comercial', 'Dashboard ventas julio', 3, 'Dashboard actualizado', false),

(74, 'Presentación cliente VIP', 'Propuesta enterprise', 3, 'Cliente VIP firmó contrato anual', false),
(74, 'Negociación contrato', 'Términos comerciales', 3, 'Contrato negociado exitosamente', false),
(74, 'Plan fidelización', 'Estrategia retención', 3, 'Plan fidelización implementado', false),

-- RRHH (Jornada 75)
(75, 'Evaluaciones Q3', 'Evaluación 40 empleados', 3, 'Evaluaciones completadas', false),
(75, 'Plan desarrollo', 'Planes individuales crecimiento', 3, 'Planes desarrollo definidos', false),
(75, 'Análisis clima laboral', 'Survey satisfacción equipo', 3, 'Survey completado 95% participación', false);

-- JORNADAS CON CHECK-OUT PENDIENTE (actividades terminadas pero jornada no aprobada) (para Jornadas IDs 76-85)
INSERT INTO "Actividad" (id_jornada, tarea, meta, id_estado, observaciones, es_arrastrada) VALUES 

-- Tecnología (Jornadas 76-77)
(76, 'Refactoring módulo auth', 'Mejorar performance 40%', 3, 'Refactoring completado exitosamente', false),
(76, 'Testing performance', 'Validar mejoras rendimiento', 3, 'Performance mejorada 42%', false),
(76, 'Documentación técnica', 'Actualizar arquitectura', 2, 'Documentación 90% completada', false),

(77, 'Actualizar dependencias', 'Upgrade librerías seguridad', 3, 'Todas las dependencias actualizadas', false),
(77, 'Testing automatizado', 'Suite completa pruebas', 3, 'Suite testing implementada', false),
(77, 'Deploy staging', 'Validar en pre-producción', 3, 'Deploy staging exitoso', false),

-- Finanzas (Jornadas 78-79)  
(78, 'Auditoría procesos', 'Revisión controles internos', 3, 'Auditoría completada sin observaciones', false),
(78, 'Optimización workflows', 'Automatizar procesos manuales', 3, 'Workflows optimizados 35%', false),
(78, 'Reporte cumplimiento', 'Validación normativas SOX', 3, 'Compliance 100% validado', false),

(79, 'Reporte financiero', 'Estados financieros Q3', 3, 'Estados financieros completados', false),
(79, 'Análisis variaciones', 'Estudio desviaciones presupuesto', 3, 'Análisis completado', false),
(79, 'Proyecciones Q4', 'Forecast último trimestre', 2, 'Proyecciones 85% completadas', false),

-- Logística (Jornadas 80-81)
(80, 'Actualización inventario', 'Sync ERP con físico', 3, 'Inventario 100% sincronizado', false),
(80, 'Análisis ABC productos', 'Clasificación importancia', 3, 'Clasificación ABC actualizada', false),
(80, 'Plan reposición', 'Stock safety Q4', 3, 'Plan reposición aprobado', false),

(81, 'Coordinación entregas', 'Schedule entregas agosto', 3, 'Cronograma entregas optimizado', false),
(81, 'Evaluación carriers', 'Performance proveedores logísticos', 3, 'Evaluación carriers completada', false),
(81, 'Optimización costos', 'Reducir gastos envío 10%', 3, 'Costos reducidos 12%', false),

-- Marketing (Jornadas 82-83)
(82, 'Creativos campaña', 'Diseños visuales Q4', 3, 'Creativos aprobados dirección', false),
(82, 'Testing A/B copy', 'Optimizar mensajes clave', 3, 'Mejores copies identificados', false),
(82, 'Setup tracking', 'Configurar métricas campaña', 3, 'Tracking configurado completamente', false),

(83, 'Configuración ads', 'Setup Facebook e Instagram', 3, 'Ads configurados y activos', false),
(83, 'Segmentación audiencias', 'Target grupos específicos', 3, 'Audiencias segmentadas', false),
(83, 'Budget optimization', 'Distribución presupuesto', 2, 'Budget optimizado 80%', false),

-- Ventas (Jornada 84)
(84, 'Envío propuestas', 'Propuestas 12 clientes potenciales', 3, 'Propuestas enviadas exitosamente', false),
(84, 'Follow-up leads', 'Seguimiento pipeline Q4', 3, 'Pipeline actualizado', false),
(84, 'Preparación presentaciones', 'Material comercial Q4', 3, 'Presentaciones actualizadas', false),

-- Administración (Jornada 85)
(85, 'Optimización procesos', 'Mejora workflows administrativos', 3, 'Procesos optimizados 25%', false),
(85, 'Actualización políticas', 'Review políticas internas', 3, 'Políticas actualizadas', false),
(85, 'Coordinación departamentos', 'Sincronización objetivos Q4', 2, 'Coordinación 90% completada', false);

-- EMPLEADOS TRABAJANDO (actividades en progreso y pendientes) (para Jornadas IDs 86-105)
INSERT INTO "Actividad" (id_jornada, tarea, meta, id_estado, observaciones, es_arrastrada) VALUES 

-- Tecnología (Jornadas 86-88)
(86, 'Desarrollo microservicios', 'Arquitectura distribuida', 2, 'Microservicio users 80% completo', false),
(86, 'Setup Kubernetes', 'Orquestación contenedores', 2, 'Cluster configurado parcialmente', false),
(86, 'Testing integración', 'Validar conectividad servicios', 1, 'Iniciando plan de testing', false),

(87, 'Optimización performance', 'Reducir tiempo respuesta 50%', 2, 'Optimización 60% completada', false),
(87, 'Implementar cache', 'Redis para queries frecuentes', 2, 'Cache implementado para users', false),
(87, 'Monitoreo aplicación', 'Dashboard métricas real-time', 1, 'Configurando herramientas monitoring', false),

(88, 'Integración APIs', 'Conectores servicios externos', 2, 'API payments 90% integrada', false),
(88, 'Validación datos', 'Schemas y validaciones', 2, 'Validaciones implementadas 70%', false),
(88, 'Documentación OpenAPI', 'Specs técnicas completas', 1, 'Documentación en progreso', false);

-- ==========================================
-- COMENTARIOS DE SUPERVISORES
-- Los id_actividad se han ajustado para reflejar los IDs reales de la tabla Actividad.
-- ==========================================

-- Comentarios históricos
INSERT INTO "Comentario" (id_actividad, id_supervisor, comentario, fecha_comentario) VALUES 
-- Hace 14 días (Actividades IDs 1-15)
(1, 2, 'Excelente implementación de la autenticación. Código muy limpio y seguro.', '2025-07-13 18:00:00'),
(2, 2, 'Configuración de base de datos muy sólida. Buenos índices implementados.', '2025-07-13 18:15:00'),
(4, 2, 'Testing excepcional. La cobertura supera expectativas.', '2025-07-13 18:30:00'),
(7, 3, 'Cierre contable perfecto. Sin observaciones de auditoría.', '2025-07-13 17:30:00'),
(10, 4, 'Gestión de inventario muy eficiente. Excelente organización.', '2025-07-13 18:00:00'),

-- Comentarios de ayer (Actividades IDs 16-21)
(19, 2, 'Code review muy detallado. Excelentes sugerencias implementadas.', '2025-07-26 17:45:00'),
(20, 2, 'Resolución rápida del bug crítico. Gran trabajo bajo presión.', '2025-07-26 18:00:00'),
(22, 2, 'Hotfix bien ejecutado. Testing de regresión muy completo.', '2025-07-26 18:15:00'),

-- Comentarios de hoy en jornadas completadas (Actividades IDs 22-66)
-- Actividad para Jornada 61 (original 81)
(22, 2, 'API implementada perfectamente. Deploy sin problemas.', '2025-07-28 17:45:00'),
(23, 2, 'Excelente coordinación en el deploy. Monitoreo proactivo.', '2025-07-28 18:00:00'),
-- Actividad para Jornada 63 (original 83)
(28, 2, 'Testing de integración muy completo. Buena documentación.', '2025-07-28 18:15:00'),
-- Actividad para Jornada 64 (original 84)
(31, 3, 'Presentación excelente. Stakeholders muy satisfechos.', '2025-07-28 17:30:00'),
-- Actividad para Jornada 67 (original 87)
(40, 4, 'Buena selección de candidatos. Recomiendo proceder con ofertas.', '2025-07-28 18:00:00'),

-- Comentarios en actividades en progreso (Actividades IDs 97-105)
-- Actividad para Jornada 86 (original 106)
(97, 5, 'Buen progreso en la integración. Continúa con PayPal.', '2025-07-28 14:30:00'),
-- Actividad para Jornada 87 (original 107)
(100, 5, 'Configuración de Facebook ads muy bien segmentada.', '2025-07-28 15:00:00'),
-- Actividad para Jornada 88 (original 108)
(103, 4, 'Inventario físico va bien. Coordina con turno noche para terminar.', '2025-07-28 15:30:00');
-- Nota: La actividad original 40 no tiene un mapeo directo en el bloque de "EMPLEADOS TRABAJANDO" corregido. Se ha eliminado para evitar errores.

-- ==========================================
-- AUDITORÍA
-- Los id_usuario se refieren a los IDs de los usuarios que realizan la acción.
-- ==========================================

INSERT INTO "Auditoria" (id_usuario, accion, fecha, descripcion) VALUES 
-- Logins de supervisores hoy
(1, 'LOGIN', '2025-07-28 07:00:00', 'Inicio de sesión administrador'),
(2, 'LOGIN', '2025-07-28 07:30:00', 'Inicio de sesión supervisor María González'),
(3, 'LOGIN', '2025-07-28 07:45:00', 'Inicio de sesión supervisor Carlos Rodríguez'),
(4, 'LOGIN', '2025-07-28 08:00:00', 'Inicio de sesión supervisor Ana Martínez'),
(5, 'LOGIN', '2025-07-28 08:15:00', 'Inicio de sesión supervisor Luis Fernández'),

-- Aprobaciones de check-ins (simulando el flujo)
(2, 'APROBAR_CHECKIN', '2025-07-28 08:30:00', 'Aprobación check-in Pedro Silva'),
(2, 'APROBAR_CHECKIN', '2025-07-28 08:45:00', 'Aprobación check-in Laura Fernández'),
(3, 'APROBAR_CHECKIN', '2025-07-28 09:00:00', 'Aprobación check-in Roberto López'),
(4, 'APROBAR_CHECKIN', '2025-07-28 09:15:00', 'Aprobación check-in Sandra García'),
(5, 'APROBAR_CHECKIN', '2025-07-28 08:30:00', 'Aprobación check-in Miguel Torres'),
(5, 'APROBAR_CHECKIN', '2025-07-28 08:45:00', 'Aprobación check-in Carmen Ruiz'),
(4, 'APROBAR_CHECKIN', '2025-07-28 08:35:00', 'Aprobación check-in Diego Herrera'),
(3, 'APROBAR_CHECKIN', '2025-07-28 08:20:00', 'Aprobación check-in Patricia Morales'),

-- Aprobaciones de check-outs (solo para completamente aprobadas)
(2, 'APROBAR_CHECKOUT', '2025-07-28 18:00:00', 'Aprobación check-out Pedro Silva'),
(2, 'APROBAR_CHECKOUT', '2025-07-28 18:30:00', 'Aprobación check-out Laura Fernández'),

-- Comentarios del día
(2, 'CREATE_COMMENT', '2025-07-28 17:45:00', 'Comentario en deploy de Pedro'),
(2, 'CREATE_COMMENT', '2025-07-28 18:00:00', 'Comentario en testing de Laura'),
(5, 'CREATE_COMMENT', '2025-07-28 14:30:00', 'Seguimiento API pagos Miguel'),
(3, 'CREATE_COMMENT', '2025-07-28 17:30:00', 'Feedback presentación Roberto'),
(4, 'CREATE_COMMENT', '2025-07-28 18:00:00', 'Comentario entrevistas Sandra');

-- ==========================================
-- CONSULTAS DE VERIFICACIÓN EXPANDIDAS
-- Estas consultas te permitirán verificar los datos insertados.
-- ==========================================

-- Resumen general de datos insertados
SELECT 'Usuarios totales' as tipo, COUNT(*) as cantidad FROM "Usuario"
UNION ALL
SELECT 'Supervisores', COUNT(*) FROM "Usuario" WHERE id_rol = 2
UNION ALL
SELECT 'Empleados', COUNT(*) FROM "Usuario" WHERE id_rol = 3
UNION ALL
SELECT 'Jornadas totales', COUNT(*) FROM "Jornada"
UNION ALL
SELECT 'Jornadas históricas', COUNT(*) FROM "Jornada" WHERE fecha::date < '2025-07-28'
UNION ALL
SELECT 'Jornadas de hoy', COUNT(*) FROM "Jornada" WHERE fecha::date = '2025-07-28'
UNION ALL
SELECT 'Actividades totales', COUNT(*) FROM "Actividad"
UNION ALL
SELECT 'Comentarios totales', COUNT(*) FROM "Comentario"
UNION ALL
SELECT 'Auditorías totales', COUNT(*) FROM "Auditoria";
