import * as crypto from 'crypto';
import { promisify } from 'util';
import * as config from '../../environment/config';

const algorithm = 'aes-256-ctr';
const ENCRYPTION_KEY = config.tokenConfig.encryptionSacretKey;
const IV_LENGTH = 16;
const SALT_LENGTH = 16;
const SALT_ROUNDS = 10;

const generateCipherivKey = async function (): Promise<Buffer> {
    // The key length is dependent on the algorithm.
    // In this case for aes256, it is 32 bytes.
    return (await promisify(crypto.scrypt)(ENCRYPTION_KEY, 'salt', 32)) as Buffer;
}

export const encrypt = async function encrypt(text: string): Promise<string> {

    const iv = crypto.randomBytes(IV_LENGTH);
    const key = await generateCipherivKey();
    const cipher = crypto.createCipheriv('aes-256-ctr', key, iv);

    const encrypted = Buffer.concat([
        cipher.update(text),
        cipher.final(),
    ]);

    return iv.toString('hex') + ":" + encrypted.toString('hex');
}

export const decrypt = async function (text: string): Promise<string> {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

export const verifyHash = function (password: string, hashedPassword: string, salt: string): boolean {
    return hashedPassword == this.hashPaswordBySalt(password, salt);
}

export const generateSalt = function (): string {
    return crypto.randomBytes(SALT_LENGTH).toString('hex');
}

export const hashPaswordBySalt = function (password: string, salt: string): string {
    return crypto.pbkdf2Sync(password, salt, SALT_ROUNDS, 64, `sha512`).toString(`hex`);
}
 
export const generateVerificationCode = function (min: number = 100000, max: number = 999999): string {
    min = Math.ceil(min);
    max = Math.floor(max);
    return "" + (Math.floor(Math.random() * (max - min)) + min);
} 