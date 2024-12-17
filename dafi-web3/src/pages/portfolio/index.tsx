import React from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
} from '@mui/material';
import Layout from '@/components/layouts/Layout';
import { PortfolioSummary } from '@/components/portfolio/PortfolioSummary';
import { PortfolioPerformance } from '@/components/portfolio/PortfolioPerformance';
import { PortfolioAnalytics } from '@/components/portfolio/PortfolioAnalytics';

// Mock data - Replace with actual data from your backend
const mockData = {
  summary: {
    totalValue: 125000.50,
    change24h: 5.67,
    change7d: -2.34,
    assetAllocation: [
      { name: 'DAFI Token', value: 50000, percentage: 40, color: '#2196f3' },
      { name: 'ICP', value: 35000, percentage: 28, color: '#4caf50' },
      { name: 'LP Tokens', value: 25000, percentage: 20, color: '#ff9800' },
      { name: 'Yield Farms', value: 15000, percentage: 12, color: '#9c27b0' },
    ],
  },
  performance: {
    data: Array.from({ length: 30 }, (_, i) => ({
      timestamp: Date.now() - (29 - i) * 24 * 60 * 60 * 1000,
      value: 100000 + Math.random() * 50000,
      profit: Math.random() * 10000 - 5000,
    })),
    initialInvestment: 100000,
  },
  analytics: {
    assets: [
      {
        name: 'DAFI Token',
        symbol: 'DAFI',
        allocation: 40,
        value: 50000,
        quantity: 50000,
        avgPrice: 0.8,
        currentPrice: 1,
        pnl: 10000,
        pnlPercentage: 25,
      },
      {
        name: 'Internet Computer',
        symbol: 'ICP',
        allocation: 28,
        value: 35000,
        quantity: 500,
        avgPrice: 60,
        currentPrice: 70,
        pnl: 5000,
        pnlPercentage: 16.67,
      },
      // Add more assets as needed
    ],
    riskMetrics: {
      volatility: 15.5,
      sharpeRatio: 2.1,
      maxDrawdown: -12.3,
      beta: 0.85,
    },
  },
};

const PortfolioPage = () => {
  return (
    <Layout>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Portfolio
        </Typography>

        <Grid container spacing={3}>
          {/* Portfolio Summary */}
          <Grid item xs={12}>
            <PortfolioSummary
              totalValue={mockData.summary.totalValue}
              change24h={mockData.summary.change24h}
              change7d={mockData.summary.change7d}
              assetAllocation={mockData.summary.assetAllocation}
            />
          </Grid>

          {/* Portfolio Performance */}
          <Grid item xs={12}>
            <PortfolioPerformance
              data={mockData.performance.data}
              initialInvestment={mockData.performance.initialInvestment}
            />
          </Grid>

          {/* Portfolio Analytics */}
          <Grid item xs={12}>
            <PortfolioAnalytics
              assets={mockData.analytics.assets}
              riskMetrics={mockData.analytics.riskMetrics}
            />
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default PortfolioPage;
