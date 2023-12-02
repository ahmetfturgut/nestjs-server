import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { appConfig } from './core/environment/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  console.log("apiport:" + appConfig.apiPort)
  await app.listen(appConfig.apiPort);
}
bootstrap();
