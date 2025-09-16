import { createTheme } from '@mui/material/styles';

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#218085' : '#32B8C6',
      hover: mode === 'light' ? '#1D7478' : '#2DA6B2'
    },
    secondary: { main: mode === 'light' ? '#5E5240' : '#A7A9A9' },
    background: {
      default: mode === 'light' ? '#FCFCF9' : '#0D1117',
      paper: mode === 'light' ? '#FFFFFD' : '#161B22'
    },
    text: {
      primary: mode === 'light' ? '#134252' : '#F0F6FC',
      secondary: mode === 'light' ? '#626C71' : '#8B949E'
    },
    success: { main: mode === 'light' ? '#218085' : '#32B8C6' },
    error: { main: mode === 'light' ? '#C0152F' : '#FF5459' },
    warning: { main: mode === 'light' ? '#A84B2F' : '#E68161' }
  },
  typography: {
    fontFamily: '"Inter", "Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: { fontWeight: 600, fontSize: '32px' },
    h2: { fontWeight: 600, fontSize: '24px' },
    h3: { fontWeight: 550, fontSize: '20px' },
    h4: { fontWeight: 550, fontSize: '18px' },
    h5: { fontWeight: 500, fontSize: '16px' },
    h6: { fontWeight: 500, fontSize: '14px' }
  },
  shape: { borderRadius: 12 }
});

const createAppTheme = (mode) => createTheme(getDesignTokens(mode));
export default createAppTheme;
