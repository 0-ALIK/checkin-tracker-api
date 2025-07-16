import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AuditoriaService } from './auditoria.service';
import { CreateUsuarioDto } from '../dto/usuarios/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/usuarios/update-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    private prisma: PrismaService,
    private auditoriaService: AuditoriaService,
  ) {}

  async findAll() {
    await this.auditoriaService.registrarAccion(
      'LISTAR_USUARIOS',
      'Consulta de todos los usuarios',
    );
    return this.prisma.usuario.findMany({
      include: {
        area: true,
        rol: true,
      },
    });
  }

  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      include: {
        area: true,
        rol: true,
      },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    await this.auditoriaService.registrarAccion(
      'CONSULTAR_USUARIO',
      `Consulta del usuario ${usuario.nombre} ${usuario.apellido}`,
    );
    return usuario;
  }

  async create(createUsuarioDto: CreateUsuarioDto) {
    // Verificar si el email ya existe
    const existingUser = await this.prisma.usuario.findUnique({
      where: { email: createUsuarioDto.email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(createUsuarioDto.contraseña, 10);

    const nuevoUsuario = await this.prisma.usuario.create({
      data: {
        ...createUsuarioDto,
        contraseña: hashedPassword,
      },
      include: {
        area: true,
        rol: true,
      },
    });

    await this.auditoriaService.registrarAccion(
      'CREAR_USUARIO',
      `Usuario creado: ${nuevoUsuario.nombre} ${nuevoUsuario.apellido} (${nuevoUsuario.email})`,
    );

    return nuevoUsuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    // Si se actualiza el email, verificar que no exista
    if (updateUsuarioDto.email) {
      const existingUser = await this.prisma.usuario.findUnique({
        where: { email: updateUsuarioDto.email },
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('El email ya está registrado');
      }
    }

    // Si se actualiza la contraseña, encriptarla
    if (updateUsuarioDto.contraseña) {
      updateUsuarioDto.contraseña = await bcrypt.hash(
        updateUsuarioDto.contraseña,
        10,
      );
    }

    const usuarioActualizado = await this.prisma.usuario.update({
      where: { id },
      data: updateUsuarioDto,
      include: {
        area: true,
        rol: true,
      },
    });

    await this.auditoriaService.registrarAccion(
      'ACTUALIZAR_USUARIO',
      `Usuario actualizado: ${usuarioActualizado.nombre} ${usuarioActualizado.apellido}`,
    );

    return usuarioActualizado;
  }

  async remove(id: number) {
    const usuario = await this.findOne(id); // Verificar que existe

    const usuarioEliminado = await this.prisma.usuario.delete({
      where: { id },
    });

    await this.auditoriaService.registrarAccion(
      'ELIMINAR_USUARIO',
      `Usuario eliminado: ${usuario.nombre} ${usuario.apellido} (${usuario.email})`,
    );

    return usuarioEliminado;
  }

  async assignRol(id: number, id_rol: number) {
    const usuario = await this.findOne(id); // Verificar que existe

    const usuarioActualizado = await this.prisma.usuario.update({
      where: { id },
      data: { id_rol },
      include: {
        area: true,
        rol: true,
      },
    });

    await this.auditoriaService.registrarAccion(
      'ASIGNAR_ROL',
      `Rol asignado al usuario ${usuario.nombre} ${usuario.apellido}. Nuevo rol ID: ${id_rol}`,
    );

    return usuarioActualizado;
  }

  async assignArea(id: number, id_area: number) {
    const usuario = await this.findOne(id); // Verificar que existe

    const usuarioActualizado = await this.prisma.usuario.update({
      where: { id },
      data: { id_area },
      include: {
        area: true,
        rol: true,
      },
    });

    await this.auditoriaService.registrarAccion(
      'ASIGNAR_AREA',
      `Área asignada al usuario ${usuario.nombre} ${usuario.apellido}. Nueva área ID: ${id_area}`,
    );

    return usuarioActualizado;
  }
}
