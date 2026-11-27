import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Todas las rutas de la API empiezan en /api.
  app.setGlobalPrefix('api');
  // Permite peticiones desde el origen configurado para Vue.
  app.enableCors({ origin: process.env.WEB_ORIGIN || 'http://127.0.0.1:5173' });
  // Convierte los datos al DTO y rechaza campos extra o inválidos.
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
  // Swagger ofrece documentación y permite probar rutas con un token Bearer.
  const config = new DocumentBuilder().setTitle('GameHub IPVG').setVersion('1.0').addBearerAuth().build();
  SwaggerModule.setup('docs', app, () => SwaggerModule.createDocument(app, config));
  await app.listen(Number(process.env.PORT || 3000), '127.0.0.1');
}

void bootstrap();
