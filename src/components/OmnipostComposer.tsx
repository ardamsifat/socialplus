import React, { useState } from 'react';
import { useSocialPulse } from '../context/SocialPulseContext';
import { PlatformType, PostContentType, SocialPost } from '../types';
import {
  Sparkles,
  Send,
  Calendar,
  Layers,
  Image,
  Video,
  CheckCircle2,
  AlertCircle,
  Clock,
  Play,
  RotateCcw,
  Smartphone,
  Hash,
  Copy,
  ExternalLink,
} from 'lucide-react';

interface OmnipostComposerProps {
  onPostPublished?: () => void;
}

const PRESET_MEDIA = [
  {
    title: 'AI Hologram & Digital Tech (Vertical Reel/Short 9:16)',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    type: 'video' as const,
    aspect: '9:16',
  },
  {
    title: 'Modern Creator Studio (Feed / Landscape 16:9)',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    type: 'video' as const,
    aspect: '16:9',
  },
  {
    title: 'Minimalist Analytics Blueprint (Square 1:1)',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    type: 'image' as const,
    aspect: '1:1',
  },
];

export const OmnipostComposer: React.FC<OmnipostComposerProps> = ({ onPostPublished }) => {
  const { activeProfile, addPost, publishPostNow, isOnline } = useSocialPulse();

  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('Dynamic & Engaging');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState<Record<string, 'pending' | 'success'>>({});
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformType[]>([
    'facebook',
    'instagram',
    'linkedin',
    'youtube',
  ]);
  const [postFormat, setPostFormat] = useState<PostContentType>('reel');
  const [selectedMedia, setSelectedMedia] = useState(PRESET_MEDIA[0]);
  const [previewPlatform, setPreviewPlatform] = useState<PlatformType>('facebook');

  // Platform tailored variants
  const [platformVariants, setPlatformVariants] = useState<{
    facebook: { caption: string; format: string };
    instagram: { caption: string; format: string };
    linkedin: { caption: string; format: string };
    youtube: { title: string; description: string; format: string };
  }>({
    facebook: {
      caption: '🚀 SocialPulse (MINDCRAFTED REALITIES) দিয়ে এক ক্লিকেই ফেসবুক রিলস, ইনস্টাগ্রাম, লিংকডইন আর ইউটিউবে একসাথে কনটেন্ট পাবলিশ করুন!\n\nসবসময় সময়ের আগে থাকুন। আপনার মতামত কী? কমেন্টে জানান 👇\n\n#MindcraftedRealities #SocialPulse #AIWorkflow',
      format: '9:16 Reel',
    },
    instagram: {
      caption: 'One core message. Four synchronized networks. Zero friction. ⚡️📲\nSave this framework for your upcoming content sprint!\n.\n.\n#SocialPulse #MindcraftedRealities #ReelsViral #BanglaCreators #CreatorEconomy',
      format: '9:16 Vertical Reel',
    },
    linkedin: {
      caption: 'Consistency across platforms is no longer a luxury—it is table stakes.\n\nDeploying a unified distribution agent across Facebook, LinkedIn, Instagram, and YouTube yields a compound reach advantage.\n\nHow does your team handle omnichannel distribution today?\n\n#Leadership #ContentStrategy #AIAutomation #DigitalGrowth',
      format: 'Professional Post',
    },
    youtube: {
      title: 'Automate FB, Instagram, LinkedIn & YouTube at Once! #Shorts',
      description: 'The definitive blueprint for cross-platform content distribution by SocialPulse (MINDCRAFTED REALITIES). Subscribe for daily creator tools!',
      format: '60s YouTube Short',
    },
  });

  const togglePlatform = (p: PlatformType) => {
    setSelectedPlatforms(prev =>
      prev.includes(p) ? (prev.length > 1 ? prev.filter(x => x !== p) : prev) : [...prev, p]
    );
  };

  // AI Omnipost Tailoring via Backend Gemini API
  const handleGenerateWithAI = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    try {
      const res = await fetch('/api/ai/omnipost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          tone,
          profileName: activeProfile.name,
          platforms: selectedPlatforms,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        const p = data.data.platforms;
        setPlatformVariants({
          facebook: {
            caption: p.facebook?.caption || platformVariants.facebook.caption,
            format: p.facebook?.suggestedFormat || 'Post',
          },
          instagram: {
            caption: p.instagram?.caption || platformVariants.instagram.caption,
            format: p.instagram?.suggestedFormat || 'Reel',
          },
          linkedin: {
            caption: p.linkedin?.caption || platformVariants.linkedin.caption,
            format: p.linkedin?.suggestedFormat || 'Article',
          },
          youtube: {
            title: p.youtube?.title || platformVariants.youtube.title,
            description: p.youtube?.description || platformVariants.youtube.description,
            format: p.youtube?.suggestedFormat || 'Short',
          },
        });
      }
    } catch (err) {
      console.error('Failed to generate with AI:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Publish across all platforms simultaneously
  const handlePublishAllNow = async () => {
    setIsPublishing(true);

    const initialStatus: Record<string, 'pending' | 'success'> = {};
    selectedPlatforms.forEach(p => {
      initialStatus[p] = 'pending';
    });
    setPublishProgress(initialStatus);

    // Simulate multi-platform network broadcast
    for (const p of selectedPlatforms) {
      await new Promise(r => setTimeout(r, 450));
      setPublishProgress(prev => ({ ...prev, [p]: 'success' }));
    }

    const newPost = addPost({
      title: prompt.slice(0, 40) || 'Omnipost Broadcast',
      masterIdea: prompt || 'Synchronized distribution across all channels.',
      platforms: selectedPlatforms,
      postType: postFormat,
      mediaUrl: selectedMedia.url,
      mediaType: selectedMedia.type,
      status: 'published',
      scheduledAt: new Date().toISOString(),
      platformVariants: {
        facebook: { caption: platformVariants.facebook.caption, postType: 'reel' },
        instagram: { caption: platformVariants.instagram.caption, postType: 'reel' },
        linkedin: { caption: platformVariants.linkedin.caption, postType: 'post' },
        youtube: {
          title: platformVariants.youtube.title,
          caption: platformVariants.youtube.description,
          postType: 'short',
        },
      },
    });

    publishPostNow(newPost.id);

    setTimeout(() => {
      setIsPublishing(false);
      setPublishProgress({});
      if (onPostPublished) onPostPublished();
    }, 800);
  };

  // Schedule for later
  const handleSchedulePost = () => {
    const scheduledTime = new Date(Date.now() + 6 * 3600 * 1000).toISOString(); // 6 hours later

    addPost({
      title: prompt.slice(0, 40) || 'Scheduled Omnipost',
      masterIdea: prompt || 'Synchronized distribution across all channels.',
      platforms: selectedPlatforms,
      postType: postFormat,
      mediaUrl: selectedMedia.url,
      mediaType: selectedMedia.type,
      status: 'scheduled',
      scheduledAt: scheduledTime,
      platformVariants: {
        facebook: { caption: platformVariants.facebook.caption, postType: 'reel' },
        instagram: { caption: platformVariants.instagram.caption, postType: 'reel' },
        linkedin: { caption: platformVariants.linkedin.caption, postType: 'post' },
        youtube: {
          title: platformVariants.youtube.title,
          caption: platformVariants.youtube.description,
          postType: 'short',
        },
      },
    });

    if (onPostPublished) onPostPublished();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Studio Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
              Omnipost Studio
            </h1>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
              Synchronous 4-Way Broadcast
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Craft once. Tailor automatically. Publish simultaneously to Facebook, Instagram, LinkedIn & YouTube.
          </p>
        </div>

        {/* Selected target indicator */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(['facebook', 'instagram', 'linkedin', 'youtube'] as PlatformType[]).map(p => {
            const isSelected = selectedPlatforms.includes(p);
            return (
              <button
                key={p}
                onClick={() => togglePlatform(p)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold border transition ${
                  isSelected
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 border-zinc-900 dark:border-white shadow-xs'
                    : 'bg-zinc-100 dark:bg-zinc-850 text-zinc-400 border-zinc-200 dark:border-zinc-700/60 opacity-60'
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input, AI Generator, Format Settings (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Main Idea Input Card */}
          <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Master Concept / Core Idea</span>
              </label>

              {/* Tone dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-zinc-400">Tone:</span>
                <select
                  value={tone}
                  onChange={e => setTone(e.target.value)}
                  className="text-xs font-medium rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2 py-1 text-zinc-800 dark:text-zinc-200 focus:outline-hidden"
                >
                  <option value="Dynamic & Engaging">Dynamic & Engaging</option>
                  <option value="Thought Leadership & Professional">Thought Leadership & Professional</option>
                  <option value="Bangla Friendly & Culturally Warm">Bangla Friendly (বাংলা ও আন্তরিক)</option>
                  <option value="High-Viral Creator Hook">High-Viral Creator Hook</option>
                </select>
              </div>
            </div>

            <textarea
              rows={4}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="e.g. Announcing our new Bangla-First AI social agent that lets creators automate posts on Facebook, Instagram Reels, LinkedIn and YouTube Shorts simultaneously..."
              className="w-full text-xs sm:text-sm p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-hidden transition resize-none"
            />

            {/* Quick Prompt Starters */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <span className="text-[10px] text-zinc-400 whitespace-nowrap">Try:</span>
              {[
                'Cross-platform automation workflow tips',
                'কেন মাল্টি-প্ল্যাটফর্ম অটোপোস্টিং এখন অপরিহার্য (বাংলা)',
                'Behind the scenes of building with Gemini 3.8',
              ].map(tag => (
                <button
                  key={tag}
                  onClick={() => setPrompt(tag)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 hover:text-indigo-500 whitespace-nowrap transition border border-zinc-200 dark:border-zinc-700/60"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleGenerateWithAI}
                disabled={isGenerating || !prompt.trim()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/40 transition disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? 'Adapting with Gemini 3.8...' : 'AI Auto-Adapt for All 4 Networks'}</span>
              </button>

              <button
                onClick={() => {
                  setPrompt('');
                }}
                className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Format & Media Attachment */}
          <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
                Distribution Format & Aspect Ratio
              </span>
              <span className="text-[10px] text-indigo-500 font-semibold">
                Auto-optimized for Reels & Shorts
              </span>
            </div>

            {/* Format selection */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'reel', label: 'Reel + Short (9:16 Vertical)', icon: Play, sub: 'FB, IG & YT Shorts' },
                { id: 'post', label: 'Standard Post / Image', icon: Image, sub: 'All 4 Networks' },
                { id: 'carousel', label: 'Carousel Slide Deck', icon: Layers, sub: 'LinkedIn & IG' },
              ].map(f => {
                const Icon = f.icon;
                const isSelected = postFormat === f.id;

                return (
                  <button
                    key={f.id}
                    onClick={() => setPostFormat(f.id as PostContentType)}
                    className={`p-3 rounded-2xl text-left border transition ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 ring-1 ring-indigo-500'
                        : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-2 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400'}`} />
                    <div className="text-xs font-bold leading-tight">{f.label}</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">{f.sub}</div>
                  </button>
                );
              })}
            </div>

            {/* Media Presets */}
            <div className="pt-2">
              <div className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-2">
                Attached Media Asset (Select or Upload):
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {PRESET_MEDIA.map((m, idx) => {
                  const isSelected = selectedMedia.url === m.url;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedMedia(m)}
                      className={`group relative rounded-xl overflow-hidden cursor-pointer border-2 transition ${
                        isSelected ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={m.url} alt={m.title} className="w-full h-20 object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-1.5 flex flex-col justify-end">
                        <span className="text-[9px] font-bold text-white uppercase tracking-wider">
                          {m.aspect}
                        </span>
                        <span className="text-[9px] text-zinc-200 line-clamp-1">
                          {m.title}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Edit Tailored Captions per Platform */}
          <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
                Tailored Platform Captions
              </span>
              <span className="text-[11px] text-zinc-400">Click tab to fine-tune</span>
            </div>

            {/* Platform tab selector for caption editor */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
              {(['facebook', 'instagram', 'linkedin', 'youtube'] as PlatformType[]).map(p => (
                <button
                  key={p}
                  onClick={() => setPreviewPlatform(p)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                    previewPlatform === p
                      ? 'bg-white dark:bg-zinc-850 text-zinc-900 dark:text-white shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Caption Input for selected platform */}
            {previewPlatform === 'youtube' ? (
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">YouTube Title:</label>
                  <input
                    type="text"
                    value={platformVariants.youtube.title}
                    onChange={e =>
                      setPlatformVariants(prev => ({
                        ...prev,
                        youtube: { ...prev.youtube, title: e.target.value },
                      }))
                    }
                    className="w-full text-xs p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">YouTube Description & Tags:</label>
                  <textarea
                    rows={4}
                    value={platformVariants.youtube.description}
                    onChange={e =>
                      setPlatformVariants(prev => ({
                        ...prev,
                        youtube: { ...prev.youtube, description: e.target.value },
                      }))
                    }
                    className="w-full text-xs p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white resize-none"
                  />
                </div>
              </div>
            ) : (
              <div>
                <textarea
                  rows={5}
                  value={
                    previewPlatform === 'facebook'
                      ? platformVariants.facebook.caption
                      : previewPlatform === 'instagram'
                      ? platformVariants.instagram.caption
                      : platformVariants.linkedin.caption
                  }
                  onChange={e => {
                    const val = e.target.value;
                    setPlatformVariants(prev => ({
                      ...prev,
                      [previewPlatform]: {
                        ...prev[previewPlatform as keyof typeof prev],
                        caption: val,
                      },
                    }));
                  }}
                  className="w-full text-xs sm:text-sm p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white resize-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Mockup Preview & Broadcast Dispatcher (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Live Mobile Device Frame Mockup */}
          <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
                  Live Platform Preview ({previewPlatform})
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono">Real-Time UI</span>
            </div>

            {/* Platform Mockup Container */}
            <div className="relative rounded-2xl overflow-hidden bg-zinc-950 text-white border border-zinc-800 shadow-inner">
              {/* Top Bar of Simulated Phone / App */}
              <div className="px-4 py-2 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="font-bold uppercase tracking-wider text-zinc-300">
                    {previewPlatform}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono">
                  {postFormat === 'reel' ? '9:16 Reel' : postFormat === 'short' ? 'Shorts Player' : 'Feed Post'}
                </span>
              </div>

              {/* Media Preview */}
              <div className="relative aspect-9/12 bg-zinc-900 overflow-hidden flex items-center justify-center">
                <img
                  src={selectedMedia.url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                {selectedMedia.type === 'video' && (
                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40">
                      <Play className="w-5 h-5 text-white ml-0.5" />
                    </div>
                  </div>
                )}

                {/* Overlaid UI for Reels / Shorts */}
                {(previewPlatform === 'instagram' || previewPlatform === 'youtube' || postFormat === 'reel') && (
                  <div className="absolute right-3 bottom-14 flex flex-col items-center gap-4 text-white">
                    <div className="flex flex-col items-center">
                      <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                        ❤️
                      </div>
                      <span className="text-[10px] font-bold mt-1">24.5k</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                        💬
                      </div>
                      <span className="text-[10px] font-bold mt-1">842</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                        ↗️
                      </div>
                      <span className="text-[10px] font-bold mt-1">Share</span>
                    </div>
                  </div>
                )}

                {/* Bottom Caption Overlay */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 text-left">
                  <div className="flex items-center gap-2 mb-1.5">
                    <img
                      src={activeProfile.avatar}
                      alt={activeProfile.name}
                      className="w-6 h-6 rounded-full object-cover ring-1 ring-white"
                    />
                    <span className="text-xs font-bold text-white">{activeProfile.handle}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500 text-white font-semibold">
                      Follow
                    </span>
                  </div>

                  <p className="text-xs text-zinc-200 line-clamp-3 leading-relaxed">
                    {previewPlatform === 'youtube'
                      ? `${platformVariants.youtube.title} — ${platformVariants.youtube.description}`
                      : previewPlatform === 'facebook'
                      ? platformVariants.facebook.caption
                      : previewPlatform === 'instagram'
                      ? platformVariants.instagram.caption
                      : platformVariants.linkedin.caption}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dispatch Controls */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-md space-y-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Simultaneous Distribution Engine
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Will dispatch to {selectedPlatforms.length} networks with tailored formats
              </p>
            </div>

            {/* Live Progress Bar when publishing */}
            {isPublishing && (
              <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 space-y-2">
                <div className="text-xs font-semibold text-indigo-900 dark:text-indigo-200 flex items-center justify-between">
                  <span>Broadcasting across networks...</span>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
                </div>
                <div className="space-y-1">
                  {selectedPlatforms.map(p => (
                    <div key={p} className="flex items-center justify-between text-[11px] text-zinc-600 dark:text-zinc-300">
                      <span className="capitalize">{p}</span>
                      {publishProgress[p] === 'success' ? (
                        <span className="text-emerald-500 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Live
                        </span>
                      ) : (
                        <span className="text-indigo-400 animate-pulse">Syncing...</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2.5 pt-1">
              <button
                onClick={handlePublishAllNow}
                disabled={isPublishing}
                className="w-full py-3.5 px-4 rounded-2xl text-xs font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>Publish to All {selectedPlatforms.length} Platforms at Once</span>
              </button>

              <button
                onClick={handleSchedulePost}
                disabled={isPublishing}
                className="w-full py-3 px-4 rounded-2xl text-xs font-semibold border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 transition flex items-center justify-center gap-2"
              >
                <Clock className="w-4 h-4 text-indigo-500" />
                <span>Schedule at Optimal Engagement Hour (Today 7:30 PM)</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Offline resilient: changes cached locally if disconnected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
