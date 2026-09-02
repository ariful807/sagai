export type ReactionType = 'like' | 'love' | 'care' | 'haha' | 'wow' | 'sad' | 'angry';

export type UserRole = 'admin' | 'moderator' | 'user';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  coverPhoto: string;
  bio: string;
  work?: string;
  livesIn?: string;
  from?: string;
  relationship?: string;
  joinedDate: string;
  isVerified?: boolean;
  role: UserRole;
  isBanned?: boolean;
  followersCount: number;
  friendsCount: number;
  friends: string[]; // user IDs
}

export interface ReactionCounts {
  like: number;
  love: number;
  care: number;
  haha: number;
  wow: number;
  sad: number;
  angry: number;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorVerified?: boolean;
  content: string;
  mediaUrl?: string;
  createdAt: string;
  likes: number;
  userReaction?: ReactionType;
  replies?: Comment[];
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorVerified?: boolean;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  bgGradient?: string;
  privacy: 'public' | 'friends' | 'only_me';
  feeling?: string;
  location?: string;
  createdAt: string;
  reactions: ReactionCounts;
  userReaction?: ReactionType;
  commentsCount: number;
  sharesCount: number;
  comments: Comment[];
  groupId?: string;
  groupName?: string;
  isPinned?: boolean;
  isSaved?: boolean;
}

export interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  mediaUrl?: string;
  mediaType: 'image' | 'text';
  text?: string;
  bgGradient?: string;
  createdAt: string;
  seen?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'audio';
  audioDuration?: number;
  createdAt: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participants: User[];
  isGroup?: boolean;
  groupName?: string;
  groupAvatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  messages: Message[];
}

export interface Group {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  avatarUrl: string;
  privacy: 'public' | 'private';
  membersCount: number;
  isJoined?: boolean;
  adminId: string;
  category: string;
  rules: string[];
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  type: 'like' | 'comment' | 'friend_req' | 'group_invite' | 'system' | 'mention';
  content: string;
  targetId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface FriendRequest {
  id: string;
  fromUser: User;
  toUserId: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface VideoPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorVerified?: boolean;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  views: string;
  duration: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  isFollowing?: boolean;
}

export interface AppSettings {
  appName: string;
  appIconUrl: string;
  appsScriptUrl: string;
  sheetId: string;
  sheetUrl: string;
  syncStatus: 'idle' | 'syncing' | 'connected' | 'error';
  lastSyncTime?: string;
  announcement?: string;
  primaryColor: string;
  adminPassword?: string;
}
