import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Container, Typography, Card, Grid } from '@mui/material';
import { Agriculture as FarmerIcon, AccountBalance as InvestorIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../../components/Logo';

const GetStarted = () => {
  const router = useRouter();
  const { isAuthenticated, userRole, setRole } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (userRole) {
      router.push(userRole === 'farmer' ? '/test/farmer-dashboard' : '/test/investor-dashboard');
    }
  }, [isAuthenticated, userRole, router]);

  const handleRoleSelect = (role: 'farmer' | 'investor') => {
    setRole(role);
  };

  if (!isAuthenticated || userRole) {
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Logo width={150} height={50} />
          <Typography variant="h4" component="h1" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
            Select Your Role
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Choose how you want to participate in the DaFi ecosystem
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 3,
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
              onClick={() => handleRoleSelect('farmer')}
            >
              <Box sx={{ textAlign: 'center' }}>
                <FarmerIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Farmer
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Access funding and grow your agricultural business
                </Typography>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 3,
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
              onClick={() => handleRoleSelect('investor')}
            >
              <Box sx={{ textAlign: 'center' }}>
                <InvestorIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Investor
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Invest in sustainable agriculture projects
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default GetStarted;
