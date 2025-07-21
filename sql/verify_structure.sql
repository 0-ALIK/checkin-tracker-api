-- Script de verificación de la estructura de la base de datos
-- Ejecutar este script para verificar que todas las tablas y columnas están correctas

-- Verificar estructura de la tabla Usuario
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
