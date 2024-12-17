import { useEffect, useState, useCallback } from 'react';
import { Web3ProviderState } from '../types';
import { connectWallet, subscribeToAccountsChanged, subscribeToChainChanged, unsubscribeFromAccountsChanged, unsubscribeFromChainChanged } from '../provider';

const initialState: Web3ProviderState = {
  provider: null,
  web3Provider: null,
  address: null,
  network: null,
  connecting: false,
  error: null,
};

export function useWeb3Provider() {
  const [state, setState] = useState<Web3ProviderState>(initialState);

  const connect = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, connecting: true }));
      const web3State = await connectWallet();
      setState({ ...web3State, connecting: false });
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error,
        connecting: false,
      }));
    }
  }, []);

  const disconnect = useCallback(() => {
    setState(initialState);
  }, []);

  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        disconnect();
      } else {
        setState(prev => ({
          ...prev,
          address: accounts[0],
        }));
      }
    };

    const handleChainChanged = (chainId: string) => {
      const networkId = parseInt(chainId, 16);
      setState(prev => ({
        ...prev,
        network: networkId,
      }));
    };

    if (state.provider) {
      subscribeToAccountsChanged(handleAccountsChanged);
      subscribeToChainChanged(handleChainChanged);
    }

    return () => {
      if (state.provider) {
        unsubscribeFromAccountsChanged(handleAccountsChanged);
        unsubscribeFromChainChanged(handleChainChanged);
      }
    };
  }, [state.provider, disconnect]);

  return {
    ...state,
    connect,
    disconnect,
  };
}
