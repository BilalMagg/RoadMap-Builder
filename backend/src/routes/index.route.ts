

import { userRouter } from "../models/user.route";
import { Router } from "express";
export const AllRoutes = Router();

AllRoutes.use('/auth',userRouter);