import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {SwaggerModule, DocumentBuilder} from "@nestjs/swagger"
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    credentials: true
  });
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Chat app server API')
    .setDescription('This page provide how to use chat app server API')
    .setVersion('1.0')
    .addTag('cats')
    .build()
  app.setGlobalPrefix("/api")
  app.useGlobalPipes(new ValidationPipe())
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3003);
}
bootstrap();
