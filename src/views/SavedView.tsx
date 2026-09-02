import React from 'react';
import { Bookmark, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PostCard } from '../components/PostCard';

export const SavedView: React.FC = () => {
  const { posts } = useApp();

  const savedPosts = posts.filter(p => p.isSaved);

  return (
    <div className="w-full max-w-xl mx-auto py-4 px-2 sm:px-0 space-y-4">
      <div className="flex items-center gap-2 mb-2 px-1">
        <Bookmark className="w-6 h-6 text-purple-500 fill-purple-500" />
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
          সংরক্ষিত পোস্টসমূহ (Saved Posts)
        </h1>
      </div>

      <div className="space-y-4">
        {savedPosts.length === 0 ? (
          <div className="bg-white dark:bg-[#242526] rounded-2xl p-8 text-center border border-gray-200 dark:border-[#393a3b] shadow-xs">
            <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="font-bold text-gray-700 dark:text-gray-300 text-sm">
              কোনো সেভ করা পোস্ট পাওয়া যায়নি!
            </p>
            <p className="text-xs text-gray-400 mt-1">
              যেকোনো পোস্টের ডান পাশের তিন ডট মেনু থেকে 'পোস্টটি সেভ করুন' চাপলে এখানে সংরক্ষিত হবে।
            </p>
          </div>
        ) : (
          savedPosts.map(post => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
};
