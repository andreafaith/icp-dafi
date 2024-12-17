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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Layout } from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';
import { useWeb3 } from '../../contexts/Web3Context';
import { Asset } from '../../types';

const FarmsContent = () => {
  const { principal } = useAuth();
  const { assetActor } = useWeb3();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newAsset, setNewAsset] = useState({
    name: '',
    description: '',
    assetType: '',
    value: '',
  });

  useEffect(() => {
    fetchAssets();
  }, [principal, assetActor]);

  const fetchAssets = async () => {
    try {
      if (!principal || !assetActor) return;
      setIsLoading(true);
      const userAssets = await assetActor.getAssetsByOwner(principal);
      setAssets(userAssets);
      setError(null);
    } catch (err) {
      console.error('Error fetching assets:', err);
      setError('Failed to fetch assets. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAsset = async () => {
    try {
      if (!principal || !assetActor) {
        throw new Error('Not connected');
      }

      setIsLoading(true);
      await assetActor.tokenizeAsset({
        owner: principal,
        metadata: {
          name: newAsset.name,
          description: newAsset.description,
          type: newAsset.assetType,
          location: '',
        },
        totalShares: BigInt(100),
        pricePerShare: BigInt(Number(newAsset.value) * 10 ** 8),
      });

      setOpenDialog(false);
      setNewAsset({
        name: '',
        description: '',
        assetType: '',
        value: '',
      });
      await fetchAssets();
    } catch (err) {
      console.error('Error creating asset:', err);
      setError('Failed to create asset. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Farm Assets
        </Typography>
        <Button
          variant="contained"
          onClick={() => setOpenDialog(true)}
          sx={{
            backgroundColor: 'primary.main',
            '&:hover': { backgroundColor: 'primary.dark' },
          }}
        >
          Add New Asset
        </Button>
      </Box>

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
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Farm Asset</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Asset Name"
            fullWidth
            value={newAsset.name}
            onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Asset Type"
            fullWidth
            value={newAsset.assetType}
            onChange={(e) => setNewAsset({ ...newAsset, assetType: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={newAsset.description}
            onChange={(e) => setNewAsset({ ...newAsset, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Value per Share (ICP)"
            fullWidth
            type="number"
            value={newAsset.value}
            onChange={(e) => setNewAsset({ ...newAsset, value: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateAsset} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

const FarmsPage = () => {
  return (
    <Layout>
      <ProtectedRoute requiredRole="farmer">
        <FarmsContent />
      </ProtectedRoute>
    </Layout>
  );
};

export default FarmsPage;
