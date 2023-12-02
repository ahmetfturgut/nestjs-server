 
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { appConfig } from './core/environment/config';
import {  AllExceptionsFilter } from './core/filters/all-exception.filter';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter()); 
  const httpAdapter  = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  console.log("apiport:" + appConfig.apiPort)
  await app.listen(appConfig.apiPort);
}
bootstrap();
