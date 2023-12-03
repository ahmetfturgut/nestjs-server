import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as config from '../core/environment/config';
import { LoggerMiddleware } from 'src/core/middlewares/logger.middleware';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import path from 'path';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { UserTypeGuard } from 'src/core/guards/user-type.guard';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';

@Module({
  imports: [
    MongooseModule.forRoot(config.mongoConfig.path),
    WinstonModule.forRoot({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('MyApp', {
              colors: true,
              prettyPrint: true,
            }),
          ),
        }),
        new winston.transports.File({  
          filename: 'info.log', 
          level: 'info',
        }),
        new winston.transports.File({  
          filename: 'error.log', 
          level: 'error',
        }),
      ],
    }),
    UserModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: UserTypeGuard,
    },
    AppService
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}