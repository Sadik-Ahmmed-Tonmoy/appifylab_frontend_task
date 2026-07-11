/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useGetMeQuery } from "@/redux/features/auth/authApi";
import { useGetPostsQuery } from "@/redux/features/post/postApi";
import CreatePost from "./_components/CreatePost";
import DarkModeToggle from "./_components/DarkModeToggle";
import LeftSidebar from "./_components/LeftSidebar";
import Navbar from "./_components/Navbar";
import PostCard from "./_components/PostCard";
import PostSkeleton from "./_components/PostSkeleton";
import RightSidebar from "./_components/RightSidebar";
import StoryCard from "./_components/StoryCard";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [darkMode, setDarkMode] = useState(false);

  const {
    data: posts = [],
    isLoading: loading,
    error: postsError,
    refetch: refetchPosts,
  } = useGetPostsQuery(undefined, {
    skip: !session,
  });

  const { data: meData } = useGetMeQuery(undefined, {
    skip: !session,
  });

  const error = postsError
    ? (postsError as any).data?.message || "Failed to load posts"
    : null;

  // Prefer getMe data (live from server), fall back to NextAuth session
  const sessionUser = (session as any)?.user;
  const meUser = (meData as any)?.data?.user ?? (meData as any)?.data;

  const currentUserId = meUser?.id || sessionUser?.id;
  const userName =
    meUser?.userProfile?.fullName ||
    `${meUser?.userProfile?.firstName || ""} ${meUser?.userProfile?.lastName || ""}`.trim() ||
    sessionUser?.fullName ||
    `${sessionUser?.firstName || ""} ${sessionUser?.lastName || ""}`.trim() ||
    "User";
  const userAvatar =
    meUser?.userProfile?.profileImage ||
    sessionUser?.avatarUrl ||
    "/assets/images/Avatar.png";

  return (
    <div
      className={`_layout _layout_main_wrapper ${darkMode ? "_dark_wrapper" : ""}`}
    >
      {/* Switching Btn */}
      <DarkModeToggle
        darkMode={darkMode}
        onToggle={() => setDarkMode(!darkMode)}
      />

      <div className="_main_layout ">
        {/* Navbar */}
        <Navbar userName={userName} userAvatar={userAvatar} />

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

                    <CreatePost
                      darkMode={darkMode}
                      userAvatar={userAvatar}
                      onPostCreated={refetchPosts}
                    />

                    {loading && <PostSkeleton darkMode={darkMode} />}

                    {error && (
                      <div
                        className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16"
                        style={{ textAlign: "center", padding: "2rem" }}
                      >
                        <p style={{ color: "red", opacity: 0.7 }}>{error}</p>
                        <button
                          onClick={refetchPosts}
                          style={{
                            marginTop: "1rem",
                            padding: "0.5rem 1rem",
                            cursor: "pointer",
                          }}
                        >
                          Retry
                        </button>
                      </div>
                    )}

                    {!loading && !error && posts.length === 0 && (
                      <div
                        className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16"
                        style={{ textAlign: "center", padding: "2rem" }}
                      >
                        <p style={{ opacity: 0.5 }}>
                          No posts yet. Be the first to post!
                        </p>
                      </div>
                    )}

                    {!loading &&
                      posts.map((post: any) => (
                        <PostCard
                          key={post.id}
                          darkMode={darkMode}
                          post={post}
                          currentUserId={currentUserId}
                          currentUserAvatar={userAvatar}
                          onUpdate={refetchPosts}
                        />
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
