import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ActividadesService } from '../services/actividades.service';
import { CreateActividadDto } from '../dto/actividades/create-actividad.dto';
import { UpdateActividadDto } from '../dto/actividades/update-actividad.dto';
import { JwtGuard } from '../guards/jwt.guard';

@Controller('actividades')
@UseGuards(JwtGuard)
export class ActividadesController {
  constructor(private readonly actividadesService: ActividadesService) {}

  @Post()
  create(@Body() createActividadDto: CreateActividadDto) {
    return this.actividadesService.create(createActividadDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateActividadDto: UpdateActividadDto,
  ) {
    return this.actividadesService.update(id, updateActividadDto);
  }

  @Get('jornada/:jornadaId')
  findByJornada(@Param('jornadaId', ParseIntPipe) jornadaId: number) {
    return this.actividadesService.findByJornada(jornadaId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.actividadesService.findOne(id);
  }
}
