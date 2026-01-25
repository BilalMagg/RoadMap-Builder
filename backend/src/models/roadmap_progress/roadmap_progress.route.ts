import { Request, Router, Response } from "express";
import { progressController } from "./roadmap_progress.registry";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { UpdateNodeStatusDTO, EnrollRoadmapDTO } from "./roadmap_progress.dto";
import { checkAuth } from "../../middlewares/checkAuth";

export const progressRouter = Router();

// All routes require authentication
progressRouter.use(checkAuth);

// Enroll in a roadmap
progressRouter.post(
  "/enroll",
  validationMiddleware(EnrollRoadmapDTO),
  (req: Request, res: Response) => progressController.enroll(req, res)
);

// Dashboard : All enrolled roadmaps
progressRouter.get(
  "/dashboard",
  (req: Request, res: Response) => progressController.getDashboard(req, res)
);
// Get progress info on one roadmap
progressRouter.get(
  "/:roadmapId",
  (req: Request, res: Response) => progressController.getProgressDetails(req, res)
);

// Update progress of a node in the roadmap
progressRouter.patch(
  "/update",
  validationMiddleware(UpdateNodeStatusDTO),
  (req: Request, res: Response) => progressController.updateNodeStatus(req, res)
);
// Update progress of a node in the roadmap
progressRouter.delete(
  "/:roadmapId",
  (req: Request, res: Response) => progressController.unenroll(req, res)
);
