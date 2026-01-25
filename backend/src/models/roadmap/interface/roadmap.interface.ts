import { RoadmapEntity } from '../roadmap.entity';
import { CreateRoadmapDto, UpdateRoadmapDto } from '../roadmap.dto';

export interface IRoadmapRepository {
  save(
    roadmapData: CreateRoadmapDto & { userId: string },
  ): Promise<RoadmapEntity>;
  findById(id: string): Promise<RoadmapEntity | null>;
  findByUserId(userId: string): Promise<RoadmapEntity[]>;
  update(
    id: string,
    roadmapData: UpdateRoadmapDto,
  ): Promise<RoadmapEntity | null>;
  delete(id: string): Promise<boolean>;
  findByIdAndUserId(id: string, userId: string): Promise<RoadmapEntity | null>;
  countByUserId(userId: string): Promise<number>;
  getPublicRoadmaps(): Promise<RoadmapEntity[]>;
  getPaginatedRoadmaps(query: any): Promise<{ items: RoadmapEntity[]; total: number }>;
}
