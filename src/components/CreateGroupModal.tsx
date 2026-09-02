import React, { useState } from 'react';
import { X, UsersRound, Globe, Lock, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CreateGroupModal: React.FC = () => {
  const { isCreateGroupOpen, setIsCreateGroupOpen, createGroup, setSelectedGroupId, setCurrentTab } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('সাধারণ (General)');
  const [privacy, setPrivacy] = useState<'public' | 'private'>('public');
  const [coverUrl, setCoverUrl] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [rules, setRules] = useState('১. শালীনতা বজায় রাখুন\n২. কোনো স্প্যাম বা অবাঞ্ছিত বিজ্ঞাপন নিষিদ্ধ');

  if (!isCreateGroupOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const rulesArray = rules.split('\n').map(r => r.trim()).filter(Boolean);

    const newGroup = createGroup({
      name,
      description,
      category,
      privacy,
      coverUrl: coverUrl || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
      avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&auto=format&fit=crop&q=80',
      rules: rulesArray
    });

    setIsCreateGroupOpen(false);
    setSelectedGroupId(newGroup.id);
    setCurrentTab('groups');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-[#242526] w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 dark:border-[#393a3b] overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="relative px-4 py-3 border-b border-gray-200 dark:border-[#393a3b] text-center">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">নতুন গ্রুপ তৈরি করুন</h3>
          <button
            onClick={() => setIsCreateGroupOpen(false)}
            className="absolute right-3 top-3 p-1.5 rounded-full bg-gray-100 dark:bg-[#3a3b3c] hover:bg-gray-200 dark:hover:bg-[#4e4f50] text-gray-600 dark:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto flex-1 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              গ্রুপের নাম *
            </label>
            <input
              type="text"
              placeholder="যেমন: Bangladesh Developers Hub"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs sm:text-sm p-2.5 rounded-xl bg-[#f0f2f5] dark:bg-[#3a3b3c] border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white outline-hidden focus:border-[#1877f2]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              গ্রুপের বর্ণনা (Description)
            </label>
            <textarea
              placeholder="এই গ্রুপটি কী বিষয় নিয়ে তৈরি..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full text-xs sm:text-sm p-2.5 rounded-xl bg-[#f0f2f5] dark:bg-[#3a3b3c] border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white outline-hidden focus:border-[#1877f2]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                ক্যাটাগরি
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl bg-[#f0f2f5] dark:bg-[#3a3b3c] border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white outline-hidden"
              >
                <option value="Science & Tech">বিজ্ঞান ও প্রযুক্তি</option>
                <option value="Travel & Tourism">ভ্রমণ ও পর্যটন</option>
                <option value="Design & Art">ডিজাইন ও শিল্প</option>
                <option value="Books & Literature">বই ও সাহিত্য</option>
                <option value="Entertainment">বিনোদন</option>
                <option value="General">সাধারণ</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                প্রাইভেসি
              </label>
              <select
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value as any)}
                className="w-full text-xs p-2.5 rounded-xl bg-[#f0f2f5] dark:bg-[#3a3b3c] border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white outline-hidden"
              >
                <option value="public">পাবলিক (সবাই দেখতে পাবে)</option>
                <option value="private">প্রাইভেট (শুধু সদস্যরা দেখতে পাবে)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              কভার ফটোর লিংক (URL)
            </label>
            <input
              type="text"
              placeholder="https://..."
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl bg-[#f0f2f5] dark:bg-[#3a3b3c] border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              গ্রুপের নিয়মাবলী (প্রতি লাইনে একটি করে)
            </label>
            <textarea
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              rows={2}
              className="w-full text-xs p-2.5 rounded-xl bg-[#f0f2f5] dark:bg-[#3a3b3c] border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white outline-hidden"
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-2.5 bg-[#1877f2] hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            গ্রুপ তৈরি করুন
          </button>
        </form>
      </div>
    </div>
  );
};
