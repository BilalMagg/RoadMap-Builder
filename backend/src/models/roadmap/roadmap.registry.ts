import { RoadmapRepository } from "./roadmap.repository";
import { RoadmapService } from "./roadmap.service";
import { RoadmapController } from "./roadmap.controller";

import { roadmapEventService } from "../roadmap-event/roadmap-event.registry";

const repository = new RoadmapRepository();
export const roadmapService = new RoadmapService(repository, roadmapEventService);
export const roadmapController = new RoadmapController(roadmapService);

