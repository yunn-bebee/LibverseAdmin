import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Avatar,
    Alert,
    CircularProgress,
   
    Toolbar,
    
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ThemeToggle from '../../components/ThemeToggle';
import { darkTheme, lightTheme } from '../../utils/CreateThemes';


const THEME_KEY = 'dashboard-theme-mode';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'light' | 'dark'>('light');
    const { login } = useAuth();
    const navigate = useNavigate();

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await login(email, password);
            navigate('/admin');
        } catch (err) {
            setError(err + 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={mode === 'light' ? lightTheme : darkTheme}>
            <CssBaseline />
            <Box position="static" sx={{ backgroundColor: 'transparent', color: 'primary.contrastText', boxShadow: 'none' }}>
                <Toolbar sx={{ justifyContent: 'flex-end' }}>
                    <ThemeToggle mode={mode} onToggle={handleToggle} />
                </Toolbar>
            </Box>
            <Container maxWidth="xs" sx={{ backgroundColor: 'background.default' }}>
                <Paper
                    elevation={6}
                    sx={{
                        p: 4,
                        mt: 10,
                        borderRadius: 3,
                        color: 'primary.main',
                        backgroundColor: 'background.paper',
                    }}
                >
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
                            <LockOutlinedIcon fontSize="large" />
                        </Avatar>
                        <Typography variant="h4" fontWeight={700} gutterBottom>
                            Sign In
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                            Welcome back! Please enter your credentials.
                        </Typography>
                        {error && (
                            <Alert severity="error">
                                Something went wrong! Please try again.
                            </Alert>
                        )}
                        {loading && <CircularProgress />}
                        <Box component="form" onSubmit={handleSubmit} width="100%" mt={1}>
                            <TextField
                                label="Email Address"
                                type="email"
                                fullWidth
                                margin="normal"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                variant="outlined"
                                autoComplete="email"
                            />
                            <TextField
                                label="Password"
                                type="password"
                                fullWidth
                                margin="normal"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                variant="outlined"
                                autoComplete="current-password"
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{
                                    mt: 3,
                                    py: 1.5,
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    letterSpacing: 1,
                                    borderRadius: 2,
                                }}
                            >
                                Sign In
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </ThemeProvider>
    );
};

export default Login;