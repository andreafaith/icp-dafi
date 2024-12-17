import { type Contract, type BigNumber } from 'ethers';

export interface Web3ProviderState {
  provider: any;
  web3Provider: any;
  address: string | null;
  network: number | null;
  connecting: boolean;
  error: Error | null;
}

export interface Asset {
  tokenId: string;
  name: string;
  description: string;
  imageUrl: string;
  attributes: Record<string, any>;
}

export interface FarmAsset extends Asset {
  assetType: 'crop' | 'land' | 'equipment';
  location: {
    latitude: number;
    longitude: number;
  };
  size: number;
  value: BigNumber;
}

export interface WeatherDerivative {
  contractId: string;
  coverageType: 'drought' | 'flood' | 'frost' | 'excess_rain';
  premium: BigNumber;
  coverageAmount: BigNumber;
  startDate: number;
  endDate: number;
  location: {
    latitude: number;
    longitude: number;
  };
  status: 'active' | 'expired' | 'triggered' | 'settled';
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: BigNumber;
  data: string;
  chainId: number;
}

export interface ContractEventListener {
  contract: Contract;
  eventName: string;
  listener: (...args: any[]) => void;
}

export type TransactionStatus = 'pending' | 'success' | 'failed';

export interface TransactionReceipt {
  status: TransactionStatus;
  hash: string;
  confirmations: number;
  from: string;
  to: string;
  gasUsed: BigNumber;
  effectiveGasPrice: BigNumber;
  blockNumber: number;
}
