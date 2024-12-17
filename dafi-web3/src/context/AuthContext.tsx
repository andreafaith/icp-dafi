import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';
import { AuthState, User } from '../types';

interface AuthContextType extends AuthState {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const defaultAuthState: AuthState = {
  isAuthenticated: false,
  principal: null,
  userType: null,
  isLoading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(defaultAuthState);
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const client = await AuthClient.create();
        setAuthClient(client);
        await checkAuth();
      } catch (error) {
        console.error('Failed to initialize auth client:', error);
        setAuthState(prev => ({ ...prev, isLoading: false, error: 'Failed to initialize authentication' }));
      }
    };

    initAuth();
  }, []);

  const checkAuth = async () => {
    if (!authClient) return;

    try {
      const isAuthenticated = await authClient.isAuthenticated();
      if (isAuthenticated) {
        const identity = authClient.getIdentity();
        const principal = identity.getPrincipal();
        
        // TODO: Fetch user type from backend
        const userType = 'farmer'; // Temporary, should be fetched from backend

        setAuthState({
          isAuthenticated: true,
          principal,
          userType,
          isLoading: false,
          error: null,
        });
      } else {
        setAuthState({
          ...defaultAuthState,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthState(prev => ({ ...prev, isLoading: false, error: 'Authentication check failed' }));
    }
  };

  const login = async () => {
    if (!authClient) return;

    try {
      await authClient.login({
        identityProvider: process.env.NEXT_PUBLIC_INTERNET_IDENTITY_URL,
        onSuccess: () => checkAuth(),
      });
    } catch (error) {
      console.error('Login failed:', error);
      setAuthState(prev => ({ ...prev, error: 'Login failed' }));
    }
  };

  const logout = async () => {
    if (!authClient) return;

    try {
      await authClient.logout();
      setAuthState(defaultAuthState);
    } catch (error) {
      console.error('Logout failed:', error);
      setAuthState(prev => ({ ...prev, error: 'Logout failed' }));
    }
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
