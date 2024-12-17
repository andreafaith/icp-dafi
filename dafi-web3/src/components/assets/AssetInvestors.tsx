import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
} from '@mui/material';

interface Investor {
  id: string;
  name: string;
  avatar?: string;
  amount: string;
  share: number;
  joinedAt: string;
}

interface AssetInvestorsProps {
  investors: Investor[];
}

export const AssetInvestors: React.FC<AssetInvestorsProps> = ({ investors }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Top Investors
        </Typography>
        <List>
          {investors.map((investor) => (
            <ListItem key={investor.id} divider>
              <ListItemAvatar>
                <Avatar src={investor.avatar} alt={investor.name}>
                  {investor.name.charAt(0)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={investor.name}
                secondary={
                  <Box component="span" sx={{ display: 'flex', gap: 1 }}>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {investor.amount}
                    </Typography>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                    >
                      • Joined {investor.joinedAt}
                    </Typography>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <Chip
                  label={`${investor.share}%`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};
