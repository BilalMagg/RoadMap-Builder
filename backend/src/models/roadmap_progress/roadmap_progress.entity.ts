import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from "typeorm";
import { UserEntity } from "../user/user.entity";
import { RoadmapEntity } from "../roadmap/roadmap.entity";

// TypeScript interfaces for roadmap data structure
export enum ProgressStatus {
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  ARCHIVED = "ARCHIVED"
}

export enum NodeStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    SKIPPED = 'SKIPPED'
}

// Interface for strong typing the JSONB column in TypeScript
export interface NodeProgressState {
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED';
  updatedAt?: Date;
}

export type RoadmapNodeStates = Record<string, NodeProgressState>;

@Entity("roadmap_progress")
@Unique(["userId", "roadmapId"]) // User cannot follow 2 time the same Roadmap 
export class RoadmapProgressEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
  
    @Column({
        type: "enum",
        enum: ProgressStatus,
        default: ProgressStatus.IN_PROGRESS
    })
    status!: ProgressStatus;
    
    @Column({ type: 'jsonb', default: {} })
    nodeStates!: Record<string, NodeProgressState>;
    
    @Column({ type: 'int', default: 0 })
    totalNodesCount!: number;

    @CreateDateColumn()
    createdAt!: Date;
    
    @UpdateDateColumn()
    updatedAt!: Date;
    
    @ManyToOne(() => UserEntity, (user) => user.progress, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user!: UserEntity;
    
    @Column({ type: "uuid" })
    userId!: string;
    
    @ManyToOne(() => RoadmapEntity, (roadmap) => roadmap.progress, { onDelete: "CASCADE" })
    @JoinColumn({ name: "roadmapId" })
    roadmap!: RoadmapEntity;

    @Column({ type: "uuid" })
    roadmapId!: string;
}