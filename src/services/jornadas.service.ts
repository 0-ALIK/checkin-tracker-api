import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AuditoriaService } from './auditoria.service';
import { EmailService } from './email.service';
import { CheckinDto } from '../dto/jornadas/checkin.dto';
import { CheckoutDto } from '../dto/jornadas/checkout.dto';

@Injectable()
export class JornadasService {
  constructor(
    private prisma: PrismaService,
    private auditoriaService: AuditoriaService,
    private emailService: EmailService,
  ) {}

  async checkin(checkinDto: CheckinDto, id_usuario: number) {
    // Verificar si ya existe un check-in para esta fecha
    const fechaInicio = new Date(checkinDto.fecha);
    fechaInicio.setHours(0, 0, 0, 0);
    const fechaFin = new Date(fechaInicio);
    fechaFin.setHours(23, 59, 59, 999);

    /* const existingJornada = await this.prisma.jornada.findFirst({
      where: {
        id_usuario,
        fecha: {
          gte: fechaInicio,
          lte: fechaFin,
        },
      },
    });

    if (existingJornada) {
      throw new BadRequestException('Ya existe un check-in para esta fecha');
    } */

    // Buscar usuario
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: id_usuario },
      include: {
        area: true,
        rol: true,
      },
    });

    if (!usuario) {
      throw new BadRequestException('Usuario no encontrado');
    }

    // Buscar supervisores para enviar notificaciones (opcional)
    const supervisores = await this.prisma.usuario.findMany({
      where: {
        rol: {
          nombre_rol: 'Supervisor',
        },
      },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
      },
    });

    // Preparar datos para la jornada
    const jornadaData: any = {
      fecha: new Date(checkinDto.fecha),
      aprobado: false,
      id_usuario,
    };

    // Solo agregar supervisor si hay disponibles
    if (supervisores.length > 0) {
      jornadaData.id_supervisor = supervisores[0].id;
    }

    // Solo agregar observaciones si no están vacías
    if (checkinDto.comentario && checkinDto.comentario.trim()) {
      jornadaData.observaciones = checkinDto.comentario;
    }

    // Crear jornada
    const nuevaJornada = await this.prisma.jornada.create({
      data: jornadaData,
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
          },
        },
        supervisor: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
          },
        },
      },
    });

    // Crear actividades planificadas
    if (checkinDto.tareas && checkinDto.tareas.length > 0) {
      const actividadesPromises = checkinDto.tareas.map((tarea) =>
        this.prisma.actividad.create({
          data: {
            id_jornada: nuevaJornada.id_jornada,
            tarea: tarea.tarea,
            meta: tarea.meta,
            observaciones: tarea.observaciones || undefined,
            id_estado: 1,
          },
        }),
      );

      await Promise.all(actividadesPromises);
    }

    // Enviar email a TODOS los supervisores (opcional) - de forma asíncrona
    if (supervisores.length > 0) {
      // Ejecutar envío de emails sin bloquear la respuesta
      Promise.resolve().then(async () => {
        for (const supervisor of supervisores) {
          try {
            await this.emailService.enviarNotificacionCheckin(
              supervisor.email,
              `${usuario.nombre} ${usuario.apellido}`,
              nuevaJornada.fecha,
            );
          } catch (error) {
            console.error(`Error enviando email a ${supervisor.email}:`, error);
          }
        }
      });
    }

    await this.auditoriaService.registrarAccion(
      'CHECKIN',
      `Check-in registrado para la fecha ${checkinDto.fecha}`,
      id_usuario,
    );

    return nuevaJornada;
  }

  async checkout(checkoutDto: CheckoutDto) {
    const jornada = await this.prisma.jornada.findUnique({
      where: { id_jornada: checkoutDto.id_jornada },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
          },
        },
        supervisor: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
          },
        },
      },
    });

    if (!jornada) {
      throw new NotFoundException(
        `Jornada con ID ${checkoutDto.id_jornada} no encontrada`,
      );
    }

    if (jornada.hora_checkout) {
      throw new BadRequestException('Ya se realizó checkout en esta jornada');
    }

    const jornadaActualizada = await this.prisma.jornada.update({
      where: { id_jornada: checkoutDto.id_jornada },
      data: {
        hora_checkout: new Date(),
        observaciones: checkoutDto.observaciones || jornada.observaciones,
        aprobado: false, // Reset aprobación para checkout
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
        supervisor: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
          },
        },
      },
    });

    // Enviar email a todos los supervisores sobre checkout
    const supervisores = await this.prisma.usuario.findMany({
      where: {
        rol: {
          nombre_rol: 'Supervisor',
        },
      },
      select: {
        email: true,
      },
    });

    // Enviar email a supervisores de forma asíncrona sin bloquear la respuesta
    if (supervisores.length > 0 && jornadaActualizada.hora_checkout) {
      Promise.resolve().then(async () => {
        for (const supervisor of supervisores) {
          try {
            await this.emailService.enviarNotificacionCheckout(
              supervisor.email,
              `${jornada.usuario.nombre} ${jornada.usuario.apellido}`,
              jornadaActualizada.fecha,
              jornadaActualizada.hora_checkin,
              jornadaActualizada.hora_checkout!,
            );
          } catch (error) {
            console.error(`Error enviando email a ${supervisor.email}:`, error);
          }
        }
      });
    }

    await this.auditoriaService.registrarAccion(
      'CHECKOUT',
      `Check-out registrado para la jornada ${checkoutDto.id_jornada}`,
      jornada.id_usuario,
    );

    return jornadaActualizada;
  }

  // Nuevo método para que cualquier supervisor vea todas las jornadas de empleados
  async getJornadasForSupervisors() {
    return this.prisma.jornada.findMany({
      where: {
        usuario: {
          rol: {
            nombre_rol: 'Empleado', // Solo jornadas de empleados
          },
        },
      },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
            area: {
              select: {
                id: true,
                nombre_area: true,
              },
            },
          },
        },
        supervisor: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
          },
        },
        actividades: {
          include: {
            estado: true,
            comentarios: {
              include: {
                usuario: {
                  select: {
                    id: true,
                    nombre: true,
                    apellido: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { fecha: 'desc' },
    });
  }

  // Mantener el método original pero hacerlo más flexible
  async getJornadasBySupervisor(supervisorId: number) {
    // Si es supervisor, puede ver todas las jornadas de empleados
    const supervisor = await this.prisma.usuario.findUnique({
      where: { id: supervisorId },
      include: { rol: true },
    });

    if (!supervisor) {
      throw new NotFoundException('Supervisor no encontrado');
    }

    if (supervisor.rol.nombre_rol === 'Supervisor') {
      return this.getJornadasForSupervisors();
    }

    // Si no es supervisor, solo ve sus propias jornadas
    return this.getHistorialUsuario(supervisorId);
  }

  async getHistorialUsuario(usuarioId: number) {
    return this.prisma.jornada.findMany({
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
        supervisor: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
          },
        },
        actividades: {
          include: {
            estado: true,
            comentarios: {
              include: {
                usuario: {
                  select: {
                    id: true,
                    nombre: true,
                    apellido: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { fecha: 'desc' },
    });
  }

  async getJornadasPendientes() {
    return this.prisma.jornada.findMany({
      where: { 
        aprobado: false,
        usuario: {
          rol: {
            nombre_rol: 'Empleado',
          },
        },
      },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
            area: {
              select: {
                id: true,
                nombre_area: true,
              },
            },
          },
        },
        supervisor: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
          },
        },
        actividades: {
          include: {
            estado: true,
          },
        },
      },
      orderBy: { fecha: 'desc' },
    });
  }

  async getJornadasAprobadas() {
    return this.prisma.jornada.findMany({
      where: { 
        aprobado: true,
        usuario: {
          rol: {
            nombre_rol: 'Empleado',
          },
        },
      },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
            area: {
              select: {
                id: true,
                nombre_area: true,
              },
            },
          },
        },
        supervisor: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
          },
        },
        actividades: {
          include: {
            estado: true,
          },
        },
      },
      orderBy: { fecha: 'desc' },
    });
  }

  async aprobarJornada(id: number, tipo?: 'checkin' | 'checkout') {
    const jornada = await this.prisma.jornada.findUnique({
      where: { id_jornada: id },
      include: {
        usuario: true,
        actividades: true,
      },
    });

    if (!jornada) {
      throw new NotFoundException(`Jornada con ID ${id} no encontrada`);
    }

    if (jornada.aprobado && !jornada.hora_checkout) {
      throw new BadRequestException('El check-in ya está aprobado');
    }

    if (jornada.aprobado && jornada.hora_checkout) {
      throw new BadRequestException('El check-out ya está aprobado');
    }

    const jornadaAprobada = await this.prisma.jornada.update({
      where: { id_jornada: id },
      data: { aprobado: true },
      include: {
        usuario: true,
        supervisor: true,
        actividades: {
          include: {
            estado: true,
          },
        },
      },
    });

    const tipoAprobacion = jornada.hora_checkout ? 'CHECKOUT' : 'CHECKIN';
    
    await this.auditoriaService.registrarAccion(
      `APROBAR_${tipoAprobacion}`,
      `${tipoAprobacion} aprobado para jornada ID: ${id}`,
    );

    return jornadaAprobada;
  }

  async rechazarJornada(id: number, motivo: string) {
    const jornada = await this.prisma.jornada.findUnique({
      where: { id_jornada: id },
      include: { actividades: true },
    });

    if (!jornada) {
      throw new NotFoundException(`Jornada con ID ${id} no encontrada`);
    }

    // Crear una actividad con el motivo de rechazo
    await this.prisma.actividad.create({
      data: {
        id_jornada: id,
        tarea: 'Jornada rechazada',
        meta: 'N/A',
        id_estado: 1,
        observaciones: `Motivo de rechazo: ${motivo}`,
      },
    });

    const jornadaRechazada = await this.prisma.jornada.update({
      where: { id_jornada: id },
      data: { aprobado: false },
      include: {
        usuario: true,
        supervisor: true,
        actividades: {
          include: {
            estado: true,
          },
        },
      },
    });

    await this.auditoriaService.registrarAccion(
      'RECHAZAR_JORNADA',
      `Jornada rechazada ID: ${id}. Motivo: ${motivo}`,
    );

    return jornadaRechazada;
  }

  async updateActividad(id: number, data: { id_estado?: number; observaciones?: string }) {
    const actividad = await this.prisma.actividad.findUnique({
      where: { id },
      include: { jornada: true },
    });

    if (!actividad) {
      throw new NotFoundException(`Actividad con ID ${id} no encontrada`);
    }

    return this.prisma.actividad.update({
      where: { id },
      data,
      include: {
        estado: true,
        jornada: true,
      },
    });
  }

  async getActividadesByJornada(jornadaId: number) {
    return this.prisma.actividad.findMany({
      where: { id_jornada: jornadaId },
      include: {
        estado: true,
        comentarios: {
          include: {
            usuario: {
              select: {
                id: true,
                nombre: true,
                apellido: true,
              },
            },
          },
          orderBy: { fecha_comentario: 'desc' },
        },
      },
      orderBy: { id: 'asc' },
    });
  }

  async createComentario(data: {
    id_actividad: number;
    comentario: string;
    id_usuario: number;
  }) {
    return this.prisma.comentario.create({
      data: {
        id_actividad: data.id_actividad,
        comentario: data.comentario,
        id_supervisor: data.id_usuario, // Usar id_supervisor como está en la base de datos
        fecha_comentario: new Date(),
      },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
          },
        },
        actividad: true,
      },
    });
  }

  async aprobarCheckin(id: number) {
    const jornada = await this.prisma.jornada.findUnique({
      where: { id_jornada: id },
    });

    if (!jornada) {
      throw new NotFoundException(`Jornada con ID ${id} no encontrada`);
    }

    if (jornada.hora_checkout) {
      throw new BadRequestException('No se puede aprobar check-in después de check-out');
    }

    if (jornada.aprobado) {
      throw new BadRequestException('El check-in ya está aprobado');
    }

    const jornadaAprobada = await this.prisma.jornada.update({
      where: { id_jornada: id },
      data: { aprobado: true },
      include: {
        usuario: true,
        supervisor: true,
        actividades: {
          include: {
            estado: true,
          },
        },
      },
    });

    await this.auditoriaService.registrarAccion(
      'APROBAR_CHECKIN',
      `Check-in aprobado para jornada ID: ${id}`,
    );

    return jornadaAprobada;
  }

  async aprobarCheckout(id: number) {
    const jornada = await this.prisma.jornada.findUnique({
      where: { id_jornada: id },
    });

    if (!jornada) {
      throw new NotFoundException(`Jornada con ID ${id} no encontrada`);
    }

    if (!jornada.hora_checkout) {
      throw new BadRequestException('No se puede aprobar check-out sin hacer check-out primero');
    }

    // Para check-out, necesitamos una nueva columna o flag
    const jornadaAprobada = await this.prisma.jornada.update({
      where: { id_jornada: id },
      data: { 
        aprobado: true,
        // Agregar campo checkout_aprobado: true si existe
      },
      include: {
        usuario: true,
        supervisor: true,
        actividades: {
          include: {
            estado: true,
          },
        },
      },
    });

    await this.auditoriaService.registrarAccion(
      'APROBAR_CHECKOUT',
      `Check-out aprobado para jornada ID: ${id}`,
    );

    return jornadaAprobada;
  }

  // Nuevo método para obtener tareas pendientes de la última jornada de un usuario
  async getTareasPendientes(id_usuario: number) {
    // Obtener la última jornada completada (con checkout) del usuario
    const ultimaJornada = await this.prisma.jornada.findFirst({
      where: {
        id_usuario,
        hora_checkout: { not: null }, // Solo jornadas completadas
      },
      include: {
        actividades: {
          where: {
            id_estado: 1, // Estado pendiente
          },
          include: {
            estado: true,
          },
        },
      },
      orderBy: { fecha: 'desc' },
    });

    if (!ultimaJornada || ultimaJornada.actividades.length === 0) {
      return [];
    }

    return ultimaJornada.actividades.map(actividad => ({
      id: actividad.id,
      tarea: actividad.tarea,
      meta: actividad.meta,
      observaciones: actividad.observaciones,
      fecha_origen: ultimaJornada.fecha,
    }));
  }

  // Método modificado para checkin que incluye manejo de tareas arrastradas
  async checkinConTareasPendientes(checkinDto: CheckinDto, id_usuario: number, tareasArrastradas: number[] = []) {
    // Verificar si ya existe un check-in para esta fecha
    const fechaInicio = new Date(checkinDto.fecha);
    fechaInicio.setHours(0, 0, 0, 0);
    const fechaFin = new Date(fechaInicio);
    fechaFin.setHours(23, 59, 59, 999);

   /*  const existingJornada = await this.prisma.jornada.findFirst({
      where: {
        id_usuario,
        fecha: {
          gte: fechaInicio,
          lte: fechaFin,
        },
      },
    });

    if (existingJornada) {
      throw new BadRequestException('Ya existe un check-in para esta fecha');
    } */

    // Buscar usuario
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: id_usuario },
      include: {
        area: true,
        rol: true,
      },
    });

    if (!usuario) {
      throw new BadRequestException('Usuario no encontrado');
    }

    // Obtener tareas pendientes seleccionadas para arrastrar
    const actividadesPendientes = tareasArrastradas.length > 0 
      ? await this.prisma.actividad.findMany({
          where: {
            id: { in: tareasArrastradas },
            id_estado: 1, // Solo pendientes
            jornada: {
              id_usuario,
              hora_checkout: { not: null }, // Solo de jornadas completadas
            },
          },
        })
      : [];

    // Buscar supervisores
    const supervisores = await this.prisma.usuario.findMany({
      where: {
        rol: {
          nombre_rol: 'Supervisor',
        },
      },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
      },
    });

    // Preparar datos para la jornada
    const jornadaData: any = {
      fecha: new Date(checkinDto.fecha),
      aprobado: false,
      id_usuario,
    };

    if (supervisores.length > 0) {
      jornadaData.id_supervisor = supervisores[0].id;
    }

    if (checkinDto.comentario && checkinDto.comentario.trim()) {
      jornadaData.observaciones = checkinDto.comentario;
    }

    // Crear jornada
    const nuevaJornada = await this.prisma.jornada.create({
      data: jornadaData,
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
          },
        },
        supervisor: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
          },
        },
      },
    });

    // Crear actividades: primero las arrastradas, luego las nuevas

    // 1. Arrastrar tareas pendientes
    let actividadIndex = 0;
    for (const actividadPendiente of actividadesPendientes) {
      const actividadArrastrada = await this.prisma.actividad.create({
        data: {
          id_jornada: nuevaJornada.id_jornada,
          tarea: actividadPendiente.tarea,
          meta: actividadPendiente.meta,
          observaciones: `[CONTINUADA DEL DÍA ANTERIOR] ${actividadPendiente.observaciones || ''}`,
          id_estado: 1, // Pendiente
          es_arrastrada: true,
          id_actividad_origen: actividadPendiente.id,
        } as any, // Temporal fix para TypeScript
      });
      actividadIndex++;
    }

    // 2. Crear actividades nuevas planificadas
    if (checkinDto.tareas && checkinDto.tareas.length > 0) {
      const actividadesPromises = checkinDto.tareas.map((tarea) =>
        this.prisma.actividad.create({
          data: {
            id_jornada: nuevaJornada.id_jornada,
            tarea: tarea.tarea,
            meta: tarea.meta,
            observaciones: tarea.observaciones || undefined,
            id_estado: 1,
            es_arrastrada: false,
          } as any, // Temporal fix para TypeScript
        }),
      );

      await Promise.all(actividadesPromises);
    }

    // Enviar email a supervisores de forma asíncrona sin bloquear la respuesta
    if (supervisores.length > 0) {
      Promise.resolve().then(async () => {
        for (const supervisor of supervisores) {
          try {
            await this.emailService.enviarNotificacionCheckin(
              supervisor.email,
              `${usuario.nombre} ${usuario.apellido}`,
              nuevaJornada.fecha,
            );
          } catch (error) {
            console.error(`Error enviando email a ${supervisor.email}:`, error);
          }
        }
      });
    }

    await this.auditoriaService.registrarAccion(
      'CHECKIN',
      `Check-in registrado con ${actividadesPendientes.length} tareas arrastradas`,
      id_usuario,
    );

    return nuevaJornada;
  }

  async getStatsForEmployee(userId: number, startDate: string, endDate: string) {
    const result = await this.prisma.$queryRaw`
      SELECT * FROM obtener_estadisticas_empleado(${userId}::integer, ${startDate}::date, ${endDate}::date)
    `;
    
    // Convertir BigInt a number para poder serializar a JSON
    return (result as any[]).map(row => ({
      total_jornadas: Number(row.total_jornadas),
      horas_trabajadas: Number(row.horas_trabajadas),
      actividades_completadas: Number(row.actividades_completadas)
    }));
  }
}
