import { ZcashAddress, ViewingKey, isZcashAddress } from '@veil/types';
import { ZcashRPCClient } from './rpc';
import { InvalidAddressError } from './error';
import { randomBytes } from 'crypto';

// In a real implementation, we would use a WASM library for offline generation.
// For this prototype, we'll try RPC first, or fallback to a mock generation
// if we can't connect (to allow development without a full node).

export async function generateShieldedAddress(): Promise<{
    address: ZcashAddress;
    privateKey: string;
    viewingKey: ViewingKey;
}> {
    try {
        const rpc = new ZcashRPCClient();
        const address = await rpc.getNewAddress();
        const viewingKey = await rpc.call<string>('z_exportviewingkey', [address]);
        const privateKey = await rpc.call<string>('z_exportkey', [address]);

        return {
            address: address as ZcashAddress,
            privateKey,
            viewingKey: viewingKey as ViewingKey,
        };
    } catch (error) {
        console.warn('RPC unavailable, generating MOCK address for development');
        return generateMockAddress();
    }
}

function generateMockAddress(): {
    address: ZcashAddress;
    privateKey: string;
    viewingKey: ViewingKey;
} {
    const randomHex = randomBytes(32).toString('hex');
    return {
        address: `zs1mock${randomHex}end` as ZcashAddress,
        privateKey: `secret${randomHex}`,
        viewingKey: `view${randomHex}` as ViewingKey,
    };
}

export function validateZcashAddress(address: string): boolean {
    return isZcashAddress(address);
}

export function isShieldedAddress(address: string): boolean {
    return address.startsWith('zs1');
}
