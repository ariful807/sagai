import React from 'react';
import { Plus, ChevronRight, ChevronLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const StoriesBar: React.FC = () => {
  const { stories, currentUser, setIsCreateStoryOpen, setActiveStoryIndex } = useApp();

  return (
    <div className="relative mb-4 w-full">
      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
        {/* Create Story Tile */}
        <div
          onClick={() => setIsCreateStoryOpen(true)}
          className="w-28 h-48 bg-white dark:bg-[#242526] rounded-xl flex flex-col justify-between overflow-hidden shadow-sm relative group cursor-pointer border border-gray-200 dark:border-[#393a3b] shrink-0 transition-transform hover:-translate-y-0.5"
        >
          <div className="h-32 bg-gray-200 dark:bg-gray-700 overflow-hidden relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="absolute top-28 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#1877f2] text-white rounded-full flex items-center justify-center border-4 border-white dark:border-[#242526] font-bold z-10 shadow-sm">
            <Plus className="w-4 h-4" />
          </div>
          <div className="p-2 text-center text-xs font-semibold text-gray-800 dark:text-white mt-2">
            Create Story
          </div>
        </div>

        {/* Stories List */}
        {stories.map((story, index) => (
          <div
            key={story.id}
            onClick={() => setActiveStoryIndex(index)}
            className="w-28 h-48 rounded-xl relative overflow-hidden shrink-0 shadow-sm cursor-pointer border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all group"
          >
            {story.mediaType === 'image' && story.mediaUrl ? (
              <img
                src={story.mediaUrl}
                alt={story.userName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${story.bgGradient || 'from-blue-600 to-indigo-800'} p-3 flex items-center justify-center text-center`}>
                <p className="text-white text-xs font-bold line-clamp-4">
                  {story.text}
                </p>
              </div>
            )}

            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

            {/* Author Avatar Pill with blue ring */}
            <div className="w-9 h-9 rounded-full border-4 border-[#1877f2] overflow-hidden absolute top-2 left-2 z-10 bg-white">
              <img
                src={story.userAvatar}
                alt={story.userName}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Author Name */}
            <div className="absolute bottom-2 left-2 right-2 z-10">
              <p className="text-white font-semibold text-xs leading-tight drop-shadow-sm truncate">
                {story.userName}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
