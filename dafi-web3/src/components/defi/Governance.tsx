import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { HowToVote, Create, Check, Close } from '@mui/icons-material';

interface ProposalProps {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'passed' | 'rejected' | 'pending';
  votesFor: number;
  votesAgainst: number;
  endDate: string;
  quorum: number;
}

const Governance: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [selectedProposal, setSelectedProposal] = React.useState<ProposalProps | null>(null);

  const mockProposals: ProposalProps[] = [
    {
      id: 'PROP-001',
      title: 'Increase Farming Rewards',
      description: 'Proposal to increase farming rewards by 20% for sustainable practices',
      status: 'active',
      votesFor: 750000,
      votesAgainst: 250000,
      endDate: '2024-12-25',
      quorum: 1000000,
    },
    {
      id: 'PROP-002',
      title: 'New Staking Pool',
      description: 'Add a new 180-day staking pool with 50% APR',
      status: 'passed',
      votesFor: 900000,
      votesAgainst: 100000,
      endDate: '2024-12-15',
      quorum: 800000,
    },
    {
      id: 'PROP-003',
      title: 'Reduce Transaction Fees',
      description: 'Reduce platform transaction fees from 0.3% to 0.2%',
      status: 'pending',
      votesFor: 0,
      votesAgainst: 0,
      endDate: '2024-12-30',
      quorum: 1000000,
    },
  ];

  const handleClickOpen = (proposal: ProposalProps) => {
    setSelectedProposal(proposal);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProposal(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'primary';
      case 'passed':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <HowToVote />;
      case 'passed':
        return <Check />;
      case 'rejected':
        return <Close />;
      default:
        return <Create />;
    }
  };

  return (
    <>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <HowToVote sx={{ mr: 1 }} />
            <Typography variant="h6">Governance</Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Create />}
            sx={{ mb: 3 }}
          >
            Create Proposal
          </Button>

          <Grid container spacing={3}>
            {mockProposals.map((proposal) => (
              <Grid item xs={12} key={proposal.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box>
                        <Typography variant="h6">{proposal.title}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {proposal.id}
                        </Typography>
                      </Box>
                      <Chip
                        icon={getStatusIcon(proposal.status)}
                        label={proposal.status.toUpperCase()}
                        color={getStatusColor(proposal.status)}
                      />
                    </Box>

                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {proposal.description}
                    </Typography>

                    {proposal.status === 'active' && (
                      <>
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="body2">
                            For: {((proposal.votesFor / proposal.quorum) * 100).toFixed(1)}%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={(proposal.votesFor / proposal.quorum) * 100}
                            color="success"
                            sx={{ mb: 1 }}
                          />
                          <Typography variant="body2">
                            Against: {((proposal.votesAgainst / proposal.quorum) * 100).toFixed(1)}%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={(proposal.votesAgainst / proposal.quorum) * 100}
                            color="error"
                          />
                        </Box>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                          Quorum: {((proposal.votesFor + proposal.votesAgainst) / proposal.quorum * 100).toFixed(1)}%
                        </Typography>
                      </>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="textSecondary">
                        Ends: {proposal.endDate}
                      </Typography>
                      {proposal.status === 'active' && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleClickOpen(proposal)}
                          >
                            Vote For
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleClickOpen(proposal)}
                          >
                            Vote Against
                          </Button>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Vote on Proposal</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            {selectedProposal?.title}
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Voting Power (DAFI tokens)"
            type="number"
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose} variant="contained">
            Submit Vote
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Governance;
