import { createTheme, responsiveFontSizes } from '@mui/material/styles';
// import { ruRU } from '@mui/material/locale';
// import { red } from "@mui/material/colors";

// Create a theme instance
// eslint-disable-next-line import/no-mutable-exports
let theme = createTheme(
  /*
  {
    palette: {
      primary: { main: '#ff9e01' },
      secondary: { main: '#ffffff' },
      info: { main: '#000000' },
    },
    typography: {
      h4: { fontFamily: ['"Playfair Display"', 'serif'].join(',') },
      h6: { fontFamily: ['"Playfair Display"', 'serif'].join(',') },
    },
  },
  ruRU,
  */
  {},
);

theme = responsiveFontSizes(theme);

export default theme;
