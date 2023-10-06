import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    dark?: Palette['primary'];
  }
  interface PaletteOptions {
    dark?: PaletteOptions['primary'];
  }
}

const themePrimaryColor = '#ff6700';
const darkTextColor = '#101010';

const fontFamily = `'Poppins', sans-serif`;

const theme = createTheme({
  palette: {
    primary: { main: themePrimaryColor },
    dark: { main: '#222020' },
  },
  typography: {
    fontFamily,
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        h1: {
          fontSize: '40px',
          lineHeight: '50px',
          fontWeight: 600,
        },
        h2: {
          fontSize: '42px',
          lineHeight: '40px',
          fontWeight: 600,
        },
        h3: {
          fontSize: '24px',
          lineHeight: '30px',
          fontWeight: 600,
        },
        h4: {
          fontSize: '20px',
          lineHeight: '24px',
          fontWeight: 600,
        },
        h5: {
          fontSize: '20px',
          lineHeight: '26px',
          fontWeight: 500,
        },
        paragraph: {
          fontSize: '16px',
          lineHeight: '24px',
          fontWeight: 400,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily,
        },
        containedPrimary: {
          color: darkTextColor,
          borderRadius: '16px',
          boxShadow: 'none',
          ':hover': {
            opacity: 0.9,
            backgroundColor: themePrimaryColor,
            boxShadow: 'none',
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: darkTextColor,
            backgroundColor: 'white',
            textDecoration: 'underline',
            textDecorationColor: themePrimaryColor,
            fontWeight: 'bold',
            textDecorationThickness: '2px',
          },
          textDecoration: 'none',
          color: 'inherit',
          marginLeft: '0px !important',
        },
      },
    },
  },
});

export default theme;
