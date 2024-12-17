import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Divider,
  Chip,
  Link,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ContentCopy as ContentCopyIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';

interface AssetDetailsProps {
  asset: {
    name: string;
    symbol: string;
    price: number;
    marketCap: string;
    volume24h: string;
    change24h: number;
    contractAddress?: string;
    description?: string;
    website?: string;
    explorer?: string;
    socialLinks?: {
      twitter?: string;
      telegram?: string;
      discord?: string;
    };
    tags?: string[];
  };
}

export const AssetDetails: React.FC<AssetDetailsProps> = ({ asset }) => {
  const handleCopyAddress = () => {
    if (asset.contractAddress) {
      navigator.clipboard.writeText(asset.contractAddress);
    }
  };

  const formatNumber = (value: number | string) => {
    if (typeof value === 'string') return value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <Card>
      <CardContent>
        <Grid container spacing={3}>
          {/* Header */}
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="h5">{asset.name}</Typography>
              <Typography variant="h6" color="text.secondary">
                ({asset.symbol})
              </Typography>
            </Box>
          </Grid>

          {/* Price Information */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h4">{formatNumber(asset.price)}</Typography>
            <Typography
              variant="body1"
              color={asset.change24h >= 0 ? 'success.main' : 'error.main'}
              sx={{ mb: 2 }}
            >
              {asset.change24h >= 0 ? '+' : ''}{asset.change24h}% (24h)
            </Typography>
          </Grid>

          {/* Market Stats */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Market Cap
                </Typography>
                <Typography variant="h6">{asset.marketCap}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  24h Volume
                </Typography>
                <Typography variant="h6">{asset.volume24h}</Typography>
              </Box>
            </Box>
          </Grid>

          {/* Contract Address */}
          {asset.contractAddress && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Contract Address
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'monospace',
                    bgcolor: 'action.hover',
                    p: 1,
                    borderRadius: 1,
                    flex: 1,
                  }}
                >
                  {asset.contractAddress}
                </Typography>
                <Tooltip title="Copy Address">
                  <IconButton size="small" onClick={handleCopyAddress}>
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
                {asset.explorer && (
                  <Tooltip title="View in Explorer">
                    <IconButton
                      size="small"
                      component={Link}
                      href={asset.explorer}
                      target="_blank"
                    >
                      <OpenInNewIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Grid>
          )}

          {/* Description */}
          {asset.description && (
            <Grid item xs={12}>
              <Typography variant="body1">{asset.description}</Typography>
            </Grid>
          )}

          {/* Tags */}
          {asset.tags && asset.tags.length > 0 && (
            <Grid item xs={12}>
              <Box display="flex" gap={1} flexWrap="wrap">
                {asset.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Grid>
          )}

          {/* Links */}
          {(asset.website || asset.socialLinks) && (
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" gap={2}>
                {asset.website && (
                  <Link
                    href={asset.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Website
                  </Link>
                )}
                {asset.socialLinks?.twitter && (
                  <Link
                    href={asset.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Twitter
                  </Link>
                )}
                {asset.socialLinks?.telegram && (
                  <Link
                    href={asset.socialLinks.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Telegram
                  </Link>
                )}
                {asset.socialLinks?.discord && (
                  <Link
                    href={asset.socialLinks.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Discord
                  </Link>
                )}
              </Box>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};
