export type PlatformType = 'facebook' | 'instagram' | 'linkedin' | 'youtube';
export type PostContentType = 'post' | 'reel' | 'short' | 'carousel';
export type PostStatus = 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed';

export interface SocialAccount {
  connected: boolean;
  handle: string;
  followers: number;
  avatar?: string;
  pageId?: string;
}

export interface Profile {
  id: string;
  name: string;
  handle: string;
  category: string;
  avatar: string;
  accentColor: string;
  accounts: {
    facebook: SocialAccount;
    instagram: SocialAccount;
    linkedin: SocialAccount;
    youtube: SocialAccount;
  };
}

export interface PlatformVariant {
  caption: string;
  postType: PostContentType;
  suggestedFormat?: string;
  bestTimeToPost?: string;
  characterCount?: number;
  tags?: string[];
  title?: string; // YouTube
}

export interface SocialPost {
  id: string;
  profileId: string;
  title: string;
  masterIdea: string;
  platforms: PlatformType[];
  postType: PostContentType;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  status: PostStatus;
  scheduledAt: string;
  publishedAt?: string;
  platformVariants: {
    facebook?: PlatformVariant;
    instagram?: PlatformVariant;
    linkedin?: PlatformVariant;
    youtube?: PlatformVariant;
  };
  metrics?: {
    reach: number;
    impressions: number;
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
}

export interface InboxItem {
  id: string;
  profileId: string;
  platform: PlatformType;
  type: 'comment' | 'message';
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  detectedLanguage: string;
  isBangla: boolean;
  priorityScore: number;
  sentiment: 'positive' | 'question' | 'inquiry' | 'feedback' | 'critical';
  parentPostTitle?: string;
  replied: boolean;
  replyText?: string;
  replyTimestamp?: string;
  autoReplied?: boolean;
}

export interface AgentSettings {
  autoPostEnabled: boolean;
  postingCadence: 'daily_3x' | 'daily_once' | 'hourly_boost' | 'custom';
  autoReplyEnabled: boolean;
  autoReplyMode: 'autopilot' | 'copilot';
  banglaPriorityEnabled: boolean;
  replyPersonaTone: string;
  nicheFocus: string;
  targetPlatforms: PlatformType[];
  autoHashtags: boolean;
  minResponseDelaySeconds: number;
}

export interface OfflineAction {
  id: string;
  type: 'create_post' | 'schedule_post' | 'reply_comment' | 'update_settings';
  payload: any;
  timestamp: string;
  status: 'pending' | 'synced';
}
