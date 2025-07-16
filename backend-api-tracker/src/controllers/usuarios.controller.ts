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
import { UsuariosService } from '../services/usuarios.service';
import { CreateUsuarioDto } from '../dto/usuarios/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/usuarios/update-usuario.dto';
import { AssignRolDto } from '../dto/usuarios/assign-rol.dto';
import { AssignAreaDto } from '../dto/usuarios/assign-area.dto';
import { JwtGuard } from '../guards/jwt.guard';

@Controller('usuarios')
@UseGuards(JwtGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.remove(id);
  }

  @Put(':id/rol')
  assignRol(
    @Param('id', ParseIntPipe) id: number,
    @Body() assignRolDto: AssignRolDto,
  ) {
    return this.usuariosService.assignRol(id, assignRolDto.id_rol);
  }

  @Put(':id/area')
  assignArea(
    @Param('id', ParseIntPipe) id: number,
    @Body() assignAreaDto: AssignAreaDto,
  ) {
    return this.usuariosService.assignArea(id, assignAreaDto.id_area);
  }
}
