import { RoadmapProgressService } from '../roadmap_progress.service';
import { IRoadmapProgressRepository } from '../interface/roadmap_progress.interface';
import { RoadmapRepository } from '../../roadmap/roadmap.repository';
import { EnrollRoadmapDTO, UpdateNodeStatusDTO } from '../roadmap_progress.dto';
import { NodeStatus } from "../roadmap_progress.entity"

describe('RoadmapProgressService', () => {
  let service: RoadmapProgressService;
  let progressRepoMock:  jest.Mocked<IRoadmapProgressRepository>;
  let roadmapRepoMock: jest.Mocked<RoadmapRepository>;

  // Données de test réutilisables
  const userId = 'user-123';
  const roadmapId = 'roadmap-ABC';
  const mockDate = new Date();

  beforeEach(() => {
    // 1. SETUP : On crée des mocks vides avant chaque test
    // On utilise "as any" ou un cast pour simuler l'interface sans implémenter toutes les méthodes
    progressRepoMock = {
      findUserProgress: jest.fn(),
      EnrollRoadmap: jest.fn(),
      updateNodeStatus: jest.fn(),
      syncCompletedCount: jest.fn(),
      findEnrolledRoadmaps: jest.fn(),
      deleteProgress: jest.fn(),
    } as any as jest.Mocked<IRoadmapProgressRepository>;

    // Mock du RoadmapRepository (c'est une Classe, donc on mocke ses méthodes)
    roadmapRepoMock = {
      findById: jest.fn(),
    } as any as jest.Mocked<RoadmapRepository>;

    // 2. INJECTION : On donne nos mocks au service
    service = new RoadmapProgressService(progressRepoMock, roadmapRepoMock);
  });

  describe('enroll', () => {
    const enrollDto: EnrollRoadmapDTO = {roadmapId };

    it('should throw if user is already enrolled (Scenario 1)', async () => {
      // ARRANGE
      progressRepoMock.findUserProgress.mockResolvedValue({ id: 'existing' } as any);

      // ACT & ASSERT
      await expect(service.enroll(enrollDto, userId))
        .rejects
        .toThrow('User is already enrolled in this roadmap');
      
      // Vérifie qu'on n'a pas appelé la suite inutilement
      expect(roadmapRepoMock.findById).not.toHaveBeenCalled();
    });

    it('should throw if roadmap does not existe (Scenario 2)' , async () => {
      progressRepoMock.findUserProgress.mockResolvedValue(null);
      roadmapRepoMock.findById.mockResolvedValue(null);
      
      await expect(service.enroll(enrollDto, userId))
        .rejects
        .toThrow("Roadmap not found");

      expect(progressRepoMock.EnrollRoadmap).not.toHaveBeenCalled();

    })

    it('should enroll user successfully with calculated nodes (Scenario 3)', async () => {
      // ARRANGE
      progressRepoMock.findUserProgress.mockResolvedValue(null);
      
      // On simule une roadmap avec 2 nœuds
      roadmapRepoMock.findById.mockResolvedValue({
        id: roadmapId,
        data: { nodes: [{}, {}] } // 2 éléments
      } as any);

      const createdProgress = {
        id: 'new-progress',
        userId,
        roadmapId,
        total_nodes_count: 2, // Le service doit avoir passé 2
        status: 'IN_PROGRESS',
        node_states: {},
        updatedAt: mockDate
      };

      progressRepoMock.EnrollRoadmap.mockResolvedValue(createdProgress as any);

      // ACT
      const result = await service.enroll(enrollDto, userId);

      // ASSERT
      expect(progressRepoMock.EnrollRoadmap).toHaveBeenCalledWith(userId, roadmapId, 2);
      expect(result).toBeDefined();
      expect(result.id).toBe('new-progress');
      expect(result.roadmapId).toBe("roadmap-ABC"); // Vérification du DTO
    });

  });

  describe('updateNodeStatus', () => {
    const updateDto: UpdateNodeStatusDTO = { 
        roadmapId, 
        nodeId: 'node-1', 
        status: NodeStatus.COMPLETED 
    };

    it('should update status, sync count, and return new progress', async () => {
      // ARRANGE
      progressRepoMock.updateNodeStatus.mockResolvedValue(undefined);
      progressRepoMock.syncCompletedCount.mockResolvedValue(1);
      
      const updatedProgress = {
        id: 'progress-1',
        total_nodes_count: 10,
        node_states: {
            'node-1': { status: NodeStatus.COMPLETED }
        },
        // Logique de calcul du DTO : 1 completed / 10 total = 10%
      } as any;

      progressRepoMock.findUserProgress.mockResolvedValue(updatedProgress);

      // ACT
      const result = await service.updateNodeStatus(updateDto, userId);

      // ASSERT
      // Vérifier l'ordre des appels est important ici !
      expect(progressRepoMock.updateNodeStatus).toHaveBeenCalledWith(updateDto, userId);
      expect(progressRepoMock.syncCompletedCount).toHaveBeenCalledWith(userId, roadmapId);
      expect(progressRepoMock.findUserProgress).toHaveBeenCalledWith(userId, roadmapId);
      
      //expect(result.percentage).toBe(10);
    });

    it('should throw if progress disappears after update', async () => {
        progressRepoMock.findUserProgress.mockResolvedValue(null);
  
        await expect(service.updateNodeStatus(updateDto, userId))
          .rejects
          .toThrow('Progress not found');
      });
  });

  describe('unenroll', () => {
      it('should call delete and succeed if repo returns true', async () => {
          progressRepoMock.deleteProgress.mockResolvedValue(true);

          await expect(service.unenroll(userId, roadmapId)).resolves.not.toThrow();
          expect(progressRepoMock.deleteProgress).toHaveBeenCalledWith(userId, roadmapId);
      });

      it('should throw if delete returns false (user was not enrolled)', async () => {
        progressRepoMock.deleteProgress.mockResolvedValue(false);

        await expect(service.unenroll(userId, roadmapId))
            .rejects
            .toThrow('User was not enrolled');
    });
  });
});