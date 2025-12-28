import { Repository } from "typeorm";
import { RoadmapEntity } from "./roadmap.entity";
import { IRoadmapRepository } from "./interface/roadmap.interface";
import { CreateRoadmapDto, UpdateRoadmapDto } from "./roadmap.dto";
import { AppDataSource } from "../../config/dbConfig";

export class RoadmapRepository implements IRoadmapRepository {
  private repository: Repository<RoadmapEntity>;

  constructor() {
    this.repository = AppDataSource.getDataSource().getRepository(RoadmapEntity);
  }

  async save(roadmapData: CreateRoadmapDto & { userId: string }): Promise<RoadmapEntity> {
    // Set default data if not provided
    const defaultData = {
      version: "1.0",
      viewport: { x: 0, y: 0, zoom: 1 },
      nodes: [],
      edges: [],
    };

    const roadmap = this.repository.create({
      ...roadmapData,
      data: roadmapData.data || defaultData,
    });
    return await this.repository.save(roadmap);
  }

  async findById(id: string): Promise<RoadmapEntity | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByUserId(userId: string): Promise<RoadmapEntity[]> {
    return await this.repository.find({
      where: { userId },
      order: { updatedAt: "DESC" },
    });
  }

  async findByIdAndUserId(id: string, userId: string): Promise<RoadmapEntity | null> {
    return await this.repository.findOne({
      where: { id, userId },
    });
  }

  async update(id: string, roadmapData: UpdateRoadmapDto): Promise<RoadmapEntity | null> {
    const roadmap = await this.repository.findOne({ where: { id } });
    if (!roadmap) {
      return null;
    }

    Object.assign(roadmap, roadmapData);
    return await this.repository.save(roadmap);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected || 0) > 0;
  }

  async countByUserId(userId: string): Promise<number> {
    return await this.repository.count({ where: { userId } });
  }
    async findByIdAndUser(roadmapId:string, UserId:string){
            return await this.repository.findOne({where:{id:roadmapId,userId:UserId}})
          }
}

