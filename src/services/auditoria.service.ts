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
    console.log('🔍 AuditoriaService.obtenerAuditoriasPorFecha:');
    console.log('   Buscando entre:', fechaInicio.toISOString(), 'y', fechaFin.toISOString());
    
    // Primero intentar con un rango extendido para manejar zonas horarias
    // Extender 12 horas hacia atrás y adelante para cubrir diferencias de zona horaria
    const fechaInicioExtendida = new Date(fechaInicio.getTime() - 12 * 60 * 60 * 1000);
    const fechaFinExtendida = new Date(fechaFin.getTime() + 12 * 60 * 60 * 1000);
    
    console.log('   Buscando con rango extendido entre:', fechaInicioExtendida.toISOString(), 'y', fechaFinExtendida.toISOString());
    
    const result = await this.prisma.auditoria.findMany({
      where: {
        fecha: {
          gte: fechaInicioExtendida,
          lte: fechaFinExtendida,
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
    
    console.log('   Resultados encontrados:', result.length);
    if (result.length > 0) {
      console.log('   Primera fecha encontrada:', result[0].fecha);
      console.log('   Última fecha encontrada:', result[result.length - 1].fecha);
      
      // Filtrar los resultados para que solo incluyan el día solicitado en hora local
      const fechaInicioLocal = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), fechaInicio.getDate());
      const fechaFinLocal = new Date(fechaFin.getFullYear(), fechaFin.getMonth(), fechaFin.getDate(), 23, 59, 59, 999);
      
      const resultadosFiltrados = result.filter(audit => {
        const fechaAudit = new Date(audit.fecha);
        const fechaAuditLocal = new Date(fechaAudit.getFullYear(), fechaAudit.getMonth(), fechaAudit.getDate());
        return fechaAuditLocal >= fechaInicioLocal && fechaAuditLocal <= new Date(fechaFinLocal.getFullYear(), fechaFinLocal.getMonth(), fechaFinLocal.getDate());
      });
      
      console.log('   Resultados después del filtro local:', resultadosFiltrados.length);
      return resultadosFiltrados;
    }
    
    return result;
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
