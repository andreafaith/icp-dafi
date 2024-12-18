import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  Button,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Calculate,
  SaveAlt,
  Refresh,
  TrendingUp,
  WaterDrop,
  EnergySavingsLeaf,
  Agriculture,
  AttachMoney,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface ResourceData {
  water: {
    current: number;
    optimal: number;
    cost: number;
  };
  energy: {
    current: number;
    optimal: number;
    cost: number;
  };
  fertilizer: {
    current: number;
    optimal: number;
    cost: number;
  };
  labor: {
    current: number;
    optimal: number;
    cost: number;
  };
}

interface OptimizationResult {
  resource: string;
  currentUsage: number;
  optimalUsage: number;
  potentialSavings: number;
  roi: number;
  recommendations: string[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const initialResourceData: ResourceData = {
  water: {
    current: 1200,
    optimal: 1000,
    cost: 2.5,
  },
  energy: {
    current: 25000,
    optimal: 20000,
    cost: 0.15,
  },
  fertilizer: {
    current: 500,
    optimal: 450,
    cost: 35,
  },
  labor: {
    current: 2000,
    optimal: 1800,
    cost: 25,
  },
};

export const ResourceOptimizer: React.FC = () => {
  const [resourceData, setResourceData] = useState<ResourceData>(initialResourceData);
  const [cropType, setCropType] = useState('corn');
  const [farmSize, setFarmSize] = useState(100);
  const [results, setResults] = useState<OptimizationResult[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const calculateOptimization = () => {
    const newResults: OptimizationResult[] = [];

    Object.entries(resourceData).forEach(([resource, data]) => {
      const usage = data.current;
      const optimal = data.optimal;
      const cost = data.cost;
      const savings = (usage - optimal) * cost;
      const roi = (savings / (usage * cost)) * 100;

      const recommendations = generateRecommendations(resource, usage, optimal);

      newResults.push({
        resource: resource.charAt(0).toUpperCase() + resource.slice(1),
        currentUsage: usage,
        optimalUsage: optimal,
        potentialSavings: savings,
        roi: roi,
        recommendations,
      });
    });

    setResults(newResults);
    setShowRecommendations(true);
  };

  const generateRecommendations = (
    resource: string,
    current: number,
    optimal: number
  ): string[] => {
    const recommendations: string[] = [];
    const difference = ((current - optimal) / current) * 100;

    switch (resource) {
      case 'water':
        if (difference > 15) {
          recommendations.push('Implement drip irrigation system');
          recommendations.push('Install soil moisture sensors');
          recommendations.push('Schedule irrigation during off-peak hours');
        } else if (difference > 5) {
          recommendations.push('Optimize irrigation scheduling');
          recommendations.push('Regular maintenance of irrigation system');
        }
        break;
      case 'energy':
        if (difference > 15) {
          recommendations.push('Invest in renewable energy sources');
          recommendations.push('Upgrade to energy-efficient equipment');
          recommendations.push('Implement smart energy monitoring');
        } else if (difference > 5) {
          recommendations.push('Regular equipment maintenance');
          recommendations.push('Optimize operation schedules');
        }
        break;
      case 'fertilizer':
        if (difference > 15) {
          recommendations.push('Implement precision agriculture techniques');
          recommendations.push('Use soil testing for targeted application');
          recommendations.push('Consider organic alternatives');
        } else if (difference > 5) {
          recommendations.push('Optimize application timing');
          recommendations.push('Regular soil testing');
        }
        break;
      case 'labor':
        if (difference > 15) {
          recommendations.push('Invest in automation technologies');
          recommendations.push('Implement workforce management system');
          recommendations.push('Optimize task scheduling');
        } else if (difference > 5) {
          recommendations.push('Improve work scheduling');
          recommendations.push('Enhance training programs');
        }
        break;
    }

    return recommendations;
  };

  const pieData = results.map((result) => ({
    name: result.resource,
    value: result.potentialSavings,
  }));

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Resource Optimization Calculator
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Farm Parameters
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Crop Type</InputLabel>
                <Select
                  value={cropType}
                  label="Crop Type"
                  onChange={(e) => setCropType(e.target.value)}
                >
                  <MenuItem value="corn">Corn</MenuItem>
                  <MenuItem value="soybeans">Soybeans</MenuItem>
                  <MenuItem value="wheat">Wheat</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Farm Size (hectares)"
                type="number"
                value={farmSize}
                onChange={(e) => setFarmSize(Number(e.target.value))}
                sx={{ mb: 2 }}
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={calculateOptimization}
                startIcon={<Calculate />}
              >
                Calculate Optimization
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resource Usage
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(resourceData).map(([resource, data]) => (
                  <Grid item xs={12} sm={6} key={resource}>
                    <Typography variant="subtitle1" gutterBottom>
                      {resource.charAt(0).toUpperCase() + resource.slice(1)}
                    </Typography>
                    <TextField
                      fullWidth
                      label="Current Usage"
                      type="number"
                      value={data.current}
                      onChange={(e) =>
                        setResourceData({
                          ...resourceData,
                          [resource]: {
                            ...data,
                            current: Number(e.target.value),
                          },
                        })
                      }
                      sx={{ mb: 1 }}
                    />
                    <TextField
                      fullWidth
                      label="Cost per Unit"
                      type="number"
                      value={data.cost}
                      onChange={(e) =>
                        setResourceData({
                          ...resourceData,
                          [resource]: {
                            ...data,
                            cost: Number(e.target.value),
                          },
                        })
                      }
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {showRecommendations && (
          <>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Optimization Results
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Resource</TableCell>
                          <TableCell align="right">Current Usage</TableCell>
                          <TableCell align="right">Optimal Usage</TableCell>
                          <TableCell align="right">Potential Savings</TableCell>
                          <TableCell align="right">ROI</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {results.map((result) => (
                          <TableRow key={result.resource}>
                            <TableCell>{result.resource}</TableCell>
                            <TableCell align="right">
                              {result.currentUsage.toFixed(2)}
                            </TableCell>
                            <TableCell align="right">
                              {result.optimalUsage.toFixed(2)}
                            </TableCell>
                            <TableCell align="right">
                              ${result.potentialSavings.toFixed(2)}
                            </TableCell>
                            <TableCell align="right">
                              {result.roi.toFixed(2)}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Savings Distribution
                  </Typography>
                  <Box height={300}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label
                        >
                          {pieData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recommendations
                  </Typography>
                  <Grid container spacing={2}>
                    {results.map((result) => (
                      <Grid item xs={12} md={6} key={result.resource}>
                        <Paper elevation={2} sx={{ p: 2 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            {result.resource} Optimization
                          </Typography>
                          {result.recommendations.map((recommendation, index) => (
                            <Alert
                              severity="info"
                              key={index}
                              sx={{ mb: 1 }}
                              icon={<TrendingUp />}
                            >
                              {recommendation}
                            </Alert>
                          ))}
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};
