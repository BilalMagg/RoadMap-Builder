import { Router } from "express";
import { roadmapEventController } from "./roadmap-event.registry";

export const roadmapEventRouter = Router();

/**
 * TEMPORARY TESTING ROUTES
 * 
 * RoadMap Events are intended to be an append-only log of changes.
 * This route allows testing the insertion logic before it is integrated 
 * into the main Roadmap flow.
 * 
 * TODO: Remove these routes once Patch /roadmaps integration is complete.
 */

// POST /roadmap-events/test
roadmapEventRouter.post("/test", (req, res) => roadmapEventController.testInsertEvent(req, res));
