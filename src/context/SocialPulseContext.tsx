import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Profile, SocialPost, InboxItem, AgentSettings, OfflineAction, PlatformType } from '../types';
import { INITIAL_PROFILES, INITIAL_POSTS, INITIAL_INBOX, INITIAL_SETTINGS } from '../data/mockData';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface SocialPulseContextType {
  profiles: Profile[];
  activeProfile: Profile;
  setActiveProfileId: (id: string) => void;
  addNewProfile: (profile: Omit<Profile, 'id'>) => void;
  posts: SocialPost[];
  addPost: (post: Omit<SocialPost, 'id' | 'profileId'>) => SocialPost;
  publishPostNow: (id: string) => void;
  deletePost: (id: string) => void;
  inbox: InboxItem[];
  sendReply: (inboxId: string, replyText: string) => void;
  runAutoReplyOnAll: () => Promise<number>;
  agentSettings: AgentSettings;
  updateAgentSettings: (settings: Partial<AgentSettings>) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  toggleDarkMode: () => void;
  isOnline: boolean;
  offlineQueue: OfflineAction[];
  enqueueOfflineAction: (type: OfflineAction['type'], payload: any) => void;
  analytics: {
    totalFollowers: number;
    totalReach: number;
    totalImpressions: number;
    totalEngagementRate: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
    totalViews: number;
    reelsEngagement: number;
    shortsEngagement: number;
    staticPostsEngagement: number;
    platformBreakdown: {
      facebook: { reach: number; followers: number; rate: number };
      instagram: { reach: number; followers: number; rate: number };
      linkedin: { reach: number; followers: number; rate: number };
      youtube: { reach: number; followers: number; rate: number };
    };
  };
  livePulseActivity: Array<{ id: string; text: string; time: string; platform: PlatformType; type: string }>;
  isAgentRunning: boolean;
  setIsAgentRunning: React.Dispatch<React.SetStateAction<boolean>>;
}

const SocialPulseContext = createContext<SocialPulseContextType | undefined>(undefined);

export const SocialPulseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Profiles
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    try {
      const saved = localStorage.getItem('socialpulse_profiles');
      return saved ? JSON.parse(saved) : INITIAL_PROFILES;
    } catch {
      return INITIAL_PROFILES;
    }
  });

  const [activeProfileId, setActiveProfileId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('socialpulse_active_profile');
      return saved || INITIAL_PROFILES[0].id;
    } catch {
      return INITIAL_PROFILES[0].id;
    }
  });

  // Posts
  const [posts, setPosts] = useState<SocialPost[]>(() => {
    try {
      const saved = localStorage.getItem('socialpulse_posts');
      return saved ? JSON.parse(saved) : INITIAL_POSTS;
    } catch {
      return INITIAL_POSTS;
    }
  });

  // Inbox
  const [inbox, setInbox] = useState<InboxItem[]>(() => {
    try {
      const saved = localStorage.getItem('socialpulse_inbox');
      return saved ? JSON.parse(saved) : INITIAL_INBOX;
    } catch {
      return INITIAL_INBOX;
    }
  });

  // Agent Settings
  const [agentSettings, setAgentSettings] = useState<AgentSettings>(() => {
    try {
      const saved = localStorage.getItem('socialpulse_settings');
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // Dark mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('socialpulse_theme');
      return saved !== null ? saved === 'dark' : true; // Default clean dark mode
    } catch {
      return true;
    }
  });

  const [isAgentRunning, setIsAgentRunning] = useState<boolean>(true);

  // Sync offline actions
  const handleOfflineSync = (actions: OfflineAction[]) => {
    console.log('Syncing offline actions back online:', actions.length);
    // Actions are automatically re-applied to client state
  };

  const { isOnline, offlineQueue, enqueueAction } = useOnlineStatus(handleOfflineSync);

  // Save to localStorage on state changes
  useEffect(() => {
    try {
      localStorage.setItem('socialpulse_profiles', JSON.stringify(profiles));
    } catch (e) {
      console.error(e);
    }
  }, [profiles]);

  useEffect(() => {
    try {
      localStorage.setItem('socialpulse_active_profile', activeProfileId);
    } catch (e) {
      console.error(e);
    }
  }, [activeProfileId]);

  useEffect(() => {
    try {
      localStorage.setItem('socialpulse_posts', JSON.stringify(posts));
    } catch (e) {
      console.error(e);
    }
  }, [posts]);

  useEffect(() => {
    try {
      localStorage.setItem('socialpulse_inbox', JSON.stringify(inbox));
    } catch (e) {
      console.error(e);
    }
  }, [inbox]);

  useEffect(() => {
    try {
      localStorage.setItem('socialpulse_settings', JSON.stringify(agentSettings));
    } catch (e) {
      console.error(e);
    }
  }, [agentSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('socialpulse_theme', darkMode ? 'dark' : 'light');
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error(e);
    }
  }, [darkMode]);

  const activeProfile = useMemo(() => {
    return profiles.find(p => p.id === activeProfileId) || profiles[0];
  }, [profiles, activeProfileId]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const addNewProfile = (newP: Omit<Profile, 'id'>) => {
    const id = 'prof-' + Date.now();
    const createdProfile: Profile = { ...newP, id };
    setProfiles(prev => [...prev, createdProfile]);
    setActiveProfileId(id);
  };

  const addPost = (postData: Omit<SocialPost, 'id' | 'profileId'>) => {
    const newPost: SocialPost = {
      ...postData,
      id: 'post-' + Date.now(),
      profileId: activeProfile.id,
      metrics: {
        reach: 0,
        impressions: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        views: 0,
      },
    };

    if (!isOnline) {
      enqueueAction('create_post', newPost);
    }

    setPosts(prev => [newPost, ...prev]);
    return newPost;
  };

  const publishPostNow = (postId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            status: 'published',
            publishedAt: new Date().toISOString(),
            metrics: {
              reach: Math.floor(Math.random() * 5000) + 1200,
              impressions: Math.floor(Math.random() * 8000) + 2400,
              likes: Math.floor(Math.random() * 800) + 150,
              comments: Math.floor(Math.random() * 80) + 14,
              shares: Math.floor(Math.random() * 60) + 8,
              views: Math.floor(Math.random() * 6000) + 1500,
            },
          };
        }
        return p;
      })
    );
  };

  const deletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  const sendReply = (inboxId: string, replyText: string) => {
    if (!isOnline) {
      enqueueAction('reply_comment', { inboxId, replyText });
    }

    setInbox(prev =>
      prev.map(item => {
        if (item.id === inboxId) {
          return {
            ...item,
            replied: true,
            replyText,
            replyTimestamp: 'Just now',
            autoReplied: false,
          };
        }
        return item;
      })
    );
  };

  // Run autonomous AI auto-reply on all unreplied comments with Bangla Priority
  const runAutoReplyOnAll = async (): Promise<number> => {
    const unreplied = inbox.filter(item => item.profileId === activeProfile.id && !item.replied);
    if (unreplied.length === 0) return 0;

    // Sort with Bangla first
    const prioritized = [...unreplied].sort((a, b) => {
      if (agentSettings.banglaPriorityEnabled) {
        if (a.isBangla && !b.isBangla) return -1;
        if (!a.isBangla && b.isBangla) return 1;
      }
      return b.priorityScore - a.priorityScore;
    });

    let repliedCount = 0;

    for (const item of prioritized) {
      try {
        let replyText = '';
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
          const json = await res.json();
          if (json.data && json.data.replyText) {
            replyText = json.data.replyText;
          }
        }

        if (!replyText) {
          // Fallback if offline
          replyText = item.isBangla
            ? `অনেক ধন্যবাদ ${item.authorName}! আপনার মতামতের জন্য আমরা কৃতজ্ঞ। সাথে থাকুন! ✨`
            : `Thank you so much ${item.authorName}! Appreciate your engagement and support! 🚀`;
        }

        setInbox(prev =>
          prev.map(i =>
            i.id === item.id
              ? {
                  ...i,
                  replied: true,
                  replyText,
                  replyTimestamp: 'Just now',
                  autoReplied: true,
                }
              : i
          )
        );
        repliedCount++;
      } catch (err) {
        console.error('Auto reply failed for item:', item.id, err);
      }
    }

    return repliedCount;
  };

  const updateAgentSettings = (partial: Partial<AgentSettings>) => {
    setAgentSettings(prev => ({ ...prev, ...partial }));
  };

  // Compute live analytics for active profile
  const analytics = useMemo(() => {
    const profilePosts = posts.filter(p => p.profileId === activeProfile.id);
    const published = profilePosts.filter(p => p.status === 'published');

    let totalReach = 0;
    let totalImpressions = 0;
    let totalLikes = 0;
    let totalComments = 0;
    let totalShares = 0;
    let totalViews = 0;

    published.forEach(p => {
      if (p.metrics) {
        totalReach += p.metrics.reach;
        totalImpressions += p.metrics.impressions;
        totalLikes += p.metrics.likes;
        totalComments += p.metrics.comments;
        totalShares += p.metrics.shares;
        totalViews += p.metrics.views;
      }
    });

    // Baseline stats from account followers
    const acc = activeProfile.accounts;
    const totalFollowers =
      (acc.facebook?.followers || 0) +
      (acc.instagram?.followers || 0) +
      (acc.linkedin?.followers || 0) +
      (acc.youtube?.followers || 0);

    const interactions = totalLikes + totalComments + totalShares;
    const totalEngagementRate = totalImpressions > 0 ? Number(((interactions / totalImpressions) * 100).toFixed(2)) : 5.84;

    const reels = published.filter(p => p.postType === 'reel');
    const shorts = published.filter(p => p.postType === 'short');
    const staticPosts = published.filter(p => p.postType === 'post');

    const reelsEng = reels.reduce((acc, p) => acc + (p.metrics?.likes || 0) + (p.metrics?.comments || 0), 0);
    const shortsEng = shorts.reduce((acc, p) => acc + (p.metrics?.likes || 0) + (p.metrics?.views || 0), 0);
    const staticEng = staticPosts.reduce((acc, p) => acc + (p.metrics?.likes || 0) + (p.metrics?.shares || 0), 0);

    return {
      totalFollowers,
      totalReach: totalReach || 432500,
      totalImpressions: totalImpressions || 698200,
      totalEngagementRate,
      totalLikes: totalLikes || 24900,
      totalComments: totalComments || 1840,
      totalShares: totalShares || 4310,
      totalViews: totalViews || 325400,
      reelsEngagement: reelsEng || 8420,
      shortsEngagement: shortsEng || 14200,
      staticPostsEngagement: staticEng || 5120,
      platformBreakdown: {
        facebook: { reach: Math.floor(totalReach * 0.32) || 138400, followers: acc.facebook.followers, rate: 4.8 },
        instagram: { reach: Math.floor(totalReach * 0.38) || 164300, followers: acc.instagram.followers, rate: 6.2 },
        linkedin: { reach: Math.floor(totalReach * 0.12) || 51900, followers: acc.linkedin.followers, rate: 3.9 },
        youtube: { reach: Math.floor(totalReach * 0.18) || 77900, followers: acc.youtube.followers, rate: 7.4 },
      },
    };
  }, [posts, activeProfile]);

  // Live Pulse stream simulation
  const livePulseActivity = useMemo(() => {
    return [
      { id: 'act-1', text: 'New like on YouTube Short from Dhaka, BD', time: '14s ago', platform: 'youtube' as PlatformType, type: 'like' },
      { id: 'act-2', text: 'Bangla comment auto-replied with priority on FB Reel', time: '1m ago', platform: 'facebook' as PlatformType, type: 'reply' },
      { id: 'act-3', text: 'LinkedIn post gained +28 reshares in AI Creators circle', time: '3m ago', platform: 'linkedin' as PlatformType, type: 'share' },
      { id: 'act-4', text: 'Instagram Reel crossed 40,000 views threshold', time: '6m ago', platform: 'instagram' as PlatformType, type: 'milestone' },
      { id: 'act-5', text: 'Omnipost synchronized across 4 networks simultaneously', time: '12m ago', platform: 'facebook' as PlatformType, type: 'sync' },
    ];
  }, []);

  return (
    <SocialPulseContext.Provider
      value={{
        profiles,
        activeProfile,
        setActiveProfileId,
        addNewProfile,
        posts,
        addPost,
        publishPostNow,
        deletePost,
        inbox,
        sendReply,
        runAutoReplyOnAll,
        agentSettings,
        updateAgentSettings,
        darkMode,
        setDarkMode,
        toggleDarkMode,
        isOnline,
        offlineQueue,
        enqueueOfflineAction: enqueueAction,
        analytics,
        livePulseActivity,
        isAgentRunning,
        setIsAgentRunning,
      }}
    >
      {children}
    </SocialPulseContext.Provider>
  );
};

export const useSocialPulse = () => {
  const context = useContext(SocialPulseContext);
  if (!context) {
    throw new Error('useSocialPulse must be used within a SocialPulseProvider');
  }
  return context;
};
