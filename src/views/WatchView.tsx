import React from 'react';
import { Tv, ThumbsUp, MessageCircle, Share2, UserPlus, Check, Play } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const WatchView: React.FC = () => {
  const { watchVideos, toggleFollowVideoAuthor, likeVideo } = useApp();

  return (
    <div className="w-full max-w-2xl mx-auto py-4 px-2 sm:px-0 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2 px-1">
        <Tv className="w-6 h-6 text-[#1877f2]" />
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
          sagai Watch (ভিডিও ও রিলস)
        </h1>
      </div>

      {/* Videos List */}
      <div className="space-y-4">
        {watchVideos.map(video => (
          <article
            key={video.id}
            className="bg-white dark:bg-[#242526] rounded-2xl shadow-xs border border-gray-200 dark:border-[#393a3b] overflow-hidden"
          >
            {/* Header */}
            <div className="p-3 sm:p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={video.authorAvatar}
                  alt={video.authorName}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-sm text-gray-900 dark:text-white">
                      {video.authorName}
                    </span>
                    {video.authorVerified && (
                      <span className="text-[#1877f2] text-xs">✓</span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500">
                    {video.createdAt} · {video.views} ভিউ
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggleFollowVideoAuthor(video.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
                  video.isFollowing
                    ? 'bg-gray-100 dark:bg-[#3a3b3c] text-gray-700 dark:text-gray-200'
                    : 'bg-blue-50 dark:bg-blue-900/30 text-[#1877f2] dark:text-[#2d88ff]'
                }`}
              >
                {video.isFollowing ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>ফলো করছেন</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>ফলো করুন</span>
                  </>
                )}
              </button>
            </div>

            {/* Video Title */}
            <div className="px-4 pb-3">
              <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                {video.title}
              </p>
            </div>

            {/* HTML5 Video Player */}
            <div className="relative bg-black aspect-video flex items-center justify-center">
              <video
                controls
                poster={video.thumbnailUrl}
                className="w-full h-full object-contain"
                playsInline
              >
                <source src={video.videoUrl} type="video/mp4" />
                আপনার ব্রাউজার ভিডিও সাপোর্ট করে না।
              </video>
            </div>

            {/* Video Footer Actions */}
            <div className="p-3 px-4 flex items-center justify-between border-t border-gray-100 dark:border-[#393a3b] text-xs text-gray-600 dark:text-gray-300">
              <button
                onClick={() => likeVideo(video.id)}
                className="flex items-center gap-2 hover:text-[#1877f2] font-semibold transition-colors"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{video.likesCount} লাইক</span>
              </button>

              <div className="flex items-center gap-2 font-semibold">
                <MessageCircle className="w-4 h-4" />
                <span>{video.commentsCount} মন্তব্য</span>
              </div>

              <div className="flex items-center gap-2 font-semibold hover:text-[#1877f2] cursor-pointer">
                <Share2 className="w-4 h-4" />
                <span>শেয়ার</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
