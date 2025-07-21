import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ComentariosService } from '../services/comentarios.service';
import { JwtGuard } from '../guards/jwt.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('comentarios')
@Controller('comentarios')
@UseGuards(JwtGuard)
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) {}

  @Get('jornada/:jornadaId')
  @ApiOperation({ summary: 'Obtener comentarios de una jornada' })
  getComentariosByJornada(@Param('jornadaId', ParseIntPipe) jornadaId: number) {
    return this.comentariosService.findByJornada(jornadaId);
  }

  @Get('actividad/:actividadId')
  @ApiOperation({ summary: 'Obtener comentarios de una actividad' })
  getComentariosByActividad(@Param('actividadId', ParseIntPipe) actividadId: number) {
    return this.comentariosService.findByActividad(actividadId);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo comentario' })
  createComentario(@Body() createComentarioData: { id_actividad: number; comentario: string }) {
    return this.comentariosService.create(createComentarioData);
  }
}
