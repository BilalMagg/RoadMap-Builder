

import { userRouter } from "../models/user/user.route";
import { Router } from "express";
export const AllRoutes = Router();

AllRoutes.use('/auth',userRouter);

