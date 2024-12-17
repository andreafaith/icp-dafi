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
import Layout from '@/components/layouts/Layout';

// Mock farmer profile data
const mockProfile = {
  name: 'John Smith',
  email: 'john.smith@example.com',
  phone: '+1 (555) 123-4567',
  farmName: 'Smith Family Farm',
  location: 'Sacramento, CA',
  farmSize: '500 acres',
  farmType: 'Mixed Crops',
  mainCrops: ['Corn', 'Soybeans', 'Wheat'],
  yearsFarming: 15,
  certifications: ['Organic Certified', 'Sustainable Agriculture'],
};

export default function FarmersProfile() {
  const [isEditing, setIsEditing] = React.useState(false);

  return (
    <Layout>
      <Box sx={{ width: '100%' }}>
        <Typography variant="h4" sx={{ mb: 4 }}>Farmer Profile</Typography>

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
                <Typography color="textSecondary" gutterBottom>{mockProfile.farmName}</Typography>
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

                <Typography variant="h6" gutterBottom>Farm Information</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Farm Name"
                      value={mockProfile.farmName}
                      disabled={!isEditing}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Location"
                      value={mockProfile.location}
                      disabled={!isEditing}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Farm Size"
                      value={mockProfile.farmSize}
                      disabled={!isEditing}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Farm Type"
                      value={mockProfile.farmType}
                      disabled={!isEditing}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Main Crops"
                      value={mockProfile.mainCrops.join(', ')}
                      disabled={!isEditing}
                      margin="normal"
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>Certifications</Typography>
                <Grid container spacing={2}>
                  {mockProfile.certifications.map((cert, index) => (
                    <Grid item xs={12} key={index}>
                      <TextField
                        fullWidth
                        label={`Certification ${index + 1}`}
                        value={cert}
                        disabled={!isEditing}
                        margin="normal"
                      />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}
