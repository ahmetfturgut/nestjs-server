import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as config from '../core/environment/config';
import { LoggerMiddleware } from 'src/core/middlewares/logger.middleware';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import path, { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { UserTypeGuard } from 'src/core/guards/user-type.guard';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { MailerModule } from '@nestjs-modules/mailer'; 
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailModule } from './email/email.module';
import { mailConfig } from '../core/environment/config';

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
    MailerModule.forRoot({
      transport: {
        host: mailConfig.mailHost,
        port: mailConfig.mailPort, 
        secure: true,
        auth: {
          user: mailConfig.mailUser,
          pass: mailConfig.mailPassword,
        },
      },
      defaults: {
        from: mailConfig.mailFrom,
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    UserModule,
    AuthModule,
    EmailModule
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