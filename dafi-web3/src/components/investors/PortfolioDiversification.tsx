import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import {
  Info as InfoIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

interface PortfolioAsset {
  id: string;
  farmName: string;
  assetType: 'Grain' | 'Fruit' | 'Vegetable' | 'Livestock';
  region: string;
  allocation: number;
  risk: number;
  expectedReturn: number;
  sustainabilityScore: number;
  correlationScore: number;
}

interface RiskMetric {
  category: string;
  score: number;
  weight: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const mockPortfolio: PortfolioAsset[] = [
  {
    id: '1',
    farmName: 'Green Valley Farm',
    assetType: 'Grain',
    region: 'Midwest',
    allocation: 30,
    risk: 3,
    expectedReturn: 15,
    sustainabilityScore: 85,
    correlationScore: 0.2,
  },
  {
    id: '2',
    farmName: 'Sunrise Orchards',
    assetType: 'Fruit',
    region: 'West',
    allocation: 25,
    risk: 4,
    expectedReturn: 18,
    sustainabilityScore: 90,
    correlationScore: 0.3,
  },
  {
    id: '3',
    farmName: 'Valley View Ranch',
    assetType: 'Livestock',
    region: 'Southwest',
    allocation: 20,
    risk: 5,
    expectedReturn: 22,
    sustainabilityScore: 75,
    correlationScore: 0.4,
  },
  {
    id: '4',
    farmName: 'Organic Greens Co',
    assetType: 'Vegetable',
    region: 'Northeast',
    allocation: 25,
    risk: 2,
    expectedReturn: 12,
    sustainabilityScore: 95,
    correlationScore: 0.1,
  },
];

const riskMetrics: RiskMetric[] = [
  { category: 'Market Risk', score: 75, weight: 0.3 },
  { category: 'Weather Risk', score: 65, weight: 0.25 },
  { category: 'Operational Risk', score: 85, weight: 0.2 },
  { category: 'Liquidity Risk', score: 90, weight: 0.15 },
  { category: 'Regulatory Risk', score: 80, weight: 0.1 },
];

export const PortfolioDiversification: React.FC = () => {
  const [optimizationTarget, setOptimizationTarget] = useState<'risk' | 'return' | 'sustainability'>('return');
  const [riskTolerance, setRiskTolerance] = useState<number>(3);

  const getPortfolioStats = () => {
    const totalReturn = mockPortfolio.reduce(
      (acc, asset) => acc + asset.expectedReturn * (asset.allocation / 100),
      0
    );
    const avgRisk = mockPortfolio.reduce(
      (acc, asset) => acc + asset.risk * (asset.allocation / 100),
      0
    );
    const avgSustainability = mockPortfolio.reduce(
      (acc, asset) => acc + asset.sustainabilityScore * (asset.allocation / 100),
      0
    );
    return { totalReturn, avgRisk, avgSustainability };
  };

  const stats = getPortfolioStats();

  const optimizePortfolio = () => {
    // Implement portfolio optimization algorithm
    console.log('Optimizing portfolio for:', optimizationTarget);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Portfolio Diversification
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Asset Allocation</Typography>
                <Box>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={optimizePortfolio}
                    sx={{ mr: 1 }}
                  >
                    Optimize Portfolio
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<TrendingUpIcon />}
                  >
                    Rebalance
                  </Button>
                </Box>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={mockPortfolio}
                        dataKey="allocation"
                        nameKey="assetType"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {mockPortfolio.map((entry, index) => (
                          <Cell key={entry.id} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </Grid>
                <Grid item xs={12} md={6}>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={riskMetrics}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="category" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name="Risk Score"
                        dataKey="score"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </Grid>
              </Grid>

              <Box mt={3}>
                <Typography variant="subtitle1" gutterBottom>
                  Risk Tolerance Setting
                </Typography>
                <Slider
                  value={riskTolerance}
                  onChange={(_, value) => setRiskTolerance(value as number)}
                  min={1}
                  max={5}
                  marks
                  step={1}
                  valueLabelDisplay="auto"
                  sx={{ maxWidth: 300 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Portfolio Metrics
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography color="text.secondary" gutterBottom>
                      Expected Return
                    </Typography>
                    <Typography variant="h4" color="primary">
                      {stats.totalReturn.toFixed(1)}%
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography color="text.secondary" gutterBottom>
                      Risk Score
                    </Typography>
                    <Typography variant="h4" color="error">
                      {stats.avgRisk.toFixed(1)}/5
                    </Typography>
                  </Box>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Sustainability Score
                    </Typography>
                    <Typography variant="h4" color="success.main">
                      {stats.avgSustainability.toFixed(0)}/100
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Diversification Analysis
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Metric</TableCell>
                          <TableCell align="right">Score</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>Geographic Diversity</TableCell>
                          <TableCell align="right">
                            <Chip
                              label="High"
                              color="success"
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Asset Type Diversity</TableCell>
                          <TableCell align="right">
                            <Chip
                              label="Medium"
                              color="warning"
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Risk Distribution</TableCell>
                          <TableCell align="right">
                            <Chip
                              label="Optimal"
                              color="success"
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Portfolio Holdings
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Farm Name</TableCell>
                      <TableCell>Asset Type</TableCell>
                      <TableCell>Region</TableCell>
                      <TableCell align="right">Allocation (%)</TableCell>
                      <TableCell align="right">Risk Score</TableCell>
                      <TableCell align="right">Expected Return (%)</TableCell>
                      <TableCell align="right">Sustainability Score</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockPortfolio.map((asset) => (
                      <TableRow key={asset.id}>
                        <TableCell>{asset.farmName}</TableCell>
                        <TableCell>{asset.assetType}</TableCell>
                        <TableCell>{asset.region}</TableCell>
                        <TableCell align="right">{asset.allocation}%</TableCell>
                        <TableCell align="right">{asset.risk}/5</TableCell>
                        <TableCell align="right">{asset.expectedReturn}%</TableCell>
                        <TableCell align="right">{asset.sustainabilityScore}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="View Details">
                            <IconButton size="small">
                              <InfoIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Risk Alert">
                            <IconButton size="small" color="warning">
                              <WarningIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
