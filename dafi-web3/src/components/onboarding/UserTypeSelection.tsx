import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  useTheme,
} from '@mui/material';
import {
  Agriculture as FarmerIcon,
  TrendingUp as InvestorIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/router';

export type UserType = 'farmer' | 'investor';

interface UserTypeSelectionProps {
  onSelect: (type: UserType) => void;
}

export const UserTypeSelection: React.FC<UserTypeSelectionProps> = ({ onSelect }) => {
  const theme = useTheme();
  const router = useRouter();

  const userTypes = [
    {
      type: 'farmer' as UserType,
      title: 'Farmer',
      description: 'I want to list my agricultural assets and seek investment',
      icon: FarmerIcon,
      benefits: [
        'List your agricultural assets',
        'Get access to investors',
        'Manage your farm portfolio',
        'Track investments and returns',
      ],
    },
    {
      type: 'investor' as UserType,
      title: 'Investor',
      description: 'I want to invest in agricultural assets and earn returns',
      icon: InvestorIcon,
      benefits: [
        'Browse agricultural investments',
        'Diversify your portfolio',
        'Track your investments',
        'Earn sustainable returns',
      ],
    },
  ];

  const handleSelect = async (type: UserType) => {
    onSelect(type);
    router.push('/onboarding/kyc');
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Welcome to DeFi Agriculture
      </Typography>
      <Typography variant="body1" align="center" color="textSecondary" mb={6}>
        Choose how you want to participate in the platform
      </Typography>

      <Grid container spacing={4}>
        {userTypes.map(({ type, title, description, icon: Icon, benefits }) => (
          <Grid item xs={12} md={6} key={type}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                    gap: 2,
                  }}
                >
                  <Icon sx={{ fontSize: 40, color: 'primary.main' }} />
                  <Typography variant="h5">{title}</Typography>
                </Box>

                <Typography color="textSecondary" paragraph>
                  {description}
                </Typography>

                <Typography variant="subtitle2" color="primary" gutterBottom sx={{ mt: 2 }}>
                  Benefits:
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  {benefits.map((benefit, index) => (
                    <Typography
                      key={index}
                      component="li"
                      variant="body2"
                      color="textSecondary"
                      sx={{ mb: 1 }}
                    >
                      {benefit}
                    </Typography>
                  ))}
                </Box>
              </CardContent>

              <Box sx={{ p: 2, pt: 0 }}>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={() => handleSelect(type)}
                >
                  Continue as {title}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
