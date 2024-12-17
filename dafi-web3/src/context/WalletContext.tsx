import React, { createContext, useContext, ReactNode } from 'react';
import { useWallet } from '../hooks/useWallet';

interface WalletContextType {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  balance: bigint | null;
  connect: (provider: string) => Promise<boolean>;
  disconnect: () => Promise<boolean>;
  signMessage: (message: string) => Promise<string | null>;
  getBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const wallet = useWallet();

  return (
    <WalletContext.Provider value={wallet}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
};
