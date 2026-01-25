import { DataSource, Repository } from "typeorm";
import { RoadmapProgressEntity, NodeStatus } from "../roadmap_progress/roadmap_progress.entity";
import { IRoadmapProgressRepository } from "../roadmap_progress/interface/roadmap_progress.interface";
import { UpdateNodeStatusDTO } from "../roadmap_progress/roadmap_progress.dto";
import { AppDataSource } from "../../config/dbConfig";

export class RoadmapProgressRepository implements IRoadmapProgressRepository  {
      private repository: Repository<RoadmapProgressEntity>

      constructor() {
        this.repository = AppDataSource.getDataSource().getRepository(RoadmapProgressEntity);
      }

    async findUserProgress(userId: string, roadmapId: string): Promise<RoadmapProgressEntity | null> {
        return this.repository.findOne({
            where: { userId, roadmapId }
        });
    }

    // 2. Inscription (Enrollment)
    async EnrollRoadmap(userId: string, roadmapId: string, totalNodes: number): Promise<RoadmapProgressEntity> {
        
        const progress = this.repository.create({
            userId,
            roadmapId,
            totalNodesCount: totalNodes,
            nodeStates: {}
        });
        return this.repository.save(progress);
    }

    // 3. Mise à jour "Chirurgicale" du JSONB 
    async updateNodeStatus(dto: UpdateNodeStatusDTO, userId: string): Promise<void> {
        const { roadmapId, nodeId, status } = dto;
        
        const nodePayload = {
            status: status,
            updatedAt: new Date().toISOString()
        };

        // jsonb_set(cible, chemin, nouvelle_valeur, créer_si_absent)
        await this.repository.createQueryBuilder()
            .update(RoadmapProgressEntity)
            .set({
                nodeStates: () => `jsonb_set(
                    COALESCE(nodeStates, '{}'::jsonb), 
                    ARRAY[:nodeId], 
                    :nodeValue::jsonb, 
                    true
                )`
            })
            .where("userId = :userId AND roadmapId = :roadmapId", { userId, roadmapId })
            .setParameter("nodeId", nodeId)
            .setParameter("nodeValue", JSON.stringify(nodePayload))
            .execute();
    }

    // 4. Synchronisation du compteur en SQL pur
    async syncCompletedCount(userId: string, roadmapId: string): Promise<number> {
        // Cette requête compte les nodes "COMPLETED" à l'intérieur du JSON et met à jour la colonne 'int'
        const result = await this.repository.query(`
            UPDATE roadmap_progress
            SET "updatedAt" = NOW(),
                "status" = CASE 
                    WHEN (SELECT count(*) FROM jsonb_each("nodeStates") WHERE value->>'status' = 'COMPLETED') = "totalNodesCount" 
                    THEN 'COMPLETED'
                    ELSE status 
                END
            WHERE "userId" = $1 AND "roadmapId" = $2
            RETURNING (SELECT count(*) FROM jsonb_each("nodeStates") WHERE value->>'status' = 'COMPLETED') as count
        `, [userId, roadmapId]);

        return parseInt(result[0][0]?.count || "0");
    }

    async findEnrolledRoadmaps(userId: string): Promise<RoadmapProgressEntity[]> {
    return this.repository.createQueryBuilder("progress")
        .innerJoinAndSelect("progress.roadmap", "roadmap") 
        .select([
            "progress.id", 
            "progress.status", 
            "progress.updatedAt", 
            "progress.totalNodesCount",
            "roadmap.id", 
            "roadmap.title"
        ])
        .where("progress.userId = :userId", { userId })
        .orderBy("progress.updatedAt", "DESC")
        .getMany();
}
async deleteProgress(userId: string, roadmapId: string): Promise<boolean> {
    const result = await this.repository.delete({ userId, roadmapId });
    // result.affected contient le nombre de lignes supprimées (0 ou 1)
    return result.affected !== 0;
}
}