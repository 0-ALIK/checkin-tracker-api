import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync, mkdirSync, statSync } from 'fs';
import { join } from 'path';
import { EmailService } from './email.service';
import { AuditoriaService } from './auditoria.service';

const execAsync = promisify(exec);

export interface BackupResult {
  success: boolean;
  mensaje: string;
  archivo?: string;
  tamaño?: string;
  duracion?: number;
  error?: string;
}

@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);
  private readonly backupDir = process.env.BACKUP_DIR || './backups';
  
  // Configuración de la base de datos desde variables de entorno
  private readonly dbConfig = {
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || '5432',
    database: process.env.DATABASE_NAME || 'checkin_tracker',
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
  };

  constructor(
    private readonly emailService: EmailService,
    private readonly auditoriaService: AuditoriaService,
  ) {
    this.ensureBackupDirectory();
  }

  /**
   * Ejecuta un backup completo de la base de datos
   */
  async ejecutarBackup(): Promise<BackupResult> {
    const inicioTiempo = Date.now();
    this.logger.log('🗄️ Iniciando backup de la base de datos...');

    try {
      // Generar nombre del archivo con timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const nombreArchivo = `backup_${this.dbConfig.database}_${timestamp}.sql`;
      const rutaCompleta = join(this.backupDir, nombreArchivo);

      // Comando pg_dump
      const comando = this.construirComandoPgDump(rutaCompleta);
      
      this.logger.log(`📤 Ejecutando: ${comando.replace(this.dbConfig.password, '***')}`);

      // Ejecutar backup
      const { stdout, stderr } = await execAsync(comando, {
        env: {
          ...process.env,
          PGPASSWORD: this.dbConfig.password,
        },
        timeout: 300000, // 5 minutos timeout
      });

      if (stderr && !stderr.includes('pg_dump:')) {
        throw new Error(`Error en pg_dump: ${stderr}`);
      }

      // Verificar que el archivo se creó correctamente
      if (!existsSync(rutaCompleta)) {
        throw new Error('El archivo de backup no se generó correctamente');
      }

      // Obtener información del archivo
      const stats = statSync(rutaCompleta);
      const tamaño = this.formatearTamaño(stats.size);
      const duracion = Date.now() - inicioTiempo;

      const resultado: BackupResult = {
        success: true,
        mensaje: 'Backup completado exitosamente',
        archivo: nombreArchivo,
        tamaño,
        duracion,
      };

      this.logger.log(`✅ Backup completado: ${nombreArchivo} (${tamaño}) en ${duracion}ms`);

      // Registrar en auditoría
      await this.auditoriaService.registrarAccion(
        'BACKUP_CREADO',
        `Backup automático creado exitosamente. Archivo: ${nombreArchivo}, Tamaño: ${tamaño}, Duración: ${duracion}ms`
      );

      // Enviar email de éxito
      await this.enviarEmailBackup(resultado);

      // Limpiar backups antiguos
      await this.limpiarBackupsAntiguos();

      return resultado;

    } catch (error) {
      const duracion = Date.now() - inicioTiempo;
      const resultado: BackupResult = {
        success: false,
        mensaje: 'Error al crear backup',
        error: error.message,
        duracion,
      };

      this.logger.error(`❌ Error en backup: ${error.message}`, error.stack);

      // Registrar error en auditoría
      await this.auditoriaService.registrarAccion(
        'BACKUP_ERROR',
        `Error al crear backup automático: ${error.message}. Duración: ${duracion}ms`
      );

      // Enviar email de error
      await this.enviarEmailBackup(resultado);

      return resultado;
    }
  }

  /**
   * Construye el comando pg_dump
   */
  private construirComandoPgDump(rutaArchivo: string): string {
    return `pg_dump ` +
      `--host=${this.dbConfig.host} ` +
      `--port=${this.dbConfig.port} ` +
      `--username=${this.dbConfig.username} ` +
      `--dbname=${this.dbConfig.database} ` +
      `--no-password ` +
      `--format=custom ` +
      `--compress=9 ` +
      `--verbose ` +
      `--file="${rutaArchivo}"`;
  }

  /**
   * Envía email con el resultado del backup
   */
  private async enviarEmailBackup(resultado: BackupResult): Promise<void> {
    try {
      // Lista de emails de administradores (podrías obtenerla de la base de datos)
      const emailsAdmin = process.env.ADMIN_EMAILS?.split(',') || ['admin@empresa.com'];

      const asunto = resultado.success 
        ? '✅ Backup de Base de Datos - Exitoso'
        : '❌ Backup de Base de Datos - Error';

      const contenido = resultado.success 
        ? this.generarEmailExito(resultado)
        : this.generarEmailError(resultado);

      for (const email of emailsAdmin) {
        await this.emailService.sendEmail(
          email.trim(),
          asunto,
          contenido
        );
      }

      this.logger.log(`📧 Emails de notificación enviados a ${emailsAdmin.length} administradores`);

    } catch (error) {
      this.logger.error('Error enviando emails de notificación del backup:', error);
    }
  }

  /**
   * Genera el contenido del email para backup exitoso
   */
  private generarEmailExito(resultado: BackupResult): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #10b981; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">✅ Backup Completado Exitosamente</h1>
        </div>
        
        <div style="padding: 20px; background: #f9fafb;">
          <h2 style="color: #374151;">Detalles del Backup</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background: #e5e7eb;">
              <td style="padding: 10px; border: 1px solid #d1d5db; font-weight: bold;">Archivo:</td>
              <td style="padding: 10px; border: 1px solid #d1d5db;">${resultado.archivo}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #d1d5db; font-weight: bold;">Tamaño:</td>
              <td style="padding: 10px; border: 1px solid #d1d5db;">${resultado.tamaño}</td>
            </tr>
            <tr style="background: #e5e7eb;">
              <td style="padding: 10px; border: 1px solid #d1d5db; font-weight: bold;">Duración:</td>
              <td style="padding: 10px; border: 1px solid #d1d5db;">${resultado.duracion}ms</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #d1d5db; font-weight: bold;">Fecha:</td>
              <td style="padding: 10px; border: 1px solid #d1d5db;">${new Date().toLocaleString('es-ES')}</td>
            </tr>
            <tr style="background: #e5e7eb;">
              <td style="padding: 10px; border: 1px solid #d1d5db; font-weight: bold;">Base de Datos:</td>
              <td style="padding: 10px; border: 1px solid #d1d5db;">${this.dbConfig.database}</td>
            </tr>
          </table>

          <div style="background: #dcfce7; border: 1px solid #bbf7d0; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; color: #166534;">
              <strong>✅ Estado:</strong> ${resultado.mensaje}
            </p>
          </div>

          <p style="color: #6b7280; font-size: 14px;">
            Este backup se ha almacenado de forma segura y está listo para restauración en caso de necesidad.
          </p>
        </div>
        
        <div style="background: #374151; color: white; padding: 15px; text-align: center; font-size: 12px;">
          Sistema de Check-In/Check-Out - Backup Automático
        </div>
      </div>
    `;
  }

  /**
   * Genera el contenido del email para backup con error
   */
  private generarEmailError(resultado: BackupResult): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #ef4444; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">❌ Error en Backup de Base de Datos</h1>
        </div>
        
        <div style="padding: 20px; background: #f9fafb;">
          <h2 style="color: #374151;">Detalles del Error</h2>
          
          <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; color: #dc2626;">
              <strong>❌ Error:</strong> ${resultado.error}
            </p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background: #e5e7eb;">
              <td style="padding: 10px; border: 1px solid #d1d5db; font-weight: bold;">Fecha del Intento:</td>
              <td style="padding: 10px; border: 1px solid #d1d5db;">${new Date().toLocaleString('es-ES')}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #d1d5db; font-weight: bold;">Duración:</td>
              <td style="padding: 10px; border: 1px solid #d1d5db;">${resultado.duracion}ms</td>
            </tr>
            <tr style="background: #e5e7eb;">
              <td style="padding: 10px; border: 1px solid #d1d5db; font-weight: bold;">Base de Datos:</td>
              <td style="padding: 10px; border: 1px solid #d1d5db;">${this.dbConfig.database}</td>
            </tr>
          </table>

          <div style="background: #fef3c7; border: 1px solid #fde68a; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e;">
              <strong>⚠️ Acción Requerida:</strong> Es necesario revisar la configuración del backup y resolver el problema lo antes posible para garantizar la integridad de los datos.
            </p>
          </div>

          <h3 style="color: #374151;">Posibles Soluciones:</h3>
          <ul style="color: #6b7280;">
            <li>Verificar que PostgreSQL esté funcionando correctamente</li>
            <li>Comprobar las credenciales de la base de datos</li>
            <li>Verificar el espacio disponible en disco</li>
            <li>Revisar los permisos del directorio de backup</li>
            <li>Comprobar la conectividad de red</li>
          </ul>
        </div>
        
        <div style="background: #374151; color: white; padding: 15px; text-align: center; font-size: 12px;">
          Sistema de Check-In/Check-Out - Backup Automático
        </div>
      </div>
    `;
  }

  /**
   * Asegura que el directorio de backup existe
   */
  private ensureBackupDirectory(): void {
    if (!existsSync(this.backupDir)) {
      mkdirSync(this.backupDir, { recursive: true });
      this.logger.log(`📁 Directorio de backup creado: ${this.backupDir}`);
    }
  }

  /**
   * Limpia backups antiguos (mantiene solo los últimos 7 días)
   */
  private async limpiarBackupsAntiguos(): Promise<void> {
    try {
      const diasAMantener = 7;
      const comando = `find "${this.backupDir}" -name "backup_*.sql" -type f -mtime +${diasAMantener} -delete`;
      
      await execAsync(comando);
      this.logger.log(`🧹 Backups antiguos eliminados (más de ${diasAMantener} días)`);
      
    } catch (error) {
      this.logger.warn('Error limpiando backups antiguos:', error.message);
    }
  }

  /**
   * Formatea el tamaño del archivo de forma legible
   */
  private formatearTamaño(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Obtiene información sobre los backups existentes
   */
  async obtenerInfoBackups(): Promise<any[]> {
    try {
      const comando = `find "${this.backupDir}" -name "backup_*.sql" -type f -exec ls -la {} +`;
      const { stdout } = await execAsync(comando);
      
      const archivos = stdout.trim().split('\n').filter(line => line.length > 0);
      return archivos.map(line => {
        const partes = line.split(/\s+/);
        return {
          permisos: partes[0],
          tamaño: this.formatearTamaño(parseInt(partes[4]) || 0),
          fecha: `${partes[5]} ${partes[6]} ${partes[7]}`,
          archivo: partes[8]?.split('/').pop() || '',
        };
      });
    } catch (error) {
      this.logger.error('Error obteniendo información de backups:', error);
      return [];
    }
  }
}
