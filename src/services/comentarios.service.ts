import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { RequestContextService } from './request-context.service';

@Injectable()
export class ComentariosService {
  constructor(
    private prisma: PrismaService,
    private requestContext: RequestContextService,
  ) {}

  async create(data: { id_actividad: number; comentario: string }) {
    const userId = this.requestContext.getUserId();
    
    if (!userId) {
      throw new Error('Usuario no autenticado');
    }

    return this.prisma.comentario.create({
      data: {
        id_actividad: data.id_actividad,
        comentario: data.comentario,
        id_supervisor: userId, // Usar id_supervisor como está en la base de datos
        fecha_comentario: new Date(), // Agregar fecha
      },
      include: {
        usuario: true, // El mapeo ya está correcto en el schema
        actividad: true,
      },
    });
  }

  async findByActividad(id_actividad: number) {
    return this.prisma.comentario.findMany({
      where: { id_actividad },
      include: {
        usuario: { // Cambiar de supervisor a usuario
          select: {
            id: true,
            nombre: true,
            apellido: true,
          },
        },
      },
      orderBy: { fecha_comentario: 'desc' },
    });
  }

  async findByJornada(jornadaId: number) {
    return this.prisma.comentario.findMany({
      where: {
        actividad: {
          id_jornada: jornadaId,
        },
      },
      include: {
        usuario: { // Cambiar de supervisor a usuario
          select: {
            id: true,
            nombre: true,
            apellido: true,
          },
        },
        actividad: {
          select: {
            id: true,
            tarea: true,
          },
        },
      },
      orderBy: { fecha_comentario: 'desc' },
    });
  }
}
