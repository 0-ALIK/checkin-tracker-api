import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AuditoriaService } from './auditoria.service';
import { CreateAreaDto } from '../dto/areas/create-area.dto';
import { UpdateAreaDto } from '../dto/areas/update-area.dto';

@Injectable()
export class AreasService {
  constructor(
    private prisma: PrismaService,
    private auditoriaService: AuditoriaService,
  ) {}

  async create(createAreaDto: CreateAreaDto) {
    // Verificar si el nombre ya existe
    const existingArea = await this.prisma.area.findFirst({
      where: { nombre_area: createAreaDto.nombre_area },
    });

    if (existingArea) {
      throw new ConflictException('El nombre del área ya existe');
    }

    const nuevaArea = await this.prisma.area.create({
      data: createAreaDto,
    });

    await this.auditoriaService.registrarAccion(
      'CREAR_AREA',
      `Área creada: ${nuevaArea.nombre_area}`,
    );

    return nuevaArea;
  }

  async findAll() {
    await this.auditoriaService.registrarAccion(
      'LISTAR_AREAS',
      'Consulta de todas las áreas',
    );

    return this.prisma.area.findMany({
      include: {
        _count: {
          select: { usuarios: true },
        },
      },
    });
  }

  async findOne(id: number) {
    const area = await this.prisma.area.findUnique({
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

    if (!area) {
      throw new NotFoundException(`Área con ID ${id} no encontrada`);
    }

    await this.auditoriaService.registrarAccion(
      'CONSULTAR_AREA',
      `Consulta del área: ${area.nombre_area}`,
    );

    return area;
  }

  async update(id: number, updateAreaDto: UpdateAreaDto) {
    const areaAnterior = await this.findOne(id); // Verificar que existe

    // Si se actualiza el nombre, verificar que no exista
    if (updateAreaDto.nombre_area) {
      const existingArea = await this.prisma.area.findFirst({
        where: {
          nombre_area: updateAreaDto.nombre_area,
          NOT: { id },
        },
      });

      if (existingArea) {
        throw new ConflictException('El nombre del área ya existe');
      }
    }

    const areaActualizada = await this.prisma.area.update({
      where: { id },
      data: updateAreaDto,
    });

    await this.auditoriaService.registrarAccion(
      'ACTUALIZAR_AREA',
      `Área actualizada: ${areaAnterior.nombre_area} → ${
        areaActualizada.nombre_area || areaAnterior.nombre_area
      }`,
    );

    return areaActualizada;
  }

  async remove(id: number) {
    const area = await this.findOne(id); // Verificar que existe

    // Verificar si tiene usuarios asociados
    if (area.usuarios.length > 0) {
      throw new ConflictException(
        'No se puede eliminar el área porque tiene usuarios asociados',
      );
    }

    const areaEliminada = await this.prisma.area.delete({
      where: { id },
    });

    await this.auditoriaService.registrarAccion(
      'ELIMINAR_AREA',
      `Área eliminada: ${area.nombre_area}`,
    );

    return areaEliminada;
  }
}
