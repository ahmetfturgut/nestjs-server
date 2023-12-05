
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiException } from '../_common/api/api.exeptions';
import { Auth, AuthDocument } from './auth.model';
import { AuthRepository } from './auth.repository';
import { AuthState } from './enums/auth.state';
import { AuthType } from './enums/auth.type';
import { ITokenPayload } from './interfaces/token-payload.interface';
import { ApiError } from '../_common/api/api.error';
import { User } from '../user/user.model';
import * as cryptoUtil from '../../core/tools/utils/crypto.util';
import { Service } from '../_common/service/service';
import { AuthenticatedUserDto } from '../user/dto/authenticated-user.dto';
import { expiresTimeConfig } from '../../core/environment/config';
import { UserState } from '../user/enum/user.state';

@Injectable()
export class AuthService extends Service<Auth, AuthDocument, AuthRepository> {

	constructor(
		protected repository: AuthRepository,
		private jwtService: JwtService,
	) {
		super(repository);
	}

	public validateUserPassword(user: User, password: string): boolean {
		return cryptoUtil.verifyHash(password.toString(), user.password.toString(), user.salt.toString());
	}

	private async doPassiveIfExistsAuth(authType: AuthType, userId: Auth["userId"]): Promise<void> {
		await this.repository.doPassiveIfExistsAuth(authType, userId);
	}

	private async createToken(user: User, authType: AuthType, expiresIn: number): Promise<Auth> {

		await this.doPassiveIfExistsAuth(authType, user.id);

		var auth = new Auth();
		auth.userId = user.id;
		auth.user = user;
		auth.state = AuthState.ACTIVE;
		auth.type = authType;
		auth = await this.repository.save(auth);

		let payload = {
			authId: auth.id,
			userId: authType == AuthType.SIGNIN ? user.id : null, 
		}

		payload.authId = auth.id;

		if (authType == AuthType.VERIFY_SIGNUP) {
			payload.userId = user.id;
			auth.verificationCode = cryptoUtil.generateVerificationCode();
		}

		if (authType == AuthType.VERIFY_SIGNIN) {
			payload.userId = user.id;
			auth.verificationCode = cryptoUtil.generateVerificationCode();
			auth.lastRequestDate = new Date();
			auth.signInDate = new Date();
		}

		auth.token = this.jwtService.sign(payload, {
			expiresIn: expiresIn / 1000
		});

		auth.expiresIn = new Date(Date.now() + expiresIn);

		await this.repository.update(auth);

		return auth;
	}

	public async checkAndGetAuthenticatedUser(authId: Auth["id"]): Promise<AuthenticatedUserDto> {
		if (!authId) {
			throw ApiException.buildFromApiError(ApiError.TOKEN_ERROR);
		}

		var auth = await this.repository.getAuthenticatedUserAuth(authId);

		if (!auth) {
			throw ApiException.buildFromApiError(ApiError.TOKEN_ERROR);
		}

		if (auth.state != AuthState.ACTIVE) {
			throw ApiException.buildFromApiError(ApiError.TOKEN_EXPIRED);
		}

		if (auth.type != AuthType.SIGNIN) {
			throw ApiException.buildFromApiError(ApiError.TOKEN_EXPIRED);
		}

		await this.repository.updateLastRequestDate(authId);

		return auth.authendicatedUser;
	}

	private async verifyToken(token: string,  userId?: User["id"], options: any = { populateUser: true }): Promise<Auth> {
		try {
			let decoded: ITokenPayload = await this.jwtService.verifyAsync(token.toString()); //decode(token.toString());

			if (!decoded) {
				throw ApiException.buildFromApiError(ApiError.TOKEN_ERROR);
			}

			let authId = decoded.authId;

			if (!authId) {
				throw ApiException.buildFromApiError(ApiError.TOKEN_ERROR);
			}

			let auth: Auth;
			if (options.populateUser) {
				auth = await this.repository.getAuthWithPopulatedUser(authId);
			} else {
				auth = await this.repository.findById(authId);
			}

			if (!auth) {
				throw ApiException.buildFromApiError(ApiError.TOKEN_ERROR);
			}

			if (auth.state != AuthState.ACTIVE) {
				throw ApiException.buildFromApiError(ApiError.TOKEN_EXPIRED);
			}

			if (auth.userId && userId && auth.userId != userId) {

				throw ApiException.buildFromApiError(ApiError.TOKEN_ERROR);
			}

			return auth;

		} catch (error) {
			throw ApiException.buildFromApiError(ApiError.TOKEN_EXPIRED);
		}

	}

	async createVerifyEmailToken(user: User): Promise<Auth> {
		return this.createToken(user, AuthType.VERIFY_EMAIL, expiresTimeConfig.verifyEmailExpiresIn);
	}

	async createVerifySignUpToken(user: User): Promise<Auth> {
		return this.createToken(user, AuthType.VERIFY_SIGNUP, expiresTimeConfig.verifySignUpExpiresIn);
	}

	async createPasswordToken(user: User): Promise<Auth> {
		return this.createToken(user, AuthType.PASSWORD, expiresTimeConfig.verifyPasswordExpiresIn);
	}

	async createVerifySignInToken(user: User,): Promise<Auth> {
		let auth = await this.createToken(user, AuthType.VERIFY_SIGNIN, expiresTimeConfig.verifySignInExpiresIn);
		return this.repository.update(auth);
	}

	async createSignInToken(user: User): Promise<Auth> {
		return this.createToken(user, AuthType.SIGNIN, expiresTimeConfig.authExpiresIn);
	}

	async verifyEmailToken(token: string): Promise<Auth> {

		let auth = await this.verifyToken(token);

		if (auth.type != AuthType.VERIFY_EMAIL) {
			throw ApiException.buildFromApiError(ApiError.TOKEN_ERROR);
		}

		auth.state = AuthState.PASSIVE;
		await this.repository.update(auth);

		return auth;

	}

	async verifyPasswordToken(token: string): Promise<Auth> {

		let auth = await this.verifyToken(token);

		if (auth.type != AuthType.PASSWORD) {
			throw ApiException.buildFromApiError(ApiError.TOKEN_ERROR);
		}

		return auth;
	}

	private async updateInvalidTokenCount(auth: Auth): Promise<boolean> {

		auth.invalidTokenCount++;
		await this.repository.update(auth);

		return auth.invalidTokenCount < expiresTimeConfig.maxWrongTokenEntryCount;
	}

	async verifySignUpToken(token: string, verificationCode: string, ): Promise<Auth> {

		let auth = await this.verifyToken(token,  undefined, { populateUser: false });

		if (auth.type != AuthType.VERIFY_SIGNUP) {
			throw ApiException.buildFromApiError(ApiError.TOKEN_ERROR);
		}

		if (auth.verificationCode != verificationCode) {
			var isTokenUsable = await this.updateInvalidTokenCount(auth);
			if (!isTokenUsable) {
				await this.doPassiveIfExistsAuth(AuthType.VERIFY_SIGNUP, auth.userId);
				throw ApiException.buildFromApiError(ApiError.TOKEN_BLOCKED);
			}
			throw ApiException.buildFromApiError(ApiError.TOKEN_CODE_ERROR);
		}

		auth.state = AuthState.PASSIVE;
		await this.repository.update(auth);

		return auth;

	}

	async verifySignInToken(token: string, verificationCode: string): Promise<Auth> {

		let auth = await this.verifyToken(token);

		if (auth.type != AuthType.VERIFY_SIGNIN) {
			throw ApiException.buildFromApiError(ApiError.TOKEN_ERROR);
		}

		if (auth.user.state != UserState.ACTIVE) {
			throw ApiException.buildFromApiError(ApiError.TOKEN_ERROR);
		}

		let checkCodeResult = false;

		checkCodeResult = auth.verificationCode == verificationCode;

		if (!checkCodeResult) {
			var isTokenUsable = await this.updateInvalidTokenCount(auth);
			if (!isTokenUsable) {
				await this.doPassiveIfExistsAuth(AuthType.VERIFY_SIGNIN, auth.user.id);
				throw ApiException.buildFromApiError(ApiError.TOKEN_BLOCKED);
			}
			throw ApiException.buildFromApiError(ApiError.TOKEN_CODE_ERROR);
		}

		auth.state = AuthState.PASSIVE;
		await this.repository.update(auth);

		return auth;
	}

	async signOutByToken(token: string): Promise<ITokenPayload> {
		let decoded: ITokenPayload = await this.jwtService.verifyAsync(token.toString()); 

		if (!decoded) {
			console.log("decoded")
			throw ApiException.buildFromApiError(ApiError.TOKEN_ERROR);
		}
		await this.signOut(decoded.userId);
		return decoded;
	}

	async signOut(userId: string): Promise<void> {
		this.repository.doPassiveIfExistsAuth(AuthType.SIGNIN, userId);
	}

	async signOutAll(): Promise<void> {
		this.repository.doPassiveIfExistsAuth(AuthType.SIGNIN);
	}

	 

}