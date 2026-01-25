import { Request, Response } from "express";
import { RoadmapProgressService } from "./roadmap_progress.service";
import { ApiResponse } from "../../utils/api/api.response"; // Ajuste le chemin selon ton projet
import { ValidationError } from "class-validator";
import { EnrollRoadmapDTO, UpdateNodeStatusDTO } from "./roadmap_progress.dto";

export class RoadmapProgressController {
  constructor(private progressService: RoadmapProgressService) {}

  /**
   * POST /api/progress/enroll
   */
  async enroll(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json(
          ApiResponse.error("User ID missing from request")
        );
      }

      // On combine le body et l'ID du token pour former le DTO sécurisé
      const enrollDto: EnrollRoadmapDTO = req.body;

      const progress = await this.progressService.enroll(enrollDto, userId);

      return res.status(201).json(
        ApiResponse.success(progress, "Enrolled in roadmap successfully")
      );

    } catch (err: any) {
      // Gestion des erreurs de validation (class-validator)
      if (Array.isArray(err) && err[0] instanceof ValidationError) {
        const validationErrors = err
          .map((e) => Object.values(e.constraints || {}))
          .flat();
        return res.status(400).json(
          ApiResponse.error("Validation failed", validationErrors)
        );
      }

      // Gestion spécifique : L'utilisateur est déjà inscrit
      if (err.message === "User is already enrolled in this roadmap") {
        return res.status(409).json( // 409 Conflict
          ApiResponse.error(err.message)
        );
      }

      return res.status(500).json(
        ApiResponse.error(err.message || "Internal server error")
      );
    }
  }

  /**
   * PATCH /api/progress/node
   */
  async updateNodeStatus(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json(
          ApiResponse.error("User ID missing from request")
        );
      }
      const updateDto: UpdateNodeStatusDTO = {
        ...req.body,
        userId: userId,
      };

      const updatedProgress = await this.progressService.updateNodeStatus(updateDto, userId);

      return res.status(200).json(
        ApiResponse.success(updatedProgress, "Node status updated successfully")
      );

    } catch (err: any) {
      if (Array.isArray(err) && err[0] instanceof ValidationError) {
        const validationErrors = err
          .map((e) => Object.values(e.constraints || {}))
          .flat();
        return res.status(400).json(
          ApiResponse.error("Validation failed", validationErrors)
        );
      }

      // Si la progression n'existe pas
      const statusCode = err.message === "Progress not found" ? 404 : 500;
      
      return res.status(statusCode).json(
        ApiResponse.error(err.message || "Internal server error")
      );
    }
  }

  /**
   * GET /api/progress/dashboard
   */
  async getDashboard(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json(
          ApiResponse.error("User ID missing from request")
        );
      }

      const dashboardData = await this.progressService.getUserDashboard(userId);

      return res.status(200).json(
        ApiResponse.success(dashboardData, "Dashboard retrieved successfully")
      );

    } catch (err: any) {
      return res.status(500).json(
        ApiResponse.error(err.message || "Internal server error")
      );
    }
  }

  /**
   * GET /api/progress/:roadmapId for React flow
   */
  async getProgressDetails(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json(
          ApiResponse.error("User ID missing from request")
        );
      }

      const { roadmapId } = req.params;
      
      const progressDetails = await this.progressService.getProgressDetails(userId, roadmapId);

      return res.status(200).json(
        ApiResponse.success(progressDetails, "Progress details retrieved successfully")
      );

    } catch (err: any) {
      // Si l'utilisateur essaie d'accéder à une roadmap où il n'est pas inscrit
      const statusCode = err.message === "User is not enrolled in this roadmap" ? 404 : 500;
      
      return res.status(statusCode).json(
        ApiResponse.error(err.message || "Internal server error")
      );
    }
  }
  /**
 * Se désinscrire d'une roadmap (Supprimer toute la progression)
 * DELETE /api/progress/:roadmapId
 */
  async unenroll(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json(ApiResponse.error("User ID missing from request"));
      }

      const { roadmapId } = req.params;

      await this.progressService.unenroll(userId, roadmapId);

      return res.status(200).json(
        ApiResponse.success(null, "Successfully unenrolled from roadmap")
      );

    } catch (err: any) {
      const statusCode = err.message.includes("not enrolled") ? 404 : 500;
      return res.status(statusCode).json(
        ApiResponse.error(err.message || "Internal server error")
      );
    }
}
}