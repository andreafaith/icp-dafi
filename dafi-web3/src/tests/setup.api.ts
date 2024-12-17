import '@testing-library/jest-dom';
import { Principal } from '@dfinity/principal';
import jwt from 'jsonwebtoken';

// Mock environment variables
process.env = {
    ...process.env,
    NEXT_PUBLIC_IC_HOST: 'http://localhost:8000',
    NEXT_PUBLIC_INTERNET_IDENTITY_URL: 'http://localhost:8000?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai',
    NEXT_PUBLIC_ASSET_CANISTER_ID: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
    NEXT_PUBLIC_INVESTMENT_CANISTER_ID: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
    NEXT_PUBLIC_RETURN_CANISTER_ID: 'r7inp-6aaaa-aaaaa-aaabq-cai',
    NEXT_PUBLIC_ETHEREUM_RPC_URL: 'http://localhost:8545',
    NEXT_PUBLIC_BSC_RPC_URL: 'http://localhost:8546',
    NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: 'test-project-id',
    JWT_SECRET: 'test-secret',
    MONGODB_URI: 'mongodb://localhost:27017/test',
};

// Mock Principal
declare global {
    var mockPrincipal: Principal;
}

global.mockPrincipal = Principal.fromText('2vxsx-fae');

// Generate a test JWT token
global.testJwtToken = jwt.sign(
    {
        userId: 'test-user-id',
        principal: global.mockPrincipal.toString(),
        roles: ['user'],
    },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
);

// Mock HttpAgent
jest.mock('@dfinity/agent', () => ({
    HttpAgent: jest.fn().mockImplementation(() => ({
        fetchRootKey: jest.fn(),
    })),
    Actor: {
        createActor: jest.fn(),
    },
}));

// Add TextEncoder and TextDecoder polyfills for Node.js environment
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock fetch
global.fetch = jest.fn();
