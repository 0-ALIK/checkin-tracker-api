import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InformesService } from './informes.service';
import { AuditoriaService } from './auditoria.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private readonly informesService: InformesService,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  @Cron('0 22 * * *', {
    name: 'informe-diario-automatico',
    timeZone: 'America/Lima',
  })
  async ejecutarInformeDiario() {
    this.logger.log('🕰️ Iniciando cron job para envío de informes diarios...');

    try {
      // Registrar inicio en auditoría
      await this.auditoriaService.registrarAccion(
        'CRON_INFORME_INICIO',
        'Cron job de informes diarios iniciado automáticamente',
        1,
      );

      const resultado =
        await this.informesService.enviarInformeDiarioAutomatico();

      // Registrar éxito en auditoría
      await this.auditoriaService.registrarAccion(
        'CRON_INFORME_EXITOSO',
        `Cron job de informes ejecutado exitosamente. Resultado: ${JSON.stringify(resultado)}`,
        1,
      );

      this.logger.log('✅ Cron job de informes completado exitosamente');
      return resultado;
    } catch (error) {
      this.logger.error('❌ Error en cron job de informes:', error);

      // Registrar error en auditoría
      await this.auditoriaService.registrarAccion(
        'CRON_INFORME_ERROR',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Error en cron job de informes: ${error.message}`,
        1,
      );

      throw error;
    }
  }

  // Cron adicional para limpieza de auditorías antiguas (opcional)
  @Cron('0 2 * * 0', {
    name: 'limpieza-auditoria',
    timeZone: 'America/Lima',
  })
  async limpiarAuditorias() {
    this.logger.log('🧹 Iniciando limpieza de auditorías antiguas...');

    try {
      // Registrar inicio en auditoría
      await this.auditoriaService.registrarAccion(
        'LIMPIEZA_AUDITORIA_INICIO',
        'Cron job de limpieza de auditorías iniciado automáticamente',
        1,
      );

      // Eliminar auditorías de más de 90 días
      const fechaLimite = new Date();
      fechaLimite.setDate(fechaLimite.getDate() - 90);

      const result =
        await this.auditoriaService.limpiarAuditoriasAntiguas(fechaLimite);

      this.logger.log(
        `✅ Limpieza completada. Registros eliminados: ${result.count}`,
      );

      await this.auditoriaService.registrarAccion(
        'LIMPIEZA_AUDITORIA_EXITOSA',
        `Limpieza automática completada. Registros eliminados: ${result.count}. Fecha límite: ${fechaLimite.toISOString()}`,
        1,
      );

      return result;
    } catch (error) {
      this.logger.error('❌ Error en limpieza de auditorías:', error);
      
      await this.auditoriaService.registrarAccion(
        'LIMPIEZA_AUDITORIA_ERROR',
        `Error en limpieza automática de auditorías: ${error.message}`,
        1,
      );
      
      throw error;
    }
  }
}
