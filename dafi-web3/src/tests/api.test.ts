import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { createMocks } from 'node-mocks-http';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { UserModel } from '../models/User';
import walletConnectHandler from '../pages/api/auth/wallet-connect';
import profileHandler from '../pages/api/user/profile';
import kycHandler from '../pages/api/user/kyc';
import { NextApiRequest, NextApiResponse } from 'next';

let mongoServer: MongoMemoryServer;
let testUser: any;
let authToken: string;

// Increase test timeout
jest.setTimeout(30000);

beforeAll(async () => {
    // Setup test database
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Create test user
    testUser = await UserModel.create({
        principal: 'test-principal-1',
        walletType: 'walletmask',
        roles: ['user'],
        status: 'active',
        kycData: {
            documentType: '',
            documentNumber: '',
            verificationStatus: 'pending',
            submissionDate: new Date(),
        }
    });

    // Set JWT secret for testing
    process.env.JWT_SECRET = 'test-secret';
});

afterAll(async () => {
    // Clean up
    await UserModel.deleteMany({});
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('API Endpoints', () => {
    it('should handle wallet connect request and return JWT token', async () => {
        const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
            method: 'POST',
            body: {
                principal: testUser.principal,
                walletType: 'walletmask',
            },
        });

        // Add env property to req
        (req as any).env = {};

        await walletConnectHandler(req, res);
        expect(res._getStatusCode()).toBe(200);
        
        const data = JSON.parse(res._getData());
        expect(data.token).toBeDefined();
        authToken = data.token;
    });

    it('should get user profile', async () => {
        const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
            method: 'GET',
            headers: {
                authorization: `Bearer ${authToken}`,
            },
        });

        // Add env property to req
        (req as any).env = {};

        await profileHandler(req, res);
        expect(res._getStatusCode()).toBe(200);
        
        const data = JSON.parse(res._getData());
        expect(data.user.principal).toBe(testUser.principal);
    });

    it('should update KYC data', async () => {
        const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
            method: 'POST',
            headers: {
                authorization: `Bearer ${authToken}`,
            },
            body: {
                documentType: 'passport',
                documentNumber: '123456789',
            },
        });

        // Add env property to req
        (req as any).env = {};

        await kycHandler(req, res);
        expect(res._getStatusCode()).toBe(200);
        
        const data = JSON.parse(res._getData());
        expect(data.message).toBe('KYC submission successful');
        expect(data.kycData.documentType).toBe('passport');
        expect(data.kycData.documentNumber).toBe('123456789');
        expect(data.kycData.verificationStatus).toBe('pending');
    });

    it('should get updated profile with KYC data', async () => {
        const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
            method: 'GET',
            headers: {
                authorization: `Bearer ${authToken}`,
            },
        });

        // Add env property to req
        (req as any).env = {};

        await profileHandler(req, res);
        expect(res._getStatusCode()).toBe(200);
        
        const data = JSON.parse(res._getData());
        expect(data.user.kycData.documentType).toBe('passport');
        expect(data.user.kycData.verificationStatus).toBe('pending');
    });

    it('should reject requests without auth token', async () => {
        const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
            method: 'GET',
        });

        // Add env property to req
        (req as any).env = {};

        await profileHandler(req, res);
        expect(res._getStatusCode()).toBe(401);
    });

    it('should reject requests with invalid auth token', async () => {
        const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
            method: 'GET',
            headers: {
                authorization: 'Bearer invalid-token',
            },
        });

        // Add env property to req
        (req as any).env = {};

        await profileHandler(req, res);
        expect(res._getStatusCode()).toBe(401);
    });
});
