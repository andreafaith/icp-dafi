import { ethers } from 'ethers';
import { BaseContract } from './base';
import { FarmAsset } from '../types';
import FarmAssetTokenABI from '../../../contracts/abis/FarmAssetToken.json';

export class FarmAssetTokenContract extends BaseContract {
  constructor(address: string, provider: ethers.providers.Web3Provider) {
    super(address, FarmAssetTokenABI, provider);
  }

  async mintAsset(
    assetData: Omit<FarmAsset, 'tokenId'>,
    recipient: string
  ): Promise<string> {
    const tx = await this.executeTransaction('mintAsset', [
      recipient,
      JSON.stringify(assetData),
    ]);
    
    if (tx.status === 'success') {
      const events = await this.getEvents('AssetMinted', {}, tx.blockNumber);
      const tokenId = events[0].args.tokenId.toString();
      return tokenId;
    }
    throw new Error('Failed to mint asset');
  }

  async getAsset(tokenId: string): Promise<FarmAsset> {
    const assetData = await this.contract.getAsset(tokenId);
    return {
      tokenId: tokenId,
      ...JSON.parse(assetData),
    };
  }

  async transferAsset(
    from: string,
    to: string,
    tokenId: string
  ): Promise<void> {
    await this.executeTransaction('transferFrom', [from, to, tokenId]);
  }

  async approveAsset(
    operator: string,
    tokenId: string
  ): Promise<void> {
    await this.executeTransaction('approve', [operator, tokenId]);
  }

  async burnAsset(tokenId: string): Promise<void> {
    await this.executeTransaction('burn', [tokenId]);
  }

  async getOwner(tokenId: string): Promise<string> {
    return await this.contract.ownerOf(tokenId);
  }

  async getBalance(owner: string): Promise<number> {
    const balance = await this.contract.balanceOf(owner);
    return balance.toNumber();
  }

  async isApprovedForAll(owner: string, operator: string): Promise<boolean> {
    return await this.contract.isApprovedForAll(owner, operator);
  }

  subscribeToTransfer(callback: (from: string, to: string, tokenId: string) => void): void {
    this.subscribeToEvent('Transfer', (from, to, tokenId) => {
      callback(from, to, tokenId.toString());
    });
  }

  unsubscribeFromTransfer(callback: (from: string, to: string, tokenId: string) => void): void {
    this.unsubscribeFromEvent('Transfer', callback);
  }
}
