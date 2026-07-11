import { baseApi } from "../../api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => ({
        url: "auth/get-me",
        method: "GET",
      }),
      providesTags: ["user"],
    }),
  }),
});

export const {
  useGetMeQuery,
} = authApi;
