import { randomBytes, createHash } from 'crypto';
import { Commitment, AccessProof } from '@veil/types';

export function generateSecret(): string {
    return randomBytes(32).toString('hex');
}

export function createCommitment(secret: string): Commitment {
    const hash = createHash('sha256').update(secret).digest('hex');
    return hash as Commitment;
}

export function verifyCommitment(secret: string, commitment: Commitment): boolean {
    const hash = createHash('sha256').update(secret).digest('hex');
    return hash === commitment;
}

export function generateAccessProof(secret: string, metadata: Record<string, unknown> = {}): AccessProof {
    const commitment = createCommitment(secret);
    return {
        commitment,
        metadata,
    };
}
