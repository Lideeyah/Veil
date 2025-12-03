import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { config } from '../config';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_ROUNDS = 12;

// Ensure encryption key is 32 bytes
const ENCRYPTION_KEY = Buffer.from(config.security.encryptionKey, 'hex');

export const hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
};

export const encrypt = (text: string, customKey?: string): { encrypted: string; iv: string; authTag: string } => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = customKey ? Buffer.from(customKey, 'hex') : ENCRYPTION_KEY;
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag().toString('hex');

    return {
        encrypted,
        iv: iv.toString('hex'),
        authTag,
    };
};

export const decrypt = (encrypted: string, ivHex: string, authTagHex?: string, customKey?: string): string => {
    const iv = Buffer.from(ivHex, 'hex');
    const key = customKey ? Buffer.from(customKey, 'hex') : ENCRYPTION_KEY;
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

    if (authTagHex) {
        decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
    }

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
};

export const generateRandomKey = (length: number = 32): string => {
    return crypto.randomBytes(length).toString('hex');
};
