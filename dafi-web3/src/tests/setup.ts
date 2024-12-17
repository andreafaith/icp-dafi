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
  var ethereum: {
    request: jest.Mock;
    on: jest.Mock;
    removeListener: jest.Mock;
    autoRefreshOnNetworkChange: boolean;
  };
  var localStorage: Storage;
  var testJwtToken: string;
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

// Mock Web3
jest.mock('web3', () => {
  return jest.fn().mockImplementation(() => ({
    eth: {
      getAccounts: jest.fn().mockResolvedValue(['0x123']),
      getBalance: jest.fn().mockResolvedValue('1000000000000000000'),
      Contract: jest.fn(),
    },
  }));
});

// Mock WalletMask
const mockPlug = {
  requestConnect: jest.fn().mockResolvedValue(true),
  getPrincipal: jest.fn().mockResolvedValue(global.mockPrincipal),
  getBalance: jest.fn().mockResolvedValue(BigInt(1000000000)),
  signMessage: jest.fn().mockResolvedValue('mocked-signature'),
  disconnect: jest.fn().mockResolvedValue(undefined),
  isConnected: jest.fn().mockResolvedValue(true),
};

Object.defineProperty(window, 'ic', {
  value: { plug: mockPlug },
  writable: true,
});

// Mock mongoose
jest.mock('mongoose', () => {
  const mongoose = jest.requireActual('mongoose');
  return {
    ...mongoose,
    connect: jest.fn().mockResolvedValue(mongoose),
    connection: {
      ...mongoose.connection,
      close: jest.fn().mockResolvedValue(undefined),
    },
  };
});

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    query: {},
  }),
}));

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
  length: 0,
  key: jest.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock window.ethereum
const ethereumMock = {
  isMetaMask: true,
  request: jest.fn(),
  on: jest.fn(),
  removeListener: jest.fn(),
  autoRefreshOnNetworkChange: false
};

Object.defineProperty(window, 'ethereum', {
  writable: true,
  value: ethereumMock
});

// Add TextEncoder and TextDecoder polyfills for Node.js environment
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock fetch
global.fetch = jest.fn();

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
  localStorageMock.clear();
});
