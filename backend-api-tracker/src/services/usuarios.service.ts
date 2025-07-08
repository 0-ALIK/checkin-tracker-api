import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateUsuarioDto } from '../dto/usuarios/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/usuarios/update-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
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

    return this.prisma.usuario.create({
      data: {
        ...createUsuarioDto,
        contraseña: hashedPassword,
      },
      include: {
        area: true,
        rol: true,
      },
    });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    await this.findOne(id); // Verificar que existe

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

    return this.prisma.usuario.update({
      where: { id },
      data: updateUsuarioDto,
      include: {
        area: true,
        rol: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Verificar que existe

    return this.prisma.usuario.delete({
      where: { id },
    });
  }

  async assignRol(id: number, id_rol: number) {
    await this.findOne(id); // Verificar que existe

    return this.prisma.usuario.update({
      where: { id },
      data: { id_rol },
      include: {
        area: true,
        rol: true,
      },
    });
  }

  async assignArea(id: number, id_area: number) {
    await this.findOne(id); // Verificar que existe

    return this.prisma.usuario.update({
      where: { id },
      data: { id_area },
      include: {
        area: true,
        rol: true,
      },
    });
  }
}
