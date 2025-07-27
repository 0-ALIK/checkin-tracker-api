-- Script de verificación de la estructura de la base de datos
-- Ejecutar este script para verificar que todas las tablas, funciones y triggers están correctas

-- 1. Verificar si existen las tablas principales
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('Usuario', 'Jornada', 'Actividad', 'Auditoria')
ORDER BY table_name;

-- 2. Verificar si existe la función obtener_estadisticas_empleado
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name = 'obtener_estadisticas_empleado';

-- 3. Verificar triggers existentes
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    trigger_schema
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- 4. Verificar si existe la extensión pg_cron (si aplica)
SELECT extname 
FROM pg_extension 
WHERE extname = 'pg_cron';

-- 5. Verificar estructura de la tabla Usuario
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'Usuario' 
ORDER BY ordinal_position;

-- Verificar estructura de la tabla Jornada  
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'Jornada' 
ORDER BY ordinal_position;

-- Verificar estructura de la tabla Actividad
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'Actividad' 
ORDER BY ordinal_position;

-- Verificar estructura de la tabla Comentario
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'Comentario' 
ORDER BY ordinal_position;

-- Verificar que no existen columnas obsoletas
SELECT table_name, column_name 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND column_name IN ('existe', 'activo', 'habilitado', 'enabled', 'active');
