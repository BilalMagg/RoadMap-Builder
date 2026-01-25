import { RoadmapProgressRepository } from "./roadmap_progress.repository";
import { RoadmapProgressService } from "./roadmap_progress.service";
import { RoadmapProgressController } from "./roadmap_progress.controller";
import {RoadmapRepository} from "../roadmap/roadmap.repository";


const repository = new RoadmapProgressRepository();
const roadmapRepository = new RoadmapRepository();
export const progressService = new RoadmapProgressService(repository,roadmapRepository);
export const progressController = new RoadmapProgressController(progressService);

