import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { RequestContextService } from './request-context.service';
import { CreateComentarioDto } from '../dto/comentarios/create-comentario.dto';

@Injectable()
export class ComentariosService {
  constructor(
    private prisma: PrismaService,
    private requestContext: RequestContextService,
  ) {}

  async create(createComentarioDto: CreateComentarioDto) {
    const userId = this.requestContext.getUserId();

    // Verificar que la actividad existe
    const actividad = await this.prisma.actividad.findUnique({
      where: { id: createComentarioDto.id_actividad },
      include: {
        jornada: true,
      },
    });

    if (!actividad) {
      throw new NotFoundException(
        `Actividad con ID ${createComentarioDto.id_actividad} no encontrada`,
      );
    }

    // Verificar que el usuario es el supervisor de la jornada
    if (actividad.jornada.id_supervisor !== userId) {
      throw new ForbiddenException(
        'Solo el supervisor puede crear comentarios en esta actividad',
      );
    }

    return this.prisma.comentario.create({
      data: {
        id_actividad: createComentarioDto.id_actividad,
        id_supervisor: userId,
        comentario: createComentarioDto.comentario,
        fecha_comentario: new Date(),
      },
      include: {
        actividad: {
          include: {
            jornada: {
              include: {
                usuario: true,
              },
            },
            estado: true,
          },
        },
        supervisor: true,
      },
    });
  }

  async findByActividad(actividadId: number) {
    const userId = this.requestContext.getUserId();

    // Verificar que la actividad existe
    const actividad = await this.prisma.actividad.findUnique({
      where: { id: actividadId },
      include: {
        jornada: true,
      },
    });

    if (!actividad) {
      throw new NotFoundException(
        `Actividad con ID ${actividadId} no encontrada`,
      );
    }

    // Verificar que el usuario tiene permisos (es el dueño de la jornada o el supervisor)
    if (
      actividad.jornada.id_usuario !== userId &&
      actividad.jornada.id_supervisor !== userId
    ) {
      throw new ForbiddenException(
        'No tienes permisos para ver los comentarios de esta actividad',
      );
    }

    return this.prisma.comentario.findMany({
      where: { id_actividad: actividadId },
      include: {
        supervisor: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
          },
        },
        actividad: {
          include: {
            estado: true,
          },
        },
      },
      orderBy: { fecha_comentario: 'desc' },
    });
  }

  async findByJornada(jornadaId: number) {
    const userId = this.requestContext.getUserId();

    // Verificar que la jornada existe
    const jornada = await this.prisma.jornada.findUnique({
      where: { id_jornada: jornadaId },
    });

    if (!jornada) {
      throw new NotFoundException(`Jornada con ID ${jornadaId} no encontrada`);
    }

    // Verificar que el usuario tiene permisos (es el dueño de la jornada o el supervisor)
    if (jornada.id_usuario !== userId && jornada.id_supervisor !== userId) {
      throw new ForbiddenException(
        'No tienes permisos para ver los comentarios de esta jornada',
      );
    }

    return this.prisma.comentario.findMany({
      where: {
        actividad: {
          id_jornada: jornadaId,
        },
      },
      include: {
        supervisor: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
          },
        },
        actividad: {
          include: {
            estado: true,
          },
        },
      },
      orderBy: { fecha_comentario: 'desc' },
    });
  }
}
