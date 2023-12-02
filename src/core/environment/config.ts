
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

export const appConfig = {
	get apiPort(): string {
		return process.env.API_PORT;
	},

}

