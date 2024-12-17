import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../lib/db/mongodb';
import { authMiddleware, roleGuard } from '../../../middleware/auth';
import { Asset } from '../../../models/Asset';
import { Investment } from '../../../models/Investment';
import { Transaction } from '../../../models/Transaction';
import { rateLimit } from '../../../middleware/rateLimit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await connectDB();
        await rateLimit(req, res);
        await authMiddleware(req, res, () => {});

        switch (req.method) {
            case 'GET':
                return await getPerformanceAnalytics(req, res);
            default:
                return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Performance analytics API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function getPerformanceAnalytics(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { timeframe = '30d', assetType, location } = req.query;
        const startDate = getStartDate(timeframe as string);

        // Build match conditions
        const matchConditions: any = {
            createdAt: { $gte: startDate },
        };

        if (assetType) matchConditions.type = assetType;
        if (location) matchConditions.location = location;

        // Get performance metrics
        const [
            assetPerformance,
            returnDistribution,
            riskAnalysis,
            volatilityMetrics,
            correlationMatrix,
            performanceTimeSeries,
        ] = await Promise.all([
            // Asset performance metrics
            Asset.aggregate([
                { $match: matchConditions },
                {
                    $lookup: {
                        from: 'investments',
                        localField: '_id',
                        foreignField: 'asset',
                        as: 'investments',
                    },
                },
                {
                    $project: {
                        name: 1,
                        type: 1,
                        location: 1,
                        totalInvestment: { $sum: '$investments.amount' },
                        totalReturns: { $sum: '$investments.returns.actual' },
                        averageReturn: { $avg: '$investments.returns.actual' },
                        riskScore: { $avg: '$investments.risk.score' },
                        performance: {
                            $divide: [
                                { $sum: '$investments.returns.actual' },
                                { $sum: '$investments.amount' },
                            ],
                        },
                    },
                },
                { $sort: { performance: -1 } },
            ]),

            // Return distribution analysis
            Investment.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startDate },
                        'returns.actual': { $exists: true },
                    },
                },
                {
                    $bucket: {
                        groupBy: '$returns.actual',
                        boundaries: [-100, -50, -20, 0, 20, 50, 100],
                        default: 'Above 100%',
                        output: {
                            count: { $sum: 1 },
                            totalAmount: { $sum: '$amount' },
                        },
                    },
                },
            ]),

            // Risk analysis
            Investment.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startDate },
                        'risk.score': { $exists: true },
                    },
                },
                {
                    $group: {
                        _id: '$risk.level',
                        averageReturn: { $avg: '$returns.actual' },
                        totalInvestments: { $sum: 1 },
                        totalAmount: { $sum: '$amount' },
                        volatility: { $stdDevPop: '$returns.actual' },
                    },
                },
            ]),

            // Volatility metrics
            Asset.aggregate([
                { $match: matchConditions },
                {
                    $lookup: {
                        from: 'investments',
                        localField: '_id',
                        foreignField: 'asset',
                        as: 'investments',
                    },
                },
                {
                    $project: {
                        name: 1,
                        type: 1,
                        volatility: { $stdDevPop: '$investments.returns.actual' },
                        maxDrawdown: {
                            $min: {
                                $map: {
                                    input: '$investments.returns.actual',
                                    as: 'return',
                                    in: {
                                        $subtract: ['$$return', { $avg: '$investments.returns.actual' }],
                                    },
                                },
                            },
                        },
                    },
                },
            ]),

            // Correlation matrix
            Asset.aggregate([
                { $match: matchConditions },
                {
                    $lookup: {
                        from: 'investments',
                        localField: '_id',
                        foreignField: 'asset',
                        as: 'investments',
                    },
                },
                {
                    $project: {
                        name: 1,
                        returns: '$investments.returns.actual',
                    },
                },
            ]),

            // Performance time series
            Investment.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startDate },
                        'returns.actual': { $exists: true },
                    },
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: '%Y-%m-%d',
                                date: '$createdAt',
                            },
                        },
                        averageReturn: { $avg: '$returns.actual' },
                        volatility: { $stdDevPop: '$returns.actual' },
                        sharpeRatio: {
                            $divide: [
                                { $avg: '$returns.actual' },
                                { $stdDevPop: '$returns.actual' },
                            ],
                        },
                    },
                },
                { $sort: { '_id': 1 } },
            ]),
        ]);

        // Calculate correlation matrix
        const correlations = calculateCorrelationMatrix(correlationMatrix);

        // Calculate performance metrics
        const metrics = calculatePerformanceMetrics(performanceTimeSeries);

        // Format response
        const analytics = {
            overview: {
                totalAssets: assetPerformance.length,
                averageReturn: calculateAverage(assetPerformance, 'averageReturn'),
                averageRisk: calculateAverage(assetPerformance, 'riskScore'),
                totalInvestment: assetPerformance.reduce((sum, asset) => sum + asset.totalInvestment, 0),
            },
            topPerformers: assetPerformance.slice(0, 10),
            distribution: {
                returns: returnDistribution,
                risk: riskAnalysis,
            },
            riskMetrics: {
                volatility: volatilityMetrics,
                correlations,
            },
            performance: {
                timeSeries: performanceTimeSeries,
                metrics,
            },
            timeframe,
        };

        return res.status(200).json(analytics);
    } catch (error) {
        console.error('Get performance analytics error:', error);
        return res.status(500).json({ error: 'Failed to fetch performance analytics' });
    }
}

function getStartDate(timeframe: string): Date {
    const now = new Date();
    switch (timeframe) {
        case '24h':
            return new Date(now.setHours(now.getHours() - 24));
        case '7d':
            return new Date(now.setDate(now.getDate() - 7));
        case '30d':
            return new Date(now.setDate(now.getDate() - 30));
        case '90d':
            return new Date(now.setDate(now.getDate() - 90));
        case '1y':
            return new Date(now.setFullYear(now.getFullYear() - 1));
        default:
            return new Date(now.setDate(now.getDate() - 30));
    }
}

function calculateCorrelationMatrix(assets: any[]) {
    const correlations: any = {};
    
    assets.forEach((asset1) => {
        correlations[asset1.name] = {};
        assets.forEach((asset2) => {
            correlations[asset1.name][asset2.name] = calculateCorrelation(
                asset1.returns,
                asset2.returns
            );
        });
    });

    return correlations;
}

function calculateCorrelation(returns1: number[], returns2: number[]): number {
    if (!returns1 || !returns2 || returns1.length !== returns2.length) return 0;

    const n = returns1.length;
    const mean1 = returns1.reduce((a, b) => a + b, 0) / n;
    const mean2 = returns2.reduce((a, b) => a + b, 0) / n;

    const variance1 = returns1.reduce((a, b) => a + Math.pow(b - mean1, 2), 0) / n;
    const variance2 = returns2.reduce((a, b) => a + Math.pow(b - mean2, 2), 0) / n;

    const covariance = returns1.reduce((a, b, i) => {
        return a + (b - mean1) * (returns2[i] - mean2);
    }, 0) / n;

    return covariance / Math.sqrt(variance1 * variance2);
}

function calculatePerformanceMetrics(timeSeries: any[]) {
    if (!timeSeries || timeSeries.length === 0) {
        return {
            sharpeRatio: 0,
            sortino: 0,
            beta: 0,
            alpha: 0,
        };
    }

    const returns = timeSeries.map(t => t.averageReturn);
    const volatility = timeSeries.map(t => t.volatility);
    const riskFreeRate = 0.02; // Assuming 2% risk-free rate

    return {
        sharpeRatio: calculateSharpeRatio(returns, volatility, riskFreeRate),
        sortino: calculateSortinoRatio(returns, volatility, riskFreeRate),
        beta: calculateBeta(returns),
        alpha: calculateAlpha(returns, riskFreeRate),
    };
}

function calculateSharpeRatio(returns: number[], volatility: number[], riskFreeRate: number): number {
    const averageReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const averageVolatility = volatility.reduce((a, b) => a + b, 0) / volatility.length;
    
    return averageVolatility === 0 ? 0 : (averageReturn - riskFreeRate) / averageVolatility;
}

function calculateSortinoRatio(returns: number[], volatility: number[], riskFreeRate: number): number {
    const averageReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const downside = volatility.filter(v => v < 0);
    const downsideVolatility = downside.length === 0 ? 0 :
        Math.sqrt(downside.reduce((a, b) => a + Math.pow(b, 2), 0) / downside.length);
    
    return downsideVolatility === 0 ? 0 : (averageReturn - riskFreeRate) / downsideVolatility;
}

function calculateBeta(returns: number[]): number {
    // Simplified beta calculation using market returns
    const marketReturns = returns.map(r => r * 1.1); // Simulated market returns
    return calculateCorrelation(returns, marketReturns);
}

function calculateAlpha(returns: number[], riskFreeRate: number): number {
    const averageReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const beta = calculateBeta(returns);
    const marketReturn = averageReturn * 1.1; // Simulated market return
    
    return averageReturn - (riskFreeRate + beta * (marketReturn - riskFreeRate));
}

function calculateAverage(array: any[], field: string): number {
    if (!array || array.length === 0) return 0;
    return array.reduce((sum, item) => sum + (item[field] || 0), 0) / array.length;
}
