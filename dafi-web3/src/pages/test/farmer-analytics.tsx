import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  LinearProgress,
  Divider,
  Container,
  CircularProgress
} from '@mui/material';
import { mockAnalyticsData } from '../../mock/analyticsData';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TimelineIcon from '@mui/icons-material/Timeline';
import UpdateIcon from '@mui/icons-material/Update';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DashboardNav from '../../components/navigation/DashboardNav';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';

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
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function FarmerAnalytics() {
  const [value, setValue] = React.useState(0);
  const { yieldPredictions } = mockAnalyticsData;
  const { user, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && (!user || user.role !== 'farmer')) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const renderYieldOverview = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Current Yield Overview
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h4" color="primary">
                {yieldPredictions.overview.currentYield}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Current Yield
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUpIcon color="success" />
              <Typography variant="body2" color="success.main">
                {yieldPredictions.overview.changeFromLastSeason} from last season
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Predicted Yield
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h4" color="primary">
                {yieldPredictions.overview.predictedYield}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Confidence: {yieldPredictions.overview.confidence}
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={parseInt(yieldPredictions.overview.confidence)} 
              sx={{ height: 10, borderRadius: 5 }}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderMLModels = () => (
    <Grid container spacing={3}>
      {yieldPredictions.mlModels.models.map((model, index) => (
        <Grid item xs={12} md={4} key={index}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {model.name}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1">
                  Accuracy: {model.accuracy}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Last trained: {model.lastTrained}
                </Typography>
              </Box>
              <List>
                {model.predictions.map((prediction, idx) => (
                  <ListItem key={idx}>
                    <ListItemText
                      primary={prediction.factor}
                      secondary={
                        <>
                          <Chip 
                            label={prediction.impact} 
                            color={prediction.impact === 'Positive' ? 'success' : 'default'}
                            size="small"
                            sx={{ mr: 1 }}
                          />
                          {prediction.details}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderHistoricalPatterns = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Seasonal Trends
            </Typography>
            <List>
              {yieldPredictions.historicalPatterns.seasonalTrends.map((trend, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={trend.season}
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          Yield: {trend.yield} | Performance: {trend.performance}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="text.secondary">
                          Weather: {trend.factors.weather} | Pests: {trend.factors.pests}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Pattern Analysis
            </Typography>
            <List>
              {yieldPredictions.historicalPatterns.patterns.map((pattern, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={pattern.type}
                    secondary={
                      <>
                        <Chip 
                          label={pattern.trend} 
                          color={pattern.impact === 'Positive' ? 'success' : 'default'}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        {pattern.details}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderRealTimeAdjustments = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Current Conditions
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Weather"
                  secondary={
                    <>
                      Temperature: {yieldPredictions.realTimeAdjustments.currentConditions.weather.temperature}
                      <br />
                      Humidity: {yieldPredictions.realTimeAdjustments.currentConditions.weather.humidity}
                      <br />
                      Rainfall: {yieldPredictions.realTimeAdjustments.currentConditions.weather.rainfall}
                    </>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Soil"
                  secondary={
                    <>
                      Moisture: {yieldPredictions.realTimeAdjustments.currentConditions.soil.moisture}
                      <br />
                      pH: {yieldPredictions.realTimeAdjustments.currentConditions.soil.ph}
                      <br />
                      Status: {yieldPredictions.realTimeAdjustments.currentConditions.soil.status}
                    </>
                  }
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Adjustments
            </Typography>
            <List>
              {yieldPredictions.realTimeAdjustments.recentAdjustments.map((adjustment, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={adjustment.type}
                    secondary={
                      <>
                        {adjustment.adjustment}
                        <br />
                        Reason: {adjustment.reason}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recommendations
            </Typography>
            <List>
              {yieldPredictions.realTimeAdjustments.recommendations.map((rec, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={rec.category}
                    secondary={
                      <>
                        <Chip 
                          label={rec.priority} 
                          color={rec.priority === 'High' ? 'error' : 'default'}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        {rec.action}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

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
        <Typography variant="h4" gutterBottom>
          Farm Analytics Dashboard
        </Typography>
        
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="analytics tabs"
          >
            <Tab icon={<AssessmentIcon />} label="Yield Overview" />
            <Tab icon={<TimelineIcon />} label="ML Models" />
            <Tab icon={<TrendingUpIcon />} label="Historical Patterns" />
            <Tab icon={<UpdateIcon />} label="Real-time Adjustments" />
          </Tabs>
        </Paper>

        <TabPanel value={value} index={0}>
          {renderYieldOverview()}
        </TabPanel>
        <TabPanel value={value} index={1}>
          {renderMLModels()}
        </TabPanel>
        <TabPanel value={value} index={2}>
          {renderHistoricalPatterns()}
        </TabPanel>
        <TabPanel value={value} index={3}>
          {renderRealTimeAdjustments()}
        </TabPanel>
      </Container>
    </Box>
  );
}
