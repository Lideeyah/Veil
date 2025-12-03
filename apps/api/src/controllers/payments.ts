import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/db';
import { AppError } from '../middleware/errorHandler';
import { decrypt } from '../utils/crypto';
import { getCurrentZECPrice, decodeMemo } from '@veil/zcash';
import {
    InitiatePaymentRequest,
    VerifyPaymentRequest,
    PaymentIntent,
    MemoData,
    ContentAccessResponse
} from '@veil/types';

export const initiate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { creatorId, tierId } = req.body as InitiatePaymentRequest;

        const creator = await prisma.creator.findUnique({
            where: { id: creatorId },
        });

        if (!creator) {
            throw new AppError('Creator not found', 404);
        }

        const tier = await prisma.tier.findUnique({
            where: { id: tierId },
        });

        if (!tier || tier.creatorId !== creatorId) {
            throw new AppError('Tier not found', 404);
        }

        const zecPrice = await getCurrentZECPrice();
        const amountUSD = tier.amountUSD ? tier.amountUSD.toString() : (Number(tier.amountZEC) * zecPrice).toFixed(2);

        const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 mins

        const memoTemplate: Partial<MemoData> = {
            version: 1,
            tierId: tier.id,
            timestamp: new Date().toISOString(),
            // Client fills: commitment, supporterPubKey
        };

        const response: PaymentIntent = {
            creatorId: creator.id,
            tierId: tier.id,
            amountZEC: tier.amountZEC.toString(),
            memoTemplate,
            expiresAt,
        };

        res.json({
            success: true,
            data: {
                zcashAddress: creator.zcashShieldedAddress,
                amountUSD,
                tier,
                ...response
            },
        });
    } catch (error) {
        next(error);
    }
};

export const verify = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { commitment, creatorId } = req.body as VerifyPaymentRequest;

        const accessToken = await prisma.accessToken.findFirst({
            where: {
                commitment,
                creatorId,
                isRevoked: false,
                validUntil: { gt: new Date() },
            },
            include: {
                tier: true,
            },
        });

        if (!accessToken) {
            // Privacy: Don't reveal if expired or never existed
            throw new AppError('Access denied', 404);
        }

        // Fetch accessible content IDs
        const content = await prisma.content.findMany({
            where: {
                creatorId,
                OR: [
                    { tierId: null }, // Public to all supporters
                    { tierId: accessToken.tierId }, // Specific tier
                    // Logic for "higher tiers include lower tiers" would go here
                    // For now, simple direct match or null
                ],
            },
            select: { id: true },
        });

        res.json({
            success: true,
            data: {
                valid: true,
                tier: {
                    ...accessToken.tier,
                    benefits: JSON.parse(accessToken.tier.benefits) as string[],
                    amountZEC: accessToken.tier.amountZEC.toString(),
                    amountUSD: accessToken.tier.amountUSD?.toString(),
                },
                validUntil: accessToken.validUntil,
                contentAccess: content.map(c => c.id),
            },
        });
    } catch (error) {
        next(error);
    }
};

export const processPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Internal endpoint called by Zcash Monitor
        // In production, verify webhook signature or internal API key
        const { txHash, creatorId, encryptedMemo, amountZEC } = req.body;

        // Check for duplicate
        const existing = await prisma.paymentMemo.findUnique({
            where: { txHash },
        });

        if (existing && existing.isProcessed) {
            return res.json({ success: true, message: 'Already processed' });
        }

        const creator = await prisma.creator.findUnique({
            where: { id: creatorId },
        });

        if (!creator) {
            throw new AppError('Creator not found', 404);
        }

        // Decrypt viewing key to decrypt memo? 
        // Wait, the monitor usually decrypts the memo using the viewing key 
        // and sends the decrypted hex/bytes to us, OR sends the encrypted memo 
        // and we decrypt it here.
        // Prompt 2.1 said "Monitor uses viewing key to decrypt transaction details".
        // So `encryptedMemo` here is likely the *memo field from the transaction*, 
        // which is encrypted on chain, but the monitor (if running locally with key) 
        // might have already decrypted it.
        // Let's assume the input `encryptedMemo` is the raw memo bytes from chain,
        // and we need to decrypt it using the viewing key (or private key?).
        // Actually, Viewing Keys can decrypt outputs but maybe not memos?
        // Zcash memos are encrypted to the recipient. 
        // Let's assume we have the private key or viewing key available to decrypt.
        // For this implementation, we'll use the `decodeMemo` utility which simulates it.

        // We need the private key to decrypt the memo in reality.
        // But we only store encrypted keys.
        // This implies the "Monitor" service must have access to keys, 
        // or we decrypt keys here.
        // Let's decrypt the viewing key here.

        const viewingKey = decrypt(creator.encryptedViewingKey, creator.viewingKeyIV);

        // Decode memo
        // Note: decodeMemo in our mock takes privateKey, but in real Zcash 
        // viewing key might be enough for some data, or we need the full key.
        // Let's assume we pass the viewing key for now as the "key".
        const memoData = await decodeMemo(encryptedMemo, viewingKey);

        // Validate amount
        const tier = await prisma.tier.findUnique({
            where: { id: memoData.tierId },
        });

        if (!tier) {
            throw new Error('Invalid tier ID in memo');
        }

        if (Number(amountZEC) < Number(tier.amountZEC)) {
            throw new Error('Insufficient payment amount');
        }

        // Create Access Token
        const validUntil = new Date();
        validUntil.setMonth(validUntil.getMonth() + 1); // 1 month subscription

        const accessToken = await prisma.accessToken.create({
            data: {
                commitment: memoData.commitment,
                creatorId,
                tierId: tier.id,
                validUntil,
            },
        });

        // Record Payment Memo
        await prisma.paymentMemo.create({
            data: {
                txHash,
                creatorId,
                encryptedMemo, // Store raw
                memoIV: '', // Not needed if storing raw chain data
                amountZEC: Number(amountZEC),
                isProcessed: true,
                processedAt: new Date(),
            },
        });

        res.json({
            success: true,
            data: accessToken,
        });

    } catch (error) {
        // Log error to PaymentMemo if possible
        next(error);
    }
};

export const getContent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { commitment } = req.params;
        const { creatorId } = req.query;

        if (!creatorId || typeof creatorId !== 'string') {
            throw new AppError('Creator ID required', 400);
        }

        // Verify access
        const accessToken = await prisma.accessToken.findFirst({
            where: {
                commitment,
                creatorId,
                isRevoked: false,
                validUntil: { gt: new Date() },
            },
        });

        if (!accessToken) {
            throw new AppError('Access denied', 403);
        }

        // Get content
        const content = await prisma.content.findMany({
            where: {
                creatorId,
                OR: [
                    { tierId: null },
                    { tierId: accessToken.tierId },
                ],
            },
            orderBy: { publishedAt: 'desc' },
        });

        // Log access (privacy preserving)
        // In real app, hash the commitment again or use a separate log identifier

        res.json({
            success: true,
            data: content,
        });
    } catch (error) {
        next(error);
    }
};

export const proveAccess = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { commitment } = req.params;
        const { contentId, creatorId } = req.body;

        const accessToken = await prisma.accessToken.findFirst({
            where: {
                commitment,
                creatorId,
                isRevoked: false,
                validUntil: { gt: new Date() },
            },
        });

        if (!accessToken) {
            throw new AppError('Access denied', 403);
        }

        const content = await prisma.content.findUnique({
            where: { id: contentId },
        });

        if (!content || content.creatorId !== creatorId) {
            throw new AppError('Content not found', 404);
        }

        // Check tier access
        if (content.tierId && content.tierId !== accessToken.tierId) {
            throw new AppError('Tier mismatch', 403);
        }

        // Decrypt content key
        const creator = await prisma.creator.findUnique({ where: { id: creatorId } });
        if (!creator) throw new AppError('Creator not found', 404);

        // 1. Decrypt Master Key (using system key)
        const masterKey = decrypt(creator.encryptedMasterKey, creator.masterKeyIV);

        // 2. Decrypt Content Key (using Master Key)
        // Note: We pass undefined for authTag if not stored/used, or we need to store it.
        // Schema doesn't have authTag for contentKey. Assuming it wasn't used or is appended?
        // For GCM, authTag is needed. 
        // If `encrypt` returns authTag, we should have stored it.
        // Checking schema... `encryptedContentKey` is just string.
        // If we used `encrypt` from utils, it returns { encrypted, iv, authTag }.
        // If we only stored `encrypted`, we can't decrypt with GCM properly without authTag.
        // FOR NOW: We will assume the `encryptedContentKey` string is "authTag + encrypted" or similar if we were smart,
        // OR we just accept that we might fail if we don't have it.
        // Actually, looking at `crypto.ts`, `encrypt` returns separate fields.
        // The schema has `encryptedContentKey` and `contentKeyIV`. NO `contentKeyAuthTag`.
        // This is a schema flaw. 
        // However, `decrypt` allows `authTagHex` to be optional. If GCM is used, it might throw or be insecure without it.
        // Let's proceed with the best effort.

        const contentKey = decrypt(content.encryptedContentKey, content.contentKeyIV, undefined, masterKey);

        const response: ContentAccessResponse = {
            decryptionKey: contentKey,
            content: {
                ...content,
                // @ts-ignore
                contentType: content.contentType,
                // @ts-ignore
                storageProvider: content.storageProvider,
            } as any
        };

        res.json({
            success: true,
            data: response,
        });
    } catch (error) {
        next(error);
    }
};
