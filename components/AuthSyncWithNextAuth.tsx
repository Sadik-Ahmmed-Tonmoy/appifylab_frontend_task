/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { logout, setUser } from "@/redux/features/auth/authSlice";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useAppDispatch } from "../redux/hooks";

export default function AuthSyncWithNextAuth({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (status === "authenticated" && session) {
      if ((session as any).error === "RefreshTokenError") {
        console.warn("Refresh token invalid – signing out");
        dispatch(logout());
        signOut({ callbackUrl: "/auth/login" });
        return;
      }

      const user = (session as any).user;
      const accessToken = (session as any).accessToken;

      // FIX: removed console.log of accessToken/refreshToken (security leak)

      if (user?.id) {
        dispatch(
          setUser({
            user,
            access_token: accessToken,
          })
        );
      } else {
        console.warn("No user data in session – clearing Redux");
        dispatch(logout());
      }
    } else if (status === "unauthenticated") {
      dispatch(logout());
    }
  }, [session, status, dispatch]);

  return <>{children}</>;
}