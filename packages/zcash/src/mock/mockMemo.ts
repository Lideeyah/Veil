import { MemoData } from '@veil/types';
import { randomBytes } from 'crypto';

// In-memory mapping of encrypted memos to plaintext for debugging/demo
const memoStore = new Map<string, MemoData>();

export function encodeMockMemo(data: MemoData): Buffer {
    // Simulate encryption by creating a random handle
    const handle = randomBytes(32).toString('hex');

    // Store the actual data
    memoStore.set(handle, data);

    // Return the handle as the "encrypted" buffer
    // In reality, this would be the encrypted bytes
    return Buffer.from(handle, 'utf-8');
}

export function decodeMockMemo(encryptedMemo: Buffer | string, privateKey: string): MemoData {
    const handle = Buffer.isBuffer(encryptedMemo)
        ? encryptedMemo.toString('utf-8')
        : encryptedMemo;

    const data = memoStore.get(handle);

    if (!data) {
        throw new Error('Mock memo not found or invalid handle');
    }

    // In a real mock, we might check if privateKey matches the recipient
    // but for simplicity we just return the data
    return data;
}
