import request from 'supertest';
import app from '../../../app';
import { AppDataSource } from '../../../config/dbConfig';


describe('Auth Integration Tests', () => {

    beforeAll(async () => {      
        await AppDataSource.connect();   
    });

    afterAll(async () => {
        const dataSource = AppDataSource.getDataSource();
        if (dataSource.isInitialized) {
            await dataSource.destroy();
        }
    });


    describe('POST /api/auth/signup', () => {
        const signupPayload = {
            username: 'said_test',
            email: 'said@gmail.com',
            password: 'password123'
        };

        it('should register a new user and return 201', async () => {
            const response = await request(app)
                .post('/api/auth/signup')
                .send(signupPayload);

            expect(response.status).toBe(201);
            expect(response.body.message).toBe("User created successfully");
            expect(response.body.data.email).toBe(signupPayload.email);
            expect(response.body.data).not.toHaveProperty('password');
        });

        it('should return 409 if email is already taken', async () => {
            await request(app).post('/api/auth/signup').send(signupPayload);

            const response = await request(app)
                .post('/api/auth/signup')
                .send(signupPayload);

            expect(response.status).toBe(409);
            expect(response.body.message).toContain('exist');
        });
    });

    describe('POST /api/auth/login', () => {
        const userCredentials = {
            email: 'login@test.com',
            password: 'correct_password'
        };

        beforeEach(async () => {
            await request(app).post('/api/auth/signup').send({
                username: 'login_user',
                email: userCredentials.email,
                password: userCredentials.password
            });
        });

        it('should login successfully and set secure cookies', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send(userCredentials);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('user');
            
            const cookies = response.get('Set-Cookie');
            expect(cookies).toBeDefined();
            expect(cookies?.some(c => c.includes('accessToken'))).toBe(true);
            expect(cookies?.some(c => c.includes('refreshToken'))).toBe(true);
        });

        it('should fail with 401 for wrong password', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: userCredentials.email,
                    password: 'wrong_password'
                });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Invalid credentials');
        });

        it('should fail with 401 for non-existent email', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'ghost@example.com',
                    password: 'any_password'
                });

            expect(response.status).toBe(401);
        });
    });
});