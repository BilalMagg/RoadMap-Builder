import { RefreshTokenController } from './refreshToken.controller';
import { RefreshTokenRepository } from './refreshToken.repository';
import { RefreshTokenService } from './refreshToken.service';

// Singleton : On instancie une seule fois
const repository = new RefreshTokenRepository();
const service = new RefreshTokenService(repository);
const controller = new RefreshTokenController(service);

// On exporte les instances prêtes à l'emploi
export const RefreshTokenRegistry = {
  repository,
  service,
  controller,
};
