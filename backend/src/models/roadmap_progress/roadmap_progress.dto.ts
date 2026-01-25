import { IsNotEmpty, IsString, IsEnum, IsUUID } from "class-validator";
import { NodeStatus, ProgressStatus, RoadmapNodeStates } from "../roadmap_progress/roadmap_progress.entity";

export class UpdateNodeStatusDTO {    
    @IsUUID()
    @IsNotEmpty()
    roadmapId!: string;

    @IsString()
    @IsNotEmpty()
    nodeId!: string;

    @IsEnum(NodeStatus, {
        message: "Status must be: PENDING, IN_PROGRESS, COMPLETED or SKIPPED"
    })
    @IsNotEmpty()
    status!: NodeStatus;
}

export class EnrollRoadmapDTO {

    @IsUUID()
    @IsNotEmpty()
    roadmapId!: string;
}


export class RoadmapProgressResponseDTO {
    id!: string;
    userId!: string;
    roadmapId!: string;
    status!: ProgressStatus;
    nodeStates!: RoadmapNodeStates;
    
    // Champs calculés pour faciliter le travail du Frontend (Progress bar)
    stats!: {
        completedNodes: number;
        totalNodes: number;
        progressPercentage: number;
    };

    createdAt!: Date;
    updatedAt!: Date;

    // Méthode statique pour transformer l'entité en DTO de réponse
    static fromEntity(entity: any): RoadmapProgressResponseDTO {
        const completed = Object.values(entity.nodeStates || {})
            .filter((n: any) => n.status === 'COMPLETED').length;

        return {
            id: entity.id,
            userId: entity.userId,
            roadmapId: entity.roadmapId,
            status: entity.status,
            nodeStates: entity.nodeStates,
            stats: {
                completedNodes: completed,
                totalNodes: entity.totalNodesCount,
                progressPercentage: entity.totalNodesCount > 0 
                    ? Math.round((completed / entity.totalNodesCount) * 100) 
                    : 0
            },
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        };
    }
}