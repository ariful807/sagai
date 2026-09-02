import React, { useState, useRef, useEffect } from 'react';
import {
  ThumbsUp, MessageCircle, Share2, MoreHorizontal, Bookmark,
  Pin, Trash2, Link, Globe, Users, Lock, Heart, Smile, Send,
  CornerDownRight, Image as ImageIcon, Sparkles, Check
} from 'lucide-react';
import { Post, ReactionType, Comment } from '../types';
import { useApp } from '../context/AppContext';

const REACTION_EMOJIS: { type: ReactionType; name: string; emoji: string; color: string; iconBg: string }[] = [
  { type: 'like', name: 'লাইক', emoji: '👍', color: 'text-[#1877f2]', iconBg: 'bg-[#1877f2]' },
  { type: 'love', name: 'লাভ', emoji: '❤️', color: 'text-rose-500', iconBg: 'bg-rose-500' },
  { type: 'care', name: 'কেয়ার', emoji: '🥰', color: 'text-amber-500', iconBg: 'bg-amber-400' },
  { type: 'haha', name: 'হাহা', emoji: '😆', color: 'text-amber-500', iconBg: 'bg-amber-400' },
  { type: 'wow', name: 'ওয়াও', emoji: '😮', color: 'text-amber-500', iconBg: 'bg-amber-400' },
  { type: 'sad', name: 'স্যাড', emoji: '😢', color: 'text-amber-500', iconBg: 'bg-amber-400' },
  { type: 'angry', name: 'অ্যাংরি', emoji: '😡', color: 'text-orange-600', iconBg: 'bg-orange-500' },
];

export const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const {
    currentUser,
    reactToPost,
    addComment,
    reactToComment,
    sharePost,
    deletePost,
    togglePinPost,
    toggleSavePost,
    setSelectedUserId,
    setCurrentTab,
    setSelectedGroupId,
  } = useApp();

  const [showReactionsBar, setShowReactionsBar] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [commentImageUrl, setCommentImageUrl] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isImageLightboxOpen, setIsImageLightboxOpen] = useState(false);

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close options menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowOptionsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalReactionsCount = (Object.values(post.reactions) as (number | undefined)[]).reduce((a: number, b) => a + Number(b || 0), 0);

  // Get active reactions list to show stacked icons
  const activeReactions = REACTION_EMOJIS.filter(r => (post.reactions[r.type] || 0) > 0);

  const currentReactionObj = REACTION_EMOJIS.find(r => r.type === post.userReaction);

  const handleMouseEnterLike = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setShowReactionsBar(true);
    }, 250);
  };

  const handleMouseLeaveLike = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setShowReactionsBar(false);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() && !commentImageUrl) return;

    addComment(post.id, commentText, commentImageUrl || undefined, replyToId || undefined);
    setCommentText('');
    setCommentImageUrl('');
    setReplyToId(null);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const canDelete = currentUser.id === post.authorId || currentUser.role === 'admin' || currentUser.role === 'moderator';

  return (
    <article className="bg-white dark:bg-[#242526] rounded-xl shadow-sm border border-gray-200 dark:border-[#393a3b] mb-4 overflow-hidden transition-colors">
      {/* Pinned Post Badge */}
      {post.isPinned && (
        <div className="flex items-center gap-1.5 px-4 pt-2.5 text-xs font-bold text-[#1877f2] dark:text-[#2d88ff]">
          <Pin className="w-3.5 h-3.5 fill-[#1877f2]" />
          <span>Pinned Post</span>
        </div>
      )}

      {/* Post Header */}
      <div className="p-3 sm:p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            onClick={() => {
              setSelectedUserId(post.authorId);
              setCurrentTab('profile');
            }}
            className="cursor-pointer"
          >
            <img
              src={post.authorAvatar}
              alt={post.authorName}
              className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700 hover:opacity-90 transition-opacity"
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                onClick={() => {
                  setSelectedUserId(post.authorId);
                  setCurrentTab('profile');
                }}
                className="font-bold text-sm text-gray-900 dark:text-white hover:underline cursor-pointer"
              >
                {post.authorName}
              </span>
              {post.authorVerified && (
                <span className="text-[#1877f2] text-xs font-bold" title="Verified Profile">✓</span>
              )}
              {post.groupName && (
                <>
                  <span className="text-xs text-gray-500">▶</span>
                  <span
                    onClick={() => {
                      if (post.groupId) {
                        setSelectedGroupId(post.groupId);
                        setCurrentTab('groups');
                      }
                    }}
                    className="font-semibold text-xs text-gray-800 dark:text-gray-200 hover:underline cursor-pointer"
                  >
                    {post.groupName}
                  </span>
                </>
              )}
              {post.feeling && (
                <span className="text-xs text-gray-500 font-normal">
                  — feeling <span className="font-semibold">{post.feeling}</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
              <span>{post.createdAt}</span>
              <span>•</span>
              {post.location && (
                <>
                  <span>📍 {post.location}</span>
                  <span>•</span>
                </>
              )}
              {post.privacy === 'public' && <Globe className="w-3 h-3" />}
              {post.privacy === 'friends' && <Users className="w-3 h-3" />}
              {post.privacy === 'only_me' && <Lock className="w-3 h-3" />}
            </div>
          </div>
        </div>

        {/* Meatball Options Menu */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setShowOptionsMenu(!showOptionsMenu)}
            className="text-gray-500 dark:text-gray-400 font-bold p-2 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-full w-8 h-8 flex items-center justify-center cursor-pointer transition-colors"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {showOptionsMenu && (
            <div className="absolute right-0 top-9 w-52 bg-white dark:bg-[#242526] rounded-xl shadow-xl border border-gray-200 dark:border-[#393a3b] p-1.5 z-30 space-y-1">
              <button
                onClick={() => {
                  toggleSavePost(post.id);
                  setShowOptionsMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg text-gray-800 dark:text-gray-200"
              >
                <Bookmark className="w-4 h-4 text-purple-500" />
                <span>{post.isSaved ? 'Unsave Post' : 'Save Post'}</span>
              </button>

              <button
                onClick={() => {
                  togglePinPost(post.id);
                  setShowOptionsMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg text-gray-800 dark:text-gray-200"
              >
                <Pin className="w-4 h-4 text-blue-500" />
                <span>{post.isPinned ? 'Unpin Post' : 'Pin to Top'}</span>
              </button>

              <button
                onClick={() => {
                  handleCopyLink();
                  setShowOptionsMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg text-gray-800 dark:text-gray-200"
              >
                <Link className="w-4 h-4 text-emerald-500" />
                <span>Copy Link</span>
              </button>

              {canDelete && (
                <button
                  onClick={() => {
                    deletePost(post.id);
                    setShowOptionsMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Post</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Text Content or Gradient Card */}
      {post.bgGradient ? (
        <div className={`w-full min-h-[220px] bg-gradient-to-r ${post.bgGradient} p-8 flex items-center justify-center text-center`}>
          <div className="text-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <p className="text-white font-black text-xl sm:text-2xl md:text-3xl leading-tight drop-shadow-sm">
              {post.content}
            </p>
          </div>
        </div>
      ) : (
        <div className="px-4 pb-3 text-sm leading-relaxed text-gray-900 dark:text-gray-100">
          <p className="whitespace-pre-line">
            {post.content}
          </p>
        </div>
      )}

      {/* Post Media (Image/Video) */}
      {post.mediaUrl && !post.bgGradient && (
        <div
          onClick={() => setIsImageLightboxOpen(true)}
          className="relative bg-black/5 dark:bg-black/40 overflow-hidden cursor-zoom-in group max-h-[500px] flex items-center justify-center"
        >
          <img
            src={post.mediaUrl}
            alt="Post content"
            className="w-full h-auto max-h-[500px] object-cover group-hover:scale-[1.01] transition-transform duration-300"
          />
        </div>
      )}

      {/* Reactions and Comments Count Bar */}
      <div className="p-3 border-b border-gray-100 dark:border-[#393a3b] flex justify-between items-center text-gray-500 text-xs">
        {/* Left: Reaction Icons Stack & Count */}
        <div className="flex items-center gap-1.5">
          {totalReactionsCount > 0 ? (
            <div className="flex items-center -space-x-1">
              {activeReactions.slice(0, 3).map(r => (
                <span
                  key={r.type}
                  className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs shadow-xs"
                >
                  {r.emoji}
                </span>
              ))}
              <span className="font-semibold ml-2 text-gray-700 dark:text-gray-300">
                {totalReactionsCount} {totalReactionsCount === 1 ? 'Reaction' : 'Reactions'}
              </span>
            </div>
          ) : (
            <span className="text-xs text-gray-400">Be the first to react</span>
          )}
        </div>

        {/* Right: Comments and Share Count */}
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          {post.commentsCount > 0 && (
            <button
              onClick={() => setShowComments(!showComments)}
              className="hover:underline cursor-pointer"
            >
              {post.commentsCount} Comments
            </button>
          )}
          {post.sharesCount > 0 && (
            <span>• {post.sharesCount} Shares</span>
          )}
        </div>
      </div>

      {/* Action Buttons: Like, Comment, Share */}
      <div className="relative flex justify-around p-1 mx-2 border-b border-gray-100 dark:border-[#393a3b]">
        {/* Reaction Bar Popup on Hover / Long Press */}
        {showReactionsBar && (
          <div
            onMouseEnter={() => setShowReactionsBar(true)}
            onMouseLeave={() => setShowReactionsBar(false)}
            className="absolute -top-12 left-2 z-40 bg-white dark:bg-[#242526] rounded-full shadow-2xl border border-gray-200 dark:border-[#393a3b] p-1.5 flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-150"
          >
            {REACTION_EMOJIS.map(r => (
              <button
                key={r.type}
                onClick={() => {
                  reactToPost(post.id, r.type);
                  setShowReactionsBar(false);
                }}
                className="w-9 h-9 flex items-center justify-center text-xl hover:scale-130 transition-transform cursor-pointer relative group"
                title={r.name}
              >
                <span>{r.emoji}</span>
                <span className="absolute -top-7 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {r.name}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Like Button */}
        <div
          className="flex-1"
          onMouseEnter={handleMouseEnterLike}
          onMouseLeave={handleMouseLeaveLike}
        >
          <button
            onClick={() => reactToPost(post.id, post.userReaction ? post.userReaction : 'like')}
            className={`w-full py-2 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg text-gray-500 font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              currentReactionObj ? currentReactionObj.color : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            {currentReactionObj ? (
              <>
                <span className="text-base">{currentReactionObj.emoji}</span>
                <span>{currentReactionObj.name}</span>
              </>
            ) : (
              <>
                <ThumbsUp className="w-4 h-4" />
                <span>Like</span>
              </>
            )}
          </button>
        </div>

        {/* Comment Button */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 py-2 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg text-gray-500 font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Comment</span>
        </button>

        {/* Share Button */}
        <button
          onClick={() => setShowShareModal(true)}
          className="flex-1 py-2 hover:bg-gray-100 dark:hover:bg-[#3a3b3c] rounded-lg text-gray-500 font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="p-3 sm:p-4 bg-gray-50/50 dark:bg-[#1c1d1e]/50 space-y-3">
          {/* Create Comment Input */}
          <form onSubmit={handleCommentSubmit} className="flex items-start gap-2.5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700 shrink-0 mt-0.5"
            />
            <div className="flex-1">
              {replyToId && (
                <div className="flex items-center justify-between text-[11px] text-blue-600 font-semibold mb-1">
                  <span>উত্তর দেওয়া হচ্ছে...</span>
                  <button onClick={() => setReplyToId(null)} className="text-gray-400 hover:text-gray-600">
                    বাতিল
                  </button>
                </div>
              )}
              <div className="relative flex items-center bg-white dark:bg-[#3a3b3c] border border-gray-200 dark:border-gray-700 rounded-2xl px-3 py-1.5 shadow-xs">
                <input
                  type="text"
                  placeholder={`${currentUser.name} হিসেবে মন্তব্য লিখুন...`}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-none outline-hidden pr-8"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim() && !commentImageUrl}
                  className={`p-1.5 rounded-full transition-colors ${
                    commentText.trim() || commentImageUrl
                      ? 'text-[#1877f2] hover:bg-blue-50 dark:hover:bg-blue-900/30'
                      : 'text-gray-400'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-3 pt-1">
            {post.comments.map(c => (
              <div key={c.id} className="flex items-start gap-2.5 group">
                <img
                  src={c.authorAvatar}
                  alt={c.authorName}
                  className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5 cursor-pointer"
                  onClick={() => {
                    setSelectedUserId(c.authorId);
                    setCurrentTab('profile');
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="bg-white dark:bg-[#3a3b3c] border border-gray-200 dark:border-gray-700 rounded-2xl px-3 py-2 inline-block max-w-full shadow-xs">
                    <div className="flex items-center gap-1.5">
                      <span
                        onClick={() => {
                          setSelectedUserId(c.authorId);
                          setCurrentTab('profile');
                        }}
                        className="font-bold text-xs text-gray-900 dark:text-white hover:underline cursor-pointer"
                      >
                        {c.authorName}
                      </span>
                      {c.authorVerified && <span className="text-[#1877f2] text-[10px]">✓</span>}
                    </div>
                    <p className="text-xs text-gray-800 dark:text-gray-200 mt-0.5 break-words">
                      {c.content}
                    </p>
                  </div>

                  {/* Comment Actions: Like, Reply, Timestamp */}
                  <div className="flex items-center gap-3 text-[11px] font-semibold text-gray-500 dark:text-gray-400 mt-1 ml-2">
                    <button
                      onClick={() => reactToComment(post.id, c.id, 'like')}
                      className={`hover:underline ${c.userReaction ? 'text-[#1877f2]' : ''}`}
                    >
                      লাইক {c.likes > 0 && `(${c.likes})`}
                    </button>
                    <button
                      onClick={() => {
                        setReplyToId(c.id);
                      }}
                      className="hover:underline"
                    >
                      উত্তর দিন
                    </button>
                    <span>{c.createdAt}</span>
                  </div>

                  {/* Nested Replies */}
                  {c.replies && c.replies.length > 0 && (
                    <div className="mt-2 pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-2">
                      {c.replies.map(reply => (
                        <div key={reply.id} className="flex items-start gap-2">
                          <img
                            src={reply.authorAvatar}
                            alt={reply.authorName}
                            className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                          />
                          <div className="bg-white dark:bg-[#3a3b3c] border border-gray-200 dark:border-gray-700 rounded-xl px-2.5 py-1.5">
                            <span className="font-bold text-xs text-gray-900 dark:text-white">
                              {reply.authorName}
                            </span>
                            <p className="text-xs text-gray-800 dark:text-gray-200 mt-0.5">
                              {reply.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Share Modal Dialog */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#242526] w-full max-w-sm rounded-2xl p-4 shadow-2xl border border-gray-200 dark:border-[#393a3b]">
            <h3 className="font-bold text-base text-gray-900 dark:text-white mb-3 text-center">
              পোস্টটি শেয়ার করুন
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  sharePost(post.id, 'feed');
                  setShowShareModal(false);
                }}
                className="w-full flex items-center gap-3 p-3 bg-gray-100 dark:bg-[#3a3b3c] hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl text-left font-semibold text-xs sm:text-sm text-gray-800 dark:text-gray-200"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1877f2] flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white font-bold">আপনার ফিডে শেয়ার করুন</p>
                  <p className="text-[11px] text-gray-500">এখনই পাবলিকলি শেয়ার হবে</p>
                </div>
              </button>

              <button
                onClick={() => {
                  handleCopyLink();
                  setShowShareModal(false);
                }}
                className="w-full flex items-center gap-3 p-3 bg-gray-100 dark:bg-[#3a3b3c] hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl text-left font-semibold text-xs sm:text-sm text-gray-800 dark:text-gray-200"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Link className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white font-bold">লিংক কপি করুন</p>
                  <p className="text-[11px] text-gray-500">যেকোনো জায়গায় শেয়ার করতে লিংক নিন</p>
                </div>
              </button>
            </div>
            <button
              onClick={() => setShowShareModal(false)}
              className="mt-3 w-full py-2 bg-gray-200 dark:bg-[#3a3b3c] hover:bg-gray-300 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold"
            >
              বাতিল
            </button>
          </div>
        </div>
      )}

      {/* Lightbox Zoom Modal for Images */}
      {isImageLightboxOpen && post.mediaUrl && (
        <div
          onClick={() => setIsImageLightboxOpen(false)}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-xs cursor-zoom-out"
        >
          <img
            src={post.mediaUrl}
            alt="Enlarged view"
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}
    </article>
  );
};
