import React from 'react';
import { StoriesBar } from '../components/StoriesBar';
import { CreatePostBox } from '../components/CreatePostBox';
import { PostCard } from '../components/PostCard';
import { useApp } from '../context/AppContext';
import { Sparkles } from 'lucide-react';

export const FeedView: React.FC = () => {
  const { posts } = useApp();

  return (
    <div className="w-full max-w-xl mx-auto py-3 px-2 sm:px-0">
      {/* Stories bar */}
      <StoriesBar />

      {/* Create post box */}
      <CreatePostBox />

      {/* Posts stream */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="bg-white dark:bg-[#242526] rounded-2xl p-8 text-center border border-gray-200 dark:border-[#393a3b] shadow-xs">
            <p className="text-gray-500 dark:text-gray-400 font-semibold mb-2">
              এখনো কোনো পোস্ট নেই!
            </p>
            <p className="text-xs text-gray-400">
              প্রথম পোস্ট করে sagai প্ল্যাটফর্মে কথোপকথন শুরু করুন।
            </p>
          </div>
        ) : (
          posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
};
