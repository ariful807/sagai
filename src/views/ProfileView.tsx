import React, { useState } from 'react';
import {
  Camera, Edit3, MapPin, Briefcase, Heart, Calendar, Plus,
  MessageCircle, UserPlus, Check, Sparkles, Image as ImageIcon,
  Users, MoreHorizontal, Globe
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PostCard } from '../components/PostCard';
import { CreatePostBox } from '../components/CreatePostBox';
import { User } from '../types';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    selectedUserId,
    users,
    posts,
    updateUserProfile,
    openChatWithUser,
    sendFriendRequest,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'friends' | 'photos'>('posts');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState('');
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [workInput, setWorkInput] = useState('');
  const [livesInput, setLivesInput] = useState('');

  const targetUser: User = (selectedUserId ? users.find(u => u.id === selectedUserId) : currentUser) || currentUser;
  const isMe = targetUser.id === currentUser.id;

  // Filter posts by this user
  const userPosts = posts.filter(p => p.authorId === targetUser.id);
  const userFriends = users.filter(u => targetUser.friends.includes(u.id));

  const handleSaveBio = () => {
    updateUserProfile({ bio: bioInput });
    setIsEditingBio(false);
  };

  const handleSaveDetails = () => {
    updateUserProfile({ work: workInput || targetUser.work, livesIn: livesInput || targetUser.livesIn });
    setIsEditingDetails(false);
  };

  const handleAvatarChange = () => {
    const url = prompt('নতুন প্রোফাইল ছবির লিংক (URL) দিন:', targetUser.avatar);
    if (url && isMe) {
      updateUserProfile({ avatar: url });
    }
  };

  const handleCoverChange = () => {
    const url = prompt('নতুন কভার ছবির লিংক (URL) দিন:', targetUser.coverPhoto);
    if (url && isMe) {
      updateUserProfile({ coverPhoto: url });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-2 sm:py-4 px-2 sm:px-4">
      {/* Profile Header Banner & Avatar Card */}
      <div className="bg-white dark:bg-[#242526] rounded-3xl overflow-hidden shadow-xs border border-gray-200 dark:border-[#393a3b] mb-4">
        {/* Cover Photo */}
        <div className="relative h-48 sm:h-72 bg-gradient-to-r from-blue-400 to-indigo-500">
          <img
            src={targetUser.coverPhoto}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          {isMe && (
            <button
              onClick={handleCoverChange}
              className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 backdrop-blur-xs transition-colors cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>কভার ফটো পরিবর্তন</span>
            </button>
          )}
        </div>

        {/* Avatar & Profile Info */}
        <div className="p-4 sm:p-6 pb-2">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              <div className="relative">
                <img
                  src={targetUser.avatar}
                  alt={targetUser.name}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover ring-4 ring-white dark:ring-[#242526] shadow-xl bg-white"
                />
                {isMe && (
                  <button
                    onClick={handleAvatarChange}
                    className="absolute bottom-1 right-1 p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 rounded-full text-gray-800 dark:text-white shadow-md cursor-pointer"
                    title="প্রোফাইল ছবি পরিবর্তন"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div>
                <div className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                    {targetUser.name}
                  </h1>
                  {targetUser.isVerified && (
                    <span className="text-[#1877f2] font-bold text-sm" title="Verified">✓</span>
                  )}
                  {targetUser.role === 'admin' && (
                    <span className="bg-blue-100 text-[#1877f2] text-[10px] font-bold px-2 py-0.5 rounded-full">
                      এডমিন
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 font-medium">@{targetUser.username}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-semibold">
                  {targetUser.friendsCount} জন বন্ধু · {targetUser.followersCount} ফলোয়ার
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-2">
              {isMe ? (
                <button
                  onClick={() => {
                    setIsEditingBio(true);
                    setBioInput(targetUser.bio);
                  }}
                  className="px-4 py-2 bg-gray-200 dark:bg-[#3a3b3c] hover:bg-gray-300 text-gray-800 dark:text-gray-200 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>প্রোফাইল এডিট</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => sendFriendRequest(targetUser.id)}
                    className="px-4 py-2 bg-[#1877f2] hover:bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>ফ্রেন্ড রিকোয়েস্ট</span>
                  </button>
                  <button
                    onClick={() => openChatWithUser(targetUser)}
                    className="px-4 py-2 bg-gray-200 dark:bg-[#3a3b3c] hover:bg-gray-300 text-gray-800 dark:text-gray-200 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-[#1877f2]" />
                    <span>মেসেজ</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Bio text */}
          <div className="border-t border-gray-100 dark:border-[#393a3b] pt-3 text-center sm:text-left">
            {isEditingBio ? (
              <div className="space-y-2 max-w-md">
                <textarea
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  className="w-full text-xs sm:text-sm p-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-[#f0f2f5] dark:bg-[#3a3b3c] text-gray-900 dark:text-white"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button onClick={handleSaveBio} className="px-3 py-1 bg-[#1877f2] text-white rounded-lg text-xs font-bold">সেভ</button>
                  <button onClick={() => setIsEditingBio(false)} className="px-3 py-1 bg-gray-200 text-gray-800 rounded-lg text-xs font-bold">বাতিল</button>
                </div>
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
                "{targetUser.bio || 'বায়ো এখনো যোগ করা হয়নি।'}"
              </p>
            )}
          </div>

          {/* Profile Navigation Tabs */}
          <div className="flex items-center gap-2 border-t border-gray-200 dark:border-[#393a3b] mt-4 pt-1">
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'posts'
                  ? 'border-[#1877f2] text-[#1877f2]'
                  : 'border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg'
              }`}
            >
              পোস্টসমূহ ({userPosts.length})
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'about'
                  ? 'border-[#1877f2] text-[#1877f2]'
                  : 'border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg'
              }`}
            >
              সম্পর্কে (About)
            </button>
            <button
              onClick={() => setActiveTab('friends')}
              className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'friends'
                  ? 'border-[#1877f2] text-[#1877f2]'
                  : 'border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg'
              }`}
            >
              বন্ধুরা ({userFriends.length})
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'posts' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left: About Intro Card */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-[#242526] rounded-2xl p-4 shadow-xs border border-gray-200 dark:border-[#393a3b] space-y-3">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">পরিচিতি (Intro)</h3>
              <div className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
                {targetUser.work && (
                  <div className="flex items-center gap-2.5">
                    <Briefcase className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>কর্মরত: <strong className="text-gray-900 dark:text-white">{targetUser.work}</strong></span>
                  </div>
                )}
                {targetUser.livesIn && (
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>বসবাস করেন: <strong className="text-gray-900 dark:text-white">{targetUser.livesIn}</strong></span>
                  </div>
                )}
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>যোগদান করেছেন: {targetUser.joinedDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Posts Stream */}
          <div className="md:col-span-2 space-y-4">
            {isMe && <CreatePostBox />}

            {userPosts.length === 0 ? (
              <div className="bg-white dark:bg-[#242526] rounded-2xl p-8 text-center border border-gray-200 dark:border-[#393a3b]">
                <p className="text-gray-500 font-semibold text-sm">কোনো পোস্ট পাওয়া যায়নি</p>
              </div>
            ) : (
              userPosts.map(post => <PostCard key={post.id} post={post} />)
            )}
          </div>
        </div>
      )}

      {/* Tab: About */}
      {activeTab === 'about' && (
        <div className="bg-white dark:bg-[#242526] rounded-2xl p-6 shadow-xs border border-gray-200 dark:border-[#393a3b] space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">সম্পূর্ণ বিবরণ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
            <div className="p-3 bg-gray-50 dark:bg-[#3a3b3c] rounded-xl">
              <span className="text-xs text-gray-500 block">কর্মক্ষেত্র:</span>
              <span className="font-semibold">{targetUser.work || 'তথ্য নেই'}</span>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-[#3a3b3c] rounded-xl">
              <span className="text-xs text-gray-500 block">বর্তমান ঠিকানা:</span>
              <span className="font-semibold">{targetUser.livesIn || 'তথ্য নেই'}</span>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-[#3a3b3c] rounded-xl">
              <span className="text-xs text-gray-500 block">সম্পর্কের স্থিতি:</span>
              <span className="font-semibold">{targetUser.relationship || 'তথ্য নেই'}</span>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-[#3a3b3c] rounded-xl">
              <span className="text-xs text-gray-500 block">ইমেইল:</span>
              <span className="font-semibold">{targetUser.email}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Friends */}
      {activeTab === 'friends' && (
        <div className="bg-white dark:bg-[#242526] rounded-2xl p-6 shadow-xs border border-gray-200 dark:border-[#393a3b]">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">বন্ধুরা ({userFriends.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {userFriends.map(friend => (
              <div key={friend.id} className="text-center p-2 hover:bg-gray-50 dark:hover:bg-[#3a3b3c] rounded-xl transition-colors">
                <img src={friend.avatar} alt={friend.name} className="w-20 h-20 rounded-2xl object-cover mx-auto mb-2 shadow-xs" />
                <p className="font-bold text-xs text-gray-900 dark:text-white truncate">{friend.name}</p>
                <p className="text-[10px] text-gray-500">{friend.livesIn}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
