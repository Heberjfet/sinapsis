import { useState, useEffect, useCallback } from 'react';
import { api } from './api';
import { Page, notesApi } from './notesApi';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useApi<T>(
  fetchFn: () => Promise<T>,
  options?: UseApiOptions<T>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
      options?.onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      options?.onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, options]);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch: execute };
}

export function useNotes() {
  return useApi(() => notesApi.getAll());
}

export function useNote(id: string | null) {
  return useApi(
    () => (id ? notesApi.getById(id) : Promise.resolve(null)),
    { onError: (err) => console.error('Error fetching note:', err) }
  );
}

export function useApiHealth() {
  return useApi(() => api.get<{ status: string; timestamp: string }>('/health'));
}
