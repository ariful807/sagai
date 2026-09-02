import React, { useState, useRef, useEffect } from 'react';
import {
  Search, Home, Users, Tv, Store, UsersRound, MessageCircle, Bell,
  Plus, Moon, Sun, Shield, LogOut, UserCheck, Settings, Check,
  ChevronDown, ExternalLink, RefreshCw, X, Video, Image as ImageIcon
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    currentUser,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    conversations,
    friendRequests,
    settings,
    darkMode,
    setDarkMode,
    setIsAdminOpen,
    setIsCreatePostOpen,
    setIsCreateStoryOpen,
    setIsCreateGroupOpen,
    setIsMessengerModalOpen,
    setIsSwitchUserOpen,
    searchQuery,
    setSearchQuery,
    users,
    groups,
    posts,
    selectedUserId,
    selectedGroupId,
    setSelectedUserId,
    setSelectedGroupId,
  } = useApp();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const createRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const unreadNotifCount = notifications.filter(n => !n.isRead).length;
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const pendingRequestsCount = friendRequests.filter(r => r.status === 'pending').length;

  // Handle outside click to close menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (createRef.current && !createRef.current.contains(event.target as Node)) {
        setIsCreateMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter search results
  const filteredUsers = searchQuery
    ? users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.username.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];
  const filteredGroups = searchQuery
    ? groups.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];
  const filteredPosts = searchQuery
    ? posts.filter(p => p.content.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3)
    : [];

  return (
    <header className="sticky top-0 z-40 h-14 bg-white dark:bg-[#242526] border-b border-gray-300 dark:border-[#393a3b] shadow-xs px-2 sm:px-4 flex items-center justify-between transition-colors">
      {/* Left: Logo & Search Bar */}
      <div className="flex items-center gap-2 flex-1 max-w-[340px]">
        <button
          onClick={() => {
            setCurrentTab('feed');
            setSelectedGroupId(null);
            setSelectedUserId(null);
          }}
          className="flex items-center gap-2 cursor-pointer focus:outline-hidden group shrink-0"
          title="sagai Home"
        >
          {settings.appIconUrl ? (
            <img
              src={settings.appIconUrl}
              alt="sagai"
              className="w-10 h-10 rounded-full object-cover shadow-xs border border-blue-500/20 group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#1877f2] flex items-center justify-center text-white font-black text-2xl shadow-inner group-hover:scale-105 transition-transform">
              S
            </div>
          )}
          <span className="text-2xl font-black tracking-tight text-[#1877f2] dark:text-[#2d88ff] hidden sm:inline-block">
            {settings.appName || 'sagai'}
          </span>
        </button>

        {/* Search input with live popup */}
        <div ref={searchRef} className="relative flex-1 max-w-xs">
          <div className="flex items-center bg-[#f0f2f5] dark:bg-[#3a3b3c] rounded-full px-3.5 py-2 w-full text-sm text-gray-700 dark:text-gray-200 border border-transparent focus-within:border-blue-400 focus-within:bg-white dark:focus-within:bg-[#242526] transition-all">
            <Search className="w-4 h-4 text-gray-400 dark:text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search Sagai..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              className="bg-transparent border-none outline-hidden ml-2 w-full text-xs sm:text-sm placeholder-gray-500 dark:placeholder-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Live Search dropdown */}
          {isSearchFocused && (searchQuery.trim() || filteredUsers.length > 0) && (
            <div className="absolute top-12 left-0 right-0 sm:w-80 bg-white dark:bg-[#242526] rounded-xl shadow-2xl border border-gray-200 dark:border-[#393a3b] p-3 z-50 max-h-96 overflow-y-auto">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase">
                অনুসন্ধানের ফলাফল
              </div>

              {filteredUsers.length === 0 && filteredGroups.length === 0 && filteredPosts.length === 0 ? (
                <div className="text-center py-6 text-sm text-gray-500">
                  কোনো ফলাফল পাওয়া যায়নি
                </div>
              ) : null}

              {filteredUsers.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">ব্যবহারকারী</div>
                  {filteredUsers.map(u => (
                    <div
                      key={u.id}
                      onClick={() => {
                        setSelectedUserId(u.id);
                        setCurrentTab('profile');
                        setIsSearchFocused(false);
                      }}
                      className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg cursor-pointer transition-colors"
                    >
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white leading-none">{u.name}</p>
                        <p className="text-xs text-gray-500">@{u.username}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredGroups.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">গ্রুপ</div>
                  {filteredGroups.map(g => (
                    <div
                      key={g.id}
                      onClick={() => {
                        setSelectedGroupId(g.id);
                        setCurrentTab('groups');
                        setIsSearchFocused(false);
                      }}
                      className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg cursor-pointer transition-colors"
                    >
                      <img src={g.avatarUrl} alt={g.name} className="w-8 h-8 rounded-lg object-cover" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white leading-none">{g.name}</p>
                        <p className="text-xs text-gray-500">{g.membersCount} সদস্য</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredPosts.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1">পোস্ট</div>
                  {filteredPosts.map(p => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setCurrentTab('feed');
                        setIsSearchFocused(false);
                      }}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg cursor-pointer text-xs text-gray-700 dark:text-gray-300 line-clamp-2"
                    >
                      <span className="font-semibold text-gray-900 dark:text-white">{p.authorName}: </span>
                      {p.content}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Center: Main Navigation Tabs */}
      <nav className="hidden md:flex items-center justify-center h-full gap-1 lg:gap-2 flex-1 max-w-xl">
        <button
          onClick={() => {
            setCurrentTab('feed');
            setSelectedGroupId(null);
            setSelectedUserId(null);
          }}
          className={`relative flex items-center justify-center h-full px-6 lg:px-8 border-b-[3px] transition-all cursor-pointer ${
            currentTab === 'feed' && !selectedGroupId && !selectedUserId
              ? 'border-[#1877f2] text-[#1877f2]'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg'
          }`}
          title="হোম / ফিড"
        >
          <Home className="w-6 h-6" />
        </button>

        <button
          onClick={() => {
            setCurrentTab('friends');
            setSelectedGroupId(null);
            setSelectedUserId(null);
          }}
          className={`relative flex items-center justify-center h-full px-6 lg:px-8 border-b-[3px] transition-all cursor-pointer ${
            currentTab === 'friends'
              ? 'border-[#1877f2] text-[#1877f2]'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg'
          }`}
          title="বন্ধুরা"
        >
          <Users className="w-6 h-6" />
          {pendingRequestsCount > 0 && (
            <span className="absolute top-2 right-4 bg-red-500 text-white text-[11px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
              {pendingRequestsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setCurrentTab('watch');
            setSelectedGroupId(null);
            setSelectedUserId(null);
          }}
          className={`relative flex items-center justify-center h-full px-6 lg:px-8 border-b-[3px] transition-all cursor-pointer ${
            currentTab === 'watch'
              ? 'border-[#1877f2] text-[#1877f2]'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg'
          }`}
          title="ভিডিও ও রিলস"
        >
          <Tv className="w-6 h-6" />
        </button>

        <button
          onClick={() => {
            setCurrentTab('groups');
            setSelectedUserId(null);
          }}
          className={`relative flex items-center justify-center h-full px-6 lg:px-8 border-b-[3px] transition-all cursor-pointer ${
            currentTab === 'groups'
              ? 'border-[#1877f2] text-[#1877f2]'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg'
          }`}
          title="গ্রুপসমূহ"
        >
          <UsersRound className="w-6 h-6" />
        </button>

        <button
          onClick={() => {
            setCurrentTab('marketplace');
            setSelectedGroupId(null);
            setSelectedUserId(null);
          }}
          className={`relative flex items-center justify-center h-full px-6 lg:px-8 border-b-[3px] transition-all cursor-pointer ${
            currentTab === 'marketplace'
              ? 'border-[#1877f2] text-[#1877f2]'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg'
          }`}
          title="মার্কেটপ্লেস"
        >
          <Store className="w-6 h-6" />
        </button>
      </nav>

      {/* Right Controls: Create, Messenger, Notifications, Dark Mode, Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Admin Quick Access Badge */}
        <button
          onClick={() => setIsAdminOpen(true)}
          className="hidden sm:flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-[#1877f2] dark:text-[#2d88ff] px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border border-blue-100 dark:border-blue-800 shadow-xs"
          title="Admin Panel & Google Sheets Database Config"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Admin Panel</span>
          {settings.syncStatus === 'connected' && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#242526]" title="Google Sheets Connected" />
          )}
        </button>

        {/* Create Menu (+) */}
        <div ref={createRef} className="relative">
          <button
            onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#e4e6eb] dark:bg-[#3a3b3c] hover:bg-[#d8dadf] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="তৈরি করুন"
          >
            <Plus className="w-5 h-5" />
          </button>

          {isCreateMenuOpen && (
            <div className="absolute right-0 top-12 w-64 bg-white dark:bg-[#242526] rounded-xl shadow-xl border border-gray-200 dark:border-[#393a3b] p-2 z-50">
              <div className="text-xs font-bold text-gray-500 dark:text-gray-400 px-3 py-2 uppercase">
                তৈরি করুন
              </div>
              <button
                onClick={() => {
                  setIsCreatePostOpen(true);
                  setIsCreateMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 p-2.5 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg text-left text-sm font-medium text-gray-800 dark:text-gray-200"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-[#1877f2] flex items-center justify-center">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">পোস্ট</p>
                  <p className="text-xs text-gray-500">আপনার মতামত বা ছবি শেয়ার করুন</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsCreateStoryOpen(true);
                  setIsCreateMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 p-2.5 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg text-left text-sm font-medium text-gray-800 dark:text-gray-200"
              >
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 flex items-center justify-center">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">স্টোরি</p>
                  <p className="text-xs text-gray-500">২৪ ঘন্টার জন্য স্টোরি যোগ করুন</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsCreateGroupOpen(true);
                  setIsCreateMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 p-2.5 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg text-left text-sm font-medium text-gray-800 dark:text-gray-200"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center">
                  <UsersRound className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">গ্রুপ</p>
                  <p className="text-xs text-gray-500">একটি নতুন কমিউনিটি গ্রুপ তৈরি করুন</p>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Messenger Button */}
        <button
          onClick={() => setIsMessengerModalOpen(true)}
          className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#e4e6eb] dark:bg-[#3a3b3c] hover:bg-[#d8dadf] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-white flex items-center justify-center transition-colors cursor-pointer"
          title="মেসেঞ্জার"
        >
          <MessageCircle className="w-5 h-5" />
          {unreadMessagesCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-extrabold rounded-full h-4 min-w-4 px-1 flex items-center justify-center animate-bounce">
              {unreadMessagesCount}
            </span>
          )}
        </button>

        {/* Notifications Dropdown */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#e4e6eb] dark:bg-[#3a3b3c] hover:bg-[#d8dadf] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="নোটিফিকেশন"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-extrabold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                {unreadNotifCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white dark:bg-[#242526] rounded-xl shadow-2xl border border-gray-200 dark:border-[#393a3b] p-3 z-50 max-h-[480px] overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-[#393a3b]">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">নোটিফিকেশন</h3>
                {unreadNotifCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-xs text-[#1877f2] dark:text-[#2d88ff] hover:underline font-semibold"
                  >
                    সব পঠিত হিসেবে চিহ্নিত করুন
                  </button>
                )}
              </div>

              <div className="divide-y divide-gray-100 dark:divide-[#393a3b] mt-2">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-sm text-gray-500">
                    কোনো নতুন নোটিফিকেশন নেই
                  </div>
                ) : (
                  notifications.map((n, idx) => (
                    <div
                      key={n.id ? `${n.id}_${idx}` : `notif_${idx}`}
                      onClick={() => {
                        markNotificationAsRead(n.id);
                        if (n.targetId) {
                          if (n.type === 'group_invite') {
                            setSelectedGroupId(n.targetId);
                            setCurrentTab('groups');
                          } else {
                            setCurrentTab('feed');
                          }
                        }
                        setIsNotificationsOpen(false);
                      }}
                      className={`flex items-start gap-3 p-2.5 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-[#3a3b3c] transition-colors ${
                        !n.isRead ? 'bg-blue-50/60 dark:bg-blue-900/10' : ''
                      }`}
                    >
                      <img src={n.senderAvatar} alt={n.senderName} className="w-10 h-10 rounded-full object-cover shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm text-gray-900 dark:text-white">
                          <span className="font-bold">{n.senderName} </span>
                          {n.content}
                        </p>
                        <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                          {n.createdAt}
                        </span>
                      </div>
                      {!n.isRead && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#1877f2] mt-2 shrink-0" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dark Mode Toggle Button */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#e4e6eb] dark:bg-[#3a3b3c] hover:bg-[#d8dadf] dark:hover:bg-[#4e4f50] text-[#050505] dark:text-white flex items-center justify-center transition-colors cursor-pointer"
          title={darkMode ? 'লাইট মোড সক্রিয় করুন' : 'ডার্ক মোড সক্রিয় করুন'}
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* User Profile Dropdown Menu */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-1 cursor-pointer focus:outline-hidden group"
            title={currentUser.name}
          >
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-transparent group-hover:border-[#1877f2] transition-colors"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#242526] rounded-full" />
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors hidden sm:block" />
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 top-12 w-72 bg-white dark:bg-[#242526] rounded-2xl shadow-2xl border border-gray-200 dark:border-[#393a3b] p-3 z-50">
              {/* Profile Card Header */}
              <div
                onClick={() => {
                  setSelectedUserId(currentUser.id);
                  setCurrentTab('profile');
                  setIsProfileMenuOpen(false);
                }}
                className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-xl cursor-pointer transition-colors border-b border-gray-100 dark:border-[#393a3b] pb-3"
              >
                <img src={currentUser.avatar} alt={currentUser.name} className="w-12 h-12 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="font-bold text-gray-900 dark:text-white truncate">{currentUser.name}</p>
                    {currentUser.isVerified && (
                      <span className="text-[#1877f2]">✓</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">প্রোফাইল দেখুন</p>
                </div>
              </div>

              {/* Menu items */}
              <div className="mt-2 space-y-1">
                <button
                  onClick={() => {
                    setIsAdminOpen(true);
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg text-sm text-gray-800 dark:text-gray-200 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-[#1877f2] flex items-center justify-center">
                      <Shield className="w-4 h-4" />
                    </div>
                    <span className="font-semibold">এডমিন প্যানেল & Sheet</span>
                  </div>
                  <span className="text-[10px] bg-blue-100 text-[#1877f2] px-1.5 py-0.5 rounded-sm font-bold">PRO</span>
                </button>

                <button
                  onClick={() => {
                    setIsSwitchUserOpen(true);
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 p-2 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg text-sm text-gray-800 dark:text-gray-200 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <span className="font-semibold">অ্যাকাউন্ট পরিবর্তন (Switch)</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedUserId(currentUser.id);
                    setCurrentTab('profile');
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 p-2 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg text-sm text-gray-800 dark:text-gray-200 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center justify-center">
                    <Settings className="w-4 h-4" />
                  </div>
                  <span className="font-semibold">সেটিংস এবং প্রাইভেসি</span>
                </button>

                <button
                  onClick={() => {
                    setIsSwitchUserOpen(true);
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg text-sm transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 flex items-center justify-center">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <span className="font-semibold">লগআউট</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
