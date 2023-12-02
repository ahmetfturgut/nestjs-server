import { EnvKey } from "../tools/enums/env.key.enums";
import dotenv from 'dotenv';


export const mongoConfig = {
	get path(): string {
		return "mongodb://localhost/nest-server";
	}
}

export const tokenConfig = {
	get encryptionSacretKey(): string {
		return process.env[EnvKey.ENCRYPTION_SACRET_KEY];
	},

	get jwtSacretKey(): string {
		return process.env[EnvKey.JWT_SACRET_KEY];
	},
}

export const appConfig = {
	get apiPort(): string {
		return process.env[EnvKey.API_PORT];
	},

	get clientDomain(): string {
		return process.env[EnvKey.CLIENT_DOMAIN];
	},

}

