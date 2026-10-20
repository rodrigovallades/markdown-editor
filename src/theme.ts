import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['grey'];
  }

  interface PaletteOptions {
    neutral?: PaletteOptions['grey'];
  }
}

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#5865d9', light: '#e8eaff' },
    secondary: { main: '#5865d9' },
    neutral: {
      100: '#f7f8fa',
      200: '#eef0f3',
      300: '#dfe3e8',
      400: '#c3c9d1',
      500: '#a5adb8',
      600: '#737d8b',
      700: '#4d5662',
      800: '#333a43',
      900: '#20252c',
    },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, sans-serif',
    h1: { fontSize: '2rem', fontWeight: 700 },
    h2: { fontSize: '1.5rem', fontWeight: 700 },
    h3: { fontSize: '1.25rem', fontWeight: 600 },
  },
});
