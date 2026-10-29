import React from 'react';
import { useSocialPulse } from '../context/SocialPulseContext';
import {
  TrendingUp,
  Eye,
  Users,
  Share2,
  Sparkles,
  Zap,
  ArrowUpRight,
  Play,
  Film,
  FileText,
  Clock,
  CheckCircle,
  MessageCircle,
  Radio,
  Send,
} from 'lucide-react';

interface OmniDashboardProps {
  onOpenOmnipost: () => void;
  onNavigateToInbox: () => void;
  onNavigateToAnalytics: () => void;
}

export const OmniDashboard: React.FC<OmniDashboardProps> = ({
  onOpenOmnipost,
  onNavigateToInbox,
  onNavigateToAnalytics,
}) => {
  const { activeProfile, analytics, posts, livePulseActivity, isAgentRunning, inbox } = useSocialPulse();

  const profilePosts = posts.filter(p => p.profileId === activeProfile.id);
  const scheduledCount = profilePosts.filter(p => p.status === 'scheduled').length;
  const publishedCount = profilePosts.filter(p => p.status === 'published').length;

  const unrepliedBangla = inbox.filter(i => i.profileId === activeProfile.id && !i.replied && i.isBangla).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero Header with Active Profile Context & Quick Omnipost Trigger */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-900 via-indigo-950 to-zinc-900 text-white p-6 sm:p-8 border border-indigo-900/40 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src={activeProfile.avatar}
              alt={activeProfile.name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover ring-2 ring-indigo-400/40 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {activeProfile.name}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">
                  {activeProfile.category}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-xl">
                Omnichannel AI distribution active across Facebook, Instagram, LinkedIn, and YouTube.
                Prioritizing Bangla comments and automated Reels/Shorts workflows.
              </p>

              {/* Connected Platform Badges */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="text-[11px] font-medium text-zinc-400">Connected:</span>
                {Object.entries(activeProfile.accounts).map(([plat, data]) => {
                  const colors: Record<string, string> = {
                    facebook: 'bg-blue-600/20 text-blue-300 border-blue-500/30',
                    instagram: 'bg-pink-600/20 text-pink-300 border-pink-500/30',
                    linkedin: 'bg-sky-600/20 text-sky-300 border-sky-500/30',
                    youtube: 'bg-red-600/20 text-red-300 border-red-500/30',
                  };

                  return (
                    <span
                      key={plat}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                        data.connected
                          ? colors[plat]
                          : 'bg-zinc-800/60 text-zinc-500 border-zinc-700/40 line-through'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${data.connected ? 'bg-emerald-400' : 'bg-zinc-500'}`} />
                      {plat.charAt(0).toUpperCase() + plat.slice(1)}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Actions in Hero */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenOmnipost}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-white text-zinc-950 hover:bg-zinc-100 shadow-lg shadow-white/10 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <Send className="w-3.5 h-3.5 text-indigo-600" />
              <span>Simultaneous Omnipost</span>
            </button>
            <button
              onClick={onNavigateToInbox}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-zinc-800/80 hover:bg-zinc-750 text-white border border-zinc-700/60 transition"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                Smart Inbox {unrepliedBangla > 0 && `(${unrepliedBangla} Bangla)`}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Reach */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Aggregate Reach</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
            {analytics.totalReach.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+24.8% vs last cycle</span>
          </div>
        </div>

        {/* Total Impressions */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Impressions</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
            {analytics.totalImpressions.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-purple-600 dark:text-purple-400 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Synced across 4 networks</span>
          </div>
        </div>

        {/* Engagement Rate */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Engagement</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
            {analytics.totalEngagementRate}%
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <span>High viral index on Reels & Shorts</span>
          </div>
        </div>

        {/* Audience Base */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Followers</span>
            <div className="p-2 rounded-xl bg-pink-50 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
            {analytics.totalFollowers.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-pink-600 dark:text-pink-400 font-medium">
            <span>+{Math.floor(analytics.totalFollowers * 0.042).toLocaleString()} this month</span>
          </div>
        </div>
      </div>

      {/* Grid: Format Performance (Reels vs Shorts vs Posts) & Platform Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Format Performance: Reels vs Shorts vs Posts */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Format Breakdown</h2>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Reels vs Shorts vs Standard Posts</p>
            </div>
            <Film className="w-4 h-4 text-indigo-500" />
          </div>

          <div className="space-y-4">
            {/* Reels */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-pink-500" />
                  Instagram & FB Reels
                </span>
                <span className="font-bold text-zinc-900 dark:text-white">
                  {analytics.reelsEngagement.toLocaleString()} Engagements (48%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full" style={{ width: '48%' }} />
              </div>
            </div>

            {/* Shorts */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-red-500" />
                  YouTube Shorts
                </span>
                <span className="font-bold text-zinc-900 dark:text-white">
                  {analytics.shortsEngagement.toLocaleString()} Engagements (36%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-500 to-amber-500 rounded-full" style={{ width: '36%' }} />
              </div>
            </div>

            {/* Static / Carousel */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-500" />
                  Feed Posts & LinkedIn Insight
                </span>
                <span className="font-bold text-zinc-900 dark:text-white">
                  {analytics.staticPostsEngagement.toLocaleString()} Engagements (16%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: '16%' }} />
              </div>
            </div>
          </div>

          <div className="mt-5 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-850/60 border border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-600 dark:text-zinc-400">
            💡 <strong>AI Agent Insight:</strong> 9:16 vertical short-form content drives <strong>84%</strong> of all net viewer acquisition for {activeProfile.name}.
          </div>
        </div>

        {/* Platform Breakdown Bars */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Platform Reach</h2>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Live audience share across networks</p>
            </div>
            <button
              onClick={onNavigateToAnalytics}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Full Report →
            </button>
          </div>

          <div className="space-y-3.5">
            {Object.entries(analytics.platformBreakdown).map(([plat, data]) => {
              const platformLabels: Record<string, { name: string; color: string; border: string }> = {
                facebook: { name: 'Facebook', color: 'bg-blue-600', border: 'border-blue-500/20' },
                instagram: { name: 'Instagram', color: 'bg-pink-600', border: 'border-pink-500/20' },
                linkedin: { name: 'LinkedIn', color: 'bg-sky-600', border: 'border-sky-500/20' },
                youtube: { name: 'YouTube', color: 'bg-red-600', border: 'border-red-500/20' },
              };

              const pInfo = platformLabels[plat];
              const percent = Math.min(100, Math.round((data.reach / analytics.totalReach) * 100));

              return (
                <div key={plat} className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-850/40 border border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${pInfo.color}`} />
                      {pInfo.name}
                    </span>
                    <span className="text-zinc-500 dark:text-zinc-400 font-mono text-[11px]">
                      {data.reach.toLocaleString()} reach ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                    <div className={`h-full ${pInfo.color} rounded-full`} style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-time Pulse Feed */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
                <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Live Pulse Stream</h2>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 font-semibold">
                REAL-TIME
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-4">
              Real-time cross-platform interactions and AI auto-reply triggers
            </p>

            <div className="space-y-2.5">
              {livePulseActivity.map(act => (
                <div
                  key={act.id}
                  className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-850/60 border border-zinc-100 dark:border-zinc-800 flex items-start gap-2.5 text-xs text-zinc-700 dark:text-zinc-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <p className="leading-snug">{act.text}</p>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5 block">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
            <span>Agent status: {isAgentRunning ? 'Running' : 'Paused'}</span>
            <button
              onClick={onNavigateToInbox}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Open Inbox →
            </button>
          </div>
        </div>
      </div>

      {/* Top Posts & Scheduled Queue */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Active Content Queue</h2>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              {publishedCount} published, {scheduledCount} scheduled across networks
            </p>
          </div>
          <button
            onClick={onOpenOmnipost}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition"
          >
            <span>+ Schedule Post</span>
          </button>
        </div>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {profilePosts.map(post => {
            const isPublished = post.status === 'published';

            return (
              <div key={post.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  {post.mediaUrl ? (
                    <img
                      src={post.mediaUrl}
                      alt={post.title}
                      className="w-16 h-16 rounded-xl object-cover ring-1 ring-zinc-200 dark:ring-zinc-800 shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-zinc-400" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                        {post.title}
                      </h3>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isPublished
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {isPublished ? 'Published' : 'Scheduled'}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-indigo-500 dark:text-indigo-400">
                        {post.postType.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-1 max-w-xl">
                      {post.masterIdea}
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-[11px] text-zinc-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-zinc-400" />
                        <span>
                          {isPublished
                            ? `Live since ${new Date(post.scheduledAt).toLocaleDateString()}`
                            : `Set for ${new Date(post.scheduledAt).toLocaleDateString()} at ${new Date(post.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                        </span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1.5">
                        {post.platforms.map(p => (
                          <span
                            key={p}
                            className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                          >
                            {p.slice(0, 2)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                {isPublished && post.metrics ? (
                  <div className="flex items-center gap-4 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    <div className="flex flex-col items-end">
                      <span className="text-zinc-900 dark:text-white font-bold">
                        {post.metrics.reach.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-normal">Reach</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-zinc-900 dark:text-white font-bold">
                        {post.metrics.likes.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-normal">Likes</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-zinc-900 dark:text-white font-bold">
                        {post.metrics.views.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-normal">Views</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-amber-500 font-medium flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Auto-publish queued</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
