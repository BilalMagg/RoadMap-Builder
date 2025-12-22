import { UserService } from '../user.service';
import { IUserRepository } from '../interface/user.interface';
import { LoginRequestDto, UserRequestDto, UserResponseDto } from '../user.dto';
import jwt, { JwtPayload } from 'jsonwebtoken'
import * as HashUtils from '../../../utils/HashPassword';
import { UserController } from '../user.controller';
import { Request, Response } from 'express';
import { userService } from '../user.registry';
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

 describe('forgotPassword (Unit Test)',()=>{

  it('doit lever une erreur si email est vide ',async()=>{
  await expect(userService.forgotPassword('')).rejects.toThrow('Email is required');
   
});

  it('doit lever une erreur si user n existe pas',async()=>{
    mockUserRepository.findByEmail.mockResolvedValue(null);
    
    await expect( userService.forgotPassword('test12@gmail.com')).rejects.toThrow('User with this email does not exist');
  });

 });

 describe('resetPassword (Unit Test)',()=>{
     it('doit lever une erreur si Tous les champs sont vides ',async()=>{
         await expect(userService.resetPassword('','','')).rejects.toThrow('All fields are required')
    }); 

    it('doit lever une erreur si password n exist pas',async()=>{
         await expect(userService.resetPassword('dzfzufiugoifxthdzufzfdyrytrtrdzt','q123','')).rejects.toThrow('newPassword is required')
    });
     it('doit lever une erreur si token n exist pas',async()=>{
         await expect(userService.resetPassword('','q123','Password1234')).rejects.toThrow('Token is required')
    });
     it('doit lever une erreur si id n exist pas',async()=>{
         await expect(userService.resetPassword('dzfzufiugoifxthdzufzfdyrytrtrdzt','','Password1234')).rejects.toThrow('id is required')
    });

   
    it('doit lever une erreur si user n existe pas',async()=>{
      mockUserRepository.findById.mockResolvedValue(null);
      
      await expect( userService.resetPassword('dzfzufiugoifxthdzufzfdyrytrtrdzt','id123','Password1234')).rejects.toThrow('User does not exist');
    });
it('doit envoyer un message de succès', async () => {
  mockUserRepository.findById.mockResolvedValue({
    id: 'id11',
    username: 'somia',
    email: 'somia@gmail.com',
    password: 'hashedPassword',  
    avatar: 'avatar1',
    rememberMe: false,
    createdAt: new Date('2025-12-21T12:00:00Z'),
    updatedAt: new Date('2025-12-21T12:00:00Z')
  } );
  jest.spyOn(jwt,'verify').mockReturnValue({ id: 'id11', email: 'somia@gmail.com' } as any  );
  const result = await userService.resetPassword(
    'tokenValide',
    'id11',
    'Password1234'
  );

  expect(result.message).toBe('Password change succsefull');
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
            forgotPassword:jest.fn(),
            resetPassword:jest.fn()
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
    describe('Logout Test unitaire',()=>{
    it('efface les cookies et renvoie logout successful',async()=>{
        const req:any={};
        const res ={
            clearCookie: jest.fn(),
            status:jest.fn().mockReturnThis(),
            json:jest.fn()
        } as any;

        await userController.logout(req,res);
        expect(res.clearCookie).toHaveBeenCalledWith('accessToken');
        expect(res.clearCookie).toHaveBeenCalledWith('refreshToken');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message:"Logout successful"});

       
    });
 });
 describe('ForgotPassword - Test Unitaire (Controller)',()=>{
    it('doit renvoyer 200 et un message de succès',async()=>{
        const req: any = {
      body: {
        email: 'test@email.com'
      }
    };
        const res ={
            clearCookie: jest.fn(),
            status:jest.fn().mockReturnThis(),
            json:jest.fn()
        } as any;

        mockUserService.forgotPassword.mockResolvedValue({
            message:"Email sent successfully"
        })
        await userController.forgotPassword(req,res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message:'Email sent successfully'});
        

    })
 })
  describe('ResetPassword - Test Unitaire (Controller)',()=>{
    it('doit renvoyer 200 et un message de succès',async()=>{
        const req: any = {
      body: {
       
        password:'Any_Password'

      },
      params:{
        id:'id11',
         token:'Tokenvalide'
      }
    };
        const res ={
            clearCookie: jest.fn(),
            status:jest.fn().mockReturnThis(),
            json:jest.fn()
        } as any;

        mockUserService.resetPassword.mockResolvedValue({
            message:"Password change succsefull"
        })
        await userController.resetPassword(req,res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message:'Password change succsefull'});
        

    })
 })

});