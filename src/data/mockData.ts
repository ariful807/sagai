import { User, Post, Story, Group, Conversation, NotificationItem, VideoPost } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_1',
    name: 'Sagor Ahmed',
    username: 'sagor.ahmed',
    email: 'sagor@sagai.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    coverPhoto: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=1200&auto=format&fit=crop&q=80',
    bio: 'Tech enthusiast | Web Developer 💻 | Exploring new horizons 🚀',
    work: 'Software Engineer at TechNexus',
    livesIn: 'Dhaka, Bangladesh',
    from: 'Chattogram, Bangladesh',
    relationship: 'Single',
    joinedDate: 'January 2024',
    isVerified: true,
    role: 'admin',
    followersCount: 1420,
    friendsCount: 380,
    friends: ['user_2', 'user_3', 'user_4', 'user_5'],
  },
  {
    id: 'user_2',
    name: 'Nila Akter',
    username: 'nila.akter',
    email: 'nila@sagai.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    coverPhoto: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    bio: 'Photographer 📷 | Nature Lover 🌿 | Designing dreams ✨',
    work: 'UI/UX Designer at CreativeHub',
    livesIn: 'Sylhet, Bangladesh',
    from: 'Sylhet, Bangladesh',
    relationship: 'In a relationship',
    joinedDate: 'March 2024',
    isVerified: true,
    role: 'moderator',
    followersCount: 3250,
    friendsCount: 650,
    friends: ['user_1', 'user_3'],
  },
  {
    id: 'user_3',
    name: 'Tanvir Hossain',
    username: 'tanvir.dev',
    email: 'tanvir@sagai.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    coverPhoto: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1200&auto=format&fit=crop&q=80',
    bio: 'Coffee ☕, Code 💻, and Cats 🐱. Building for the future.',
    work: 'Full Stack Dev',
    livesIn: 'Dhaka, Bangladesh',
    from: 'Rajshahi, Bangladesh',
    joinedDate: 'February 2024',
    isVerified: false,
    role: 'user',
    followersCount: 890,
    friendsCount: 240,
    friends: ['user_1', 'user_2', 'user_4'],
  },
  {
    id: 'user_4',
    name: 'Ayesha Siddiqua',
    username: 'ayesha.art',
    email: 'ayesha@sagai.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    coverPhoto: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1200&auto=format&fit=crop&q=80',
    bio: 'Digital Artist 🎨 | Storyteller 📖 | Foodie 🍕',
    work: 'Freelance Illustrator',
    livesIn: 'Khulna, Bangladesh',
    from: 'Khulna, Bangladesh',
    joinedDate: 'May 2024',
    isVerified: true,
    role: 'user',
    followersCount: 5400,
    friendsCount: 820,
    friends: ['user_1', 'user_3'],
  },
  {
    id: 'user_5',
    name: 'Rafiul Islam',
    username: 'rafiul.travel',
    email: 'rafiul@sagai.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    coverPhoto: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&auto=format&fit=crop&q=80',
    bio: 'Wanderlust 🌍 | Traveling across 64 districts of Bangladesh 🇧🇩',
    work: 'Travel Blogger',
    livesIn: 'Cox’s Bazar, Bangladesh',
    from: 'Dhaka, Bangladesh',
    joinedDate: 'June 2024',
    isVerified: false,
    role: 'user',
    followersCount: 2100,
    friendsCount: 490,
    friends: ['user_1'],
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post_1',
    authorId: 'user_1',
    authorName: 'Sagor Ahmed',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    authorVerified: true,
    content: 'আজকে sagai সোশ্যাল প্ল্যাটফর্মের নতুন সংস্করণ তৈরি করতে পেরে দারুণ লাগছে! 🚀 রিয়েল-টাইম চ্যাট, গ্রুপ সিস্টেম এবং Google Sheets এর সাথে রিয়েল-টাইম ডাটা সিংক্রোনাইজেশন যুক্ত করা হয়েছে। সবার প্রতিক্রিয়া জানতে চাই!',
    mediaUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop&q=80',
    mediaType: 'image',
    privacy: 'public',
    feeling: 'excited',
    location: 'Dhaka, Bangladesh',
    createdAt: '১০ মিনিট আগে',
    reactions: { like: 24, love: 18, care: 5, haha: 2, wow: 8, sad: 0, angry: 0 },
    userReaction: 'love',
    commentsCount: 4,
    sharesCount: 3,
    isPinned: true,
    comments: [
      {
        id: 'c_1',
        postId: 'post_1',
        authorId: 'user_2',
        authorName: 'Nila Akter',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
        authorVerified: true,
        content: 'অসাধারণ কাজ ভাইয়া! ইউজার ইন্টারফেস খুবই আকর্ষণীয় এবং স্মুথ হয়েছে! ❤️👏',
        createdAt: '৮ মিনিট আগে',
        likes: 6,
        userReaction: 'love',
        replies: [
          {
            id: 'c_1_1',
            postId: 'post_1',
            authorId: 'user_1',
            authorName: 'Sagor Ahmed',
            authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
            authorVerified: true,
            content: 'অনেক ধন্যবাদ নীলা! তোমার ফিডব্যাক অনুপ্রেরণা জোগায়!',
            createdAt: '৫ মিনিট আগে',
            likes: 2,
          }
        ]
      },
      {
        id: 'c_2',
        postId: 'post_1',
        authorId: 'user_3',
        authorName: 'Tanvir Hossain',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        content: 'Google Sheets Integration সিস্টেমটা চরম আইডিয়া! ডেভলপারদের জন্য দারুণ কাজে দেবে 🔥',
        createdAt: '৩ মিনিট আগে',
        likes: 3,
      }
    ]
  },
  {
    id: 'post_2',
    authorId: 'user_4',
    authorName: 'Ayesha Siddiqua',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    authorVerified: true,
    content: 'সূর্যাস্তের এই মায়াবী রূপ দেখে মুগ্ধ হয়ে আঁকা একটি ডিজিটাল স্কেচ। প্রকৃতি আমাদের সবসময় নতুন কিছু শেখায় 🎨🌅',
    mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80',
    mediaType: 'image',
    privacy: 'public',
    feeling: 'blessed',
    location: 'Cox’s Bazar Beach',
    createdAt: '১ ঘন্টা আগে',
    reactions: { like: 45, love: 32, care: 12, haha: 0, wow: 19, sad: 0, angry: 0 },
    commentsCount: 2,
    sharesCount: 5,
    comments: [
      {
        id: 'c_3',
        postId: 'post_2',
        authorId: 'user_5',
        authorName: 'Rafiul Islam',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        content: 'চমৎকার ফ্রেম! কক্সবাজার আসলেই অদ্ভুত সুন্দর।',
        createdAt: '৪৫ মিনিট আগে',
        likes: 4,
      }
    ]
  },
  {
    id: 'post_3',
    authorId: 'user_2',
    authorName: 'Nila Akter',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    authorVerified: true,
    content: '“যিনি মনের দিক থেকে শান্ত, তিনি সারা বিশ্বের সমস্ত আনন্দের অধিকারী।” — সুন্দর একটি দিন কাটুক সবার! 🌸🕊️',
    bgGradient: 'from-pink-500 via-rose-500 to-purple-600',
    privacy: 'public',
    createdAt: '৩ ঘন্টা আগে',
    reactions: { like: 78, love: 64, care: 21, haha: 1, wow: 6, sad: 0, angry: 0 },
    userReaction: 'care',
    commentsCount: 1,
    sharesCount: 8,
    comments: [
      {
        id: 'c_4',
        postId: 'post_3',
        authorId: 'user_1',
        authorName: 'Sagor Ahmed',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        authorVerified: true,
        content: 'খুব সুন্দর বাণী! 💯',
        createdAt: '২ ঘন্টা আগে',
        likes: 5,
      }
    ]
  },
  {
    id: 'post_4',
    authorId: 'user_5',
    authorName: 'Rafiul Islam',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    content: 'সাজেক ভ্যালির মেঘের রাজ্য থেকে সরাসরি লাইভ অনুভুতি! পাহাড়ে ঘুরে বেড়ানোর অনুভূতি সবসময় অন্যরকম ⛰️☁️🌲',
    mediaUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80',
    mediaType: 'image',
    privacy: 'friends',
    feeling: 'traveling',
    location: 'Sajek Valley, Rangamati',
    createdAt: '৫ ঘন্টা আগে',
    reactions: { like: 112, love: 89, care: 14, haha: 0, wow: 33, sad: 0, angry: 0 },
    commentsCount: 5,
    sharesCount: 12,
    groupId: 'group_1',
    groupName: 'Travelers of Bangladesh',
    comments: []
  }
];

export const INITIAL_STORIES: Story[] = [
  {
    id: 'story_1',
    userId: 'user_2',
    userName: 'Nila Akter',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&auto=format&fit=crop&q=80',
    mediaType: 'image',
    text: 'Weekend Vibes ✨',
    createdAt: '২ ঘন্টা আগে',
  },
  {
    id: 'story_2',
    userId: 'user_3',
    userName: 'Tanvir Hossain',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    mediaType: 'text',
    bgGradient: 'from-blue-600 to-indigo-800',
    text: 'Code -> Coffee -> Repeat ☕👨‍💻',
    createdAt: '৪ ঘন্টা আগে',
  },
  {
    id: 'story_3',
    userId: 'user_5',
    userName: 'Rafiul Islam',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
    mediaType: 'image',
    text: 'Cloudy Sajek ☁️',
    createdAt: '৬ ঘন্টা আগে',
  },
  {
    id: 'story_4',
    userId: 'user_4',
    userName: 'Ayesha Siddiqua',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
    mediaType: 'image',
    text: 'New Artwork in progress 🖌️',
    createdAt: '৮ ঘন্টা আগে',
  }
];

export const INITIAL_GROUPS: Group[] = [
  {
    id: 'group_1',
    name: 'Travelers of Bangladesh (BD Travellers)',
    description: 'বাংলাদেশের আনাচে কানাচে ভ্রমণের গল্প, ছবি এবং অভিজ্ঞতা শেয়ার করার উন্মুক্ত গ্রুপ।',
    coverUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&auto=format&fit=crop&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200&auto=format&fit=crop&q=80',
    privacy: 'public',
    membersCount: 15420,
    isJoined: true,
    adminId: 'user_5',
    category: 'Travel & Tourism',
    rules: [
      'ভ্রমণ বিষয়ক ছাড়া অন্য কোনো পোস্ট করা যাবে না',
      'শালীনতা বজায় রাখুন',
      'প্রকৃতি নষ্ট করবেন না'
    ],
    createdAt: '২০২৩'
  },
  {
    id: 'group_2',
    name: 'Tech & Developers Hub 🚀',
    description: 'React, Node, Python, AI এবং ওয়েব টেকনোলজি সংক্রান্ত আলোচনা ও প্রজেক্ট প্রদর্শনী।',
    coverUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&auto=format&fit=crop&q=80',
    privacy: 'public',
    membersCount: 8940,
    isJoined: true,
    adminId: 'user_1',
    category: 'Science & Tech',
    rules: [
      'স্প্যামিং বা বিজ্ঞাপনী পোস্ট নিষিদ্ধ',
      'কোড শেয়ারে কোডব্লক ব্যবহার করুন',
      'পারস্পরিক শ্রদ্ধা বজায় রাখুন'
    ],
    createdAt: '২০২৪'
  },
  {
    id: 'group_3',
    name: 'Bangla Book Club 📚',
    description: 'বই পড়া, বইয়ের রিভিউ এবং সাহিত্যের আলোচনা করার পরিবার।',
    coverUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=1200&auto=format&fit=crop&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&auto=format&fit=crop&q=80',
    privacy: 'private',
    membersCount: 4210,
    isJoined: false,
    adminId: 'user_4',
    category: 'Books & Literature',
    rules: [
      'শুধুমাত্র বই সংক্রান্ত পোস্ট গ্রহণযোগ্য',
      'পিডিএফ বা পাইরেটেড লিংক নিষিদ্ধ'
    ],
    createdAt: '২০২৪'
  },
  {
    id: 'group_4',
    name: 'UI/UX Designers Guild',
    description: 'Design inspiration, Figma tips, design systems and portfolio reviews.',
    coverUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=200&auto=format&fit=crop&q=80',
    privacy: 'public',
    membersCount: 6800,
    isJoined: false,
    adminId: 'user_2',
    category: 'Design & Art',
    rules: [
      'Help fellow designers with constructive feedback',
      'No self-promotional spam'
    ],
    createdAt: '২০২৪'
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_1',
    participants: [INITIAL_USERS[0], INITIAL_USERS[1]],
    lastMessage: 'অসাধারণ কাজ ভাইয়া! ইউজার ইন্টারফেস খুবই আকর্ষণীয়!',
    lastMessageTime: '১০:৪৫ AM',
    unreadCount: 1,
    messages: [
      {
        id: 'm_1',
        senderId: 'user_1',
        senderName: 'Sagor Ahmed',
        senderAvatar: INITIAL_USERS[0].avatar,
        text: 'হাই নীলা! sagai অ্যাপের নতুন UI কেমন লাগলো?',
        createdAt: '১০:৪০ AM',
        isRead: true
      },
      {
        id: 'm_2',
        senderId: 'user_2',
        senderName: 'Nila Akter',
        senderAvatar: INITIAL_USERS[1].avatar,
        text: 'অসাধারণ কাজ ভাইয়া! ইউজার ইন্টারফেস খুবই আকর্ষণীয় এবং স্মুথ হয়েছে!',
        createdAt: '১০:৪৫ AM',
        isRead: false
      }
    ]
  },
  {
    id: 'conv_2',
    participants: [INITIAL_USERS[0], INITIAL_USERS[2]],
    lastMessage: 'Google Sheets sync টা কি টেস্ট করেছো?',
    lastMessageTime: 'গতকাল',
    unreadCount: 0,
    messages: [
      {
        id: 'm_3',
        senderId: 'user_3',
        senderName: 'Tanvir Hossain',
        senderAvatar: INITIAL_USERS[2].avatar,
        text: 'হ্যালো সাগোর! কেমন চলছে?',
        createdAt: 'গতকাল ০৮:২০ PM',
        isRead: true
      },
      {
        id: 'm_4',
        senderId: 'user_1',
        senderName: 'Sagor Ahmed',
        senderAvatar: INITIAL_USERS[0].avatar,
        text: 'সব ঠিকঠাক! Google Sheets sync টা কি টেস্ট করেছো?',
        createdAt: 'গতকাল ০৮:২২ PM',
        isRead: true
      }
    ]
  },
  {
    id: 'conv_3',
    participants: [INITIAL_USERS[0], INITIAL_USERS[3]],
    lastMessage: 'নতুন পেইন্টিংটা আপলোড করেছি!',
    lastMessageTime: '২ দিন আগে',
    unreadCount: 0,
    messages: [
      {
        id: 'm_5',
        senderId: 'user_4',
        senderName: 'Ayesha Siddiqua',
        senderAvatar: INITIAL_USERS[3].avatar,
        text: 'নতুন পেইন্টিংটা আপলোড করেছি! দেখে মতামত দিও।',
        createdAt: '২ দিন আগে',
        isRead: true
      }
    ]
  },
  {
    id: 'conv_group_1',
    participants: [INITIAL_USERS[0], INITIAL_USERS[1], INITIAL_USERS[2]],
    isGroup: true,
    groupName: 'Sagai Core Dev Team 💻',
    groupAvatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&auto=format&fit=crop&q=80',
    lastMessage: 'সাফল্যের সাথে রিলিজ সম্পন্ন হয়েছে!',
    lastMessageTime: '০৯:১৫ AM',
    unreadCount: 2,
    messages: [
      {
        id: 'm_g1',
        senderId: 'user_2',
        senderName: 'Nila Akter',
        senderAvatar: INITIAL_USERS[1].avatar,
        text: 'টিম, আজকের ডেমো মিটিং কখন?',
        createdAt: '০৯:০০ AM',
        isRead: true
      },
      {
        id: 'm_g2',
        senderId: 'user_1',
        senderName: 'Sagor Ahmed',
        senderAvatar: INITIAL_USERS[0].avatar,
        text: 'সাফল্যের সাথে রিলিজ সম্পন্ন হয়েছে! সবাই দেখতে পারো।',
        createdAt: '০৯:১৫ AM',
        isRead: false
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    userId: 'user_1',
    senderId: 'user_2',
    senderName: 'Nila Akter',
    senderAvatar: INITIAL_USERS[1].avatar,
    type: 'comment',
    content: 'আপনার পোস্টে একটি মন্তব্য করেছেন: "অসাধারণ কাজ ভাইয়া..."',
    targetId: 'post_1',
    isRead: false,
    createdAt: '৮ মিনিট আগে'
  },
  {
    id: 'notif_2',
    userId: 'user_1',
    senderId: 'user_3',
    senderName: 'Tanvir Hossain',
    senderAvatar: INITIAL_USERS[2].avatar,
    type: 'like',
    content: 'আপনার পোস্টে প্রতিক্রিয়া জানিয়েছেন।',
    targetId: 'post_1',
    isRead: false,
    createdAt: '১৫ মিনিট আগে'
  },
  {
    id: 'notif_3',
    userId: 'user_1',
    senderId: 'user_4',
    senderName: 'Ayesha Siddiqua',
    senderAvatar: INITIAL_USERS[3].avatar,
    type: 'friend_req',
    content: 'আপনাকে ফ্রেন্ড রিকোয়েস্ট পাঠিয়েছেন।',
    isRead: true,
    createdAt: '২ ঘন্টা আগে'
  },
  {
    id: 'notif_4',
    userId: 'user_1',
    senderId: 'user_5',
    senderName: 'Travelers of Bangladesh',
    senderAvatar: INITIAL_GROUPS[0].avatarUrl,
    type: 'group_invite',
    content: 'গ্রুপে নতুন ৫টি আলোচিত পোস্ট রয়েছে।',
    targetId: 'group_1',
    isRead: true,
    createdAt: '৫ ঘন্টা আগে'
  }
];

export const INITIAL_WATCH_VIDEOS: VideoPost[] = [
  {
    id: 'v_1',
    authorName: 'Discovery BD',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    authorVerified: true,
    title: 'মেঘের চাদরে ঢাকা নীলগিরি ও সাজেক ভ্যালির অপরূপ দৃশ্য 🇧🇩☁️',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    views: '124K',
    duration: '0:15',
    likesCount: 5200,
    commentsCount: 340,
    createdAt: '২ দিন আগে',
    isFollowing: true
  },
  {
    id: 'v_2',
    authorName: 'Tech Today',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    authorVerified: true,
    title: 'কীভাবে Google Sheets কে সম্পূর্ণ ডাটাবেস হিসেবে ব্যবহার করবেন? সহজ টিউটোরিয়াল 💡',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    views: '88K',
    duration: '0:30',
    likesCount: 3900,
    commentsCount: 215,
    createdAt: '১ সপ্তাহ আগে',
    isFollowing: false
  },
  {
    id: 'v_3',
    authorName: 'Art & Craft Studio',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    authorVerified: true,
    title: 'মাত্র ৫ মিনিটে অ্যাক্রিলিক পেইন্টিং তৈরি করুন! স্টেপ বাই স্টেপ গাইড 🎨',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
    views: '45K',
    duration: '0:20',
    likesCount: 2100,
    commentsCount: 95,
    createdAt: '৩ দিন আগে',
    isFollowing: true
  }
];
