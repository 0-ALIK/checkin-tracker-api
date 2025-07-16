import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AreasService } from '../services/areas.service';
import { CreateAreaDto } from '../dto/areas/create-area.dto';
import { UpdateAreaDto } from '../dto/areas/update-area.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Areas')
@Controller('areas')
@UseGuards(JwtGuard)
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva área' })
  @ApiResponse({ status: 201, description: 'Área creada exitosamente' })
  create(@Body() createAreaDto: CreateAreaDto) {
    return this.areasService.create(createAreaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las áreas' })
  @ApiResponse({ status: 200, description: 'Lista de áreas' })
  findAll() {
    return this.areasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un área por ID' })
  @ApiResponse({ status: 200, description: 'Área encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.areasService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un área' })
  @ApiResponse({ status: 200, description: 'Área actualizada exitosamente' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAreaDto: UpdateAreaDto,
  ) {
    return this.areasService.update(id, updateAreaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un área' })
  @ApiResponse({ status: 200, description: 'Área eliminada exitosamente' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.areasService.remove(id);
  }
}
