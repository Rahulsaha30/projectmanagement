import client from './client';
import type { SignupRequest, ForgotPasswordRequest, LoginRequest } from '../types/index';

// We need to define types if not already matching backend
// The LoginRequest is usually a URL encoded form for OAuth2
export const login = async (data: LoginRequest) => {
  const formData = new URLSearchParams();
  formData.append('username', data.username);
  formData.append('password', data.password);
  // grant_type and scope are optional defaults usually
  
  const response = await client.post('/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  return response.data;
};

export const signup = async (data: SignupRequest) => {
  const response = await client.post('/auth/signup', data);
  return response.data;
};

export const forgotPassword = async (data: ForgotPasswordRequest) => {
  const response = await client.put('/auth/forgot-password', data);
  return response.data;
};

export const refreshToken = async (refreshToken: string) => {
  const response = await client.post('/auth/refresh', null, {
    params: { refresh_token: refreshToken }
  });
  return response.data;
};
