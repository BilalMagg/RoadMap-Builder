import { IRoadmapRepository } from "./interface/roadmap.interface";
import { RoadmapOperationType } from './enum/roadmap.enum';

import {
  CreateRoadmapDto,
  UpdateRoadmapDto,
  RoadmapResponseDto,
  RoadmapListItemDto,
} from "./roadmap.dto";
import { RoadmapEventService } from "../roadmap-event/roadmap-event.service";
import { RoadmapEventType } from "../roadmap-event/roadmap-event.entity";

export class RoadmapService {
  constructor(
    private roadmapRepo: IRoadmapRepository,
    private eventService: RoadmapEventService
  ) { }

  async createRoadmap(
    roadmapData: CreateRoadmapDto,
    userId: string
  ): Promise<RoadmapResponseDto> {
    const roadmap = await this.roadmapRepo.save({
      ...roadmapData,
      userId,
    });
    return RoadmapResponseDto.fromEntity(roadmap);
  }

  async getRoadmapById(id: string, userId: string): Promise<RoadmapResponseDto> {
    const roadmap = await this.roadmapRepo.findByIdAndUserId(id, userId);
    if (!roadmap) {
      throw new Error("Roadmap not found");
    }
    return RoadmapResponseDto.fromEntity(roadmap);
  }

  async getAllRoadmaps(userId: string): Promise<RoadmapListItemDto[]> {
    const roadmaps = await this.roadmapRepo.findByUserId(userId);
    return roadmaps.map((roadmap) => RoadmapListItemDto.fromEntity(roadmap));
  }

  async getPublicRoadmaps(): Promise<RoadmapListItemDto[]> {
    const roadmaps = await this.roadmapRepo.getPublicRoadmaps();
    return roadmaps.map((roadmap) => RoadmapListItemDto.fromEntity(roadmap));
  }

  async updateRoadmap(
    id: string,
    roadmapData: UpdateRoadmapDto,
    userId: string
  ): Promise<RoadmapResponseDto> {
    // Verify ownership
    const existingRoadmap = await this.roadmapRepo.findByIdAndUserId(id, userId);
    if (!existingRoadmap) {
      throw new Error("Roadmap not found");
    }

    const updatedRoadmap = await this.roadmapRepo.update(id, roadmapData);
    if (!updatedRoadmap) {
      throw new Error("Failed to update roadmap");
    }

    // Log Save Event
    await this.eventService.logEvent(
      id,
      parseInt(updatedRoadmap.data.version || "1"),
      RoadmapEventType.ROADMAP_SAVED,
      { title: updatedRoadmap.title, timestamp: new Date() }
    );

    return RoadmapResponseDto.fromEntity(updatedRoadmap);
  }

  async deleteRoadmap(id: string, userId: string): Promise<void> {
    // Verify ownership
    const roadmap = await this.roadmapRepo.findByIdAndUserId(id, userId);
    if (!roadmap) {
      throw new Error("Roadmap not found");
    }

    const deleted = await this.roadmapRepo.delete(id);
    if (!deleted) {
      throw new Error("Failed to delete roadmap");
    }
  }



  async applyOperations(userId: string, roadmapId: string, operations: any) {
    if (!operations || operations.length === 0) {
      throw new Error('No operation provided');
    }

    let data: any;
    let message = '';

    for (const op of operations) {
      
      switch (op.type) {
        case RoadmapOperationType.NODE_UPDATED:
          data = await this.updateNode(userId, op.nodeId, op.Node, roadmapId);
          message = 'Node updated successfully';
        
          break;

        case RoadmapOperationType.NODE_CREATED:
          data = await this.addNode(userId, roadmapId, op.Node);
          message = 'Node added successfully';

          break;

        case RoadmapOperationType.NODE_DELETED:
          data = await this.deleteNode(op.nodeId, roadmapId, userId);
          message = 'Node deleted successfully';
       
          break;

        default:
          throw new Error('Unknown operation type');
      }
    }
       await this.eventService.logEvent(roadmapId, 1, RoadmapEventType.ROADMAP_SAVED, data);

    return { data, message };
  }

  async updateNode(userId: string, nodeId: string, Node: any, roadmapId: string) {
    const roadmap: any = await this.roadmapRepo.findByIdAndUserId(roadmapId, userId);
    if (!roadmap) {
      throw new Error('This user does not have any roadmap')
    }
    let data = roadmap.data;
    const node: any = data.nodes.find((node: any) => node.id === nodeId); //node c'est un objet now
    if (!node) {
      throw new Error('Node not found');
    }
    node.data.title = Node.title;
    node.data.description = Node.description;
    node.data.tags = Node.tags;
    node.type = Node.type;
    node.style = Node.style;
    node.width = Node.width;
    node.height = Node.height;
    node.dragging = Node.dragging;
    node.selected = Node.selected;
    node.data.resources = Node.resources;
    node.position = Node.position;
    node.positionAbsolute = Node.positionAbsolute;


    roadmap.data = data;
    this.roadmapRepo.save(roadmap);
    //fait return au node qui est modifie
    return node.data;
  }
  async deleteNode(nodeId: string, roadmapId: string, userId: string) {
    const roadmap: any = await this.roadmapRepo.findByIdAndUserId(roadmapId, userId);
    if (!roadmap) {
      throw new Error('This user does not have any roadmap')
    }
    let data = roadmap.data;
    const node: any = data.nodes.find((node: any) => node.id === nodeId); //node c'est un objet now
    if (!node) {
      throw new Error('Node not found');
    }
    data.nodes = data.nodes.filter((node: any) => node.id !== nodeId);
    data.edges = data.edges.filter(
      (edge: any) => edge.source !== nodeId && edge.target !== nodeId
    );
    roadmap.data = data;
    this.roadmapRepo.save(roadmap);
    return node.data;
  }


  async addNode(userId: string, roadmapId: string, Node: any) {
    const roadmap: any = await this.roadmapRepo.findByIdAndUserId(roadmapId, userId);
    if (!roadmap) {
      throw new Error('This user does not have any roadmap');
    }

    let data = roadmap.data;

    if (!data.nodes) {
      data.nodes = [];
    }

    const exists = data.nodes.find((node: any) => node.id === Node.id);
    if (exists) {
      throw new Error('Node already exists');
    }


    data.nodes.push(Node);

    roadmap.data = data;
    await this.roadmapRepo.save(roadmap);

    return Node;
  }


}




