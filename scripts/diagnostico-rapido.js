#!/usr/bin/env node

/**
 * Script de diagnóstico rápido para el error de la columna 'existe'
 * Ejecutar con: node scripts/diagnostico-rapido.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('http'); // Usamos http para localhost

console.log('🔍 DIAGNÓSTICO RÁPIDO - Error columna "existe"\n');

function ejecutarComando(comando, descripcion) {
  try {
    console.log(`📋 ${descripcion}...`);
    const resultado = execSync(comando, { encoding: 'utf8', cwd: process.cwd() });
    console.log(`✅ ${descripcion} - OK`);
    return resultado;
  } catch (error) {
    console.log(`❌ ${descripcion} - ERROR: ${error.message}`);
    return null;
  }
}

function verificarArchivo(ruta, descripcion) {
  if (fs.existsSync(ruta)) {
    console.log(`✅ ${descripcion} - Existe`);
    return true;
  } else {
    console.log(`❌ ${descripcion} - No encontrado`);
    return false;
  }
}

async function probarLogin() {
  return new Promise((resolve) => {
    console.log('🔐 Probando login con credenciales reales...');
    
    const postData = JSON.stringify({
      email: 'pedro.silva@pfdb.com',
      password: 'password123'
    });

    const options = {
      hostname: 'localhost',
      port: 8000,
      path: '/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 5000
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          if (res.statusCode === 200 || res.statusCode === 201) {
            const response = JSON.parse(data);
            if (response.access_token) {
              console.log('✅ Login exitoso - Token recibido');
              console.log(`   Usuario: ${response.user?.nombre} ${response.user?.apellido}`);
              console.log(`   Email: ${response.user?.email}`);
              resolve({ success: true, token: response.access_token, user: response.user });
            } else {
              console.log('⚠️  Login completado pero sin token');
              resolve({ success: false, error: 'No token received' });
            }
          } else {
            const error = JSON.parse(data);
            console.log(`❌ Login falló - ${res.statusCode}: ${error.message || 'Error desconocido'}`);
            resolve({ success: false, error: error.message, statusCode: res.statusCode });
          }
        } catch (parseError) {
          console.log(`❌ Error parseando respuesta: ${parseError.message}`);
          resolve({ success: false, error: 'Parse error', data });
        }
      });
    });

    req.on('error', (error) => {
      if (error.code === 'ECONNREFUSED') {
        console.log('❌ No se pudo conectar al servidor (¿está corriendo en puerto 8000?)');
      } else {
        console.log(`❌ Error de conexión: ${error.message}`);
      }
      resolve({ success: false, error: error.message });
    });

    req.on('timeout', () => {
      console.log('❌ Timeout - El servidor no respondió en 5 segundos');
      req.destroy();
      resolve({ success: false, error: 'Timeout' });
    });

    req.write(postData);
    req.end();
  });
}

async function probarEndpointGet(token) {
  return new Promise((resolve) => {
    console.log('📊 Probando endpoint GET /usuarios...');
    
    const options = {
      hostname: 'localhost',
      port: 8000,
      path: '/usuarios',
      method: 'GET',
      headers: {
        'Authorization': `${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 5000
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            const response = JSON.parse(data);
            console.log(`✅ GET /usuarios exitoso - ${response.length} usuarios encontrados`);
            resolve({ success: true, count: response.length });
          } else {
            console.log(`❌ GET falló - ${res.statusCode}`);
            resolve({ success: false, statusCode: res.statusCode });
          }
        } catch (parseError) {
          console.log(`❌ Error parseando respuesta GET: ${parseError.message}`);
          resolve({ success: false, error: 'Parse error' });
        }
      });
    });

    req.on('error', (error) => {
      console.log(`❌ Error en GET: ${error.message}`);
      resolve({ success: false, error: error.message });
    });

    req.on('timeout', () => {
      console.log('❌ Timeout en GET');
      req.destroy();
      resolve({ success: false, error: 'Timeout' });
    });

    req.end();
  });
}

// 1. Verificar Git status
console.log('🔄 ESTADO DEL REPOSITORIO');
ejecutarComando('git status --porcelain', 'Verificando cambios locales');
ejecutarComando('git rev-parse HEAD', 'Verificando commit actual');

// 2. Verificar archivos clave
console.log('\n📁 ARCHIVOS CLAVE');
verificarArchivo('prisma/schema.prisma', 'Schema de Prisma');
verificarArchivo('node_modules/@prisma/client', 'Cliente Prisma generado');
verificarArchivo('prisma/migrations', 'Directorio de migraciones');

// 3. Verificar versiones
console.log('\n📦 VERSIONES');
ejecutarComando('node --version', 'Versión de Node.js');
ejecutarComando('npx prisma --version', 'Versión de Prisma');

// 4. Verificar Prisma status
console.log('\n🛢️ ESTADO DE LA BASE DE DATOS');
ejecutarComando('npx prisma migrate status', 'Estado de migraciones');

// 5. Buscar referencias problemáticas
console.log('\n🔍 BUSCANDO REFERENCIAS A "existe"');
try {
  const srcPath = path.join(process.cwd(), 'src');
  if (fs.existsSync(srcPath)) {
    const comando = process.platform === 'win32' 
      ? 'findstr /S /I "existe" src\\*.ts' 
      : 'grep -r "existe" src/ --include="*.ts"';
    
    const resultado = ejecutarComando(comando, 'Buscando "existe" en archivos TypeScript');
    if (!resultado || resultado.trim() === '') {
      console.log('✅ No se encontraron referencias problemáticas a "existe"');
    }
  }
} catch (error) {
  console.log('✅ No se encontraron referencias problemáticas a "existe" (búsqueda completada)');
}

// 6. Recomendaciones
console.log('\n💡 RECOMENDACIONES BASADAS EN EL DIAGNÓSTICO:');
console.log('1. Ejecutar: npm install && npx prisma generate');
console.log('2. Verificar que estás en la rama main: git checkout main && git pull');
console.log('3. Si el problema persiste: rm -rf node_modules && npm install');
console.log('4. Como último recurso: npx prisma migrate reset --force');

console.log('\n📋 Para más detalles, consultar: RESOLVER_ERROR_EXISTE.md');
console.log('🎯 Para verificación completa: node scripts/verificar-estructura.js');

// 7. Pruebas de API en tiempo real
console.log('\n🚀 PRUEBAS DE API EN TIEMPO REAL');
(async () => {
  const loginResult = await probarLogin();
  
  if (loginResult.success && loginResult.token) {
    console.log('🔑 Probando endpoint autenticado...');
    await probarEndpointGet(loginResult.token);
  } else {
    console.log('⚠️  No se puede probar endpoints autenticados sin login exitoso');
  }
  
  console.log('\n✅ Diagnóstico completado');
})();
