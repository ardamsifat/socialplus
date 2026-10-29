import { useEffect, useState } from 'react';
import { OfflineAction } from '../types';

export function useOnlineStatus(onSync?: (actions: OfflineAction[]) => void) {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  const [offlineQueue, setOfflineQueue] = useState<OfflineAction[]>(() => {
    try {
      const stored = localStorage.getItem('socialpulse_offline_queue');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Process offline queue
      try {
        const stored = localStorage.getItem('socialpulse_offline_queue');
        if (stored) {
          const queue: OfflineAction[] = JSON.parse(stored);
          if (queue.length > 0 && onSync) {
            onSync(queue);
            localStorage.removeItem('socialpulse_offline_queue');
            setOfflineQueue([]);
          }
        }
      } catch (e) {
        console.error('Error processing offline queue:', e);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [onSync]);

  const enqueueAction = (type: OfflineAction['type'], payload: any) => {
    const newAction: OfflineAction = {
      id: 'offline-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      type,
      payload,
      timestamp: new Date().toISOString(),
      status: 'pending',
    };

    setOfflineQueue(prev => {
      const next = [newAction, ...prev];
      try {
        localStorage.setItem('socialpulse_offline_queue', JSON.stringify(next));
      } catch (e) {
        console.error('Error storing offline queue:', e);
      }
      return next;
    });

    return newAction;
  };

  return {
    isOnline,
    offlineQueue,
    enqueueAction,
  };
}
