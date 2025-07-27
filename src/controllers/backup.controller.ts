import {
  Controller,
  Post,
  Get,
  UseGuards,
  Body,
} from '@nestjs/common';
import { BackupService } from '../services/backup.service';
import { AuditoriaService } from '../services/auditoria.service';
import { JwtGuard } from '../guards/jwt.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Backup')
@Controller('backup')
@UseGuards(JwtGuard)
export class BackupController {
  constructor(
    private readonly backupService: BackupService,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  @Post('ejecutar')
  @ApiOperation({ summary: 'Ejecutar backup manual de la base de datos (Solo Admin)' })
  @ApiResponse({ status: 200, description: 'Backup ejecutado exitosamente' })
  @ApiResponse({ status: 500, description: 'Error al ejecutar backup' })
  async ejecutarBackupManual() {
    // Registrar intento de backup manual
    await this.auditoriaService.registrarAccion(
      'BACKUP_MANUAL_INICIO',
      'Backup manual iniciado por administrador'
    );

    const resultado = await this.backupService.ejecutarBackup();
    
    return {
      status: resultado.success ? 'exitoso' : 'error',
      ...resultado
    };
  }

  @Get('info')
  @ApiOperation({ summary: 'Obtener información de backups existentes (Solo Admin)' })
  @ApiResponse({ status: 200, description: 'Lista de backups disponibles' })
  async obtenerInfoBackups() {
    const backups = await this.backupService.obtenerInfoBackups();
    
    return {
      mensaje: 'Información de backups obtenida exitosamente',
      totalBackups: backups.length,
      backups
    };
  }

  @Post('test-email')
  @ApiOperation({ summary: 'Probar envío de email de backup (Solo Admin)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'Email de destino para la prueba',
          example: 'borrer31@gmail.com'
        },
        tipo: {
          type: 'string',
          enum: ['exitoso', 'error'],
          description: 'Tipo de email a probar',
          example: 'exitoso'
        }
      },
      required: ['email', 'tipo']
    }
  })
  @ApiResponse({ status: 200, description: 'Email de prueba enviado' })
  async probarEmailBackup(@Body() body: { email: string; tipo: 'exitoso' | 'error' }) {
    const { email, tipo } = body;
    
    // Simular resultado de backup para el email de prueba
    const resultadoSimulado = tipo === 'exitoso' ? {
      success: true,
      mensaje: 'Backup completado exitosamente (PRUEBA)',
      archivo: 'backup_test_2025-07-21T15-30-00.sql',
      tamaño: '15.2 MB',
      duracion: 45000,
    } : {
      success: false,
      mensaje: 'Error al crear backup (PRUEBA)',
      error: 'Error de conexión a la base de datos (simulado)',
      duracion: 5000,
    };

    // Enviar email de prueba usando el método privado del BackupService
    // Como no podemos acceder al método privado, vamos a usar el EmailService directamente
    const EmailService = require('../services/email.service').EmailService;
    const emailService = new EmailService(null);
    
    const asunto = resultadoSimulado.success 
      ? '✅ Backup de Base de Datos - Exitoso (PRUEBA)'
      : '❌ Backup de Base de Datos - Error (PRUEBA)';

    const contenido = this.generarEmailPrueba(resultadoSimulado, tipo);

    try {
      await emailService.sendEmail(email, asunto, contenido);
      
      // Registrar la prueba
      await this.auditoriaService.registrarAccion(
        'BACKUP_EMAIL_PRUEBA',
        `Email de prueba de backup enviado a ${email}. Tipo: ${tipo}`
      );

      return {
        mensaje: 'Email de prueba enviado exitosamente',
        destinatario: email,
        tipo,
        asunto
      };
    } catch (error) {
      await this.auditoriaService.registrarAccion(
        'BACKUP_EMAIL_PRUEBA_ERROR',
        `Error enviando email de prueba a ${email}: ${error.message}`
      );

      throw new Error(`Error enviando email de prueba: ${error.message}`);
    }
  }

  private generarEmailPrueba(resultado: any, tipo: string): string {
    const headerColor = resultado.success ? '#10b981' : '#ef4444';
    const headerText = resultado.success ? '✅ Backup Completado (PRUEBA)' : '❌ Error en Backup (PRUEBA)';
    
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: ${headerColor}; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">${headerText}</h1>
          <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Este es un email de prueba del sistema de backup</p>
        </div>
        
        <div style="padding: 20px; background: #f9fafb;">
          <div style="background: #fef3c7; border: 1px solid #fde68a; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <p style="margin: 0; color: #92400e;">
              <strong>🧪 PRUEBA:</strong> Este es un email de prueba para verificar el funcionamiento del sistema de notificaciones de backup. No se ha ejecutado ningún backup real.
            </p>
          </div>

          <h2 style="color: #374151;">Detalles de la Prueba</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background: #e5e7eb;">
              <td style="padding: 10px; border: 1px solid #d1d5db; font-weight: bold;">Tipo de Prueba:</td>
              <td style="padding: 10px; border: 1px solid #d1d5db;">${tipo === 'exitoso' ? 'Backup Exitoso' : 'Backup con Error'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #d1d5db; font-weight: bold;">Fecha de Prueba:</td>
              <td style="padding: 10px; border: 1px solid #d1d5db;">${new Date().toLocaleString('es-ES')}</td>
            </tr>
            <tr style="background: #e5e7eb;">
              <td style="padding: 10px; border: 1px solid #d1d5db; font-weight: bold;">Estado del Sistema:</td>
              <td style="padding: 10px; border: 1px solid #d1d5db;">Sistema de emails funcionando correctamente</td>
            </tr>
          </table>

          ${resultado.success ? `
            <div style="background: #dcfce7; border: 1px solid #bbf7d0; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #166534;">
                <strong>✅ Simulación Exitosa:</strong> El sistema de backup y notificaciones está funcionando correctamente.
              </p>
            </div>
          ` : `
            <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #dc2626;">
                <strong>❌ Simulación de Error:</strong> Esta es una prueba de cómo se verían las notificaciones en caso de error en el backup.
              </p>
            </div>
          `}

          <h3 style="color: #374151;">Configuración del Sistema</h3>
          <ul style="color: #6b7280;">
            <li>📧 Servicio de email: Operativo</li>
            <li>💾 Sistema de backup: Disponible</li>
            <li>🕐 Backup automático: Configurado para las 03:00</li>
            <li>🧹 Limpieza automática: Mantiene 7 días de backups</li>
          </ul>
        </div>
        
        <div style="background: #374151; color: white; padding: 15px; text-align: center; font-size: 12px;">
          Sistema de Check-In/Check-Out - Email de Prueba de Backup
        </div>
      </div>
    `;
  }
}
