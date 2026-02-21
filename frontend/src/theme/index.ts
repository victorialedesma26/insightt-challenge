import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0F4C81',
    },
    secondary: {
      main: '#FF7A18',
    },
    background: {
      default: '#F5F7FB',
      paper: '#FFFFFF',
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: '"Space Grotesk", "Segoe UI", sans-serif',
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.5px',
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '-1px',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 999,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: '1px solid rgba(15, 76, 129, 0.05)',
        },
      },
    },
  },
});

export default theme;
