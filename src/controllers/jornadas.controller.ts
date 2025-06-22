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
} from '@nestjs/common';
import { JornadasService } from '../services/jornadas.service';
import { CheckinDto } from '../dto/jornadas/checkin.dto';
import { CheckoutDto } from '../dto/jornadas/checkout.dto';
import { RechazarJornadaDto } from '../dto/jornadas/rechazar-jornada.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { RequestContextService } from '../services/request-context.service';

@Controller('jornadas')
@UseGuards(JwtGuard)
export class JornadasController {
  constructor(
    private readonly jornadasService: JornadasService,
    private readonly requestContext: RequestContextService,
  ) {}

  @Post('checkin')
  checkin(@Body() checkinDto: CheckinDto) {
    const usuarioId = this.requestContext.getUserId();
    if (!usuarioId) {
      throw new UnauthorizedException('Usuario no autenticado');
    }
    return this.jornadasService.checkin(
      {
        ...checkinDto,
      },
      usuarioId,
    );
  }

  @Post('checkout')
  checkout(@Body() checkoutDto: CheckoutDto) {
    return this.jornadasService.checkout(checkoutDto);
  }

  @Get('mi-historial')
  getMiHistorial() {
    const usuarioId = this.requestContext.getUserId();
    if (!usuarioId) {
      throw new UnauthorizedException('Usuario no autenticado');
    }
    return this.jornadasService.getHistorialUsuario(usuarioId);
  }

  @Get('pendientes')
  getJornadasPendientes() {
    return this.jornadasService.getJornadasPendientes();
  }

  @Get('aprobadas')
  getJornadasAprobadas() {
    return this.jornadasService.getJornadasAprobadas();
  }

  @Get('supervisor/:supervisorId')
  getJornadasBySupervisor(
    @Param('supervisorId', ParseIntPipe) supervisorId: number,
  ) {
    return this.jornadasService.getJornadasBySupervisor(supervisorId);
  }

  @Put(':id/aprobar')
  aprobarJornada(@Param('id', ParseIntPipe) id: number) {
    return this.jornadasService.aprobarJornada(id);
  }

  @Put(':id/rechazar')
  rechazarJornada(
    @Param('id', ParseIntPipe) id: number,
    @Body() rechazarJornadaDto: RechazarJornadaDto,
  ) {
    return this.jornadasService.rechazarJornada(id, rechazarJornadaDto.motivo);
  }
}
