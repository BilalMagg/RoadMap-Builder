import { UserController } from '../user.controller';
import { Request, Response } from 'express';

describe('UserController Unit Tests', () => {
  let userController: UserController;
  let mockUserService: any;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let statusSpy: jest.Mock;
  let jsonSpy: jest.Mock;
  let cookieSpy: jest.Mock;

  beforeEach(() => {
    mockUserService = {
      signUp: jest.fn(),
      login: jest.fn(),
      getProfil: jest.fn()
    };

    userController = new UserController(mockUserService);

    statusSpy = jest.fn().mockReturnThis();
    jsonSpy = jest.fn().mockReturnThis();
    cookieSpy = jest.fn().mockReturnThis();

    mockResponse = {
      status: statusSpy,
      json: jsonSpy,
      cookie: cookieSpy
    };
  });

  describe('signUp', () => {
    it('should return 201 when signup success', async () => {
      mockRequest = {
        body: {
          username: 'said',
          email: 'said@gmail.com',
          password: '123'
        }
      };

      const user = {
        id: '1',
        username: 'said',
        email: 'said@gmail.com'
      };

      mockUserService.signUp.mockResolvedValue(user);

      await userController.signUp(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusSpy).toHaveBeenCalledWith(201);
      expect(jsonSpy).toHaveBeenCalledWith(expect.objectContaining({
        message: 'User created successfully',
        data: user,
        success: true
      }));
    });

    it('should return 409 when signup fails', async () => {
      mockRequest = {
        body: {
          username: 'said',
          email: 'said@gmail.com',
          password: '123'
        }
      };

      mockUserService.signUp.mockRejectedValue(
        new Error('email is already exist')
      );

      await userController.signUp(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusSpy).toHaveBeenCalledWith(409);
      expect(jsonSpy).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: 'email is already exist'
      }));
    });
  });

    describe('login', () => {
      it('should set accessToken and refreshToken when rememberMe is true', async () => {
        mockRequest = {
          body: {
            email: 'said@gmail.com',
            password: '123',
            rememberMe: true
          }
        };
  
        mockUserService.login.mockResolvedValue({
          user: { id: '1', username: 'said' },
          accessToken: 'access_token',
          refreshToken: 'refresh_token'
        });
  
        await userController.login(
          mockRequest as Request,
          mockResponse as Response
        );
  
        expect(statusSpy).toHaveBeenCalledWith(200);
        expect(cookieSpy).toHaveBeenCalledWith(
          'accessToken',
          'access_token',
          expect.any(Object)
        );
        expect(cookieSpy).toHaveBeenCalledWith(
          'refreshToken',
          'refresh_token',
          expect.any(Object)
        );
        expect(jsonSpy).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        message: 'Login successful'
      }))
      });
  
      it('should set only accessToken when rememberMe is false', async () => {
        mockRequest = {
          body: {
            email: 'said@gmail.com',
            password: '123',
            rememberMe: false
          }
        };
  
        mockUserService.login.mockResolvedValue({
          user: { id: '1', username: 'said' },
          accessToken: 'access_token',
          refreshToken: 'refresh_token'
        });
  
        await userController.login(
          mockRequest as Request,
          mockResponse as Response
        );
  
        expect(statusSpy).toHaveBeenCalledWith(200);
        expect(cookieSpy).toHaveBeenCalledWith(
          'accessToken',
          'access_token',
          expect.any(Object)
        );
        expect(cookieSpy).not.toHaveBeenCalledWith(
          'refreshToken',
          expect.anything(),
          expect.anything()
        );
       expect(jsonSpy).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        message: 'Login successful'
      }));
      });
  });

  describe('getProfil', () => {
    it('should return 200 and user profile when successful', async () => {
      mockRequest = {
        userId: '1'
      };

      const profil = {
        user: {
          username: 'said',
          email: 'said@gmail.com'
        }
      };

      mockUserService.getProfil.mockResolvedValue(profil);

      await userController.getProfil(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        message: 'User Profil',
        data: profil
      }));
    });

    it('should return 401 when userId is missing', async () => {
      mockRequest = {};

      await userController.getProfil(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusSpy).toHaveBeenCalledWith(401);
      expect(jsonSpy).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: 'User ID missing from request'
      }));
    });

    it('should return 404 when user not found', async () => {
      mockRequest = { userId: '999' };
      mockUserService.getProfil.mockRejectedValue(new Error('User not found'));

      await userController.getProfil(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusSpy).toHaveBeenCalledWith(404);
      expect(jsonSpy).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: 'User not found'
      }));
    });
  });
});
