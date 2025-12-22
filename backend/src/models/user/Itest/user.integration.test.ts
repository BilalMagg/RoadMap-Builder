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

  //add this data in DB
  //Succès – email existe en base
    describe('/forgot-password',()=>{
        it('should send an email and return success message if email exists',async()=>{
            const response=await request(app)
                            .post('/forgot-password')
                            .send({
                                email:'Somia@gmail.com'
                        
                            });
            expect(response.status).toBe(200);     
            expect(response.body.message).toBe('Email sent successfully')                      
        })
   
    // échec, email n’existe pas

        it('should return 404 if email does not exist',async()=>{
            const response=await request(app)
                            .post('/forgot-password')
                            .send({
                                email:'emailfail@gmail.com'
                        
                            });
            expect(response.status).toBe(404);     
            expect(response.body.message).toBe('User with this email does not exist')                      
        });
  

    //Échec – email manquant
   
        it('should return 400 if email is empty',async()=>{
            const response=await request(app)
                            .post('/forgot-password')
                            .send({
                                email:''
                        
                            });
            expect(response.status).toBe(400);     
        });
    
});


describe('/reset-password/:id/:token',()=>{
    it('should reset password successfully',async()=>{
        const id='id123';
        const token='ValideToken';//je dois le changer par token valide
        const newPassword='Password1234'
     const response= await request(app)
                    .post(`/reset-password/${id}/${token}`)
                    .send({
                        password:newPassword
                    
                    });
         expect(response.status).toBe(200);
         expect(response.body.message).toBe('Password change succsefull')           
    });

    it('should return 404 if user does not exist',async()=>{
        const id='id123';//id n'existe pas au base de donne
        const token='ValideToken';//je dois le changer par token valide
        const newPassword='Password1234 '
     const response= await request(app)
                    .post(`/reset-password/${id}/${token}`)
                    .send({
                        password:newPassword
                    
                    });
         expect(response.status).toBe(404);
         expect(response.body.message).toBe('User does not exist');         
    });

     it('should return 400 for invalid or expired token',async()=>{
        const id='id123';
        const token='InValideToken';//je dois le changer par token Invalide
        const newPassword='Password1234'
     const response= await request(app)
                    .post(`/reset-password/${id}/${token}`)
                    .send({
                        password:newPassword
                    
                    });
         expect(response.status).toBe(400);
         expect(response.body.message).toBe('Invalid or expired token');         
    });

    it('should return 400 if newPassword is missing',async()=>{
        const id='id123';
        const token='InValideToken';//je dois le changer par token Invalide
        const newPassword=''
     const response= await request(app)
                    .post(`/reset-password/${id}/${token}`)
                    .send({
                        password:newPassword
                    
                    });
         expect(response.status).toBe(400);
         expect(response.body.message).toBe('newPassword is required');         
    });
});

describe('/logout',()=>{
    it('should clear cookies and return 200 with success message',async()=>{
        const response=await request(app).get('/logout').send();
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Logout successful');
        const Cookies=response.headers['set-cookie']as any;
        expect(Cookies).toBeDefined();
        expect(Array.isArray(Cookies)).toBe(true);

        expect(Cookies.some((cookie: string)=>cookie.includes('accessToken=;'))).toBe(true);
        expect(Cookies.some((cookie:string)=>cookie.includes('refreshToken=;'))).toBe(true);

                                        
    })
})
 });