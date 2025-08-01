import React, { useState } from 'react';
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
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

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
        <Container maxWidth="xs" sx={{ backgroundColor: 'background.default' }}>
            <Paper
                elevation={6}
                sx={{
                    p: 4,
                    mt: 10,
                    borderRadius: 3,
                    color: 'primary.main',
                    backgroundColor: 'background.default',
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
                    {loading && (
                        <CircularProgress /> 
                    )

                    }
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
    );
};

export default Login;