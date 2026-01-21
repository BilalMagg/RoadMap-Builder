import { RoadmapService } from "./roadmap.service";
import { Request, Response } from "express";
import { ApiResponse } from "../../utils/api/api.response";
import { ValidationError } from "class-validator";

export class RoadmapController {
  constructor(private roadmapService: RoadmapService) {}

  async createRoadmap(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json(
          ApiResponse.error("User ID missing from request")
        );
      }

      const roadmap = await this.roadmapService.createRoadmap(req.body, userId);

      return res.status(201).json(
        ApiResponse.success(roadmap, "Roadmap created successfully")
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

      return res.status(500).json(
        ApiResponse.error(err.message || "Internal server error")
      );
    }
  }

  async getRoadmapById(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json(
          ApiResponse.error("User ID missing from request")
        );
      }

      const { id } = req.params;
      const roadmap = await this.roadmapService.getRoadmapById(id, userId);

      return res.status(200).json(
        ApiResponse.success(roadmap, "Roadmap retrieved successfully")
      );
    } catch (err: any) {
      const statusCode = err.message === "Roadmap not found" ? 404 : 500;
      return res.status(statusCode).json(
        ApiResponse.error(err.message || "Internal server error")
      );
    }
  }

  async getAllRoadmaps(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json(
          ApiResponse.error("User ID missing from request")
        );
      }

      const roadmaps = await this.roadmapService.getAllRoadmaps(userId);

      return res.status(200).json(
        ApiResponse.success(roadmaps, "Roadmaps retrieved successfully")
      );
    } catch (err: any) {
      return res.status(500).json(
        ApiResponse.error(err.message || "Internal server error")
      );
    }
  }

  async updateRoadmap(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json(
          ApiResponse.error("User ID missing from request")
        );
      }

      const { id } = req.params;
      const roadmap = await this.roadmapService.updateRoadmap(
        id,
        req.body,
        userId
      );

      return res.status(200).json(
        ApiResponse.success(roadmap, "Roadmap updated successfully")
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

      const statusCode = err.message === "Roadmap not found" ? 404 : 500;
      return res.status(statusCode).json(
        ApiResponse.error(err.message || "Internal server error")
      );
    }
  }

  async deleteRoadmap(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json(
          ApiResponse.error("User ID missing from request")
        );
      }

      const { id } = req.params;
      await this.roadmapService.deleteRoadmap(id, userId);

      return res.status(200).json(
        ApiResponse.success(null, "Roadmap deleted successfully")
      );
    } catch (err: any) {
      const statusCode = err.message === "Roadmap not found" ? 404 : 500;
      return res.status(statusCode).json(
        ApiResponse.error(err.message || "Internal server error")
      );
    }
  }
   async patchRoadmapGraph(req:Request, res:Response) {
  const userId:any = req.userId; // middleware auth
  const roadmapId = req.params.id;
  const { operations } = req.body;
  try{
  const result:any=await this.roadmapService.applyOperations(userId, roadmapId,operations);
  return res.status(200).json(ApiResponse.success(result ,result.message));
  
  }catch(err:any){
    let  status=500;
    if (err.message === 'This user does not have any roadmap') status = 404;
        if(err.message === 'Node not found') status=404;
            return res.status(status).json(ApiResponse.error(err.message || "Internal server error"));
  }
   
    
 

  
};

}

