import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface TransactionData {
  timestamp: string;
  value: number;
  count: number;
}

interface TransactionMetricsProps {
  data: TransactionData[];
  totalTransactions: number;
  totalValue: number;
  averageValue: number;
}

export const TransactionMetrics: React.FC<TransactionMetricsProps> = ({
  data,
  totalTransactions,
  totalValue,
  averageValue,
}) => {
  const theme = useTheme();

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Transaction Activity
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Total Transactions
            </Typography>
            <Typography variant="h6">{totalTransactions}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Total Value
            </Typography>
            <Typography variant="h6">
              ${totalValue.toLocaleString()}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Average Value
            </Typography>
            <Typography variant="h6">
              ${averageValue.toLocaleString()}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tick={{ fill: theme.palette.text.secondary }}
              />
              <YAxis tick={{ fill: theme.palette.text.secondary }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={theme.palette.primary.main}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke={theme.palette.secondary.main}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};
