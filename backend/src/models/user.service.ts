import { IUserRepository } from "../interface/user/user.repository.interface";
import { hashPassword } from "../utils/HashPassword";
import { UserRequestDto, UserResponseDto } from "./user.dto";


export class UserService {
    constructor(private userRepo:IUserRepository){ }
    
   async signUp(userdata:UserRequestDto):Promise<UserResponseDto>{
          const { email, password, username } = userdata;
          if(!email || !password || !username){
            throw new Error('missing value')
          }
          const existingEmail = await this.userRepo.findByEmail(email);
          if(existingEmail){
            throw new Error('email is already exist choose another !!!')
          }
          const existingUsername =  await this.userRepo.findByUsername(username);
          if(existingUsername){
             throw new Error('username is already exist choose another !!!')
          }
          const HashPassword = await hashPassword(password);
          const newUser = await this.userRepo.save({
            ...userdata,
            password:HashPassword
          });
          return UserResponseDto.fromEntity(newUser);
    }
}