export const SUPPORTED_CHAINS = {
  ETHEREUM: 1,
  POLYGON: 137,
  POLYGON_MUMBAI: 80001,
} as const;

export const CHAIN_CONFIGS = {
  [SUPPORTED_CHAINS.ETHEREUM]: {
    chainId: `0x${SUPPORTED_CHAINS.ETHEREUM.toString(16)}`,
    chainName: 'Ethereum Mainnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: [process.env.NEXT_PUBLIC_ETH_RPC_URL],
    blockExplorerUrls: ['https://etherscan.io'],
  },
  [SUPPORTED_CHAINS.POLYGON]: {
    chainId: `0x${SUPPORTED_CHAINS.POLYGON.toString(16)}`,
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: [process.env.NEXT_PUBLIC_POLYGON_RPC_URL],
    blockExplorerUrls: ['https://polygonscan.com'],
  },
  [SUPPORTED_CHAINS.POLYGON_MUMBAI]: {
    chainId: `0x${SUPPORTED_CHAINS.POLYGON_MUMBAI.toString(16)}`,
    chainName: 'Polygon Mumbai Testnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: [process.env.NEXT_PUBLIC_MUMBAI_RPC_URL],
    blockExplorerUrls: ['https://mumbai.polygonscan.com'],
  },
} as const;

export const CONTRACT_ADDRESSES = {
  [SUPPORTED_CHAINS.POLYGON]: {
    DAFI_TOKEN: process.env.NEXT_PUBLIC_DAFI_TOKEN_ADDRESS,
    FARM_ASSET_TOKEN: process.env.NEXT_PUBLIC_FARM_ASSET_TOKEN_ADDRESS,
    DAFI_GOVERNANCE: process.env.NEXT_PUBLIC_DAFI_GOVERNANCE_ADDRESS,
    DAFI_LENDING: process.env.NEXT_PUBLIC_DAFI_LENDING_ADDRESS,
    DAFI_VAULT: process.env.NEXT_PUBLIC_DAFI_VAULT_ADDRESS,
    WEATHER_DERIVATIVES: process.env.NEXT_PUBLIC_WEATHER_DERIVATIVES_ADDRESS,
    DAFI_MARKETPLACE: process.env.NEXT_PUBLIC_DAFI_MARKETPLACE_ADDRESS,
  },
} as const;
