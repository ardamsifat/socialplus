import React, { useState, useRef, useEffect } from 'react';
import { useSocialPulse } from '../context/SocialPulseContext';
import { ChevronDown, Plus, Check, Briefcase, Sparkles, Building2 } from 'lucide-react';

interface ProfileSwitcherProps {
  onOpenNewProfileModal: () => void;
}

export const ProfileSwitcher: React.FC<ProfileSwitcherProps> = ({ onOpenNewProfileModal }) => {
  const { profiles, activeProfile, setActiveProfileId } = useSocialPulse();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition shadow-xs text-left"
      >
        <div className="relative">
          <img
            src={activeProfile.avatar}
            alt={activeProfile.name}
            className="w-7 h-7 rounded-lg object-cover ring-1 ring-indigo-500/30"
          />
          <span
            className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-zinc-900"
            style={{ backgroundColor: activeProfile.accentColor }}
          />
        </div>
        <div className="hidden sm:flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-[140px]">
              {activeProfile.name}
            </span>
          </div>
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate max-w-[130px]">
            {activeProfile.category}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-zinc-400 transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }} />
      </button>

      {isOpen && (
        <div className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-72 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-2 z-50 text-xs animate-in fade-in zoom-in-95">
          <div className="px-2.5 py-1.5 flex items-center justify-between text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            <span>Managed Profiles ({profiles.length})</span>
            <span className="text-indigo-400 font-mono text-[10px]">Instant Switch</span>
          </div>

          <div className="space-y-1 my-1">
            {profiles.map(p => {
              const isSelected = p.id === activeProfile.id;
              const connectedCount = Object.values(p.accounts).filter(a => a.connected).length;

              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setActiveProfileId(p.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl transition text-left ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 font-medium'
                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                    <div className="truncate">
                      <div className="font-semibold truncate text-zinc-900 dark:text-white flex items-center gap-1">
                        {p.name}
                        {isSelected && <Sparkles className="w-3 h-3 text-indigo-500" />}
                      </div>
                      <div className="text-[10px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                        <span>{p.category}</span>
                        <span>•</span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                          {connectedCount}/4 active
                        </span>
                      </div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-indigo-500 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          <div className="pt-2 mt-1 border-t border-zinc-100 dark:border-zinc-800">
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenNewProfileModal();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-indigo-500 text-zinc-700 dark:text-zinc-300 hover:text-indigo-500 transition text-xs font-medium"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Connect New Profile / Brand</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
