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

  // ── Pagination ────────────────────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState<any[]>([]);

  // Refs that are always up-to-date (no stale-closure risk)
  const pageRef         = useRef(1);
  const hasMoreRef      = useRef(true);
  const isFetchingRef   = useRef(false);
  const loadedOnceRef   = useRef(false);   // true after first successful response
  const accumulatedRef  = useRef<any[]>([]); // running list of all posts

  // Sentinel for IntersectionObserver
  const sentinelRef = useRef<HTMLDivElement>(null);

  // ── RTK Query — one active query at a time ────────────────────────────────
  const {
    data,
    isLoading,
    isFetching,
    error: postsError,
    refetch,
  } = useGetPostsPaginatedQuery({ page, limit: LIMIT }, { skip: !session });

  const { data: meData } = useGetMeQuery(undefined, { skip: !session });

  // Keep refs in sync with latest render values (runs synchronously before effects)
  isFetchingRef.current = isFetching;
  if (data) {
    hasMoreRef.current  = data.meta.page < data.meta.totalPages;
    loadedOnceRef.current = true;
  }
  pageRef.current = page;

  // ── Accumulate posts whenever a new page arrives ──────────────────────────
  useEffect(() => {
    if (!data) return;

    const incoming = data.posts ?? [];

    if (data.meta.page === 1) {
      // Reset (fresh load or after post creation)
      accumulatedRef.current = incoming;
    } else {
      // Append unique posts only
      const seen = new Set(accumulatedRef.current.map((p: any) => p.id));
      const fresh = incoming.filter((p: any) => !seen.has(p.id));
      accumulatedRef.current = [...accumulatedRef.current, ...fresh];
    }

    setAllPosts([...accumulatedRef.current]);
  }, [data]);

  // ── Core trigger: increment page if guards pass ───────────────────────────
  const tryLoadNext = useCallback(() => {
    if (!loadedOnceRef.current) return;   // no data yet
    if (isFetchingRef.current)   return;   // already in flight
    if (!hasMoreRef.current)     return;   // no more pages
    setPage((prev) => {
      const next = prev + 1;
      pageRef.current = next;
      return next;
    });
  }, []); // stable — reads only refs, never stale

  // ── IntersectionObserver ──────────────────────────────────────────────────
  // Re-creates the observer when the list of posts changes.
  // This ensures the browser performs a fresh intersection check after the DOM
  // has updated with the new posts. If the sentinel is still visible, it
  // triggers the next page. If it has been pushed out of view, it stops.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const rootEl = document.querySelector("._layout_middle_wrap");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          tryLoadNext();
        }
      },
      { 
        root: rootEl, 
        rootMargin: "1500px", 
        threshold: 0 
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [allPosts.length, tryLoadNext]);

  // ── Refresh helper (used by CreatePost & PostCard) ────────────────────────
  const handleRefetch = useCallback(() => {
    accumulatedRef.current = [];
    loadedOnceRef.current  = false;
    hasMoreRef.current     = true;
    if (page === 1) {
      refetch();
    } else {
      setPage(1);
      pageRef.current = 1;
    }
  }, [page, refetch]);

  // ── Derived values ────────────────────────────────────────────────────────
  const error = postsError
    ? (postsError as any).data?.message || "Failed to load posts"
    : null;

  const sessionUser = (session as any)?.user;
  const meUser      = (meData as any)?.data?.user ?? (meData as any)?.data;

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

  const isInitialLoad  = isLoading && !data;
  const isFetchingMore = isFetching && !!data;
  const hasMore        = hasMoreRef.current;

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

                    {/* Posting skeleton */}
                    {isPosting && (
                      <PostSkeleton darkMode={darkMode} count={1} />
                    )}

                    {/* Initial load skeleton */}
                    {isInitialLoad && (
                      <PostSkeleton darkMode={darkMode} count={3} />
                    )}

                    {/* Error */}
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

                    {/* Loading-more skeleton */}
                    {isFetchingMore && (
                      <PostSkeleton darkMode={darkMode} count={2} />
                    )}

                    {/* Sentinel — IntersectionObserver watches this */}
                    <div ref={sentinelRef} style={{ height: "1px" }} />

                    {/* End of feed */}
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
