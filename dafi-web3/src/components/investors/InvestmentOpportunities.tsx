import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Tab,
  Tabs,
  Rating,
  LinearProgress,
  Avatar,
} from '@mui/material';
import {
  TrendingUp,
  AccessTime,
  AttachMoney,
  Agriculture,
  Assessment,
  LocationOn,
} from '@mui/icons-material';

interface Opportunity {
  id: string;
  farmName: string;
  location: string;
  description: string;
  requiredAmount: number;
  raisedAmount: number;
  minInvestment: number;
  expectedReturn: number;
  duration: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  category: string;
  rating: number;
  image: string;
  farmOwner: {
    name: string;
    experience: string;
    avatar: string;
  };
  metrics: {
    farmSize: string;
    cropTypes: string[];
    annualRevenue: string;
    profitMargin: number;
  };
  documents: {
    name: string;
    type: string;
    url: string;
  }[];
}

const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    farmName: 'Green Valley Expansion Project',
    location: 'California, USA',
    description: 'Expanding organic corn and soybean production through sustainable farming practices and advanced irrigation systems.',
    requiredAmount: 500000,
    raisedAmount: 325000,
    minInvestment: 10000,
    expectedReturn: 15.5,
    duration: '36 months',
    riskLevel: 'Medium',
    category: 'Organic Farming',
    rating: 4.5,
    image: 'https://source.unsplash.com/random/400x300/?farm',
    farmOwner: {
      name: 'Robert Johnson',
      experience: '15+ years',
      avatar: 'https://source.unsplash.com/random/100x100/?farmer',
    },
    metrics: {
      farmSize: '500 acres',
      cropTypes: ['Corn', 'Soybeans', 'Wheat'],
      annualRevenue: '$1.2M',
      profitMargin: 25,
    },
    documents: [
      { name: 'Business Plan', type: 'PDF', url: '#' },
      { name: 'Financial Projections', type: 'Excel', url: '#' },
      { name: 'Farm Certification', type: 'PDF', url: '#' },
    ],
  },
  {
    id: '2',
    farmName: 'Sunrise Orchards Tech Integration',
    location: 'Washington, USA',
    description: 'Implementing smart farming technology and automated harvesting systems in our apple and pear orchards.',
    requiredAmount: 750000,
    raisedAmount: 450000,
    minInvestment: 25000,
    expectedReturn: 18.2,
    duration: '48 months',
    riskLevel: 'Low',
    category: 'Smart Farming',
    rating: 4.8,
    image: 'https://source.unsplash.com/random/400x300/?orchard',
    farmOwner: {
      name: 'Sarah Williams',
      experience: '20+ years',
      avatar: 'https://source.unsplash.com/random/100x100/?woman',
    },
    metrics: {
      farmSize: '300 acres',
      cropTypes: ['Apples', 'Pears', 'Cherries'],
      annualRevenue: '$2.5M',
      profitMargin: 32,
    },
    documents: [
      { name: 'Technology Implementation Plan', type: 'PDF', url: '#' },
      { name: 'ROI Analysis', type: 'Excel', url: '#' },
      { name: 'Equipment Specifications', type: 'PDF', url: '#' },
    ],
  },
];

export const InvestmentOpportunities: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(
    null
  );
  const [investmentAmount, setInvestmentAmount] = useState('');

  const handleInvest = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setOpenDialog(true);
  };

  const handleConfirmInvestment = () => {
    // Handle investment confirmation
    setOpenDialog(false);
    setSelectedOpportunity(null);
    setInvestmentAmount('');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Investment Opportunities
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={selectedTab} onChange={(_, value) => setSelectedTab(value)}>
          <Tab label="All Opportunities" />
          <Tab label="Featured" />
          <Tab label="High Yield" />
          <Tab label="Low Risk" />
        </Tabs>
      </Box>

      <Grid container spacing={3}>
        {mockOpportunities.map((opportunity) => (
          <Grid item xs={12} key={opportunity.id}>
            <Card>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Box
                      component="img"
                      src={opportunity.image}
                      alt={opportunity.farmName}
                      sx={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover',
                        borderRadius: 1,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                      <Box>
                        <Typography variant="h5" gutterBottom>
                          {opportunity.farmName}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <LocationOn sx={{ color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {opportunity.location}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={opportunity.category}
                        color="primary"
                        variant="outlined"
                      />
                    </Box>

                    <Typography variant="body1" paragraph>
                      {opportunity.description}
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6} md={3}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Required Amount
                        </Typography>
                        <Typography variant="h6">
                          ${opportunity.requiredAmount.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Expected Return
                        </Typography>
                        <Typography variant="h6" color="primary">
                          {opportunity.expectedReturn}%
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Duration
                        </Typography>
                        <Typography variant="h6">{opportunity.duration}</Typography>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Risk Level
                        </Typography>
                        <Chip
                          label={opportunity.riskLevel}
                          color={
                            opportunity.riskLevel === 'Low'
                              ? 'success'
                              : opportunity.riskLevel === 'Medium'
                              ? 'warning'
                              : 'error'
                          }
                          size="small"
                        />
                      </Grid>
                    </Grid>

                    <Box mb={2}>
                      <Typography variant="subtitle2" gutterBottom>
                        Funding Progress
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(opportunity.raisedAmount / opportunity.requiredAmount) * 100}
                        sx={{ height: 8, borderRadius: 5 }}
                      />
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        mt={1}
                      >
                        <Typography variant="body2" color="text.secondary">
                          ${opportunity.raisedAmount.toLocaleString()} raised
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {((opportunity.raisedAmount / opportunity.requiredAmount) * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar src={opportunity.farmOwner.avatar} />
                        <Box>
                          <Typography variant="subtitle2">
                            {opportunity.farmOwner.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {opportunity.farmOwner.experience} experience
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={() => handleInvest(opportunity)}
                      >
                        Invest Now
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
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
        <DialogTitle>Investment Details</DialogTitle>
        <DialogContent>
          {selectedOpportunity && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  {selectedOpportunity.farmName}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {selectedOpportunity.description}
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
                  helperText={`Minimum investment: $${selectedOpportunity.minInvestment.toLocaleString()}`}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Farm Metrics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2" color="text.secondary">
                      Farm Size
                    </Typography>
                    <Typography variant="body1">
                      {selectedOpportunity.metrics.farmSize}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2" color="text.secondary">
                      Annual Revenue
                    </Typography>
                    <Typography variant="body1">
                      {selectedOpportunity.metrics.annualRevenue}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2" color="text.secondary">
                      Profit Margin
                    </Typography>
                    <Typography variant="body1">
                      {selectedOpportunity.metrics.profitMargin}%
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2" color="text.secondary">
                      Crop Types
                    </Typography>
                    <Typography variant="body1">
                      {selectedOpportunity.metrics.cropTypes.join(', ')}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Documents
                </Typography>
                <Grid container spacing={1}>
                  {selectedOpportunity.documents.map((doc) => (
                    <Grid item xs={12} sm={4} key={doc.name}>
                      <Button
                        variant="outlined"
                        fullWidth
                        href={doc.url}
                        target="_blank"
                      >
                        {doc.name}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
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
