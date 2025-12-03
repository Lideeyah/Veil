import { MemoData } from '@veil/types';

export function generateBrowserCommitment(): string {
    // In a real implementation, this would use window.crypto.subtle
    // to generate a secure random commitment.
    // For now, we'll use a simple random hex string.
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return Array.from(array)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

export function constructPaymentURI(
    address: string,
    amount: string,
    memo: string
): string {
    // Format: zcash:address?amount=1.23&memo=base64
    // Memo must be base64url encoded or hex? Zcash URIs usually use base64.
    // But our backend expects hex for the raw memo data?
    // Let's assume standard ZIP-321 format.
    return `zcash:${address}?amount=${amount}&memo=${memo}`;
}

export function encodeMemoData(data: Partial<MemoData>): string {
    // This should ideally encrypt the memo data.
    // Since we are in the browser and don't have the recipient's public key easily accessible
    // (unless we fetched it), we might just encode it as JSON for the mock.
    // In the real app, we'd use a WASM library to encrypt to the shielded address.
    // For this mock/demo, we'll just base64 encode the JSON.
    const json = JSON.stringify(data);
    return btoa(json);
}
