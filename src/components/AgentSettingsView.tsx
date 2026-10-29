import React, { useState } from 'react';
import { useSocialPulse } from '../context/SocialPulseContext';
import {
  Bot,
  Zap,
  Sparkles,
  CheckCircle2,
  Clock,
  Globe,
  Sliders,
  ShieldCheck,
  Send,
  Layers,
  RefreshCw,
} from 'lucide-react';

export const AgentSettingsView: React.FC = () => {
  const {
    activeProfile,
    agentSettings,
    updateAgentSettings,
    isAgentRunning,
    setIsAgentRunning,
    addPost,
    isOnline,
  } = useSocialPulse();

  const [isGeneratingBatch, setIsGeneratingBatch] = useState(false);
  const [batchNotice, setBatchNotice] = useState<string | null>(null);

  // Trigger autonomous batch generation
  const handleTriggerAutonomousBatch = async () => {
    setIsGeneratingBatch(true);
    setBatchNotice(null);

    try {
      if (isOnline) {
        const res = await fetch('/api/ai/batch-generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            niche: agentSettings.nicheFocus,
            count: 2,
            profile: activeProfile.name,
          }),
        });

        const data = await res.json();
        if (data.data && Array.isArray(data.data)) {
          data.data.forEach((item: any) => {
            addPost({
              title: item.title,
              masterIdea: item.concept,
              platforms: item.platforms || ['facebook', 'instagram', 'linkedin', 'youtube'],
              postType: 'reel',
              status: 'scheduled',
              scheduledAt: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
              platformVariants: {
                facebook: { caption: `${item.title}\n\n${item.concept}\n\n#SocialPulse #MindcraftedRealities`, postType: 'reel' },
                instagram: { caption: `${item.title} ⚡️📲\n${item.concept}\n\n#Reels #CreatorEconomy`, postType: 'reel' },
                linkedin: { caption: `${item.title}\n\n${item.concept}\n\n#Leadership #AIAutomation`, postType: 'post' },
                youtube: { title: `${item.title} #Shorts`, caption: item.concept, postType: 'short' },
              },
            });
          });

          setBatchNotice(`Autonomous AI Agent successfully queued 2 new scheduled posts for ${activeProfile.name}!`);
          return;
        }
      }

      // Offline fallback
      addPost({
        title: 'অটোনোমাস কনটেন্ট অটোমেশন কৌশল',
        masterIdea: 'সোশ্যাল পালস দিয়ে কীভাবে সময় বাঁচিয়ে অডিয়েন্স দ্বিগুণ করবেন।',
        platforms: ['facebook', 'instagram', 'youtube'],
        postType: 'reel',
        status: 'scheduled',
        scheduledAt: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
        platformVariants: {
          facebook: { caption: 'অটোনোমাস কনটেন্ট অটোমেশন কৌশল\n\n#SocialPulse #MindcraftedRealities', postType: 'reel' },
          instagram: { caption: 'Autonomous creator automation blueprint ⚡️', postType: 'reel' },
          youtube: { title: 'Cross-Posting Automation #Shorts', caption: 'Full breakdown', postType: 'short' },
        },
      });

      setBatchNotice(`1 new post scheduled for ${activeProfile.name}!`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingBatch(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
              AI Autonomous Agent Center
            </h1>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              Autonomous Social Operations
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Configure automated scheduling, multilingual auto-reply thresholds, and Bangla-first priority rules.
          </p>
        </div>

        {/* Master Autopilot Toggle */}
        <button
          onClick={() => setIsAgentRunning(prev => !prev)}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition shadow-sm border ${
            isAgentRunning
              ? 'bg-emerald-600 text-white border-emerald-500'
              : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>{isAgentRunning ? 'AGENT ACTIVE (AUTOPILOT ON)' : 'AGENT STANDBY (PAUSED)'}</span>
        </button>
      </div>

      {batchNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{batchNotice}</span>
          </div>
          <button onClick={() => setBatchNotice(null)} className="text-xs font-bold underline">
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Auto-Posting Engine */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Auto-Post Automation Engine</h2>
              <p className="text-[11px] text-zinc-500">Autonomous content generation & scheduling</p>
            </div>
          </div>

          {/* Cadence */}
          <div>
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-2">
              Autonomous Posting Cadence:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'daily_3x', label: '3x Daily (Morning, Noon, Peak)', sub: 'Recommended' },
                { id: 'daily_once', label: '1x Daily (Evening Drop)', sub: 'Standard' },
                { id: 'hourly_boost', label: 'Hourly Boost', sub: 'High Velocity' },
              ].map(c => (
                <button
                  key={c.id}
                  onClick={() => updateAgentSettings({ postingCadence: c.id as any })}
                  className={`p-3 rounded-2xl text-left border transition text-xs ${
                    agentSettings.postingCadence === c.id
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 ring-1 ring-indigo-500'
                      : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <div className="font-bold">{c.label}</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">{c.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Niche Prompts */}
          <div>
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
              Active Profile Niche & Themes:
            </label>
            <input
              type="text"
              value={agentSettings.nicheFocus}
              onChange={e => updateAgentSettings({ nicheFocus: e.target.value })}
              className="w-full text-xs p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
            />
          </div>

          {/* Trigger immediate batch */}
          <div className="pt-2">
            <button
              onClick={handleTriggerAutonomousBatch}
              disabled={isGeneratingBatch}
              className="w-full py-3 px-4 rounded-2xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGeneratingBatch ? 'animate-spin' : ''}`} />
              <span>{isGeneratingBatch ? 'Generating Autonomous Concepts...' : 'Trigger Immediate Autonomous Batch'}</span>
            </button>
          </div>
        </div>

        {/* Section 2: Multilingual Auto-Reply Engine with Bangla First */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Multilingual Auto-Reply Engine</h2>
              <p className="text-[11px] text-zinc-500">Universal comment responder with Bangla priority</p>
            </div>
          </div>

          {/* Bangla Priority Toggle */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-950 dark:text-emerald-200">
                <span>🇧🇩 Bangla First Priority Queue</span>
                <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-emerald-500 text-white font-extrabold">
                  Active
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-400 mt-1 leading-relaxed">
                Automatically detects Bengali script and Banglish. Positions them at the front of the queue, responding with culturally authentic, respectful tone before addressing other languages.
              </p>
            </div>
            <input
              type="checkbox"
              checked={agentSettings.banglaPriorityEnabled}
              onChange={e => updateAgentSettings({ banglaPriorityEnabled: e.target.checked })}
              className="w-5 h-5 rounded-md accent-emerald-600 mt-1 cursor-pointer"
            />
          </div>

          {/* Mode Selector */}
          <div>
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-2">
              Auto-Reply Execution Mode:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => updateAgentSettings({ autoReplyMode: 'autopilot' })}
                className={`p-3 rounded-2xl text-left border transition text-xs ${
                  agentSettings.autoReplyMode === 'autopilot'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 ring-1 ring-emerald-500'
                    : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                <div className="font-bold">Autonomous Autopilot</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Replies sent automatically</div>
              </button>

              <button
                onClick={() => updateAgentSettings({ autoReplyMode: 'copilot' })}
                className={`p-3 rounded-2xl text-left border transition text-xs ${
                  agentSettings.autoReplyMode === 'copilot'
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 ring-1 ring-indigo-500'
                    : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                <div className="font-bold">Creator Co-Pilot</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Drafts ready for 1-click accept</div>
              </button>
            </div>
          </div>

          {/* Tone persona */}
          <div>
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
              Persona & Speech Tone:
            </label>
            <select
              value={agentSettings.replyPersonaTone}
              onChange={e => updateAgentSettings({ replyPersonaTone: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
            >
              <option value="Warm, Respectful & Creator-Centric">Warm, Respectful & Creator-Centric (আন্তরিক ও বিনয়ী)</option>
              <option value="Thought Leadership & Direct">Thought Leadership & Direct</option>
              <option value="High-Energy & Viral Fan Engagement">High-Energy & Viral Fan Engagement</option>
              <option value="Polite Bangla Formal">Polite Bangla Formal (শ্রদ্ধাশীল ও প্রফেশনাল)</option>
            </select>
          </div>

          {/* Simulated delay */}
          <div>
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
              Natural Human Response Delay:
            </label>
            <div className="flex items-center gap-3 text-xs text-zinc-500">
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={agentSettings.minResponseDelaySeconds}
                onChange={e => updateAgentSettings({ minResponseDelaySeconds: Number(e.target.value) })}
                className="w-full accent-indigo-600"
              />
              <span className="font-mono text-zinc-900 dark:text-white font-bold w-12 text-right">
                {agentSettings.minResponseDelaySeconds}s
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
