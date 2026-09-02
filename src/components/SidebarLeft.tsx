import React from 'react';
import {
  Users, UsersRound, Tv, Bookmark, Store, Clock, Calendar,
  Flag, ChevronDown, Shield, UserCheck, Flame, Compass
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SidebarLeft: React.FC = () => {
  const {
    currentUser,
    setCurrentTab,
    setSelectedUserId,
    setSelectedGroupId,
    setIsAdminOpen,
    setIsSwitchUserOpen,
    groups,
  } = useApp();

  return (
    <aside className="hidden lg:block w-[280px] h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
      {/* Current User Profile Item */}
      <button
        onClick={() => {
          setSelectedUserId(currentUser.id);
          setCurrentTab('profile');
        }}
        className="w-full flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-[#3a3b3c] rounded-lg cursor-pointer transition-colors text-left"
      >
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-9 h-9 rounded-full object-cover border border-gray-300 dark:border-gray-600 shadow-xs"
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{currentUser.name}</p>
          <span className="text-xs text-gray-500">প্রোফাইল দেখুন</span>
        </div>
      </button>

      {/* Main App Shortcuts */}
      <div className="mt-1 space-y-0.5">
        <button
          onClick={() => {
            setCurrentTab('friends');
            setSelectedGroupId(null);
          }}
          className="w-full flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-[#3a3b3c] rounded-lg cursor-pointer transition-colors text-left"
        >
          <div className="w-9 h-9 text-blue-500 text-center flex items-center justify-center text-xl">
            👥
          </div>
          <span className="font-medium text-sm text-gray-800 dark:text-gray-200">Friends (বন্ধুরা)</span>
        </button>

        <button
          onClick={() => {
            setCurrentTab('groups');
            setSelectedGroupId(null);
          }}
          className="w-full flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-[#3a3b3c] rounded-lg cursor-pointer transition-colors text-left"
        >
          <div className="w-9 h-9 text-blue-400 text-center flex items-center justify-center text-xl">
            🏘️
          </div>
          <span className="font-medium text-sm text-gray-800 dark:text-gray-200">Groups (গ্রুপসমূহ)</span>
        </button>

        <button
          onClick={() => {
            setCurrentTab('marketplace');
            setSelectedGroupId(null);
          }}
          className="w-full flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-[#3a3b3c] rounded-lg cursor-pointer transition-colors text-left"
        >
          <div className="w-9 h-9 text-orange-400 text-center flex items-center justify-center text-xl">
            🏪
          </div>
          <span className="font-medium text-sm text-gray-800 dark:text-gray-200">Marketplace (মার্কেটপ্লেস)</span>
        </button>

        <button
          onClick={() => {
            setCurrentTab('watch');
            setSelectedGroupId(null);
          }}
          className="w-full flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-[#3a3b3c] rounded-lg cursor-pointer transition-colors text-left"
        >
          <div className="w-9 h-9 text-cyan-500 text-center flex items-center justify-center text-xl">
            📹
          </div>
          <span className="font-medium text-sm text-gray-800 dark:text-gray-200">Watch & Reels (ভিডিও)</span>
        </button>

        <button
          onClick={() => {
            setCurrentTab('saved');
            setSelectedGroupId(null);
          }}
          className="w-full flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-[#3a3b3c] rounded-lg cursor-pointer transition-colors text-left"
        >
          <div className="w-9 h-9 text-purple-500 text-center flex items-center justify-center text-xl">
            🔖
          </div>
          <span className="font-medium text-sm text-gray-800 dark:text-gray-200">Saved (সংরক্ষিত পোস্ট)</span>
        </button>

        {/* Admin Console Shortcut */}
        <button
          onClick={() => setIsAdminOpen(true)}
          className="w-full flex items-center gap-3 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg cursor-pointer transition-colors text-left bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/40 my-1"
        >
          <div className="w-9 h-9 rounded-md bg-[#1877f2] text-white flex items-center justify-center shadow-inner font-bold text-sm">
            ⚙️
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-bold text-sm text-[#1877f2] dark:text-[#2d88ff]">Admin Console</span>
            <p className="text-[11px] text-gray-500">Google Sheets DB & Settings</p>
          </div>
        </button>

        <button
          onClick={() => setIsSwitchUserOpen(true)}
          className="w-full flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-[#3a3b3c] rounded-lg cursor-pointer transition-colors text-left"
        >
          <div className="w-9 h-9 text-orange-500 text-center flex items-center justify-center text-xl">
            🔄
          </div>
          <span className="font-medium text-sm text-gray-800 dark:text-gray-200">Switch Account</span>
        </button>
      </div>

      <hr className="my-3 border-gray-300 dark:border-[#393a3b] mx-2" />

      {/* Your Shortcuts with geometric gradient blocks */}
      <div>
        <h3 className="text-gray-500 dark:text-gray-400 font-semibold px-2 mb-2 text-sm">
          Your Shortcuts
        </h3>

        <div className="space-y-1">
          {groups.slice(0, 4).map((group, idx) => {
            const gradients = [
              'from-purple-500 to-blue-500',
              'from-green-400 to-cyan-500',
              'from-amber-400 to-pink-500',
              'from-blue-600 to-indigo-700'
            ];
            const grad = gradients[idx % gradients.length];
            return (
              <button
                key={group.id}
                onClick={() => {
                  setSelectedGroupId(group.id);
                  setCurrentTab('groups');
                }}
                className="w-full flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-[#3a3b3c] rounded-lg cursor-pointer transition-colors text-left"
              >
                {group.avatarUrl ? (
                  <img
                    src={group.avatarUrl}
                    alt={group.name}
                    className="w-9 h-9 rounded-md object-cover shadow-xs"
                  />
                ) : (
                  <div className={`w-9 h-9 bg-gradient-to-br ${grad} rounded-md flex items-center justify-center text-white font-bold text-xs shadow-xs`}>
                    {group.name[0]}
                  </div>
                )}
                <span className="font-medium text-sm text-gray-800 dark:text-gray-200 truncate">
                  {group.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 px-2 text-[11px] text-gray-500 dark:text-gray-400 space-y-1">
        <p>Privacy · Terms · Advertising · Cookies · Sagai © 2026</p>
      </div>
    </aside>
  );
};
