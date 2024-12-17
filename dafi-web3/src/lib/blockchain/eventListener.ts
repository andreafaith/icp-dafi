import { ethers } from 'ethers';
import Redis from 'ioredis';
import { AssetModel } from '../../models/Asset';
import { TransactionModel } from '../../models/Transaction';
import FarmAssetTokenABI from '../../contracts/abis/FarmAssetToken.json';
import WeatherDerivativesABI from '../../contracts/abis/WeatherDerivatives.json';
import DAFILendingABI from '../../contracts/abis/DAFILending.json';

const redis = new Redis(process.env.REDIS_URL!);

export class BlockchainEventListener {
  private provider: ethers.providers.JsonRpcProvider;
  private contracts: {
    farmAssetToken: ethers.Contract;
    weatherDerivatives: ethers.Contract;
    dafiLending: ethers.Contract;
  };

  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_ETH_RPC_URL
    );

    this.contracts = {
      farmAssetToken: new ethers.Contract(
        process.env.NEXT_PUBLIC_FARM_ASSET_TOKEN_ADDRESS!,
        FarmAssetTokenABI,
        this.provider
      ),
      weatherDerivatives: new ethers.Contract(
        process.env.NEXT_PUBLIC_WEATHER_DERIVATIVES_ADDRESS!,
        WeatherDerivativesABI,
        this.provider
      ),
      dafiLending: new ethers.Contract(
        process.env.NEXT_PUBLIC_DAFI_LENDING_ADDRESS!,
        DAFILendingABI,
        this.provider
      ),
    };
  }

  async start() {
    // Listen for asset transfers
    this.contracts.farmAssetToken.on(
      'Transfer',
      async (from: string, to: string, tokenId: ethers.BigNumber, event: any) => {
        try {
          await this.handleAssetTransfer(from, to, tokenId, event);
        } catch (error) {
          console.error('Error handling asset transfer:', error);
        }
      }
    );

    // Listen for weather contract triggers
    this.contracts.weatherDerivatives.on(
      'ContractTriggered',
      async (contractId: string, weather: any, payout: ethers.BigNumber, event: any) => {
        try {
          await this.handleWeatherTrigger(contractId, weather, payout, event);
        } catch (error) {
          console.error('Error handling weather trigger:', error);
        }
      }
    );

    // Listen for loan events
    this.contracts.dafiLending.on(
      'LoanRequested',
      async (loanId: string, borrower: string, amount: ethers.BigNumber, event: any) => {
        try {
          await this.handleLoanRequest(loanId, borrower, amount, event);
        } catch (error) {
          console.error('Error handling loan request:', error);
        }
      }
    );
  }

  private async handleAssetTransfer(
    from: string,
    to: string,
    tokenId: ethers.BigNumber,
    event: any
  ) {
    // Record the transaction
    const transaction = await TransactionModel.create({
      type: 'asset_transfer',
      hash: event.transactionHash,
      from,
      to,
      tokenId: tokenId.toString(),
      blockNumber: event.blockNumber,
      timestamp: new Date(),
    });

    // Update asset ownership
    await AssetModel.findOneAndUpdate(
      { tokenId: tokenId.toString() },
      { owner: to, lastTransferredAt: new Date() }
    );

    // Cache the transaction
    await redis.setex(
      `transaction:${event.transactionHash}`,
      3600, // 1 hour
      JSON.stringify(transaction)
    );

    // Invalidate related caches
    await redis.del(`asset:${tokenId.toString()}`);
    await redis.del(`user:${from}:assets`);
    await redis.del(`user:${to}:assets`);
  }

  private async handleWeatherTrigger(
    contractId: string,
    weather: any,
    payout: ethers.BigNumber,
    event: any
  ) {
    const transaction = await TransactionModel.create({
      type: 'weather_trigger',
      hash: event.transactionHash,
      contractId,
      weather,
      payout: payout.toString(),
      blockNumber: event.blockNumber,
      timestamp: new Date(),
    });

    // Cache the transaction
    await redis.setex(
      `transaction:${event.transactionHash}`,
      3600,
      JSON.stringify(transaction)
    );

    // Invalidate related caches
    await redis.del(`contract:${contractId}`);
  }

  private async handleLoanRequest(
    loanId: string,
    borrower: string,
    amount: ethers.BigNumber,
    event: any
  ) {
    const transaction = await TransactionModel.create({
      type: 'loan_request',
      hash: event.transactionHash,
      loanId,
      borrower,
      amount: amount.toString(),
      blockNumber: event.blockNumber,
      timestamp: new Date(),
    });

    // Cache the transaction
    await redis.setex(
      `transaction:${event.transactionHash}`,
      3600,
      JSON.stringify(transaction)
    );

    // Invalidate related caches
    await redis.del(`loan:${loanId}`);
    await redis.del(`user:${borrower}:loans`);
  }

  async stop() {
    this.contracts.farmAssetToken.removeAllListeners();
    this.contracts.weatherDerivatives.removeAllListeners();
    this.contracts.dafiLending.removeAllListeners();
  }
}
