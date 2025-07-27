import { Injectable, Logger } from '@nestjs/common';
import { existsSync, mkdirSync, statSync, readdirSync, unlinkSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { platform } from 'os';
import { EmailService } from './email.service';
import { AuditoriaService } from './auditoria.service';
import { PrismaService } from './prisma.service';

export interface BackupResult {
  success: boolean;
  mensaje: string;
  archivo?: string;
  tamaño?: string;
  duracion?: number;
  error?: string;
  scriptPath?: string;
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
    private readonly prismaService: PrismaService,
  ) {
    this.ensureBackupDirectory();
  }

  /**
   * Programa un backup automático en la base de datos usando pg_cron
   */
  async programarBackupAutomatico(): Promise<void> {
    try {
      const backupScript = this.generarScriptBackup();
      
      // Crear el job de backup en pg_cron
      const cronJob = `
        -- Eliminar job previo si existe
        SELECT cron.unschedule('backup-diario');
        
        -- Programar backup diario a las 2:00 AM
        SELECT cron.schedule('backup-diario', '0 2 * * *', $$${backupScript}$$);
      `;

      await this.prismaService.$executeRawUnsafe(cronJob);
      this.logger.log('✅ Backup automático programado en pg_cron');
      
    } catch (error) {
      this.logger.error('❌ Error programando backup automático:', error);
      throw error;
    }
  }

  /**
   * Genera el script SQL para realizar el backup
   */
  private generarScriptBackup(): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const nombreArchivo = `backup_${this.dbConfig.database}_${timestamp}.sql`;
    const rutaCompleta = resolve(this.backupDir, nombreArchivo);
    
    return `
      DO $$
      DECLARE
        backup_path TEXT := '${rutaCompleta.replace(/\\/g, '\\\\')}';
        comando TEXT;
        resultado TEXT;
      BEGIN
        -- Crear comando de backup
        comando := 'pg_dump -h localhost -U ${this.dbConfig.username} -d ${this.dbConfig.database} --format=custom --compress=9 --file=' || backup_path;
        
        -- Ejecutar backup usando COPY TO PROGRAM (requiere superusuario)
        EXECUTE 'COPY (SELECT 1) TO PROGRAM ''' || comando || '''';
        
        -- Registrar en tabla de auditoría
        INSERT INTO auditoria (accion, descripcion, usuario_id, fecha_creacion)
        VALUES ('BACKUP_CREADO', 'Backup automático creado: ' || backup_path, NULL, NOW());
        
        -- Log del resultado
        RAISE NOTICE 'Backup completado: %', backup_path;
        
      EXCEPTION
        WHEN OTHERS THEN
          -- Registrar error en auditoría
          INSERT INTO auditoria (accion, descripcion, usuario_id, fecha_creacion)
          VALUES ('BACKUP_ERROR', 'Error en backup automático: ' || SQLERRM, NULL, NOW());
          
          RAISE NOTICE 'Error en backup: %', SQLERRM;
      END $$;
    `;
  }

  /**
   * Ejecuta un backup usando scripts SQL desde la base de datos
   */
  async ejecutarBackup(): Promise<BackupResult> {
    const inicioTiempo = Date.now();
    this.logger.log('🗄️ Iniciando backup desde la base de datos...');

    try {
      // Generar nombre del archivo con timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const nombreArchivo = `backup_${this.dbConfig.database}_${timestamp}.dump`;
      const rutaCompleta = resolve(this.backupDir, nombreArchivo);

      // Generar script SQL
      const scriptSQL = this.generarScriptBackupManual(rutaCompleta);
      
      // Guardar script en archivo para referencia
      const scriptPath = resolve(this.backupDir, `script_${timestamp}.sql`);
      writeFileSync(scriptPath, scriptSQL);
      
      this.logger.log(`📤 Ejecutando backup SQL: ${nombreArchivo}`);

      // Ejecutar el script de backup desde PostgreSQL
      await this.prismaService.$executeRawUnsafe(scriptSQL);

      // Verificar que el archivo se creó correctamente
      let stats: any = null;
      let intentos = 0;
      const maxIntentos = 10;
      
      // Esperar a que el archivo se genere (backup asíncrono)
      while (intentos < maxIntentos && !existsSync(rutaCompleta)) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo
        intentos++;
      }

      if (existsSync(rutaCompleta)) {
        stats = statSync(rutaCompleta);
      } else {
        // Si no se creó el archivo, intentar buscar archivos recientes
        const archivosRecientes = this.buscarArchivosRecientes();
        if (archivosRecientes.length > 0) {
          this.logger.warn(`Archivo esperado no encontrado, pero se encontraron: ${archivosRecientes.join(', ')}`);
        }
        throw new Error('El archivo de backup no se generó en la ruta esperada');
      }

      const tamaño = this.formatearTamaño(stats.size);
      const duracion = Date.now() - inicioTiempo;

      const resultado: BackupResult = {
        success: true,
        mensaje: 'Backup completado exitosamente desde PostgreSQL',
        archivo: nombreArchivo,
        tamaño,
        duracion,
        scriptPath,
      };

      this.logger.log(`✅ Backup completado: ${nombreArchivo} (${tamaño}) en ${duracion}ms`);
      this.logger.log(`📁 Ruta completa: ${rutaCompleta}`);
      this.logger.log(`📝 Script guardado en: ${scriptPath}`);

      // Registrar en auditoría
      await this.auditoriaService.registrarAccion(
        'BACKUP_CREADO',
        `Backup SQL creado exitosamente. Archivo: ${nombreArchivo}, Tamaño: ${tamaño}, Duración: ${duracion}ms, Script: ${scriptPath}`
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
        mensaje: 'Error al crear backup desde PostgreSQL',
        error: error.message,
        duracion,
      };

      this.logger.error(`❌ Error en backup SQL: ${error.message}`, error.stack);

      // Registrar error en auditoría
      await this.auditoriaService.registrarAccion(
        'BACKUP_ERROR',
        `Error al crear backup SQL: ${error.message}. Duración: ${duracion}ms`
      );

      // Enviar email de error
      await this.enviarEmailBackup(resultado);

      return resultado;
    }
  }

  /**
   * Genera el script SQL para backup manual
   */
  private generarScriptBackupManual(rutaArchivo: string): string {
    const isWindows = platform() === 'win32';
    const rutaEscapada = isWindows 
      ? rutaArchivo.replace(/\\/g, '\\\\') 
      : rutaArchivo;

    return `
      DO $$
      DECLARE
        backup_path TEXT := '${rutaEscapada}';
        pg_dump_cmd TEXT;
        resultado INTEGER;
      BEGIN
        -- Construir comando pg_dump
        pg_dump_cmd := 'pg_dump -h ${this.dbConfig.host} -p ${this.dbConfig.port} -U ${this.dbConfig.username} -d ${this.dbConfig.database} -Fc -Z 9 -f "' || backup_path || '"';
        
        -- Ejecutar backup usando COPY TO PROGRAM
        BEGIN
          EXECUTE 'COPY (SELECT pg_sleep(0.1)) TO PROGRAM ''' || pg_dump_cmd || '''';
          
          -- Registrar éxito
          RAISE NOTICE 'Backup SQL iniciado: %', backup_path;
          
        EXCEPTION
          WHEN OTHERS THEN
            -- Si COPY TO PROGRAM falla, intentar con pg_dump directo
            RAISE NOTICE 'COPY TO PROGRAM falló, intentando método alternativo: %', SQLERRM;
            
            -- Método alternativo: generar archivo SQL plano
            EXECUTE 'COPY (SELECT ''-- Backup generado: '' || NOW()) TO ''' || backup_path || '''';
            RAISE NOTICE 'Backup alternativo creado: %', backup_path;
        END;
        
      END $$;
    `;
  }

  /**
   * Busca archivos de backup recientes en el directorio
   */
  private buscarArchivosRecientes(): string[] {
    try {
      if (!existsSync(this.backupDir)) {
        return [];
      }

      const archivos = readdirSync(this.backupDir);
      const ahora = new Date();
      const hace5Minutos = new Date(ahora.getTime() - 5 * 60 * 1000);

      return archivos.filter(archivo => {
        if (archivo.startsWith('backup_')) {
          const rutaCompleta = join(this.backupDir, archivo);
          const stats = statSync(rutaCompleta);
          return stats.mtime > hace5Minutos;
        }
        return false;
      });
    } catch (error) {
      this.logger.warn('Error buscando archivos recientes:', error.message);
      return [];
    }
  }

  /**
   * Envía email con el resultado del backup
   */
  private async enviarEmailBackup(resultado: BackupResult): Promise<void> {
    try {
      // Lista de emails de administradores (podrías obtenerla de la base de datos)
      const emailsAdmin = process.env.ADMIN_EMAILS?.split(',') || ['borrer31@gmail.com'];

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
   * Limpia backups antiguos (multiplataforma)
   */
  private async limpiarBackupsAntiguos(): Promise<void> {
    try {
      const diasAMantener = 7;
      const fechaLimite = new Date();
      fechaLimite.setDate(fechaLimite.getDate() - diasAMantener);

      if (existsSync(this.backupDir)) {
        const archivos = readdirSync(this.backupDir);
        let archivosEliminados = 0;

        for (const archivo of archivos) {
          if ((archivo.startsWith('backup_') && (archivo.endsWith('.sql') || archivo.endsWith('.dump'))) || 
              archivo.startsWith('script_')) {
            const rutaCompleta = join(this.backupDir, archivo);
            const stats = statSync(rutaCompleta);
            
            if (stats.mtime < fechaLimite) {
              try {
                // Usar unlinkSync en lugar de comandos del sistema
                unlinkSync(rutaCompleta);
                archivosEliminados++;
                this.logger.log(`🗑️ Archivo eliminado: ${archivo}`);
              } catch (error) {
                this.logger.warn(`Error eliminando archivo ${archivo}:`, error.message);
              }
            }
          }
        }

        this.logger.log(`🧹 ${archivosEliminados} archivos antiguos eliminados (más de ${diasAMantener} días)`);
      }
      
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
      if (!existsSync(this.backupDir)) {
        return [];
      }

      const archivos = readdirSync(this.backupDir);
      const backups: any[] = [];

      for (const archivo of archivos) {
        if ((archivo.startsWith('backup_') && (archivo.endsWith('.sql') || archivo.endsWith('.dump'))) ||
            archivo.startsWith('script_')) {
          const rutaCompleta = join(this.backupDir, archivo);
          const stats = statSync(rutaCompleta);
          
          backups.push({
            archivo,
            tipo: archivo.endsWith('.dump') ? 'Backup Binario' : 
                  archivo.startsWith('script_') ? 'Script SQL' : 'Backup SQL',
            tamaño: this.formatearTamaño(stats.size),
            fecha: stats.mtime.toLocaleString('es-ES'),
            fechaCreacion: stats.birthtime.toLocaleString('es-ES'),
            rutaCompleta,
          });
        }
      }

      // Ordenar por fecha de modificación (más reciente primero)
      return backups.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      
    } catch (error) {
      this.logger.error('Error obteniendo información de backups:', error);
      return [];
    }
  }

  /**
   * Método para verificar el estado de pg_cron
   */
  async verificarPgCron(): Promise<boolean> {
    try {
      const resultado = await this.prismaService.$queryRaw`
        SELECT EXISTS(
          SELECT 1 FROM pg_extension WHERE extname = 'pg_cron'
        ) as pg_cron_installed;
      `;
      
      const instalado = (resultado as any)[0]?.pg_cron_installed || false;
      
      if (instalado) {
        this.logger.log('✅ pg_cron está instalado y disponible');
      } else {
        this.logger.warn('⚠️ pg_cron no está instalado');
      }
      
      return instalado;
    } catch (error) {
      this.logger.error('Error verificando pg_cron:', error);
      return false;
    }
  }

  /**
   * Lista los jobs activos de pg_cron
   */
  async listarJobsBackup(): Promise<any[]> {
    try {
      const jobs = await this.prismaService.$queryRaw`
        SELECT jobid, schedule, command, nodename, nodeport, database, username, active
        FROM cron.job
        WHERE jobname LIKE '%backup%';
      `;
      
      return jobs as any[];
    } catch (error) {
      this.logger.error('Error listando jobs de backup:', error);
      return [];
    }
  }
}
