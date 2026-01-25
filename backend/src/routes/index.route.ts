import routerRef from "../models/refreshToken/refreshToken.route";
import { userRouter } from "../models/user/user.route";
import { roadmapRouter } from "../models/roadmap/roadmap.route";
import { Router } from "express";
import { progressRouter } from "../models/roadmap_progress/roadmap_progress.route";
export const AllRoutes = Router();

AllRoutes.use('/auth', userRouter);
AllRoutes.use('/roadmaps', roadmapRouter);
AllRoutes.use('/refresh-token',routerRef);
AllRoutes.use('/progress' , progressRouter)
