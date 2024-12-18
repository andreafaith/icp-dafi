import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
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

interface ChartData {
  timestamp: number;
  value: number;
}

interface AssetChartProps {
  data: ChartData[];
  title?: string;
  change24h?: number;
}

export const AssetChart: React.FC<AssetChartProps> = ({
  data,
  title = 'Price Chart',
  change24h = 0,
}) => {
  const theme = useTheme();
  const [timeframe, setTimeframe] = useState('24h');

  const formatXAxis = (timestamp: number) => {
    const date = new Date(timestamp);
    switch (timeframe) {
      case '24h':
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      case '7d':
        return date.toLocaleDateString([], { weekday: 'short' });
      case '30d':
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      case '1y':
        return date.toLocaleDateString([], { month: 'short' });
      default:
        return date.toLocaleDateString();
    }
  };

  const formatYAxis = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
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
          </CardContent>
        </Card>
      );
    }
    return null;
  };

  const handleTimeframeChange = (_: React.MouseEvent<HTMLElement>, newTimeframe: string | null) => {
    if (newTimeframe !== null) {
      setTimeframe(newTimeframe);
    }
  };

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant="h6">{title}</Typography>
          <Typography
            variant="body1"
            color={change24h >= 0 ? 'success.main' : 'error.main'}
          >
            {change24h >= 0 ? '+' : ''}{change24h}% (24h)
          </Typography>
        </Box>
        <ToggleButtonGroup
          value={timeframe}
          exclusive
          onChange={handleTimeframeChange}
          size="small"
        >
          <ToggleButton value="24h">24H</ToggleButton>
          <ToggleButton value="7d">7D</ToggleButton>
          <ToggleButton value="30d">30D</ToggleButton>
          <ToggleButton value="1y">1Y</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
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
  );
};
