import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  LinearProgress,
  Avatar,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
} from '@mui/material';
import {
  AccountBalanceWallet,
  Assessment,
  Agriculture,
  Star,
} from '@mui/icons-material';
import Layout from '../../components/layout/Layout';
import { mockFarmerData } from '../../mock/dashboardData';

const StatCard = ({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center" mb={2}>
        {icon}
        <Typography variant="h6" component="div" sx={{ ml: 1 }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div">
        {typeof value === 'number' && !title.includes('Rate') ? '$' : ''}{value}
        {title.includes('Rate') ? '%' : ''}
      </Typography>
    </CardContent>
  </Card>
);

const ProjectCard = ({ project }: { project: any }) => (
  <Paper sx={{ p: 2, mb: 2 }}>
    <Typography variant="h6" gutterBottom>
      {project.name}
    </Typography>
    <Box sx={{ mb: 2 }}>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography variant="body2">Progress</Typography>
        <Typography variant="body2">{project.progress}%</Typography>
      </Box>
      <LinearProgress variant="determinate" value={project.progress} />
    </Box>
    <Box display="flex" justifyContent="space-between">
      <Typography variant="body2" color="text.secondary">
        Funded: ${project.funded.toLocaleString()}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Goal: ${project.goal.toLocaleString()}
      </Typography>
    </Box>
  </Paper>
);

const FarmerDashboardTest = () => {
  const { profile, stats, activeProjects, recentTransactions } = mockFarmerData;

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Profile Section */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ width: 80, height: 80, mr: 2 }}>
                  {profile.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h4">{profile.name}</Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {profile.location} • {profile.farmSize}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    <Star sx={{ color: 'gold', mr: 1 }} />
                    <Typography variant="body1">{profile.rating} Rating</Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Stats Section */}
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Funding"
              value={stats.totalFunding}
              icon={<AccountBalanceWallet color="primary" />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Projects"
              value={stats.activeProjects}
              icon={<Assessment color="primary" />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Success Rate"
              value={stats.successRate}
              icon={<Star color="primary" />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Completed"
              value={stats.completedProjects}
              icon={<Agriculture color="primary" />}
            />
          </Grid>

          {/* Active Projects */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Active Projects
              </Typography>
              {activeProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </Paper>
          </Grid>

          {/* Recent Transactions */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Recent Transactions
              </Typography>
              <List>
                {recentTransactions.map((transaction) => (
                  <React.Fragment key={transaction.id}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between">
                            <Typography>{transaction.type}</Typography>
                            <Typography color={transaction.type.includes('Received') ? 'success.main' : 'primary'}>
                              ${transaction.amount.toLocaleString()}
                            </Typography>
                          </Box>
                        }
                        secondary={transaction.date}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default FarmerDashboardTest;
