import { useMemo } from 'react';
import { ethers } from 'ethers';
import { FarmAssetTokenContract } from '../contracts/FarmAssetToken';
import { WeatherDerivativesContract } from '../contracts/WeatherDerivatives';
import { CONTRACT_ADDRESSES, SUPPORTED_CHAINS } from '../config';

export function useContract(
  contractName: keyof typeof CONTRACT_ADDRESSES[typeof SUPPORTED_CHAINS.POLYGON],
  provider?: ethers.providers.Web3Provider
) {
  return useMemo(() => {
    if (!provider) return null;

    const address = CONTRACT_ADDRESSES[SUPPORTED_CHAINS.POLYGON][contractName];
    if (!address) return null;

    switch (contractName) {
      case 'FARM_ASSET_TOKEN':
        return new FarmAssetTokenContract(address, provider);
      case 'WEATHER_DERIVATIVES':
        return new WeatherDerivativesContract(address, provider);
      default:
        return null;
    }
  }, [contractName, provider]);
}
