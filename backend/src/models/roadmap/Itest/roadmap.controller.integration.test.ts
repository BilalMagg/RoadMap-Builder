import request from 'supertest';
import app from '../../../app';
import { AppDataSource } from '../../../config/dbConfig';
import { RoadmapEntity } from '../roadmap.entity';
import { UserEntity } from '../../user/user.entity';
import { v4 as uuidv4 } from 'uuid';

describe('Roadmap Controller Integration Tests', () => {
  let userId: string;

  beforeAll(async () => {
    // Connect to DB if not connected
    if (!AppDataSource.getDataSource().isInitialized) {
      await AppDataSource.connect();
    }

    // Create a dummy user directly in DB
    const userRepo = AppDataSource.getDataSource().getRepository(UserEntity);
    const user = userRepo.create({
      username: 'testuser_' + uuidv4(),
      email: 'test_' + uuidv4() + '@example.com',
      password: 'password123', // In a real app this should be hashed, but for seeding it depends on entity constraints
    });
    const savedUser = await userRepo.save(user); // Ensure saving works, password might need hashing if there's a listener
    userId = savedUser.id;
  });

  afterAll(async () => {
    // Cleanup if necessary, or let the test DB handle it (usually drop schema or transaction rollback)
    // For now we just close connection
    if (AppDataSource.getDataSource().isInitialized) {
      await AppDataSource.getDataSource().destroy();
    }
  });

  it('should return only public roadmaps via GET /api/roadmaps/public', async () => {
    const roadmapRepo =
      AppDataSource.getDataSource().getRepository(RoadmapEntity);

    // Create a PUBLIC roadmap
    await roadmapRepo.save({
      title: 'Public Roadmap',
      description: 'This is public',
      status: 'PUBLISHED',
      userId: userId,
      data: {
        version: '1.0',
        viewport: { x: 0, y: 0, zoom: 1 },
        nodes: [],
        edges: [],
      },
    });

    // Create a PRIVATE (DRAFT) roadmap
    await roadmapRepo.save({
      title: 'Private Roadmap',
      description: 'This is private',
      status: 'DRAFT',
      userId: userId,
      data: {
        version: '1.0',
        viewport: { x: 0, y: 0, zoom: 1 },
        nodes: [],
        edges: [],
      },
    });

    // Make request
    const response = await request(app).get('/api/roadmaps/public');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);

    const roadmaps = response.body.data;
    const publicRoadmap = roadmaps.find(
      (r: any) => r.title === 'Public Roadmap',
    );
    const privateRoadmap = roadmaps.find(
      (r: any) => r.title === 'Private Roadmap',
    );

    expect(publicRoadmap).toBeDefined();
    expect(privateRoadmap).toBeUndefined();

    // Ensure all returned roadmaps are indeed PUBLISHED
    roadmaps.forEach((r: any) => {
      expect(r.status).toBe('PUBLISHED');
    });
  });
});
