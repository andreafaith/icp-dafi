import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  BarChart as BarChartIcon,
} from '@mui/icons-material';

interface Asset {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: string;
  volume24h: string;
  image?: string;
  type: 'token' | 'pool' | 'farm';
  apy?: number;
}

interface AssetGridProps {
  assets: Asset[];
  onAssetClick?: (asset: Asset) => void;
}

export const AssetGrid: React.FC<AssetGridProps> = ({ assets, onAssetClick }) => {
  const [favorites, setFavorites] = React.useState<string[]>([]);

  const toggleFavorite = (assetId: string) => {
    setFavorites(prev =>
      prev.includes(assetId)
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <Grid container spacing={3}>
      {assets.map((asset) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={asset.id}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-2px)',
                transition: 'all 0.2s',
              },
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              {/* Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {asset.image && (
                  <Box
                    component="img"
                    src={asset.image}
                    alt={asset.name}
                    sx={{ width: 32, height: 32, mr: 1 }}
                  />
                )}
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div">
                    {asset.name}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    {asset.symbol}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(asset.id);
                  }}
                >
                  {favorites.includes(asset.id) ? (
                    <StarIcon color="primary" />
                  ) : (
                    <StarBorderIcon />
                  )}
                </IconButton>
              </Box>

              {/* Price and Change */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="h5" component="div">
                  {formatNumber(asset.price)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {asset.change24h > 0 ? (
                    <TrendingUpIcon color="success" sx={{ mr: 0.5 }} />
                  ) : (
                    <TrendingDownIcon color="error" sx={{ mr: 0.5 }} />
                  )}
                  <Typography
                    color={asset.change24h > 0 ? 'success.main' : 'error.main'}
                  >
                    {asset.change24h > 0 ? '+' : ''}
                    {asset.change24h}%
                  </Typography>
                </Box>
              </Box>

              {/* Additional Info */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Market Cap: {asset.marketCap}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  24h Volume: {asset.volume24h}
                </Typography>
              </Box>

              {/* APY for pools/farms */}
              {asset.type !== 'token' && asset.apy && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    APY
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h6" color="success.main">
                      {asset.apy}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(asset.apy, 100)}
                      sx={{ flexGrow: 1, ml: 1, height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </Box>
              )}

              {/* Asset Type Badge */}
              <Chip
                label={asset.type.toUpperCase()}
                size="small"
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                }}
              />
            </CardContent>

            <CardActions>
              <Button
                size="small"
                onClick={() => onAssetClick?.(asset)}
                startIcon={<BarChartIcon />}
              >
                View Details
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
