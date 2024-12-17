/** @jest-environment jsdom */
import { render, act } from '@testing-library/react';
import { Web3Provider, useWeb3 } from '../contexts/Web3Context';

// Mock AuthClient
jest.mock('@dfinity/auth-client', () => ({
  AuthClient: {
    create: jest.fn().mockResolvedValue({
      getIdentity: jest.fn().mockReturnValue({}),
      login: jest.fn(),
      logout: jest.fn(),
    }),
  },
}));

// Test component that uses the Web3 context
const TestComponent = () => {
  const { isConnected, connect, disconnect } = useWeb3();
  return (
    <div>
      <div data-testid="auth-status">{isConnected ? 'Connected' : 'Not Connected'}</div>
      <button onClick={connect}>Connect</button>
      <button onClick={disconnect}>Disconnect</button>
    </div>
  );
};

describe('Web3Context', () => {
  it('provides authentication context to children', async () => {
    let component;
    await act(async () => {
      component = render(
        <Web3Provider>
          <TestComponent />
        </Web3Provider>
      );
    });

    const { getByTestId } = component!;
    expect(getByTestId('auth-status')).toHaveTextContent('Not Connected');
  });
});
