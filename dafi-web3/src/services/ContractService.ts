import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { idlFactory as assetIdl } from '../declarations/asset';
import { idlFactory as investmentIdl } from '../declarations/investment';
import { idlFactory as returnIdl } from '../declarations/return';
import { _SERVICE as AssetService } from '../declarations/asset/asset.did';
import { _SERVICE as InvestmentService } from '../declarations/investment/investment.did';
import { _SERVICE as ReturnService } from '../declarations/return/return.did';

export class ContractService {
  private assetActor: (Actor & AssetService) | null = null;
  private investmentActor: (Actor & InvestmentService) | null = null;
  private returnActor: (Actor & ReturnService) | null = null;

  constructor(identity: any) {
    const agent = new HttpAgent({ 
      identity,
      host: process.env.NEXT_PUBLIC_IC_HOST,
    });

    // Initialize actors
    this.assetActor = Actor.createActor<AssetService>(assetIdl, {
      agent,
      canisterId: process.env.NEXT_PUBLIC_ASSET_CANISTER_ID!,
    });

    this.investmentActor = Actor.createActor<InvestmentService>(investmentIdl, {
      agent,
      canisterId: process.env.NEXT_PUBLIC_INVESTMENT_CANISTER_ID!,
    });

    this.returnActor = Actor.createActor<ReturnService>(returnIdl, {
      agent,
      canisterId: process.env.NEXT_PUBLIC_RETURN_CANISTER_ID!,
    });
  }

  async tokenizeAsset(assetData: {
    owner: Principal;
    metadata: {
      name: string;
      description: string;
      location: string;
      type: string;
    };
    totalShares: bigint;
    pricePerShare: bigint;
  }) {
    if (!this.assetActor) {
      throw new Error('Asset actor not initialized');
    }

    return await this.assetActor.tokenizeAsset(assetData);
  }

  async invest(assetId: string, amount: bigint) {
    if (!this.investmentActor) {
      throw new Error('Investment actor not initialized');
    }

    return await this.investmentActor.invest(assetId, amount);
  }

  async getAssetDetails(assetId: string) {
    if (!this.assetActor) {
      throw new Error('Asset actor not initialized');
    }

    return await this.assetActor.getAssetDetails(assetId);
  }

  async createReturn(returnData: {
    assetId: string;
    amount: bigint;
    distributionDate: bigint;
  }) {
    if (!this.returnActor) {
      throw new Error('Return actor not initialized');
    }

    return await this.returnActor.createReturn(returnData);
  }

  async getInvestmentsByAsset(assetId: string) {
    if (!this.investmentActor) {
      throw new Error('Investment actor not initialized');
    }

    return await this.investmentActor.getInvestmentsByAsset(assetId);
  }

  async getReturnsByAsset(assetId: string) {
    if (!this.returnActor) {
      throw new Error('Return actor not initialized');
    }

    return await this.returnActor.getReturnsByAsset(assetId);
  }
}
