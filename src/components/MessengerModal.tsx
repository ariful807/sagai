import React, { useState, useRef, useEffect } from 'react';
import {
  X, Search, Phone, Video, Image as ImageIcon, Send, Mic,
  Smile, MoreVertical, Plus, Users, CheckCheck, Play, Pause
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Conversation, User } from '../types';

export const MessengerModal: React.FC = () => {
  const {
    isMessengerModalOpen,
    setIsMessengerModalOpen,
    conversations,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    createGroupConversation,
    currentUser,
    users,
    startCall,
  } = useApp();

  const [messageInput, setMessageInput] = useState('');
  const [mediaUrlInput, setMediaUrlInput] = useState('');
  const [showMediaInput, setShowMediaInput] = useState(false);
  const [searchConv, setSearchConv] = useState('');
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const activeConv = conversations.find(c => c.id === activeConversationId) || conversations[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages]);

  if (!isMessengerModalOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!messageInput.trim() && !mediaUrlInput) || !activeConv) return;

    sendMessage(
      activeConv.id,
      messageInput,
      mediaUrlInput || undefined,
      mediaUrlInput ? 'image' : undefined
    );
    setMessageInput('');
    setMediaUrlInput('');
    setShowMediaInput(false);
  };

  const handleSimulateVoiceNote = () => {
    if (!activeConv) return;
    setIsRecordingVoice(true);
    setTimeout(() => {
      setIsRecordingVoice(false);
      sendMessage(activeConv.id, '🎤 ভয়েস মেসেজ (০:১২)', undefined, 'audio', 12);
    }, 1500);
  };

  const handleCreateGroupChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim() || selectedUserIds.length === 0) return;
    createGroupConversation(newGroupName, selectedUserIds);
    setIsCreatingGroup(false);
    setNewGroupName('');
    setSelectedUserIds([]);
  };

  const filteredConversations = conversations.filter(c => {
    if (c.isGroup) {
      return c.groupName?.toLowerCase().includes(searchConv.toLowerCase());
    }
    const other = c.participants.find(p => p.id !== currentUser.id);
    return other?.name.toLowerCase().includes(searchConv.toLowerCase());
  });

  const getRecipient = (conv: Conversation): User | undefined => {
    return conv.participants.find(p => p.id !== currentUser.id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white dark:bg-[#242526] w-full max-w-4xl h-[85vh] max-h-[700px] rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 dark:border-[#393a3b] overflow-hidden flex flex-col md:flex-row">

        {/* Left Side: Conversations List */}
        <div className="w-full md:w-80 h-full border-r border-gray-200 dark:border-[#393a3b] flex flex-col bg-gray-50/50 dark:bg-[#1f2021]">
          {/* Header */}
          <div className="p-3 border-b border-gray-200 dark:border-[#393a3b] flex items-center justify-between">
            <h3 className="font-extrabold text-xl text-gray-900 dark:text-white">মেসেঞ্জার</h3>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsCreatingGroup(!isCreatingGroup)}
                className="p-2 hover:bg-gray-200 dark:hover:bg-[#3a3b3c] rounded-full text-[#1877f2]"
                title="নতুন গ্রুপ চ্যাট তৈরি করুন"
              >
                <Plus className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsMessengerModalOpen(false)}
                className="md:hidden p-2 hover:bg-gray-200 dark:hover:bg-[#3a3b3c] rounded-full text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="p-2.5">
            <div className="flex items-center bg-[#e4e6eb] dark:bg-[#3a3b3c] rounded-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200">
              <Search className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              <input
                type="text"
                placeholder="মেসেঞ্জারে খুঁজুন..."
                value={searchConv}
                onChange={(e) => setSearchConv(e.target.value)}
                className="bg-transparent border-none outline-hidden ml-2 w-full"
              />
            </div>
          </div>

          {/* Group Creator Panel */}
          {isCreatingGroup ? (
            <form onSubmit={handleCreateGroupChat} className="p-3 bg-blue-50/70 dark:bg-blue-950/30 border-b border-blue-200 dark:border-blue-800 space-y-2 overflow-y-auto max-h-48">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900 dark:text-blue-200">নতুন গ্রুপ চ্যাট:</span>
                <button type="button" onClick={() => setIsCreatingGroup(false)} className="text-xs text-gray-400">বাতিল</button>
              </div>
              <input
                type="text"
                placeholder="গ্রুপের নাম..."
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="w-full text-xs p-2 rounded-lg bg-white dark:bg-[#242526] border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                required
              />
              <div className="text-[11px] font-semibold text-gray-500">সদস্য নির্বাচন করুন:</div>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {users.filter(u => u.id !== currentUser.id).map(u => (
                  <label key={u.id} className="flex items-center gap-2 text-xs text-gray-800 dark:text-gray-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedUserIds.includes(u.id)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedUserIds([...selectedUserIds, u.id]);
                        else setSelectedUserIds(selectedUserIds.filter(id => id !== u.id));
                      }}
                      className="rounded-sm"
                    />
                    <img src={u.avatar} alt={u.name} className="w-5 h-5 rounded-full" />
                    <span>{u.name}</span>
                  </label>
                ))}
              </div>
              <button
                type="submit"
                disabled={!newGroupName.trim() || selectedUserIds.length === 0}
                className="w-full py-1.5 bg-[#1877f2] text-white font-bold rounded-lg text-xs disabled:opacity-50"
              >
                গ্রুপ শুরু করুন
              </button>
            </form>
          ) : null}

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredConversations.map(conv => {
              const other = getRecipient(conv);
              const isSelected = activeConv?.id === conv.id;

              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`flex items-center gap-3 p-2.5 rounded-2xl cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-100 dark:bg-blue-900/40'
                      : 'hover:bg-gray-200/70 dark:hover:bg-[#3a3b3c]'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={conv.isGroup ? (conv.groupAvatar || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&auto=format&fit=crop&q=80') : (other?.avatar || currentUser.avatar)}
                      alt="Avatar"
                      className="w-11 h-11 rounded-full object-cover"
                    />
                    {!conv.isGroup && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#242526] rounded-full" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white truncate">
                        {conv.isGroup ? conv.groupName : other?.name}
                      </p>
                      <span className="text-[10px] text-gray-400 shrink-0 ml-1">
                        {conv.lastMessageTime}
                      </span>
                    </div>
                    <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                      {conv.lastMessage || 'মেসেজ শুরু করুন'}
                    </p>
                  </div>

                  {conv.unreadCount > 0 && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1877f2] shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Chat Window */}
        {activeConv ? (
          <div className="flex-1 h-full flex flex-col bg-white dark:bg-[#242526]">
            {/* Chat Header */}
            <div className="p-3 px-4 border-b border-gray-200 dark:border-[#393a3b] flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={activeConv.isGroup ? (activeConv.groupAvatar || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&auto=format&fit=crop&q=80') : (getRecipient(activeConv)?.avatar || currentUser.avatar)}
                    alt="Chat recipient"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {!activeConv.isGroup && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-[#242526] rounded-full" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                    {activeConv.isGroup ? activeConv.groupName : getRecipient(activeConv)?.name}
                  </h4>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    {activeConv.isGroup ? `${activeConv.participants.length} জন সদস্য` : 'Active Now'}
                  </p>
                </div>
              </div>

              {/* Call buttons & Close modal */}
              <div className="flex items-center gap-1.5 sm:gap-2 text-[#1877f2]">
                {!activeConv.isGroup && getRecipient(activeConv) && (
                  <>
                    <button
                      onClick={() => startCall(getRecipient(activeConv)!, 'audio')}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-full transition-colors"
                      title="অডিও কল করুন"
                    >
                      <Phone className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => startCall(getRecipient(activeConv)!, 'video')}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-full transition-colors"
                      title="ভিডিও কল করুন"
                    >
                      <Video className="w-5 h-5" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => setIsMessengerModalOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-full text-gray-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8f9fa] dark:bg-[#1a1b1c]">
              {activeConv.messages.map(msg => {
                const isMe = msg.senderId === currentUser.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isMe && (
                      <img
                        src={msg.senderAvatar}
                        alt={msg.senderName}
                        className="w-7 h-7 rounded-full object-cover shrink-0 mb-0.5"
                      />
                    )}

                    <div className={`max-w-[75%] space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                      {msg.mediaUrl && (
                        <img
                          src={msg.mediaUrl}
                          alt="Attachment"
                          className="rounded-2xl max-w-full max-h-52 object-cover shadow-xs"
                        />
                      )}

                      {msg.mediaType === 'audio' ? (
                        <div className={`flex items-center gap-2 p-2.5 rounded-2xl ${
                          isMe ? 'bg-[#1877f2] text-white' : 'bg-white dark:bg-[#3a3b3c] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                        }`}>
                          <div className="p-1.5 bg-white/20 rounded-full">
                            <Play className="w-4 h-4 fill-current" />
                          </div>
                          <div className="h-2 w-24 bg-current/30 rounded-full overflow-hidden">
                            <div className="h-full bg-current w-1/3" />
                          </div>
                          <span className="text-[10px] font-mono">0:12</span>
                        </div>
                      ) : (
                        msg.text && (
                          <div
                            className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                              isMe
                                ? 'bg-[#1877f2] text-white rounded-br-xs shadow-xs'
                                : 'bg-white dark:bg-[#3a3b3c] text-gray-900 dark:text-white rounded-bl-xs border border-gray-200 dark:border-gray-700 shadow-xs'
                            }`}
                          >
                            {msg.text}
                          </div>
                        )
                      )}

                      <div className={`flex items-center gap-1 text-[10px] text-gray-400 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <span>{msg.createdAt}</span>
                        {isMe && <CheckCheck className="w-3 h-3 text-[#1877f2]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <div className="p-3 border-t border-gray-200 dark:border-[#393a3b] bg-white dark:bg-[#242526]">
              {/* Media URL Box if open */}
              {showMediaInput && (
                <div className="flex gap-2 mb-2 p-2 bg-gray-50 dark:bg-[#3a3b3c] rounded-xl">
                  <input
                    type="text"
                    placeholder="ছবির লিংক (URL) পেস্ট করুন..."
                    value={mediaUrlInput}
                    onChange={(e) => setMediaUrlInput(e.target.value)}
                    className="flex-1 text-xs bg-transparent border-none outline-hidden text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={() => setShowMediaInput(false)}
                    className="text-xs text-gray-400"
                  >
                    বন্ধ
                  </button>
                </div>
              )}

              <form onSubmit={handleSend} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowMediaInput(!showMediaInput)}
                  className="p-2 text-[#1877f2] hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-full transition-colors"
                  title="ছবি যুক্ত করুন"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={handleSimulateVoiceNote}
                  className={`p-2 rounded-full transition-colors ${
                    isRecordingVoice
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'text-[#1877f2] hover:bg-gray-100 dark:hover:bg-[#3a3b3c]'
                  }`}
                  title="ভয়েস মেসেজ রেকর্ড করুন"
                >
                  <Mic className="w-5 h-5" />
                </button>

                <input
                  type="text"
                  placeholder="মেসেজ লিখুন..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1 bg-[#f0f2f5] dark:bg-[#3a3b3c] text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-500 rounded-full px-4 py-2.5 border-none outline-hidden"
                />

                <button
                  type="submit"
                  disabled={!messageInput.trim() && !mediaUrlInput}
                  className={`p-2.5 rounded-full transition-all ${
                    messageInput.trim() || mediaUrlInput
                      ? 'bg-[#1877f2] text-white hover:bg-blue-600 cursor-pointer shadow-xs'
                      : 'text-gray-400'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            কথোপকথন নির্বাচন করুন
          </div>
        )}
      </div>
    </div>
  );
};
