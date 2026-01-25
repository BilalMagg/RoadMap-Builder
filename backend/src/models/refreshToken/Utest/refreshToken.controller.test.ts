import { RefreshTokenController } from '../refreshToken.controller';
import { Request, Response } from 'express';

describe('RefreshTokenController Unit Tests', () => {
  let controller: RefreshTokenController;
  let mockService: any;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let statusSpy: jest.Mock;
  let jsonSpy: jest.Mock;
  let cookieSpy: jest.Mock;
  let clearCookieSpy: jest.Mock;

  beforeEach(() => {
    mockService = {
      rotateRefreshToken: jest.fn(),
    };
    controller = new RefreshTokenController(mockService);

    statusSpy = jest.fn().mockReturnThis();
    jsonSpy = jest.fn().mockReturnThis();
    cookieSpy = jest.fn().mockReturnThis();
    clearCookieSpy = jest.fn().mockReturnThis();

    mockResponse = {
      status: statusSpy,
      json: jsonSpy,
      cookie: cookieSpy,
      clearCookie: clearCookieSpy,
    };
  });

  it('should return 401 if refresh token cookie is missing', async () => {
    mockRequest = { cookies: {} };
    await controller.refresh(mockRequest as Request, mockResponse as Response);
    expect(statusSpy).toHaveBeenCalledWith(401);
    expect(jsonSpy).toHaveBeenCalledWith({ message: 'Non authentifié' });
  });

  it('should refresh tokens successfully and set cookies', async () => {
    mockRequest = { cookies: { refreshToken: 'old-token' } };
    mockService.rotateRefreshToken.mockResolvedValue({
      accessToken: 'new-access',
      refreshToken: 'new-refresh',
    });

    await controller.refresh(mockRequest as Request, mockResponse as Response);

    expect(cookieSpy).toHaveBeenCalledWith(
      'accessToken',
      'new-access',
      expect.anything(),
    );
    expect(cookieSpy).toHaveBeenCalledWith(
      'refreshToken',
      'new-refresh',
      expect.anything(),
    );
    expect(statusSpy).toHaveBeenCalledWith(200);
    expect(jsonSpy).toHaveBeenCalledWith({ message: 'Refresh réussi' });
  });

  it('should clear cookie and return 403 on service error', async () => {
    mockRequest = { cookies: { refreshToken: 'bad-token' } };
    mockService.rotateRefreshToken.mockRejectedValue(
      new Error('Invalid token'),
    );

    await controller.refresh(mockRequest as Request, mockResponse as Response);

    expect(clearCookieSpy).toHaveBeenCalledWith('refreshToken');
    expect(statusSpy).toHaveBeenCalledWith(403);
    expect(jsonSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Session invalide ou expirée',
      }),
    );
  });
});
