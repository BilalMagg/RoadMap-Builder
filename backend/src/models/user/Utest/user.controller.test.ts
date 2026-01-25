import { UserController } from '../user.controller';
import { Request, Response } from 'express';
import { ApiResponse } from '../../../utils/api/api.response';

describe('UserController Unit Tests', () => {
  let userController: UserController;
  let mockUserService: any;
  let mockRequest: Partial<Request>;
  let mockResponse: any;
  let jsonSpy: jest.Mock;
  let statusSpy: jest.Mock;
  let cookieSpy: jest.Mock;

  beforeEach(() => {
    mockUserService = {
      signUp: jest.fn(),
      login: jest.fn(),
      getProfil: jest.fn(),
      forgotPassword: jest.fn(),
      resetPassword: jest.fn(),
      EditProfil: jest.fn(),
    };

    userController = new UserController(mockUserService);

    jsonSpy = jest.fn().mockReturnThis();
    statusSpy = jest.fn().mockReturnThis();
    cookieSpy = jest.fn().mockReturnThis();

    mockResponse = {
      status: statusSpy,
      json: jsonSpy,
      cookie: cookieSpy,
    };
  });

  describe('signUp', () => {
    it('should return 201 and user data when signup is successful', async () => {
      const signupData = {
        username: 'said',
        email: 'said@gmail.com',
        password: '123',
      };
      mockRequest = { body: signupData };

      const mockCreatedUser = {
        id: '1',
        username: 'said',
        email: 'said@gmail.com',
        createdAt: new Date(),
      };

      mockUserService.signUp.mockResolvedValue(mockCreatedUser);

      await userController.signUp(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(statusSpy).toHaveBeenCalledWith(201);
      expect(jsonSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'User created successfully',
          data: mockCreatedUser,
          success: true,
        }),
      );
    });

    it('should return 500 when service throws an error', async () => {
      mockRequest = {
        body: { username: 'said', email: 'said@gmail.com', password: '123' },
      };
      mockUserService.signUp.mockRejectedValue(new Error('Internal Error'));

      await userController.signUp(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(statusSpy).toHaveBeenCalledWith(500);
      expect(jsonSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Internal Error',
          success: false,
        }),
      );
    });
  });

  describe('login', () => {
    it('should set cookies and return 200 when login is successful', async () => {
      mockRequest = { body: { email: 'said@gmail.com', password: '123' } };

      const loginResponse = {
        user: { id: '1', username: 'said' },
        accessToken: 'access_token_val',
        refreshToken: 'refresh_token_val',
      };

      mockUserService.login.mockResolvedValue(loginResponse);

      await userController.login(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(cookieSpy).toHaveBeenCalledWith(
        'accessToken',
        'access_token_val',
        expect.any(Object),
      );
      expect(cookieSpy).toHaveBeenCalledWith(
        'refreshToken',
        'refresh_token_val',
        expect.any(Object),
      );
      expect(jsonSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Login successful',
          data: loginResponse.user,
          success: true,
        }),
      );
    });
  });

  describe('Logout', () => {
    it('should clear cookies and return logout successful', async () => {
      const req: any = {};
      const res = {
        clearCookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      await userController.logout(req, res);
      expect(res.clearCookie).toHaveBeenCalledWith('accessToken');
      expect(res.clearCookie).toHaveBeenCalledWith('refreshToken');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Logout successful' });
    });
  });

  describe('ForgotPassword', () => {
    it('should return 200 and success message when successful', async () => {
      mockRequest = { body: { email: 'test@email.com' } };

      mockUserService.forgotPassword.mockResolvedValue({
        message: 'Email sent successfully',
        resetToken: 'some-token',
        userId: 'id123',
      });

      await userController.forgotPassword(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Email sent successfully',
          success: true,
        }),
      );
    });

    it('should return 404 when user does not exist', async () => {
      mockRequest = { body: { email: 'wrong@email.com' } };
      mockUserService.forgotPassword.mockRejectedValue(
        new Error('User with this email does not exist'),
      );

      await userController.forgotPassword(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(statusSpy).toHaveBeenCalledWith(404);
      expect(jsonSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'User with this email does not exist',
          success: false,
        }),
      );
    });
  });

  describe('ResetPassword', () => {
    it('should return 200 and success message when successful', async () => {
      mockRequest = {
        body: { password: 'NewPassword123' },
        params: { id: 'id11', token: 'Tokenvalide' },
      };

      mockUserService.resetPassword.mockResolvedValue({
        message: 'Password change successful',
      });

      await userController.resetPassword(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Password change successful',
          success: true,
        }),
      );
    });

    it('should return 401 when token is invalid', async () => {
      mockRequest = {
        body: { password: 'NewPassword123' },
        params: { id: 'id11', token: 'InvalidToken' },
      };

      mockUserService.resetPassword.mockRejectedValue(
        new Error('Invalid or expired token'),
      );

      await userController.resetPassword(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(statusSpy).toHaveBeenCalledWith(401);
      expect(jsonSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid or expired token',
          success: false,
        }),
      );
    });
  });
  describe('UserController - EditProfil', () => {
    it('should return 200 and success response when update succeeds', async () => {
      const updatedUser = { firstName: 'Ali', lastName: 'Smith' };
      mockUserService.EditProfil.mockResolvedValue(updatedUser);

      const mockReq: any = { body: { firstName: 'Ali' }, userId: '123' };

      await userController.EditProfil(mockReq, mockResponse);
      const ResponseJson = ApiResponse.success(
        updatedUser,
        'Profil change successfully',
      );

      expect(mockUserService.EditProfil).toHaveBeenCalledWith(
        mockReq.body,
        mockReq.userId,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(ResponseJson.success).toBe(true);
      expect(ResponseJson.message).toBe('Profil change successfully');
      expect(ResponseJson.data).toEqual(updatedUser);
      expect(ResponseJson.error).toBeNull();
      // timestamp n’existe pas en test → on n’a rien à vérifier
      expect(ResponseJson.timestamp).toBeUndefined();
    });
  });
});
