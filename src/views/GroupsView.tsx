import React, { useState } from 'react';
import {
  UsersRound, Plus, Globe, Lock, Shield, ArrowLeft, Search,
  Share2, UserPlus, Check, MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PostCard } from '../components/PostCard';
import { CreatePostBox } from '../components/CreatePostBox';

export const GroupsView: React.FC = () => {
  const {
    groups,
    selectedGroupId,
    setSelectedGroupId,
    toggleJoinGroup,
    setIsCreateGroupOpen,
    posts,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'my' | 'discover'>('my');
  const [searchGroup, setSearchGroup] = useState('');

  const selectedGroup = groups.find(g => g.id === selectedGroupId);

  // Filter posts belonging to the selected group
  const groupPosts = selectedGroupId
    ? posts.filter(p => p.groupId === selectedGroupId)
    : [];

  const myGroups = groups.filter(g => g.isJoined);
  const discoverGroups = groups.filter(g => !g.isJoined);

  const displayedGroups = (activeSubTab === 'my' ? myGroups : discoverGroups).filter(g =>
    g.name.toLowerCase().includes(searchGroup.toLowerCase()) ||
    g.description.toLowerCase().includes(searchGroup.toLowerCase())
  );

  // If viewing a specific single group
  if (selectedGroup) {
    return (
      <div className="w-full max-w-4xl mx-auto py-4 px-2 sm:px-4">
        {/* Back Button */}
        <button
          onClick={() => setSelectedGroupId(null)}
          className="flex items-center gap-2 mb-3 px-3 py-1.5 bg-white dark:bg-[#242526] hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-xl text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>সকল গ্রুপে ফিরে যান</span>
        </button>

        {/* Group Header Banner Card */}
        <div className="bg-white dark:bg-[#242526] rounded-3xl overflow-hidden shadow-xs border border-gray-200 dark:border-[#393a3b] mb-4">
          <div className="h-48 sm:h-64 relative bg-gray-200 dark:bg-gray-800">
            <img
              src={selectedGroup.coverUrl}
              alt={selectedGroup.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-4 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <img
                  src={selectedGroup.avatarUrl}
                  alt={selectedGroup.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-white dark:ring-[#242526] -mt-10 sm:-mt-12 shadow-lg"
                />
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                    {selectedGroup.name}
                  </h1>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {selectedGroup.privacy === 'public' ? (
                      <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> পাবলিক গ্রুপ</span>
                    ) : (
                      <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> প্রাইভেট গ্রুপ</span>
                    )}
                    <span>·</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {selectedGroup.membersCount} জন সদস্য
                    </span>
                  </div>
                </div>
              </div>

              {/* Join / Leave Action */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleJoinGroup(selectedGroup.id)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center gap-2 cursor-pointer ${
                    selectedGroup.isJoined
                      ? 'bg-gray-200 dark:bg-[#3a3b3c] hover:bg-gray-300 text-gray-800 dark:text-gray-200'
                      : 'bg-[#1877f2] hover:bg-blue-600 text-white'
                  }`}
                >
                  {selectedGroup.isJoined ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span>যুক্ত আছেন (Joined)</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>গ্রুপে যোগ দিন</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-[#393a3b] pt-3">
              {selectedGroup.description}
            </p>
          </div>
        </div>

        {/* Group Feed & Posts Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left / Main: Group Posts */}
          <div className="md:col-span-2 space-y-4">
            {selectedGroup.isJoined && (
              <CreatePostBox />
            )}

            {groupPosts.length === 0 ? (
              <div className="bg-white dark:bg-[#242526] rounded-2xl p-8 text-center border border-gray-200 dark:border-[#393a3b] shadow-xs">
                <MessageSquare className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="font-bold text-gray-700 dark:text-gray-300 text-sm">
                  এই গ্রুপে এখনো কোনো পোস্ট হয়নি।
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  প্রথম পোস্ট করে আলোচনা শুরু করুন!
                </p>
              </div>
            ) : (
              groupPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </div>

          {/* Right: Group Info & Rules */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-[#242526] rounded-2xl p-4 shadow-xs border border-gray-200 dark:border-[#393a3b]">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-2">
                গ্রুপের নিয়মাবলী (Rules)
              </h3>
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                {selectedGroup.rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-[#1877f2]">{idx + 1}.</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Groups Main Directory / List View
  return (
    <div className="w-full max-w-4xl mx-auto py-4 px-2 sm:px-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <UsersRound className="w-7 h-7 text-[#1877f2]" />
            <span>গ্রুপসমূহ</span>
          </h1>
          <p className="text-xs text-gray-500">আপনার পছন্দের বিষয় নিয়ে আলোচনা করুন এবং নতুন গ্রুপে যুক্ত হোন</p>
        </div>

        <button
          onClick={() => setIsCreateGroupOpen(true)}
          className="flex items-center justify-center gap-2 bg-[#1877f2] hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-xs cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন গ্রুপ তৈরি করুন</span>
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 bg-gray-200/70 dark:bg-[#3a3b3c] p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveSubTab('my')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeSubTab === 'my'
                ? 'bg-white dark:bg-[#242526] text-[#1877f2] shadow-xs'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            আমার গ্রুপ ({myGroups.length})
          </button>
          <button
            onClick={() => setActiveSubTab('discover')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeSubTab === 'discover'
                ? 'bg-white dark:bg-[#242526] text-[#1877f2] shadow-xs'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            নতুন গ্রুপ আবিষ্কার ({discoverGroups.length})
          </button>
        </div>

        <div className="flex items-center bg-white dark:bg-[#242526] border border-gray-200 dark:border-[#393a3b] rounded-xl px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 max-w-xs shadow-xs">
          <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="গ্রুপের নাম খুঁজুন..."
            value={searchGroup}
            onChange={(e) => setSearchGroup(e.target.value)}
            className="bg-transparent border-none outline-hidden ml-2 w-full"
          />
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {displayedGroups.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white dark:bg-[#242526] rounded-2xl border border-gray-200 dark:border-[#393a3b]">
            <p className="text-gray-500 font-semibold text-sm">কোনো গ্রুপ পাওয়া যায়নি</p>
          </div>
        ) : (
          displayedGroups.map(group => (
            <div
              key={group.id}
              onClick={() => setSelectedGroupId(group.id)}
              className="bg-white dark:bg-[#242526] rounded-2xl overflow-hidden shadow-xs border border-gray-200 dark:border-[#393a3b] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="h-32 relative bg-gray-200 dark:bg-gray-800">
                  <img src={group.coverUrl} alt={group.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <img src={group.avatarUrl} alt={group.name} className="w-12 h-12 rounded-xl object-cover -mt-8 ring-2 ring-white dark:ring-[#242526] shadow-md" />
                    <div>
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-[#1877f2] transition-colors line-clamp-1">
                        {group.name}
                      </h3>
                      <p className="text-[11px] text-gray-500">{group.membersCount} জন সদস্য · {group.category}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mt-2 leading-relaxed">
                    {group.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleJoinGroup(group.id);
                  }}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-colors ${
                    group.isJoined
                      ? 'bg-gray-100 dark:bg-[#3a3b3c] hover:bg-gray-200 text-gray-800 dark:text-gray-200'
                      : 'bg-[#1877f2] hover:bg-blue-600 text-white'
                  }`}
                >
                  {group.isJoined ? 'যুক্ত আছেন (Joined)' : 'গ্রুপে যোগ দিন'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
