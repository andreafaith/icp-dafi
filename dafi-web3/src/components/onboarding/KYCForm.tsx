import React, { useState } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Grid,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';

const steps = ['Personal Information', 'Document Verification', 'Face Verification'];

interface PersonalInfo {
  dateOfBirth: string;
  nationality: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phoneNumber: string;
}

interface DocumentInfo {
  type: 'passport' | 'nationalId' | 'drivingLicense';
  number: string;
  expiryDate: string;
  frontImage?: File;
  backImage?: File;
}

export const KYCForm: React.FC = () => {
  const router = useRouter();
  const { submitKYC } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    dateOfBirth: '',
    nationality: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    phoneNumber: '',
  });

  const [documentInfo, setDocumentInfo] = useState<DocumentInfo>({
    type: 'passport',
    number: '',
    expiryDate: '',
  });

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonalInfo({
      ...personalInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleDocumentInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentInfo({
      ...documentInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleDocumentTypeChange = (e: any) => {
    setDocumentInfo({
      ...documentInfo,
      type: e.target.value,
    });
  };

  const handleFileUpload = (type: 'front' | 'back') => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setDocumentInfo({
        ...documentInfo,
        [type === 'front' ? 'frontImage' : 'backImage']: e.target.files[0],
      });
    }
  };

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      setLoading(true);
      try {
        const success = await submitKYC({
          personalInfo,
          documentInfo,
        });
        if (success) {
          router.push('/dashboard');
        } else {
          setError('Failed to submit KYC information');
        }
      } catch (err) {
        setError('An error occurred during KYC submission');
      } finally {
        setLoading(false);
      }
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={personalInfo.dateOfBirth}
                onChange={handlePersonalInfoChange}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Nationality"
                name="nationality"
                value={personalInfo.nationality}
                onChange={handlePersonalInfoChange}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address"
                name="address"
                value={personalInfo.address}
                onChange={handlePersonalInfoChange}
                required
                fullWidth
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="City"
                name="city"
                value={personalInfo.city}
                onChange={handlePersonalInfoChange}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Country"
                name="country"
                value={personalInfo.country}
                onChange={handlePersonalInfoChange}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Postal Code"
                name="postalCode"
                value={personalInfo.postalCode}
                onChange={handlePersonalInfoChange}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number"
                name="phoneNumber"
                value={personalInfo.phoneNumber}
                onChange={handlePersonalInfoChange}
                required
                fullWidth
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Document Type</InputLabel>
                <Select
                  value={documentInfo.type}
                  onChange={handleDocumentTypeChange}
                  label="Document Type"
                >
                  <MenuItem value="passport">Passport</MenuItem>
                  <MenuItem value="nationalId">National ID</MenuItem>
                  <MenuItem value="drivingLicense">Driving License</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Document Number"
                name="number"
                value={documentInfo.number}
                onChange={handleDocumentInfoChange}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Expiry Date"
                name="expiryDate"
                type="date"
                value={documentInfo.expiryDate}
                onChange={handleDocumentInfoChange}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ mb: 2 }}
              >
                Upload Front Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileUpload('front')}
                />
              </Button>
              {documentInfo.type !== 'passport' && (
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                >
                  Upload Back Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileUpload('back')}
                  />
                </Button>
              )}
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Box textAlign="center">
            <Typography variant="h6" gutterBottom>
              Face Verification
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={3}>
              Please ensure you are in a well-lit area and your face is clearly visible
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {/* Implement face verification */}}
              fullWidth
            >
              Start Face Verification
            </Button>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Identity Verification
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {getStepContent(activeStep)}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          onClick={handleBack}
          disabled={activeStep === 0}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={loading}
        >
          {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </Box>
    </Box>
  );
};
