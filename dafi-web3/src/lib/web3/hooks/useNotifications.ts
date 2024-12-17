import { useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { TransactionReceipt } from '../types';

interface NotificationOptions {
  duration?: number;
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
}

export function useNotifications(defaultOptions: NotificationOptions = {}) {
  const notifySuccess = useCallback((message: string, options?: NotificationOptions) => {
    toast.success(message, {
      duration: 5000,
      position: 'top-right',
      ...defaultOptions,
      ...options,
    });
  }, [defaultOptions]);

  const notifyError = useCallback((message: string, options?: NotificationOptions) => {
    toast.error(message, {
      duration: 7000,
      position: 'top-right',
      ...defaultOptions,
      ...options,
    });
  }, [defaultOptions]);

  const notifyInfo = useCallback((message: string, options?: NotificationOptions) => {
    toast(message, {
      duration: 3000,
      position: 'top-right',
      ...defaultOptions,
      ...options,
    });
  }, [defaultOptions]);

  const notifyTransaction = useCallback((
    tx: TransactionReceipt,
    messages: {
      pending?: string;
      success?: string;
      error?: string;
    } = {}
  ) => {
    const id = toast.loading(
      messages.pending || 'Transaction pending...',
      { position: 'top-right' }
    );

    if (tx.status === 'success') {
      toast.success(
        messages.success || 'Transaction successful',
        { id, duration: 5000 }
      );
    } else {
      toast.error(
        messages.error || 'Transaction failed',
        { id, duration: 7000 }
      );
    }
  }, []);

  return {
    notifySuccess,
    notifyError,
    notifyInfo,
    notifyTransaction,
  };
}
