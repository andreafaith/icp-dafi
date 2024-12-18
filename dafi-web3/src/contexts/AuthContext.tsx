import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { useRouter } from 'next/router';
import { getInternetIdentityUrl } from '../constants/canisters';

export type UserRole = 'farmer' | 'investor' | 'admin';

export interface User {
  principal: string;
  role?: UserRole;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  user: User | null;
  principal: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  setRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [principal, setPrincipal] = useState<string | null>(null);
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);

  const initialize = useCallback(async () => {
    if (isInitialized) return;
    
    try {
      const client = authClient || await AuthClient.create();
      setAuthClient(client);

      const isAuthed = await client.isAuthenticated();
      
      if (isAuthed) {
        const identity = client.getIdentity();
        const principalId = identity.getPrincipal().toString();
        const storedRole = localStorage.getItem('userRole') as UserRole;

        setUser({ principal: principalId, role: storedRole });
        setPrincipal(principalId);
        setIsAuthenticated(true);

        // Redirect to role selection if no role is set
        if (!storedRole && router.pathname !== '/role-selection') {
          router.push('/role-selection');
        }
      }

      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      setIsInitialized(true); // Set initialized even on error
    } finally {
      setIsLoading(false);
    }
  }, [authClient, router, isInitialized]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const login = async () => {
    try {
      setIsLoading(true);
      const client = authClient || await AuthClient.create();
      
      const loginResult = await new Promise<boolean>((resolve) => {
        client.login({
          identityProvider: getInternetIdentityUrl(),
          onSuccess: () => resolve(true),
          onError: () => resolve(false),
        });
      });

      if (!loginResult) {
        throw new Error('Authentication failed. Please try again.');
      }

      const identity = client.getIdentity();
      const principalId = identity.getPrincipal().toString();
      const storedRole = localStorage.getItem('userRole') as UserRole;

      setUser({ principal: principalId, role: storedRole });
      setPrincipal(principalId);
      setIsAuthenticated(true);

      // Redirect based on role
      if (!storedRole) {
        router.push('/role-selection');
      } else {
        router.push(storedRole === 'farmer' ? '/dashboard/farmer' : '/dashboard/investor');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      if (authClient) {
        await authClient.logout();
        setUser(null);
        setPrincipal(null);
        setIsAuthenticated(false);
        localStorage.removeItem('userRole');
        router.push('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setRole = (role: UserRole) => {
    if (user) {
      localStorage.setItem('userRole', role);
      setUser({ ...user, role });
      router.push(role === 'farmer' ? '/dashboard/farmer' : '/dashboard/investor');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isInitialized,
        isLoading,
        user,
        principal,
        login,
        logout,
        setRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
