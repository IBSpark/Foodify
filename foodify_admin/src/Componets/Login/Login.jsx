import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    Container,
    Avatar,
    CircularProgress,
    Alert,
    TextField,
    Button
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simulating login process without Google Auth
        setTimeout(() => {
            if (email === 'ibad@gmail.com' && password === 'ibad123') {
                localStorage.setItem('adminUser', JSON.stringify({
                    name: 'Admin User',
                    email: email,
                    authenticated: true
                }));
                setLoading(false);
                navigate('/');
            } else {
                setError('Invalid email or password.');
                setLoading(false);
            }
        }, 1000);
    };

    return (
        <Box className="login-page">
            <Container maxWidth="xs">
                <Paper elevation={6} className="login-paper">
                    <Avatar className="login-avatar">
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5" className="login-title">
                        Admin Login
                    </Typography>
                    <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
                        Foodify Resturant Admin Panel
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{ mt: 3, mb: 2, height: 48 }}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Sign In'}
                        </Button>
                    </Box>

                    <Box sx={{ mt: 4 }}>
                        <Typography variant="caption" color="textSecondary">
                            &copy; {new Date().getFullYear()} Foodify Resturant Admin Panel
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login;
