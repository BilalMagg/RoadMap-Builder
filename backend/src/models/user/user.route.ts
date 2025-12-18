import { Request, Router ,Response } from "express";

import { userController } from "./user.registry";

export const userRouter = Router();

userRouter.post('/signup', (req:Request,res:Response)=> userController.signUp(req,res) );
userRouter.post('/login', (req:Request,res:Response)=> userController.login(req,res));
userRouter.post('/refresh-token',(req:Request,res:Response)=> userController.refreshToken(req,res));