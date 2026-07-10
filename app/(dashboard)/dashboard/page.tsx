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

  return (
    <div className={`_layout _layout_main_wrapper ${darkMode ? '_dark_wrapper' : ''}`}>
      {/* Switching Btn */}
      <DarkModeToggle darkMode={darkMode} onToggle={() => setDarkMode(!darkMode)} />

      <div className="_main_layout ">
        {/* Navbar */}
        <Navbar />

        {/* Main Layout Structure */}
        <div className="container _custom_container">
          <div className="_layout_inner_wrap">
            <div className="row">
              {/* Left Sidebar */}
              <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                <div className="_layout_left_sidebar_wrap">
                  <LeftSidebar />
                </div>
              </div>

              {/* Middle */}
              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <div className="_layout_middle_wrap">
                  <div className="_layout_middle_inner">
                    <StoryCard darkMode={darkMode} />

                    <CreatePost darkMode={darkMode} />

                    {samplePosts.map((post) => (
                      <PostCard key={post.id} darkMode={darkMode} post={post} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                <div className="_layout_right_sidebar_wrap">
                  <RightSidebar />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}