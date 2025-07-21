import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AuditoriaService } from './auditoria.service';
import { RequestContextService } from './request-context.service';
import { CreateActividadDto } from '../dto/actividades/create-actividad.dto';
import { UpdateActividadDto } from '../dto/actividades/update-actividad.dto';

@Injectable()
export class ActividadesService {
  constructor(
    private prisma: PrismaService,
    private requestContext: RequestContextService,
    private auditoriaService: AuditoriaService,
  ) {}

  async create(createActividadDto: CreateActividadDto) {
    const userId = this.requestContext.getUserId();

    // Verificar que la jornada existe y pertenece al usuario autenticado
    const jornada = await this.prisma.jornada.findUnique({
      where: { id_jornada: createActividadDto.id_jornada },
    });

    if (!jornada) {
      throw new NotFoundException(
        `Jornada con ID ${createActividadDto.id_jornada} no encontrada`,
      );
    }

    if (jornada.id_usuario !== userId) {
      throw new ForbiddenException(
        'No tienes permisos para crear actividades en esta jornada',
      );
    }

    const nuevaActividad = await this.prisma.actividad.create({
      data: createActividadDto as any, // Temporal fix para compatibilidad
      include: {
        jornada: {
          include: {
            usuario: true,
          },
        },
        estado: true,
        comentarios: {
          include: {
            usuario: true, // Cambiar de supervisor a usuario
          },
        },
      },
    });

    await this.auditoriaService.registrarAccion(
      'CREAR_ACTIVIDAD',
      `Actividad creada: ${nuevaActividad.tarea} (Jornada ID: ${createActividadDto.id_jornada})`,
      userId,
    );

    return nuevaActividad;
  }

  async update(id: number, updateActividadDto: UpdateActividadDto) {
    const userId = this.requestContext.getUserId();

    const actividad = await this.prisma.actividad.findUnique({
      where: { id },
      include: {
        jornada: true,
      },
    });

    if (!actividad) {
      throw new NotFoundException(`Actividad con ID ${id} no encontrada`);
    }

    if (actividad.jornada.id_usuario !== userId) {
      throw new ForbiddenException(
        'No tienes permisos para editar esta actividad',
      );
    }

    const actividadActualizada = await this.prisma.actividad.update({
      where: { id },
      data: updateActividadDto,
      include: {
        jornada: {
          include: {
            usuario: true,
          },
        },
        estado: true,
        comentarios: {
          include: {
            usuario: true, // Cambiar de supervisor a usuario
          },
        },
      },
    });

    await this.auditoriaService.registrarAccion(
      'ACTUALIZAR_ACTIVIDAD',
      `Actividad actualizada: ${actividad.tarea} (ID: ${id})`,
      userId,
    );

    return actividadActualizada;
  }

  async findByJornada(jornadaId: number) {
    const userId = this.requestContext.getUserId();

    // Verificar que la jornada existe y el usuario tiene permisos para verla
    const jornada = await this.prisma.jornada.findUnique({
      where: { id_jornada: jornadaId },
    });

    if (!jornada) {
      throw new NotFoundException(`Jornada con ID ${jornadaId} no encontrada`);
    }

    // Permitir ver si es el dueño de la jornada o el supervisor
    if (jornada.id_usuario !== userId && jornada.id_supervisor !== userId) {
      throw new ForbiddenException(
        'No tienes permisos para ver las actividades de esta jornada',
      );
    }

    await this.auditoriaService.registrarAccion(
      'CONSULTAR_ACTIVIDADES_JORNADA',
      `Consulta de actividades de la jornada ID: ${jornadaId}`,
      userId,
    );

    return this.prisma.actividad.findMany({
      where: { id_jornada: jornadaId },
      include: {
        jornada: {
          include: {
            usuario: true,
          },
        },
        estado: true,
        comentarios: {
          include: {
            usuario: true, // Cambiar de supervisor a usuario
          },
        },
      },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const userId = this.requestContext.getUserId();

    const actividad = await this.prisma.actividad.findUnique({
      where: { id },
      include: {
        jornada: {
          include: {
            usuario: true,
          },
        },
        estado: true,
        comentarios: {
          include: {
            usuario: true, // Cambiar de supervisor a usuario
          },
        },
      },
    });

    if (!actividad) {
      throw new NotFoundException(`Actividad con ID ${id} no encontrada`);
    }

    // Permitir ver si es el dueño de la jornada o el supervisor
    if (
      actividad.jornada.id_usuario !== userId &&
      actividad.jornada.id_supervisor !== userId
    ) {
      throw new ForbiddenException(
        'No tienes permisos para ver esta actividad',
      );
    }

    await this.auditoriaService.registrarAccion(
      'CONSULTAR_ACTIVIDAD',
      `Consulta de actividad: ${actividad.tarea} (ID: ${id})`,
      userId,
    );

    return actividad;
  }
}
