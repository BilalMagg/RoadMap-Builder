import { UserService } from '../user.service';
import { IUserRepository } from '../interface/user.interface';
import { LoginRequestDto, UserRequestDto } from '../user.dto';
import jwt from 'jsonwebtoken';
import * as HashUtils from '../../../utils/HashPassword';

describe('UserService Unit Tests', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockTokenService: any;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
    } as any;

    mockTokenService = {
      createFullSession: jest.fn().mockResolvedValue({
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      }),
      createAccessTokenOnly: jest.fn().mockReturnValue('access_token'),
    };

    const mockRoadmapRepository: any = {
      countByUserId: jest.fn().mockResolvedValue(0),
    };

    userService = new UserService(
      mockUserRepository,
      mockTokenService,
      mockRoadmapRepository,
    );
    process.env.JWT_ACCESS_SECRET = 'test_access_secret';
    process.env.JWT_REFRESH_SECRET = 'test_refresh_secret';
  });

  describe('signUp', () => {
    it('should successfully create a user when data is valid', async () => {
      const signupDto: UserRequestDto = {
        username: 'said',
        email: 'said@gmail.com',
        password: 'password123',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.findByUsername.mockResolvedValue(null);
      mockUserRepository.save.mockResolvedValue({
        id: '1111111',
        ...signupDto,
        password: 'hashedpassword',
        createdAt: new Date(),
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
        password: 'password123',
      };
      mockUserRepository.findByEmail.mockResolvedValue({ id: '1' } as any);
      await expect(userService.signUp(signupDto)).rejects.toThrow(
        'email is already exist',
      );
    });

    it('should throw an error if username already exists', async () => {
      const signupDto: UserRequestDto = {
        username: 'testuser',
        email: 'existing@example.com',
        password: 'password123',
      };
      mockUserRepository.findByUsername.mockResolvedValue({ id: '1' } as any);
      await expect(userService.signUp(signupDto)).rejects.toThrow(
        'username is already exist',
      );
    });
  });

  describe('login', () => {
    it('should successfully login when data is valid', async () => {
      const loginDto: LoginRequestDto = {
        email: 'said@gmail.com',
        password: 'password123',
        rememberMe: true,
      };
      const mockUser = {
        id: '1',
        email: 'said@gmail.com',
        password: 'aaaaaaaaaa',
      };
      mockUserRepository.findByEmail.mockResolvedValue(mockUser as any);
      jest.spyOn(HashUtils, 'MatchingPassword').mockResolvedValue(true);

      const result = await userService.login(loginDto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user.email).toBe(mockUser.email);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        loginDto.email,
      );
    });

    it('should throw an error if email wrong', async () => {
      const loginDto: LoginRequestDto = {
        email: 'said@gmail.com',
        password: 'password123',
      };
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(userService.login(loginDto)).rejects.toThrow(
        'Invalid credentials',
      );
    });

    it('should throw an error if password Wrong', async () => {
      const loginDto: LoginRequestDto = {
        email: 'said@gmail.com',
        password: 'wrongpwd',
      };
      jest.spyOn(HashUtils, 'MatchingPassword').mockResolvedValue(false);
      await expect(userService.login(loginDto)).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });

  describe('forgotPassword (Unit Test)', () => {
    it('doit lever une erreur si email est vide ', async () => {
      await expect(userService.forgotPassword('')).rejects.toThrow(
        'Email is required',
      );
    });

    it('doit lever une erreur si user n existe pas', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      await expect(
        userService.forgotPassword('test12@gmail.com'),
      ).rejects.toThrow('User with this email does not exist');
    });

    it('doit retourner le token et userId en mode test', async () => {
      process.env.NODE_ENV = 'test';
      const mockUser = {
        id: 'id123',
        email: 'said@gmail.com',
        password: 'hashedpassword',
      };
      mockUserRepository.findByEmail.mockResolvedValue(mockUser as any);

      const result = await userService.forgotPassword('said@gmail.com');

      expect(result.message).toBe('Email sent successfully');
      expect(result.resetToken).toBeDefined();
      expect(result.userId).toBe('id123');
    });
  });

  describe('resetPassword (Unit Test)', () => {
    it('doit lever une erreur si tous les champs sont vides', async () => {
      await expect(userService.resetPassword('', '', '')).rejects.toThrow(
        'All fields are required',
      );
    });

    it('doit lever une erreur si id n existe pas', async () => {
      await expect(
        userService.resetPassword('token', '', 'Password1234'),
      ).rejects.toThrow('id is required');
    });

    it('doit lever une erreur si user n existe pas', async () => {
      mockUserRepository.findById.mockResolvedValue(null);
      await expect(
        userService.resetPassword('token', 'id123', 'Password1234'),
      ).rejects.toThrow('User does not exist');
    });

    it('doit lever une erreur si token est manquant', async () => {
      mockUserRepository.findById.mockResolvedValue({
        id: 'id123',
        password: 'hashed',
      } as any);
      await expect(
        userService.resetPassword('', 'id123', 'Password1234'),
      ).rejects.toThrow('Token is required');
    });

    it('doit lever une erreur si newPassword est manquant', async () => {
      mockUserRepository.findById.mockResolvedValue({
        id: 'id123',
        password: 'hashed',
      } as any);
      await expect(
        userService.resetPassword('tokenValide', 'id123', ''),
      ).rejects.toThrow('newPassword is required');
    });

    it('doit retourner un message de succès', async () => {
      mockUserRepository.findById.mockResolvedValue({
        id: 'id11',
        password: 'hashed',
      } as any);
      jest.spyOn(jwt, 'verify').mockReturnValue({ id: 'id11' } as any);
      jest
        .spyOn(HashUtils, 'hashPassword')
        .mockResolvedValue('newhashedpassword');

      const result = await userService.resetPassword(
        'tokenValide',
        'id11',
        'Password1234',
      );

      expect(result.message).toBe('Password change successful');
      expect(mockUserRepository.save).toHaveBeenCalled();
    });
  });

  describe('EditProfil', () => {
    it('should throw an error if user not found', async () => {
      // simulate user not found
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(
        userService.EditProfil({ firstName: 'John' }, '123'),
      ).rejects.toThrow('user not found');
    });

    it('should update user profile correctly', async () => {
      const user: any = { firstName: 'Old', lastName: 'Name', age: 25 };

      mockUserRepository.findById.mockResolvedValue(user);
      mockUserRepository.save.mockResolvedValue(user);

      const updates = { firstName: 'New', age: 30 };

      const result = await userService.EditProfil(updates, '1');

      // 🔹 Vérification des modifications
      expect(user.firstName).toBe('New');
      expect(user.age).toBe(30);
      expect(user.lastName).toBe('Name'); // inchangé

      // 🔹 Vérifier que save reçoit le user MODIFIÉ
      expect(mockUserRepository.save).toHaveBeenCalledWith(user);
    });
    it('should throw error when field value is null', async () => {
      const user: any = { firstName: 'Old', lastName: 'Name' };

      mockUserRepository.findById.mockResolvedValue(user);

      const updates = { lastName: null };

      await expect(userService.EditProfil(updates, '1')).rejects.toThrow(
        'value of lastName is null',
      );

      // save ne doit PAS être appelé
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
    it('should throw error when no valid field is provided', async () => {
      const user: any = { firstName: 'Old', lastName: 'Name' };

      mockUserRepository.findById.mockResolvedValue(user);

      const updates = { role: 'ADMIN' }; // champ interdit

      await expect(userService.EditProfil(updates, '1')).rejects.toThrow(
        'no valid field to update',
      );

      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
    it('should throw error when updates is empty', async () => {
      await expect(userService.EditProfil({}, '1')).rejects.toThrow(
        'no data provided to update',
      );
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  });
});
