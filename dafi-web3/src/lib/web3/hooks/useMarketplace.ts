import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useContract } from './useContract';
import { useWeb3Provider } from './useWeb3Provider';
import { ListingDetails, Listing } from '../contracts/DAFIMarketplace';
import { useNotifications } from './useNotifications';

export function useMarketplace() {
  const { provider, address } = useWeb3Provider();
  const marketplaceContract = useContract('DAFI_MARKETPLACE', provider);
  const { notifySuccess, notifyError } = useNotifications();
  const [loading, setLoading] = useState(false);

  const createListing = useCallback(
    async (details: ListingDetails) => {
      if (!marketplaceContract || !address) return;

      setLoading(true);
      try {
        const listingId = await marketplaceContract.createListing(details);
        notifySuccess('Listing created successfully');
        return listingId;
      } catch (error: any) {
        notifyError('Failed to create listing: ' + error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [marketplaceContract, address, notifySuccess, notifyError]
  );

  const purchaseListing = useCallback(
    async (listingId: string, value: ethers.BigNumber) => {
      if (!marketplaceContract || !address) return;

      setLoading(true);
      try {
        await marketplaceContract.purchaseListing(listingId, value);
        notifySuccess('Purchase successful');
      } catch (error: any) {
        notifyError('Failed to purchase listing: ' + error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [marketplaceContract, address, notifySuccess, notifyError]
  );

  const cancelListing = useCallback(
    async (listingId: string) => {
      if (!marketplaceContract || !address) return;

      setLoading(true);
      try {
        await marketplaceContract.cancelListing(listingId);
        notifySuccess('Listing cancelled successfully');
      } catch (error: any) {
        notifyError('Failed to cancel listing: ' + error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [marketplaceContract, address, notifySuccess, notifyError]
  );

  const fetchListing = useCallback(
    async (listingId: string): Promise<Listing | null> => {
      if (!marketplaceContract) return null;

      try {
        return await marketplaceContract.getListing(listingId);
      } catch (error: any) {
        notifyError('Failed to fetch listing: ' + error.message);
        return null;
      }
    },
    [marketplaceContract, notifyError]
  );

  const fetchListingsByType = useCallback(
    async (assetType: string): Promise<Listing[]> => {
      if (!marketplaceContract) return [];

      try {
        const listingIds = await marketplaceContract.getListingsByType(assetType);
        const listings = await Promise.all(
          listingIds.map(id => marketplaceContract.getListing(id))
        );
        return listings;
      } catch (error: any) {
        notifyError('Failed to fetch listings: ' + error.message);
        return [];
      }
    },
    [marketplaceContract, notifyError]
  );

  const fetchUserListings = useCallback(
    async (): Promise<Listing[]> => {
      if (!marketplaceContract || !address) return [];

      try {
        const listingIds = await marketplaceContract.getListingsBySeller(address);
        const listings = await Promise.all(
          listingIds.map(id => marketplaceContract.getListing(id))
        );
        return listings;
      } catch (error: any) {
        notifyError('Failed to fetch user listings: ' + error.message);
        return [];
      }
    },
    [marketplaceContract, address, notifyError]
  );

  return {
    createListing,
    purchaseListing,
    cancelListing,
    fetchListing,
    fetchListingsByType,
    fetchUserListings,
    loading,
  };
}
