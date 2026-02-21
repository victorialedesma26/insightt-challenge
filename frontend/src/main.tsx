import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthProvider';
import theme from './theme';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3} autoHideDuration={3000} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  </StrictMode>,
);
