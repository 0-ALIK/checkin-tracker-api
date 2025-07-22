import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as nodemailer from 'nodemailer';

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
  private transporter: nodemailer.Transporter;
  private emailsHabilitados: boolean = false;

  constructor(private readonly mailerService: MailerService) {
    // Verificar si las credenciales están configuradas
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      console.warn('⚠️  ADVERTENCIA: Credenciales de email no configuradas. Los emails no se enviarán.');
      this.emailsHabilitados = false;
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.MAIL_PORT || '587'),
        secure: false, // true para 465, false para otros puertos
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });
      this.emailsHabilitados = true;
      console.log('✅ Servicio de email configurado correctamente');
    } catch (error) {
      console.error('❌ Error configurando servicio de email:', error);
      this.emailsHabilitados = false;
    }
  }

  async enviarNotificacionCheckin(
    supervisorEmail: string,
    empleadoNombre: string,
    fecha: Date,
  ) {
    if (!this.emailsHabilitados) {
      console.log(`📧 [SIMULADO] Check-in email para ${supervisorEmail} - ${empleadoNombre} - ${fecha.toDateString()}`);
      return;
    }

    try {
      const mailOptions = {
        from: process.env.MAIL_FROM || process.env.MAIL_USER,
        to: supervisorEmail,
        subject: `Check-in registrado - ${empleadoNombre}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Nuevo Check-in Registrado</h2>
            <p><strong>Empleado:</strong> ${empleadoNombre}</p>
            <p><strong>Fecha:</strong> ${fecha.toLocaleDateString('es-ES')}</p>
            <p><strong>Hora:</strong> ${new Date().toLocaleTimeString('es-ES')}</p>
            <hr>
            <p>Este es un mensaje automático del Sistema de Checkin.</p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email de check-in enviado a ${supervisorEmail}`);
    } catch (error) {
      console.error(`❌ Error enviando email de checkin:`, error);
    }
  }

  async enviarNotificacionCheckout(
    supervisorEmail: string,
    empleadoNombre: string,
    fecha: Date,
    horaCheckin: Date,
    horaCheckout: Date,
  ) {
    if (!this.emailsHabilitados) {
      console.log(`📧 [SIMULADO] Check-out email para ${supervisorEmail} - ${empleadoNombre} - ${fecha.toDateString()}`);
      return;
    }

    try {
      const duracion = this.calcularDuracion(horaCheckin, horaCheckout);
      
      const mailOptions = {
        from: process.env.MAIL_FROM || process.env.MAIL_USER,
        to: supervisorEmail,
        subject: `Check-out registrado - ${empleadoNombre}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #16a34a;">Check-out Registrado</h2>
            <p><strong>Empleado:</strong> ${empleadoNombre}</p>
            <p><strong>Fecha:</strong> ${fecha.toLocaleDateString('es-ES')}</p>
            <p><strong>Check-in:</strong> ${horaCheckin.toLocaleTimeString('es-ES')}</p>
            <p><strong>Check-out:</strong> ${horaCheckout.toLocaleTimeString('es-ES')}</p>
            <p><strong>Duración:</strong> ${duracion}</p>
            <hr>
            <p>Este es un mensaje automático del Sistema de Checkin.</p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email de check-out enviado a ${supervisorEmail}`);
    } catch (error) {
      console.error(`❌ Error enviando email de checkout:`, error);
    }
  }

  private calcularDuracion(inicio: Date, fin: Date): string {
    const diff = fin.getTime() - inicio.getTime();
    const horas = Math.floor(diff / (1000 * 60 * 60));
    const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${horas}h ${minutos}m`;
  }

  async enviarInformeDiario(informes: InformeUsuario[]) {
    if (!this.emailsHabilitados) {
      console.log(`📧 [SIMULADO] Informe diario para ${informes.length} usuarios`);
      return;
    }

    const fecha = new Date().toLocaleDateString('es-ES');
    
    for (const informe of informes) {
      try {
        const html = this.generarHtmlInforme(informe, fecha);
        
        await this.transporter.sendMail({
          from: process.env.MAIL_FROM || process.env.MAIL_USER,
          to: informe.usuario.email,
          subject: `Informe Diario - ${fecha}`,
          html,
        });
        
        console.log(`✅ Informe enviado a ${informe.usuario.email}`);
      } catch (error) {
        console.error(`❌ Error enviando informe a ${informe.usuario.email}:`, error);
      }
    }
  }

  async enviarInformeGerencial(informes: InformeUsuario[], emailsGerenciales: string[]) {
    if (!this.emailsHabilitados) {
      console.log(`📧 [SIMULADO] Informe gerencial para ${emailsGerenciales.length} gerentes`);
      return;
    }

    const fecha = new Date().toLocaleDateString('es-ES');
    const resumenHtml = this.generarResumenGerencial(informes, fecha);
    
    for (const email of emailsGerenciales) {
      try {
        await this.transporter.sendMail({
          from: process.env.MAIL_FROM || process.env.MAIL_USER,
          to: email,
          subject: `Informe Gerencial - ${fecha}`,
          html: resumenHtml,
        });
        
        console.log(`✅ Informe gerencial enviado a ${email}`);
      } catch (error) {
        console.error(`❌ Error enviando informe gerencial a ${email}:`, error);
      }
    }
  }

  private generarResumenGerencial(informes: InformeUsuario[], fecha: string): string {
    const totalUsuarios = informes.length;
    const usuariosConJornadas = informes.filter(i => i.jornadas.length > 0).length;
    const totalJornadas = informes.reduce((sum, i) => sum + i.jornadas.length, 0);
    const jornadasAprobadas = informes.reduce((sum, i) => 
      sum + i.jornadas.filter(j => j.aprobado).length, 0);

    return `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Informe Gerencial - ${fecha}</h2>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Resumen del Día</h3>
          <ul>
            <li><strong>Total de usuarios:</strong> ${totalUsuarios}</li>
            <li><strong>Usuarios con jornadas:</strong> ${usuariosConJornadas}</li>
            <li><strong>Total de jornadas:</strong> ${totalJornadas}</li>
            <li><strong>Jornadas aprobadas:</strong> ${jornadasAprobadas}</li>
            <li><strong>Jornadas pendientes:</strong> ${totalJornadas - jornadasAprobadas}</li>
          </ul>
        </div>

        <h3>Detalle por Usuario</h3>
        ${informes.map(informe => `
          <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px;">
            <h4>${informe.usuario.nombre} ${informe.usuario.apellido}</h4>
            <p><strong>Email:</strong> ${informe.usuario.email}</p>
            <p><strong>Jornadas registradas:</strong> ${informe.jornadas.length}</p>
            
            ${informe.jornadas.length > 0 ? `
              <details>
                <summary>Ver detalles de jornadas</summary>
                ${informe.jornadas.map(jornada => `
                  <div style="margin: 10px 0; padding: 10px; background: #f9f9f9;">
                    <p><strong>Fecha:</strong> ${jornada.fecha.toLocaleDateString('es-ES')}</p>
                    <p><strong>Estado:</strong> ${jornada.aprobado ? '✅ Aprobada' : '⏳ Pendiente'}</p>
                    <p><strong>Actividades:</strong> ${jornada.actividades.length}</p>
                  </div>
                `).join('')}
              </details>
            ` : '<p>Sin jornadas registradas</p>'}
          </div>
        `).join('')}
        
        <hr>
        <p style="color: #666; font-size: 12px;">
          Este es un informe automático del Sistema de Checkin generado el ${new Date().toLocaleString('es-ES')}.
        </p>
      </div>
    `;
  }

  private generarHtmlInforme(informe: InformeUsuario, fecha: string): string {
    const usuario = informe.usuario;
    const jornadas = informe.jornadas;

    let jornadasHtml = '';
    if (jornadas.length === 0) {
      jornadasHtml = '<p>No hay jornadas registradas para esta fecha.</p>';
    } else {
      jornadasHtml = jornadas.map(jornada => `
        <div style="border: 1px solid #ddd; padding: 10px; margin: 10px 0; border-radius: 5px;">
          <h4>Jornada del ${jornada.fecha.toLocaleDateString('es-ES')}</h4>
          <p><strong>Check-in:</strong> ${jornada.hora_checkin.toLocaleTimeString('es-ES')}</p>
          ${jornada.hora_checkout ? `<p><strong>Check-out:</strong> ${jornada.hora_checkout.toLocaleTimeString('es-ES')}</p>` : '<p><strong>Check-out:</strong> Pendiente</p>'}
          <p><strong>Estado:</strong> ${jornada.aprobado ? 'Aprobada' : 'Pendiente'}</p>
          
          <h5>Actividades:</h5>
          ${jornada.actividades.length > 0 ? `
            <ul>
              ${jornada.actividades.map(actividad => `
                <li>
                  <strong>${actividad.tarea}</strong> - ${actividad.estado.nombre_estado}
                  ${actividad.observaciones ? `<br><em>${actividad.observaciones}</em>` : ''}
                </li>
              `).join('')}
            </ul>
          ` : '<p>No hay actividades registradas.</p>'}
        </div>
      `).join('');
    }

    return `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Informe Diario - ${fecha}</h2>
        <p>Hola ${usuario.nombre} ${usuario.apellido},</p>
        <p>Este es tu informe de actividades del día:</p>
        
        ${jornadasHtml}
        
        <hr>
        <p style="color: #666; font-size: 12px;">
          Este es un mensaje automático del Sistema de Checkin.<br>
          Para más información, contacta con tu supervisor.
        </p>
      </div>
    `;
  }

  // Métodos para envío asíncrono sin bloquear respuestas de API
  
  async enviarNotificacionCheckinAsync(email: string, nombreEmpleado: string, fecha: Date): Promise<void> {
    Promise.resolve().then(async () => {
      try {
        await this.enviarNotificacionCheckin(email, nombreEmpleado, fecha);
      } catch (error) {
        console.error(`Error enviando email checkin a ${email}:`, error);
      }
    });
  }

  async enviarNotificacionCheckoutAsync(
    email: string, 
    nombreEmpleado: string, 
    fecha: Date, 
    horaCheckin: Date, 
    horaCheckout: Date
  ): Promise<void> {
    Promise.resolve().then(async () => {
      try {
        await this.enviarNotificacionCheckout(email, nombreEmpleado, fecha, horaCheckin, horaCheckout);
      } catch (error) {
        console.error(`Error enviando email checkout a ${email}:`, error);
      }
    });
  }

  async enviarInformeDiarioAsync(informes: InformeUsuario[]): Promise<void> {
    Promise.resolve().then(async () => {
      try {
        await this.enviarInformeDiario(informes);
      } catch (error) {
        console.error('Error enviando informes diarios:', error);
      }
    });
  }

  async enviarInformeGerencialAsync(informes: InformeUsuario[], emailsGerenciales: string[]): Promise<void> {
    Promise.resolve().then(async () => {
      try {
        await this.enviarInformeGerencial(informes, emailsGerenciales);
      } catch (error) {
        console.error('Error enviando informes gerenciales:', error);
      }
    });
  }

  /**
   * Método genérico para enviar emails
   */
  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    if (!this.emailsHabilitados) {
      console.log(`📧 [EMAIL DESHABILITADO] Para: ${to}, Asunto: ${subject}`);
      return;
    }

    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM || process.env.MAIL_USER,
        to,
        subject,
        html,
      });
      console.log(`✅ Email enviado a ${to}`);
    } catch (error) {
      console.error(`❌ Error enviando email a ${to}:`, error);
      throw error;
    }
  }

  /**
   * Método asíncrono genérico para enviar emails sin bloquear
   */
  async sendEmailAsync(to: string, subject: string, html: string): Promise<void> {
    Promise.resolve().then(async () => {
      try {
        await this.sendEmail(to, subject, html);
      } catch (error) {
        console.error('Error enviando email:', error);
      }
    });
  }
}
