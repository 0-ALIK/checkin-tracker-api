# 🔧 Guía para resolver el error de la columna 'existe'

## ❌ Problema reportado
El compañero recibe este error al hacer login:
```
The column `existe` does not exist in the current database.
```

## 🔍 Diagnóstico
✅ **CONFIRMADO**: La estructura actual de la base de datos está correcta y NO contiene ninguna columna `existe`.

El error indica que:
1. **Código desactualizado**: El compañero tiene una versión antigua del código que todavía referencia esta columna
2. **Cliente Prisma desactualizado**: El cliente generado no está sincronizado con el schema actual
3. **Cache de dependencias**: Los módulos node_modules pueden estar desactualizados

## 🚀 Soluciones a aplicar (SEGUIR EN ORDEN)

### 🔄 PASO 1: Actualizar código
```bash
git status
git stash  # Si hay cambios locales
git pull origin main
git stash pop  # Si se hizo stash
```

### 🗂️ PASO 2: Limpiar cache y dependencias
```bash
rm -rf node_modules
rm package-lock.json  # o pnpm-lock.yaml si usas pnpm
npm install  # o pnpm install
```

### 🎯 PASO 3: Regenerar cliente de Prisma
```bash
npx prisma generate
```

### 🛢️ PASO 4: Verificar base de datos
```bash
npx prisma migrate status
npx prisma migrate deploy
```

### ✅ PASO 5: Ejecutar script de verificación
```bash
node scripts/verificar-estructura.js
```

### 🔄 PASO 6: Reiniciar servidor de desarrollo
```bash
npm run start:dev  # o el comando que uses
```

## 🆘 Si el problema persiste

### Opción A: Verificar manualmente el código
Buscar referencias a la columna problemática:
```bash
grep -r "existe" src/ --include="*.ts"
findstr /S /I "existe" src\*.ts  # En Windows
```

### Opción B: Resetear la base de datos completa
⚠️ **CUIDADO: Esto borrará todos los datos**
```bash
npx prisma migrate reset --force
npm run seed  # o el comando para ejecutar el seed
```

### Opción C: Verificar versiones
```bash
npx prisma --version
node --version
npm --version
```

## 📊 Estructura actual VERIFICADA ✅

### Tabla Usuario (8 columnas)
- ✅ id (SERIAL PRIMARY KEY)
- ✅ nombre (TEXT NOT NULL)
- ✅ apellido (TEXT NOT NULL)
- ✅ email (TEXT UNIQUE NOT NULL)
- ✅ contraseña (TEXT NOT NULL)
- ✅ id_area (INTEGER NOT NULL)
- ✅ id_rol (INTEGER NOT NULL)
- ✅ id_supervisor (INTEGER NULLABLE)

### Tabla Jornada (8 columnas)
- ✅ id_jornada (SERIAL PRIMARY KEY)
- ✅ fecha (TIMESTAMP NOT NULL)
- ✅ hora_checkin (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
- ✅ hora_checkout (TIMESTAMP NULLABLE)
- ✅ aprobado (BOOLEAN NOT NULL)
- ✅ id_usuario (INTEGER NOT NULL)
- ✅ id_supervisor (INTEGER NULLABLE)
- ✅ observaciones (TEXT NULLABLE)

### Tabla Actividad (8 columnas) - **INCLUYE NUEVAS FUNCIONALIDADES**
- ✅ id (SERIAL PRIMARY KEY)
- ✅ id_jornada (INTEGER NOT NULL)
- ✅ tarea (TEXT NOT NULL)
- ✅ meta (TEXT NOT NULL)
- ✅ id_estado (INTEGER NOT NULL)
- ✅ observaciones (TEXT NULLABLE)
- ✅ es_arrastrada (BOOLEAN DEFAULT FALSE) 🆕
- ✅ id_actividad_origen (INTEGER NULLABLE) 🆕

### Tabla Comentario (5 columnas) - **CORREGIDA**
- ✅ id (SERIAL PRIMARY KEY)
- ✅ id_actividad (INTEGER NOT NULL)
- ✅ id_usuario (INTEGER NOT NULL) ⚠️ **Ahora usa id_usuario, no id_supervisor**
- ✅ comentario (TEXT NOT NULL)
- ✅ fecha_comentario (TIMESTAMP NOT NULL)

## ✅ Estado de migraciones CONFIRMADO
1. ✅ `20250622072235_init` - Estructura inicial aplicada
2. ✅ `20250622082411_dates_update` - Ajustes de fechas aplicados
3. ✅ `20250622082751_observaciones_jornada` - Observaciones aplicadas
4. ✅ `20250720000000_add_sprint_features` - Funcionalidad de tareas aplicada

## 🎯 Puntos clave verificados
- ❌ **NO existe columna 'existe' en ninguna tabla**
- ✅ **Todas las nuevas columnas están presentes**
- ✅ **La consulta de login funciona correctamente**
- ✅ **Todas las migraciones están aplicadas**
- ✅ **El seed.sql está actualizado**

## 📞 Contacto de soporte
Si después de seguir todos los pasos el problema persiste:
1. Compartir el output del comando `npx prisma migrate status`
2. Compartir el output del script `node scripts/verificar-estructura.js`
3. Confirmar la versión de Node.js y Prisma siendo usada
