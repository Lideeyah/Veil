import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().default('3001'),
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string().min(32),
    ENCRYPTION_KEY: z.string().length(64).or(z.string().length(32)), // 32 bytes hex = 64 chars, or raw 32 chars? usually hex.
    ZCASH_RPC_HOST: z.string().default('localhost'),
    ZCASH_RPC_PORT: z.string().default('18232'),
    ZCASH_RPC_USER: z.string().default('user'),
    ZCASH_RPC_PASSWORD: z.string().default('password'),
    CORS_ORIGIN: z.string().default('*'),
});

const processEnv = envSchema.safeParse(process.env);

if (!processEnv.success) {
    console.error('❌ Invalid environment variables:', processEnv.error.format());
    throw new Error('Invalid environment variables');
}

export const config = {
    env: processEnv.data.NODE_ENV,
    port: parseInt(processEnv.data.PORT, 10),
    db: {
        url: processEnv.data.DATABASE_URL,
    },
    jwt: {
        secret: processEnv.data.JWT_SECRET,
        expiresIn: '7d',
    },
    security: {
        encryptionKey: processEnv.data.ENCRYPTION_KEY,
        corsOrigin: processEnv.data.CORS_ORIGIN,
    },
    zcash: {
        host: processEnv.data.ZCASH_RPC_HOST,
        port: parseInt(processEnv.data.ZCASH_RPC_PORT, 10),
        username: processEnv.data.ZCASH_RPC_USER,
        password: processEnv.data.ZCASH_RPC_PASSWORD,
    },
};
