
import { UserService } from "./user.service";

import { Request ,Response} from "express";
import { UserRequestDto } from "./user.dto";
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
}