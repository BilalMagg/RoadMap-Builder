import { RoadmapEventEntity, RoadmapEventType } from "./roadmap-event.entity";
import { IRoadmapEventRepository } from "./interface/roadmap-event.interface";

export class RoadmapEventService {
    private roadmapEventRepository: IRoadmapEventRepository;

    constructor(repository: IRoadmapEventRepository) {
        this.roadmapEventRepository = repository;
    }

    /**
     * Logs a new event for a roadmap.
     * 
     * @param roadmapId - The UUID of the roadmap
     * @param version - The version number of the roadmap at the time of the event
     * @param type - The type of event (from RoadmapEventType enum)
     * @param payload - Small JSON object containing event details (e.g., nodeId, changes)
     * 
     * TODO: This will be called by RoadmapService after successful PUT /roadmaps updates.
     * TODO: In the future, this might also handle snapshot logic (SNAPSHOT_CREATED).
     * 
     * Note: This is part of an append-only event log.
     */
    async logEvent(
        roadmapId: string,
        version: number,
        type: RoadmapEventType,
        payload: Record<string, any>
    ): Promise<RoadmapEventEntity> {
        // Business validation: Payload should not be empty
        if (!payload || Object.keys(payload).length === 0) {
            throw new Error("Event payload must contain data.");
        }

        // Business rule: ensure payload remains small (not storing full roadmap JSON)
        // This is just a conceptual check as per requirements.

        return await this.roadmapEventRepository.insertEvent({
            roadmap_id: roadmapId,
            version: version,
            type: type,
            payload: payload,
        });
    }
}
