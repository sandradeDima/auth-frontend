'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LoginResponse } from '@/types/loginResponse';
import { authApi } from '../lib/api/auth';

interface AuthContextType {
  // Authentication state
  isAuthenticated: boolean;
  user: LoginResponse['user'] | null;
  accessToken: string | null;
  refreshToken: string | null;
  
  // Authentication actions
  login: (loginData: LoginResponse) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<LoginResponse['user'] | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Refresh access token function
  const refreshAccessToken = async (): Promise<boolean> => {
    if (!refreshToken || !user?.id) {
      console.log('No refresh token or user ID available');
      return false;
    }

    try {
      console.log('Refreshing access token...');
      const response = await authApi.refreshToken(refreshToken, user.id);
      
      // Update stored tokens
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      // Update state
      setAccessToken(response.accessToken);
      setRefreshToken(response.refreshToken);
      
      console.log('Access token refreshed successfully');
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, logout user
      logout();
      return false;
    }
  };

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedAccessToken = localStorage.getItem('accessToken');
        const storedRefreshToken = localStorage.getItem('refreshToken');
        const storedUser = localStorage.getItem('user');

        if (storedAccessToken && storedUser) {
          setAccessToken(storedAccessToken);
          setRefreshToken(storedRefreshToken);
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error initializing auth state:', error);
        // Clear corrupted data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Automatic token refresh - check every 5 minutes
  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;

    const checkAndRefreshToken = async () => {
      try {
        console.log('Checking token expiration...');
        // Decode JWT to check expiration (simple base64 decode)
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = payload.exp - currentTime;
        console.log('Time until expiry:', timeUntilExpiry);
        // If token expires in less than 5 minutes, refresh it
        if (timeUntilExpiry < 300) {
          console.log('Token expires soon, refreshing...');
          await refreshAccessToken();
        }
      } catch (error) {
        console.error('Error checking token expiration:', error);
        logout();
      }
    };

    // Check immediately
    checkAndRefreshToken();

    // Set up interval to check every 5 minutes
    const interval = setInterval(checkAndRefreshToken, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, accessToken, refreshAccessToken]);

  // Login function - stores tokens and user data
  const login = (loginData: LoginResponse) => {
    try {
      // Store tokens in localStorage
      localStorage.setItem('accessToken', loginData.accessToken);
      localStorage.setItem('refreshToken', loginData.refreshToken);
      localStorage.setItem('user', JSON.stringify(loginData.user));

      // Update state
      setAccessToken(loginData.accessToken);
      setRefreshToken(loginData.refreshToken);
      setUser(loginData.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error storing login data:', error);
    }
  };

  // Logout function - clears all stored data
  const logout = () => {
    try {
      // Clear localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      // Clear state
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    accessToken,
    refreshToken,
    login,
    logout,
    refreshAccessToken,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
