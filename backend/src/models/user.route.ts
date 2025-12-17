import { Request, Router ,Response, RequestParamHandler } from "express";

import { userController } from "./user.registry";

export const userRouter = Router();


userRouter.post('/signup', (req:Request,res:Response)=> userController.signUp(req,res) );