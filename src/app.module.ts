import { Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { AuthService } from './services/auth.service';
import { UsuariosService } from './services/usuarios.service';
import { JornadasService } from './services/jornadas.service';
import { ActividadesService } from './services/actividades.service';
import { ComentariosService } from './services/comentarios.service';
import { RequestContextService } from './services/request-context.service';
import { AuthController } from './controllers/auth.controller';
import { UsuariosController } from './controllers/usuarios.controller';
import { JornadasController } from './controllers/jornadas.controller';
import { ActividadesController } from './controllers/actividades.controller';
import { ComentariosController } from './controllers/comentarios.controller';
import { JwtModule } from '@nestjs/jwt';
import { envs } from './config/env.config';

@Module({
  imports: [
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
  ],
  providers: [
    PrismaService,
    AuthService,
    UsuariosService,
    JornadasService,
    ActividadesService,
    ComentariosService,
    RequestContextService,
  ],
})
export class AppModule {}
