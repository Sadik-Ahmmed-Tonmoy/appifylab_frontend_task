/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { getExpiryFromToken } from "@/lib/jwt-helpers";
import { verifyToken } from "@/utils/verifyToken";
import { JwtPayload } from "jwt-decode";

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

            // Decode the token to get user data + exp
            const decodedUser = verifyToken(accessToken) as DecodedUser | null;

            // Use `exp` from token (authoritative)
            let accessTokenExpires: number;
            if (decodedUser?.exp) {
              accessTokenExpires = decodedUser.exp * 1000; // seconds → ms
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
              decodedUser, // store full payload
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
    async jwt({ token, user, account, profile }) {
      // 1. Initial login – store everything
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
        token.accessTokenExpires = (user as any).accessTokenExpires;
        token.id = user.id;
        token.email = user.email;
        token.role = (user as any).role;
        token.decodedUser = (user as any).decodedUser; // ✅ FIX: uncommented
      }

      // 2. Google sign‑in
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
            token.decodedUser = decodedUser; // ✅ FIX: uncommented
          }
        } catch (e) {
          console.error("Google login backend error:", e);
        }
      }

      // 3. Refresh logic – if expired
      const isExpired = Date.now() > (token.accessTokenExpires as number);
      if (!isExpired) {
        return token;
      }

      console.log("isExpired", isExpired);
      console.log("token", token);

      if (token.refreshToken) {
        console.log("token.refreshToken", token.refreshToken);

        try {
          const apiUrl =
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:5016/api/v1";
          const response = await fetch(`${apiUrl}/auth/refresh-token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token.refreshToken}`,
            },
          });
          const data = await response.json();
          if (response.ok && data.success) {
            const newAccessToken = data.data.accessToken;

            console.log("newAccessToken", newAccessToken);

            const expMs = getExpiryFromToken(newAccessToken);

            console.log("expMs", expMs);

            if (expMs !== null) {
              token.accessTokenExpires = expMs;
            } else {
              token.accessTokenExpires = Date.now() + 60 * 60 * 1000;
            }
            token.accessToken = newAccessToken;

            // Update decodedUser from new token
            const newDecoded = verifyToken(newAccessToken) as DecodedUser | null;
            if (newDecoded) {
              token.decodedUser = newDecoded; // ✅ FIX: uncommented
              token.email = newDecoded.email || token.email;
              token.role = newDecoded.role || token.role;
            }
            console.log("✅ Token refreshed successfully");
            return token;
          } else {
            console.error("❌ Refresh token invalid, logging out");
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
      if ((token as any).error === "RefreshTokenError") {
        return null as any;
      }

      (session as any).accessToken = token.accessToken;
      (session as any).refreshToken = token.refreshToken;

      // Build session.user from the full decoded payload
      const decoded = (token as any).decodedUser as DecodedUser | undefined;
      (session as any).user = {
        id: token.id || decoded?.id,
        email: token.email || decoded?.email,
        role: token.role || decoded?.role,
        // Spread full decoded payload, but safely guard against undefined
        ...(decoded || {}), // ✅ FIX: safe spread
      };

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};