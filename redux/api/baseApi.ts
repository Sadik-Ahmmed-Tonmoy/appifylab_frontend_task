/* eslint-disable @typescript-eslint/no-explicit-any */
import { RootState } from "../store";
import { getSession } from "next-auth/react";
import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { setUser, logout } from "../features/auth/authSlice"; // 👈 import

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  // credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.access_token;
    headers.set("accept", "application/json");
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithRetry: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
console.log("object");
  if (result.error?.status === 401) {
    const session = await getSession();

    if (!session || (session as any).error === "RefreshTokenError") {
      api.dispatch(logout());
      return result;
    }

    const freshToken = (session as any).accessToken;

    api.dispatch(
      setUser({
        user: (session as any).user,
        access_token: freshToken,
      }),
    );

    const argsWithFreshToken =
      typeof args === "string"
        ? {
            url: args,
            headers: { authorization: `Bearer ${freshToken}` },
          }
        : {
            ...args,
            headers: {
              ...(args.headers as any),
              authorization: `Bearer ${freshToken}`,
            },
          };

    result = await baseQuery(argsWithFreshToken, api, extraOptions);
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRetry,
  tagTypes: ["user", "example", "posts"],
  endpoints: () => ({}),
});
