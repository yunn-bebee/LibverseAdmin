import  { useState, useEffect } from 'react';
import { 
  Box,
  Button,
  Container,
  Typography,
  
  Stack,
  Toolbar
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';


// Import your background images (or use URLs)
import lightBackground from '../assets/Images/Old guy sitting.png';

import ThemeToggle from '../components/ThemeToggle';
import { lightTheme, darkTheme } from '../utils/CreateThemes';

const THEME_KEY = 'dashboard-theme-mode';

const NotFoundPage = () => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
 

  useEffect(() => {
    const storedMode = localStorage.getItem(THEME_KEY) as 'light' | 'dark' | null;
    if (storedMode) {
      setMode(storedMode);
    }
  }, []);

  const handleToggle = () => {
    setMode((prev) => {
      const newMode = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem(THEME_KEY, newMode);
      return newMode;
    });
  };

  return (
    <ThemeProvider theme={mode === 'light' ? lightTheme : darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundImage: `url(${lightBackground})`, // Use your imported image
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Toolbar sx={{ justifyContent: 'flex-end' }}>
          <ThemeToggle mode={mode} onToggle={handleToggle} />
        </Toolbar>

        <Container
          maxWidth="md"
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            py: 8,
            position: 'relative'
          }}
        >
          <Box
            sx={{
              p: 6,
              borderRadius: 4,
              textAlign: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              maxWidth: 600,
              mx: 'auto',
              color: 'common.white'
            }}
          >
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                mb: 2
              }}
            >
              404
            </Typography>
            
            <Typography 
              variant="h4"
              sx={{ 
                fontWeight: 600,
                mb: 3
              }}
            >
              Lost in the Pages
            </Typography>

            <Typography variant="body1" sx={{ mb: 4 }}>
              The story you're looking for doesn't exist in our library.
              <br />
              Let's get you back to the main collection.
            </Typography>

            <Stack 
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
            >
              <Button
                component={RouterLink}
                to="/"
                variant="contained"
                color="primary"
                size="large"
                startIcon={<HomeIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600
                }}
              >
                Library Home
              </Button>
              
              <Button
                variant="outlined"
                color="inherit"
                size="large"
                startIcon={<ArrowBackIcon />}
                onClick={() => window.history.back()}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  color: 'common.white',
                  borderColor: 'common.white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'common.white'
                  }
                }}
              >
                Previous Chapter
              </Button>
            </Stack>
          </Box>
        </Container>

        <Box
          sx={{
            py: 3,
            textAlign: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'common.white'
          }}
        >
          <Typography variant="body2">
            Need help? Contact our librarians at support@bookhaven.com
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default NotFoundPage;