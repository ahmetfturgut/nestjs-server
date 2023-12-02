import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as config from '../core/environment/config';

@Module({

  imports: [
    MongooseModule.forRoot(config.mongoConfig.path),
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
