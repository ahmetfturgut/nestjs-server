
import * as dotenv from 'dotenv'

dotenv.config({ path: ".env" });

export const mongoConfig = {
	get path(): string {
		return process.env.MONGO_PATH;
	}
}

export const tokenConfig = {
	get encryptionSacretKey(): string {
		return process.env.ENCRYPTION_SACRET_KEY;
	},

	get jwtSacretKey(): string {
		return process.env.JWT_SACRET_KEY;
	},
}


export const mailConfig = {
	get mailHost(): string {
		return process.env.MAIL_HOST;
	},
	get mailPort(): number {
		return Number(process.env.MAIL_PORT);
	},
	get mailUser(): string {
		return process.env.MAIL_USER;
	},
	get mailPassword(): string {
		return process.env.MAIL_PASSWORD;
	},
	get mailFrom(): string {
		return process.env.MAIL_FROM;
	},
}

export const expiresTimeConfig = {
	get authExpiresIn(): number {
		return parseInt(process.env.SESSION_TIMEOUT);
	},
	get verifyEmailExpiresIn(): number {
		return parseInt(process.env.VERIFY_EMAIL_EXPIRES_IN);
	},

	get verifySignUpExpiresIn(): number {
		return parseInt(process.env.VERIFY_SIGN_UP_EXPIRES_IN);
	},
	get verifySignInExpiresIn(): number {
		return parseInt(process.env.VERIFY_SIGN_IN_EXPIRES_IN);
	},
	get verifyPasswordExpiresIn(): number {
		return parseInt(process.env.VERIFY_PASSWORD_EXPIRES_IN);
	},
	get maxWrongTokenEntryCount(): number {
		return parseInt(process.env.MAX_WRONG_TOKEN_ENTRY_COUNT);
	},



}

export const appConfig = {
	get apiPort(): string {
		return process.env.API_PORT;
	},

}

