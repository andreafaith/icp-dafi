import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Box,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
} from '@mui/material';
import { TokenOutlined, VerifiedUser, AttachMoney } from '@mui/icons-material';

const steps = ['Farm Verification', 'Asset Valuation', 'Token Generation'];

interface TokenizationCardProps {
  farmData: {
    id: number;
    name: string;
    location: string;
    size: string;
    currentValue: number;
    isTokenized: boolean;
  };
}

export const TokenizationCard: React.FC<TokenizationCardProps> = ({ farmData }) => {
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tokenDetails, setTokenDetails] = useState({
    tokenName: '',
    tokenSymbol: '',
    totalSupply: '',
    pricePerToken: '',
  });

  const handleTokenization = async () => {
    setLoading(true);
    // Simulate tokenization process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setActiveStep(prevStep => prevStep + 1);
  };

  const handleClose = () => {
    setOpen(false);
    setActiveStep(0);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ p: 2 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              We'll verify your farm ownership and details
            </Alert>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Farm Details:</Typography>
                <Typography>Name: {farmData.name}</Typography>
                <Typography>Location: {farmData.location}</Typography>
                <Typography>Size: {farmData.size}</Typography>
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ p: 2 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              Professional valuation of your farm assets
            </Alert>
            <Typography variant="h6" gutterBottom>
              Estimated Farm Value: ${farmData.currentValue.toLocaleString()}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Additional Notes"
                  multiline
                  rows={4}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Token Name"
                  value={tokenDetails.tokenName}
                  onChange={(e) => setTokenDetails({ ...tokenDetails, tokenName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Token Symbol"
                  value={tokenDetails.tokenSymbol}
                  onChange={(e) => setTokenDetails({ ...tokenDetails, tokenSymbol: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Total Supply"
                  type="number"
                  value={tokenDetails.totalSupply}
                  onChange={(e) => setTokenDetails({ ...tokenDetails, totalSupply: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price per Token"
                  type="number"
                  value={tokenDetails.pricePerToken}
                  onChange={(e) => setTokenDetails({ ...tokenDetails, pricePerToken: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <TokenOutlined sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography variant="h6">Farm Tokenization</Typography>
          </Box>
          <Typography color="textSecondary" gutterBottom>
            Convert your farm assets into tradeable digital tokens
          </Typography>
          <Box mt={2}>
            {farmData.isTokenized ? (
              <Alert severity="success">
                Your farm has been successfully tokenized!
              </Alert>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpen(true)}
                startIcon={<AttachMoney />}
              >
                Start Tokenization
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Farm Tokenization Process</DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ py: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {renderStepContent(activeStep)}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleTokenization}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Next'}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              onClick={handleClose}
              disabled={loading}
            >
              Complete Tokenization
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};
