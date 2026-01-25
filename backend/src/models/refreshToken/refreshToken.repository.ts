import { RefreshTokenEntity } from './refreshToken.entity';
import { AppDataSource } from '../../config/dbConfig';
import { Repository } from 'typeorm';
import { IRefreshTokenRepository } from './interface/refreshToken.interface';

export class RefreshTokenRepository implements IRefreshTokenRepository {
  private repo: Repository<RefreshTokenEntity>;
  constructor() {
    this.repo = AppDataSource.getDataSource().getRepository(RefreshTokenEntity);
  }
  async create(data: Partial<RefreshTokenEntity>): Promise<RefreshTokenEntity> {
    const token = this.repo.create(data);
    return await this.repo.save(token);
  }
  async findByHash(tokenHash: string): Promise<RefreshTokenEntity | null> {
    return await this.repo.findOne({
      where: { tokenHash },
    });
  }
  async save(token: RefreshTokenEntity): Promise<RefreshTokenEntity> {
    return await this.repo.save(token);
  }
  async revokeAllByUserId(userId: string) {
    await this.repo.update({ userId }, { isRevoked: true });
  }
}
