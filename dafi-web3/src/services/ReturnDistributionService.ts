import { Principal } from '@dfinity/principal';
import { ContractService } from './ContractService';
import { ComplianceService } from './ComplianceService';

export class ReturnDistributionService {
  private contractService: ContractService;
  private complianceService: ComplianceService;

  constructor(identity: any) {
    this.contractService = new ContractService(identity);
    this.complianceService = new ComplianceService(identity);
  }

  // Process Returns Distribution
  async processDistribution(distributionData: {
    assetId: Principal;
    amount: bigint;
    period: string;
    metadata?: any;
  }) {
    try {
      // Verify compliance
      const compliance = await this.complianceService.verifyDistributionCompliance({
        assetId: distributionData.assetId,
        amount: distributionData.amount,
        period: distributionData.period,
      });

      if (!compliance.status) {
        throw new Error(`Distribution compliance failed: ${compliance.errors?.join(', ')}`);
      }

      // Calculate distribution details
      const distribution = await this.calculateDistribution(
        distributionData.assetId,
        distributionData.amount
      );

      // Process the distribution
      const result = await this.contractService.distributeReturns({
        assetId: distributionData.assetId,
        amount: distributionData.amount,
        period: distributionData.period,
      });

      // Record distribution details
      await this.recordDistribution({
        ...distributionData,
        distribution,
        result,
      });

      return {
        status: 'success',
        distributionId: result.distributionId,
        details: distribution,
      };
    } catch (error) {
      console.error('Process distribution error:', error);
      throw error;
    }
  }

  // Calculate Distribution
  private async calculateDistribution(assetId: Principal, amount: bigint) {
    try {
      // Get asset details
      const assetDetails = await this.contractService.getAssetDetails(assetId);
      const investments = await this.getAssetInvestments(assetId);

      // Calculate distribution per share
      const totalShares = assetDetails.asset.totalShares;
      const distributionPerShare = amount / totalShares;

      // Calculate individual distributions
      const distributions = investments.map(investment => ({
        investorId: investment.investor,
        shares: investment.shares,
        amount: investment.shares * distributionPerShare,
      }));

      return {
        totalAmount: amount,
        distributionPerShare,
        distributions,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Calculate distribution error:', error);
      throw error;
    }
  }

  // Get Asset Investments
  private async getAssetInvestments(assetId: Principal) {
    try {
      const assetDetails = await this.contractService.getAssetDetails(assetId);
      return assetDetails.asset.investments || [];
    } catch (error) {
      console.error('Get asset investments error:', error);
      throw error;
    }
  }

  // Record Distribution
  private async recordDistribution(data: {
    assetId: Principal;
    amount: bigint;
    period: string;
    distribution: any;
    result: any;
    metadata?: any;
  }) {
    try {
      // Record distribution details in the contract
      await this.contractService.returnActor.recordDistribution({
        assetId: data.assetId,
        amount: data.amount,
        period: data.period,
        distribution: data.distribution,
        result: data.result,
        metadata: data.metadata || {},
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Record distribution error:', error);
      throw error;
    }
  }

  // Get Distribution History
  async getDistributionHistory(assetId: Principal) {
    try {
      const history = await this.contractService.getReturnHistory(assetId);
      return history;
    } catch (error) {
      console.error('Get distribution history error:', error);
      throw error;
    }
  }

  // Get Distribution Metrics
  async getDistributionMetrics(assetId: Principal) {
    try {
      const [history, assetDetails] = await Promise.all([
        this.getDistributionHistory(assetId),
        this.contractService.getAssetDetails(assetId),
      ]);

      // Calculate metrics
      const totalDistributed = history.reduce(
        (sum, dist) => sum + dist.amount,
        BigInt(0)
      );
      const averageDistribution =
        totalDistributed / BigInt(history.length || 1);
      const distributionFrequency = this.calculateDistributionFrequency(history);

      return {
        totalDistributed,
        averageDistribution,
        distributionFrequency,
        distributionCount: history.length,
        lastDistribution: history[0] || null,
        assetMetrics: assetDetails.metrics,
      };
    } catch (error) {
      console.error('Get distribution metrics error:', error);
      throw error;
    }
  }

  // Calculate Distribution Frequency
  private calculateDistributionFrequency(history: any[]) {
    try {
      const frequencies: { [key: string]: number } = {};
      
      history.forEach(dist => {
        frequencies[dist.period] = (frequencies[dist.period] || 0) + 1;
      });

      return frequencies;
    } catch (error) {
      console.error('Calculate distribution frequency error:', error);
      throw error;
    }
  }

  // Verify Distribution Eligibility
  async verifyDistributionEligibility(assetId: Principal) {
    try {
      // Get asset details
      const assetDetails = await this.contractService.getAssetDetails(assetId);

      // Check asset status
      if (!['active', 'funded'].includes(assetDetails.asset.status)) {
        return {
          eligible: false,
          reason: 'Asset is not in active or funded status',
        };
      }

      // Check last distribution
      const history = await this.getDistributionHistory(assetId);
      if (history.length > 0) {
        const lastDistribution = history[0];
        const lastDate = new Date(lastDistribution.timestamp);
        const now = new Date();
        const daysSinceLastDistribution = Math.floor(
          (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Check if enough time has passed based on distribution period
        const requiredDays = {
          monthly: 30,
          quarterly: 90,
          annually: 365,
        }[lastDistribution.period];

        if (daysSinceLastDistribution < requiredDays) {
          return {
            eligible: false,
            reason: `Next distribution available in ${
              requiredDays - daysSinceLastDistribution
            } days`,
          };
        }
      }

      return {
        eligible: true,
        nextDistributionDate: this.calculateNextDistributionDate(history),
      };
    } catch (error) {
      console.error('Verify distribution eligibility error:', error);
      throw error;
    }
  }

  // Calculate Next Distribution Date
  private calculateNextDistributionDate(history: any[]) {
    try {
      if (history.length === 0) {
        return new Date();
      }

      const lastDistribution = history[0];
      const lastDate = new Date(lastDistribution.timestamp);
      const period = lastDistribution.period;

      switch (period) {
        case 'monthly':
          return new Date(lastDate.setMonth(lastDate.getMonth() + 1));
        case 'quarterly':
          return new Date(lastDate.setMonth(lastDate.getMonth() + 3));
        case 'annually':
          return new Date(lastDate.setFullYear(lastDate.getFullYear() + 1));
        default:
          return new Date();
      }
    } catch (error) {
      console.error('Calculate next distribution date error:', error);
      throw error;
    }
  }
}
