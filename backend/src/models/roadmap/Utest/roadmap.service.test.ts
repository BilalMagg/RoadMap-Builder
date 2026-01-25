import { RoadmapService } from '../roadmap.service';
import { RoadmapOperationType, RoadmapCategory } from '../enum/roadmap.enum';

describe('RoadmapService (unit tests)', () => {
  let service: RoadmapService;
  let roadmapRepo: any;
  let eventService: any;
  let roadmapMock: any;

  beforeEach(() => {
    roadmapRepo = {
      findByIdAndUserId: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
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

  it('should update a node successfully', async () => {
    roadmapRepo.findByIdAndUserId.mockResolvedValue(roadmapMock);

    const result = await service.updateNode(
      'user1',
      'n1',
      { title: 'New title' },
      'roadmap1',
    );

    expect(result.title).toBe('New title');
    expect(roadmapRepo.save).toHaveBeenCalled();
  });

  it('should add a new node', async () => {
    roadmapRepo.findByIdAndUserId.mockResolvedValue(roadmapMock);

    const newNode = {
      id: 'n2',
      data: {
        title: 'New Node',
      },
    };

    const result = await service.addNode('user1', 'roadmap1', newNode);

    expect(result).toEqual(newNode);
    expect(roadmapMock.data.nodes.length).toBe(2);
    expect(roadmapRepo.save).toHaveBeenCalled();
  });
});
