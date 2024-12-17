import { ethers } from 'ethers';
import { BaseContract } from './base';
import DAFIMarketplaceABI from '../../../contracts/abis/DAFIMarketplace.json';

export interface ListingDetails {
  tokenId: string;
  price: ethers.BigNumber;
  assetType: 'farm' | 'crop' | 'equipment';
  duration?: number;  // Optional duration for lease listings
  isLease: boolean;
}

export interface Listing extends ListingDetails {
  id: string;
  seller: string;
  active: boolean;
  createdAt: number;
  updatedAt: number;
}

export class DAFIMarketplaceContract extends BaseContract {
  constructor(address: string, provider: ethers.providers.Web3Provider) {
    super(address, DAFIMarketplaceABI, provider);
  }

  async createListing(details: ListingDetails): Promise<string> {
    const tx = await this.executeTransaction('createListing', [
      details.tokenId,
      details.price,
      details.assetType,
      details.duration || 0,
      details.isLease,
    ]);

    if (tx.status === 'success') {
      const events = await this.getEvents('ListingCreated', {}, tx.blockNumber);
      return events[0].args.listingId.toString();
    }
    throw new Error('Failed to create listing');
  }

  async purchaseListing(listingId: string, value: ethers.BigNumber): Promise<void> {
    await this.executeTransaction('purchaseListing', [listingId], { value });
  }

  async cancelListing(listingId: string): Promise<void> {
    await this.executeTransaction('cancelListing', [listingId]);
  }

  async updateListingPrice(
    listingId: string,
    newPrice: ethers.BigNumber
  ): Promise<void> {
    await this.executeTransaction('updateListingPrice', [listingId, newPrice]);
  }

  async getListing(listingId: string): Promise<Listing> {
    const listing = await this.contract.getListing(listingId);
    return {
      id: listingId,
      seller: listing.seller,
      tokenId: listing.tokenId,
      price: listing.price,
      assetType: listing.assetType,
      duration: listing.duration.toNumber(),
      isLease: listing.isLease,
      active: listing.active,
      createdAt: listing.createdAt.toNumber(),
      updatedAt: listing.updatedAt.toNumber(),
    };
  }

  async getListingsByType(assetType: string): Promise<string[]> {
    return await this.contract.getListingsByType(assetType);
  }

  async getListingsBySeller(seller: string): Promise<string[]> {
    return await this.contract.getListingsBySeller(seller);
  }

  async isListingActive(listingId: string): Promise<boolean> {
    return await this.contract.isListingActive(listingId);
  }

  subscribeListingCreated(
    callback: (listingId: string, seller: string, details: ListingDetails) => void
  ): void {
    this.subscribeToEvent('ListingCreated', (listingId, seller, details) => {
      callback(listingId.toString(), seller, {
        tokenId: details.tokenId,
        price: details.price,
        assetType: details.assetType,
        duration: details.duration?.toNumber(),
        isLease: details.isLease,
      });
    });
  }

  subscribeListingSold(
    callback: (listingId: string, buyer: string, price: ethers.BigNumber) => void
  ): void {
    this.subscribeToEvent('ListingSold', (listingId, buyer, price) => {
      callback(listingId.toString(), buyer, price);
    });
  }

  subscribeListingCancelled(
    callback: (listingId: string) => void
  ): void {
    this.subscribeToEvent('ListingCancelled', (listingId) => {
      callback(listingId.toString());
    });
  }

  subscribeListingUpdated(
    callback: (listingId: string, newPrice: ethers.BigNumber) => void
  ): void {
    this.subscribeToEvent('ListingUpdated', (listingId, newPrice) => {
      callback(listingId.toString(), newPrice);
    });
  }
}
