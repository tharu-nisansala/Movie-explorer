import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) =>
  createTheme({
    palette:
      mode === 'dark'
        ? { mode, primary: { main: '#7C4DFF' }, background: { default: '#0B0B14', paper: '#14141F' } }
        : { mode, primary: { main: '#5B34D6' }, background: { default: '#F4F2FA', paper: '#FFFFFF' } },
    shape: { borderRadius: 10 },
  });