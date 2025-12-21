import { RefreshTokenService } from '../refreshToken.service';
import { RefreshTokenRepository } from '../refreshToken.repository';
import { UserEntity } from '../../user/user.entity';
import jwt from 'jsonwebtoken';

describe('RefreshTokenService Unit Tests', () => {
    let service: RefreshTokenService;
    let mockRepo: jest.Mocked<RefreshTokenRepository>;

    beforeEach(() => {
        mockRepo = {
            create: jest.fn(),
            findByHash: jest.fn(),
            save: jest.fn(),
            revokeAllByUserId: jest.fn()
        } as any;
        service = new RefreshTokenService(mockRepo);
        process.env.JWT_ACCESS_SECRET = 'access_secret';
        process.env.JWT_REFRESH_SECRET = 'refresh_secret';
    });

    const mockUser: UserEntity = {
        id: 'user-123',
        email: 'test@example.com'
    } as any;

    describe('createAccessTokenOnly', () => {
        it('should return a valid access token', () => {
            const token = service.createAccessTokenOnly(mockUser);
            expect(token).toBeDefined();
            const decoded = jwt.verify(token, 'access_secret') as any;
            expect(decoded.id).toBe(mockUser.id);
        });
    });

    describe('createFullSession', () => {
        it('should return access and refresh tokens and save to repo', async () => {
            const result = await service.createFullSession(mockUser);
            expect(result.accessToken).toBeDefined();
            expect(result.refreshToken).toBeDefined();
            expect(mockRepo.create).toHaveBeenCalled();
        });
    });

    describe('rotateRefreshToken', () => {
        it('should rotate tokens successfully', async () => {
            const oldToken = jwt.sign({ id: mockUser.id }, 'refresh_secret');
            const mockTokenEntity = {
                userId: mockUser.id,
                tokenHash: 'some-hash',
                isRevoked: false,
                expiresAt: new Date(Date.now() + 10000)
            };

            mockRepo.findByHash.mockResolvedValue(mockTokenEntity as any);
            mockRepo.save.mockResolvedValue({} as any);

            const result = await service.rotateRefreshToken(oldToken);
            expect(result.accessToken).toBeDefined();
            expect(result.refreshToken).toBeDefined();
            expect(mockRepo.save).toHaveBeenCalled();
            expect(mockTokenEntity.isRevoked).toBe(true);
        });

        it('should throw error for invalid token', async () => {
            await expect(service.rotateRefreshToken('invalid-token'))
                .rejects.toThrow('Token invalide ou expiré');
        });

        it('should throw error if token is revoked (reuse detection)', async () => {
    const oldToken = jwt.sign({ id: mockUser.id }, 'refresh_secret');

    mockRepo.findByHash.mockResolvedValue({
        isRevoked: true
    } as any);

    await expect(service.rotateRefreshToken(oldToken))
        .rejects.toThrow('Utilisation de token frauduleux détectée. Session fermée.');

    expect(mockRepo.revokeAllByUserId).toHaveBeenCalledWith(mockUser.id);
});

    });
});
