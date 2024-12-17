import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Star,
  StarBorder,
} from '@mui/icons-material';
import { formatCurrency, formatPercentage } from '../../utils/format';

interface Market {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  tvl: number;
  apy: number;
  isWatchlisted: boolean;
}

interface MarketPanelProps {
  markets: Market[];
  onToggleWatchlist: (marketId: string) => void;
  onSelectMarket: (marketId: string) => void;
}

export const MarketPanel: React.FC<MarketPanelProps> = ({
  markets,
  onToggleWatchlist,
  onSelectMarket,
}) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Markets
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" />
                <TableCell>Asset</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">24h Change</TableCell>
                <TableCell align="right">24h Volume</TableCell>
                <TableCell align="right">TVL</TableCell>
                <TableCell align="right">APY</TableCell>
                <TableCell padding="checkbox" />
              </TableRow>
            </TableHead>
            <TableBody>
              {markets.map((market) => (
                <TableRow
                  key={market.id}
                  hover
                  onClick={() => onSelectMarket(market.id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell padding="checkbox">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWatchlist(market.id);
                      }}
                    >
                      {market.isWatchlisted ? (
                        <Star color="primary" fontSize="small" />
                      ) : (
                        <StarBorder fontSize="small" />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body1">
                        {market.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {market.symbol}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(market.price)}
                  </TableCell>
                  <TableCell align="right">
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="flex-end"
                      gap={0.5}
                      color={market.change24h >= 0 ? 'success.main' : 'error.main'}
                    >
                      {market.change24h >= 0 ? (
                        <TrendingUp fontSize="small" />
                      ) : (
                        <TrendingDown fontSize="small" />
                      )}
                      {formatPercentage(market.change24h)}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(market.volume24h)}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(market.tvl)}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Annual Percentage Yield">
                      <Chip
                        label={`${formatPercentage(market.apy)} APY`}
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};
