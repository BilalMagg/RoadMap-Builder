
import { IUserRepository } from "./interface/user.interface";
import { hashPassword, MatchingPassword } from "../../utils/HashPassword";
import { LoginRequestDto, UserProfilResponse, UserRequestDto, UserResponseDto } from "./user.dto";
import { RefreshTokenService } from "../refreshToken/refreshToken.service";

export class UserService {
    constructor(private userRepo:IUserRepository,
               private tokenService: RefreshTokenService
    ){ }
    
    async signUp (userdata:UserRequestDto):Promise<UserResponseDto> {
          const { email, password, username } = userdata;
          
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
                  refreshToken 
              };
    }
    async getProfil(id:string) {
           const user = await this.userRepo.findById(id);

           if(!user){
            throw new Error("User not found")
           }

           return{
            user:UserProfilResponse.fromEntity(user)
           }
    }

}