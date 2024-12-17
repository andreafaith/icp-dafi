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
  ListItemSecondaryAction,
  Chip,
  IconButton,
  Tooltip,
  Link,
} from '@mui/material';
import {
  SwapHoriz,
  AccountBalance,
  HowToVote,
  Launch,
  AttachMoney,
  Send,
  CallReceived,
} from '@mui/icons-material';
import { formatCurrency, formatDate } from '../../utils/format';

export interface Activity {
  id: string;
  type: 'investment' | 'staking' | 'governance' | 'transfer' | 'reward';
  title: string;
  description: string;
  amount?: number;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  transactionHash?: string;
}

interface ActivityHistoryProps {
  activities: Activity[];
}

export const ActivityHistory: React.FC<ActivityHistoryProps> = ({ activities }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'investment':
        return <AttachMoney color="primary" />;
      case 'staking':
        return <AccountBalance color="secondary" />;
      case 'governance':
        return <HowToVote color="info" />;
      case 'transfer':
        return <SwapHoriz color="action" />;
      case 'reward':
        return <CallReceived color="success" />;
      default:
        return <Send />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Activity History
        </Typography>

        <List>
          {activities.map((activity) => (
            <ListItem
              key={activity.id}
              divider
              sx={{
                '&:last-child': {
                  borderBottom: 'none',
                },
              }}
            >
              <ListItemIcon>{getActivityIcon(activity.type)}</ListItemIcon>
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="subtitle2">{activity.title}</Typography>
                    <Chip
                      label={activity.status}
                      size="small"
                      color={getStatusColor(activity.status)}
                    />
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      {activity.description}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {formatDate(activity.timestamp)}
                    </Typography>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <Box display="flex" alignItems="center" gap={1}>
                  {activity.amount && (
                    <Typography variant="body2">
                      {formatCurrency(activity.amount)}
                    </Typography>
                  )}
                  {activity.transactionHash && (
                    <Tooltip title="View on Explorer">
                      <IconButton
                        size="small"
                        component={Link}
                        href={`https://explorer.icp.xyz/transaction/${activity.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Launch fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>

        {activities.length === 0 && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight={200}
          >
            <Typography variant="body2" color="textSecondary">
              No activity to display
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
