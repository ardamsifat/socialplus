/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SocialPulseProvider, useSocialPulse } from './context/SocialPulseContext';
import { Navbar } from './components/Navbar';
import { OmniDashboard } from './components/OmniDashboard';
import { OmnipostComposer } from './components/OmnipostComposer';
import { MultilingualInbox } from './components/MultilingualInbox';
import { AnalyticsView } from './components/AnalyticsView';
import { AgentSettingsView } from './components/AgentSettingsView';
import { OfflineBanner } from './components/OfflineBanner';
import { NewProfileModal } from './components/NewProfileModal';
import { Activity, Sparkles, Heart } from 'lucide-react';

function AppContent() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isNewProfileModalOpen, setIsNewProfileModalOpen] = useState<boolean>(false);
  const { activeProfile, isAgentRunning } = useSocialPulse();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenNewPost={() => setCurrentTab('omnipost')}
        onOpenNewProfileModal={() => setIsNewProfileModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {currentTab === 'dashboard' && (
          <OmniDashboard
            onOpenOmnipost={() => setCurrentTab('omnipost')}
            onNavigateToInbox={() => setCurrentTab('inbox')}
            onNavigateToAnalytics={() => setCurrentTab('analytics')}
          />
        )}

        {currentTab === 'omnipost' && (
          <OmnipostComposer
            onPostPublished={() => setCurrentTab('dashboard')}
          />
        )}

        {currentTab === 'inbox' && <MultilingualInbox />}

        {currentTab === 'analytics' && <AnalyticsView />}

        {currentTab === 'agent' && <AgentSettingsView />}
      </main>

      {/* Offline Status & Sync Queue Banner */}
      <OfflineBanner />

      {/* Add New Profile Modal */}
      <NewProfileModal
        isOpen={isNewProfileModalOpen}
        onClose={() => setIsNewProfileModalOpen(false)}
      />

      {/* Minimalist Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-850 py-6 text-center text-xs text-zinc-400 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-zinc-800 dark:text-zinc-200">
              SocialPulse
            </span>
            <span className="text-[10px] uppercase font-bold text-indigo-500">
              (MINDCRAFTED REALITIES)
            </span>
            <span className="hidden sm:inline text-zinc-500">•</span>
            <span className="hidden sm:inline text-zinc-500">Autonomous Social Agent & Bangla First Hub</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-zinc-500">
            <span className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${isAgentRunning ? 'bg-emerald-500' : 'bg-zinc-400'}`} />
              Agent Autopilot: {isAgentRunning ? 'Active' : 'Standby'}
            </span>
            <span>Managing: {activeProfile.name}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <SocialPulseProvider>
      <AppContent />
    </SocialPulseProvider>
  );
}
