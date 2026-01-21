import request from 'supertest';
import app from '../../../app';
import { AppDataSource } from '../../../config/dbConfig';


describe('RefreshToken Integration Tests', () => {

    beforeAll(async () => {
        const dataSource = AppDataSource.getDataSource();
            if (!dataSource.isInitialized) {
                await dataSource.initialize();
            }
    });

    afterAll(async () => {
        const dataSource = AppDataSource.getDataSource();
        if (dataSource.isInitialized) {
            await dataSource.destroy();
        }
    });

  it('should refresh tokens using valid cookie', async () => {
  const agent = request.agent(app);

  await agent.post('/api/auth/signup').send({
    username: 'refresh_tester',
    email: 'refresh@test.com',
    password: 'password123'
  });

  await agent.post('/api/auth/login').send({
    email: 'refresh@test.com',
    password: 'password123',
    rememberMe: true
  });

  const response = await agent.post('/api/refresh-token');

  expect(response.status).toBe(200);
  expect(response.body.message).toBe('Refresh réussi');
});


    it('should fail to refresh with missing cookie', async () => {
        const response = await request(app).post('/api/refresh-token');
        expect(response.status).toBe(401);
    });

    it('should fail to refresh with invalid token', async () => {
        const response = await request(app)
            .post('/api/refresh-token') 
            .set('Cookie', ['refreshToken=invalid_token']);

        expect(response.status).toBe(403);
    });
});