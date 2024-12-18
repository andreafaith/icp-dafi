import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Rating,
  InputAdornment,
  LinearProgress,
} from '@mui/material';
import {
  AccountBalance as InvestIcon,
  TrendingUp as ReturnIcon,
  Agriculture as FarmIcon,
} from '@mui/icons-material';

interface Investment {
  id: string;
  farmName: string;
  description: string;
  requiredAmount: number;
  minInvestment: number;
  expectedReturn: number;
  duration: string;
  riskLevel: string;
  image: string;
  rating: number;
  progress: number;
}

const initialInvestments: Investment[] = [
  {
    id: '1',
    farmName: 'Green Valley Farm Expansion',
    description: 'Investment opportunity for expanding organic corn production',
    requiredAmount: 500000,
    minInvestment: 10000,
    expectedReturn: 15,
    duration: '36 months',
    riskLevel: 'Medium',
    image: 'https://source.unsplash.com/random/400x300/?farm',
    rating: 4.5,
    progress: 65,
  },
  {
    id: '2',
    farmName: 'Sunrise Orchards Modernization',
    description: 'Technology upgrade for apple and pear orchards',
    requiredAmount: 300000,
    minInvestment: 5000,
    expectedReturn: 12,
    duration: '24 months',
    riskLevel: 'Low',
    image: 'https://source.unsplash.com/random/400x300/?orchard',
    rating: 4.2,
    progress: 45,
  },
];

export const InvestmentMarketplace: React.FC = () => {
  const [investments] = useState<Investment[]>(initialInvestments);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(
    null
  );
  const [investmentAmount, setInvestmentAmount] = useState('');

  const handleInvest = (investment: Investment) => {
    setSelectedInvestment(investment);
    setOpenDialog(true);
  };

  const handleConfirmInvestment = () => {
    // Handle investment confirmation
    setOpenDialog(false);
    setSelectedInvestment(null);
    setInvestmentAmount('');
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Investment Opportunities
      </Typography>

      <Grid container spacing={3}>
        {investments.map((investment) => (
          <Grid item xs={12} md={6} key={investment.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={investment.image}
                alt={investment.farmName}
              />
              <CardContent>
                <Box mb={2}>
                  <Typography gutterBottom variant="h6">
                    {investment.farmName}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    paragraph
                  >
                    {investment.description}
                  </Typography>
                </Box>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Required Amount
                    </Typography>
                    <Typography variant="h6" color="primary">
                      ${investment.requiredAmount.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Minimum Investment
                    </Typography>
                    <Typography variant="h6" color="primary">
                      ${investment.minInvestment.toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>

                <Box mb={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Funding Progress
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={investment.progress}
                    sx={{ height: 8, borderRadius: 5 }}
                  />
                  <Typography variant="body2" align="right" sx={{ mt: 0.5 }}>
                    {investment.progress}%
                  </Typography>
                </Box>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={4}>
                    <Chip
                      icon={<ReturnIcon />}
                      label={`${investment.expectedReturn}% ROI`}
                      color="primary"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Chip
                      icon={<FarmIcon />}
                      label={investment.duration}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Chip
                      label={investment.riskLevel}
                      color={
                        investment.riskLevel === 'Low'
                          ? 'success'
                          : investment.riskLevel === 'Medium'
                          ? 'warning'
                          : 'error'
                      }
                      variant="outlined"
                    />
                  </Grid>
                </Grid>

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Rating value={investment.rating} readOnly precision={0.5} />
                  <Button
                    variant="contained"
                    startIcon={<InvestIcon />}
                    onClick={() => handleInvest(investment)}
                  >
                    Invest Now
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
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Investment Details</DialogTitle>
        <DialogContent>
          {selectedInvestment && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  {selectedInvestment.farmName}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Investment Amount"
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  helperText={`Minimum investment: $${selectedInvestment.minInvestment.toLocaleString()}`}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Expected Return: {selectedInvestment.expectedReturn}% ROI
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Duration: {selectedInvestment.duration}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Risk Level: {selectedInvestment.riskLevel}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmInvestment}
            variant="contained"
            color="primary"
          >
            Confirm Investment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
