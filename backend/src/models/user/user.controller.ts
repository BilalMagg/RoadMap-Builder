import { UserService } from "./user.service";

import { Request, Response } from "express";
import { LoginRequestDto, UserRequestDto } from "./user.dto";
export class UserController {
    constructor(private userService: UserService) { }

    async signUp(req: Request, res: Response): Promise<Response> {
        try {
           
            const signUpDto: UserRequestDto = req.body;

            if (!signUpDto || Object.keys(signUpDto).length === 0) {
                return res.status(400).json({ 
                    message: "Invalid request: Missing user data" 
                });
            }

            const user = await this.userService.signUp(signUpDto);

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
            const userData :LoginRequestDto = req.body;
            const { user, accessToken, refreshToken } = await this.userService.login(userData);
            
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 15 * 60 * 1000 
            });

            
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60 * 1000 
            });

            return res.status(200).json({ message: "Login successful", user });
        } catch (err: any) {
            return res.status(401).json({ message: err.message });
        }
    }
}