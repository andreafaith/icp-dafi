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
    CircularProgress,
    Alert,
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
import { useRouter } from 'next/router';
import Layout from '../../../components/layout/Layout';
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
    const router = useRouter();
    const { id } = router.query;
    const [tabValue, setTabValue] = useState(0);
    const [investModalOpen, setInvestModalOpen] = useState(false);
    const { asset, priceHistory, investors, transactions, loading, error } = useAsset(id as string);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    if (loading) {
        return (
            <Layout>
                <Container>
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                        <CircularProgress />
                    </Box>
                </Container>
            </Layout>
        );
    }

    if (error || !asset) {
        return (
            <Layout>
                <Container>
                    <Alert severity="error" sx={{ mt: 4 }}>
                        {error || 'Failed to load asset'}
                    </Alert>
                </Container>
            </Layout>
        );
    }

    return (
        <Layout>
            <Container maxWidth="xl">
                <Box py={4}>
                    {/* Header */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                        <Box>
                            <Typography variant="h4" gutterBottom>
                                {asset.name} ({asset.symbol})
                            </Typography>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Typography variant="h5" color="primary">
                                    {formatCurrency(asset.price)}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color={asset.change24h >= 0 ? 'success.main' : 'error.main'}
                                >
                                    {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                                </Typography>
                            </Box>
                        </Box>
                        <Box display="flex" gap={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AttachMoney />}
                                onClick={() => setInvestModalOpen(true)}
                            >
                                Invest
                            </Button>
                            <IconButton>
                                <Favorite />
                            </IconButton>
                            <IconButton>
                                <Share />
                            </IconButton>
                        </Box>
                    </Box>

                    {/* Tabs */}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tabValue} onChange={handleTabChange}>
                            <Tab icon={<BarChart />} label="Overview" />
                            <Tab icon={<Description />} label="Details" />
                            <Tab icon={<People />} label="Investors" />
                            <Tab icon={<History />} label="Transactions" />
                        </Tabs>
                    </Box>

                    {/* Tab Panels */}
                    <TabPanel value={tabValue} index={0}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <AssetChart data={priceHistory.map(p => ({ timestamp: p.timestamp, value: p.price }))} />
                            </Grid>
                        </Grid>
                    </TabPanel>

                    <TabPanel value={tabValue} index={1}>
                        <AssetDetails asset={asset} />
                    </TabPanel>

                    <TabPanel value={tabValue} index={2}>
                        <AssetInvestors investors={investors} />
                    </TabPanel>

                    <TabPanel value={tabValue} index={3}>
                        <AssetTransactions transactions={transactions} />
                    </TabPanel>
                </Box>
            </Container>

            <InvestmentModal
                open={investModalOpen}
                onClose={() => setInvestModalOpen(false)}
                asset={asset}
                type="invest"
            />
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = withPageAuthRequired();

export default AssetPage;
