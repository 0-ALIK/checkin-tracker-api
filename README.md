# Checkin Tracker API

Esta es la API REST del proyecto Checkin Tracker, construida con Node.js y Prisma.

## Instalación y Configuración

### 1. Instalar pnpm globalmente
```bash
npm install -g pnpm
```

### 2. Instalar dependencias
```bash
pnpm install
```

### 3. Configurar variables de entorno
Configura las variables de entorno especificadas en el archivo `env.config.ts` en tu archivo `.env`.

### 4. Configurar base de datos
Asegúrate de que tu base de datos esté corriendo.

### 5. Ejecutar migraciones
```bash
pnpx prisma migrate reset
```

### 6. Ejecutar la API
```bash
pnpm start
```

La API estará disponible en el puerto configurado en tus variables de entorno.