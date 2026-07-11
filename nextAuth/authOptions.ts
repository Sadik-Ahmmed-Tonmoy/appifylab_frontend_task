/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { getExpiryFromToken } from "@/lib/jwt-helpers";
import { verifyToken } from "@/utils/verifyToken";
import { JwtPayload } from "jwt-decode";
import { JWT } from "next-auth/jwt"; // 👈 import JWT type
import { signOut } from "next-auth/react";

interface DecodedUser extends JwtPayload {
  id?: string;
  email?: string;
  role?: string;
  exp?: number;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    ...(process.env.GOOGLE_ID && process.env.GOOGLE_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,
          }),
        ]
      : []),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const apiUrl =
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:5016/api/v1";
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
            const accessToken = data.data.accessToken;
            const decodedUser = verifyToken(accessToken) as DecodedUser | null;

            let accessTokenExpires: number;
            if (decodedUser?.exp) {
              accessTokenExpires = decodedUser.exp * 1000;
            } else {
              console.warn("JWT missing exp claim – using default 1 hour");
              accessTokenExpires = Date.now() + 60 * 60 * 1000;
            }

            return {
              id: data.data.user.id,
              email: data.data.user.email,
              role: data.data.user.role,
              accessToken,
              refreshToken: data.data.refreshToken,
              accessTokenExpires,
              decodedUser, // stored as a property, never spread
            } as any;
          }
          throw new Error(data.message || "Invalid credentials");
        } catch (err: any) {
          throw new Error(err.message || "Login failed");
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    // ✅ Explicit return type to satisfy TypeScript
    async jwt({ token, user, account, profile }): Promise<JWT> {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
        token.accessTokenExpires = (user as any).accessTokenExpires;
        token.id = user.id;
        token.email = user.email;
        token.role = (user as any).role;
        token.decodedUser = (user as any).decodedUser || null;
      }

      if (account?.provider === "google" && profile) {
        try {
          const apiUrl =
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:5016/api/v1";
          const res = await fetch(`${apiUrl}/auth/google-login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: profile.email,
              name: (profile as any).name,
              image: (profile as any).picture,
            }),
          });
          const data = await res.json();
          if (res.ok && data.success) {
            const accessToken = data.data.accessToken;
            const decodedUser = verifyToken(accessToken) as DecodedUser | null;
            let accessTokenExpires: number;
            if (decodedUser?.exp) {
              accessTokenExpires = decodedUser.exp * 1000;
            } else {
              accessTokenExpires = Date.now() + 60 * 60 * 1000;
            }
            token.accessToken = accessToken;
            token.refreshToken = data.data.refreshToken;
            token.accessTokenExpires = accessTokenExpires;
            token.id = data.data.user.id;
            token.email = data.data.user.email;
            token.role = data.data.user.role;
            token.decodedUser = decodedUser || null;
          }
        } catch (e) {
          console.error("Google login backend error:", e);
        }
      }

      // Refresh logic – check if expired
      const isExpired = Date.now() > (token.accessTokenExpires as number);
      if (!isExpired) {
        return token;
      }

      if (token.refreshToken) {
        try {
          const apiUrl =
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:5016/api/v1";
          const response = await fetch(`${apiUrl}/refresh-token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token.refreshToken}`,
            },
          });
          const data = await response.json();
          if (response.ok && data.success) {
            const newAccessToken = data.data.accessToken;
            const expMs = getExpiryFromToken(newAccessToken);
            if (expMs !== null) {
              token.accessTokenExpires = expMs;
            } else {
              token.accessTokenExpires = Date.now() + 60 * 60 * 1000;
            }
            token.accessToken = newAccessToken;

            const newDecoded = verifyToken(newAccessToken) as DecodedUser | null;
            if (newDecoded) {
              token.decodedUser = newDecoded;
              token.email = newDecoded.email || token.email;
              token.role = newDecoded.role || token.role;
            }
            console.log("✅ Token refreshed successfully");
            return token;
          } else {
            console.error("❌ Refresh token invalid, logging out");
            await signOut({ redirect: true, callbackUrl: "/auth/login" });
            return { ...token, error: "RefreshTokenError" };
          }
        } catch (error) {
          console.error("❌ Refresh network error:", error);
          return { ...token, error: "RefreshTokenError" };
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (!token) return session;
      if ((token as any).error === "RefreshTokenError") {
        return null as any;
      }

      (session as any).accessToken = token.accessToken;
      (session as any).refreshToken = token.refreshToken;

      const decoded = (token as any).decodedUser as DecodedUser | undefined;
      (session as any).user = {
        id: token.id || decoded?.id,
        email: token.email || decoded?.email,
        role: token.role || decoded?.role,
        ...(decoded || {}),
      };

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};