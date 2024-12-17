import React, { createContext, useContext, useState, useEffect } from 'react';
import { Principal } from '@dfinity/principal';
import axios from 'axios';

interface WalletState {
  isConnected: boolean;
  isConnecting: boolean;
  principal: Principal | null;
  balance: bigint | null;
  error: string | null;
}

interface WalletContextType extends WalletState {
  connect: () => Promise<boolean>;
  disconnect: () => Promise<void>;
  signMessage: (message: string) => Promise<string | null>;
}

const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  isConnecting: false,
  principal: null,
  balance: null,
  error: null,
  connect: async () => false,
  disconnect: async () => {},
  signMessage: async () => null,
});

export const useWallet = () => useContext(WalletContext);

declare global {
  interface Window {
    ic?: {
      plug?: {
        requestConnect: () => Promise<boolean>;
        getPrincipal: () => Promise<Principal>;
        getBalance: () => Promise<bigint>;
        signMessage: (message: string) => Promise<string>;
        disconnect: () => Promise<void>;
      };
    };
  }
}

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    isConnecting: false,
    principal: null,
    balance: null,
    error: null,
  });

  // Check if wallet is already connected
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // @ts-ignore - WalletMask types
        if (window.ic?.plug) {
          // @ts-ignore
          const connected = await window.ic.plug.isConnected();
          if (connected) {
            // @ts-ignore
            const principal = await window.ic.plug.getPrincipal();
            // @ts-ignore
            const balance = await window.ic.plug.getBalance();
            setState({
              isConnected: true,
              isConnecting: false,
              principal,
              balance,
              error: null,
            });
          }
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    };

    checkConnection();
  }, []);

  const connect = async (): Promise<boolean> => {
    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      // @ts-ignore - WalletMask types
      if (!window.ic?.plug) {
        setState(prev => ({
          ...prev,
          error: 'WalletMask not installed',
          isConnecting: false,
        }));
        return false;
      }

      // @ts-ignore
      const connected = await window.ic.plug.requestConnect();
      if (connected) {
        // @ts-ignore
        const principal = await window.ic.plug.getPrincipal();
        // @ts-ignore
        const balance = await window.ic.plug.getBalance();

        // Create or update user account in MongoDB
        await axios.post('/api/auth/wallet-connect', {
          principal: principal.toString(),
          walletType: 'walletmask',
        });

        setState({
          isConnected: true,
          isConnecting: false,
          principal,
          balance,
          error: null,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to connect wallet',
        isConnecting: false,
      }));
      return false;
    }
  };

  const disconnect = async () => {
    try {
      // @ts-ignore - WalletMask types
      if (window.ic?.plug) {
        // @ts-ignore
        await window.ic.plug.disconnect();
      }
      setState({
        isConnected: false,
        isConnecting: false,
        principal: null,
        balance: null,
        error: null,
      });
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to disconnect wallet',
      }));
    }
  };

  const signMessage = async (message: string): Promise<string | null> => {
    try {
      // @ts-ignore - WalletMask types
      if (!window.ic?.plug) {
        setState(prev => ({ ...prev, error: 'WalletMask not installed' }));
        return null;
      }

      // @ts-ignore
      return await window.ic.plug.signMessage(message);
    } catch (error) {
      console.error('Error signing message:', error);
      setState(prev => ({ ...prev, error: 'Failed to sign message' }));
      return null;
    }
  };

  return (
    <WalletContext.Provider
      value={{
        ...state,
        connect,
        disconnect,
        signMessage,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
