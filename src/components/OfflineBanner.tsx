import React from 'react';
import { useSocialPulse } from '../context/SocialPulseContext';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const { isOnline, offlineQueue } = useSocialPulse();

  if (isOnline && offlineQueue.length === 0) return null;

  return (
    <aside
      aria-label="Network status banner"
      className="fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-zinc-900/95 dark:bg-zinc-900/95 border border-zinc-700/80 shadow-2xl backdrop-blur-md text-xs text-zinc-200 animate-in slide-in-from-bottom-3"
    >
      {!isOnline ? (
        <>
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          <WifiOff className="w-4 h-4 text-amber-400" />
          <div className="flex flex-col">
            <span className="font-semibold text-amber-300">Offline Mode Active</span>
            <span className="text-[11px] text-zinc-400">
              {offlineQueue.length > 0
                ? `${offlineQueue.length} action(s) queued to sync once online`
                : 'Local cache active. All changes saved locally.'}
            </span>
          </div>
        </>
      ) : (
        <>
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <div className="flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
            <span className="font-medium text-emerald-300">
              Back online — Syncing {offlineQueue.length} pending action(s)...
            </span>
          </div>
        </>
      )}
    </aside>
  );
};
