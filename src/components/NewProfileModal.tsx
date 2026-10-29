import React, { useState } from 'react';
import { useSocialPulse } from '../context/SocialPulseContext';
import { X, Building2, Check, Sparkles } from 'lucide-react';

interface NewProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewProfileModal: React.FC<NewProfileModalProps> = ({ isOpen, onClose }) => {
  const { addNewProfile } = useSocialPulse();

  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [category, setCategory] = useState('Brand & Creator Studio');
  const [accentColor, setAccentColor] = useState('#6366f1');
  const [facebookHandle, setFacebookHandle] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [linkedinHandle, setLinkedinHandle] = useState('');
  const [youtubeHandle, setYoutubeHandle] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addNewProfile({
      name: name.trim(),
      handle: handle.trim() ? (handle.startsWith('@') ? handle : `@${handle}`) : `@${name.toLowerCase().replace(/\s+/g, '')}`,
      category: category.trim() || 'Creator Studio',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      accentColor,
      accounts: {
        facebook: { connected: !!facebookHandle, handle: facebookHandle || `${name}Official`, followers: 12500 },
        instagram: { connected: !!instagramHandle, handle: instagramHandle || `@${name.toLowerCase().replace(/\s+/g, '')}`, followers: 18400 },
        linkedin: { connected: !!linkedinHandle, handle: linkedinHandle || `${name.toLowerCase().replace(/\s+/g, '-')}`, followers: 5200 },
        youtube: { connected: !!youtubeHandle, handle: youtubeHandle || `@${name}`, followers: 24000 },
      },
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">Connect New Managed Profile</h2>
              <p className="text-xs text-zinc-400">Manage client brands with seamless profile switching</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
              Brand / Profile Name:
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Apex Digital Media or Dhaka Creator Hub"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full text-xs p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                Primary Handle:
              </label>
              <input
                type="text"
                placeholder="@apex_media"
                value={handle}
                onChange={e => setHandle(e.target.value)}
                className="w-full text-xs p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                Category:
              </label>
              <input
                type="text"
                placeholder="e.g. E-Commerce / Creator"
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full text-xs p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
              Social Account Handles to Connect:
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <input
                type="text"
                placeholder="Facebook Page"
                value={facebookHandle}
                onChange={e => setFacebookHandle(e.target.value)}
                className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="Instagram Handle"
                value={instagramHandle}
                onChange={e => setInstagramHandle(e.target.value)}
                className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="LinkedIn Org"
                value={linkedinHandle}
                onChange={e => setLinkedinHandle(e.target.value)}
                className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="YouTube Channel"
                value={youtubeHandle}
                onChange={e => setYoutubeHandle(e.target.value)}
                className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm"
            >
              Save & Switch Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
