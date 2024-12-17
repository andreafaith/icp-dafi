import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
} from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface PerformanceData {
  timestamp: number;
  value: number;
  profit: number;
}

interface PortfolioPerformanceProps {
  data: PerformanceData[];
  initialInvestment: number;
}

export const PortfolioPerformance: React.FC<PortfolioPerformanceProps> = ({
  data,
  initialInvestment,
}) => {
  const theme = useTheme();
  const [timeframe, setTimeframe] = useState('1M');

  const handleTimeframeChange = (
    event: React.MouseEvent<HTMLElement>,
    newTimeframe: string,
  ) => {
    if (newTimeframe !== null) {
      setTimeframe(newTimeframe);
    }
  };

  const formatXAxis = (timestamp: number) => {
    const date = new Date(timestamp);
    switch (timeframe) {
      case '1D':
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      case '1W':
        return date.toLocaleDateString([], { weekday: 'short' });
      case '1M':
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      case '1Y':
        return date.toLocaleDateString([], { month: 'short' });
      case 'ALL':
        return date.toLocaleDateString([], { year: 'numeric' });
      default:
        return date.toLocaleDateString();
    }
  };

  const formatYAxis = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  const calculateROI = () => {
    if (data.length === 0) return 0;
    const currentValue = data[data.length - 1].value;
    return ((currentValue - initialInvestment) / initialInvestment) * 100;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card>
          <CardContent>
            <Typography variant="body2">
              {new Date(label).toLocaleString()}
            </Typography>
            <Typography variant="h6" color="primary">
              {formatYAxis(payload[0].value)}
            </Typography>
            <Typography
              variant="body2"
              color={payload[0].payload.profit >= 0 ? 'success.main' : 'error.main'}
            >
              Profit: {formatYAxis(payload[0].payload.profit)}
            </Typography>
          </CardContent>
        </Card>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography variant="h6">Portfolio Performance</Typography>
            <Typography
              variant="h5"
              color={calculateROI() >= 0 ? 'success.main' : 'error.main'}
            >
              {calculateROI() >= 0 ? '+' : ''}
              {calculateROI().toFixed(2)}% ROI
            </Typography>
          </Box>
          <ToggleButtonGroup
            value={timeframe}
            exclusive
            onChange={handleTimeframeChange}
            size="small"
          >
            <ToggleButton value="1D">1D</ToggleButton>
            <ToggleButton value="1W">1W</ToggleButton>
            <ToggleButton value="1M">1M</ToggleButton>
            <ToggleButton value="1Y">1Y</ToggleButton>
            <ToggleButton value="ALL">ALL</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme.palette.divider}
              />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatXAxis}
                stroke={theme.palette.text.secondary}
              />
              <YAxis
                tickFormatter={formatYAxis}
                stroke={theme.palette.text.secondary}
              />
              <Tooltip content={<CustomTooltip />} />
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={theme.palette.primary.main}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={theme.palette.primary.main}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={theme.palette.primary.main}
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};
