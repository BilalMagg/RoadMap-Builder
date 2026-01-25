import { IUserRepository } from './interface/user.interface';
import { hashPassword, MatchingPassword } from '../../utils/HashPassword';
import {
  LoginRequestDto,
  UserProfilResponse,
  UserRequestDto,
  UserResponseDto,
} from './user.dto';
import { RefreshTokenService } from '../refreshToken/refreshToken.service';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { IRoadmapRepository } from '../roadmap/interface/roadmap.interface';
import { UserEntity } from './user.entity';

export class UserService {
  constructor(
    private userRepo: IUserRepository,
    private tokenService: RefreshTokenService,
    private roadmapRepo: IRoadmapRepository,
  ) {}

  async signUp(userdata: UserRequestDto): Promise<UserResponseDto> {
    const { email, password, username } = userdata;

    const existingEmail = await this.userRepo.findByEmail(email);
    if (existingEmail) {
      throw new Error('email is already exist');
    }
    const existingUsername = await this.userRepo.findByUsername(username);
    if (existingUsername) {
      throw new Error('username is already exist');
    }
    const HashPassword = await hashPassword(password);
    const newUser = await this.userRepo.save({
      ...userdata,
      password: HashPassword,
    });
    return UserResponseDto.fromEntity(newUser);
  }
  async login(loginDto: LoginRequestDto) {
    const { email, password } = loginDto;

    if (!email || !password)
      throw new Error('Email or password are missing !!!!');
    const user = await this.userRepo.findByEmail(loginDto.email);
    if (!user) throw new Error('Invalid credentials');

    const isMatch = await MatchingPassword(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    let accessToken: string;
    let refreshToken: string | null = null;

    if (loginDto.rememberMe) {
      const tokens = await this.tokenService.createFullSession(user);
      accessToken = tokens.accessToken;
      refreshToken = tokens.refreshToken;
    } else {
      accessToken = this.tokenService.createAccessTokenOnly(user);
      refreshToken = null;
    }
    return {
      user: UserResponseDto.fromEntity(user),
      accessToken,
      refreshToken,
    };
  }
  async getProfil(id: string) {
    const user = await this.userRepo.findById(id);

    if (!user) {
      throw new Error('User not found');
    }

    const roadmapCount = await this.roadmapRepo.countByUserId(id);

    return {
      user: UserProfilResponse.fromEntity(user, { roadmaps: roadmapCount }),
    };
  }

  async EditProfil(updates: any, userId: string) {
    if (!updates || Object.keys(updates).length === 0) {
      throw new Error('no data provided to update');
    }
    const user = await this.userRepo.findById(userId);

    if (!user) {
      throw new Error('user not found');
    }

    const allowedFields = [
      'firstName',
      'lastName',
      'username',
      'email',
      'avatar',
      'age',
    ];
    let hasUpdate = false;

    for (let key of allowedFields) {
      if (updates.hasOwnProperty(key)) {
        if (updates[key] === null) {
          throw new Error(`value of ${key} is null`);
        }
        (user as any)[key] = updates[key];
        hasUpdate = true;
      }
    }

    if (!hasUpdate) {
      throw new Error('no valid field to update');
    }

    const UserUpdate = await this.userRepo.save(user);

    return {
      userUpdate: UserResponseDto.fromEntity(UserUpdate),
    };
  }

  async forgotPassword(email: string) {
    if (!email) {
      throw new Error('Email is required');
    }

    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      throw new Error('User with this email does not exist');
    } else {
      const secret = process.env.JWT_ACCESS_SECRET + user.password;
      const token = jwt.sign({ id: user.id }, secret, { expiresIn: '15m' });
      const link = `http://localhost:3000/reset-pasword/${user.id}/${token}`;
      const isTest = process.env.NODE_ENV === 'test';

      if (!isTest) {
        const transport = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: process.env.Email_User,
            pass: process.env.Email_Password,
          },
        });
        const mailOptions = {
          from: process.env.Email_User,
          to: user.email,
          subject: 'Reset Password ',
          html: `<div>
               <h4>Click on the link below to reset your passord</h4>
               <a href=${link}>${link}</a>
               </div>`,
        };
        //send Email with transport
        transport.sendMail(mailOptions, function (error: any, success: any) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent successfully' + success.response);
          }
        });
      }
      return {
        message: 'Email sent successfully',
        resetToken: isTest ? token : undefined,
        userId: isTest ? user.id : undefined,
      };
    }
  }

  async resetPassword(token: string, id: string, newPassword: string) {
    if (!token && !id && !newPassword) {
      throw new Error('All fields are required');
    }
    if (!id) {
      throw new Error('id is required');
    }
    if (!token) {
      throw new Error('Token is required');
    }
    if (!newPassword) {
      throw new Error('newPassword is required');
    }

    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new Error('User does not exist');
    }

    const secret = process.env.JWT_ACCESS_SECRET + user.password;
    try {
      jwt.verify(token, secret);
    } catch {
      throw new Error('Invalid or expired token');
    }

    // 6️⃣ hash + save
    user.password = await hashPassword(newPassword);
    await this.userRepo.save(user);

    return {
      message: 'Password change successful',
    };
  }
}
