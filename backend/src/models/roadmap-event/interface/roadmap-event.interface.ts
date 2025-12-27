import { RoadmapEventEntity } from "../roadmap-event.entity";

export interface IRoadmapEventRepository {
    insertEvent(eventData: Partial<RoadmapEventEntity>): Promise<RoadmapEventEntity>;
}
