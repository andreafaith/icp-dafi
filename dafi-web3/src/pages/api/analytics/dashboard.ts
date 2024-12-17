import { NextApiRequest, NextApiResponse } from 'next';
import { MonitoringService } from '../../../../src/monitoring/services/MonitoringService';
import { MetricsCollector } from '../../../../src/monitoring/services/MetricsCollector';
import { SmartContractMonitor } from '../../../../src/monitoring/services/SmartContractMonitor';
import { SecurityMonitor } from '../../../../src/monitoring/services/SecurityMonitor';
import { withAuth } from '../../../middleware/auth';

const monitoringService = new MonitoringService();
const metricsCollector = new MetricsCollector();
const smartContractMonitor = new SmartContractMonitor();
const securityMonitor = new SecurityMonitor();

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { timeframe = '24h' } = req.query;

        // Get all dashboard data in parallel
        const [
            systemMetrics,
            transactionMetrics,
            assetMetrics,
            securityMetrics,
            investmentMetrics,
            userMetrics
        ] = await Promise.all([
            getSystemMetrics(timeframe as string),
            getTransactionMetrics(timeframe as string),
            getAssetMetrics(timeframe as string),
            getSecurityMetrics(timeframe as string),
            getInvestmentMetrics(timeframe as string),
            getUserMetrics(timeframe as string)
        ]);

        return res.status(200).json({
            systemMetrics,
            transactionMetrics,
            assetMetrics,
            securityMetrics,
            investmentMetrics,
            userMetrics,
            timestamp: Date.now()
        });
    } catch (error) {
        console.error('Dashboard API Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Get system performance metrics
async function getSystemMetrics(timeframe: string) {
    const metrics = await metricsCollector.collectSystemMetrics();
    return {
        cpu: metrics.cpuUsage,
        memory: metrics.memoryUsage,
        latency: metrics.networkLatency,
        uptime: metrics.uptime,
        errorRate: metrics.errorRate,
        canisterCycles: metrics.canisterCycles
    };
}

// Get transaction metrics
async function getTransactionMetrics(timeframe: string) {
    const metrics = await monitoringService.getDashboardData();
    return {
        total: metrics.transactions.total,
        volume: metrics.transactions.volume,
        averageSize: metrics.transactions.averageSize,
        distribution: metrics.transactions.distribution,
        trends: metrics.transactions.trends
    };
}

// Get asset metrics
async function getAssetMetrics(timeframe: string) {
    const metrics = await smartContractMonitor.getAssetMetrics();
    return {
        totalAssets: metrics.totalAssets,
        totalValue: metrics.totalValue,
        valueChange: metrics.valueChange,
        distribution: metrics.distribution,
        performance: metrics.performance
    };
}

// Get security metrics
async function getSecurityMetrics(timeframe: string) {
    const metrics = await securityMonitor.getSecuritySummary();
    return {
        incidents: metrics.incidents,
        alerts: metrics.alerts,
        blockedEntities: metrics.blockedEntities,
        riskScore: metrics.riskScore,
        trends: metrics.trends
    };
}

// Get investment metrics
async function getInvestmentMetrics(timeframe: string) {
    const metrics = await smartContractMonitor.getInvestmentMetrics();
    return {
        totalInvestment: metrics.totalInvestment,
        returns: metrics.returns,
        roi: metrics.roi,
        distribution: metrics.distribution,
        trends: metrics.trends
    };
}

// Get user metrics
async function getUserMetrics(timeframe: string) {
    const metrics = await monitoringService.getUserMetrics();
    return {
        activeUsers: metrics.activeUsers,
        newUsers: metrics.newUsers,
        userActions: metrics.userActions,
        engagement: metrics.engagement,
        retention: metrics.retention
    };
}

export default withAuth(handler);
