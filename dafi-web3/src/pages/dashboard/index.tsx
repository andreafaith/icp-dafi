import React from 'react';
import { GetServerSideProps } from 'next';
import {
    Box,
    Grid,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
} from '@mui/material';
import { Dashboard } from '../../components/analytics/Dashboard';
import { useAuth } from '../../hooks/useAuth';
import { withPageAuthRequired } from '../../utils/auth';
import { Layout } from '../../components/layout/Layout';
import { AssetList } from '../../components/assets/AssetList';
import { RecentTransactions } from '../../components/transactions/RecentTransactions';
import { QuickActions } from '../../components/dashboard/QuickActions';

const DashboardPage: React.FC = () => {
    const { user } = useAuth();

    return (
        <Layout>
            <Container maxWidth="xl">
                <Box py={4}>
                    <Grid container spacing={3}>
                        {/* Welcome Section */}
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Box>
                                            <Typography variant="h4" gutterBottom>
                                                Welcome back, {user?.name}
                                            </Typography>
                                            <Typography variant="body1" color="textSecondary">
                                                Here's what's happening with your investments today.
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                href="/assets/create"
                                            >
                                                Create New Asset
                                            </Button>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Quick Actions */}
                        <Grid item xs={12}>
                            <QuickActions />
                        </Grid>

                        {/* Analytics Dashboard */}
                        <Grid item xs={12}>
                            <Dashboard />
                        </Grid>

                        {/* Asset List */}
                        <Grid item xs={12} md={8}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Your Assets
                                    </Typography>
                                    <AssetList limit={5} />
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Recent Transactions */}
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Recent Transactions
                                    </Typography>
                                    <RecentTransactions limit={10} />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = withPageAuthRequired();

export default DashboardPage;
