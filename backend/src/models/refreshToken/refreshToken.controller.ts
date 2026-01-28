import { Request, Response } from 'express';
import { RefreshTokenService } from './refreshToken.service';
import dotenv from 'dotenv';
dotenv.config();
console.log(process.env.NODE_ENV === process.env.ENV_PROD)
export class RefreshTokenController {
  constructor(private refreshTokenService: RefreshTokenService) {}

  async refresh(req: Request, res: Response) {
    console.log('Cookies reçus :', req.cookies);
    console.log('Request origin:', req.headers.origin);
    console.log('Request host:', req.headers.host);
    const incomingToken = req.cookies.refreshToken;

    if (!incomingToken) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    try {
      const { accessToken, refreshToken } =
        await this.refreshTokenService.rotateRefreshToken(incomingToken);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 2 * 60 * 1000,
        path: '/',
      });

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 10 * 1000,
        path: '/',
      });
      return res.status(200).json({ message: 'Refresh réussi' });
    } catch (error) {
      res.clearCookie('refreshToken');
      return res.status(403).json({
        message: 'Session invalide ou expirée',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
