const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuración similar a nuestro servicio
const backupDir = '/tmp/backups';
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const backupFile = path.join(backupDir, `backup_${timestamp}.dump`);

// Variables de entorno de PostgreSQL
const env = {
    ...process.env,
    PGPASSWORD: 'postgres'
};

console.log('🧪 Probando backup real de PostgreSQL...');

// Crear directorio si no existe
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
    console.log('📁 Directorio de backup creado:', backupDir);
}

// Comando real de backup
const command = `pg_dump -h localhost -U postgres -d checkin -Fc -Z 9 -f "${backupFile}"`;

console.log('📝 Ejecutando:', command);

exec(command, { env }, (error, stdout, stderr) => {
    if (error) {
        console.error('❌ Error en el backup:', error.message);
        console.error('📋 Comando:', command);
        return;
    }
    
    if (stderr) {
        console.warn('⚠️ Advertencias:', stderr);
    }
    
    // Verificar que el archivo se creó
    if (fs.existsSync(backupFile)) {
        const stats = fs.statSync(backupFile);
        console.log('✅ Backup real exitoso!');
        console.log('📄 Archivo:', backupFile);
        console.log('📏 Tamaño:', stats.size, 'bytes');
        console.log('🕒 Fecha:', stats.mtime.toISOString());
        
        // Si el archivo es muy pequeño, podría ser un error
        if (stats.size < 100) {
            console.warn('⚠️ El archivo de backup es muy pequeño, podría haber un problema');
        } else {
            console.log('🎉 Backup parece correcto!');
        }
        
        console.log('🧹 Eliminando archivo de prueba...');
        fs.unlinkSync(backupFile);
        console.log('✅ Limpieza completada');
    } else {
        console.error('❌ El archivo de backup no se creó');
    }
});
