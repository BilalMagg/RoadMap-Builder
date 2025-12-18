import { UserService } from './user.service';
import { IUserRepository } from '../interface/user/user.interface';
import { LoginRequestDto, UserRequestDto, UserResponseDto } from './user.dto';

import * as HashUtils from '../utils/HashPassword';
import { UserController } from './user.controller';
import { Request, Response } from 'express';
describe('UserService Unit Tests', () => {
    let userService: UserService;
    let mockUserRepository: jest.Mocked<IUserRepository>;

    beforeEach(() => {
       
        mockUserRepository = {
            findByEmail: jest.fn(),
            findByUsername: jest.fn(),
            save: jest.fn(),
            findById: jest.fn()
        } as any;

        userService = new UserService(mockUserRepository);
        process.env.JWT_ACCESS_SECRET = 'test_access_secret';
        process.env.JWT_REFRESH_SECRET = 'test_refresh_secret';
    });

    describe('signUp', () => {
        it('should successfully create a user when data is valid', async () => {

            const signupDto: UserRequestDto = {
                username: 'said',
                email: 'said@gmail.com',
                password: 'password123'
            };

            mockUserRepository.findByEmail.mockResolvedValue(null);
            mockUserRepository.findByUsername.mockResolvedValue(null);
            
            mockUserRepository.save.mockResolvedValue({
                id: '1111111',
                ...signupDto,
                password: 'hashedpassword',
                createdAt: new Date()
            } as any);

            
            const result = await userService.signUp(signupDto);

            expect(result).toBeDefined();
            expect(result.email).toBe(signupDto.email);
            expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
        });

        it('should throw an error if email already exists', async () => {
            const signupDto: UserRequestDto = {
                username: 'testuser',
                email: 'existing@example.com',
                password: 'password123'
            };
            mockUserRepository.findByEmail.mockResolvedValue({ id: '1' } as any);
            await expect(userService.signUp(signupDto)).rejects.toThrow('email is already exist');
        });
        it('should throw an error if username already exists', async () => {
            const signupDto: UserRequestDto = {
                username: 'testuser',
                email: 'existing@example.com',
                password: 'password123'
            };
            mockUserRepository.findByUsername.mockResolvedValue({ id: '1' } as any);
            await expect(userService.signUp(signupDto)).rejects.toThrow('username is already exist');
        });
    });
    describe('login', () => {
        it('should successfully login when data is valid', async () => {
            const loginDto : LoginRequestDto = {
                email: 'said@gmail.com',
                password: 'password123'
            };
            const mockUser= {
                id:'1',email:'said@gmail.com',password:'aaaaaaaaaa'
            }
            mockUserRepository.findByEmail.mockResolvedValue(mockUser as any);
            jest.spyOn(HashUtils, 'MatchingPassword').mockResolvedValue(true);
            
            const result = await userService.login(loginDto);

            expect(result).toHaveProperty('accessToken');
            expect(result).toHaveProperty('refreshToken');
            expect(result.user.email).toBe(mockUser.email);
            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(loginDto.email);
        });

        it('should throw an error if email wrong', async () => {
             const loginDto : LoginRequestDto = {
                email: 'said@gmail.com',
                password: 'password123'
            };
            mockUserRepository.findByEmail.mockResolvedValue(null);

            await expect(userService.login(loginDto)).rejects.toThrow('Invalid credentials');
        });
        it('should throw an error if password Wrong', async () => {
            const loginDto: LoginRequestDto = {
                email: 'said@gmail.com',
                password: 'wrongpwd'
            };
             jest.spyOn(HashUtils, 'MatchingPassword').mockResolvedValue(false);
            await expect(userService.login(loginDto)).rejects.toThrow('Invalid credentials');
        });
    });
});

describe('UserController Unit Tests', () => {
    let userController: UserController;
    let mockUserService: any;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let jsonSpy: jest.Mock;
    let statusSpy: jest.Mock;
    let cookieSpy: jest.Mock;

    beforeEach(() => {
        mockUserService = {
            signUp: jest.fn(),
            login: jest.fn(),
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
            const signupData = { username: 'said', email: 'said@gmail.com', password: '123' };
            mockRequest = { body: signupData };

            const mockCreatedUser = {
                id: '1',
                username: 'said',
                email: 'said@gmail.com',
                createdAt: new Date()
            };

            mockUserService.signUp.mockResolvedValue(mockCreatedUser);

            await userController.signUp(mockRequest as Request, mockResponse as Response);

            expect(statusSpy).toHaveBeenCalledWith(201);
            expect(jsonSpy).toHaveBeenCalledWith({
                message: "User created successfully",
                data: mockCreatedUser
            });
        });

        it('should return 500 when service throws an error', async () => {
            mockRequest = { 
                body: { username: 'said', email: 'said@gmail.com', password: '123' } 
            };
            mockUserService.signUp.mockRejectedValue(new Error('Internal Error'));

            await userController.signUp(mockRequest as Request, mockResponse as Response);

            expect(statusSpy).toHaveBeenCalledWith(500);
            expect(jsonSpy).toHaveBeenCalledWith(expect.objectContaining({
                message: 'Internal Error'
            }));
        });
    });

    describe('login', () => {
        it('should set cookies and return 200 when login is successful', async () => {
            mockRequest = { body: { email: 'said@gmail.com', password: '123' } };
            
            const loginResponse = {
                user: { id: '1', username: 'said' },
                accessToken: 'access_token_val',
                refreshToken: 'refresh_token_val'
            };

            mockUserService.login.mockResolvedValue(loginResponse);

            await userController.login(mockRequest as Request, mockResponse as Response);

            expect(statusSpy).toHaveBeenCalledWith(200);
            expect(cookieSpy).toHaveBeenCalledWith('accessToken', 'access_token_val', expect.any(Object));
            expect(cookieSpy).toHaveBeenCalledWith('refreshToken', 'refresh_token_val', expect.any(Object));
            expect(jsonSpy).toHaveBeenCalledWith({
                message: "Login successful",
                user: loginResponse.user
            });
        });
    });
});