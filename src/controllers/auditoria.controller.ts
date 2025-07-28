import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  UseGuards,
  Post,
  Body,
} from '@nestjs/common';
import { AuditoriaService } from '../services/auditoria.service';
import { CronService } from '../services/cron.service';
import { JwtGuard } from '../guards/jwt.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';

@ApiTags('Auditoría')
@Controller('auditoria')
@UseGuards(JwtGuard)
export class AuditoriaController {
  constructor(
    private readonly auditoriaService: AuditoriaService,
    private readonly cronService: CronService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las auditorías' })
  @ApiResponse({ status: 200, description: 'Lista de auditorías' })
  obtenerTodas() {
    return this.auditoriaService.obtenerTodasLasAuditorias();
  }

  @Get('usuario/:usuarioId')
  @ApiOperation({ summary: 'Obtener auditorías por usuario' })
  @ApiResponse({ status: 200, description: 'Lista de auditorías del usuario' })
  obtenerPorUsuario(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return this.auditoriaService.obtenerAuditoriasPorUsuario(usuarioId);
  }

  @Get('fecha')
  @ApiOperation({ summary: 'Obtener auditorías por rango de fechas' })
  @ApiQuery({
    name: 'fechaInicio',
    description: 'Fecha de inicio (YYYY-MM-DD)',
  })
  @ApiQuery({ name: 'fechaFin', description: 'Fecha de fin (YYYY-MM-DD)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de auditorías en el rango de fechas',
  })
  obtenerPorFecha(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    // Convertir fechas y ajustar para zona horaria local
    const inicio = new Date(fechaInicio + 'T00:00:00.000Z');
    const fin = new Date(fechaFin + 'T23:59:59.999Z');
    
    console.log('🔍 Búsqueda de auditorías por fecha:');
    console.log('   Parámetros recibidos:', { fechaInicio, fechaFin });
    console.log('   Fecha inicio procesada:', inicio);
    console.log('   Fecha fin procesada:', fin);
    console.log('   ISO inicio:', inicio.toISOString());
    console.log('   ISO fin:', fin.toISOString());
    
    return this.auditoriaService.obtenerAuditoriasPorFecha(inicio, fin);
  }

  @Post('limpiar')
  @ApiOperation({ summary: 'Ejecutar limpieza manual de auditorías antiguas (Solo Admin)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        dias: {
          type: 'number',
          description: 'Número de días para mantener (por defecto 90)',
          example: 90
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Limpieza ejecutada exitosamente' })
  async limpiarAuditoriasManual(@Body() body: { dias?: number }) {
    const dias = body.dias || 90;
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - dias);
    
    const result = await this.auditoriaService.limpiarAuditoriasAntiguas(fechaLimite);
    
    // Registrar la acción
    await this.auditoriaService.registrarAccion(
      'LIMPIEZA_MANUAL_AUDITORIA',
      `Limpieza manual ejecutada. Registros eliminados: ${result.count}. Días configurados: ${dias}`
    );

    return {
      mensaje: 'Limpieza ejecutada exitosamente',
      registrosEliminados: result.count,
      diasConfigurados: dias,
      fechaLimite: fechaLimite.toISOString()
    };
  }

  @Post('ejecutar-cron-informes')
  @ApiOperation({ summary: 'Ejecutar manualmente el envío de informes diarios (Solo Admin)' })
  @ApiResponse({ status: 200, description: 'Cron de informes ejecutado exitosamente' })
  async ejecutarCronInformes() {
    const resultado = await this.cronService.ejecutarInformeDiario();
    
    // Registrar la ejecución manual
    await this.auditoriaService.registrarAccion(
      'CRON_MANUAL_INFORMES',
      'Cron de informes ejecutado manualmente por administrador'
    );

    return {
      mensaje: 'Cron de informes ejecutado exitosamente',
      resultado
    };
  }

  @Post('ejecutar-cron-limpieza')
  @ApiOperation({ summary: 'Ejecutar manualmente el cron de limpieza de auditorías (Solo Admin)' })
  @ApiResponse({ status: 200, description: 'Cron de limpieza ejecutado exitosamente' })
  async ejecutarCronLimpieza() {
    await this.cronService.limpiarAuditorias();
    
    // Registrar la ejecución manual
    await this.auditoriaService.registrarAccion(
      'CRON_MANUAL_LIMPIEZA',
      'Cron de limpieza ejecutado manualmente por administrador'
    );

    return {
      mensaje: 'Cron de limpieza ejecutado exitosamente'
    };
  }

  @Get('cron-status')
  @ApiOperation({ summary: 'Obtener estado de todos los cron jobs' })
  @ApiResponse({ status: 200, description: 'Estado de los cron jobs' })
  getCronJobsStatus() {
    return this.cronService.getCronJobsStatus();
  }

  @Post('test-cron/:jobName')
  @ApiOperation({ summary: 'Ejecutar un cron job específico para testing' })
  @ApiResponse({ status: 200, description: 'Cron job ejecutado para testing' })
  async testCronJob(@Param('jobName') jobName: string) {
    const resultado = await this.cronService.testCronJob(jobName);
    
    await this.auditoriaService.registrarAccion(
      'TEST_CRON_MANUAL',
      `Test manual del cron job: ${jobName}`
    );

    return {
      mensaje: `Test del cron job ${jobName} ejecutado exitosamente`,
      resultado
    };
  }
}
