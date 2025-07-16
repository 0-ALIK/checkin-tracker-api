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
    this.logger.log('Iniciando cron job para envío de informes diarios...');

    try {
      const resultado =
        await this.informesService.enviarInformeDiarioAutomatico();

      // Registrar éxito en auditoría
      await this.auditoriaService.registrarAccion(
        'CRON_INFORME_EXITOSO',
        `Cron job de informes ejecutado exitosamente`,
        1, // ID del sistema
      );

      this.logger.log('Cron job de informes completado exitosamente');
      return resultado;
    } catch (error) {
      this.logger.error('Error en cron job de informes:', error);

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
    this.logger.log('Iniciando limpieza de auditorías antiguas...');

    try {
      // Eliminar auditorías de más de 90 días
      const fechaLimite = new Date();
      fechaLimite.setDate(fechaLimite.getDate() - 90);

      const result =
        await this.auditoriaService.limpiarAuditoriasAntiguas(fechaLimite);

      this.logger.log(
        `Limpieza completada. Registros eliminados: ${result.count}`,
      );

      await this.auditoriaService.registrarAccion(
        'LIMPIEZA_AUDITORIA',
        `Limpieza automática completada. Registros eliminados: ${result.count}`,
        1,
      );
    } catch (error) {
      this.logger.error('Error en limpieza de auditorías:', error);
    }
  }
}
