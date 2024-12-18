import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  TrendingUp,
  Co2,
  MonetizationOn,
  Assessment,
  History,
  Add,
  SwapHoriz,
  MoreVert,
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
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface CarbonCredit {
  id: string;
  amount: number;
  status: 'Verified' | 'Pending' | 'Trading';
  issuanceDate: string;
  expiryDate: string;
  price: number;
  project: string;
  methodology: string;
}

interface CarbonProject {
  id: string;
  name: string;
  type: string;
  status: 'Active' | 'Completed' | 'Planned';
  creditsGenerated: number;
  creditsVerified: number;
  startDate: string;
  endDate: string;
  methodology: string;
  verifier: string;
  progress: number;
}

interface Transaction {
  id: string;
  date: string;
  type: 'Buy' | 'Sell';
  amount: number;
  price: number;
  counterparty: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

const mockCarbonCredits: CarbonCredit[] = [
  {
    id: 'CC001',
    amount: 1000,
    status: 'Verified',
    issuanceDate: '2024-01-15',
    expiryDate: '2029-01-15',
    price: 25.50,
    project: 'Sustainable Agriculture Initiative',
    methodology: 'VM0042',
  },
  {
    id: 'CC002',
    amount: 750,
    status: 'Trading',
    issuanceDate: '2024-02-01',
    expiryDate: '2029-02-01',
    price: 28.75,
    project: 'Regenerative Farming Program',
    methodology: 'VM0021',
  },
  {
    id: 'CC003',
    amount: 500,
    status: 'Pending',
    issuanceDate: '2024-03-01',
    expiryDate: '2029-03-01',
    price: 22.25,
    project: 'Soil Carbon Enhancement',
    methodology: 'VM0042',
  },
];

const mockProjects: CarbonProject[] = [
  {
    id: 'P001',
    name: 'Sustainable Agriculture Initiative',
    type: 'Regenerative Agriculture',
    status: 'Active',
    creditsGenerated: 1000,
    creditsVerified: 800,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    methodology: 'VM0042',
    verifier: 'Verra',
    progress: 75,
  },
  {
    id: 'P002',
    name: 'Soil Carbon Enhancement',
    type: 'Soil Management',
    status: 'Planned',
    creditsGenerated: 500,
    creditsVerified: 0,
    startDate: '2024-06-01',
    endDate: '2025-05-31',
    methodology: 'VM0021',
    verifier: 'Gold Standard',
    progress: 25,
  },
];

const mockTransactions: Transaction[] = [
  {
    id: 'T001',
    date: '2024-03-15',
    type: 'Sell',
    amount: 200,
    price: 26.75,
    counterparty: 'Green Investments Ltd',
    status: 'Completed',
  },
  {
    id: 'T002',
    date: '2024-03-10',
    type: 'Buy',
    amount: 150,
    price: 24.50,
    counterparty: 'Carbon Trade Co',
    status: 'Completed',
  },
  {
    id: 'T003',
    date: '2024-03-05',
    type: 'Sell',
    amount: 300,
    price: 25.25,
    counterparty: 'Eco Solutions Inc',
    status: 'Pending',
  },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const CarbonCredits: React.FC = () => {
  const [openTradeDialog, setOpenTradeDialog] = useState(false);
  const [selectedCredit, setSelectedCredit] = useState<CarbonCredit | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified':
      case 'Completed':
      case 'Active':
        return 'success';
      case 'Pending':
      case 'Planned':
        return 'warning';
      case 'Trading':
        return 'info';
      case 'Failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleTradeClick = (credit: CarbonCredit) => {
    setSelectedCredit(credit);
    setOpenTradeDialog(true);
  };

  const handleCloseTradeDialog = () => {
    setOpenTradeDialog(false);
    setSelectedCredit(null);
  };

  const creditsByStatus = mockCarbonCredits.reduce((acc, credit) => {
    acc[credit.status] = (acc[credit.status] || 0) + credit.amount;
    return acc;
  }, {} as { [key: string]: number });

  const pieData = Object.entries(creditsByStatus).map(([status, amount]) => ({
    name: status,
    value: amount,
  }));

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Carbon Credits Management
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Carbon Credits Portfolio
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Project</TableCell>
                      <TableCell align="right">Amount (tCO2e)</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Price (USD)</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockCarbonCredits.map((credit) => (
                      <TableRow key={credit.id}>
                        <TableCell>{credit.id}</TableCell>
                        <TableCell>{credit.project}</TableCell>
                        <TableCell align="right">{credit.amount}</TableCell>
                        <TableCell>
                          <Chip
                            label={credit.status}
                            color={getStatusColor(credit.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">${credit.price}</TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleTradeClick(credit)}
                          >
                            <SwapHoriz />
                          </IconButton>
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
                Credits Distribution
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
                Carbon Projects
              </Typography>
              <Grid container spacing={2}>
                {mockProjects.map((project) => (
                  <Grid item xs={12} md={6} key={project.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {project.name}
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography color="textSecondary" gutterBottom>
                              Type
                            </Typography>
                            <Typography variant="body2">{project.type}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography color="textSecondary" gutterBottom>
                              Status
                            </Typography>
                            <Chip
                              label={project.status}
                              color={getStatusColor(project.status)}
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Typography color="textSecondary" gutterBottom>
                              Progress
                            </Typography>
                            <Box display="flex" alignItems="center">
                              <Box width="100%" mr={1}>
                                <LinearProgress
                                  variant="determinate"
                                  value={project.progress}
                                  color={
                                    project.progress >= 75
                                      ? 'success'
                                      : project.progress >= 50
                                      ? 'warning'
                                      : 'error'
                                  }
                                />
                              </Box>
                              <Box minWidth={35}>
                                <Typography variant="body2">
                                  {project.progress}%
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography color="textSecondary" gutterBottom>
                              Credits Generated
                            </Typography>
                            <Typography variant="body2">
                              {project.creditsGenerated} tCO2e
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography color="textSecondary" gutterBottom>
                              Credits Verified
                            </Typography>
                            <Typography variant="body2">
                              {project.creditsVerified} tCO2e
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Transactions
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Amount (tCO2e)</TableCell>
                      <TableCell align="right">Price (USD)</TableCell>
                      <TableCell>Counterparty</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>
                          <Chip
                            label={transaction.type}
                            color={transaction.type === 'Buy' ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">{transaction.amount}</TableCell>
                        <TableCell align="right">${transaction.price}</TableCell>
                        <TableCell>{transaction.counterparty}</TableCell>
                        <TableCell>
                          <Chip
                            label={transaction.status}
                            color={getStatusColor(transaction.status)}
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
      </Grid>

      <Dialog open={openTradeDialog} onClose={handleCloseTradeDialog}>
        <DialogTitle>Trade Carbon Credits</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Credit ID"
                value={selectedCredit?.id || ''}
                disabled
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Amount (tCO2e)"
                type="number"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Price per Credit (USD)"
                type="number"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Counterparty"
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTradeDialog}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCloseTradeDialog}
          >
            Execute Trade
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
