// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { envs } from './config/env.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const configSwagger = new DocumentBuilder()
    .setTitle('Checkin tracker API')
    .setDescription('API for tracking check-ins')
    .setVersion('1.0')
    .addBasicAuth() // Agregar autenticación básica
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(envs.PORT);
  console.log(`API running on http://localhost:${envs.PORT}`);
  console.log(`Swagger docs: http://localhost:${envs.PORT}/api`);
}
void bootstrap();
