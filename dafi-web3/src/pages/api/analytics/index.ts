import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../lib/db/mongodb';
import { authMiddleware, roleGuard } from '../../../middleware/auth';
import { Investment } from '../../../models/Investment';
import { Transaction } from '../../../models/Transaction';
import { Asset } from '../../../models/Asset';
import { User } from '../../../models/User';
import { rateLimit } from '../../../middleware/rateLimit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await connectDB();
        await rateLimit(req, res);
        await authMiddleware(req, res, () => {});
        await roleGuard('admin')(req, res, () => {});

        switch (req.method) {
            case 'GET':
                return await getAnalytics(req, res);
            default:
                return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Analytics API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function getAnalytics(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { timeframe = '30d' } = req.query;
        const startDate = getStartDate(timeframe as string);

        // Get platform metrics
        const [
            totalInvestments,
            totalTransactions,
            totalAssets,
            totalUsers,
            investmentMetrics,
            transactionMetrics,
            assetPerformance,
            userGrowth,
        ] = await Promise.all([
            // Total counts
            Investment.countDocuments(),
            Transaction.countDocuments(),
            Asset.countDocuments(),
            User.countDocuments(),

            // Investment metrics
            Investment.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startDate },
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: '$amount' },
                        averageAmount: { $avg: '$amount' },
                        totalShares: { $sum: '$shares' },
                        count: { $sum: 1 },
                    },
                },
            ]),

            // Transaction metrics
            Transaction.aggregate([
                {
                    $match: {
                        timestamp: { $gte: startDate },
                    },
                },
                {
                    $group: {
                        _id: '$type',
                        totalAmount: { $sum: '$amount' },
                        count: { $sum: 1 },
                    },
                },
            ]),

            // Asset performance
            Asset.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startDate },
                    },
                },
                {
                    $group: {
                        _id: '$type',
                        totalValue: { $sum: '$financials.currentValue' },
                        averageReturn: { $avg: '$financials.returns.actual' },
                        count: { $sum: 1 },
                    },
                },
            ]),

            // User growth
            User.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startDate },
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
                        count: { $sum: 1 },
                    },
                },
                {
                    $sort: { '_id': 1 },
                },
            ]),
        ]);

        // Calculate growth rates
        const growthRates = calculateGrowthRates(
            userGrowth,
            investmentMetrics,
            transactionMetrics,
            startDate
        );

        // Format response
        const analytics = {
            overview: {
                totalInvestments,
                totalTransactions,
                totalAssets,
                totalUsers,
            },
            investments: {
                metrics: investmentMetrics[0] || {
                    totalAmount: 0,
                    averageAmount: 0,
                    totalShares: 0,
                    count: 0,
                },
                growth: growthRates.investments,
            },
            transactions: {
                byType: transactionMetrics.reduce((acc: any, tx: any) => {
                    acc[tx._id] = {
                        totalAmount: tx.totalAmount,
                        count: tx.count,
                    };
                    return acc;
                }, {}),
                growth: growthRates.transactions,
            },
            assets: {
                performance: assetPerformance.reduce((acc: any, asset: any) => {
                    acc[asset._id] = {
                        totalValue: asset.totalValue,
                        averageReturn: asset.averageReturn,
                        count: asset.count,
                    };
                    return acc;
                }, {}),
            },
            users: {
                growth: userGrowth.map((day: any) => ({
                    date: day._id,
                    count: day.count,
                })),
                growthRate: growthRates.users,
            },
            timeframe,
        };

        return res.status(200).json(analytics);
    } catch (error) {
        console.error('Get analytics error:', error);
        return res.status(500).json({ error: 'Failed to fetch analytics' });
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

function calculateGrowthRates(
    userGrowth: any[],
    investmentMetrics: any[],
    transactionMetrics: any[],
    startDate: Date
) {
    return {
        users: calculateGrowthRate(userGrowth, 'count', startDate),
        investments: {
            amount: calculateMetricGrowth(investmentMetrics, 'totalAmount'),
            count: calculateMetricGrowth(investmentMetrics, 'count'),
        },
        transactions: {
            amount: calculateMetricGrowth(transactionMetrics, 'totalAmount'),
            count: calculateMetricGrowth(transactionMetrics, 'count'),
        },
    };
}

function calculateGrowthRate(data: any[], field: string, startDate: Date): number {
    if (!data || data.length < 2) return 0;

    const oldValue = data[0][field] || 0;
    const newValue = data[data.length - 1][field] || 0;

    if (oldValue === 0) return newValue > 0 ? 100 : 0;
    return ((newValue - oldValue) / oldValue) * 100;
}

function calculateMetricGrowth(metrics: any[], field: string): number {
    if (!metrics || !metrics[0]) return 0;
    const previousPeriod = metrics[0][field] || 0;
    const currentPeriod = metrics[metrics.length - 1][field] || 0;

    if (previousPeriod === 0) return currentPeriod > 0 ? 100 : 0;
    return ((currentPeriod - previousPeriod) / previousPeriod) * 100;
}
