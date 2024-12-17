import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
  useTheme,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';

interface PortfolioSummaryProps {
  totalValue: number;
  change24h: number;
  change7d: number;
  assetAllocation: {
    name: string;
    value: number;
    percentage: number;
    color?: string;
  }[];
}

export const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({
  totalValue,
  change24h,
  change7d,
  assetAllocation,
}) => {
  const theme = useTheme();

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

  return (
    <Card>
      <CardContent>
        <Grid container spacing={3}>
          {/* Total Value */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Total Portfolio Value
            </Typography>
            <Typography variant="h3" component="div">
              {formatCurrency(totalValue)}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: change24h >= 0 ? 'success.main' : 'error.main',
                }}
              >
                {change24h >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  {formatPercentage(change24h)} (24h)
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: change7d >= 0 ? 'success.main' : 'error.main',
                }}
              >
                {change7d >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  {formatPercentage(change7d)} (7d)
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Asset Allocation */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Asset Allocation
            </Typography>
            <Box sx={{ mt: 2 }}>
              {assetAllocation.map((asset) => (
                <Box key={asset.name} sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">{asset.name}</Typography>
                    <Typography variant="body2">
                      {formatCurrency(asset.value)} ({asset.percentage.toFixed(1)}
                      %)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={asset.percentage}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: theme.palette.grey[200],
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: asset.color || theme.palette.primary.main,
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
