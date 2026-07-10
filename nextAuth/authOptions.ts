import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.NEXT_PUBLIC_FACEBOOK_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_FACEBOOK_SECRET as string,
    }),
    AppleProvider({
      clientId: process.env.NEXT_PUBLIC_APPLE_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_APPLE_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5016/api/v1";
          const res = await fetch(`${apiUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
              keepMeLogin: true,
            }),
          });
          const data = await res.json();
          if (res.ok && data.success) {
            // Return user with tokens
            return {
              id: data.data.user.id,
              email: data.data.user.email,
              role: data.data.user.role,
              accessToken: data.data.accessToken,
              refreshToken: data.data.refreshToken,
              fullName: data.data.user.userProfile?.fullName || "",
              firstName: data.data.user.userProfile?.firstName || "",
              lastName: data.data.user.userProfile?.lastName || "",
              avatarUrl: data.data.user.userProfile?.profileImage || "/assets/images/Avatar.png",
            } as any;
          }
          throw new Error(data.message || "Invalid credentials");
        } catch (err: any) {
          throw new Error(err.message || "Login failed");
        }
      }
    })
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
        token.id = user.id;
        token.role = (user as any).role;
        token.fullName = (user as any).fullName;
        token.avatarUrl = (user as any).avatarUrl;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session as any).accessToken = token.accessToken;
        (session as any).refreshToken = token.refreshToken;
        (session as any).user = {
          id: token.id,
          role: token.role,
          fullName: token.fullName,
          avatarUrl: token.avatarUrl,
        };
      }
      return session;
    }
  },
  secret: process.env.NEXT_PUBLIC_NEXT_AUTH_SECRET || "secret",
};
