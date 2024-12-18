import { MetaMaskSDK } from '@metamask/sdk';

export const initializeMetaMask = () => {
  const MMSDK = new MetaMaskSDK({
    dappMetadata: {
      name: "DaFi - Decentralized Agricultural Finance",
      url: window.location.href,
    },
    infuraAPIKey: "b6ab238ee7f64b4db2db360a56b29cd4",
    chainId: process.env.NEXT_PUBLIC_CHAIN_ID || "11155111", // Sepolia testnet
  });

  return MMSDK;
};

export const connectMetaMask = async () => {
  try {
    const MMSDK = initializeMetaMask();
    const ethereum = MMSDK.getProvider();

    if (!ethereum) {
      throw new Error("MetaMask is not installed!");
    }

    // Request account access
    const accounts = await ethereum.request({ 
      method: "eth_requestAccounts" 
    });

    // Switch to Sepolia network if not already on it
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Sepolia chainId in hex
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0xaa36a7',
            chainName: 'Sepolia Test Network',
            nativeCurrency: {
              name: 'SepoliaETH',
              symbol: 'ETH',
              decimals: 18
            },
            rpcUrls: [`https://sepolia.infura.io/v3/b6ab238ee7f64b4db2db360a56b29cd4`],
            blockExplorerUrls: ['https://sepolia.etherscan.io']
          }]
        });
      }
    }

    return {
      provider: ethereum,
      accounts
    };
  } catch (error) {
    console.error("Error connecting to MetaMask:", error);
    throw error;
  }
};

export const getEthereumProvider = () => {
  const MMSDK = initializeMetaMask();
  return MMSDK.getProvider();
};
