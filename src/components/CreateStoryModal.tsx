import React, { useState } from 'react';
import { X, Image as ImageIcon, Type, Sparkles, Upload } from 'lucide-react';
import { useApp } from '../context/AppContext';

const STORY_GRADIENTS = [
  'from-blue-600 to-indigo-800',
  'from-rose-500 via-pink-600 to-purple-700',
  'from-emerald-500 via-teal-600 to-cyan-700',
  'from-amber-500 via-orange-600 to-red-600',
  'from-slate-900 via-purple-950 to-black',
];

export const CreateStoryModal: React.FC = () => {
  const { isCreateStoryOpen, setIsCreateStoryOpen, createStory } = useApp();

  const [storyType, setStoryType] = useState<'text' | 'image'>('text');
  const [text, setText] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [selectedGradient, setSelectedGradient] = useState(STORY_GRADIENTS[0]);

  if (!isCreateStoryOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (storyType === 'text' && !text.trim()) return;
    if (storyType === 'image' && !mediaUrl) return;

    createStory({
      mediaType: storyType,
      text: text || undefined,
      mediaUrl: mediaUrl || undefined,
      bgGradient: storyType === 'text' ? selectedGradient : undefined,
    });

    setText('');
    setMediaUrl('');
    setIsCreateStoryOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaUrl(reader.result as string);
        setStoryType('image');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-[#242526] w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 dark:border-[#393a3b] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative px-4 py-3 border-b border-gray-200 dark:border-[#393a3b] text-center">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">স্টোরি তৈরি করুন</h3>
          <button
            onClick={() => setIsCreateStoryOpen(false)}
            className="absolute right-3 top-3 p-1.5 rounded-full bg-gray-100 dark:bg-[#3a3b3c] hover:bg-gray-200 dark:hover:bg-[#4e4f50] text-gray-600 dark:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex p-2 bg-gray-100 dark:bg-[#1a1b1c] gap-2">
          <button
            type="button"
            onClick={() => setStoryType('text')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
              storyType === 'text'
                ? 'bg-white dark:bg-[#242526] text-[#1877f2] shadow-xs'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>টেক্সট স্টোরি</span>
          </button>

          <button
            type="button"
            onClick={() => setStoryType('image')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
              storyType === 'image'
                ? 'bg-white dark:bg-[#242526] text-[#1877f2] shadow-xs'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>ফটো স্টোরি</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Preview Box */}
          <div className="h-64 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center relative">
            {storyType === 'text' ? (
              <div className={`w-full h-full bg-gradient-to-br ${selectedGradient} p-6 flex items-center justify-center text-center`}>
                <textarea
                  placeholder="আপনার স্টোরির বার্তা লিখুন..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full bg-transparent text-white font-bold text-lg text-center placeholder-white/70 border-none outline-hidden resize-none"
                  rows={4}
                  autoFocus
                />
              </div>
            ) : (
              <div className="w-full h-full bg-gray-900 flex items-center justify-center relative">
                {mediaUrl ? (
                  <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <ImageIcon className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                    <p className="text-xs text-gray-400">ছবি নির্বাচন করুন অথবা লিংক দিন</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Gradients selector for text story */}
          {storyType === 'text' && (
            <div className="flex items-center gap-2 justify-center">
              {STORY_GRADIENTS.map((g, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedGradient(g)}
                  className={`w-8 h-8 rounded-full bg-gradient-to-br ${g} transition-transform ${
                    selectedGradient === g ? 'scale-125 ring-2 ring-[#1877f2]' : 'hover:scale-110'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Image source for photo story */}
          {storyType === 'image' && (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="ছবির লিংক (URL) লিখুন..."
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl bg-[#f0f2f5] dark:bg-[#3a3b3c] border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white outline-hidden"
              />
              <div className="text-center text-xs text-gray-400">অথবা</div>
              <label className="flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 dark:bg-[#3a3b3c] hover:bg-gray-200 rounded-xl cursor-pointer text-xs font-bold text-gray-700 dark:text-gray-200">
                <Upload className="w-4 h-4" />
                <span>কম্পিউটার/মোবাইল থেকে আপলোড</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={(storyType === 'text' && !text.trim()) || (storyType === 'image' && !mediaUrl)}
            className="w-full py-2.5 bg-[#1877f2] hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            স্টোরি শেয়ার করুন
          </button>
        </form>
      </div>
    </div>
  );
};
