import React, { useState } from 'react';
import { useSocialPulse } from '../context/SocialPulseContext';
import {
  TrendingUp,
  BarChart3,
  Calendar,
  Download,
  Share2,
  Users,
  Eye,
  Zap,
  Play,
  Film,
  Globe,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { activeProfile, analytics, posts, inbox } = useSocialPulse();

  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');
  const [showExportModal, setShowExportModal] = useState(false);

  // Language Breakdown from Inbox
  const profileInbox = inbox.filter(i => i.profileId === activeProfile.id);
  const banglaCount = profileInbox.filter(i => i.isBangla).length;
  const englishCount = profileInbox.filter(i => i.detectedLanguage.toLowerCase().includes('english')).length;
  const otherCount = Math.max(0, profileInbox.length - banglaCount - englishCount);

  const banglaPercent = profileInbox.length > 0 ? Math.round((banglaCount / profileInbox.length) * 100) : 65;
  const englishPercent = profileInbox.length > 0 ? Math.round((englishCount / profileInbox.length) * 100) : 25;
  const otherPercent = 100 - banglaPercent - englishPercent;

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Platform,Followers,EstimatedReach,EngagementRate\n' +
      `Facebook,${activeProfile.accounts.facebook.followers},${analytics.platformBreakdown.facebook.reach},${analytics.platformBreakdown.facebook.rate}%\n` +
      `Instagram,${activeProfile.accounts.instagram.followers},${analytics.platformBreakdown.instagram.reach},${analytics.platformBreakdown.instagram.rate}%\n` +
      `LinkedIn,${activeProfile.accounts.linkedin.followers},${analytics.platformBreakdown.linkedin.reach},${analytics.platformBreakdown.linkedin.rate}%\n` +
      `YouTube,${activeProfile.accounts.youtube.followers},${analytics.platformBreakdown.youtube.reach},${analytics.platformBreakdown.youtube.rate}%\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SocialPulse_Analytics_${activeProfile.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
            Engagement & Performance Analytics
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Cross-platform telemetry for {activeProfile.name} across Facebook, Instagram, LinkedIn & YouTube.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Time Range Pills */}
          <div className="flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold">
            {(['24h', '7d', '30d', '90d'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-3 py-1 rounded-lg uppercase transition ${
                  timeRange === t
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Export Report Button */}
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 hover:opacity-90 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Impressions</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">
            {analytics.totalImpressions.toLocaleString()}
          </div>
          <div className="text-xs text-emerald-500 font-medium mt-1">+19.4% vs previous {timeRange}</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Reels & Shorts Views</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">
            {analytics.totalViews.toLocaleString()}
          </div>
          <div className="text-xs text-purple-500 font-medium mt-1">82% average completion</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Engaged Interactions</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">
            {(analytics.totalLikes + analytics.totalComments + analytics.totalShares).toLocaleString()}
          </div>
          <div className="text-xs text-emerald-500 font-medium mt-1">{analytics.totalEngagementRate}% aggregate rate</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Net Shares & Reposts</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">
            {analytics.totalShares.toLocaleString()}
          </div>
          <div className="text-xs text-indigo-500 font-medium mt-1">Viral amplification factor: 3.2x</div>
        </div>
      </div>

      {/* Grid: Platform Breakdown Deep Dive & Language Sentiment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Network Comparison Table & Visualizer */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Performance by Social Network</h2>
            <span className="text-xs text-zinc-400">All 4 Channels Synchronized</span>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {Object.entries(analytics.platformBreakdown).map(([plat, d]) => {
              const icons: Record<string, string> = {
                facebook: '📘 Facebook',
                instagram: '📸 Instagram',
                linkedin: '💼 LinkedIn',
                youtube: '🔴 YouTube',
              };

              return (
                <div key={plat} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-xs text-zinc-900 dark:text-white">{icons[plat]}</span>
                    <span className="text-[11px] text-zinc-400">({d.followers.toLocaleString()} audience)</span>
                  </div>
                  <div className="flex items-center gap-6 text-xs">
                    <div className="text-right">
                      <div className="font-bold text-zinc-900 dark:text-white">{d.reach.toLocaleString()}</div>
                      <div className="text-[10px] text-zinc-400">Reach</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-500">{d.rate}%</div>
                      <div className="text-[10px] text-zinc-400">Eng Rate</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Multilingual Interaction Breakdown (Bangla First) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Audience Language Distribution</h2>
              <p className="text-[11px] text-zinc-500">Bangla priority auto-reply workload</p>
            </div>
            <Globe className="w-4 h-4 text-emerald-500" />
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  🇧🇩 Bengali (বাংলা ও বাংলিশ)
                </span>
                <span className="font-mono text-zinc-900 dark:text-white">{banglaPercent}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: `${banglaPercent}%` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  🇬🇧 English (Global Creator Traffic)
                </span>
                <span className="font-mono text-zinc-900 dark:text-white">{englishPercent}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-400 rounded-full" style={{ width: `${englishPercent}%` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-zinc-600 dark:text-zinc-400">
                  🌐 Other Global Dialects (Hindi, Arabic, European)
                </span>
                <span className="font-mono text-zinc-900 dark:text-white">{otherPercent}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <div className="h-full bg-zinc-500 rounded-full" style={{ width: `${otherPercent}%` }} />
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-300">
            ✨ <strong>Bangla-First AI Advantage:</strong> Responding in native Bangla within 60 seconds delivers an average <strong>3.8x higher comment sentiment</strong> and 42% repeat engagement on subsequent posts!
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-zinc-900 dark:text-white">Export Analytics Report</h3>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-500 leading-relaxed">
              Export comprehensive engagement metrics for <strong>{activeProfile.name}</strong> across Facebook, Instagram, LinkedIn, and YouTube.
            </p>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleExportCSV}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download CSV Dataset</span>
              </button>

              <button
                onClick={() => setShowExportModal(false)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
