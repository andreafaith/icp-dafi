import React, { createContext, useContext, useState, useEffect } from 'react';
import { Web3Provider as EthersWeb3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import EthereumProvider from '@walletconnect/ethereum-provider';

interface Web3ContextType {
  connect: (connectorId: 'injected' | 'walletconnect') => Promise<void>;
  disconnect: () => Promise<void>;
  account: string | null;
  chainId: number | null;
  isConnecting: boolean;
  error: Error | null;
  provider: EthersWeb3Provider | null;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

// Initialize connectors
const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 56, 97],
});

const SUPPORTED_CHAIN_IDS = [1, 56]; // Ethereum and BSC

// Initialize WalletConnect
const initWalletConnect = async () => {
  try {
    const provider = await EthereumProvider.init({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '', // required
      chains: SUPPORTED_CHAIN_IDS, // required
      showQrModal: true, // required
      methods: ['eth_sendTransaction', 'personal_sign'],
      events: ['chainChanged', 'accountsChanged'],
      metadata: {
        name: 'DAFI',
        description: 'Decentralized Agricultural Finance Initiative',
        url: 'https://dafi.finance',
        icons: ['https://dafi.finance/logo.png']
      }
    });

    return provider;
  } catch (error) {
    console.error('Failed to initialize WalletConnect:', error);
    throw error;
  }
};

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { library, activate, deactivate, active, account, chainId, error: web3Error } = useWeb3React<EthersWeb3Provider>();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [walletConnectProvider, setWalletConnectProvider] = useState<EthereumProvider | null>(null);

  // Handle connection on page load
  useEffect(() => {
    const connectOnLoad = async () => {
      try {
        const shouldAutoConnect = localStorage.getItem('shouldAutoConnect') === 'true';
        if (shouldAutoConnect && !active) {
          await activate(injected, undefined, true);
        }
      } catch (err) {
        console.error('Error on auto connect:', err);
      }
    };

    if (typeof window !== 'undefined') {
      connectOnLoad();
    }
  }, [activate, active]);

  // Update error state when web3Error changes
  useEffect(() => {
    if (web3Error) {
      setError(web3Error);
    }
  }, [web3Error]);

  const connect = async (connectorId: 'injected' | 'walletconnect') => {
    try {
      setIsConnecting(true);
      setError(null);

      if (connectorId === 'injected') {
        await activate(injected, undefined, true);
        localStorage.setItem('shouldAutoConnect', 'true');
      } else {
        // WalletConnect
        const provider = await initWalletConnect();
        await provider.enable();
        setWalletConnectProvider(provider);
        await activate(provider as any, undefined, true);
      }
    } catch (err) {
      console.error('Connection error:', err);
      setError(err as Error);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      deactivate();
      localStorage.removeItem('shouldAutoConnect');
      if (walletConnectProvider) {
        await walletConnectProvider.disconnect();
        setWalletConnectProvider(null);
      }
    } catch (err) {
      console.error('Disconnect error:', err);
      setError(err as Error);
    }
  };

  return (
    <Web3Context.Provider
      value={{
        connect,
        disconnect,
        account: account || null,
        chainId: chainId || null,
        isConnecting,
        error,
        provider: library || null,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
