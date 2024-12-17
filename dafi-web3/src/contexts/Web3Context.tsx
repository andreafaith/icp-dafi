import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';
import { idlFactory as assetIdl } from '../declarations/asset';
import { idlFactory as investmentIdl } from '../declarations/investment';
import { _SERVICE as AssetService } from '../declarations/asset/asset.did';
import { _SERVICE as InvestmentService } from '../declarations/investment/investment.did';

interface Web3ContextType {
  isConnected: boolean;
  principal: Principal | null;
  assetActor: AssetService | null;
  investmentActor: InvestmentService | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | null>(null);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [principal, setPrincipal] = useState<Principal | null>(null);
  const [assetActor, setAssetActor] = useState<AssetService | null>(null);
  const [investmentActor, setInvestmentActor] = useState<InvestmentService | null>(null);
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);

  useEffect(() => {
    AuthClient.create().then(setAuthClient);
  }, []);

  const connect = useCallback(async () => {
    if (!authClient) return;

    try {
      await authClient.login({
        identityProvider: process.env.NEXT_PUBLIC_INTERNET_IDENTITY_URL,
        onSuccess: async () => {
          const identity = authClient.getIdentity();
          const userPrincipal = identity.getPrincipal();
          setPrincipal(userPrincipal);

          const agent = new HttpAgent({
            identity,
            host: process.env.NEXT_PUBLIC_IC_HOST,
          });

          // Fetch root key for local development
          if (process.env.NODE_ENV !== "production") {
            await agent.fetchRootKey().catch(console.error);
          }

          const assetCanisterId = process.env.NEXT_PUBLIC_ASSET_CANISTER_ID;
          const investmentCanisterId = process.env.NEXT_PUBLIC_INVESTMENT_CANISTER_ID;

          if (!assetCanisterId || !investmentCanisterId) {
            throw new Error('Canister IDs not found in environment variables');
          }

          const newAssetActor = Actor.createActor<AssetService>(assetIdl, {
            agent,
            canisterId: assetCanisterId,
          });

          const newInvestmentActor = Actor.createActor<InvestmentService>(investmentIdl, {
            agent,
            canisterId: investmentCanisterId,
          });

          setAssetActor(newAssetActor);
          setInvestmentActor(newInvestmentActor);
          setIsConnected(true);
        },
        onError: (error) => {
          console.error('Login failed:', error);
          throw error;
        },
      });
    } catch (error) {
      console.error('Connection error:', error);
      throw error;
    }
  }, [authClient]);

  const disconnect = useCallback(async () => {
    if (!authClient) return;

    try {
      await authClient.logout();
      setPrincipal(null);
      setAssetActor(null);
      setInvestmentActor(null);
      setIsConnected(false);
    } catch (error) {
      console.error('Disconnect error:', error);
      throw error;
    }
  }, [authClient]);

  const value = {
    isConnected,
    principal,
    assetActor,
    investmentActor,
    connect,
    disconnect,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};
