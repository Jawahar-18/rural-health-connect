import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

interface OfflineContextType {
  isOnline: boolean;
  toggleSimulatedOffline: () => void;
  pendingSyncCount: number;
  syncDataNow: () => Promise<number>;
  lastSyncedTimestamp: string | null;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(apiService.getOfflineQueue().length);
  const [lastSyncedTimestamp, setLastSyncedTimestamp] = useState<string | null>(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleSimulatedOffline = () => {
    setIsOnline(prev => !prev);
  };

  const syncDataNow = async (): Promise<number> => {
    // Simulate network delay for realistic sync animation
    await new Promise(res => setTimeout(res, 1200));
    const syncedItems = apiService.clearOfflineQueue();
    setPendingSyncCount(0);
    setLastSyncedTimestamp(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    return syncedItems;
  };

  const updatePendingCount = () => {
    setPendingSyncCount(apiService.getOfflineQueue().length);
  };

  // Re-check count on mount
  useEffect(() => {
    updatePendingCount();
  }, []);

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        toggleSimulatedOffline,
        pendingSyncCount,
        syncDataNow,
        lastSyncedTimestamp,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = (): OfflineContextType => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};
