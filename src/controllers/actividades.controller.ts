import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ActividadesService } from '../services/actividades.service';
import { JwtGuard } from '../guards/jwt.guard';
import { CreateActividadDto } from '../dto/actividades/create-actividad.dto';
import { UpdateActividadDto } from '../dto/actividades/update-actividad.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('actividades')
@Controller('actividades')
@UseGuards(JwtGuard)
export class ActividadesController {
  constructor(private readonly actividadesService: ActividadesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva actividad' })
  create(@Body() createActividadDto: CreateActividadDto) {
    return this.actividadesService.create(createActividadDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una actividad' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateActividadDto: UpdateActividadDto,
  ) {
    return this.actividadesService.update(id, updateActividadDto);
  }

  @Get('jornada/:jornadaId')
  @ApiOperation({ summary: 'Obtener actividades por jornada' })
  findByJornada(@Param('jornadaId', ParseIntPipe) jornadaId: number) {
    return this.actividadesService.findByJornada(jornadaId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una actividad por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.actividadesService.findOne(id);
  }
}
