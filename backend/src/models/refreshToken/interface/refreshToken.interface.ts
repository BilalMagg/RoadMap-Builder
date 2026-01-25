import { RefreshTokenEntity } from '../refreshToken.entity';

export interface IRefreshTokenRepository {
  create(data: Partial<RefreshTokenEntity>): Promise<RefreshTokenEntity>;
  findByHash(tokenHash: string): Promise<RefreshTokenEntity | null>;
  save(token: RefreshTokenEntity): Promise<RefreshTokenEntity>;
  revokeAllByUserId(userId: string): Promise<void>;
}
