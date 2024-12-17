import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useWeb3 } from '@/contexts/Web3Context';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';

interface PortfolioAnalyticsProps {
  userId: string;
  role: 'farmer' | 'investor';
}

interface AssetMetrics {
  name: string;
  symbol: string;
  allocation: number;
  value: number;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercentage: number;
}

interface RiskMetrics {
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  beta: number;
}

export const PortfolioAnalytics: React.FC<PortfolioAnalyticsProps> = ({
  userId,
  role,
}) => {
  const { principal } = useWeb3();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('1M');
  const [view, setView] = useState('performance');

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    fetchAnalytics();
  }, [userId, timeframe]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(
        `/api/analytics/portfolio?userId=${userId}&timeframe=${timeframe}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200 rounded mb-4"></div>
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center text-gray-500">
        No analytics data available
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const renderRiskMetrics = () => (
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Risk Metrics
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="text.secondary">
                Volatility (30d)
              </Typography>
              <Typography variant="h6">
                {formatPercentage(analytics.risk.volatility)}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="text.secondary">
                Sharpe Ratio
              </Typography>
              <Typography variant="h6">
                {analytics.risk.sharpeRatio.toFixed(2)}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="text.secondary">
                Max Drawdown
              </Typography>
              <Typography variant="h6">
                {formatPercentage(analytics.risk.maxDrawdown)}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="text.secondary">
                Beta
              </Typography>
              <Typography variant="h6">
                {analytics.risk.beta.toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );

  const renderAssetPerformance = () => (
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Asset Performance
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Asset</TableCell>
                  <TableCell align="right">Allocation</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Avg Price</TableCell>
                  <TableCell align="right">Current Price</TableCell>
                  <TableCell align="right">Value</TableCell>
                  <TableCell align="right">P&L</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {analytics.assets.map((asset: any) => (
                  <TableRow key={asset.symbol} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1">{asset.name}</Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ ml: 1 }}
                        >
                          {asset.symbol}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      {formatPercentage(asset.allocation)}
                    </TableCell>
                    <TableCell align="right">{asset.quantity}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(asset.avgPrice)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(asset.currentPrice)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(asset.value)}
                    </TableCell>
                    <TableCell align="right">
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                        }}
                      >
                        {asset.pnl >= 0 ? (
                          <TrendingUpIcon
                            fontSize="small"
                            sx={{ color: 'success.main' }}
                          />
                        ) : (
                          <TrendingDownIcon
                            fontSize="small"
                            sx={{ color: 'error.main' }}
                          />
                        )}
                        <Chip
                          label={`${formatCurrency(asset.pnl)} (${formatPercentage(
                            asset.pnlPercentage,
                          )})`}
                          size="small"
                          color={asset.pnl >= 0 ? 'success' : 'error'}
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Grid>
  );

  const renderPerformanceChart = () => (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Portfolio Performance</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={analytics.performance}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#0088FE"
            name="Portfolio Value"
          />
          <Line
            type="monotone"
            dataKey="returns"
            stroke="#00C49F"
            name="Returns"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const renderAssetAllocation = () => (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Asset Allocation</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={analytics.allocation}
            dataKey="value"
            nameKey="type"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {analytics.allocation.map((entry: any, index: number) => (
              <Cell key={entry.type} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  const renderReturnsBreakdown = () => (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Returns Breakdown</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={analytics.returns}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="actual" fill="#0088FE" name="Actual Returns" />
          <Bar dataKey="projected" fill="#00C49F" name="Projected Returns" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <button
            onClick={() => setView('performance')}
            className={`px-4 py-2 rounded-md ${
              view === 'performance'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Performance
          </button>
          <button
            onClick={() => setView('allocation')}
            className={`px-4 py-2 rounded-md ${
              view === 'allocation'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Allocation
          </button>
          <button
            onClick={() => setView('risk')}
            className={`px-4 py-2 rounded-md ${
              view === 'risk'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Risk
          </button>
        </div>

        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="rounded-md border-gray-300"
        >
          <option value="1M">1 Month</option>
          <option value="3M">3 Months</option>
          <option value="6M">6 Months</option>
          <option value="1Y">1 Year</option>
          <option value="ALL">All Time</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {view === 'performance' && (
          <>
            {renderPerformanceChart()}
            {renderReturnsBreakdown()}
          </>
        )}
        {view === 'allocation' && (
          <>
            {renderAssetAllocation()}
            {role === 'investor' && renderRiskMetrics()}
          </>
        )}
        {view === 'risk' && (
          <>
            {renderRiskMetrics()}
            {renderReturnsBreakdown()}
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderAssetPerformance()}
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total Value</p>
            <p className="text-xl font-semibold">
              ${analytics.metrics.totalValue.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Returns</p>
            <p className="text-xl font-semibold">
              ${analytics.metrics.totalReturns.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">ROI</p>
            <p className="text-xl font-semibold">
              {analytics.metrics.roi.toFixed(2)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              {role === 'farmer' ? 'Active Assets' : 'Active Investments'}
            </p>
            <p className="text-xl font-semibold">
              {analytics.metrics.activeCount}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
