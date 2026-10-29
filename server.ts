import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Fallback helper for intelligent local responses when API key is missing or offline
function generateLocalOmnipost(prompt: string, tone: string, profileName: string) {
  const cleanPrompt = prompt.trim() || 'Exciting updates from Mindcrafted Realities';
  return {
    masterConcept: cleanPrompt,
    tone: tone || 'Dynamic & Engaging',
    platforms: {
      facebook: {
        caption: `🚀 ${cleanPrompt}\n\nWe are redefining how creators and innovators operate in the digital era. What's your take on this? Let us know in the comments below! 👇\n\n#ContentCreation #SocialPulse #MindcraftedRealities #DigitalStrategy`,
        postType: 'post',
        suggestedFormat: 'Carousel / 4:5 Image or Short Clip',
        bestTimeToPost: 'Today at 7:30 PM (Peak BD/Asia/Global Reach)',
        characterCount: 280,
      },
      instagram: {
        caption: `Future-first thinking. 💡✨\n\n${cleanPrompt}\n\nSave this for your next project session and share with someone who needs this perspective! 📲\n.\n.\n#MindcraftedRealities #CreatorEconomy #SocialPulse #Innovation #DigitalCreators #BanglaCreators #ReelsViral #CreativeTech #FutureOfSocial`,
        postType: 'reel',
        suggestedFormat: '9:16 Vertical Reel (under 45s with punchy audio)',
        bestTimeToPost: 'Today at 8:15 PM',
        characterCount: 340,
      },
      linkedin: {
        caption: `The landscape of content distribution is evolving rapidly.\n\n${cleanPrompt}\n\nKey takeaways:\n• Scalable consistency beats sporadic perfection.\n• Multichannel presence (Facebook, Instagram, LinkedIn, YouTube) unlocks exponential reach.\n• Humanized replies in native dialects foster genuine trust.\n\nHow is your organization approaching cross-platform automation this quarter? Join the discussion.\n\n#Leadership #ContentStrategy #AIAutomation #DigitalTransformation #GrowthHacking`,
        postType: 'post',
        suggestedFormat: 'Document Slide Deck / High-res Graphic',
        bestTimeToPost: 'Tomorrow at 9:00 AM (Professional Peak)',
        characterCount: 460,
      },
      youtube: {
        title: `${cleanPrompt.slice(0, 50)} | Full Breakdown #Shorts`,
        description: `Everything you need to know about ${cleanPrompt}. Subscribe to SocialPulse (MINDCRAFTED REALITIES) for daily blueprints on digital automation, creative engineering, and creator growth!\n\n🔔 Turn on notifications so you never miss a drop.\n\n#Shorts #Tech #Creativity #SocialPulse`,
        postType: 'short',
        suggestedFormat: '60s YouTube Short (1080x1920 60fps)',
        bestTimeToPost: 'Today at 6:00 PM',
        tags: ['Shorts', 'AI Automation', 'Creator Economy', 'Bangla Tech', 'SocialPulse'],
      },
    },
    hashtags: ['#SocialPulse', '#MindcraftedRealities', '#AI', '#CreatorEconomy', '#ViralStrategy'],
    creativeDirection: 'Use high-contrast dark aesthetic with neon accents (emerald and violet). Opening 3 seconds must show immediate motion.',
  };
}

function generateLocalReply(commentText: string, author: string, platform: string) {
  const isBanglaScript = /[\u0980-\u09FF]/.test(commentText);
  const lower = commentText.toLowerCase();
  const isBanglish = /\b(bhai|bhaia|apu|valo|bhalo|kemon|dam|koto|ki|kivabe|khub|dhonnobad|thik)\b/i.test(lower);

  if (isBanglaScript || isBanglish) {
    return {
      detectedLanguage: isBanglaScript ? 'Bangla (বাংলা)' : 'Bangla (বাংলিশ / Banglish)',
      isBangla: true,
      priorityScore: 98, // VIP Bangla Priority
      sentiment: lower.includes('dam') || lower.includes('koto') || lower.includes('দাম') ? 'price_inquiry' : 'positive_feedback',
      replyText: isBanglaScript
        ? `অনেক ধন্যবাদ ${author} ভাইয়া/আপু! আপনার মূল্যবান মন্তব্যের জন্য কৃতজ্ঞ। আমরা সব সময় সেরা অভিজ্ঞতা দিতে প্রতিশ্রুতিবদ্ধ। যেকোনো প্রয়োজনে ইনবক্সে নক দিন! ✨`
        : `Onek dhonnobad ${author}! Apnar valo lagay amra anondito. Aro kono proshno thakle shorashori inbox korun, amra achi! 🚀`,
      alternativeReplies: [
        'ধন্যবাদ সাথে থাকার জন্য! পরবর্তী পর্বগুলো দেখতে চোখ রাখুন আমাদের পেইজে।',
        'জি ভাইয়া, বিস্তারিত জানতে ইনবক্সে মেসেজ দিন, এখনই জানিয়ে দিচ্ছি!',
      ],
    };
  }

  return {
    detectedLanguage: 'English',
    isBangla: false,
    priorityScore: 78,
    sentiment: lower.includes('?') ? 'question' : 'supportive',
    replyText: `Thank you so much for tuning in, ${author}! Really appreciate your perspective. Stay tuned for our next automated drop! 🚀🔥`,
    alternativeReplies: [
      `Spot on, @${author}! What specific aspect resonated with you most?`,
      `Thanks for the feedback! Drop us a DM anytime if you want to dive deeper into this workflow.`,
    ],
  };
}

// API Endpoints

// 1. Omnipost Generation
app.post('/api/ai/omnipost', async (req, res) => {
  try {
    const { prompt, tone = 'Dynamic & High Energy', profileName = 'Mindcrafted Realities', platforms = ['facebook', 'instagram', 'linkedin', 'youtube'] } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!ai) {
      const fallback = generateLocalOmnipost(prompt, tone, profileName);
      return res.json({ success: true, data: fallback, mode: 'fallback' });
    }

    const systemPrompt = `You are the Lead Social Media Growth Strategist and AI Agent for "SocialPulse (MINDCRAFTED REALITIES)".
Your task is to adapt one central prompt/idea into tailored, high-converting posts for:
1. Facebook (Post or Reel caption with community hooks, storytelling, discussion prompts)
2. Instagram (Hook-first caption for Reel/Post, clean formatting, hashtag group, CTA)
3. LinkedIn (Thought-leadership tone, industry perspective, bullet points, engaging question)
4. YouTube (Click-worthy Title, Shorts/Video SEO description, tags, 60s Shorts concept)

Profile Name: ${profileName}
Desired Tone: ${tone}

Return STRICT JSON ONLY matching this structure:
{
  "masterConcept": string,
  "tone": string,
  "platforms": {
    "facebook": {
      "caption": string,
      "postType": "post" or "reel",
      "suggestedFormat": string,
      "bestTimeToPost": string,
      "characterCount": number
    },
    "instagram": {
      "caption": string,
      "postType": "reel" or "post",
      "suggestedFormat": string,
      "bestTimeToPost": string,
      "characterCount": number
    },
    "linkedin": {
      "caption": string,
      "postType": "post",
      "suggestedFormat": string,
      "bestTimeToPost": string,
      "characterCount": number
    },
    "youtube": {
      "title": string,
      "description": string,
      "postType": "short" or "video",
      "suggestedFormat": string,
      "bestTimeToPost": string,
      "tags": [string]
    }
  },
  "hashtags": [string],
  "creativeDirection": string
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Create cross-platform social media posts for:\n"${prompt}"`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '';
    const parsed = JSON.parse(text);
    return res.json({ success: true, data: parsed, mode: 'gemini' });
  } catch (error: any) {
    console.error('Error in omnipost generation:', error);
    const fallback = generateLocalOmnipost(req.body.prompt || '', req.body.tone || '', req.body.profileName || '');
    return res.json({ success: true, data: fallback, mode: 'fallback_on_error', error: error?.message });
  }
});

// 2. Multilingual Auto-Reply Engine with Bangla Priority
app.post('/api/ai/reply', async (req, res) => {
  try {
    const { commentText, author = 'Creator', platform = 'facebook', postContext = '', personaTone = 'Warm & Professional' } = req.body;

    if (!commentText) {
      return res.status(400).json({ error: 'commentText is required' });
    }

    if (!ai) {
      const fallback = generateLocalReply(commentText, author, platform);
      return res.json({ success: true, data: fallback, mode: 'fallback' });
    }

    const systemPrompt = `You are the AI Auto-Reply Agent for "SocialPulse (MINDCRAFTED REALITIES)".
Your rule is:
1. Reply to every single message and comment regardless of topic or keywords.
2. Multilingual fluency: support any language on Earth.
3. CRITICAL PRIORITY: Detect BANGLA (বাংলা) and BANGLISH (Bangla in Roman script). Bangla comments get TOP PRIORITY (priorityScore: 90-100).
   When the comment is in Bangla/Banglish, craft a highly respectful, culturally attuned, authentic Bangla response (using natural words like "ধন্যবাদ", "প্রিয়", "ইনবক্সে", etc.).
4. Next priority: ENGLISH (priorityScore: 70-85).
5. Other languages: Translate and reply accurately in their native language (priorityScore: 60-75).
6. Never sound like a robotic keyword bot. Reply directly to the nuance, sentiment, humor, or question asked by ${author}.

Return STRICT JSON ONLY:
{
  "detectedLanguage": string,
  "isBangla": boolean,
  "priorityScore": number (1 to 100, >90 if Bangla/Banglish),
  "sentiment": "positive" | "question" | "inquiry" | "feedback" | "critical",
  "replyText": string,
  "alternativeReplies": [string, string]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Incoming comment on ${platform} by ${author}:
"${commentText}"
Context of post: ${postContext || 'Recent content release on SocialPulse'}
Tone: ${personaTone}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '';
    const parsed = JSON.parse(text);
    return res.json({ success: true, data: parsed, mode: 'gemini' });
  } catch (error: any) {
    console.error('Error in reply generation:', error);
    const fallback = generateLocalReply(req.body.commentText || '', req.body.author || '', req.body.platform || '');
    return res.json({ success: true, data: fallback, mode: 'fallback_on_error', error: error?.message });
  }
});

// 3. Autonomous Content Agent Generation (Batch Ideation)
app.post('/api/ai/batch-generate', async (req, res) => {
  try {
    const { niche = 'AI, Tech, Creative Media & Social Growth', count = 3, profile = 'Mindcrafted Realities' } = req.body;

    if (!ai) {
      return res.json({
        success: true,
        data: [
          {
            id: 'auto-1',
            title: '5 AI Automations Every Creator Needs in 2026',
            concept: 'How smart agents eliminate 80% of repetitive social publishing tasks while boosting retention.',
            platforms: ['facebook', 'instagram', 'linkedin', 'youtube'],
            scheduledFor: 'Tomorrow at 10:00 AM',
            status: 'queued',
            format: 'Reels + Shorts + LinkedIn Post',
          },
          {
            id: 'auto-2',
            title: 'কেন মাল্টি-প্ল্যাটফর্ম অটোপোস্টিং এখন অপরিহার্য',
            concept: 'ফেসবুক ও ইনস্টাগ্রামের অ্যালগরিদম পরিবর্তনের সাথে কীভাবে এক ক্লিকে সবখানে পৌঁছাবেন।',
            platforms: ['facebook', 'youtube'],
            scheduledFor: 'Tomorrow at 4:30 PM',
            status: 'queued',
            format: 'Bangla Special Reel / Video',
          },
        ],
        mode: 'fallback',
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Generate ${count} viral content concepts ready for cross-platform automation (Facebook, Instagram, LinkedIn, YouTube Reels/Shorts) for profile "${profile}" in the niche: "${niche}". Include at least one Bangla or regional high-impact topic.
Format as JSON array with objects containing: id, title, concept, platforms (array of facebook, instagram, linkedin, youtube), scheduledFor, status ("queued"), format.`,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '[]';
    return res.json({ success: true, data: JSON.parse(text), mode: 'gemini' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    app: 'SocialPulse (MINDCRAFTED REALITIES)',
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    time: new Date().toISOString(),
  });
});

// Mount Vite middleware in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SocialPulse] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
