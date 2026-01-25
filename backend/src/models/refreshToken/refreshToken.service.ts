import { RefreshTokenRepository } from './refreshToken.repository';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { UserEntity } from '../user/user.entity';
import { IRefreshTokenRepository } from './interface/refreshToken.interface';

export class RefreshTokenService {
  constructor(private tokenRepo: IRefreshTokenRepository) {}

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private signAccessToken(userId: string): string {
    return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET!, {
      expiresIn: '15m',
    });
  }

  private signRefreshToken(userId: string): string {
    return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: '7d',
    });
  }

  createAccessTokenOnly(user: UserEntity) {
    const accessToken = this.signAccessToken(user.id);
    return accessToken;
  }

  async createFullSession(user: UserEntity) {
    const accessToken = this.signAccessToken(user.id);

    const refreshToken = this.signRefreshToken(user.id);

    await this.tokenRepo.create({
      userId: user.id,
      tokenHash: this.hashToken(refreshToken),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      isRevoked: false,
    });

    return { accessToken, refreshToken };
  }

  async rotateRefreshToken(incomingToken: string) {
    let payload: any;
    try {
      payload = jwt.verify(incomingToken, process.env.JWT_REFRESH_SECRET!);
    } catch (error) {
      throw new Error('Token invalide ou expiré');
    }

    const incomingTokenHash = this.hashToken(incomingToken);
    const existingToken = await this.tokenRepo.findByHash(incomingTokenHash);

    if (
      !existingToken ||
      existingToken.isRevoked ||
      existingToken.replacedByTokenHash
    ) {
      if (payload.id) {
        console.warn(
          `[SECURITY] Tentative de vol de session détectée pour User ${payload.id}`,
        );
        await this.tokenRepo.revokeAllByUserId(payload.id);
      }
      throw new Error(
        'Utilisation de token frauduleux détectée. Session fermée.',
      );
    }

    const accessToken = this.signAccessToken(existingToken.userId);
    const newRefreshToken = this.signRefreshToken(existingToken.userId);
    const newRefreshTokenHash = this.hashToken(newRefreshToken);

    existingToken.isRevoked = true;
    existingToken.replacedByTokenHash = newRefreshTokenHash;
    await this.tokenRepo.save(existingToken);

    await this.tokenRepo.create({
      userId: existingToken.userId,
      tokenHash: newRefreshTokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      isRevoked: false,
    });

    return { accessToken, refreshToken: newRefreshToken };
  }
}
