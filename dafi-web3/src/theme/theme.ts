import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#132A13', // Dark green
      light: '#31572C', // Hunter green
      dark: '#090F09',
    },
    secondary: {
      main: '#4F772D', // Fern green
      light: '#90A955', // Moss green
      dark: '#2D4419',
    },
    success: {
      main: '#90A955', // Moss green
      light: '#ECF39E', // Mindaro
      dark: '#4F772D', // Fern green
    },
    background: {
      default: '#F6F8F3',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #132A13 30%, #31572C 90%)',
        },
        containedSecondary: {
          background: 'linear-gradient(45deg, #4F772D 30%, #90A955 90%)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        },
      },
    },
  },
});

export default theme;
