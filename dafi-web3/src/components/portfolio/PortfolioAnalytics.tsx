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

interface PortfolioAnalyticsProps {
  userId: string;
  role: 'farmer' | 'investor';
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

  const renderRiskMetrics = () => (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Risk Metrics</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Sharpe Ratio</p>
          <p className="text-xl font-semibold">
            {analytics.risk.sharpeRatio.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Sortino Ratio</p>
          <p className="text-xl font-semibold">
            {analytics.risk.sortinoRatio.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Max Drawdown</p>
          <p className="text-xl font-semibold">
            {(analytics.risk.maxDrawdown * 100).toFixed(2)}%
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Volatility</p>
          <p className="text-xl font-semibold">
            {(analytics.risk.volatility * 100).toFixed(2)}%
          </p>
        </div>
      </div>
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
