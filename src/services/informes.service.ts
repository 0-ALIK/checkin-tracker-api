import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { EmailService } from './email.service';
import { AuditoriaService } from './auditoria.service';

@Injectable()
export class InformesService {
  private readonly logger = new Logger(InformesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  // Método movido desde el cron - ahora es llamado por CronService
  async enviarInformeDiarioAutomatico() {
    this.logger.log('Procesando envío de informes diarios automáticos...');

    try {
      const informes = await this.obtenerInformesDiarios();

      // Enviar informes individuales a usuarios
      await this.emailService.enviarInformeDiario(informes);

      // Enviar informe gerencial a supervisores/gerentes
      const emailsGerenciales = await this.obtenerEmailsGerenciales();
      await this.emailService.enviarInformeGerencial(
        informes,
        emailsGerenciales,
      );

      // Registrar en auditoría
      await this.auditoriaService.registrarAccion(
        'ENVIO_INFORME_AUTOMATICO',
        `Informes diarios enviados automáticamente. Total usuarios: ${informes.length}`,
        1, // ID del sistema o admin
      );

      this.logger.log(
        `Informes diarios enviados exitosamente a ${informes.length} usuarios`,
      );

      return {
        exito: true,
        totalUsuarios: informes.length,
        mensaje: 'Informes enviados exitosamente',
      };
    } catch (error) {
      this.logger.error('Error enviando informes diarios:', error);

      // Registrar error en auditoría
      await this.auditoriaService.registrarAccion(
        'ERROR_INFORME_AUTOMATICO',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Error enviando informes automáticos: ${error.message}`,
        1,
      );

      throw error;
    }
  }

  async obtenerInformesDiarios(fecha?: Date) {
    const fechaConsulta = fecha || new Date();
    const inicioDia = new Date(fechaConsulta);
    inicioDia.setHours(0, 0, 0, 0);

    const finDia = new Date(fechaConsulta);
    finDia.setHours(23, 59, 59, 999);

    const usuarios = await this.prisma.usuario.findMany({
      include: {
        jornadas: {
          where: {
            fecha: {
              gte: inicioDia,
              lte: finDia,
            },
          },
          include: {
            actividades: {
              include: {
                estado: true,
              },
            },
          },
        },
      },
    });

    return usuarios.map((usuario) => ({
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
      },
      jornadas: usuario.jornadas,
    }));
  }

  async obtenerEmailsGerenciales(): Promise<string[]> {
    // Obtener usuarios con roles de supervisor/gerente
    const supervisores = await this.prisma.usuario.findMany({
      where: {
        rol: {
          nombre_rol: {
            in: ['Supervisor', 'Gerente', 'Administrador'],
          },
        },
      },
      select: {
        email: true,
      },
    });

    return supervisores.map((s) => s.email);
  }

  // Método manual para enviar informes (útil para testing)
  async enviarInformeDiarioManual(fecha?: Date) {
    const informes = await this.obtenerInformesDiarios(fecha);
    await this.emailService.enviarInformeDiario(informes);

    const emailsGerenciales = await this.obtenerEmailsGerenciales();
    await this.emailService.enviarInformeGerencial(informes, emailsGerenciales);

    await this.auditoriaService.registrarAccion(
      'ENVIO_INFORME_MANUAL',
      `Informes diarios enviados manualmente. Total usuarios: ${informes.length}`,
    );

    return {
      mensaje: 'Informes enviados exitosamente',
      totalUsuarios: informes.length,
      fecha: fecha || new Date(),
    };
  }

  // Obtener estadísticas para el dashboard
  async obtenerEstadisticasDiarias(fecha?: Date) {
    const fechaConsulta = fecha || new Date();
    const inicioDia = new Date(fechaConsulta);
    inicioDia.setHours(0, 0, 0, 0);

    const finDia = new Date(fechaConsulta);
    finDia.setHours(23, 59, 59, 999);

    const [
      totalUsuarios,
      usuariosActivos,
      totalJornadas,
      jornadasAprobadas,
      totalActividades,
      actividadesCompletadas,
    ] = await Promise.all([
      this.prisma.usuario.count(),
      this.prisma.usuario.count({
        where: {
          jornadas: {
            some: {
              fecha: {
                gte: inicioDia,
                lte: finDia,
              },
            },
          },
        },
      }),
      this.prisma.jornada.count({
        where: {
          fecha: {
            gte: inicioDia,
            lte: finDia,
          },
        },
      }),
      this.prisma.jornada.count({
        where: {
          fecha: {
            gte: inicioDia,
            lte: finDia,
          },
          aprobado: true,
        },
      }),
      this.prisma.actividad.count({
        where: {
          jornada: {
            fecha: {
              gte: inicioDia,
              lte: finDia,
            },
          },
        },
      }),
      this.prisma.actividad.count({
        where: {
          jornada: {
            fecha: {
              gte: inicioDia,
              lte: finDia,
            },
          },
          estado: {
            nombre_estado: {
              contains: 'completad',
              mode: 'insensitive',
            },
          },
        },
      }),
    ]);

    return {
      fecha: fechaConsulta,
      usuarios: {
        total: totalUsuarios,
        activos: usuariosActivos,
        porcentajeActividad:
          totalUsuarios > 0
            ? Math.round((usuariosActivos / totalUsuarios) * 100)
            : 0,
      },
      jornadas: {
        total: totalJornadas,
        aprobadas: jornadasAprobadas,
        porcentajeAprobacion:
          totalJornadas > 0
            ? Math.round((jornadasAprobadas / totalJornadas) * 100)
            : 0,
      },
      actividades: {
        total: totalActividades,
        completadas: actividadesCompletadas,
        porcentajeCompletado:
          totalActividades > 0
            ? Math.round((actividadesCompletadas / totalActividades) * 100)
            : 0,
      },
    };
  }
}
