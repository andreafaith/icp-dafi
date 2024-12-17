import { useState, useEffect, useCallback } from 'react';
import { Principal } from '@dfinity/principal';
import { walletService, WalletConnection } from '../services/wallet';

interface WalletState {
  isConnected: boolean;
  isConnecting: boolean;
  connection: WalletConnection | null;
  error: string | null;
  balance: bigint | null;
}

export const useWallet = () => {
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    isConnecting: false,
    connection: null,
    error: null,
    balance: null,
  });

  const connect = useCallback(async (provider: string) => {
    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const connection = await walletService.connect(provider);
      if (connection) {
        setState(prev => ({
          ...prev,
          isConnected: true,
          connection,
          error: null,
        }));
        return true;
      } else {
        setState(prev => ({
          ...prev,
          error: 'Failed to connect wallet',
        }));
        return false;
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'An error occurred while connecting wallet',
      }));
      return false;
    } finally {
      setState(prev => ({ ...prev, isConnecting: false }));
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      await walletService.disconnect();
      setState({
        isConnected: false,
        isConnecting: false,
        connection: null,
        error: null,
        balance: null,
      });
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'An error occurred while disconnecting wallet',
      }));
      return false;
    }
  }, []);

  const signMessage = useCallback(async (message: string): Promise<string | null> => {
    if (!state.isConnected) {
      setState(prev => ({
        ...prev,
        error: 'Wallet not connected',
      }));
      return null;
    }

    try {
      return await walletService.signMessage(message);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'An error occurred while signing message',
      }));
      return null;
    }
  }, [state.isConnected]);

  const getBalance = useCallback(async () => {
    if (!state.isConnected) {
      setState(prev => ({
        ...prev,
        error: 'Wallet not connected',
      }));
      return;
    }

    try {
      const balance = await walletService.getBalance();
      setState(prev => ({ ...prev, balance }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'An error occurred while fetching balance',
      }));
    }
  }, [state.isConnected]);

  // Auto-fetch balance when connected
  useEffect(() => {
    if (state.isConnected) {
      getBalance();
    }
  }, [state.isConnected, getBalance]);

  return {
    ...state,
    connect,
    disconnect,
    signMessage,
    getBalance,
  };
};
