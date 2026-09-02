import React from 'react';
import { Search, MoreHorizontal, Video, UsersRound, Sparkles, MessageCircle, Phone, Gift } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SidebarRight: React.FC = () => {
  const {
    users,
    currentUser,
    openChatWithUser,
    groups,
    setSelectedGroupId,
    setCurrentTab,
    settings,
    startCall,
  } = useApp();

  // Friends excluding current user
  const contacts = users.filter(u => u.id !== currentUser.id && !u.isBanned);

  return (
    <aside className="hidden xl:block w-[280px] h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
      {/* Platform Announcement Banner */}
      {settings.announcement && (
        <div className="mb-4 p-3 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200/60 dark:border-blue-700/40 rounded-xl">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1877f2] dark:text-[#2d88ff] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Update</span>
          </div>
          <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
            {settings.announcement}
          </p>
        </div>
      )}

      {/* Sponsored / Community Highlight */}
      <div className="mb-3 pb-3 border-b border-gray-200 dark:border-[#393a3b]">
        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-1">
          Sponsored / Shortcuts
        </div>
        <div
          onClick={() => {
            if (groups[0]) {
              setSelectedGroupId(groups[0].id);
              setCurrentTab('groups');
            }
          }}
          className="flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-[#3a3b3c] rounded-lg cursor-pointer transition-colors"
        >
          <img
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200&auto=format&fit=crop&q=80"
            alt="Travelers"
            className="w-16 h-14 rounded-lg object-cover shadow-xs"
          />
          <div>
            <h4 className="text-xs font-bold text-gray-900 dark:text-white line-clamp-1">
              Travelers of Bangladesh
            </h4>
            <p className="text-[11px] text-gray-500 line-clamp-2">
              15k+ members active
            </p>
          </div>
        </div>
      </div>

      {/* Active Friends Header */}
      <div className="flex justify-between items-center mb-3 text-gray-500 font-semibold px-1">
        <span className="text-sm">Active Friends ({contacts.length})</span>
        <div className="flex gap-2 text-xs">
          <button className="p-1 hover:bg-gray-200 dark:hover:bg-[#3a3b3c] rounded-full cursor-pointer">📹</button>
          <button className="p-1 hover:bg-gray-200 dark:hover:bg-[#3a3b3c] rounded-full cursor-pointer">🔍</button>
          <button className="p-1 hover:bg-gray-200 dark:hover:bg-[#3a3b3c] rounded-full cursor-pointer">•••</button>
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex flex-col gap-1">
        {contacts.map(user => (
          <div
            key={user.id}
            onClick={() => openChatWithUser(user)}
            className="flex items-center justify-between p-2 hover:bg-gray-200 dark:hover:bg-[#3a3b3c] rounded-lg cursor-pointer transition-colors group relative"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 bg-gray-300 rounded-full overflow-hidden">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#242526] rounded-full"></div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-[#1877f2] transition-colors">
                  {user.name}
                </p>
              </div>
            </div>

            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startCall(user, 'audio');
                }}
                className="p-1 hover:bg-gray-300 dark:hover:bg-[#4e4f50] rounded-full text-gray-600 dark:text-gray-300"
                title="Audio Call"
              >
                <Phone className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openChatWithUser(user);
                }}
                className="p-1 hover:bg-gray-300 dark:hover:bg-[#4e4f50] rounded-full text-blue-600"
                title="Send Message"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {/* Sagai Support / Community Group tile */}
        <div
          onClick={() => {
            if (groups[0]) {
              setSelectedGroupId(groups[0].id);
              setCurrentTab('groups');
            }
          }}
          className="flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-[#3a3b3c] rounded-lg cursor-pointer transition-colors mt-2 pt-2 border-t border-gray-200 dark:border-[#393a3b]"
        >
          <div className="w-9 h-9 bg-indigo-100 dark:bg-indigo-950 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs">
            S
          </div>
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Sagai Support Group</span>
        </div>
      </div>
    </aside>
  );
};
