import { z } from 'zod';
export type ZcashAddress = string & {
    readonly __brand: 'ZcashAddress';
};
export type ViewingKey = string & {
    readonly __brand: 'ViewingKey';
};
export type Commitment = string & {
    readonly __brand: 'Commitment';
};
export declare const isZcashAddress: (value: string) => value is ZcashAddress;
export declare const isViewingKey: (value: string) => value is ViewingKey;
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
export declare const MemoDataSchema: z.ZodObject<{
    version: z.ZodLiteral<1>;
    tierId: z.ZodString;
    supporterPubKey: z.ZodString;
    commitment: z.Schema<Commitment>;
    timestamp: z.ZodString;
    encryptedEmail: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    version: 1;
    tierId: string;
    supporterPubKey: string;
    timestamp: string;
    commitment: string & {
        readonly __brand: "Commitment";
    };
    encryptedEmail?: string | undefined;
}, {
    version: 1;
    tierId: string;
    supporterPubKey: string;
    timestamp: string;
    commitment: string & {
        readonly __brand: "Commitment";
    };
    encryptedEmail?: string | undefined;
}>;
export interface PaymentProof {
    txHash: string;
    viewingKey: ViewingKey;
}
export declare enum PaymentStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    FAILED = "failed"
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
export interface TierConfiguration {
    id: string;
    name: string;
    description: string;
    amountZEC: string;
    amountUSD?: string;
    benefits: string[];
    isActive: boolean;
}
export declare const TierConfigurationSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    amountZEC: z.ZodString;
    amountUSD: z.ZodOptional<z.ZodString>;
    benefits: z.ZodArray<z.ZodString, "many">;
    isActive: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    description: string;
    amountZEC: string;
    benefits: string[];
    isActive: boolean;
    amountUSD?: string | undefined;
}, {
    id: string;
    name: string;
    description: string;
    amountZEC: string;
    benefits: string[];
    isActive: boolean;
    amountUSD?: string | undefined;
}>;
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
    revenueByTier: Record<string, string>;
    growthRate: number;
    period: '7d' | '30d' | 'all';
}
export declare enum ContentType {
    ARTICLE = "ARTICLE",
    VIDEO = "VIDEO",
    AUDIO = "AUDIO",
    IMAGE = "IMAGE",
    FILE = "FILE"
}
export declare enum StorageProvider {
    IPFS = "IPFS",
    S3 = "S3",
    ARWEAVE = "ARWEAVE"
}
export interface ContentMetadata {
    id: string;
    creatorId: string;
    tierId?: string;
    title: string;
    description?: string;
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
    decryptionKey: string;
    content: EncryptedContent;
}
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
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: unknown;
    };
}
export declare const RegisterCreatorSchema: z.ZodObject<{
    username: z.ZodString;
    displayName: z.ZodString;
    bio: z.ZodOptional<z.ZodString>;
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    username: string;
    displayName: string;
    email: string;
    password: string;
    bio?: string | undefined;
}, {
    username: string;
    displayName: string;
    email: string;
    password: string;
    bio?: string | undefined;
}>;
export type RegisterCreatorRequest = z.infer<typeof RegisterCreatorSchema>;
export declare const LoginSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    username: string;
    password: string;
}, {
    username: string;
    password: string;
}>;
export type LoginRequest = z.infer<typeof LoginSchema>;
export declare const CreateTierSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    amountZEC: z.ZodNumber;
    benefits: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    amountZEC: number;
    benefits: string[];
}, {
    name: string;
    description: string;
    amountZEC: number;
    benefits: string[];
}>;
export type CreateTierRequest = z.infer<typeof CreateTierSchema>;
export declare const InitiatePaymentSchema: z.ZodObject<{
    creatorId: z.ZodString;
    tierId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    tierId: string;
    creatorId: string;
}, {
    tierId: string;
    creatorId: string;
}>;
export type InitiatePaymentRequest = z.infer<typeof InitiatePaymentSchema>;
export declare const VerifyPaymentSchema: z.ZodObject<{
    commitment: z.ZodString;
    creatorId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    commitment: string;
    creatorId: string;
}, {
    commitment: string;
    creatorId: string;
}>;
export type VerifyPaymentRequest = z.infer<typeof VerifyPaymentSchema>;
export interface EncryptedData {
    ciphertext: string;
    iv: string;
    tag?: string;
}
export interface CryptoKey {
    key: string;
    algorithm: 'AES-256-GCM' | 'AES-256-CBC';
}
