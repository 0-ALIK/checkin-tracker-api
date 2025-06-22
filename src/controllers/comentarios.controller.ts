import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ComentariosService } from '../services/comentarios.service';
import { CreateComentarioDto } from '../dto/comentarios/create-comentario.dto';
import { JwtGuard } from '../guards/jwt.guard';

@Controller('comentarios')
@UseGuards(JwtGuard)
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) {}

  @Post()
  create(@Body() createComentarioDto: CreateComentarioDto) {
    return this.comentariosService.create(createComentarioDto);
  }

  @Get('actividad/:actividadId')
  findByActividad(@Param('actividadId', ParseIntPipe) actividadId: number) {
    return this.comentariosService.findByActividad(actividadId);
  }

  @Get('jornada/:jornadaId')
  findByJornada(@Param('jornadaId', ParseIntPipe) jornadaId: number) {
    return this.comentariosService.findByJornada(jornadaId);
  }
}
