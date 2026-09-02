import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User, Post, Story, Group, Conversation, Message, NotificationItem,
  FriendRequest, VideoPost, AppSettings, ReactionType, Comment
} from '../types';
import {
  INITIAL_USERS, INITIAL_POSTS, INITIAL_STORIES, INITIAL_GROUPS,
  INITIAL_CONVERSATIONS, INITIAL_NOTIFICATIONS, INITIAL_WATCH_VIDEOS
} from '../data/mockData';
import { GoogleSheetsService } from '../services/googleSheetsService';
import confetti from 'canvas-confetti';

let globalIdCounter = 0;
const generateUniqueId = (prefix: string) => {
  globalIdCounter = (globalIdCounter + 1) % 1000000;
  return `${prefix}_${Date.now()}_${globalIdCounter}_${Math.random().toString(36).substring(2, 9)}`;
};

const deduplicateById = <T extends { id: string }>(items: T[]): T[] => {
  const seen = new Set<string>();
  return items.filter(item => {
    if (!item || !item.id || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
};

interface AppContextType {
  // Navigation & View
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  selectedGroupId: string | null;
  setSelectedGroupId: (id: string | null) => void;
  selectedUserId: string | null;
  setSelectedUserId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;

  // Current User & Users
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  updateUserProfile: (updated: Partial<User>) => void;
  switchUser: (userId: string) => void;
  deleteUser: (userId: string) => void;
  toggleBanUser: (userId: string) => void;
  updateUserRole: (userId: string, role: 'admin' | 'moderator' | 'user') => void;
  toggleVerifyUser: (userId: string) => void;

  // Posts
  posts: Post[];
  createPost: (postData: {
    content: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video';
    bgGradient?: string;
    privacy: 'public' | 'friends' | 'only_me';
    feeling?: string;
    location?: string;
    groupId?: string;
    groupName?: string;
  }) => void;
  deletePost: (postId: string) => void;
  togglePinPost: (postId: string) => void;
  toggleSavePost: (postId: string) => void;
  reactToPost: (postId: string, reaction: ReactionType) => void;
  addComment: (postId: string, content: string, mediaUrl?: string, replyToCommentId?: string) => void;
  reactToComment: (postId: string, commentId: string, reaction: ReactionType) => void;
  sharePost: (postId: string, shareType: 'feed' | 'group' | 'message', targetId?: string) => void;

  // Stories
  stories: Story[];
  createStory: (storyData: {
    mediaUrl?: string;
    mediaType: 'image' | 'text';
    text?: string;
    bgGradient?: string;
  }) => void;
  activeStoryIndex: number | null;
  setActiveStoryIndex: (idx: number | null) => void;

  // Groups
  groups: Group[];
  createGroup: (groupData: {
    name: string;
    description: string;
    coverUrl: string;
    avatarUrl: string;
    privacy: 'public' | 'private';
    category: string;
    rules: string[];
  }) => Group;
  toggleJoinGroup: (groupId: string) => void;

  // Messenger & Chat
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  openChatWithUser: (user: User) => void;
  sendMessage: (conversationId: string, text: string, mediaUrl?: string, mediaType?: 'image' | 'audio', audioDuration?: number) => void;
  createGroupConversation: (name: string, participantIds: string[]) => void;
  floatingChatUser: User | null;
  setFloatingChatUser: (user: User | null) => void;

  // Calling
  activeCall: {
    isOpen: boolean;
    user: User | null;
    type: 'audio' | 'video';
    status: 'calling' | 'connected' | 'ended';
  } | null;
  startCall: (user: User, type: 'audio' | 'video') => void;
  endCall: () => void;

  // Notifications & Friends
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  friendRequests: FriendRequest[];
  sendFriendRequest: (toUserId: string) => void;
  acceptFriendRequest: (requestId: string) => void;
  declineFriendRequest: (requestId: string) => void;
  removeFriend: (targetUserId: string) => void;

  // Videos / Watch
  watchVideos: VideoPost[];
  toggleFollowVideoAuthor: (videoId: string) => void;
  likeVideo: (videoId: string) => void;

  // Admin & Google Sheets
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (val: boolean) => void;
  syncWithGoogleSheets: () => Promise<{ success: boolean; message: string }>;

  // Modals & Popups
  isCreatePostOpen: boolean;
  setIsCreatePostOpen: (val: boolean) => void;
  isCreateStoryOpen: boolean;
  setIsCreateStoryOpen: (val: boolean) => void;
  isCreateGroupOpen: boolean;
  setIsCreateGroupOpen: (val: boolean) => void;
  isMessengerModalOpen: boolean;
  setIsMessengerModalOpen: (val: boolean) => void;
  isSwitchUserOpen: boolean;
  setIsSwitchUserOpen: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentTab, setCurrentTab] = useState<string>('feed');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('sagai_dark_mode') === 'true';
  });

  // Settings
  const [settings, setSettings] = useState<AppSettings>(() => GoogleSheetsService.getSavedSettings());

  // Users
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('sagai_users');
      return saved ? deduplicateById(JSON.parse(saved)) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('sagai_current_user_id');
    const found = users.find(u => u.id === saved);
    return found || users[0];
  });

  // Posts
  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const saved = localStorage.getItem('sagai_posts');
      return saved ? deduplicateById(JSON.parse(saved)) : INITIAL_POSTS;
    } catch {
      return INITIAL_POSTS;
    }
  });

  // Stories
  const [stories, setStories] = useState<Story[]>(() => {
    try {
      const saved = localStorage.getItem('sagai_stories');
      return saved ? deduplicateById(JSON.parse(saved)) : INITIAL_STORIES;
    } catch {
      return INITIAL_STORIES;
    }
  });
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

  // Groups
  const [groups, setGroups] = useState<Group[]>(() => {
    try {
      const saved = localStorage.getItem('sagai_groups');
      return saved ? deduplicateById(JSON.parse(saved)) : INITIAL_GROUPS;
    } catch {
      return INITIAL_GROUPS;
    }
  });

  // Conversations
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem('sagai_conversations');
      return saved ? deduplicateById(JSON.parse(saved)) : INITIAL_CONVERSATIONS;
    } catch {
      return INITIAL_CONVERSATIONS;
    }
  });
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [floatingChatUser, setFloatingChatUser] = useState<User | null>(null);

  // Calling
  const [activeCall, setActiveCall] = useState<{
    isOpen: boolean;
    user: User | null;
    type: 'audio' | 'video';
    status: 'calling' | 'connected' | 'ended';
  } | null>(null);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('sagai_notifications');
      return saved ? deduplicateById(JSON.parse(saved)) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  // Friend Requests
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([
    {
      id: 'freq_1',
      fromUser: users[3] || INITIAL_USERS[3],
      toUserId: currentUser.id,
      status: 'pending',
      createdAt: '১ ঘন্টা আগে'
    },
    {
      id: 'freq_2',
      fromUser: users[4] || INITIAL_USERS[4],
      toUserId: currentUser.id,
      status: 'pending',
      createdAt: '৩ ঘন্টা আগে'
    }
  ]);

  // Watch Videos
  const [watchVideos, setWatchVideos] = useState<VideoPost[]>(INITIAL_WATCH_VIDEOS);

  // Modals
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState<boolean>(false);
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState<boolean>(false);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState<boolean>(false);
  const [isMessengerModalOpen, setIsMessengerModalOpen] = useState<boolean>(false);
  const [isSwitchUserOpen, setIsSwitchUserOpen] = useState<boolean>(false);

  // Persistence to localStorage
  useEffect(() => {
    localStorage.setItem('sagai_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('sagai_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('sagai_stories', JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    localStorage.setItem('sagai_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('sagai_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('sagai_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('sagai_current_user_id', currentUser.id);
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('sagai_dark_mode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Update Settings
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      GoogleSheetsService.saveSettings(updated);
      return updated;
    });
  };

  // Sync With Google Sheets
  const syncWithGoogleSheets = async () => {
    if (!settings.appsScriptUrl) {
      return { success: false, message: 'Google Apps Script URL কনফিগার করা হয়নি।' };
    }
    updateSettings({ syncStatus: 'syncing' });
    try {
      const payload = {
        action: 'syncAll',
        data: {
          users,
          posts,
          groups,
          stories,
          settings
        }
      };
      await GoogleSheetsService.sendDataToSheet(settings.appsScriptUrl, payload);
      updateSettings({
        syncStatus: 'connected',
        lastSyncTime: new Date().toLocaleTimeString('bn-BD')
      });
      return { success: true, message: 'Google Sheets এর সাথে ডাটা সফলভাবে সিংক্রোনাইজ হয়েছে!' };
    } catch (e: any) {
      updateSettings({ syncStatus: 'error' });
      return { success: false, message: 'সিংক্রোনাইজেশন ব্যর্থ হয়েছে: ' + (e.message || 'Error') };
    }
  };

  // User Actions
  const updateUserProfile = (updated: Partial<User>) => {
    const newCurrentUser = { ...currentUser, ...updated };
    setCurrentUser(newCurrentUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? newCurrentUser : u));

    // push to sheets
    if (settings.appsScriptUrl) {
      GoogleSheetsService.sendDataToSheet(settings.appsScriptUrl, {
        action: 'saveUser',
        user: newCurrentUser
      });
    }
  };

  const switchUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      setIsSwitchUserOpen(false);
    }
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    setPosts(prev => prev.filter(p => p.authorId !== userId));
  };

  const toggleBanUser = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, isBanned: !u.isBanned };
      }
      return u;
    }));
  };

  const updateUserRole = (userId: string, role: 'admin' | 'moderator' | 'user') => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
  };

  const toggleVerifyUser = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isVerified: !u.isVerified } : u));
  };

  // Posts Actions
  const createPost = (postData: {
    content: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video';
    bgGradient?: string;
    privacy: 'public' | 'friends' | 'only_me';
    feeling?: string;
    location?: string;
    groupId?: string;
    groupName?: string;
  }) => {
    const newPost: Post = {
      id: generateUniqueId('post'),
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorVerified: currentUser.isVerified,
      content: postData.content,
      mediaUrl: postData.mediaUrl,
      mediaType: postData.mediaType || 'image',
      bgGradient: postData.bgGradient,
      privacy: postData.privacy,
      feeling: postData.feeling,
      location: postData.location,
      groupId: postData.groupId,
      groupName: postData.groupName,
      createdAt: 'এইমাত্র',
      reactions: { like: 0, love: 0, care: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
      commentsCount: 0,
      sharesCount: 0,
      comments: []
    };

    setPosts(prev => [newPost, ...prev]);

    // Throw celebratory confetti!
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.85 }
      });
    } catch {}

    // Send to Google Sheets if connected
    if (settings.appsScriptUrl) {
      GoogleSheetsService.sendDataToSheet(settings.appsScriptUrl, {
        action: 'savePost',
        post: newPost
      });
    }
  };

  const deletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    if (settings.appsScriptUrl) {
      GoogleSheetsService.sendDataToSheet(settings.appsScriptUrl, {
        action: 'deleteItem',
        sheetName: 'Posts',
        id: postId
      });
    }
  };

  const togglePinPost = (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, isPinned: !p.isPinned } : p));
  };

  const toggleSavePost = (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, isSaved: !p.isSaved } : p));
  };

  const reactToPost = (postId: string, reaction: ReactionType) => {
    setPosts(prev => prev.map(post => {
      if (post.id !== postId) return post;

      const currentReaction = post.userReaction;
      const newReactions = { ...post.reactions };

      if (currentReaction === reaction) {
        // Remove reaction
        newReactions[reaction] = Math.max(0, newReactions[reaction] - 1);
        return {
          ...post,
          userReaction: undefined,
          reactions: newReactions
        };
      } else {
        // Change or add reaction
        if (currentReaction) {
          newReactions[currentReaction] = Math.max(0, newReactions[currentReaction] - 1);
        }
        newReactions[reaction] = (newReactions[reaction] || 0) + 1;

        // Trigger notification if reacting to another user's post
        if (post.authorId !== currentUser.id) {
          const newNotif: NotificationItem = {
            id: generateUniqueId('notif'),
            userId: post.authorId,
            senderId: currentUser.id,
            senderName: currentUser.name,
            senderAvatar: currentUser.avatar,
            type: 'like',
            content: `আপনার পোস্টে ${reaction} প্রতিক্রিয়া জানিয়েছেন।`,
            targetId: post.id,
            isRead: false,
            createdAt: 'এইমাত্র'
          };
          setNotifications(n => deduplicateById([newNotif, ...n]));
        }

        return {
          ...post,
          userReaction: reaction,
          reactions: newReactions
        };
      }
    }));
  };

  const addComment = (postId: string, content: string, mediaUrl?: string, replyToCommentId?: string) => {
    if (!content.trim() && !mediaUrl) return;

    const newComment: Comment = {
      id: generateUniqueId('comment'),
      postId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorVerified: currentUser.isVerified,
      content,
      mediaUrl,
      createdAt: 'এইমাত্র',
      likes: 0,
      replies: []
    };

    setPosts(prev => prev.map(post => {
      if (post.id !== postId) return post;

      let updatedComments = [...post.comments];
      if (replyToCommentId) {
        updatedComments = updatedComments.map(c => {
          if (c.id === replyToCommentId) {
            return { ...c, replies: [...(c.replies || []), newComment] };
          }
          return c;
        });
      } else {
        updatedComments = [...updatedComments, newComment];
      }

      // Notify post author
      if (post.authorId !== currentUser.id) {
        const notif: NotificationItem = {
          id: generateUniqueId('notif'),
          userId: post.authorId,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          type: 'comment',
          content: `মন্তব্য করেছেন: "${content.substring(0, 30)}${content.length > 30 ? '...' : ''}"`,
          targetId: post.id,
          isRead: false,
          createdAt: 'এইমাত্র'
        };
        setNotifications(n => deduplicateById([notif, ...n]));
      }

      return {
        ...post,
        commentsCount: post.commentsCount + 1,
        comments: updatedComments
      };
    }));
  };

  const reactToComment = (postId: string, commentId: string, reaction: ReactionType) => {
    setPosts(prev => prev.map(post => {
      if (post.id !== postId) return post;

      const updateCommentsList = (list: Comment[]): Comment[] => {
        return list.map(c => {
          if (c.id === commentId) {
            const hasReacted = c.userReaction === reaction;
            return {
              ...c,
              likes: hasReacted ? Math.max(0, c.likes - 1) : c.likes + 1,
              userReaction: hasReacted ? undefined : reaction
            };
          }
          if (c.replies && c.replies.length > 0) {
            return { ...c, replies: updateCommentsList(c.replies) };
          }
          return c;
        });
      };

      return {
        ...post,
        comments: updateCommentsList(post.comments)
      };
    }));
  };

  const sharePost = (postId: string, shareType: 'feed' | 'group' | 'message', targetId?: string) => {
    const originalPost = posts.find(p => p.id === postId);
    if (!originalPost) return;

    if (shareType === 'feed') {
      const sharedPost: Post = {
        id: generateUniqueId('post_shared'),
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorAvatar: currentUser.avatar,
        authorVerified: currentUser.isVerified,
        content: `🔄 শেয়ার করা হয়েছে: "${originalPost.content.substring(0, 80)}..."`,
        mediaUrl: originalPost.mediaUrl,
        mediaType: originalPost.mediaType,
        privacy: 'public',
        createdAt: 'এইমাত্র',
        reactions: { like: 0, love: 0, care: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
        commentsCount: 0,
        sharesCount: 0,
        comments: []
      };
      setPosts(prev => [sharedPost, ...prev]);
    }

    setPosts(prev => prev.map(p => p.id === postId ? { ...p, sharesCount: p.sharesCount + 1 } : p));
  };

  // Story Actions
  const createStory = (storyData: {
    mediaUrl?: string;
    mediaType: 'image' | 'text';
    text?: string;
    bgGradient?: string;
  }) => {
    const newStory: Story = {
      id: generateUniqueId('story'),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      mediaUrl: storyData.mediaUrl,
      mediaType: storyData.mediaType,
      text: storyData.text,
      bgGradient: storyData.bgGradient,
      createdAt: 'এইমাত্র'
    };
    setStories(prev => [newStory, ...prev]);

    if (settings.appsScriptUrl) {
      GoogleSheetsService.sendDataToSheet(settings.appsScriptUrl, {
        action: 'saveStory',
        story: newStory
      });
    }
  };

  // Group Actions
  const createGroup = (groupData: {
    name: string;
    description: string;
    coverUrl: string;
    avatarUrl: string;
    privacy: 'public' | 'private';
    category: string;
    rules: string[];
  }): Group => {
    const newGroup: Group = {
      id: generateUniqueId('group'),
      name: groupData.name,
      description: groupData.description,
      coverUrl: groupData.coverUrl || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
      avatarUrl: groupData.avatarUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&auto=format&fit=crop&q=80',
      privacy: groupData.privacy,
      membersCount: 1,
      isJoined: true,
      adminId: currentUser.id,
      category: groupData.category,
      rules: groupData.rules,
      createdAt: '২০২৪'
    };

    setGroups(prev => [newGroup, ...prev]);

    if (settings.appsScriptUrl) {
      GoogleSheetsService.sendDataToSheet(settings.appsScriptUrl, {
        action: 'saveGroup',
        group: newGroup
      });
    }
    return newGroup;
  };

  const toggleJoinGroup = (groupId: string) => {
    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        const isJoined = !g.isJoined;
        return {
          ...g,
          isJoined,
          membersCount: isJoined ? g.membersCount + 1 : Math.max(1, g.membersCount - 1)
        };
      }
      return g;
    }));
  };

  // Messenger / Chat Actions
  const openChatWithUser = (targetUser: User) => {
    if (targetUser.id === currentUser.id) return;

    let conv = conversations.find(c =>
      !c.isGroup && c.participants.some(p => p.id === targetUser.id) && c.participants.some(p => p.id === currentUser.id)
    );

    if (!conv) {
      const newConv: Conversation = {
        id: generateUniqueId('conv'),
        participants: [currentUser, targetUser],
        lastMessage: 'কথোপকথন শুরু হয়েছে',
        lastMessageTime: 'এইমাত্র',
        unreadCount: 0,
        messages: []
      };
      setConversations(prev => deduplicateById([newConv, ...prev]));
      setActiveConversationId(newConv.id);
    } else {
      setActiveConversationId(conv.id);
    }
    setFloatingChatUser(targetUser);
  };

  const sendMessage = (
    conversationId: string,
    text: string,
    mediaUrl?: string,
    mediaType?: 'image' | 'audio',
    audioDuration?: number
  ) => {
    if (!text.trim() && !mediaUrl) return;

    const newMessage: Message = {
      id: generateUniqueId('m'),
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text,
      mediaUrl,
      mediaType,
      audioDuration,
      createdAt: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      isRead: true
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          lastMessage: text || (mediaType === 'audio' ? '🎤 ভয়েস মেসেজ' : '📷 ছবি'),
          lastMessageTime: 'এইমাত্র',
          messages: [...conv.messages, newMessage]
        };
      }
      return conv;
    }));

    // Send to Google Sheets if connected
    if (settings.appsScriptUrl) {
      GoogleSheetsService.sendDataToSheet(settings.appsScriptUrl, {
        action: 'saveMessage',
        message: newMessage,
        conversationId
      });
    }

    // Auto-reply simulation from other recipient after 1.5s
    const conv = conversations.find(c => c.id === conversationId);
    if (conv && !conv.isGroup) {
      const recipient = conv.participants.find(p => p.id !== currentUser.id);
      if (recipient) {
        setTimeout(() => {
          const botReplies = [
            'অনেক ধন্যবাদ মেসেজ দেওয়ার জন্য! 👍',
            'হ্যাঁ, আমি বিষয়টি দেখেছি। দারুন হচ্ছে!',
            'sagai অ্যাপের ইন্টারফেসটা সত্যিই খুব চমৎকার! 🚀',
            'আমি কিছুক্ষণ পর বিস্তারিত উত্তর দিচ্ছি।',
            'অসাধারণ আইডিয়া! চলো এটা নিয়ে আরো আলোচনা করি।'
          ];
          const randomReply = botReplies[Math.floor(Math.random() * botReplies.length)];
          const replyMsg: Message = {
            id: generateUniqueId('m_reply'),
            senderId: recipient.id,
            senderName: recipient.name,
            senderAvatar: recipient.avatar,
            text: randomReply,
            createdAt: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
            isRead: false
          };
          setConversations(prevConv => prevConv.map(c => {
            if (c.id === conversationId) {
              return {
                ...c,
                lastMessage: randomReply,
                lastMessageTime: 'এইমাত্র',
                unreadCount: c.unreadCount + 1,
                messages: [...c.messages, replyMsg]
              };
            }
            return c;
          }));
        }, 1200);
      }
    }
  };

  const createGroupConversation = (name: string, participantIds: string[]) => {
    const selectedParticipants = users.filter(u => participantIds.includes(u.id));
    if (!selectedParticipants.some(p => p.id === currentUser.id)) {
      selectedParticipants.push(currentUser);
    }
    const newConv: Conversation = {
      id: generateUniqueId('conv_grp'),
      participants: selectedParticipants,
      isGroup: true,
      groupName: name,
      groupAvatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&auto=format&fit=crop&q=80',
      lastMessage: `${currentUser.name} গ্রুপ চ্যাট তৈরি করেছেন`,
      lastMessageTime: 'এইমাত্র',
      unreadCount: 0,
      messages: [
        {
          id: generateUniqueId('m_init'),
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          text: `স্বাগতম "${name}" গ্রুপ চ্যাটে! 🎉`,
          createdAt: 'এইমাত্র',
          isRead: true
        }
      ]
    };
    setConversations(prev => deduplicateById([newConv, ...prev]));
    setActiveConversationId(newConv.id);
  };

  // Calling
  const startCall = (user: User, type: 'audio' | 'video') => {
    setActiveCall({
      isOpen: true,
      user,
      type,
      status: 'calling'
    });
    setTimeout(() => {
      setActiveCall(prev => prev ? { ...prev, status: 'connected' } : null);
    }, 2500);
  };

  const endCall = () => {
    setActiveCall(prev => prev ? { ...prev, status: 'ended' } : null);
    setTimeout(() => {
      setActiveCall(null);
    }, 800);
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Friends & Requests
  const sendFriendRequest = (toUserId: string) => {
    const targetUser = users.find(u => u.id === toUserId);
    if (!targetUser) return;
    const newReq: FriendRequest = {
      id: generateUniqueId('freq'),
      fromUser: currentUser,
      toUserId,
      status: 'pending',
      createdAt: 'এইমাত্র'
    };
    setFriendRequests(prev => deduplicateById([newReq, ...prev]));

    // Send notification
    const notif: NotificationItem = {
      id: generateUniqueId('notif'),
      userId: toUserId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      type: 'friend_req',
      content: 'আপনাকে ফ্রেন্ড রিকোয়েস্ট পাঠিয়েছেন।',
      isRead: false,
      createdAt: 'এইমাত্র'
    };
    setNotifications(n => deduplicateById([notif, ...n]));
  };

  const acceptFriendRequest = (requestId: string) => {
    const req = friendRequests.find(r => r.id === requestId);
    if (!req) return;

    setFriendRequests(prev => prev.filter(r => r.id !== requestId));

    // Update currentUser friends list
    setCurrentUser(curr => ({
      ...curr,
      friends: [...curr.friends, req.fromUser.id],
      friendsCount: curr.friendsCount + 1
    }));

    // Update users state
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, friends: [...u.friends, req.fromUser.id], friendsCount: u.friendsCount + 1 };
      }
      if (u.id === req.fromUser.id) {
        return { ...u, friends: [...u.friends, currentUser.id], friendsCount: u.friendsCount + 1 };
      }
      return u;
    }));
  };

  const declineFriendRequest = (requestId: string) => {
    setFriendRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const removeFriend = (targetUserId: string) => {
    setCurrentUser(curr => ({
      ...curr,
      friends: curr.friends.filter(id => id !== targetUserId),
      friendsCount: Math.max(0, curr.friendsCount - 1)
    }));
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, friends: u.friends.filter(id => id !== targetUserId), friendsCount: Math.max(0, u.friendsCount - 1) };
      }
      if (u.id === targetUserId) {
        return { ...u, friends: u.friends.filter(id => id !== currentUser.id), friendsCount: Math.max(0, u.friendsCount - 1) };
      }
      return u;
    }));
  };

  // Watch Videos
  const toggleFollowVideoAuthor = (videoId: string) => {
    setWatchVideos(prev => prev.map(v => v.id === videoId ? { ...v, isFollowing: !v.isFollowing } : v));
  };

  const likeVideo = (videoId: string) => {
    setWatchVideos(prev => prev.map(v => v.id === videoId ? { ...v, likesCount: v.likesCount + 1 } : v));
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        selectedGroupId,
        setSelectedGroupId,
        selectedUserId,
        setSelectedUserId,
        searchQuery,
        setSearchQuery,
        darkMode,
        setDarkMode,

        currentUser,
        setCurrentUser,
        users,
        updateUserProfile,
        switchUser,
        deleteUser,
        toggleBanUser,
        updateUserRole,
        toggleVerifyUser,

        posts,
        createPost,
        deletePost,
        togglePinPost,
        toggleSavePost,
        reactToPost,
        addComment,
        reactToComment,
        sharePost,

        stories,
        createStory,
        activeStoryIndex,
        setActiveStoryIndex,

        groups,
        createGroup,
        toggleJoinGroup,

        conversations,
        activeConversationId,
        setActiveConversationId,
        openChatWithUser,
        sendMessage,
        createGroupConversation,
        floatingChatUser,
        setFloatingChatUser,

        activeCall,
        startCall,
        endCall,

        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        friendRequests,
        sendFriendRequest,
        acceptFriendRequest,
        declineFriendRequest,
        removeFriend,

        watchVideos,
        toggleFollowVideoAuthor,
        likeVideo,

        settings,
        updateSettings,
        isAdminOpen,
        setIsAdminOpen,
        syncWithGoogleSheets,

        isCreatePostOpen,
        setIsCreatePostOpen,
        isCreateStoryOpen,
        setIsCreateStoryOpen,
        isCreateGroupOpen,
        setIsCreateGroupOpen,
        isMessengerModalOpen,
        setIsMessengerModalOpen,
        isSwitchUserOpen,
        setIsSwitchUserOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
