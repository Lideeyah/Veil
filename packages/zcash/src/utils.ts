import { ZcashAddress } from '@veil/types';

export const ZATS_PER_ZEC = 100_000_000n;

export function convertZECtoSats(zec: number | string): bigint {
    const amount = typeof zec === 'string' ? parseFloat(zec) : zec;
    return BigInt(Math.round(amount * 100_000_000));
}

export function convertSatsToZEC(sats: bigint): number {
    return Number(sats) / 100_000_000;
}

export function formatZcashAddress(address: ZcashAddress): string {
    // Insert line breaks or spaces for better readability if needed
    // For now, just return as is, or maybe chunk it
    return address;
}

export async function estimateTransactionFee(): Promise<bigint> {
    // In a real app, this might query the network
    return 10000n; // Standard 0.0001 ZEC fee
}

export async function getCurrentZECPrice(): Promise<number> {
    // Mock price for now
    return 35.50;
}
