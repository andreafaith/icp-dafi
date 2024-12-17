import React from 'react';
import { Box, Container, Grid, Typography, IconButton } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  github: string;
  linkedin: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Bartolome, Java Jay J. ( Tadashi Jei )',
    role: 'Full Stack Developer',
    image: '/images/team/dev1.jpg',
    github: 'https://github.com/MATH014',
    linkedin: 'https://www.linkedin.com/in/java-jay-bartolome/',
  },
  {
    name: 'Andrea Faith Alimorong',
    role: 'Cloud Engineer',
    image: '/images/team/dev2.jpg',
    github: 'https://github.com/andreafaith',
    linkedin: 'https://www.linkedin.com/in/andrea-faith-alimorong/',
  },
  {
    name: 'Jean Carlo M. Sanjuan',
    role: 'Software Engineer',
    image: '/images/team/dev3.jpg',
    github: 'https://github.com/jeancarlo-schmitz',
    linkedin: 'https://www.linkedin.com/in/jean-carlo-sanjuan/',
  },
];

const TeamSection = () => {
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          component="h2"
          align="center"
          gutterBottom
          sx={{ mb: 6, color: '#132A13', fontWeight: 'bold' }}
        >
          Meet Our Team
        </Typography>
        <Typography
          variant="h5"
          align="center"
          sx={{ mb: 8, color: '#132A13' }}
        >
          The developers behind DAFI Platform
        </Typography>

        <Grid container spacing={6} justifyContent="center">
          {teamMembers.map((member, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  paddingTop: '100%',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    '& .member-info': {
                      opacity: 1,
                    },
                    '& .member-name': {
                      opacity: 0,
                    },
                  },
                }}
              >
                {/* Image Container */}
                <Box
                  component="img"
                  src={member.image}
                  alt={member.name}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />

                {/* Name at bottom (visible by default) */}
                <Box
                  className="member-name"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    bgcolor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    p: 2,
                    transition: 'opacity 0.3s ease-in-out',
                  }}
                >
                  <Typography variant="h6" sx={{ textAlign: 'center', color: 'white' }}>
                    {member.name}
                  </Typography>
                </Box>

                {/* Overlay with Member Info (hidden by default) */}
                <Box
                  className="member-info"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: 'rgba(0, 0, 0, 0.85)',
                    color: 'white',
                    p: 3,
                    opacity: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    transition: 'opacity 0.3s ease-in-out',
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 1, textAlign: 'center', color: 'white' }}>
                    {member.name}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2, textAlign: 'center', color: 'white' }}>
                    {member.role}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <IconButton
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                        color: 'white',
                        '&:hover': { 
                          color: '#4CAF50',
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                        }
                      }}
                    >
                      <GitHubIcon />
                    </IconButton>
                    <IconButton
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                        color: 'white',
                        '&:hover': { 
                          color: '#4CAF50',
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                        }
                      }}
                    >
                      <LinkedInIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TeamSection;
