import '@testing-library/jest-dom';
import { Principal } from '@dfinity/principal';

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
}

global.mockPrincipal = Principal.fromText('2vxsx-fae');

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

// Mock Web3React
jest.mock('@web3-react/core', () => ({
  useWeb3React: jest.fn().mockReturnValue({
    active: false,
    activate: jest.fn(),
    deactivate: jest.fn(),
    account: null,
    library: null,
    connector: null,
    error: null,
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

// Mock fetch
global.fetch = jest.fn();

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
  localStorageMock.clear();
});
