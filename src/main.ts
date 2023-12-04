
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { appConfig } from './core/environment/config';
import { AllExceptionsFilter } from './core/filters/all-exception.filter';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { Query } from 'mongoose';
import { UserTypeGuard } from './core/guards/user-type.guard';
import { JwtAuthGuard } from './core/guards/jwt-auth.guard';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
var __setOptions = Query.prototype.setOptions;

Query.prototype.setOptions = function (options: any) {
  __setOptions.apply(this, arguments)
  if (!this.mongooseOptions().lean) this.mongooseOptions().lean = { virtuals: true }
  return this
}


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  const httpAdapter = app.get(HttpAdapterHost);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalGuards(new JwtAuthGuard(new Reflector()));
  app.useGlobalGuards(new UserTypeGuard(new Reflector()));
  
  const config = new DocumentBuilder()
    .setTitle('NestJS Core')
    .setDescription('The NestJS Core API description')
    .setVersion('1.0')
    .addTag('apis')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  await app.listen(appConfig.apiPort);
}
bootstrap();
