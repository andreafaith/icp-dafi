import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  Security,
  CheckCircle,
  Warning,
  Error,
} from '@mui/icons-material';

interface SecurityAlert {
  id: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  timestamp: string;
}

interface SecurityPanelProps {
  alerts: SecurityAlert[];
  securityScore: number;
}

export const SecurityPanel: React.FC<SecurityPanelProps> = ({
  alerts,
  securityScore,
}) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low':
        return <CheckCircle color="success" />;
      case 'medium':
        return <Warning color="warning" />;
      case 'high':
        return <Error color="error" />;
      default:
        return <CheckCircle />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'success';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 3,
          }}
        >
          <Security color="primary" />
          <Typography variant="h6">Security Overview</Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 3,
          }}
        >
          <Typography variant="subtitle1">Security Score:</Typography>
          <Chip
            label={`${securityScore}/100`}
            color={
              securityScore >= 80
                ? 'success'
                : securityScore >= 60
                ? 'warning'
                : 'error'
            }
          />
        </Box>

        <Typography variant="subtitle1" gutterBottom>
          Recent Alerts
        </Typography>
        <List>
          {alerts.map((alert) => (
            <ListItem key={alert.id}>
              <ListItemIcon>{getSeverityIcon(alert.severity)}</ListItemIcon>
              <ListItemText
                primary={alert.message}
                secondary={new Date(alert.timestamp).toLocaleString()}
              />
              <Chip
                label={alert.severity.toUpperCase()}
                size="small"
                color={getSeverityColor(alert.severity) as any}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};
