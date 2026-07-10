"use client";
import { useState } from "react";

interface PostCardProps {
  darkMode: boolean;
  post?: {
    id: string;
    authorName: string;
    authorImg: string;
    timeAgo: string;
    visibility: string;
    title?: string;
    image?: string;
    reactionCount: number;
    commentCount: number;
    shareCount: number;
    comments?: CommentItem[];
    isLiked?: boolean;
  };
}

interface CommentItem {
  id: string;
  authorName: string;
  authorImg: string;
  text: string;
  time: string;
  likes: number;
  isLiked?: boolean;
  replies?: ReplyItem[];
}

interface ReplyItem {
  id: string;
  authorName: string;
  authorImg: string;
  text: string;
  time: string;
  likes: number;
  isLiked?: boolean;
}

const defaultPost = {
  id: "1",
  authorName: "Karim Saif",
  authorImg: "/assets/images/post_img.png",
  timeAgo: "5 minute ago",
  visibility: "Public",
  title: "-Healthy Tracking App",
  image: "/assets/images/timeline_img.png",
  reactionCount: 9,
  commentCount: 12,
  shareCount: 122,
  isLiked: true,
  comments: [
    {
      id: "c1",
      authorName: "Radovan SkillArena",
      authorImg: "/assets/images/txt_img.png",
      text: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
      time: "21m",
      likes: 198,
      isLiked: false,
      replies: [] as ReplyItem[],
    },
  ],
};

export default function PostCard({ darkMode, post = defaultPost }: PostCardProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [liked, setLiked] = useState(post.isLiked ?? false);
  const [comments, setComments] = useState(post.comments ?? []);
  const [nestedReplyText, setNestedReplyText] = useState<Record<string, string>>({});
  const [replyInputVisible, setReplyInputVisible] = useState<Record<string, boolean>>({});

  const cardBg = darkMode ? "bg-[#1a1a2e]" : "bg-white";

  return (
    <div className={`${cardBg} rounded-[6px] py-6 mb-4 transition-all duration-200`}>
      {/* Top section wrapper */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-4">
          {/* Left author box */}
          <div className="flex items-center cursor-pointer">
            <div className="mr-4">
              <img
                src={post.authorImg}
                alt=""
                className="rounded-full object-cover transition-all duration-200 hover:opacity-70 hover:bg-black"
                style={{ maxWidth: "44px", height: "44px" }}
              />
            </div>
            <div>
              <h4 className="font-normal text-base text-[#000000] leading-[1.1] hover:underline m-0">
                {post.authorName}
              </h4>
              <p className="font-normal text-sm text-black/50 leading-[1.2] m-0 mt-0.5">
                {post.timeAgo} . <a href="#0" className="text-black/50 hover:underline">{post.visibility}</a>
              </p>
            </div>
          </div>

          {/* Right dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="border-none bg-transparent outline-none p-1 block"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="4" height="17" fill="none" viewBox="0 0 4 17">
                <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
                <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
              </svg>
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 bg-white"
                style={{
                  top: "32px",
                  width: "180px",
                  borderRadius: "6px",
                  boxShadow: "rgba(149,157,165,0.2) 0px 8px 24px",
                  zIndex: 30,
                  border: "1px solid #E8E8E8",
                }}
              >
                <ul className="list-none p-0 m-0 py-1">
                  {[
                    { label: "Save Post", icon: <svg className="stroke-[#1890FF]" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M14.25 15.75L9 12l-5.25 3.75v-12a1.5 1.5 0 011.5-1.5h7.5a1.5 1.5 0 011.5 1.5v12z"/></svg> },
                    { label: "Turn On Notification", icon: <svg className="fill-[#377DFF]" xmlns="http://www.w3.org/2000/svg" width="20" height="22" fill="none" viewBox="0 0 20 22"><path fillRule="evenodd" d="M7.547 19.55c.533.59 1.218.915 1.93.915.714 0 1.403-.324 1.938-.916a.777.777 0 011.09-.056c.318.284.344.77.058 1.084-.832.917-1.927 1.423-3.086 1.423h-.002c-1.155-.001-2.248-.506-3.077-1.424a.762.762 0 01.057-1.083.774.774 0 011.092.057zM9.527 0c4.58 0 7.657 3.543 7.657 6.85 0 1.702.436 2.424.899 3.19.457.754.976 1.612.976 3.233-.36 4.14-4.713 4.478-9.531 4.478-4.818 0-9.172-.337-9.528-4.413-.003-1.686.515-2.544.973-3.299l.161-.27c.398-.679.737-1.417.737-2.918C1.871 3.543 4.948 0 9.528 0zm0 1.535c-3.6 0-6.11 2.802-6.11 5.316 0 2.127-.595 3.11-1.12 3.978-.422.697-.755 1.247-.755 2.444.173 1.93 1.455 2.944 7.986 2.944 6.494 0 7.817-1.06 7.988-3.01-.003-1.13-.336-1.681-.757-2.378-.526-.868-1.12-1.851-1.12-3.978 0-2.514-2.51-5.316-6.111-5.316z" clipRule="evenodd"/></svg> },
                    { label: "Hide", icon: <svg className="stroke-[#1890FF]" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M14.25 2.25H3.75a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V3.75a1.5 1.5 0 00-1.5-1.5zM6.75 6.75l4.5 4.5M11.25 6.75l-4.5 4.5"/></svg> },
                    { label: "Edit Post", icon: <svg className="stroke-[#1890FF]" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M8.25 3H3a1.5 1.5 0 00-1.5 1.5V15A1.5 1.5 0 003 16.5h10.5A1.5 1.5 0 0015 15V9.75"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M13.875 1.875a1.591 1.591 0 112.25 2.25L9 11.25 6 12l.75-3 7.125-7.125z"/></svg> },
                    { label: "Delete Post", icon: <svg className="stroke-[#1890FF]" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M2.25 4.5h13.5M6 4.5V3a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0112 3v1.5m2.25 0V15a1.5 1.5 0 01-1.5 1.5h-7.5a1.5 1.5 0 01-1.5-1.5V4.5h10.5zM7.5 8.25v4.5M10.5 8.25v4.5"/></svg> },
                  ].map((item, idx) => (
                    <li key={idx}>
                      <a
                        href="#0"
                        className="flex items-center gap-3.5 px-4 py-2.5 text-xs text-[#212121] hover:bg-[#1890FF]/10 transition-all duration-200 font-medium"
                      >
                        <span className="flex items-center justify-center w-5">{item.icon}</span>
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        {post.title && (
          <h4 className="font-normal text-sm text-[#000000] leading-[21px] mb-4 m-0">
            {post.title}
          </h4>
        )}

        {/* Image */}
        {post.image && (
          <div className="mb-6 rounded-[6px] overflow-hidden">
            <img src={post.image} alt="" className="w-full object-cover rounded-[6px]" />
          </div>
        )}
      </div>

      {/* Total Reacts */}
      <div className="flex items-center justify-between px-6 mb-6">
        <div className="flex items-center cursor-pointer">
          <img src="/assets/images/react_img1.png" alt="React" className="w-[32px] h-[32px] rounded-full border border-white z-10 flex-shrink-0" />
          <img src="/assets/images/react_img2.png" alt="React" className="w-[32px] h-[32px] rounded-full border border-white z-0 -ml-4 flex-shrink-0" />
          <img src="/assets/images/react_img3.png" alt="React" className="w-[32px] h-[32px] rounded-full border border-white -ml-4 hidden sm:block flex-shrink-0" />
          <img src="/assets/images/react_img4.png" alt="React" className="w-[32px] h-[32px] rounded-full border border-white -ml-4 hidden sm:block flex-shrink-0" />
          <img src="/assets/images/react_img5.png" alt="React" className="w-[32px] h-[32px] rounded-full border border-white -ml-4 hidden sm:block flex-shrink-0" />
          <p
            className="bg-[#1890FF] border-2 border-white rounded-full flex items-center justify-center text-white font-normal text-sm leading-[21px] -ml-4"
            style={{ width: "32px", height: "32px", zIndex: 5 }}
          >9+</p>
        </div>
        <div className="flex items-center">
          <p className="font-normal text-sm text-black/50 leading-[1.2] mr-4 m-0">
            <a href="#0" className="text-black/50 hover:underline">
              <span className="text-[#212121]">{post.commentCount}</span> Comment
            </a>
          </p>
          <p className="font-normal text-sm text-black/50 leading-[1.2] m-0">
            <span className="text-[#212121]">{post.shareCount}</span> Share
          </p>
        </div>
      </div>

      {/* Reactions Bar */}
      <div className="bg-[#FBFCFD] p-2 flex items-center mb-0 border-t border-b border-[#E8E8E8]">
        {/* Haha button */}
        <button
          onClick={() => setLiked(!liked)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 bg-transparent border-0 transition-all duration-200 rounded-[6px] hover:bg-[#e4f1fd] ${liked ? "bg-[#e4f1fd] text-[#1890FF]" : "text-black"}`}
        >
          <span className="flex items-center text-sm font-normal leading-[21px]">
            <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 19 19">
              <path fill="#FFCC4D" d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z" />
              <path fill="#664500" d="M9.5 11.083c-1.912 0-3.181-.222-4.75-.527-.358-.07-1.056 0-1.056 1.055 0 2.111 2.425 4.75 5.806 4.75 3.38 0 5.805-2.639 5.805-4.75 0-1.055-.697-1.125-1.055-1.055-1.57.305-2.838.527-4.75.527z" />
              <path fill="#fff" d="M4.75 11.611s1.583.528 4.75.528 4.75-.528 4.75-.528-1.056 2.111-4.75 2.111-4.75-2.11-4.75-2.11z" />
              <path fill="#664500" d="M6.333 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847zM12.667 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847z" />
            </svg>
            Haha
          </span>
        </button>

        {/* Comment button */}
        <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-transparent border-0 transition-all duration-200 rounded-[6px] hover:bg-[#e4f1fd] text-black">
          <span className="flex items-center text-sm font-normal leading-[21px]">
            <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="none" viewBox="0 0 21 21">
              <path stroke="#000" d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z" />
              <path stroke="#000" strokeLinecap="round" strokeLinejoin="round" d="M6.938 9.313h7.125M10.5 14.063h3.563" />
            </svg>
            Comment
          </span>
        </button>

        {/* Share button */}
        <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-transparent border-0 transition-all duration-200 rounded-[6px] hover:bg-[#e4f1fd] text-black">
          <span className="flex items-center text-sm font-normal leading-[21px]">
            <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="21" fill="none" viewBox="0 0 24 21">
              <path stroke="#000" strokeLinejoin="round" d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z" />
            </svg>
            Share
          </span>
        </button>
      </div>

      {/* Comment Area */}
      <div className="px-6 pt-6 pb-2.5">
        {/* Write comment input */}
        <div className="bg-[#F6F6F6] rounded-[18px] px-[9px] py-1">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!commentText.trim()) return;
              setComments([
                ...comments,
                {
                  id: String(Date.now()),
                  authorName: "Dylan Field",
                  authorImg: "/assets/images/comment_img.png",
                  text: commentText,
                  time: "1s",
                  likes: 0,
                  replies: [],
                },
              ]);
              setCommentText("");
            }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center w-full flex-1">
              <div className="mr-2 flex-shrink-0">
                <img src="/assets/images/comment_img.png" alt="User" style={{ maxWidth: "26px" }} />
              </div>
              <div className="w-full relative">
                <textarea
                  className="bg-transparent w-full border-0 p-2 text-xs text-[#212121] placeholder-black/50 focus:outline-none focus:ring-0 focus:box-shadow-none"
                  style={{ height: "40px", resize: "none" }}
                  placeholder="Write a comment"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center flex-shrink-0">
              <button type="button" className="border-0 bg-transparent mx-1 p-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                  <path fill="#000" fillOpacity=".46" fillRule="evenodd" d="M13.167 6.534a.5.5 0 01.5.5c0 3.061-2.35 5.582-5.333 5.837V14.5a.5.5 0 01-1 0v-1.629C4.35 12.616 2 10.096 2 7.034a.5.5 0 011 0c0 2.679 2.168 4.859 4.833 4.859 2.666 0 4.834-2.18 4.834-4.86a.5.5 0 01.5-.5zM7.833.667a3.218 3.218 0 013.208 3.22v3.126c0 1.775-1.439 3.22-3.208 3.22a3.218 3.218 0 01-3.208-3.22V3.887c0-1.776 1.44-3.22 3.208-3.22zm0 1a2.217 2.217 0 00-2.208 2.22v3.126c0 1.223.991 2.22 2.208 2.22a2.217 2.217 0 002.208-2.22V3.887c0-1.224-.99-2.22-2.208-2.22z" clipRule="evenodd" />
                </svg>
              </button>
              <button type="button" className="border-0 bg-transparent mx-1 p-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                  <path fill="#000" fillOpacity=".46" fillRule="evenodd" d="M10.867 1.333c2.257 0 3.774 1.581 3.774 3.933v5.435c0 2.352-1.517 3.932-3.774 3.932H5.101c-2.254 0-3.767-1.58-3.767-3.932V5.266c0-2.352 1.513-3.933 3.767-3.933h5.766zm0 1H5.101c-1.681 0-2.767 1.152-2.767 2.933v5.435c0 1.782 1.086 2.932 2.767 2.932h5.766c1.685 0 2.774-1.15 2.774-2.932V5.266c0-1.781-1.089-2.933-2.774-2.933zm.426 5.733l.017.015.013.013.009.008.037.037c.12.12.453.46 1.443 1.477a.5.5 0 11-.716.697S10.73 8.91 10.633 8.816a.614.614 0 00-.433-.118.622.622 0 00-.421.225c-1.55 1.88-1.568 1.897-1.594 1.922a1.456 1.456 0 01-2.057-.021s-.62-.63-.63-.642c-.155-.143-.43-.134-.594.04l-1.02 1.076a.498.498 0 01-.707.018.499.499 0 01-.018-.706l1.018-1.075c.54-.573 1.45-.6 2.025-.06l.639.647c.178.18.467.184.646.008l1.519-1.843a1.618 1.618 0 011.098-.584c.433-.038.854.088 1.19.363zM5.706 4.42c.921 0 1.67.75 1.67 1.67 0 .92-.75 1.67-1.67 1.67-.92 0-1.67-.75-1.67-1.67 0-.921.75-1.67 1.67-1.67zm0 1a.67.67 0 10.001 1.34.67.67 0 00-.002-1.34z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Timeline Comments Block */}
      <div className="flex flex-col gap-4">
        {/* Previous Comments */}
        <div className="px-6 flex">
          <button type="button" className="text-[#1890FF] bg-transparent border-0 hover:underline text-xs font-normal">
            View 4 previous comments
          </button>
        </div>

        {/* Comments Listing */}
        {comments.map((comment) => {
          const isReplyVisible = replyInputVisible[comment.id] || false;

          return (
            <div key={comment.id} className="flex px-6 mt-2 items-start">
              {/* Comment avatar image */}
              <div className="mr-3 flex-shrink-0">
                <a href="profile.html" className="block">
                  <img src={comment.authorImg} alt="" className="rounded-full object-cover" style={{ width: "40px", height: "40px" }} />
                </a>
              </div>

              {/* Comment details area */}
              <div className="flex-grow">
                <div className="relative bg-[#F6F6F6] rounded-[18px] p-3 pt-2 pb-4">
                  {/* Author Name */}
                  <div className="mb-1">
                    <a href="profile.html">
                      <h4 className="font-medium text-sm text-[#212121] m-0 hover:underline">{comment.authorName}</h4>
                    </a>
                  </div>
                  {/* Status text */}
                  <div className="mb-2">
                    <p className="text-xs text-[#767676] leading-relaxed m-0">{comment.text}</p>
                  </div>
                  {/* Reaction badge inside comment */}
                  {comment.likes > 0 && (
                    <div
                      className="absolute -bottom-3 right-4 bg-white border border-[#E8E8E8] shadow-sm rounded-full flex items-center justify-between gap-1 p-1 px-2"
                      style={{ zIndex: 10 }}
                    >
                      <div className="flex items-center">
                        <span className="mr-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#1890FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                          </svg>
                        </span>
                        <span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                        </span>
                      </div>
                      <span className="text-[10px] text-[#212121] font-medium leading-none">{comment.likes}</span>
                    </div>
                  )}
                </div>

                {/* Reply action list */}
                <div className="mt-1 ml-2">
                  <ul className="flex items-center gap-3 list-none p-0 m-0">
                    <li><button className="text-[#666] hover:text-[#1890FF] font-semibold text-[11px] leading-[1.2] bg-transparent border-0 p-0" type="button">Like.</button></li>
                    <li>
                      <button
                        onClick={() => {
                          setReplyInputVisible({
                            ...replyInputVisible,
                            [comment.id]: !isReplyVisible,
                          });
                        }}
                        className="text-[#666] hover:text-[#1890FF] font-semibold text-[11px] leading-[1.2] bg-transparent border-0 p-0"
                        type="button"
                      >
                        Reply.
                      </button>
                    </li>
                    <li><button className="text-[#666] hover:text-[#1890FF] font-semibold text-[11px] leading-[1.2] bg-transparent border-0 p-0" type="button">Share</button></li>
                    <li><span className="text-[#666] text-[11px] font-normal leading-[1.2]">.{comment.time}</span></li>
                  </ul>
                </div>

                {/* Indented Sub-replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 ml-4 flex flex-col gap-4">
                    {comment.replies.map((rep) => (
                      <div key={rep.id} className="flex items-start">
                        <div className="mr-3 flex-shrink-0">
                          <img src={rep.authorImg} alt="" className="rounded-full object-cover" style={{ width: "30px", height: "30px" }} />
                        </div>
                        <div>
                          <div className="bg-[#F6F6F6] rounded-[18px] p-2.5 px-3">
                            <h4 className="font-semibold text-xs text-[#212121] m-0 mb-0.5">{rep.authorName}</h4>
                            <p className="text-xs text-[#767676] leading-relaxed m-0">{rep.text}</p>
                          </div>
                          <div className="mt-1 ml-1.5">
                            <ul className="flex items-center gap-2.5 list-none p-0 m-0">
                              <li><button className="text-[#666] hover:text-[#1890FF] font-semibold text-[10px] bg-transparent border-0 p-0" type="button">Like.</button></li>
                              <li><button className="text-[#666] hover:text-[#1890FF] font-semibold text-[10px] bg-transparent border-0 p-0" type="button">Reply.</button></li>
                              <li><span className="text-[#666] text-[10px]">.{rep.time}</span></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Input Form nested directly inside comment details when Reply clicked */}
                {isReplyVisible && (
                  <div className="bg-[#F6F6F6] rounded-[18px] px-[9px] py-1 mt-4 ml-2">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const rText = nestedReplyText[comment.id] || "";
                        if (!rText.trim()) return;
                        const updated = comments.map((c) => {
                          if (c.id === comment.id) {
                            return {
                              ...c,
                              replies: [
                                ...(c.replies || []),
                                {
                                  id: String(Date.now()),
                                  authorName: "Dylan Field",
                                  authorImg: "/assets/images/comment_img.png",
                                  text: rText,
                                  time: "1s",
                                  likes: 0,
                                },
                              ],
                            };
                          }
                          return c;
                        });
                        setComments(updated);
                        setNestedReplyText({ ...nestedReplyText, [comment.id]: "" });
                      }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center w-full flex-1">
                        <div className="mr-2 flex-shrink-0">
                          <img src="/assets/images/comment_img.png" alt="User" style={{ maxWidth: "26px" }} />
                        </div>
                        <div className="w-full relative">
                          <textarea
                            className="bg-transparent w-full border-0 p-2 text-xs text-[#212121] placeholder-black/50 focus:outline-none focus:ring-0 focus:box-shadow-none"
                            style={{ height: "40px", resize: "none" }}
                            placeholder="Write a comment"
                            value={nestedReplyText[comment.id] || ""}
                            onChange={(e) => setNestedReplyText({ ...nestedReplyText, [comment.id]: e.target.value })}
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
