import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MailerModule } from '@nestjs-modules/mailer';
import { PrismaService } from './services/prisma.service';
import { AuthService } from './services/auth.service';
import { UsuariosService } from './services/usuarios.service';
import { JornadasService } from './services/jornadas.service';
import { ActividadesService } from './services/actividades.service';
import { ComentariosService } from './services/comentarios.service';
import { EstadosService } from './services/estados.service';
import { RolesService } from './services/roles.service';
import { AreasService } from './services/areas.service';
import { AuditoriaService } from './services/auditoria.service';
import { EmailService } from './services/email.service';
import { InformesService } from './services/informes.service';
import { CronService } from './services/cron.service';
import { RequestContextService } from './services/request-context.service';
import { AuthController } from './controllers/auth.controller';
import { UsuariosController } from './controllers/usuarios.controller';
import { JornadasController } from './controllers/jornadas.controller';
import { ActividadesController } from './controllers/actividades.controller';
import { ComentariosController } from './controllers/comentarios.controller';
import { EstadosController } from './controllers/estados.controller';
import { RolesController } from './controllers/roles.controller';
import { AreasController } from './controllers/areas.controller';
import { AuditoriaController } from './controllers/auditoria.controller';
import { InformesController } from './controllers/informes.controller';
import { JwtModule } from '@nestjs/jwt';
import { envs } from './config/env.config';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MailerModule.forRoot({
      transport: {
        host: envs.MAIL_HOST || 'smtp.gmail.com',
        port: envs.MAIL_PORT || 587,
        secure: false,
        auth: {
          user: envs.MAIL_USER,
          pass: envs.MAIL_PASS,
        },
      },
      defaults: {
        from: `"Sistema de Checkin" <${envs.MAIL_FROM || envs.MAIL_USER}>`,
      },
    }),
    JwtModule.register({
      secret: envs.JWT_SECRET,
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  controllers: [
    AuthController,
    UsuariosController,
    JornadasController,
    ActividadesController,
    ComentariosController,
    EstadosController,
    RolesController,
    AreasController,
    AuditoriaController,
    InformesController,
  ],
  providers: [
    PrismaService,
    AuthService,
    UsuariosService,
    JornadasService,
    ActividadesService,
    ComentariosService,
    EstadosService,
    RolesService,
    AreasService,
    AuditoriaService,
    EmailService,
    InformesService,
    CronService,
    RequestContextService,
  ],
})
export class AppModule {}
