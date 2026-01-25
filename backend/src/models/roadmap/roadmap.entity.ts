import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { RoadmapProgressEntity } from "../roadmap_progress/roadmap_progress.entity";
import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';
import { UserEntity } from '../user/user.entity';
import { RoadmapCategory } from './enum/roadmap.enum';

// TypeScript interfaces for roadmap data structure
export interface RoadmapNodeData {
  title: string;
  description?: string;
  tags?: string[];
  resources?: { label: string; url: string }[];
}

export interface RoadmapNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  style?: { width?: number; height?: number };
  data: RoadmapNodeData;
}

export interface RoadmapEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  style?: Record<string, any>;
}

export interface RoadmapViewport {
  x: number;
  y: number;
  zoom: number;
}

export interface RoadmapData {
  version: string;
  viewport: RoadmapViewport;
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
}

@Entity('roadmaps')
export class RoadmapEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  title!: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @Column({
    type: 'enum',
    enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
    default: 'DRAFT',
  })
  @IsOptional()
  @IsString({ message: 'Status must be a string' })
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

  @Column({
    type: 'enum',
    enum: RoadmapCategory,
    default: RoadmapCategory.FULLSTACK,
  })
  @IsNotEmpty({ message: 'Category is required' })
  category!: RoadmapCategory;

  @Column({ type: 'jsonb', default: {}, nullable: true })
  @IsObject({ message: 'Data must be a valid object' })
  data!: RoadmapData;

  @OneToMany(() => RoadmapProgressEntity, (progress) => progress.roadmap)
  progress!: RoadmapProgressEntity[];

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: UserEntity;

  @Column({ type: 'uuid' })
  userId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
