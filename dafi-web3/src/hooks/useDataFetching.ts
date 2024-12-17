import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useNotifications } from '../lib/auth/hooks/useNotifications';

interface FetchOptions<TData> extends Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'> {
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
}

export function useDataFetching<TData>(
  queryKey: string[],
  fetchFn: () => Promise<TData>,
  options: FetchOptions<TData> = {}
) {
  const { notifyError } = useNotifications();
  const queryClient = useQueryClient();

  const query = useQuery<TData, Error>({
    queryKey,
    queryFn: fetchFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    refetchOnWindowFocus: false,
    ...options,
    onError: (error) => {
      notifyError(error.message);
      options.onError?.(error);
    },
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries(queryKey);
  }, [queryClient, queryKey]);

  const prefetch = useCallback(async () => {
    await queryClient.prefetchQuery(queryKey, fetchFn);
  }, [queryClient, queryKey, fetchFn]);

  const setData = useCallback(
    (updater: (old: TData | undefined) => TData) => {
      queryClient.setQueryData(queryKey, updater);
    },
    [queryClient, queryKey]
  );

  return {
    ...query,
    invalidate,
    prefetch,
    setData,
  };
}

interface MutationOptions<TData, TVariables> {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
  invalidateQueries?: string[][];
}

export function useDataMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: MutationOptions<TData, TVariables> = {}
) {
  const { notifySuccess, notifyError } = useNotifications();
  const queryClient = useQueryClient();

  return useMutation<TData, Error, TVariables>({
    mutationFn,
    onSuccess: (data, variables) => {
      if (options.invalidateQueries) {
        options.invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries(queryKey);
        });
      }
      notifySuccess('Operation completed successfully');
      options.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      notifyError(error.message);
      options.onError?.(error, variables);
    },
  });
}
