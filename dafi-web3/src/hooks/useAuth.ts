import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

export interface User {
  id: string;
  principal: string;
  name?: string;
  email?: string;
  avatar?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
}

export const useAuth = () => {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    error: null,
  });

  const login = useCallback(async (principal: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      
      // TODO: Implement actual ICP authentication
      // This is a mock implementation
      const mockUser: User = {
        id: '1',
        principal,
        name: 'Demo User',
        email: 'demo@example.com',
      };

      setState({
        isAuthenticated: true,
        isLoading: false,
        user: mockUser,
        error: null,
      });

      // Store auth state
      localStorage.setItem('auth', JSON.stringify({ principal }));
      
      return true;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to login',
      }));
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      
      // TODO: Implement actual ICP logout
      localStorage.removeItem('auth');
      
      setState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: null,
      });

      router.push('/login');
      return true;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to logout',
      }));
      return false;
    }
  }, [router]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const stored = localStorage.getItem('auth');
        if (!stored) {
          setState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            error: null,
          });
          return;
        }

        const { principal } = JSON.parse(stored);
        await login(principal);
      } catch (error) {
        setState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          error: 'Failed to restore auth state',
        });
      }
    };

    initAuth();
  }, [login]);

  return {
    ...state,
    login,
    logout,
  };
};
