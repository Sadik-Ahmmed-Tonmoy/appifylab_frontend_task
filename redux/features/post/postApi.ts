/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../api/baseApi";

// ─── Endpoint definitions ─────────────────────────────────────────────────────
// postApi is declared first so patchAllPages (below) can reference
// postApi.util.updateQueryData — which knows about "getPostsPaginated".
// Using baseApi.util.updateQueryData would cause:
//   "Argument of type 'string' is not assignable to parameter of type 'never'"
// because baseApi has an empty endpoints block and TypeScript infers the
// endpoint-name parameter as `never`.

const postApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Get posts (paginated) ──────────────────────────────────────
    getPostsPaginated: builder.query<
      { posts: any[]; meta: { page: number; limit: number; total: number; totalPages: number } },
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => ({
        url: `posts?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      transformResponse: (res: any) => ({
        posts: res?.data ?? [],
        meta: res?.meta ?? { page: 1, limit: 10, total: 0, totalPages: 1 },
      }),
      providesTags: ["posts"],
    }),

    // ── Create post — still invalidates to refresh the full feed ───
    createPost: builder.mutation({
      query: (formData: FormData) => ({
        url: "posts",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["posts"],
    }),

    // ── Toggle post like — optimistic cache patch, no tag invalidation ──
    togglePostLike: builder.mutation<
      any,
      { postId: string; userId: string }
    >({
      query: ({ postId }) => ({
        url: `posts/${postId}/like`,
        method: "POST",
      }),
      onQueryStarted: async (
        { postId, userId },
        { dispatch, queryFulfilled, getState },
      ) => {
        const patches = patchAllPages(dispatch, getState, (draft) => {
          const post = draft.posts.find((p: any) => p.id === postId);
          if (!post) return;
          const idx = post.likes.findIndex((l: any) => l.userId === userId);
          if (idx >= 0) {
            post.likes.splice(idx, 1);
          } else {
            post.likes.push({ id: "tmp", userId, user: { id: userId } });
          }
        });
        try {
          await queryFulfilled;
        } catch {
          patches.forEach((p) => p.undo());
        }
      },
    }),

    // ── Create comment — insert returned comment into cache on success ──
    createComment: builder.mutation<
      any,
      { postId: string; text: string }
    >({
      query: ({ postId, text }) => ({
        url: `posts/${postId}/comments`,
        method: "POST",
        body: { text },
      }),
      onQueryStarted: async (
        { postId },
        { dispatch, queryFulfilled, getState },
      ) => {
        try {
          const { data: response } = await queryFulfilled;
          const newComment = response?.data ?? response;
          if (!newComment) return;
          patchAllPages(dispatch, getState, (draft) => {
            const post = draft.posts.find((p: any) => p.id === postId);
            if (!post) return;
            post.comments.push(newComment);
          });
        } catch {
          // nothing to undo — no optimistic insert
        }
      },
    }),

    // ── Toggle comment like — optimistic cache patch ───────────────
    toggleCommentLike: builder.mutation<
      any,
      { commentId: string; postId: string; userId: string }
    >({
      query: ({ commentId }) => ({
        url: `posts/comments/${commentId}/like`,
        method: "POST",
      }),
      onQueryStarted: async (
        { commentId, postId, userId },
        { dispatch, queryFulfilled, getState },
      ) => {
        const patches = patchAllPages(dispatch, getState, (draft) => {
          const post = draft.posts.find((p: any) => p.id === postId);
          if (!post) return;
          const comment = post.comments.find((c: any) => c.id === commentId);
          if (!comment) return;
          const idx = comment.likes.findIndex((l: any) => l.userId === userId);
          if (idx >= 0) {
            comment.likes.splice(idx, 1);
          } else {
            comment.likes.push({ id: "tmp", userId, user: { id: userId } });
          }
        });
        try {
          await queryFulfilled;
        } catch {
          patches.forEach((p) => p.undo());
        }
      },
    }),

    // ── Create reply — insert returned reply into cache on success ──
    createReply: builder.mutation<
      any,
      { commentId: string; postId: string; text: string }
    >({
      query: ({ commentId, text }) => ({
        url: `posts/comments/${commentId}/replies`,
        method: "POST",
        body: { text },
      }),
      onQueryStarted: async (
        { commentId, postId },
        { dispatch, queryFulfilled, getState },
      ) => {
        try {
          const { data: response } = await queryFulfilled;
          const newReply = response?.data ?? response;
          if (!newReply) return;
          patchAllPages(dispatch, getState, (draft) => {
            const post = draft.posts.find((p: any) => p.id === postId);
            if (!post) return;
            const comment = post.comments.find((c: any) => c.id === commentId);
            if (!comment) return;
            comment.replies.push(newReply);
          });
        } catch {
          // nothing to undo
        }
      },
    }),

    // ── Toggle reply like — optimistic cache patch ─────────────────
    toggleReplyLike: builder.mutation<
      any,
      { replyId: string; commentId: string; postId: string; userId: string }
    >({
      query: ({ replyId }) => ({
        url: `posts/replies/${replyId}/like`,
        method: "POST",
      }),
      onQueryStarted: async (
        { replyId, commentId, postId, userId },
        { dispatch, queryFulfilled, getState },
      ) => {
        const patches = patchAllPages(dispatch, getState, (draft) => {
          const post = draft.posts.find((p: any) => p.id === postId);
          if (!post) return;
          const comment = post.comments.find((c: any) => c.id === commentId);
          if (!comment) return;
          const reply = comment.replies.find((r: any) => r.id === replyId);
          if (!reply) return;
          const idx = reply.likes.findIndex((l: any) => l.userId === userId);
          if (idx >= 0) {
            reply.likes.splice(idx, 1);
          } else {
            reply.likes.push({ id: "tmp", userId, user: { id: userId } });
          }
        });
        try {
          await queryFulfilled;
        } catch {
          patches.forEach((p) => p.undo());
        }
      },
    }),
  }),
});

// ─── Cache-patch helper ───────────────────────────────────────────────────────
// Defined AFTER postApi so it can safely reference postApi.util.updateQueryData.
// This gives TypeScript full knowledge of the "getPostsPaginated" endpoint name,
// eliminating the `never` type error that occurs with baseApi.util.
const patchAllPages = (
  dispatch: any,
  getState: any,
  updater: (draft: any) => void,
) => {
  const queries: Record<string, any> =
    (getState() as any)["baseApi"]?.queries ?? {};

  return Object.keys(queries)
    .filter((key) => key.startsWith("getPostsPaginated("))
    .flatMap((key) => {
      const args = queries[key]?.originalArgs;
      if (!args) return [];
      return [
        dispatch(
          postApi.util.updateQueryData("getPostsPaginated", args, updater),
        ),
      ];
    });
};

export const {
  useGetPostsPaginatedQuery,
  useCreatePostMutation,
  useTogglePostLikeMutation,
  useCreateCommentMutation,
  useToggleCommentLikeMutation,
  useCreateReplyMutation,
  useToggleReplyLikeMutation,
} = postApi;
