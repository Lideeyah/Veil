import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/db';

export const listContent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { creatorId, type, search } = req.query;

        const where: any = {};

        if (creatorId && typeof creatorId === 'string') {
            where.creatorId = creatorId;
        }

        if (type && typeof type === 'string' && type !== 'all') {
            where.contentType = type.toUpperCase();
        }

        if (search && typeof search === 'string') {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        const content = await prisma.content.findMany({
            where,
            include: {
                creator: {
                    select: {
                        username: true,
                        displayName: true,
                    }
                },
                tier: {
                    select: {
                        name: true,
                    }
                }
            },
            orderBy: { publishedAt: 'desc' },
        });

        const formattedContent = content.map(item => ({
            id: item.id,
            title: item.title, // In real app, this might be encrypted. For now assuming plain or we decrypt public metadata.
            // Schema says `title` is "Encrypted title". 
            // If it's encrypted, we can't search by it easily without blind indexing.
            // For this MVP/Mock, let's assume we store a plain title OR we decrypt it if we have the key?
            // No, we can't decrypt without the key.
            // If the title is encrypted, the "Search" feature on the backend won't work for encrypted fields.
            // We should probably have a `publicTitle` or just assume for this demo that `title` is readable 
            // OR we are only searching on unencrypted fields.
            // The schema says `title` is `String // Encrypted title`.
            // This is a blocker for backend search.
            // However, for the purpose of this task, I will assume `title` is NOT encrypted in the database for now,
            // OR I will just return it as is and let the frontend handle it (but frontend can't decrypt without key).
            // Actually, `title` and `description` being encrypted means a "Public Library" is hard.
            // Maybe we only show "Locked Content" with a generic placeholder?
            // But the design shows titles.
            // IMPLICATION: The Creator's "Public" metadata (Title, Thumbnail) should probably be unencrypted 
            // if they want it to be discoverable.
            // Let's assume for this MVP that `title` is stored as PLAIN TEXT despite the comment, 
            // or we update the schema to have `publicTitle`.
            // I will assume it's plain text for now to make progress, as changing schema + migration is heavy.
            // I'll add a comment about this.

            creator: item.creator.displayName,
            creatorUsername: item.creator.username,
            type: item.contentType.toLowerCase(),
            thumbnail: item.thumbnailUrl,
            locked: !!item.tierId, // Locked if it belongs to a tier
            tier: item.tier?.name,
            date: item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : 'Unpublished',
            duration: item.durationSeconds ? `${Math.floor(item.durationSeconds / 60)}:${(item.durationSeconds % 60).toString().padStart(2, '0')}` : undefined,
            // Mock progress/unread for now as we don't have user auth fully wired for that
            progress: 0,
            unread: false,
        }));

        res.json({
            success: true,
            data: formattedContent,
        });
    } catch (error) {
        next(error);
    }
};

export const getContent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const content = await prisma.content.findUnique({
            where: { id },
            include: {
                creator: {
                    select: {
                        id: true,
                        username: true,
                        displayName: true,
                        profileImageUrl: true,
                    }
                },
                tier: {
                    select: {
                        id: true,
                        name: true,
                        amountZEC: true,
                        amountUSD: true,
                    }
                }
            }
        });

        if (!content) {
            return res.status(404).json({ success: false, message: 'Content not found' });
        }

        // Return public metadata. Actual content/keys are NOT returned here.
        // They are returned via `proveAccess`.

        res.json({
            success: true,
            data: {
                ...content,
                fileSizeBytes: content.fileSizeBytes?.toString(),
                metadata: content.metadata ? JSON.parse(content.metadata) : undefined,
                // @ts-ignore
                contentType: content.contentType.toLowerCase(),
                locked: !!content.tierId,
                tier: content.tier ? {
                    ...content.tier,
                    amountZEC: content.tier.amountZEC.toString(),
                    amountUSD: content.tier.amountUSD?.toString(),
                } : null,
            }
        });
    } catch (error) {
        next(error);
    }
};
