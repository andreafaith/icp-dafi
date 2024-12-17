import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Layout } from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';
import { useWeb3 } from '../../contexts/Web3Context';
import { Asset, Investment } from '../../types';

const InvestContent = () => {
  const { principal } = useAuth();
  const { assetActor, investmentActor } = useWeb3();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchData();
  }, [principal, assetActor, investmentActor]);

  const fetchData = async () => {
    try {
      if (!assetActor || !investmentActor || !principal) return;
      setIsLoading(true);
      const [allAssets, userInvestments] = await Promise.all([
        assetActor.getAllAssets(),
        investmentActor.getInvestmentsByInvestor(principal),
      ]);
      setAssets(allAssets);
      setInvestments(userInvestments);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvest = async () => {
    try {
      if (!principal || !investmentActor || !selectedAsset) {
        throw new Error('Not connected or no asset selected');
      }

      setIsLoading(true);
      const amount = BigInt(Number(investmentAmount) * 10 ** 8);
      await investmentActor.invest({
        assetId: selectedAsset.id,
        amount,
        investor: principal,
      });

      setOpenDialog(false);
      setSelectedAsset(null);
      setInvestmentAmount('');
      await fetchData();
    } catch (err) {
      console.error('Error investing:', err);
      setError('Failed to invest. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Investment Opportunities
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Available Assets
          </Typography>
          <Grid container spacing={3}>
            {assets.map((asset, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="h2">
                      {asset.metadata.name}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 1.5 }}>
                      {asset.metadata.type}
                    </Typography>
                    <Typography variant="body2">
                      {asset.metadata.description}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      Value per Share: {Number(asset.pricePerShare) / 10 ** 8} ICP
                    </Typography>
                    <Typography variant="body2">
                      Total Shares: {asset.totalShares.toString()}
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={() => {
                        setSelectedAsset(asset);
                        setOpenDialog(true);
                      }}
                    >
                      Invest
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Typography variant="h5" sx={{ my: 4 }}>
            My Investments
          </Typography>
          <Grid container spacing={3}>
            {investments.map((investment, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="h2">
                      Investment #{investment.id.toString()}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      Amount: {Number(investment.amount) / 10 ** 8} ICP
                    </Typography>
                    <Typography variant="body2">
                      Status: {investment.status}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Invest in {selectedAsset?.metadata.name}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Investment Amount (ICP)"
            type="number"
            fullWidth
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleInvest} variant="contained">
            Invest
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

const InvestPage = () => {
  return (
    <Layout>
      <ProtectedRoute requiredRole="investor">
        <InvestContent />
      </ProtectedRoute>
    </Layout>
  );
};

export default InvestPage;
