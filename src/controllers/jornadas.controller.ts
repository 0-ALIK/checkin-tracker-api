import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  ParseIntPipe,
  UseGuards,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { JornadasService } from '../services/jornadas.service';
import { CheckinDto } from '../dto/jornadas/checkin.dto';
import { CheckoutDto } from '../dto/jornadas/checkout.dto';
import { CheckinConTareasPendientesDto } from '../dto/jornadas/checkin-con-tareas-pendientes.dto';
import { RechazarJornadaDto } from '../dto/jornadas/rechazar-jornada.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { RequestContextService } from '../services/request-context.service';
import { ApiOperation, ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('jornadas')
@Controller('jornadas')
@UseGuards(JwtGuard)
export class JornadasController {
  constructor(
    private readonly jornadasService: JornadasService,
    private readonly requestContext: RequestContextService,
  ) {}

  @Post('checkin')
  @ApiOperation({ summary: 'Realizar check-in con tareas planificadas' })
  checkin(@Body() checkinDto: CheckinDto) {
    const usuarioId = this.requestContext.getUserId();
    if (!usuarioId) {
      throw new UnauthorizedException('Usuario no autenticado');
    }
    return this.jornadasService.checkin(checkinDto, usuarioId);
  }

  @Post('checkout')
  @ApiOperation({ summary: 'Realizar check-out' })
  checkout(@Body() checkoutDto: CheckoutDto) {
    return this.jornadasService.checkout(checkoutDto);
  }

  @Get('mi-historial')
  @ApiOperation({ summary: 'Obtener historial de jornadas del usuario actual' })
  getMiHistorial() {
    const usuarioId = this.requestContext.getUserId();
    if (!usuarioId) {
      throw new UnauthorizedException('Usuario no autenticado');
    }
    return this.jornadasService.getHistorialUsuario(usuarioId);
  }

  @Get('pendientes')
  @ApiOperation({ summary: 'Obtener jornadas pendientes de aprobación' })
  getJornadasPendientes() {
    return this.jornadasService.getJornadasPendientes();
  }

  @Get('aprobadas')
  @ApiOperation({ summary: 'Obtener jornadas aprobadas' })
  getJornadasAprobadas() {
    return this.jornadasService.getJornadasAprobadas();
  }

  @Get('supervisor/:supervisorId')
  @ApiOperation({ summary: 'Obtener jornadas para supervisión' })
  getJornadasBySupervisor(
    @Param('supervisorId', ParseIntPipe) supervisorId: number,
  ) {
    return this.jornadasService.getJornadasBySupervisor(supervisorId);
  }

  @Get('todas-empleados')
  @ApiOperation({ summary: 'Obtener todas las jornadas de empleados para supervisores' })
  getJornadasForSupervisors() {
    return this.jornadasService.getJornadasForSupervisors();
  }

  @Get('mis-supervisados')
  @ApiOperation({ summary: 'Obtener jornadas bajo supervisión del usuario actual' })
  getMisSupervisados() {
    const supervisorId = this.requestContext.getUserId();
    if (!supervisorId) {
      throw new UnauthorizedException('Usuario no autenticado');
    }
    return this.jornadasService.getJornadasBySupervisor(supervisorId);
  }

  @Put(':id/aprobar')
  @ApiOperation({ summary: 'Aprobar una jornada' })
  aprobarJornada(@Param('id', ParseIntPipe) id: number) {
    return this.jornadasService.aprobarJornada(id);
  }

  @Put(':id/rechazar')
  @ApiOperation({ summary: 'Rechazar una jornada' })
  rechazarJornada(
    @Param('id', ParseIntPipe) id: number,
    @Body() rechazarJornadaDto: RechazarJornadaDto,
  ) {
    return this.jornadasService.rechazarJornada(id, rechazarJornadaDto.motivo);
  }

  @Put('actividad/:id')
  @ApiOperation({ summary: 'Actualizar estado y observaciones de una actividad' })
  updateActividad(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: { id_estado?: number; observaciones?: string },
  ) {
    return this.jornadasService.updateActividad(id, updateData);
  }

  @Get('actividades/:jornadaId')
  @ApiOperation({ summary: 'Obtener actividades de una jornada específica' })
  getActividadesByJornada(@Param('jornadaId', ParseIntPipe) jornadaId: number) {
    return this.jornadasService.getActividadesByJornada(jornadaId);
  }

  @Put(':id/aprobar-checkin')
  @ApiOperation({ summary: 'Aprobar check-in específicamente' })
  aprobarCheckin(@Param('id', ParseIntPipe) id: number) {
    return this.jornadasService.aprobarCheckin(id);
  }

  @Put(':id/aprobar-checkout')
  @ApiOperation({ summary: 'Aprobar check-out específicamente' })
  aprobarCheckout(@Param('id', ParseIntPipe) id: number) {
    return this.jornadasService.aprobarCheckout(id);
  }

  @Get('tareas-pendientes')
  @ApiOperation({ summary: 'Obtener tareas pendientes del usuario para arrastrar al siguiente día' })
  getTareasPendientes() {
    const usuarioId = this.requestContext.getUserId();
    if (!usuarioId) {
      throw new UnauthorizedException('Usuario no autenticado');
    }
    return this.jornadasService.getTareasPendientes(usuarioId);
  }

  @Post('checkin-con-tareas-pendientes')
  @ApiOperation({ summary: 'Realizar check-in arrastrando tareas pendientes seleccionadas' })
  checkinConTareasPendientes(
    @Body() body: CheckinConTareasPendientesDto
  ) {
    const usuarioId = this.requestContext.getUserId();
    if (!usuarioId) {
      throw new UnauthorizedException('Usuario no autenticado');
    }
    return this.jornadasService.checkinConTareasPendientes(
      body.checkinDto, 
      usuarioId, 
      body.tareasArrastradas || []
    );
  }

  @Get('stats/:userId')
  @ApiOperation({ summary: 'Obtiene estadísticas de jornadas para un usuario en un rango de fechas' })
  @ApiResponse({ status: 200, description: 'Estadísticas del usuario.' })
  @ApiQuery({ name: 'startDate', required: true, description: 'Fecha de inicio (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: true, description: 'Fecha de fin (YYYY-MM-DD)' })
  getStats(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.jornadasService.getStatsForEmployee(userId, startDate, endDate);
  }
}
