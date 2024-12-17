import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface AnalyticsData {
    systemMetrics: {
        cpu: number;
        memory: number;
        latency: number;
        uptime: number;
        errorRate: number;
        canisterCycles: number;
        cpuTrend: number;
        memoryTrend: number;
        latencyTrend: number;
        errorTrend: number;
    };
    transactionMetrics: {
        total: number;
        volume: number;
        averageSize: number;
        distribution: Array<{
            name: string;
            value: number;
        }>;
        trends: Array<{
            timestamp: number;
            volume: number;
        }>;
    };
    assetMetrics: {
        totalAssets: number;
        totalValue: number;
        valueChange: number;
        distribution: Array<{
            name: string;
            value: number;
        }>;
        performance: Array<{
            name: string;
            value: number;
            returns: number;
        }>;
    };
    securityMetrics: {
        incidents: Array<{
            id: string;
            type: string;
            severity: string;
            timestamp: number;
            status: string;
        }>;
        alerts: Array<{
            id: string;
            type: string;
            message: string;
            timestamp: number;
        }>;
        blockedEntities: Array<{
            id: string;
            type: string;
            reason: string;
            timestamp: number;
        }>;
        riskScore: number;
        trends: Array<{
            timestamp: number;
            incidents: number;
            alerts: number;
        }>;
    };
    investmentMetrics: {
        totalInvestment: number;
        returns: number;
        roi: number;
        distribution: Array<{
            name: string;
            value: number;
        }>;
        trends: Array<{
            timestamp: number;
            investment: number;
            returns: number;
        }>;
    };
    userMetrics: {
        activeUsers: number;
        newUsers: number;
        userActions: Array<{
            timestamp: number;
            activeUsers: number;
            newUsers: number;
        }>;
        engagement: {
            daily: number;
            weekly: number;
            monthly: number;
        };
        retention: Array<{
            period: string;
            retention: number;
        }>;
    };
}

interface UseAnalyticsReturn {
    data: AnalyticsData | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

export function useAnalytics(timeframe: string = '24h'): UseAnalyticsReturn {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get<AnalyticsData>('/api/analytics/dashboard', {
                params: { timeframe }
            });
            setData(response.data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch analytics data'));
        } finally {
            setLoading(false);
        }
    }, [timeframe]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const refetch = useCallback(async () => {
        await fetchData();
    }, [fetchData]);

    return {
        data,
        loading,
        error,
        refetch
    };
}

// Custom hooks for specific metrics
export function useSystemMetrics() {
    const { data, loading, error } = useAnalytics();
    return {
        metrics: data?.systemMetrics,
        loading,
        error
    };
}

export function useTransactionMetrics() {
    const { data, loading, error } = useAnalytics();
    return {
        metrics: data?.transactionMetrics,
        loading,
        error
    };
}

export function useAssetMetrics() {
    const { data, loading, error } = useAnalytics();
    return {
        metrics: data?.assetMetrics,
        loading,
        error
    };
}

export function useSecurityMetrics() {
    const { data, loading, error } = useAnalytics();
    return {
        metrics: data?.securityMetrics,
        loading,
        error
    };
}

export function useInvestmentMetrics() {
    const { data, loading, error } = useAnalytics();
    return {
        metrics: data?.investmentMetrics,
        loading,
        error
    };
}

export function useUserMetrics() {
    const { data, loading, error } = useAnalytics();
    return {
        metrics: data?.userMetrics,
        loading,
        error
    };
}
