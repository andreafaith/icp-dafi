import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import { Farm } from '../../types/farm';

interface FarmCardProps {
  farm: Farm;
  onViewDetails: (farmId: string) => void;
  onEditFarm: (farmId: string) => void;
}

export const FarmCard: React.FC<FarmCardProps> = ({ farm, onViewDetails, onEditFarm }) => {
  const fundingProgress = (farm.currentFunding / farm.targetFunding) * 100;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={farm.imageUrl || '/placeholder-farm.jpg'}
        alt={farm.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" component="h2">
            {farm.name}
          </Typography>
          <Chip
            label={farm.status}
            color={
              farm.status === 'Active'
                ? 'success'
                : farm.status === 'Pending'
                ? 'warning'
                : 'default'
            }
            size="small"
          />
        </Box>

        <Typography color="textSecondary" gutterBottom>
          {farm.location}
        </Typography>

        <Box my={2}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Funding Progress
          </Typography>
          <LinearProgress
            variant="determinate"
            value={fundingProgress}
            sx={{ height: 8, borderRadius: 4 }}
          />
          <Box display="flex" justifyContent="space-between" mt={1}>
            <Typography variant="body2" color="textSecondary">
              ${farm.currentFunding.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              ${farm.targetFunding.toLocaleString()}
            </Typography>
          </Box>
        </Box>

        <Box mt={2}>
          <Typography variant="body2" gutterBottom>
            <strong>Size:</strong> {farm.size} hectares
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Crop Type:</strong> {farm.cropType}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Expected Yield:</strong> {farm.expectedYield} tons
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" mt={2}>
          <Tooltip title="View farm details and analytics">
            <Button
              size="small"
              color="primary"
              onClick={() => onViewDetails(farm.id)}
            >
              View Details
            </Button>
          </Tooltip>
          <Tooltip title="Edit farm information">
            <Button
              size="small"
              color="secondary"
              onClick={() => onEditFarm(farm.id)}
            >
              Edit Farm
            </Button>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};
