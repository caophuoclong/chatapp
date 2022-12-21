import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
import cookieParser from "cookie-parser";
import * as dotenv from 'dotenv';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { CatchHttpException } from './exceptions/HttpException';
dotenv.config()
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const whiteList = process.env.CORS.split(",").map(item => item.trim());
  app.enableCors({
    origin: whiteList,
    credentials: true
  });
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Chat app server API')
    .setDescription('This page provide how to use chat app server API')
    .setVersion('1.0')
    .build()
  app.useGlobalFilters(new CatchHttpException())
  app.use(cookieParser())
  app.setGlobalPrefix("/api")
  app.useGlobalPipes(new ValidationPipe())
  app.useStaticAssets(join(__dirname, '..', 'images'), {
    prefix: '/images/',
  });
  app.useStaticAssets(join(__dirname, '..',"assets" ),{
    prefix: '/assets/',
  })
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT || 3003);
}
bootstrap();
