import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import { login as apiLogin, signup as apiSignup, refreshToken as apiRefreshToken } from '../api/auth';

interface DecodedToken {
  sub: string;
  role: string;
  emp_id: number;
  exp: number;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  refreshToken: string | null;
  role: string | null;
  empId: number | null;
  tokenExpiry: number | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: string, pin: string) => Promise<void>;
  logout: () => void;
  refreshAuthToken: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  checkTokenExpiry: () => void;
  scheduleTokenRefresh: () => void;
}

let refreshTimeoutId: ReturnType<typeof setTimeout> | null = null;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isLoading: true,
      token: null,
      refreshToken: null,
      role: null,
      empId: null,
      tokenExpiry: null,

      login: async (email: string, password: string) => {
        const data = await apiLogin({ username: email, password });
        
        // Decode JWT to get user info and expiry
        const decoded = jwtDecode<DecodedToken>(data.access_token);
        
        // Store token in localStorage for axios interceptor
        localStorage.setItem('token', data.access_token);
        
        set({
          isAuthenticated: true,
          token: data.access_token,
          refreshToken: localStorage.getItem('refresh_token'), // If backend sets it
          role: decoded.role,
          empId: decoded.emp_id,
          tokenExpiry: decoded.exp * 1000, // Convert to ms
          isLoading: false,
        });

        // Schedule token refresh 5 minutes before expiry
        get().scheduleTokenRefresh();
      },

      signup: async (email: string, password: string, name: string, role: string, pin: string) => {
        const data = await apiSignup({ 
          email, 
          password, 
          emp_name: name, 
          role: role as 'admin' | 'manager' | 'employee',
          pin
        });
        
        const decoded = jwtDecode<DecodedToken>(data.access_token);
        
        // Store token in localStorage for axios interceptor
        localStorage.setItem('token', data.access_token);
        
        set({
          isAuthenticated: true,
          token: data.access_token,
          refreshToken: localStorage.getItem('refresh_token'),
          role: decoded.role,
          empId: decoded.emp_id,
          tokenExpiry: decoded.exp * 1000,
          isLoading: false,
        });

        get().scheduleTokenRefresh();
      },

      logout: () => {
        if (refreshTimeoutId) {
          clearTimeout(refreshTimeoutId);
          refreshTimeoutId = null;
        }
        
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        
        set({
          isAuthenticated: false,
          token: null,
          refreshToken: null,
          role: null,
          empId: null,
          tokenExpiry: null,
          isLoading: false,
        });
      },

      refreshAuthToken: async () => {
        const { refreshToken: storedRefreshToken } = get();
        const localRefreshToken = localStorage.getItem('refresh_token');
        const tokenToUse = storedRefreshToken || localRefreshToken;
        
        if (!tokenToUse) {
          get().logout();
          return;
        }

        try {
          const data = await apiRefreshToken(tokenToUse);
          const decoded = jwtDecode<DecodedToken>(data.access_token);
          
          // Store new token in localStorage
          localStorage.setItem('token', data.access_token);
          
          set({
            token: data.access_token,
            refreshToken: tokenToUse,
            role: decoded.role,
            empId: decoded.emp_id,
            tokenExpiry: decoded.exp * 1000,
          });

          get().scheduleTokenRefresh();
        } catch (error) {
          console.error('Token refresh failed:', error);
          get().logout();
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      checkTokenExpiry: () => {
        const { tokenExpiry, isAuthenticated } = get();
        
        if (isAuthenticated && tokenExpiry) {
          if (Date.now() >= tokenExpiry) {
            // Token expired, try to refresh
            get().refreshAuthToken();
          } else {
            // Token still valid, schedule refresh
            get().scheduleTokenRefresh();
          }
        }
        
        set({ isLoading: false });
      },

      scheduleTokenRefresh: () => {
        const { tokenExpiry } = get();
        
        if (refreshTimeoutId) {
          clearTimeout(refreshTimeoutId);
          refreshTimeoutId = null;
        }
        
        if (tokenExpiry) {
          // Refresh 5 minutes before expiry
          const refreshTime = tokenExpiry - 5 * 60 * 1000 - Date.now();
          
          // Ensure minimum 1 minute before refresh
          const timeUntilRefresh = Math.max(refreshTime, 60 * 1000);
          
          if (timeUntilRefresh > 0) {
            refreshTimeoutId = setTimeout(() => {
              get().refreshAuthToken();
            }, timeUntilRefresh);
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        role: state.role,
        empId: state.empId,
        tokenExpiry: state.tokenExpiry,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
