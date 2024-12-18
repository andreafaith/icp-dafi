import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Tooltip,
  Tab,
  Tabs,
  Alert,
  Paper,
  InputAdornment,
} from '@mui/material';
import {
  ShowChart as ChartIcon,
  SwapHoriz as TradeIcon,
  History as HistoryIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as OrderbookIcon,
  Receipt as OrderIcon,
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

interface TokenListing {
  id: string;
  farmName: string;
  tokenSymbol: string;
  price: number;
  priceChange: number;
  volume24h: number;
  marketCap: number;
  availableTokens: number;
  yieldRate: number;
  maturityDate: string;
  riskScore: number;
  priceHistory: {
    timestamp: string;
    price: number;
    volume: number;
  }[];
  orderBook: {
    bids: { price: number; quantity: number }[];
    asks: { price: number; quantity: number }[];
  };
}

interface Trade {
  id: string;
  timestamp: string;
  tokenSymbol: string;
  type: 'buy' | 'sell';
  price: number;
  quantity: number;
  total: number;
  status: 'completed' | 'pending' | 'cancelled';
}

const mockListings: TokenListing[] = [
  {
    id: '1',
    farmName: 'Green Valley Farm',
    tokenSymbol: 'GVF',
    price: 1.25,
    priceChange: 5.2,
    volume24h: 150000,
    marketCap: 1250000,
    availableTokens: 50000,
    yieldRate: 12,
    maturityDate: '2024-12-31',
    riskScore: 3,
    priceHistory: Array.from({ length: 30 }, (_, i) => ({
      timestamp: new Date(2024, 0, i + 1).toISOString(),
      price: 1.25 + Math.sin(i / 5) * 0.1,
      volume: 5000 + Math.random() * 2000,
    })),
    orderBook: {
      bids: [
        { price: 1.24, quantity: 1000 },
        { price: 1.23, quantity: 2000 },
        { price: 1.22, quantity: 3000 },
      ],
      asks: [
        { price: 1.26, quantity: 1500 },
        { price: 1.27, quantity: 2500 },
        { price: 1.28, quantity: 3500 },
      ],
    },
  },
  {
    id: '2',
    farmName: 'Sunrise Orchards',
    tokenSymbol: 'SRO',
    price: 2.15,
    priceChange: -1.8,
    volume24h: 85000,
    marketCap: 2150000,
    availableTokens: 25000,
    yieldRate: 15,
    maturityDate: '2025-06-30',
    riskScore: 4,
    priceHistory: Array.from({ length: 30 }, (_, i) => ({
      timestamp: new Date(2024, 0, i + 1).toISOString(),
      price: 2.15 + Math.cos(i / 5) * 0.15,
      volume: 3000 + Math.random() * 1500,
    })),
    orderBook: {
      bids: [
        { price: 2.14, quantity: 500 },
        { price: 2.13, quantity: 1000 },
        { price: 2.12, quantity: 1500 },
      ],
      asks: [
        { price: 2.16, quantity: 800 },
        { price: 2.17, quantity: 1200 },
        { price: 2.18, quantity: 1800 },
      ],
    },
  },
];

const mockTrades: Trade[] = [
  {
    id: '1',
    timestamp: '2024-01-18T10:30:00Z',
    tokenSymbol: 'GVF',
    type: 'buy',
    price: 1.25,
    quantity: 1000,
    total: 1250,
    status: 'completed',
  },
  {
    id: '2',
    timestamp: '2024-01-18T09:45:00Z',
    tokenSymbol: 'SRO',
    type: 'sell',
    price: 2.15,
    quantity: 500,
    total: 1075,
    status: 'completed',
  },
];

export const SecondaryMarket: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedToken, setSelectedToken] = useState<TokenListing | null>(null);
  const [tradeDialog, setTradeDialog] = useState(false);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradePrice, setTradePrice] = useState('');

  const handleTrade = (token: TokenListing, type: 'buy' | 'sell') => {
    setSelectedToken(token);
    setTradeType(type);
    setTradePrice(token.price.toString());
    setTradeDialog(true);
  };

  const executeOrder = () => {
    // Implement order execution logic
    setTradeDialog(false);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Secondary Market
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Tabs value={selectedTab} onChange={(_, value) => setSelectedTab(value)}>
            <Tab icon={<ChartIcon />} label="Market Overview" />
            <Tab icon={<OrderbookIcon />} label="Order Book" />
            <Tab icon={<HistoryIcon />} label="Trade History" />
          </Tabs>
        </Grid>

        {selectedTab === 0 && (
          <>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                Market Overview: Total Volume (24h): ${(235000).toLocaleString()} | 
                Active Tokens: 2 | Average Yield Rate: 13.5%
              </Alert>
            </Grid>

            {mockListings.map((token) => (
              <Grid item xs={12} key={token.id}>
                <Card>
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={4}>
                        <Box mb={2}>
                          <Typography variant="h6" display="flex" alignItems="center" gap={1}>
                            {token.farmName}
                            <Chip
                              label={token.tokenSymbol}
                              color="primary"
                              size="small"
                            />
                          </Typography>
                          <Typography variant="h4" color="primary" gutterBottom>
                            ${token.price.toFixed(2)}
                            <Typography
                              component="span"
                              color={token.priceChange >= 0 ? 'success.main' : 'error.main'}
                              sx={{ ml: 1 }}
                            >
                              {token.priceChange >= 0 ? '+' : ''}
                              {token.priceChange}%
                            </Typography>
                          </Typography>
                        </Box>

                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Volume (24h)
                            </Typography>
                            <Typography variant="body1">
                              ${token.volume24h.toLocaleString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Market Cap
                            </Typography>
                            <Typography variant="body1">
                              ${token.marketCap.toLocaleString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Yield Rate
                            </Typography>
                            <Typography variant="body1" color="success.main">
                              {token.yieldRate}%
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Risk Score
                            </Typography>
                            <Chip
                              label={token.riskScore + '/5'}
                              color={
                                token.riskScore <= 2
                                  ? 'success'
                                  : token.riskScore <= 4
                                  ? 'warning'
                                  : 'error'
                              }
                              size="small"
                            />
                          </Grid>
                        </Grid>

                        <Box mt={2}>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleTrade(token, 'buy')}
                            sx={{ mr: 1 }}
                          >
                            Buy
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleTrade(token, 'sell')}
                          >
                            Sell
                          </Button>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={8}>
                        <Typography variant="subtitle2" gutterBottom>
                          Price History
                        </Typography>
                        <Box height={200}>
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={token.priceHistory}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis
                                dataKey="timestamp"
                                tickFormatter={(value) => new Date(value).toLocaleDateString()}
                              />
                              <YAxis domain={['auto', 'auto']} />
                              <RechartsTooltip />
                              <Area
                                type="monotone"
                                dataKey="price"
                                stroke="#8884d8"
                                fill="#8884d8"
                                fillOpacity={0.3}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </>
        )}

        {selectedTab === 1 && selectedToken && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order Book - {selectedToken.tokenSymbol}
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="success.main" gutterBottom>
                      Bids
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Price</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Total</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedToken.orderBook.bids.map((bid, index) => (
                            <TableRow key={index}>
                              <TableCell>${bid.price}</TableCell>
                              <TableCell align="right">{bid.quantity}</TableCell>
                              <TableCell align="right">
                                ${(bid.price * bid.quantity).toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="error.main" gutterBottom>
                      Asks
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Price</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Total</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedToken.orderBook.asks.map((ask, index) => (
                            <TableRow key={index}>
                              <TableCell>${ask.price}</TableCell>
                              <TableCell align="right">{ask.quantity}</TableCell>
                              <TableCell align="right">
                                ${(ask.price * ask.quantity).toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {selectedTab === 2 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Trade History
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Time</TableCell>
                        <TableCell>Token</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockTrades.map((trade) => (
                        <TableRow key={trade.id}>
                          <TableCell>
                            {new Date(trade.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell>{trade.tokenSymbol}</TableCell>
                          <TableCell>
                            <Chip
                              label={trade.type.toUpperCase()}
                              color={trade.type === 'buy' ? 'success' : 'error'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">${trade.price}</TableCell>
                          <TableCell align="right">{trade.quantity}</TableCell>
                          <TableCell align="right">${trade.total}</TableCell>
                          <TableCell>
                            <Chip
                              label={trade.status}
                              color={
                                trade.status === 'completed'
                                  ? 'success'
                                  : trade.status === 'pending'
                                  ? 'warning'
                                  : 'error'
                              }
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      <Dialog
        open={tradeDialog}
        onClose={() => setTradeDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedToken && (
          <>
            <DialogTitle>
              {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedToken.tokenSymbol} Tokens
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Price per Token"
                    value={tradePrice}
                    onChange={(e) => setTradePrice(e.target.value)}
                    type="number"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Amount"
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(e.target.value)}
                    type="number"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Order Summary
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Total Cost
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" align="right">
                          ${(Number(tradePrice) * Number(tradeAmount) || 0).toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Transaction Fee
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" align="right">
                          ${((Number(tradePrice) * Number(tradeAmount) || 0) * 0.001).toFixed(2)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setTradeDialog(false)}>Cancel</Button>
              <Button
                variant="contained"
                color={tradeType === 'buy' ? 'success' : 'error'}
                onClick={executeOrder}
              >
                Confirm {tradeType === 'buy' ? 'Purchase' : 'Sale'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};
