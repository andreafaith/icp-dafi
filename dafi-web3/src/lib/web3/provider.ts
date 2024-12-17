import { ethers } from 'ethers';
import { CHAIN_CONFIGS, SUPPORTED_CHAINS } from './config';
import { Web3ProviderState } from './types';

export class Web3Error extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'Web3Error';
  }
}

export async function connectWallet(): Promise<Web3ProviderState> {
  try {
    if (!window.ethereum) {
      throw new Web3Error('Please install MetaMask', 'NO_ETHEREUM_PROVIDER');
    }

    // Request account access
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const network = await provider.getNetwork();

    // Check if the network is supported
    if (!Object.values(SUPPORTED_CHAINS).includes(network.chainId)) {
      throw new Web3Error('Unsupported network', 'UNSUPPORTED_NETWORK');
    }

    return {
      provider: window.ethereum,
      web3Provider: provider,
      address: accounts[0],
      network: network.chainId,
      connecting: false,
      error: null,
    };
  } catch (error: any) {
    console.error('Error connecting to wallet:', error);
    throw new Web3Error(
      error.message || 'Failed to connect wallet',
      error.code || 'CONNECTION_ERROR'
    );
  }
}

export async function switchNetwork(chainId: number): Promise<void> {
  try {
    if (!window.ethereum) {
      throw new Web3Error('Please install MetaMask', 'NO_ETHEREUM_PROVIDER');
    }

    const chainConfig = CHAIN_CONFIGS[chainId as keyof typeof CHAIN_CONFIGS];
    if (!chainConfig) {
      throw new Web3Error('Unsupported network', 'UNSUPPORTED_NETWORK');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainConfig.chainId }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [chainConfig],
        });
      } else {
        throw switchError;
      }
    }
  } catch (error: any) {
    console.error('Error switching network:', error);
    throw new Web3Error(
      error.message || 'Failed to switch network',
      error.code || 'NETWORK_SWITCH_ERROR'
    );
  }
}

export async function signMessage(message: string, provider: ethers.providers.Web3Provider): Promise<string> {
  try {
    const signer = provider.getSigner();
    const signature = await signer.signMessage(message);
    return signature;
  } catch (error: any) {
    console.error('Error signing message:', error);
    throw new Web3Error(
      error.message || 'Failed to sign message',
      error.code || 'SIGNATURE_ERROR'
    );
  }
}

export function subscribeToAccountsChanged(callback: (accounts: string[]) => void): void {
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', callback);
  }
}

export function subscribeToChainChanged(callback: (chainId: string) => void): void {
  if (window.ethereum) {
    window.ethereum.on('chainChanged', callback);
  }
}

export function unsubscribeFromAccountsChanged(callback: (accounts: string[]) => void): void {
  if (window.ethereum) {
    window.ethereum.removeListener('accountsChanged', callback);
  }
}

export function unsubscribeFromChainChanged(callback: (chainId: string) => void): void {
  if (window.ethereum) {
    window.ethereum.removeListener('chainChanged', callback);
  }
}
