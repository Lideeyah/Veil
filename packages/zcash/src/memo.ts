import { MemoData, MemoDataSchema } from '@veil/types';
import { MemoDecodingError } from './error';
import { ZCASH_CONFIG } from './config';

// In a real implementation, this would use ECIES encryption.
// For this prototype, we will use a simple JSON serialization
// and simulate encryption for the mock layer, or pass-through for RPC.

export async function encodeMemo(data: MemoData): Promise<Buffer> {
    // 1. Validate data
    const result = MemoDataSchema.safeParse(data);
    if (!result.success) {
        throw new Error(`Invalid memo data: ${result.error.message}`);
    }

    // 2. Serialize
    const json = JSON.stringify(data);
    const buffer = Buffer.from(json, 'utf-8');

    // 3. Check size
    if (buffer.length > ZCASH_CONFIG.memo.maxSize) {
        throw new Error(`Memo too large: ${buffer.length} bytes (max ${ZCASH_CONFIG.memo.maxSize})`);
    }

    return buffer;
}

export async function decodeMemo(encryptedMemo: Buffer | string, privateKey: string): Promise<MemoData> {
    try {
        // In real Zcash, the node decrypts the memo if we have the key.
        // Here we assume we receive the decrypted bytes from the RPC (which decrypts using the viewing key/private key).

        const buffer = Buffer.isBuffer(encryptedMemo)
            ? encryptedMemo
            : Buffer.from(encryptedMemo, 'hex'); // RPC often returns hex

        const json = buffer.toString('utf-8');

        // Handle potential null bytes padding from Zcash
        const cleanJson = json.replace(/\0/g, '');

        const data = JSON.parse(cleanJson);

        const result = MemoDataSchema.safeParse(data);
        if (!result.success) {
            throw new Error(result.error.message);
        }

        return result.data;
    } catch (error) {
        if (error instanceof Error) {
            throw new MemoDecodingError(error.message);
        }
        throw new MemoDecodingError('Unknown error');
    }
}
