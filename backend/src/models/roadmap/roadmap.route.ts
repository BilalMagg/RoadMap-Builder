import { Request, Router, Response } from "express";
import { roadmapController } from "./roadmap.registry";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { CreateRoadmapDto, UpdateRoadmapDto } from "./roadmap.dto";
import { checkAuth } from "../../middlewares/checkAuth";

export const roadmapRouter = Router();

// All routes require authentication
roadmapRouter.use(checkAuth);

// Create a new roadmap
roadmapRouter.post(
  "/",
  validationMiddleware(CreateRoadmapDto),
  (req: Request, res: Response) => roadmapController.createRoadmap(req, res)
);

// Get all roadmaps for the authenticated user
roadmapRouter.get(
  "/",
  (req: Request, res: Response) => roadmapController.getAllRoadmaps(req, res)
);

// Get a specific roadmap by ID
roadmapRouter.get(
  "/:id",
  (req: Request, res: Response) => roadmapController.getRoadmapById(req, res)
);

// Update a roadmap
roadmapRouter.put(
  "/:id",
  validationMiddleware(UpdateRoadmapDto),
  (req: Request, res: Response) => roadmapController.updateRoadmap(req, res)
);

// Delete a roadmap
roadmapRouter.delete(
  "/:id",
  (req: Request, res: Response) => roadmapController.deleteRoadmap(req, res)
);
roadmapRouter.patch(
  "/:id",
  (req: Request, res: Response) => roadmapController.patchRoadmapGraph(req, res)
);


