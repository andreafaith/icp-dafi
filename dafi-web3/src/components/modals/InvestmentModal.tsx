import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  InputAdornment,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

interface InvestmentModalProps {
  open: boolean;
  onClose: () => void;
  asset: {
    id: string;
    name: string;
    symbol: string;
    price: number;
    minInvestment?: number;
    maxInvestment?: number;
    balance?: number;
  };
  type: 'invest' | 'withdraw';
}

export const InvestmentModal: React.FC<InvestmentModalProps> = ({
  open,
  onClose,
  asset,
  type,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const steps = ['Enter Amount', 'Review', 'Confirm'];

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      setError(null);
    }
  };

  const validateAmount = () => {
    const numAmount = Number(amount);
    if (!amount || numAmount <= 0) {
      setError('Please enter a valid amount');
      return false;
    }
    if (asset.minInvestment && numAmount < asset.minInvestment) {
      setError(`Minimum investment amount is ${asset.minInvestment}`);
      return false;
    }
    if (asset.maxInvestment && numAmount > asset.maxInvestment) {
      setError(`Maximum investment amount is ${asset.maxInvestment}`);
      return false;
    }
    if (type === 'withdraw' && numAmount > (asset.balance || 0)) {
      setError('Insufficient balance');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (activeStep === 0 && !validateAmount()) {
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      // TODO: Implement actual investment/withdrawal logic here
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulated delay
      onClose();
      // Reset state
      setAmount('');
      setActiveStep(0);
      setTermsAccepted(false);
    } catch (err) {
      setError('Transaction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Amount"
              value={amount}
              onChange={handleAmountChange}
              type="number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
              error={!!error}
              helperText={error}
            />
            {asset.balance !== undefined && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Available Balance: ${asset.balance.toFixed(2)}
              </Typography>
            )}
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Transaction Summary
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Asset:</Typography>
              <Typography>
                {asset.name} ({asset.symbol})
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Amount:</Typography>
              <Typography>${Number(amount).toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Price per Token:</Typography>
              <Typography>${asset.price.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography>Tokens to Receive:</Typography>
              <Typography>
                {(Number(amount) / asset.price).toFixed(4)} {asset.symbol}
              </Typography>
            </Box>
            <Alert severity="info">
              Please review the transaction details carefully before proceeding.
            </Alert>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Alert severity="warning" sx={{ mb: 2 }}>
              This action cannot be undone. Please make sure you want to proceed.
            </Alert>
            <FormControlLabel
              control={
                <Checkbox
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
              }
              label="I understand and accept the terms and conditions"
            />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {type === 'invest' ? 'Invest in' : 'Withdraw from'} {asset.name}
      </DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mt: 2, mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {renderStepContent(activeStep)}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        {activeStep > 0 && (
          <Button onClick={handleBack} disabled={loading}>
            Back
          </Button>
        )}
        {activeStep === steps.length - 1 ? (
          <LoadingButton
            onClick={handleSubmit}
            loading={loading}
            disabled={!termsAccepted}
            variant="contained"
          >
            Confirm
          </LoadingButton>
        ) : (
          <Button onClick={handleNext} variant="contained" disabled={loading}>
            Next
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
