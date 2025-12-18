import bcrypt from "bcryptjs";
import { IUserRepository } from "./interface/user.interface";
import { hashPassword, MatchingPassword } from "../../utils/HashPassword";
import { LoginRequestDto, UserRequestDto, UserResponseDto } from "./user.dto";
import jwt from 'jsonwebtoken';
import { UserEntity } from './user.entity';

export class UserService {
    constructor(private userRepo:IUserRepository){ }
    private generateToken(user: UserEntity, expiresIn: string, secret: string ) {
        return jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn, algorithm: 'HS256' } as any);
    }
    
   async signUp (userdata:UserRequestDto):Promise<UserResponseDto> {
          const { email, password, username } = userdata;
          if(!email || !password || !username){
            throw new Error('missing value')
          }
          const existingEmail = await this.userRepo.findByEmail(email);
          if(existingEmail){
            throw new Error('email is already exist')
          }
          const existingUsername =  await this.userRepo.findByUsername(username);
          if(existingUsername){
             throw new Error('username is already exist')
          }
          const HashPassword = await hashPassword(password);
          const newUser = await this.userRepo.save({
            ...userdata,
            password:HashPassword
          });
          return UserResponseDto.fromEntity(newUser);
    }
   async login(loginDto: LoginRequestDto) {

        const {email , password} = loginDto;
        
        if(!email || !password) throw new Error('Email or password are missing !!!!');
        const user = await this.userRepo.findByEmail(loginDto.email);
        if (!user) throw new Error('Invalid credentials');

        const isMatch = await MatchingPassword(password,user.password);
        if (!isMatch) throw new Error('Invalid credentials');

        let refreshToken :string | null = null;
        if (loginDto.rememberMe) {
          refreshToken = this.generateToken(
            user,
            "7d",
            process.env.JWT_REFRESH_SECRET!
    );
  }
        const accessToken = this.generateToken(user, '15m', process.env.JWT_ACCESS_SECRET!);
        
        return { user: UserResponseDto.fromEntity(user), accessToken, refreshToken };
    }


    async refreshToken(oldToken: string) {
    const payload = jwt.verify(oldToken, process.env.JWT_REFRESH_SECRET!) as any;
    const user = await this.userRepo.findById(payload.id);
    if (!user) throw new Error('User not found');

    const newAccessToken = this.generateToken(user, process.env.JWT_ACCESS_SECRET!, '15m');
    const newRefreshToken = this.generateToken(user, process.env.JWT_REFRESH_SECRET!, '7d');
    
    return { newAccessToken , newRefreshToken };
  }

   

}