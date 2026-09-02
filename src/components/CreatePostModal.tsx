import React, { useState, useRef } from 'react';
import {
  X, Image as ImageIcon, Smile, MapPin, Globe, Users, Lock,
  Sparkles, Palette, Tag, Video, Upload, ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const BACKGROUND_GRADIENTS = [
  { id: 'none', label: 'স্বাভাবিক', class: '' },
  { id: 'bg1', label: 'Sunset', class: 'from-orange-500 via-rose-500 to-pink-600' },
  { id: 'bg2', label: 'Ocean', class: 'from-blue-600 via-cyan-500 to-teal-400' },
  { id: 'bg3', label: 'Purple Gem', class: 'from-purple-600 via-indigo-600 to-blue-700' },
  { id: 'bg4', label: 'Neon Green', class: 'from-emerald-500 via-teal-600 to-green-700' },
  { id: 'bg5', label: 'Fire', class: 'from-red-600 via-orange-600 to-amber-500' },
  { id: 'bg6', label: 'Dark Galaxy', class: 'from-slate-900 via-purple-950 to-slate-900' },
];

const FEELINGS = [
  { label: 'excited', name: 'উত্তেজিত 🤩', emoji: '🤩' },
  { label: 'happy', name: 'খুশি 😊', emoji: '😊' },
  { label: 'blessed', name: 'কৃতজ্ঞ 😇', emoji: '😇' },
  { label: 'loved', name: 'ভালোবাসাময় 🥰', emoji: '🥰' },
  { label: 'traveling', name: 'ভ্রমণরত ✈️', emoji: '✈️' },
  { label: 'thinking', name: 'ভাবছি 🤔', emoji: '🤔' },
  { label: 'celebrating', name: 'উদযাপন করছি 🎉', emoji: '🎉' },
];

export const CreatePostModal: React.FC = () => {
  const {
    isCreatePostOpen,
    setIsCreatePostOpen,
    currentUser,
    createPost,
    selectedGroupId,
    groups,
  } = useApp();

  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [selectedBg, setSelectedBg] = useState('');
  const [privacy, setPrivacy] = useState<'public' | 'friends' | 'only_me'>('public');
  const [feeling, setFeeling] = useState('');
  const [location, setLocation] = useState('');
  const [showBgPicker, setShowBgPicker] = useState(false);
  const [showFeelings, setShowFeelings] = useState(false);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [showMediaInput, setShowMediaInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isCreatePostOpen) return null;

  const currentGroup = selectedGroupId ? groups.find(g => g.id === selectedGroupId) : null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaUrl(reader.result as string);
        setSelectedBg('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !mediaUrl) return;

    setIsSubmitting(true);
    setTimeout(() => {
      createPost({
        content,
        mediaUrl: mediaUrl || undefined,
        mediaType: 'image',
        bgGradient: selectedBg || undefined,
        privacy,
        feeling: feeling || undefined,
        location: location || undefined,
        groupId: currentGroup?.id,
        groupName: currentGroup?.name,
      });

      // Reset
      setContent('');
      setMediaUrl('');
      setSelectedBg('');
      setFeeling('');
      setLocation('');
      setIsSubmitting(false);
      setIsCreatePostOpen(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-[#242526] w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 dark:border-[#393a3b] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="relative px-4 py-3 border-b border-gray-200 dark:border-[#393a3b] text-center">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">
            {currentGroup ? `${currentGroup.name}-এ পোস্ট করুন` : 'পোস্ট তৈরি করুন'}
          </h3>
          <button
            onClick={() => setIsCreatePostOpen(false)}
            className="absolute right-3 top-3 p-1.5 rounded-full bg-gray-100 dark:bg-[#3a3b3c] hover:bg-gray-200 dark:hover:bg-[#4e4f50] text-gray-600 dark:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto flex-1 space-y-4">
          {/* User Info & Privacy selector */}
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-11 h-11 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-gray-900 dark:text-white">
                  {currentUser.name}
                </span>
                {feeling && (
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    is feeling {FEELINGS.find(f => f.label === feeling)?.name}
                  </span>
                )}
                {location && (
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    in <span className="font-semibold text-gray-800 dark:text-gray-200">{location}</span>
                  </span>
                )}
              </div>

              {/* Privacy pill selector */}
              <div className="flex items-center gap-1 bg-[#e4e6eb] dark:bg-[#3a3b3c] rounded-md px-2 py-0.5 mt-0.5 w-fit">
                {privacy === 'public' && <Globe className="w-3 h-3 text-gray-600 dark:text-gray-300" />}
                {privacy === 'friends' && <Users className="w-3 h-3 text-gray-600 dark:text-gray-300" />}
                {privacy === 'only_me' && <Lock className="w-3 h-3 text-gray-600 dark:text-gray-300" />}
                <select
                  value={privacy}
                  onChange={(e) => setPrivacy(e.target.value as any)}
                  className="bg-transparent text-[11px] font-semibold text-gray-700 dark:text-gray-200 border-none outline-hidden cursor-pointer"
                >
                  <option value="public" className="dark:bg-[#242526]">পাবলিক (Public)</option>
                  <option value="friends" className="dark:bg-[#242526]">বন্ধুরা (Friends)</option>
                  <option value="only_me" className="dark:bg-[#242526]">শুধুমাত্র আমি (Only Me)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Textarea or Color Gradient Background View */}
          <div className="min-h-[140px] relative">
            {selectedBg ? (
              <div className={`w-full min-h-[160px] bg-gradient-to-r ${selectedBg} rounded-2xl p-6 flex items-center justify-center shadow-inner`}>
                <textarea
                  placeholder="আপনার মনে কী আছে লিখুন..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-transparent text-white font-bold text-lg sm:text-xl text-center placeholder-white/80 border-none outline-hidden resize-none"
                  rows={4}
                  autoFocus
                />
              </div>
            ) : (
              <textarea
                placeholder={`${currentUser.name}, আপনার মনে কী আছে?`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base border-none outline-hidden resize-none min-h-[120px]"
                rows={4}
                autoFocus
              />
            )}
          </div>

          {/* Media Preview if attached */}
          {mediaUrl && (
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-[#393a3b] bg-black/5">
              <img src={mediaUrl} alt="Attached preview" className="w-full max-h-64 object-cover" />
              <button
                type="button"
                onClick={() => setMediaUrl('')}
                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Color Gradient Palette Selector */}
          {showBgPicker && !mediaUrl && (
            <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-[#3a3b3c] rounded-xl overflow-x-auto">
              {BACKGROUND_GRADIENTS.map(bg => (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => setSelectedBg(bg.class)}
                  className={`w-7 h-7 rounded-lg shrink-0 transition-transform ${
                    bg.id === 'none'
                      ? 'bg-white border border-gray-400'
                      : `bg-gradient-to-r ${bg.class}`
                  } ${selectedBg === bg.class ? 'scale-110 ring-2 ring-[#1877f2]' : 'hover:scale-105'}`}
                  title={bg.label}
                />
              ))}
            </div>
          )}

          {/* Feelings Selector Popup */}
          {showFeelings && (
            <div className="p-2.5 bg-gray-50 dark:bg-[#3a3b3c] rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-600 dark:text-gray-300">অনুভূতি বেছে নিন:</span>
                <button
                  type="button"
                  onClick={() => setShowFeelings(false)}
                  className="text-xs text-gray-500 hover:text-gray-800"
                >
                  বন্ধ
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {FEELINGS.map(f => (
                  <button
                    key={f.label}
                    type="button"
                    onClick={() => {
                      setFeeling(feeling === f.label ? '' : f.label);
                      setShowFeelings(false);
                    }}
                    className={`flex items-center gap-1.5 p-1.5 rounded-lg text-xs font-medium transition-colors text-left ${
                      feeling === f.label
                        ? 'bg-blue-100 dark:bg-blue-900/50 text-[#1877f2]'
                        : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    <span>{f.emoji}</span>
                    <span className="truncate">{f.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Location Input */}
          {showLocationInput && (
            <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-[#3a3b3c] rounded-xl border border-gray-200 dark:border-gray-700">
              <MapPin className="w-4 h-4 text-red-500 shrink-0" />
              <input
                type="text"
                placeholder="লোকেশন বা জায়গার নাম লিখুন (যেমন: ঢাকা, সাজেক ভ্যালি...)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm border-none outline-hidden text-gray-900 dark:text-white"
              />
              {location && (
                <button type="button" onClick={() => setLocation('')} className="text-gray-400">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Image URL input if selected */}
          {showMediaInput && (
            <div className="p-2.5 bg-gray-50 dark:bg-[#3a3b3c] rounded-xl border border-gray-200 dark:border-gray-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-600 dark:text-gray-300">ছবি/ভিডিও যুক্ত করুন:</span>
                <button type="button" onClick={() => setShowMediaInput(false)} className="text-xs text-gray-400">
                  বন্ধ
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="ছবির সরাসরি লিংক (URL) পেস্ট করুন..."
                  value={mediaUrl}
                  onChange={(e) => {
                    setMediaUrl(e.target.value);
                    if (e.target.value) setSelectedBg('');
                  }}
                  className="flex-1 bg-white dark:bg-[#242526] border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1 bg-gray-200 dark:bg-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>ডিভাইস থেকে</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* Add to your post toolbar */}
          <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-[#393a3b] rounded-xl shadow-xs">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
              পোস্টে যোগ করুন
            </span>
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowMediaInput(!showMediaInput);
                  setShowBgPicker(false);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-full text-emerald-500 transition-colors"
                title="ছবি বা ভিডিও যোগ করুন"
              >
                <ImageIcon className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowBgPicker(!showBgPicker);
                  setShowMediaInput(false);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-full text-purple-500 transition-colors"
                title="কালার ব্যাকগ্রাউন্ড"
              >
                <Palette className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setShowFeelings(!showFeelings)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-full text-amber-500 transition-colors"
                title="অনুভূতি"
              >
                <Smile className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setShowLocationInput(!showLocationInput)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-full text-red-500 transition-colors"
                title="লোকেশন"
              >
                <MapPin className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Post Action Button */}
          <button
            type="submit"
            disabled={(!content.trim() && !mediaUrl) || isSubmitting}
            className={`w-full py-2.5 rounded-xl font-bold text-sm text-white transition-all shadow-sm flex items-center justify-center gap-2 ${
              (!content.trim() && !mediaUrl) || isSubmitting
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-[#1877f2] hover:bg-blue-600 cursor-pointer hover:shadow-md'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>পোস্ট হচ্ছে...</span>
              </>
            ) : (
              <span>পোস্ট করুন</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
