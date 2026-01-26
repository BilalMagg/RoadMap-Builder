import { RoadmapService } from '../roadmap.service';
import { RoadmapOperationType, RoadmapCategory } from '../enum/roadmap.enum';
import { RoadmapEventType } from '../../roadmap-event/roadmap-event.entity';

describe('RoadmapService (unit tests)', () => {
  let service: RoadmapService;
  let roadmapRepo: any;
  let eventService: any;
  let roadmapMock: any;

  beforeEach(() => {
    roadmapRepo = {
      findByIdAndUserId: jest.fn(),
      findByUserId: jest.fn(),
      getPublicRoadmaps: jest.fn(),
      getPaginatedRoadmaps: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    eventService = {
      logEvent: jest.fn(),
    };

    service = new RoadmapService(roadmapRepo, eventService);
    roadmapMock = {
      id: 'roadmap1',
      title: 'My Roadmap',
      description: 'Backend roadmap',
      status: 'DRAFT',
      category: RoadmapCategory.BACKEND,
      userId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
      data: {
        version: '1',
        nodes: [
          {
            id: 'n1',
            data: {
              title: 'Old title',
              description: '',
              tags: [],
              resources: [],
            },
          },
        ],
        edges: [{ source: 'n1', target: 'n2' }],
      },
    };
  });

  describe('createRoadmap', () => {
    it('should create a roadmap successfully', async () => {
      const createDto = {
        title: 'New Roadmap',
        description: 'Description',
        category: RoadmapCategory.FRONTEND,
        status: 'DRAFT' as 'DRAFT',
        data: {
          version: '1',
          viewport: { x: 0, y: 0, zoom: 1 },
          nodes: [],
          edges: [],
        },
      };
      
      roadmapRepo.save.mockResolvedValue({ ...createDto, id: 'new-id', userId: 'user1', createdAt: new Date() });

      const result = await service.createRoadmap(createDto, 'user1');

      expect(result.id).toBe('new-id');
      expect(result.title).toBe(createDto.title);
      expect(roadmapRepo.save).toHaveBeenCalledWith(expect.objectContaining({
        ...createDto,
        userId: 'user1'
      }));
    });
  });

  describe('getRoadmapById', () => {
    it('should return a roadmap if found', async () => {
      roadmapRepo.findByIdAndUserId.mockResolvedValue(roadmapMock);

      const result = await service.getRoadmapById('roadmap1', 'user1');

      expect(result.id).toBe('roadmap1');
      expect(roadmapRepo.findByIdAndUserId).toHaveBeenCalledWith('roadmap1', 'user1');
    });

    it('should throw an error if roadmap not found', async () => {
      roadmapRepo.findByIdAndUserId.mockResolvedValue(null);

      await expect(service.getRoadmapById('roadmap1', 'user1'))
        .rejects.toThrow('Roadmap not found');
    });
  });

  describe('getAllRoadmaps', () => {
    it('should return all roadmaps for a user', async () => {
      roadmapRepo.findByUserId.mockResolvedValue([roadmapMock]);

      const result = await service.getAllRoadmaps('user1');

      expect(result.length).toBe(1);
      expect(result[0].id).toBe('roadmap1');
      expect(roadmapRepo.findByUserId).toHaveBeenCalledWith('user1');
    });
  });

  describe('getPublicRoadmaps', () => {
    it('should return public roadmaps', async () => {
      roadmapRepo.getPublicRoadmaps.mockResolvedValue([roadmapMock]);

      const result = await service.getPublicRoadmaps();

      expect(result.length).toBe(1);
      expect(roadmapRepo.getPublicRoadmaps).toHaveBeenCalled();
    });
  });

  describe('getFeed', () => {
    it('should return paginated roadmaps', async () => {
      const query = { page: 1, limit: 10 };
      roadmapRepo.getPaginatedRoadmaps.mockResolvedValue({ items: [roadmapMock], total: 1 });

      const result = await service.getFeed(query);

      expect(result.items.length).toBe(1);
      expect(result.total).toBe(1);
      expect(roadmapRepo.getPaginatedRoadmaps).toHaveBeenCalledWith(query);
    });
  });

  describe('updateRoadmap', () => {
    it('should update a roadmap successfully', async () => {
      const updateDto = { title: 'Updated Title' };
      roadmapRepo.findByIdAndUserId.mockResolvedValue(roadmapMock);
      roadmapRepo.update.mockResolvedValue({ ...roadmapMock, ...updateDto });

      const result = await service.updateRoadmap('roadmap1', updateDto, 'user1');

      expect(result.title).toBe('Updated Title');
      expect(roadmapRepo.update).toHaveBeenCalledWith('roadmap1', updateDto);
      expect(eventService.logEvent).toHaveBeenCalledWith(
        'roadmap1',
        1,
        RoadmapEventType.ROADMAP_SAVED,
        expect.any(Object)
      );
    });

    it('should throw error if roadmap not found for update', async () => {
      roadmapRepo.findByIdAndUserId.mockResolvedValue(null);

      await expect(service.updateRoadmap('roadmap1', {}, 'user1'))
        .rejects.toThrow('Roadmap not found');
    });
    
    it('should throw error if update failed', async () => {
        roadmapRepo.findByIdAndUserId.mockResolvedValue(roadmapMock);
        roadmapRepo.update.mockResolvedValue(null);
  
        await expect(service.updateRoadmap('roadmap1', {}, 'user1'))
          .rejects.toThrow('Failed to update roadmap');
      });
  });

  describe('deleteRoadmap', () => {
    it('should delete a roadmap successfully', async () => {
      roadmapRepo.findByIdAndUserId.mockResolvedValue(roadmapMock);
      roadmapRepo.delete.mockResolvedValue(true);

      await service.deleteRoadmap('roadmap1', 'user1');

      expect(roadmapRepo.delete).toHaveBeenCalledWith('roadmap1');
    });

    it('should throw error if roadmap not found for delete', async () => {
      roadmapRepo.findByIdAndUserId.mockResolvedValue(null);

      await expect(service.deleteRoadmap('roadmap1', 'user1'))
        .rejects.toThrow('Roadmap not found');
    });

    it('should throw error if delete failed', async () => {
        roadmapRepo.findByIdAndUserId.mockResolvedValue(roadmapMock);
        roadmapRepo.delete.mockResolvedValue(false);
  
        await expect(service.deleteRoadmap('roadmap1', 'user1'))
          .rejects.toThrow('Failed to delete roadmap');
      });
  });

  describe('applyOperations', () => {
    it('should apply NODE_CREATED operation', async () => {
        const op = {
            type: RoadmapOperationType.NODE_CREATED,
            Node: { id: 'n2', data: { title: 'New Node' } }
        };
        roadmapRepo.findByIdAndUserId.mockResolvedValue(roadmapMock);
        
        // Mock save to simply return what it was given or resolve
        roadmapRepo.save.mockResolvedValue(true);

        const result = await service.applyOperations('user1', 'roadmap1', [op]);

        expect(result.message).toBe('Node added successfully');
        expect(roadmapRepo.save).toHaveBeenCalled();
        expect(roadmapMock.data.nodes).toHaveLength(2);
    });

    it('should apply NODE_UPDATED operation', async () => {
        const op = {
            type: RoadmapOperationType.NODE_UPDATED,
            nodeId: 'n1',
            Node: { title: 'Updated Node Title', data: {} }
        };
        roadmapRepo.findByIdAndUserId.mockResolvedValue(roadmapMock);
        
        const result = await service.applyOperations('user1', 'roadmap1', [op]);

        expect(result.message).toBe('Node updated successfully');
        expect(roadmapMock.data.nodes[0].data.title).toBe('Updated Node Title');
    });

    it('should apply NODE_DELETED operation', async () => {
        const op = {
            type: RoadmapOperationType.NODE_DELETED,
            nodeId: 'n1'
        };
        roadmapRepo.findByIdAndUserId.mockResolvedValue(roadmapMock);

        const result = await service.applyOperations('user1', 'roadmap1', [op]);

        expect(result.message).toBe('Node deleted successfully');
        expect(roadmapMock.data.nodes).toHaveLength(0);
    });

    it('should throw error for unknown operation', async () => {
        const op = { type: 'UNKNOWN_OP' };

        await expect(service.applyOperations('user1', 'roadmap1', [op]))
            .rejects.toThrow('Unknown operation type');
    });
    
    it('should throw error if no operations provided', async () => {
        await expect(service.applyOperations('user1', 'roadmap1', []))
            .rejects.toThrow('No operation provided');
    });
  });
  
  describe('Node Operations (Direct)', () => {
      it('should addNode successfully', async () => {
          roadmapRepo.findByIdAndUserId.mockResolvedValue(roadmapMock);
          const newNode = { id: 'n2', data: { title: 'N2' } };
          
          await service.addNode('user1', 'roadmap1', newNode);
          
          expect(roadmapMock.data.nodes).toContain(newNode);
      });

      it('should throw error in addNode if node exists', async () => {
          roadmapRepo.findByIdAndUserId.mockResolvedValue(roadmapMock);
          const existingNode = { id: 'n1', data: { title: 'Existing' } };
          
          await expect(service.addNode('user1', 'roadmap1', existingNode))
              .rejects.toThrow('Node already exists');
      });

      it('should updateNode successfully', async () => {
          roadmapRepo.findByIdAndUserId.mockResolvedValue(roadmapMock);
          const updateData = { title: 'Updated', description: 'Desc' };
          
          const result = await service.updateNode('user1', 'n1', updateData, 'roadmap1');
          
          expect(result.title).toBe('Updated');
      });

      it('should throw error in updateNode if node not found', async () => {
        roadmapRepo.findByIdAndUserId.mockResolvedValue(roadmapMock);
        
        await expect(service.updateNode('user1', 'non-existent', {}, 'roadmap1'))
            .rejects.toThrow('Node not found');
      });

      it('should deleteNode successfully', async () => {
          roadmapRepo.findByIdAndUserId.mockResolvedValue(roadmapMock);
          
          await service.deleteNode('n1', 'roadmap1', 'user1');
          
          expect(roadmapMock.data.nodes).toHaveLength(0);
      });

      it('should throw error in deleteNode if node not found', async () => {
        roadmapRepo.findByIdAndUserId.mockResolvedValue(roadmapMock);
        
        await expect(service.deleteNode('non-existent', 'roadmap1', 'user1'))
            .rejects.toThrow('Node not found');
      });
  });
});
