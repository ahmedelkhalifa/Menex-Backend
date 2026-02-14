import { StrictMode, useMemo, useState, createContext, useContext, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import './index.css'
import "./i18n";
import App from './App.jsx'
import i18n from './i18n';
import { useTranslation } from 'react-i18next';
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";

// const theme = createTheme({
//   palette: {
//     primary: { main: "#1F2933" },
//     secondary: { main: "#374151" },
//     warning: { main: "#F59E0B" },
//     background: {
//       default: "#F9FAFB",
//       paper: "#FFFFFF",
//     },
//     text: {
//       primary: "#111827",
//       secondary: "#6B7280",
//     },
//   },
// });

// const theme = createTheme({
//   palette: {
//     primary: { main: "#EF4444" },        // tomato red, for primary actions / highlights
//     secondary: { main: "#F59E0B" },      // orange/golden, for secondary buttons or hover
//     success: { main: "#10B981" },        // green, for success messages / active items
//     warning: { main: "#FBBF24" },        // yellow, for warnings / alerts
//     background: {
//       default: "#FFF7ED",                // very light cream, soft page background
//       paper: "#FFFFFF",                   // white for cards / panels
//     },
//     text: {
//       primary: "#1F2933",                // dark gray for readability
//       secondary: "#4B5563",              // medium gray for muted text
//     },
//   },
// });

// const theme = createTheme({
//   palette: {
//     primary: { main: "#256D85" },        // deep teal blue, for main actions & selected sidebar
//     secondary: { main: "#F97316" },      // warm orange, for hover effects or highlights
//     success: { main: "#10B981" },        // fresh green, for available items / success messages
//     warning: { main: "#FBBF24" },        // golden yellow, for alerts / attention
//     error: { main: "#EF4444" },          // tomato red, for errors or critical actions
//     background: {
//       default: "#F0F9F9",                // very light tealish cream, soft page background
//       paper: "#FFFFFF",                   // white for cards, panels
//     },
//     text: {
//       primary: "#1F2933",                 // dark gray, for readability
//       secondary: "#4B5563",               // medium gray, for secondary/muted text
//     },
//   },
// });

const lightTheme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#6FBF73", // logo green
      dark: "#4FA65A",
      light: "rgba(20, 230, 69, 0.1)",
      contrastText: "#ffffff",
    },

    secondary: {
      main: "#2E3A3A", // dark charcoal from logo
    },

    background: {
      default: "#F6F8F7", // soft dashboard background
      paper: "#FFFFFF",
      sidebar: "#f9fafb"
    },

    text: {
      primary: "#2E3A3A",
      secondary: "#5F6F6F",
    },

    success: {
      main: "#5CB85C",
      light: "#81C784",
    },

    error: {
      main: "#D32F2F",
      light: "#fce4e3",
    },

    divider: "#E0E5E3",
  },

  typography: {
    fontFamily: i18n.language === "ar"
        ? "Cairo"
        : `"Inter", "Roboto", "Helvetica", "Arial", sans-serif`,
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
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#F0F4F2",
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: "#E8F3EC",
            color: "#2E3A3A",
            "& .MuiListItemIcon-root": {
              color: "#2E3A3A",
            },
          },
          "&.Mui-selected:hover": {
            backgroundColor: "#DFF0E6",
          },
        },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: "#6FBF73",   // brand green
      light: "#8FD19E",
      dark: "#4FA65A",
      contrastText: "#0F1A17",
    },

    secondary: {
      main: "#A3D9B1",
    },

    background: {
      default: "#0f1a17", // dark green-charcoal
      paper: "#162521",
      sidebar: "#13201C"
    },

    text: {
      primary: "#E6F1EC",
      secondary: "#9FB7AF",
    },

    divider: "#233833",

    success: {
      main: "#6FBF73",
    },

    error: {
      main: "#EF5350",
      light: "#e57373",
    },
  },

  typography: {
    fontFamily: `"Inter", "Roboto", "Helvetica", "Arial", sans-serif`,
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
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          borderRadius: 12,
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#1C2F2A",
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#1E332D",
          },
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: "#1F3A32",
            color: "#E6F1EC",
            "& .MuiListItemIcon-root": {
              color: "#6FBF73",
            },
          },
          "&.Mui-selected:hover": {
            backgroundColor: "#27473D",
          },
        },
      },
    },
  },
});

const ThemeModeContext = createContext();

export const useThemeMode = () => useContext(ThemeModeContext);

const createRtlCache = () =>
  createCache({
    key: "muirtl",
    stylisPlugins: [rtlPlugin],
  });

const createLtrCache = () =>
  createCache({
    key: "muiltr"
  });


const getTheme = (mode, language) => {

  const isArabic = language === "ar";

  return createTheme({
    ...(mode === "dark" ? darkTheme : lightTheme),
    direction: isArabic ? "rtl" : "ltr",
    typography: {
    fontFamily: language === "ar"
        ? "Cairo"
        : `"Inter", "Roboto", "Helvetica", "Arial", sans-serif`,
        h5: {
          fontWeight: 600,
        },
        button: {
          textTransform: "none",
          fontWeight: 500,
        },
      },
    });
}

function Root() {
  const { i18n } = useTranslation();
  const [mode, setMode] = useState("light");
  const [lang, setLang] = useState(i18n.language);

  // Listen to language changes
  useEffect(() => {
    const handleLanguageChanged = (lng) => setLang(lng);
    i18n.on("languageChanged", handleLanguageChanged);
    
    return () => i18n.off("languageChanged", handleLanguageChanged);
  }, [i18n]);

  useEffect(() => {
    document.body.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  }, [lang]);
  
  const cache = useMemo(() => (lang === "ar" ? createRtlCache() : createLtrCache()), [lang]);

  const theme = useMemo(
    () => getTheme(mode, lang),
    [mode, lang]
  );

  return (
    <CacheProvider value={i18n.language === "ar" ? createRtlCache() : createLtrCache()}>
    <ThemeModeContext.Provider value={{mode, setMode}}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App mode={mode} setMode={setMode} />
      </ThemeProvider>
    </ThemeModeContext.Provider>
    </CacheProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <Root />
);
