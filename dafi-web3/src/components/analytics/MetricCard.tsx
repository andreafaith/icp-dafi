import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  SvgIconProps,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ComponentType<SvgIconProps>;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  subtitle?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color = 'primary',
  subtitle,
}) => {
  const theme = useTheme();

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
            {change !== undefined && (
              <Typography
                variant="body2"
                color={change >= 0 ? 'success.main' : 'error.main'}
                sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                {change >= 0 ? '+' : ''}
                {change}%
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          {Icon && (
            <Box
              sx={{
                p: 1,
                borderRadius: 1,
                bgcolor: alpha(theme.palette[color].main, 0.1),
                color: theme.palette[color].main,
              }}
            >
              <Icon />
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
