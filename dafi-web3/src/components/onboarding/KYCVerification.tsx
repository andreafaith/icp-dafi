import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Alert,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { kycService, KYCVerificationResult, KYCData, KYCDocument } from '../../services/kyc';

interface KYCVerificationProps {
  onComplete: (result: KYCVerificationResult) => void;
}

export const KYCVerification: React.FC<KYCVerificationProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<KYCVerificationResult | null>(null);
  
  const [formData, setFormData] = useState<KYCData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: '',
    address: '',
    userType: 'investor',
  });

  const [documents, setDocuments] = useState<KYCDocument[]>([]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserTypeChange = (e: any) => {
    setFormData(prev => ({
      ...prev,
      userType: e.target.value
    }));
  };

  const handleFileUpload = (type: 'passport' | 'national_id' | 'driving_license') => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newDoc: KYCDocument = {
        file: e.target.files[0],
        type: type
      };
      setDocuments(prev => [...prev, newDoc]);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await kycService.submitKYC(formData, documents);
      setVerificationResult(result);
      onComplete(result);
      setActiveStep(2);
    } catch (err) {
      setError('KYC submission failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = ['Personal Information', 'Document Upload', 'Complete'];

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
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

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {activeStep === 0 && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box component="form" sx={{ '& .MuiTextField-root': { mb: 2 } }}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleFormChange}
            />
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleFormChange}
            />
            <TextField
              fullWidth
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleFormChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Nationality"
              name="nationality"
              value={formData.nationality}
              onChange={handleFormChange}
            />
            <TextField
              fullWidth
              label="Address"
              name="address"
              multiline
              rows={3}
              value={formData.address}
              onChange={handleFormChange}
            />
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>User Type</InputLabel>
              <Select
                value={formData.userType}
                onChange={handleUserTypeChange}
                label="User Type"
              >
                <MenuItem value="farmer">Farmer</MenuItem>
                <MenuItem value="investor">Investor</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => setActiveStep(1)}
            >
              Next
            </Button>
          </Box>
        </Paper>
      )}

      {activeStep === 1 && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography paragraph>
            Please upload at least one of the following documents:
          </Typography>
          
          <Box sx={{ '& > *': { mb: 2 } }}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
            >
              Upload Passport
              <input
                type="file"
                hidden
                accept="image/*,.pdf"
                onChange={handleFileUpload('passport')}
              />
            </Button>

            <Button
              variant="outlined"
              component="label"
              fullWidth
            >
              Upload National ID
              <input
                type="file"
                hidden
                accept="image/*,.pdf"
                onChange={handleFileUpload('national_id')}
              />
            </Button>

            <Button
              variant="outlined"
              component="label"
              fullWidth
            >
              Upload Driving License
              <input
                type="file"
                hidden
                accept="image/*,.pdf"
                onChange={handleFileUpload('driving_license')}
              />
            </Button>
          </Box>

          {documents.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Uploaded Documents:</Typography>
              {documents.map((doc, index) => (
                <Typography key={index} color="textSecondary">
                  • {doc.file.name} ({doc.type})
                </Typography>
              ))}
            </Box>
          )}

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleSubmit}
            disabled={documents.length === 0}
          >
            Submit Verification
          </Button>
        </Paper>
      )}

      {activeStep === 2 && verificationResult && (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          <Alert severity="success" sx={{ mb: 3 }}>
            Documents submitted successfully
          </Alert>
          <Typography paragraph>
            Your verification is being processed. We'll notify you once it's complete.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Reference ID: {verificationResult.documentId}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};
