import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    dark: Palette['primary'];
  }
  interface PaletteOptions {
    dark: PaletteOptions['primary'];
  }
}

const theme = createTheme({
  palette: {
    primary: { main: '#ff6700' },
    dark: { main: '#222020' },
  },
});

export default theme;
