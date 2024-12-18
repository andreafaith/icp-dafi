import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Tab,
  Tabs,
} from '@mui/material';
import {
  Eco as EcoIcon,
  People as PeopleIcon,
  AccountBalance as GovernanceIcon,
  WaterDrop as WaterIcon,
  Co2 as EmissionsIcon,
  Forest as BiodiversityIcon,
  Agriculture as FarmingIcon,
  Business as BusinessIcon,
  Gavel as ComplianceIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from 'recharts';

interface ESGMetric {
  category: string;
  score: number;
  weight: number;
  trend: 'up' | 'down' | 'stable';
  details: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
}

interface ESGScore {
  environmental: ESGMetric[];
  social: ESGMetric[];
  governance: ESGMetric[];
}

const mockESGData: ESGScore = {
  environmental: [
    {
      category: 'Water Management',
      score: 85,
      weight: 0.3,
      trend: 'up',
      details: {
        strengths: ['Efficient irrigation systems', 'Water recycling programs'],
        weaknesses: ['Seasonal water scarcity'],
        recommendations: ['Implement smart water meters', 'Expand water storage capacity'],
      },
    },
    {
      category: 'Carbon Emissions',
      score: 75,
      weight: 0.3,
      trend: 'stable',
      details: {
        strengths: ['Low emission equipment', 'Carbon offset programs'],
        weaknesses: ['Transportation emissions'],
        recommendations: ['Invest in electric vehicles', 'Expand solar power usage'],
      },
    },
    {
      category: 'Biodiversity',
      score: 90,
      weight: 0.2,
      trend: 'up',
      details: {
        strengths: ['Native species protection', 'Wildlife corridors'],
        weaknesses: ['Limited buffer zones'],
        recommendations: ['Expand protected areas', 'Implement pollinator programs'],
      },
    },
    {
      category: 'Soil Health',
      score: 88,
      weight: 0.2,
      trend: 'up',
      details: {
        strengths: ['Organic farming practices', 'Crop rotation'],
        weaknesses: ['Soil erosion in some areas'],
        recommendations: ['Increase cover crop usage', 'Implement no-till farming'],
      },
    },
  ],
  social: [
    {
      category: 'Worker Welfare',
      score: 92,
      weight: 0.4,
      trend: 'up',
      details: {
        strengths: ['Fair wages', 'Health benefits'],
        weaknesses: ['Seasonal employment fluctuations'],
        recommendations: ['Expand year-round employment opportunities'],
      },
    },
    {
      category: 'Community Impact',
      score: 85,
      weight: 0.3,
      trend: 'stable',
      details: {
        strengths: ['Local hiring', 'Community programs'],
        weaknesses: ['Limited educational initiatives'],
        recommendations: ['Develop farming education programs'],
      },
    },
    {
      category: 'Food Security',
      score: 88,
      weight: 0.3,
      trend: 'up',
      details: {
        strengths: ['Crop diversity', 'Local distribution'],
        weaknesses: ['Post-harvest losses'],
        recommendations: ['Improve storage facilities'],
      },
    },
  ],
  governance: [
    {
      category: 'Transparency',
      score: 95,
      weight: 0.4,
      trend: 'stable',
      details: {
        strengths: ['Regular reporting', 'Stakeholder engagement'],
        weaknesses: ['Complex supply chain tracking'],
        recommendations: ['Implement blockchain tracking'],
      },
    },
    {
      category: 'Compliance',
      score: 90,
      weight: 0.3,
      trend: 'up',
      details: {
        strengths: ['Regulatory adherence', 'Third-party audits'],
        weaknesses: ['Documentation delays'],
        recommendations: ['Automate compliance reporting'],
      },
    },
    {
      category: 'Risk Management',
      score: 85,
      weight: 0.3,
      trend: 'up',
      details: {
        strengths: ['Comprehensive insurance', 'Emergency protocols'],
        weaknesses: ['Climate risk exposure'],
        recommendations: ['Develop climate adaptation strategies'],
      },
    },
  ],
};

const trendData = [
  { month: 'Jan', environmental: 82, social: 85, governance: 88 },
  { month: 'Feb', environmental: 84, social: 86, governance: 89 },
  { month: 'Mar', environmental: 85, social: 88, governance: 90 },
  { month: 'Apr', environmental: 86, social: 89, governance: 92 },
  { month: 'May', environmental: 88, social: 90, governance: 93 },
  { month: 'Jun', environmental: 87, social: 91, governance: 92 },
];

export const ESGScoring: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedMetric, setSelectedMetric] = useState<ESGMetric | null>(null);

  const calculateOverallScore = (category: ESGMetric[]) => {
    return category.reduce((acc, metric) => acc + metric.score * metric.weight, 0);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'error';
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      default:
        return '→';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        ESG Performance Analysis
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ESG Score Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[60, 100]} />
                  <RechartsTooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="environmental"
                    stroke="#4caf50"
                    name="Environmental"
                  />
                  <Line
                    type="monotone"
                    dataKey="social"
                    stroke="#2196f3"
                    name="Social"
                  />
                  <Line
                    type="monotone"
                    dataKey="governance"
                    stroke="#9c27b0"
                    name="Governance"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <EcoIcon color="success" />
                    <Typography variant="h6">
                      Environmental Score
                    </Typography>
                  </Box>
                  <Typography variant="h3" color="success.main" gutterBottom>
                    {calculateOverallScore(mockESGData.environmental).toFixed(0)}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={calculateOverallScore(mockESGData.environmental)}
                    color="success"
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <PeopleIcon color="primary" />
                    <Typography variant="h6">
                      Social Score
                    </Typography>
                  </Box>
                  <Typography variant="h3" color="primary" gutterBottom>
                    {calculateOverallScore(mockESGData.social).toFixed(0)}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={calculateOverallScore(mockESGData.social)}
                    color="primary"
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <GovernanceIcon color="secondary" />
                    <Typography variant="h6">
                      Governance Score
                    </Typography>
                  </Box>
                  <Typography variant="h3" color="secondary" gutterBottom>
                    {calculateOverallScore(mockESGData.governance).toFixed(0)}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={calculateOverallScore(mockESGData.governance)}
                    color="secondary"
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Tabs
                value={selectedTab}
                onChange={(_, value) => setSelectedTab(value)}
                sx={{ mb: 3 }}
              >
                <Tab
                  icon={<EcoIcon />}
                  label="Environmental"
                  iconPosition="start"
                />
                <Tab
                  icon={<PeopleIcon />}
                  label="Social"
                  iconPosition="start"
                />
                <Tab
                  icon={<GovernanceIcon />}
                  label="Governance"
                  iconPosition="start"
                />
              </Tabs>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Score</TableCell>
                      <TableCell align="right">Weight</TableCell>
                      <TableCell align="right">Trend</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(selectedTab === 0
                      ? mockESGData.environmental
                      : selectedTab === 1
                      ? mockESGData.social
                      : mockESGData.governance
                    ).map((metric) => (
                      <TableRow key={metric.category}>
                        <TableCell>{metric.category}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${metric.score}`}
                            color={getScoreColor(metric.score)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          {(metric.weight * 100).toFixed(0)}%
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            color={
                              metric.trend === 'up'
                                ? 'success.main'
                                : metric.trend === 'down'
                                ? 'error.main'
                                : 'text.secondary'
                            }
                          >
                            {getTrendIcon(metric.trend)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => setSelectedMetric(metric)}
                            >
                              <InfoIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {selectedMetric && (
                <Box mt={3}>
                  <Typography variant="h6" gutterBottom>
                    {selectedMetric.category} Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="success.main" gutterBottom>
                        Strengths
                      </Typography>
                      <ul>
                        {selectedMetric.details.strengths.map((strength, index) => (
                          <li key={index}>{strength}</li>
                        ))}
                      </ul>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="error.main" gutterBottom>
                        Areas for Improvement
                      </Typography>
                      <ul>
                        {selectedMetric.details.weaknesses.map((weakness, index) => (
                          <li key={index}>{weakness}</li>
                        ))}
                      </ul>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2" color="primary.main" gutterBottom>
                        Recommendations
                      </Typography>
                      <ul>
                        {selectedMetric.details.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
