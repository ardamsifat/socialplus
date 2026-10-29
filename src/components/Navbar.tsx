import React from 'react';
import { useSocialPulse } from '../context/SocialPulseContext';
import { ProfileSwitcher } from './ProfileSwitcher';
import { PWAInstallButton } from './PWAInstallButton';
import {
  Activity,
  Layers,
  Send,
  MessageSquare,
  BarChart3,
  Bot,
  Sun,
  Moon,
  Sparkles,
  Wifi,
  WifiOff,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenNewPost: () => void;
  onOpenNewProfileModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenNewPost,
  onOpenNewProfileModal,
}) => {
  const { darkMode, toggleDarkMode, isOnline, isAgentRunning, setIsAgentRunning, inbox, activeProfile } = useSocialPulse();

  const unrepliedCount = inbox.filter(i => i.profileId === activeProfile.id && !i.replied).length;
  const banglaUnreplied = inbox.filter(i => i.profileId === activeProfile.id && !i.replied && i.isBangla).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Layers },
    { id: 'omnipost', label: 'Omnipost Studio', icon: Send },
    {
      id: 'inbox',
      label: 'Smart Inbox',
      icon: MessageSquare,
      badge: unrepliedCount > 0 ? unrepliedCount : undefined,
      banglaBadge: banglaUnreplied > 0,
    },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'agent', label: 'AI Agent', icon: Bot },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-850 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md">
      {/* Top Banner with Platform Name & Branding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-md shadow-indigo-500/20">
              <Activity className="w-5 h-5 text-white animate-pulse" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-zinc-950" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-zinc-900 dark:text-white">
                  SocialPulse
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  (MINDCRAFTED REALITIES)
                </span>
              </div>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium hidden sm:inline">
                Autonomous Social Publishing & Bangla-First AI Agent
              </span>
            </div>
          </div>

          {/* Right Controls: Autonomous status, Profile Switcher, Network, PWA, Theme, Action */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Agent Live Pill */}
            <button
              onClick={() => setIsAgentRunning(prev => !prev)}
              className={`hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold transition border ${
                isAgentRunning
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                  : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-500'
              }`}
              title="Toggle Autonomous Social Agent"
            >
              <span className={`w-2 h-2 rounded-full ${isAgentRunning ? 'bg-emerald-500 animate-ping' : 'bg-zinc-400'}`} />
              <span>{isAgentRunning ? 'AI AGENT: AUTOPILOT' : 'AI AGENT: PAUSED'}</span>
            </button>

            {/* Network Indicator */}
            <div
              className="flex items-center text-xs text-zinc-500 dark:text-zinc-400 px-2 py-1 rounded-lg"
              title={isOnline ? 'Network Connected' : 'Offline Mode (Local Storage Synced)'}
            >
              {isOnline ? (
                <Wifi className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-amber-500" />
              )}
            </div>

            {/* Profile Switcher */}
            <ProfileSwitcher onOpenNewProfileModal={onOpenNewProfileModal} />

            {/* PWA Install Button */}
            <PWAInstallButton />

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenNewPost}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:scale-[1.02] active:scale-[0.98] transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Omnipost</span>
              <span className="xs:hidden">+</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-2 border-t border-zinc-100 dark:border-zinc-850/70">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-850'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      item.banglaBadge
                        ? 'bg-emerald-500 text-white animate-pulse'
                        : isActive
                        ? 'bg-zinc-700 dark:bg-zinc-300 text-white dark:text-zinc-900'
                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
