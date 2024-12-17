import { User } from '../models/User';
import { Asset } from '../models/Asset';
import { Investment } from '../models/Investment';
import { Transaction } from '../models/Transaction';
import { TransactionService } from './TransactionService';
import { SecurityMonitor } from './SecurityMonitor';

export class InvestorService {
    private transactionService: TransactionService;
    private securityMonitor: SecurityMonitor;

    constructor(assetActor: any, investmentActor: any) {
        this.transactionService = new TransactionService(assetActor, investmentActor);
        this.securityMonitor = new SecurityMonitor();
    }

    async onboardInvestor(investorData: any) {
        try {
            // Validate investor data
            if (!investorData.name || !investorData.email || !investorData.walletAddress) {
                throw new Error('Missing required fields');
            }

            // Create investor profile
            const investor = await User.create({
                ...investorData,
                role: 'investor',
                status: 'pending',
                profile: {
                    ...investorData.profile,
                    verificationStatus: 'pending',
                    documents: [],
                },
                investment: {
                    preferences: investorData.preferences || {},
                    riskProfile: investorData.riskProfile || 'moderate',
                    investmentGoals: investorData.investmentGoals || [],
                },
                financials: {
                    bankDetails: investorData.bankDetails,
                    taxInfo: investorData.taxInfo,
                },
            });

            // Monitor registration
            await this.securityMonitor.monitorUserActivity(investor._id, {
                type: 'registration',
                role: 'investor',
                timestamp: new Date(),
            });

            return investor;
        } catch (error) {
            console.error('Investor onboarding error:', error);
            throw error;
        }
    }

    async getPortfolio(investorId: string) {
        try {
            const investments = await Investment.find({ investor: investorId })
                .populate('asset')
                .sort('-createdAt');

            // Calculate portfolio metrics
            const metrics = await this.calculatePortfolioMetrics(investorId);

            // Get investment performance
            const investmentsWithPerformance = await Promise.all(
                investments.map(async (investment) => {
                    const performance = await this.calculateInvestmentPerformance(
                        investment._id
                    );
                    return {
                        ...investment.toObject(),
                        performance,
                    };
                })
            );

            return {
                investments: investmentsWithPerformance,
                metrics,
            };
        } catch (error) {
            console.error('Get portfolio error:', error);
            throw error;
        }
    }

    async makeInvestment(investorId: string, investmentData: any) {
        try {
            // Validate investment data
            if (!investmentData.asset || !investmentData.amount || !investmentData.shares) {
                throw new Error('Missing required fields');
            }

            // Check if asset is available for investment
            const asset = await Asset.findById(investmentData.asset);
            if (!asset || asset.status !== 'active') {
                throw new Error('Asset not available for investment');
            }

            // Create investment transaction
            const result = await this.transactionService.createInvestment(
                investorId,
                investmentData.asset,
                investmentData.amount,
                investmentData.shares
            );

            // Monitor transaction
            await this.securityMonitor.monitorTransactions(result.transaction);

            return result;
        } catch (error) {
            console.error('Make investment error:', error);
            throw error;
        }
    }

    async calculatePortfolioMetrics(investorId: string) {
        try {
            const investments = await Investment.find({ investor: investorId })
                .populate('asset');

            const totalInvestment = investments.reduce((sum, inv) => sum + inv.amount, 0);
            const totalReturns = investments.reduce(
                (sum, inv) => sum + (inv.returns?.actual || 0),
                0
            );

            // Calculate asset type distribution
            const assetDistribution = investments.reduce((dist: any, inv) => {
                const type = inv.asset.type;
                dist[type] = (dist[type] || 0) + inv.amount;
                return dist;
            }, {});

            // Calculate risk metrics
            const riskMetrics = {
                averageRiskScore: investments.reduce(
                    (sum, inv) => sum + inv.risk.score,
                    0
                ) / investments.length,
                riskDistribution: investments.reduce((dist: any, inv) => {
                    const risk = inv.risk.level;
                    dist[risk] = (dist[risk] || 0) + inv.amount;
                    return dist;
                }, {}),
            };

            return {
                totalInvestment,
                totalReturns,
                roi: (totalReturns / totalInvestment) * 100,
                assetCount: investments.length,
                assetDistribution,
                riskMetrics,
                performance: {
                    daily: await this.calculateDailyReturns(investments),
                    monthly: await this.calculateMonthlyReturns(investments),
                    yearly: await this.calculateYearlyReturns(investments),
                },
            };
        } catch (error) {
            console.error('Calculate portfolio metrics error:', error);
            throw error;
        }
    }

    async calculateInvestmentPerformance(investmentId: string) {
        try {
            const investment = await Investment.findById(investmentId)
                .populate('asset');

            const transactions = await Transaction.find({
                investment: investmentId,
            }).sort('timestamp');

            // Calculate holding period
            const holdingPeriod = Math.floor(
                (Date.now() - investment.createdAt.getTime()) / (1000 * 60 * 60 * 24)
            );

            // Calculate returns
            const returns = {
                absolute: investment.returns.actual,
                percentage: (investment.returns.actual / investment.amount) * 100,
                annualized:
                    ((1 + investment.returns.actual / investment.amount) ** (365 / holdingPeriod) - 1) *
                    100,
            };

            return {
                returns,
                holdingPeriod,
                transactions: transactions.map(tx => ({
                    type: tx.type,
                    amount: tx.amount,
                    timestamp: tx.timestamp,
                    status: tx.status,
                })),
            };
        } catch (error) {
            console.error('Calculate investment performance error:', error);
            throw error;
        }
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

    async getDashboardStats(investorId: string) {
        try {
            const [investments, transactions] = await Promise.all([
                Investment.find({ investor: investorId }),
                Transaction.find({
                    $or: [{ from: investorId }, { to: investorId }],
                }).sort('-timestamp').limit(10),
            ]);

            const stats = {
                totalInvestments: investments.length,
                activeInvestments: investments.filter(i => i.status === 'active').length,
                totalInvested: investments.reduce((sum, inv) => sum + inv.amount, 0),
                totalReturns: investments.reduce(
                    (sum, inv) => sum + (inv.returns?.actual || 0),
                    0
                ),
                recentTransactions: transactions,
                portfolioMetrics: await this.calculatePortfolioMetrics(investorId),
            };

            return stats;
        } catch (error) {
            console.error('Get dashboard stats error:', error);
            throw error;
        }
    }
}
