import { UserService } from "./user.service";

import { Request, Response } from "express";
import { LoginRequestDto, UserRequestDto } from "./user.dto";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
export class UserController {
    constructor(private userService: UserService) { }

    async signUp(req: Request, res: Response): Promise<Response> {
        try {
           

            const user = await this.userService.signUp(req.body);

            return res.status(201).json({
                message: "User created successfully",
                data: user
            });

        } catch (err: any) {
           
            const statusCode = err.message.includes('exist') ? 409 : 500;
            
            return res.status(statusCode).json({
                status: "error",
                message: err.message || "Internal server error"
            });
        }
    }
    async login(req: Request, res: Response) {
        try {
            
        

            const { user, accessToken, refreshToken } = await this.userService.login(req.body);
            
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 15 * 60 * 1000 
            });

            if(refreshToken != null){
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 7 * 24 * 60 * 60 * 1000 
                });

            }

            return res.status(200).json({ message: "Login successful", user });
        } catch (err: any) {
            return res.status(401).json({ message: err.message });
        }
    }

      async getProfil(req: Request, res: Response){

         const id = req.userId;
         const profil = await this.userService.getProfil(id as string);
          res.status(200).json({
             message: "User Profil",
             profil
          })
        try{

        }catch(err: any) {
            return res.status(401).json({ message: err.message });
        }
      }

  /*   async refreshToken(req: Request, res: Response) {
    try {
      const token = req.cookies.refreshToken;
      if (!token) return res.status(401).json({ message: 'No refresh token' });

      const { newAccessToken, newRefreshToken } = await this.userService.refreshToken(token);

      res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 15 * 60 * 1000, sameSite: 'strict' });
      res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'strict' });

      res.status(200).json({ message: 'Token refreshed' });
    } catch (err) {
      res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
  } */
}