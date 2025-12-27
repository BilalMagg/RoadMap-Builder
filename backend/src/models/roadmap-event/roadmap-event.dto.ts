import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsUUID,
    IsEnum,
    IsObject,
} from "class-validator";
import { RoadmapEventType, RoadmapEventEntity } from "./roadmap-event.entity";

// DTO for creating a roadmap event via the test endpoint
export class CreateRoadmapEventTestDto {
    @IsUUID()
    @IsNotEmpty()
    roadmapId!: string;

    @IsNumber()
    @IsNotEmpty()
    version!: number;

    @IsEnum(RoadmapEventType)
    @IsNotEmpty()
    type!: RoadmapEventType;

    @IsObject()
    @IsNotEmpty()
    payload!: Record<string, any>;
}

// DTO for roadmap event response
export class RoadmapEventResponseDto {
    id!: string;
    roadmap_id!: string;
    version!: number;
    type!: RoadmapEventType;
    payload!: Record<string, any>;
    created_at!: Date;

    static fromEntity(entity: RoadmapEventEntity): RoadmapEventResponseDto {
        const dto = new RoadmapEventResponseDto();
        dto.id = entity.id;
        dto.roadmap_id = entity.roadmap_id;
        dto.version = entity.version;
        dto.type = entity.type;
        dto.payload = entity.payload;
        dto.created_at = entity.created_at;
        return dto;
    }
}
