/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  useTogglePostLikeMutation,
  useCreateCommentMutation,
  useToggleCommentLikeMutation,
  useCreateReplyMutation,
  useToggleReplyLikeMutation,
} from "@/redux/features/post/postApi";

// ─── Types ───────────────────────────────────────────────────────────────────

interface LikeUser {
  id: string;
  userProfile?: { fullName?: string; firstName?: string; lastName?: string; profileImage?: string };
}
interface Like {
  id: string;
  userId: string;
  user: LikeUser;
}
interface Reply {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
  user: LikeUser;
  likes: Like[];
}
interface Comment {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
  user: LikeUser;
  likes: Like[];
  replies: Reply[];
}
interface Post {
  id: string;
  userId: string;
  text?: string;
  image?: string;
  visibility: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    userProfile?: { fullName?: string; firstName?: string; lastName?: string; profileImage?: string };
  };
  likes: Like[];
  comments: Comment[];
}

interface PostCardProps {
  darkMode: boolean;
  post: Post;
  currentUserId?: string;
  currentUserAvatar?: string;
  onUpdate?: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getDisplayName(user: LikeUser | Post["user"]): string {
  const p = user.userProfile;
  if (!p) return (user as any).email || "User";
  return p.fullName || `${p.firstName || ""} ${p.lastName || ""}`.trim() || (user as any).email || "User";
}

function getAvatar(user: LikeUser | Post["user"]): string {
  return user.userProfile?.profileImage || "/assets/images/Avatar.png";
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// ─── LikesList Tooltip ───────────────────────────────────────────────────────

function LikesList({ likes, children }: { likes: Like[]; children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  if (likes.length === 0) return <>{children}</>;
  return (
    <span
      style={{ position: "relative", cursor: "pointer" }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div style={{
          position: "absolute", bottom: "100%", left: 0, zIndex: 100,
          background: "#222", color: "#fff", padding: "6px 10px",
          borderRadius: "6px", fontSize: "12px", whiteSpace: "nowrap",
          boxShadow: "0 2px 8px rgba(0,0,0,0.25)", minWidth: "120px",
        }}>
          {likes.slice(0, 10).map(l => (
            <div key={l.id}>{getDisplayName(l.user)}</div>
          ))}
          {likes.length > 10 && <div>+{likes.length - 10} more</div>}
        </div>
      )}
    </span>
  );
}

// ─── PostCard ────────────────────────────────────────────────────────────────

export default function PostCard({
  darkMode,
  post,
  currentUserId,
  currentUserAvatar = "/assets/images/Avatar.png",
  onUpdate,
}: PostCardProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // Local overrides for optimistic updates; null means "use prop value"
  const [localLikes, setLocalLikes] = useState<Like[] | null>(null);
  const [localComments, setLocalComments] = useState<Comment[] | null>(null);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Derive display state from prop (or local override for optimistic updates).
  // The local override is only used while it still differs from server data;
  // once the server value catches up the override is simply ignored.
  const likes = useMemo(
    () => (localLikes !== null && localLikes !== post.likes ? localLikes : post.likes),
    [localLikes, post.likes]
  );
  const comments = useMemo(
    () => (localComments !== null && localComments !== post.comments ? localComments : post.comments),
    [localComments, post.comments]
  );
  const liked = useMemo(
    () => likes.some(l => l.userId === currentUserId),
    [likes, currentUserId]
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const [togglePostLike] = useTogglePostLikeMutation();
  const [createComment] = useCreateCommentMutation();
  const [toggleCommentLike] = useToggleCommentLikeMutation();

  // ── Post Like ──
  const handleLikeToggle = async () => {
    if (!currentUserId) return;
    const wasLiked = liked;
    // Optimistic local update
    setLocalLikes(
      wasLiked
        ? likes.filter((l) => l.userId !== currentUserId)
        : [...likes, { id: "tmp", userId: currentUserId, user: { id: currentUserId } }]
    );
    try {
      // Pass userId so the API slice can patch the cache without a feed refetch
      await togglePostLike({ postId: post.id, userId: currentUserId });
    } catch {
      // Revert on network error
      setLocalLikes(post.likes);
    }
  };

  // ── Comment Submit ──
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmittingComment(true);
    try {
      const res: any = await createComment({ postId: post.id, text: commentText.trim() });
      if (res.error) {
        toast.error(res.error.data?.message || "Failed to add comment");
      } else {
        setCommentText("");
        // Insert the returned comment immediately so it appears without a feed refetch
        const newComment = res.data?.data ?? res.data;
        if (newComment) setLocalComments([...comments, newComment]);
      }
    } catch {
      toast.error("Failed to add comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  // ── Comment Like ──
  const handleCommentLike = async (commentId: string) => {
    if (!currentUserId) return;
    const isLiked = comments.find((c) => c.id === commentId)?.likes.some((l) => l.userId === currentUserId);
    // Optimistic update
    setLocalComments(
      comments.map((c) =>
        c.id !== commentId
          ? c
          : {
              ...c,
              likes: isLiked
                ? c.likes.filter((l) => l.userId !== currentUserId)
                : [...c.likes, { id: "tmp", userId: currentUserId, user: { id: currentUserId } }],
            }
      )
    );
    try {
      // Pass postId + userId so the API slice can patch the cache
      await toggleCommentLike({ commentId, postId: post.id, userId: currentUserId });
    } catch {
      setLocalComments(post.comments);
    }
  };

  const authorName = getDisplayName(post.user);
  const authorImg = getAvatar(post.user);
  const postTime = timeAgo(post.createdAt);

  return (
    <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b2 _padd_t24 _mar_b16">
      <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
        <div className="_feed_inner_timeline_post_top">
          <div className="_feed_inner_timeline_post_box">
            <div className="_feed_inner_timeline_post_box_image">
              <img src={authorImg} alt="" className="_post_img" />
            </div>
            <div className="_feed_inner_timeline_post_box_txt">
              <h4 className="_feed_inner_timeline_post_box_title">{authorName}</h4>
              <p className="_feed_inner_timeline_post_box_para">
                {postTime} . <a href="#0">{post.visibility === "PRIVATE" ? "🔒 Private" : "🌐 Public"}</a>
              </p>
            </div>
          </div>
          <div className="_feed_inner_timeline_post_box_dropdown" ref={dropdownRef}>
            <div className="_feed_timeline_post_dropdown">
              <button
                type="button"
                className="_feed_timeline_post_dropdown_link bg-transparent border-0"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="4" height="17" fill="none" viewBox="0 0 4 17">
                  <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                  <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
                  <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
                </svg>
              </button>
            </div>
            <div className={`_feed_timeline_dropdown _timeline_dropdown ${dropdownOpen ? "show" : ""}`}>
              <ul className="_feed_timeline_dropdown_list">
                <li className="_feed_timeline_dropdown_item">
                  <a href="#0" className="_feed_timeline_dropdown_link">
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                        <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M14.25 15.75L9 12l-5.25 3.75v-12a1.5 1.5 0 011.5-1.5h7.5a1.5 1.5 0 011.5 1.5v12z" />
                      </svg>
                    </span>
                    Save Post
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {post.text && <h4 className="_feed_inner_timeline_post_title">{post.text}</h4>}
        {post.image && (
          <div className="_feed_inner_timeline_image">
            <img src={post.image} alt="" className="_time_img" />
          </div>
        )}
      </div>

      {/* Reactions summary */}
      <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
        <div className="_feed_inner_timeline_total_reacts_image">
          <img src="/assets/images/react_img1.png" alt="Image" className="_react_img1" />
          <img src="/assets/images/react_img2.png" alt="Image" className="_react_img" />
          <img src="/assets/images/react_img3.png" alt="Image" className="_react_img _rect_img_mbl_none" />
          <img src="/assets/images/react_img4.png" alt="Image" className="_react_img _rect_img_mbl_none" />
          <img src="/assets/images/react_img5.png" alt="Image" className="_react_img _rect_img_mbl_none" />
          <div className="_feed_inner_timeline_total_reacts_para" style={{ cursor: "pointer" }}>
            <LikesList likes={likes}>
              <span>{likes.length}</span>
            </LikesList>
          </div>
        </div>
        <div className="_feed_inner_timeline_total_reacts_txt">
          <p className="_feed_inner_timeline_total_reacts_para1">
            <a href="#0">
              <span>{comments.length}</span> Comment
            </a>
          </p>
          <p className="_feed_inner_timeline_total_reacts_para2"><span>122</span> Share</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="_feed_inner_timeline_reaction">
        <button
          type="button"
          onClick={handleLikeToggle}
          className={`_feed_inner_timeline_reaction_emoji _feed_reaction ${liked ? "_feed_reaction_active" : ""}`}
        >
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 19 19">
                <path fill="#FFCC4D" d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z" />
                <path fill="#664500" d="M9.5 11.083c-1.912 0-3.181-.222-4.75-.527-.358-.07-1.056 0-1.056 1.055 0 2.111 2.425 4.75 5.806 4.75 3.38 0 5.805-2.639 5.805-4.75 0-1.055-.697-1.125-1.055-1.055-1.57.305-2.838.527-4.75.527z" />
                <path fill="#fff" d="M4.75 11.611s1.583.528 4.75.528 4.75-.528 4.75-.528-1.056 2.111-4.75 2.111-4.75-2.11-4.75-2.11z" />
                <path fill="#664500" d="M6.333 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847zM12.667 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847z" />
              </svg>
              Haha
            </span>
          </span>
        </button>
        <button type="button" className="_feed_inner_timeline_reaction_comment _feed_reaction">
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="none" viewBox="0 0 21 21">
                <path stroke="#000" d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z" />
                <path stroke="#000" strokeLinecap="round" strokeLinejoin="round" d="M6.938 9.313h7.125M10.5 14.063h3.563" />
              </svg>
              Comment
            </span>
          </span>
        </button>
        <button type="button" className="_feed_inner_timeline_reaction_share _feed_reaction">
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="24" height="21" fill="none" viewBox="0 0 24 21">
                <path stroke="#000" strokeLinejoin="round" d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z" />
              </svg>
              Share
            </span>
          </span>
        </button>
      </div>

      {/* Comment Input */}
      <div className="_feed_inner_timeline_cooment_area">
        <div className="_feed_inner_comment_box">
          <form className="_feed_inner_comment_box_form" onSubmit={handleCommentSubmit}>
            <div className="_feed_inner_comment_box_content">
              <div className="_feed_inner_comment_box_content_image">
                <img src={currentUserAvatar} alt="" className="_comment_img" />
              </div>
              <div className="_feed_inner_comment_box_content_txt">
                <textarea
                  className="form-control _comment_textarea"
                  placeholder="Write a comment"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleCommentSubmit(e);
                    }
                  }}
                  disabled={submittingComment}
                />
              </div>
            </div>
            <div className="_feed_inner_comment_box_icon">
              {commentText.trim() ? (
                <button type="submit" className="_feed_inner_comment_box_icon_btn" disabled={submittingComment}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 14 13">
                    <path fill="#000" fillOpacity=".46" fillRule="evenodd" d="M6.37 7.879l2.438 3.955a.335.335 0 00.34.162c.068-.01.23-.05.289-.247l3.049-10.297a.348.348 0 00-.09-.35.341.341 0 00-.34-.088L1.75 4.03a.34.34 0 00-.247.289.343.343 0 00.16.347L5.666 7.17 9.2 3.597a.5.5 0 01.712.703L6.37 7.88z" clipRule="evenodd" />
                  </svg>
                </button>
              ) : (
                <>
                  <button type="button" className="_feed_inner_comment_box_icon_btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                      <path fill="#000" fillOpacity=".46" fillRule="evenodd" d="M13.167 6.534a.5.5 0 01.5.5c0 3.061-2.35 5.582-5.333 5.837V14.5a.5.5 0 01-1 0v-1.629C4.35 12.616 2 10.096 2 7.034a.5.5 0 011 0c0 2.679 2.168 4.859 4.833 4.859 2.666 0 4.834-2.18 4.834-4.86a.5.5 0 01.5-.5zM7.833.667a3.218 3.218 0 013.208 3.22v3.126c0 1.775-1.439 3.22-3.208 3.22a3.218 3.218 0 01-3.208-3.22V3.887c0-1.776 1.44-3.22 3.208-3.22zm0 1a2.217 2.217 0 00-2.208 2.22v3.126c0 1.223.991 2.22 2.208 2.22a2.217 2.217 0 002.208-2.22V3.887c0-1.224-.99-2.22-2.208-2.22z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button type="button" className="_feed_inner_comment_box_icon_btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                      <path fill="#000" fillOpacity=".46" fillRule="evenodd" d="M10.867 1.333c2.257 0 3.774 1.581 3.774 3.933v5.435c0 2.352-1.517 3.932-3.774 3.932H5.101c-2.254 0-3.767-1.58-3.767-3.932V5.266c0-2.352 1.513-3.933 3.767-3.933h5.766zm0 1H5.101c-1.681 0-2.767 1.152-2.767 2.933v5.435c0 1.782 1.086 2.932 2.767 2.932h5.766c1.685 0 2.774-1.15 2.774-2.932V5.266c0-1.781-1.089-2.933-2.774-2.933zm.426 5.733l.017.015.013.013.009.008.037.037c.12.12.453.46 1.443 1.477a.5.5 0 11-.716.697S10.73 8.91 10.633 8.816a.614.614 0 00-.433-.118.622.622 0 00-.421.225c-1.55 1.88-1.568 1.897-1.594 1.922a1.456 1.456 0 01-2.057-.021s-.62-.63-.63-.642c-.155-.143-.43-.134-.594.04l-1.02 1.076a.498.498 0 01-.707.018.499.499 0 01-.018-.706l1.018-1.075c.54-.573 1.45-.6 2.025-.06l.639.647c.178.18.467.184.646.008l1.519-1.843a1.618 1.618 0 011.098-.584c.433-.038.854.088 1.19.363zM5.706 4.42c.921 0 1.67.75 1.67 1.67 0 .92-.75 1.67-1.67 1.67-.92 0-1.67-.75-1.67-1.67 0-.921.75-1.67 1.67-1.67zm0 1a.67.67 0 10.001 1.34.67.67 0 00-.002-1.34z" clipRule="evenodd" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Comments List */}
      <div className="_timline_comment_main">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            darkMode={darkMode}
            comment={comment}
            postId={post.id}
            currentUserId={currentUserId}
            currentUserAvatar={currentUserAvatar}
            onCommentLike={handleCommentLike}
            onCommentUpdate={(updatedComment) => {
              setLocalComments(comments.map(c => c.id === updatedComment.id ? updatedComment : c));
            }}
          />
        ))}
        {submittingComment && <CommentSkeleton darkMode={darkMode} />}
      </div>
    </div>
  );
}

// ─── CommentSkeleton ─────────────────────────────────────────────────────────

function CommentSkeleton({ darkMode }: { darkMode: boolean }) {
  const baseColor = darkMode ? "bg-[#1e293b]" : "bg-[#e2e8f0]";
  return (
    <div className="_comment_main animate-pulse" style={{ marginBottom: "0.75rem" }}>
      <div className="_comment_image">
        <div
          className={`${baseColor} rounded-full`}
          style={{ width: "40px", height: "40px" }}
        />
      </div>
      <div className="_comment_area" style={{ flexGrow: 1 }}>
        <div className="_comment_details">
          <div className="_comment_name">
            <div className={`${baseColor} rounded`} style={{ width: "100px", height: "12px", marginBottom: "6px" }} />
          </div>
          <div className="_comment_status">
            <div className={`${baseColor} rounded`} style={{ width: "150px", height: "10px", marginBottom: "4px" }} />
          </div>
        </div>
        <div className="_comment_reply" style={{ marginTop: "4px" }}>
          <div className="_comment_reply_num">
            <ul className="_comment_reply_list">
              <li><span className={`${baseColor} rounded`} style={{ display: "inline-block", width: "24px", height: "9px" }} /></li>
              <li><span className={`${baseColor} rounded`} style={{ display: "inline-block", width: "28px", height: "9px" }} /></li>
              <li><span className={`${baseColor} rounded`} style={{ display: "inline-block", width: "24px", height: "9px" }} /></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CommentItem ─────────────────────────────────────────────────────────────

function CommentItem({
  comment,
  postId,
  currentUserId,
  currentUserAvatar,
  onCommentLike,
  onCommentUpdate,
  darkMode,
}: {
  comment: Comment;
  postId: string;
  currentUserId?: string;
  currentUserAvatar: string;
  onCommentLike: (id: string) => void;
  onCommentUpdate: (c: Comment) => void;
  darkMode: boolean;
}) {
  const [createReply] = useCreateReplyMutation();
  const [toggleReplyLike] = useToggleReplyLikeMutation();

  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const [replies, setReplies] = useState<Reply[]>(comment.replies || []);

  const isCommentLiked = comment.likes.some(l => l.userId === currentUserId);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setSubmittingReply(true);
    try {
      const res: any = await createReply({
        commentId: comment.id,
        postId,
        text: replyText.trim(),
      });
      if (res.error) {
        toast.error(res.error.data?.message || "Failed to add reply");
      } else {
        setReplyText("");
        setShowReplyInput(false);
        // Insert the returned reply immediately so it appears without a feed refetch
        const newReply = res.data?.data ?? res.data;
        if (newReply) setReplies((prev) => [...prev, newReply]);
      }
    } catch {
      toast.error("Failed to add reply");
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleReplyLike = async (replyId: string) => {
    if (!currentUserId) return;
    const isLiked = replies.find((r) => r.id === replyId)?.likes.some((l) => l.userId === currentUserId);
    // Optimistic update
    setReplies((prev) =>
      prev.map((r) =>
        r.id !== replyId
          ? r
          : {
              ...r,
              likes: isLiked
                ? r.likes.filter((l) => l.userId !== currentUserId)
                : [...r.likes, { id: "tmp", userId: currentUserId, user: { id: currentUserId } }],
            }
      )
    );
    try {
      // Pass full context so the API slice can patch the cache
      await toggleReplyLike({ replyId, commentId: comment.id, postId, userId: currentUserId });
    } catch {
      setReplies(comment.replies || []);
    }
  };

  return (
    <div className="_comment_main">
      <div className="_comment_image">
        <a href="#0" className="_comment_image_link">
          <img src={getAvatar(comment.user)} alt="" className="_comment_img1" />
        </a>
      </div>
      <div className="_comment_area">
        <div className="_comment_details">
          <div className="_comment_details_top">
            <div className="_comment_name">
              <a href="#0">
                <h4 className="_comment_name_title">{getDisplayName(comment.user)}</h4>
              </a>
            </div>
          </div>
          <div className="_comment_status">
            <p className="_comment_status_text">
              <span>{comment.text}</span>
            </p>
          </div>
          {comment.likes.length > 0 && (
            <LikesList likes={comment.likes}>
              <div className="_total_reactions" style={{ cursor: "pointer" }}>
                <div className="_total_react">
                  <span className="_reaction_like" style={{ position: "relative" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-thumbs-up"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                  </span>
                  <span className="_reaction_heart">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-heart"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                  </span>
                </div>
                <span className="_total">{comment.likes.length}</span>
              </div>
            </LikesList>
          )}
          <div className="_comment_reply">
            <div className="_comment_reply_num">
              <ul className="_comment_reply_list ">
                <li>
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: isCommentLiked ? '#007C74' : 'inherit' }}
                    onClick={() => onCommentLike(comment.id)}
                  >
                    <span>{isCommentLiked ? "Liked." : "Like."}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    onClick={() => setShowReplyInput(v => !v)}
                  >
                    <span>Reply.</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    <span>Share</span>
                  </button>
                </li>
                <li><span className="_time_link text-nowrap">.{timeAgo(comment.createdAt)}</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Reply Input */}
        {showReplyInput && (
          <div className="_feed_inner_comment_box" style={{ marginTop: '0.5rem' }}>
            <form className="_feed_inner_comment_box_form" onSubmit={handleReplySubmit}>
              <div className="_feed_inner_comment_box_content">
                <div className="_feed_inner_comment_box_content_image">
                  <img src={currentUserAvatar} alt="" className="_comment_img" />
                </div>
                <div className="_feed_inner_comment_box_content_txt">
                  <textarea
                    className="form-control _comment_textarea"
                    placeholder="Write a reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleReplySubmit(e);
                      }
                    }}
                    disabled={submittingReply}
                  />
                </div>
              </div>
              {replyText.trim() && (
                <div className="_feed_inner_comment_box_icon">
                  <button type="submit" className="_feed_inner_comment_box_icon_btn" disabled={submittingReply}>
                    ↩
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {/* Replies */}
        {(replies.length > 0 || submittingReply) && (
          <div style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
            {replies.map(reply => (
              <div key={reply.id} className="_comment_main" style={{ marginBottom: '0.5rem' }}>
                <div className="_comment_image">
                  <img src={getAvatar(reply.user)} alt="" className="_comment_img1" />
                </div>
                <div className="_comment_area">
                  <div className="_comment_details">
                    <div className="_comment_name">
                      <h4 className="_comment_name_title" style={{ fontSize: '13px' }}>{getDisplayName(reply.user)}</h4>
                    </div>
                    <div className="_comment_status">
                      <p className="_comment_status_text"><span>{reply.text}</span></p>
                    </div>
                    {reply.likes.length > 0 && (
                      <LikesList likes={reply.likes}>
                        <div className="_total_reactions" style={{ cursor: "pointer" }}>
                          <span className="_total" style={{ fontSize: '12px' }}>{reply.likes.length} likes</span>
                        </div>
                      </LikesList>
                    )}
                    <div className="_comment_reply">
                      <ul className="_comment_reply_list">
                        <li>
                          <button
                            type="button"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '12px', color: reply.likes.some(l => l.userId === currentUserId) ? '#007C74' : 'inherit' }}
                            onClick={() => handleReplyLike(reply.id)}
                          >
                            <span>{reply.likes.some(l => l.userId === currentUserId) ? "Liked." : "Like."}</span>
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '12px' }}
                          >
                            <span>Share</span>
                          </button>
                        </li>
                        <li><span className="_time_link" style={{ fontSize: '12px' }}>.{timeAgo(reply.createdAt)}</span></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {submittingReply && (
              <CommentSkeleton darkMode={darkMode} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
