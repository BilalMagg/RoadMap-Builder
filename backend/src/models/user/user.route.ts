import { Request, Router ,Response } from "express";

import { userController } from "./user.registry";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { LoginRequestDto, UserRequestDto } from "./user.dto";
import { checkAuth } from "../../middlewares/checkAuth";

export const userRouter = Router();

userRouter.post('/signup', validationMiddleware(UserRequestDto), (req:Request,res:Response)=> userController.signUp(req,res) );

userRouter.post('/login', validationMiddleware(LoginRequestDto), (req:Request,res:Response)=> userController.login(req,res));

userRouter.get('/profil',checkAuth,(req:Request,res:Response) => userController.getProfil(req,res));