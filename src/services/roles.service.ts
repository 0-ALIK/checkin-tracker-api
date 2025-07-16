import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AuditoriaService } from './auditoria.service';
import { CreateRolDto } from '../dto/roles/create-rol.dto';
import { UpdateRolDto } from '../dto/roles/update-rol.dto';

@Injectable()
export class RolesService {
  constructor(
    private prisma: PrismaService,
    private auditoriaService: AuditoriaService,
  ) {}

  async create(createRolDto: CreateRolDto) {
    // Verificar si el nombre ya existe
    const existingRol = await this.prisma.rol.findFirst({
      where: { nombre_rol: createRolDto.nombre_rol },
    });

    if (existingRol) {
      throw new ConflictException('El nombre del rol ya existe');
    }

    const nuevoRol = await this.prisma.rol.create({
      data: createRolDto,
    });

    await this.auditoriaService.registrarAccion(
      'CREAR_ROL',
      `Rol creado: ${nuevoRol.nombre_rol}`,
    );

    return nuevoRol;
  }

  async findAll() {
    await this.auditoriaService.registrarAccion(
      'LISTAR_ROLES',
      'Consulta de todos los roles',
    );

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

    await this.auditoriaService.registrarAccion(
      'CONSULTAR_ROL',
      `Consulta del rol: ${rol.nombre_rol}`,
    );

    return rol;
  }

  async update(id: number, updateRolDto: UpdateRolDto) {
    const rolAnterior = await this.findOne(id); // Verificar que existe

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

    const rolActualizado = await this.prisma.rol.update({
      where: { id },
      data: updateRolDto,
    });

    await this.auditoriaService.registrarAccion(
      'ACTUALIZAR_ROL',
      `Rol actualizado: ${rolAnterior.nombre_rol} → ${
        rolActualizado.nombre_rol || rolAnterior.nombre_rol
      }`,
    );

    return rolActualizado;
  }

  async remove(id: number) {
    const rol = await this.findOne(id); // Verificar que existe

    // Verificar si tiene usuarios asociados
    if (rol.usuarios.length > 0) {
      throw new ConflictException(
        'No se puede eliminar el rol porque tiene usuarios asociados',
      );
    }

    const rolEliminado = await this.prisma.rol.delete({
      where: { id },
    });

    await this.auditoriaService.registrarAccion(
      'ELIMINAR_ROL',
      `Rol eliminado: ${rol.nombre_rol}`,
    );

    return rolEliminado;
  }
}
