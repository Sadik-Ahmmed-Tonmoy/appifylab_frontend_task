/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useGetMeQuery } from "@/redux/features/auth/authApi";
import { useGetPostsPaginatedQuery } from "@/redux/features/post/postApi";
import CreatePost from "./_components/CreatePost";
import DarkModeToggle from "./_components/DarkModeToggle";
import LeftSidebar from "./_components/LeftSidebar";
import Navbar from "./_components/Navbar";
import PostCard from "./_components/PostCard";
import PostSkeleton from "./_components/PostSkeleton";
import RightSidebar from "./_components/RightSidebar";
import StoryCard from "./_components/StoryCard";

const LIMIT = 10;

export default function DashboardPage() {
  const { data: session } = useSession();
  const [darkMode, setDarkMode] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  // ── Pagination state ─────────────────────────────────────────────────────
  const [page, setPage] = useState(1);

  // ── Ref-based post accumulator (avoids setState inside effect body) ───────
  const accumulatedPostsRef = useRef<any[]>([]);
  const [allPosts, setAllPosts] = useState<any[]>([]);

  // ── Sentinel ref for IntersectionObserver ────────────────────────────────
  const sentinelRef = useRef<HTMLDivElement>(null);

  // ── RTK Query ────────────────────────────────────────────────────────────
  const {
    data,
    isLoading,
    isFetching,
    error: postsError,
    refetch,
  } = useGetPostsPaginatedQuery({ page, limit: LIMIT }, { skip: !session });

  const { data: meData } = useGetMeQuery(undefined, {
    skip: !session,
  });

  // ── Accumulate posts on each page response ───────────────────────────────
  // We update the ref synchronously and only call setAllPosts once per data
  // change, which avoids the "setState inside effect body" lint warning.
  // Derive hasMore from the latest query data — no extra state needed.
  const hasMore = data ? data.meta.page < data.meta.totalPages : true;

  useEffect(() => {
    if (!data) return;
    const incoming = data.posts ?? [];

    let next: any[];
    if (page === 1) {
      // Fresh load or after post creation — replace list
      next = incoming;
    } else {
      // Append new page, deduplicate by id
      const existingIds = new Set(
        accumulatedPostsRef.current.map((p: any) => p.id),
      );
      const unique = incoming.filter((p: any) => !existingIds.has(p.id));
      next = [...accumulatedPostsRef.current, ...unique];
    }

    accumulatedPostsRef.current = next;
    // Defer the state update so it is not synchronous inside the effect body.
    const id = setTimeout(() => setAllPosts(next), 0);
    return () => clearTimeout(id);
  }, [data, page]);

  // ── IntersectionObserver: load next page when sentinel is visible ─────────
  const loadNextPage = useCallback(() => {
    if (!isFetching && !isLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [isFetching, isLoading, hasMore]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadNextPage();
        }
      },
      { rootMargin: "200px" }, // start fetching 200px before sentinel enters viewport
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadNextPage]);

  // ── Refetch helper: resets to page 1 and refetches ───────────────────────
  const handleRefetch = useCallback(() => {
    // Clear the accumulator ref so the effect replaces (not appends) on next
    // page-1 response — but keep allPosts visible until new data arrives to
    // avoid a flash of empty content.
    accumulatedPostsRef.current = [];
    if (page === 1) {
      refetch();
    } else {
      setPage(1);
    }
  }, [page, refetch]);

  // ── Derived user info ────────────────────────────────────────────────────
  const error = postsError
    ? (postsError as any).data?.message || "Failed to load posts"
    : null;

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

  // ── Determine UI states ───────────────────────────────────────────────────
  const isInitialLoad = isLoading && page === 1;
  const isFetchingMore = isFetching && page > 1;

  return (
    <div
      className={`_layout _layout_main_wrapper ${darkMode ? "_dark_wrapper" : ""}`}
    >
      {/* Dark Mode Toggle */}
      <DarkModeToggle
        darkMode={darkMode}
        onToggle={() => setDarkMode(!darkMode)}
      />

      <div className="_main_layout">
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

              {/* Middle Feed */}
              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <div className="_layout_middle_wrap">
                  <div className="_layout_middle_inner">
                    <StoryCard darkMode={darkMode} />

                    <CreatePost
                      darkMode={darkMode}
                      userAvatar={userAvatar}
                      onPostCreated={handleRefetch}
                      onLoadingChange={setIsPosting}
                    />

                    {/* Skeleton shown while a new post is being submitted */}
                    {isPosting && (
                      <PostSkeleton darkMode={darkMode} count={1} />
                    )}

                  
                    {/* Initial loading skeleton */}
                    {isInitialLoad && (
                      <PostSkeleton darkMode={darkMode} count={3} />
                    )}

                    {/* Error state */}
                    {error && (
                      <div
                        className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16"
                        style={{ textAlign: "center", padding: "2rem" }}
                      >
                        <p style={{ color: "red", opacity: 0.7 }}>{error}</p>
                        <button
                          onClick={handleRefetch}
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

                    {/* Empty state */}
                    {!isInitialLoad && !error && allPosts.length === 0 && (
                      <div
                        className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16"
                        style={{ textAlign: "center", padding: "2rem" }}
                      >
                        <p style={{ opacity: 0.5 }}>
                          No posts yet. Be the first to post!
                        </p>
                      </div>
                    )}

                    {/* Post list */}
                    {allPosts.map((post: any) => (
                      <PostCard
                        key={post.id}
                        darkMode={darkMode}
                        post={post}
                        currentUserId={currentUserId}
                        currentUserAvatar={userAvatar}
                        onUpdate={handleRefetch}
                      />
                    ))}

                    {/* Fetching-more skeleton (pagination) */}
                    {isFetchingMore && (
                      <PostSkeleton darkMode={darkMode} count={2} />
                    )}

                    {/* Sentinel element – IntersectionObserver watches this */}
                    <div ref={sentinelRef} style={{ height: "1px" }} />

                    {/* End-of-feed message */}
                    {!hasMore && allPosts.length > 0 && !isFetching && (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "1.5rem",
                          opacity: 0.4,
                          fontSize: "14px",
                        }}
                      >
                        — You&apos;re all caught up —
                      </div>
                    )}
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
