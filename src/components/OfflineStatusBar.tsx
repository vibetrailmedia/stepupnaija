import { useState, useEffect } from 'react';
import { WifiOff, Wifi, Clock, CheckCircle2 } from 'lucide-react';
import { offlineService } from '@/services/offlineService';

export function OfflineStatusBar() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateStatus = () => {
      const online = offlineService.isOnlineStatus();
      const pendingCount = offlineService.getPendingSyncCount();
      
      setIsOnline(online);
      setPendingSyncCount(pendingCount);
      
      // Show bar when offline or when there are pending syncs
      setIsVisible(!online || pendingCount > 0);
    };

    // Initial update
    updateStatus();

    // Listen for network changes
    const handleOnline = () => updateStatus();
    const handleOffline = () => updateStatus();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check periodically for pending sync changes
    const interval = setInterval(updateStatus, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className={`
        fixed top-0 left-0 right-0 z-50 px-4 py-2 text-sm font-medium text-center transition-all duration-300
        ${isOnline 
          ? 'bg-blue-600 text-white' 
          : 'bg-orange-600 text-white'
        }
      `}
      data-testid="offline-status-bar"
    >
      <div className="flex items-center justify-center gap-2">
        {isOnline ? (
          <>
            <Wifi className="h-4 w-4" />
            {pendingSyncCount > 0 ? (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Syncing {pendingSyncCount} action{pendingSyncCount !== 1 ? 's' : ''}...
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" />
                All changes synced
              </span>
            )}
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4" />
            <span>You're offline. Changes will sync when connection returns.</span>
            {pendingSyncCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-xs">
                {pendingSyncCount} pending
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}