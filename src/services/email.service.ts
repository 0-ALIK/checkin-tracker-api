import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

interface InformeUsuario {
  usuario: {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
  };
  jornadas: Array<{
    id_jornada: number;
    fecha: Date;
    hora_checkin: Date;
    hora_checkout: Date | null;
    aprobado: boolean;
    actividades: Array<{
      id: number;
      tarea: string;
      meta: string;
      observaciones: string | null;
      estado: {
        nombre_estado: string;
      };
    }>;
  }>;
}

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async enviarInformeDiario(informes: InformeUsuario[]) {
    const fecha = new Date().toLocaleDateString('es-ES');

    for (const informe of informes) {
      if (informe.jornadas.length === 0) continue;

      const htmlContent = this.generarHtmlInforme(informe, fecha);

      try {
        await this.mailerService.sendMail({
          to: informe.usuario.email,
          subject: `Informe Diario de Actividades - ${fecha}`,
          html: htmlContent,
        });

        console.log(`Informe enviado a ${informe.usuario.email}`);
      } catch (error) {
        console.error(
          `Error enviando correo a ${informe.usuario.email}:`,
          error,
        );
      }
    }
  }

  async enviarInformeGerencial(
    informes: InformeUsuario[],
    destinatarios: string[],
  ) {
    const fecha = new Date().toLocaleDateString('es-ES');
    const htmlContent = this.generarHtmlInformeGerencial(informes, fecha);

    for (const destinatario of destinatarios) {
      try {
        await this.mailerService.sendMail({
          to: destinatario,
          subject: `Informe Gerencial Diario - ${fecha}`,
          html: htmlContent,
        });

        console.log(`Informe gerencial enviado a ${destinatario}`);
      } catch (error) {
        console.error(
          `Error enviando informe gerencial a ${destinatario}:`,
          error,
        );
      }
    }
  }

  private generarHtmlInforme(informe: InformeUsuario, fecha: string): string {
    const { usuario, jornadas } = informe;

    let actividadesHtml = '';
    let totalActividades = 0;
    let actividadesCompletadas = 0;

    jornadas.forEach((jornada) => {
      const horaCheckin = jornada.hora_checkin.toLocaleTimeString('es-ES');
      const horaCheckout = jornada.hora_checkout
        ? jornada.hora_checkout.toLocaleTimeString('es-ES')
        : 'No registrado';

      actividadesHtml += `
        <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
          <h3 style="color: #2c5aa0; margin-bottom: 10px;">
            Jornada ${jornada.aprobado ? '✅ Aprobada' : '⏳ Pendiente'}
          </h3>
          <p><strong>Check-in:</strong> ${horaCheckin}</p>
          <p><strong>Check-out:</strong> ${horaCheckout}</p>
          
          <h4 style="color: #555; margin-top: 15px;">Actividades:</h4>
      `;

      if (jornada.actividades.length === 0) {
        actividadesHtml +=
          '<p style="color: #888;">No se registraron actividades</p>';
      } else {
        jornada.actividades.forEach((actividad) => {
          totalActividades++;
          if (
            actividad.estado.nombre_estado.toLowerCase().includes('completad')
          ) {
            actividadesCompletadas++;
          }

          actividadesHtml += `
            <div style="margin: 10px 0; padding: 10px; background-color: #f9f9f9; border-radius: 3px;">
              <p><strong>Tarea:</strong> ${actividad.tarea}</p>
              <p><strong>Meta:</strong> ${actividad.meta}</p>
              <p><strong>Estado:</strong> <span style="color: #2c5aa0;">${actividad.estado.nombre_estado}</span></p>
              ${actividad.observaciones ? `<p><strong>Observaciones:</strong> ${actividad.observaciones}</p>` : ''}
            </div>
          `;
        });
      }

      actividadesHtml += '</div>';
    });

    const porcentajeCompletado =
      totalActividades > 0
        ? Math.round((actividadesCompletadas / totalActividades) * 100)
        : 0;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Informe Diario de Actividades</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #2c5aa0; color: white; padding: 20px; text-align: center; border-radius: 5px;">
          <h1>Informe Diario de Actividades</h1>
          <p style="margin: 0; font-size: 18px;">${fecha}</p>
        </div>
        
        <div style="margin: 20px 0; padding: 20px; background-color: #f0f8ff; border-radius: 5px;">
          <h2 style="color: #2c5aa0; margin-top: 0;">Hola ${usuario.nombre} ${usuario.apellido}</h2>
          <p>Aquí tienes el resumen de tus actividades del día:</p>
          
          <div style="display: flex; justify-content: space-around; margin: 15px 0;">
            <div style="text-align: center;">
              <h3 style="margin: 0; color: #2c5aa0;">${totalActividades}</h3>
              <p style="margin: 5px 0;">Total Actividades</p>
            </div>
            <div style="text-align: center;">
              <h3 style="margin: 0; color: #28a745;">${actividadesCompletadas}</h3>
              <p style="margin: 5px 0;">Completadas</p>
            </div>
            <div style="text-align: center;">
              <h3 style="margin: 0; color: #ffc107;">${porcentajeCompletado}%</h3>
              <p style="margin: 5px 0;">Progreso</p>
            </div>
          </div>
        </div>

        ${actividadesHtml}

        <div style="margin-top: 30px; padding: 15px; background-color: #f8f9fa; border-radius: 5px; text-align: center;">
          <p style="margin: 0; color: #666;">
            Este es un informe automático generado por el sistema de seguimiento de actividades.
          </p>
        </div>
      </body>
      </html>
    `;
  }

  private generarHtmlInformeGerencial(
    informes: InformeUsuario[],
    fecha: string,
  ): string {
    let resumenHtml = '';
    const totalUsuarios = informes.length;
    let usuariosActivos = 0;
    let totalActividades = 0;
    let totalCompletadas = 0;

    informes.forEach((informe) => {
      if (informe.jornadas.length > 0) {
        usuariosActivos++;

        informe.jornadas.forEach((jornada) => {
          const actividadesJornada = jornada.actividades.length;
          const completadasJornada = jornada.actividades.filter((a) =>
            a.estado.nombre_estado.toLowerCase().includes('completad'),
          ).length;

          totalActividades += actividadesJornada;
          totalCompletadas += completadasJornada;

          resumenHtml += `
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">${informe.usuario.nombre} ${informe.usuario.apellido}</td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${jornada.hora_checkin.toLocaleTimeString('es-ES')}</td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${jornada.hora_checkout ? jornada.hora_checkout.toLocaleTimeString('es-ES') : 'No registrado'}</td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${actividadesJornada}</td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${completadasJornada}</td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">
                <span style="color: ${jornada.aprobado ? '#28a745' : '#ffc107'};">
                  ${jornada.aprobado ? 'Aprobada' : 'Pendiente'}
                </span>
              </td>
            </tr>
          `;
        });
      }
    });

    const porcentajeGeneral =
      totalActividades > 0
        ? Math.round((totalCompletadas / totalActividades) * 100)
        : 0;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Informe Gerencial Diario</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 1000px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #2c5aa0; color: white; padding: 20px; text-align: center; border-radius: 5px;">
          <h1>Informe Gerencial Diario</h1>
          <p style="margin: 0; font-size: 18px;">${fecha}</p>
        </div>
        
        <div style="display: flex; justify-content: space-around; margin: 20px 0; padding: 20px; background-color: #f0f8ff; border-radius: 5px;">
          <div style="text-align: center;">
            <h3 style="margin: 0; color: #2c5aa0;">${usuariosActivos}/${totalUsuarios}</h3>
            <p style="margin: 5px 0;">Usuarios Activos</p>
          </div>
          <div style="text-align: center;">
            <h3 style="margin: 0; color: #2c5aa0;">${totalActividades}</h3>
            <p style="margin: 5px 0;">Total Actividades</p>
          </div>
          <div style="text-align: center;">
            <h3 style="margin: 0; color: #28a745;">${totalCompletadas}</h3>
            <p style="margin: 5px 0;">Completadas</p>
          </div>
          <div style="text-align: center;">
            <h3 style="margin: 0; color: #ffc107;">${porcentajeGeneral}%</h3>
            <p style="margin: 5px 0;">Progreso General</p>
          </div>
        </div>

        <div style="margin: 20px 0;">
          <h2 style="color: #2c5aa0;">Detalle por Usuario</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <thead>
              <tr style="background-color: #f8f9fa;">
                <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Usuario</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Check-in</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Check-out</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Actividades</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Completadas</th>
                <th style="padding: 10px; border: 1px solid #ddd;">Estado</th>
              </tr>
            </thead>
            <tbody>
              ${resumenHtml}
            </tbody>
          </table>
        </div>

        <div style="margin-top: 30px; padding: 15px; background-color: #f8f9fa; border-radius: 5px; text-align: center;">
          <p style="margin: 0; color: #666;">
            Este es un informe automático generado por el sistema de seguimiento de actividades.
          </p>
        </div>
      </body>
      </html>
    `;
  }
}
