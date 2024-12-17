import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import Layout from '@/components/layouts/Layout';
import { AssetGrid } from '@/components/assets/AssetGrid';
import { AssetFilters } from '@/components/assets/AssetFilters';
import { useAssets } from '@/hooks/useAssets';
import ProtectedRoute from '../../components/auth/ProtectedRoute';

const AssetsPage = () => {
  const { assets, loading, error, filterAssets } = useAssets();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSort, setSelectedSort] = useState('marketCap');

  const filteredAssets = filterAssets(searchTerm, selectedType, selectedSort);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedSort('marketCap');
  };

  return (
    <ProtectedRoute requiredUserType="farmer">
      <Layout>
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Assets
          </Typography>

          <AssetFilters
            onSearchChange={setSearchTerm}
            onTypeChange={setSelectedType}
            onSortChange={setSelectedSort}
            onFilterClear={handleClearFilters}
            selectedType={selectedType}
            selectedSort={selectedSort}
            searchValue={searchTerm}
          />

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          ) : (
            <AssetGrid
              assets={filteredAssets}
              onAssetClick={(asset) => {
                // Handle asset click
                console.log('Asset clicked:', asset);
              }}
            />
          )}
        </Container>
      </Layout>
    </ProtectedRoute>
  );
};

export default AssetsPage;
