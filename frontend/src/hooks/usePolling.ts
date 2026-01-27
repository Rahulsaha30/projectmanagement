import { useEffect, useState, useRef, useCallback } from 'react';

interface UsePollingOptions<T> {
  fetchFn: () => Promise<T>;
  interval?: number;
  immediate?: boolean;
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export const usePolling = <T>({
  fetchFn,
  interval = 30000,
  immediate = true,
  enabled = true,
  onSuccess,
  onError
}: UsePollingOptions<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const intervalRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

  const clearPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const fetchData = useCallback(async () => {
    if (!mountedRef.current) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await fetchFn();
      if (mountedRef.current) {
        setData(result);
        onSuccess?.(result);
      }
    } catch (err) {
      if (mountedRef.current) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        onError?.(error);
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [fetchFn, onSuccess, onError]);

  const startPolling = useCallback(() => {
    if (!enabled) return;
    
    if (immediate) {
      fetchData();
    }
    
    clearPolling();
    intervalRef.current = setInterval(fetchData, interval);
  }, [enabled, immediate, interval, fetchData, clearPolling]);

  const stopPolling = useCallback(() => {
    clearPolling();
  }, [clearPolling]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    mountedRef.current = true;
    
    if (enabled) {
      startPolling();
    }

    return () => {
      mountedRef.current = false;
      clearPolling();
    };
  }, [enabled, startPolling, clearPolling]);

  return {
    data,
    isLoading,
    error,
    refetch,
    startPolling,
    stopPolling
  };
};