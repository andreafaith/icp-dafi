import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  useTheme,
} from '@mui/material';
import {
  Agriculture as FarmerIcon,
  AccountBalance as InvestorIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/Logo';

const RoleSelection = () => {
  const { setRole, isLoading } = useAuth();
  const theme = useTheme();

  const handleRoleSelect = (role: 'farmer' | 'investor') => {
    setRole(role);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
        py: 12,
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Logo />
          </Box>

          <Paper
            elevation={24}
            sx={{
              p: 4,
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                Choose Your Role
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Select how you want to use DAFI
              </Typography>
            </Box>

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Paper
                    elevation={4}
                    sx={{
                      p: 3,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.02)',
                      },
                    }}
                    onClick={() => handleRoleSelect('farmer')}
                  >
                    <FarmerIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                      Farmer
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      Manage your farm, track resources, and access agricultural finance
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ mt: 3 }}
                      onClick={() => handleRoleSelect('farmer')}
                      disabled={isLoading}
                    >
                      Continue as Farmer
                    </Button>
                  </Paper>
                </motion.div>
              </Grid>

              <Grid item xs={12} md={6}>
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Paper
                    elevation={4}
                    sx={{
                      p: 3,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.02)',
                      },
                    }}
                    onClick={() => handleRoleSelect('investor')}
                  >
                    <InvestorIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                      Investor
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      Invest in agricultural projects and manage your portfolio
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ mt: 3 }}
                      onClick={() => handleRoleSelect('investor')}
                      disabled={isLoading}
                    >
                      Continue as Investor
                    </Button>
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default RoleSelection;
