import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import {
  TrendingUp,
  ShowChart,
  Assessment,
  MonetizationOn,
  Close as CloseIcon,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import DashboardNav from '../../components/navigation/DashboardNav';

interface MarketItem {
  id: string;
  name: string;
  currentPrice: number;
  priceChange: number;
  volume: string;
  marketCap: string;
  supply: string;
  description: string;
  trends: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  forecast: {
    shortTerm: string;
    mediumTerm: string;
    longTerm: string;
  };
  analysis: {
    technical: string;
    fundamental: string;
    sentiment: string;
  };
}

const mockMarketData: MarketItem[] = [
  {
    id: '1',
    name: 'Organic Corn',
    currentPrice: 180.50,
    priceChange: 5.2,
    volume: '1.2M tons',
    marketCap: '$216M',
    supply: '1.5M tons',
    description: 'Premium organic corn grown using sustainable farming practices',
    trends: {
      daily: 2.5,
      weekly: 5.2,
      monthly: 8.7,
    },
    forecast: {
      shortTerm: 'Bullish - Expected to rise due to increasing demand',
      mediumTerm: 'Stable - Supply and demand well balanced',
      longTerm: 'Bullish - Growing organic market demand',
    },
    analysis: {
      technical: 'Strong upward trend with consistent volume',
      fundamental: 'Strong market position with growing demand',
      sentiment: 'Positive market sentiment due to organic trend',
    },
  },
  {
    id: '2',
    name: 'Premium Soybeans',
    currentPrice: 220.75,
    priceChange: -1.8,
    volume: '800K tons',
    marketCap: '$176M',
    supply: '950K tons',
    description: 'High-quality soybeans with excellent protein content',
    trends: {
      daily: -1.8,
      weekly: 2.1,
      monthly: 4.5,
    },
    forecast: {
      shortTerm: 'Neutral - Price consolidation expected',
      mediumTerm: 'Bullish - Seasonal demand increase',
      longTerm: 'Bullish - Growing export market',
    },
    analysis: {
      technical: 'Short-term resistance at $225',
      fundamental: 'Strong export demand',
      sentiment: 'Mixed short-term, positive long-term',
    },
  },
  {
    id: '3',
    name: 'Organic Wheat',
    currentPrice: 165.25,
    priceChange: 3.7,
    volume: '1.5M tons',
    marketCap: '$248M',
    supply: '1.8M tons',
    description: 'Certified organic wheat with superior baking qualities',
    trends: {
      daily: 3.7,
      weekly: 6.8,
      monthly: 12.4,
    },
    forecast: {
      shortTerm: 'Bullish - Weather concerns affecting supply',
      mediumTerm: 'Bullish - Strong demand outlook',
      longTerm: 'Bullish - Growing organic market share',
    },
    analysis: {
      technical: 'Breaking out of resistance level',
      fundamental: 'Supply constraints supporting prices',
      sentiment: 'Very positive due to quality premium',
    },
  },
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`market-tabpanel-${index}`}
      aria-labelledby={`market-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const FarmerMarket = () => {
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);
  const [tabValue, setTabValue] = useState(0);

  const handleViewDetails = (item: MarketItem) => {
    setSelectedItem(item);
  };

  const handleCloseDialog = () => {
    setSelectedItem(null);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        bgcolor: '#f5f5f5' 
      }}
    >
      <DashboardNav userType="farmer" />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Header */}
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              Agricultural Market
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Real-time market prices and analytics for agricultural commodities
            </Typography>
          </Grid>

          {/* Market Overview Cards */}
          {mockMarketData.map((item) => (
            <Grid item xs={12} md={4} key={item.id}>
              <Card sx={{ height: '100%', '&:hover': { transform: 'translateY(-4px)', transition: 'transform 0.2s' } }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">{item.name}</Typography>
                    <Chip
                      label={`${item.priceChange > 0 ? '+' : ''}${item.priceChange}%`}
                      color={item.priceChange > 0 ? 'success' : 'error'}
                      icon={item.priceChange > 0 ? <ArrowUpward /> : <ArrowDownward />}
                    />
                  </Box>
                  <Typography variant="h4" color="primary" gutterBottom>
                    ${item.currentPrice.toFixed(2)}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Volume: {item.volume}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Market Cap: {item.marketCap}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleViewDetails(item)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Details Dialog */}
        <Dialog
          open={!!selectedItem}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          {selectedItem && (
            <>
              <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">{selectedItem.name}</Typography>
                  <IconButton onClick={handleCloseDialog}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              </DialogTitle>
              <DialogContent>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="Overview" />
                    <Tab label="Price Analysis" />
                    <Tab label="Market Analysis" />
                  </Tabs>
                </Box>

                {/* Overview Tab */}
                <TabPanel value={tabValue} index={0}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="body1" paragraph>
                        {selectedItem.description}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TableContainer component={Paper}>
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell>Current Price</TableCell>
                              <TableCell>${selectedItem.currentPrice.toFixed(2)}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>24h Change</TableCell>
                              <TableCell>
                                <Chip
                                  label={`${selectedItem.priceChange > 0 ? '+' : ''}${selectedItem.priceChange}%`}
                                  color={selectedItem.priceChange > 0 ? 'success' : 'error'}
                                  size="small"
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Volume</TableCell>
                              <TableCell>{selectedItem.volume}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Market Cap</TableCell>
                              <TableCell>{selectedItem.marketCap}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Supply</TableCell>
                              <TableCell>{selectedItem.supply}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </Grid>
                </TabPanel>

                {/* Price Analysis Tab */}
                <TabPanel value={tabValue} index={1}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>Price Trends</Typography>
                      <TableContainer component={Paper}>
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell>24h Change</TableCell>
                              <TableCell>
                                <Chip
                                  label={`${selectedItem.trends.daily > 0 ? '+' : ''}${selectedItem.trends.daily}%`}
                                  color={selectedItem.trends.daily > 0 ? 'success' : 'error'}
                                  size="small"
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>7d Change</TableCell>
                              <TableCell>
                                <Chip
                                  label={`${selectedItem.trends.weekly > 0 ? '+' : ''}${selectedItem.trends.weekly}%`}
                                  color={selectedItem.trends.weekly > 0 ? 'success' : 'error'}
                                  size="small"
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>30d Change</TableCell>
                              <TableCell>
                                <Chip
                                  label={`${selectedItem.trends.monthly > 0 ? '+' : ''}${selectedItem.trends.monthly}%`}
                                  color={selectedItem.trends.monthly > 0 ? 'success' : 'error'}
                                  size="small"
                                />
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </Grid>
                </TabPanel>

                {/* Market Analysis Tab */}
                <TabPanel value={tabValue} index={2}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>Market Forecast</Typography>
                      <TableContainer component={Paper}>
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell>Short Term</TableCell>
                              <TableCell>{selectedItem.forecast.shortTerm}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Medium Term</TableCell>
                              <TableCell>{selectedItem.forecast.mediumTerm}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Long Term</TableCell>
                              <TableCell>{selectedItem.forecast.longTerm}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Analysis</Typography>
                      <TableContainer component={Paper}>
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell>Technical Analysis</TableCell>
                              <TableCell>{selectedItem.analysis.technical}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Fundamental Analysis</TableCell>
                              <TableCell>{selectedItem.analysis.fundamental}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Market Sentiment</TableCell>
                              <TableCell>{selectedItem.analysis.sentiment}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </Grid>
                </TabPanel>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Close</Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
};

export default FarmerMarket;
