import React, { useState } from 'react';
import { Users, UserPlus, UserCheck, UserX, Search, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FriendsView: React.FC = () => {
  const {
    users,
    currentUser,
    friendRequests,
    acceptFriendRequest,
    declineFriendRequest,
    sendFriendRequest,
    removeFriend,
    openChatWithUser,
    setSelectedUserId,
    setCurrentTab,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'requests' | 'suggestions' | 'all'>('requests');
  const [searchFriends, setSearchFriends] = useState('');

  // Pending requests for current user
  const pendingRequests = friendRequests.filter(r => r.toUserId === currentUser.id && r.status === 'pending');

  // All current friends
  const myFriends = users.filter(u => currentUser.friends.includes(u.id));

  // Suggested friends (not me, not currently friends, not pending)
  const suggestedFriends = users.filter(u =>
    u.id !== currentUser.id &&
    !currentUser.friends.includes(u.id) &&
    !friendRequests.some(r => r.toUserId === u.id && r.status === 'pending')
  );

  return (
    <div className="w-full max-w-4xl mx-auto py-4 px-2 sm:px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-7 h-7 text-[#1877f2]" />
            <span>বন্ধুরা (Friends)</span>
          </h1>
          <p className="text-xs text-gray-500">আপনার পরিচিত মানুষদের খুঁজুন এবং সংযুক্ত থাকুন</p>
        </div>

        {/* Tab buttons */}
        <div className="flex items-center gap-2 bg-gray-200/70 dark:bg-[#3a3b3c] p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'requests'
                ? 'bg-white dark:bg-[#242526] text-[#1877f2] shadow-xs'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            রিকোয়েস্ট ({pendingRequests.length})
          </button>

          <button
            onClick={() => setActiveTab('suggestions')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'suggestions'
                ? 'bg-white dark:bg-[#242526] text-[#1877f2] shadow-xs'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            পরামর্শ (Suggestions)
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'all'
                ? 'bg-white dark:bg-[#242526] text-[#1877f2] shadow-xs'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            সকল বন্ধু ({myFriends.length})
          </button>
        </div>
      </div>

      {/* Requests Section */}
      {activeTab === 'requests' && (
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">
            ফ্রেন্ড রিকোয়েস্ট ({pendingRequests.length})
          </h2>

          {pendingRequests.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-[#242526] rounded-2xl border border-gray-200 dark:border-[#393a3b]">
              <p className="text-sm font-semibold text-gray-500">কোনো নতুন ফ্রেন্ড রিকোয়েস্ট নেই</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {pendingRequests.map(req => (
                <div
                  key={req.id}
                  className="bg-white dark:bg-[#242526] rounded-2xl overflow-hidden shadow-xs border border-gray-200 dark:border-[#393a3b] flex flex-col justify-between"
                >
                  <div
                    onClick={() => {
                      setSelectedUserId(req.fromUser.id);
                      setCurrentTab('profile');
                    }}
                    className="cursor-pointer"
                  >
                    <img
                      src={req.fromUser.avatar}
                      alt={req.fromUser.name}
                      className="w-full h-36 sm:h-44 object-cover"
                    />
                    <div className="p-3 pb-2">
                      <p className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white truncate">
                        {req.fromUser.name}
                      </p>
                      <span className="text-[11px] text-gray-500">{req.createdAt}</span>
                    </div>
                  </div>

                  <div className="p-3 pt-0 space-y-1.5">
                    <button
                      onClick={() => acceptFriendRequest(req.id)}
                      className="w-full py-1.5 bg-[#1877f2] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      নিশ্চিত করুন (Confirm)
                    </button>
                    <button
                      onClick={() => declineFriendRequest(req.id)}
                      className="w-full py-1.5 bg-gray-200 dark:bg-[#3a3b3c] hover:bg-gray-300 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-bold transition-colors"
                    >
                      বাতিল করুন (Delete)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Suggestions Section */}
      {activeTab === 'suggestions' && (
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">
            আপনি যাদের চিনতে পারেন
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {suggestedFriends.map(user => (
              <div
                key={user.id}
                className="bg-white dark:bg-[#242526] rounded-2xl overflow-hidden shadow-xs border border-gray-200 dark:border-[#393a3b] flex flex-col justify-between"
              >
                <div
                  onClick={() => {
                    setSelectedUserId(user.id);
                    setCurrentTab('profile');
                  }}
                  className="cursor-pointer"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-36 sm:h-44 object-cover"
                  />
                  <div className="p-3 pb-2">
                    <p className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <span className="text-[11px] text-gray-500">{user.livesIn || 'Dhaka'}</span>
                  </div>
                </div>

                <div className="p-3 pt-0 space-y-1.5">
                  <button
                    onClick={() => sendFriendRequest(user.id)}
                    className="w-full py-1.5 bg-blue-50 dark:bg-blue-900/30 text-[#1877f2] dark:text-[#2d88ff] hover:bg-blue-100 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>এড ফ্রেন্ড (Add)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Friends Section */}
      {activeTab === 'all' && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              সকল বন্ধু ({myFriends.length})
            </h2>
            <div className="flex items-center bg-white dark:bg-[#242526] border border-gray-200 dark:border-[#393a3b] rounded-xl px-3 py-1 text-xs">
              <Search className="w-3 h-3 text-gray-400 mr-1.5" />
              <input
                type="text"
                placeholder="বন্ধু খুঁজুন..."
                value={searchFriends}
                onChange={(e) => setSearchFriends(e.target.value)}
                className="bg-transparent border-none outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {myFriends
              .filter(f => f.name.toLowerCase().includes(searchFriends.toLowerCase()))
              .map(friend => (
                <div
                  key={friend.id}
                  className="bg-white dark:bg-[#242526] p-3 rounded-2xl shadow-xs border border-gray-200 dark:border-[#393a3b] flex items-center justify-between gap-3"
                >
                  <div
                    onClick={() => {
                      setSelectedUserId(friend.id);
                      setCurrentTab('profile');
                    }}
                    className="flex items-center gap-3 cursor-pointer min-w-0"
                  >
                    <img src={friend.avatar} alt={friend.name} className="w-12 h-12 rounded-2xl object-cover shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white truncate">
                        {friend.name}
                      </p>
                      <span className="text-[11px] text-gray-500">{friend.livesIn}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => openChatWithUser(friend)}
                      className="p-2 bg-blue-50 dark:bg-blue-900/30 text-[#1877f2] hover:bg-blue-100 rounded-xl"
                      title="মেসেজ পাঠান"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeFriend(friend.id)}
                      className="p-2 bg-gray-100 dark:bg-[#3a3b3c] text-gray-500 hover:text-red-600 rounded-xl"
                      title="আনফ্রেন্ড করুন"
                    >
                      <UserX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
