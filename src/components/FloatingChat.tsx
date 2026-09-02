import React, { useState, useRef, useEffect } from 'react';
import { X, Minus, Phone, Video, Send, Image as ImageIcon, CheckCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FloatingChat: React.FC = () => {
  const {
    floatingChatUser,
    setFloatingChatUser,
    conversations,
    sendMessage,
    currentUser,
    startCall,
  } = useApp();

  const [messageText, setMessageText] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!floatingChatUser) return null;

  const conv = conversations.find(c =>
    !c.isGroup && c.participants.some(p => p.id === floatingChatUser.id) && c.participants.some(p => p.id === currentUser.id)
  );

  useEffect(() => {
    if (!isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conv?.messages, isMinimized]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !conv) return;

    sendMessage(conv.id, messageText);
    setMessageText('');
  };

  return (
    <div className="fixed bottom-0 right-4 z-40 w-80 shadow-2xl rounded-t-2xl border border-gray-200 dark:border-[#393a3b] bg-white dark:bg-[#242526] overflow-hidden flex flex-col transition-all">
      {/* Header */}
      <div className="p-2.5 px-3 bg-white dark:bg-[#242526] border-b border-gray-200 dark:border-[#393a3b] flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <div className="relative">
            <img
              src={floatingChatUser.avatar}
              alt={floatingChatUser.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full ring-1 ring-white" />
          </div>
          <div>
            <p className="font-bold text-xs text-gray-900 dark:text-white truncate max-w-[130px]">
              {floatingChatUser.name}
            </p>
            <span className="text-[10px] text-emerald-500 font-medium leading-none block">Active Now</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[#1877f2]">
          <button
            onClick={() => startCall(floatingChatUser, 'audio')}
            className="p-1 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-full"
            title="অডিও কল"
          >
            <Phone className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => startCall(floatingChatUser, 'video')}
            className="p-1 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-full"
            title="ভিডিও কল"
          >
            <Video className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-full text-gray-500"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setFloatingChatUser(null)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-full text-gray-500"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Body & Input (when not minimized) */}
      {!isMinimized && (
        <>
          <div className="h-72 overflow-y-auto p-3 space-y-2 bg-[#f8f9fa] dark:bg-[#1a1b1c]">
            {conv?.messages.map(msg => {
              const isMe = msg.senderId === currentUser.id;

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-1.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {!isMe && (
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="w-6 h-6 rounded-full object-cover shrink-0"
                    />
                  )}
                  <div
                    className={`max-w-[78%] p-2 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? 'bg-[#1877f2] text-white rounded-br-xs'
                        : 'bg-white dark:bg-[#3a3b3c] text-gray-900 dark:text-white rounded-bl-xs border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-2 border-t border-gray-200 dark:border-[#393a3b] flex items-center gap-1.5 bg-white dark:bg-[#242526]">
            <input
              type="text"
              placeholder="মেসেজ পাঠান..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="flex-1 bg-[#f0f2f5] dark:bg-[#3a3b3c] text-xs text-gray-900 dark:text-white placeholder-gray-500 rounded-full px-3 py-1.5 border-none outline-hidden"
              autoFocus
            />
            <button
              type="submit"
              disabled={!messageText.trim()}
              className="p-1.5 text-[#1877f2] hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </>
      )}
    </div>
  );
};
