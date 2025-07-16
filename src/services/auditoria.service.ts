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
      let id_usuario: number;

      if (userId) {
        id_usuario = userId;
      } else {
        try {
          id_usuario = this.requestContext.getUserId();
        } catch {
          // Si no hay contexto de usuario (ej: cron jobs), usar ID de sistema
          id_usuario = 1; // ID del usuario del sistema
        }
      }

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

  // Nuevo método para limpieza automática
  async limpiarAuditoriasAntiguas(fechaLimite: Date) {
    return this.prisma.auditoria.deleteMany({
      where: {
        fecha: {
          lt: fechaLimite,
        },
      },
    });
  }
}
