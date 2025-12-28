import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from "typeorm";
import {
    IsUUID,
    IsNumber,
    IsEnum,
    IsObject,
} from "class-validator";

/**
 * Enum for types of roadmap events.
 * This can be expanded as more event types are added.
 */
export enum RoadmapEventType {
    NODE_CREATED = "NODE_CREATED",
    NODE_UPDATED = "NODE_UPDATED",
    NODE_DELETED = "NODE_DELETED",
    NODE_MOVED = "NODE_MOVED",
    NODE_RESIZED = "NODE_RESIZED",
    NODE_CHANGED = "NODE_CHANGED",
    NODE_CONNECTED = "NODE_CONNECTED",
    NODE_DISCONNECTED = "NODE_DISCONNECTED",
    SNAPSHOT_CREATED = "SNAPSHOT_CREATED", // Future use
}

@Entity("roadmap_events")
export class RoadmapEventEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "uuid" })
    @IsUUID()
    roadmap_id!: string;

    @Column({ type: "int" })
    @IsNumber()
    version!: number;

    @Column({
        type: "enum",
        enum: RoadmapEventType,
    })
    @IsEnum(RoadmapEventType)
    type!: RoadmapEventType;

    @Column({ type: "jsonb" })
    @IsObject()
    payload!: Record<string, any>;

    @CreateDateColumn({ type: "timestamptz" })
    created_at!: Date;
}
