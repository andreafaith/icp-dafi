import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    TextField,
    InputAdornment,
    Tabs,
    Tab,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { Layout } from '../../components/layout/Layout';
import { AssetGrid } from '../../components/assets/AssetGrid';
import { AssetFilters } from '../../components/assets/AssetFilters';
import { withPageAuthRequired } from '../../utils/auth';
import { useAssets } from '../../hooks/useAssets';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`asset-tabpanel-${index}`}
            aria-labelledby={`asset-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const AssetsPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [tabValue, setTabValue] = useState(0);
    const [filters, setFilters] = useState({
        category: 'all',
        status: 'all',
        sortBy: 'newest'
    });

    const { assets, loading, error } = useAssets({
        search: searchQuery,
        filters
    });

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleFilterChange = (newFilters: typeof filters) => {
        setFilters(newFilters);
    };

    return (
        <Layout>
            <Container maxWidth="xl">
                <Box py={4}>
                    {/* Header */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                        <Typography variant="h4">
                            Assets
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            href="/assets/create"
                        >
                            Create New Asset
                        </Button>
                    </Box>

                    {/* Search and Filters */}
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} md={8}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Search assets..."
                                value={searchQuery}
                                onChange={handleSearch}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <AssetFilters
                                filters={filters}
                                onChange={handleFilterChange}
                            />
                        </Grid>
                    </Grid>

                    {/* Tabs */}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            aria-label="asset tabs"
                        >
                            <Tab label="All Assets" />
                            <Tab label="My Assets" />
                            <Tab label="Invested Assets" />
                            <Tab label="Watchlist" />
                        </Tabs>
                    </Box>

                    {/* Tab Panels */}
                    <TabPanel value={tabValue} index={0}>
                        <AssetGrid
                            assets={assets}
                            loading={loading}
                            error={error}
                            type="all"
                        />
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        <AssetGrid
                            assets={assets?.filter(asset => asset.isOwner)}
                            loading={loading}
                            error={error}
                            type="owned"
                        />
                    </TabPanel>
                    <TabPanel value={tabValue} index={2}>
                        <AssetGrid
                            assets={assets?.filter(asset => asset.hasInvested)}
                            loading={loading}
                            error={error}
                            type="invested"
                        />
                    </TabPanel>
                    <TabPanel value={tabValue} index={3}>
                        <AssetGrid
                            assets={assets?.filter(asset => asset.inWatchlist)}
                            loading={loading}
                            error={error}
                            type="watchlist"
                        />
                    </TabPanel>
                </Box>
            </Container>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = withPageAuthRequired();

export default AssetsPage;
