import { useState, useEffect } from 'react';
import { Principal } from '@dfinity/principal';

export interface Profile {
  id: string;
  principal: Principal;
  name: string;
  email?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  settings: {
    notifications: {
      email: boolean;
      push: boolean;
      frequency: 'instant' | 'hourly' | 'daily' | 'weekly';
      types: {
        transactions: boolean;
        priceAlerts: boolean;
        stakingRewards: boolean;
        governance: boolean;
        security: boolean;
      };
    };
    wallet: {
      showBalance: boolean;
      defaultCurrency: string;
      autoLockDuration: number;
    };
  };
  stats: {
    totalInvestments: number;
    totalReturns: number;
    activePools: number;
    votingPower: number;
  };
}

interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}

export const useProfile = (principalId?: string) => {
  const [state, setState] = useState<ProfileState>({
    profile: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!principalId) {
        setState({
          profile: null,
          loading: false,
          error: 'No principal ID provided',
        });
        return;
      }

      try {
        // TODO: Replace with actual API call to fetch profile from ICP
        // This is mock data for development
        const mockProfile: Profile = {
          id: '1',
          principal: Principal.fromText(principalId),
          name: 'Demo User',
          email: 'demo@example.com',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          settings: {
            notifications: {
              email: true,
              push: true,
              frequency: 'daily',
              types: {
                transactions: true,
                priceAlerts: true,
                stakingRewards: true,
                governance: false,
                security: true,
              },
            },
            wallet: {
              showBalance: true,
              defaultCurrency: 'USD',
              autoLockDuration: 15,
            },
          },
          stats: {
            totalInvestments: 10000,
            totalReturns: 12500,
            activePools: 3,
            votingPower: 5000,
          },
        };

        setState({
          profile: mockProfile,
          loading: false,
          error: null,
        });
      } catch (error) {
        setState({
          profile: null,
          loading: false,
          error: 'Failed to fetch profile',
        });
      }
    };

    fetchProfile();
  }, [principalId]);

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      // TODO: Replace with actual API call to update profile
      // This is a mock implementation
      setState((prev) => ({
        profile: prev.profile
          ? {
              ...prev.profile,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : null,
        loading: false,
        error: null,
      }));

      return true;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: 'Failed to update profile',
      }));
      return false;
    }
  };

  return {
    ...state,
    updateProfile,
  };
};
