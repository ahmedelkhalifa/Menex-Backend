import { createTheme } from "@mui/material";

export const buildTheme = (config) =>
  createTheme({
    palette: {
      primary: { main: config.primaryColor },
      secondary: { main: config.secondaryColor },
      background: { default: config.background, paper: config.backgroundCard },
      text: { primary: config.textPrimary,
        secondary: config.textSecondary
       }
    },
    typography: {
    fontFamily: config.font,
    h5: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },

  shape: {
    borderRadius: 10,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    }},

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    }
  });
