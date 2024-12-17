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
    Tabs,
    Tab,
    Divider,
    Chip,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    Favorite,
    Share,
    BarChart,
    Description,
    People,
    AttachMoney,
    History,
} from '@mui/icons-material';
import { Layout } from '../../../components/layout/Layout';
import { AssetChart } from '../../../components/assets/AssetChart';
import { AssetDetails } from '../../../components/assets/AssetDetails';
import { AssetInvestors } from '../../../components/assets/AssetInvestors';
import { AssetTransactions } from '../../../components/assets/AssetTransactions';
import { InvestmentModal } from '../../../components/modals/InvestmentModal';
import { useAsset } from '../../../hooks/useAsset';
import { withPageAuthRequired } from '../../../utils/auth';
import { formatCurrency } from '../../../utils/format';

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

const AssetPage: React.FC = () => {
    const [tabValue, setTabValue] = useState(0);
    const [investModalOpen, setInvestModalOpen] = useState(false);
    const { asset, loading, error } = useAsset();

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error || !asset) {
        return <div>Error loading asset</div>;
    }

    return (
        <Layout>
            <Container maxWidth="xl">
                <Box py={4}>
                    {/* Header */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                        <Box>
                            <Typography variant="h4" gutterBottom>
                                {asset.name}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Chip
                                    label={asset.category}
                                    color="primary"
                                    variant="outlined"
                                />
                                <Chip
                                    label={asset.status}
                                    color={asset.status === 'Active' ? 'success' : 'default'}
                                />
                                <Typography variant="body2" color="textSecondary">
                                    Created by {asset.owner.name}
                                </Typography>
                            </Box>
                        </Box>
                        <Box display="flex" gap={2}>
                            <Tooltip title="Add to Watchlist">
                                <IconButton>
                                    <Favorite />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Share">
                                <IconButton>
                                    <Share />
                                </IconButton>
                            </Tooltip>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setInvestModalOpen(true)}
                            >
                                Invest Now
                            </Button>
                        </Box>
                    </Box>

                    {/* Overview Cards */}
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Current Value
                                    </Typography>
                                    <Typography variant="h5">
                                        {formatCurrency(asset.currentValue)}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color={asset.valueChange >= 0 ? 'success.main' : 'error.main'}
                                    >
                                        {asset.valueChange >= 0 ? '+' : ''}{asset.valueChange}%
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Total Investment
                                    </Typography>
                                    <Typography variant="h5">
                                        {formatCurrency(asset.totalInvestment)}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        From {asset.investorsCount} investors
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        ROI
                                    </Typography>
                                    <Typography variant="h5">
                                        {asset.roi}%
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Annual return
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Risk Score
                                    </Typography>
                                    <Typography variant="h5">
                                        {asset.riskScore}/10
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {asset.riskLevel} risk
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Tabs and Content */}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            aria-label="asset tabs"
                        >
                            <Tab icon={<BarChart />} label="Performance" />
                            <Tab icon={<Description />} label="Details" />
                            <Tab icon={<People />} label="Investors" />
                            <Tab icon={<History />} label="Transactions" />
                        </Tabs>
                    </Box>

                    <TabPanel value={tabValue} index={0}>
                        <AssetChart asset={asset} />
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        <AssetDetails asset={asset} />
                    </TabPanel>
                    <TabPanel value={tabValue} index={2}>
                        <AssetInvestors assetId={asset.id} />
                    </TabPanel>
                    <TabPanel value={tabValue} index={3}>
                        <AssetTransactions assetId={asset.id} />
                    </TabPanel>
                </Box>
            </Container>

            {/* Investment Modal */}
            <InvestmentModal
                open={investModalOpen}
                onClose={() => setInvestModalOpen(false)}
                asset={asset}
            />
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = withPageAuthRequired();

export default AssetPage;
