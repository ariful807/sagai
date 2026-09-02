import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Send, Heart, Flame, ThumbsUp, Laugh, Frown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';

export const StoryViewerModal: React.FC = () => {
  const { stories, activeStoryIndex, setActiveStoryIndex, openChatWithUser, users } = useApp();
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');

  const isOpen = activeStoryIndex !== null && !!stories[activeStoryIndex];
  const currentStory = isOpen ? stories[activeStoryIndex] : null;
  const storyUser = currentStory ? users.find(u => u.id === currentStory.userId) : null;

  useEffect(() => {
    setProgress(0);
  }, [activeStoryIndex]);

  useEffect(() => {
    if (!isOpen || isPaused || activeStoryIndex === null) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (activeStoryIndex < stories.length - 1) {
            setActiveStoryIndex(activeStoryIndex + 1);
            return 0;
          } else {
            setActiveStoryIndex(null);
            return 100;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeStoryIndex, stories.length, isPaused, setActiveStoryIndex, isOpen]);

  if (!isOpen || !currentStory) return null;

  const handleNext = () => {
    if (activeStoryIndex < stories.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
    } else {
      setActiveStoryIndex(null);
    }
  };

  const handlePrev = () => {
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
    }
  };

  const handleSendReaction = (emoji: string) => {
    try {
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.8 }
      });
    } catch {}

    if (storyUser) {
      openChatWithUser(storyUser);
      setActiveStoryIndex(null);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !storyUser) return;
    openChatWithUser(storyUser);
    setActiveStoryIndex(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-xs select-none">
      {/* Close button */}
      <button
        onClick={() => setActiveStoryIndex(null)}
        className="absolute top-4 right-4 z-50 p-2 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 rounded-full transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev Navigation Button */}
      {activeStoryIndex > 0 && (
        <button
          onClick={handlePrev}
          className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-50 p-3 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}

      {/* Next Navigation Button */}
      {activeStoryIndex < stories.length - 1 && (
        <button
          onClick={handleNext}
          className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-50 p-3 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors cursor-pointer"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}

      {/* Main Story Container */}
      <div
        className="relative w-full max-w-sm h-[85vh] max-h-[720px] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Progress Bars */}
        <div className="absolute top-3 left-3 right-3 z-30 flex gap-1.5">
          {stories.map((s, idx) => (
            <div key={s.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{
                  width: idx === activeStoryIndex ? `${progress}%` : idx < activeStoryIndex ? '100%' : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* Story Header */}
        <div className="absolute top-6 left-3 right-3 z-30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src={currentStory.userAvatar}
              alt={currentStory.userName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-white"
            />
            <div>
              <p className="text-white font-bold text-sm leading-tight drop-shadow-sm">
                {currentStory.userName}
              </p>
              <p className="text-white/80 text-xs">
                {currentStory.createdAt}
              </p>
            </div>
          </div>
        </div>

        {/* Story Content View */}
        <div className="w-full h-full flex items-center justify-center relative">
          {currentStory.mediaType === 'image' && currentStory.mediaUrl ? (
            <img
              src={currentStory.mediaUrl}
              alt="Story"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${currentStory.bgGradient || 'from-indigo-600 via-purple-600 to-pink-600'} p-8 flex items-center justify-center text-center`}>
              <p className="text-white text-xl md:text-2xl font-bold leading-relaxed">
                {currentStory.text}
              </p>
            </div>
          )}

          {/* Optional Caption for image story */}
          {currentStory.mediaType === 'image' && currentStory.text && (
            <div className="absolute bottom-20 left-4 right-4 bg-black/40 backdrop-blur-xs p-3 rounded-2xl text-center">
              <p className="text-white text-sm font-semibold">{currentStory.text}</p>
            </div>
          )}
        </div>

        {/* Quick Reactions & Reply Bar */}
        <div className="absolute bottom-4 left-3 right-3 z-30 space-y-2">
          {/* Reaction emojis row */}
          <div className="flex items-center justify-center gap-4 bg-black/30 backdrop-blur-sm py-1.5 px-3 rounded-full">
            <button onClick={() => handleSendReaction('❤️')} className="text-2xl hover:scale-125 transition-transform">❤️</button>
            <button onClick={() => handleSendReaction('👍')} className="text-2xl hover:scale-125 transition-transform">👍</button>
            <button onClick={() => handleSendReaction('🥰')} className="text-2xl hover:scale-125 transition-transform">🥰</button>
            <button onClick={() => handleSendReaction('😂')} className="text-2xl hover:scale-125 transition-transform">😂</button>
            <button onClick={() => handleSendReaction('😮')} className="text-2xl hover:scale-125 transition-transform">😮</button>
            <button onClick={() => handleSendReaction('🔥')} className="text-2xl hover:scale-125 transition-transform">🔥</button>
          </div>

          {/* Text reply input */}
          <form onSubmit={handleSendReply} className="flex items-center gap-2">
            <input
              type="text"
              placeholder={`${currentStory.userName}-কে মেসেজ পাঠান...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 bg-white/20 backdrop-blur-md text-white placeholder-white/70 border border-white/30 rounded-full px-4 py-2 text-xs sm:text-sm outline-hidden focus:border-white focus:bg-white/30"
            />
            <button
              type="submit"
              className="p-2.5 bg-[#1877f2] text-white rounded-full hover:bg-blue-600 transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
