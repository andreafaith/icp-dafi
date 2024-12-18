import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';
import {
  Eco,
  WaterDrop,
  Co2,
  EnergySavingsLeaf,
  Recycling,
  Agriculture,
} from '@mui/icons-material';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from 'recharts';

interface SustainabilityData {
  farmId: string;
  overallScore: number;
  carbonFootprint: {
    current: number;
    target: number;
    history: { month: string; value: number }[];
  };
  waterUsage: {
    current: number;
    target: number;
    recycled: number;
    history: { month: string; value: number }[];
  };
  soilHealth: {
    score: number;
    metrics: {
      organicMatter: number;
      pH: number;
      nitrogen: number;
      phosphorus: number;
      potassium: number;
    };
    history: { month: string; value: number }[];
  };
  biodiversity: {
    score: number;
    metrics: {
      speciesCount: number;
      habitatArea: number;
      pollinatorPopulation: number;
    };
  };
  energyUsage: {
    total: number;
    renewable: number;
    breakdown: {
      source: string;
      percentage: number;
      isRenewable: boolean;
    }[];
  };
  certifications: {
    name: string;
    status: 'Active' | 'Pending' | 'Expired';
    expiryDate: string;
  }[];
  sustainablePractices: {
    practice: string;
    status: 'Implemented' | 'In Progress' | 'Planned';
    impact: number;
  }[];
}

const mockSustainabilityData: SustainabilityData = {
  farmId: 'FARM001',
  overallScore: 85,
  carbonFootprint: {
    current: 25.5,
    target: 20,
    history: Array.from({ length: 12 }, (_, i) => ({
      month: `2024-${(i + 1).toString().padStart(2, '0')}`,
      value: 25.5 - (Math.random() * 0.5),
    })),
  },
  waterUsage: {
    current: 1200,
    target: 1000,
    recycled: 45,
    history: Array.from({ length: 12 }, (_, i) => ({
      month: `2024-${(i + 1).toString().padStart(2, '0')}`,
      value: 1200 - (Math.random() * 50),
    })),
  },
  soilHealth: {
    score: 88,
    metrics: {
      organicMatter: 4.2,
      pH: 6.8,
      nitrogen: 85,
      phosphorus: 78,
      potassium: 82,
    },
    history: Array.from({ length: 12 }, (_, i) => ({
      month: `2024-${(i + 1).toString().padStart(2, '0')}`,
      value: 88 + (Math.random() * 2 - 1),
    })),
  },
  biodiversity: {
    score: 92,
    metrics: {
      speciesCount: 45,
      habitatArea: 12.5,
      pollinatorPopulation: 850,
    },
  },
  energyUsage: {
    total: 25000,
    renewable: 15000,
    breakdown: [
      { source: 'Solar', percentage: 40, isRenewable: true },
      { source: 'Wind', percentage: 20, isRenewable: true },
      { source: 'Grid', percentage: 35, isRenewable: false },
      { source: 'Biomass', percentage: 5, isRenewable: true },
    ],
  },
  certifications: [
    { name: 'Organic Farming', status: 'Active', expiryDate: '2025-12-31' },
    { name: 'Carbon Neutral', status: 'Pending', expiryDate: '2024-06-30' },
    { name: 'Water Stewardship', status: 'Active', expiryDate: '2025-03-15' },
  ],
  sustainablePractices: [
    { practice: 'Crop Rotation', status: 'Implemented', impact: 85 },
    { practice: 'Drip Irrigation', status: 'Implemented', impact: 92 },
    { practice: 'Composting', status: 'In Progress', impact: 78 },
    { practice: 'Cover Cropping', status: 'Planned', impact: 70 },
  ],
};

export const SustainabilityMetrics: React.FC = () => {
  const [timeframe, setTimeframe] = useState('1Y');
  const data = mockSustainabilityData;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Expired':
        return 'error';
      case 'Implemented':
        return 'success';
      case 'In Progress':
        return 'warning';
      case 'Planned':
        return 'info';
      default:
        return 'default';
    }
  };

  const soilHealthData = [
    { metric: 'Organic Matter', value: data.soilHealth.metrics.organicMatter },
    { metric: 'pH', value: data.soilHealth.metrics.pH },
    { metric: 'Nitrogen', value: data.soilHealth.metrics.nitrogen },
    { metric: 'Phosphorus', value: data.soilHealth.metrics.phosphorus },
    { metric: 'Potassium', value: data.soilHealth.metrics.potassium },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Sustainability Metrics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Overall Sustainability Score
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ flexGrow: 1, mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={data.overallScore}
                    color={data.overallScore >= 80 ? 'success' : 'warning'}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
                <Typography variant="h6" color="primary">
                  {data.overallScore}%
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Carbon Footprint
                  </Typography>
                  <Box height={200}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.carbonFootprint.history}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#8884d8"
                          name="CO2 (tons)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Water Usage
                  </Typography>
                  <Box height={200}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.waterUsage.history}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#82ca9d"
                          name="Usage (m³)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Energy Mix
                  </Typography>
                  <Box height={200}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={data.energyUsage.breakdown}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="source" type="category" />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="percentage"
                          fill="#8884d8"
                          name="Percentage"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Soil Health Metrics
                  </Typography>
                  <Box height={200}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={soilHealthData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="metric" />
                        <PolarRadiusAxis />
                        <Radar
                          name="Value"
                          dataKey="value"
                          stroke="#8884d8"
                          fill="#8884d8"
                          fillOpacity={0.6}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Certifications
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Certification</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Expiry Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.certifications.map((cert) => (
                      <TableRow key={cert.name}>
                        <TableCell>{cert.name}</TableCell>
                        <TableCell>
                          <Chip
                            label={cert.status}
                            color={getStatusColor(cert.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{cert.expiryDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sustainable Practices
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Practice</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Impact Score</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.sustainablePractices.map((practice) => (
                      <TableRow key={practice.practice}>
                        <TableCell>{practice.practice}</TableCell>
                        <TableCell>
                          <Chip
                            label={practice.status}
                            color={getStatusColor(practice.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Box flexGrow={1} mr={1}>
                              <LinearProgress
                                variant="determinate"
                                value={practice.impact}
                                color={
                                  practice.impact >= 80
                                    ? 'success'
                                    : practice.impact >= 60
                                    ? 'warning'
                                    : 'error'
                                }
                              />
                            </Box>
                            <Typography variant="body2">
                              {practice.impact}%
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Biodiversity Metrics
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Species Count
                      </Typography>
                      <Typography variant="h4">
                        {data.biodiversity.metrics.speciesCount}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Habitat Area (ha)
                      </Typography>
                      <Typography variant="h4">
                        {data.biodiversity.metrics.habitatArea}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Pollinator Population
                      </Typography>
                      <Typography variant="h4">
                        {data.biodiversity.metrics.pollinatorPopulation}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
