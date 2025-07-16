import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { InformesService } from '../services/informes.service';
import { JwtGuard } from '../guards/jwt.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('Informes')
@Controller('informes')
@UseGuards(JwtGuard)
export class InformesController {
  constructor(private readonly informesService: InformesService) {}

  @Post('enviar-diario')
  @ApiOperation({ summary: 'Enviar informe diario manualmente' })
  @ApiResponse({ status: 200, description: 'Informe enviado exitosamente' })
  @ApiQuery({
    name: 'fecha',
    required: false,
    description: 'Fecha en formato YYYY-MM-DD',
  })
  async enviarInformeDiario(@Query('fecha') fecha?: string) {
    const fechaConsulta = fecha ? new Date(fecha) : undefined;
    return this.informesService.enviarInformeDiarioManual(fechaConsulta);
  }

  @Get('estadisticas-diarias')
  @ApiOperation({ summary: 'Obtener estadísticas del día' })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas obtenidas exitosamente',
  })
  @ApiQuery({
    name: 'fecha',
    required: false,
    description: 'Fecha en formato YYYY-MM-DD',
  })
  async obtenerEstadisticasDiarias(@Query('fecha') fecha?: string) {
    const fechaConsulta = fecha ? new Date(fecha) : undefined;
    return this.informesService.obtenerEstadisticasDiarias(fechaConsulta);
  }

  @Get('datos-diarios')
  @ApiOperation({ summary: 'Obtener datos completos del día' })
  @ApiResponse({ status: 200, description: 'Datos obtenidos exitosamente' })
  @ApiQuery({
    name: 'fecha',
    required: false,
    description: 'Fecha en formato YYYY-MM-DD',
  })
  async obtenerDatosDiarios(@Query('fecha') fecha?: string) {
    const fechaConsulta = fecha ? new Date(fecha) : undefined;
    return this.informesService.obtenerInformesDiarios(fechaConsulta);
  }
}
