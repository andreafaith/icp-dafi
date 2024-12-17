import { useState, useCallback, useEffect } from 'react';
import { useWeb3Provider } from '../../web3/hooks/useWeb3Provider';
import { AuthService } from '../authService';
import { UserProfile, AuthToken, Web3AuthResponse, DIDAuthResponse } from '../types';

const AUTH_TOKEN_KEY = 'dafi_auth_token';
const REFRESH_TOKEN_KEY = 'dafi_refresh_token';

export function useAuth() {
  const { provider, address, chainId } = useWeb3Provider();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authToken, setAuthToken] = useState<AuthToken | null>(null);

  const authService = new AuthService(
    process.env.NEXT_PUBLIC_JWT_SECRET!,
    process.env.NEXT_PUBLIC_JWT_REFRESH_SECRET!,
    process.env.NEXT_PUBLIC_KYC_PROVIDER_URL!,
    process.env.NEXT_PUBLIC_KYC_API_KEY!
  );

  useEffect(() => {
    // Load auth token from storage
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    
    if (storedToken && storedRefreshToken) {
      setAuthToken({
        accessToken: storedToken,
        refreshToken: storedRefreshToken,
        expiresIn: 0, // Will be refreshed if needed
      });
    }
  }, []);

  const login = useCallback(async () => {
    if (!provider || !address) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      // Get challenge message
      const signer = provider.getSigner();
      const message = `Welcome to DAFI Platform!\n\nPlease sign this message to verify your wallet ownership.\n\nWallet: ${address}\nTimestamp: ${new Date().toISOString()}`;
      
      // Sign message
      const signature = await signer.signMessage(message);

      // Create Web3 auth response
      const web3AuthResponse: Web3AuthResponse = {
        signature,
        address,
        chainId: chainId || 1,
        message,
      };

      // Get DID auth response (simplified for example)
      const didAuthResponse: DIDAuthResponse = {
        did: `did:ethr:${address}`,
        verifiableCredential: 'vc_placeholder',
        proof: 'proof_placeholder',
      };

      // Authenticate
      const tokens = await authService.authenticate(web3AuthResponse, didAuthResponse);
      
      // Store tokens
      localStorage.setItem(AUTH_TOKEN_KEY, tokens.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
      setAuthToken(tokens);

      // Load user profile
      // const userProfile = await loadUserProfile(tokens.accessToken);
      // setUser(userProfile);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [provider, address, chainId]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      if (authToken?.accessToken) {
        // Revoke session on server
        // await authService.revokeSession(authToken.accessToken);
      }
      
      // Clear local storage
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      
      // Reset state
      setAuthToken(null);
      setUser(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  const refreshToken = useCallback(async () => {
    if (!authToken?.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const newTokens = await authService.refreshToken(authToken.refreshToken);
      localStorage.setItem(AUTH_TOKEN_KEY, newTokens.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, newTokens.refreshToken);
      setAuthToken(newTokens);
      return newTokens;
    } catch (err: any) {
      setError(err.message);
      // If refresh fails, log out
      await logout();
      throw err;
    }
  }, [authToken, logout]);

  const checkRole = useCallback(async (role: string): Promise<boolean> => {
    if (!user?._id) return false;
    return authService.checkRole(user._id.toString(), role as any);
  }, [user]);

  return {
    user,
    authToken,
    loading,
    error,
    login,
    logout,
    refreshToken,
    checkRole,
  };
}
