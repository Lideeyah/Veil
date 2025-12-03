import { CreatorProfile, TierConfiguration } from '@veil/types';
import { generateMockShieldedAddress } from './mockAddress';

export function generateDemoCreators(): CreatorProfile[] {
    const creators: CreatorProfile[] = [];

    // 1. Tech Creator
    const techKeys = generateMockShieldedAddress();
    creators.push({
        id: 'creator_tech',
        username: 'cyberpunk_dev',
        displayName: 'Cyberpunk Developer',
        bio: 'Building privacy tools for the future. Open source advocate.',
        zcashShieldedAddress: techKeys.address,
        tiers: [
            {
                id: 'tier_tech_1',
                name: 'Supporter',
                description: 'Support my open source work',
                amountZEC: '0.1',
                amountUSD: '3.50',
                benefits: ['Early access to repos', 'Discord role'],
                isActive: true,
            },
            {
                id: 'tier_tech_2',
                name: 'Inner Circle',
                description: 'Direct access and mentorship',
                amountZEC: '1.0',
                amountUSD: '35.00',
                benefits: ['Weekly calls', 'Code review'],
                isActive: true,
            }
        ]
    });

    // 2. Artist
    const artKeys = generateMockShieldedAddress();
    creators.push({
        id: 'creator_art',
        username: 'digital_dreamer',
        displayName: 'Digital Dreamer',
        bio: 'Creating abstract digital art and NFTs.',
        zcashShieldedAddress: artKeys.address,
        tiers: [
            {
                id: 'tier_art_1',
                name: 'Fan',
                description: 'High-res wallpapers',
                amountZEC: '0.05',
                amountUSD: '1.75',
                benefits: ['4K downloads'],
                isActive: true,
            }
        ]
    });

    return creators;
}
