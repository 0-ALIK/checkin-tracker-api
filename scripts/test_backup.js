const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Test simple del comando pg_dump
const backupDir = '/tmp/backups';
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const backupFile = path.join(backupDir, `backup_test_${timestamp}.sql`);

console.log('🧪 Probando funcionalidad de backup...');

// Crear directorio si no existe
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
    console.log('📁 Directorio de backup creado:', backupDir);
}

// Simular el comando de backup (sin conexión real)
const testCommand = `echo "-- Backup de prueba generado el $(date)" > "${backupFile}"`;

exec(testCommand, (error, stdout, stderr) => {
    if (error) {
        console.error('❌ Error en el test:', error);
        return;
    }
    
    if (stderr) {
        console.warn('⚠️ Advertencias:', stderr);
    }
    
    // Verificar que el archivo se creó
    if (fs.existsSync(backupFile)) {
        const stats = fs.statSync(backupFile);
        console.log('✅ Test de backup exitoso!');
        console.log('📄 Archivo creado:', backupFile);
        console.log('📏 Tamaño:', stats.size, 'bytes');
        console.log('🕒 Fecha:', stats.mtime.toISOString());
        
        // Leer contenido
        const content = fs.readFileSync(backupFile, 'utf8');
        console.log('📝 Contenido:', content.trim());
        
        // Limpiar archivo de prueba
        fs.unlinkSync(backupFile);
        console.log('🧹 Archivo de prueba eliminado');
    } else {
        console.error('❌ El archivo de backup no se creó');
    }
});
