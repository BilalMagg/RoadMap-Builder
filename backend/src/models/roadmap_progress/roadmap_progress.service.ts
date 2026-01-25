import { IRoadmapProgressRepository } from "./interface/roadmap_progress.interface";
import { EnrollRoadmapDTO, RoadmapProgressResponseDTO, UpdateNodeStatusDTO } from "./roadmap_progress.dto";
import {RoadmapRepository} from "../roadmap/roadmap.repository";


export class RoadmapProgressService {
      constructor(
        private progressRepository: IRoadmapProgressRepository,
        private roadmapRepository: RoadmapRepository
      ) {}

      async enroll(dto: EnrollRoadmapDTO, userId: string) {
        // 1. Vérifier si l'utilisateur est déjà inscrit
        const existing = await this.progressRepository.findUserProgress(
            userId, 
            dto.roadmapId
        );

        if (existing) {
            throw new Error("User is already enrolled in this roadmap");
        }
        const roadmap = await this.roadmapRepository.findById(dto.roadmapId);

        if (!roadmap) {
            throw new Error("Roadmap not found");
        }

        const calculatedTotalNodes = roadmap.data?.nodes?.length || 0;

        // 2. Créer la ligne de progression
        const progress = await this.progressRepository.EnrollRoadmap(
            userId,
            dto.roadmapId,
            calculatedTotalNodes
        );

        return RoadmapProgressResponseDTO.fromEntity(progress);
    }
    
    async updateNodeStatus(dto: UpdateNodeStatusDTO, userId: string) {
        await this.progressRepository.updateNodeStatus(dto, userId);
        await this.progressRepository.syncCompletedCount(userId, dto.roadmapId);
        const updatedProgress = await this.progressRepository.findUserProgress(
            userId, 
            dto.roadmapId
        );

        if (!updatedProgress) throw new Error("Progress not found");

        return RoadmapProgressResponseDTO.fromEntity(updatedProgress);
    }

    /**
     * For Dashboard , Get all Raodmaps the user is enrolling
     */
    async getUserDashboard(userId: string) {
        const enrollments = await this.progressRepository.findEnrolledRoadmaps(userId);
        return enrollments.map(entity => RoadmapProgressResponseDTO.fromEntity(entity));
    }

    /**
     * Get Details on one Roadmap Progress
     */
    async getProgressDetails(userId: string, roadmapId: string) {
        const progress = await this.progressRepository.findUserProgress(userId, roadmapId);
        
        if (!progress) {
            throw new Error("User is not enrolled in this roadmap");
        }

        return RoadmapProgressResponseDTO.fromEntity(progress);
    }
    async unenroll(userId: string, roadmapId: string): Promise<void> {
    const deleted = await this.progressRepository.deleteProgress(userId, roadmapId);
    
    if (!deleted) {
        throw new Error("User was not enrolled in this roadmap or progress already deleted");
    }
    }
    
}