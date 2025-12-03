import { z } from 'zod';
// Type guards
export const isZcashAddress = (value) => {
    return value.startsWith('zs1') && value.length > 70; // Basic validation
};
export const isViewingKey = (value) => {
    return value.length > 100; // Basic validation
};
export const MemoDataSchema = z.object({
    version: z.literal(1),
    tierId: z.string(),
    supporterPubKey: z.string(),
    commitment: z.string(),
    timestamp: z.string().datetime(),
    encryptedEmail: z.string().optional(),
});
// -----------------------------------------------------------------------------
// 2. PAYMENT TYPES
// -----------------------------------------------------------------------------
export var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["CONFIRMED"] = "confirmed";
    PaymentStatus["FAILED"] = "failed";
})(PaymentStatus || (PaymentStatus = {}));
export const TierConfigurationSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    amountZEC: z.string(),
    amountUSD: z.string().optional(),
    benefits: z.array(z.string()),
    isActive: z.boolean(),
});
// -----------------------------------------------------------------------------
// 4. CONTENT TYPES
// -----------------------------------------------------------------------------
export var ContentType;
(function (ContentType) {
    ContentType["ARTICLE"] = "ARTICLE";
    ContentType["VIDEO"] = "VIDEO";
    ContentType["AUDIO"] = "AUDIO";
    ContentType["IMAGE"] = "IMAGE";
    ContentType["FILE"] = "FILE";
})(ContentType || (ContentType = {}));
export var StorageProvider;
(function (StorageProvider) {
    StorageProvider["IPFS"] = "IPFS";
    StorageProvider["S3"] = "S3";
    StorageProvider["ARWEAVE"] = "ARWEAVE";
})(StorageProvider || (StorageProvider = {}));
// Auth
export const RegisterCreatorSchema = z.object({
    username: z.string().min(3).max(20).regex(/^[a-z0-9_]+$/),
    displayName: z.string().min(1),
    bio: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(8),
});
export const LoginSchema = z.object({
    username: z.string(),
    password: z.string(),
});
// Tiers
export const CreateTierSchema = z.object({
    name: z.string().min(1),
    description: z.string(),
    amountZEC: z.number().positive(),
    benefits: z.array(z.string()),
});
// Payment
export const InitiatePaymentSchema = z.object({
    creatorId: z.string(),
    tierId: z.string(),
});
export const VerifyPaymentSchema = z.object({
    commitment: z.string(),
    creatorId: z.string(),
});
