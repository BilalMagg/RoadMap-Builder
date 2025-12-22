import bcrypt from "bcryptjs";
import { IUserRepository } from "./interface/user.interface";
import { hashPassword, MatchingPassword } from "../../utils/HashPassword";
import { LoginRequestDto, UserRequestDto, UserResponseDto } from "./user.dto";
import jwt from 'jsonwebtoken';
import { UserEntity } from './user.entity';
import { Request, Response } from "express";
import nodemailer from "nodemailer"
import { error } from "console";


export class UserService {
    constructor(private userRepo:IUserRepository){ }
    private generateToken(user: UserEntity, expiresIn: string, secret: string ) {
        return jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn, algorithm: 'HS256' } as any);
    }
   async signUp(userdata:UserRequestDto):Promise<UserResponseDto>{
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

        if(!loginDto.rememberMe){
          
        }
        const accessToken = this.generateToken(user, '15m', process.env.JWT_ACCESS_SECRET!);
        const refreshToken = this.generateToken(user, '7d', process.env.JWT_REFRESH_SECRET!);

        return { user: UserResponseDto.fromEntity(user), accessToken, refreshToken };
    }


  async forgotPassword(email:string){
    if(!email){
      throw new Error('Email is required');
 
    }
   
    const user=await this.userRepo.findByEmail(email);

   if(!user){
   throw new Error('User with this email does not exist');
   
   }else{
    const secret=process.env.JWT_ACCESS_SECRET + user.password;
    const token=this.generateToken(user,'10m',secret);
    const link=`http://localhost:3000/reset-pasword/${user.id}/${token}`;
    const transport=nodemailer.createTransport({
      service:"Gmail",
      auth:{
        user:process.env.Email_User,
        pass:process.env.Email_Password
      }
    })
    const mailOptions={
        from:process.env.Email_User,
        to:user.email,
        subject:"Reset Password ",
        html:`<div>
             <h4>Click on the link below to reset your passord</h4>
             <a href=${link}>${link}</a>
             </div>`
    }
     //send Email with transport
     transport.sendMail(mailOptions,function(error,success){
      if(error){
        console.log(error);

      }else{
        console.log("Email sent successfully"+success.response)
      }
     })
     return{message:"Email sent successfully"}
   }
  }

  async resetPassword( token:string,id:string,newPassword:string ){
    if(!token && !id && !newPassword){
      throw new Error('All fields are required')
    }
    if(!newPassword){
    throw new Error('newPassword is required');
    }
     if(!id){
       throw new Error('id is required');
    }
   
    if(!token){
       throw new Error("Token is required");
    }
     const user=await this.userRepo.findById(id);
    if(!user){
       throw new Error('User does not exist');
    }
    const secret=process.env.JWT_ACCESS_SECRET + user.password;
    try{
        jwt.verify(token,secret);
    }catch{
    throw new Error("Invalid or expired token");
  }
    user.password=await hashPassword(newPassword);
  
    await this.userRepo.save(user);
    return {
      message:"Password change succsefull"
    }
  
 
  }

}