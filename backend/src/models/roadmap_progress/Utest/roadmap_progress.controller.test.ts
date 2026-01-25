import { RoadmapProgressController } from '../roadmap_progress.controller';
import { RoadmapProgressService } from '../roadmap_progress.service';
import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';

describe('RoadmapProgressController', () => {
  let controller: RoadmapProgressController;
  let serviceMock: jest.Mocked<RoadmapProgressService>;
  
  // Objets factices pour Request et Response
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    // 1. Mock du Service
    serviceMock = {
      enroll: jest.fn(),
      updateNodeStatus: jest.fn(),
      getUserDashboard: jest.fn(),
      getProgressDetails: jest.fn(),
      unenroll: jest.fn(),
    } as unknown as jest.Mocked<RoadmapProgressService>;

    // 2. Mock de la Réponse Express (Chainable : res.status().json())
    res = {
      status: jest.fn().mockReturnThis(), // Important pour permettre le chaînage
      json: jest.fn(),
    };

    // 3. Initialisation du Controller
    controller = new RoadmapProgressController(serviceMock);
  });

  describe('enroll', () => {
    it('should return 401 if userId is missing', async () => {
      req = { userId: undefined, body: {} }; // Pas de userId

      await controller.enroll(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });

    it('should call service.enroll and return 201 on success', async () => {
      req = { userId: 'u1', body: { roadmapId: 'r1' } };
      const mockResult = { id: 'prog1', percentage: 0 };
      
      serviceMock.enroll.mockResolvedValue(mockResult as any);

      await controller.enroll(req as Request, res as Response);

      // Vérifie que le service a reçu le DTO avec le bon ID
      expect(serviceMock.enroll).toHaveBeenCalledWith(
        expect.objectContaining({ roadmapId: 'r1' }), 
        'u1'
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ 
        success: true, 
        data: mockResult 
      }));
    });

    it('should return 409 Conflict if user is already enrolled', async () => {
      req = { userId: 'u1', body: { roadmapId: 'r1' } };
      
      // On simule l'erreur exacte attendue par ton controller
      serviceMock.enroll.mockRejectedValue(new Error("User is already enrolled in this roadmap"));

      await controller.enroll(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(409); // Conflict
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ 
        success: false, 
        message: "User is already enrolled in this roadmap" 
      }));
    });

    it('should return 400 if validation fails (Array of ValidationErrors)', async () => {
      req = { userId: 'u1', body: {} };
      
      // On simule une erreur de class-validator
      const validationError = new ValidationError();
      validationError.constraints = { isNotEmpty: 'error message' };
      serviceMock.enroll.mockRejectedValue([validationError]);

      await controller.enroll(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('updateNodeStatus', () => {
    it('should return 200 and updated progress', async () => {
      req = { 
        userId: 'u1', 
        body: { roadmapId: 'r1', nodeId: 'n1', status: 'COMPLETED' } 
      };
      
      serviceMock.updateNodeStatus.mockResolvedValue({ percentage: 50 } as any);

      await controller.updateNodeStatus(req as Request, res as Response);

      expect(serviceMock.updateNodeStatus).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'COMPLETED' }), 
        'u1'
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 404 if progress not found', async () => {
      req = { userId: 'u1', body: {} };
      serviceMock.updateNodeStatus.mockRejectedValue(new Error("Progress not found"));

      await controller.updateNodeStatus(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('getDashboard', () => {
    it('should return 200 with list of roadmaps', async () => {
      req = { userId: 'u1' };
      serviceMock.getUserDashboard.mockResolvedValue([]);

      await controller.getDashboard(req as Request, res as Response);

      expect(serviceMock.getUserDashboard).toHaveBeenCalledWith('u1');
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getProgressDetails', () => {
    it('should return 200 with details', async () => {
      req = { userId: 'u1', params: { roadmapId: 'r1' } };
      serviceMock.getProgressDetails.mockResolvedValue({} as any);

      await controller.getProgressDetails(req as Request, res as Response);

      expect(serviceMock.getProgressDetails).toHaveBeenCalledWith('u1', 'r1');
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 404 if user is not enrolled', async () => {
      req = { userId: 'u1', params: { roadmapId: 'r1' } };
      serviceMock.getProgressDetails.mockRejectedValue(new Error("User is not enrolled in this roadmap"));

      await controller.getProgressDetails(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('unenroll', () => {
    it('should return 200 on success', async () => {
      req = { userId: 'u1', params: { roadmapId: 'r1' } };
      serviceMock.unenroll.mockResolvedValue();

      await controller.unenroll(req as Request, res as Response);

      expect(serviceMock.unenroll).toHaveBeenCalledWith('u1', 'r1');
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 404 if user was not enrolled', async () => {
        req = { userId: 'u1', params: { roadmapId: 'r1' } };
        serviceMock.unenroll.mockRejectedValue(new Error("User was not enrolled in this roadmap..."));
  
        await controller.unenroll(req as Request, res as Response);
  
        expect(res.status).toHaveBeenCalledWith(404);
      });
  });
});