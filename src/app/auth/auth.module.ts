import { Global,  Module } from '@nestjs/common';
import { AuthService } from './auth.service'; 
import { JwtModule } from '@nestjs/jwt'; 
import { Auth, AuthSchema } from './auth.model';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthRepository } from './auth.repository';
import { PassportModule } from '@nestjs/passport';  
import { User, UserSchema } from '../user/user.model';
import { expiresTimeConfig, tokenConfig } from 'src/core/environment/config';
import { JwtStrategy } from 'src/core/strategy/jwt.strategy';

@Global()
@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Auth.name, schema: AuthSchema },
			{ name: User.name, schema: UserSchema }
		],),
		PassportModule,
		JwtModule.register({
			secret: tokenConfig.jwtSacretKey,
			signOptions: { expiresIn: expiresTimeConfig.authExpiresIn },
		})
	],
	exports: [AuthService, JwtModule],
	providers: [AuthRepository, AuthService, JwtStrategy]
})
export class AuthModule { }
