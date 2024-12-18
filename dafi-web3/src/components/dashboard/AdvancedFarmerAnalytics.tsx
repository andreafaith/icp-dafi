import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Alert,
  IconButton,
  Tooltip as MuiTooltip,
} from '@mui/material';
import {
  Science,
  Timeline,
  WaterDrop,
  AttachMoney,
  Spa,
  ShowChart,
  CloudQueue,
  Info,
} from '@mui/icons-material';
import {
  YieldTrendChart,
  ResourceUsageChart,
  SoilHealthRadar,
  MarketTrendChart,
  MLPerformanceChart,
  WeatherImpactChart,
  FinancialMetricsChart,
  ResourceDistributionPie,
  CompetitionAnalysisChart,
} from '../charts/AdvancedAnalytics';

interface AnalyticsSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  info?: string;
}

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ title, icon, children, info }) => (
  <Paper sx={{ p: 3, height: '100%' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        {icon}
        <Typography variant="h6" sx={{ ml: 1 }}>
          {title}
        </Typography>
      </Box>
      {info && (
        <MuiTooltip title={info}>
          <IconButton size="small">
            <Info />
          </IconButton>
        </MuiTooltip>
      )}
    </Box>
    {children}
  </Paper>
);

interface Props {
  data: any;
}

const AdvancedFarmerAnalytics: React.FC<Props> = ({ data }) => {
  const soilHealthData = [
    { subject: 'Nitrogen', value: data.soil.nutrients.current.nitrogen.value },
    { subject: 'Phosphorus', value: data.soil.nutrients.current.phosphorus.value },
    { subject: 'Potassium', value: data.soil.nutrients.current.potassium.value },
    { subject: 'pH', value: data.soil.ph.current * 10 },
    { subject: 'Microbial', value: data.soil.microbial.activity },
  ];

  return (
    <Grid container spacing={3}>
      {/* ML Models Performance */}
      <Grid item xs={12}>
        <AnalyticsSection
          title="AI Models Performance"
          icon={<Science sx={{ mr: 1 }} />}
          info="Real-time performance metrics of AI/ML models"
        >
          <Grid container spacing={2}>
            {Object.entries(data.ml).map(([key, model]: [string, any]) => (
              <Grid item xs={12} md={3} key={key}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" color="primary">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2">Accuracy: {model.accuracy}%</Typography>
                      <LinearProgress
                        variant="determinate"
                        value={model.accuracy}
                        sx={{ mt: 1, mb: 1 }}
                      />
                      <Typography variant="caption" color="textSecondary">
                        Features: {model.features.join(', ')}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 3 }}>
            <MLPerformanceChart data={data.ml.yieldPrediction.performance} />
          </Box>
        </AnalyticsSection>
      </Grid>

      {/* Yield Predictions */}
      <Grid item xs={12} md={8}>
        <AnalyticsSection
          title="Advanced Yield Analytics"
          icon={<Timeline sx={{ mr: 1 }} />}
          info="AI-powered yield predictions and historical analysis"
        >
          <YieldTrendChart data={data.yield.historical} />
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {data.yield.forecast.slice(0, 3).map((forecast: any, index: number) => (
              <Grid item xs={12} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2">{forecast.date}</Typography>
                    <Typography variant="h6">{forecast.predicted.toFixed(1)}%</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Chip
                        label={`${forecast.confidence}% confidence`}
                        color={forecast.confidence > 80 ? 'success' : 'warning'}
                        size="small"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </AnalyticsSection>
      </Grid>

      {/* Weather Impact */}
      <Grid item xs={12} md={4}>
        <AnalyticsSection
          title="Weather Analytics"
          icon={<CloudQueue sx={{ mr: 1 }} />}
          info="Real-time weather impact analysis"
        >
          <WeatherImpactChart data={data.weather.climateImpact.trends} />
          {data.weather.alerts.map((alert: any, index: number) => (
            <Alert severity={alert.severity.toLowerCase()} sx={{ mt: 1 }} key={index}>
              {alert.type}: {alert.probability}% probability
            </Alert>
          ))}
        </AnalyticsSection>
      </Grid>

      {/* Resource Management */}
      <Grid item xs={12} md={6}>
        <AnalyticsSection
          title="Resource Analytics"
          icon={<WaterDrop sx={{ mr: 1 }} />}
          info="Smart resource management and optimization"
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <ResourceUsageChart data={data.resources.water.history} />
            </Grid>
            <Grid item xs={12} md={4}>
              <ResourceDistributionPie data={data.resources.fertilizer.distribution} />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Optimization Recommendations
            </Typography>
            <List dense>
              {data.resources.optimization.recommendations.map((rec: any, index: number) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={rec.action}
                    secondary={`Impact: ${rec.impact}% improvement`}
                  />
                  <Chip
                    label={`${rec.resource}`}
                    color={rec.impact > 15 ? 'success' : 'primary'}
                    size="small"
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </AnalyticsSection>
      </Grid>

      {/* Financial Analytics */}
      <Grid item xs={12} md={6}>
        <AnalyticsSection
          title="Financial Analytics"
          icon={<AttachMoney sx={{ mr: 1 }} />}
          info="Comprehensive financial performance tracking"
        >
          <FinancialMetricsChart
            data={data.financial.revenue.historical.map((item: any) => ({
              ...item,
              costs: data.financial.costs.monthly.find((cost: any) => cost.date === item.date)
                ?.operational,
              roi: data.financial.roi.history.find((roi: any) => roi.date === item.date)?.value,
            }))}
          />
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {data.financial.roi.breakdown.map((item: any, index: number) => (
              <Grid item xs={12} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2">{item.category}</Typography>
                    <Typography variant="h6">{item.roi}% ROI</Typography>
                    <Chip
                      label={item.risk}
                      color={
                        item.risk === 'High'
                          ? 'error'
                          : item.risk === 'Medium'
                          ? 'warning'
                          : 'success'
                      }
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </AnalyticsSection>
      </Grid>

      {/* Soil Health */}
      <Grid item xs={12} md={6}>
        <AnalyticsSection
          title="Soil Analytics"
          icon={<Spa sx={{ mr: 1 }} />}
          info="Advanced soil analysis and health tracking"
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <SoilHealthRadar data={soilHealthData} />
            </Grid>
            <Grid item xs={12} md={6}>
              <List dense>
                {Object.entries(data.soil.nutrients.current).map(([nutrient, info]: [string, any]) => (
                  <ListItem key={nutrient}>
                    <ListItemText
                      primary={nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}
                      secondary={`${info.value}% (${info.trend})`}
                    />
                    <Chip
                      label={info.status}
                      color={info.status === 'Optimal' ? 'success' : 'warning'}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </AnalyticsSection>
      </Grid>

      {/* Market Intelligence */}
      <Grid item xs={12} md={6}>
        <AnalyticsSection
          title="Market Intelligence"
          icon={<ShowChart sx={{ mr: 1 }} />}
          info="Real-time market analysis and trends"
        >
          <MarketTrendChart data={data.market.prices.trends} />
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Market Demand Forecast
              </Typography>
              <List dense>
                {data.market.demand.forecast.map((item: any, index: number) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={item.crop}
                      secondary={`Confidence: ${item.confidence}%`}
                    />
                    <Chip
                      label={item.trend}
                      color={
                        item.trend === 'Increasing'
                          ? 'success'
                          : item.trend === 'Decreasing'
                          ? 'error'
                          : 'default'
                      }
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Competition Analysis
              </Typography>
              <CompetitionAnalysisChart data={data.market.competition.local} />
            </Grid>
          </Grid>
        </AnalyticsSection>
      </Grid>
    </Grid>
  );
};

export default AdvancedFarmerAnalytics;
