#!/usr/bin/env node

/**
 * Script de validación para verificar que la estructura de la base de datos
 * y el código están sincronizados correctamente
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function verificarEstructura() {
  console.log('🔍 Verificando estructura de la base de datos...\n');

  try {
    // Verificar que podemos conectar a la base de datos
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos exitosa');

    // Verificar estructura de Usuario
    console.log('\n📋 Verificando tabla Usuario...');
    const usuarios = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'Usuario' 
      ORDER BY ordinal_position;
    `;
    
    console.log('Columnas encontradas en Usuario:');
    usuarios.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type})`);
    });

    // Verificar que no existe la columna 'existe'
    const columnaExiste = usuarios.find(col => col.column_name === 'existe');
    if (columnaExiste) {
      console.log('❌ ERROR: Se encontró la columna "existe" que no debería existir');
    } else {
      console.log('✅ No se encontró la columna problemática "existe"');
    }

    // Verificar estructura de Actividad (nuevas columnas del sprint)
    console.log('\n📋 Verificando tabla Actividad...');
    const actividades = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'Actividad' 
      ORDER BY ordinal_position;
    `;

    const columnasEsperadas = ['es_arrastrada', 'id_actividad_origen'];
    columnasEsperadas.forEach(columna => {
      const encontrada = actividades.find(col => col.column_name === columna);
      if (encontrada) {
        console.log(`✅ Columna "${columna}" encontrada`);
      } else {
        console.log(`❌ ERROR: Columna "${columna}" no encontrada`);
      }
    });

    // Verificar estructura de Comentario
    console.log('\n📋 Verificando tabla Comentario...');
    const comentarios = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'Comentario' 
      ORDER BY ordinal_position;
    `;

    const tieneIdUsuario = comentarios.find(col => col.column_name === 'id_usuario');
    const tieneIdSupervisor = comentarios.find(col => col.column_name === 'id_supervisor');
    
    if (tieneIdUsuario && !tieneIdSupervisor) {
      console.log('✅ Tabla Comentario usa id_usuario (correcto)');
    } else if (tieneIdSupervisor) {
      console.log('⚠️  ADVERTENCIA: Tabla Comentario todavía usa id_supervisor');
    }

    // Verificar que podemos hacer una consulta básica de login
    console.log('\n🔐 Probando consulta de login...');
    
    try {
      const testUser = await prisma.usuario.findFirst({
        where: { email: { contains: '@' } },
        select: { id: true, email: true, nombre: true }
      });
      
      if (testUser) {
        console.log(`✅ Consulta de usuario exitosa: ${testUser.email}`);
      } else {
        console.log('⚠️  No hay usuarios en la base de datos');
      }
    } catch (error) {
      console.log(`❌ ERROR en consulta de usuario: ${error.message}`);
    }

    // Verificar migraciones aplicadas
    console.log('\n📦 Verificando migraciones...');
    try {
      const migraciones = await prisma.$queryRaw`
        SELECT migration_name, started_at, finished_at 
        FROM _prisma_migrations 
        ORDER BY started_at;
      `;
      
      console.log('Migraciones aplicadas:');
      migraciones.forEach(mig => {
        console.log(`  - ${mig.migration_name}`);
      });
    } catch (error) {
      console.log('⚠️  No se pudo verificar el estado de las migraciones');
    }

    console.log('\n🎉 Verificación completada');

  } catch (error) {
    console.error('❌ Error durante la verificación:', error.message);
    console.error('\n💡 Posibles soluciones:');
    console.error('1. Ejecutar: npx prisma generate');
    console.error('2. Ejecutar: npx prisma migrate deploy');
    console.error('3. Verificar la conexión a la base de datos');
    console.error('4. Ejecutar: git pull origin main');
  } finally {
    await prisma.$disconnect();
  }
}

verificarEstructura();
