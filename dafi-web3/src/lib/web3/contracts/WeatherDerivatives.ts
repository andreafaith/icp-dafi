import { ethers } from 'ethers';
import { BaseContract } from './base';
import { WeatherDerivative } from '../types';
import WeatherDerivativesABI from '../../../contracts/abis/WeatherDerivatives.json';

export class WeatherDerivativesContract extends BaseContract {
  constructor(address: string, provider: ethers.providers.Web3Provider) {
    super(address, WeatherDerivativesABI, provider);
  }

  async createContract(
    coverageType: WeatherDerivative['coverageType'],
    premium: ethers.BigNumber,
    coverageAmount: ethers.BigNumber,
    startDate: number,
    endDate: number,
    location: WeatherDerivative['location']
  ): Promise<string> {
    const tx = await this.executeTransaction(
      'createContract',
      [coverageType, premium, coverageAmount, startDate, endDate, location],
      { value: premium }
    );

    if (tx.status === 'success') {
      const events = await this.getEvents('ContractCreated', {}, tx.blockNumber);
      return events[0].args.contractId.toString();
    }
    throw new Error('Failed to create weather derivative contract');
  }

  async getContract(contractId: string): Promise<WeatherDerivative> {
    const contract = await this.contract.getContract(contractId);
    return {
      contractId,
      coverageType: contract.coverageType,
      premium: contract.premium,
      coverageAmount: contract.coverageAmount,
      startDate: contract.startDate.toNumber(),
      endDate: contract.endDate.toNumber(),
      location: contract.location,
      status: contract.status,
    };
  }

  async triggerContract(contractId: string, weatherData: any): Promise<void> {
    await this.executeTransaction('triggerContract', [contractId, weatherData]);
  }

  async claimPayout(contractId: string): Promise<void> {
    await this.executeTransaction('claimPayout', [contractId]);
  }

  async getContractsByOwner(owner: string): Promise<string[]> {
    return await this.contract.getContractsByOwner(owner);
  }

  async isContractActive(contractId: string): Promise<boolean> {
    return await this.contract.isContractActive(contractId);
  }

  async calculatePremium(
    coverageType: WeatherDerivative['coverageType'],
    coverageAmount: ethers.BigNumber,
    duration: number,
    location: WeatherDerivative['location']
  ): Promise<ethers.BigNumber> {
    return await this.contract.calculatePremium(
      coverageType,
      coverageAmount,
      duration,
      location
    );
  }

  subscribeToContractCreated(
    callback: (contractId: string, owner: string) => void
  ): void {
    this.subscribeToEvent('ContractCreated', (contractId, owner) => {
      callback(contractId.toString(), owner);
    });
  }

  subscribeToContractTriggered(
    callback: (contractId: string, weatherData: any) => void
  ): void {
    this.subscribeToEvent('ContractTriggered', (contractId, weatherData) => {
      callback(contractId.toString(), weatherData);
    });
  }

  subscribeToPayoutClaimed(
    callback: (contractId: string, amount: ethers.BigNumber) => void
  ): void {
    this.subscribeToEvent('PayoutClaimed', (contractId, amount) => {
      callback(contractId.toString(), amount);
    });
  }

  unsubscribeFromContractCreated(callback: Function): void {
    this.unsubscribeFromEvent('ContractCreated', callback);
  }

  unsubscribeFromContractTriggered(callback: Function): void {
    this.unsubscribeFromEvent('ContractTriggered', callback);
  }

  unsubscribeFromPayoutClaimed(callback: Function): void {
    this.unsubscribeFromEvent('PayoutClaimed', callback);
  }
}
