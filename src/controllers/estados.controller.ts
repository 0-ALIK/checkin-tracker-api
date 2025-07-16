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
import { EstadosService } from '../services/estados.service';
import { CreateEstadoDto } from '../dto/estados/create-estado.dto';
import { UpdateEstadoDto } from '../dto/estados/update-estado.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Estados')
@Controller('estados')
@UseGuards(JwtGuard)
export class EstadosController {
  constructor(private readonly estadosService: EstadosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo estado' })
  @ApiResponse({ status: 201, description: 'Estado creado exitosamente' })
  create(@Body() createEstadoDto: CreateEstadoDto) {
    return this.estadosService.create(createEstadoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los estados' })
  @ApiResponse({ status: 200, description: 'Lista de estados' })
  findAll() {
    return this.estadosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un estado por ID' })
  @ApiResponse({ status: 200, description: 'Estado encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.estadosService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un estado' })
  @ApiResponse({ status: 200, description: 'Estado actualizado exitosamente' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEstadoDto: UpdateEstadoDto,
  ) {
    return this.estadosService.update(id, updateEstadoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un estado' })
  @ApiResponse({ status: 200, description: 'Estado eliminado exitosamente' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.estadosService.remove(id);
  }
}
