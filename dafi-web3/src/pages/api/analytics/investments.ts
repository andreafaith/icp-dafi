import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../../lib/db/mongodb';
import { authMiddleware, roleGuard } from '../../../middleware/auth';
import { Investment } from '../../../models/Investment';
import { Asset } from '../../../models/Asset';
import { rateLimit } from '../../../middleware/rateLimit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await connectDB();
        await rateLimit(req, res);
        await authMiddleware(req, res, () => {});

        switch (req.method) {
            case 'GET':
                return await getInvestmentAnalytics(req, res);
            default:
                return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Investment analytics API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function getInvestmentAnalytics(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { timeframe = '30d', assetType, location } = req.query;
        const startDate = getStartDate(timeframe as string);

        // Build match conditions
        const matchConditions: any = {
            createdAt: { $gte: startDate },
        };

        if (assetType || location) {
            const assets = await Asset.find({
                ...(assetType && { type: assetType }),
                ...(location && { location }),
            }).select('_id');
            
            matchConditions.asset = { $in: assets.map(a => a._id) };
        }

        // Get investment metrics
        const [
            overallMetrics,
            performanceByAsset,
            investmentDistribution,
            returnsByRisk,
            timeSeriesData,
        ] = await Promise.all([
            // Overall metrics
            Investment.aggregate([
                { $match: matchConditions },
                {
                    $group: {
                        _id: null,
                        totalInvestments: { $sum: 1 },
                        totalAmount: { $sum: '$amount' },
                        averageAmount: { $avg: '$amount' },
                        totalShares: { $sum: '$shares' },
                        averageReturn: { $avg: '$returns.actual' },
                    },
                },
            ]),

            // Performance by asset
            Investment.aggregate([
                { $match: matchConditions },
                {
                    $lookup: {
                        from: 'assets',
                        localField: 'asset',
                        foreignField: '_id',
                        as: 'assetDetails',
                    },
                },
                { $unwind: '$assetDetails' },
                {
                    $group: {
                        _id: {
                            asset: '$asset',
                            name: '$assetDetails.name',
                            type: '$assetDetails.type',
                        },
                        totalInvestments: { $sum: 1 },
                        totalAmount: { $sum: '$amount' },
                        averageReturn: { $avg: '$returns.actual' },
                        riskScore: { $avg: '$risk.score' },
                    },
                },
                { $sort: { totalAmount: -1 } },
                { $limit: 10 },
            ]),

            // Investment distribution
            Investment.aggregate([
                { $match: matchConditions },
                {
                    $bucket: {
                        groupBy: '$amount',
                        boundaries: [0, 1000, 5000, 10000, 50000, 100000],
                        default: 'Above 100k',
                        output: {
                            count: { $sum: 1 },
                            totalAmount: { $sum: '$amount' },
                        },
                    },
                },
            ]),

            // Returns by risk level
            Investment.aggregate([
                { $match: matchConditions },
                {
                    $group: {
                        _id: '$risk.level',
                        averageReturn: { $avg: '$returns.actual' },
                        totalInvestments: { $sum: 1 },
                        totalAmount: { $sum: '$amount' },
                    },
                },
            ]),

            // Time series data
            Investment.aggregate([
                { $match: matchConditions },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: '%Y-%m-%d',
                                date: '$createdAt',
                            },
                        },
                        totalAmount: { $sum: '$amount' },
                        count: { $sum: 1 },
                        averageReturn: { $avg: '$returns.actual' },
                    },
                },
                { $sort: { '_id': 1 } },
            ]),
        ]);

        // Calculate growth rates and trends
        const trends = calculateTrends(timeSeriesData);

        // Format response
        const analytics = {
            overview: overallMetrics[0] || {
                totalInvestments: 0,
                totalAmount: 0,
                averageAmount: 0,
                totalShares: 0,
                averageReturn: 0,
            },
            topPerformers: performanceByAsset.map(asset => ({
                asset: {
                    id: asset._id.asset,
                    name: asset._id.name,
                    type: asset._id.type,
                },
                metrics: {
                    totalInvestments: asset.totalInvestments,
                    totalAmount: asset.totalAmount,
                    averageReturn: asset.averageReturn,
                    riskScore: asset.riskScore,
                },
            })),
            distribution: {
                byAmount: investmentDistribution,
                byRisk: returnsByRisk,
            },
            timeSeries: {
                data: timeSeriesData,
                trends,
            },
            timeframe,
        };

        return res.status(200).json(analytics);
    } catch (error) {
        console.error('Get investment analytics error:', error);
        return res.status(500).json({ error: 'Failed to fetch investment analytics' });
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

function calculateTrends(timeSeriesData: any[]) {
    if (!timeSeriesData || timeSeriesData.length < 2) {
        return {
            amount: { growth: 0, trend: 'stable' },
            count: { growth: 0, trend: 'stable' },
            return: { growth: 0, trend: 'stable' },
        };
    }

    const calculateGrowth = (field: string) => {
        const oldValue = timeSeriesData[0][field] || 0;
        const newValue = timeSeriesData[timeSeriesData.length - 1][field] || 0;
        const growth = oldValue === 0 ? (newValue > 0 ? 100 : 0) : ((newValue - oldValue) / oldValue) * 100;
        const trend = growth > 5 ? 'up' : growth < -5 ? 'down' : 'stable';
        return { growth, trend };
    };

    return {
        amount: calculateGrowth('totalAmount'),
        count: calculateGrowth('count'),
        return: calculateGrowth('averageReturn'),
    };
}
