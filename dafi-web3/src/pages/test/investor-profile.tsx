import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Button,
  TextField,
  Divider,
} from '@mui/material';
import { Layout } from '@/components/Layout';

// Mock investor profile data
const mockProfile = {
  name: 'Sarah Johnson',
  email: 'sarah.johnson@example.com',
  phone: '+1 (555) 987-6543',
  occupation: 'Investment Manager',
  location: 'San Francisco, CA',
  investmentPreferences: {
    riskTolerance: 'Moderate',
    preferredSector: 'Sustainable Agriculture',
    minInvestment: '$10,000',
    maxInvestment: '$500,000',
    preferredTerm: '6-24 months',
  },
  investmentHistory: {
    totalInvested: '$750,000',
    activeInvestments: 5,
    averageReturn: '14.5%',
    yearsInvesting: 3,
  },
};

export default function InvestorProfile() {
  const [isEditing, setIsEditing] = React.useState(false);

  return (
    <Layout>
      <Box sx={{ width: '100%' }}>
        <Typography variant="h4" sx={{ mb: 4 }}>Investor Profile</Typography>

        <Grid container spacing={3}>
          {/* Profile Summary Card */}
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: '#FFFFFF', boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    mx: 'auto',
                    mb: 2,
                    bgcolor: 'primary.main',
                  }}
                >
                  {mockProfile.name.charAt(0)}
                </Avatar>
                <Typography variant="h5" gutterBottom>{mockProfile.name}</Typography>
                <Typography color="textSecondary" gutterBottom>{mockProfile.occupation}</Typography>
                <Typography color="textSecondary">{mockProfile.location}</Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Save Changes' : 'Edit Profile'}
                </Button>
              </CardContent>
            </Card>

            {/* Investment Summary */}
            <Card sx={{ bgcolor: '#FFFFFF', boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)', mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Investment Summary</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">Total Invested</Typography>
                    <Typography variant="h6">{mockProfile.investmentHistory.totalInvested}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">Active Investments</Typography>
                    <Typography variant="h6">{mockProfile.investmentHistory.activeInvestments}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">Average Return</Typography>
                    <Typography variant="h6">{mockProfile.investmentHistory.averageReturn}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">Years Investing</Typography>
                    <Typography variant="h6">{mockProfile.investmentHistory.yearsInvesting}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Profile Details */}
          <Grid item xs={12} md={8}>
            <Card sx={{ bgcolor: '#FFFFFF', boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Personal Information</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={mockProfile.email}
                      disabled={!isEditing}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value={mockProfile.phone}
                      disabled={!isEditing}
                      margin="normal"
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>Investment Preferences</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Risk Tolerance"
                      value={mockProfile.investmentPreferences.riskTolerance}
                      disabled={!isEditing}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Preferred Sector"
                      value={mockProfile.investmentPreferences.preferredSector}
                      disabled={!isEditing}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Minimum Investment"
                      value={mockProfile.investmentPreferences.minInvestment}
                      disabled={!isEditing}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Maximum Investment"
                      value={mockProfile.investmentPreferences.maxInvestment}
                      disabled={!isEditing}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Preferred Investment Term"
                      value={mockProfile.investmentPreferences.preferredTerm}
                      disabled={!isEditing}
                      margin="normal"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}
