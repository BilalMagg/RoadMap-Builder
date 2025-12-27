import { RoadmapEventRepository } from "./roadmap-event.repository";
import { RoadmapEventService } from "./roadmap-event.service";
import { RoadmapEventController } from "./roadmap-event.controller";

const repository = new RoadmapEventRepository();
export const roadmapEventService = new RoadmapEventService(repository);
export const roadmapEventController = new RoadmapEventController(roadmapEventService);
