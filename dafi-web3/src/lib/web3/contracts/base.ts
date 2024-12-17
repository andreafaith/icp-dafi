import { ethers, Contract, ContractInterface } from 'ethers';
import { Web3Error } from '../provider';
import { TransactionReceipt } from '../types';

export abstract class BaseContract {
  protected contract: Contract;
  protected provider: ethers.providers.Web3Provider;

  constructor(
    address: string,
    abi: ContractInterface,
    provider: ethers.providers.Web3Provider
  ) {
    this.provider = provider;
    this.contract = new Contract(address, abi, provider.getSigner());
  }

  protected async executeTransaction(
    method: string,
    args: any[],
    options: { value?: string; gasLimit?: number } = {}
  ): Promise<TransactionReceipt> {
    try {
      const tx = await this.contract[method](...args, options);
      const receipt = await tx.wait();

      return {
        status: receipt.status === 1 ? 'success' : 'failed',
        hash: receipt.transactionHash,
        confirmations: receipt.confirmations,
        from: receipt.from,
        to: receipt.to,
        gasUsed: receipt.gasUsed,
        effectiveGasPrice: receipt.effectiveGasPrice,
        blockNumber: receipt.blockNumber,
      };
    } catch (error: any) {
      console.error(`Error executing transaction ${method}:`, error);
      throw new Web3Error(
        error.message || `Failed to execute ${method}`,
        error.code || 'TRANSACTION_ERROR'
      );
    }
  }

  protected async estimateGas(
    method: string,
    args: any[],
    options: { value?: string } = {}
  ): Promise<ethers.BigNumber> {
    try {
      return await this.contract.estimateGas[method](...args, options);
    } catch (error: any) {
      console.error(`Error estimating gas for ${method}:`, error);
      throw new Web3Error(
        error.message || `Failed to estimate gas for ${method}`,
        error.code || 'GAS_ESTIMATION_ERROR'
      );
    }
  }

  protected subscribeToEvent(
    eventName: string,
    callback: (...args: any[]) => void
  ): void {
    this.contract.on(eventName, callback);
  }

  protected unsubscribeFromEvent(
    eventName: string,
    callback: (...args: any[]) => void
  ): void {
    this.contract.off(eventName, callback);
  }

  protected async getEvents(
    eventName: string,
    filter: any = {},
    fromBlock: number | string = 0,
    toBlock: number | string = 'latest'
  ): Promise<any[]> {
    try {
      const events = await this.contract.queryFilter(
        this.contract.filters[eventName](...Object.values(filter)),
        fromBlock,
        toBlock
      );
      return events;
    } catch (error: any) {
      console.error(`Error fetching events for ${eventName}:`, error);
      throw new Web3Error(
        error.message || `Failed to fetch events for ${eventName}`,
        error.code || 'EVENT_FETCH_ERROR'
      );
    }
  }
}
