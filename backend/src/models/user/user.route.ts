import { Request, Router ,Response, RequestParamHandler } from "express";

import { userController } from "./user.registry";
import {checkAuth} from "../user/middlewares/checkAuth";

export const userRouter = Router();


userRouter.post('/signup',  userController.signUp );
userRouter.post('/login', userController.login);
userRouter.post('/forgot-password',userController.forgotPassword);
userRouter.post('/reset-password/:id/:token',userController.resetPassword);
userRouter.use(checkAuth)

userRouter.get("/logout" , userController.logout);