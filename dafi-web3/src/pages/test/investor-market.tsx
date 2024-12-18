import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Tab,
  Tabs,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  LocalFlorist,
  Agriculture,
  ShowChart,
  Info,
  MonetizationOn,
} from '@mui/icons-material';
import DashboardNav from '../../components/navigation/DashboardNav';
import { mockMarketData } from '../../mock/marketData';

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

const InvestorMarket = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const calculateROI = (price: number, trend: string) => {
    const baseROI = 12; // Base ROI percentage
    const trendModifier = trend === 'Increasing' ? 3 : trend === 'Decreasing' ? -2 : 0;
    return baseROI + trendModifier;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <DashboardNav userType="investor" />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Grid container spacing={3}>
          {/* Market Overview Cards */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <MonetizationOn color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Investment Opportunities</Typography>
                    </Box>
                    <Typography variant="h4">
                      {mockMarketData.listings.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Available Opportunities
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <ShowChart color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Market Performance</Typography>
                    </Box>
                    <Typography variant="h4">
                      {mockMarketData.marketTrends.cropPrices.filter(crop => crop.trend === 'Increasing').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Growing Markets
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Agriculture color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">High Demand Crops</Typography>
                    </Box>
                    <Typography variant="h4">
                      {mockMarketData.marketTrends.demandForecast.filter(crop => crop.demand === 'High').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Premium Opportunities
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          {/* Market Tabs */}
          <Grid item xs={12}>
            <Paper sx={{ width: '100%' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
              >
                <Tab label="Investment Opportunities" />
                <Tab label="Market Analysis" />
                <Tab label="ROI Forecast" />
              </Tabs>

              {/* Investment Opportunities Tab */}
              <TabPanel value={tabValue} index={0}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Type</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Seller</TableCell>
                        <TableCell>Details</TableCell>
                        <TableCell align="right">Investment Required</TableCell>
                        <TableCell align="right">Expected ROI</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockMarketData.listings.map((listing) => {
                        const marketTrend = mockMarketData.marketTrends.cropPrices.find(
                          crop => crop.crop === listing.name.split(' ').pop()
                        )?.trend || 'Stable';
                        const expectedROI = calculateROI(listing.price, marketTrend);

                        return (
                          <TableRow key={listing.id}>
                            <TableCell>
                              <Chip
                                label={listing.type}
                                color={listing.type === 'Crop' ? 'success' : 'primary'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>{listing.name}</TableCell>
                            <TableCell>{listing.seller}</TableCell>
                            <TableCell>
                              {listing.type === 'Crop' ? (
                                `${listing.quantity} - ${listing.quality}`
                              ) : (
                                `${listing.model} - ${listing.condition}`
                              )}
                            </TableCell>
                            <TableCell align="right">
                              ${listing.price.toLocaleString()}
                              {listing.type === 'Crop' && ` ${listing.priceUnit}`}
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                color={expectedROI > 12 ? 'success.main' : 'text.primary'}
                              >
                                {expectedROI}%
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Button variant="contained" size="small">
                                Invest Now
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>

              {/* Market Analysis Tab */}
              <TabPanel value={tabValue} index={1}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Crop</TableCell>
                        <TableCell align="right">Current Price</TableCell>
                        <TableCell align="right">Change</TableCell>
                        <TableCell>Market Sentiment</TableCell>
                        <TableCell>Confidence</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockMarketData.marketTrends.cropPrices.map((crop, index) => {
                        const forecast = mockMarketData.marketTrends.demandForecast.find(
                          f => f.crop === crop.crop
                        );
                        return (
                          <TableRow key={index}>
                            <TableCell>{crop.crop}</TableCell>
                            <TableCell align="right">${crop.currentPrice}</TableCell>
                            <TableCell align="right">
                              <Typography
                                color={crop.change.startsWith('+') ? 'success.main' : 'error.main'}
                              >
                                {crop.change}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={crop.trend}
                                color={
                                  crop.trend === 'Increasing'
                                    ? 'success'
                                    : crop.trend === 'Decreasing'
                                    ? 'error'
                                    : 'default'
                                }
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ width: '100%', mr: 1 }}>
                                  <LinearProgress
                                    variant="determinate"
                                    value={forecast?.confidence || 0}
                                    color={forecast?.confidence && forecast.confidence > 80 ? 'success' : 'primary'}
                                  />
                                </Box>
                                <Box sx={{ minWidth: 35 }}>
                                  <Typography variant="body2" color="text.secondary">
                                    {forecast?.confidence}%
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>

              {/* ROI Forecast Tab */}
              <TabPanel value={tabValue} index={2}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Crop</TableCell>
                        <TableCell>Current Demand</TableCell>
                        <TableCell>Market Trend</TableCell>
                        <TableCell align="right">Projected ROI</TableCell>
                        <TableCell>Investment Rating</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockMarketData.marketTrends.demandForecast.map((forecast, index) => {
                        const priceData = mockMarketData.marketTrends.cropPrices.find(
                          p => p.crop === forecast.crop
                        );
                        const projectedROI = calculateROI(
                          priceData?.currentPrice || 0,
                          forecast.trend
                        );

                        return (
                          <TableRow key={index}>
                            <TableCell>{forecast.crop}</TableCell>
                            <TableCell>
                              <Chip
                                label={forecast.demand}
                                color={
                                  forecast.demand === 'High'
                                    ? 'success'
                                    : forecast.demand === 'Low'
                                    ? 'error'
                                    : 'warning'
                                }
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={forecast.trend}
                                color={
                                  forecast.trend === 'Increasing'
                                    ? 'success'
                                    : forecast.trend === 'Decreasing'
                                    ? 'error'
                                    : 'default'
                                }
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                color={projectedROI > 12 ? 'success.main' : 'text.primary'}
                              >
                                {projectedROI}%
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={
                                  projectedROI > 14
                                    ? 'Excellent'
                                    : projectedROI > 12
                                    ? 'Good'
                                    : 'Moderate'
                                }
                                color={
                                  projectedROI > 14
                                    ? 'success'
                                    : projectedROI > 12
                                    ? 'primary'
                                    : 'default'
                                }
                                size="small"
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default InvestorMarket;
