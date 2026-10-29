import React, { useState } from 'react';
import { useSocialPulse } from '../context/SocialPulseContext';
import { InboxItem, PlatformType } from '../types';
import {
  MessageSquare,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  Filter,
  Bot,
  Zap,
  Globe,
  Flame,
  Clock,
  CornerDownRight,
  RefreshCw,
} from 'lucide-react';

export const MultilingualInbox: React.FC = () => {
  const { activeProfile, inbox, sendReply, runAutoReplyOnAll, agentSettings, isOnline } = useSocialPulse();

  const [filter, setFilter] = useState<'all' | 'bangla' | 'english' | 'other' | 'unreplied' | 'replied'>('all');
  const [platformFilter, setPlatformFilter] = useState<'all' | PlatformType>('all');
  const [isAutoReplyingAll, setIsAutoReplyingAll] = useState(false);
  const [activeReplyBoxId, setActiveReplyBoxId] = useState<string | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [loadingAiReplyFor, setLoadingAiReplyFor] = useState<string | null>(null);

  // Filter inbox items for active profile
  const profileInbox = inbox.filter(item => item.profileId === activeProfile.id);

  // Sort with Bangla First priority (as requested by user)
  const sortedInbox = [...profileInbox].sort((a, b) => {
    if (agentSettings.banglaPriorityEnabled) {
      if (a.isBangla && !b.isBangla) return -1;
      if (!a.isBangla && b.isBangla) return 1;
    }
    // Then unreplied first
    if (!a.replied && b.replied) return -1;
    if (a.replied && !b.replied) return 1;
    return b.priorityScore - a.priorityScore;
  });

  const filteredItems = sortedInbox.filter(item => {
    if (platformFilter !== 'all' && item.platform !== platformFilter) return false;
    if (filter === 'bangla') return item.isBangla;
    if (filter === 'english') return item.detectedLanguage.toLowerCase().includes('english');
    if (filter === 'other') return !item.isBangla && !item.detectedLanguage.toLowerCase().includes('english');
    if (filter === 'unreplied') return !item.replied;
    if (filter === 'replied') return item.replied;
    return true;
  });

  const totalBangla = profileInbox.filter(i => i.isBangla).length;
  const unrepliedBangla = profileInbox.filter(i => i.isBangla && !i.replied).length;
  const unrepliedTotal = profileInbox.filter(i => !i.replied).length;

  // Run autonomous reply all
  const handleAutoReplyAll = async () => {
    setIsAutoReplyingAll(true);
    try {
      await runAutoReplyOnAll();
    } finally {
      setIsAutoReplyingAll(false);
    }
  };

  // Generate individual AI reply using backend Gemini endpoint
  const handleGenerateAiReply = async (item: InboxItem) => {
    setLoadingAiReplyFor(item.id);
    setActiveReplyBoxId(item.id);

    try {
      if (isOnline) {
        const res = await fetch('/api/ai/reply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            commentText: item.content,
            author: item.authorName,
            platform: item.platform,
            postContext: item.parentPostTitle || 'SocialPulse Post',
            personaTone: agentSettings.replyPersonaTone,
          }),
        });

        const data = await res.json();
        if (data.data?.replyText) {
          setReplyDrafts(prev => ({ ...prev, [item.id]: data.data.replyText }));
          return;
        }
      }

      // Fallback
      const fallback = item.isBangla
        ? `অনেক ধন্যবাদ ${item.authorName} ভাইয়া/আপু! আপনার মতামতের জন্য আমরা গভীরভাবে কৃতজ্ঞ। বিস্তারিত জানতে যেকোনো সময় ইনবক্সে নক দিন! ✨`
        : `Thank you so much ${item.authorName}! Really appreciate you engaging with our content. Stay tuned for more! 🚀`;

      setReplyDrafts(prev => ({ ...prev, [item.id]: fallback }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAiReplyFor(null);
    }
  };

  const handleSendReply = (item: InboxItem) => {
    const text = replyDrafts[item.id] || '';
    if (!text.trim()) return;
    sendReply(item.id, text);
    setActiveReplyBoxId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
              Multilingual Smart Inbox
            </h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              🇧🇩 বাংলা অগ্রাধিকার (Bangla Priority Active)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Replies to every single comment & DM contextually across FB, IG, LinkedIn, and YouTube.
            No keyword triggers. Bangla comments prioritized first, then English.
          </p>
        </div>

        {/* Master AI Auto-Reply Button */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleAutoReplyAll}
            disabled={isAutoReplyingAll || unrepliedTotal === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white shadow-lg shadow-emerald-600/20 transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {isAutoReplyingAll ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Auto-Replying Bangla & Global Queue...</span>
              </>
            ) : (
              <>
                <Bot className="w-3.5 h-3.5" />
                <span>Auto-Reply to All Pending ({unrepliedTotal})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter and Priority Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        {/* Language Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              filter === 'all'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            All Messages ({profileInbox.length})
          </button>

          <button
            onClick={() => setFilter('bangla')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition ${
              filter === 'bangla'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
            }`}
          >
            <span>🇧🇩 বাংলা First</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-current">
              {totalBangla} {unrepliedBangla > 0 && `(${unrepliedBangla} new)`}
            </span>
          </button>

          <button
            onClick={() => setFilter('english')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              filter === 'english'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            English
          </button>

          <button
            onClick={() => setFilter('other')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              filter === 'other'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            Other Languages
          </button>

          <button
            onClick={() => setFilter('unreplied')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              filter === 'unreplied'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            Pending ({unrepliedTotal})
          </button>
        </div>

        {/* Platform Filter */}
        <div className="flex items-center gap-1 self-end sm:self-auto">
          <span className="text-[11px] text-zinc-400 mr-1 hidden sm:inline">Network:</span>
          {(['all', 'facebook', 'instagram', 'linkedin', 'youtube'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPlatformFilter(p)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize transition ${
                platformFilter === p
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Feed */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <MessageSquare className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">No comments found in this view</h3>
            <p className="text-xs text-zinc-500 mt-1">Try switching language filters or network tabs.</p>
          </div>
        ) : (
          filteredItems.map(item => {
            const isReplying = activeReplyBoxId === item.id;
            const currentDraft = replyDrafts[item.id] || '';
            const isLoadingAi = loadingAiReplyFor === item.id;

            const platformBadges: Record<PlatformType, { label: string; bg: string; text: string }> = {
              facebook: { label: 'Facebook', bg: 'bg-blue-500/10', text: 'text-blue-500' },
              instagram: { label: 'Instagram', bg: 'bg-pink-500/10', text: 'text-pink-500' },
              linkedin: { label: 'LinkedIn', bg: 'bg-sky-500/10', text: 'text-sky-500' },
              youtube: { label: 'YouTube', bg: 'bg-red-500/10', text: 'text-red-500' },
            };

            const plat = platformBadges[item.platform];

            return (
              <div
                key={item.id}
                className={`p-5 rounded-3xl border transition shadow-xs ${
                  item.isBangla
                    ? 'bg-emerald-950/10 dark:bg-emerald-950/20 border-emerald-500/30 ring-1 ring-emerald-500/20'
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
                }`}
              >
                {/* Header: Author, Badges, Priority, Time */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.authorAvatar}
                      alt={item.authorName}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-zinc-200 dark:ring-zinc-800"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-zinc-900 dark:text-white">
                          {item.authorName}
                        </span>
                        <span className="text-xs text-zinc-400 font-normal">
                          {item.authorHandle}
                        </span>

                        {/* Platform tag */}
                        <span className={`text-[10px] font-bold px-2 py-0.2 rounded-md ${plat.bg} ${plat.text}`}>
                          {plat.label}
                        </span>

                        {/* Language & Priority Tag */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.2 rounded-md ${
                            item.isBangla
                              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                          }`}
                        >
                          {item.isBangla ? '🇧🇩 ' : '🌐 '}
                          {item.detectedLanguage}
                        </span>

                        {item.isBangla && (
                          <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-emerald-500 text-white">
                            Priority #{item.priorityScore}
                          </span>
                        )}
                      </div>

                      {item.parentPostTitle && (
                        <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">
                          on <span className="italic font-medium text-zinc-600 dark:text-zinc-300">"{item.parentPostTitle}"</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.timestamp}
                    </span>
                    {item.replied && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {item.autoReplied ? 'AI Auto-Replied' : 'Replied'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Comment Content */}
                <div className="my-3 text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-normal pl-13">
                  "{item.content}"
                </div>

                {/* Existing Reply Display */}
                {item.replied && item.replyText && (
                  <div className="mt-3 ml-13 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800/80 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                      <div className="flex items-center gap-1.5">
                        <CornerDownRight className="w-3.5 h-3.5" />
                        <span>{activeProfile.name} (Reply)</span>
                      </div>
                      <span className="text-[10px] text-zinc-400">{item.replyTimestamp}</span>
                    </div>
                    <p className="text-zinc-700 dark:text-zinc-300 pl-4">{item.replyText}</p>
                  </div>
                )}

                {/* Reply Actions & Editor */}
                <div className="mt-3 ml-13 pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100 dark:border-zinc-800/60">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleGenerateAiReply(item)}
                      disabled={isLoadingAi}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isLoadingAi ? 'animate-spin' : ''}`} />
                      <span>{isLoadingAi ? 'Crafting contextual reply...' : 'AI Contextual Reply'}</span>
                    </button>

                    {!isReplying && (
                      <button
                        onClick={() => {
                          setActiveReplyBoxId(item.id);
                          if (!replyDrafts[item.id]) {
                            handleGenerateAiReply(item);
                          }
                        }}
                        className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 font-medium px-2 py-1"
                      >
                        {item.replied ? 'Send Another Reply' : 'Reply Manually'}
                      </button>
                    )}
                  </div>

                  {item.isBangla && (
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      ✓ Bangla natural speech synthesis enabled
                    </span>
                  )}
                </div>

                {/* Reply Editor Box */}
                {isReplying && (
                  <div className="mt-4 ml-13 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      <span>Drafting response for {item.authorName}:</span>
                      {item.isBangla && (
                        <span className="text-[10px] text-emerald-500 font-bold">
                          Bangla Contextual Mode
                        </span>
                      )}
                    </div>

                    <textarea
                      rows={3}
                      value={currentDraft}
                      onChange={e =>
                        setReplyDrafts(prev => ({ ...prev, [item.id]: e.target.value }))
                      }
                      placeholder="Type reply or click AI Contextual Reply..."
                      className="w-full text-xs sm:text-sm p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white resize-none outline-hidden focus:border-indigo-500"
                    />

                    {/* Quick Suggestions for Bangla */}
                    {item.isBangla && (
                      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                        <span className="text-[10px] text-zinc-400 shrink-0">Quick Bangla:</span>
                        {[
                          'ধন্যবাদ ভাইয়া, সাথে থাকুন!',
                          'বিস্তারিত ইনবক্সে জানিয়ে দেওয়া হয়েছে!',
                          'অসাধারণ ফিডব্যাকের জন্য কৃতজ্ঞতা!',
                        ].map(preset => (
                          <button
                            key={preset}
                            onClick={() =>
                              setReplyDrafts(prev => ({
                                ...prev,
                                [item.id]: `${item.authorName} ভাইয়া/আপু, ${preset}`,
                              }))
                            }
                            className="text-[11px] px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 whitespace-nowrap hover:bg-emerald-100"
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => setActiveReplyBoxId(null)}
                        className="px-3 py-1.5 rounded-xl text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSendReply(item)}
                        disabled={!currentDraft.trim()}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Reply</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
