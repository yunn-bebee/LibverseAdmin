import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { 
      main: '#01EDC4',       // Vibrant teal as primary
      contrastText: '#23085A' 
    },
    secondary: { 
      main: '#FF00C8',       // Electric pink as secondary
      contrastText: '#FFFFFF' 
    },
    warning: {
      main: '#FEE400',       // Bright yellow for warnings/accents
      contrastText: '#23085A'
    },
    background: { 
      default: '#FFFFFF',    // Pure white background
      paper: '#F8F9FA'       // Slightly off-white for cards
    },
    text: {
      primary: '#23085A',    // Deep purple for text
      secondary: '#4A3C8C',  // Lighter purple variant
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: {
      fontWeight: 800,
      color: '#23085A',
      fontSize: '3rem',
    },
    button: {
      fontWeight: 700,
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          padding: '10px 24px',
        },
        containedPrimary: {
          boxShadow: '0 4px 14px rgba(1, 237, 196, 0.3)',
          '&:hover': {
            backgroundColor: '#00D9B0',
          },
        },
        containedSecondary: {
          boxShadow: '0 4px 14px rgba(255, 0, 200, 0.3)',
          '&:hover': {
            backgroundColor: '#E600B4',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#23085A',
          color: '#FFFFFF',
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { 
      main: '#01EDC4',       // Teal remains primary
      contrastText: '#121212'
    },
    secondary: { 
      main: '#FF00C8',       // Pink remains secondary
      contrastText: '#FFFFFF'
    },
    warning: {
      main: '#FEE400',       // Yellow for accents
      contrastText: '#121212'
    },
    background: { 
      default: '#23085A',    // Deep purple background
      paper: '#1A0A4A'       // Slightly darker purple for cards
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#E0E0E0',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          color: '#121212',
          '&:hover': {
            backgroundColor: '#00D9B0',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1A0A4A',
          border: '1px solid #2E1B5E',
        },
      },
    },
  },
});