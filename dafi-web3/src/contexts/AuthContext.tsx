import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { useRouter } from 'next/router';
import { getInternetIdentityUrl } from '../constants/canisters';

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  setRole: (role: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userRole: null,
  login: async () => {},
  logout: async () => {},
  setRole: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const client = await AuthClient.create();
      setAuthClient(client);
      
      const authenticated = await client.isAuthenticated();
      setIsAuthenticated(authenticated);

      // Try to get stored role
      if (authenticated) {
        const storedRole = localStorage.getItem('userRole');
        if (storedRole) {
          setUserRole(storedRole);
        }
      }
    };

    initAuth();
  }, []);

  const login = async () => {
    if (!authClient) return;

    await new Promise((resolve) => {
      authClient.login({
        identityProvider: getInternetIdentityUrl(),
        onSuccess: () => {
          setIsAuthenticated(true);
          resolve(null);
        },
      });
    });

    // Redirect based on role
    if (!userRole) {
      await router.push('/select-role');
    } else {
      await router.push(userRole === 'farmer' ? '/test/farmer-dashboard' : '/test/investor-dashboard');
    }
  };

  const logout = async () => {
    if (!authClient) return;

    await authClient.logout();
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem('userRole');
    router.push('/');
  };

  const setRole = (role: string) => {
    setUserRole(role);
    localStorage.setItem('userRole', role);
    router.push(role === 'farmer' ? '/test/farmer-dashboard' : '/test/investor-dashboard');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};
