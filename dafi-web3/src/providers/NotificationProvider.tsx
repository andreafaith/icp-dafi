import React from 'react';
import { Toaster } from 'react-hot-toast';

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            duration: 5000,
            style: {
              background: '#10B981',
              color: 'white',
            },
          },
          error: {
            duration: 7000,
            style: {
              background: '#EF4444',
              color: 'white',
            },
          },
          loading: {
            style: {
              background: '#6B7280',
              color: 'white',
            },
          },
        }}
      />
    </>
  );
}
