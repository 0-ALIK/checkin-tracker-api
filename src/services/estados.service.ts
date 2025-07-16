import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateEstadoDto } from '../dto/estados/create-estado.dto';
import { UpdateEstadoDto } from '../dto/estados/update-estado.dto';

@Injectable()
export class EstadosService {
  constructor(private prisma: PrismaService) {}

  async create(createEstadoDto: CreateEstadoDto) {
    // Verificar si el nombre ya existe
    const existingEstado = await this.prisma.estado.findFirst({
      where: { nombre_estado: createEstadoDto.nombre_estado },
    });

    if (existingEstado) {
      throw new ConflictException('El nombre del estado ya existe');
    }

    return this.prisma.estado.create({
      data: createEstadoDto,
    });
  }

  async findAll() {
    return this.prisma.estado.findMany({
      include: {
        _count: {
          select: { actividades: true },
        },
      },
    });
  }

  async findOne(id: number) {
    const estado = await this.prisma.estado.findUnique({
      where: { id },
      include: {
        actividades: {
          include: {
            jornada: {
              include: {
                usuario: true,
              },
            },
          },
        },
      },
    });

    if (!estado) {
      throw new NotFoundException(`Estado con ID ${id} no encontrado`);
    }

    return estado;
  }

  async update(id: number, updateEstadoDto: UpdateEstadoDto) {
    await this.findOne(id); // Verificar que existe

    // Si se actualiza el nombre, verificar que no exista
    if (updateEstadoDto.nombre_estado) {
      const existingEstado = await this.prisma.estado.findFirst({
        where: {
          nombre_estado: updateEstadoDto.nombre_estado,
          NOT: { id },
        },
      });

      if (existingEstado) {
        throw new ConflictException('El nombre del estado ya existe');
      }
    }

    return this.prisma.estado.update({
      where: { id },
      data: updateEstadoDto,
    });
  }

  async remove(id: number) {
    const estado = await this.findOne(id); // Verificar que existe

    // Verificar si tiene actividades asociadas
    if (estado.actividades.length > 0) {
      throw new ConflictException(
        'No se puede eliminar el estado porque tiene actividades asociadas',
      );
    }

    return this.prisma.estado.delete({
      where: { id },
    });
  }
}
