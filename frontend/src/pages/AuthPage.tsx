import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { useAuthStore } from '../stores/authStore';
import { useToast } from '../context/ToastContext';
import { forgotPassword } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const AuthPage = () => {
    const [activeTab, setActiveTab] = useState("login");
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
            
            // Navigate based on role - get the latest role from store
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
                message: 'Signup successful! Logging you in...'
            });
            
            // Navigate based on role after signup
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
            
            setActiveTab("login");
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

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <Card className="w-full max-w-md shadow-xl animate-scale-in">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-center text-2xl font-bold">
                        {activeTab === 'login' ? 'Welcome Back' : activeTab === 'signup' ? 'Create Account' : 'Reset Password'}
                    </CardTitle>
                    <CardDescription className="text-center">
                        Project Management System
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {activeTab === 'forgot' ? (
                         <form onSubmit={handleForgotPassword} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="fp-email">Email</Label>
                                <Input 
                                    id="fp-email" 
                                    type="email" 
                                    value={fpEmail} 
                                    onChange={e => setFpEmail(e.target.value)} 
                                    required 
                                    disabled={isSubmitting}
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="fp-pin">PIN</Label>
                                <Input 
                                    id="fp-pin" 
                                    type="password"
                                    value={fpPin} 
                                    onChange={e => setFpPin(e.target.value)} 
                                    required 
                                    disabled={isSubmitting}
                                    placeholder="Enter your PIN"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="fp-pass">New Password</Label>
                                <Input 
                                    id="fp-pass" 
                                    type="password" 
                                    value={fpNewPassword} 
                                    onChange={e => setFpNewPassword(e.target.value)} 
                                    required 
                                    disabled={isSubmitting}
                                    placeholder="Enter new password"
                                />
                            </div>
                            <Button 
                                type="submit" 
                                className="w-full"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <LoadingSpinner size="sm" className="mr-2" />
                                        Resetting...
                                    </>
                                ) : (
                                    'Reset Password'
                                )}
                            </Button>
                            <Button 
                                variant="link" 
                                className="w-full" 
                                onClick={() => setActiveTab('login')}
                                disabled={isSubmitting}
                            >
                                Back to Login
                            </Button>
                        </form>
                    ) : (
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-4">
                                <TabsTrigger value="login">Login</TabsTrigger>
                                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="login">
                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="username">Username (Email)</Label>
                                        <Input 
                                            id="username" 
                                            type="email"
                                            value={username} 
                                            onChange={e => setUsername(e.target.value)} 
                                            required 
                                            disabled={isSubmitting}
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input 
                                            id="password" 
                                            type="password" 
                                            value={password} 
                                            onChange={e => setPassword(e.target.value)} 
                                            required 
                                            disabled={isSubmitting}
                                            placeholder="Enter your password"
                                        />
                                    </div>
                                    <Button 
                                        type="submit" 
                                        className="w-full"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <LoadingSpinner size="sm" className="mr-2" />
                                                Logging in...
                                            </>
                                        ) : (
                                            'Login'
                                        )}
                                    </Button>
                                    <Button 
                                        variant="link" 
                                        className="w-full" 
                                        onClick={() => setActiveTab('forgot')}
                                        disabled={isSubmitting}
                                    >
                                        Forgot Password?
                                    </Button>
                                </form>
                            </TabsContent>

                            <TabsContent value="signup">
                                <form onSubmit={handleSignup} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="s-name">Name</Label>
                                        <Input 
                                            id="s-name" 
                                            value={signupName} 
                                            onChange={e => setSignupName(e.target.value)} 
                                            required 
                                            disabled={isSubmitting}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="s-email">Email</Label>
                                        <Input 
                                            id="s-email" 
                                            type="email" 
                                            value={signupEmail} 
                                            onChange={e => setSignupEmail(e.target.value)} 
                                            required 
                                            disabled={isSubmitting}
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="s-pass">Password</Label>
                                        <Input 
                                            id="s-pass" 
                                            type="password" 
                                            value={signupPassword} 
                                            onChange={e => setSignupPassword(e.target.value)} 
                                            required 
                                            disabled={isSubmitting}
                                            placeholder="Create a strong password"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Role</Label>
                                        <Select 
                                            value={signupRole} 
                                            onValueChange={setSignupRole}
                                            disabled={isSubmitting}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="employee">Employee</SelectItem>
                                                <SelectItem value="manager">Manager</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="s-pin">PIN (for recovery)</Label>
                                        <Input 
                                            id="s-pin" 
                                            type="password"
                                            value={signupPin} 
                                            onChange={e => setSignupPin(e.target.value)} 
                                            required 
                                            disabled={isSubmitting}
                                            placeholder="4-digit PIN"
                                        />
                                    </div>
                                    <Button 
                                        type="submit" 
                                        className="w-full"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <LoadingSpinner size="sm" className="mr-2" />
                                                Signing up...
                                            </>
                                        ) : (
                                            'Sign Up'
                                        )}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AuthPage;
