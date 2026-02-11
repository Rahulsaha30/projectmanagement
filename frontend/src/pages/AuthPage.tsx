import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useToast } from '../context/ToastContext';
import { forgotPassword } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

// MUI Components
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const AuthPage = () => {
    const [activeTab, setActiveTab] = useState(0);
    const { login: authLogin, signup: authSignup } = useAuthStore();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Login Form Data
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Signup Form Data
    const [signupName, setSignupName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupRole, setSignupRole] = useState("employee");
    const [signupPin, setSignupPin] = useState('');

    // Forgot Password Data
    const [fpEmail, setFpEmail] = useState('');
    const [fpPin, setFpPin] = useState('');
    const [fpNewPassword, setFpNewPassword] = useState('');

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        if (newValue < 2) {
            setActiveTab(newValue);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!username || !password) {
            addToast({
                type: 'warning',
                message: 'Please enter both username and password'
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await authLogin(username, password);
            
            addToast({
                type: 'success',
                message: 'Login successful!'
            });
            
            const currentRole = useAuthStore.getState().role;
            if (currentRole === 'admin') {
                navigate('/admin');
            } else if (currentRole === 'manager') {
                navigate('/manager');
            } else {
                navigate('/my-tasks');
            }
        } catch (err: unknown) {
            addToast({
                type: 'error',
                message: err instanceof Error ? err.message : 'Login failed. Please check your credentials.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!signupName || !signupEmail || !signupPassword || !signupPin) {
            addToast({
                type: 'warning',
                message: 'Please fill in all required fields'
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await authSignup(signupEmail, signupPassword, signupName, signupRole, signupPin);
            
            addToast({
                type: 'success',
                message: 'Signup successful'
            });
            
            const currentRole = useAuthStore.getState().role;
            if (currentRole === 'admin') {
                navigate('/admin');
            } else if (currentRole === 'manager') {
                navigate('/manager');
            } else {
                navigate('/my-tasks');
            }
        } catch (err: unknown) {
            addToast({
                type: 'error',
                message: err instanceof Error ? err.message : 'Signup failed. Please try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!fpEmail || !fpPin || !fpNewPassword) {
            addToast({
                type: 'warning',
                message: 'Please fill in all fields'
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await forgotPassword({
                email: fpEmail,
                pin: fpPin,
                new_password: fpNewPassword
            });
            
            addToast({
                type: 'success',
                message: 'Password reset successful! Please login.'
            });
            
            setActiveTab(0);
            setFpEmail('');
            setFpPin('');
            setFpNewPassword('');
        } catch (err: unknown) {
            addToast({
                type: 'error',
                message: err instanceof Error ? err.message : 'Password reset failed. Please check your details.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getTitle = () => {
        if (activeTab === 2) return 'Reset Password';
        return activeTab === 0 ? 'Welcome Back' : 'Create Account';
    };

    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 50%, #f3e8ff 100%)',
            }}
        >
            <Card 
                sx={{ 
                    width: '100%', 
                    maxWidth: 450,
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    animation: 'scaleIn 0.2s ease-out',
                }}
            >
                <CardHeader
                    title={
                        <Typography variant="h5" align="center" fontWeight="bold">
                            {getTitle()}
                        </Typography>
                    }
                    subheader={
                        <Typography variant="body2" color="text.secondary" align="center">
                            Project Management System
                        </Typography>
                    }
                />
                <CardContent>
                    {activeTab === 2 ? (
                        <Box component="form" onSubmit={handleForgotPassword} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Email"
                                type="email"
                                value={fpEmail}
                                onChange={e => setFpEmail(e.target.value)}
                                required
                                disabled={isSubmitting}
                                placeholder="Enter your email"
                                fullWidth
                            />
                            <TextField
                                label="PIN"
                                type="password"
                                value={fpPin}
                                onChange={e => setFpPin(e.target.value)}
                                required
                                disabled={isSubmitting}
                                placeholder="Enter your PIN"
                                fullWidth
                            />
                            <TextField
                                label="New Password"
                                type="password"
                                value={fpNewPassword}
                                onChange={e => setFpNewPassword(e.target.value)}
                                required
                                disabled={isSubmitting}
                                placeholder="Enter new password"
                                fullWidth
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={isSubmitting}
                                size="large"
                            >
                                {isSubmitting ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LoadingSpinner size="sm" />
                                        Resetting...
                                    </Box>
                                ) : (
                                    'Reset Password'
                                )}
                            </Button>
                            <Button
                                variant="text"
                                fullWidth
                                onClick={() => setActiveTab(0)}
                                disabled={isSubmitting}
                            >
                                Back to Login
                            </Button>
                        </Box>
                    ) : (
                        <>
                            <Tabs 
                                value={activeTab} 
                                onChange={handleTabChange}
                                variant="fullWidth"
                                sx={{ mb: 3 }}
                            >
                                <Tab label="Login" />
                                <Tab label="Sign Up" />
                            </Tabs>
                            
                            {activeTab === 0 && (
                                <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <TextField
                                        label="Username (Email)"
                                        type="email"
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        required
                                        disabled={isSubmitting}
                                        placeholder="Enter your email"
                                        fullWidth
                                    />
                                    <TextField
                                        label="Password"
                                        type="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                        disabled={isSubmitting}
                                        placeholder="Enter your password"
                                        fullWidth
                                    />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        disabled={isSubmitting}
                                        size="large"
                                    >
                                        {isSubmitting ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <LoadingSpinner size="sm" />
                                                Logging in...
                                            </Box>
                                        ) : (
                                            'Login'
                                        )}
                                    </Button>
                                    <Button
                                        variant="text"
                                        fullWidth
                                        onClick={() => setActiveTab(2)}
                                        disabled={isSubmitting}
                                    >
                                        Forgot Password?
                                    </Button>
                                </Box>
                            )}

                            {activeTab === 1 && (
                                <Box component="form" onSubmit={handleSignup} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <TextField
                                        label="Name"
                                        value={signupName}
                                        onChange={e => setSignupName(e.target.value)}
                                        required
                                        disabled={isSubmitting}
                                        placeholder="John Doe"
                                        fullWidth
                                    />
                                    <TextField
                                        label="Email"
                                        type="email"
                                        value={signupEmail}
                                        onChange={e => setSignupEmail(e.target.value)}
                                        required
                                        disabled={isSubmitting}
                                        placeholder="john@example.com"
                                        fullWidth
                                    />
                                    <TextField
                                        label="Password"
                                        type="password"
                                        value={signupPassword}
                                        onChange={e => setSignupPassword(e.target.value)}
                                        required
                                        disabled={isSubmitting}
                                        placeholder="Create a strong password"
                                        fullWidth
                                    />
                                    <FormControl fullWidth disabled={isSubmitting}>
                                        <InputLabel>Role</InputLabel>
                                        <Select
                                            value={signupRole}
                                            onChange={e => setSignupRole(e.target.value)}
                                            label="Role"
                                        >
                                            <MenuItem value="employee">Employee</MenuItem>
                                            <MenuItem value="manager">Manager</MenuItem>
                                            <MenuItem value="admin">Admin</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        label="PIN (for recovery)"
                                        type="password"
                                        value={signupPin}
                                        onChange={e => setSignupPin(e.target.value)}
                                        required
                                        disabled={isSubmitting}
                                        placeholder="4-digit PIN"
                                        fullWidth
                                    />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        disabled={isSubmitting}
                                        size="large"
                                    >
                                        {isSubmitting ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <LoadingSpinner size="sm" />
                                                Signing up...
                                            </Box>
                                        ) : (
                                            'Sign Up'
                                        )}
                                    </Button>
                                </Box>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default AuthPage;
