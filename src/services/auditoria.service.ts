import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { RequestContextService } from './request-context.service';

@Injectable()
export class AuditoriaService {
  constructor(
    private prisma: PrismaService,
    private requestContext: RequestContextService,
  ) {}

  async registrarAccion(accion: string, descripcion?: string, userId?: number) {
    try {
      const id_usuario = userId || this.requestContext.getUserId();

      return await this.prisma.auditoria.create({
        data: {
          id_usuario,
          accion,
          descripcion,
        },
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              apellido: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      // En caso de error, registrar en logs pero no fallar la operación principal
      console.error('Error al registrar auditoría:', error);
    }
  }

  async obtenerTodasLasAuditorias() {
    return this.prisma.auditoria.findMany({
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
          },
        },
      },
      orderBy: { fecha: 'desc' },
    });
  }

  async obtenerAuditoriasPorUsuario(usuarioId: number) {
    return this.prisma.auditoria.findMany({
      where: { id_usuario: usuarioId },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
          },
        },
      },
      orderBy: { fecha: 'desc' },
    });
  }

  async obtenerAuditoriasPorFecha(fechaInicio: Date, fechaFin: Date) {
    return this.prisma.auditoria.findMany({
      where: {
        fecha: {
          gte: fechaInicio,
          lte: fechaFin,
        },
      },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
          },
        },
      },
      orderBy: { fecha: 'desc' },
    });
  }
}
