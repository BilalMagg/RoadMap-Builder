import { UpdateNodeStatusDTO } from "../roadmap_progress.dto";
import { NodeStatus, RoadmapProgressEntity } from "../roadmap_progress.entity";

export interface IRoadmapProgressRepository {
  // Trouver la progression d'un utilisateur pour une roadmap spécifique
  findUserProgress(userId: string, roadmapId: string): Promise<RoadmapProgressEntity | null>;

  EnrollRoadmap(userId: string, roadmapId: string, totalNodes: number): Promise<RoadmapProgressEntity>;

  updateNodeStatus(updateNodeStatusDTO:UpdateNodeStatusDTO, userId: string): Promise<void>;

  // Calculer et mettre à jour le compteur de nodes complétés en SQL pur
  syncCompletedCount(userId: string, roadmapId: string): Promise<number>;

  // Récupérer toutes les roadmaps suivies par un utilisateur (Dashboard)
  findEnrolledRoadmaps(userId: string): Promise<RoadmapProgressEntity[]>;

  deleteProgress(userId: string, roadmapId: string): Promise<boolean>;
}