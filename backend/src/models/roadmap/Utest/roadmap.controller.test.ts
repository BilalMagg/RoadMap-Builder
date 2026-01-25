import { RoadmapController } from '../roadmap.controller';
import { RoadmapService } from '../roadmap.service';
import { Request, Response } from 'express';
import { ApiResponse } from '../../../utils/api/api.response';
import { ValidationError } from 'class-validator';

describe('RoadmapController (Unit Tests)', () => {
  let controller: RoadmapController;
  let mockRoadmapService: jest.Mocked<RoadmapService>;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    mockRoadmapService = {
      createRoadmap: jest.fn(),
      getRoadmapById: jest.fn(),
      getAllRoadmaps: jest.fn(),
      getPublicRoadmaps: jest.fn(),
      getFeed: jest.fn(),
      getCategories: jest.fn(),
      updateRoadmap: jest.fn(),
      deleteRoadmap: jest.fn(),
      applyOperations: jest.fn(),
    } as any;

    controller = new RoadmapController(mockRoadmapService);

    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    res = {
      status: statusMock,
      json: jsonMock,
    };
    req = {
        body: {},
        params: {},
        query: {},
        userId: 'user123', // Mocking authenticated user
    } as any;
  });

  describe('createRoadmap', () => {
    it('should create a roadmap and return 201', async () => {
      req.body = { title: 'New Roadmap', category: 'Backend' };
      const expectedRoadmap = { id: 'r1', ...req.body };
      mockRoadmapService.createRoadmap.mockResolvedValue(expectedRoadmap as any);

      await controller.createRoadmap(req as Request, res as Response);

      expect(mockRoadmapService.createRoadmap).toHaveBeenCalledWith(req.body, 'user123');
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(ApiResponse.success(expectedRoadmap, 'Roadmap created successfully'));
    });

    it('should return 401 if user ID is missing', async () => {
      req.userId = undefined;
      await controller.createRoadmap(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(401);
    });

    it('should return 400 on validation errors', async () => {
       const validationError = new ValidationError();
       validationError.constraints = { error: 'Invalid' };
       mockRoadmapService.createRoadmap.mockRejectedValue([validationError]);

       await controller.createRoadmap(req as Request, res as Response);

       expect(statusMock).toHaveBeenCalledWith(400);
       expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: 'Validation failed' }));
    });
    
    it('should return 500 on generic errors', async () => {
        mockRoadmapService.createRoadmap.mockRejectedValue(new Error('DB Error'));
 
        await controller.createRoadmap(req as Request, res as Response);
 
        expect(statusMock).toHaveBeenCalledWith(500);
     });
  });

  describe('getRoadmapById', () => {
      it('should return roadmap if found', async () => {
          req.params = { id: 'r1' };
          const mockRoadmap = { id: 'r1', title: 'Test' };
          mockRoadmapService.getRoadmapById.mockResolvedValue(mockRoadmap as any);

          await controller.getRoadmapById(req as Request, res as Response);

          expect(mockRoadmapService.getRoadmapById).toHaveBeenCalledWith('r1', 'user123');
          expect(statusMock).toHaveBeenCalledWith(200);
          expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ data: mockRoadmap }));
      });

      it('should return 404 if not found', async () => {
        req.params = { id: 'r1' };
        mockRoadmapService.getRoadmapById.mockRejectedValue(new Error('Roadmap not found'));

        await controller.getRoadmapById(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(404);
      });
  });

  describe('getAllRoadmaps', () => {
      it('should return all user roadmaps', async () => {
          const mockRoadmaps = [{ id: 'r1' }];
          mockRoadmapService.getAllRoadmaps.mockResolvedValue(mockRoadmaps as any);

          await controller.getAllRoadmaps(req as Request, res as Response);

          expect(mockRoadmapService.getAllRoadmaps).toHaveBeenCalledWith('user123');
          expect(statusMock).toHaveBeenCalledWith(200);
      });
  });

  describe('getFeed', () => {
      it('should return paginated feed', async () => {
          req.query = { page: '1' };
          const mockFeed = { items: [], total: 0 };
          mockRoadmapService.getFeed.mockResolvedValue(mockFeed);

          await controller.getFeed(req as Request, res as Response);

          expect(mockRoadmapService.getFeed).toHaveBeenCalledWith(req.query);
          expect(statusMock).toHaveBeenCalledWith(200);
          expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ data: mockFeed }));
      });
  });

  describe('getCategories', () => {
      it('should return categories', async () => {
          const mockCategories = [{ key: 'C', value: 'Cat' }];
          mockRoadmapService.getCategories.mockResolvedValue(mockCategories);

          await controller.getCategories(req as Request, res as Response);

          expect(mockRoadmapService.getCategories).toHaveBeenCalled();
          expect(statusMock).toHaveBeenCalledWith(200);
          expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({ data: mockCategories }));
      });
  });

  describe('updateRoadmap', () => {
      it('should update roadmap successfully', async () => {
          req.params = { id: 'r1' };
          req.body = { title: 'Updated' };
          const updated = { id: 'r1', title: 'Updated' };
          mockRoadmapService.updateRoadmap.mockResolvedValue(updated as any);

          await controller.updateRoadmap(req as Request, res as Response);

          expect(mockRoadmapService.updateRoadmap).toHaveBeenCalledWith('r1', req.body, 'user123');
          expect(statusMock).toHaveBeenCalledWith(200);
      });

      it('should return 404 if roadmap not found during update', async () => {
        req.params = { id: 'r1' };
        mockRoadmapService.updateRoadmap.mockRejectedValue(new Error('Roadmap not found'));

        await controller.updateRoadmap(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(404);
      });
  });

  describe('deleteRoadmap', () => {
      it('should delete roadmap successfully', async () => {
          req.params = { id: 'r1' };
          mockRoadmapService.deleteRoadmap.mockResolvedValue(undefined);

          await controller.deleteRoadmap(req as Request, res as Response);

          expect(mockRoadmapService.deleteRoadmap).toHaveBeenCalledWith('r1', 'user123');
          expect(statusMock).toHaveBeenCalledWith(200);
      });
  });

  describe('patchRoadmapGraph', () => {
      it('should apply operations successfully', async () => {
          req.params = { id: 'r1' };
          req.body = { operations: [] };
          mockRoadmapService.applyOperations.mockResolvedValue({ message: 'Success', data: {} });

          await controller.patchRoadmapGraph(req as Request, res as Response);

          expect(mockRoadmapService.applyOperations).toHaveBeenCalledWith('user123', 'r1', []);
          expect(statusMock).toHaveBeenCalledWith(200);
      });

      it('should return 404 if user has no roadmap', async () => {
        req.params = { id: 'r1' };
        mockRoadmapService.applyOperations.mockRejectedValue(new Error('This user does not have any roadmap'));

        await controller.patchRoadmapGraph(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(404);
      });
  });
});
