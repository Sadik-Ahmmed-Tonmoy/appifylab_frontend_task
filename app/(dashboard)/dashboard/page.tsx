/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { fetchWithAuth } from "@/lib/api";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import CreatePost from "./_components/CreatePost";
import DarkModeToggle from "./_components/DarkModeToggle";
import LeftSidebar from "./_components/LeftSidebar";
import Navbar from "./_components/Navbar";
import PostCard from "./_components/PostCard";
import RightSidebar from "./_components/RightSidebar";
import StoryCard from "./_components/StoryCard";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [darkMode, setDarkMode] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchWithAuth("/posts");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to load posts");
      }
      const data = await res.json();
      setPosts(data.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session) {
      fetchPosts();
    }
  }, [session, fetchPosts]);

  const currentUser = (session as any)?.user;
  const userName =
    currentUser?.fullName ||
    `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim() ||
    "Dylan Field";
  const userAvatar = currentUser?.avatarUrl || "/assets/images/Avatar.png";
  const currentUserId = currentUser?.id;

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
                      onPostCreated={fetchPosts}
                    />

                    {loading && (
                      <div
                        className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16"
                        style={{ textAlign: "center", padding: "2rem" }}
                      >
                        <p style={{ opacity: 0.5 }}>Loading posts...</p>
                      </div>
                    )}

                    {error && (
                      <div
                        className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16"
                        style={{ textAlign: "center", padding: "2rem" }}
                      >
                        <p style={{ color: "red", opacity: 0.7 }}>{error}</p>
                        <button
                          onClick={fetchPosts}
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
                      posts.map((post) => (
                        <PostCard
                          key={post.id}
                          darkMode={darkMode}
                          post={post}
                          currentUserId={currentUserId}
                          currentUserAvatar={userAvatar}
                          onUpdate={fetchPosts}
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
