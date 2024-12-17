import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { useRouter } from 'next/router';

type UserRole = 'farmer' | 'investor' | null;

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole;
  principal: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  setRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [principal, setPrincipal] = useState<string | null>(null);
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  // Initialize auth client and check authentication status
  useEffect(() => {
    const init = async () => {
      try {
        const client = await AuthClient.create();
        setAuthClient(client);

        const isAuthed = await client.isAuthenticated();
        setIsAuthenticated(isAuthed);

        if (isAuthed) {
          const identity = client.getIdentity();
          setPrincipal(identity.getPrincipal().toString());
          
          // Try to restore role from localStorage
          const savedRole = localStorage.getItem('userRole') as UserRole;
          if (savedRole) {
            setUserRole(savedRole);
          } else {
            // If authenticated but no role, redirect to role selection
            router.push('/select-role');
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    init();
  }, [router]);

  const login = useCallback(async () => {
    if (!authClient) return;

    const identityProvider = process.env.NEXT_PUBLIC_INTERNET_IDENTITY_URL;
    
    try {
      await authClient.login({
        identityProvider,
        onSuccess: () => {
          setIsAuthenticated(true);
          const identity = authClient.getIdentity();
          setPrincipal(identity.getPrincipal().toString());
          
          // If no role is set, redirect to role selection
          if (!userRole) {
            router.push('/select-role');
          }
        },
        onError: (error) => {
          console.error('Login failed:', error);
          setIsAuthenticated(false);
          setPrincipal(null);
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      setIsAuthenticated(false);
      setPrincipal(null);
    }
  }, [authClient, router, userRole]);

  const logout = useCallback(async () => {
    if (!authClient) return;

    try {
      await authClient.logout();
      setIsAuthenticated(false);
      setUserRole(null);
      setPrincipal(null);
      localStorage.removeItem('userRole');
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [authClient, router]);

  const setRole = useCallback((role: UserRole) => {
    setUserRole(role);
    if (role) {
      localStorage.setItem('userRole', role);
      // Redirect based on role
      router.push(role === 'farmer' ? '/farms' : '/invest');
    } else {
      localStorage.removeItem('userRole');
    }
  }, [router]);

  // Show loading state while initializing
  if (!isInitialized) {
    return null;
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      userRole,
      principal,
      login,
      logout,
      setRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
