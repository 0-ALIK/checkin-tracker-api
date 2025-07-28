import { Injectable, Logger, Inject, forwardRef, OnModuleInit } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { InformesService } from './informes.service';
import { AuditoriaService } from './auditoria.service';
import { BackupService } from './backup.service';

@Injectable()
export class CronService implements OnModuleInit {
  private readonly logger = new Logger(CronService.name);

  constructor(
    @Inject(forwardRef(() => InformesService))
    private readonly informesService: InformesService,
    @Inject(forwardRef(() => AuditoriaService))
    private readonly auditoriaService: AuditoriaService,
    @Inject(forwardRef(() => BackupService))
    private readonly backupService: BackupService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  onModuleInit() {
    this.logger.log('🔧 Inicializando cron jobs...');
    this.registerCronJobs();
  }

  private registerCronJobs() {
    try {
      // Cron para informes diarios - 22:00 (10 PM) todos los días
      const informeJob = new CronJob('0 22 * * *', () => {
        this.ejecutarInformeDiario();
      }, null, true, 'America/Lima');
      
      this.schedulerRegistry.addCronJob('informe-diario-automatico', informeJob);
      this.logger.log('✅ Cron job "informe-diario-automatico" registrado exitosamente');

      // Cron para limpieza de auditorías - 02:00 AM los domingos
      const limpiezaJob = new CronJob('0 2 * * 0', () => {
        this.limpiarAuditorias();
      }, null, true, 'America/Lima');
      
      this.schedulerRegistry.addCronJob('limpieza-auditoria', limpiezaJob);
      this.logger.log('✅ Cron job "limpieza-auditoria" registrado exitosamente');

      // Cron para backup automático - 03:00 AM todos los días
      const backupJob = new CronJob('0 3 * * *', () => {
        this.ejecutarBackupAutomatico();
      }, null, true, 'America/Lima');
      
      this.schedulerRegistry.addCronJob('backup-automatico', backupJob);
      this.logger.log('✅ Cron job "backup-automatico" registrado exitosamente');

      this.logger.log('🎉 Todos los cron jobs han sido registrados exitosamente');
    } catch (error) {
      this.logger.error('❌ Error al registrar cron jobs:', error);
    }
  }

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

  async ejecutarBackupAutomatico() {
    this.logger.log('💾 Iniciando backup automático de la base de datos...');

    try {
      // Registrar inicio en auditoría
      await this.auditoriaService.registrarAccion(
        'BACKUP_INICIO',
        'Cron job de backup automático iniciado',
        1,
      );

      const resultado = await this.backupService.ejecutarBackup();

      if (resultado.success) {
        this.logger.log(`✅ Backup automático completado: ${resultado.archivo} (${resultado.tamaño})`);
        
        await this.auditoriaService.registrarAccion(
          'BACKUP_EXITOSO',
          `Backup automático completado exitosamente. Archivo: ${resultado.archivo}, Tamaño: ${resultado.tamaño}, Duración: ${resultado.duracion}ms`,
          1,
        );
      } else {
        this.logger.error(`❌ Error en backup automático: ${resultado.error}`);
        
        await this.auditoriaService.registrarAccion(
          'BACKUP_ERROR',
          `Error en backup automático: ${resultado.error}. Duración: ${resultado.duracion}ms`,
          1,
        );
      }

      return resultado;
    } catch (error) {
      this.logger.error('❌ Error crítico en backup automático:', error);
      
      await this.auditoriaService.registrarAccion(
        'BACKUP_ERROR_CRITICO',
        `Error crítico en backup automático: ${error.message}`,
        1,
      );
      
      throw error;
    }
  }

  // Métodos para validación y debugging
  getCronJobsStatus() {
    const jobs = this.schedulerRegistry.getCronJobs();
    const status: Array<{
      name: string;
      running: boolean;
      nextRun: string | null;
      lastRun: string | null;
    }> = [];
    
    jobs.forEach((job, name) => {
      const nextDate = job.nextDate ? job.nextDate() : null;
      const lastDate = job.lastDate ? job.lastDate() : null;
      
      status.push({
        name,
        running: true, // Los cron jobs registrados están activos por defecto
        nextRun: nextDate ? nextDate.toString() : null,
        lastRun: lastDate ? lastDate.toString() : null,
      });
    });
    
    return status;
  }

  async testCronJob(jobName: string) {
    this.logger.log(`🧪 Ejecutando test del cron job: ${jobName}`);
    
    try {
      switch (jobName) {
        case 'informe-diario':
          return await this.ejecutarInformeDiario();
        case 'limpieza-auditoria':
          return await this.limpiarAuditorias();
        case 'backup-automatico':
          return await this.ejecutarBackupAutomatico();
        default:
          throw new Error(`Cron job no encontrado: ${jobName}`);
      }
    } catch (error) {
      this.logger.error(`❌ Error en test del cron job ${jobName}:`, error);
      throw error;
    }
  }
}
