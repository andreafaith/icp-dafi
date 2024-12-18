import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Switch,
  Slider,
  FormControlLabel,
  TextField,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tooltip,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import {
  AutoAwesome as AutoIcon,
  Settings as SettingsIcon,
  Timeline as TimelineIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  TrendingUp as TrendingUpIcon,
  Warning as RiskIcon,
  Eco as SustainabilityIcon,
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
} from 'recharts';

interface Strategy {
  id: string;
  name: string;
  description: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  minInvestment: number;
  expectedReturn: number;
  active: boolean;
  type: 'Value' | 'Growth' | 'ESG' | 'Yield';
  parameters: {
    rebalancingFrequency: 'Daily' | 'Weekly' | 'Monthly';
    maxAllocationPerFarm: number;
    stopLoss: number;
    takeProfit: number;
    esgMinScore: number;
  };
  performance: {
    month: string;
    return: number;
    benchmark: number;
  }[];
  rules: {
    condition: string;
    action: string;
    enabled: boolean;
  }[];
}

const mockStrategies: Strategy[] = [
  {
    id: '1',
    name: 'Sustainable Growth Strategy',
    description: 'Focuses on farms with high ESG scores and growth potential',
    riskLevel: 'Medium',
    minInvestment: 10000,
    expectedReturn: 15,
    active: true,
    type: 'ESG',
    parameters: {
      rebalancingFrequency: 'Monthly',
      maxAllocationPerFarm: 25,
      stopLoss: 10,
      takeProfit: 30,
      esgMinScore: 80,
    },
    performance: [
      { month: 'Jan', return: 12, benchmark: 10 },
      { month: 'Feb', return: 14, benchmark: 11 },
      { month: 'Mar', return: 16, benchmark: 12 },
      { month: 'Apr', return: 15, benchmark: 11 },
      { month: 'May', return: 18, benchmark: 13 },
      { month: 'Jun', return: 17, benchmark: 12 },
    ],
    rules: [
      {
        condition: 'ESG Score > 80',
        action: 'Increase allocation by 5%',
        enabled: true,
      },
      {
        condition: 'Yield drops > 10%',
        action: 'Reduce allocation by 10%',
        enabled: true,
      },
      {
        condition: 'Weather risk alert',
        action: 'Hedge with weather derivatives',
        enabled: false,
      },
    ],
  },
  {
    id: '2',
    name: 'Conservative Yield Strategy',
    description: 'Prioritizes stable farms with consistent yield history',
    riskLevel: 'Low',
    minInvestment: 5000,
    expectedReturn: 10,
    active: false,
    type: 'Yield',
    parameters: {
      rebalancingFrequency: 'Monthly',
      maxAllocationPerFarm: 20,
      stopLoss: 5,
      takeProfit: 20,
      esgMinScore: 70,
    },
    performance: [
      { month: 'Jan', return: 8, benchmark: 7 },
      { month: 'Feb', return: 9, benchmark: 7 },
      { month: 'Mar', return: 10, benchmark: 8 },
      { month: 'Apr', return: 11, benchmark: 8 },
      { month: 'May', return: 10, benchmark: 7 },
      { month: 'Jun', return: 12, benchmark: 9 },
    ],
    rules: [
      {
        condition: 'Yield history > 3 years',
        action: 'Consider for allocation',
        enabled: true,
      },
      {
        condition: 'Market volatility > 20%',
        action: 'Reduce exposure',
        enabled: true,
      },
    ],
  },
];

export const AutomatedStrategies: React.FC = () => {
  const [strategies, setStrategies] = useState<Strategy[]>(mockStrategies);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const handleStrategyToggle = (strategyId: string) => {
    setStrategies(strategies.map(strategy => 
      strategy.id === strategyId 
        ? { ...strategy, active: !strategy.active }
        : strategy
    ));
  };

  const handleStrategyEdit = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleStrategyView = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
    setEditMode(false);
    setOpenDialog(true);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Automated Investment Strategies
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            startIcon={<AutoIcon />}
            sx={{ mr: 2 }}
          >
            Create New Strategy
          </Button>
          <Button
            variant="outlined"
            startIcon={<TimelineIcon />}
          >
            Backtest Strategy
          </Button>
        </Grid>

        {strategies.map((strategy) => (
          <Grid item xs={12} md={6} key={strategy.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    {strategy.type === 'ESG' && <SustainabilityIcon color="success" />}
                    {strategy.type === 'Yield' && <TrendingUpIcon color="primary" />}
                    <Typography variant="h6">{strategy.name}</Typography>
                  </Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={strategy.active}
                        onChange={() => handleStrategyToggle(strategy.id)}
                        color="primary"
                      />
                    }
                    label={strategy.active ? 'Active' : 'Inactive'}
                  />
                </Box>

                <Typography color="text.secondary" paragraph>
                  {strategy.description}
                </Typography>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Risk Level
                    </Typography>
                    <Chip
                      label={strategy.riskLevel}
                      color={
                        strategy.riskLevel === 'Low'
                          ? 'success'
                          : strategy.riskLevel === 'Medium'
                          ? 'warning'
                          : 'error'
                      }
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Min Investment
                    </Typography>
                    <Typography variant="body1">
                      ${strategy.minInvestment.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Expected Return
                    </Typography>
                    <Typography variant="body1" color="primary">
                      {strategy.expectedReturn}%
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Rebalancing
                    </Typography>
                    <Typography variant="body1">
                      {strategy.parameters.rebalancingFrequency}
                    </Typography>
                  </Grid>
                </Grid>

                <Box height={200}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={strategy.performance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="return"
                        stroke="#8884d8"
                        name="Strategy Return"
                      />
                      <Line
                        type="monotone"
                        dataKey="benchmark"
                        stroke="#82ca9d"
                        name="Benchmark"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>

                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <Button
                    variant="outlined"
                    onClick={() => handleStrategyView(strategy)}
                    sx={{ mr: 1 }}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleStrategyEdit(strategy)}
                    startIcon={<SettingsIcon />}
                  >
                    Configure
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedStrategy && (
          <>
            <DialogTitle>
              {editMode ? 'Configure Strategy' : 'Strategy Details'}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    {selectedStrategy.name}
                  </Typography>
                  {editMode ? (
                    <TextField
                      fullWidth
                      label="Strategy Description"
                      defaultValue={selectedStrategy.description}
                      multiline
                      rows={2}
                      sx={{ mb: 3 }}
                    />
                  ) : (
                    <Typography paragraph>
                      {selectedStrategy.description}
                    </Typography>
                  )}
                </Grid>

                {editMode && (
                  <>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Rebalancing Frequency</InputLabel>
                        <Select
                          value={selectedStrategy.parameters.rebalancingFrequency}
                          label="Rebalancing Frequency"
                        >
                          <MenuItem value="Daily">Daily</MenuItem>
                          <MenuItem value="Weekly">Weekly</MenuItem>
                          <MenuItem value="Monthly">Monthly</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Max Allocation per Farm (%)"
                        type="number"
                        defaultValue={selectedStrategy.parameters.maxAllocationPerFarm}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Stop Loss (%)"
                        type="number"
                        defaultValue={selectedStrategy.parameters.stopLoss}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Take Profit (%)"
                        type="number"
                        defaultValue={selectedStrategy.parameters.takeProfit}
                      />
                    </Grid>
                  </>
                )}

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Trading Rules
                  </Typography>
                  {selectedStrategy.rules.map((rule, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2,
                        p: 2,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                      }}
                    >
                      <Box flexGrow={1}>
                        <Typography variant="subtitle2">
                          Condition: {rule.condition}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Action: {rule.action}
                        </Typography>
                      </Box>
                      {editMode ? (
                        <Switch
                          checked={rule.enabled}
                          color="primary"
                        />
                      ) : (
                        <Chip
                          label={rule.enabled ? 'Enabled' : 'Disabled'}
                          color={rule.enabled ? 'success' : 'default'}
                          size="small"
                        />
                      )}
                    </Box>
                  ))}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>
                {editMode ? 'Cancel' : 'Close'}
              </Button>
              {editMode && (
                <Button variant="contained" color="primary">
                  Save Changes
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};
