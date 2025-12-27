import { Repository } from "typeorm";
import { RoadmapEventEntity } from "./roadmap-event.entity";
import { IRoadmapEventRepository } from "./interface/roadmap-event.interface";
import { AppDataSource } from "../../config/dbConfig";

export class RoadmapEventRepository implements IRoadmapEventRepository {
    private repository: Repository<RoadmapEventEntity>;

    constructor() {
        // Get the repository from the central data source
        this.repository = AppDataSource.getDataSource().getRepository(RoadmapEventEntity);
    }

    /**
     * Inserts a new event into the roadmap_events table.
     * Append-only: this is the only write operation allowed for this table.
     * This logic is isolated from business rules.
     */
    async insertEvent(eventData: Partial<RoadmapEventEntity>): Promise<RoadmapEventEntity> {
        const event = this.repository.create(eventData);
        return await this.repository.save(event);
    }
}
