import React, { useState } from 'react';
import { Store, Search, Tag, MapPin, Heart, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface MarketplaceItem {
  id: string;
  title: string;
  price: string;
  location: string;
  imageUrl: string;
  sellerName: string;
  category: string;
}

const ITEMS: MarketplaceItem[] = [
  {
    id: 'm1',
    title: 'Sony Alpha A7 III Camera (Barely used)',
    price: '৳ ১,২০,০০০',
    location: 'Dhanmondi, Dhaka',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80',
    sellerName: 'Nila Akter',
    category: 'Electronics'
  },
  {
    id: 'm2',
    title: 'MacBook Air M2 16GB / 512GB Midnight',
    price: '৳ ১,১৫,০০০',
    location: 'Gulshan, Dhaka',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    sellerName: 'Sagor Ahmed',
    category: 'Electronics'
  },
  {
    id: 'm3',
    title: 'Vintage Leather Travel Backpack',
    price: '৳ ৩,৫০০',
    location: 'Chittagong',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    sellerName: 'Rafiul Islam',
    category: 'Fashion'
  },
  {
    id: 'm4',
    title: 'Original Acrylic Canvas Painting (Sunset Glow)',
    price: '৳ ৮,০০০',
    location: 'Sylhet',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
    sellerName: 'Ayesha Siddiqua',
    category: 'Art'
  }
];

export const MarketplaceView: React.FC = () => {
  const { openChatWithUser, users } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filtered = ITEMS.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || item.location.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-4xl mx-auto py-4 px-2 sm:px-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <Store className="w-7 h-7 text-[#1877f2]" />
            <span>sagai মার্কেটপ্লেস</span>
          </h1>
          <p className="text-xs text-gray-500">আপনার এলাকায় পণ্য ক্রয় ও বিক্রয় করুন</p>
        </div>

        <div className="flex items-center bg-white dark:bg-[#242526] border border-gray-200 dark:border-[#393a3b] rounded-xl px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 shadow-xs max-w-xs">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="পণ্য বা জিনিস খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-hidden ml-2 w-full"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {['All', 'Electronics', 'Fashion', 'Art'].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors shrink-0 ${
              selectedCategory === cat
                ? 'bg-[#1877f2] text-white shadow-xs'
                : 'bg-white dark:bg-[#242526] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#393a3b]'
            }`}
          >
            {cat === 'All' ? 'সকল ক্যাটাগরি' : cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {filtered.map(item => {
          const seller = users.find(u => u.name === item.sellerName) || users[0];

          return (
            <div
              key={item.id}
              className="bg-white dark:bg-[#242526] rounded-2xl overflow-hidden shadow-xs border border-gray-200 dark:border-[#393a3b] flex flex-col justify-between group hover:shadow-md transition-all"
            >
              <div>
                <div className="h-40 relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-3">
                  <p className="font-extrabold text-sm text-[#1877f2] dark:text-[#2d88ff]">{item.price}</p>
                  <h3 className="font-bold text-xs text-gray-900 dark:text-white line-clamp-2 mt-1">{item.title}</h3>
                  <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-1">
                    <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 pt-0">
                <button
                  onClick={() => openChatWithUser(seller)}
                  className="w-full py-1.5 bg-blue-50 dark:bg-blue-900/30 text-[#1877f2] dark:text-[#2d88ff] hover:bg-blue-100 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>বিক্রেতাকে মেসেজ দিন</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
