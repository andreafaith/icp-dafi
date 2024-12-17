import { Principal } from '@dfinity/principal';

export interface Asset {
  id: string;
  owner: Principal;
  name: string;
  description: string;
  assetType: string;
  value: bigint;
  timestamp: bigint;
}

export interface Investment {
  id: string;
  investor: Principal;
  assetId: string;
  amount: bigint;
  timestamp: bigint;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
}

export interface User {
  principal: Principal;
  type: 'farmer' | 'investor';
  assets?: Asset[];
  investments?: Investment[];
}

export interface AuthState {
  isAuthenticated: boolean;
  principal: Principal | null;
  userType: 'farmer' | 'investor' | null;
  isLoading: boolean;
  error: string | null;
}

export interface AssetState {
  assets: Asset[];
  selectedAsset: Asset | null;
  isLoading: boolean;
  error: string | null;
}

export interface InvestmentState {
  investments: Investment[];
  selectedInvestment: Investment | null;
  isLoading: boolean;
  error: string | null;
}
