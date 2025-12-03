import { z } from 'zod';

// -----------------------------------------------------------------------------
// 1. ZCASH TYPES
// -----------------------------------------------------------------------------

// Branded types for type safety
export type ZcashAddress = string & { readonly __brand: 'ZcashAddress' };
export type ViewingKey = string & { readonly __brand: 'ViewingKey' };
export type Commitment = string & { readonly __brand: 'Commitment' };

// Type guards
export const isZcashAddress = (value: string): value is ZcashAddress => {
    return value.startsWith('zs1') && value.length > 70; // Basic validation
};

export const isViewingKey = (value: string): value is ViewingKey => {
    return value.length > 100; // Basic validation
};

export interface ShieldedTransaction {
    txHash: string;
    amount: bigint;
    memo?: string;
    timestamp: number;
    confirmations: number;
}

/**
 * Structure of the encrypted memo field in Zcash transactions
 */
export interface MemoData {
    /** Protocol version for future compatibility */
    version: 1;

    /** Tier ID the supporter is subscribing to */
    tierId: string;

    /** Ephemeral public key for encrypted response */
    supporterPubKey: string;

    /** Cryptographic commitment for access proof */
    commitment: Commitment;

    /** ISO timestamp of payment initiation */
    timestamp: string;

    /** Optional encrypted email for notifications */
    encryptedEmail?: string;
}

export const MemoDataSchema = z.object({
    version: z.literal(1),
    tierId: z.string(),
    supporterPubKey: z.string(),
    commitment: z.string() as unknown as z.Schema<Commitment>,
    timestamp: z.string().datetime(),
    encryptedEmail: z.string().optional(),
});

export interface PaymentProof {
    txHash: string;
    viewingKey: ViewingKey;
}

// -----------------------------------------------------------------------------
// 2. PAYMENT TYPES
// -----------------------------------------------------------------------------

export enum PaymentStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    FAILED = 'failed',
}

export interface PaymentIntent {
    creatorId: string;
    tierId: string;
    amountZEC: string;
    memoTemplate: Partial<MemoData>;
    expiresAt: string;
}

export interface AccessProof {
    commitment: Commitment;
    metadata?: Record<string, unknown>;
}

// -----------------------------------------------------------------------------
// 3. CREATOR TYPES
// -----------------------------------------------------------------------------

export interface TierConfiguration {
    id: string;
    name: string;
    description: string;
    amountZEC: string; // Decimal string
    amountUSD?: string; // Decimal string
    benefits: string[];
    isActive: boolean;
}

export const TierConfigurationSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    amountZEC: z.string(),
    amountUSD: z.string().optional(),
    benefits: z.array(z.string()),
    isActive: z.boolean(),
});

export interface CreatorProfile {
    id: string;
    username: string;
    displayName: string;
    bio?: string;
    profileImageUrl?: string;
    coverImageUrl?: string;
    zcashShieldedAddress: ZcashAddress;
    tiers: TierConfiguration[];
}

export interface CreatorPrivate extends CreatorProfile {
    email: string;
    viewingKey: ViewingKey;
    masterKey: string;
}

export interface CreatorAnalytics {
    totalSupporters: number;
    revenueByTier: Record<string, string>; // tierId -> amountZEC
    growthRate: number; // percentage
    period: '7d' | '30d' | 'all';
}

// -----------------------------------------------------------------------------
// 4. CONTENT TYPES
// -----------------------------------------------------------------------------

export enum ContentType {
    ARTICLE = 'ARTICLE',
    VIDEO = 'VIDEO',
    AUDIO = 'AUDIO',
    IMAGE = 'IMAGE',
    FILE = 'FILE',
}

export enum StorageProvider {
    IPFS = 'IPFS',
    S3 = 'S3',
    ARWEAVE = 'ARWEAVE',
}

export interface ContentMetadata {
    id: string;
    creatorId: string;
    tierId?: string; // null = public
    title: string; // Decrypted
    description?: string; // Decrypted
    contentType: ContentType;
    thumbnailUrl?: string;
    durationSeconds?: number;
    publishedAt?: string;
    isPublic: boolean;
}

export interface EncryptedContent extends Omit<ContentMetadata, 'title' | 'description'> {
    encryptedTitle: string;
    titleIV: string;
    encryptedDescription?: string;
    descriptionIV?: string;
    encryptedContentKey: string;
    contentKeyIV: string;
    storageHash: string;
    storageProvider: StorageProvider;
}

export interface ContentAccessResponse {
    decryptionKey: string; // The content key decrypted for the user
    content: EncryptedContent;
}

// -----------------------------------------------------------------------------
// 5. AI TYPES
// -----------------------------------------------------------------------------

export type AIRole = 'user' | 'assistant' | 'system';

export interface AIMessage {
    role: AIRole;
    content: string;
    timestamp: string;
}

export interface AIConversation {
    id: string;
    sessionId: string;
    messages: AIMessage[];
    contextSummary?: string;
}

export interface PrivacyConciergeContext {
    userIntent: string;
    riskLevel: 'low' | 'medium' | 'high';
    suggestedAction: string;
}

// -----------------------------------------------------------------------------
// 6. API TYPES
// -----------------------------------------------------------------------------

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: unknown;
    };
}

// Auth
export const RegisterCreatorSchema = z.object({
    username: z.string().min(3).max(20).regex(/^[a-z0-9_]+$/),
    displayName: z.string().min(1),
    bio: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(8),
});
export type RegisterCreatorRequest = z.infer<typeof RegisterCreatorSchema>;

export const LoginSchema = z.object({
    username: z.string(),
    password: z.string(),
});
export type LoginRequest = z.infer<typeof LoginSchema>;

// Tiers
export const CreateTierSchema = z.object({
    name: z.string().min(1),
    description: z.string(),
    amountZEC: z.number().positive(),
    benefits: z.array(z.string()),
});
export type CreateTierRequest = z.infer<typeof CreateTierSchema>;

// Payment
export const InitiatePaymentSchema = z.object({
    creatorId: z.string(),
    tierId: z.string(),
});
export type InitiatePaymentRequest = z.infer<typeof InitiatePaymentSchema>;

export const VerifyPaymentSchema = z.object({
    commitment: z.string(),
    creatorId: z.string(),
});
export type VerifyPaymentRequest = z.infer<typeof VerifyPaymentSchema>;

// -----------------------------------------------------------------------------
// 7. CRYPTO TYPES
// -----------------------------------------------------------------------------

export interface EncryptedData {
    ciphertext: string;
    iv: string;
    tag?: string; // Auth tag for GCM
}

export interface CryptoKey {
    key: string; // Hex encoded
    algorithm: 'AES-256-GCM' | 'AES-256-CBC';
}
