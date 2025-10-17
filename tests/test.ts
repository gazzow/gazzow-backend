// // 1. UNIT TESTS - Testing individual functions/classes
// // src/app/use-cases/user/__tests__/store-temp-user-and-send-otp.test.ts

// import { StoreTempUserAndSendOtp } from '../store-temp-user-and-send-otp.js';
// import { IOtpService, IEmailService, IPasswordHasher } from '../store-temp-user-and-send-otp.js';

// // Mock dependencies
// const mockOtpService: jest.Mocked<IOtpService> = {
//   generateOtp: jest.fn(),
//   storeOtpWithUserData: jest.fn(),
// };

// const mockEmailService: jest.Mocked<IEmailService> = {
//   sendOtpEmail: jest.fn(),
// };

// const mockPasswordHasher: jest.Mocked<IPasswordHasher> = {
//   hash: jest.fn(),
// };

// describe('StoreTempUserAndSendOtp', () => {
//   let useCase: StoreTempUserAndSendOtp;

//   beforeEach(() => {
//     // Reset all mocks
//     jest.clearAllMocks();

//     // Create fresh instance
//     useCase = new StoreTempUserAndSendOtp(
//       mockOtpService,
//       mockEmailService,
//       mockPasswordHasher
//     );
//   });

//   describe('execute', () => {
//     const userData = {
//       name: 'John Doe',
//       email: 'john@example.com',
//       password: 'password123'
//     };

//     it('should successfully store user data and send OTP', async () => {
//       // Arrange
//       const hashedPassword = 'hashed-password-123';
//       const otp = '123456';

//       mockPasswordHasher.hash.mockResolvedValue(hashedPassword);
//       mockOtpService.generateOtp.mockReturnValue(otp);
//       mockOtpService.storeOtpWithUserData.mockResolvedValue();
//       mockEmailService.sendOtpEmail.mockResolvedValue();

//       // Act
//       const result = await useCase.execute(userData);

//       // Assert
//       expect(mockPasswordHasher.hash).toHaveBeenCalledWith('password123');
//       expect(mockOtpService.generateOtp).toHaveBeenCalledTimes(1);
//       expect(mockOtpService.storeOtpWithUserData).toHaveBeenCalledWith(
//         'john@example.com',
//         otp,
//         {
//           name: 'John Doe',
//           email: 'john@example.com',
//           password: hashedPassword,
//           createdAt: expect.any(String)
//         }
//       );
//       expect(mockEmailService.sendOtpEmail).toHaveBeenCalledWith('john@example.com', otp);
//       expect(result).toEqual({
//         success: true,
//         email: 'john@example.com'
//       });
//     });

//     it('should throw error when password hashing fails', async () => {
//       // Arrange
//       mockPasswordHasher.hash.mockRejectedValue(new Error('Hashing failed'));

//       // Act & Assert
//       await expect(useCase.execute(userData)).rejects.toThrow('Failed to store user data and send OTP');

//       // Verify that subsequent services weren't called
//       expect(mockOtpService.generateOtp).not.toHaveBeenCalled();
//       expect(mockEmailService.sendOtpEmail).not.toHaveBeenCalled();
//     });

//     it('should throw error when email service fails', async () => {
//       // Arrange
//       mockPasswordHasher.hash.mockResolvedValue('hashed-password');
//       mockOtpService.generateOtp.mockReturnValue('123456');
//       mockOtpService.storeOtpWithUserData.mockResolvedValue();
//       mockEmailService.sendOtpEmail.mockRejectedValue(new Error('Email failed'));

//       // Act & Assert
//       await expect(useCase.execute(userData)).rejects.toThrow('Failed to store user data and send OTP');
//     });
//   });
// });

// // 2. INTEGRATION TESTS - Testing multiple components together
// // src/app/services/__tests__/otp-service.integration.test.ts

// import { Redis } from 'ioredis';
// import { OtpService } from '../otp-service.js';

// describe('OtpService Integration', () => {
//   let redis: Redis;
//   let otpService: OtpService;

//   beforeAll(async () => {
//     // Use test Redis database
//     redis = new Redis(process.env.TEST_REDIS_URL || 'redis://localhost:6379/1');
//     otpService = new OtpService(redis);
//   });

//   afterAll(async () => {
//     await redis.quit();
//   });

//   beforeEach(async () => {
//     // Clean up Redis before each test
//     await redis.flushdb();
//   });

//   describe('storeOtpWithUserData', () => {
//     it('should store OTP data in Redis and retrieve it', async () => {
//       // Arrange
//       const email = 'test@example.com';
//       const otp = '123456';
//       const userData = { name: 'Test User', email };

//       // Act
//       await otpService.storeOtpWithUserData(email, otp, userData);

//       // Assert - Check data is stored in Redis
//       const storedData = await redis.get(`otp:${email}`);
//       expect(storedData).toBeTruthy();

//       const parsedData = JSON.parse(storedData!);
//       expect(parsedData.otp).toBe(otp);
//       expect(parsedData.userData).toEqual(userData);
//       expect(parsedData.createdAt).toBeTruthy();
//     });

//     it('should expire data after TTL', async () => {
//       // Arrange
//       const email = 'test@example.com';
//       const otp = '123456';
//       const userData = { name: 'Test User' };

//       // Use short TTL for testing (1 second)
//       await otpService.storeOtpWithUserData(email, otp, userData, 1);

//       // Act - Wait for expiry
//       await new Promise(resolve => setTimeout(resolve, 1100)); // Wait 1.1 seconds

//       // Assert - Data should be expired
//       const result = await redis.get(`otp:${email}`);
//       expect(result).toBeNull();
//     });
//   });

//   describe('verifyOtp', () => {
//     it('should verify correct OTP', async () => {
//       // Arrange
//       const email = 'test@example.com';
//       const correctOtp = '123456';
//       const userData = { name: 'Test User' };

//       await otpService.storeOtpWithUserData(email, correctOtp, userData);

//       // Act
//       const result = await otpService.verifyOtp(email, correctOtp);

//       // Assert
//       expect(result.isValid).toBe(true);
//       expect(result.userData).toEqual(userData);
//     });

//     it('should reject incorrect OTP', async () => {
//       // Arrange
//       const email = 'test@example.com';
//       await otpService.storeOtpWithUserData(email, '123456', {});

//       // Act
//       const result = await otpService.verifyOtp(email, '654321');

//       // Assert
//       expect(result.isValid).toBe(false);
//       expect(result.userData).toBeNull();
//     });
//   });
// });

// // 3. E2E TESTS - Full API requests (what you're familiar with)
// // src/__tests__/e2e/auth.e2e.test.ts

// import request from 'supertest';
// import { app } from '../../app.js';
// import { Redis } from 'ioredis';

// describe('Auth API E2E', () => {
//   let redis: Redis;

//   beforeAll(async () => {
//     redis = new Redis(process.env.TEST_REDIS_URL);
//   });

//   afterAll(async () => {
//     await redis.quit();
//   });

//   beforeEach(async () => {
//     // Clean database and Redis
//     await redis.flushdb();
//     // Clean test database if using one
//   });

//   describe('POST /api/auth/register', () => {
//     it('should register user and send OTP', async () => {
//       const userData = {
//         name: 'John Doe',
//         email: 'john@example.com',
//         password: 'password123'
//       };

//       const response = await request(app)
//         .post('/api/auth/register')
//         .send(userData)
//         .expect(200);

//       expect(response.body.message).toContain('OTP sent');
//       expect(response.body.email).toContain('john***@example.com');

//       // Verify OTP is stored in Redis
//       const storedData = await redis.get(`registration:${userData.email}`);
//       expect(storedData).toBeTruthy();
//     });

//     it('should reject invalid email format', async () => {
//       const response = await request(app)
//         .post('/api/auth/register')
//         .send({
//           name: 'John Doe',
//           email: 'invalid-email',
//           password: 'password123'
//         })
//         .expect(400);

//       expect(response.body.message).toContain('Invalid email');
//     });

//     it('should reject weak password', async () => {
//       const response = await request(app)
//         .post('/api/auth/register')
//         .send({
//           name: 'John Doe',
//           email: 'john@example.com',
//           password: '123'
//         })
//         .expect(400);

//       expect(response.body.message).toContain('Password must be');
//     });
//   });

//   describe('POST /api/auth/verify-otp', () => {
//     it('should verify OTP and create user account', async () => {
//       // First register
//       await request(app)
//         .post('/api/auth/register')
//         .send({
//           name: 'John Doe',
//           email: 'john@example.com',
//           password: 'password123'
//         });

//       // Get OTP from Redis (for testing)
//       const storedData = await redis.get('registration:john@example.com');
//       const { otp } = JSON.parse(storedData!);

//       // Verify OTP
//       const response = await request(app)
//         .post('/api/auth/verify-otp')
//         .send({
//           email: 'john@example.com',
//           otp: otp
//         })
//         .expect(201);

//       expect(response.body.message).toBe('Registration successful');
//       expect(response.body.token).toBeTruthy();
//       expect(response.body.user.isVerified).toBe(true);

//       // Verify OTP is cleaned up
//       const remainingData = await redis.get('registration:john@example.com');
//       expect(remainingData).toBeNull();
//     });
//   });
// });

// // 4. TEST SETUP AND CONFIGURATION
// // package.json scripts
// /*
// {
//   "scripts": {
//     "test": "jest",
//     "test:unit": "jest --testPathPattern=__tests__.*\\.test\\.",
//     "test:integration": "jest --testPathPattern=integration",
//     "test:e2e": "jest --testPathPattern=e2e",
//     "test:watch": "jest --watch",
//     "test:coverage": "jest --coverage"
//   }
// }
// */

// // jest.config.js
// /*
// module.exports = {
//   preset: 'ts-jest',
//   testEnvironment: 'node',
//   roots: ['<rootDir>/src'],
//   testMatch: [
//     '**/__tests__/**/*.test.ts',
//     '**/?(*.)+(spec|test).ts'
//   ],
//   collectCoverageFrom: [
//     'src/**/*.ts',
//     '!src/**/*.d.ts',
//     '!src/**/__tests__/**'
//   ],
//   setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts']
// };
// */
