import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface HealthStatus {
  status: string;
  timestamp: string;
}

export function useBackend() {
  const [connected, setConnected] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await api.get<HealthStatus>('/health');
        setConnected(true);
      } catch {
        setConnected(false);
      } finally {
        setChecking(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  return { connected, checking };
}
