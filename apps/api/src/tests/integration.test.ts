import request from 'supertest';
import { app } from '../server';

// Mock Prisma inline
jest.mock('../utils/db', () => ({
    prisma: {
        creator: {
            create: jest.fn(),
            findUnique: jest.fn(),
        },
        tier: {
            create: jest.fn(),
            findUnique: jest.fn(),
            findFirst: jest.fn(),
        },
        accessToken: {
            create: jest.fn(),
            findFirst: jest.fn(),
        },
        paymentMemo: {
            create: jest.fn(),
            findUnique: jest.fn(),
        },
        content: {
            findMany: jest.fn(),
        },
        $on: jest.fn(),
    },
}));

// Mock Zcash
jest.mock('@veil/zcash', () => ({
    decodeMemo: jest.fn((encryptedMemo) => {
        return JSON.parse(encryptedMemo);
    }),
    generateShieldedAddress: jest.fn(() => 'zs1mockaddress'),
    getCurrentZECPrice: jest.fn(() => 50.0), // Mock price
}));

// Mock Crypto
jest.mock('../utils/crypto', () => ({
    decrypt: jest.fn((text) => text),
    encrypt: jest.fn((text) => ({ ciphertext: text, iv: 'iv' })),
    generateRandomKey: jest.fn(() => 'random-key'),
    hashPassword: jest.fn(() => 'hashed-password'),
    comparePassword: jest.fn(() => true),
}));

// Access the mock
import { prisma } from '../utils/db';

describe('End-to-End Flow (Mocked)', () => {
    let creatorToken: string;
    const creatorId = 'creator-123';
    const tierId = 'tier-123';
    const zcashAddress = 'zs1testaddress';
    const commitment = 'commitment-123';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should register a creator', async () => {
        (prisma.creator.create as jest.Mock).mockResolvedValue({
            id: creatorId,
            username: 'testcreator',
            displayName: 'Test Creator',
            zcashShieldedAddress: zcashAddress,
            encryptedViewingKey: 'enc-vk',
            viewingKeyIV: 'iv-vk',
            encryptedMasterKey: 'enc-mk',
            masterKeyIV: 'iv-mk',
            email: 'enc-email',
            emailIV: 'iv-email',
            passwordHash: 'hash',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const res = await request(app)
            .post('/api/creators/register')
            .send({
                username: 'testcreator',
                email: 'test@example.com',
                password: 'password123',
                displayName: 'Test Creator',
            });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        creatorToken = res.body.data.token;
    });

    it('should create a tier', async () => {
        (prisma.creator.findUnique as jest.Mock).mockResolvedValue({ id: creatorId });
        (prisma.tier.findFirst as jest.Mock).mockResolvedValue(null); // No existing tiers
        (prisma.tier.create as jest.Mock).mockResolvedValue({
            id: tierId,
            creatorId,
            name: 'Gold Tier',
            amountZEC: '1.0',
            description: 'Best tier',
            benefits: ['Access'],
            position: 0,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const res = await request(app)
            .post('/api/creators/tiers')
            .set('Authorization', `Bearer ${creatorToken}`)
            .send({
                name: 'Gold Tier',
                description: 'Best tier',
                amountZEC: 1.0,
                benefits: ['Access'],
            });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
    });

    it('should initiate a payment', async () => {
        (prisma.creator.findUnique as jest.Mock).mockResolvedValue({
            id: creatorId,
            zcashShieldedAddress: zcashAddress,
        });
        (prisma.tier.findUnique as jest.Mock).mockResolvedValue({
            id: tierId,
            creatorId,
            amountZEC: '1.0',
        });

        const res = await request(app)
            .post('/api/payments/initiate')
            .send({
                creatorId,
                tierId,
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.zcashAddress).toBe(zcashAddress);
    });

    it('should process a payment via webhook', async () => {
        const memoData = {
            version: 1,
            tierId,
            timestamp: new Date().toISOString(),
            commitment,
        };
        const encryptedMemo = JSON.stringify(memoData);

        (prisma.paymentMemo.findUnique as jest.Mock).mockResolvedValue(null);
        (prisma.creator.findUnique as jest.Mock).mockResolvedValue({
            id: creatorId,
            encryptedViewingKey: 'enc-vk',
            viewingKeyIV: 'iv-vk',
        });
        (prisma.tier.findUnique as jest.Mock).mockResolvedValue({
            id: tierId,
            amountZEC: '1.0',
        });
        (prisma.accessToken.create as jest.Mock).mockResolvedValue({
            id: 'token-123',
            commitment,
            creatorId,
            tierId,
            validUntil: new Date(),
        });
        (prisma.paymentMemo.create as jest.Mock).mockResolvedValue({});

        const res = await request(app)
            .post('/api/payments/webhook/process')
            .send({
                txHash: 'tx-123',
                creatorId,
                encryptedMemo,
                amountZEC: '1.0',
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it('should verify access', async () => {
        (prisma.accessToken.findFirst as jest.Mock).mockResolvedValue({
            id: 'token-123',
            commitment,
            tierId,
            validUntil: new Date(Date.now() + 100000),
            tier: { id: tierId, name: 'Gold Tier' },
        });
        (prisma.content.findMany as jest.Mock).mockResolvedValue([
            { id: 'content-1', title: 'Exclusive Post' },
        ]);

        const res = await request(app)
            .post('/api/payments/verify')
            .send({
                commitment,
                creatorId,
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.valid).toBe(true);
    });
});
