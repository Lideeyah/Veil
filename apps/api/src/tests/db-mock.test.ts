import { prisma } from '../utils/db';

jest.mock('../utils/db', () => ({
    prisma: {
        creator: {
            create: jest.fn(),
        },
    },
}));

describe('DB Mock Check', () => {
    it('should be mocked', () => {
        expect(jest.isMockFunction(prisma.creator.create)).toBe(true);
    });
});
