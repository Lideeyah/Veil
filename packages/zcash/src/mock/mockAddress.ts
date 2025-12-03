import { ZcashAddress, ViewingKey } from '@veil/types';
import { randomBytes } from 'crypto';

interface MockKeypair {
    address: ZcashAddress;
    privateKey: string;
    viewingKey: ViewingKey;
}

// In-memory storage for valid mock addresses
const validMockAddresses = new Set<string>();

export function generateMockShieldedAddress(): MockKeypair {
    const randomHex = randomBytes(32).toString('hex');
    const address = `zs1mock${randomHex}end` as ZcashAddress;
    const privateKey = `secret${randomHex}`;
    const viewingKey = `view${randomHex}` as ViewingKey;

    validMockAddresses.add(address);

    return {
        address,
        privateKey,
        viewingKey,
    };
}

export function isValidMockAddress(address: string): boolean {
    return validMockAddresses.has(address) || address.startsWith('zs1mock');
}
