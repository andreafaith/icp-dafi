import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotificationProvider } from './NotificationProvider';
import { Web3Provider } from './Web3Provider';
import { ThemeProvider } from './ThemeProvider';
import { I18nProvider } from './I18nProvider';
import { ErrorBoundary } from '../components/shared/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <I18nProvider>
          <ThemeProvider>
            <Web3Provider>
              <NotificationProvider>
                {children}
              </NotificationProvider>
            </Web3Provider>
          </ThemeProvider>
        </I18nProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
