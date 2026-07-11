/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../api/baseApi";

const postApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Get all posts ──────────────────────────────────────────────
    getPosts: builder.query({
      query: () => ({
        url: "posts",
        method: "GET",
      }),
      transformResponse: (res: any) => res?.data ?? [],
      providesTags: ["posts"],
    }),

    // ── Create post (multipart FormData) ──────────────────────────
    createPost: builder.mutation({
      query: (formData: FormData) => ({
        url: "posts",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["posts"],
    }),

    // ── Toggle post like ──────────────────────────────────────────
    togglePostLike: builder.mutation({
      query: (postId: string) => ({
        url: `posts/${postId}/like`,
        method: "POST",
      }),
      invalidatesTags: ["posts"],
    }),

    // ── Create comment ────────────────────────────────────────────
    createComment: builder.mutation({
      query: ({ postId, text }: { postId: string; text: string }) => ({
        url: `posts/${postId}/comments`,
        method: "POST",
        body: { text },
      }),
      invalidatesTags: ["posts"],
    }),

    // ── Toggle comment like ───────────────────────────────────────
    toggleCommentLike: builder.mutation({
      query: (commentId: string) => ({
        url: `posts/comments/${commentId}/like`,
        method: "POST",
      }),
      invalidatesTags: ["posts"],
    }),

    // ── Create reply ──────────────────────────────────────────────
    createReply: builder.mutation({
      query: ({ commentId, text }: { commentId: string; text: string }) => ({
        url: `posts/comments/${commentId}/replies`,
        method: "POST",
        body: { text },
      }),
      invalidatesTags: ["posts"],
    }),

    // ── Toggle reply like ─────────────────────────────────────────
    toggleReplyLike: builder.mutation({
      query: (replyId: string) => ({
        url: `posts/replies/${replyId}/like`,
        method: "POST",
      }),
      invalidatesTags: ["posts"],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useCreatePostMutation,
  useTogglePostLikeMutation,
  useCreateCommentMutation,
  useToggleCommentLikeMutation,
  useCreateReplyMutation,
  useToggleReplyLikeMutation,
} = postApi;
