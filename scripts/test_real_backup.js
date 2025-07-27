const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Configuración similar a nuestro servicio
const isWindows = os.platform() === 'win32';
const backupDir = isWindows ? 'C:\\temp\\backups' : '/tmp/backups';
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const backupFile = path.resolve(backupDir, `backup_${timestamp}.dump`); // Usar path.resolve para ruta absoluta

// Variables de entorno de PostgreSQL
const env = {
    ...process.env,
    PGPASSWORD: 'postgres'
};

console.log('🧪 Probando backup real de PostgreSQL...');
console.log('💻 Sistema operativo:', isWindows ? 'Windows' : 'Unix/Linux');
console.log('📁 Directorio de backup:', path.resolve(backupDir)); // Mostrar ruta absoluta
console.log('📄 Archivo objetivo:', backupFile); // Ya es ruta absoluta

// Función para verificar conexión PostgreSQL
async function verificarConexionPG() {
    console.log('\n🔍 Verificando conexión a PostgreSQL...');
    
    return new Promise((resolve, reject) => {
        const testCommand = isWindows ? 
            'pg_isready -h localhost -p 5432 -U postgres' :
            'pg_isready -h localhost -p 5432 -U postgres';
        
        exec(testCommand, { env }, (error, stdout, stderr) => {
            if (error) {
                console.error('❌ PostgreSQL no está disponible:', error.message);
                reject(error);
                return;
            }
            
            console.log('✅ PostgreSQL está disponible');
            if (stdout) console.log('📋 Estado:', stdout.trim());
            resolve(true);
        });
    });
}

// Función para listar bases de datos
async function listarBasesDeatos() {
    console.log('\n📋 Listando bases de datos disponibles...');
    
    return new Promise((resolve, reject) => {
        const listCommand = 'psql -h localhost -U postgres -l';
        
        exec(listCommand, { env }, (error, stdout, stderr) => {
            if (error) {
                console.warn('⚠️ No se pudo listar bases de datos:', error.message);
                resolve(false);
                return;
            }
            
            console.log('📋 Bases de datos disponibles:');
            console.log(stdout);
            resolve(true);
        });
    });
}

// Crear directorio si no existe
try {
    const absoluteBackupDir = path.resolve(backupDir);
    if (!fs.existsSync(absoluteBackupDir)) {
        fs.mkdirSync(absoluteBackupDir, { recursive: true });
        console.log('📁 Directorio de backup creado:', absoluteBackupDir);
    } else {
        console.log('📁 Directorio de backup existe:', absoluteBackupDir);
    }
} catch (error) {
    console.error('❌ Error creando directorio:', error.message);
    process.exit(1);
}

// Función principal de backup
async function ejecutarBackup() {
    try {
        // Verificar conexión PostgreSQL
        await verificarConexionPG();
        
        // Listar bases de datos
        await listarBasesDeatos();
        
        console.log('\n🚀 Iniciando proceso de backup...');
        console.log('🎯 Ruta completa del archivo:', backupFile);
        
        // Construir comando dependiendo del SO
        let command;
        
        if (isWindows) {
            // Opción simplificada: comando directo sin privilegios elevados
            const pgDumpCommand = `pg_dump -h localhost -U postgres -d db_checking -Fc -Z 9 -f "${backupFile}"`;
            command = pgDumpCommand;
            
            console.log('🔧 Ejecutando comando directo en Windows...');
        } else {
            // Para Linux/Unix: usar sudo
            command = `sudo pg_dump -h localhost -U postgres -d db_checking -Fc -Z 9 -f "${backupFile}"`;
            console.log('🔐 Ejecutando con sudo en Linux...');
        }
        
        console.log('📝 Comando:', command);
        
        // Configurar opciones de ejecución
        const execOptions = {
            env,
            timeout: 300000, // 5 minutos
            maxBuffer: 1024 * 1024 * 10, // 10MB buffer
            cwd: process.cwd(), // Directorio actual
        };
        
        // Ejecutar comando con promesa para mejor manejo
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            
            exec(command, execOptions, (error, stdout, stderr) => {
                const duration = Date.now() - startTime;
                
                console.log(`\n⏱️ Tiempo de ejecución: ${duration}ms`);
                
                if (error) {
                    console.error('❌ Error ejecutando comando:', error.message);
                    console.error('📋 Código de error:', error.code);
                    console.error('📋 Señal:', error.signal);
                    
                    // Información adicional del error
                    if (error.stack) {
                        console.error('📋 Stack trace:', error.stack);
                    }
                    
                    reject(error);
                    return;
                }
                
                if (stderr) {
                    console.warn('⚠️ Stderr:', stderr);
                }
                
                if (stdout) {
                    console.log('📄 Stdout:', stdout);
                }
                
                // Verificar que el archivo se creó
                try {
                    if (fs.existsSync(backupFile)) {
                        const stats = fs.statSync(backupFile);
                        console.log('\n✅ Backup completado exitosamente!');
                        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                        console.log('📄 Archivo creado:', backupFile);
                        console.log('📁 Directorio:', path.dirname(backupFile));
                        console.log('📝 Nombre del archivo:', path.basename(backupFile));
                        console.log('📏 Tamaño:', formatBytes(stats.size));
                        console.log('🕒 Fecha creación:', stats.birthtime.toLocaleString());
                        console.log('🕒 Fecha modificación:', stats.mtime.toLocaleString());
                        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                        
                        // Mostrar comando para acceder al archivo
                        if (isWindows) {
                            console.log('🖱️  Para abrir la carpeta: explorer "' + path.dirname(backupFile) + '"');
                            console.log('📋 Para copiar la ruta: echo "' + backupFile + '" | clip');
                        } else {
                            console.log('🖱️  Para abrir la carpeta: nautilus "' + path.dirname(backupFile) + '"');
                            console.log('📋 Para copiar la ruta: echo "' + backupFile + '" | xclip -selection clipboard');
                        }
                        
                        // Verificar contenido del archivo
                        if (stats.size < 100) {
                            console.warn('\n⚠️ El archivo de backup es muy pequeño, verificando contenido...');
                            try {
                                const content = fs.readFileSync(backupFile, 'utf8');
                                console.log('📄 Contenido del archivo:', content.substring(0, 200) + '...');
                            } catch (readError) {
                                console.warn('⚠️ No se pudo leer el archivo como texto:', readError.message);
                                console.log('💡 Esto es normal para archivos comprimidos (.dump)');
                            }
                        } else {
                            console.log('\n🎉 Backup parece correcto!');
                        }
                        
                        console.log('\n🧹 Manteniendo archivo para inspección...');
                        console.log('💡 Para eliminar manualmente:');
                        if (isWindows) {
                            console.log('   del "' + backupFile + '"');
                        } else {
                            console.log('   rm "' + backupFile + '"');
                        }
                        
                        resolve(true);
                    } else {
                        console.error('❌ El archivo de backup no se creó en la ruta esperada');
                        console.error('🎯 Ruta esperada:', backupFile);
                        
                        // Buscar archivos en el directorio
                        try {
                            const absoluteBackupDir = path.resolve(backupDir);
                            const files = fs.readdirSync(absoluteBackupDir);
                            console.log('📁 Archivos en directorio de backup:', files);
                            
                            // Mostrar rutas completas de todos los archivos
                            if (files.length > 0) {
                                console.log('📋 Rutas completas encontradas:');
                                files.forEach(file => {
                                    const fullPath = path.resolve(absoluteBackupDir, file);
                                    console.log('   ' + fullPath);
                                });
                            }
                        } catch (dirError) {
                            console.error('❌ Error leyendo directorio:', dirError.message);
                        }
                        
                        reject(new Error('Archivo de backup no encontrado'));
                    }
                } catch (fileError) {
                    console.error('❌ Error verificando archivo:', fileError.message);
                    reject(fileError);
                }
            });
        });
        
    } catch (error) {
        console.error('❌ Error en proceso de backup:', error.message);
        
        // Sugerencias específicas por SO
        if (isWindows) {
            console.log('\n💡 Sugerencias para Windows:');
            console.log('1. Verifica que PostgreSQL esté ejecutándose');
            console.log('2. Verifica que la base de datos "db_checking" existe');
            console.log('3. Verifica credenciales (usuario: postgres, password: postgres)');
            console.log('4. Ejecuta: pg_isready -h localhost -p 5432');
            console.log('5. Ejecuta: psql -h localhost -U postgres -l');
        } else {
            console.log('\n💡 Sugerencias para Linux:');
            console.log('1. Verifica que PostgreSQL esté ejecutándose: sudo systemctl status postgresql');
            console.log('2. Verifica que tienes permisos sudo');
            console.log('3. O ejecuta sin sudo si tienes acceso directo');
        }
        
        throw error;
    }
}

// Función auxiliar para formatear bytes
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Manejar señales de interrupción
process.on('SIGINT', () => {
    console.log('\n🛑 Proceso interrumpido por el usuario');
    process.exit(0);
});

// Ejecutar el script principal
(async () => {
    try {
        await ejecutarBackup();
        console.log('\n🎉 Script completado exitosamente');
    } catch (error) {
        console.error('\n❌ Script falló:', error.message);
        process.exit(1);
    }
})();
