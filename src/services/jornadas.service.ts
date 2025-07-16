import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AuditoriaService } from './auditoria.service';
import { CheckinDto } from '../dto/jornadas/checkin.dto';
import { CheckoutDto } from '../dto/jornadas/checkout.dto';

@Injectable()
export class JornadasService {
  constructor(
    private prisma: PrismaService,
    private auditoriaService: AuditoriaService,
  ) {}

  async checkin(checkinDto: CheckinDto, id_usuario: number) {
    const fechaHoy = new Date(checkinDto.fecha);
    fechaHoy.setHours(0, 0, 0, 0);

    const fechaManana = new Date(fechaHoy);
    fechaManana.setDate(fechaManana.getDate() + 1);

    // Verificar si ya existe un check-in para este usuario en esta fecha
    const existingJornada = await this.prisma.jornada.findFirst({
      where: {
        id_usuario,
        fecha: {
          gte: fechaHoy,
          lt: fechaManana,
        },
      },
    });

    if (existingJornada) {
      throw new BadRequestException('Ya existe un check-in para esta fecha');
    }

    const nuevaJornada = await this.prisma.jornada.create({
      data: {
        fecha: new Date(checkinDto.fecha),
        aprobado: false,
        id_usuario,
        id_supervisor: checkinDto.id_supervisor,
      },
      include: {
        usuario: true,
        supervisor: true,
      },
    });

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
    });

    if (!jornada) {
      throw new NotFoundException(
        `Jornada con ID ${checkoutDto.id_jornada} no encontrada`,
      );
    }

    const jornadaActualizada = await this.prisma.jornada.update({
      where: { id_jornada: checkoutDto.id_jornada },
      data: {
        hora_checkout: new Date(),
        observaciones: checkoutDto.observaciones,
      },
      include: {
        usuario: true,
        supervisor: true,
        actividades: true,
      },
    });

    await this.auditoriaService.registrarAccion(
      'CHECKOUT',
      `Check-out registrado para jornada ID: ${checkoutDto.id_jornada}`,
      jornada.id_usuario,
    );

    return jornadaActualizada;
  }

  async aprobarJornada(id: number) {
    const jornada = await this.prisma.jornada.findUnique({
      where: { id_jornada: id },
    });

    if (!jornada) {
      throw new NotFoundException(`Jornada con ID ${id} no encontrada`);
    }

    if (jornada.aprobado) {
      throw new BadRequestException('La jornada ya está aprobada');
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
      'APROBAR_JORNADA',
      `Jornada aprobada ID: ${id}`,
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
        id_estado: 1, // Asume que existe un estado por defecto
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

  async getHistorialUsuario(usuarioId: number) {
    return this.prisma.jornada.findMany({
      where: { id_usuario: usuarioId },
      include: {
        usuario: true,
        supervisor: true,
        actividades: {
          include: {
            estado: true,
            comentarios: true,
          },
        },
      },
      orderBy: { fecha: 'desc' },
    });
  }

  async getJornadasPendientes() {
    return this.prisma.jornada.findMany({
      where: { aprobado: false },
      include: {
        usuario: true,
        supervisor: true,
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
      where: { aprobado: true },
      include: {
        usuario: true,
        supervisor: true,
        actividades: {
          include: {
            estado: true,
          },
        },
      },
      orderBy: { fecha: 'desc' },
    });
  }

  async getJornadasBySupervisor(supervisorId: number) {
    return this.prisma.jornada.findMany({
      where: { id_supervisor: supervisorId },
      include: {
        usuario: true,
        supervisor: true,
        actividades: {
          include: {
            estado: true,
            comentarios: true,
          },
        },
      },
      orderBy: { fecha: 'desc' },
    });
  }
}
