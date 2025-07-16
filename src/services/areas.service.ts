import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateAreaDto } from '../dto/areas/create-area.dto';
import { UpdateAreaDto } from '../dto/areas/update-area.dto';

@Injectable()
export class AreasService {
  constructor(private prisma: PrismaService) {}

  async create(createAreaDto: CreateAreaDto) {
    // Verificar si el nombre ya existe
    const existingArea = await this.prisma.area.findFirst({
      where: { nombre_area: createAreaDto.nombre_area },
    });

    if (existingArea) {
      throw new ConflictException('El nombre del área ya existe');
    }

    return this.prisma.area.create({
      data: createAreaDto,
    });
  }

  async findAll() {
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

    return area;
  }

  async update(id: number, updateAreaDto: UpdateAreaDto) {
    await this.findOne(id); // Verificar que existe

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

    return this.prisma.area.update({
      where: { id },
      data: updateAreaDto,
    });
  }

  async remove(id: number) {
    const area = await this.findOne(id); // Verificar que existe

    // Verificar si tiene usuarios asociados
    if (area.usuarios.length > 0) {
      throw new ConflictException(
        'No se puede eliminar el área porque tiene usuarios asociados',
      );
    }

    return this.prisma.area.delete({
      where: { id },
    });
  }
}
