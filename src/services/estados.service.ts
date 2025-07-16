import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AuditoriaService } from './auditoria.service';
import { CreateEstadoDto } from '../dto/estados/create-estado.dto';
import { UpdateEstadoDto } from '../dto/estados/update-estado.dto';

@Injectable()
export class EstadosService {
  constructor(
    private prisma: PrismaService,
    private auditoriaService: AuditoriaService,
  ) {}

  async create(createEstadoDto: CreateEstadoDto) {
    // Verificar si el nombre ya existe
    const existingEstado = await this.prisma.estado.findFirst({
      where: { nombre_estado: createEstadoDto.nombre_estado },
    });

    if (existingEstado) {
      throw new ConflictException('El nombre del estado ya existe');
    }

    const nuevoEstado = await this.prisma.estado.create({
      data: createEstadoDto,
    });

    await this.auditoriaService.registrarAccion(
      'CREAR_ESTADO',
      `Estado creado: ${nuevoEstado.nombre_estado}`,
    );

    return nuevoEstado;
  }

  async findAll() {
    await this.auditoriaService.registrarAccion(
      'LISTAR_ESTADOS',
      'Consulta de todos los estados',
    );

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

    await this.auditoriaService.registrarAccion(
      'CONSULTAR_ESTADO',
      `Consulta del estado: ${estado.nombre_estado}`,
    );

    return estado;
  }

  async update(id: number, updateEstadoDto: UpdateEstadoDto) {
    const estadoAnterior = await this.findOne(id); // Verificar que existe

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

    const estadoActualizado = await this.prisma.estado.update({
      where: { id },
      data: updateEstadoDto,
    });

    await this.auditoriaService.registrarAccion(
      'ACTUALIZAR_ESTADO',
      `Estado actualizado: ${estadoAnterior.nombre_estado} → ${
        estadoActualizado.nombre_estado || estadoAnterior.nombre_estado
      }`,
    );

    return estadoActualizado;
  }

  async remove(id: number) {
    const estado = await this.findOne(id); // Verificar que existe

    // Verificar si tiene actividades asociadas
    if (estado.actividades.length > 0) {
      throw new ConflictException(
        'No se puede eliminar el estado porque tiene actividades asociadas',
      );
    }

    const estadoEliminado = await this.prisma.estado.delete({
      where: { id },
    });

    await this.auditoriaService.registrarAccion(
      'ELIMINAR_ESTADO',
      `Estado eliminado: ${estado.nombre_estado}`,
    );

    return estadoEliminado;
  }
}
