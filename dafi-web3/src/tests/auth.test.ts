import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { UserModel } from '../models/User';
import jwt from 'jsonwebtoken';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Authentication and User Management', () => {
    it('should create a new user when connecting wallet', async () => {
        const userData = {
            principal: 'test-principal-1',
            walletType: 'walletmask',
        };

        const user = await UserModel.create(userData);
        expect(user.principal).toBe(userData.principal);
        expect(user.walletType).toBe(userData.walletType);
        expect(user.roles).toContain('user');
        expect(user.status).toBe('active');
    });

    it('should update user profile', async () => {
        const user = await UserModel.findOne({ principal: 'test-principal-1' });
        if (!user) throw new Error('User not found');

        const updates = {
            name: 'Test User',
            email: 'test@example.com',
            bio: 'Test bio',
        };

        Object.assign(user, updates);
        await user.save();

        const updatedUser = await UserModel.findOne({ principal: 'test-principal-1' });
        expect(updatedUser?.name).toBe(updates.name);
        expect(updatedUser?.email).toBe(updates.email);
        expect(updatedUser?.bio).toBe(updates.bio);
    });

    it('should submit KYC data', async () => {
        const user = await UserModel.findOne({ principal: 'test-principal-1' });
        if (!user) throw new Error('User not found');

        const kycData = {
            documentType: 'passport',
            documentNumber: 'ABC123',
            verificationStatus: 'pending',
            submissionDate: new Date(),
        };

        user.kycData = kycData;
        await user.save();

        const updatedUser = await UserModel.findOne({ principal: 'test-principal-1' });
        expect(updatedUser?.kycData?.documentType).toBe(kycData.documentType);
        expect(updatedUser?.kycData?.documentNumber).toBe(kycData.documentNumber);
        expect(updatedUser?.kycData?.verificationStatus).toBe('pending');
    });

    it('should generate valid JWT token', () => {
        const userData = {
            _id: 'test-id',
            principal: 'test-principal-1',
            roles: ['user'],
        };

        const token = jwt.sign(
            {
                userId: userData._id,
                principal: userData.principal,
                roles: userData.roles,
            },
            'test-secret',
            { expiresIn: '24h' }
        );

        const decoded = jwt.verify(token, 'test-secret') as any;
        expect(decoded.userId).toBe(userData._id);
        expect(decoded.principal).toBe(userData.principal);
        expect(decoded.roles).toEqual(userData.roles);
    });

    it('should handle role-based access', async () => {
        const user = await UserModel.findOne({ principal: 'test-principal-1' });
        if (!user) throw new Error('User not found');

        // Add investor role
        user.roles.push('investor');
        await user.save();

        const updatedUser = await UserModel.findOne({ principal: 'test-principal-1' });
        expect(updatedUser?.roles).toContain('investor');
        expect(updatedUser?.roles.length).toBe(2); // should have both 'user' and 'investor' roles
    });

    it('should verify KYC status', async () => {
        const user = await UserModel.findOne({ principal: 'test-principal-1' });
        if (!user) throw new Error('User not found');

        // Verify KYC
        user.isKYCVerified = true;
        user.kycData!.verificationStatus = 'verified';
        user.kycData!.verificationDate = new Date();
        await user.save();

        const updatedUser = await UserModel.findOne({ principal: 'test-principal-1' });
        expect(updatedUser?.isKYCVerified).toBe(true);
        expect(updatedUser?.kycData?.verificationStatus).toBe('verified');
        expect(updatedUser?.kycData?.verificationDate).toBeDefined();
    });
});
