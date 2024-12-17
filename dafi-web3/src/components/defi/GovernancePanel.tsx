import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Grid,
  LinearProgress,
  Avatar,
  Divider,
} from '@mui/material';
import {
  HowToVote as VoteIcon,
  Create as CreateIcon,
} from '@mui/icons-material';
import { formatNumber } from '../../utils/format';

interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: {
    address: string;
    name: string;
  };
  status: 'active' | 'passed' | 'rejected' | 'pending';
  votingPower: number;
  votesFor: number;
  votesAgainst: number;
  endTime: string;
  hasVoted: boolean;
}

interface GovernancePanelProps {
  proposals: Proposal[];
  userVotingPower: number;
  onVote: (proposalId: string, support: boolean) => void;
  onCreateProposal: () => void;
}

export const GovernancePanel: React.FC<GovernancePanelProps> = ({
  proposals,
  userVotingPower,
  onVote,
  onCreateProposal,
}) => {
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

  const calculateProgress = (votesFor: number, votesAgainst: number) => {
    const total = votesFor + votesAgainst;
    return total > 0 ? (votesFor / total) * 100 : 0;
  };

  const formatTimeLeft = (endTime: string) => {
    const end = new Date(endTime).getTime();
    const now = new Date().getTime();
    const diff = end - now;

    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return `${days}d ${hours}h left`;
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h6">Governance</Typography>
            <Typography variant="body2" color="textSecondary">
              Your Voting Power: {formatNumber(userVotingPower)} votes
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<CreateIcon />}
            onClick={onCreateProposal}
          >
            Create Proposal
          </Button>
        </Box>

        <Grid container spacing={3}>
          {proposals.map((proposal) => (
            <Grid item xs={12} key={proposal.id}>
              <Card variant="outlined">
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box>
                      <Typography variant="h6">{proposal.title}</Typography>
                      <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                        <Avatar
                          sx={{ width: 24, height: 24 }}
                          alt={proposal.proposer.name}
                        />
                        <Typography variant="body2" color="textSecondary">
                          by {proposal.proposer.name}
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        label={proposal.status.toUpperCase()}
                        color={getStatusColor(proposal.status)}
                        size="small"
                      />
                      <Typography variant="body2" color="textSecondary">
                        {formatTimeLeft(proposal.endTime)}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="textSecondary" mb={2}>
                    {proposal.description}
                  </Typography>

                  <Box mb={2}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">
                        For: {formatNumber(proposal.votesFor)}
                      </Typography>
                      <Typography variant="body2">
                        Against: {formatNumber(proposal.votesAgainst)}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={calculateProgress(proposal.votesFor, proposal.votesAgainst)}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                      }}
                    />
                  </Box>

                  {proposal.status === 'active' && !proposal.hasVoted && (
                    <Box display="flex" gap={1}>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<VoteIcon />}
                        onClick={() => onVote(proposal.id, true)}
                        size="small"
                      >
                        Vote For
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<VoteIcon />}
                        onClick={() => onVote(proposal.id, false)}
                        size="small"
                      >
                        Vote Against
                      </Button>
                    </Box>
                  )}

                  {proposal.hasVoted && (
                    <Typography variant="body2" color="textSecondary">
                      You have already voted on this proposal
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};
