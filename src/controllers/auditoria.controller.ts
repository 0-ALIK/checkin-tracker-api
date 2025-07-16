import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuditoriaService } from '../services/auditoria.service';
import { JwtGuard } from '../guards/jwt.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('Auditoría')
@Controller('auditoria')
@UseGuards(JwtGuard)
export class AuditoriaController {
  constructor(private readonly auditoriaService: AuditoriaService) {}

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
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    return this.auditoriaService.obtenerAuditoriasPorFecha(inicio, fin);
  }
}
