import { Request, Response } from "express";
import { RoadmapEventService } from "./roadmap-event.service";
import { RoadmapEventType } from "./roadmap-event.entity";

export class RoadmapEventController {
    private roadmapEventService: RoadmapEventService;

    constructor(service: RoadmapEventService) {
        this.roadmapEventService = service;
    }

    /**
     * TEMPORARY testing endpoint to verify event insertion logic independently.
     * POST /roadmap-events/test
     * 
     * TODO: THIS ENDPOINT IS TEMPORARY AND MUST BE REMOVED LATER.
     * Event insertion will eventually be triggered automatically AFTER successful 
     * roadmap updates in the main Roadmap controller/service.
     * 
     * Path: POST /roadmap-events/test
     * Payload example:
     * {
     *   "roadmapId": "uuid-here",
     *   "version": 1,
     *   "type": "NODE_CREATED",
     *   "payload": { "nodeId": "123", "label": "New Topic" }
     * }
     */
    async testInsertEvent(req: Request, res: Response): Promise<void> {
        try {
            const { roadmapId, version, type, payload } = req.body;

            // Basic request validation
            if (!roadmapId || version === undefined || !type || !payload) {
                res.status(400).json({
                    error: "Missing required fields: roadmapId, version, type, payload"
                });
                return;
            }

            // Validate enum type
            if (!Object.values(RoadmapEventType).includes(type)) {
                res.status(400).json({
                    error: `Invalid event type. Valid values: ${Object.values(RoadmapEventType).join(", ")}`
                });
                return;
            }

            const event = await this.roadmapEventService.logEvent(
                roadmapId,
                version,
                type as RoadmapEventType,
                payload
            );

            // Return success with a reminder that this is temporary
            res.status(201).json({
                message: "Event logged successfully (TEMPORARY TEST ENDPOINT)",
                data: event,
                warning: "TODO: Remove this endpoint once PUT /roadmap integration is complete."
            });
        } catch (error: any) {
            res.status(500).json({
                message: "Failed to log test event",
                error: error.message
            });
        }
    }
}
