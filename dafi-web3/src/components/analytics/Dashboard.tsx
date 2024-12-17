import React, { useEffect, useState } from 'react';
import {
    LineChart,
    BarChart,
    PieChart,
    Line,
    Bar,
    Pie,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { Card, Grid, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { MetricCard } from './MetricCard';
import { SecurityPanel } from './SecurityPanel';
import { AssetMetrics } from './AssetMetrics';
import { TransactionMetrics } from './TransactionMetrics';
import { useAnalytics } from '../../hooks/useAnalytics';

export const Dashboard: React.FC = () => {
    const theme = useTheme();
    const { data, loading, error, refetch } = useAnalytics();

    useEffect(() => {
        const interval = setInterval(refetch, 60000); // Refresh every minute
        return () => clearInterval(interval);
    }, [refetch]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error">
                Error loading analytics data: {error.message}
            </Alert>
        );
    }

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Analytics Dashboard
            </Typography>

            {/* System Metrics */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} md={3}>
                    <MetricCard
                        title="CPU Usage"
                        value={`${data.systemMetrics.cpu}%`}
                        trend={data.systemMetrics.cpuTrend}
                        icon="cpu"
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <MetricCard
                        title="Memory Usage"
                        value={`${data.systemMetrics.memory}%`}
                        trend={data.systemMetrics.memoryTrend}
                        icon="memory"
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <MetricCard
                        title="Network Latency"
                        value={`${data.systemMetrics.latency}ms`}
                        trend={data.systemMetrics.latencyTrend}
                        icon="network"
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <MetricCard
                        title="Error Rate"
                        value={`${data.systemMetrics.errorRate}%`}
                        trend={data.systemMetrics.errorTrend}
                        icon="error"
                        severity={data.systemMetrics.errorRate > 5 ? 'error' : 'success'}
                    />
                </Grid>
            </Grid>

            {/* Transaction Metrics */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} md={8}>
                    <Card>
                        <Box p={2}>
                            <Typography variant="h6" gutterBottom>
                                Transaction Volume
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={data.transactionMetrics.trends}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="timestamp" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="volume"
                                        stroke={theme.palette.primary.main}
                                        activeDot={{ r: 8 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <Box p={2}>
                            <Typography variant="h6" gutterBottom>
                                Transaction Distribution
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={data.transactionMetrics.distribution}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill={theme.palette.primary.main}
                                        label
                                    />
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            {/* Asset Metrics */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <Box p={2}>
                            <Typography variant="h6" gutterBottom>
                                Asset Performance
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={data.assetMetrics.performance}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar
                                        dataKey="value"
                                        fill={theme.palette.primary.main}
                                    />
                                    <Bar
                                        dataKey="returns"
                                        fill={theme.palette.secondary.main}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <Box p={2}>
                            <Typography variant="h6" gutterBottom>
                                Investment Distribution
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={data.investmentMetrics.distribution}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill={theme.palette.primary.main}
                                        label
                                    />
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            {/* Security Metrics */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12}>
                    <SecurityPanel
                        incidents={data.securityMetrics.incidents}
                        alerts={data.securityMetrics.alerts}
                        blockedEntities={data.securityMetrics.blockedEntities}
                        riskScore={data.securityMetrics.riskScore}
                    />
                </Grid>
            </Grid>

            {/* User Metrics */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <Box p={2}>
                            <Typography variant="h6" gutterBottom>
                                User Activity
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={data.userMetrics.userActions}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="timestamp" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="activeUsers"
                                        stroke={theme.palette.primary.main}
                                        activeDot={{ r: 8 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="newUsers"
                                        stroke={theme.palette.secondary.main}
                                        activeDot={{ r: 8 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <Box p={2}>
                            <Typography variant="h6" gutterBottom>
                                User Retention
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={data.userMetrics.retention}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="period" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar
                                        dataKey="retention"
                                        fill={theme.palette.primary.main}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};
