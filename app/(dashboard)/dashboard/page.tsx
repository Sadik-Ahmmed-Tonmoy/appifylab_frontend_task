"use client";

import { useState } from "react";
import Navbar from "./_components/Navbar";
import LeftSidebar from "./_components/LeftSidebar";
import RightSidebar from "./_components/RightSidebar";
import StoryCard from "./_components/StoryCard";
import CreatePost from "./_components/CreatePost";
import PostCard from "./_components/PostCard";
import DarkModeToggle from "./_components/DarkModeToggle";

const samplePosts = [
  {
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
        replies: [],
      },
    ],
  },
  {
    id: "2",
    authorName: "Karim Saif",
    authorImg: "/assets/images/post_img.png",
    timeAgo: "5 minute ago",
    visibility: "Public",
    title: "-Healthy Tracking App",
    image: "/assets/images/timeline_img.png",
    reactionCount: 9,
    commentCount: 12,
    shareCount: 122,
    isLiked: false,
    comments: [
      {
        id: "c2",
        authorName: "Radovan SkillArena",
        authorImg: "/assets/images/txt_img.png",
        text: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
        time: "21m",
        likes: 198,
        isLiked: false,
        replies: [],
      },
    ],
  },
];

export default function DashboardPage() {
  const [darkMode, setDarkMode] = useState(false);

  const wrapperBg = darkMode ? "bg-[#0d0d1a]" : "bg-[#F0F2F5]";

  return (
    <div className={`h-screen w-full overflow-hidden font-[Poppins,sans-serif] ${wrapperBg} flex flex-col transition-colors duration-300`}>
      {/* Switching Btn */}
      <DarkModeToggle darkMode={darkMode} onToggle={() => setDarkMode(!darkMode)} />

      {/* Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <div className="w-full max-w-[1320px] mx-auto px-4 flex-1 overflow-hidden" style={{ paddingTop: "70px" }}>
        <div className="flex flex-wrap -mx-4 h-full">
          {/* Left Sidebar column - scrolls independently on desktop */}
          <div className="w-full lg:w-1/4 px-4 hidden lg:block h-full">
            <div
              className="flex flex-col pt-[18px] overflow-y-auto"
              style={{ height: "calc(100vh - 75px)" }}
            >
              <LeftSidebar darkMode={darkMode} />
            </div>
          </div>

          {/* Middle Column - scrolls independently */}
          <div className="w-full lg:w-1/2 px-4 h-full">
            <div
              className="flex flex-col pt-2.5 overflow-y-auto no-scrollbar"
              style={{
                height: "calc(100vh - 75px)",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {/* Stories */}
              <StoryCard darkMode={darkMode} />

              {/* Create Post */}
              <CreatePost darkMode={darkMode} />

              {/* Feed List */}
              {samplePosts.map((post) => (
                <PostCard key={post.id} darkMode={darkMode} post={post} />
              ))}
            </div>
          </div>

          {/* Right Sidebar column - scrolls independently on desktop */}
          <div className="w-full lg:w-1/4 px-4 hidden lg:block h-full">
            <div
              className="flex flex-col pt-[18px] overflow-y-auto"
              style={{ height: "calc(100vh - 75px)" }}
            >
              <RightSidebar darkMode={darkMode} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}