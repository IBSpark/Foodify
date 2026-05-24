import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import {
    Box,
    Paper,
    Typography,
    Container,
    Avatar,
} from '@mui/material';

import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import axios from 'axios';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();

    const handleSuccess = async (credentialResponse) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/routes/auth/google`,
                {
                    token: credentialResponse.credential,
                }
            );

            const data = response.data;

            localStorage.setItem(
                'adminUser',
                JSON.stringify({
                    ...data.user,
                    authenticated: true,
                })
            );

            localStorage.setItem('token', data.token);

            navigate('/');
        } catch (error) {
            console.error('Google Login Error:', error);
            alert('Google login failed');
        }
    };

    return (
        <Box className="login-page">
            <Container maxWidth="sm">
                <Paper
                    elevation={6}
                    className="login-paper"
                    sx={{
                        p: 6,
                        borderRadius: 6,
                        textAlign: 'center',
                    }}
                >
                    {/* Restaurant Icon */}
                    <Avatar
                        sx={{
                            mx: 'auto',
                            mb: 3,
                            bgcolor: '#16a34a',
                            width: 80,
                            height: 80,
                        }}
                    >
                        <RestaurantMenuIcon sx={{ fontSize: 42 }} />
                    </Avatar>

                    {/* Title */}
                    <Typography
                        variant="h3"
                        fontWeight="800"
                        sx={{ mb: 2 }}
                    >
                        Admin Login
                    </Typography>

                    {/* Subtitle */}
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ mb: 5 }}
                    >
                        Foodify Restaurant Admin Panel
                    </Typography>

                    {/* Google Login */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <GoogleLogin
                            onSuccess={handleSuccess}
                            onError={() => {
                                alert('Google Sign-In Failed');
                            }}
                        />
                    </Box>

                    {/* Footer */}
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 6, display: 'block' }}
                    >
                        © {new Date().getFullYear()} Foodify Restaurant Admin Panel
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login;