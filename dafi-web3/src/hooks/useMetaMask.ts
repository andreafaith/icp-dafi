import { useState, useEffect, useCallback } from 'react';
import { connectMetaMask, getEthereumProvider } from '../config/metamask';

export const useMetaMask = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = useCallback(async () => {
    try {
      setIsConnecting(true);
      setError(null);
      const { accounts } = await connectMetaMask();
      setAccount(accounts[0]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  useEffect(() => {
    const provider = getEthereumProvider();
    
    if (provider) {
      // Handle account changes
      provider.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0] || null);
      });

      // Handle chain changes
      provider.on('chainChanged', () => {
        window.location.reload();
      });

      // Check if already connected
      provider.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        })
        .catch(console.error);
    }

    return () => {
      if (provider) {
        provider.removeListener('accountsChanged', () => {});
        provider.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  return {
    connect,
    account,
    error,
    isConnecting
  };
};
