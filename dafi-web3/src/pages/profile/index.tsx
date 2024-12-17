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
    Avatar,
    Tabs,
    Tab,
    TextField,
    Divider,
} from '@mui/material';
import {
    Person,
    Security,
    Notifications,
    AccountBalance,
    History,
} from '@mui/icons-material';
import { Layout } from '../../components/layout/Layout';
import { ProfileForm } from '../../components/profile/ProfileForm';
import { SecuritySettings } from '../../components/profile/SecuritySettings';
import { NotificationSettings } from '../../components/profile/NotificationSettings';
import { WalletSettings } from '../../components/profile/WalletSettings';
import { ActivityHistory } from '../../components/profile/ActivityHistory';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { withPageAuthRequired } from '../../utils/auth';

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
            id={`profile-tabpanel-${index}`}
            aria-labelledby={`profile-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const ProfilePage: React.FC = () => {
    const [tabValue, setTabValue] = useState(0);
    const { user } = useAuth();
    const { profile, loading, error, updateProfile } = useProfile();

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error || !profile) {
        return <div>Error loading profile</div>;
    }

    return (
        <Layout>
            <Container maxWidth="xl">
                <Box py={4}>
                    {/* Header */}
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                                        <Avatar
                                            src={profile.avatar}
                                            alt={profile.name}
                                            sx={{ width: 120, height: 120 }}
                                        />
                                        <Typography variant="h5">
                                            {profile.name}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Member since {new Date(profile.createdAt).toLocaleDateString()}
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            fullWidth
                                        >
                                            Edit Profile Picture
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Card>
                                <CardContent>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={4}>
                                            <Typography variant="subtitle2" color="textSecondary">
                                                Total Assets
                                            </Typography>
                                            <Typography variant="h5">
                                                {profile.stats.totalAssets}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Typography variant="subtitle2" color="textSecondary">
                                                Total Investments
                                            </Typography>
                                            <Typography variant="h5">
                                                ${profile.stats.totalInvestments.toLocaleString()}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Typography variant="subtitle2" color="textSecondary">
                                                Portfolio Value
                                            </Typography>
                                            <Typography variant="h5">
                                                ${profile.stats.portfolioValue.toLocaleString()}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Tabs and Content */}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            aria-label="profile tabs"
                        >
                            <Tab icon={<Person />} label="Profile" />
                            <Tab icon={<Security />} label="Security" />
                            <Tab icon={<Notifications />} label="Notifications" />
                            <Tab icon={<AccountBalance />} label="Wallet" />
                            <Tab icon={<History />} label="Activity" />
                        </Tabs>
                    </Box>

                    <TabPanel value={tabValue} index={0}>
                        <ProfileForm
                            profile={profile}
                            onSubmit={updateProfile}
                        />
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        <SecuritySettings />
                    </TabPanel>
                    <TabPanel value={tabValue} index={2}>
                        <NotificationSettings />
                    </TabPanel>
                    <TabPanel value={tabValue} index={3}>
                        <WalletSettings />
                    </TabPanel>
                    <TabPanel value={tabValue} index={4}>
                        <ActivityHistory />
                    </TabPanel>
                </Box>
            </Container>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = withPageAuthRequired();

export default ProfilePage;
