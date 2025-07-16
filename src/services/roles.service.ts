import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateRolDto } from '../dto/roles/create-rol.dto';
import { UpdateRolDto } from '../dto/roles/update-rol.dto';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async create(createRolDto: CreateRolDto) {
    // Verificar si el nombre ya existe
    const existingRol = await this.prisma.rol.findFirst({
      where: { nombre_rol: createRolDto.nombre_rol },
    });

    if (existingRol) {
      throw new ConflictException('El nombre del rol ya existe');
    }

    return this.prisma.rol.create({
      data: createRolDto,
    });
  }

  async findAll() {
    return this.prisma.rol.findMany({
      include: {
        _count: {
          select: { usuarios: true },
        },
      },
    });
  }

  async findOne(id: number) {
    const rol = await this.prisma.rol.findUnique({
      where: { id },
      include: {
        usuarios: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
          },
        },
      },
    });

    if (!rol) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }

    return rol;
  }

  async update(id: number, updateRolDto: UpdateRolDto) {
    await this.findOne(id); // Verificar que existe

    // Si se actualiza el nombre, verificar que no exista
    if (updateRolDto.nombre_rol) {
      const existingRol = await this.prisma.rol.findFirst({
        where: {
          nombre_rol: updateRolDto.nombre_rol,
          NOT: { id },
        },
      });

      if (existingRol) {
        throw new ConflictException('El nombre del rol ya existe');
      }
    }

    return this.prisma.rol.update({
      where: { id },
      data: updateRolDto,
    });
  }

  async remove(id: number) {
    const rol = await this.findOne(id); // Verificar que existe

    // Verificar si tiene usuarios asociados
    if (rol.usuarios.length > 0) {
      throw new ConflictException(
        'No se puede eliminar el rol porque tiene usuarios asociados',
      );
    }

    return this.prisma.rol.delete({
      where: { id },
    });
  }
}
