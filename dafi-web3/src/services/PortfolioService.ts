import { Investment } from '../models/Investment';
import { Asset } from '../models/Asset';
import { Transaction } from '../models/Transaction';
import { TokenizationService } from './TokenizationService';

export class PortfolioService {
    private tokenizationService: TokenizationService;

    constructor(assetActor: any, investmentActor: any) {
        this.tokenizationService = new TokenizationService(assetActor, investmentActor);
    }

    async getPortfolioOverview(userId: string, role: string) {
        try {
            let portfolio;
            if (role === 'investor') {
                portfolio = await this.getInvestorPortfolio(userId);
            } else if (role === 'farmer') {
                portfolio = await this.getFarmerPortfolio(userId);
            } else {
                throw new Error('Invalid role');
            }

            return portfolio;
        } catch (error) {
            console.error('Get portfolio overview error:', error);
            throw error;
        }
    }

    async getInvestorPortfolio(investorId: string) {
        try {
            const investments = await Investment.find({ investor: investorId })
                .populate('asset')
                .sort('-createdAt');

            const metrics = await this.calculateInvestorMetrics(investments);
            const performance = await this.calculatePortfolioPerformance(investments);
            const risk = await this.calculatePortfolioRisk(investments);
            const diversification = await this.analyzeDiversification(investments);

            return {
                overview: {
                    totalInvestments: investments.length,
                    activeInvestments: investments.filter(i => i.status === 'active').length,
                    totalValue: metrics.totalValue,
                    totalReturns: metrics.totalReturns,
                    roi: metrics.roi,
                },
                performance,
                risk,
                diversification,
                investments: await Promise.all(
                    investments.map(async (inv) => ({
                        ...inv.toObject(),
                        metrics: await this.calculateInvestmentMetrics(inv._id),
                    }))
                ),
            };
        } catch (error) {
            console.error('Get investor portfolio error:', error);
            throw error;
        }
    }

    async getFarmerPortfolio(farmerId: string) {
        try {
            const assets = await Asset.find({ owner: farmerId })
                .populate('investments')
                .sort('-createdAt');

            const metrics = await this.calculateFarmerMetrics(assets);
            const performance = await this.calculateAssetPerformance(assets);
            const risk = await this.calculateAssetRisk(assets);
            const funding = await this.analyzeFundingStatus(assets);

            return {
                overview: {
                    totalAssets: assets.length,
                    activeAssets: assets.filter(a => a.status === 'active').length,
                    totalValue: metrics.totalValue,
                    totalFunding: metrics.totalFunding,
                    averageRoi: metrics.averageRoi,
                },
                performance,
                risk,
                funding,
                assets: await Promise.all(
                    assets.map(async (asset) => ({
                        ...asset.toObject(),
                        metrics: await this.calculateAssetMetrics(asset._id),
                    }))
                ),
            };
        } catch (error) {
            console.error('Get farmer portfolio error:', error);
            throw error;
        }
    }

    private async calculateInvestorMetrics(investments: any[]) {
        const totalValue = investments.reduce((sum, inv) => sum + inv.amount, 0);
        const totalReturns = investments.reduce(
            (sum, inv) => sum + (inv.returns?.actual || 0),
            0
        );

        return {
            totalValue,
            totalReturns,
            roi: (totalReturns / totalValue) * 100,
            investmentCount: investments.length,
            activeInvestments: investments.filter(i => i.status === 'active').length,
        };
    }

    private async calculateFarmerMetrics(assets: any[]) {
        const totalValue = assets.reduce(
            (sum, asset) => sum + asset.financials.currentValue,
            0
        );
        const totalFunding = assets.reduce(
            (sum, asset) =>
                sum +
                asset.investments.reduce((iSum: number, inv: any) => iSum + inv.amount, 0),
            0
        );
        const totalReturns = assets.reduce(
            (sum, asset) => sum + asset.financials.returns.actual,
            0
        );

        return {
            totalValue,
            totalFunding,
            averageRoi: (totalReturns / totalFunding) * 100,
            assetCount: assets.length,
            activeAssets: assets.filter(a => a.status === 'active').length,
        };
    }

    private async calculatePortfolioPerformance(investments: any[]) {
        const dailyReturns = await this.calculateDailyReturns(investments);
        const monthlyReturns = await this.calculateMonthlyReturns(investments);
        const yearlyReturns = await this.calculateYearlyReturns(investments);

        return {
            daily: dailyReturns,
            monthly: monthlyReturns,
            yearly: yearlyReturns,
            metrics: {
                sharpeRatio: this.calculateSharpeRatio(dailyReturns),
                sortinoRatio: this.calculateSortinoRatio(dailyReturns),
                maxDrawdown: this.calculateMaxDrawdown(dailyReturns),
            },
        };
    }

    private async calculateAssetPerformance(assets: any[]) {
        const performance = await Promise.all(
            assets.map(async (asset) => {
                const metrics = await this.calculateAssetMetrics(asset._id);
                return {
                    assetId: asset._id,
                    name: asset.name,
                    type: asset.type,
                    metrics,
                };
            })
        );

        return {
            assets: performance,
            summary: {
                bestPerforming: performance.sort(
                    (a, b) => b.metrics.roi - a.metrics.roi
                )[0],
                worstPerforming: performance.sort(
                    (a, b) => a.metrics.roi - b.metrics.roi
                )[0],
            },
        };
    }

    private async calculatePortfolioRisk(investments: any[]) {
        const riskScores = investments.map(inv => inv.risk.score);
        const riskLevels = investments.map(inv => inv.risk.level);

        return {
            averageRiskScore:
                riskScores.reduce((sum, score) => sum + score, 0) / riskScores.length,
            riskDistribution: riskLevels.reduce((dist: any, level) => {
                dist[level] = (dist[level] || 0) + 1;
                return dist;
            }, {}),
            volatility: this.calculateVolatility(investments),
            correlationMatrix: await this.calculateCorrelationMatrix(investments),
        };
    }

    private async calculateAssetRisk(assets: any[]) {
        const riskScores = assets.map(asset => asset.risk.score);
        const riskFactors = assets.reduce((factors: any, asset) => {
            asset.risk.factors.forEach((factor: string) => {
                factors[factor] = (factors[factor] || 0) + 1;
            });
            return factors;
        }, {});

        return {
            averageRiskScore:
                riskScores.reduce((sum, score) => sum + score, 0) / riskScores.length,
            riskFactors,
            volatility: this.calculateVolatility(assets),
        };
    }

    private async analyzeDiversification(investments: any[]) {
        const assetTypes = investments.reduce((types: any, inv) => {
            const type = inv.asset.type;
            types[type] = (types[type] || 0) + inv.amount;
            return types;
        }, {});

        const locations = investments.reduce((locs: any, inv) => {
            const location = inv.asset.location;
            locs[location] = (locs[location] || 0) + inv.amount;
            return locs;
        }, {});

        return {
            byAssetType: assetTypes,
            byLocation: locations,
            diversificationScore: this.calculateDiversificationScore(investments),
        };
    }

    private async analyzeFundingStatus(assets: any[]) {
        return assets.map(asset => ({
            assetId: asset._id,
            name: asset.name,
            totalShares: asset.totalShares,
            soldShares: asset.investments.reduce(
                (sum: number, inv: any) => sum + inv.shares,
                0
            ),
            fundingProgress:
                (asset.investments.reduce(
                    (sum: number, inv: any) => sum + inv.amount,
                    0
                ) /
                    asset.financials.targetFunding) *
                100,
            investors: new Set(asset.investments.map((inv: any) => inv.investor)).size,
        }));
    }

    // Helper methods for calculations
    private calculateSharpeRatio(returns: number[]): number {
        const riskFreeRate = 0.02; // 2% annual risk-free rate
        const averageReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
        const stdDev = this.calculateStandardDeviation(returns);
        return stdDev === 0 ? 0 : (averageReturn - riskFreeRate) / stdDev;
    }

    private calculateSortinoRatio(returns: number[]): number {
        const riskFreeRate = 0.02;
        const averageReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
        const negativeReturns = returns.filter(r => r < 0);
        const downsideDeviation =
            Math.sqrt(
                negativeReturns.reduce((sum, r) => sum + r * r, 0) / negativeReturns.length
            ) || 0;
        return downsideDeviation === 0 ? 0 : (averageReturn - riskFreeRate) / downsideDeviation;
    }

    private calculateMaxDrawdown(returns: number[]): number {
        let maxDrawdown = 0;
        let peak = returns[0];
        
        for (const return_ of returns) {
            if (return_ > peak) {
                peak = return_;
            }
            const drawdown = (peak - return_) / peak;
            maxDrawdown = Math.max(maxDrawdown, drawdown);
        }

        return maxDrawdown;
    }

    private calculateStandardDeviation(values: number[]): number {
        const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
        const squareDiffs = values.map(val => Math.pow(val - avg, 2));
        return Math.sqrt(
            squareDiffs.reduce((sum, diff) => sum + diff, 0) / values.length
        );
    }

    private calculateVolatility(items: any[]): number {
        const returns = items.map(item => item.returns?.actual || 0);
        return this.calculateStandardDeviation(returns);
    }

    private calculateDiversificationScore(investments: any[]): number {
        const types = new Set(investments.map(inv => inv.asset.type)).size;
        const locations = new Set(investments.map(inv => inv.asset.location)).size;
        const maxTypes = 5; // Assuming 5 different asset types
        const maxLocations = 10; // Assuming 10 different locations

        return ((types / maxTypes + locations / maxLocations) / 2) * 100;
    }

    private async calculateDailyReturns(investments: any[]) {
        // Implementation for daily returns calculation
        return [];
    }

    private async calculateMonthlyReturns(investments: any[]) {
        // Implementation for monthly returns calculation
        return [];
    }

    private async calculateYearlyReturns(investments: any[]) {
        // Implementation for yearly returns calculation
        return [];
    }

    private async calculateCorrelationMatrix(investments: any[]) {
        // Implementation for correlation matrix calculation
        return {};
    }
}
