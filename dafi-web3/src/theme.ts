import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2E5B2E',
      light: '#4C7C4C',
      dark: '#1F3F1F',
    },
    secondary: {
      main: '#F8B133',
      light: '#FFC85C',
      dark: '#D99B2B',
    },
    background: {
      default: '#FDFBF7',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#666666',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#FDFBF7',
        },
      },
    },
    MuiBox: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FDFBF7',
          borderRight: '1px solid rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          padding: '8px 24px',
          fontSize: '1rem',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
          backgroundColor: '#FFFFFF',
        },
      },
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#1A1A1A',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#1A1A1A',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#1A1A1A',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#1A1A1A',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#1A1A1A',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#1A1A1A',
    },
    body1: {
      fontSize: '1rem',
      color: '#1A1A1A',
    },
    body2: {
      fontSize: '0.875rem',
      color: '#666666',
    },
  },
});

export default theme;
