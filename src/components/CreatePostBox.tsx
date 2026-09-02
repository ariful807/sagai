import React from 'react';
import { Video, Image, Smile, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CreatePostBox: React.FC = () => {
  const { currentUser, setIsCreatePostOpen } = useApp();

  return (
    <div className="bg-white dark:bg-[#242526] rounded-xl p-4 shadow-sm border border-gray-200 dark:border-[#393a3b] mb-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-full h-full object-cover"
          />
        </div>
        <button
          onClick={() => setIsCreatePostOpen(true)}
          className="bg-[#F0F2F5] dark:bg-[#3a3b3c] text-gray-500 dark:text-gray-400 rounded-full text-left px-4 py-2.5 flex-1 hover:bg-gray-200 dark:hover:bg-[#4e4f50] transition-colors text-sm font-medium cursor-pointer"
        >
          What is on your mind, {currentUser.name}?
        </button>
      </div>

      <hr className="border-gray-100 dark:border-[#393a3b] mb-3" />

      <div className="flex justify-around">
        <button
          onClick={() => setIsCreatePostOpen(true)}
          className="flex items-center gap-2 text-gray-500 dark:text-gray-300 font-semibold text-sm py-2 px-4 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg transition-colors cursor-pointer"
        >
          <span className="text-red-500">📹</span>
          <span>Live Video</span>
        </button>

        <button
          onClick={() => setIsCreatePostOpen(true)}
          className="flex items-center gap-2 text-gray-500 dark:text-gray-300 font-semibold text-sm py-2 px-4 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg transition-colors cursor-pointer"
        >
          <span className="text-emerald-500">🖼️</span>
          <span>Photo/Video</span>
        </button>

        <button
          onClick={() => setIsCreatePostOpen(true)}
          className="flex items-center gap-2 text-gray-500 dark:text-gray-300 font-semibold text-sm py-2 px-4 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg transition-colors cursor-pointer"
        >
          <span className="text-amber-500">😊</span>
          <span>Feeling</span>
        </button>
      </div>
    </div>
  );
};
