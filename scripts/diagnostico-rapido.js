#!/usr/bin/env node

/**
 * Script de diagnóstico rápido para el error de la columna 'existe'
 * Ejecutar con: node scripts/diagnostico-rapido.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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

console.log('\n✅ Diagnóstico completado');
