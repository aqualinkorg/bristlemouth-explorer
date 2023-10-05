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

const fontFamily = 'Poppins';

const theme = createTheme({
  palette: {
    primary: { main: themePrimaryColor },
    dark: { main: '#222020' },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        h1: {
          fontFamily,
          fontSize: '40px',
          lineHeight: '50px',
          fontWeight: 600,
        },
        h2: {
          fontFamily,
          fontSize: '42px',
          lineHeight: '40px',
          fontWeight: 600,
        },
        h3: {
          fontFamily,
          fontSize: '24px',
          lineHeight: '30px',
          fontWeight: 600,
        },
        h4: {
          fontFamily,
          fontSize: '20px',
          lineHeight: '24px',
          fontWeight: 600,
        },
        h5: {
          fontFamily,
          fontSize: '20px',
          lineHeight: '26px',
          fontWeight: 500,
        },
        paragraph: {
          fontFamily,
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
