import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  Grid,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Investment } from '../../types/investment';

interface InvestmentCardProps {
  investment: Investment;
  onViewDetails: (investmentId: string) => void;
}

export const InvestmentCard: React.FC<InvestmentCardProps> = ({ investment, onViewDetails }) => {
  const roi = ((investment.currentValue - investment.initialInvestment) / investment.initialInvestment) * 100;
  const isPositiveReturn = roi >= 0;

  return (
    <Card 
      sx={{ 
        height: '100%', 
        cursor: 'pointer',
        '&:hover': {
          boxShadow: (theme) => theme.shadows[4],
          transform: 'translateY(-2px)',
          transition: 'all 0.3s ease-in-out',
        },
      }}
      onClick={() => onViewDetails(investment.id)}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="h2">
            {investment.farmName}
          </Typography>
          <Box display="flex" alignItems="center">
            <Chip
              label={investment.status}
              color={
                investment.status === 'Active'
                  ? 'success'
                  : investment.status === 'Pending'
                  ? 'warning'
                  : 'default'
              }
              size="small"
              sx={{ mr: 1 }}
            />
            <Tooltip title="More options">
              <IconButton size="small">
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box textAlign="center">
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Investment Amount
              </Typography>
              <Box display="flex" alignItems="center" justifyContent="center">
                <AccountBalanceIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  ${investment.initialInvestment.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box textAlign="center">
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Current Value
              </Typography>
              <Box display="flex" alignItems="center" justifyContent="center">
                <TrendingUpIcon 
                  sx={{ 
                    mr: 1, 
                    color: isPositiveReturn ? 'success.main' : 'error.main' 
                  }} 
                />
                <Typography 
                  variant="h6"
                  color={isPositiveReturn ? 'success.main' : 'error.main'}
                >
                  ${investment.currentValue.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box mt={2}>
          <Box display="flex" alignItems="center" justifyContent="center">
            <Box position="relative" display="inline-flex">
              <CircularProgress
                variant="determinate"
                value={Math.abs(roi)}
                color={isPositiveReturn ? 'success' : 'error'}
                size={80}
              />
              <Box
                top={0}
                left={0}
                bottom={0}
                right={0}
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Typography
                  variant="caption"
                  component="div"
                  color="textSecondary"
                >
                  {roi.toFixed(1)}%
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box mt={2}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Investment Details
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography variant="body2">
                <strong>Start Date:</strong>
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {new Date(investment.startDate).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">
                <strong>Duration:</strong>
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {investment.duration} months
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">
                <strong>Next Payout:</strong>
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {new Date(investment.nextPayoutDate).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">
                <strong>Risk Level:</strong>
              </Typography>
              <Chip
                label={investment.riskLevel}
                size="small"
                color={
                  investment.riskLevel === 'Low'
                    ? 'success'
                    : investment.riskLevel === 'Medium'
                    ? 'warning'
                    : 'error'
                }
              />
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};
